import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, ThumbsUp, MessageSquare, CheckCircle, Plus, Send, ShieldCheck } from 'lucide-react';
import { Review } from '../types';
import { REVIEWS_DATA } from '../data/mockData';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [showWriteModal, setShowWriteModal] = useState(false);

  // New review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newTrail, setNewTrail] = useState('Annapurna Circuit & Thorong La');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newTips, setNewTips] = useState('');

  if (!isOpen) return null;

  const handleLike = (id: string) => {
    const isLiked = !!likedReviews[id];
    setLikedReviews((prev) => ({ ...prev, [id]: !isLiked }));
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 };
        }
        return r;
      })
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      trailName: newTrail,
      rating: newRating,
      date: 'Just Now',
      comment: newComment,
      likes: 1,
      verifiedHiker: true,
      tips: newTips.trim() || undefined,
    };

    setReviews([newRev, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setNewTips('');
    setShowWriteModal(false);
  };

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="reviews-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-5xl bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="reviews-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff9e30]/10 border border-[#ff9e30]/30 text-[#ff9e30]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-oswald text-xl sm:text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
                Adventurer Dispatch & Reviews
              </h2>
              <p className="text-xs text-zinc-400 font-inter">
                Real trek reports, summit reflections, and field tips from our global expedition community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWriteModal(!showWriteModal)}
              className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-4 py-2 text-xs font-oswald font-bold uppercase tracking-wider text-black transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Write Review</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
              id="close-reviews-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rating Overview Bar */}
        <div className="px-6 py-4 bg-[#0a0a0a] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-inter">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-anton text-2xl text-white">{avgRating}</span>
              <div className="flex text-[#ff9e30]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#ff9e30]" />
                ))}
              </div>
            </div>
            <span className="text-zinc-400">
              Based on {reviews.length} expedition logs & verified summit completions
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-[#ff9e30]" />
            <span>100% Verified Trail Reports</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#090909]">
          {/* Write Review Form Card */}
          {showWriteModal && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddReview}
              className="mb-6 p-5 rounded-xl bg-zinc-900/90 border border-[#ff9e30]/40 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-oswald text-base font-bold text-white uppercase flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#ff9e30]" />
                  Log Your Mountain Experience
                </h4>
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-inter">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff9e30]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Trail Name</label>
                  <select
                    value={newTrail}
                    onChange={(e) => setNewTrail(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#ff9e30]"
                  >
                    <option value="Annapurna Circuit & Thorong La">Annapurna Circuit & Thorong La</option>
                    <option value="Dolomites Alta Via 1">Dolomites Alta Via 1</option>
                    <option value="Torres del Paine W-Trek">Torres del Paine W-Trek</option>
                    <option value="Tour du Mont Blanc (TMB)">Tour du Mont Blanc (TMB)</option>
                    <option value="Inca Trail to Machu Picchu">Inca Trail to Machu Picchu</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Star Rating</label>
                  <div className="flex items-center gap-1 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'text-[#ff9e30] fill-[#ff9e30]' : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1 text-xs font-inter">
                  Expedition Review & Story
                </label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details regarding weather conditions, trail difficulty, campsite highlights..."
                  className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1 text-xs font-inter">
                  Pro-Tip for Fellow Hikers (Optional)
                </label>
                <input
                  type="text"
                  value={newTips}
                  onChange={(e) => setNewTips(e.target.value)}
                  placeholder="e.g. Best coffee spot, critical water source, clothing layer reminder"
                  className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#ff9e30]"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-[#ff9e30] hover:bg-[#ffb04f] px-6 py-2 text-xs font-oswald font-bold uppercase tracking-wider text-black flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Trail Log</span>
              </button>
            </motion.form>
          )}

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((rev) => {
              const isLiked = !!likedReviews[rev.id];
              return (
                <div
                  key={rev.id}
                  className="bg-[#121212] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-all"
                >
                  <div>
                    {/* Author Bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-oswald text-sm font-bold text-white">
                              {rev.author}
                            </span>
                            {rev.verifiedHiker && (
                              <CheckCircle className="w-3.5 h-3.5 text-[#ff9e30]" />
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 font-inter">
                            {rev.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex text-[#ff9e30]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#ff9e30]" />
                        ))}
                      </div>
                    </div>

                    {/* Trail Tag */}
                    <div className="mb-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-800 text-[#ff9e30] text-[10px] font-bold font-oswald uppercase tracking-wider">
                        {rev.trailName}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-zinc-300 font-inter leading-relaxed mb-4">
                      "{rev.comment}"
                    </p>

                    {/* Pro tip if exists */}
                    {rev.tips && (
                      <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] font-inter text-zinc-300 mb-4">
                        <span className="font-bold text-[#ff9e30] uppercase block text-[10px]">
                          Guide Pro-Tip:
                        </span>
                        <span>{rev.tips}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Reaction */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-inter text-zinc-400">
                    <button
                      onClick={() => handleLike(rev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-[#ff9e30]/20 text-[#ff9e30]'
                          : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{rev.likes} Helpful</span>
                    </button>
                    <span className="text-[11px] text-zinc-500">Verified Dispatch</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
