/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Send, EyeOff, ShieldAlert, Sparkles, Check, ChevronDown, ListFilter, 
  BookOpen, User, Users, Globe, FileText, ArrowRight, Trash2, Edit3, 
  Archive, Link, AlertTriangle, CheckCircle, HelpCircle, Shield, 
  Bookmark, Clock, Info, HeartHandshake, Eye, Scale
} from 'lucide-react';
import { MemoSubmission } from '../types';

interface MemoirProps {
  memos: MemoSubmission[];
  onSubmitMemo: (memo: Omit<MemoSubmission, 'id' | 'submittedAt'>) => Promise<boolean>;
  onUpdateMemos?: (updated: MemoSubmission[]) => void;
  isAdmin?: boolean;
}

export default function AviationMemoirChallenge({ memos, onSubmitMemo, onUpdateMemos, isAdmin }: MemoirProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'submit' | 'archive' | 'guidelines' | 'faq'>('about');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Submission Form states
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [profession, setProfession] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [experienceCategory, setExperienceCategory] = useState('Near-Miss Experience');
  const [memoTitle, setMemoTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [recommendedImprovement, setRecommendedImprovement] = useState('');
  const [consentSecurity, setConsentSecurity] = useState(false);
  const [consentLiability, setConsentLiability] = useState(false);
  const [consentAnonymity, setConsentAnonymity] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // CMS/Admin states
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MemoSubmission | null>(null);

  const workflowSteps = [
    { label: 'WRITE', desc: 'Author raw safety memoir' },
    { label: 'SUBMIT', desc: 'Secure digital transmission' },
    { label: 'REVIEW', desc: 'Triage by safety board' },
    { label: 'ANONYMISE', desc: 'Strip identifiers' },
    { label: 'PUBLISH / ARCHIVE', desc: 'Commit to ledger' },
    { label: 'SHARE LESSON', desc: 'Global safety warning' },
    { label: 'IMPROVE SAFETY', desc: 'Mitigate fatal risks' }
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!profession || !experienceCategory || !memoTitle || !memoContent || !lessonLearned || !recommendedImprovement) {
      setErrorMsg('Please complete all mandatory safety field markings.');
      return;
    }
    if (!consentSecurity || !consentLiability || !consentAnonymity) {
      setErrorMsg('You must review and agree to all professional, legal, and confidentiality obligations before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await onSubmitMemo({
        name: isAnonymous ? 'Anonymised Professional' : name,
        isAnonymous,
        profession,
        organisation: organisation || 'Not Disclosed',
        experienceCategory,
        memoTitle,
        memoContent,
        lessonLearned,
        recommendedImprovement,
        consent: true
      });

      if (res) {
        setSuccess(true);
        // Clear inputs
        setName('');
        setProfession('');
        setOrganisation('');
        setMemoTitle('');
        setMemoContent('');
        setLessonLearned('');
        setRecommendedImprovement('');
        setConsentSecurity(false);
        setConsentLiability(false);
        setConsentAnonymity(false);
        
        // Return to archive view after delay
        setTimeout(() => {
          setSuccess(false);
          setActiveTab('archive');
        }, 4000);
      } else {
        setErrorMsg('Database response timed out. Please retry.');
      }
    } catch (err) {
      setErrorMsg('An unexpected connection error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // CMS Inline Handlers
  const startEditMemo = (memo: MemoSubmission) => {
    setEditingMemoId(memo.id);
    setEditForm({ ...memo });
  };

  const cancelEditMemo = () => {
    setEditingMemoId(null);
    setEditForm(null);
  };

  const saveEditMemo = () => {
    if (!editForm || !onUpdateMemos) return;
    const updated = memos.map(m => m.id === editForm.id ? editForm : m);
    onUpdateMemos(updated);
    setEditingMemoId(null);
    setEditForm(null);
  };

  const deleteMemo = (id: string) => {
    if (!onUpdateMemos) return;
    if (confirm('Are you sure you want to permanently delete this safety memoir from the archive?')) {
      const updated = memos.filter(m => m.id !== id);
      onUpdateMemos(updated);
    }
  };

  const toggleMemoAnonymity = (memo: MemoSubmission) => {
    if (!onUpdateMemos) return;
    const updated = memos.map(m => {
      if (m.id === memo.id) {
        return {
          ...m,
          isAnonymous: !m.isAnonymous,
          name: !m.isAnonymous ? 'Anonymised Professional' : 'Captain / Engineer (De-Anonymised)'
        };
      }
      return m;
    });
    onUpdateMemos(updated);
  };

  return (
    <section id="challenge" className="py-24 bg-[#FCFBF7] border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Challenge Banner */}
        <div className="bg-[#0A192F] text-white rounded-3xl border border-[#D4AF37]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-[#D4AF37]/10 to-transparent pointer-events-none"></div>
          
          <div className="max-w-4xl space-y-6 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-mono font-bold tracking-widest uppercase rounded-full">
                Sovereign Safety Initiative
              </span>
              <span className="px-3 py-1 bg-white/10 text-white border border-white/20 text-[9px] font-mono tracking-widest uppercase rounded-full">
                DOMISLINK INTERNATIONAL
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight uppercase">
              Aviation Memoir Challenge
            </h1>

            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-serif font-bold text-[#D4AF37] tracking-wider uppercase max-w-3xl leading-snug">
                "AVIATORS MUST NOT DIE WITH THEIR EXPERIENCE."
              </p>
              <p className="text-xs sm:text-sm font-mono tracking-wider text-slate-300 uppercase italic">
                Let experience speak before it becomes a lesson written in blood.
              </p>
            </div>

            <div className="h-0.5 w-24 bg-[#D4AF37]"></div>

            <p className="text-xs sm:text-sm md:text-base text-[#8A99AD] leading-relaxed font-light max-w-3xl">
              Every aviation safety checklist, flight-deck limitation, and maintenance procedure in the modern world represents a hard-learned lesson from a previous close-call. This platform provides an interactive portal to securely collect, review, and anonymise near-miss events, flight observations, and operational recommendations. It is explicitly designed to bridge the gap between official textbooks and ground reality.
            </p>

            {/* Live Reference Archive Gateway */}
            <div className="p-4 bg-white/5 border border-[#D4AF37]/20 rounded-xl max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase font-bold flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Reference Archive Gateway Active
                </p>
                <p className="text-xs text-slate-300">
                  Access the live public directory on the web at <strong className="text-white">aviationmemoir.domislink.com</strong>.
                </p>
              </div>
              <a 
                href="https://aviationmemoir.domislink.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-mono font-bold rounded text-[11px] uppercase flex items-center gap-1.5 shrink-0 transition-colors shadow-md"
              >
                <span>Visit Live Archive</span>
                <Link className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Page Navigation Tabs */}
        <div className="flex flex-wrap border-b border-[#D4AF37]/20 mb-10 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'about'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-[#5A6E85] hover:text-[#0A192F]'
            }`}
          >
            <Info className="h-4 w-4" />
            1. About the Challenge
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-4 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'guidelines'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-[#5A6E85] hover:text-[#0A192F]'
            }`}
          >
            <Shield className="h-4 w-4" />
            2. Guidelines & Obis
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'submit'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-[#5A6E85] hover:text-[#0A192F]'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#D4AF37]" />
            3. Submission Gate
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'archive'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-[#5A6E85] hover:text-[#0A192F]'
            }`}
          >
            <Archive className="h-4 w-4" />
            4. Archive Ledger ({memos.length})
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'faq'
                ? 'border-[#0A192F] text-[#0A192F] bg-white'
                : 'border-transparent text-[#5A6E85] hover:text-[#0A192F]'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            5. FAQs
          </button>
        </div>

        {/* TAB 1: About the Challenge & Why Experience Matters */}
        {activeTab === 'about' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Context Block */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white border border-[#D4AF37]/15 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <h3 className="text-xl font-serif font-extrabold text-[#0A192F] flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                    About the Challenge
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed font-light">
                    The <strong>Aviation Memoir Challenge</strong> is a national collaborative project spearheaded by Domislink International Services Ltd in partnership with regulatory directors, airspace traffic controllers, and airline operators. Its core objective is to pull down siloed knowledge and prevent critical flight safety incidents from slipping into history.
                  </p>
                  <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed font-light">
                    Safety culture relies entirely on transparent feedback. When crew members, captains, mechanics, or controllers encounter near-misses or structural process discrepancies, they often lack a low-friction, legal-safe, and professional environment to register these findings. This interactive dashboard bridges that gap by offering a streamlined submission terminal coupled with inline editorial and sanitization controls.
                  </p>
                </div>

                <div className="bg-white border border-[#D4AF37]/15 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <h3 className="text-xl font-serif font-extrabold text-[#0A192F] flex items-center gap-2">
                    <HeartHandshake className="h-5 w-5 text-[#D4AF37]" />
                    Why Experience Matters
                  </h3>
                  <blockquote className="border-l-4 border-[#D4AF37] pl-4 italic text-xs sm:text-sm text-[#0A192F] font-serif font-semibold">
                    "Every flight safety limitation in aircraft manuals is a lesson bought with human lives. Active sharing prevents the repetition of previous accidents."
                  </blockquote>
                  <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed font-light">
                    Human factors remain the single largest variable in aviation operations. Technical failures are extremely rare in modern aircraft; instead, communication breakdowns, fatigue bottlenecks, misunderstood ground instructions, or rapid weather shifts cause close-calls. Sharing subjective, professional operational insights directly contributes to the ongoing evolution of check-lists, training models, and air-traffic procedural parameters.
                  </p>
                </div>
              </div>

              {/* Sidebar Who Can Participate */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#FCFBF7] border border-[#D4AF37]/35 rounded-xl p-6 shadow-sm">
                  <h4 className="text-sm font-mono font-bold text-[#0A192F] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Users className="h-4.5 w-4.5 text-[#D4AF37]" /> Who Can Participate?
                  </h4>
                  <ul className="space-y-3.5 text-xs">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A192F]">Flight Deck Crew</strong>
                        <p className="text-gray-500 font-light text-[11px]">Commanders, First Officers, Flight Instructors</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A192F]">Air Traffic Controllers</strong>
                        <p className="text-gray-500 font-light text-[11px]">Approach, Tower, Area, Ground controllers</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A192F]">Maintenance Personnel</strong>
                        <p className="text-gray-500 font-light text-[11px]">Avionics specialists, airframe engineers, QA inspectors</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A192F]">Cabin Crew & Dispatchers</strong>
                        <p className="text-gray-500 font-light text-[11px]">Purser crew, loadmasters, operations schedulers</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A192F]">Aerodrome Safety Officers</strong>
                        <p className="text-gray-500 font-light text-[11px]">FAAN inspectors, bird-strike response crew</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submission workflow visualization */}
            <div className="bg-white border border-[#D4AF37]/15 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest">TRANSMISSION & REDACTION CONSOLE</span>
                <h3 className="text-lg font-serif font-extrabold text-[#0A192F] uppercase">THE SUBMISSION WORKFLOW</h3>
                <p className="text-xs text-gray-500 font-light">Every recorded entry undergoes strict multi-stage verification before indexing.</p>
              </div>

              {/* Progress Stepper Visualiser */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 pt-4 relative">
                {workflowSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-3.5 bg-[#FCFBF7] border border-[#D4AF37]/15 rounded-xl shadow-sm relative group">
                    <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#D4AF37] font-mono font-bold text-xs flex items-center justify-center mb-2.5">
                      {idx + 1}
                    </span>
                    <strong className="text-[10px] font-mono text-[#0A192F] uppercase tracking-wider block">{step.label}</strong>
                    <p className="text-[10px] text-gray-400 mt-1 leading-snug">{step.desc}</p>
                    
                    {idx < 6 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Guidelines, Policies & Strict Privacy Notices */}
        {activeTab === 'guidelines' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Regulatory constraints banner */}
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl space-y-4">
              <div className="flex items-center gap-2.5 text-[#AA7C11]">
                <ShieldAlert className="h-6 w-6" />
                <h3 className="text-base font-serif font-black uppercase tracking-wider">CONFIDENTIALITY & REGULATORY OBLIGATIONS</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
                The Aviation Memoir Challenge is structured to enforce global voluntary reporting guidelines (Aviation Safety Action Program / ASAP models). Submissions are voluntary, educational, and safety-oriented. All active crew members and controllers must respect their regulatory, employer, and state parameters:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-white border border-amber-200/50 rounded-lg">
                  <p className="text-[10px] font-mono font-bold text-[#0A192F] uppercase">No Protected Telemetry</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-light leading-normal">
                    Never paste exact flight recorder transcripts, military encryption codes, or secure airline system login telemetry.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200/50 rounded-lg">
                  <p className="text-[10px] font-mono font-bold text-[#0A192F] uppercase">No Under-Litigation Cases</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-light leading-normal">
                    Submissions regarding accidents currently under investigation by the Ministry of Aviation or NCAA should not be posted.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200/50 rounded-lg">
                  <p className="text-[10px] font-mono font-bold text-[#0A192F] uppercase">No Defamatory Claims</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-light leading-normal">
                    Do not use this forum to settle corporate disputes, single-out individual crew members, or defame carriers.
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed guidelines grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3.5">
                <h4 className="text-sm font-mono font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-[#D4AF37]" /> What Can Be Submitted?
                </h4>
                <ul className="space-y-2 text-xs text-gray-600 font-light">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span><strong>Near-Miss Events</strong>: Operational encounters where separation minima or terrain clearance parameters were compromised.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span><strong>Checklist Gaps</strong>: Incidents where following standard operating manuals created unexpected cockpit confusion.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span><strong>Communication Failures</strong>: Accent, terminology, or radio-interference misunderstandings between deck and tower.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span><strong>Ground Operational Deviations</strong>: Fueling anomalies, cargo load slips, or marshalling misunderstandings.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3.5">
                <h4 className="text-sm font-mono font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="h-4.5 w-4.5 text-[#D4AF37]" /> Editorial Integrity Notice
                </h4>
                <ul className="space-y-2 text-xs text-gray-600 font-light">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span><strong>No Automatic Publication</strong>: Domislink safety board reviews every submission. We do not promise indexation of every memoir.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span><strong>Rigorous Sanitisation</strong>: If a memoir is approved but contains identifiers (such as tail numbers or individual names), our team will strip them out.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span><strong>Voluntary Withdrawal</strong>: Authors can request the deletion or redaction of their logged memoirs at any time using our secret registry keys.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Submission Gate Form */}
        {activeTab === 'submit' && (
          <div className="max-w-3xl mx-auto bg-white border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldAlert className="h-6 w-6 text-[#D4AF37]" />
              <div>
                <h3 className="text-lg font-serif font-black text-[#0A192F] uppercase tracking-wider">
                  SAFETY BRIEFING GATEWAY
                </h3>
                <p className="text-xs text-gray-400 font-mono uppercase">Secured TLS Encryption Active</p>
              </div>
            </div>

            {success ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-4">
                <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-serif font-bold text-[#0A192F]">Memoir Successfully Logged</h4>
                <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed max-w-md mx-auto">
                  Your safety report has been transmitted to our central queue. It will now go through triage, redaction, and optional anonymisation before being committed to the public ledger.
                </p>
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] uppercase font-bold tracking-wider">
                  AWAITING BOARD TRIAGE
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-semibold">
                    ✕ {errorMsg}
                  </div>
                )}

                {/* Identity Toggle */}
                <div className="p-4 bg-[#FCFBF7] rounded-xl border border-gray-100 space-y-3">
                  <label className="flex items-center space-x-2.5 text-xs font-bold text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <span>Anonymise my name and company in the public directory</span>
                  </label>
                  <p className="text-[10px] text-gray-400 font-light leading-normal">
                    Enabling anonymity will replace your public tag with "Anonymised Professional" and mask any company details. The Domislink safety board will still maintain secret validation channels to confirm credentials.
                  </p>

                  {!isAnonymous && (
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">Your Name (For Public Record)</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Capt. Ibrahim Yusuf"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">Profession *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Captain B737, Lead AME, Senior ATCO"
                      className="w-full text-xs p-2.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">Organisation / Airline (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. NCAA, Arik, Air Peace"
                      className="w-full text-xs p-2.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">Safety Category *</label>
                    <select
                      className="w-full text-xs p-2.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                      value={experienceCategory}
                      onChange={(e) => setExperienceCategory(e.target.value)}
                    >
                      <option>Near-Miss Experience</option>
                      <option>Operational Insight</option>
                      <option>Safety Recommendation</option>
                      <option>Lessons Learned Case study</option>
                      <option>Fuel/Logistics Anomaly</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">Brief Case / Incident Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Runway incursion hazard due to overlapping ATC transmissions at DNMM"
                    className="w-full text-xs p-2.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800 font-bold"
                    value={memoTitle}
                    onChange={(e) => setMemoTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">The Safety Memoir / Incident Narrative *</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Provide a comprehensive narrative of the anomaly. To protect privacy, do not disclose active tail numbers, pilot license IDs, or individual supervisor names."
                    className="w-full text-xs p-2.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                    value={memoContent}
                    onChange={(e) => setMemoContent(e.target.value)}
                  />
                </div>

                {/* Lesson & Action */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">Core Lesson Learned *</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="What was the human factor, atmospheric shift, or mechanical blindspot identified?"
                      className="w-full text-xs p-2.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                      value={lessonLearned}
                      onChange={(e) => setLessonLearned(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">Recommended Preventive Action *</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="Describe what crew check-lists, engineering practices, or ground operations should do to prevent recursion."
                      className="w-full text-xs p-2.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                      value={recommendedImprovement}
                      onChange={(e) => setRecommendedImprovement(e.target.value)}
                    />
                  </div>
                </div>

                {/* Mandatory Checkboxes */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <span className="text-[10px] font-mono font-bold text-[#AA7C11] uppercase tracking-wider block">
                    COMPLIANCE & CONSENT CHECKLISTS:
                  </span>
                  
                  <div className="space-y-2.5 text-[10px] text-gray-700 font-light">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        required
                        className="mt-0.5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        checked={consentSecurity}
                        onChange={(e) => setConsentSecurity(e.target.checked)}
                      />
                      <span>I confirm that this briefing does NOT contain state secrets, active military telemetry, classified codes, or proprietary intellectual property. *</span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        required
                        className="mt-0.5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        checked={consentLiability}
                        onChange={(e) => setConsentLiability(e.target.checked)}
                      />
                      <span>I understand that submission does not guarantee publication on the ledger or the public archive at aviationmemoir.domislink.com. *</span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        required
                        className="mt-0.5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        checked={consentAnonymity}
                        onChange={(e) => setConsentAnonymity(e.target.checked)}
                      />
                      <span>I authorize Domislink safety inspectors to edit, sanitize, and remove specific company or personal tags to guarantee anonymity. *</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('about')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-all flex items-center space-x-2 shadow-md"
                  >
                    <span>{submitting ? 'COMMITTING RECORDFILE...' : 'TRANSMIT SAFETY MEMOIR'}</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>

              </form>
            )}
          </div>
        )}

        {/* TAB 4: Archive Ledger Grid (with Admin CMS inline edit modes!) */}
        {activeTab === 'archive' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF37]/20 pb-4 gap-2">
              <h3 className="text-lg font-serif font-black text-[#0A192F] uppercase tracking-wider flex items-center">
                <ListFilter className="h-5 w-5 mr-2 text-[#D4AF37]" />
                SECURED ARCHIVAL LEDGER ({memos.length})
              </h3>
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#5A6E85]">
                <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Live Sanitised Feed</span>
              </div>
            </div>

            {/* Admin Privilege Banner */}
            {isAdmin && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between text-xs text-indigo-900 font-mono">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-indigo-700 animate-pulse" /> 
                  ADMIN LEVEL-3 DELEGATE VIEW ACTIVE
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-700">
                  Inline CMS Editing & Redaction Enabled
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {memos.map((memo) => {
                const isEditing = editingMemoId === memo.id;

                return (
                  <div 
                    key={memo.id}
                    className="bg-white border border-[#D4AF37]/15 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                  >
                    {isAdmin && !isEditing && (
                      <div className="absolute top-4 right-4 flex items-center space-x-1.5 z-10">
                        <button
                          onClick={() => toggleMemoAnonymity(memo)}
                          className="p-1.5 bg-[#FCFBF7] hover:bg-[#0A192F] hover:text-[#D4AF37] rounded-full border border-gray-200 transition-colors shadow-sm"
                          title="Toggle Anonymity Override"
                        >
                          {memo.isAnonymous ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={() => startEditMemo(memo)}
                          className="p-1.5 bg-[#FCFBF7] hover:bg-[#D4AF37] hover:text-white rounded-full border border-gray-200 transition-colors shadow-sm"
                          title="Edit Safety Record"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteMemo(memo.id)}
                          className="p-1.5 bg-[#FCFBF7] hover:bg-red-600 hover:text-white rounded-full border border-gray-200 transition-colors shadow-sm"
                          title="Purge Record"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {isEditing ? (
                      <div className="space-y-3.5 text-left">
                        <div>
                          <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Case Title</label>
                          <input 
                            type="text"
                            className="w-full text-xs p-1.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                            value={editForm?.memoTitle || ''}
                            onChange={(e) => setEditForm(prev => prev ? { ...prev, memoTitle: e.target.value } : null)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Profession</label>
                            <input 
                              type="text"
                              className="w-full text-xs p-1.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                              value={editForm?.profession || ''}
                              onChange={(e) => setEditForm(prev => prev ? { ...prev, profession: e.target.value } : null)}
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Organisation</label>
                            <input 
                              type="text"
                              className="w-full text-xs p-1.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                              value={editForm?.organisation || ''}
                              onChange={(e) => setEditForm(prev => prev ? { ...prev, organisation: e.target.value } : null)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Category</label>
                          <select
                            className="w-full text-xs p-1.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                            value={editForm?.experienceCategory || ''}
                            onChange={(e) => setEditForm(prev => prev ? { ...prev, experienceCategory: e.target.value } : null)}
                          >
                            <option>Near-Miss Experience</option>
                            <option>Operational Insight</option>
                            <option>Safety Recommendation</option>
                            <option>Lessons Learned Case study</option>
                            <option>Fuel/Logistics Anomaly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Memoir Narrative</label>
                          <textarea 
                            rows={3}
                            className="w-full text-xs p-1.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                            value={editForm?.memoContent || ''}
                            onChange={(e) => setEditForm(prev => prev ? { ...prev, memoContent: e.target.value } : null)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Lesson Learned</label>
                            <textarea 
                              rows={2}
                              className="w-full text-xs p-1.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                              value={editForm?.lessonLearned || ''}
                              onChange={(e) => setEditForm(prev => prev ? { ...prev, lessonLearned: e.target.value } : null)}
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Preventive Action</label>
                            <textarea 
                              rows={2}
                              className="w-full text-xs p-1.5 bg-[#FCFBF7] border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                              value={editForm?.recommendedImprovement || ''}
                              onChange={(e) => setEditForm(prev => prev ? { ...prev, recommendedImprovement: e.target.value } : null)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-1.5 pt-1">
                          <button 
                            type="button" 
                            onClick={cancelEditMemo} 
                            className="px-2 py-1 border border-gray-300 rounded text-[10px] font-semibold text-gray-600 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button 
                            type="button" 
                            onClick={saveEditMemo} 
                            className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#B89025] text-white rounded text-[10px] font-semibold flex items-center shadow-sm"
                          >
                            <Check className="h-3 w-3 mr-0.5" /> Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase bg-amber-50 text-[#AA7C11] border border-[#D4AF37]/20 rounded">
                              {memo.experienceCategory}
                            </span>
                            <span className="text-[9px] font-mono text-gray-400">
                              {new Date(memo.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-serif font-extrabold text-[#0A192F] tracking-wide leading-snug">
                              "{memo.memoTitle}"
                            </h4>
                            <p className="text-[9px] font-semibold text-[#5A6E85] mt-1.5 uppercase tracking-wide">
                              Recorded by: {memo.isAnonymous ? 'Anonymised Professional' : memo.name} ({memo.profession})
                            </p>
                          </div>

                          <div className="h-px bg-gray-100"></div>

                          {/* Content logs */}
                          <div className="space-y-3.5 text-xs">
                            <p className="text-[#5A6E85] font-light leading-relaxed italic">
                              "{memo.memoContent}"
                            </p>

                            <div className="p-3 bg-[#FCFBF7] rounded-lg border border-[#D4AF37]/10 space-y-1">
                              <p className="text-[8px] font-mono font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1">
                                <Bookmark className="h-3 w-3 text-[#D4AF37]" /> Core Lesson Learned:
                              </p>
                              <p className="text-[11px] text-[#5A6E85] font-light leading-normal">{memo.lessonLearned}</p>
                            </div>

                            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 space-y-1">
                              <p className="text-[8px] font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-emerald-600" /> Preventive Action Recommendation:
                              </p>
                              <p className="text-[11px] text-emerald-800 font-light leading-normal">{memo.recommendedImprovement}</p>
                            </div>
                          </div>
                        </div>

                        {/* Card footer details */}
                        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[8px] font-mono text-gray-400">
                          <span>LOGFILE // ID: {memo.id.substring(0, 11).toUpperCase()}</span>
                          <span className="text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-emerald-500" />
                            {memo.isAnonymous ? 'SECURED & ANONYMOUS' : 'VERIFIED ID RECORD'}
                          </span>
                        </div>
                      </>
                    )}

                  </div>
                );
              })}

              {memos.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white border border-[#D4AF37]/15 rounded-xl text-[#5A6E85]">
                  <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold uppercase tracking-wider font-mono">Ledger is currently empty</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-normal">
                    No sanitised safety briefings have been approved yet. Use the "Submission Gate" tab to log the initial near-miss briefing!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: FAQs */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-1 mb-8">
              <HelpCircle className="h-8 w-8 text-[#D4AF37] mx-auto mb-1" />
              <h3 className="text-lg font-serif font-extrabold text-[#0A192F] uppercase">Frequently Asked Questions</h3>
              <p className="text-xs text-gray-500 font-light">Addressing safety reporting codes and platform compliance rules.</p>
            </div>

            {[
              {
                q: "Is my anonymity legally and professionally secure?",
                a: "Yes. In voluntary aviation safety systems (ASAP/SGS), the primary goal is risk mitigation rather than discipline. By selecting 'Anonymise my name' in the form, your identifying details are never published on the ledger. They are saved in a protected administrative buffer used only by verified Domislink analysts to validate the legitimacy of credentials."
              },
              {
                q: "What is the relationship with aviationmemoir.domislink.com?",
                a: "aviationmemoir.domislink.com is the official central web repository hosting our safety literature and historical de-briefing archives. This interactive summit terminal serves as a real-time gateway where records can be drafted, processed, and updated instantly before syncing."
              },
              {
                q: "Will my employer or airline find out about my near-miss submission?",
                a: "Not unless you authorize disclosure. Our triage board strips airline identifiers, Tail/Registration numbers, and airport callsigns where appropriate, translating descriptions into generalized technical summaries. We protect our community from operational and commercial backlash."
              },
              {
                q: "Can I submit active security codes or ongoing legal litigation telemetry?",
                a: "Absolutely not. You are under strict legal and professional obligation to withhold active state secrets, active defense codes, and data currently under FAA/NCAA active litigation. Doing so violates standard aviation code."
              },
              {
                q: "Is every single memoir guaranteed to be published?",
                a: "No. The safety committee triages every report. Submissions that lack educational lessons, comprise purely commercial complaints, or contain severe identifier leaks that cannot be cleanly redacted are rejected."
              }
            ].map((item, index) => {
              const isOpen = expandedFaq === index;

              return (
                <div 
                  key={index}
                  className="bg-white border border-[#D4AF37]/15 rounded-xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FCFBF7] transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-serif font-bold text-[#0A192F]">{item.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#D4AF37] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#5A6E85] leading-relaxed font-light border-t border-gray-100 bg-[#FCFBF7]/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
