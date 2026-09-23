/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Award, 
  Clock, 
  Building2, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  Copy,
  Check,
  Download,
  Share2,
  Bookmark,
  Users,
  Layers,
  Flame,
  Volume2
} from 'lucide-react';
import { 
  MASTER_INVITEES_HIERARCHY, 
  HIERARCHY_TIER_DEFINITIONS,
  HierarchyInvitee 
} from '../../data/masterInviteesHierarchyData';

interface MasterHierarchyViewProps {
  onRegisterClick?: () => void;
}

export const MasterHierarchyView: React.FC<MasterHierarchyViewProps> = ({ onRegisterClick }) => {
  const [selectedTier, setSelectedTier] = useState<number | 'ALL' | 'FAITH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE' | 'PRINTABLE'>('CARDS');
  const [copiedTopicId, setCopiedTopicId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Filter logic
  const filteredInvitees = useMemo(() => {
    return MASTER_INVITEES_HIERARCHY.filter((item) => {
      // Tier / category filtering
      if (selectedTier === 'FAITH') {
        if (item.tier !== 6) return false;
      } else if (selectedTier !== 'ALL') {
        if (item.tier !== selectedTier) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesOrg = item.organisation.toLowerCase().includes(query);
        const matchesTopic = item.assignedSpeech.toLowerCase().includes(query);
        const matchesRole = item.roleTitle.toLowerCase().includes(query);
        const matchesSession = item.session.toLowerCase().includes(query);
        return matchesName || matchesOrg || matchesTopic || matchesRole || matchesSession;
      }

      return true;
    });
  }, [selectedTier, searchQuery]);

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  // Handle copy topic to clipboard
  const handleCopyTopic = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTopicId(id);
    setTimeout(() => setCopiedTopicId(null), 2500);
  };

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Export as CSV
  const handleExportCSV = () => {
    const headers = [
      "Hierarchy Rank",
      "Tier",
      "Tier Title",
      "Salutation",
      "Full Name",
      "Position / Portfolio",
      "Organisation / Church",
      "Sector",
      "Assigned Speech / Topic of Address",
      "Scheduled Session",
      "Time Slot",
      "Keynote Focus",
      "Safety Stance / Perspective",
      "Official Photo URL",
      "Official Logo URL",
      "Status"
    ];

    const rows = filteredInvitees.map((item) => [
      `"${item.hierarchyRank}"`,
      `"${item.tier}"`,
      `"${item.tierName.replace(/"/g, '""')}"`,
      `"${item.salutation.replace(/"/g, '""')}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.position.replace(/"/g, '""')}"`,
      `"${item.organisation.replace(/"/g, '""')}"`,
      `"${item.sector.replace(/"/g, '""')}"`,
      `"${item.assignedSpeech.replace(/"/g, '""')}"`,
      `"${item.session.replace(/"/g, '""')}"`,
      `"${item.scheduledTime.replace(/"/g, '""')}"`,
      `"${item.keynoteFocus.replace(/"/g, '""')}"`,
      `"${item.safetyPerspective.replace(/"/g, '""')}"`,
      `"${item.photoUrl}"`,
      `"${item.orgLogoUrl}"`,
      `"${item.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nigeria-aviation-safety-summit-order-of-precedence-${selectedTier}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const churchLeadersCount = useMemo(() => {
    return MASTER_INVITEES_HIERARCHY.filter(i => i.tier === 6).length;
  }, []);

  return (
    <section 
      id="protocol-hierarchy" 
      className="py-16 md:py-24 bg-[#030914] text-white border-t border-b border-[#D4AF37]/20 relative overflow-hidden"
    >
      {/* Decorative background grid and ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Screen Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-4 shadow-sm">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>Official Protocol Order of Precedence</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white mb-4">
            Compendium of Dignitaries, Faith Leaders & Assigned Speeches
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Authorized schedule of addresses, ministerial keynotes, sovereign legislative directives, airline operator declarations, and faith leader convocations for the 
            <span className="text-[#D4AF37] font-semibold"> Nigeria Aviation Safety Summit (NASS 2026)</span>. Curated with verified official portraits, organizational seals, and official topics of address.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#0b1528]/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#D4AF37]">
              {MASTER_INVITEES_HIERARCHY.length}
            </span>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">Total Curated Invitees</p>
          </div>
          <div className="bg-[#0b1528]/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-blue-400">7 Tiers</span>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">Protocol Order</p>
          </div>
          <div className="bg-[#0b1528]/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-amber-300">
              {churchLeadersCount}
            </span>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">Faith & Church Leaders</p>
          </div>
          <div className="bg-[#0b1528]/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-emerald-400">100%</span>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">Speeches Assigned</p>
          </div>
        </div>

        {/* Action Toolbar & Search Controls */}
        <div className="bg-[#0b1528] border border-white/15 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by dignitary, church leader, speech topic, or organisation..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#030914] border border-white/15 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-[#030914] p-1 border border-white/15 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'CARDS' 
                    ? 'bg-[#D4AF37] text-black font-semibold shadow' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'TABLE' 
                    ? 'bg-[#D4AF37] text-black font-semibold shadow' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('PRINTABLE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'PRINTABLE' 
                    ? 'bg-[#D4AF37] text-black font-semibold shadow' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Printable Broadsheet</span>
              </button>
            </div>

            {/* Action Buttons: Print & CSV Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                title="Print official program or save to PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/20 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
                title="Export current view to CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Tier Selection Pills */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#D4AF37]" /> Filter Tier:
            </span>

            <button
              onClick={() => setSelectedTier('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                selectedTier === 'ALL'
                  ? 'bg-white text-black font-bold shadow'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              All Tiers ({MASTER_INVITEES_HIERARCHY.length})
            </button>

            {/* Quick Filter: Faith & Church Leaders */}
            <button
              onClick={() => setSelectedTier('FAITH')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedTier === 'FAITH'
                  ? 'bg-[#FFD700] text-black shadow-md'
                  : 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/40 hover:bg-[#FFD700]/25'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Church & Faith Leaders ({churchLeadersCount})</span>
            </button>

            {HIERARCHY_TIER_DEFINITIONS.map((def) => {
              const count = MASTER_INVITEES_HIERARCHY.filter(i => i.tier === def.tier).length;
              return (
                <button
                  key={def.tier}
                  onClick={() => setSelectedTier(def.tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                    selectedTier === def.tier
                      ? 'bg-[#D4AF37] text-black font-bold shadow'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  T{def.tier}: {def.shortTitle} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Active Tier Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 text-xs text-gray-400">
          <div>
            Showing <span className="text-[#D4AF37] font-semibold">{filteredInvitees.length}</span> dignitaries and speakers
            {selectedTier === 'FAITH' && <span className="text-amber-300 font-medium"> in Faith & Church Leadership</span>}
            {typeof selectedTier === 'number' && (
              <span className="text-gray-300"> in {HIERARCHY_TIER_DEFINITIONS.find(t => t.tier === selectedTier)?.title}</span>
            )}
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </div>

          <div className="text-gray-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Speeches Verified
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />
              Official Portrait
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: RICH DOSSIER CARDS                                          */}
        {/* ========================================================================= */}
        {viewMode === 'CARDS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvitees.map((invitee) => {
              const isFaith = invitee.tier === 6;
              const isSovereign = invitee.tier === 1;
              const isRegulator = invitee.tier === 2;

              return (
                <div 
                  key={invitee.id}
                  className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative group hover:shadow-2xl ${
                    isSovereign 
                      ? 'bg-gradient-to-b from-[#1c1809] to-[#0c0f1d] border-amber-500/50 hover:border-amber-400' 
                      : isFaith
                      ? 'bg-gradient-to-b from-[#18150c] to-[#0b1220] border-[#FFD700]/40 hover:border-[#FFD700]'
                      : isRegulator
                      ? 'bg-gradient-to-b from-[#09152b] to-[#070e1c] border-blue-500/40 hover:border-blue-400'
                      : 'bg-[#0b1528] border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Status & Rank Strip */}
                  <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isSovereign ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        isFaith ? 'bg-amber-500/20 text-[#FFD700] border border-[#FFD700]/30' :
                        'bg-white/10 text-gray-300'
                      }`}>
                        Rank #{invitee.hierarchyRank}
                      </span>
                      <span className="text-[11px] text-gray-400 truncate max-w-[170px]">
                        Tier {invitee.tier}: {HIERARCHY_TIER_DEFINITIONS.find(t => t.tier === invitee.tier)?.shortTitle}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(invitee.id)}
                      className={`text-gray-400 hover:text-[#D4AF37] transition-colors p-1`}
                      title="Bookmark personae"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.has(invitee.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                    </button>
                  </div>

                  {/* Persona Identity Block (Photo + Logo + Name) */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      
                      {/* Curated Official Photo with Fallback Monogram */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shadow-md bg-slate-800 relative flex items-center justify-center ${
                          isSovereign ? 'border-amber-400' : isFaith ? 'border-[#FFD700]' : 'border-white/20'
                        }`}>
                          {invitee.photoUrl ? (
                            <img
                              src={invitee.photoUrl}
                              alt={invitee.name}
                              loading="lazy"
                              onError={(e) => {
                                // Fallback on image load error
                                (e.target as HTMLElement).style.display = 'none';
                                const fallback = (e.target as HTMLElement).parentElement?.querySelector('.avatar-fallback');
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : null}
                          <div className={`avatar-fallback ${invitee.photoUrl ? 'hidden' : ''} flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[#1a233a] to-[#0f172a] text-[#D4AF37]`}>
                            <span className="text-base font-bold font-serif">{invitee.monogram}</span>
                          </div>
                        </div>

                        {/* Verified Checkmark Badge */}
                        <div className="absolute -bottom-1.5 -right-1.5 bg-[#030914] p-0.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                        </div>
                      </div>

                      {/* Header details & Corporate Logo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                            {invitee.salutation}
                          </span>

                          {/* Curated Official Logo */}
                          {invitee.orgLogoUrl ? (
                            <div className="w-7 h-7 rounded bg-white/10 p-0.5 border border-white/15 flex items-center justify-center overflow-hidden flex-shrink-0" title={invitee.organisation}>
                              <img
                                src={invitee.orgLogoUrl}
                                alt={invitee.organisation}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            </div>
                          ) : (
                            <Building2 className="w-4 h-4 text-gray-500" />
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                          {invitee.name}
                        </h3>

                        <p className="text-xs text-gray-300 font-medium line-clamp-1 mt-0.5">
                          {invitee.position}
                        </p>

                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {invitee.organisation}
                        </p>
                      </div>
                    </div>

                    {/* Assigned Speech Box - High Priority Focus */}
                    <div className="mt-2 p-3.5 rounded-xl bg-black/40 border border-[#D4AF37]/30 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] flex items-center gap-1">
                            <Volume2 className="w-3 h-3 text-[#D4AF37]" /> Assigned Speech / Topic:
                          </span>
                          <button
                            onClick={() => handleCopyTopic(invitee.id, invitee.assignedSpeech)}
                            className="text-[10px] text-gray-400 hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                            title="Copy topic citation"
                          >
                            {copiedTopicId === invitee.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs font-serif font-semibold text-white leading-relaxed italic">
                          &ldquo;{invitee.assignedSpeech}&rdquo;
                        </p>
                      </div>

                      {/* Scheduled Session & Time Slot */}
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1 text-[11px] text-gray-400">
                        <div className="flex items-center gap-1.5 text-gray-300 line-clamp-1">
                          <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <span className="font-medium text-amber-300">{invitee.scheduledTime}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 line-clamp-1">
                          Session: {invitee.session}
                        </div>
                      </div>
                    </div>

                    {/* Safety Perspective Quote */}
                    {invitee.safetyPerspective && (
                      <div className="mt-3 text-[11px] text-gray-300 italic line-clamp-2 pl-2 border-l-2 border-[#D4AF37]/50">
                        {invitee.safetyPerspective}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-2.5 bg-black/30 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wide flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {invitee.status}
                    </span>

                    <button
                      onClick={() => handleCopyTopic(invitee.id, `${invitee.salutation} ${invitee.name} (${invitee.organisation}) - "${invitee.assignedSpeech}" [${invitee.session}, ${invitee.scheduledTime}]`)}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Copy full protocol citation"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: ONE-SPOT MASTER PROTOCOL TABLE                              */}
        {/* ========================================================================= */}
        {viewMode === 'TABLE' && (
          <div className="bg-[#0b1528] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/60 border-b border-white/15 text-[11px] font-mono uppercase tracking-wider text-gray-300">
                    <th className="py-3.5 px-4 font-semibold w-16 text-center">Rank</th>
                    <th className="py-3.5 px-4 font-semibold w-24">Tier</th>
                    <th className="py-3.5 px-4 font-semibold">Persona & Organisation</th>
                    <th className="py-3.5 px-4 font-semibold">Assigned Speech / Topic of Address</th>
                    <th className="py-3.5 px-4 font-semibold">Session & Time</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredInvitees.map((invitee) => {
                    const isFaith = invitee.tier === 6;
                    const isSovereign = invitee.tier === 1;

                    return (
                      <tr 
                        key={invitee.id}
                        className={`hover:bg-white/5 transition-colors ${
                          isSovereign ? 'bg-amber-500/5' : isFaith ? 'bg-yellow-500/5' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#D4AF37]">
                          #{invitee.hierarchyRank}
                        </td>

                        {/* Tier */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isSovereign ? 'bg-amber-500/20 text-amber-300' :
                            isFaith ? 'bg-amber-500/20 text-[#FFD700]' :
                            'bg-white/10 text-gray-300'
                          }`}>
                            T{invitee.tier}
                          </span>
                        </td>

                        {/* Persona & Organisation */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/15 bg-slate-800 flex-shrink-0 flex items-center justify-center">
                              {invitee.photoUrl ? (
                                <img
                                  src={invitee.photoUrl}
                                  alt={invitee.name}
                                  loading="lazy"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : null}
                              <span className="text-xs font-serif font-bold text-[#D4AF37]">{invitee.monogram}</span>
                            </div>

                            <div className="min-w-0">
                              <div className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wide">
                                {invitee.salutation}
                              </div>
                              <div className="font-bold text-white truncate max-w-xs sm:max-w-sm">
                                {invitee.name}
                              </div>
                              <div className="text-[11px] text-gray-400 truncate max-w-xs flex items-center gap-1.5">
                                {invitee.orgLogoUrl && (
                                  <img 
                                    src={invitee.orgLogoUrl} 
                                    alt="" 
                                    className="w-3.5 h-3.5 object-contain inline-block"
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  />
                                )}
                                <span>{invitee.organisation}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Assigned Speech */}
                        <td className="py-3 px-4 max-w-md">
                          <p className="font-serif font-semibold text-amber-200 text-xs leading-snug">
                            &ldquo;{invitee.assignedSpeech}&rdquo;
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                            Focus: {invitee.keynoteFocus}
                          </p>
                        </td>

                        {/* Session & Time */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-amber-300 font-mono font-medium text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {invitee.scheduledTime}
                          </div>
                          <div className="text-[10px] text-gray-400 max-w-[180px] truncate mt-0.5">
                            {invitee.session}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleCopyTopic(invitee.id, invitee.assignedSpeech)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Copy topic of address"
                          >
                            {copiedTopicId === invitee.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 3: PRINTABLE BROADSHEET & STATE ORDER OF PRECEDENCE            */}
        {/* ========================================================================= */}
        {viewMode === 'PRINTABLE' && (
          <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl printable-document">
            
            {/* Printable Document Official Masthead */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-900 text-[#D4AF37] rounded-full flex items-center justify-center font-serif font-bold text-lg">
                  ★
                </div>
                <span className="text-xs tracking-widest font-mono font-bold uppercase text-slate-700">
                  Federal Republic of Nigeria • Ministry of Aviation & Aerospace Development
                </span>
                <div className="w-10 h-10 bg-slate-900 text-[#D4AF37] rounded-full flex items-center justify-center font-serif font-bold text-lg">
                  ★
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-950 uppercase">
                Nigeria Aviation Safety Summit (NASS 2026)
              </h1>
              
              <h2 className="text-base sm:text-lg font-serif font-medium text-slate-800 mt-1">
                Official Protocol Order of Precedence & Sovereign Compendium of Assigned Addresses
              </h2>

              <p className="text-xs text-slate-600 mt-2 font-mono">
                Published & Authenticated Under Presidential Protocol Directorate • Eko Hotel & Suites, Victoria Island, Lagos
              </p>

              {/* Print action directly on page */}
              <div className="mt-4 flex items-center justify-center gap-3 no-print">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Send to Printer / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Print Listing Arranged by Tier */}
            <div className="space-y-10">
              {HIERARCHY_TIER_DEFINITIONS.map((tierDef) => {
                const tierItems = filteredInvitees.filter(i => i.tier === tierDef.tier);
                if (tierItems.length === 0) return null;

                return (
                  <div key={tierDef.tier} className="page-break-inside-avoid">
                    {/* Tier Header Banner */}
                    <div className="bg-slate-100 border-l-4 border-slate-900 p-3 mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base uppercase tracking-wider">
                          {tierDef.title}
                        </h3>
                        <p className="text-xs text-slate-600 italic">
                          {tierDef.description}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {tierItems.length} Dignitaries
                      </span>
                    </div>

                    {/* Table of Addresses */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs border border-slate-300">
                        <thead>
                          <tr className="bg-slate-200 border-b border-slate-300 text-[10px] font-mono uppercase tracking-wider text-slate-800">
                            <th className="py-2 px-3 w-12 text-center border-r border-slate-300">Rank</th>
                            <th className="py-2 px-3 w-48 border-r border-slate-300">Persona & Portfolio</th>
                            <th className="py-2 px-3 border-r border-slate-300">Official Assigned Topic of Address</th>
                            <th className="py-2 px-3 w-44">Session & Time Slot</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {tierItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                                #{item.hierarchyRank}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-200">
                                <div className="font-bold text-slate-950">
                                  {item.salutation} {item.name}
                                </div>
                                <div className="text-[11px] text-slate-700">
                                  {item.position}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  {item.organisation}
                                </div>
                              </td>
                              <td className="py-2 px-3 border-r border-slate-200">
                                <div className="font-serif font-bold text-slate-900 text-xs">
                                  &ldquo;{item.assignedSpeech}&rdquo;
                                </div>
                                <div className="text-[10px] text-slate-600 mt-0.5">
                                  <span className="font-semibold">Core Focus:</span> {item.keynoteFocus}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="font-mono font-bold text-slate-900 text-[11px]">
                                  {item.scheduledTime}
                                </div>
                                <div className="text-[10px] text-slate-600">
                                  {item.session}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Document Verification Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-mono">
              <div>
                Official Protocol Register • Signed: Director of Protocol & National Secretariat
              </div>
              <div className="mt-2 sm:mt-0">
                NASS-2026-COMPENDIUM-REV-7 • All Rights Reserved
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Print Specific CSS Stylesheet */}
      <style>{`
        @media print {
          /* Hide non-printable page elements */
          body * {
            visibility: hidden;
          }
          #protocol-hierarchy, #protocol-hierarchy * {
            visibility: visible;
          }
          #protocol-hierarchy {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </section>
  );
};

export default MasterHierarchyView;
