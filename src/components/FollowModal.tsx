import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Bell, CheckCircle2, Shield, Gift, Sparkles, Copy, Check } from 'lucide-react';
import { SewaSetuLogo } from './SewaSetuLogo';

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export const FollowModal: React.FC<FollowModalProps> = ({
  isOpen,
  onClose,
  isFollowing,
  onToggleFollow,
}) => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFollowing) {
      onToggleFollow();
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('SEWASETU2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      id="follow-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-[#0e0e0e] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center"
        id="follow-modal"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          id="close-follow-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sewa Setu Logo (No Background) */}
        <div className="inline-block mb-4">
          <SewaSetuLogo size="md" showTagline={true} />
        </div>

        <div>
          <span className="text-[11px] font-oswald uppercase tracking-widest text-[#ff9e30] font-bold">
            Citizen & Explorer Network
          </span>
          <h3 className="font-oswald text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
            Sewa Setu Community
          </h3>
          <p className="text-xs text-zinc-300 font-inter mt-2 leading-relaxed max-w-sm mx-auto">
            Get instant resolution tracking, public grievance updates, community notifications, and field dispatches.
          </p>
        </div>

        {/* Member Perks */}
        <div className="my-5 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-left text-xs font-inter space-y-2">
          <div className="flex items-center gap-2 text-zinc-200">
            <Sparkles className="w-4 h-4 text-[#ff9e30] flex-shrink-0" />
            <span>Instant 10% Off Alpine Gear Store</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-[#ff9e30] flex-shrink-0" />
            <span>Free Verified GPX Route Downloads</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200">
            <Shield className="w-4 h-4 text-[#ff9e30] flex-shrink-0" />
            <span>High-Altitude Weather & Avalanche Dispatches</span>
          </div>
        </div>

        {/* Coupon Box */}
        <div className="mb-6 p-3 rounded-xl bg-[#ff9e30]/10 border border-[#ff9e30]/30 flex items-center justify-between">
          <div className="text-left text-xs font-inter">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">VIP Discount Code</span>
            <span className="font-mono font-bold text-sm text-[#ff9e30]">TRAILBLAZE2026</span>
          </div>
          <button
            onClick={handleCopyCoupon}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-inter text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-300" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Toggle */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              onToggleFollow();
              onClose();
            }}
            className={`cursor-pointer w-full py-3 rounded-xl font-oswald text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 ${
              isFollowing
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                : 'bg-[#ff9e30] hover:bg-[#ffb04f] text-black'
            }`}
          >
            {isFollowing ? 'Unfollow Notifications' : 'Follow & Enable Trail Alerts'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
