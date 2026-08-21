import React from 'react';

export const SEWA_SETU_LOGO_URL =
  'https://res.cloudinary.com/a8ns3wp6/image/upload/v1787318649/ChatGPT_Image_Aug_21_2026_07_06_47_PM.png';

interface SewaSetuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const SewaSetuLogo: React.FC<SewaSetuLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Height and scale styling with transparent container
  const sizeClasses = {
    sm: 'h-9 sm:h-10 max-h-10',
    md: 'h-11 sm:h-12 md:h-14 max-h-14',
    lg: 'h-13 sm:h-14 md:h-16 max-h-16',
    xl: 'h-16 sm:h-20 md:h-24 max-h-24',
  };

  return (
    <div
      className={`inline-flex items-center select-none bg-transparent ${className}`}
      id="sewa-setu-brand-logo"
    >
      <img
        src={SEWA_SETU_LOGO_URL}
        alt="Sewa Setu - Report, Track, Resolve"
        referrerPolicy="no-referrer"
        className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-200`}
        loading="eager"
      />
    </div>
  );
};
