import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { TrailSlide } from '../types';

interface HeroSectionProps {
  slides: TrailSlide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onExploreClick: () => void;
  onMyReportsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onExploreClick,
  onMyReportsClick,
}) => {
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handlePrevSlide = () => {
    onSelectSlide((currentSlideIndex - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    onSelectSlide((currentSlideIndex + 1) % slides.length);
  };

  return (
    <section
      className="relative flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-28 min-h-[calc(100vh-100px)] -mt-10 select-none"
      id="hero-section"
    >
      <div className="max-w-4xl z-10 py-12">
        {/* Animated Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col"
          >
            {/* Civic Location Subtitle Tag */}
            <div className="flex items-center gap-2 text-[#ff9e30] font-oswald text-xs sm:text-sm tracking-[2.5px] uppercase font-bold mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>KATHMANDU VALLEY • CIVIC SERVICES</span>
            </div>

            {/* Unified Hero Title: SAME font family and balanced size */}
            <div className="hero-title flex flex-col gap-1">
              <h1
                className="font-anton text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-[2px] leading-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                id="hero-title-line1"
              >
                REPORT • TRACK
              </h1>
              <h2
                className="font-anton text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#ff9e30] tracking-[2px] leading-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                id="hero-title-line2"
              >
                RESOLVE
              </h2>
            </div>

            {/* Description Text */}
            <p
              className="mt-5 max-w-[500px] text-sm sm:text-base leading-relaxed text-white font-normal font-inter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] whitespace-pre-line"
              id="hero-description"
            >
              {currentSlide.description}
            </p>

            {/* Civic Platform Demo Statistics Row without heavy blur or background blocks */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5" id="hero-civic-stats">
              {/* Stat 1: 128 Demo Reports */}
              <div className="flex items-center gap-2 bg-black/25 border border-white/20 px-3 py-1.5 rounded-full text-xs font-inter text-white shadow-sm drop-shadow">
                <FileText className="w-3.5 h-3.5 text-[#ff9e30]" />
                <span className="font-bold text-white">128</span>
                <span className="text-white/80">Demo Reports</span>
              </div>

              {/* Stat 2: Kathmandu Valley */}
              <div className="flex items-center gap-2 bg-black/25 border border-white/20 px-3 py-1.5 rounded-full text-xs font-inter text-white shadow-sm drop-shadow">
                <MapPin className="w-3.5 h-3.5 text-[#ff9e30]" />
                <span className="font-semibold text-white">Kathmandu Valley</span>
              </div>

              {/* Stat 3: 24/7 Reporting */}
              <div className="flex items-center gap-2 bg-black/25 border border-white/20 px-3 py-1.5 rounded-full text-xs font-inter text-white shadow-sm drop-shadow">
                <Zap className="w-3.5 h-3.5 text-[#ff9e30]" />
                <span className="font-semibold text-white">24/7</span>
                <span className="text-white/80">Reporting</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5" id="hero-action-buttons">
              {/* 1. REPORT AN ISSUE → */}
              <button
                id="hero-report-issue-btn"
                onClick={onExploreClick}
                className="cursor-pointer inline-flex items-center gap-2.5 rounded-full bg-[#ff9e30] px-7 py-3 font-inter text-sm font-bold text-black tracking-wide uppercase transition-all duration-300 hover:bg-[#ffb04f] hover:shadow-[0_0_20px_rgba(255,158,48,0.5)] hover:scale-[1.02] active:scale-95 focus:outline-none"
              >
                <span>REPORT AN ISSUE</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              {/* 2. MY REPORT */}
              <button
                id="hero-my-report-btn"
                onClick={onMyReportsClick}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-black/25 border border-white/25 px-6 py-3 font-inter text-sm font-semibold text-white tracking-wide transition-all duration-300 hover:bg-black/40 hover:border-white/50 hover:scale-[1.02] active:scale-95 focus:outline-none shadow-sm drop-shadow"
              >
                <FileText className="w-4 h-4 text-[#ff9e30]" />
                <span>MY REPORT</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Controls & Vertical Slider Dots (if multi-slide) */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
          id="slider-dots-container"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevSlide}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              aria-label="Previous Slide"
              id="prev-slide-btn"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2.5">
              {slides.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    id={`slider-dot-${idx}`}
                    onClick={() => onSelectSlide(idx)}
                    className={`transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${
                      isActive
                        ? 'w-7 h-2 bg-[#ff9e30] shadow-[0_0_10px_#ff9e30]'
                        : 'w-2 h-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}: ${slide.titleLine1}`}
                  />
                );
              })}
            </div>

            <button
              onClick={handleNextSlide}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              aria-label="Next Slide"
              id="next-slide-btn"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
