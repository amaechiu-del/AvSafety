/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, Mic, FileText, CheckCircle, Sparkles, Upload, Eye, 
  Download, Edit3, Shield, User, Building2, BookOpen, ExternalLink,
  Copy, Check, RefreshCw, Send, Calendar, MapPin, Presentation
} from 'lucide-react';
import { INITIAL_VERIFIED_SPEAKERS } from '../../data/speakersData';
import { Speaker } from '../../types';
import SpeakerAudioUpload from './SpeakerAudioUpload';

export default function SpeakerHandbookEngine() {
  const [speakers, setSpeakers] = useState<Speaker[]>(INITIAL_VERIFIED_SPEAKERS);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>(speakers[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'profile' | 'audio' | 'generator' | 'review' | 'cover' | 'product'>('profile');
  
  // Audio state
  const [audioFile, setAudioFile] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>(
    'In this presentation for the Aviation Safety Summit 2026, we explore the critical imperatives of enforcing regulatory compliance, conducting rigorous safety audits, and maintaining uncompromising zero-accident standards across all commercial flight operations.'
  );

  // Handbook Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [handbookGenerated, setHandbookGenerated] = useState(false);
  const [handbookStatus, setHandbookStatus] = useState<'DRAFT' | 'EDITING' | 'SPEAKER_REVIEW' | 'APPROVED' | 'PUBLISHED'>('DRAFT');
  const [customPrice, setCustomPrice] = useState<string>('4500');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedSpeaker = speakers.find(s => s.id === selectedSpeakerId) || speakers[0];

  const constructedTitle = `"${selectedSpeaker?.topic || 'Aviation Safety Innovation'}" By: ${selectedSpeaker?.name || 'Speaker'} Aviation Safety Summit 2026 DomisLink International Services Ltd The Digital Empire`;

  const handleTranscribeAudio = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
      setTranscript(`[Verified Speaker Audio Transcription - ${selectedSpeaker.name}]: 
"Welcome colleagues and esteemed delegates to the Aviation Safety Summit 2026. Everybody is involved in aviation safety. From the flight deck to the regulatory office, our collective mandate is to ensure zero accidents through rigorous audits, non-punitive reporting, and proactive risk mitigation."`);
      setSuccessMsg('Audio successfully transcribed and cleaned.');
    }, 1500);
  };

  const handleGenerateHandbook = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHandbookGenerated(true);
      setHandbookStatus('SPEAKER_REVIEW');
      setSuccessMsg('Speaker handbook successfully structured and generated according to DomisLink publishing standards!');
    }, 2000);
  };

  const handleApproveAndPublish = () => {
    setHandbookStatus('PUBLISHED');
    setSuccessMsg('Handbook approved and automatically added to the DomisLink Bookstore!');
  };

  const aiPromptText = `You are helping me develop my Aviation Safety Summit presentation into a professional handbook.
My topic is: "${selectedSpeaker.topic}"
My name is: "${selectedSpeaker.name}"
My organisation is: "${selectedSpeaker.organisation}"
Using only the material I provide, create a structured handbook outline containing: Foreword, Executive Summary, Main Topic, Key Lessons, Practical Examples, Case Studies, Recommendations, Action Points, Checklist, Key Questions, References, and Summit Information.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  return (
    <section id="speaker-handbook-engine" className="py-24 bg-gradient-to-b from-[#0A192F] via-[#0E203C] to-[#0A192F] text-white border-t border-[#D4AF37]/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
            <Award className="h-3.5 w-3.5" />
            <span>DomisLink Publishing & Speaker Handbook Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight uppercase">
            Voice to Permanent Publication
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            Transform confirmed summit speakers into permanent DomisLink authors. From voice recording to AI transcription, structured drafting, speaker review, and bookstore publication.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-white/60 hover:text-white">✕</button>
          </div>
        )}

        {/* Speaker Selector Bar */}
        <div className="bg-[#071324] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl space-y-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
            Select Confirmed Speaker for Handbook Generation
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {speakers.map(sp => (
              <button
                key={sp.id}
                onClick={() => setSelectedSpeakerId(sp.id)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedSpeakerId === sp.id ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-lg' : 'bg-[#0A192F] border-white/10 text-[#8A99AD] hover:text-white'
                }`}
              >
                <div>
                  <h4 className="font-serif font-bold text-xs text-white line-clamp-1">{sp.name}</h4>
                  <p className="text-[10px] text-[#D4AF37] line-clamp-1 mt-0.5">{sp.organisation}</p>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 w-fit border border-white/10">{sp.industry}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Speaker Card & Navigation Tabs */}
        <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif font-extrabold text-xl shrink-0">
                {selectedSpeaker.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">{selectedSpeaker.category}</span>
                <h3 className="text-xl font-serif font-bold text-white">{selectedSpeaker.name}</h3>
                <p className="text-xs text-[#8A99AD] font-mono">{selectedSpeaker.position} • {selectedSpeaker.organisation}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono border border-blue-500/30">
                Status: {handbookStatus}
              </span>
            </div>
          </div>

          {/* Workflow Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
            {[
              { id: 'profile', label: '1. Speaker & Topic Profile', icon: User },
              { id: 'audio', label: '2. Voice & Transcription', icon: Mic },
              { id: 'generator', label: '3. AI Handbook Generator', icon: Sparkles },
              { id: 'review', label: '4. Speaker Review', icon: Edit3 },
              { id: 'cover', label: '5. Book Cover Design', icon: BookOpen },
              { id: 'product', label: '6. Bookstore Product', icon: Award }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === tab.id ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg' : 'bg-[#0A192F] text-[#8A99AD] hover:text-white border border-white/10'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A192F] border border-white/10 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[#D4AF37]">Approved Speaking Topic</h4>
                  <p className="text-sm font-serif font-bold text-white">{selectedSpeaker.topic}</p>
                  <p className="text-xs text-[#8A99AD] font-light leading-relaxed mt-2">{selectedSpeaker.whyTopicMatters}</p>
                </div>

                <div className="bg-[#0A192F] border border-white/10 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[#D4AF37]">Proposed Handbook Title</h4>
                  <div className="p-3 bg-[#071324] border border-[#D4AF37]/30 rounded-lg text-xs font-mono text-neutral-200">
                    {constructedTitle}
                  </div>
                  <p className="text-[11px] text-[#8A99AD]">Automatically formatted according to DomisLink International Services Ltd standards.</p>
                </div>
              </div>

              <div className="bg-[#0A192F] border border-white/10 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#D4AF37]">Speaker Biography & Credentials</h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">{selectedSpeaker.bio}</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('audio')}
                  className="px-6 py-2.5 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center space-x-2"
                >
                  <span>Proceed to Voice & Audio</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO & TRANSCRIPTION */}
          {activeTab === 'audio' && (
            <div className="space-y-6 animate-in fade-in">
              <SpeakerAudioUpload
                speakerId={selectedSpeaker.id}
                speakerName={selectedSpeaker.name}
                speakerTopic={selectedSpeaker.topic}
                organisation={selectedSpeaker.organisation}
                onTranscriptReady={(newTranscript) => {
                  setTranscript(newTranscript);
                  setActiveTab('generator');
                }}
              />
            </div>
          )}

          {/* TAB 3: AI GENERATOR */}
          {activeTab === 'generator' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">AI Prompt Generator for Speaker</h4>
                    <p className="text-xs text-[#8A99AD]">Copy prompt to use with AI assistants while preserving strict attribution rules.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    {copiedPrompt ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedPrompt ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <div className="p-4 bg-[#071324] border border-white/10 rounded-xl text-xs font-mono text-neutral-300">
                  {aiPromptText}
                </div>
              </div>

              <div className="bg-[#0A192F] border border-[#D4AF37]/30 rounded-xl p-6 text-center space-y-4">
                <Sparkles className="h-10 w-10 text-[#D4AF37] mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-base font-serif font-bold text-white">Ready to Generate Full Professional Handbook</h4>
                  <p className="text-xs text-[#8A99AD] max-w-md mx-auto">
                    Creates Foreword, Executive Summary, Main Topic Chapters, Key Lessons, Practical Examples, Case Studies, Recommendations, Checklists, and References.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateHandbook}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? 'Structuring Handbook...' : 'Generate Speaker Handbook Draft'}
                </button>
              </div>

              {handbookGenerated && (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <span>Handbook draft successfully created! Proceed to Speaker Review tab.</span>
                  <button onClick={() => setActiveTab('review')} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded">Review Handbook</button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SPEAKER REVIEW */}
          {activeTab === 'review' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-base font-serif font-bold text-white">Editorial Safety & Speaker Review Portal</h4>
                    <p className="text-xs text-[#8A99AD]">Review contents, approve biographical credentials, and verify editorial additions.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono">Pending Speaker Sign-off</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#071324] rounded-xl border border-white/10 space-y-2">
                    <h5 className="font-bold text-[#D4AF37] uppercase tracking-wider">1. Title & Cover Verification</h5>
                    <p className="text-white">{constructedTitle}</p>
                  </div>

                  <div className="p-4 bg-[#071324] rounded-xl border border-white/10 space-y-2">
                    <h5 className="font-bold text-[#D4AF37] uppercase tracking-wider">2. Core Chapters & Action Points</h5>
                    <p className="text-neutral-300 leading-relaxed">
                      Includes verbatim speaker transcript extracts combined with structured DomisLink editorial safety frameworks. Fully checked against attribution guidelines.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cover')}
                    className="px-6 py-2.5 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110"
                  >
                    Approve & View Cover Design
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BOOK COVER GENERATOR */}
          {activeTab === 'cover' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="max-w-md mx-auto bg-gradient-to-b from-[#0A192F] via-[#0E203C] to-[#071324] border-2 border-[#D4AF37] rounded-2xl p-8 text-center space-y-6 shadow-2xl relative">
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#D4AF37] text-[#0A192F] text-[9px] font-mono font-bold rounded">
                  GOLDEN CROWN EDITION
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Aviation Safety Summit 2026</span>
                  <h3 className="text-lg font-serif font-bold text-white uppercase leading-snug">
                    {selectedSpeaker.topic}
                  </h3>
                </div>

                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] font-serif font-black text-2xl">
                  {selectedSpeaker.name.charAt(0)}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">{selectedSpeaker.name}</p>
                  <p className="text-xs text-[#8A99AD]">{selectedSpeaker.organisation}</p>
                </div>

                <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-[#8A99AD]">
                  DOMISLINK INTERNATIONAL SERVICES LTD<br />
                  THE DIGITAL EMPIRE
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('product')}
                  className="px-6 py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg"
                >
                  Create Bookstore Product
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: BOOKSTORE PRODUCT */}
          {activeTab === 'product' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-base font-serif font-bold text-white">Publish to DomisLink Bookstore</h4>
                    <p className="text-xs text-[#8A99AD]">Set final pricing and make this speaker handbook live for readers.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">Ready to Publish</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Soft Copy Price (Fixed)</label>
                    <input type="text" readOnly value="₦4,500" className="w-full px-3 py-2 bg-[#071324] border border-white/15 rounded-xl text-xs text-[#D4AF37] font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Hard Copy Price (Fixed)</label>
                    <input type="text" readOnly value="₦9,000" className="w-full px-3 py-2 bg-[#071324] border border-white/15 rounded-xl text-xs text-[#D4AF37] font-mono" />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleApproveAndPublish}
                    className="px-8 py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    Publish to DomisLink Bookstore Now
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
