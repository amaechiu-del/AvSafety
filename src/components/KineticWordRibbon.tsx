/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plane, ShieldCheck, Sparkles, Compass, Radio, Crown, HeartHandshake, RotateCw, Pause, Play } from 'lucide-react';
import { AUTHOR_NAME, BOOK_PRIMARY } from '../constants/author';

interface KineticWordRibbonProps {
  title?: string;
  theme?: 'dark' | 'gold';
  initialMovement?: 'stepped-pause' | 'slow-glide' | 'breathing-cadence';
}

export default function KineticWordRibbon({ 
  title = 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
  theme = 'dark',
  initialMovement = 'stepped-pause'
}: KineticWordRibbonProps) {
  const [movementMode, setMovementMode] = useState<'stepped-pause' | 'slow-glide' | 'breathing-cadence'>(initialMovement);
  const [isPaused, setIsPaused] = useState(false);

  const topWords = [
    'SAFETY FIRST', 'AIRWORTHINESS', 'FAITH IN ACTION', BOOK_PRIMARY.title,
    'RADAR MONITORING', 'MARRIOTT HOTEL LAGOS', 'ZERO ACCIDENTS',
    'CREW RESOURCE MANAGEMENT', 'PRESIDENT & GOVERNORS', 'MEN OF GOD',
    'PILOTS & ATC', 'AVIONICS & ENGINES', 'PASSENGER CARE', 'DOMISLINK EMPIRE'
  ];

  const bottomWords = [
    '17 NOVEMBER 2026', AUTHOR_NAME, 'NCAA & NAMA', 'INTERFAITH PRAYERS',
    '24 KEY SECTORS', 'OIL & GAS REFUELLING', 'BANKING & FLEET LEASING',
    'SIMULATOR DRILLS', 'CABIN PRESSURE INTEGRITY', 'FLIGHT LEVEL 350',
    'SAFETY CULTURE', 'PRESERVATION OF LIFE', 'EVERYBODY IS INVOLVED'
  ];

  const repeatedTop = [...topWords, ...topWords];
  const repeatedBottom = [...bottomWords, ...bottomWords];

  const getTopAnimClass = () => {
    if (isPaused) return 'flex';
    switch (movementMode) {
      case 'stepped-pause':
        return 'animate-marquee-paused';
      case 'breathing-cadence':
        return 'animate-marquee-breathing';
      case 'slow-glide':
      default:
        return 'animate-marquee-slow';
    }
  };

  const cycleMovement = () => {
    if (movementMode === 'stepped-pause') setMovementMode('slow-glide');
    else if (movementMode === 'slow-glide') setMovementMode('breathing-cadence');
    else setMovementMode('stepped-pause');
  };

  return (
    <div className="py-5 bg-[#040C18] border-y border-[#D4AF37]/30 overflow-hidden relative select-none group">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

      {/* Mode Control Bar */}
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-2 z-20 relative">
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-[#D4AF37] font-bold">KINETIC WORD STREAM</span>
          <span className="text-slate-500">|</span>
          <span className="text-white font-medium">MODE: {movementMode.toUpperCase().replace('-', ' ')}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={cycleMovement}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#D4AF37] hover:text-white text-[10px] font-mono transition-colors"
            title="Switch movement cadence (3 modes available)"
          >
            <RotateCw className="h-2.5 w-2.5" />
            <span>SWITCH FLOW (3 MODES)</span>
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1 rounded text-[10px] transition-colors ${
              isPaused ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
            title={isPaused ? 'Resume scroll' : 'Hold words in place'}
          >
            {isPaused ? <Play className="h-2.5 w-2.5 fill-current" /> : <Pause className="h-2.5 w-2.5" />}
          </button>
        </div>
      </div>

      {/* Top Stream: Scrolling Left with Gentle Cadence & Readability */}
      <div className="overflow-hidden py-1">
        <div className={getTopAnimClass()}>
          {repeatedTop.map((word, idx) => (
            <div
              key={`top-${idx}`}
              className="flex items-center space-x-3 px-6 shrink-0"
            >
              <span className="text-xs sm:text-[13px] font-serif font-bold tracking-widest text-[#D4AF37] uppercase">
                {word}
              </span>
              <span className="text-white/30 text-[10px]">★</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stream: Scrolling Right with Readability */}
      <div className="overflow-hidden py-1 mt-1 border-t border-white/5">
        <div className={isPaused ? 'flex' : 'animate-marquee-reverse'}>
          {repeatedBottom.map((word, idx) => (
            <div
              key={`bottom-${idx}`}
              className="flex items-center space-x-3 px-6 shrink-0"
            >
              <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                {word}
              </span>
              <span className="text-emerald-400/40 text-[9px]">◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
