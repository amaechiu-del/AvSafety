/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Plus, Sparkles, Mail, Send, 
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  ExternalLink, FileText, ChevronRight, X, Building2, 
  Award, DollarSign, Download, RefreshCw, Eye, AlertCircle,
  Briefcase, Check, ArrowRight, UserPlus, MapPin
} from 'lucide-react';
import { 
  StakeholderInvitee, 
  StakeholderCategory, 
  StakeholderStatus, 
  StakeholderEventRole,
  StakeholderStats,
  InvitationLetter
} from '../../types';
import { STAKEHOLDER_CATEGORIES } from '../../data/stakeholdersData';
import RSVPQRCode from '../rsvp/RSVPQRCode';

interface StakeholderManagerProps {
  onClose?: () => void;
}

export default function StakeholderManager({ onClose }: StakeholderManagerProps) {
  // Data State
  const [stakeholders, setStakeholders] = useState<StakeholderInvitee[]>([]);
  const [stats, setStats] = useState<StakeholderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [nigerDeltaOnly, setNigerDeltaOnly] = useState(false);

  // Modals
  const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderInvitee | null>(null);
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [isBrainstormModalOpen, setIsBrainstormModalOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // Letter & AI Generation States
  const [letterData, setLetterData] = useState<InvitationLetter | null>(null);
  const [letterGenerating, setLetterGenerating] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Brainstorm State
  const [brainstormSuggestions, setBrainstormSuggestions] = useState<any[]>([]);
  const [brainstormLoading, setBrainstormLoading] = useState(false);
  const [brainstormDisclaimer, setBrainstormDisclaimer] = useState<string | null>(null);

  // Proposal State
  const [proposalData, setProposalData] = useState<any | null>(null);
  const [proposalLoading, setProposalLoading] = useState(false);

  // New Stakeholder Form
  const [newFormData, setNewFormData] = useState({
    name: '',
    position: '',
    organisation: '',
    category: 'BANKING_AND_FINANCE' as StakeholderCategory,
    eventRole: 'SPECIAL GUEST' as StakeholderEventRole,
    proposedTopic: '',
    whySectorMatters: '',
    email: '',
    phone: '',
    isNigerDelta: false,
    state: '',
    sponsorshipInterest: 'NONE' as 'NONE' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'SESSION' | 'EXHIBITION',
    speakerInterest: true,
    exhibitorInterest: false,
    verificationSource: 'Official Corporate Website / Public Directory',
    verifiedBy: 'Summit Secretariat Protocol Desk',
    notes: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch stakeholders
  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/stakeholders');
      if (!res.ok) throw new Error('Failed to load stakeholder registry');
      const data = await res.json();
      setStakeholders(data.stakeholders || []);
      setStats(data.stats || null);
    } catch (err: any) {
      setError(err.message || 'Error communicating with summit server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakeholders();
  }, []);

  // Filtered List
  const filteredList = useMemo(() => {
    return stakeholders.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (nigerDeltaOnly && !item.isNigerDelta) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.organisation.toLowerCase().includes(q) ||
          (item.position && item.position.toLowerCase().includes(q)) ||
          (item.proposedTopic && item.proposedTopic.toLowerCase().includes(q)) ||
          (item.whySectorMatters && item.whySectorMatters.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [stakeholders, categoryFilter, statusFilter, nigerDeltaOnly, searchQuery]);

  // Handle Status Update
  const handleUpdateStatus = async (id: string, newStatus: StakeholderStatus) => {
    try {
      const res = await fetch(`/api/stakeholders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          responseNotes: newStatus === 'CONFIRMED' ? `Confirmed via official correspondence on ${new Date().toLocaleDateString('en-GB')}` : undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStakeholders(prev => prev.map(s => s.id === id ? data.stakeholder : s));
        if (data.stats) setStats(data.stats);
        if (selectedStakeholder?.id === id) {
          setSelectedStakeholder(data.stakeholder);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Generate Letter
  const handleOpenLetterModal = async (invitee: StakeholderInvitee) => {
    setSelectedStakeholder(invitee);
    setIsLetterModalOpen(true);
    setLetterGenerating(true);
    setLetterData(null);
    setDispatchSuccess(null);

    try {
      const res = await fetch('/api/stakeholders/ai-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: invitee.name,
          recipientPosition: invitee.position,
          recipientOrg: invitee.organisation,
          recipientEmail: invitee.email,
          category: invitee.category,
          proposedTopic: invitee.proposedTopic,
          eventRole: invitee.eventRole,
          sponsorshipOption: invitee.sponsorshipInterest !== 'NONE' ? invitee.sponsorshipInterest : undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLetterData(data.letter);
      }
    } catch (err) {
      console.error('Failed to generate letter:', err);
    } finally {
      setLetterGenerating(false);
    }
  };

  // Dispatch Letter and schedule 5-day follow-up
  const handleDispatchLetter = async () => {
    if (!selectedStakeholder || !letterData) return;
    setDispatching(true);
    try {
      const res = await fetch('/api/stakeholders/dispatch-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteeId: selectedStakeholder.id,
          recipientEmail: letterData.recipientEmail,
          subject: letterData.subject,
          content: letterData.formalInvitationText,
          method: 'DOMISLINK_MAIL_AI_GMAIL'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDispatchSuccess(`Invitation formally dispatched! Follow-up automatically scheduled for ${new Date(data.followUpDate).toLocaleDateString('en-GB')}.`);
        setStakeholders(prev => prev.map(s => s.id === selectedStakeholder.id ? data.invitee : s));
        if (data.stats) setStats(data.stats);
        setSelectedStakeholder(data.invitee);
      }
    } catch (err) {
      console.error('Failed to dispatch letter:', err);
    } finally {
      setDispatching(false);
    }
  };

  // Generate Corporate Sponsorship Proposal
  const handleOpenProposalModal = async (invitee: StakeholderInvitee) => {
    setSelectedStakeholder(invitee);
    setIsProposalModalOpen(true);
    setProposalLoading(true);
    setProposalData(null);

    try {
      const res = await fetch('/api/stakeholders/ai-sponsorship-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: invitee.organisation,
          industry: invitee.category,
          executiveName: invitee.name,
          executivePosition: invitee.position
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProposalData(data.proposal);
      }
    } catch (err) {
      console.error('Failed to generate sponsorship proposal:', err);
    } finally {
      setProposalLoading(false);
    }
  };

  // Brainstorm AI Recommendations
  const handleOpenBrainstorm = async () => {
    setIsBrainstormModalOpen(true);
    setBrainstormLoading(true);
    try {
      const res = await fetch('/api/stakeholders/ai-brainstorm', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setBrainstormSuggestions(data.suggestions || []);
        setBrainstormDisclaimer(data.disclaimer);
      }
    } catch (err) {
      console.error('Failed to brainstorm:', err);
    } finally {
      setBrainstormLoading(false);
    }
  };

  // Import Brainstorm candidate into database
  const handleImportBrainstormCandidate = async (cand: any) => {
    try {
      const res = await fetch('/api/stakeholders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cand.name,
          position: cand.position,
          organisation: cand.organisation,
          category: cand.category,
          eventRole: cand.proposedRole,
          proposedTopic: cand.proposedTopic,
          whySectorMatters: cand.whyRelevant,
          status: 'RESEARCH CANDIDATE',
          currentRoleVerified: false,
          verificationSource: 'AI Brainstorming Intelligence — Pending Manual Verification',
          verifiedBy: 'AI Stakeholder Discovery Engine'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStakeholders(prev => [data.stakeholder, ...prev]);
        if (data.stats) setStats(data.stats);
        // Remove from list
        setBrainstormSuggestions(prev => prev.filter(c => c.name !== cand.name || c.organisation !== cand.organisation));
      }
    } catch (err) {
      console.error('Failed to import candidate:', err);
    }
  };

  // Add Stakeholder Form Submit
  const handleAddStakeholderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/stakeholders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormData)
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to add stakeholder');
      }
      const data = await res.json();
      setStakeholders(prev => [data.stakeholder, ...prev]);
      if (data.stats) setStats(data.stats);
      setIsNominateModalOpen(false);
      // Reset form
      setNewFormData({
        name: '',
        position: '',
        organisation: '',
        category: 'BANKING_AND_FINANCE',
        eventRole: 'SPECIAL GUEST',
        proposedTopic: '',
        whySectorMatters: '',
        email: '',
        phone: '',
        isNigerDelta: false,
        state: '',
        sponsorshipInterest: 'NONE',
        speakerInterest: true,
        exhibitorInterest: false,
        verificationSource: 'Official Corporate Website / Public Directory',
        verifiedBy: 'Summit Secretariat Protocol Desk',
        notes: ''
      });
    } catch (err: any) {
      setFormError(err.message || 'Could not save stakeholder');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Export CSV of Stakeholders
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Position', 'Organisation', 'Sector', 'Status', 'Role', 'Email', 'Phone', 'Proposed Topic', 'Follow-up Date'];
    const rows = filteredList.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.position.replace(/"/g, '""')}"`,
      `"${s.organisation.replace(/"/g, '""')}"`,
      `"${s.category}"`,
      `"${s.status}"`,
      `"${s.eventRole}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${(s.proposedTopic || '').replace(/"/g, '""')}"`,
      `"${s.followUpDate ? new Date(s.followUpDate).toLocaleDateString('en-GB') : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aviation_safety_summit_stakeholders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: StakeholderStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ACCEPTED':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'INTERESTED':
      case 'ACKNOWLEDGED':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'INVITATION SENT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'PROPOSED INVITEE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'DECLINED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'NO RESPONSE':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="bg-[#071220] text-slate-100 rounded-2xl border border-[#D4AF37]/30 shadow-2xl overflow-hidden">
      
      {/* Top Protocol Header */}
      <div className="p-6 border-b border-[#D4AF37]/25 bg-gradient-to-r from-[#0A192F] via-[#0E2340] to-[#0A192F] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              EXPANDED STAKEHOLDER & INVITATION ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY
            </span>
          </div>
          <h2 className="text-2xl font-serif text-white font-bold mt-1">
            Summit Invitation Management System
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Real-time candidate tracking across 24 key industries (Airlines, Banks, Oil & Gas, Telecoms, State Govs, Faith Leaders, Regulators, and Public Advocates).
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap">
          <button
            onClick={handleOpenBrainstorm}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-lg transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Ask AI: Who Else to Invite?</span>
          </button>
          
          <button
            onClick={() => setIsNominateModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Nominate / Add Invitee</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs flex items-center space-x-1"
            title="Export CSV Dossier"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            onClick={fetchStakeholders}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs"
            title="Refresh Registry"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-slate-800/80 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 rounded-lg border border-slate-700 text-xs"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Analytics Strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-4 bg-[#0A192F]/60 border-b border-slate-800 text-center">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <p className="text-[10px] uppercase font-mono text-slate-400">Total Roster</p>
            <p className="text-xl font-bold text-white mt-0.5">{stats.totalCandidates}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/40">
            <p className="text-[10px] uppercase font-mono text-purple-300">Proposed</p>
            <p className="text-xl font-bold text-purple-200 mt-0.5">{stats.proposedInvitees}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40">
            <p className="text-[10px] uppercase font-mono text-amber-300">Invitations Sent</p>
            <p className="text-xl font-bold text-amber-200 mt-0.5">{stats.invitationsSent}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40">
            <p className="text-[10px] uppercase font-mono text-sky-300">Acknowledged</p>
            <p className="text-xl font-bold text-sky-200 mt-0.5">{stats.acknowledged + stats.interested}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/40">
            <p className="text-[10px] uppercase font-mono text-teal-300">Accepted</p>
            <p className="text-xl font-bold text-teal-200 mt-0.5">{stats.accepted}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
            <p className="text-[10px] uppercase font-mono text-emerald-300">Confirmed VIPs</p>
            <p className="text-xl font-bold text-emerald-200 mt-0.5">{stats.confirmed}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-yellow-950/40 border border-[#D4AF37]/40">
            <p className="text-[10px] uppercase font-mono text-[#D4AF37]">Sponsorship Leads</p>
            <p className="text-xl font-bold text-yellow-200 mt-0.5">{stats.sponsorshipInterestCount}</p>
          </div>
        </div>
      )}

      {/* Control Bar: Filters & Search */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, organisation, role, proposed topic, or sector relevance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Sector Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-slate-200 focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="ALL">All 24 Sectors</option>
            {STAKEHOLDER_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.title} ({stats?.byCategory[c.id] || 0})</option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-slate-200 focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="RESEARCH CANDIDATE">Research Candidate</option>
            <option value="PROPOSED INVITEE">Proposed Invitee</option>
            <option value="INVITATION SENT">Invitation Sent</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="INTERESTED">Interested</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DECLINED">Declined</option>
            <option value="NO RESPONSE">No Response</option>
          </select>

          {/* Niger Delta Toggle */}
          <button
            onClick={() => setNigerDeltaOnly(!nigerDeltaOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              nigerDeltaOnly 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm' 
                : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Niger Delta Focus</span>
          </button>
        </div>
      </div>

      {/* Stakeholder Table */}
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="p-3 pl-4">Candidate & Current Office</th>
              <th className="p-3">Organisation & Sector</th>
              <th className="p-3">Proposed Role & Topic</th>
              <th className="p-3">Status</th>
              <th className="p-3">Verification</th>
              <th className="p-3 text-right pr-4">Action Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400">
                  <AlertCircle className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No stakeholders match your filter criteria</p>
                  <p className="text-xs text-slate-500 mt-1">Try broadening your search or click "Ask AI: Who Else to Invite?" to generate verified candidates.</p>
                </td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                  onClick={() => setSelectedStakeholder(item)}
                >
                  {/* Name & Role */}
                  <td className="p-3 pl-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-300 shrink-0 text-sm overflow-hidden">
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          item.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                            {item.name}
                          </span>
                          {item.isNigerDelta && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono">
                              {item.state || 'NIGER DELTA'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{item.position}</p>
                        {item.email && <p className="text-[10px] text-slate-500 font-mono">{item.email}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Organisation & Category */}
                  <td className="p-3">
                    <div className="font-semibold text-slate-200">{item.organisation}</div>
                    <div className="text-[10px] text-amber-300/90 font-mono uppercase tracking-wide">
                      {item.category.replace(/_/g, ' ')}
                    </div>
                  </td>

                  {/* Proposed Topic & Role */}
                  <td className="p-3 max-w-xs">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/40 mb-1">
                      {item.eventRole}
                    </span>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                      "{item.proposedTopic || item.proposedDiscussionArea}"
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono">
                      Proposed topic — subject to formal acceptance
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-mono font-bold border ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                    {item.followUpDate && item.status === 'INVITATION SENT' && (
                      <div className="flex items-center space-x-1 text-[9px] text-amber-300 font-mono mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Follow-up: {new Date(item.followUpDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    )}
                  </td>

                  {/* Verification */}
                  <td className="p-3">
                    <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-mono">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{item.currentRoleVerified ? 'Role Verified' : 'Pending Audit'}</span>
                    </div>
                    <p className="text-[9px] text-slate-500">By {item.verifiedBy || 'Secretariat'}</p>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleOpenLetterModal(item)}
                        className="px-2.5 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 rounded text-[10px] font-bold flex items-center space-x-1"
                        title="Generate Official Letter via Domislink Mail AI"
                      >
                        <Mail className="h-3 w-3" />
                        <span>Mail AI</span>
                      </button>

                      <button
                        onClick={() => handleOpenProposalModal(item)}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[10px] font-semibold"
                        title="Generate Tailored Sponsorship Proposal"
                      >
                        <DollarSign className="h-3 w-3" />
                      </button>

                      {/* Quick Status Dropdown */}
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value as StakeholderStatus)}
                        className="bg-slate-900 text-slate-300 border border-slate-700 rounded text-[10px] p-1 font-mono focus:outline-none"
                      >
                        <option value="RESEARCH CANDIDATE">Research</option>
                        <option value="PROPOSED INVITEE">Proposed</option>
                        <option value="INVITATION SENT">Sent</option>
                        <option value="ACKNOWLEDGED">Acknowledged</option>
                        <option value="INTERESTED">Interested</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="DECLINED">Declined</option>
                        <option value="NO RESPONSE">No Resp</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Stakeholder Detail Drawer Modal */}
      {selectedStakeholder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A192F] border border-[#D4AF37]/40 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedStakeholder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start space-x-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-amber-300 text-lg shrink-0 overflow-hidden">
                {selectedStakeholder.photoUrl ? (
                  <img src={selectedStakeholder.photoUrl} alt={selectedStakeholder.name} className="w-full h-full object-cover" />
                ) : (
                  selectedStakeholder.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadgeClass(selectedStakeholder.status)} mb-1`}>
                  {selectedStakeholder.status}
                </span>
                <h3 className="text-xl font-bold text-white font-serif">{selectedStakeholder.name}</h3>
                <p className="text-sm text-slate-300">{selectedStakeholder.position}</p>
                <p className="text-xs text-[#D4AF37] font-semibold">{selectedStakeholder.organisation}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Sector Relevance */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <p className="text-[10px] font-mono uppercase text-amber-300 font-bold mb-1">Why Sector Matters to Aviation Safety</p>
                <p className="text-slate-300 leading-relaxed">{selectedStakeholder.whySectorMatters}</p>
              </div>

              {/* Proposed Topic */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-mono uppercase text-indigo-300 font-bold">Proposed Summit Topic</p>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    Subject to Formal Acceptance
                  </span>
                </div>
                <p className="text-slate-200 font-serif italic text-sm">"{selectedStakeholder.proposedTopic || selectedStakeholder.proposedDiscussionArea}"</p>
                <p className="text-[10px] text-slate-400 mt-1">Proposed Role: <span className="text-white font-bold">{selectedStakeholder.eventRole}</span></p>
              </div>

              {/* Verification & Compliance */}
              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p className="text-slate-400 text-[10px] font-mono">Verification Source:</p>
                  <p className="text-slate-200">{selectedStakeholder.verificationSource || 'Corporate Registry'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-mono">Audited By:</p>
                  <p className="text-slate-200">{selectedStakeholder.verifiedBy || 'Summit Protocol Desk'} ({selectedStakeholder.verificationDate || '2026'})</p>
                </div>
              </div>

              {/* Anti-Fabrication Rule Warning */}
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center space-x-2 text-[10px] text-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  Anti-Fabrication Guard: Do not mark as <strong>CONFIRMED</strong> or <strong>SPEAKER</strong> without signed acceptance correspondence or direct secretariat authorization.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenLetterModal(selectedStakeholder)}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2b] text-[#0A192F] font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow"
                >
                  <Mail className="h-4 w-4" />
                  <span>Generate Formal Invitation Letter</span>
                </button>
                <button
                  onClick={() => handleOpenProposalModal(selectedStakeholder)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center space-x-1 border border-slate-700"
                >
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  <span>Sponsorship Proposal</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <label className="text-[10px] text-slate-400 font-mono">Update Status:</label>
                <select
                  value={selectedStakeholder.status}
                  onChange={(e) => handleUpdateStatus(selectedStakeholder.id, e.target.value as StakeholderStatus)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="PROPOSED">PROPOSED</option>
                  <option value="INVITATION TO BE SENT">INVITATION TO BE SENT</option>
                  <option value="INVITED">INVITED</option>
                  <option value="PENDING RESPONSE">PENDING RESPONSE</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="DECLINED">DECLINED</option>
                  <option value="WITHDRAWN">WITHDRAWN</option>
                  <option value="PROPOSED INVITEE">PROPOSED INVITEE</option>
                  <option value="INVITATION SENT">INVITATION SENT</option>
                  <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                  <option value="INTERESTED">INTERESTED</option>
                  <option value="NO RESPONSE">NO RESPONSE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Domislink Mail AI Invitation Letter Generator Modal */}
      {isLetterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A192F] border border-[#D4AF37]/50 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsLetterModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white">Domislink Mail AI — Diplomatic Letter Generator</h3>
                <p className="text-xs text-slate-300">
                  Official Summit Invitation for {selectedStakeholder?.name} ({selectedStakeholder?.organisation})
                </p>
              </div>
            </div>

            {letterGenerating ? (
              <div className="p-16 text-center space-y-3 my-auto">
                <Sparkles className="h-8 w-8 text-[#D4AF37] animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-200">Generating aristocratic diplomatic summit letter...</p>
                <p className="text-xs text-slate-400">Incorporating sector relevance, summit credentials, and Marriott Hotel details.</p>
              </div>
            ) : letterData ? (
              <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
                {dispatchSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>{dispatchSuccess}</span>
                  </div>
                )}

                {/* Email Subject */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono uppercase text-slate-400">Subject Line</p>
                  <p className="font-bold text-white text-sm mt-0.5">{letterData.subject}</p>
                </div>

                {/* Letter Body Preview */}
                <div className="p-5 bg-white text-slate-900 rounded-xl font-serif space-y-3 leading-relaxed shadow-inner border border-slate-300">
                  <div className="border-b pb-2 text-center text-xs text-slate-600 font-sans uppercase tracking-widest font-bold">
                    Domislink International Services Ltd — Aviation Safety Summit Secretariat
                  </div>
                  <p className="font-bold">{letterData.formalSalutation}</p>
                  <p>{letterData.formalInvitationText}</p>
                  <p className="font-sans font-semibold text-xs text-slate-700 bg-slate-100 p-2 rounded">
                    {letterData.eventDetailsText}
                  </p>
                  <p>{letterData.sectorRelevanceText}</p>
                  <p>{letterData.proposedRoleText}</p>
                  <p>{letterData.callToActionText}</p>

                  {/* Official RSVP Protocol & QR Section */}
                  <div className="my-4 p-4 bg-slate-50 border-2 border-[#D4AF37]/60 rounded-xl text-center font-sans space-y-2">
                    <p className="text-xs font-bold font-serif uppercase text-[#0A192F] tracking-wider">
                      RSVP / ATTENDANCE CONFIRMATION
                    </p>
                    <p className="text-xs text-slate-700">
                      Kindly confirm your attendance by visiting:
                    </p>
                    <a 
                      href={`https://summit.domislink.com/rsvp?ref=${selectedStakeholder?.id || 'AVS26'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-mono text-xs font-bold text-[#0A192F] bg-[#D4AF37]/20 px-3 py-1 rounded border border-[#D4AF37] hover:underline"
                    >
                      https://summit.domislink.com/rsvp?ref={selectedStakeholder?.id || 'AVS26'}
                    </a>
                    <p className="text-[11px] text-slate-600">
                      You may also scan the QR code provided below to confirm your attendance.
                    </p>
                    <div className="flex justify-center pt-1">
                      <RSVPQRCode 
                        reference={selectedStakeholder?.id || 'AVS26'}
                        size={120}
                        showTitle={false}
                        showLinkAction={false}
                        showDownload={false}
                        darkTheme={false}
                        className="p-2 border-0 shadow-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t text-xs font-sans text-slate-600 whitespace-pre-line">
                    {letterData.signatureBlock}
                  </div>
                </div>

                {/* Protocol Note */}
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-200">
                  <strong>5-Day Follow-Up Protocol:</strong> Clicking "Dispatch Letter" will mark status as <em>INVITATION SENT</em> and automatically schedule the Secretariat's follow-up deadline 5 days from today.
                </div>
              </div>
            ) : null}

            {/* Letter Footer Actions */}
            {letterData && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <a
                    href={letterData.gmailDraftUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open in Gmail Web (Draft)</span>
                  </a>
                  <a
                    href={letterData.mailtoUrl || '#'}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700"
                  >
                    Open in Mail App
                  </a>
                </div>

                <button
                  onClick={handleDispatchLetter}
                  disabled={dispatching}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2b] text-[#0A192F] font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow"
                >
                  <Send className="h-4 w-4" />
                  <span>{dispatching ? 'Dispatching...' : 'Dispatch & Schedule Follow-Up'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Corporate Sponsorship Proposition Modal */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A192F] border border-[#D4AF37]/50 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsProposalModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white">Strategic Corporate Sponsorship Proposition</h3>
                <p className="text-xs text-slate-300">
                  Tailored safety investment proposition for {selectedStakeholder?.organisation}
                </p>
              </div>
            </div>

            {proposalLoading ? (
              <div className="p-16 text-center space-y-3 my-auto">
                <Sparkles className="h-8 w-8 text-[#D4AF37] animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-200">Building sector-specific sponsorship rationale...</p>
              </div>
            ) : proposalData ? (
              <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-base font-bold text-[#D4AF37] font-serif">{proposalData.headline}</h4>
                  <p className="text-slate-300 mt-2 leading-relaxed">{proposalData.whySectorMatters}</p>
                  <p className="text-slate-300 mt-2 leading-relaxed">{proposalData.howParticipationSupportsSafety}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">Approved Summit Inventory Packages</p>
                  {proposalData.recommendedTiers?.map((tier: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{tier.tier}</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#D4AF37] text-sm">{tier.feeNGN}</span>
                          <span className="text-[10px] text-slate-400 ml-1">({tier.feeUSD})</span>
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1 text-slate-300">
                        {tier.benefits?.map((b: string, bIdx: number) => (
                          <li key={bIdx} className="flex items-center space-x-1.5">
                            <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-center font-medium">
                  {proposalData.callToAction}
                </div>
              </div>
            ) : null}

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close Proposition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Ask AI: Who Else Should We Invite?" Brainstorming Modal */}
      {isBrainstormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A192F] border border-[#D4AF37]/50 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsBrainstormModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white">AI Stakeholder Gap Analysis & Discovery</h3>
                <p className="text-xs text-slate-300">
                  Uncovering under-represented sectors across Nigerian corporate, academic, and civic institutions.
                </p>
              </div>
            </div>

            {brainstormDisclaimer && (
              <div className="p-2.5 bg-purple-950/40 border border-purple-800/50 rounded-xl text-[10px] text-purple-300 font-mono mb-3">
                {brainstormDisclaimer}
              </div>
            )}

            {brainstormLoading ? (
              <div className="p-16 text-center space-y-3 my-auto">
                <Sparkles className="h-8 w-8 text-purple-400 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-200">Analyzing summit representation gaps...</p>
                <p className="text-xs text-slate-400">Scanning Manufacturing, Healthcare, Logistics, State Governments, and Media.</p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-3 pr-1 flex-1 text-xs">
                {brainstormSuggestions.map((cand, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{cand.name}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-700/40">
                            {cand.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">{cand.position} — <span className="text-[#D4AF37]">{cand.organisation}</span></p>
                        <p className="text-slate-400 mt-1.5 leading-relaxed">{cand.whyRelevant}</p>
                        <div className="mt-2 p-2 bg-slate-950 rounded-lg text-slate-300 italic">
                          Proposed Topic: "{cand.proposedTopic}"
                        </div>
                      </div>

                      <button
                        onClick={() => handleImportBrainstormCandidate(cand)}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shrink-0 flex items-center space-x-1 shadow"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add as Research Candidate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleOpenBrainstorm}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Re-Run AI Gap Analysis</span>
              </button>
              <button
                onClick={() => setIsBrainstormModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nominate / Add Stakeholder Modal */}
      {isNominateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A192F] border border-[#D4AF37]/50 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsNominateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-bold font-serif text-white">Nominate / Add Summit Invitee</h3>
              <p className="text-xs text-slate-300">
                Add a stakeholder to the summit invitation tracking pipeline across the 24 sectors.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddStakeholderSubmit} className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newFormData.name}
                    onChange={(e) => setNewFormData({ ...newFormData, name: e.target.value })}
                    placeholder="e.g. Dr. Jane Okonkwo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Current Official Position *</label>
                  <input
                    type="text"
                    required
                    value={newFormData.position}
                    onChange={(e) => setNewFormData({ ...newFormData, position: e.target.value })}
                    placeholder="e.g. Managing Director & CEO"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Organisation / Institution *</label>
                  <input
                    type="text"
                    required
                    value={newFormData.organisation}
                    onChange={(e) => setNewFormData({ ...newFormData, organisation: e.target.value })}
                    placeholder="e.g. Dangote Cement / FirstBank / NNPCL"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Sector Category *</label>
                  <select
                    value={newFormData.category}
                    onChange={(e) => setNewFormData({ ...newFormData, category: e.target.value as StakeholderCategory })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {STAKEHOLDER_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Proposed Summit Role</label>
                  <select
                    value={newFormData.eventRole}
                    onChange={(e) => setNewFormData({ ...newFormData, eventRole: e.target.value as StakeholderEventRole })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <optgroup label="VIP & Dignitaries">
                      <option value="SPECIAL GUEST">Special Guest</option>
                      <option value="GUEST OF HONOUR">Guest of Honour</option>
                      <option value="KEYNOTE SPEAKER">Keynote Speaker</option>
                      <option value="PANELIST">Panelist</option>
                      <option value="SPEAKER">Speaker</option>
                      <option value="INVITED GUEST">Invited Guest</option>
                    </optgroup>
                    <optgroup label="Faith, Community & Moral Leadership">
                      <option value="INTERFAITH SAFETY PRAYER">Interfaith Safety Prayer</option>
                      <option value="OPENING PRAYER">Opening Prayer</option>
                      <option value="CLOSING PRAYER">Closing Prayer</option>
                      <option value="GOODWILL MESSAGE">Goodwill Message</option>
                      <option value="PATRON">Patron</option>
                      <option value="ADVISER">Adviser</option>
                      <option value="SAFETY ADVOCATE">Safety Advocate</option>
                    </optgroup>
                    <optgroup label="Commercial & Partnership">
                      <option value="SPONSOR">Corporate Sponsor</option>
                      <option value="EXHIBITOR">Exhibitor</option>
                      <option value="PARTNER">Strategic Partner</option>
                      <option value="ADVERTISER">Programme Advertiser</option>
                      <option value="ATTENDEE">Summit Attendee</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Sponsorship Potential</label>
                  <select
                    value={newFormData.sponsorshipInterest}
                    onChange={(e) => setNewFormData({ ...newFormData, sponsorshipInterest: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="NONE">None</option>
                    <option value="PLATINUM">Platinum Benefactor (₦25M)</option>
                    <option value="GOLD">Gold Sector Champion (₦15M)</option>
                    <option value="SILVER">Silver Safety Advocate (₦8M)</option>
                    <option value="SESSION">Session Sponsor (₦5M)</option>
                    <option value="EXHIBITION">Exhibition Booth (₦2.5M)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Proposed Topic / Discussion Area</label>
                <input
                  type="text"
                  value={newFormData.proposedTopic}
                  onChange={(e) => setNewFormData({ ...newFormData, proposedTopic: e.target.value })}
                  placeholder="e.g. Risk Governance, Aviation Insurance Underwriting, and Air Asset Protection"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Why Sector Matters to Aviation Safety</label>
                <textarea
                  rows={2}
                  value={newFormData.whySectorMatters}
                  onChange={(e) => setNewFormData({ ...newFormData, whySectorMatters: e.target.value })}
                  placeholder="Explain why this person's sector or organisation is directly impacted by air safety."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Official Email</label>
                  <input
                    type="email"
                    value={newFormData.email}
                    onChange={(e) => setNewFormData({ ...newFormData, email: e.target.value })}
                    placeholder="executive@organisation.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Official Telephone</label>
                  <input
                    type="tel"
                    value={newFormData.phone}
                    onChange={(e) => setNewFormData({ ...newFormData, phone: e.target.value })}
                    placeholder="+234..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFormData.isNigerDelta}
                    onChange={(e) => setNewFormData({ ...newFormData, isNigerDelta: e.target.checked })}
                    className="rounded border-slate-700 text-[#D4AF37] focus:ring-0"
                  />
                  <span className="text-slate-300">Niger Delta Oil & Gas / State Region</span>
                </label>

                {newFormData.isNigerDelta && (
                  <input
                    type="text"
                    placeholder="State (e.g. Rivers, Delta, Bayelsa)"
                    value={newFormData.state}
                    onChange={(e) => setNewFormData({ ...newFormData, state: e.target.value })}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Verification Source</label>
                <input
                  type="text"
                  value={newFormData.verificationSource}
                  onChange={(e) => setNewFormData({ ...newFormData, verificationSource: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNominateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2b] text-[#0A192F] font-bold rounded-lg shadow"
                >
                  {formSubmitting ? 'Saving...' : 'Add Stakeholder to Roster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
