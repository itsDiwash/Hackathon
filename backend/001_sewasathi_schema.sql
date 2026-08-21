-- ============================================================================
-- SewaSathi — Civic Service Platform
-- Complete Supabase (PostgreSQL) Migration
-- Schema, Triggers, Sequences, RLS Policies, Storage, Seed Data
-- ============================================================================
-- Run this as a single migration (e.g. via `supabase migration new sewasathi_init`
-- and paste this in, or run directly in the SQL editor).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ----------------------------------------------------------------------------
create type public.user_role as enum ('citizen', 'admin', 'department_worker');
create type public.report_priority as enum ('low', 'medium', 'high', 'emergency');
create type public.report_status as enum (
  'submitted', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected'
);

-- ----------------------------------------------------------------------------
-- 2. TABLES
-- ----------------------------------------------------------------------------

-- 2.1 profiles ---------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  phone_number  text,
  role          public.user_role not null default 'citizen',
  created_at    timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth.users user; mirrors identity + app role.';

-- 2.2 departments -------------------------------------------------------------
create table public.departments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- 2.3 categories ----------------------------------------------------------------
create table public.categories (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null unique,
  default_department_id uuid references public.departments(id) on delete set null,
  created_at            timestamptz not null default now()
);

-- 2.4 reports -------------------------------------------------------------------
create table public.reports (
  id             uuid primary key default gen_random_uuid(),
  tracking_id    text not null unique,
  user_id        uuid references public.profiles(id) on delete set null,
  category_id    uuid references public.categories(id) on delete restrict,
  department_id  uuid references public.departments(id) on delete set null,
  priority       public.report_priority not null default 'medium',
  status         public.report_status not null default 'submitted',
  description    text not null check (char_length(description) > 0),
  ward_number    integer check (ward_number is null or ward_number > 0),
  address        text,
  latitude       double precision check (latitude between -90 and 90),
  longitude      double precision check (longitude between -180 and 180),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index reports_user_id_idx on public.reports(user_id);
create index reports_status_idx on public.reports(status);
create index reports_department_id_idx on public.reports(department_id);
create index reports_category_id_idx on public.reports(category_id);
create index reports_created_at_idx on public.reports(created_at desc);
create index reports_tracking_id_idx on public.reports(tracking_id);
-- Optional: geo lookups for map/feed views
create index reports_lat_lng_idx on public.reports(latitude, longitude);

-- 2.5 report_media ----------------------------------------------------------------
create table public.report_media (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references public.reports(id) on delete cascade,
  media_url   text not null,
  media_type  text not null default 'image',
  created_at  timestamptz not null default now()
);

create index report_media_report_id_idx on public.report_media(report_id);

-- 2.6 status_logs -------------------------------------------------------------------
create table public.status_logs (
  id               uuid primary key default gen_random_uuid(),
  report_id        uuid not null references public.reports(id) on delete cascade,
  previous_status  public.report_status,
  new_status       public.report_status not null,
  updated_by       uuid references public.profiles(id) on delete set null,
  note             text,
  created_at       timestamptz not null default now()
);

create index status_logs_report_id_idx on public.status_logs(report_id);

-- ----------------------------------------------------------------------------
-- 3. SEQUENCES + TRACKING ID TRIGGER
-- ----------------------------------------------------------------------------
create sequence public.tracking_id_seq start 1024;

create or replace function public.set_tracking_id()
returns trigger
language plpgsql
as $$
begin
  if new.tracking_id is null or new.tracking_id = '' then
    new.tracking_id := 'SG-' || nextval('public.tracking_id_seq')::text;
  end if;
  return new;
end;
$$;

create trigger trg_set_tracking_id
before insert on public.reports
for each row
execute function public.set_tracking_id();

-- ----------------------------------------------------------------------------
-- 4. STATUS LOG TRIGGER (+ updated_at maintenance)
-- ----------------------------------------------------------------------------
-- Note: the note field is populated from a transaction-local GUC
-- (`app.status_change_note`) set by the `update_report_status` RPC below.
-- This lets a single client call both change the status and attach a note
-- atomically, while direct/ad-hoc updates still get logged (with note = null).
create or replace function public.log_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.status_logs (report_id, previous_status, new_status, updated_by, note)
    values (new.id, null, new.status, auth.uid(), nullif(current_setting('app.status_change_note', true), ''));
  elsif (tg_op = 'UPDATE') then
    new.updated_at := now();
    if new.status is distinct from old.status then
      insert into public.status_logs (report_id, previous_status, new_status, updated_by, note)
      values (new.id, old.status, new.status, auth.uid(), nullif(current_setting('app.status_change_note', true), ''));
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_log_status_change
before insert or update on public.reports
for each row
execute function public.log_status_change();

-- ----------------------------------------------------------------------------
-- 5. PROFILE CREATION SYNC (auth.users -> public.profiles)
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone_number, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'citizen')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_handle_new_user
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 6. HELPER FUNCTION: current user's role (avoids recursive RLS on profiles)
-- ----------------------------------------------------------------------------
create or replace function public.get_my_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ----------------------------------------------------------------------------
-- 7. RPC: update_report_status
--    Atomically sets status (+ optional note) with a server-side role check.
-- ----------------------------------------------------------------------------
create or replace function public.update_report_status(
  p_report_id  uuid,
  p_new_status public.report_status,
  p_note       text default null
)
returns public.reports
language plpgsql
security definer
set search_path = public
as $$
declare
  v_report public.reports;
