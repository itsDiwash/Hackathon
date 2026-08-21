import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  User,
  AlertCircle,
  FileText,
  Camera,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CivicReport, ReportStage } from '../types';
import { MOCK_CIVIC_REPORTS } from '../data/mockData';

interface TrackReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportIssue?: () => void;
}

const STAGES: ReportStage[] = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

export const TrackReportModal: React.FC<TrackReportModalProps> = ({
  isOpen,
  onClose,
  onOpenReportIssue,
}) => {
  const [searchQuery, setSearchQuery] = useState('SS-2026-00124');
  const [searchedReport, setSearchedReport] = useState<CivicReport | null>(MOCK_CIVIC_REPORTS[0]);
  const [notFound, setNotFound] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (idToSearch?: string) => {
    const query = (idToSearch || searchQuery).trim().toUpperCase();
    if (!query) return;

    const found = MOCK_CIVIC_REPORTS.find(
      (r) => r.id.toUpperCase() === query || r.id.includes(query)
    );

    if (found) {
      setSearchedReport(found);
      setNotFound(false);
    } else {
      setSearchedReport(null);
      setNotFound(true);
    }
  };

  const getStageIndex = (stage: ReportStage) => {
    return STAGES.indexOf(stage);
  };

  const currentStageIndex = searchedReport ? getStageIndex(searchedReport.currentStage) : -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      id="track-report-modal-backdrop"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl p-6 sm:p-8 custom-scrollbar"
        id="track-report-modal-content"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close Track Report Modal"
          id="close-track-report-btn"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[#ff9e30] font-oswald text-xs uppercase tracking-widest font-bold">
            <Search className="w-4 h-4" />
            <span>Civic Redressal Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-oswald font-bold uppercase tracking-wider text-white mt-1">
            TRACK MY REPORT
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-inter mt-1 max-w-xl">
            Enter your unique grievance tracking number to inspect real-time departmental progress, assigned engineering crews, and verified resolution milestones.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 mb-6 shadow-inner">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            id="track-search-form"
          >
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm font-semibold">
                #
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Report ID (e.g. SS-2026-00124)"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-9 pr-4 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30] focus:ring-1 focus:ring-[#ff9e30] uppercase"
                id="report-id-input"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#ff9e30] hover:bg-[#ffb04f] active:scale-95 text-black font-inter font-bold text-sm px-7 py-3 rounded-xl transition-all shadow-md"
              id="track-submit-btn"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {/* Quick Demo Sample Report ID Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-inter text-zinc-400">
            <span className="text-[11px] font-medium text-zinc-500">Quick Test IDs:</span>
            {MOCK_CIVIC_REPORTS.map((rep) => (
              <button
                key={rep.id}
                type="button"
                onClick={() => {
                  setSearchQuery(rep.id);
                  handleSearch(rep.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                  searchedReport?.id === rep.id
                    ? 'bg-[#ff9e30]/20 text-[#ff9e30] border-[#ff9e30]/40'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                }`}
              >
                {rep.id}
              </button>
            ))}
          </div>
        </div>

        {/* Not Found State */}
        {notFound && (
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-red-900/40 text-center my-6">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h4 className="font-oswald text-lg font-bold text-white uppercase">
              Report ID Not Found
            </h4>
            <p className="text-xs text-zinc-400 font-inter mt-1 max-w-md mx-auto">
              We couldn't locate a grievance with ID "{searchQuery}". Please verify the digits or submit a new grievance report.
            </p>
            {onOpenReportIssue && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReportIssue();
                }}
                className="mt-4 inline-flex items-center gap-2 text-xs font-inter font-bold text-[#ff9e30] hover:underline cursor-pointer"
              >
                <span>Report this issue now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Active Report Found Details */}
        {searchedReport && (
          <div className="space-y-6" id="report-details-container">
            {/* Top Report Info Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-bold text-[#ff9e30] bg-[#ff9e30]/15 px-2.5 py-0.5 rounded border border-[#ff9e30]/30">
                      {searchedReport.id}
                    </span>
                    <span className="text-xs font-inter bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded border border-zinc-700">
                      {searchedReport.category}
                    </span>
                    <span
                      className={`text-xs font-inter font-bold px-2.5 py-0.5 rounded ${
                        searchedReport.currentStage === 'Resolved'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                          : searchedReport.currentStage === 'In Progress'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-700/50'
                          : 'bg-sky-950/80 text-sky-400 border border-sky-700/50'
                      }`}
                    >
                      ● {searchedReport.currentStage}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-inter font-bold text-white leading-snug">
                    {searchedReport.title}
                  </h3>
                </div>

                <div className="text-right text-xs font-inter text-zinc-400">
                  <div>Reported on:</div>
                  <div className="font-medium text-zinc-200 mt-0.5">{searchedReport.reportedAt}</div>
                </div>
              </div>

              {/* Description & Location */}
              <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-inter leading-relaxed bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80">
                {searchedReport.description}
              </p>

              {/* Location and Authority Badges */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-inter text-zinc-300">
                <div className="flex items-center gap-2.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                  <MapPin className="w-4 h-4 text-[#ff9e30] shrink-0" />
                  <div>
                    <div className="text-[11px] text-zinc-500 font-semibold">LOCATION & WARD</div>
                    <div className="font-medium text-white truncate">{searchedReport.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                  <Building2 className="w-4 h-4 text-[#ff9e30] shrink-0" />
                  <div>
                    <div className="text-[11px] text-zinc-500 font-semibold">ASSIGNED AUTHORITY</div>
                    <div className="font-medium text-white truncate">{searchedReport.assignedDepartment}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-STAGE VISUAL JOURNEY PIPELINE */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-sm font-oswald uppercase tracking-widest text-zinc-300 font-bold">
                  Grievance Progress Journey
                </h4>
                <span className="text-xs font-inter text-[#ff9e30] font-semibold">
                  Estimated Resolution: {searchedReport.expectedResolution}
                </span>
              </div>

              {/* Pipeline Step Bar */}
              <div className="relative py-2">
                {/* Background Line */}
                <div className="hidden sm:block absolute top-7 left-8 right-8 h-1 bg-zinc-800 z-0" />
                {/* Active Progress Line */}
                <div
                  className="hidden sm:block absolute top-7 left-8 h-1 bg-gradient-to-r from-sky-500 via-[#ff9e30] to-emerald-500 z-0 transition-all duration-500"
                  style={{
                    width: `${(currentStageIndex / (STAGES.length - 1)) * 88}%`,
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isPending = idx > currentStageIndex;

                    return (
                      <div
                        key={stage}
                        className={`flex sm:flex-col items-center gap-3 sm:gap-2 p-3 sm:p-2 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-[#ff9e30]/10 border border-[#ff9e30]/40'
                            : 'bg-zinc-950/40 border border-zinc-800/40'
                        }`}
                      >
                        {/* Circle Indicator */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                              : isCurrent
                              ? 'bg-[#ff9e30] text-black shadow-[0_0_15px_rgba(255,158,48,0.7)] animate-pulse'
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Label */}
                        <div className="text-left sm:text-center">
                          <div
                            className={`text-xs font-oswald uppercase tracking-wider font-bold ${
                              isCurrent
                                ? 'text-[#ff9e30]'
                                : isCompleted
                                ? 'text-emerald-400'
                                : 'text-zinc-500'
                            }`}
                          >
                            {stage}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-inter">
                            {isCompleted
                              ? 'Completed'
                              : isCurrent
                              ? 'Active Stage'
                              : 'Upcoming'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Timeline Events */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <h4 className="text-sm font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff9e30]" />
                <span>Field Log & Official Verification Remarks</span>
              </h4>

              <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-0.5 before:bg-zinc-800">
                {searchedReport.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                        event.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 bg-zinc-950/70 border border-zinc-800/80 p-3.5 rounded-xl">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-oswald text-sm font-bold text-white uppercase tracking-wide">
                          {event.title}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-inter mt-1.5 leading-relaxed">
                        {event.note}
                      </p>
                      {event.officer && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400 font-inter">
                          <User className="w-3 h-3 text-[#ff9e30]" />
                          <span>Officer: <strong className="text-zinc-200">{event.officer}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-zinc-400 font-inter flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Citizen Redressal Portal • KMC & LMC Municipal Integration</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenReportIssue && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReportIssue();
                }}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                + File New Report
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-inter text-xs transition-colors"
            >
              Close Tracker
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
