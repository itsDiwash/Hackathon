import React from 'react';
import { SewaSetuLogo } from './SewaSetuLogo';
import { AuthorityUser } from './AuthorityLoginModal';

export type NavTabType = 'HOME' | 'REPORT ISSUE' | 'MY REPORT' | 'TRACK MY REPORT' | 'CONTACT US';

interface NavbarProps {
  activeTab: NavTabType;
  onSelectTab: (tab: NavTabType) => void;
  onOpenAuthorityLogin: () => void;
  loggedInAuthority?: AuthorityUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuthorityLogin,
  loggedInAuthority,
}) => {
  const navItems: NavTabType[] = [
    'HOME',
    'REPORT ISSUE',
    'MY REPORT',
    'CONTACT US',
  ];

  return (
    <header className="relative z-30 w-full bg-transparent" id="main-header">
      <nav
        className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-8 py-2 md:px-12 lg:px-16"
        id="navbar-container"
      >
        {/* Sewa Setu Brand Logo */}
        <button
          onClick={() => onSelectTab('HOME')}
          className="group flex items-center text-left focus:outline-none transition-transform duration-300 hover:scale-[1.02] cursor-pointer bg-transparent py-0.5"
          id="brand-logo-btn"
          aria-label="Sewa Setu Home"
        >
          <SewaSetuLogo size="md" showTagline={true} />
        </button>

        {/* Always-Visible Navigation Links (Desktop & Mobile) */}
        <div
          className="flex items-center gap-4 sm:gap-6 md:gap-9 overflow-x-auto py-1 max-w-full"
          id="nav-links"
        >
          {navItems.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`nav-link-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectTab(tab)}
                className={`relative font-oswald font-bold text-[13px] sm:text-[15px] uppercase tracking-[1px] whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {tab}
                {isActive && (
                  <span
                    className="absolute -top-1 -right-2.5 h-2 w-2 rounded-full bg-[#ff9e30] shadow-[0_0_8px_#ff9e30] pulse-indicator"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Actions: Authority Login CTA */}
        <div className="flex items-center gap-3 sm:gap-4" id="navbar-actions">
          <button
            id="authority-login-btn"
            onClick={onOpenAuthorityLogin}
            className={`cursor-pointer rounded-full px-5 sm:px-7 py-2 sm:py-2.5 font-inter text-[13px] sm:text-[14px] font-bold tracking-wide transition-all duration-200 focus:outline-none shadow-md ${
              loggedInAuthority
                ? 'bg-zinc-800 text-[#ff9e30] border border-[#ff9e30]/40 hover:bg-zinc-700'
                : 'bg-[#ff9e30] text-black hover:bg-[#ffb04f] hover:shadow-[0_0_15px_rgba(255,158,48,0.4)] active:scale-95'
            }`}
          >
            {loggedInAuthority ? `${loggedInAuthority.officerId} (ACTIVE)` : 'AUTHORITY LOGIN'}
          </button>
        </div>
      </nav>
    </header>
  );
};

