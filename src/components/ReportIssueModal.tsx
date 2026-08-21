import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  AlertTriangle,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  Send,
  Building,
  Phone,
  User,
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
  Info,
} from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackCreatedReport?: (reportId: string) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onTrackCreatedReport,
}) => {
  const [category, setCategory] = useState('Road & Pothole');
  const [municipality, setMunicipality] = useState('Kathmandu Metropolitan City');
  const [ward, setWard] = useState('Ward No. 10');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'Normal' | 'High' | 'Critical'>('High');
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoSelected, setPhotoSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newId = `SS-2026-${randomNum}`;
      setGeneratedReportId(newId);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCopyId = () => {
    if (generatedReportId) {
      navigator.clipboard.writeText(generatedReportId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categories = [
    { id: 'Road & Pothole', label: 'Road & Pothole Repair', icon: '🛣️' },
    { id: 'Water Supply & Drainage', label: 'Water Leak & Drainage', icon: '🚰' },
    { id: 'Waste Management', label: 'Garbage & Waste Dumping', icon: '🗑️' },
    { id: 'Electricity & Streetlight', label: 'Streetlight & Electric Lines', icon: '💡' },
    { id: 'Public Safety', label: 'Public Safety & Encroachment', icon: '🚧' },
    { id: 'General Civic', label: 'Parks, Footpaths & Heritage', icon: '🏛️' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      id="report-issue-modal-backdrop"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl p-6 sm:p-8 custom-scrollbar"
        id="report-issue-modal-content"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close Report Issue Modal"
          id="close-report-modal-btn"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[#ff9e30] font-oswald text-xs uppercase tracking-widest font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Civic Redressal Lodgment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-oswald font-bold uppercase tracking-wider text-white mt-1">
            REPORT AN ISSUE
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-inter mt-1">
            तपाईंको गुनासो सिधै सम्बन्धित वडा तथा नगरपालिका विभागमा दर्ता हुन्छ। Direct municipal escalation with transparent tracking.
          </p>
        </div>

        {/* Success State Screen */}
        {generatedReportId ? (
          <div className="py-8 text-center space-y-6" id="report-success-view">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-oswald text-emerald-400 uppercase tracking-widest font-bold">
                Grievance Lodged Successfully
              </span>
              <h3 className="text-2xl sm:text-3xl font-oswald font-bold uppercase text-white mt-1">
                Your Report ID Generated
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-inter max-w-md mx-auto mt-2">
                Your complaint has been forwarded to the <strong>{municipality} ({ward})</strong> inspection desk.
              </p>
            </div>

            {/* Generated Report ID Box */}
            <div className="bg-zinc-900 border border-[#ff9e30]/40 rounded-2xl p-5 max-w-md mx-auto text-center shadow-lg">
              <div className="text-[11px] font-oswald tracking-widest text-[#ff9e30] uppercase font-bold">
                TRACKING IDENTIFIER
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white my-2 tracking-wider">
                {generatedReportId}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleCopyId}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-inter text-zinc-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy ID'}</span>
                </button>
              </div>
            </div>

            {/* Next Steps List */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 max-w-md mx-auto text-left text-xs font-inter space-y-2 text-zinc-300">
              <div className="font-bold text-white font-oswald uppercase tracking-wider text-xs">
                What happens next:
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff9e30] font-bold">1.</span>
                <span>Ward Field Inspector verifies the location within 6 hours.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff9e30] font-bold">2.</span>
                <span>Maintenance crew dispatched with work order #.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff9e30] font-bold">3.</span>
                <span>Before & After resolution photos verified by civic supervisors.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onTrackCreatedReport && (
                <button
                  type="button"
                  onClick={() => {
                    onTrackCreatedReport(generatedReportId);
                  }}
                  className="cursor-pointer px-7 py-3 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-sm uppercase tracking-wide transition-all shadow-md active:scale-95"
                >
                  Track This Report Now →
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-inter text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" id="grievance-submission-form">
            {/* 1. Category Selection */}
            <div>
              <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-2">
                1. Select Issue Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-inter transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff9e30]/15 border-[#ff9e30] text-white font-semibold'
                          : 'bg-zinc-900 hover:bg-zinc-800/80 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Municipality & Ward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                  Municipality / Local Body *
                </label>
                <select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2.5 text-xs font-inter text-white focus:outline-none focus:border-[#ff9e30]"
                >
                  <option value="Kathmandu Metropolitan City">Kathmandu Metropolitan City (KMC)</option>
                  <option value="Lalitpur Metropolitan City">Lalitpur Metropolitan City (LMC)</option>
                  <option value="Bhaktapur Municipality">Bhaktapur Municipality</option>
                  <option value="Madhyapur Thimi Municipality">Madhyapur Thimi Municipality</option>
                  <option value="Kirtipur Municipality">Kirtipur Municipality</option>
                  <option value="Budhanilkantha Municipality">Budhanilkantha Municipality</option>
                  <option value="Tokha Municipality">Tokha Municipality</option>
                  <option value="Mahalaxmi Municipality">Mahalaxmi Municipality</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                  Ward Number *
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2.5 text-xs font-inter text-white focus:outline-none focus:border-[#ff9e30]"
                >
                  {Array.from({ length: 32 }, (_, i) => (
                    <option key={i + 1} value={`Ward No. ${i + 1}`}>
                      Ward No. {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Location / Landmark */}
            <div>
              <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                Exact Street / Chowk / Landmark *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff9e30]" />
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. New Baneshwor, 50m west of Krishna Tower / Main Road junction"
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl pl-10 pr-4 py-2.5 text-xs font-inter text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                />
              </div>
            </div>

            {/* 4. Description */}
            <div>
              <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                Issue Description & Details *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, size of damage, public inconvenience, or potential hazard..."
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl p-3 text-xs font-inter text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
              />
            </div>

            {/* 5. Urgency & Photo Attachment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                  Urgency Level
                </label>
                <div className="flex items-center gap-2">
                  {(['Normal', 'High', 'Critical'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setUrgency(lvl)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-inter font-semibold transition-all border cursor-pointer ${
                        urgency === lvl
                          ? lvl === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border-red-500'
                            : lvl === 'High'
                            ? 'bg-[#ff9e30]/20 text-[#ff9e30] border-[#ff9e30]'
                            : 'bg-zinc-800 text-white border-zinc-600'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-1.5">
                  Attach Photo Evidence
                </label>
                <button
                  type="button"
                  onClick={() => setPhotoSelected(!photoSelected)}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-inter transition-all cursor-pointer ${
                    photoSelected
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-750 text-zinc-300'
                  }`}
                >
                  <Camera className="w-4 h-4 text-[#ff9e30]" />
                  <span>{photoSelected ? '✓ Photo Attached (evidence.jpg)' : 'Upload / Snap Photo'}</span>
                </button>
              </div>
            </div>

            {/* 6. Citizen Contact Information */}
            <div className="border-t border-zinc-850 pt-4">
              <label className="block text-xs font-oswald uppercase tracking-widest text-zinc-300 font-bold mb-2">
                Citizen Contact (For Tracking & SMS Updates)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-zinc-900 border border-zinc-750 rounded-xl pl-9 pr-3 py-2 text-xs font-inter text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile (e.g. 98XXXXXXXX)"
                    className="w-full bg-zinc-900 border border-zinc-750 rounded-xl pl-9 pr-3 py-2 text-xs font-inter text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-[11px] text-zinc-500 font-inter flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy Protected • Direct Escalation</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
                id="submit-grievance-btn"
              >
                {isSubmitting ? (
                  <span>Submitting Grievance...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>LODGE REPORT →</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
