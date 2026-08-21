import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Shield, Users, Calendar, Mountain, Compass, Radio, CheckCircle2, ArrowRight, ArrowLeft, Download } from 'lucide-react';
import { ExpeditionPlan } from '../types';

interface PlanExpeditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrail?: string;
}

export const PlanExpeditionModal: React.FC<PlanExpeditionModalProps> = ({
  isOpen,
  onClose,
  preselectedTrail,
}) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState(preselectedTrail || 'Annapurna Circuit & Thorong La');
  const [durationDays, setDurationDays] = useState(10);
  const [groupSize, setGroupSize] = useState(2);
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [guideService, setGuideService] = useState<'Self-Guided (GPS Track)' | 'Certified Lead Guide' | 'Full Expedition Team (Guide + Porters)'>('Certified Lead Guide');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'Satellite Emergency Beacon (Garmin inReach)',
    'National Park Permits & Environmental Fees',
  ]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [planCode, setPlanCode] = useState('');

  if (!isOpen) return null;

  const addonOptions = [
    { name: 'Satellite Emergency Beacon (Garmin inReach)', price: 75, desc: '24/7 Global SOS dispatch with live family tracking' },
    { name: 'National Park Permits & Environmental Fees', price: 90, desc: 'Complete conservation zone permits handled by basecamp' },
    { name: '4-Season Geodesic Expedition Tent Rental', price: 120, desc: 'Storm-rated high-altitude shelter tested to 90 km/h winds' },
    { name: 'Technical Glacier Gear (Crampons, Axe, Harness)', price: 110, desc: 'High-grade alpine safety hardware inspected prior to departure' },
    { name: 'Comprehensive Mountain Helicopter Evacuation Insurance', price: 160, desc: 'Up to $100k emergency high-altitude rescue coverage' },
  ];

  // Dynamic cost calculation
  const baseDailyRate =
    guideService === 'Self-Guided (GPS Track)' ? 35 : guideService === 'Certified Lead Guide' ? 120 : 190;
  const addonsTotal = selectedAddons.reduce((sum, item) => {
    const opt = addonOptions.find((o) => o.name === item);
    return sum + (opt ? opt.price : 0);
  }, 0);
  const estimatedCostPerPerson = Math.round(baseDailyRate * durationDays + addonsTotal);

  const toggleAddon = (name: string) => {
    if (selectedAddons.includes(name)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== name));
    } else {
      setSelectedAddons([...selectedAddons, name]);
    }
  };

  const handleConfirmPlan = () => {
    const code = `EXP-${Math.floor(10000 + Math.random() * 90000)}`;
    setPlanCode(code);
    setIsConfirmed(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="plan-expedition-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="plan-expedition-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff9e30]/10 border border-[#ff9e30]/30 text-[#ff9e30]">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
                Fix An Expedition Plan
              </h2>
              <p className="text-xs text-zinc-400 font-inter">
                Custom logistical blueprint, certified guides, permits, and equipment rentals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
            id="close-plan-expedition-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isConfirmed && (
          <div className="px-6 py-3 bg-[#0a0a0a] border-b border-zinc-800 flex items-center justify-between text-xs font-inter">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      step === s
                        ? 'bg-[#ff9e30] text-black shadow'
                        : step > s
                        ? 'bg-zinc-800 text-[#ff9e30]'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                  </span>
                  <span
                    className={`hidden sm:inline font-oswald uppercase ${
                      step === s ? 'text-white font-bold' : 'text-zinc-500'
                    }`}
                  >
                    {s === 1 ? 'Destination & Team' : s === 2 ? 'Support Level' : 'Rentals & Review'}
                  </span>
                  {s < 3 && <span className="text-zinc-700 mx-1">/</span>}
                </div>
              ))}
            </div>

            <div className="text-right">
              <span className="text-zinc-400 text-[11px]">Est. Cost per Person: </span>
              <span className="font-anton text-base text-[#ff9e30]">${estimatedCostPerPerson}</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#090909]">
          {isConfirmed ? (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#ff9e30]/10 border border-[#ff9e30] flex items-center justify-center text-[#ff9e30] mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs text-[#ff9e30] font-oswald uppercase tracking-widest font-bold">
                Expedition Reservation Locked
              </span>
              <h3 className="font-oswald text-3xl font-bold text-white uppercase mt-1">
                Plan Code #{planCode}
              </h3>
              <p className="text-xs text-zinc-300 font-inter mt-3 leading-relaxed">
                Your custom expedition blueprint for <strong>{destination}</strong> ({durationDays} Days, {groupSize} Trekkers) has been assigned to a Senior Expedition Officer.
              </p>

              <div className="mt-6 w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-left text-xs font-inter space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Support Tier:</span>
                  <span className="text-white font-semibold">{guideService}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Selected Add-ons:</span>
                  <span className="text-[#ff9e30] font-semibold">{selectedAddons.length} included</span>
                </div>
                <div className="flex justify-between text-zinc-400 border-t border-zinc-800 pt-2">
                  <span>Estimated Total per Person:</span>
                  <span className="font-anton text-white text-sm">${estimatedCostPerPerson}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 text-xs font-inter font-semibold text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Manifest</span>
                </button>
                <button
                  onClick={onClose}
                  className="cursor-pointer rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-6 py-2.5 text-xs font-oswald font-bold uppercase tracking-wider text-black transition-all shadow-md active:scale-95"
                >
                  Back to Sewa Setu
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* Step 1: Destination & Team */
            <div className="space-y-5 text-xs font-inter">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-[#ff9e30]" />
                  Select Mountain Range / Trailhead
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff9e30]"
                >
                  <option value="Annapurna Circuit & Thorong La (Nepal)">Annapurna Circuit & Thorong La (Nepal)</option>
                  <option value="Torres del Paine W-Trek (Patagonia)">Torres del Paine W-Trek (Patagonia)</option>
                  <option value="Tour du Mont Blanc (Alps France/Italy/Swiss)">Tour du Mont Blanc (Alps France/Italy/Swiss)</option>
                  <option value="Dolomites Alta Via 1 (Italian Alps)">Dolomites Alta Via 1 (Italian Alps)</option>
                  <option value="Classic Inca Trail to Machu Picchu (Peru)">Classic Inca Trail to Machu Picchu (Peru)</option>
                  <option value="Custom High Alpine Wilderness Route">Custom High Alpine Wilderness Route</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#ff9e30]" />
                      Expedition Length
                    </label>
                    <span className="font-oswald text-sm font-bold text-[#ff9e30]">
                      {durationDays} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="21"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full accent-[#ff9e30] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#ff9e30]" />
                      Team Members / Group Size
                    </label>
                    <span className="font-oswald text-sm font-bold text-[#ff9e30]">
                      {groupSize} Trekkers
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full accent-[#ff9e30] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-2">
                  Team Mountain Experience Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSkillLevel(lvl)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        skillLevel === lvl
                          ? 'bg-[#ff9e30]/20 border-[#ff9e30] text-white font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-oswald text-sm uppercase">{lvl}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            /* Step 2: Support Tier */
            <div className="space-y-4 text-xs font-inter">
              <label className="text-zinc-300 font-semibold block text-sm">
                Choose Your Trail Guidance & Support Level
              </label>

              {[
                {
                  tier: 'Self-Guided (GPS Track)' as const,
                  price: '$35 / day',
                  desc: 'Curated offline GPX tracks, emergency remote satellite check-in, pre-booked refugio beds & route briefing.',
                },
                {
                  tier: 'Certified Lead Guide' as const,
                  price: '$120 / day',
                  desc: 'Certified IFMGA/NNMGA mountain leader, pacing oversight, alpine ecology insights, medical wilderness first aid kit.',
                },
                {
                  tier: 'Full Expedition Team (Guide + Porters)' as const,
                  price: '$190 / day',
                  desc: 'Lead mountain guide + dedicated porters handling 15kg duffel bags per hiker, hot camp meals, and camp setup.',
                },
              ].map((opt) => {
                const isSelected = guideService === opt.tier;
                return (
                  <button
                    key={opt.tier}
                    type="button"
                    onClick={() => setGuideService(opt.tier)}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-start ${
                      isSelected
                        ? 'bg-zinc-800 border-[#ff9e30] shadow-[0_0_15px_rgba(255,158,48,0.25)]'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-4 w-4 rounded-full border items-center justify-center ${
                            isSelected ? 'border-[#ff9e30] bg-[#ff9e30]' : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
                        </span>
                        <h4 className="font-oswald text-base font-bold text-white uppercase tracking-wide">
                          {opt.tier}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 font-inter pl-6 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                    <span className="font-anton text-base text-[#ff9e30] whitespace-nowrap pl-4">
                      {opt.price}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Step 3: Rentals & Confirmation */
            <div className="space-y-4 text-xs font-inter">
              <label className="text-zinc-300 font-semibold block text-sm">
                Optional Equipment Rentals & Emergency Upgrades
              </label>

              <div className="space-y-2.5">
                {addonOptions.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.name);
                  return (
                    <div
                      key={addon.name}
                      onClick={() => toggleAddon(addon.name)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-zinc-800/90 border-[#ff9e30]/60'
                          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-4 w-4 rounded items-center justify-center border ${
                            isChecked ? 'bg-[#ff9e30] border-[#ff9e30] text-black' : 'border-zinc-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{addon.name}</span>
                          <span className="text-[11px] text-zinc-400 block">{addon.desc}</span>
                        </div>
                      </div>
                      <span className="font-anton text-sm text-[#ff9e30] whitespace-nowrap pl-4">
                        +${addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isConfirmed && (
          <div className="p-5 border-t border-zinc-800 bg-[#121212] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-inter font-semibold text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-6 py-2.5 text-xs font-oswald font-bold uppercase tracking-wider text-black transition-all shadow-md active:scale-95"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmPlan}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-7 py-2.5 text-xs font-oswald font-bold uppercase tracking-wider text-black transition-all shadow-md active:scale-95"
              >
                <span>Lock In Expedition Blueprint</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
