import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Phone, MapPin, Send, ShieldAlert, Radio, Clock, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Expedition Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="contact-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="contact-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff9e30]/10 border border-[#ff9e30]/30 text-[#ff9e30]">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
                Basecamp Dispatch & Contact
              </h2>
              <p className="text-xs text-zinc-400 font-inter">
                Reach our expedition coordinators, certified mountain guides & 24/7 emergency dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
            id="close-contact-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#090909]">
          {/* Left: Basecamp Locations & Emergency Dispatch */}
          <div className="lg:col-span-5 space-y-4 text-xs font-inter">
            {/* Emergency Hotline */}
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 text-red-200">
              <div className="flex items-center gap-2 text-red-400 font-oswald text-sm font-bold uppercase mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>24/7 Global Satellite SOS Dispatch</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-300">
                Direct frequency patch to Garmin inReach & SPOT rescue coordination center.
              </p>
              <div className="mt-2 font-mono text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-red-700/40">
                HOTLINE: +1 (800) 555-TRAIL-SOS
              </div>
            </div>

            {/* Basecamps */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h4 className="font-oswald text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff9e30]" />
                Primary Expedition Hubs
              </h4>
              <div className="space-y-2 text-zinc-300 text-[11px]">
                <div>
                  <span className="font-bold text-white block">Himalayan Basecamp (Nepal):</span>
                  <span>Thamel Marg, Ward 26, Kathmandu</span>
                </div>
                <div>
                  <span className="font-bold text-white block">Alpine Alps Division (Europe):</span>
                  <span>Rue du Docteur Paccard, 74400 Chamonix, France</span>
                </div>
                <div>
                  <span className="font-bold text-white block">Patagonia Wilds (South America):</span>
                  <span>Av. San Martín, El Chaltén, Santa Cruz, Argentina</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center gap-3 text-zinc-400">
              <Clock className="w-4 h-4 text-[#ff9e30] flex-shrink-0" />
              <span>Typical expedition reply within 4 hours during active season.</span>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-[#0d0d0d] p-6 rounded-xl border border-zinc-800 flex flex-col justify-between">
            {isSent ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-[#ff9e30]/10 border border-[#ff9e30] flex items-center justify-center text-[#ff9e30] mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-oswald text-2xl font-bold text-white uppercase">
                  Dispatch Message Received
                </h4>
                <p className="text-xs text-zinc-400 font-inter max-w-sm mt-2 leading-relaxed">
                  Thank you, <strong>{name}</strong>. An expedition coordinator will review your route parameters and get back to <strong>{email}</strong> shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-6 cursor-pointer rounded-xl bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 text-xs font-inter font-semibold text-white transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-inter">
                <h4 className="font-oswald text-base font-bold text-white uppercase mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#ff9e30]" />
                  Direct Expedition Inquiry
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Liam Foster"
                      className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. liam@example.com"
                      className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Topic / Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff9e30]"
                  >
                    <option value="Expedition Inquiry">Expedition Logistics & Dates</option>
                    <option value="Private Guide Consultation">Private IFMGA Guide Consultation</option>
                    <option value="Gear Rental & Fitting">Gear Rental & Sizing Questions</option>
                    <option value="Permit Clearance">National Park Permits Clearance</option>
                    <option value="Corporate / Team Trek">Corporate & Large Team Expedition</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Expedition Details & Question</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us your targeted dates, group size, mountain experience level, or specific requirements..."
                    className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] py-3 text-xs font-oswald font-bold uppercase tracking-wider text-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Dispatch to Basecamp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
