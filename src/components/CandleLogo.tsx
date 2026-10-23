import React from 'react';

interface CandleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const CandleLogo: React.FC<CandleLogoProps> = ({
  className = '',
  size = 'md',
  onClick,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconSize = isSm ? 22 : isLg ? 36 : 28;
  const textSize = isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Soft amber radial glow behind the flame */}
        <div className="absolute w-8 h-8 rounded-full bg-[#E8A33D]/25 blur-md pointer-events-none" />

        <svg
          width={iconSize}
          height={iconSize * 1.3}
          viewBox="0 0 32 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Candle stick body */}
          <rect x="11" y="22" width="10" height="18" rx="2" fill="#F3E6D0" />
          <path d="M11 22C11 20.8 13.5 20 16 20C18.5 20 21 20.8 21 22V24H11V22Z" fill="#E6D4BA" />

          {/* Wick */}
          <line x1="16" y1="20" x2="16" y2="15" stroke="#2A1A12" strokeWidth="1.5" strokeLinecap="round" />

          {/* Flickering Flame */}
          <g className="animate-candle-flame">
            {/* Outer flame */}
            <path
              d="M16 2C16 2 21 8 21 13C21 16.31 18.76 18 16 18C13.24 18 11 16.31 11 13C11 8 16 2 16 2Z"
              fill="#E8A33D"
            />
            {/* Inner flame core */}
            <path
              d="M16 6C16 6 18.8 10 18.8 13C18.8 14.8 17.5 16 16 16C14.5 16 13.2 14.8 13.2 13C13.2 10 16 6 16 6Z"
              fill="#FAF3E8"
            />
            {/* Tiny burnt orange base of flame */}
            <ellipse cx="16" cy="15.5" rx="2" ry="1.2" fill="#C8621F" opacity="0.7" />
          </g>

          {/* Candle holder base */}
          <path
            d="M6 39C6 38.45 6.45 38 7 38H25C25.55 38 26 38.45 26 39C26 39.55 25.55 40 25 40H7C6.45 40 6 39.55 6 39Z"
            fill="#8C3B1E"
          />
        </svg>
      </div>

      <span className={`font-serif tracking-tight font-medium text-[#F3E6D0] ${textSize}`}>
        Candle<span className="text-[#E8A33D] font-normal">Wick</span>
      </span>
    </div>
  );
};
