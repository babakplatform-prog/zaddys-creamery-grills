import React from 'react';

export const MadeForMomentsStamp: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 160 140"
        className="w-36 h-32 md:w-44 md:h-36 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Path for circular text */}
          <path
            id="stampCirclePath"
            d="M 125, 45 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
          />
        </defs>

        {/* Text along circle */}
        <text
          fill="#D3121B"
          fontSize="10"
          fontFamily="Cormorant Garamond, serif"
          fontWeight="500"
          letterSpacing="2.5"
          className="uppercase"
        >
          <textPath
            href="#stampCirclePath"
            startOffset="50%"
            textAnchor="middle"
          >
            Made For Moments
          </textPath>
        </text>

        {/* Delicate sweeping line arching toward the Menu title */}
        <path
          d="M 94 48 C 65 62, 30 52, -15 28"
          stroke="#D3121B"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="1 0"
          opacity="0.8"
        />

        {/* Small subtle inner dot or heart */}
        <circle cx="125" cy="45" r="1.5" fill="#D3121B" opacity="0.6" />
      </svg>
    </div>
  );
};
