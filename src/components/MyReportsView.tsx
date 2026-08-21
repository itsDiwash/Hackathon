import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Trash2,
  Zap,
  Building2,
  Compass,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CivicReport, IssueCategory } from '../types';
import { useReports } from '../context/ReportsContext';

interface MyReportsViewProps {
  onOpenReportIssue: () => void;
  onTrackReport: (reportId: string) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  onOpenReportIssue,
  onTrackReport,
}) => {
  const { reports, setSelectedTrackId } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Resolved' | 'Verified' | 'Submitted'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case 'Road Damage':
        return AlertTriangle;
      case 'Streetlight':
        return Lightbulb;
      case 'Water Leakage':
        return Droplets;
      case 'Garbage / Waste':
        return Trash2;
      case 'Electricity':
        return Zap;
      case 'Public Facility':
        return Building2;
      case 'Traffic / Road Sign':
        return Compass;
      default:
        return HelpCircle;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40';
      case 'In Progress':
        return 'bg-amber-500/20 text-amber-300 border border-amber-400/40';
      case 'Verified':
        return 'bg-purple-500/20 text-purple-300 border border-purple-400/40';
      case 'Assigned':
        return 'bg-sky-500/20 text-sky-300 border border-sky-400/40';
      default:
        return 'bg-white/15 text-white/90 border border-white/20';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High Priority':
        return 'text-red-300 bg-red-500/20 border border-red-400/40';
      case 'Medium Priority':
        return 'text-amber-300 bg-amber-500/20 border border-amber-400/40';
      default:
        return 'text-sky-300 bg-sky-500/20 border border-sky-400/40';
    }
  };

  // Filtered reports list
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || report.currentStage === statusFilter;

    const matchesCategory =
      categoryFilter === 'All' || report.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCardClick = (reportId: string) => {
    setSelectedTrackId(reportId);
    onTrackReport(reportId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10" id="my-reports-page">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[#ff9e30] font-oswald text-xs uppercase tracking-widest font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Citizen Dashboard</span>
          </div>
          <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
            MY REPORTS
          </h1>
          <p className="font-inter text-sm sm:text-base text-white/80 mt-1">
            Your issues, all in one place.
          </p>
        </div>

        {/* Report New Issue CTA */}
        <button
          onClick={onOpenReportIssue}
          id="my-reports-new-issue-btn"
          className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,158,48,0.3)] active:scale-95 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-8 space-y-3 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Report ID (e.g. SS-1048), category, or ward..."
              className="w-full bg-black/30 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] focus:bg-black/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="sm:w-56">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-inter text-white focus:outline-none focus:border-[#ff9e30] focus:bg-black/40"
            >
              <option value="All" className="bg-zinc-900 text-white">All Categories</option>
              <option value="Road Damage" className="bg-zinc-900 text-white">Road Damage</option>
              <option value="Streetlight" className="bg-zinc-900 text-white">Streetlight</option>
              <option value="Water Leakage" className="bg-zinc-900 text-white">Water Leakage</option>
              <option value="Garbage / Waste" className="bg-zinc-900 text-white">Garbage / Waste</option>
              <option value="Electricity" className="bg-zinc-900 text-white">Electricity</option>
              <option value="Public Facility" className="bg-zinc-900 text-white">Public Facility</option>
              <option value="Traffic / Road Sign" className="bg-zinc-900 text-white">Traffic / Road Sign</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          <span className="text-[11px] font-oswald uppercase tracking-wider text-white/70 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Status:</span>
          </span>
          {(['All', 'In Progress', 'Resolved', 'Verified', 'Submitted'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-inter font-medium transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#ff9e30] text-black font-bold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid / Cards List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white/10 border border-white/20 rounded-3xl p-12 text-center space-y-4 backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white/60">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-oswald text-xl font-bold uppercase text-white tracking-wide">
            No Reports Found
          </h3>
          <p className="font-inter text-xs sm:text-sm text-white/70 max-w-sm mx-auto">
            No reports match your current search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setCategoryFilter('All');
            }}
            className="cursor-pointer text-xs text-[#ff9e30] hover:underline font-inter font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="my-reports-grid">
          {filteredReports.map((report) => {
            const Icon = getCategoryIcon(report.category);

            return (
              <motion.div
                key={report.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleCardClick(report.id)}
                id={`report-card-${report.id.toLowerCase()}`}
                className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#ff9e30]/80 rounded-3xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-lg group relative overflow-hidden backdrop-blur-md"
              >
                {/* Accent top border highlight on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff9e30] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  {/* Top Bar: ID, Category & Priority */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-black/40 text-[#ff9e30] border border-[#ff9e30]/30 group-hover:border-[#ff9e30]/60 transition-colors">
                      {report.id}
                    </span>

                    <span className={`text-[10px] font-inter font-bold px-2.5 py-0.5 rounded-full ${getPriorityBadgeClass(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>

                  {/* Icon & Category Heading */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 group-hover:bg-[#ff9e30] text-white group-hover:text-black flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-oswald text-base sm:text-lg font-bold uppercase text-white group-hover:text-[#ff9e30] transition-colors truncate">
                        {report.category}
                      </h3>
                      <p className="font-inter text-xs text-white/80 line-clamp-1">
                        {report.title}
                      </p>
                    </div>
                  </div>

                  {/* Location & Reported Date */}
                  <div className="bg-black/30 rounded-xl p-3 border border-white/15 space-y-1.5 text-xs font-inter">
                    <div className="flex items-center gap-1.5 text-white/90">
                      <MapPin className="w-3.5 h-3.5 text-[#ff9e30] shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{report.reportedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Status Badge & Track Action */}
                <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                  <span className={`text-xs font-inter font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(report.currentStage)}`}>
                    ● {report.currentStage}
                  </span>

                  <span className="font-oswald text-xs uppercase tracking-wider text-white/70 group-hover:text-[#ff9e30] flex items-center gap-1 font-bold transition-colors">
                    <span>Track Status</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
