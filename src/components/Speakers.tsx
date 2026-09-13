/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, Edit3, Linkedin, Twitter, Mail, Globe, Clock, Bookmark, Search, 
  Check, X, Shield, Calendar, FileText, Sparkles, Bot, ExternalLink, 
  ChevronDown, ChevronUp, Award, AlertCircle, Filter, Plus, Trash2, 
  Building, CheckCircle2, Send, Eye, EyeOff, Layers, MessageSquare, 
  Info, RefreshCw, Star
} from 'lucide-react';
import { Speaker, SpeakerIndustry, SpeakerStatus, PhotoRightsStatus, SpeakerWorkflowStage } from '../types';

interface SpeakersProps {
  speakers: Speaker[];
  onUpdateSpeakers: (updatedSpeakers: Speaker[]) => void;
  isAdmin: boolean;
}

export default function Speakers({ speakers, onUpdateSpeakers, isAdmin }: SpeakersProps) {
  // Filtering & Search states
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedTopicType, setSelectedTopicType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'directory' | 'featured' | 'admin'>('directory');

  // Modal states
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Admin edit & creation states
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'profile' | 'topic' | 'verification'>('profile');

  // AI Assistant states ("Ask about the speakers")
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // AI Topic Suggester in Admin state
  const [isAiTopicLoading, setIsAiTopicLoading] = useState<boolean>(false);
  const [aiTopicSuggestions, setAiTopicSuggestions] = useState<string[]>([]);
  const [aiTopicDisclaimer, setAiTopicDisclaimer] = useState<string | null>(null);

  const industries: { label: string; value: string }[] = [
    { label: 'All Sectors', value: 'ALL' },
    { label: 'Regulators', value: 'REGULATORS' },
    { label: 'Airlines', value: 'AIRLINES' },
    { label: 'Airports', value: 'AIRPORTS' },
    { label: 'Oil & Gas', value: 'OIL & GAS' },
    { label: 'Banking & Finance', value: 'BANKING' },
    { label: 'Telecommunications', value: 'TELECOMMUNICATIONS' },
    { label: 'Insurance', value: 'INSURANCE' },
    { label: 'Simulation & Training', value: 'SIMULATION' },
    { label: 'Technology', value: 'TECHNOLOGY' },
    { label: 'Manufacturing', value: 'MANUFACTURING' },
    { label: 'Government', value: 'GOVERNMENT' },
  ];

  const statusList = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Confirmed Guests', value: 'CONFIRMED' },
    { label: 'Invited Leaders', value: 'INVITED' },
    { label: 'Proposed Leaders', value: 'PROPOSED' },
    { label: 'To Be Confirmed', value: 'TO BE CONFIRMED' },
  ];

  // Helper for topic expander
  const toggleTopicExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Status badge styling
  const getStatusBadge = (status: SpeakerStatus) => {
    switch (status) {
      case 'CONFIRMED SPEAKER':
      case 'CONFIRMED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'CONFIRMED SPEAKER',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1 shrink-0" />
        };
      case 'CONFIRMED GUEST':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-300',
          dot: 'bg-teal-500',
          label: 'CONFIRMED GUEST',
          icon: <CheckCircle2 className="w-3 h-3 text-teal-600 mr-1 shrink-0" />
        };
      case 'INVITED':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          label: 'INVITED',
          icon: <Send className="w-3 h-3 text-blue-600 mr-1 shrink-0" />
        };
      case 'PROPOSED':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          label: 'PROPOSED',
          icon: <Bookmark className="w-3 h-3 text-amber-600 mr-1 shrink-0" />
        };
      case 'TO BE CONFIRMED':
      case 'TO_BE_CONFIRMED':
      default:
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-300',
          dot: 'bg-indigo-500',
          label: 'TO BE CONFIRMED',
          icon: <Shield className="w-3 h-3 text-indigo-600 mr-1 shrink-0" />
        };
    }
  };

  // Filtered dataset
  const filteredSpeakers = speakers.filter(speaker => {
    // Hidden speakers for non-admin
    if (!isAdmin && speaker.published === false) return false;

    // Industry filter
    const matchesIndustry = 
      selectedIndustry === 'ALL' || 
      speaker.industry === selectedIndustry ||
      (selectedIndustry === 'SIMULATION' && (speaker.industry === 'SIMULATION' || speaker.industry === 'TRAINING'));

    // Status filter
    const matchesStatus = 
      selectedStatus === 'ALL' || 
      (selectedStatus === 'CONFIRMED' && (speaker.status === 'CONFIRMED' || speaker.status === 'CONFIRMED SPEAKER' || speaker.status === 'CONFIRMED GUEST')) ||
      speaker.status === selectedStatus;

    // Topic status filter
    const matchesTopicType = 
      selectedTopicType === 'ALL' ||
      (selectedTopicType === 'OFFICIAL' && speaker.isTopicOfficial === true) ||
      (selectedTopicType === 'PROPOSED' && speaker.isTopicOfficial !== true);

    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      speaker.name.toLowerCase().includes(q) ||
      speaker.position.toLowerCase().includes(q) ||
      speaker.organisation.toLowerCase().includes(q) ||
      speaker.topic.toLowerCase().includes(q) ||
      speaker.industry.toLowerCase().includes(q) ||
      (speaker.whyTopicMatters && speaker.whyTopicMatters.toLowerCase().includes(q));

    return matchesIndustry && matchesStatus && matchesTopicType && matchesSearch;
  });

  // Featured speakers slice
  const featuredSpeakers = speakers.filter(s => (s.isFeatured || s.category === 'Keynote Speaker' || s.category === 'Special Guest') && s.published !== false);

  // Admin: Save Speaker Edit
  const handleSaveSpeaker = (speakerToSave: Speaker) => {
    let updated: Speaker[];
    if (isCreatingNew) {
      updated = [speakerToSave, ...speakers];
    } else {
      updated = speakers.map(s => s.id === speakerToSave.id ? speakerToSave : s);
    }
    onUpdateSpeakers(updated);
    setEditingSpeaker(null);
    setIsCreatingNew(false);
    setAiTopicSuggestions([]);
    setAiTopicDisclaimer(null);
  };

  // Admin: Delete Speaker
  const handleDeleteSpeaker = (id: string) => {
    if (window.confirm('Are you sure you want to remove this speaker from the official registry?')) {
      const updated = speakers.filter(s => s.id !== id);
      onUpdateSpeakers(updated);
      setEditingSpeaker(null);
    }
  };

  // Admin: Request AI Topic Suggestions
  const handleRequestAiTopics = async (speaker: Speaker) => {
    setIsAiTopicLoading(true);
    setAiTopicDisclaimer(null);
    try {
      const res = await fetch('/api/speakers/ai-suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: speaker.name,
          position: speaker.position,
          organisation: speaker.organisation,
          industry: speaker.industry,
          role: speaker.category
        })
      });
      const data = await res.json();
      const payload = data.data || data;
      if (payload.topics && Array.isArray(payload.topics)) {
        setAiTopicSuggestions(payload.topics);
        setAiTopicDisclaimer(payload.disclaimer || data.disclaimer || 'AI-GENERATED SUGGESTIONS — NOT OFFICIAL');
      }
    } catch (err) {
      console.error('Failed to get AI topics:', err);
    } finally {
      setIsAiTopicLoading(false);
    }
  };

  // "Ask About the Speakers" query runner
  const handleAskAi = async (customQuestion?: string) => {
    const questionToAsk = customQuestion || aiQuestion;
    if (!questionToAsk.trim()) return;
    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/speakers/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionToAsk })
      });
      const data = await res.json();
      const payload = data.data || data;
      if (payload.answer) {
        setAiAnswer(payload.answer);
      } else {
        setAiAnswer('Unable to retrieve speaker answer at this moment.');
      }
    } catch (err) {
      console.error('Error asking AI speaker assistant:', err);
      setAiAnswer('Connection error. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section id="speakers" className="py-20 bg-[#FDFCF7] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* SUMMIT THEME BANNER & EXECUTIVE HEADER */}
        {/* ============================================================ */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-mono font-bold uppercase tracking-widest shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            17 NOVEMBER 2026 • MARRIOTT HOTEL, IKEJA, LAGOS
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0A192F] tracking-tight leading-tight">
            SPEAKERS & SAFETY LEADERS
          </h2>

          <div className="h-1 w-24 bg-[#D4AF37] mx-auto rounded-full"></div>

          {/* Central Summit Safety Axiom */}
          <div className="p-4 sm:p-5 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-sm max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-serif font-bold text-[#0A192F] tracking-wide uppercase">
              "EVERYBODY IS INVOLVED IN AVIATION SAFETY"
            </p>
            <p className="text-[11px] sm:text-xs text-[#5A6E85] font-sans mt-1 leading-relaxed">
              An aviation accident does not select a tribe, profession, company or social class. The directory below presents verified regulators, sovereign leaders, airline chiefs, air navigation authorities, safety investigators, financial heads, energy executives, and industrial partners united in collective airspace protection.
            </p>
          </div>

          {/* Action Bar (Ask AI + Admin Controls) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#0A192F] to-[#1E3A8A] text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 shadow-md hover:shadow-lg transition-all border border-[#D4AF37]/40 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Ask About the Speakers (AI Assistant)</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setIsCreatingNew(true);
                  setEditingSpeaker({
                    id: `sp-custom-${Date.now()}`,
                    name: '',
                    position: '',
                    organisation: '',
                    category: 'Industry Leader',
                    topic: '',
                    isTopicOfficial: false,
                    suggestedTopics: [],
                    bio: '',
                    whyTopicMatters: '',
                    safetyPerspective: '',
                    photoUrl: '',
                    photoRights: 'RIGHTS_TO_BE_VERIFIED',
                    industry: 'REGULATORS',
                    session: 'Special Plenary Session',
                    time: 'TBD',
                    status: 'INVITED',
                    workflowStage: 'VERIFIED',
                    verificationDate: 'September 2026',
                    verifiedBy: 'Summit Secretariat',
                    isFeatured: false,
                    published: true
                  });
                }}
                className="px-4 py-2.5 bg-[#D4AF37] text-[#0A192F] rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md hover:bg-[#B89025] hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Leader to Registry</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FEATURED SAFETY LEADERS SHOWCASE (HIGHLIGHTS) */}
        {/* ============================================================ */}
        <div className="mb-14 bg-white border border-[#D4AF37]/25 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" /> KEYNOTE & ANCHOR LEADERS
              </span>
              <h3 className="text-xl font-serif font-black text-[#0A192F]">Featured Aviation & Industry Heads</h3>
            </div>
            <p className="text-xs font-sans text-gray-500">
              Verified office holders steering national safety policies and major operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSpeakers.slice(0, 4).map((leader) => {
              const statusBadge = getStatusBadge(leader.status);
              return (
                <div 
                  key={`feat-${leader.id}`}
                  onClick={() => setSelectedSpeaker(leader)}
                  className="group bg-[#FDFCF7] border border-[#D4AF37]/20 rounded-xl p-4 cursor-pointer hover:border-[#D4AF37] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Photo or Silhouette */}
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1E3A8A] flex items-center justify-center relative border border-gray-200">
                      {leader.photoUrl ? (
                        <img 
                          src={leader.photoUrl} 
                          alt={leader.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <User className="w-10 h-10 text-[#D4AF37]/60 mx-auto mb-1" />
                          <p className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider">
                            OFFICIAL PHOTO
                          </p>
                          <p className="text-[8px] font-mono text-gray-300 uppercase">
                            TO BE SUPPLIED
                          </p>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 bg-[#0A192F]/90 backdrop-blur-sm text-[#D4AF37] text-[8px] font-mono font-bold uppercase rounded">
                          {leader.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[8px] font-mono font-bold uppercase rounded">
                          {leader.industry}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase rounded border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-serif font-black text-[#0A192F] group-hover:text-[#D4AF37] transition-colors leading-tight">
                        {leader.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-gray-600 mt-0.5 line-clamp-1">
                        {leader.position}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1">
                        {leader.organisation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200/60">
                    <p className="text-[10px] text-gray-600 line-clamp-2 italic">
                      "{leader.topic}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* COMPREHENSIVE FILTER & SEARCH BAR */}
        {/* ============================================================ */}
        <div className="bg-white border border-[#D4AF37]/25 rounded-2xl p-5 mb-10 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-lg">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, organization, position, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDFCF7] border border-gray-300 rounded-xl text-xs text-[#0A192F] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Status Dropdown & Topic Dropdown */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-[#FDFCF7] border border-gray-200 rounded-lg px-2.5 py-1.5">
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono text-[10px] uppercase font-bold text-gray-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent font-mono text-[11px] font-bold text-[#0A192F] focus:outline-none"
                >
                  {statusList.map(st => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FDFCF7] border border-gray-200 rounded-lg px-2.5 py-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono text-[10px] uppercase font-bold text-gray-500">Topic:</span>
                <select
                  value={selectedTopicType}
                  onChange={(e) => setSelectedTopicType(e.target.value)}
                  className="bg-transparent font-mono text-[11px] font-bold text-[#0A192F] focus:outline-none"
                >
                  <option value="ALL">All Topics</option>
                  <option value="OFFICIAL">Official Approved Topics</option>
                  <option value="PROPOSED">Proposed Topics</option>
                </select>
              </div>

              {(searchQuery || selectedIndustry !== 'ALL' || selectedStatus !== 'ALL' || selectedTopicType !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustry('ALL');
                    setSelectedStatus('ALL');
                    setSelectedTopicType('ALL');
                  }}
                  className="px-2.5 py-1.5 text-[10px] font-mono font-bold text-[#0A192F] hover:text-red-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Industry Sector Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#D4AF37]" /> Filter by Sector / Industry:
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                Showing {filteredSpeakers.length} of {speakers.length} Verified Leaders
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {industries.map((ind) => (
                <button
                  key={ind.value}
                  onClick={() => setSelectedIndustry(ind.value)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${
                    selectedIndustry === ind.value
                      ? 'bg-[#0A192F] text-[#D4AF37] border border-[#0A192F] shadow-sm'
                      : 'bg-[#FDFCF7] text-gray-600 border border-gray-200 hover:border-[#D4AF37]/50 hover:text-[#0A192F]'
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SPEAKERS CARDS DECK (GRID) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map((speaker) => {
            const statusBadge = getStatusBadge(speaker.status);
            const isExpanded = !!expandedTopics[speaker.id];

            return (
              <div
                key={speaker.id}
                onClick={() => setSelectedSpeaker(speaker)}
                className="bg-white border border-[#D4AF37]/20 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#D4AF37]/50 transition-all duration-200 overflow-hidden flex flex-col justify-between relative group cursor-pointer"
              >
                {/* Card Main Block */}
                <div className="p-6 space-y-4">
                  
                  {/* Top Bar: Category & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded bg-[#0A192F] text-[#D4AF37]">
                      {speaker.category}
                    </span>

                    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase rounded-full border ${statusBadge.bg}`}>
                      {statusBadge.icon}
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  {/* Photo & Identity Section */}
                  <div className="flex gap-4 items-start">
                    {/* Portrait Photo or Silhouette */}
                    <div className="w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#1E3A8A] border border-gray-200 flex flex-col items-center justify-center relative shadow-inner">
                      {speaker.photoUrl ? (
                        <img 
                          src={speaker.photoUrl} 
                          alt={speaker.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-2 space-y-1">
                          <User className="w-8 h-8 text-[#D4AF37]/60 mx-auto" />
                          <p className="text-[7.5px] font-mono text-[#D4AF37] font-bold uppercase tracking-tight leading-none">
                            OFFICIAL PHOTO
                          </p>
                          <p className="text-[7px] font-mono text-gray-300 uppercase leading-none">
                            TO BE SUPPLIED
                          </p>
                        </div>
                      )}

                      {/* Photo Rights Indicator */}
                      <div className="absolute bottom-1 right-1">
                        {speaker.photoRights === 'RIGHTS_VERIFIED' ? (
                          <span className="p-0.5 bg-emerald-600 text-white rounded-full block" title="Official Verified Portrait">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        ) : (
                          <span className="p-0.5 bg-gray-700/80 text-gray-300 rounded-full block" title="Official Portrait Pending">
                            <Info className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Executive Info */}
                    <div className="flex-grow min-w-0">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] block mb-0.5">
                        {speaker.industry} SECTOR
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-black text-[#0A192F] leading-snug group-hover:text-[#D4AF37] transition-colors">
                        {speaker.name}
                      </h3>
                      <p className="text-xs font-bold text-gray-700 mt-1">
                        {speaker.position}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {speaker.organisation}
                      </p>

                      {speaker.verificationDate && (
                        <p className="text-[9px] font-mono text-gray-400 mt-2 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-[#D4AF37]" />
                          <span>Verified: {speaker.verificationDate}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Topic Presentation Box */}
                  <div className="p-3 bg-[#FDFCF7] border border-[#D4AF37]/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-[#D4AF37]" /> SUMMIT PRESENTATION
                      </span>
                      {speaker.isTopicOfficial ? (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[8px] font-mono font-bold uppercase rounded">
                          OFFICIAL TOPIC APPROVED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[8px] font-mono font-bold uppercase rounded">
                          PROPOSED TOPIC
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-[#0A192F] leading-snug">
                      "{speaker.topic}"
                    </p>

                    {/* Collapsible Why This Topic Matters */}
                    {speaker.whyTopicMatters && (
                      <div className="pt-1">
                        <button
                          onClick={(e) => toggleTopicExpand(speaker.id, e)}
                          className="text-[10px] font-mono font-bold text-[#D4AF37] hover:text-[#0A192F] flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          <span>{isExpanded ? 'Hide Safety Context' : 'Why This Topic Matters'}</span>
                        </button>
                        {isExpanded && (
                          <p className="text-[11px] font-sans text-gray-600 mt-1.5 pl-2 border-l-2 border-[#D4AF37] leading-relaxed">
                            {speaker.whyTopicMatters}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Scheduled Session & Timing */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <span className="text-gray-400 block uppercase font-bold text-[8px]">Summit Slot:</span>
                      <span className="font-bold text-[#0A192F] truncate block">{speaker.session || 'To Be Announced'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-bold text-[8px]">Scheduled Time:</span>
                      <span className="font-bold text-[#0A192F] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D4AF37]" />
                        <span>{speaker.time || 'TBD'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Safety Perspective Quote */}
                  {speaker.safetyPerspective && (
                    <p className="text-[11px] font-serif italic text-gray-600 line-clamp-2 pl-2 border-l-2 border-gray-200">
                      "{speaker.safetyPerspective}"
                    </p>
                  )}
                </div>

                {/* Card Footer Controls */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                    REF // {speaker.id.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-3">
                    {speaker.companyLink && (
                      <a
                        href={speaker.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-[#D4AF37] transition-colors p-1"
                        title="Official Organisation Portal"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCreatingNew(false);
                          setEditingSpeaker({ ...speaker });
                        }}
                        className="px-2 py-1 bg-[#0A192F] text-white hover:bg-[#D4AF37] hover:text-[#0A192F] rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {filteredSpeakers.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl p-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base font-serif font-black text-[#0A192F]">No speakers match your current search filters</p>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Try resetting your sector or status filter to view all verified aviation leaders.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustry('ALL');
                  setSelectedStatus('ALL');
                  setSelectedTopicType('ALL');
                }}
                className="mt-4 px-4 py-2 bg-[#0A192F] text-[#D4AF37] text-xs font-mono font-bold uppercase rounded-lg hover:bg-[#D4AF37] hover:text-[#0A192F] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* COMPLIANCE & RESEARCH CITATION NOTICE */}
        {/* ============================================================ */}
        <div className="mt-12 p-5 bg-white border border-[#D4AF37]/30 rounded-2xl text-center max-w-3xl mx-auto space-y-2 shadow-sm">
          <p className="text-xs font-serif font-bold text-[#0A192F] uppercase tracking-wide flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            OFFICIAL RESEARCH & VERIFICATION STANDARD
          </p>
          <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
            Speaker profiles and designated agency leadership reflect verified public records, statutory appointments, and formal summit invitations issued by Domislink International Services Ltd. Participation statuses (Confirmed, Invited, Proposed, To Be Confirmed) and presentation topics are governed by strict verification protocols.
          </p>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 1. SPEAKER DETAIL MODAL */}
      {/* ============================================================ */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#D4AF37]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto">
              {/* Header Image Area */}
              <div className="h-64 sm:h-72 bg-gradient-to-br from-[#0A192F] to-[#1a2f52] relative flex items-center justify-center">
                {selectedSpeaker.photoUrl ? (
                  <img 
                    src={selectedSpeaker.photoUrl} 
                    alt={selectedSpeaker.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-90" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="text-center space-y-2 z-10">
                    <User className="w-16 h-16 text-[#D4AF37]/60 mx-auto" />
                    <p className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                      OFFICIAL PHOTOGRAPH TO BE SUPPLIED
                    </p>
                    <p className="text-[10px] font-mono text-gray-300 uppercase">
                      Verified Press Portrait Pending
                    </p>
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded bg-[#D4AF37] text-[#0A192F]">
                      {selectedSpeaker.category}
                    </span>
                    <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded bg-white/20 backdrop-blur-md text-white">
                      {selectedSpeaker.industry}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide leading-tight">
                    {selectedSpeaker.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-200 font-semibold">
                    {selectedSpeaker.position} <span className="text-[#D4AF37]">|</span> {selectedSpeaker.organisation}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-6 bg-[#FDFCF7]">
                
                {/* Status & Timing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase block">
                      PARTICIPATION STATUS
                    </span>
                    <p className="text-xs font-mono font-bold text-[#0A192F]">{selectedSpeaker.status}</p>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase block">
                      SUMMIT SESSION
                    </span>
                    <p className="text-xs font-sans font-bold text-[#0A192F] truncate">{selectedSpeaker.session || 'To Be Announced'}</p>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase block">
                      SCHEDULED TIME
                    </span>
                    <p className="text-xs font-mono font-bold text-[#0A192F] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{selectedSpeaker.time || 'TBD'}</span>
                    </p>
                  </div>
                </div>

                {/* Presentation Topic Box */}
                <div className="p-4 bg-white border border-[#D4AF37]/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5" /> SUMMIT PRESENTATION TOPIC
                    </span>
                    {selectedSpeaker.isTopicOfficial ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[8px] font-mono font-bold uppercase rounded">
                        OFFICIAL TOPIC APPROVED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[8px] font-mono font-bold uppercase rounded">
                        PROPOSED TOPIC
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-serif font-black text-[#0A192F]">
                    "{selectedSpeaker.topic}"
                  </h4>
                  {selectedSpeaker.whyTopicMatters && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Why This Topic Matters to Aviation Safety:
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {selectedSpeaker.whyTopicMatters}
                      </p>
                    </div>
                  )}
                </div>

                {/* Biography */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <span>Official Profile & Executive Background</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                    {selectedSpeaker.bio || 'Biography information currently under review by Secretariat verification desk.'}
                  </p>
                </div>

                {/* Safety Perspective Quote */}
                {selectedSpeaker.safetyPerspective && (
                  <div className="p-4 bg-[#0A192F]/5 border-l-4 border-[#D4AF37] rounded-r-xl">
                    <h5 className="text-[10px] font-mono font-bold text-[#0A192F] uppercase tracking-wider mb-1">
                      Leader's Safety Perspective
                    </h5>
                    <p className="text-xs sm:text-sm font-serif italic text-[#0A192F]">
                      "{selectedSpeaker.safetyPerspective}"
                    </p>
                  </div>
                )}

                {/* Verification Source Audit (Requirement 14) */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-[10px] font-mono text-gray-500">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#D4AF37]" /> Verification Status: {selectedSpeaker.workflowStage || 'VERIFIED'}
                    </span>
                    <span>Audit Date: {selectedSpeaker.verificationDate || 'September 2026'}</span>
                  </div>
                  {selectedSpeaker.verificationSource && (
                    <p className="text-gray-400">
                      Source Record: {selectedSpeaker.verificationSource}
                    </p>
                  )}
                </div>

                {/* Action Links */}
                <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
                  {selectedSpeaker.companyLink && (
                    <a
                      href={selectedSpeaker.companyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0A192F] text-white hover:bg-[#D4AF37] hover:text-[#0A192F] rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Official Organisation Portal</span>
                    </a>
                  )}

                  {selectedSpeaker.socials?.linkedin && (
                    <a
                      href={selectedSpeaker.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. "ASK ABOUT THE SPEAKERS" AI ASSISTANT MODAL */}
      {/* ============================================================ */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#D4AF37]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#0A192F] to-[#1E3A8A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#D4AF37]/20 rounded-xl border border-[#D4AF37]/40">
                  <Bot className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-black text-white">Ask About the Speakers</h3>
                  <p className="text-[10px] font-mono text-gray-300">
                    Grounded AI Assistant • Official Summit Directory
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsAiModalOpen(false);
                  setAiAnswer(null);
                }}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 bg-[#FDFCF7]">
              
              {/* Context Banner */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  Verified Intelligence Only
                </p>
                Answers are grounded strictly in the official summit speaker database (theme: <em>"EVERYBODY IS INVOLVED IN AVIATION SAFETY"</em>). No unconfirmed or fabricated details are generated.
              </div>

              {/* Sample Queries */}
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Click a Sample Question to Ask:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Who is speaking about simulation?',
                    'Which speaker represents aviation regulation?',
                    'Show me leaders from the banking industry',
                    'Which sessions discuss human factors & training?',
                    'Who is the speaker from the oil and gas sector?'
                  ].map((sampleQ) => (
                    <button
                      key={sampleQ}
                      onClick={() => {
                        setAiQuestion(sampleQ);
                        handleAskAi(sampleQ);
                      }}
                      className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-[#D4AF37] hover:bg-[#FDFCF7] rounded-lg text-[11px] text-[#0A192F] font-medium transition-all text-left"
                    >
                      "{sampleQ}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#0A192F] uppercase block">
                  Your Question:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Which airline leaders are confirmed to speak?"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                    className="flex-grow px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-[#0A192F] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={() => handleAskAi()}
                    disabled={isAiLoading || !aiQuestion.trim()}
                    className="px-4 py-2.5 bg-[#0A192F] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A192F] disabled:opacity-50 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Ask AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Answer Presentation */}
              {aiAnswer && (
                <div className="p-4 bg-white border border-[#D4AF37]/40 rounded-xl space-y-2 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Official Speaker Secretariat Intelligence:
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">Ground-Truth Verified</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
                    {aiAnswer}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. ADMIN SPEAKER & TOPIC MANAGEMENT SUITE */}
      {/* ============================================================ */}
      {isAdmin && editingSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#D4AF37]/50 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#0A192F] text-white flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
                  ADMINISTRATIVE VERIFICATION SUITE
                </span>
                <h3 className="text-lg font-serif font-black">
                  {isCreatingNew ? 'Add New Industry Leader' : `Manage: ${editingSpeaker.name}`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSpeaker(null);
                    setIsCreatingNew(false);
                    setAiTopicSuggestions([]);
                  }}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs in Admin */}
            <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2">
              <button
                onClick={() => setAdminTab('profile')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase border-b-2 transition-all ${
                  adminTab === 'profile'
                    ? 'border-[#D4AF37] text-[#0A192F] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                1. Profile & Identity
              </button>
              <button
                onClick={() => setAdminTab('topic')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase border-b-2 transition-all flex items-center gap-1.5 ${
                  adminTab === 'topic'
                    ? 'border-[#D4AF37] text-[#0A192F] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>2. Topic & AI Suggester</span>
              </button>
              <button
                onClick={() => setAdminTab('verification')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase border-b-2 transition-all ${
                  adminTab === 'verification'
                    ? 'border-[#D4AF37] text-[#0A192F] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                3. Verification & Rights
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto space-y-4 bg-[#FDFCF7] flex-grow">
              
              {/* TAB 1: Profile & Identity */}
              {adminTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Full Name & Titles
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.name}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, name: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="e.g. CAPT. CHRIS O. NAJOMO"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Official Position / Title
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.position}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, position: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="e.g. Director General / CEO"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Organisation / Agency
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.organisation}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, organisation: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="e.g. Nigeria Civil Aviation Authority (NCAA)"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Industry Sector
                      </label>
                      <select
                        value={editingSpeaker.industry}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, industry: e.target.value as SpeakerIndustry })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                      >
                        {industries.filter(i => i.value !== 'ALL').map(i => (
                          <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Summit Role / Category
                      </label>
                      <select
                        value={editingSpeaker.category}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, category: e.target.value as any })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                      >
                        <option value="Keynote Speaker">Keynote Speaker</option>
                        <option value="Special Guest">Special Guest</option>
                        <option value="Guest of Honour">Guest of Honour</option>
                        <option value="Industry Leader">Industry Leader</option>
                        <option value="Panelist">Panelist</option>
                        <option value="Speaker">Speaker</option>
                        <option value="Moderator">Moderator</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Participation Status
                      </label>
                      <select
                        value={editingSpeaker.status}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, status: e.target.value as SpeakerStatus })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                      >
                        <option value="CONFIRMED SPEAKER">CONFIRMED SPEAKER</option>
                        <option value="CONFIRMED GUEST">CONFIRMED GUEST</option>
                        <option value="INVITED">INVITED</option>
                        <option value="PROPOSED">PROPOSED</option>
                        <option value="TO BE CONFIRMED">TO BE CONFIRMED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Summit Session
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.session}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, session: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="e.g. Regulatory Oversight Plenary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Scheduled Time
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.time}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, time: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="e.g. 09:15 AM - 09:45 AM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                      Official Biography
                    </label>
                    <textarea
                      rows={3}
                      value={editingSpeaker.bio}
                      onChange={(e) => setEditingSpeaker({ ...editingSpeaker, bio: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                      Safety Perspective Quote
                    </label>
                    <input
                      type="text"
                      value={editingSpeaker.safetyPerspective || ''}
                      onChange={(e) => setEditingSpeaker({ ...editingSpeaker, safetyPerspective: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                      placeholder="e.g. Precision in the skies is absolute."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Topic & AI Topic Suggester */}
              {adminTab === 'topic' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-[#0A192F] uppercase block">
                        Assigned Presentation Topic
                      </label>
                      <label className="flex items-center gap-2 text-xs font-mono font-bold text-[#0A192F] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSpeaker.isTopicOfficial === true}
                          onChange={(e) => setEditingSpeaker({ ...editingSpeaker, isTopicOfficial: e.target.checked })}
                          className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span>Official Approved Topic</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      value={editingSpeaker.topic}
                      onChange={(e) => setEditingSpeaker({ ...editingSpeaker, topic: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-1 focus:ring-[#D4AF37]"
                      placeholder="Enter official presentation topic"
                    />

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase block mb-1">
                        Why This Topic Matters (Aviation Safety Rationale)
                      </label>
                      <textarea
                        rows={3}
                        value={editingSpeaker.whyTopicMatters || ''}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, whyTopicMatters: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="Explain the critical aviation safety relevance of this topic..."
                      />
                    </div>
                  </div>

                  {/* AI TOPIC SUGGESTER */}
                  <div className="p-4 bg-gradient-to-br from-blue-50/50 to-amber-50/50 border border-[#D4AF37]/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> GEMINI AI TOPIC ADVISORY
                        </span>
                        <p className="text-xs font-serif font-black text-[#0A192F]">
                          Generate 3 Industry-Specific Safety Topics
                        </p>
                      </div>

                      <button
                        onClick={() => handleRequestAiTopics(editingSpeaker)}
                        disabled={isAiTopicLoading || !editingSpeaker.name || !editingSpeaker.organisation}
                        className="px-3 py-1.5 bg-[#0A192F] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A192F] disabled:opacity-50 text-[10px] font-mono font-bold uppercase rounded-lg flex items-center gap-1 transition-all"
                      >
                        {isAiTopicLoading ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>Generate 3 Suggestions</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[9px] font-mono text-gray-500 uppercase">
                      Mandatory Flag: AI-GENERATED SUGGESTIONS — NOT OFFICIAL (SECRETARIAT REVIEW REQUIRED)
                    </p>

                    {/* AI Suggestions Deck */}
                    {aiTopicSuggestions.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        {aiTopicSuggestions.map((suggestion, idx) => (
                          <div 
                            key={idx}
                            className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-3 hover:border-[#D4AF37] transition-all"
                          >
                            <div className="text-xs font-semibold text-gray-800">
                              <span className="text-[#D4AF37] font-mono mr-1.5 font-bold">#{idx + 1}</span>
                              "{suggestion}"
                            </div>
                            <button
                              onClick={() => setEditingSpeaker({ ...editingSpeaker, topic: suggestion, isTopicOfficial: false })}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded text-[9px] font-mono font-bold uppercase shrink-0"
                            >
                              Adopt Topic
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Verification & Rights */}
              {adminTab === 'verification' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Portrait Photo URL (Real Photo or Blank)
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.photoUrl || ''}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, photoUrl: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="https://..."
                      />
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        Leave blank to display "OFFICIAL PHOTOGRAPH TO BE SUPPLIED"
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Photo Rights Status
                      </label>
                      <select
                        value={editingSpeaker.photoRights || 'RIGHTS_TO_BE_VERIFIED'}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, photoRights: e.target.value as PhotoRightsStatus })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                      >
                        <option value="RIGHTS_VERIFIED">RIGHTS_VERIFIED (Official portrait approved)</option>
                        <option value="RIGHTS_TO_BE_VERIFIED">RIGHTS_TO_BE_VERIFIED (Under clearance)</option>
                        <option value="OFFICIAL_PHOTO_REQUIRED">OFFICIAL_PHOTO_REQUIRED (Placeholder active)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Photo Source Note
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.photoSource || ''}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, photoSource: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="e.g. Official NCAA Directorate Portal"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Organisation Website Link
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.companyLink || ''}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, companyLink: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="https://ncaa.gov.ng"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Verification Workflow Stage
                      </label>
                      <select
                        value={editingSpeaker.workflowStage || 'VERIFIED'}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, workflowStage: e.target.value as SpeakerWorkflowStage })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                      >
                        <option value="RESEARCHED">RESEARCHED (Candidate identified)</option>
                        <option value="VERIFIED">VERIFIED (Position confirmed)</option>
                        <option value="INVITED">INVITED (Invitation dispatched)</option>
                        <option value="PROPOSED">PROPOSED (Under consideration)</option>
                        <option value="CONFIRMED">CONFIRMED (Formal confirmation)</option>
                        <option value="TOPIC_APPROVED">TOPIC_APPROVED (Topic ratified)</option>
                        <option value="PUBLISHED">PUBLISHED (Live on portal)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-600 uppercase block mb-1">
                        Audit Date & Verifier
                      </label>
                      <input
                        type="text"
                        value={editingSpeaker.verificationDate || ''}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, verificationDate: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-[#D4AF37]"
                        placeholder="September 2026"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono font-bold text-[#0A192F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSpeaker.isFeatured === true}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, isFeatured: e.target.checked })}
                        className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span>Show in "Featured Safety Leaders" Top Grid</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-mono font-bold text-[#0A192F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSpeaker.published !== false}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, published: e.target.checked })}
                        className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span>Published on Public Portal</span>
                    </label>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              {!isCreatingNew && (
                <button
                  onClick={() => handleDeleteSpeaker(editingSpeaker.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Speaker</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    setEditingSpeaker(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-mono font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveSpeaker(editingSpeaker)}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] hover:text-white rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Publish Changes</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
