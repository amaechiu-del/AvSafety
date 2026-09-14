/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Crown, Shield, Landmark, Users, CheckCircle, Award, Sparkles, Building2, Flame, Coins, Antenna, ExternalLink } from 'lucide-react';
import SafetyPulse from './SafetyPulse';

export default function GovernmentLeaders() {
  const [selectedLeader, setSelectedLeader] = useState<any | null>(null);

  // Helper to generate initials
  const getInitials = (name: string) => {
    return name
      .replace(/^(H\.E\.|Sen\.|Barr\.|Mr\.|Mrs\.|Prof\.|Capt\.|Engr\.|Dr\.)\s+/i, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section id="dignitaries" className="py-24 bg-[#050B1A] text-white border-b border-[#D4AF37]/20 relative overflow-hidden">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="govGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#govGrid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A192F] border border-[#D4AF37]/50 text-[#FFD700] text-xs font-mono font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-[#FFD700]" />
            OFFICIAL DIGNITARY & EXECUTIVE HIERARCHY
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
            SOVEREIGN & INDUSTRY LEADERSHIP
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            A safe airspace demands unyielding synergy between the highest tiers of sovereign statecraft, regulatory enforcement authorities, and premier industrial leaders.
          </p>
        </div>

        {/* ============================================================ */}
        {/* TIER 1: SPECIAL HONOURED EXECUTIVE PLENARY (VICE PRESIDENT) */}
        {/* ============================================================ */}
        <div className="relative bg-gradient-to-br from-[#0A192F] via-[#0D1E38] to-[#050B1A] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(212,175,55,0.15)] overflow-hidden">
          {/* Presidential Tier Accent Ribbon */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#D4AF37] to-[#B89025] text-[#050B1A] text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#050B1A]" />
            TIER 1 • SOVEREIGN EXECUTIVE HONOUR
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 sm:pt-0">
            {/* Monogram / Crest Shield */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-tr from-[#050B1A] to-[#132545] border-2 border-[#FFD700] flex flex-col items-center justify-center p-4 shadow-xl relative group">
                <Crown className="w-12 h-12 text-[#FFD700] mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]" />
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-widest">
                  KS
                </span>
                <span className="text-[9px] font-mono font-bold text-[#FFD700] uppercase tracking-wider mt-1">
                  OFFICIAL INVITEE
                </span>
                <div className="absolute bottom-2 text-[7px] font-mono text-gray-400">
                  PORTRAIT VERIFICATION PENDING
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                <span>STATE PROTOCOL INVITATION</span>
              </div>
            </div>

            {/* Dignitary Profile & Safety Mandate */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-widest text-[#FFD700] uppercase">
                  FEDERAL REPUBLIC OF NIGERIA
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
                  HIS EXCELLENCY SENATOR KASHIM SHETTIMA GCON
                </h3>
                <p className="text-base sm:text-lg font-serif text-[#D4AF37] font-bold">
                  Vice President of the Federal Republic of Nigeria
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm text-[#EAF2FF] leading-relaxed font-light space-y-2">
                <p>
                  <strong>Sovereign Safety Plenary:</strong> National aviation infrastructure, airspace safety modernisation, and sovereign economic resilience.
                </p>
                <p className="text-[11px] text-gray-400">
                  <em>Protocol Note:</em> The Presidency provides top-tier national executive patronage to safeguard sovereign airspace, support capital capitalization for aviation regulators, and ensure the inviolable protection of Nigerian citizens and international passengers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-[#FFD700] rounded-lg">
                  Category: Special Guest of Honour
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg">
                  Plenary: National Airspace Security
                </span>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
                  Status: Official State Invitation
                </span>
              </div>
            </div>
          </div>
        </div>

        <SafetyPulse label="SAFETY PULSE // SOVEREIGN POLICY & REGULATORY OVERSIGHT" />

        {/* ============================================================ */}
        {/* TIER 2: SOVEREIGN MINISTERIAL & STATE LEADERSHIP */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#FFD700]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFD700] uppercase">TIER 2</span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                MINISTERIAL & STATE EXECUTIVE LEADERSHIP
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Festus Keyamo */}
            <div className="bg-[#0A192F] border border-[#D4AF37]/40 rounded-2xl p-6 hover:border-[#FFD700] transition-all flex flex-col justify-between shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#050B1A] border border-[#D4AF37] flex flex-col items-center justify-center shrink-0 text-[#FFD700] font-serif font-bold text-lg">
                  FK
                  <span className="text-[7px] font-mono text-gray-400">MINISTER</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-[#FFD700] bg-amber-500/15 px-2 py-0.5 rounded uppercase">
                    FEDERAL MINISTRY OF AVIATION
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white">BARR. FESTUS KEYAMO SAN</h4>
                  <p className="text-xs text-[#D4AF37] font-semibold">
                    Honourable Minister of Aviation and Aerospace Development
                  </p>
                  <p className="text-[11px] text-gray-300 font-light mt-2 leading-relaxed">
                    Spearheading the 5-point aviation agenda: strict safety compliance, passenger rights enforcement, domestic airline support, infrastructure overhaul, and human capacity enhancement.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>Role: Special Guest & Keynote</span>
                <span className="text-[#FFD700]">● VERIFIED OFFICE</span>
              </div>
            </div>

            {/* Babajide Sanwo-Olu */}
            <div className="bg-[#0A192F] border border-[#D4AF37]/40 rounded-2xl p-6 hover:border-[#FFD700] transition-all flex flex-col justify-between shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#050B1A] border border-[#D4AF37] flex flex-col items-center justify-center shrink-0 text-[#FFD700] font-serif font-bold text-lg">
                  BS
                  <span className="text-[7px] font-mono text-gray-400">GOVERNOR</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-[#FFD700] bg-amber-500/15 px-2 py-0.5 rounded uppercase">
                    LAGOS STATE GOVERNMENT
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white">MR. BABAJIDE SANWO-OLU</h4>
                  <p className="text-xs text-[#D4AF37] font-semibold">
                    Executive Governor, Lagos State (Host State)
                  </p>
                  <p className="text-[11px] text-gray-300 font-light mt-2 leading-relaxed">
                    Host Governor steering Nigeria's commercial capital, aerotropolis expansions, airport transit integration, and rapid emergency response capabilities for aviation hubs in Lagos.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>Role: Special Guest of Honour</span>
                <span className="text-[#FFD700]">● VERIFIED OFFICE</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TIER 3: AVIATION REGULATORY AND STATUTORY AGENCIES */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#FFD700]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFD700] uppercase">TIER 3</span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                CIVIL AVIATION REGULATORS & STATUTORY AGENCIES
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                id: 'ncaa',
                name: 'Capt. Chris O. Najomo',
                position: 'Director General / CEO',
                org: 'Nigeria Civil Aviation Authority (NCAA)',
                focus: 'Statutory Safety Oversight, Unannounced Operator Audits & Airworthiness Standards',
                initials: 'CN'
              },
              {
                id: 'nsib',
                name: 'Capt. Alex Sabundu Badeh Jnr.',
                position: 'Director General / CEO',
                org: 'Nigerian Safety Investigation Bureau (NSIB)',
                focus: 'Independent Accident Investigation & Preventive Safety Directives',
                initials: 'AB'
              },
              {
                id: 'faan',
                name: 'Mrs. Olubunmi Oluwaseun Kuku',
                position: 'Managing Director / CEO',
                org: 'Federal Airports Authority of Nigeria (FAAN)',
                focus: 'Runway Safety, Airfield Lighting & Aerodrome Emergency Fire Rescue',
                initials: 'OK'
              },
              {
                id: 'nama',
                name: 'Engr. Farouk Umar',
                position: 'Managing Director / CEO',
                org: 'Nigerian Airspace Management Agency (NAMA)',
                focus: 'CNS/ATM Systems, ADS-B Coverage & Enroute Controller Separation',
                initials: 'FU'
              },
              {
                id: 'nimet',
                name: 'Prof. Charles Anosike',
                position: 'Director General / CEO',
                org: 'Nigerian Meteorological Agency (NiMet)',
                focus: 'Low-Level Windshear Alerts, Severe Weather Radar & Aeronautical Forecasting',
                initials: 'CA'
              },
              {
                id: 'ncat',
                name: 'Capt. Danjuma Adamu',
                position: 'Rector / Chief Executive',
                org: 'Nigerian College of Aviation Technology (NCAT)',
                focus: 'Pilot, Engineer & Air Traffic Controller Simulator Standards & Certification',
                initials: 'DA'
              }
            ].map((reg, idx) => (
              <div 
                key={reg.id}
                className="bg-[#0A192F]/80 border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-xl p-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#050B1A] border border-[#D4AF37]/60 flex items-center justify-center font-serif font-bold text-sm text-[#FFD700]">
                      {reg.initials}
                    </div>
                    <span className="text-[8px] font-mono text-[#D4AF37] bg-amber-500/10 px-2 py-0.5 rounded uppercase border border-amber-500/20">
                      REGULATOR
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#FFD700] transition-colors">
                      {reg.name}
                    </h4>
                    <p className="text-[11px] text-[#D4AF37] font-medium">{reg.position}</p>
                    <p className="text-[10px] text-gray-300 font-sans mt-0.5">{reg.org}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-light leading-relaxed border-t border-white/5 pt-2">
                    {reg.focus}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-gray-400">
                  <span>STATUTORY AUTHORITY</span>
                  <span className="text-emerald-400">● OFFICIAL DIRECTORY</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TIER 4: AIRLINE CEOs, ENERGY, BANKING, TELECOM & TECH CHIEFS */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#FFD700]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFD700] uppercase">TIER 4</span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                AIRLINE CEOs & CORPORATE INDUSTRY LEADERS
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Dr. Allen Onyema', title: 'Chairman / CEO', org: 'Air Peace Limited', sector: 'AIRLINES', initials: 'AO' },
              { name: 'Capt. George Uriesi', title: 'Managing Director / CEO', org: 'Ibom Air', sector: 'AIRLINES', initials: 'GU' },
              { name: 'Capt. Ronald Iyayi', title: 'Managing Director', org: 'Aero Contractors', sector: 'AIRLINES / MRO', initials: 'RI' },
              { name: 'Aliko Dangote GCON', title: 'President & CEO', org: 'Dangote Group', sector: 'INDUSTRIAL / JET A-1', initials: 'AD' },
              { name: 'Mele Kyari OFR', title: 'Group CEO', org: 'NNPC Limited', sector: 'ENERGY & FUEL QUALITY', initials: 'MK' },
              { name: 'Karl Toriola', title: 'CEO', org: 'MTN Nigeria', sector: 'TELECOMMUNICATIONS', initials: 'KT' },
              { name: 'Roosevelt Ogbonna', title: 'MD / CEO', org: 'Access Bank Plc', sector: 'AVIATION FINANCE', initials: 'RO' },
              { name: 'Segun Agbaje', title: 'Group CEO', org: 'Guaranty Trust Holding Co.', sector: 'BANKING CAPITAL', initials: 'SA' }
            ].map((corp, idx) => (
              <div 
                key={idx}
                className="bg-[#0A192F]/60 border border-white/10 hover:border-[#D4AF37]/50 rounded-xl p-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#050B1A] border border-[#D4AF37]/40 flex items-center justify-center font-serif font-bold text-xs text-[#FFD700]">
                      {corp.initials}
                    </div>
                    <span className="text-[8px] font-mono text-gray-300 bg-white/5 px-2 py-0.5 rounded uppercase">
                      {corp.sector}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-serif font-bold text-white leading-tight">{corp.name}</h5>
                    <p className="text-[10px] text-[#D4AF37] mt-0.5">{corp.title}</p>
                    <p className="text-[10px] text-gray-400 font-sans">{corp.org}</p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-gray-400">
                  <span>EXECUTIVE TIER</span>
                  <span className="text-[#D4AF37]">INVITED LEADERSHIP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
