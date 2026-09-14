/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radio, Play, Sparkles, Search, BookOpen, User, Building2, 
  CheckCircle, Shield, Calendar, ExternalLink, MessageSquare, Download, PlusCircle 
} from 'lucide-react';
import { INITIAL_SPEAKER_RECORDS, SpeakerKnowledgeRecord } from '../../data/speakerPublicationData';
import PodcastEpisodeGenerator from './PodcastEpisodeGenerator';

export default function PodcastEngineHub() {
  const [records] = useState<SpeakerKnowledgeRecord[]>(INITIAL_SPEAKER_RECORDS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEpisode, setActiveEpisode] = useState<SpeakerKnowledgeRecord | null>(records[0]);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [showGenerator, setShowGenerator] = useState<boolean>(false);

  const categories = [
    'ALL',
    'AVIATION_SAFETY',
    'HUMAN_FACTORS',
    'FLIGHT_OPERATIONS',
    'AIRLINES',
    'REGULATION',
    'LEADERSHIP',
    'AIR_NAVIGATION',
    'SIMULATION',
    'INVESTMENT',
    'PASSENGER_SAFETY'
  ];

  const filteredRecords = records.filter(r => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch = r.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.podcastTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.approvedTopic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAskAiProducer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiResponse(`[DomisLink AI Podcast Producer Analysis]: Based on approved summit transcripts for "${activeEpisode?.speakerName}" regarding "${activeEpisode?.approvedTopic}":\n\n1. Suggested Interview Question: "How can regional carriers in Africa implement proactive safety reporting without fear of regulatory reprisal?"\n2. Key Episode Outline: Introduction to shared safety burden -> Real-world incident case study -> Actionable recommendations for airline executives.\n3. Social Media Copy: "Tune into Episode #${activeEpisode?.podcastEpisodeNumber} of the DomisLink Aviation Safety Podcast with ${activeEpisode?.speakerName} as we explore the future of African airspace resilience. Listen now and read the accompanying handbook!"`);
    }, 1000);
  };

  return (
    <section id="domislink-podcast-engine" className="py-20 bg-[#071324] text-white relative overflow-hidden border-t border-[#D4AF37]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono uppercase">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>DomisLink Aviation Safety Podcast & Knowledge Library</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight uppercase">
            Voices of Aviation Safety
          </h2>
          <p className="text-sm text-[#8A99AD] font-light">
            Every approved speaker presentation transforms into an immersive podcast episode connected directly to our permanent handbook bookstore.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#8A99AD]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by speaker, topic, organisation, category, or keyword..."
              className="w-full pl-11 pr-4 py-3 bg-[#071324] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-[#D4AF37] focus:outline-none shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition cursor-pointer ${
                    selectedCategory === cat ? 'bg-[#D4AF37] text-[#0A192F] font-bold shadow-md' : 'bg-[#071324] text-[#8A99AD] hover:text-white border border-white/10'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-xl hover:brightness-110 flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{showGenerator ? 'Close Episode Generator' : 'Generate New Episode (Sections 11 & 12)'}</span>
            </button>
          </div>
        </div>

        {showGenerator && (
          <PodcastEpisodeGenerator onEpisodeGenerated={() => setShowGenerator(false)} />
        )}

        {/* Active Episode Player & Detail view */}
        {activeEpisode && (
          <div className="bg-[#0A192F] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Player & Cover */}
            <div className="space-y-6 lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl group bg-gradient-to-br from-[#050B1A] to-[#0A192F]">
                {activeEpisode.photographUrl ? (
                  <img src={activeEpisode.photographUrl} alt={activeEpisode.speakerName} className="w-full h-72 object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-72 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#0A192F] border-2 border-[#D4AF37] flex items-center justify-center font-serif font-bold text-2xl text-[#FFD700] mb-2 shadow-lg">
                      {activeEpisode.speakerName.split(' ').filter(Boolean).slice(-2).map(p => p[0]).join('').toUpperCase()}
                    </div>
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">OFFICIAL PROFILE</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-black/40 flex flex-col justify-between p-6">
                  <span className="self-start px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] text-[10px] font-mono font-bold">
                    EPISODE #{activeEpisode.podcastEpisodeNumber}
                  </span>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{activeEpisode.organisation}</span>
                    <h3 className="text-lg font-serif font-bold text-white leading-tight">{activeEpisode.podcastTitle}</h3>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-[#071324] border border-white/15 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
                  <span>Audio Stream (Verified)</span>
                  <span className="text-emerald-400">● LIVE</span>
                </div>
                <audio controls className="w-full h-10">
                  <source src="#" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[#8A99AD]">Speaker:</span>
                  <span className="font-bold text-white">{activeEpisode.speakerName}</span>
                </div>
              </div>

              {/* Book Connection Card */}
              <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-mono uppercase font-bold">Related Handbook</span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-white">{activeEpisode.handbookTitle}</h4>
                  <p className="text-[11px] text-[#D4AF37] font-mono mt-0.5">Soft Copy: ₦{activeEpisode.softCopyPrice.toLocaleString()} | Hard Copy: ₦{activeEpisode.hardCopyPrice.toLocaleString()}</p>
                </div>
                <a
                  href="#domislink-bookstore"
                  className="w-full py-2.5 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center justify-center space-x-2 block text-center"
                >
                  <span>Buy Handbook (Paystack)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Details, Show Notes & AI Assistant */}
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3 border-b border-white/10 pb-6">
                <div className="flex items-center space-x-3 text-xs font-mono text-[#D4AF37]">
                  <span>Summit Session: {activeEpisode.session}</span>
                  <span>•</span>
                  <span>Published: {activeEpisode.publicationDate}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">{activeEpisode.approvedTopic}</h3>
                <p className="text-xs text-[#8A99AD] leading-relaxed">{activeEpisode.podcastDescription}</p>
              </div>

              {/* Show Notes & Key Takeaways */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Key Takeaways & Show Notes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#071324] border border-white/10 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase">Key Takeaways</span>
                    <ul className="space-y-1 text-xs text-neutral-300 font-mono">
                      {activeEpisode.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#D4AF37]">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#071324] border border-white/10 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase">Chapter Markers / Timestamps</span>
                    <ul className="space-y-1 text-xs text-neutral-300 font-mono">
                      {activeEpisode.showNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#D4AF37]">⏱</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Podcast Assistant */}
              <div className="bg-[#071324] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#D4AF37]">
                    <Sparkles className="h-4 w-4" />
                    <h4 className="text-xs font-mono uppercase font-bold">Ask AI — Podcast Producer & Assistant</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A99AD]">Certified Approved Factual Data Only</span>
                </div>

                <form onSubmit={handleAskAiProducer} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="Ask AI to generate interview questions, social media copy, or follow-up insights..."
                      className="flex-1 px-3.5 py-2.5 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white placeholder-[#8A99AD] focus:border-[#D4AF37] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isGeneratingAi}
                      className="px-5 py-2.5 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-xl hover:brightness-110 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{isGeneratingAi ? 'Analyzing...' : 'Generate AI Producer Notes'}</span>
                    </button>
                  </div>
                </form>

                {aiResponse && (
                  <div className="p-4 bg-[#0A192F] border border-emerald-500/30 rounded-xl text-xs text-emerald-200 font-mono whitespace-pre-line leading-relaxed">
                    {aiResponse}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* Podcast Episodes Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
            All DomisLink Podcast Episodes ({filteredRecords.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecords.map(rec => (
              <div
                key={rec.id}
                onClick={() => setActiveEpisode(rec)}
                className={`bg-[#0A192F] border rounded-2xl overflow-hidden cursor-pointer transition transform hover:-translate-y-1 group ${
                  activeEpisode?.id === rec.id ? 'border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10' : 'border-white/10 hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#050B1A] to-[#0A192F]">
                  {rec.photographUrl ? (
                    <img src={rec.photographUrl} alt={rec.speakerName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <div className="w-14 h-14 rounded-xl bg-[#0A192F] border border-[#D4AF37] flex items-center justify-center font-serif font-bold text-lg text-[#FFD700] mb-1">
                        {rec.speakerName.split(' ').filter(Boolean).slice(-2).map(p => p[0]).join('').toUpperCase()}
                      </div>
                      <span className="text-[8px] font-mono text-gray-400 uppercase">OFFICIAL MONOGRAM</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-black/30 p-4 flex flex-col justify-between">
                    <span className="self-start px-2.5 py-0.5 rounded bg-[#D4AF37] text-[#0A192F] text-[10px] font-mono font-bold">
                      EP #{rec.podcastEpisodeNumber}
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#071324]/80 px-2 py-0.5 rounded self-end">
                      {rec.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#D4AF37] transition">{rec.podcastTitle}</h4>
                    <p className="text-xs text-[#8A99AD] mt-1">{rec.speakerName} • <span className="text-white">{rec.organisation}</span></p>
                  </div>

                  <p className="text-[11px] text-[#8A99AD] line-clamp-2">{rec.podcastDescription}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-[#D4AF37] font-mono">₦{rec.softCopyPrice.toLocaleString()} Book</span>
                    <span className="text-emerald-400 font-mono text-[10px]">● {rec.podcastStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
