import React from 'react';

export const EmberBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Ambient background radial warm vignette */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#8C3B1E]/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C8621F]/8 rounded-full blur-[140px] translate-y-1/3" />

      {/* Drifting embers */}
      <div
        className="ember-particle-1 absolute left-[12%] w-2 h-2 rounded-full bg-[#E8A33D]/30 blur-[1px]"
        style={{ bottom: '-20px' }}
      />
      <div
        className="ember-particle-2 absolute left-[28%] w-1.5 h-1.5 rounded-full bg-[#C8621F]/35 blur-[0.5px]"
        style={{ bottom: '-30px' }}
      />
      <div
        className="ember-particle-3 absolute left-[52%] w-2.5 h-2.5 rounded-full bg-[#E8A33D]/25 blur-[1.5px]"
        style={{ bottom: '-15px' }}
      />
      <div
        className="ember-particle-4 absolute left-[74%] w-1.5 h-1.5 rounded-full bg-[#E8A33D]/30 blur-[0.8px]"
        style={{ bottom: '-25px' }}
      />
      <div
        className="ember-particle-5 absolute left-[88%] w-2 h-2 rounded-full bg-[#C8621F]/25 blur-[1px]"
        style={{ bottom: '-40px' }}
      />
    </div>
  );
};
