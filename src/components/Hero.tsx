/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  eventDate: string;
  venue: string;
}

export default function Hero({ onNavigate, eventDate, venue }: HeroProps) {
  return (
    <section className="relative min-h-screen bg-[#0A192F] pt-24 pb-16 flex items-center overflow-hidden">
      
      {/* Editorial Aviation Grid Backdrop */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Modern Runway Coordinate Graphic Overlays */}
      <div className="absolute top-1/4 right-5 sm:right-10 md:right-20 pointer-events-none opacity-20 hidden md:block text-right">
        <div className="text-[12rem] font-serif font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-transparent">
          26
        </div>
        <div className="text-sm font-mono tracking-widest text-[#D4AF37] mt-[-2rem]">
          DN: 06°35'51"N | 03°21'43"E
        </div>
      </div>

      <div className="absolute bottom-10 left-5 sm:left-10 pointer-events-none opacity-10 hidden sm:block">
        <div className="text-xs font-mono tracking-widest text-[#E2E8F0]">
          NAV-AIDS // ATC // COM_01 // SEC_C90
        </div>
        <div className="text-xs font-mono tracking-widest text-[#D4AF37]">
          LAGOS SECTOR: FL350 SAFE SKIES
        </div>
      </div>

      {/* Abstract Glowing Jet Stream Graphic */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#1E3A8A]/20 via-[#1E293B]/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="lg:w-2/3 flex flex-col justify-center space-y-8">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#D4AF37] w-fit">
            <ShieldCheck className="h-4 w-4 mr-1 text-[#D4AF37]" />
            Aviation Industry Summit
          </div>

          {/* Headline and Core Theme */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight">
              AVIATION SAFETY <br className="hidden sm:inline" />
              <span className="text-[#D4AF37] bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">SUMMIT 2026</span>
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]"></div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#E2E8F0] tracking-wide uppercase max-w-xl">
              EVERYBODY IS INVOLVED IN AVIATION SAFETY
            </p>
            <p className="text-base sm:text-lg text-[#8A99AD] leading-relaxed max-w-2xl font-light">
              Safety is not just the job of one person, company, or government agency. It is a shared responsibility. Aviation accidents affect everyone regardless of background or career. We all share the same skies.
            </p>
          </div>

          {/* Quick Date Venue Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl p-4 sm:p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl">
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-lg">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8A99AD] font-semibold">Event Date</p>
                <p className="text-sm font-bold text-white tracking-wide">{eventDate}</p>
                <p className="text-xs text-[#8A99AD]">8:00 AM WAT</p>
              </div>
            </div>
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-lg">
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8A99AD] font-semibold">Venue Location</p>
                <p className="text-sm font-bold text-white tracking-wide">MARRIOTT HOTEL</p>
                <p className="text-xs text-[#8A99AD] font-medium">Ikeja, Lagos, Nigeria</p>
              </div>
            </div>
          </div>

          {/* Call To Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-2xl pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#B89025] hover:to-[#9E781C] text-[#0A192F] font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-150 text-sm tracking-wider uppercase flex items-center justify-center space-x-2"
            >
              <span>REGISTER DELEGATE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-6 py-3.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 font-bold rounded-lg transition-all duration-150 text-sm tracking-wider uppercase text-center flex items-center justify-center space-x-1.5"
            >
              <span>ADVERTISE & SPONSOR</span>
            </button>
            <button
              onClick={() => onNavigate('programme')}
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:border-[#D4AF37]/50 transition-all duration-150 text-sm tracking-wider uppercase text-center"
            >
              PROGRAMME
            </button>
          </div>

          {/* Brand Presentation Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#8A99AD] font-medium uppercase tracking-wider">
            <span>Organised by: <strong className="text-white">DOMISLINK INTERNATIONAL SERVICES LTD</strong></span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span>Initiative: <strong className="text-white">THE DIGITAL EMPIRE</strong></span>
          </div>

        </div>
      </div>
    </section>
  );
}
