import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mountain, MapPin, Calendar, Compass, ShieldAlert, Award, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { Trail } from '../types';
import { CURATED_TRAILS } from '../data/mockData';

interface TrailExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrailForPlan: (trailName: string) => void;
}

export const TrailExplorerModal: React.FC<TrailExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectTrailForPlan,
}) => {
  const [selectedTrail, setSelectedTrail] = useState<Trail>(CURATED_TRAILS[0]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [downloadedGpx, setDownloadedGpx] = useState(false);

  if (!isOpen) return null;

  const filteredTrails = CURATED_TRAILS.filter((trail) => {
    if (filterDifficulty === 'All') return true;
    return trail.difficulty === filterDifficulty;
  });

  const handleDownloadGpx = () => {
    setDownloadedGpx(true);
    setTimeout(() => setDownloadedGpx(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      id="trail-explorer-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-5xl bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="trail-explorer-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff9e30]/10 border border-[#ff9e30]/30 text-[#ff9e30]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold tracking-wider text-white uppercase">
                Curated Expedition Routes
              </h2>
              <p className="text-xs text-zinc-400 font-inter">
                Verified GPS tracks, elevation waypoints, and logistical permits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
            id="close-trail-explorer-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Trail List */}
          <div className="lg:col-span-5 p-5 border-r border-zinc-800 bg-[#090909] flex flex-col gap-4">
            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Moderate', 'Challenging'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-full text-xs font-inter font-semibold transition-all cursor-pointer ${
                    filterDifficulty === diff
                      ? 'bg-[#ff9e30] text-black shadow-sm'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Trail Cards */}
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {filteredTrails.map((trail) => {
                const isSelected = selectedTrail.id === trail.id;
                return (
                  <button
                    key={trail.id}
                    onClick={() => setSelectedTrail(trail)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-center ${
                      isSelected
                        ? 'bg-zinc-800/90 border-[#ff9e30] shadow-[0_0_15px_rgba(255,158,48,0.2)]'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40'
                    }`}
                  >
                    <img
                      src={trail.image}
                      alt={trail.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#ff9e30] font-oswald uppercase tracking-wider">
                          {trail.country}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-inter">
                          ★ {trail.rating} ({trail.reviewsCount})
                        </span>
                      </div>
                      <h4 className="font-oswald text-base font-bold text-white truncate">
                        {trail.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-inter mt-1">
                        <span>{trail.distance}</span>
                        <span>•</span>
                        <span>{trail.typicalDuration}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Trail Detail */}
          <div className="lg:col-span-7 p-6 bg-[#0d0d0d] flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Cover Banner */}
              <div className="relative h-48 rounded-xl overflow-hidden mb-6 border border-zinc-800">
                <img
                  src={selectedTrail.image}
                  alt={selectedTrail.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#ff9e30] text-black text-[11px] font-bold font-inter uppercase tracking-wider mb-1">
                      {selectedTrail.difficulty}
                    </span>
                    <h3 className="font-oswald text-2xl font-bold text-white tracking-wide">
                      {selectedTrail.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 font-inter">Max Alt</span>
                    <p className="font-anton text-xl text-[#ff9e30]">
                      {selectedTrail.elevationMax}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-zinc-300 font-inter leading-relaxed mb-6">
                {selectedTrail.summary}
              </p>

              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-[11px] text-zinc-400 font-inter block">Distance</span>
                  <span className="font-oswald text-base font-bold text-white">{selectedTrail.distance}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-[11px] text-zinc-400 font-inter block">Ascent</span>
                  <span className="font-oswald text-base font-bold text-white">{selectedTrail.elevationGain}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-[11px] text-zinc-400 font-inter block">Time</span>
                  <span className="font-oswald text-base font-bold text-white">{selectedTrail.typicalDuration}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-[11px] text-zinc-400 font-inter block">Best Months</span>
                  <span className="font-oswald text-xs font-bold text-[#ff9e30]">{selectedTrail.bestMonths}</span>
                </div>
              </div>

              {/* Waypoints & Checkpoints */}
              <div className="mb-6">
                <h4 className="font-oswald text-sm font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-[#ff9e30]" />
                  Key Elevation Checkpoints
                </h4>
                <div className="space-y-2">
                  {selectedTrail.checkpoints.map((cp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-inter"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-[#ff9e30]">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-zinc-200">{cp.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400">
                        <span className="font-mono text-[#ff9e30]">{cp.alt}</span>
                        <span>({cp.distance})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permits & Water info */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs font-inter space-y-2 mb-6">
                <div className="flex items-center gap-2 text-zinc-300">
                  <ShieldAlert className="w-4 h-4 text-[#ff9e30]" />
                  <span className="font-semibold text-white">Permits:</span>
                  <span>{selectedTrail.permitRequired ? 'National Park & Trekker Card Required (We facilitate)' : 'Open access / No technical permits needed'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Award className="w-4 h-4 text-[#ff9e30]" />
                  <span className="font-semibold text-white">Water Strategy:</span>
                  <span>{selectedTrail.waterSources}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={handleDownloadGpx}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-inter font-semibold text-white transition-colors"
              >
                {downloadedGpx ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>GPS File Saved (.GPX)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-zinc-300" />
                    <span>Download GPX Track</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onSelectTrailForPlan(selectedTrail.name);
                  onClose();
                }}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-6 py-2.5 text-xs font-inter font-bold text-black uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span>Fix Expedition Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
