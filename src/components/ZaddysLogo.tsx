import React, { useState } from 'react';

interface ZaddysLogoProps {
  customLogoUrl?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const ZaddysLogo: React.FC<ZaddysLogoProps> = ({
  customLogoUrl,
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  // Preferred image paths in order:
  // 1. User state uploaded logo
  // 2. /zaddys-logo.png in /public
  // 3. /logo.png in /public
  const logoSrc = customLogoUrl || '/zaddys-logo.png';

  const sizeClasses = {
    sm: 'h-10 w-auto',
    md: 'h-14 w-auto',
    lg: 'h-20 w-auto',
    xl: 'h-28 w-auto',
    '2xl': 'h-36 sm:h-44 md:h-48 w-auto',
  };

  if (!imgError) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <img
          src={logoSrc}
          alt="Zaddys Creamery & Grill Logo"
          className={`${sizeClasses[size]} object-contain filter drop-shadow-sm transition-transform duration-200`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Pixel-accurate SVG replica of the red Zaddys logo from the flyer
  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 90"
        className={`${sizeClasses[size]} w-auto max-w-full`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Zaddys Creamery & Grill"
      >
        <g filter="url(#glow)">
          {/* Stylized custom Zaddys typography */}
          <path
            d="M24 22 C35 20, 75 18, 76 25 C77 30, 48 48, 38 56 C30 62, 28 66, 32 67 C38 68, 70 66, 75 66 C77 66, 76 72, 73 73 C65 75, 26 77, 22 70 C20 66, 26 58, 35 48 C44 38, 62 27, 48 27 C36 27, 26 28, 22 28 Z"
            fill="#D3121B"
          />
          {/* 'a' */}
          <path
            d="M85 45 C81 44, 76 50, 76 58 C76 66, 82 72, 90 72 C96 72, 101 67, 103 62 L103 71 C103 72, 108 72, 110 71 L110 46 C110 40, 102 38, 93 40 C84 42, 82 46, 85 47 C88 48, 92 45, 98 45 C102 45, 103 48, 103 52 C100 52, 89 53, 85 57 C82 60, 83 66, 88 66 C93 66, 99 63, 102 58 L102 54 C102 48, 96 45, 85 45 Z"
            fill="#D3121B"
          />
          {/* First 'd' */}
          <path
            d="M135 18 L126 18 L126 46 C122 42, 115 41, 110 45 C103 50, 102 61, 105 68 C108 74, 116 75, 122 72 C125 70, 127 67, 128 64 L128 71 C128 72, 133 72, 135 71 Z M126 54 C126 62, 123 68, 117 68 C112 68, 110 63, 110 57 C110 50, 113 46, 118 46 C123 46, 126 50, 126 54 Z"
            fill="#D3121B"
          />
          {/* Second 'd' */}
          <path
            d="M162 18 L153 18 L153 46 C149 42, 142 41, 137 45 C130 50, 129 61, 132 68 C135 74, 143 75, 149 72 C152 70, 154 67, 155 64 L155 71 C155 72, 160 72, 162 71 Z M153 54 C153 62, 150 68, 144 68 C139 68, 137 63, 137 57 C137 50, 140 46, 145 46 C150 46, 153 50, 153 54 Z"
            fill="#D3121B"
          />
          {/* 'y' with deep swash */}
          <path
            d="M167 43 L175 43 L182 62 L190 43 L198 43 L184 73 C180 82, 174 88, 165 88 C160 88, 157 86, 156 84 C155 82, 158 80, 162 80 C168 80, 172 76, 175 70 L167 43 Z"
            fill="#D3121B"
          />
          {/* 's' */}
          <path
            d="M202 59 C202 54, 207 51, 214 50 C219 49, 221 47, 221 45 C221 42, 217 41, 212 41 C206 41, 203 44, 201 45 C200 46, 198 44, 199 42 C201 39, 206 37, 213 37 C222 37, 228 41, 228 47 C228 53, 223 55, 216 57 C210 58, 208 60, 208 63 C208 66, 212 68, 218 68 C224 68, 228 65, 230 63 C231 62, 233 64, 232 66 C229 70, 224 72, 217 72 C207 72, 202 66, 202 59 Z"
            fill="#D3121B"
          />
        </g>
        <defs>
          <filter id="glow" x="0" y="0" width="280" height="90" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#900b12" floodOpacity="0.25" />
          </filter>
        </defs>
      </svg>
      <span className="text-[10px] tracking-[0.25em] uppercase text-[#D3121B] font-medium -mt-1 font-serif-luxury">
        Creamery &amp; Grill
      </span>
    </div>
  );
};
