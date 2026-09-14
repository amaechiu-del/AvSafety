/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Calendar, MapPin, ShieldCheck, BookOpen, MessageSquare, 
  TrendingUp, Cpu, PartyPopper, ArrowRight, CheckCircle2, 
  Crown, Sparkles 
} from 'lucide-react';

interface SummitGlanceProps {
  onNavigate: (sectionId: string) => void;
}

export default function SummitGlance({ onNavigate }: SummitGlanceProps) {
  const highlights = [
    {
      id: 'book',
      title: 'BOOK LAUNCH',
      subtitle: 'Official Safety Publication',
      desc: 'Unveiling the official summit book detailing aviation incident analysis, human factor dynamics, and operational safeguards.',
      icon: <BookOpen className="h-5 w-5 text-[#D4AF37]" />,
      action: 'Explore Book Launch'
    },
    {
      id: 'challenge',
      title: 'AVIATION MEMOIR CHALLENGE',
      subtitle: 'Shared Experience Platform',
      desc: 'Documenting unreported near-misses and operational insights so aviators do not die with their invaluable professional lessons.',
      icon: <MessageSquare className="h-5 w-5 text-[#D4AF37]" />,
      action: 'Submit Safety Memoir'
    },
    {
      id: 'investment',
      title: 'SAFETY INVESTMENT',
      subtitle: 'Make Safety Easier',
      desc: 'Unlocking public, private, and institutional capital to fund modern simulators, pristine fuel logistics, and fleet equipment.',
      icon: <TrendingUp className="h-5 w-5 text-[#D4AF37]" />,
      action: 'View Investment Scope'
    },
    {
      id: 'simulation',
      title: 'SIMULATION & TRAINING',
      subtitle: 'Sim Saves Fuel, Dollars & Lives',
      desc: 'Practicing emergency procedures, correcting procedural errors safely, and consolidating flight deck competencies.',
      icon: <Cpu className="h-5 w-5 text-[#D4AF37]" />,
      action: 'Review Simulation Scope'
    },
    {
      id: 'sky-party',
      title: 'SKY PARTY',
      subtitle: 'Executive Evening Networking',
      desc: 'The official summit gala reception connecting airline chairmen, governors, aviation regulators, and tech leaders.',
      icon: <PartyPopper className="h-5 w-5 text-[#D4AF37]" />,
      action: 'Discover Sky Party'
    }
  ];

  return (
    <section id="glance" className="py-20 bg-[#FCFBF7] border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold flex items-center justify-center space-x-1.5">
            <Crown className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>POSTER INFORMATION GRID</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            SUMMIT AT A GLANCE
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            All key facts, flagship initiatives, and key event schedules reproduced accurately from the official summit artwork.
          </p>
        </div>

        {/* 4 Core Facts Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          {/* Card 1: DATE */}
          <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A99AD] font-bold">EVENT DATE</span>
              <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xl font-serif font-black text-[#0A192F] tracking-wide">17 NOVEMBER 2026</p>
            <p className="text-xs text-[#5A6E85] mt-1 font-light">Full-day executive summit & gala</p>
          </div>

          {/* Card 2: VENUE */}
          <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A99AD] font-bold">OFFICIAL VENUE</span>
              <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xl font-serif font-black text-[#0A192F] tracking-wide">MARRIOTT HOTEL</p>
            <p className="text-xs text-[#5A6E85] mt-1 font-light">Grand Ballroom & Conference Wing</p>
          </div>

          {/* Card 3: LOCATION */}
          <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A99AD] font-bold">CITY & COUNTRY</span>
              <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xl font-serif font-black text-[#0A192F] tracking-wide">IKEJA, LAGOS</p>
            <p className="text-xs text-[#5A6E85] mt-1 font-light">Nigeria (West Africa Aviation Hub)</p>
          </div>

          {/* Card 4: THEME */}
          <div className="bg-[#0A192F] text-white p-6 rounded-2xl border border-[#D4AF37]/35 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">CENTRAL THEME</span>
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg text-[#D4AF37]">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-sm sm:text-base font-serif font-extrabold text-white tracking-tight uppercase leading-snug">
              EVERYBODY IS INVOLVED IN AVIATION SAFETY
            </p>
            <p className="text-[10px] text-[#8A99AD] mt-1 font-mono uppercase">Shared Ecosystem Responsibility</p>
          </div>

        </div>

        {/* 5 Flagship Initiatives Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8A99AD]">
              FLAGSHIP PROGRAMME PILLARS
            </h3>
            <span className="text-xs font-mono text-[#D4AF37] font-semibold">5 CORE SESSIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {highlights.map((h, idx) => (
              <div 
                key={h.id}
                className="bg-white p-5 rounded-xl border border-[#D4AF37]/15 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-[#FCFBF7] border border-[#D4AF37]/20 rounded-lg group-hover:bg-[#D4AF37]/10 transition-colors">
                      {h.icon}
                    </div>
                    <span className="text-[9px] font-mono text-[#8A99AD] font-semibold">PILLAR 0{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#0A192F] tracking-wide uppercase">{h.title}</h4>
                    <p className="text-[10px] text-[#D4AF37] font-semibold mt-0.5">{h.subtitle}</p>
                  </div>
                  <p className="text-[11px] text-[#5A6E85] font-light leading-relaxed">
                    {h.desc}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate(h.id)}
                  className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#0A192F] font-semibold group-hover:text-[#D4AF37] transition-colors"
                >
                  <span>{h.action}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
