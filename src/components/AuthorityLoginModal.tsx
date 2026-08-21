import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Building2,
  Lock,
  UserCheck,
  KeyRound,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  LogOut,
  BadgeCheck,
  HardHat,
  RefreshCw,
  Send,
} from 'lucide-react';
import { MOCK_CIVIC_REPORTS } from '../data/mockData';
import { CivicReport, ReportStage } from '../types';
import { useReports } from '../context/ReportsContext';

interface AuthorityLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loggedInAuthority: AuthorityUser | null;
  onLogin: (user: AuthorityUser) => void;
  onLogout: () => void;
}

export interface AuthorityUser {
  officerId: string;
  name: string;
  designation: string;
  department: string;
  municipality: string;
  wardJurisdiction: string;
  avatarBadge: string;
}

const DEMO_AUTHORITIES: AuthorityUser[] = [
  {
    officerId: 'KMC-ENG-4091',
    name: 'Er. Suresh Pokharel',
    designation: 'Senior Municipal Engineer',
    department: 'Infrastructure & Road Maintenance Division',
    municipality: 'Kathmandu Metropolitan City (KMC)',
    wardJurisdiction: 'Wards 10, 11, 31 (New Baneshwor / Maitighar)',
    avatarBadge: '👷‍♂️',
  },
  {
    officerId: 'LMC-INSP-204',
    name: 'Bikash Adhikari',
    designation: 'Field Quality Inspector',
    department: 'Urban Oversight & Ward Redressal Desk',
    municipality: 'Lalitpur Metropolitan City (LMC)',
    wardJurisdiction: 'Wards 15, 16, 17 (Patan / Mangalbazar)',
    avatarBadge: '📋',
  },
  {
    officerId: 'KUKL-DISP-88',
    name: 'Er. Nitesh Bajracharya',
    designation: 'Emergency Response Lead',
    department: 'Water Pipeline & Conduit Maintenance',
    municipality: 'Kathmandu Upatyaka Khanepani Limited',
    wardJurisdiction: 'Valley-wide Distribution Grid',
    avatarBadge: '🚰',
  },
];

