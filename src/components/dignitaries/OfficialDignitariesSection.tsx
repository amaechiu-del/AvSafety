/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Crown, Award, Shield, CheckCircle2, Building, ExternalLink, 
  ChevronRight, Landmark, Globe, Sparkles, User, Star, Send, Bookmark, Info
} from 'lucide-react';
import { DignitaryTier, DignitaryPerson, DIGNITARY_TIERS_DATA } from '../../data/dignitariesData';

interface OfficialDignitariesSectionProps {
  onSelectDignitary?: (person: DignitaryPerson) => void;
  onRegisterClick?: () => void;
}

export default function OfficialDignitariesSection({
  onSelectDignitary,
  onRegisterClick
}: OfficialDignitariesSectionProps) {
  const [activeTierId, setActiveTierId] = useState<string>('all');
  const [selectedPerson, setSelectedPerson] = useState<DignitaryPerson | null>(null);

  const tiers = DIGNITARY_TIERS_DATA;

  const filteredTiers = activeTierId === 'all' 
    ? tiers 
    : tiers.filter(t => t.id === activeTierId);

  const handlePersonClick = (person: DignitaryPerson) => {
    setSelectedPerson(person);
    if (onSelectDignitary) onSelectDignitary(person);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'CONFIRMED SPECIAL GUEST':
      case 'CONFIRMED SPEAKER':
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: 'CONFIRMED'
        };
      case 'PROPOSED SPECIAL GUEST':
      case 'PROPOSED GUEST OF HONOUR':
      case 'PROPOSED INVITEE':
      case 'PROPOSED':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: 'PROPOSED GUEST'
        };
      case 'INVITATION TO BE SENT':
      case 'INVITED':
      default:
        return {
          bg: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          label: 'INVITATION TO BE SENT'
        };
    }
  };

  return (
    <section id="dignitaries" className="py-24 bg-[#050C17] text-white relative overflow-hidden border-b border-[#D4AF37]/30">
      
      {/* Background Architectural Grid & Subtle Radial Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ============================================================ */}
        {/* 1. PROTOCOL HEADER & STATUTORY MANDATE */}
        {/* ============================================================ */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#FFD700] text-xs font-mono font-bold uppercase tracking-widest shadow-inner">
            <Crown className="w-4 h-4 text-[#FFD700]" />
            <span>OFFICIAL PROTOCOL & DIGNITARY HIERARCHY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            Distinguished National <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFF3B0]">Leadership & Dignitaries</span>
          </h2>

          <div className="h-1 w-28 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full"></div>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
            In accordance with sovereign protocol, the DomisLink Aviation Safety Summit 2026 convenes the highest executive offices of the Federal Republic, statutory regulators, host state leadership, and industrial captains united in collective airspace protection.
          </p>

          {/* Quick Filter Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTierId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTierId === 'all'
                  ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              All Protocol Tiers (1 - 4)
            </button>
            {tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTierId(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  activeTierId === t.id
                    ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. TIERED PRESENTATION CANVAS */}
        {/* ============================================================ */}
        <div className="space-y-16">
          {filteredTiers.map((tier) => {
            // Distinct styling rules per protocol tier
            const isTier1 = tier.tierNumber === 1;
            const isTier2 = tier.tierNumber === 2;
            const isTier3 = tier.tierNumber === 3;

            return (
              <div 
                key={tier.id}
                className={`rounded-3xl border transition-all duration-300 ${
                  isTier1
                    ? 'bg-gradient-to-b from-[#0A192F] via-[#071324] to-[#040A14] border-[#FFD700]/60 p-6 sm:p-10 shadow-2xl shadow-[#D4AF37]/15 ring-1 ring-[#FFD700]/30'
                    : isTier2
                    ? 'bg-gradient-to-b from-[#08172E] to-[#050C17] border-[#D4AF37]/40 p-6 sm:p-8 shadow-xl'
                    : 'bg-[#071221]/90 border-white/10 p-6 sm:p-8 shadow-lg'
                }`}
              >
                {/* Tier Title Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest ${
                        isTier1 
                          ? 'bg-[#FFD700] text-[#0A192F]'
                          : isTier2
                          ? 'bg-[#D4AF37]/20 text-[#FFD700] border border-[#D4AF37]/40'
                          : 'bg-white/10 text-slate-300 border border-white/10'
                      }`}>
                        {tier.subtitle}
                      </span>
                      {isTier1 && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[#FFD700]">
                          <Crown className="w-3 h-3 fill-[#FFD700]" /> SOVEREIGN EXECUTIVE HONOUR
                        </span>
                      )}
                    </div>
                    <h3 className={`font-serif font-black tracking-tight ${
                      isTier1 
                        ? 'text-2xl sm:text-3xl text-white' 
                        : isTier2 
                        ? 'text-xl sm:text-2xl text-white' 
                        : 'text-lg sm:text-xl text-slate-100'
                    }`}>
                      {tier.title}: <span className="text-[#FFD700]">{tier.leadHeadline}</span>
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 font-sans max-w-md md:text-right leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* ============================================================ */}
                {/* TIER 1: SOVEREIGN EXECUTIVE PRESENTATION (VICE PRESIDENT) */}
                {/* ============================================================ */}
                {isTier1 && (
                  <div className="space-y-6">
                    {tier.persons.map((person) => {
                      const badge = getStatusBadge(person.status);
                      return (
                        <div 
                          key={person.id}
                          className="bg-gradient-to-r from-[#0C1E38] via-[#0A192F] to-[#071324] border-2 border-[#FFD700]/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-[#FFD700] transition-all"
                        >
                          {/* Royal Gold Top Accent Light */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B89025] via-[#FFD700] to-[#B89025]"></div>
                          
                          {/* Seal Silhouette Watermark */}
                          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                            <Crown className="w-64 h-64 text-[#FFD700]" />
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                            
                            {/* Executive Portrait Slot */}
                            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
                              <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#FFD700] shadow-2xl bg-gradient-to-br from-[#050B18] to-[#0A192F] flex flex-col items-center justify-center p-4">
                                {person.photoUrl ? (
                                  <img 
                                    src={person.photoUrl} 
                                    alt={person.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-24 h-24 rounded-full bg-[#050C17] border-2 border-[#FFD700] flex items-center justify-center font-serif font-black text-3xl text-[#FFD700] shadow-inner">
                                      {person.monogram}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                                        OFFICIAL PORTRAIT
                                      </p>
                                      <p className="text-[9px] font-mono text-slate-400 uppercase">
                                        STATE PROTOCOL VERIFIED
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="absolute top-3 left-3">
                                  <span className="px-2 py-0.5 rounded bg-[#FFD700] text-[#0A192F] text-[9px] font-mono font-black uppercase shadow">
                                    {person.roleTitle}
                                  </span>
                                </div>
                              </div>

                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold" style={{ backgroundColor: 'rgba(5, 12, 23, 0.9)' }}>
                                <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`}></span>
                                <span className={badge.bg.split(' ')[1]}>{badge.label}</span>
                              </div>
                            </div>

                            {/* Executive Detail Bio & Mandate */}
                            <div className="lg:col-span-8 space-y-5">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] text-[11px] font-mono font-bold border border-[#FFD700]/40 uppercase tracking-wider">
                                    {person.salutation}
                                  </span>
                                  <span className="text-xs font-mono text-slate-400">
                                    Federal Republic of Nigeria
                                  </span>
                                </div>

                                <h4 className="text-2xl sm:text-4xl font-serif font-black text-white group-hover:text-[#FFD700] transition-colors leading-tight">
                                  {person.name}
                                </h4>

                                <p className="text-base sm:text-lg font-serif font-semibold text-[#FFD700]">
                                  {person.position}
                                </p>
                                <p className="text-xs sm:text-sm font-mono text-slate-300">
                                  {person.organisation}
                                </p>
                              </div>

                              {/* Keynote Safety Axiom Focus */}
                              <div className="bg-[#050C17]/90 border border-[#FFD700]/30 rounded-xl p-4 sm:p-5 space-y-2 shadow-inner">
                                <div className="flex items-center gap-2 text-[#FFD700] text-xs font-mono font-bold uppercase tracking-wider">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>SUMMIT OPENING ADDRESS & SOVEREIGN MANDATE</span>
                                </div>
                                <p className="text-sm sm:text-base font-serif italic text-slate-100 leading-snug">
                                  "{person.keynoteTitle}"
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {person.keynoteFocus}
                                </p>
                              </div>

                              {/* Executive Summary Points */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                                  <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                                  <span><strong>Statutory Role:</strong> Presiding Sovereign Guest of Honour opening the 2026 Summit.</span>
                                </div>
                                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                                  <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                                  <span><strong>Aviation Priority:</strong> Airspace sovereignty, national fleet recapitalization, and global ICAO compliance.</span>
                                </div>
                              </div>

                              <div className="pt-2 flex flex-wrap items-center gap-3">
                                <button
                                  onClick={() => handlePersonClick(person)}
                                  className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
                                >
                                  <span>View Sovereign Protocol Dossier</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                                {onRegisterClick && (
                                  <button
                                    onClick={onRegisterClick}
                                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs uppercase tracking-wider border border-white/20 flex items-center gap-2 transition-all"
                                  >
                                    <span>Reserve Plenary Seat</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ============================================================ */}
                {/* TIER 2: MINISTERIAL & HOST STATE EXECUTIVE LEADERSHIP */}
                {/* ============================================================ */}
                {isTier2 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tier.persons.map((person) => {
                      const badge = getStatusBadge(person.status);
                      return (
                        <div 
                          key={person.id}
                          className="bg-gradient-to-br from-[#0B1A30] to-[#071324] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between group transition-all"
                        >
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-[#D4AF37] bg-[#050C17] shrink-0 flex items-center justify-center">
                                {person.photoUrl ? (
                                  <img 
                                    src={person.photoUrl} 
                                    alt={person.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="text-center p-2">
                                    <div className="w-12 h-12 rounded-full bg-[#0A192F] border border-[#FFD700] mx-auto flex items-center justify-center font-serif font-black text-lg text-[#FFD700]">
                                      {person.monogram}
                                    </div>
                                    <span className="text-[8px] font-mono text-slate-400 uppercase mt-1 block">PROTOCOL</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1 overflow-hidden">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFD700] text-[9px] font-mono font-bold uppercase">
                                    {person.roleTitle}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${badge.bg}`}>
                                    {badge.label}
                                  </span>
                                </div>
                                <h4 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-[#FFD700] transition-colors leading-tight">
                                  {person.name}
                                </h4>
                                <p className="text-xs sm:text-sm font-semibold text-[#D4AF37]">
                                  {person.position}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono">
                                  {person.organisation}
                                </p>
                              </div>
                            </div>

                            <div className="bg-[#050C17]/70 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                              <p className="text-[10px] font-mono font-bold text-[#FFD700] uppercase">
                                KEYNOTE / PLENARY FOCUS:
                              </p>
                              <p className="text-xs font-serif italic text-slate-200 line-clamp-2">
                                "{person.keynoteTitle}"
                              </p>
                              <p className="text-[11px] text-slate-400 line-clamp-2">
                                {person.keynoteFocus}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400">
                              {person.salutation}
                            </span>
                            <button
                              onClick={() => handlePersonClick(person)}
                              className="text-xs font-mono text-[#FFD700] hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <span>View Profile</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ============================================================ */}
                {/* TIER 3: CIVIL AVIATION STATUTORY REGULATORS */}
                {/* ============================================================ */}
                {isTier3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tier.persons.map((person) => {
                      const badge = getStatusBadge(person.status);
                      return (
                        <div 
                          key={person.id}
                          className="bg-gradient-to-b from-[#09182C] to-[#06101E] border border-white/10 hover:border-[#D4AF37]/60 rounded-xl p-5 shadow-md flex flex-col justify-between group transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-18 rounded-lg overflow-hidden bg-[#050B18] border border-white/15 shrink-0 flex items-center justify-center">
                                {person.photoUrl ? (
                                  <img 
                                    src={person.photoUrl} 
                                    alt={person.name} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-[#0A192F] border border-[#D4AF37]/50 flex items-center justify-center font-serif font-black text-sm text-[#FFD700]">
                                    {person.monogram}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1 overflow-hidden">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border ${badge.bg}`}>
                                  {badge.label}
                                </span>
                                <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#FFD700] transition-colors leading-snug line-clamp-2">
                                  {person.name}
                                </h4>
                                <p className="text-[11px] font-semibold text-[#D4AF37] line-clamp-1">
                                  {person.position}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono line-clamp-1">
                                  {person.organisation}
                                </p>
                              </div>
                            </div>

                            <div className="bg-[#040A14] p-2.5 rounded-lg border border-white/5 space-y-1">
                              <p className="text-[9px] font-mono text-[#FFD700] uppercase font-bold">STATUTORY AGENDA:</p>
                              <p className="text-[11px] font-sans text-slate-300 italic line-clamp-2">
                                "{person.keynoteTitle}"
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">
                              {person.roleTitle}
                            </span>
                            <button
                              onClick={() => handlePersonClick(person)}
                              className="text-[11px] font-mono text-[#D4AF37] hover:text-white flex items-center gap-0.5"
                            >
                              <span>Dossier</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ============================================================ */}
                {/* TIER 4: AIRLINE CEOS & INDUSTRIAL LEADERSHIP */}
                {/* ============================================================ */}
                {!isTier1 && !isTier2 && !isTier3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tier.persons.map((person) => {
                      const badge = getStatusBadge(person.status);
                      return (
                        <div 
                          key={person.id}
                          className="bg-[#06101E] border border-white/10 hover:border-[#D4AF37]/50 rounded-xl p-4 flex flex-col justify-between group transition-all"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-[#0A192F] border border-[#D4AF37]/40 shrink-0 flex items-center justify-center font-serif font-black text-xs text-[#FFD700]">
                                {person.monogram}
                              </div>
                              <div className="overflow-hidden">
                                <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold border ${badge.bg}`}>
                                  {badge.label}
                                </span>
                                <h4 className="font-serif font-bold text-xs text-white group-hover:text-[#FFD700] truncate mt-0.5">
                                  {person.name}
                                </h4>
                              </div>
                            </div>

                            <div>
                              <p className="text-[11px] font-semibold text-[#D4AF37] line-clamp-1">
                                {person.position}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono line-clamp-1">
                                {person.organisation}
                              </p>
                            </div>

                            <p className="text-[10px] text-slate-300 italic bg-[#03070E] p-2 rounded border border-white/5 line-clamp-2">
                              "{person.keynoteTitle}"
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[8px] font-mono text-slate-500 uppercase">{person.roleTitle}</span>
                            <button
                              onClick={() => handlePersonClick(person)}
                              className="text-[10px] font-mono text-[#D4AF37] hover:text-white flex items-center"
                            >
                              <span>Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* 3. DIGNITARY DETAIL MODAL */}
        {/* ============================================================ */}
        {selectedPerson && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0A192F] border-2 border-[#FFD700]/70 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-mono font-bold uppercase">
                    OFFICIAL PROTOCOL DOSSIER
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
                    {selectedPerson.salutation} {selectedPerson.name}
                  </h3>
                  <p className="text-xs text-[#FFD700] font-semibold">{selectedPerson.position} • {selectedPerson.organisation}</p>
                </div>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="bg-[#050C17] border border-[#FFD700]/30 rounded-xl p-4 space-y-2">
                  <p className="font-mono text-[10px] text-[#FFD700] uppercase font-bold">KEYNOTE / PLENARY ADDRESS TOPIC:</p>
                  <p className="text-base font-serif italic text-white">"{selectedPerson.keynoteTitle}"</p>
                  <p className="text-xs text-slate-400">{selectedPerson.keynoteFocus}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="font-mono text-slate-400 block text-[10px] uppercase">Protocol Role</span>
                    <span className="font-bold text-white">{selectedPerson.roleTitle}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="font-mono text-slate-400 block text-[10px] uppercase">Invitation Status</span>
                    <span className="font-bold text-[#FFD700]">{selectedPerson.status}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">
                  * All official protocol invitations and formal notices are coordinated strictly through the Summit Secretariat & Office of Protocol.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
