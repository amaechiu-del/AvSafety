/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Radio, Plane, ShieldCheck, HeartHandshake, 
  Crown, Compass, Zap, BookOpen, Pause, Play, Eye, RotateCw
} from 'lucide-react';
import { AUTHOR_NAME, BOOK_PRIMARY } from '../constants/author';

export type FlowMotionMode = 'stepped-pause' | 'slow-glide' | 'breathing-cadence';

interface DynamicFlowTickerProps {
  variant?: 'gold' | 'navy' | 'radar';
  initialMotionMode?: FlowMotionMode;
}

export default function DynamicFlowTicker({ 
  variant = 'gold',
  initialMotionMode = 'stepped-pause'
}: DynamicFlowTickerProps) {
  const [activeChannel, setActiveChannel] = useState<'THEME' | 'RADAR' | 'FAITH_AND_BOOK'>('THEME');
  const [motionMode, setMotionMode] = useState<FlowMotionMode>(initialMotionMode);
  const [isManualPaused, setIsManualPaused] = useState(false);

  const channelItems = {
    THEME: [
      { text: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY', icon: <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" /> },
      { text: '17 NOVEMBER 2026 ✦ MARRIOTT HOTEL, IKEJA, LAGOS', icon: <Compass className="h-3.5 w-3.5 text-sky-400" /> },
      { text: 'DOMISLINK INTERNATIONAL SERVICES LTD ✦ THE DIGITAL EMPIRE', icon: <Crown className="h-3.5 w-3.5 text-amber-300" /> },
      { text: '24 STRATEGIC SECTORS ✦ ZERO ACCIDENT MANDATE', icon: <Zap className="h-3.5 w-3.5 text-emerald-400" /> },
      { text: 'PILOTS ✦ AIR TRAFFIC CONTROLLERS ✦ ENGINEERS ✦ CABIN CREW', icon: <Plane className="h-3.5 w-3.5 text-cyan-300" /> },
      { text: 'BANKING ✦ OIL & GAS ✦ TELECOMS ✦ REGULATORS ✦ PASSENGERS', icon: <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" /> }
    ],
    RADAR: [
      { text: 'LAGOS FIR FL350: RADAR ACTIVE ✦ ALL SECTORS MONITORED', icon: <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> },
      { text: 'RUNWAY 18R/36L INTEGRITY: 100% AIRWORTHINESS COMPLIANCE', icon: <ShieldCheck className="h-3.5 w-3.5 text-sky-300" /> },
      { text: 'LIVE ADS-B SURVEILLANCE & DIGITAL PREDICTIVE TELEMETRY', icon: <Zap className="h-3.5 w-3.5 text-amber-300" /> },
      { text: 'CREW RESOURCE MANAGEMENT (CRM) & NON-PUNITIVE REPORTING', icon: <Plane className="h-3.5 w-3.5 text-indigo-300" /> },
      { text: 'NCAA & NAMA OVERSIGHT: PURSUIT OF FLAWLESS FLIGHT OPS', icon: <Crown className="h-3.5 w-3.5 text-[#D4AF37]" /> }
    ],
    FAITH_AND_BOOK: [
      { text: 'FAITH IN ACTION: "IN TURBULENCE, PRAYERS RISE ACROSS ALL TONGUES"', icon: <HeartHandshake className="h-3.5 w-3.5 text-rose-300" /> },
      { text: 'SPECIAL GUEST INVITATIONS: MEN OF GOD & SPIRITUAL LEADERS', icon: <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" /> },
      { text: `OFFICIAL BOOK LAUNCH: "${BOOK_PRIMARY.title}" BY ${AUTHOR_NAME}`, icon: <BookOpen className="h-3.5 w-3.5 text-amber-300" /> },
      { text: 'PRESERVATION OF HUMAN LIFE: SACRED AIRSPACE STEWARDSHIP', icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> },
      { text: 'INTERFAITH SAFETY PRAYERS FOR SAFE NIGERIAN & GLOBAL SKIES', icon: <Crown className="h-3.5 w-3.5 text-[#D4AF37]" /> }
    ]
  };

  const currentItems = channelItems[activeChannel];
  const displayItems = [...currentItems, ...currentItems];

  const getVariantStyles = () => {
    switch (variant) {
      case 'radar':
        return 'bg-[#030914] text-emerald-300 border-y border-emerald-500/30';
      case 'navy':
        return 'bg-[#071324] text-slate-200 border-y border-[#D4AF37]/30';
      case 'gold':
      default:
        return 'bg-gradient-to-r from-[#0A192F] via-[#0E223D] to-[#0A192F] text-amber-200 border-y border-[#D4AF37]/40';
    }
  };

  const getAnimationClass = () => {
    if (isManualPaused) return '';
    switch (motionMode) {
      case 'stepped-pause':
        return 'animate-marquee-paused';
      case 'breathing-cadence':
        return 'animate-marquee-breathing';
      case 'slow-glide':
      default:
        return 'animate-marquee-slow';
    }
  };

  // Function to cycle between the 3 alternate movements
  const cycleMotion = () => {
    if (motionMode === 'stepped-pause') {
      setMotionMode('slow-glide');
    } else if (motionMode === 'slow-glide') {
      setMotionMode('breathing-cadence');
    } else {
      setMotionMode('stepped-pause');
    }
  };

  const getMotionLabel = () => {
    switch (motionMode) {
      case 'stepped-pause':
        return 'PAUSE & READ FLOW';
      case 'breathing-cadence':
        return 'CADENCE HOLD';
      case 'slow-glide':
        return 'SLOW GLIDE';
    }
  };

  return (
    <div className={`relative overflow-hidden py-2.5 ${getVariantStyles()} shadow-md z-30 select-none`}>
      {/* Dynamic Background Glow Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />

      <div className="flex items-center">
        {/* Left Channel Indicator & Motion Selector */}
        <div className="hidden sm:flex items-center space-x-2 pl-4 pr-3 py-1 bg-black/60 border-r border-[#D4AF37]/30 z-20 shrink-0 text-[10px] font-mono uppercase font-bold tracking-wider text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-0.5" />
          <span>TOPIC:</span>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveChannel('THEME')}
              className={`px-1.5 py-0.5 rounded text-[9px] transition-all ${
                activeChannel === 'THEME' ? 'bg-[#D4AF37] text-[#0A192F] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Aviation Safety Theme"
            >
              MANDATE
            </button>
            <button
              onClick={() => setActiveChannel('RADAR')}
              className={`px-1.5 py-0.5 rounded text-[9px] transition-all ${
                activeChannel === 'RADAR' ? 'bg-emerald-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Live Flight Telemetry"
            >
              RADAR
            </button>
            <button
              onClick={() => setActiveChannel('FAITH_AND_BOOK')}
              className={`px-1.5 py-0.5 rounded text-[9px] transition-all ${
                activeChannel === 'FAITH_AND_BOOK' ? 'bg-amber-400 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Faith in Action & Cleared for Takeoff"
            >
              FAITH & BOOK
            </button>
          </div>

          {/* 3 Alternate Motion Mode Switcher Button */}
          <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-white/20">
            <button
              onClick={cycleMotion}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#D4AF37] hover:text-white text-[9px] transition-colors"
              title="Switch between 3 alternate motion modes"
            >
              <RotateCw className="h-2.5 w-2.5" />
              <span>{getMotionLabel()}</span>
            </button>

            {/* Direct Pause / Resume Toggle */}
            <button
              onClick={() => setIsManualPaused(!isManualPaused)}
              className={`p-1 rounded text-[9px] transition-colors ${
                isManualPaused ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title={isManualPaused ? 'Resume Motion' : 'Hold Flow in Place'}
            >
              {isManualPaused ? <Play className="h-2.5 w-2.5 fill-current" /> : <Pause className="h-2.5 w-2.5" />}
            </button>
          </div>
        </div>

        {/* Continuous Marquee Ribbon with High Readability */}
        <div className="flex-1 overflow-hidden">
          <div 
            className={`${getAnimationClass()} ${isManualPaused ? 'flex' : ''}`}
            style={isManualPaused ? { transform: 'translate3d(0, 0, 0)' } : undefined}
          >
            {displayItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2.5 px-8 shrink-0 font-mono text-[12px] sm:text-[13px] font-semibold tracking-wider whitespace-nowrap"
              >
                <div className="p-1 rounded bg-white/5 border border-white/10 shrink-0">
                  {item.icon}
                </div>
                <span className="text-white hover:text-[#D4AF37] transition-colors drop-shadow-sm">{item.text}</span>
                <span className="text-[#D4AF37]/50 ml-5 font-bold text-sm">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
