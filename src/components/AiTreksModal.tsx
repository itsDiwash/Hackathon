import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Mountain, Compass, ShieldCheck, Backpack, Calendar, Layers, Printer, RefreshCw, ChevronRight } from 'lucide-react';
import { AITrekResponse } from '../types';

interface AiTreksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForPlan?: (planData: any) => void;
}

export const AiTreksModal: React.FC<AiTreksModalProps> = ({
  isOpen,
  onClose,
  onSelectForPlan,
}) => {
  const [region, setRegion] = useState('Himalayas / Annapurna');
  const [durationDays, setDurationDays] = useState(7);
  const [fitnessLevel, setFitnessLevel] = useState('Moderate');
  const [season, setSeason] = useState('Autumn (October - November)');
  const [preferences, setPreferences] = useState('High alpine passes, tea houses, panoramic ridge sunsets, suspension bridges');
  const [isLoading, setIsLoading] = useState(false);
  const [trekPlan, setTrekPlan] = useState<AITrekResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPresets = [
    { name: 'Annapurna High Pass', region: 'Annapurna Sanctuary, Nepal', days: 12, fitness: 'Challenging', season: 'Autumn' },
    { name: 'Patagonia Glacier W-Trek', region: 'Torres del Paine, Chile', days: 5, fitness: 'Moderate', season: 'Summer (Dec - Feb)' },
    { name: 'Dolomites Alta Via 1', region: 'Dolomites Alps, Italy', days: 8, fitness: 'Moderate', season: 'Late Summer' },
    { name: 'High Sierra John Muir Trail', region: 'Sierra Nevada, California', days: 14, fitness: 'Strenuous', season: 'Summer' },
  ];

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/gemini/trek-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          durationDays,
          fitnessLevel,
          season,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data: AITrekResponse = await response.json();
      setTrekPlan(data);
    } catch (err: any) {
      console.error('Error generating AI trek:', err);
      setErrorMsg('Could not contact the expedition AI server. Displaying high-altitude curated backup route.');
      // Graceful fallback
      setTrekPlan({
        trailName: `${region} Guided Alpine Traverse`,
        tagline: `A tailor-made ${durationDays}-day alpine itinerary calibrated for ${fitnessLevel} hikers in ${season}.`,
        difficulty: fitnessLevel === 'Advanced' ? 'Strenuous (Grade IV)' : 'Moderate (Grade II-III)',
        elevationGain: '+4,200m total',
        distance: `${durationDays * 14} km total`,
        bestMonths: season,
        itinerary: [
          {
            day: 1,
            title: 'Basecamp Acclimatization & Gear Inspection',
            distance: '8 km',
            ascent: '+400m',
            summary: 'Trek along pine forests, cross glacial rivers, and dial in pack weight.'
          },
          {
            day: 2,
            title: 'Ascent to Upper Valley & Moraine Camp',
            distance: '14 km',
            ascent: '+850m',
            summary: 'Steady ascent over rocky terrain with views of soaring 7,000m summits.'
          },
          {
            day: 3,
            title: 'High Ridge Crossing & Alpine Tarns',
            distance: '16 km',
            ascent: '+950m',
            summary: 'Cross windswept pass, descending to a sheltered crystal-blue mountain lake.'
          },
          {
            day: 4,
            title: 'Summit Lookout & Refuge Bivouac',
            distance: '12 km',
            ascent: '+1,100m',
            summary: 'Early dawn alpine push for sunrise across jagged peaks.'
          },
          {
            day: 5,
            title: 'Valley Return & Expedition Debrief',
            distance: '11 km',
            ascent: '-1,200m',
            summary: 'Gentle scenic descent along waterfalls and celebration dinner with the crew.'
          }
        ],
        gearChecklist: [
          '50L Ergonomic technical trekking pack with integrated rain cover',
          'Vibram-lug waterproof mountaineering boots (broken in)',
          'Carbon fiber FlickLock trekking poles with snow baskets',
          '-10°C Hydrophobic down sleeping bag with compression sack',
          'Water filtration flask (0.1 micron) & emergency iodine tabs',
          'High-output 350 lumen rechargeable headlamp with spare battery'
        ],
        safetyTips: [
          'Adhere to the golden rule of high altitude: Climb high, sleep low.',
          'Hydrate with minimum 3-4 liters of water with electrolyte replenishment daily.',
          'Pack an emergency satellite GPS messenger (Garmin inReach / SPOT).',
          'Always turn back if sustained whiteout blizzard conditions develop on exposed ridges.'
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setRegion(preset.region);
    setDurationDays(preset.days);
    setFitnessLevel(preset.fitness);
    setSeason(preset.season);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="ai-treks-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-5xl bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="ai-treks-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff9e30]/10 border border-[#ff9e30]/30 text-[#ff9e30]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
                AI Expedition Scout & Route Architect
              </h2>
              <p className="text-xs text-zinc-400 font-inter">
                Powered by server-side Gemini intelligence — custom tailored trail pacing, elevation gains, and gear requirements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
            id="close-ai-treks-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#090909]">
          {/* Controls Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Presets */}
            <div>
              <span className="text-xs text-zinc-400 font-oswald uppercase tracking-wider block mb-2 font-semibold">
                Quick Expedition Presets
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className="text-left p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-[#ff9e30]/50 hover:bg-zinc-800/60 transition-all cursor-pointer text-xs"
                  >
                    <span className="font-bold text-white block truncate">{preset.name}</span>
                    <span className="text-[10px] text-zinc-400">{preset.days} Days • {preset.fitness}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-3.5 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs font-inter">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-[#ff9e30]" />
                  Destination / Mountain Range
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                  placeholder="e.g. Annapurna, Karakoram, Swiss Alps, Andes"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#ff9e30]" />
                    Expedition Duration
                  </label>
                  <span className="font-oswald text-sm font-bold text-[#ff9e30]">
                    {durationDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="21"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-[#ff9e30] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1.5">
                    Fitness Level
                  </label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#ff9e30]"
                  >
                    <option value="Beginner">Beginner (10km/day)</option>
                    <option value="Moderate">Moderate (15km/day)</option>
                    <option value="Challenging">Challenging (20km/day)</option>
                    <option value="Alpine Mountaineer">Alpine Mountaineer</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1.5">
                    Target Season
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#ff9e30]"
                  >
                    <option value="Autumn (Oct - Nov)">Autumn (Oct - Nov)</option>
                    <option value="Spring (Mar - May)">Spring (Mar - May)</option>
                    <option value="Summer (Jun - Aug)">Summer (Jun - Aug)</option>
                    <option value="Winter Alpine (Dec - Feb)">Winter Alpine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5">
                  Trek Style & Highlights
                </label>
                <textarea
                  rows={2}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                  placeholder="e.g. Glacier traverses, photography, tea houses, wild camping"
                />
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="w-full mt-2 cursor-pointer rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] disabled:bg-zinc-700 px-4 py-3 font-oswald text-sm font-bold uppercase tracking-wider text-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Architecting Trail Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Generate Tailored AI Trek</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 bg-[#0d0d0d] p-5 rounded-xl border border-zinc-800 flex flex-col justify-between overflow-y-auto">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="p-4 rounded-full bg-[#ff9e30]/10 border border-[#ff9e30]/30 text-[#ff9e30] animate-pulse mb-4">
                  <Compass className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="font-oswald text-lg font-bold text-white uppercase">
                  Analyzing Topography & Altitude Acclimatization
                </h3>
                <p className="text-xs text-zinc-400 font-inter max-w-sm mt-1">
                  Gemini is calculating daily elevation changes, water sources, and optimal campsite pacing for {region}...
                </p>
              </div>
            ) : trekPlan ? (
              <div className="space-y-6">
                {/* Plan Banner */}
                <div className="border-b border-zinc-800 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-[#ff9e30] text-black text-[11px] font-bold font-inter uppercase tracking-wider">
                      {trekPlan.difficulty}
                    </span>
                    <span className="text-xs text-zinc-400 font-inter">
                      Best: {trekPlan.bestMonths}
                    </span>
                  </div>
                  <h3 className="font-oswald text-2xl sm:text-3xl font-bold text-white uppercase mt-2">
                    {trekPlan.trailName}
                  </h3>
                  <p className="text-xs text-zinc-300 font-inter mt-1 italic">
                    "{trekPlan.tagline}"
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs font-inter text-zinc-300">
                    <div>
                      <span className="text-zinc-500">Total Distance:</span>{' '}
                      <span className="font-bold text-white">{trekPlan.distance}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Elevation Ascent:</span>{' '}
                      <span className="font-bold text-[#ff9e30]">{trekPlan.elevationGain}</span>
                    </div>
                  </div>
                </div>

                {/* Day by Day Itinerary */}
                <div>
                  <h4 className="font-oswald text-sm font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#ff9e30]" />
                    Day-by-Day Expedition Itinerary
                  </h4>
                  <div className="space-y-2.5">
                    {trekPlan.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs font-inter"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-oswald text-xs font-bold text-[#ff9e30] uppercase">
                            Day {day.day}: {day.title}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {day.distance} | {day.ascent}
                          </span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-[11px]">
                          {day.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gear & Safety Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gear */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <h5 className="font-oswald text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                      <Backpack className="w-3.5 h-3.5 text-[#ff9e30]" />
                      Mandatory Gear Checklist
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-zinc-300 font-inter">
                      {trekPlan.gearChecklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#ff9e30] font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <h5 className="font-oswald text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#ff9e30]" />
                      Altitude & Safety Protocols
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-zinc-300 font-inter">
                      {trekPlan.safetyTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#ff9e30] font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-inter font-semibold text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Itinerary</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectForPlan) {
                        onSelectForPlan(trekPlan);
                      }
                      onClose();
                    }}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-5 py-2 text-xs font-inter font-bold text-black uppercase tracking-wider transition-all"
                  >
                    <span>Proceed to Fix Plan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Compass className="w-12 h-12 text-zinc-600 mb-3" />
                <h3 className="font-oswald text-xl font-bold text-white uppercase">
                  Ready to Architect Your Dream Trek
                </h3>
                <p className="text-xs text-zinc-400 font-inter max-w-sm mt-1">
                  Select your destination parameters or choose a quick preset on the left, then click Generate Tailored AI Trek.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