begin
  if public.get_my_role() not in ('admin', 'department_worker') then
    raise exception 'Not authorized to update report status';
  end if;

  perform set_config('app.status_change_note', coalesce(p_note, ''), true);

  update public.reports
  set status = p_new_status
  where id = p_report_id
  returning * into v_report;

  if v_report.id is null then
    raise exception 'Report % not found', p_report_id;
  end if;

  return v_report;
end;
$$;

grant execute on function public.update_report_status(uuid, public.report_status, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.departments  enable row level security;
alter table public.categories   enable row level security;
alter table public.reports      enable row level security;
alter table public.report_media enable row level security;
alter table public.status_logs  enable row level security;

-- 8.1 profiles ------------------------------------------------------------------
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (auth.uid() = id or public.get_my_role() = 'admin');

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Citizens/workers may only edit their own contact info, never their own role.
-- Role changes are expected to happen via the Supabase service role / admin tooling.
revoke update on public.profiles from authenticated;
grant update (full_name, phone_number) on public.profiles to authenticated;

-- 8.2 departments (public read, admin-managed) -----------------------------------
create policy "departments_select_all"
on public.departments for select
to anon, authenticated
using (true);

create policy "departments_write_admin"
on public.departments for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

-- 8.3 categories (public read, admin-managed) --------------------------------------
create policy "categories_select_all"
on public.categories for select
to anon, authenticated
using (true);

create policy "categories_write_admin"
on public.categories for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

-- 8.4 reports -----------------------------------------------------------------------
-- Public feed/map: anyone can read.
create policy "reports_select_all"
on public.reports for select
to anon, authenticated
using (true);

-- Citizens can submit reports tied to their own user_id.
create policy "reports_insert_own"
on public.reports for insert
to authenticated
with check (auth.uid() = user_id);

-- Admins & department workers can update reports (column-restricted below).
create policy "reports_update_staff"
on public.reports for update
to authenticated
using (public.get_my_role() in ('admin', 'department_worker'))
with check (public.get_my_role() in ('admin', 'department_worker'));

-- Column-level grant: staff may only touch priority/status/department_id
-- via direct table updates. (The update_report_status RPC is the
-- recommended path for status changes since it also logs notes.)
revoke update on public.reports from authenticated;
grant update (priority, status, department_id) on public.reports to authenticated;

-- Admins may delete a report (e.g. spam/duplicate); citizens/workers may not.
create policy "reports_delete_admin"
on public.reports for delete
to authenticated
using (public.get_my_role() = 'admin');

-- 8.5 report_media ----------------------------------------------------------------
create policy "report_media_select_all"
on public.report_media for select
to anon, authenticated
using (true);

create policy "report_media_insert_owner_or_staff"
on public.report_media for insert
to authenticated
with check (
  exists (
    select 1 from public.reports r
    where r.id = report_media.report_id
      and (r.user_id = auth.uid() or public.get_my_role() in ('admin', 'department_worker'))
  )
);

create policy "report_media_delete_owner_or_staff"
on public.report_media for delete
to authenticated
using (
  exists (
    select 1 from public.reports r
    where r.id = report_media.report_id
      and (r.user_id = auth.uid() or public.get_my_role() in ('admin', 'department_worker'))
  )
);

-- 8.6 status_logs -------------------------------------------------------------------
-- Written exclusively by the SECURITY DEFINER trigger/RPC above, so no
-- direct INSERT policy is granted to end users; everyone can read the trail.
create policy "status_logs_select_all"
on public.status_logs for select
to anon, authenticated
using (true);

-- ----------------------------------------------------------------------------
-- 9. STORAGE: report-evidence bucket
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('report-evidence', 'report-evidence', true)
on conflict (id) do nothing;

-- Public read of evidence photos/videos.
create policy "report_evidence_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'report-evidence');

-- Authenticated users can upload, scoped to a folder matching their own
-- user id, e.g. `report-evidence/<user_id>/<filename>`.
create policy "report_evidence_authenticated_write"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'report-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "report_evidence_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'report-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- ----------------------------------------------------------------------------
-- 10. SEED DATA
-- ----------------------------------------------------------------------------
insert into public.departments (name) values
  ('Road Maintenance'),
  ('Waste Management'),
  ('Electrical Department'),
  ('Water Supply')
on conflict (name) do nothing;

insert into public.categories (name, default_department_id)
select 'Road Damage', id from public.departments where name = 'Road Maintenance'
on conflict (name) do nothing;

insert into public.categories (name, default_department_id)
select 'Streetlight', id from public.departments where name = 'Electrical Department'
on conflict (name) do nothing;

insert into public.categories (name, default_department_id)
select 'Garbage', id from public.departments where name = 'Waste Management'
on conflict (name) do nothing;

insert into public.categories (name, default_department_id)
select 'Water Leak', id from public.departments where name = 'Water Supply'
on conflict (name) do nothing;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
