import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Send,
  CheckCircle2,
  Phone,
  Building,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ContactViewProps {
  onBackHome: () => void;
  onOpenReportIssue?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onBackHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reportId, setReportId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="contact-us-page">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-[#ff9e30] font-oswald text-xs uppercase tracking-widest font-bold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Citizen Redressal Support</span>
        </div>
        <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
          WE’RE LISTENING.
        </h1>
        <p className="font-inter text-sm sm:text-base text-white/80 mt-2 max-w-lg mx-auto">
          Have a question, suggestion, or need help with a report?
        </p>
      </div>

      {/* Main Content Box: Soft, Light Translucent Container */}
      <div className="bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-5"
            id="contact-success-state"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
              ✓ Thanks! Your message has been received.
            </h2>
            <p className="font-inter text-xs sm:text-sm text-white/80 max-w-md mx-auto">
              Our citizen redressal team will review your inquiry and respond within 24 business hours.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setReportId('');
                  setMessage('');
                  setSubmitted(false);
                }}
                className="cursor-pointer px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-inter font-medium transition-colors border border-white/15"
              >
                Send Another Message
              </button>
              <button
                type="button"
                onClick={onBackHome}
                className="cursor-pointer px-6 py-2.5 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black text-xs font-inter font-bold uppercase transition-colors"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diwash Shrestha"
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] focus:bg-black/40"
                />
              </div>

              <div>
                <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. citizen@example.com"
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] focus:bg-black/40"
                />
              </div>
            </div>

            <div>
              <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold mb-1.5">
                Report ID (Optional)
              </label>
              <input
                type="text"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                placeholder="e.g. SS-1048"
                className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 font-mono text-xs sm:text-sm uppercase text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] focus:bg-black/40"
              />
            </div>

            <div>
              <label className="block font-oswald text-xs uppercase tracking-widest text-white/90 font-bold mb-1.5">
                Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you with municipal redressal or citizen support?"
                className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-xs sm:text-sm font-inter text-white placeholder-white/50 focus:outline-none focus:border-[#ff9e30] focus:bg-black/40 resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Direct Support Email */}
              <div className="flex items-center gap-2 text-xs font-inter text-white/80">
                <Mail className="w-4 h-4 text-[#ff9e30]" />
                <span>Direct Support: <a href="mailto:support@sewasathi.com" className="text-white hover:text-[#ff9e30] font-semibold transition-colors">support@sewasathi.com</a></span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="send-message-btn"
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#ff9e30] hover:bg-[#ffb04f] text-black font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Emergency & Municipal Helpline Info */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-inter">
        <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl backdrop-blur-md">
          <div className="text-[#ff9e30] font-bold font-oswald text-sm uppercase">KMC Call Center</div>
          <div className="text-white/70 text-[11px] mt-0.5">Toll Free: 1180 / 16600105511</div>
        </div>
        <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl backdrop-blur-md">
          <div className="text-emerald-300 font-bold font-oswald text-sm uppercase">NEA Electricity Helpline</div>
          <div className="text-white/70 text-[11px] mt-0.5">Emergency Dispatch: 1150</div>
        </div>
        <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl backdrop-blur-md">
          <div className="text-sky-300 font-bold font-oswald text-sm uppercase">KUKL Water Supply</div>
          <div className="text-white/70 text-[11px] mt-0.5">Central Hotline: 1130</div>
        </div>
      </div>
    </div>
  );
};
