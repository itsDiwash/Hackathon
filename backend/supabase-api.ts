// ============================================================================
// SewaSathi — lib/supabase-api.ts
// Thin, typed wrapper around the Supabase client for the report lifecycle.
// ============================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  Report,
  ReportInsert,
  ReportMedia,
  ReportPriority,
  ReportStatus,
} from "./database.types";

// ----------------------------------------------------------------------------
// Client setup
// ----------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
  );
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

const EVIDENCE_BUCKET = "report-evidence";

// ----------------------------------------------------------------------------
// Shared error helper
// ----------------------------------------------------------------------------
export class SewaSathiApiError extends Error {
  cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "SewaSathiApiError";
    this.cause = cause;
  }
}

function unwrap<T>(data: T | null, error: unknown, fallbackMessage: string): T {
  if (error) throw new SewaSathiApiError(fallbackMessage, error);
  if (data === null) throw new SewaSathiApiError(`${fallbackMessage} (no data returned)`);
  return data;
}

// ----------------------------------------------------------------------------
// Types for function inputs
// ----------------------------------------------------------------------------
export type NewReportInput = Omit<
  ReportInsert,
  "id" | "tracking_id" | "status" | "created_at" | "updated_at" | "department_id"
>;

export interface AdminReportFilters {
  status?: ReportStatus;
  priority?: ReportPriority;
  departmentId?: string;
  categoryId?: string;
  wardNumber?: number;
  search?: string; // matches description / tracking_id
  page?: number; // 1-indexed
  pageSize?: number; // default 20
}

export interface ReportWithMedia extends Report {
  report_media: ReportMedia[];
}

// ----------------------------------------------------------------------------
// 1. submitReport — citizen creates a report, optionally with one photo
// ----------------------------------------------------------------------------
export async function submitReport(
  data: NewReportInput,
  imageUri?: File | Blob | null
): Promise<ReportWithMedia> {
  if (!data.user_id) {
    throw new SewaSathiApiError("submitReport requires an authenticated user_id.");
  }

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .insert(data)
    .select()
    .single();

  const insertedReport = unwrap(report, reportError, "Failed to submit report");

  if (!imageUri) {
    return { ...insertedReport, report_media: [] };
  }

  try {
    const extension = imageUri instanceof File ? imageUri.name.split(".").pop() : "jpg";
    const path = `${data.user_id}/${insertedReport.id}/${Date.now()}.${extension ?? "jpg"}`;

    const { error: uploadError } = await supabase.storage
      .from(EVIDENCE_BUCKET)
      .upload(path, imageUri, { upsert: false });

    if (uploadError) {
      throw new SewaSathiApiError("Report created, but evidence upload failed", uploadError);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(EVIDENCE_BUCKET).getPublicUrl(path);

    const { data: media, error: mediaError } = await supabase
      .from("report_media")
      .insert({
        report_id: insertedReport.id,
        media_url: publicUrl,
        media_type: "image",
      })
      .select()
      .single();

    const insertedMedia = unwrap(
      media,
      mediaError,
      "Report and upload succeeded, but saving the media record failed"
    );

    return { ...insertedReport, report_media: [insertedMedia] };
  } catch (err) {
    // Report already exists even if media attach failed — surface both facts.
    if (err instanceof SewaSathiApiError) throw err;
    throw new SewaSathiApiError("Report created, but attaching evidence failed", err);
  }
}

// ----------------------------------------------------------------------------
// 2. getReportByTrackingId — public tracking lookup (e.g. "SG-1024")
// ----------------------------------------------------------------------------
export async function getReportByTrackingId(
  trackingId: string
): Promise<ReportWithMedia | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("*, report_media(*)")
    .eq("tracking_id", trackingId.trim().toUpperCase())
    .maybeSingle();

  if (error) {
    throw new SewaSathiApiError(`Failed to look up report ${trackingId}`, error);
  }
  return data as ReportWithMedia | null;
}

// ----------------------------------------------------------------------------
// 3. getCitizenReports — a citizen's own submission history
// ----------------------------------------------------------------------------
export async function getCitizenReports(userId: string): Promise<ReportWithMedia[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*, report_media(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return unwrap(
    data as ReportWithMedia[] | null,
    error,
    `Failed to load reports for user ${userId}`
  );
}

// ----------------------------------------------------------------------------
// 4. getAllReportsForAdmin — filtered, paginated admin/staff dashboard feed
// ----------------------------------------------------------------------------
export async function getAllReportsForAdmin(
  filters: AdminReportFilters = {}
): Promise<{ reports: ReportWithMedia[]; total: number }> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("reports")
    .select("*, report_media(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.priority) query = query.eq("priority", filters.priority);
  if (filters.departmentId) query = query.eq("department_id", filters.departmentId);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.wardNumber !== undefined) query = query.eq("ward_number", filters.wardNumber);
  if (filters.search) {
    query = query.or(
      `description.ilike.%${filters.search}%,tracking_id.ilike.%${filters.search}%`
    );
  }

  const { data, error, count } = await query;

  const reports = unwrap(
    data as ReportWithMedia[] | null,
    error,
    "Failed to load admin report feed"
  );

  return { reports, total: count ?? reports.length };
}

// ----------------------------------------------------------------------------
// 5. updateReportStatus — admin/department_worker transitions a report
// ----------------------------------------------------------------------------
// Calls the `update_report_status` RPC, which atomically:
//   - verifies the caller's role server-side (defense in depth alongside RLS)
//   - updates `reports.status`
//   - writes a `status_logs` row (via trigger) with the given note
//
// `adminUserId` is accepted for caller-side bookkeeping/optimistic UI; the
// server derives the actual actor from the authenticated session (auth.uid()),
// so it does not need to be (and isn't) trusted as an input to the RPC.
export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  adminUserId: string,
  note?: string
): Promise<Report> {
  void adminUserId; // kept in the signature for caller-side context/logging

  const { data, error } = await supabase.rpc("update_report_status", {
    p_report_id: reportId,
    p_new_status: newStatus,
    p_note: note ?? null,
  });

  return unwrap(
    data as Report | null,
    error,
    `Failed to update status for report ${reportId}`
  );
}
