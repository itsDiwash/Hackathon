import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  HardHat,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Share2,
  Check,
  Calendar,
  Phone,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { ReportStage, CivicReport } from '../types';
import { useReports } from '../context/ReportsContext';

interface TrackReportViewProps {
  onOpenReportIssue: () => void;
  onBackToMyReports?: () => void;
  initialReportId?: string | null;
}

const STAGES_ORDER: ReportStage[] = [
  'Submitted',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved',
];

export const TrackReportView: React.FC<TrackReportViewProps> = ({
  onOpenReportIssue,
  onBackToMyReports,
  initialReportId,
}) => {
  const { reports, getReportById, submitCitizenFeedback, selectedTrackId, setSelectedTrackId } = useReports();

  const [inputReportId, setInputReportId] = useState<string>(initialReportId || selectedTrackId || 'SS-1048');
  const [activeReport, setActiveReport] = useState<CivicReport | null>(null);
  const [notFoundQuery, setNotFoundQuery] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<'Yes' | 'No' | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync initial report
  useEffect(() => {
    const targetId = initialReportId || selectedTrackId || 'SS-1048';
    setInputReportId(targetId);
    const found = getReportById(targetId);
    if (found) {
      setActiveReport(found);
      setNotFoundQuery(null);
      setFeedbackGiven(found.citizenFeedback || null);
    } else {
      setActiveReport(reports[0] || null);
    }
  }, [initialReportId, selectedTrackId, reports]);

  const handleTrackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = inputReportId.trim().toUpperCase();
    if (!cleanId) return;

    const found = getReportById(cleanId);
    if (found) {
      setActiveReport(found);
      setSelectedTrackId(found.id);
      setNotFoundQuery(null);
      setFeedbackGiven(found.citizenFeedback || null);
    } else {
      setActiveReport(null);
      setNotFoundQuery(cleanId);
    }
  };

  const handleFeedback = (val: 'Yes' | 'No') => {
    if (!activeReport) return;
    setFeedbackGiven(val);
    submitCitizenFeedback(activeReport.id, val);
  };

  const handleCopyTrackLink = () => {
    if (activeReport) {
      navigator.clipboard.writeText(`https://sewasathi.gov.np/track/${activeReport.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getCurrentStageIndex = (stage: ReportStage) => {
    return STAGES_ORDER.indexOf(stage);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10" id="track-report-page">
      {/* Optional Back to My Reports Navigation */}
      {onBackToMyReports && (
        <div className="mb-4">
          <button
            onClick={onBackToMyReports}
            className="cursor-pointer inline-flex items-center gap-2 text-xs font-inter font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <span>← Back to My Reports</span>
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[#ff9e30] font-oswald text-xs uppercase tracking-widest font-bold mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-time Municipal Redressal Tracker</span>
        </div>
        <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
          TRACK YOUR REPORT
        </h1>
        <p className="font-inter text-sm sm:text-base text-white/80 mt-1 max-w-xl mx-auto">
          Enter your unique tracking token to inspect live field operations and dispatch milestones.
        </p>
      </div>

      {/* Track Search Box */}
      <div className="bg-white/10 border border-white/20 rounded-3xl p-4 sm:p-6 mb-8 shadow-xl backdrop-blur-md">
        <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              required
              value={inputReportId}
              onChange={(e) => setInputReportId(e.target.value)}
              placeholder="Enter Report ID (e.g. SS-1048)"
              className="w-full bg-black/30 border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 font-mono text-sm sm:text-base uppercase tracking-wider text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] focus:bg-black/40"
              id="track-report-id-input"
            />
          </div>

          <button
            type="submit"
            id="track-report-submit-btn"
            className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,158,48,0.3)] active:scale-95 shrink-0"
          >
            <span>TRACK REPORT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-oswald uppercase tracking-wider text-white/70 shrink-0">
            Sample Reports:
          </span>
          {reports.slice(0, 4).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setInputReportId(r.id);
                setActiveReport(r);
                setSelectedTrackId(r.id);
                setNotFoundQuery(null);
                setFeedbackGiven(r.citizenFeedback || null);
              }}
              className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 ${
                activeReport?.id === r.id
                  ? 'bg-[#ff9e30]/30 text-white border border-[#ff9e30] font-bold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/15'
              }`}
            >
              {r.id} ({r.category})
            </button>
          ))}
        </div>
      </div>

      {/* NOT FOUND STATE */}
      {notFoundQuery && !activeReport && (
        <div className="bg-white/10 border border-red-400/40 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-400/50 flex items-center justify-center mx-auto text-red-300">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-oswald text-2xl font-bold uppercase text-white tracking-wide">
            Report ID “{notFoundQuery}” Not Found
          </h3>
          <p className="font-inter text-xs sm:text-sm text-white/70 max-w-md mx-auto">
            Please verify your report token format (e.g. SS-1048) or lodge a new issue.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setInputReportId('SS-1048');
                const def = getReportById('SS-1048');
                if (def) setActiveReport(def);
                setNotFoundQuery(null);
              }}
              className="cursor-pointer px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-inter text-xs font-semibold transition-colors border border-white/20"
            >
              Load Demo Report (SS-1048)
            </button>
            <button
              onClick={onOpenReportIssue}
              className="cursor-pointer px-5 py-2.5 rounded-full bg-[#ff9e30] text-black font-inter text-xs font-bold uppercase transition-colors"
            >
              Report New Issue
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE REPORT TRACKING VIEW */}
      {activeReport && (
        <div className="space-y-6" id="report-detail-card">
          {/* Main Details Header Card */}
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#ff9e30]">
                    {activeReport.id}
                  </span>
                  <span className="text-xs font-inter font-bold px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white">
                    {activeReport.category}
                  </span>
                  <span
                    className={`text-xs font-inter font-bold px-3 py-1 rounded-full ${
                      activeReport.priority === 'High Priority'
                        ? 'bg-red-500/20 text-red-300 border border-red-400/40'
                        : activeReport.priority === 'Medium Priority'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                    }`}
                  >
                    ● {activeReport.priority}
                  </span>
                </div>

                <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mt-2">
                  {activeReport.title}
                </h2>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs font-inter text-white/70">
                  <span className="flex items-center gap-1.5 text-white/90">
                    <MapPin className="w-3.5 h-3.5 text-[#ff9e30]" />
                    <strong className="text-white">{activeReport.location}</strong> ({activeReport.ward})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reported on {activeReport.reportedAt}</span>
                  </span>
                </div>
              </div>

              {/* Share / Copy Tracking Link */}
              <button
                onClick={handleCopyTrackLink}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-inter border border-white/20 transition-colors"
                title="Share Tracking Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-emerald-300">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Track Link</span>
                  </>
                )}
              </button>
            </div>

            {/* ========================================================================= */}
            {/* VISUALLY STRONG PROGRESS TIMELINE: Submitted → Verified → Assigned → In Progress → Resolved */}
            {/* ========================================================================= */}
            <div className="py-8" id="redressal-progress-timeline">
              <span className="font-oswald text-xs uppercase tracking-widest text-[#ff9e30] font-bold block mb-4">
                Redressal Lifecycle Milestones
              </span>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                {STAGES_ORDER.map((stageName, idx) => {
                  const currentIdx = getCurrentStageIndex(activeReport.currentStage);
                  const isPassed = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  const isUpcoming = idx > currentIdx;

                  const timelineDetail = activeReport.timeline.find((t) => t.stage === stageName);

                  return (
                    <div
                      key={stageName}
                      className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[120px] ${
                        isCurrent
                          ? 'bg-[#ff9e30]/25 border-2 border-[#ff9e30] shadow-[0_0_20px_rgba(255,158,48,0.3)]'
                          : isPassed
                          ? 'bg-white/15 border-emerald-400/40 text-white'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <div>
                        {/* Status Icon Indicator */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-oswald text-xs font-bold ${
                              isCurrent
                                ? 'bg-[#ff9e30] text-black shadow-md'
                                : isPassed
                                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                                : 'bg-white/10 text-white/40 border border-white/10'
                            }`}
                          >
                            {isPassed ? '✓' : isCurrent ? '●' : '○'}
                          </span>

                          <span className="font-mono text-[10px] text-white/50 font-semibold">
                            0{idx + 1}
                          </span>
                        </div>

                        {/* Stage Name */}
                        <h4
                          className={`font-oswald text-sm font-bold uppercase tracking-wide ${
                            isCurrent
                              ? 'text-white'
                              : isPassed
                              ? 'text-white'
                              : 'text-white/40'
                          }`}
                        >
                          {stageName}
                        </h4>

                        {/* Note / Timestamp */}
                        <p className="font-inter text-[11px] text-white/70 mt-1 line-clamp-2">
                          {timelineDetail?.title || stageName}
                        </p>
                      </div>

                      {/* Timestamp Tag */}
                      <div className="mt-3 pt-2 border-t border-white/10 font-mono text-[10px] text-white/60 truncate">
                        {timelineDetail?.timestamp || (isCurrent ? 'Current' : 'Pending')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* CURRENT UPDATE BOX */}
            {/* ========================================================================= */}
            <div className="bg-black/30 border border-white/15 rounded-2xl p-5 sm:p-6 space-y-3" id="current-update-section">
              <div className="flex items-center justify-between">
                <span className="font-oswald text-xs uppercase tracking-widest text-[#ff9e30] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff9e30] animate-ping" />
                  <span>CURRENT UPDATE</span>
                </span>
                <span className="font-inter text-xs text-white/70">
                  {activeReport.currentUpdateTimestamp || 'Updated 2 hours ago'}
                </span>
              </div>

              <p className="font-inter text-sm sm:text-base font-semibold text-white leading-relaxed">
                {activeReport.currentUpdateText || `${activeReport.assignedDepartment} has been assigned.`}
              </p>

              {/* Department & Officer Badge */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-inter text-white/70">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#ff9e30]" />
                  <span>Assigned: <strong className="text-white">{activeReport.assignedDepartment}</strong></span>
                </div>

                {activeReport.assignedOfficer && (
                  <div className="flex items-center gap-1.5">
                    <HardHat className="w-4 h-4 text-emerald-300" />
                    <span>Officer: <strong className="text-white">{activeReport.assignedOfficer}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Evidence & Details Section */}
            {activeReport.photoUrl && (
              <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-oswald text-xs uppercase tracking-widest text-white/70 font-bold block mb-2">
                    Grievance Photo Evidence
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-white/20 bg-black/40 h-48 sm:h-56">
                    <img
                      src={activeReport.photoUrl}
                      alt="Grievance Evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-oswald text-xs uppercase tracking-widest text-white/70 font-bold block">
                      Incident Summary & Context
                    </span>
                    <p className="font-inter text-xs sm:text-sm text-white/90 bg-black/30 p-4 rounded-xl border border-white/15 leading-relaxed">
                      {activeReport.description}
                    </p>
                    {activeReport.additionalDescription && (
                      <p className="font-inter text-xs text-white/70 bg-black/20 p-3 rounded-xl border border-white/15">
                        📍 {activeReport.additionalDescription}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-black/30 rounded-xl border border-white/15 text-xs text-white/80 flex items-center justify-between">
                    <span>Expected Target Resolution:</span>
                    <strong className="text-[#ff9e30]">{activeReport.expectedResolution}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* WHEN RESOLVED: ISSUE RESOLVED & CITIZEN FEEDBACK */}
            {/* ========================================================================= */}
            {activeReport.currentStage === 'Resolved' && (
              <div className="mt-6 pt-6 border-t border-white/15 space-y-5" id="issue-resolved-section">
                {/* Resolved Banner */}
                <div className="bg-emerald-900/30 border border-emerald-400/40 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0 shadow-md">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-oswald text-lg font-bold uppercase text-emerald-300 tracking-wide">
                      ✓ ISSUE RESOLVED
                    </h3>
                    <p className="font-inter text-xs sm:text-sm text-emerald-100">
                      {activeReport.currentUpdateTimestamp || 'Resolved by Ward Rapid Response Team.'}
                    </p>
                  </div>
                </div>

                {/* Citizen Feedback Survey */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 text-center space-y-3">
                  <h4 className="font-oswald text-base sm:text-lg font-bold uppercase text-white tracking-wide">
                    Was this issue actually resolved?
                  </h4>
                  <p className="font-inter text-xs text-white/70 max-w-md mx-auto">
                    Your feedback ensures civic accountability and closes the quality audit loop.
                  </p>

                  {feedbackGiven ? (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-inter font-bold animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thank you! You confirmed this issue was resolved ({feedbackGiven}).</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <button
                        onClick={() => handleFeedback('Yes')}
                        className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Yes, Fully Resolved</span>
                      </button>

                      <button
                        onClick={() => handleFeedback('No')}
                        className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-inter font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>No, Still Defective</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
