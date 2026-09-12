/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GlassWater, Calendar, MapPin, Clock, Shirt, Sparkles } from 'lucide-react';

export default function SkyParty() {
  return (
    <section id="sky-party" className="py-24 bg-[#0A192F] text-white border-b border-[#D4AF37]/10 relative overflow-hidden">
      
      {/* Background Graphic Patterns */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="10 15" />
          <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#1E3A8A" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold flex items-center justify-center space-x-1.5">
            <GlassWater className="h-4 w-4 text-[#D4AF37]" />
            <span>EXECUTIVE MIXER</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">
            THE SKY PARTY
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-[#D4AF37] font-mono tracking-widest text-sm uppercase font-bold">
            NETWORK • CONNECT • CELEBRATE
          </p>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            The summit's premier networking and social experience. Wind down with fellow delegates, keynotes, regulatory officials, and carrier managers at the Marriott Hotel executive garden.
          </p>
        </div>

        {/* Info Grid Card */}
        <div className="max-w-3xl mx-auto bg-white/5 border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-white/10">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#D4AF37]/20 border border-[#D4AF37]/35 rounded-xl text-[#D4AF37]">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-[#8A99AD] uppercase tracking-wider">Summit Party Date</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">17 November 2026</p>
                <p className="text-xs text-[#8A99AD]">Summit Night</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#D4AF37]/20 border border-[#D4AF37]/35 rounded-xl text-[#D4AF37]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-[#8A99AD] uppercase tracking-wider">Networking Venue</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">MARRIOTT HOTEL, LAGOS</p>
                <p className="text-xs text-[#8A99AD]">Ikeja, Lagos, Nigeria</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-[#8A99AD] uppercase tracking-wider">Time Schedule</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">[TO BE CONFIRMED]</p>
                <p className="text-xs text-[#8A99AD] italic">Subject to summit close</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400">
                <Shirt className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-[#8A99AD] uppercase tracking-wider">Required Dress Code</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">[TO BE CONFIRMED]</p>
                <p className="text-xs text-[#8A99AD] italic">Business Casual / African Royalty Preferred</p>
              </div>
            </div>
          </div>

          {/* Prompt footer */}
          <div className="pt-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 px-4 py-2 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] text-[11px] font-semibold tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Complimentary Access For Registered VIP delegates</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
