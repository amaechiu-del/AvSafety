/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, MapPin, ShieldAlert, ArrowRight, Bell, Sparkles } from 'lucide-react';

interface TopEventBarProps {
  onNavigate: (sectionId: string) => void;
}

export default function TopEventBar({ onNavigate }: TopEventBarProps) {
  return (
    <div className="bg-[#050D18] text-[#E2E8F0] text-xs border-b border-[#D4AF37]/30 py-2.5 px-4 sm:px-6 lg:px-8 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Core Date, Venue, Location */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 font-mono text-[11px]">
          <span className="inline-flex items-center space-x-1 text-[#D4AF37] font-bold">
            <Sparkles className="h-3.5 w-3.5 mr-1 animate-pulse text-[#D4AF37]" />
            OFFICIAL SUMMIT:
          </span>
          <span className="text-white font-semibold">17 NOVEMBER 2026</span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="flex items-center text-[#8A99AD]">
            <MapPin className="h-3 w-3 mr-1 text-[#D4AF37]" />
            MARRIOTT HOTEL, IKEJA, LAGOS, NIGERIA
          </span>
          <span className="text-white/30 hidden lg:inline">|</span>
          <span className="hidden lg:inline text-[#D4AF37]/90 font-medium font-sans">
            THEME: EVERYBODY IS INVOLVED IN AVIATION SAFETY
          </span>
        </div>

        {/* Right: Quick Action Triggers */}
        <div className="flex items-center space-x-3 text-[11px] font-sans">
          <button
            onClick={() => onNavigate('poster')}
            className="text-[#8A99AD] hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/40 underline-offset-2 hidden sm:inline"
          >
            View Official Poster
          </button>
          <button
            onClick={() => onNavigate('google-docs')}
            className="text-[#D4AF37] hover:text-white transition-colors flex items-center space-x-1 font-semibold"
          >
            <span>Google Docs</span>
          </button>
          <button
            onClick={() => onNavigate('challenge')}
            className="text-[#8A99AD] hover:text-[#D4AF37] transition-colors hidden sm:inline"
          >
            Aviation Memo Challenge
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#B89025] hover:to-[#9E781C] text-[#0A192F] font-bold rounded text-[10px] tracking-widest uppercase transition-all shadow-sm flex items-center space-x-1"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="h-2.5 w-2.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