export const AuthorityLoginModal: React.FC<AuthorityLoginModalProps> = ({
  isOpen,
  onClose,
  loggedInAuthority,
  onLogin,
  onLogout,
}) => {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    'Kathmandu Metropolitan City (KMC)'
  );
  const [securityToken, setSecurityToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { reports, updateReportStage } = useReports();
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'resolved'>('in_progress');
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId.trim()) {
      setErrorMsg('Please provide a valid Authority Officer ID.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      // Auto-assign credentials based on match or generic fallback
      const matched = DEMO_AUTHORITIES.find(
        (a) => a.officerId.toLowerCase() === officerId.trim().toLowerCase()
      );
      if (matched) {
        onLogin(matched);
      } else {
        onLogin({
          officerId: officerId.toUpperCase(),
          name: officerId.toUpperCase().includes('ENG') ? 'Er. Ram Kumar Shrestha' : 'Officer Rabindra Thapa',
          designation: 'Municipal Duty Officer',
          department: 'Civic Grievance Rapid Response Unit',
          municipality: selectedMunicipality,
          wardJurisdiction: 'Ward 10 & Central Sub-division',
          avatarBadge: '🏛️',
        });
      }
    }, 750);
  };

  const handleQuickDemoLogin = (auth: AuthorityUser) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(auth);
    }, 400);
  };

  const handleUpdateStatus = (reportId: string, nextStage: ReportStage) => {
    setUpdatingReportId(reportId);
    setTimeout(() => {
      updateReportStage(
        reportId,
        nextStage,
        `Status updated to "${nextStage}" by ${loggedInAuthority?.name || 'Municipal Officer'}.`,
        loggedInAuthority?.name,
        loggedInAuthority?.department
      );
      setUpdatingReportId(null);
      setSuccessToast(`Report ${reportId} updated to "${nextStage}"`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="authority-login-modal-backdrop"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl p-6 sm:p-8 custom-scrollbar"
        id="authority-login-modal-content"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close Authority Portal"
          id="close-authority-modal-btn"
        >
          <X className="w-6 h-6" />
        </button>

        {/* LOGGED IN AUTHORITY CONSOLE VIEW */}
        {loggedInAuthority ? (
          <div className="space-y-6" id="authority-dashboard-view">
            {/* Header / Authority Identity */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-[#ff9e30]/40 flex items-center justify-center text-2xl shadow-inner">
                  {loggedInAuthority.avatarBadge}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-oswald text-xl font-bold uppercase text-white tracking-wide">
                      {loggedInAuthority.name}
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      AUTHENTICATED
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-inter">
                    {loggedInAuthority.designation} • <span className="text-[#ff9e30]">{loggedInAuthority.officerId}</span>
                  </p>
                  <p className="text-[11px] text-zinc-500 font-inter mt-0.5">
                    {loggedInAuthority.municipality} ({loggedInAuthority.wardJurisdiction})
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/50 hover:text-red-400 border border-zinc-800 text-xs font-inter text-zinc-300 transition-colors"
                id="authority-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Notification Toast */}
            {successToast && (
              <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-inter flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl">
                <div className="text-xl font-oswald font-bold text-sky-400">12</div>
                <div className="text-[11px] font-inter text-zinc-400 uppercase tracking-wider">New Assigned</div>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl">
                <div className="text-xl font-oswald font-bold text-[#ff9e30]">4</div>
                <div className="text-[11px] font-inter text-zinc-400 uppercase tracking-wider">Crews In Action</div>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl">
                <div className="text-xl font-oswald font-bold text-emerald-400">38</div>
                <div className="text-[11px] font-inter text-zinc-400 uppercase tracking-wider">Resolved This Week</div>
              </div>
            </div>

            {/* Assigned Complaints Under Your Desk */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-oswald text-sm font-bold uppercase tracking-widest text-zinc-200 flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-[#ff9e30]" />
                  <span>Assigned Redressal Work Orders</span>
                </h4>
                <span className="text-xs text-zinc-400 font-inter">Live Dispatch Mode</span>
              </div>

              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-zinc-900/80 border border-zinc-800/90 p-4 rounded-2xl space-y-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#ff9e30] bg-[#ff9e30]/15 px-2 py-0.5 rounded border border-[#ff9e30]/30">
                            {report.id}
                          </span>
                          <span className="text-[11px] font-inter bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                            {report.category}
                          </span>
                          <span className="text-[11px] font-inter text-zinc-400">
                            Ward: {report.ward}
                          </span>
                        </div>
                        <h5 className="font-inter font-bold text-sm text-white mt-1.5">
                          {report.title}
                        </h5>
                        <p className="text-xs text-zinc-400 font-inter mt-0.5 line-clamp-1">
                          📍 {report.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-xs font-inter font-bold px-2.5 py-1 rounded-lg ${
                            report.currentStage === 'Resolved'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                              : report.currentStage === 'In Progress'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-700/50'
                              : 'bg-sky-950/80 text-sky-400 border border-sky-700/50'
                          }`}
                        >
                          ● {report.currentStage}
                        </span>
                      </div>
                    </div>

                    {/* Authority Action Stage Advancement Buttons */}
                    <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-zinc-400 font-inter">
                        Advance Milestone for Citizen Tracker:
                      </span>
                      <div className="flex items-center gap-2">
                        {report.currentStage !== 'Assigned' && (
                          <button
                            disabled={updatingReportId === report.id}
                            onClick={() => handleUpdateStatus(report.id, 'Assigned')}
                            className="cursor-pointer text-[11px] font-inter font-medium px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                          >
                            Set Assigned
                          </button>
                        )}
                        {report.currentStage !== 'In Progress' && (
                          <button
                            disabled={updatingReportId === report.id}
                            onClick={() => handleUpdateStatus(report.id, 'In Progress')}
                            className="cursor-pointer text-[11px] font-inter font-bold px-3 py-1 rounded bg-[#ff9e30]/20 hover:bg-[#ff9e30]/30 text-[#ff9e30] border border-[#ff9e30]/40 transition-colors"
                          >
                            Set In Progress
                          </button>
                        )}
                        {report.currentStage !== 'Resolved' && (
                          <button
                            disabled={updatingReportId === report.id}
                            onClick={() => handleUpdateStatus(report.id, 'Resolved')}
                            className="cursor-pointer text-[11px] font-inter font-bold px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black shadow-md transition-colors"
                          >
                            ✓ Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-inter">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Municipal VPN & Encrypted Operational Channel Active</span>
              </span>
              <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-inter text-xs transition-colors"
              >
                Close Console
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN FORM VIEW */
          <div className="space-y-6" id="authority-login-form-view">
            {/* Header Section */}
            <div>
              <div className="flex items-center gap-2 text-[#ff9e30] font-oswald text-xs uppercase tracking-widest font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Civic Operations & Municipal Administration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-oswald font-bold uppercase tracking-wider text-white mt-1">
                AUTHORITY LOGIN
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-inter mt-1 max-w-xl">
                Restricted access for Municipal Engineers, Ward Inspectors, KUKL & NEA Emergency Maintenance Desks to verify citizen reports, dispatch field crews, and publish resolution proofs.
              </p>
            </div>

            {/* Quick Demo Pre-filled Credentials */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-oswald uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#ff9e30]" />
                  <span>One-Click Demo Authority Profiles:</span>
                </span>
                <span className="text-[11px] text-zinc-500 font-inter">Click to login immediately</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DEMO_AUTHORITIES.map((auth) => (
                  <button
                    key={auth.officerId}
                    type="button"
                    onClick={() => handleQuickDemoLogin(auth)}
                    disabled={isLoading}
                    className="cursor-pointer text-left p-3 rounded-xl bg-zinc-950/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#ff9e30]/50 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{auth.avatarBadge}</span>
                      <span className="font-oswald text-xs font-bold text-white uppercase truncate group-hover:text-[#ff9e30] transition-colors">
                        {auth.name}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#ff9e30] font-semibold truncate">
                      {auth.officerId}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {auth.department}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-[11px] font-oswald uppercase tracking-widest text-zinc-500">
                Or Enter Official Credentials
              </span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-inter rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Official Credentials Form */}
            <form onSubmit={handleFormLogin} className="space-y-4" id="authority-auth-form">
              {/* Municipality Select */}
              <div>
                <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                  Authority Agency / Municipality *
                </label>
                <select
                  value={selectedMunicipality}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2.5 text-xs font-inter text-white focus:outline-none focus:border-[#ff9e30]"
                >
                  <option value="Kathmandu Metropolitan City (KMC)">Kathmandu Metropolitan City (KMC)</option>
                  <option value="Lalitpur Metropolitan City (LMC)">Lalitpur Metropolitan City (LMC)</option>
                  <option value="Bhaktapur Municipality">Bhaktapur Municipality</option>
                  <option value="Kathmandu Upatyaka Khanepani Limited (KUKL)">Kathmandu Upatyaka Khanepani Limited (KUKL)</option>
                  <option value="Nepal Electricity Authority (NEA)">Nepal Electricity Authority (NEA)</option>
                  <option value="Nepal Police / Traffic Division">Nepal Police / Traffic Division</option>
                </select>
              </div>

              {/* Officer ID & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                    Officer Badge / Staff ID *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="e.g. KMC-ENG-4091"
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono uppercase text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                    Security Passcode / Token *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl pl-10 pr-4 py-2.5 text-xs font-inter text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] text-zinc-500 font-inter flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit SSL Municipal Gateway</span>
                </span>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
                  id="authority-submit-login-btn"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>AUTHENTICATE & ENTER →</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
