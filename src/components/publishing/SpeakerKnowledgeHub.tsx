/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, CheckCircle, Clock, FileText, Mic, BookOpen, Radio, 
  User, Building2, Calendar, Mail, FileSpreadsheet, Presentation, 
  ExternalLink, Sparkles, Check, AlertTriangle, Award, QrCode
} from 'lucide-react';
import { INITIAL_SPEAKER_RECORDS, SpeakerKnowledgeRecord } from '../../data/speakerPublicationData';

export default function SpeakerKnowledgeHub() {
  const [records, setRecords] = useState<SpeakerKnowledgeRecord[]>(INITIAL_SPEAKER_RECORDS);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'recording' | 'transcription' | 'approval' | 'handbook' | 'podcast' | 'workspace'>('overview');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentRecord = records.find(r => r.id === selectedRecordId) || records[0];

  const handleToggleApproval = (field: keyof SpeakerKnowledgeRecord['approvalStatus']) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === currentRecord.id) {
        return {
          ...rec,
          approvalStatus: {
            ...rec.approvalStatus,
            [field]: !rec.approvalStatus[field]
          }
        };
      }
      return rec;
    }));
    setSuccessMsg(`Successfully updated approval status for ${field}.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleUpdateTranscript = (newText: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === currentRecord.id) {
        return { ...rec, editedTranscript: newText };
      }
      return rec;
    }));
    setSuccessMsg('Transcript updated by authorized editor.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <section id="speaker-knowledge-hub" className="py-20 bg-[#0A192F] text-white relative overflow-hidden border-t border-[#D4AF37]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono uppercase">
              <Shield className="h-3.5 w-3.5" />
              <span>DomisLink Speaker Knowledge Hub & Publishing Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight uppercase mt-2">
              Speaker Publication Workspace
            </h2>
            <p className="text-xs sm:text-sm text-[#8A99AD] font-light mt-1">
              Transforming live summit presentations into permanent handbooks, digital books, and podcast episodes.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono rounded-xl">
              Active Speaker: {currentRecord.speakerName}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-white/60 hover:text-white">✕</button>
          </div>
        )}

        {/* Speaker Selector Bar */}
        <div className="bg-[#071324] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
            Select Confirmed Speaker Workspace
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {records.map(rec => (
              <button
                key={rec.id}
                onClick={() => setSelectedRecordId(rec.id)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center space-x-3 ${
                  selectedRecordId === rec.id ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-lg' : 'bg-[#0A192F] border-white/10 text-[#8A99AD] hover:text-white'
                }`}
              >
                <img src={rec.photographUrl} alt={rec.speakerName} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40 shrink-0" />
                <div className="overflow-hidden">
                  <h4 className="font-serif font-bold text-xs text-white truncate">{rec.speakerName}</h4>
                  <p className="text-[10px] text-[#D4AF37] truncate mt-0.5">{rec.organisation}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Main Card */}
        <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          
          {/* Speaker Profile Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center space-x-5">
              <img src={currentRecord.photographUrl} alt={currentRecord.speakerName} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D4AF37]/50 shadow-lg" />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono">{currentRecord.category}</span>
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">{currentRecord.handbookStatus}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">{currentRecord.speakerName}</h3>
                <p className="text-xs text-[#8A99AD] font-mono">{currentRecord.position} • <span className="text-white">{currentRecord.organisation}</span></p>
                <p className="text-xs text-[#D4AF37] font-medium mt-1">Topic: "{currentRecord.approvedTopic}"</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[10px]">
              <div className="bg-[#0A192F] p-2.5 rounded-xl border border-white/10">
                <span className="text-[#8A99AD] block">Session</span>
                <span className="text-white font-bold mt-0.5 block truncate">{currentRecord.session}</span>
              </div>
              <div className="bg-[#0A192F] p-2.5 rounded-xl border border-white/10">
                <span className="text-[#8A99AD] block">ISBN</span>
                <span className="text-[#D4AF37] font-bold mt-0.5 block">{currentRecord.isbn || 'Pending'}</span>
              </div>
              <div className="bg-[#0A192F] p-2.5 rounded-xl border border-white/10">
                <span className="text-[#8A99AD] block">Podcast Ep</span>
                <span className="text-white font-bold mt-0.5 block">Ep #{currentRecord.podcastEpisodeNumber}</span>
              </div>
              <div className="bg-[#0A192F] p-2.5 rounded-xl border border-white/10">
                <span className="text-[#8A99AD] block">Approval</span>
                <span className="text-emerald-400 font-bold mt-0.5 block">Verified</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
            {[
              { id: 'overview', label: '1. Knowledge Hub Overview', icon: User },
              { id: 'recording', label: '2. Speaker Recording', icon: Mic },
              { id: 'transcription', label: '3. Transcription & Editing', icon: FileText },
              { id: 'approval', label: '4. Speaker Approval Dashboard', icon: CheckCircle },
              { id: 'handbook', label: '5. Handbook Generator', icon: BookOpen },
              { id: 'podcast', label: '6. Podcast Engine', icon: Radio },
              { id: 'workspace', label: '7. Google Workspace (Drive/Gmail/Cal)', icon: Calendar }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === tab.id ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg' : 'bg-[#0A192F] text-[#8A99AD] hover:text-white border border-white/10'
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-[#D4AF37]">Speaker & Organisation Identity</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Full Name:</span>
                      <span className="font-bold text-white">{currentRecord.speakerName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Organisation:</span>
                      <span className="font-bold text-white">{currentRecord.organisation}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Position:</span>
                      <span className="font-bold text-white">{currentRecord.position}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Category:</span>
                      <span className="font-bold text-[#D4AF37]">{currentRecord.category}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-[#D4AF37]">Publication & Pricing Status</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Handbook Status:</span>
                      <span className="font-bold text-emerald-400">{currentRecord.handbookStatus}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Soft Copy Price:</span>
                      <span className="font-bold text-[#D4AF37]">₦{currentRecord.softCopyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Hard Copy Price:</span>
                      <span className="font-bold text-[#D4AF37]">₦{currentRecord.hardCopyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-white/10">
                      <span className="text-[#8A99AD]">Page Count:</span>
                      <span className="font-bold text-white">{currentRecord.pageCount} Pages</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-[#D4AF37]">Rights & Consent Checklist</h4>
                  <div className="space-y-2 text-xs font-mono">
                    {Object.entries(currentRecord.rightsAndConsent).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-[#8A99AD] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className={val ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                          {val ? '✓ Approved' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('recording')}
                  className="px-6 py-2.5 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Speaker Recording</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RECORDING */}
          {activeTab === 'recording' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">Speaker Recording Management</h4>
                    <p className="text-xs text-[#8A99AD]">Accepting approved audio recordings supplied by speaker or organiser.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">Permission Verified</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#071324] border border-white/10 rounded-xl p-5 space-y-4">
                    <h5 className="text-xs font-mono uppercase text-[#D4AF37]">Original Summit Presentation Audio</h5>
                    <div className="p-4 bg-[#0A192F] rounded-xl border border-white/10 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-[#D4AF37]/15 rounded-xl text-[#D4AF37]">
                          <Mic className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{currentRecord.audioFileName}</p>
                          <p className="text-[10px] text-[#8A99AD] font-mono">Source: Live Summit Session • {currentRecord.session}</p>
                        </div>
                      </div>
                      <audio controls className="w-full h-8 mt-2">
                        <source src="#" type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>

                  <div className="bg-[#071324] border border-white/10 rounded-xl p-5 space-y-4">
                    <h5 className="text-xs font-mono uppercase text-[#D4AF37]">Upload Additional Recording</h5>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center space-y-3 hover:border-[#D4AF37]/50 transition">
                      <Mic className="h-8 w-8 text-[#D4AF37] mx-auto" />
                      <p className="text-xs text-white font-semibold">Drop interview / podcast audio file here (.mp3, .wav)</p>
                      <input type="file" accept="audio/*" className="text-xs text-[#8A99AD] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37] file:text-[#0A192F] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSCRIPTION */}
          {activeTab === 'transcription' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">Authorised Editor Transcription Review</h4>
                    <p className="text-xs text-[#8A99AD]">Correct spelling, technical terms, aviation names, numbers, and dates without altering meaning.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono">Editor Workspace</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#8A99AD]">Original AI / Automated Transcript</label>
                    <textarea
                      readOnly
                      rows={7}
                      value={currentRecord.transcript}
                      className="w-full px-3.5 py-2.5 bg-[#071324] border border-white/15 rounded-xl text-xs text-neutral-400 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#D4AF37]">Edited & Approved Transcript (Authorised Editor)</label>
                    <textarea
                      rows={7}
                      value={currentRecord.editedTranscript}
                      onChange={e => handleUpdateTranscript(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#071324] border border-[#D4AF37]/50 rounded-xl text-xs text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPROVAL DASHBOARD */}
          {activeTab === 'approval' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">Speaker Approval Dashboard</h4>
                    <p className="text-xs text-[#8A99AD]">No speaker publication becomes public until required approvals are complete.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">Quality Control Gate</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(currentRecord.approvalStatus).map(([key, val]) => (
                    <div 
                      key={key} 
                      onClick={() => handleToggleApproval(key as any)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        val ? 'bg-emerald-950/40 border-emerald-500/40 text-white' : 'bg-[#071324] border-white/10 text-[#8A99AD] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[#8A99AD] uppercase block">Approval Item</span>
                        <span className="text-xs font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${val ? 'bg-emerald-500 text-[#0A192F]' : 'bg-white/10 text-neutral-400'}`}>
                        {val ? '✓' : '○'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HANDBOOK GENERATOR */}
          {activeTab === 'handbook' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">Generate Handbook — DomisLink Publishing Standards</h4>
                    <p className="text-xs text-[#8A99AD]">Using approved material only: Cover, Title Page, Copyright, Author Bio, Core Message, Practical Lessons, Case Studies, Recommendations, and Checklist.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono">{currentRecord.handbookTitle}</span>
                </div>

                <div className="bg-[#071324] border border-[#D4AF37]/30 rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6 text-[#D4AF37]" />
                    <div>
                      <h5 className="font-serif font-bold text-sm text-white">Tangible Publication Record Ready</h5>
                      <p className="text-xs text-[#8A99AD]">ISBN: {currentRecord.isbn || 'Pending'} • Edition: 2026 Golden Crown Summit Publication</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0A192F] rounded-xl border border-white/10 text-xs text-neutral-300 space-y-2 font-mono">
                    <p className="text-[#D4AF37] font-bold">Generated Structure Outline:</p>
                    <p>1. Cover & Title Page | 2. Copyright & Publisher | 3. About the Speaker | 4. Introduction & Central Message | 5. Main Content Chapters | 6. Case Studies & Safety Lessons | 7. Recommendations & Action Checklist | 8. Domislink Knowledge Library Back Cover.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PODCAST ENGINE */}
          {activeTab === 'podcast' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">DomisLink Aviation Safety Podcast Episode</h4>
                    <p className="text-xs text-[#8A99AD]">Episode #{currentRecord.podcastEpisodeNumber}: {currentRecord.podcastTitle}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">{currentRecord.podcastStatus}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#071324] border border-white/10 rounded-xl p-5 space-y-3">
                    <h5 className="text-xs font-mono uppercase text-[#D4AF37]">Episode Show Notes & Takeaways</h5>
                    <ul className="space-y-1.5 text-xs text-neutral-300 font-mono">
                      {currentRecord.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="text-[#D4AF37]">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#071324] border border-white/10 rounded-xl p-5 space-y-3">
                    <h5 className="text-xs font-mono uppercase text-[#D4AF37]">Book Connection Link</h5>
                    <div className="p-3 bg-[#0A192F] rounded-xl border border-white/10 text-xs space-y-1">
                      <p className="font-bold text-white">{currentRecord.handbookTitle}</p>
                      <p className="text-[#D4AF37] font-mono">₦{currentRecord.softCopyPrice.toLocaleString()} (Soft Copy) | ₦{currentRecord.hardCopyPrice.toLocaleString()} (Hard Copy)</p>
                      <span className="text-[10px] text-emerald-400 block mt-1">✓ Connected to Paystack Bookstore Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: WORKSPACE INTEGRATION */}
          {activeTab === 'workspace' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">Google Workspace Integration Hub</h4>
                    <p className="text-xs text-[#8A99AD]">Connected Google Drive, Gmail AI, Calendar milestones, Slides, and Sheets tracking.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono">Synced</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#071324] p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-[#D4AF37]">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase">Google Drive</span>
                    </div>
                    <p className="text-[11px] text-[#8A99AD]">Approved audio, transcripts, manuscripts, and cover files stored securely.</p>
                  </div>

                  <div className="bg-[#071324] p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-[#D4AF37]">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase">DomisMail AI</span>
                    </div>
                    <p className="text-[11px] text-[#8A99AD]">Automated speaker invitations, transcript reviews, and book orders.</p>
                  </div>

                  <div className="bg-[#071324] p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-[#D4AF37]">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase">Google Calendar</span>
                    </div>
                    <p className="text-[11px] text-[#8A99AD]">Scheduled speaker sessions, review meetings, and podcast launches.</p>
                  </div>

                  <div className="bg-[#071324] p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-[#D4AF37]">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase">Google Sheets</span>
                    </div>
                    <p className="text-[11px] text-[#8A99AD]">Production tracker for speaker status, ISBNs, and order counts.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
