/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Shield, Sparkles, Building2, ChevronRight, 
  MapPin, CheckCircle2, AlertCircle, Search, Filter, 
  UserPlus, Award, Send, Check, HeartHandshake,
  DollarSign, Globe, ExternalLink, ArrowRight, X,
  BookOpen, Zap
} from 'lucide-react';
import { StakeholderInvitee, StakeholderCategory } from '../../types';
import { STAKEHOLDER_CATEGORIES, INITIAL_STAKEHOLDERS } from '../../data/stakeholdersData';

interface StakeholderSectionProps {
  onOpenNominateModal?: () => void;
}

export default function StakeholderSection({ onOpenNominateModal }: StakeholderSectionProps) {
  const [stakeholders, setStakeholders] = useState<StakeholderInvitee[]>(INITIAL_STAKEHOLDERS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<StakeholderCategory>('BANKING_AND_FINANCE');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNominateModal, setShowNominateModal] = useState(false);
  const [nominateSuccess, setNominateSuccess] = useState<string | null>(null);

  // Nomination form state
  const [nomForm, setNomForm] = useState({
    name: '',
    position: '',
    organisation: '',
    category: 'BANKING_AND_FINANCE' as StakeholderCategory,
    whySectorMatters: '',
    proposedTopic: '',
    email: '',
    phone: '',
    isNigerDelta: false,
    state: ''
  });
  const [submittingNom, setSubmittingNom] = useState(false);

  // Safe JSON and Schema validator for stakeholder API response
  // Protects against static hosts (e.g. Cloudflare) returning index.html or empty payloads
  const validateStakeholderPayload = (
    resOk: boolean,
    contentType: string,
    rawText: string
  ): StakeholderInvitee[] | null => {
    if (!resOk) return null;
    if (!contentType.toLowerCase().includes('application/json')) return null;

    try {
      const data = JSON.parse(rawText);
      if (data && Array.isArray(data.stakeholders) && data.stakeholders.length > 0) {
        const seenIds = new Set<string>();
        const validList: StakeholderInvitee[] = [];

        for (const s of data.stakeholders) {
          if (s && typeof s === 'object' && s.id && typeof s.id === 'string') {
            const cleanId = s.id.trim();
            if (!seenIds.has(cleanId)) {
              seenIds.add(cleanId);
              validList.push(s);
            }
          }
        }

        if (validList.length > 0) {
          return validList;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  useEffect(() => {
    let isMounted = true;

    const loadStakeholders = async () => {
      try {
        const res = await fetch('/api/stakeholders');
        const contentType = res.headers.get('content-type') || '';
        const rawText = await res.text();

        const validatedData = validateStakeholderPayload(res.ok, contentType, rawText);
        if (validatedData && isMounted) {
          setStakeholders(validatedData);
          setLoading(false);
          return;
        }

        // Response was not valid JSON or contained invalid/empty data (e.g. static host returning HTML)
        if (isMounted) {
          setStakeholders(INITIAL_STAKEHOLDERS);
          setLoading(false);
        }
      } catch {
        // Network failure, offline client, or unreachable API
        if (isMounted) {
          setStakeholders(INITIAL_STAKEHOLDERS);
          setLoading(false);
        }
      }
    };

    loadStakeholders();

    return () => {
      isMounted = false;
    };
  }, []);

  // Current category data
  const currentCategoryObj = useMemo(() => {
    return STAKEHOLDER_CATEGORIES.find(c => c.id === selectedCategory) || STAKEHOLDER_CATEGORIES[0];
  }, [selectedCategory]);

  // Stakeholders in selected category
  const categoryStakeholders = useMemo(() => {
    return stakeholders.filter(s => s.category === selectedCategory);
  }, [stakeholders, selectedCategory]);

  // Submit nomination
  const handleNominateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingNom(true);
    try {
      const res = await fetch('/api/stakeholders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nomForm,
          status: 'PROPOSED INVITEE',
          eventRole: 'SPECIAL GUEST',
          currentRoleVerified: false,
          verificationSource: 'Public Nomination Portal',
          verifiedBy: 'Secretariat Protocol Desk'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStakeholders(prev => [data.stakeholder, ...prev]);
        setNominateSuccess(`Nomination for ${nomForm.name} (${nomForm.organisation}) successfully registered with Summit Secretariat!`);
        setNomForm({
          name: '',
          position: '',
          organisation: '',
          category: 'BANKING_AND_FINANCE',
          whySectorMatters: '',
          proposedTopic: '',
          email: '',
          phone: '',
          isNigerDelta: false,
          state: ''
        });
        setTimeout(() => {
          setShowNominateModal(false);
          setNominateSuccess(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Nomination submission error:', err);
    } finally {
      setSubmittingNom(false);
    }
  };

  return (
    <section id="stakeholders" className="py-24 bg-[#0A192F] text-slate-100 relative overflow-hidden border-b border-[#D4AF37]/25">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase">
            <Users className="h-3.5 w-3.5" />
            <span>EXPANDED SUMMIT INVITATION & STAKEHOLDER ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-white font-bold tracking-tight">
            EVERYBODY IS INVOLVED IN AVIATION SAFETY
          </h2>

          <p className="text-lg sm:text-xl text-[#D4AF37] font-serif italic max-w-3xl mx-auto">
            "An accident does not select a tribe, profession, company or class."
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Aviation safety is not solely for pilots and air traffic controllers. It directly affects passengers, families, corporate boards, oil & gas operators, banks, state governors, insurers, healthcare providers, faith institutions, and the entire sovereign economy.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setShowNominateModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>Nominate a Summit Guest</span>
            </button>
            <a
              href="#contact"
              className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 transition-all"
            >
              <Shield className="h-4 w-4 text-[#D4AF37]" />
              <span>Join Safety Working Group</span>
            </a>
          </div>
        </div>

        {/* 24 Sector Pills Carousel / Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              EXPLORE THE 24+ STAKEHOLDER SECTORS
            </p>
            <span className="text-xs text-slate-400 font-mono">
              Click any sector to inspect its air safety intersection
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {STAKEHOLDER_CATEGORIES.map((cat) => {
              const count = stakeholders.filter(s => s.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37] shadow-lg font-bold'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{cat.title}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected ? 'bg-[#0A192F] text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Sector Deep Dive Container */}
        <div className="bg-[#071324] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Sector Mission & Impact (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  SECTOR PROFILE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-2">
                  {currentCategoryObj.title}
                </h3>
                <p className="text-xs text-[#D4AF37] font-mono mt-0.5">
                  Strategic Stakeholder Group
                </p>
              </div>

              {/* Why Sector Matters */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                <p className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider">
                  Why Aviation Safety Matters to this Sector
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentCategoryObj.whyCorporateBelongs || currentCategoryObj.description}
                </p>
              </div>

              {/* Strategic Value Pillars */}
              <div className="space-y-2 text-xs">
                {(selectedCategory === 'CHRISTIAN_LEADERS' || selectedCategory === 'MUSLIM_LEADERS' || selectedCategory === 'FAITH_AND_COMMUNITY') ? (
                  <>
                    <div className="p-3 bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-[#D4AF37]/30 rounded-lg text-amber-200 text-xs leading-relaxed space-y-1">
                      <p className="font-bold font-serif text-white flex items-center space-x-1.5">
                        <HeartHandshake className="h-4 w-4 text-[#D4AF37]" />
                        <span>Why Men of God & Spiritual Leaders are on the Safety Checklist:</span>
                      </p>
                      <p className="text-slate-300 italic">
                        "Anytime there is crisis or severe turbulence in an aircraft in flight, the sound you hear from within the cabin across every seat are prayers from different tongues and denominations. It is not drama; it is faith in action. We actively seek their recommendations and prayers for the preservation of human life."
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Moral stewardship and ethical conscience in maintenance, piloting, and regulation.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Interfaith safety prayers and spiritual vigilance for Nigerian and global airspace.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Protects critical human capital, executives, and essential personnel in transit.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Mitigates severe operational downtime, supply chain halts, and insurance claims.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Advances national safety culture from reactive blame to proactive investment.</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setNomForm(prev => ({ ...prev, category: selectedCategory }));
                    setShowNominateModal(true);
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/40 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Nominate an Executive in {currentCategoryObj.title}</span>
                </button>
              </div>
            </div>

            {/* Right: Verified Leaders & Research Candidates (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Summit Stakeholder Roster ({categoryStakeholders.length})
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  Theme: EVERYBODY IS INVOLVED
                </span>
              </div>

              {categoryStakeholders.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <Users className="h-6 w-6 mx-auto text-slate-600" />
                  <p className="text-xs text-slate-400">
                    No research candidates registered yet for this sector.
                  </p>
                  <button
                    onClick={() => {
                      setNomForm(prev => ({ ...prev, category: selectedCategory }));
                      setShowNominateModal(true);
                    }}
                    className="text-xs text-[#D4AF37] underline font-bold"
                  >
                    Be the first to nominate a leader
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryStakeholders.map((person) => (
                    <div
                      key={person.id}
                      className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-[#D4AF37]/40 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-300 text-sm overflow-hidden shrink-0">
                            {person.photoUrl ? (
                              <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                            ) : (
                              person.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-sm">{person.name}</span>
                              {person.isNigerDelta && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono">
                                  {person.state || 'NIGER DELTA'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300">{person.position}</p>
                            <p className="text-xs text-[#D4AF37] font-semibold">{person.organisation}</p>
                          </div>
                        </div>

                        {/* Lifecycle Status Badge */}
                        <div className="text-right shrink-0">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                            person.status === 'CONFIRMED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : person.status === 'ACCEPTED'
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                              : person.status === 'INVITED' || person.status === 'INVITATION SENT'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : person.status === 'PENDING RESPONSE' || person.status === 'ACKNOWLEDGED' || person.status === 'INTERESTED'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              : person.status === 'DECLINED'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : person.status === 'WITHDRAWN' || person.status === 'NO RESPONSE'
                              ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}>
                            {person.status}
                          </span>
                        </div>
                      </div>

                      {/* Assigned & Proposed Topic */}
                      {(person.assignedTopic || person.proposedTopic || person.proposedDiscussionArea) && (
                        <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
                          <div className="flex items-center space-x-1.5 text-[#D4AF37] font-mono text-[10px]">
                            <BookOpen className="h-3 w-3 text-amber-400" />
                            <span>ASSIGNED SAFETY TOPIC:</span>
                            {!person.isTopicOfficial && (
                              <span className="text-slate-500 text-[9px]">(Proposed Protocol Mandate)</span>
                            )}
                          </div>
                          <p className="text-slate-200 font-serif italic text-xs leading-relaxed">
                            "{person.assignedTopic || person.proposedTopic || person.proposedDiscussionArea}"
                          </p>
                        </div>
                      )}

                      {/* Assigned Summit Assignment */}
                      {person.assignedAssignment && (
                        <div className="p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs space-y-0.5">
                          <div className="flex items-center space-x-1.5 text-amber-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                            <Zap className="h-3 w-3 text-[#FFD700]" />
                            <span>OFFICIAL SUMMIT ASSIGNMENT:</span>
                          </div>
                          <p className="text-white text-xs font-medium">
                            {person.assignedAssignment}
                          </p>
                        </div>
                      )}

                      {/* Verified Role Tag */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                        <span className="text-slate-300">Designated Role: <strong className="text-amber-300">{person.eventRole}</strong></span>
                        <span className="flex items-center space-x-1 text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Audited by Summit Protocol</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Public Anti-Fabrication / Protocol Safeguard Banner */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-[#D4AF37] shrink-0" />
            <span>
              <strong>Summit Protocol Guarantee:</strong> All proposed candidates and topics are subject to formal secretariat verification and diplomatic protocol acceptance. The summit strictly rejects unverified endorsements.
            </span>
          </div>
          <button
            onClick={() => setShowNominateModal(true)}
            className="text-xs text-[#D4AF37] hover:underline font-bold whitespace-nowrap"
          >
            Submit a Nomination →
          </button>
        </div>

      </div>

      {/* Public Nominate Summit Guest Modal */}
      {showNominateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A192F] border border-[#D4AF37]/50 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setShowNominateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                OFFICIAL SUMMIT NOMINATION
              </span>
              <h3 className="text-xl font-bold font-serif text-white mt-1">Nominate a Summit Guest</h3>
              <p className="text-xs text-slate-300">
                Recommend a key leader, CEO, government official, or advocate across the 24 sectors for a formal summit invitation.
              </p>
            </div>

            {nominateSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs mb-4 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{nominateSuccess}</span>
              </div>
            )}

            <form onSubmit={handleNominateSubmit} className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Nominee Full Name *</label>
                  <input
                    type="text"
                    required
                    value={nomForm.name}
                    onChange={(e) => setNomForm({ ...nomForm, name: e.target.value })}
                    placeholder="e.g. Aliko Dangote / Tony Elumelu"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Official Position *</label>
                  <input
                    type="text"
                    required
                    value={nomForm.position}
                    onChange={(e) => setNomForm({ ...nomForm, position: e.target.value })}
                    placeholder="e.g. Managing Director / Honourable Commissioner"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Organisation / Company *</label>
                  <input
                    type="text"
                    required
                    value={nomForm.organisation}
                    onChange={(e) => setNomForm({ ...nomForm, organisation: e.target.value })}
                    placeholder="e.g. Central Bank of Nigeria / Seplat Energy"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Sector *</label>
                  <select
                    value={nomForm.category}
                    onChange={(e) => setNomForm({ ...nomForm, category: e.target.value as StakeholderCategory })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {STAKEHOLDER_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Why is this person/organisation involved in air safety?</label>
                <textarea
                  rows={2}
                  required
                  value={nomForm.whySectorMatters}
                  onChange={(e) => setNomForm({ ...nomForm, whySectorMatters: e.target.value })}
                  placeholder="Explain why their presence at the summit advances air safety or protects human life."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Proposed Topic / Intervention Area</label>
                <input
                  type="text"
                  value={nomForm.proposedTopic}
                  onChange={(e) => setNomForm({ ...nomForm, proposedTopic: e.target.value })}
                  placeholder="e.g. Financing Aviation Infrastructure & Safety Standards"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Contact Email (Optional)</label>
                  <input
                    type="email"
                    value={nomForm.email}
                    onChange={(e) => setNomForm({ ...nomForm, email: e.target.value })}
                    placeholder="official@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Contact Telephone (Optional)</label>
                  <input
                    type="tel"
                    value={nomForm.phone}
                    onChange={(e) => setNomForm({ ...nomForm, phone: e.target.value })}
                    placeholder="+234..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="ndCheckbox"
                  checked={nomForm.isNigerDelta}
                  onChange={(e) => setNomForm({ ...nomForm, isNigerDelta: e.target.checked })}
                  className="rounded border-slate-700 text-[#D4AF37] focus:ring-0"
                />
                <label htmlFor="ndCheckbox" className="text-slate-300 cursor-pointer">
                  Representing Niger Delta Oil & Gas / State Government Area
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNominateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNom}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2b] text-[#0A192F] font-bold rounded-lg shadow"
                >
                  {submittingNom ? 'Submitting Nomination...' : 'Submit to Protocol Desk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
