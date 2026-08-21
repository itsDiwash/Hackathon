/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, NavTabType } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ReportIssueView } from './components/ReportIssueView';
import { MyReportsView } from './components/MyReportsView';
import { TrackReportView } from './components/TrackReportView';
import { ContactView } from './components/ContactView';
import { AuthorityLoginModal, AuthorityUser } from './components/AuthorityLoginModal';
import { ReportsProvider, useReports } from './context/ReportsContext';
import { HERO_SLIDES } from './data/mockData';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<NavTabType>('HOME');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAuthorityLoginOpen, setIsAuthorityLoginOpen] = useState(false);
  const [loggedInAuthority, setLoggedInAuthority] = useState<AuthorityUser | null>(null);

  const { selectedTrackId, setSelectedTrackId } = useReports();

  // Section Refs for in-page smooth navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const reportIssueRef = useRef<HTMLDivElement>(null);
  const myReportsRef = useRef<HTMLDivElement>(null);
  const trackReportRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      const topPos = elementRef.current.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  };

  // Tab selection handler: smoothly scrolls to the appropriate section beneath hero
  const handleSelectTab = (tab: NavTabType) => {
    setActiveTab(tab);
    if (tab === 'HOME') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'REPORT ISSUE') {
      scrollToSection(reportIssueRef);
    } else if (tab === 'MY REPORT' || (tab as string) === 'MY REPORTS') {
      scrollToSection(myReportsRef);
    } else if (tab === 'TRACK MY REPORT') {
      scrollToSection(trackReportRef);
    } else if (tab === 'CONTACT US') {
      scrollToSection(contactRef);
    }
  };

  // Keyboard navigation for slides on HOME section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAuthorityLoginOpen) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthorityLoginOpen]);

  // Observer to update active navigation tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      const contactPos = contactRef.current ? contactRef.current.offsetTop : Infinity;
      const trackPos = trackReportRef.current ? trackReportRef.current.offsetTop : Infinity;
      const myReportsPos = myReportsRef.current ? myReportsRef.current.offsetTop : Infinity;
      const reportIssuePos = reportIssueRef.current ? reportIssueRef.current.offsetTop : Infinity;

      if (scrollPosition >= contactPos - 100) {
        setActiveTab('CONTACT US');
      } else if (selectedTrackId && scrollPosition >= trackPos - 100) {
        setActiveTab('TRACK MY REPORT');
      } else if (scrollPosition >= myReportsPos - 100) {
        setActiveTab('MY REPORT');
      } else if (scrollPosition >= reportIssuePos - 100) {
        setActiveTab('REPORT ISSUE');
      } else {
        setActiveTab('HOME');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedTrackId]);

  const currentSlide = HERO_SLIDES[currentSlideIndex] || HERO_SLIDES[0];

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#050505] text-white transition-all duration-700 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0.35) 100%), url('${currentSlide.bgImage}')`,
      }}
      id="app-root"
    >
      {/* Sleek, fully transparent top navigation bar without blur */}
      <div className="sticky top-0 z-50 w-full bg-gradient-to-b from-black/50 via-black/20 to-transparent transition-all">
        <Navbar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenAuthorityLogin={() => setIsAuthorityLoginOpen(true)}
          loggedInAuthority={loggedInAuthority}
        />
      </div>

      {/* Continuous Page Sections with Same Background (no blur) */}
      <main className="flex-1 flex flex-col w-full" id="main-content">
        {/* 1. HERO SECTION */}
        <section ref={heroRef} id="section-hero" className="w-full min-h-[calc(100vh-70px)] flex flex-col justify-center">
          <HeroSection
            slides={HERO_SLIDES}
            currentSlideIndex={currentSlideIndex}
            onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
            onExploreClick={() => {
              handleSelectTab('REPORT ISSUE');
            }}
            onMyReportsClick={() => {
              handleSelectTab('MY REPORT');
            }}
          />
        </section>

        {/* 2. REPORT ISSUE SECTION (Directly below hero with transparent crystal overlay) */}
        <section
          ref={reportIssueRef}
          id="section-report-issue"
          className="w-full py-12 md:py-20 border-t border-white/10 bg-black/10"
        >
          <ReportIssueView
            onBackHome={() => handleSelectTab('HOME')}
            onViewMyReports={() => handleSelectTab('MY REPORT')}
            onTrackReport={(reportId) => {
              setSelectedTrackId(reportId);
              setTimeout(() => {
                scrollToSection(trackReportRef);
              }, 100);
            }}
          />
        </section>

        {/* 3. MY REPORT SECTION */}
        <section
          ref={myReportsRef}
          id="section-my-reports"
          className="w-full py-12 md:py-20 border-t border-white/10 bg-black/10"
        >
          <MyReportsView
            onOpenReportIssue={() => handleSelectTab('REPORT ISSUE')}
            onTrackReport={(reportId) => {
              setSelectedTrackId(reportId);
              setTimeout(() => {
                scrollToSection(trackReportRef);
              }, 100);
            }}
          />
        </section>

        {/* 4. TRACK REPORT SECTION (When active or tracking a specific ID) */}
        <div ref={trackReportRef} id="section-track-report">
          {selectedTrackId && (
            <section className="w-full py-12 md:py-20 border-t border-white/10 bg-black/15">
              <TrackReportView
                initialReportId={selectedTrackId}
                onOpenReportIssue={() => handleSelectTab('REPORT ISSUE')}
                onBackToMyReports={() => handleSelectTab('MY REPORT')}
              />
            </section>
          )}
        </div>

        {/* 5. CONTACT US SECTION */}
        <section
          ref={contactRef}
          id="section-contact-us"
          className="w-full py-12 md:py-20 border-t border-white/10 bg-black/10"
        >
          <ContactView
            onBackHome={() => handleSelectTab('HOME')}
            onOpenReportIssue={() => handleSelectTab('REPORT ISSUE')}
          />
        </section>
      </main>

      {/* Authority Operations Portal Modal */}
      <AuthorityLoginModal
        isOpen={isAuthorityLoginOpen}
        onClose={() => setIsAuthorityLoginOpen(false)}
        loggedInAuthority={loggedInAuthority}
        onLogin={(user) => {
          setLoggedInAuthority(user);
        }}
        onLogout={() => {
          setLoggedInAuthority(null);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReportsProvider>
      <MainAppContent />
    </ReportsProvider>
  );
}
