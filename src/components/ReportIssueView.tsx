import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Lightbulb,
  Droplets,
  Trash2,
  Zap,
  Building2,
  Compass,
  HelpCircle,
  MapPin,
  Crosshair,
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Sparkles,
  Camera,
  X,
  Copy,
  Check,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { IssueCategory, IssuePriority, CivicReport } from '../types';
import { useReports } from '../context/ReportsContext';

interface ReportIssueViewProps {
  onBackHome: () => void;
  onViewMyReports: () => void;
  onTrackReport: (reportId: string) => void;
}

interface IssueOption {
  id: IssueCategory;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedPriority: IssuePriority;
  sampleImage: string;
}

const ISSUE_OPTIONS: IssueOption[] = [
  {
    id: 'Road Damage',
    label: 'Road Damage',
    sublabel: 'Potholes, cracks, broken asphalt & cave-ins',
    icon: AlertTriangle,
    suggestedPriority: 'High Priority',
    sampleImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Streetlight',
    label: 'Streetlight',
    sublabel: 'Dark lamp posts, flickering or damaged poles',
    icon: Lightbulb,
    suggestedPriority: 'Medium Priority',
    sampleImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Water Leakage',
    label: 'Water Leakage',
    sublabel: 'Pipe ruptures, overflowing drains & flooding',
    icon: Droplets,
    suggestedPriority: 'High Priority',
    sampleImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Garbage / Waste',
    label: 'Garbage / Waste',
    sublabel: 'Illegal dumpsites, missed pickups & overflowing bins',
    icon: Trash2,
    suggestedPriority: 'Normal Priority',
    sampleImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Electricity',
    label: 'Electricity',
    sublabel: 'Hanging wires, sparking transformers & open fuse boxes',
    icon: Zap,
    suggestedPriority: 'High Priority',
    sampleImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Public Facility',
    label: 'Public Facility',
    sublabel: 'Damaged footpaths, public restrooms, parks & benches',
    icon: Building2,
    suggestedPriority: 'Normal Priority',
    sampleImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Traffic / Road Sign',
    label: 'Traffic / Road Sign',
    sublabel: 'Missing zebra crossing, broken signals & obscured signs',
    icon: Compass,
    suggestedPriority: 'Medium Priority',
    sampleImage: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Other Problem',
    label: 'Other Problem',
    sublabel: 'Noise nuisance, stray animals, general civic concern',
    icon: HelpCircle,
    suggestedPriority: 'Normal Priority',
    sampleImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
];

const KATHMANDU_WARDS = [
  'Ward 01, Naxal / Nagpokhari',
  'Ward 02, Lazimpat / Baluwatar',
  'Ward 03, Maharajgunj / Panipokhari',
  'Ward 04, Baluwatar / Bishalnagar',
  'Ward 05, Kathmandu (Tangal / Handigaun)',
  'Ward 06, Bauddha / Chabahil',
  'Ward 07, Mitrapark / Chabahil',
  'Ward 08, Gaushala / Jayabageshwari',
  'Ward 09, Sinamangal / Gaushala',
  'Ward 10, New Baneshwor / Buddhanagar',
  'Ward 11, Maitighar / Tripureshwor',
  'Ward 12, Teku / Pachali',
  'Ward 16, Balaju / Sorhakhutte',
  'Ward 26, Thamel / Samakhusi',
  'Ward 28, Kamaladi / Bagbazar',
  'Ward 31, Minbhawan / Shantinagar',
  'Ward 32, Koteshwor / Jadibuti',
  'Lalitpur Ward 16, Patan Dhoka / Mangalbazar',
  'Bhaktapur Ward 02, Durbar Square',
];

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  onBackHome,
  onViewMyReports,
  onTrackReport,
}) => {
  const { createReport } = useReports();

  // Multi-step state: 1 (Issue), 2 (Location), 3 (Evidence), 4 (Verify), 5 (Submitted)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('Road Damage');
  const [otherCategoryText, setOtherCategoryText] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>(
    'Severe road depression and asphalt cracks causing traffic blockage and safety risk.'
  );
  const [priority, setPriority] = useState<IssuePriority>('High Priority');

  // Location fields
  const [ward, setWard] = useState<string>('Ward 05, Kathmandu');
  const [locationAddress, setLocationAddress] = useState<string>('Ward 05, Kathmandu');
  const [gpsCoordinates, setGpsCoordinates] = useState<string>('27.7172° N, 85.3240° E');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  // Evidence fields
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  );
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    'Located near the main roundabout. Peak morning traffic is heavily affected.'
  );
  const [citizenName, setCitizenName] = useState<string>('Diwash Shrestha');
  const [citizenPhone, setCitizenPhone] = useState<string>('9841******');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Geolocation
  const handleUseMyLocation = () => {
    setIsLocating(true);
    setLocationSuccessMsg(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setGpsCoordinates(`${lat}° N, ${lng}° E`);
          setWard('Ward 05, Kathmandu (GPS Pin)');
          setLocationAddress(`Ward 05, Kathmandu (${lat}° N, ${lng}° E)`);
          setIsLocating(false);
          setLocationSuccessMsg('GPS coordinates captured precisely from your device.');
          setTimeout(() => setLocationSuccessMsg(null), 4000);
        },
        () => {
          // Fallback simulation
          setTimeout(() => {
            setGpsCoordinates('27.7172° N, 85.3240° E');
            setWard('Ward 05, Kathmandu');
            setLocationAddress('Ward 05, Kathmandu');
            setIsLocating(false);
            setLocationSuccessMsg('Current location detected: Ward 05, Kathmandu.');
            setTimeout(() => setLocationSuccessMsg(null), 4000);
          }, 600);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setGpsCoordinates('27.7172° N, 85.3240° E');
        setWard('Ward 05, Kathmandu');
        setLocationAddress('Ward 05, Kathmandu');
        setIsLocating(false);
        setLocationSuccessMsg('Current location set to Ward 05, Kathmandu.');
        setTimeout(() => setLocationSuccessMsg(null), 4000);
      }, 500);
    }
  };

  // Handle Photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectCategory = (cat: IssueCategory) => {
    setSelectedCategory(cat);
    const match = ISSUE_OPTIONS.find((o) => o.id === cat);
    if (match) {
      setPriority(match.suggestedPriority);
      if (!photoUrl || photoUrl === ISSUE_OPTIONS[0].sampleImage) {
        setPhotoUrl(match.sampleImage);
      }
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const created = createReport({
        category: selectedCategory,
        customCategoryNote: selectedCategory === 'Other Problem' ? otherCategoryText : undefined,
        location: locationAddress || ward,
        ward: ward.split(',')[0].trim(),
        priority: priority,
        description: issueDescription,
        additionalDescription: additionalNotes,
        photoUrl: photoUrl,
        citizenName: citizenName,
        citizenPhone: citizenPhone,
      });

      setSubmittedReport(created);
      setIsSubmitting(false);
      setCurrentStep(5); // Submitted step
    }, 1200);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const stepLabels = [
    { num: '01', title: 'Issue' },
    { num: '02', title: 'Location' },
    { num: '03', title: 'Evidence' },
    { num: '04', title: 'Verify' },
    { num: '05', title: 'Submitted' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6" id="report-issue-journey">
      {/* Top Header Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 border border-white/20 text-[#ff9e30] font-oswald text-xs uppercase tracking-widest font-bold mb-2 drop-shadow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Citizen Action Portal</span>
        </div>
        <h1 className="font-oswald text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          REPORT AN ISSUE
        </h1>
        <p className="font-inter text-xs sm:text-sm text-white/80 mt-1 max-w-2xl mx-auto drop-shadow">
          Help us identify and resolve problems in your community.
        </p>
      </div>

      {/* Modern Progress Bar Indicator: 01 Issue → 02 Location → 03 Evidence → 04 Verify → 05 Submitted */}
      <div className="mb-6" id="progress-indicator-container">
        <div className="bg-black/25 border border-white/20 rounded-2xl p-2.5 sm:p-3">
          <div className="flex items-center justify-between overflow-x-auto gap-2 sm:gap-4 no-scrollbar">
            {stepLabels.map((step, idx) => {
              const stepIndex = idx + 1;
              const isCompleted = currentStep > stepIndex;
              const isCurrent = currentStep === stepIndex;

              return (
                <React.Fragment key={step.num}>
                  <div
                    onClick={() => {
                      if (currentStep < 5 && stepIndex < currentStep) {
                        setCurrentStep(stepIndex);
                      }
                    }}
                    className={`flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all select-none ${
                      isCurrent
                        ? 'bg-[#ff9e30]/30 border border-[#ff9e30] text-white shadow-[0_0_15px_rgba(255,158,48,0.3)]'
                        : isCompleted
                        ? 'bg-black/20 text-white/90 hover:text-white cursor-pointer border border-white/10'
                        : 'text-white/40'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-oswald text-xs font-bold ${
                        isCurrent
                          ? 'bg-[#ff9e30] text-black shadow-sm'
                          : isCompleted
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                          : 'bg-black/30 text-white/40'
                      }`}
                    >
                      {isCompleted ? '✓' : step.num}
                    </span>
                    <span
                      className={`font-oswald text-xs uppercase tracking-wide whitespace-nowrap ${
                        isCurrent ? 'text-white font-bold' : isCompleted ? 'text-white/80' : 'text-white/40'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {idx < stepLabels.length - 1 && (
                    <div
                      className={`h-0.5 w-4 sm:w-8 shrink-0 transition-colors ${
                        currentStep > idx + 1 ? 'bg-[#ff9e30]' : 'bg-white/20'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Guided Form Body: Transparent unblurred container */}
      <div className="bg-black/25 border border-white/20 rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: ISSUE SELECTION */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
              id="report-step-1"
            >
              <div>
                <span className="font-oswald text-xs uppercase tracking-widest text-[#ff9e30] font-bold">
                  Step 01 of 05
                </span>
                <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mt-1 drop-shadow">
                  What problem did you find?
                </h2>
                <p className="font-inter text-xs text-white/80 mt-0.5">
                  Select the category that best describes the issue in your area.
                </p>
              </div>

              {/* 8 Interactive Issue Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ISSUE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedCategory === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectCategory(option.id)}
                      id={`category-card-${option.id.toLowerCase().replace(/[\s/]+/g, '-')}`}
                      className={`cursor-pointer text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 relative flex flex-col justify-between min-h-[125px] ${
                        isSelected
                          ? 'bg-white/20 border-2 border-[#ff9e30] shadow-[0_0_20px_rgba(255,158,48,0.3)]'
                          : 'bg-black/30 hover:bg-black/40 border border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#ff9e30] text-black shadow-md'
                              : 'bg-white/20 text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="bg-[#ff9e30] text-black rounded-full p-1 shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5">
                        <h3 className="font-oswald text-sm sm:text-base font-bold uppercase text-white tracking-wide">
                          {option.label}
                        </h3>
                        <p className="font-inter text-[11px] text-white/80 mt-0.5 line-clamp-2 leading-relaxed">
                          {option.sublabel}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* If "Other Problem" is selected, reveal text input */}
              {selectedCategory === 'Other Problem' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-black/30 border border-white/20 p-3.5 rounded-2xl space-y-2"
                >
                  <label className="block font-oswald text-xs uppercase tracking-widest text-[#ff9e30] font-bold">
                    Tell us what’s wrong... *
                  </label>
                  <input
                    type="text"
                    required
                    value={otherCategoryText}
                    onChange={(e) => setOtherCategoryText(e.target.value)}
                    placeholder="e.g. Broken park playground swing / Drainage overflow into pathway"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30]"
                  />
                </motion.div>
              )}

              {/* Optional Issue Description for every category */}
              <div className="bg-black/30 border border-white/20 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold">
                  Problem Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe what happened, any immediate hazards, or when you noticed it..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] resize-none"
                />

                {/* Priority Selector */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-inter text-xs text-white/70">Select Severity Level:</span>
                  <div className="flex items-center gap-2">
                    {(['Normal Priority', 'Medium Priority', 'High Priority'] as IssuePriority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-inter font-semibold transition-all ${
                          priority === p
                            ? p === 'High Priority'
                              ? 'bg-red-500/30 text-red-200 border border-red-400'
                              : p === 'Medium Priority'
                              ? 'bg-amber-500/30 text-amber-200 border border-amber-400'
                              : 'bg-sky-500/30 text-sky-200 border border-sky-400'
                            : 'bg-black/20 text-white/70 hover:text-white border border-white/10'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onBackHome}
                  className="cursor-pointer px-4 py-2 rounded-full bg-black/25 hover:bg-black/40 text-white text-xs font-inter font-medium transition-colors border border-white/15"
                >
                  Cancel & Back
                </button>

                <button
                  type="button"
                  id="step1-continue-btn"
                  onClick={() => setCurrentStep(2)}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <span>Continue to Location</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: LOCATION */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
              id="report-step-2"
            >
              <div>
                <span className="font-oswald text-xs uppercase tracking-widest text-[#ff9e30] font-bold">
                  Step 02 of 05
                </span>
                <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mt-1 drop-shadow">
                  Where is it happening?
                </h2>
                <p className="font-inter text-xs text-white/80 mt-0.5">
                  Provide exact ward and street details so municipal crews can locate it quickly.
                </p>
              </div>

              {/* Location Input Group & GPS Button */}
              <div className="space-y-3.5">
                {/* Ward / Area Selector */}
                <div>
                  <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold mb-1">
                    Municipal Ward / Area *
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => {
                      setWard(e.target.value);
                      if (!locationAddress || locationAddress.startsWith('Ward')) {
                        setLocationAddress(e.target.value);
                      }
                    }}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-inter text-white focus:outline-none focus:border-[#ff9e30]"
                  >
                    {KATHMANDU_WARDS.map((w) => (
                      <option key={w} value={w} className="bg-zinc-900 text-white">
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Location Input + Use My Location Button */}
                <div>
                  <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold mb-1">
                    Street Address / Landmark Details *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff9e30]" />
                      <input
                        type="text"
                        required
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="e.g. Ward 05, Kathmandu (Near Handigaun Chowk)"
                        className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={isLocating}
                      id="use-my-location-btn"
                      className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-black/30 hover:bg-black/50 text-[#ff9e30] border border-[#ff9e30]/40 font-inter text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                      <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Acquiring GPS...' : 'Use My Location'}</span>
                    </button>
                  </div>
                </div>

                {/* Location Success Toast */}
                {locationSuccessMsg && (
                  <div className="p-2.5 bg-emerald-950/60 border border-emerald-400/50 text-emerald-200 text-xs font-inter rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>{locationSuccessMsg}</span>
                  </div>
                )}

                {/* Interactive Map Preview Card */}
                <div className="bg-black/30 border border-white/20 rounded-2xl overflow-hidden shadow-inner">
                  <div className="p-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-oswald text-xs uppercase tracking-wider text-white/90 font-bold">
                        Location Preview • {locationAddress || 'Ward 05, Kathmandu'}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded border border-white/20">
                      GPS: {gpsCoordinates}
                    </span>
                  </div>

                  {/* Visual Map Canvas / Vector Grid Preview */}
                  <div className="relative h-40 sm:h-48 bg-black/40 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Road Network Lines */}
                    <svg className="absolute inset-0 w-full h-full stroke-white/20" strokeWidth="2">
                      <line x1="10%" y1="20%" x2="90%" y2="80%" />
                      <line x1="20%" y1="80%" x2="80%" y2="20%" />
                      <line x1="50%" y1="0%" x2="50%" y2="100%" strokeDasharray="4 4" stroke="#ff9e30" strokeOpacity="0.4" />
                      <circle cx="50%" cy="50%" r="50" fill="none" stroke="#ff9e30" strokeOpacity="0.2" strokeWidth="1" />
                    </svg>

                    {/* Centered Map Pin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-[#ff9e30] text-black flex items-center justify-center shadow-[0_0_20px_#ff9e30] animate-bounce">
                          <MapPin className="w-5 h-5 fill-black" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/80 rounded-full blur-[1px]" />
                      </div>
                      <div className="mt-1.5 bg-black/80 border border-[#ff9e30]/60 px-2.5 py-0.5 rounded-full shadow-lg text-center">
                        <span className="font-oswald text-[11px] uppercase font-bold text-[#ff9e30] tracking-wide">
                          {locationAddress || 'Ward 05, Kathmandu'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="cursor-pointer inline-flex items-center gap-1 px-4 py-2 rounded-full bg-black/25 hover:bg-black/40 text-white text-xs font-inter font-medium transition-colors border border-white/15"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Issue</span>
                </button>

                <button
                  type="button"
                  id="step2-continue-btn"
                  onClick={() => setCurrentStep(3)}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <span>Continue to Evidence</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: EVIDENCE */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
              id="report-step-3"
            >
              <div>
                <span className="font-oswald text-xs uppercase tracking-widest text-[#ff9e30] font-bold">
                  Step 03 of 05
                </span>
                <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mt-1 drop-shadow">
                  Can you show us the problem?
                </h2>
                <p className="font-inter text-xs text-white/80 mt-0.5">
                  Attach photographic proof to help authorities assess severity and dispatch the right equipment.
                </p>
              </div>

              {/* Large Drag-and-Drop / Upload Area: + Add Photo */}
              <div className="space-y-3.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {photoUrl ? (
                  /* Photo Preview Card */
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/40 group">
                    <img
                      src={photoUrl}
                      alt="Incident Evidence"
                      className="w-full h-52 sm:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="bg-black/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Photo Attached
                        </span>
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="p-1.5 rounded-full bg-black/70 hover:bg-red-950 text-white hover:text-red-300 transition-colors cursor-pointer"
                          title="Remove Photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/90 font-inter">
                          Incident proof
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-pointer text-xs font-inter font-bold px-3 py-1 rounded-lg bg-[#ff9e30] text-black hover:bg-[#ffb04f] transition-colors"
                        >
                          Replace Photo
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Drag & Drop Upload Zone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-white/30 hover:border-[#ff9e30] rounded-2xl p-6 sm:p-8 text-center transition-all bg-black/20 hover:bg-black/30 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-[#ff9e30]/20 flex items-center justify-center mx-auto text-[#ff9e30] transition-colors">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <h3 className="font-oswald text-base font-bold uppercase text-white tracking-wide mt-2.5">
                      + Add Photo
                    </h3>
                    <p className="font-inter text-xs text-white/70 mt-0.5 max-w-sm mx-auto">
                      Drag & drop your photo here, or click to browse
                    </p>
                  </div>
                )}

                {/* Quick Sample Photos */}
                <div>
                  <span className="text-[11px] font-oswald uppercase tracking-wider text-white/70 block mb-1.5">
                    Or select realistic sample incident photo:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ISSUE_OPTIONS.slice(0, 4).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPhotoUrl(opt.sampleImage)}
                        className={`cursor-pointer text-left p-1.5 rounded-xl border transition-all text-xs font-inter flex items-center gap-2 ${
                          photoUrl === opt.sampleImage
                            ? 'bg-white/20 border-[#ff9e30] text-[#ff9e30]'
                            : 'bg-black/30 border-white/15 text-white/70 hover:text-white hover:bg-black/40'
                        }`}
                      >
                        <img
                          src={opt.sampleImage}
                          alt={opt.label}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span className="truncate text-xs">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Description Textarea */}
                <div className="bg-black/30 border border-white/20 rounded-2xl p-3.5 space-y-1.5">
                  <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold">
                    Additional Details
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Tell us anything else that might help the authority understand the issue."
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] resize-none"
                  />
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="cursor-pointer inline-flex items-center gap-1 px-4 py-2 rounded-full bg-black/25 hover:bg-black/40 text-white text-xs font-inter font-medium transition-colors border border-white/15"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Location</span>
                </button>

                <button
                  type="button"
                  id="step3-continue-btn"
                  onClick={() => setCurrentStep(4)}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <span>Review Report</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: VERIFY / REVIEW */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
              id="report-step-4"
            >
              <div>
                <span className="font-oswald text-xs uppercase tracking-widest text-[#ff9e30] font-bold">
                  Step 04 of 05
                </span>
                <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mt-1 drop-shadow">
                  REVIEW YOUR REPORT
                </h2>
                <p className="font-inter text-xs text-white/80 mt-0.5">
                  Please verify all details before submitting to the municipal redressal dispatch.
                </p>
              </div>

              {/* Clean Summary Card */}
              <div className="bg-black/30 border border-white/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg">
                {/* Header Summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ff9e30] text-black flex items-center justify-center font-bold shadow-md">
                      {selectedCategory === 'Road Damage' && <AlertTriangle className="w-5 h-5" />}
                      {selectedCategory === 'Streetlight' && <Lightbulb className="w-5 h-5" />}
                      {selectedCategory === 'Water Leakage' && <Droplets className="w-5 h-5" />}
                      {selectedCategory === 'Garbage / Waste' && <Trash2 className="w-5 h-5" />}
                      {selectedCategory === 'Electricity' && <Zap className="w-5 h-5" />}
                      {selectedCategory === 'Public Facility' && <Building2 className="w-5 h-5" />}
                      {selectedCategory === 'Traffic / Road Sign' && <Compass className="w-5 h-5" />}
                      {selectedCategory === 'Other Problem' && <HelpCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-oswald text-base sm:text-lg font-bold uppercase text-white tracking-wide">
                        {selectedCategory}
                      </h3>
                      <p className="font-inter text-xs text-white/80">
                        {selectedCategory === 'Other Problem' && otherCategoryText ? otherCategoryText : 'Citizen Grievance Submission'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-inter font-bold px-2.5 py-0.5 rounded-full ${
                      priority === 'High Priority'
                        ? 'bg-red-500/30 text-red-200 border border-red-400'
                        : priority === 'Medium Priority'
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400'
                        : 'bg-sky-500/30 text-sky-200 border border-sky-400'
                    }`}
                  >
                    ● {priority}
                  </span>
                </div>

                {/* Key Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-3">
                    <div>
                      <span className="font-oswald text-[11px] uppercase tracking-widest text-white/60 font-bold block">
                        Location
                      </span>
                      <p className="font-inter text-xs sm:text-sm font-semibold text-white mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#ff9e30] shrink-0" />
                        <span>{locationAddress || ward}</span>
                      </p>
                      <p className="font-mono text-[11px] text-white/70 mt-0.5">
                        {ward} • {gpsCoordinates}
                      </p>
                    </div>

                    <div>
                      <span className="font-oswald text-[11px] uppercase tracking-widest text-white/60 font-bold block">
                        Description
                      </span>
                      <p className="font-inter text-xs text-white/90 mt-0.5 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/10">
                        {issueDescription || 'No primary description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Photo Preview */}
                  <div>
                    <span className="font-oswald text-[11px] uppercase tracking-widest text-white/60 font-bold block mb-1">
                      Attached Photo
                    </span>
                    {photoUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/20 h-36 sm:h-40 bg-black/40">
                        <img
                          src={photoUrl}
                          alt="Incident Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-36 rounded-xl border border-dashed border-white/25 flex items-center justify-center text-xs text-white/50 bg-black/20">
                        No photo attached
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions: EDIT and CONFIRM & SUBMIT */}
              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black/25 hover:bg-black/40 text-white text-xs font-inter font-bold uppercase tracking-wider transition-colors border border-white/20"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ff9e30]" />
                  <span>EDIT DETAILS</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  id="confirm-submit-btn"
                  className="cursor-pointer inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,158,48,0.4)] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>REGISTERING...</span>
                    </div>
                  ) : (
                    <>
                      <span>CONFIRM & SUBMIT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: SUBMISSION SUCCESS */}
          {/* ========================================================================= */}
          {currentStep === 5 && submittedReport && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-center py-4 sm:py-6 space-y-4"
              id="report-step-5-success"
            >
              {/* Success Badge Animation */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-full h-full rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
                </div>
              </div>

              <div>
                <span className="font-oswald text-xs uppercase tracking-widest text-emerald-300 font-bold block mb-1">
                  ✓ Grievance Registered
                </span>
                <h2 className="font-oswald text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white tracking-wider">
                  REPORT SUCCESSFULLY SUBMITTED
                </h2>
                <p className="font-inter text-xs sm:text-sm text-white/90 mt-1 max-w-md mx-auto">
                  Your report has been registered and dispatched to municipal authorities.
                </p>
              </div>

              {/* Unique Report ID Card */}
              <div className="max-w-md mx-auto bg-black/40 border border-[#ff9e30] rounded-2xl p-4 shadow-[0_0_25px_rgba(255,158,48,0.25)]">
                <span className="font-inter text-[11px] text-white/70 uppercase tracking-widest">
                  Unique Tracking ID
                </span>
                <div className="flex items-center justify-center gap-2.5 my-1.5">
                  <span
                    className="font-mono text-2xl sm:text-3xl font-extrabold text-[#ff9e30] tracking-wider"
                    id="generated-report-id"
                  >
                    {submittedReport.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(submittedReport.id)}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    title="Copy Report ID"
                  >
                    {copiedId ? (
                      <Check className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="font-inter text-[11px] text-white/70">
                  Keep this ID to track your report.
                </p>
              </div>

              {/* Summary Details Badge */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-xs text-white/80 font-inter bg-black/30 px-4 py-2 rounded-full border border-white/20">
                <span>Category: <strong className="text-white">{submittedReport.category}</strong></span>
                <span>•</span>
                <span>Location: <strong className="text-white">{submittedReport.location}</strong></span>
                <span>•</span>
                <span>Status: <strong className="text-[#ff9e30]">Submitted</strong></span>
              </div>

              {/* Buttons: VIEW MY REPORTS and BACK HOME */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  id="view-my-reports-cta"
                  onClick={onViewMyReports}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,158,48,0.3)] active:scale-95"
                >
                  <span>VIEW MY REPORTS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onTrackReport(submittedReport.id)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-black/30 hover:bg-black/50 text-white font-inter font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
                >
                  <span>TRACK THIS REPORT NOW</span>
                </button>

                <button
                  type="button"
                  onClick={onBackHome}
                  className="cursor-pointer px-5 py-3 rounded-full bg-transparent hover:bg-white/10 text-white/70 hover:text-white font-inter text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  BACK HOME
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
