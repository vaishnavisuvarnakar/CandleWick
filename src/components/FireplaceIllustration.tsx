import React from 'react';

interface FireplaceIllustrationProps {
  variant?: 'banner' | 'spot' | 'compact';
  className?: string;
}

export const FireplaceIllustration: React.FC<FireplaceIllustrationProps> = ({
  variant = 'spot',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`w-full overflow-hidden rounded-2xl bg-[#3B2016]/40 border border-[#8C3B1E]/30 relative ${className}`}>
        {/* Ambient glow in banner */}
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-72 h-36 bg-[#E8A33D]/15 blur-3xl pointer-events-none" />

        <svg
          viewBox="0 0 900 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-48 block"
        >
          {/* Wall background gradient tone */}
          <rect width="900" height="240" fill="#1F120C" />
          <rect y="180" width="900" height="60" fill="#2A160F" />

          {/* Floor baseboard moulding */}
          <rect y="174" width="900" height="8" fill="#3B2016" />
          <rect y="172" width="900" height="2" fill="#8C3B1E" opacity="0.6" />

          {/* Cozy Bookshelf on Left */}
          <g transform="translate(60, 40)">
            <rect x="0" y="0" width="130" height="140" rx="3" fill="#3B2016" stroke="#8C3B1E" strokeWidth="2" />
            {/* Shelf dividers */}
            <rect x="6" y="44" width="118" height="4" fill="#8C3B1E" />
            <rect x="6" y="92" width="118" height="4" fill="#8C3B1E" />

            {/* Top shelf books */}
            <rect x="14" y="16" width="10" height="28" rx="1" fill="#8C3B1E" />
            <rect x="26" y="12" width="12" height="32" rx="1" fill="#C8621F" />
            <rect x="40" y="20" width="8" height="24" rx="1" fill="#F3E6D0" opacity="0.8" />
            <rect x="50" y="14" width="14" height="30" rx="1" fill="#3B2016" />
            <rect x="66" y="18" width="11" height="26" rx="1" fill="#E8A33D" opacity="0.85" />
            <path d="M80 44L94 20H104L90 44H80Z" fill="#8C3B1E" />

            {/* Middle shelf books */}
            <rect x="14" y="62" width="14" height="30" rx="1" fill="#C8621F" />
            <rect x="30" y="58" width="10" height="34" rx="1" fill="#F3E6D0" opacity="0.85" />
            <rect x="42" y="64" width="16" height="28" rx="1" fill="#8C3B1E" />
            <rect x="60" y="60" width="12" height="32" rx="1" fill="#E8A33D" opacity="0.9" />
            <rect x="74" y="66" width="9" height="26" rx="1" fill="#3B2016" />
            <rect x="85" y="62" width="13" height="30" rx="1" fill="#C8621F" />

            {/* Bottom shelf horizontal stack */}
            <rect x="20" y="126" width="48" height="10" rx="1" fill="#8C3B1E" />
            <rect x="24" y="116" width="40" height="10" rx="1" fill="#F3E6D0" opacity="0.8" />
            <rect x="28" y="108" width="32" height="8" rx="1" fill="#C8621F" />
            {/* Small potted succulent */}
            <path d="M92 136H110L107 124H95L92 136Z" fill="#C8621F" />
            <ellipse cx="101" cy="118" rx="6" ry="7" fill="#8C3B1E" />
          </g>

          {/* Wall framed print above armchair */}
          <g transform="translate(230, 36)">
            <rect x="0" y="0" width="70" height="60" rx="2" fill="#2A160F" stroke="#8C3B1E" strokeWidth="2" />
            <rect x="6" y="6" width="58" height="48" fill="#F3E6D0" />
            {/* Botanical branch inside frame */}
            <path d="M20 44C28 32 38 24 50 16" stroke="#3B2016" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="32" cy="30" rx="4" ry="2" transform="rotate(-30 32 30)" fill="#8C3B1E" />
            <ellipse cx="40" cy="24" rx="4" ry="2" transform="rotate(25 40 24)" fill="#C8621F" />
            <ellipse cx="46" cy="19" rx="3.5" ry="2" transform="rotate(-35 46 19)" fill="#8C3B1E" />
          </g>

          {/* Cozy Armchair */}
          <g transform="translate(260, 95)">
            {/* Wooden feet */}
            <path d="M12 90L8 105H15L17 90H12Z" fill="#2A160F" />
            <path d="M98 90L96 105H103L103 90H98Z" fill="#2A160F" />

            {/* Deep wingback body in rust */}
            <path
              d="M10 20C10 8 20 0 35 0H75C90 0 100 8 100 20V65C100 70 96 74 90 74H20C14 74 10 70 10 65V20Z"
              fill="#8C3B1E"
            />
            {/* Wings */}
            <path d="M6 14C3 24 4 45 10 52V20C10 16 8 14 6 14Z" fill="#3B2016" />
            <path d="M104 14C107 24 106 45 100 52V20C100 16 102 14 104 14Z" fill="#3B2016" />

            {/* Backrest tufted cushion texture */}
            <rect x="22" y="10" width="66" height="48" rx="8" fill="#C8621F" />
            {/* Tufting buttons */}
            <circle cx="40" cy="24" r="2.5" fill="#3B2016" />
            <circle cx="70" cy="24" r="2.5" fill="#3B2016" />
            <circle cx="55" cy="38" r="2.5" fill="#3B2016" />

            {/* Seat cushion */}
            <rect x="12" y="56" width="86" height="22" rx="6" fill="#8C3B1E" />

            {/* Rolled armrests */}
            <rect x="4" y="44" width="16" height="30" rx="8" fill="#C8621F" />
            <rect x="90" y="44" width="16" height="30" rx="8" fill="#C8621F" />

            {/* Cozy mustard/amber throw blanket draped on side */}
            <path
              d="M74 48C74 48 85 46 92 54C96 58 98 70 96 82C94 92 88 94 88 94L76 86V54L74 48Z"
              fill="#E8A33D"
            />
            {/* Fringe on blanket */}
            <line x1="88" y1="94" x2="86" y2="100" stroke="#E8A33D" strokeWidth="1.5" />
            <line x1="91" y1="94" x2="90" y2="100" stroke="#E8A33D" strokeWidth="1.5" />
            <line x1="94" y1="92" x2="94" y2="98" stroke="#E8A33D" strokeWidth="1.5" />
          </g>

          {/* Small side table with steaming mug */}
          <g transform="translate(385, 130)">
            {/* Table top */}
            <ellipse cx="25" cy="10" rx="24" ry="6" fill="#3B2016" stroke="#8C3B1E" strokeWidth="1.5" />
            {/* Pedestal and legs */}
            <rect x="23" y="16" width="4" height="42" fill="#2A160F" />
            <path d="M12 60L25 56L38 60" stroke="#2A160F" strokeWidth="3" strokeLinecap="round" />

            {/* Ceramic warm mug */}
            <rect x="20" y="0" width="10" height="9" rx="1.5" fill="#F3E6D0" />
            <path d="M30 2C32 2 33 4 33 6C33 8 32 8 30 8" stroke="#F3E6D0" strokeWidth="1.2" />
            {/* Steam curl */}
            <path d="M24 -2C22 -6 26 -8 24 -12" stroke="#E8A33D" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* Warm Hearth & Fireplace */}
          <g transform="translate(480, 48)">
            {/* Outer stone/brick mantle arch */}
            <rect x="0" y="0" width="220" height="15" rx="3" fill="#8C3B1E" />
            <rect x="10" y="15" width="200" height="145" fill="#3B2016" />

            {/* Brick accents */}
            <rect x="18" y="24" width="24" height="8" rx="1" fill="#8C3B1E" opacity="0.7" />
            <rect x="46" y="24" width="30" height="8" rx="1" fill="#2A160F" opacity="0.5" />
            <rect x="180" y="24" width="22" height="8" rx="1" fill="#8C3B1E" opacity="0.7" />
            <rect x="18" y="44" width="28" height="8" rx="1" fill="#2A160F" opacity="0.5" />

            {/* Firebox (dark inner cavity) */}
            <path
              d="M35 160V65C35 52 48 42 65 42H155C172 42 185 52 185 65V160H35Z"
              fill="#1F120C"
            />

            {/* Firebox inner hearth glow */}
            <ellipse cx="110" cy="148" rx="65" ry="25" fill="#C8621F" opacity="0.3" />
            <ellipse cx="110" cy="148" rx="45" ry="16" fill="#E8A33D" opacity="0.45" />

            {/* Fireplace grate & andirons */}
            <path d="M55 148H165" stroke="#2A1A12" strokeWidth="4" strokeLinecap="round" />
            <rect x="62" y="142" width="6" height="16" fill="#2A1A12" />
            <rect x="152" y="142" width="6" height="16" fill="#2A1A12" />

            {/* Birch/oak firewood logs */}
            <rect x="65" y="144" width="85" height="12" rx="3" transform="rotate(-6 65 144)" fill="#3B2016" />
            <rect x="70" y="140" width="80" height="11" rx="3" transform="rotate(7 70 140)" fill="#2A160F" />

            {/* Glowing Embers and Flames */}
            <g className="animate-candle-flame">
              {/* Outer flame */}
              <path
                d="M110 92C122 108 135 125 130 144C125 152 110 155 105 155C90 155 80 146 85 135C88 122 96 114 100 106C104 100 108 92 110 92Z"
                fill="#C8621F"
              />
              {/* Mid flame */}
              <path
                d="M112 104C120 116 126 128 122 144C118 150 108 152 104 152C94 152 92 144 95 136C98 126 104 118 108 112L112 104Z"
                fill="#E8A33D"
              />
              {/* Inner core flame */}
              <path
                d="M111 120C116 128 118 136 116 146C114 150 108 151 106 151C100 151 99 146 101 140C103 134 108 126 111 120Z"
                fill="#FAF3E8"
              />
            </g>

            {/* Mantelpiece decoration: Candle and clock/journal */}
            {/* Candle on mantle */}
            <rect x="40" y="-12" width="8" height="12" rx="1" fill="#F3E6D0" />
            <line x1="44" y1="-12" x2="44" y2="-15" stroke="#2A1A12" strokeWidth="1.2" />
            <ellipse cx="44" cy="-18" rx="2.5" ry="4" fill="#E8A33D" className="animate-candle-flame" />

            {/* Small book leaning on mantle */}
            <path d="M165 -16L180 -16L176 0H160L165 -16Z" fill="#8C3B1E" />
            <rect x="148" y="-12" width="10" height="12" rx="1" fill="#C8621F" />
          </g>

          {/* Sleeping Cat curled on warm hearth rug */}
          <g transform="translate(420, 192)">
            {/* Oval woven rug */}
            <ellipse cx="60" cy="18" rx="75" ry="16" fill="#3B2016" stroke="#8C3B1E" strokeWidth="1.5" />
            {/* Rug inner border fringe */}
            <ellipse cx="60" cy="18" rx="65" ry="12" fill="#2A160F" stroke="#C8621F" strokeDasharray="3 3" />

            {/* Curled cat in amber/brown */}
            <ellipse cx="62" cy="17" rx="14" ry="10" fill="#E8A33D" />
            <circle cx="72" cy="14" r="6" fill="#E8A33D" />
            {/* Ears */}
            <polygon points="73,9 76,4 78,10" fill="#C8621F" />
            <polygon points="69,9 71,5 73,10" fill="#C8621F" />
            {/* Curled tail */}
            <path d="M48 18C46 14 52 10 56 12" stroke="#E8A33D" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Warm hanging pendant lamp on right */}
          <g transform="translate(760, 0)">
            <line x1="25" y1="0" x2="25" y2="70" stroke="#8C3B1E" strokeWidth="2" />
            {/* Cone shade in rust */}
            <path d="M8 88H42L34 70H16L8 88Z" fill="#8C3B1E" />
            {/* Warm glowing bulb */}
            <ellipse cx="25" cy="88" rx="8" ry="5" fill="#E8A33D" />
            {/* Soft downlight cone */}
            <path d="M8 88L-20 220H70L42 88Z" fill="#E8A33D" opacity="0.08" />
          </g>
        </svg>
      </div>
    );
  }

  // Spot illustration (for empty state and modal headers)
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Ambient background soft glow */}
      <div className="absolute w-64 h-64 bg-[#E8A33D]/12 rounded-full blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 420 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[340px] sm:max-w-[400px] h-auto relative z-10"
      >
        {/* Floor base */}
        <ellipse cx="210" cy="270" rx="190" ry="24" fill="#2A160F" opacity="0.7" />

        {/* Woven Hearth Rug */}
        <ellipse cx="210" cy="265" rx="150" ry="22" fill="#3B2016" stroke="#8C3B1E" strokeWidth="2" />
        <ellipse cx="210" cy="265" rx="130" ry="17" fill="#24130C" stroke="#C8621F" strokeDasharray="4 4" />

        {/* Fireplace Hearth on Right */}
        <g transform="translate(210, 60)">
          {/* Mantle top */}
          <rect x="0" y="0" width="160" height="14" rx="2" fill="#8C3B1E" />
          {/* Surround */}
          <rect x="8" y="14" width="144" height="180" fill="#3B2016" />
          <rect x="14" y="22" width="22" height="10" rx="1" fill="#8C3B1E" opacity="0.6" />
          <rect x="120" y="22" width="24" height="10" rx="1" fill="#8C3B1E" opacity="0.6" />

          {/* Dark Firebox */}
          <path d="M25 194V80C25 66 38 56 52 56H116C130 56 143 66 143 80V194H25Z" fill="#1F120C" />

          {/* Warm fire glow */}
          <ellipse cx="84" cy="180" rx="46" ry="18" fill="#C8621F" opacity="0.4" />
          <ellipse cx="84" cy="180" rx="32" ry="12" fill="#E8A33D" opacity="0.5" />

          {/* Fire grate & logs */}
          <path d="M40 182H128" stroke="#2A1A12" strokeWidth="3" strokeLinecap="round" />
          <rect x="48" y="176" width="68" height="12" rx="2" transform="rotate(-6 48 176)" fill="#3B2016" />
          <rect x="52" y="172" width="62" height="10" rx="2" transform="rotate(7 52 172)" fill="#2A160F" />

          {/* Dancing Hearth Fire */}
          <g className="animate-candle-flame">
            <path
              d="M84 120C94 135 106 152 100 172C96 180 84 182 80 182C68 182 60 174 64 164C68 152 74 144 78 136L84 120Z"
              fill="#C8621F"
            />
            <path
              d="M86 132C92 144 98 154 94 170C90 176 82 178 79 178C71 178 70 170 73 162C76 153 80 146 83 140L86 132Z"
              fill="#E8A33D"
            />
            <path
              d="M85 146C89 154 92 162 89 172C87 175 82 176 80 176C76 176 75 172 77 166C78 160 82 154 85 146Z"
              fill="#FAF3E8"
            />
          </g>

          {/* Candle on Mantle */}
          <rect x="25" y="-12" width="7" height="12" rx="1" fill="#F3E6D0" />
          <line x1="28.5" y1="-12" x2="28.5" y2="-15" stroke="#2A1A12" strokeWidth="1.2" />
          <ellipse cx="28.5" cy="-18" rx="2" ry="3.5" fill="#E8A33D" className="animate-candle-flame" />

          {/* Clock or framed photo on mantle */}
          <rect x="110" y="-14" width="22" height="14" rx="2" fill="#8C3B1E" />
          <ellipse cx="121" cy="-7" rx="7" ry="5.5" fill="#F3E6D0" />
        </g>

        {/* Cozy Wingback Armchair on Left */}
        <g transform="translate(60, 110)">
          {/* Wooden legs */}
          <path d="M18 132L12 152H20L24 132H18Z" fill="#2A160F" />
          <path d="M102 132L98 152H106L108 132H102Z" fill="#2A160F" />

          {/* Backrest body */}
          <path
            d="M14 26C14 10 26 0 45 0H85C104 0 116 10 116 26V95C116 102 110 108 102 108H28C20 108 14 102 14 95V26Z"
            fill="#8C3B1E"
          />

          {/* Wings */}
          <path d="M8 20C4 32 6 60 14 70V28C14 22 11 20 8 20Z" fill="#3B2016" />
          <path d="M122 20C126 32 124 60 116 70V28C116 22 119 20 122 20Z" fill="#3B2016" />

          {/* Tufted inner back cushion */}
          <rect x="28" y="14" width="74" height="68" rx="10" fill="#C8621F" />
          {/* Tufting buttons */}
          <circle cx="48" cy="34" r="3" fill="#3B2016" />
          <circle cx="82" cy="34" r="3" fill="#3B2016" />
          <circle cx="65" cy="52" r="3" fill="#3B2016" />
          <circle cx="48" cy="70" r="3" fill="#3B2016" />
          <circle cx="82" cy="70" r="3" fill="#3B2016" />

          {/* Seat cushion */}
          <rect x="16" y="86" width="98" height="28" rx="8" fill="#8C3B1E" />

          {/* Rolled armrests */}
          <rect x="6" y="68" width="18" height="42" rx="9" fill="#C8621F" />
          <rect x="106" y="68" width="18" height="42" rx="9" fill="#C8621F" />

          {/* Cozy Amber Throw draped on the right arm */}
          <path
            d="M92 72C92 72 104 70 112 80C117 86 119 100 117 114C115 128 108 132 108 132L94 122V80L92 72Z"
            fill="#E8A33D"
          />
          <line x1="108" y1="132" x2="106" y2="140" stroke="#E8A33D" strokeWidth="2" />
          <line x1="112" y1="131" x2="111" y2="139" stroke="#E8A33D" strokeWidth="2" />
          <line x1="116" y1="128" x2="116" y2="136" stroke="#E8A33D" strokeWidth="2" />
        </g>

        {/* Little sleeping kitten on rug */}
        <g transform="translate(180, 246)">
          <ellipse cx="18" cy="14" rx="16" ry="11" fill="#E8A33D" />
          <circle cx="30" cy="10" r="7" fill="#E8A33D" />
          <polygon points="31,4 34,0 36,5" fill="#C8621F" />
          <polygon points="27,4 29,1 31,5" fill="#C8621F" />
          <path d="M4 16C2 11 8 7 12 9" stroke="#E8A33D" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
