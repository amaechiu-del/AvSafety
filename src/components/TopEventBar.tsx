/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, MapPin, ShieldAlert, ArrowRight, Bell, Sparkles, Radio, Plane } from 'lucide-react';
import { AUTHOR_NAME, BOOK_PRIMARY } from '../constants/author';

interface TopEventBarProps {
  onNavigate: (sectionId: string) => void;
}

export default function TopEventBar({ onNavigate }: TopEventBarProps) {
  return (
    <div className="bg-[#050D18] text-[#E2E8F0] text-xs border-b border-[#D4AF37]/30 relative z-40">
      
      {/* Top Main Bar */}
      <div className="py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Left: Core Date, Venue, Location */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 font-mono text-[11px]">
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE REGISTRY OPEN</span>
            </span>
            <span className="text-white font-semibold flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-[#D4AF37]" />
              17 NOVEMBER 2026
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="flex items-center text-[#8A99AD]">
              <MapPin className="h-3 w-3 mr-1 text-[#D4AF37]" />
              MARRIOTT HOTEL, IKEJA, LAGOS
            </span>
            <span className="text-white/30 hidden lg:inline">|</span>
            <span className="hidden lg:inline text-[#D4AF37]/90 font-medium font-sans animate-pulse">
              THEME: EVERYBODY IS INVOLVED IN AVIATION SAFETY
            </span>
          </div>

          {/* Right: Quick Action Triggers */}
          <div className="flex items-center space-x-2.5 text-[11px] font-sans">
            <button
              onClick={() => onNavigate('poster')}
              className="text-[#8A99AD] hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/40 underline-offset-2 hidden sm:inline"
            >
              Official Poster
            </button>
            <button
              onClick={() => onNavigate('challenge')}
              className="text-[#8A99AD] hover:text-[#D4AF37] transition-colors hidden md:inline"
            >
              Memoir Challenge
            </button>
            <button
              onClick={() => onNavigate('book-launch')}
              className="text-amber-300 hover:text-white transition-colors flex items-center space-x-1 font-semibold"
            >
              <Sparkles className="h-3 w-3 text-[#D4AF37]" />
              <span>Book Launch</span>
            </button>
            <button
              onClick={() => onNavigate('rsvp')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-[#D4AF37]/50 text-[#FFD700] font-mono font-bold rounded text-[10px] tracking-wider uppercase transition-all"
            >
              RSVP
            </button>
            <button
              onClick={() => onNavigate('volunteer')}
              className="px-2.5 py-1 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/60 text-[#FFD700] font-mono font-bold rounded text-[10px] tracking-wider uppercase transition-all hidden sm:inline"
            >
              Volunteer
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#B89025] hover:to-[#9E781C] text-[#0A192F] font-bold rounded text-[10px] tracking-widest uppercase transition-all shadow-sm flex items-center space-x-1"
            >
              <span>REGISTER</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Mini Scrolling Ticker Strip */}
      <div className="bg-[#030914] border-t border-white/5 py-1 overflow-hidden select-none">
        <div className="animate-marquee-fast flex items-center space-x-6 text-[10px] font-mono text-slate-300">
          {[
            '✈ OFFICIAL SUMMIT COUNTDOWN ACTIVE',
            '✦ THEME: EVERYBODY IS INVOLVED IN AVIATION SAFETY',
            `✦ BOOK LAUNCH: "${BOOK_PRIMARY.title}" BY ${AUTHOR_NAME}`,
            '✦ INTERFAITH SAFETY PRAYERS: SENIOR CHRISTIAN & MUSLIM LEADERS',
            '✦ 24 STRATEGIC SECTORS REPRESENTED',
            '✦ NCAA & NAMA AUDIT COMPLIANCE',
            '✦ VENUE: MARRIOTT HOTEL, IKEJA, LAGOS',
            '✦ DOMISLINK INTERNATIONAL SERVICES LTD — THE DIGITAL EMPIRE'
          ].concat([
            '✈ OFFICIAL SUMMIT COUNTDOWN ACTIVE',
            '✦ THEME: EVERYBODY IS INVOLVED IN AVIATION SAFETY',
            `✦ BOOK LAUNCH: "${BOOK_PRIMARY.title}" BY ${AUTHOR_NAME}`,
            '✦ INTERFAITH SAFETY PRAYERS: SENIOR CHRISTIAN & MUSLIM LEADERS',
            '✦ 24 STRATEGIC SECTORS REPRESENTED',
            '✦ NCAA & NAMA AUDIT COMPLIANCE',
            '✦ VENUE: MARRIOTT HOTEL, IKEJA, LAGOS',
            '✦ DOMISLINK INTERNATIONAL SERVICES LTD — THE DIGITAL EMPIRE'
          ]).map((msg, i) => (
            <span key={i} className="whitespace-nowrap flex items-center space-x-1">
              <span className="text-[#D4AF37]">{msg.split(' ')[0]}</span>
              <span className="text-slate-300">{msg.substring(msg.indexOf(' ') + 1)}</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
