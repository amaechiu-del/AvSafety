/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Plus, ShieldCheck, Mail, Send, 
  CheckCircle2, Clock, AlertTriangle, FileText, ChevronRight, 
  X, Building2, Award, Briefcase, Check, ArrowRight, UserPlus, MapPin,
  Calendar, Eye, RefreshCw, Trash2, Edit, Printer, Layers, Shield
} from 'lucide-react';
import { MasterPerson, MasterOrganisation } from '../../types';

interface Committee {
  id: string;
  name: string;
  reference: string;
  committeeType: string;
  description: string;
  purpose: string;
  parentCommitteeId?: string;
  chairpersonId?: string;
  viceChairpersonId?: string;
  secretaryId?: string;
  secretariatLiaison?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'SUSPENDED' | 'CONCLUDED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CommitteeMembership {
  id: string;
  committeeId: string;
  personId: string;
  membershipReference: string;
  role: string;
  startDate: string;
  endDate?: string;
  status: 'NOMINATED' | 'PENDING_APPROVAL' | 'APPROVED' | 'APPOINTED' | 'ACTIVE' | 'SUSPENDED' | 'ENDED' | 'DECLINED' | 'REMOVED';
  appointmentReference?: string;
  assignedResponsibilities: string[];
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

const COMMITTEE_TYPES = [
  'Main Organising Committee',
  'Aviation Safety Committee',
  'Programme Committee',
  'Protocol Committee',
  'VVIP / VIP Committee',
  'Registration Committee',
  'Media & Publicity Committee',
  'Sponsorship Committee',
  'Finance Committee',
  'Transport & Traffic Committee',
  'Security Committee',
  'Emergency Response Committee',
  'Hospitality Committee',
  'Refreshments Committee',
  'Accommodation Committee',
  'Airport Liaison Committee',
  'Government / Regulatory Liaison Committee',
  'Venue Operations Committee',
  'Technical / IT Committee',
  'Volunteer Committee',
  'Documentation Committee',
  'Publications Committee',
  'Photography / Media Production Committee',
  'Any Other Committee'
];

const COMMITTEE_ROLES = [
  'Chairperson',
  'Vice Chairperson',
  'Secretary',
  'Member',
  'Adviser',
  'Technical Adviser',
  'Secretariat Liaison',
  'Coordinator',
  'Volunteer',
  'Observer'
];

const RESPONSIBILITIES_LIST = [
  'Venue coordination',
  'Airport liaison',
  'Government liaison',
  'Guest reception',
  'VVIP handling',
  'Registration',
  'Transportation',
  'Security coordination',
  'Media coordination',
  'Catering coordination',
  'Documentation',
  'Volunteer coordination'
];

const LIFECYCLE_STATUSES = [
  'NOMINATED',
  'PENDING_APPROVAL',
  'APPROVED',
  'APPOINTED',
  'ACTIVE',
  'SUSPENDED',
  'ENDED',
  'DECLINED',
  'REMOVED'
];

export default function CommitteeOperationsManager() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [memberships, setMemberships] = useState<CommitteeMembership[]>([]);
  const [people, setPeople] = useState<MasterPerson[]>([]);
  const [organisations, setOrganisations] = useState<MasterOrganisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active view tab inside Committee Ops
  const [activeSubTab, setActiveSubTab] = useState<'DASHBOARD' | 'COMMITTEES' | 'MEMBERSHIPS'>('DASHBOARD');
  
  // Selected committee for detail view
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCommitteeModalOpen, setIsCommitteeModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);

  // New Committee Form State
  const [commForm, setCommForm] = useState({
    name: '',
    committeeType: 'Aviation Safety Committee',
    description: '',
    purpose: '',
    parentCommitteeId: '',
    chairpersonId: '',
    viceChairpersonId: '',
    secretaryId: '',
    secretariatLiaison: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    status: 'ACTIVE' as const,
    notes: ''
  });

  // New Membership Form State
  const [membForm, setMembForm] = useState({
    committeeId: '',
    personId: '',
    role: 'Member',
    startDate: new Date().toISOString().slice(0, 10),
    status: 'ACTIVE' as const,
    appointmentReference: '',
    assignedResponsibilities: [] as string[],
    notes: ''
  });

  const currentUserEmail = 'secretariat@domislink.com';

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resComm, resMemb, resStakeholders] = await Promise.all([
        fetch('/api/secretariat/committees'),
        fetch('/api/secretariat/committee-memberships'),
        fetch('/api/stakeholders')
      ]);

      if (resComm.ok && resMemb.ok && resStakeholders.ok) {
        const dataComm = await resComm.json();
        const dataMemb = await resMemb.json();
        const dataStake = await resStakeholders.json();
        setCommittees(dataComm.committees || []);
        setMemberships(dataMemb.memberships || []);
        setPeople(dataStake.stakeholders || []);
        setOrganisations(dataStake.organisations || []);
      } else {
        throw new Error('Failed to load committee operations data');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stats computation
  const stats = useMemo(() => {
    const totalCommittees = committees.length;
    const activeCommittees = committees.filter(c => c.status === 'ACTIVE' && c.isActive).length;
    const inactiveCommittees = totalCommittees - activeCommittees;
    const totalMembers = memberships.length;
    const pendingApprovals = memberships.filter(m => m.status === 'PENDING_APPROVAL' || m.status === 'NOMINATED').length;
    const activeAppointments = memberships.filter(m => m.status === 'APPOINTED' || m.status === 'ACTIVE').length;

    return {
      totalCommittees,
      activeCommittees,
      inactiveCommittees,
      totalMembers,
      pendingApprovals,
      activeAppointments
    };
  }, [committees, memberships]);

  // Filtered committees
  const filteredCommittees = useMemo(() => {
    return committees.filter(c => {
      if (typeFilter !== 'ALL' && c.committeeType !== typeFilter) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.reference.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.purpose.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [committees, typeFilter, statusFilter, searchQuery]);

  // Handle Committee Form Submit
  const handleSaveCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCommittee ? `/api/secretariat/committees/${editingCommittee.id}` : '/api/secretariat/committees';
      const method = editingCommittee ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...commForm, userEmail: currentUserEmail })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save committee');
      }

      setIsCommitteeModalOpen(false);
      setEditingCommittee(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Membership Form Submit
  const handleSaveMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/secretariat/committee-memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...membForm, userEmail: currentUserEmail })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to assign committee membership');
      }

      setIsMembershipModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Membership Status Change (with zero self-approval enforcement check)
  const handleUpdateMembershipStatus = async (membershipId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/secretariat/committee-memberships/${membershipId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, userEmail: currentUserEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update membership status');
        return;
      }
      fetchData();
    } catch (err) {
      alert('Network or server error during status transition');
    }
  };

  const getPersonName = (personId: string) => {
    const p = people.find(item => item.id === personId);
    if (!p) return 'Unknown Person';
    return `${p.title || ''} ${p.firstName} ${p.lastName}`.trim();
  };

  const getPersonOrg = (personId: string) => {
    const p = people.find(item => item.id === personId);
    return p ? p.organisation : 'Independent';
  };

  if (loading && committees.length === 0) {
    return (
      <div className="p-12 text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-[#D4AF37] mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading Committee Operations & Membership Management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Sub-navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>DomisLink Private Secretariat — Committee Directorate</span>
          </div>
          <h1 className="text-2xl font-black text-[#0A192F] tracking-tight">
            Committee Operations & Membership Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage summit committees, official memberships, roles, governance appointments, and responsibilities.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setEditingCommittee(null);
              setCommForm({
                name: '',
                committeeType: 'Aviation Safety Committee',
                description: '',
                purpose: '',
                parentCommitteeId: '',
                chairpersonId: '',
                viceChairpersonId: '',
                secretaryId: '',
                secretariatLiaison: '',
                startDate: new Date().toISOString().slice(0, 10),
                endDate: '',
                status: 'ACTIVE',
                notes: ''
              });
              setIsCommitteeModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#0A192F] hover:bg-[#112240] text-[#FFD700] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center space-x-2 border border-[#D4AF37]/40"
          >
            <Plus className="h-4 w-4 text-[#D4AF37]" />
            <span>New Committee</span>
          </button>

          <button
            onClick={() => {
              setMembForm({
                committeeId: committees[0]?.id || '',
                personId: people[0]?.id || '',
                role: 'Member',
                startDate: new Date().toISOString().slice(0, 10),
                status: 'ACTIVE',
                appointmentReference: '',
                assignedResponsibilities: [],
                notes: ''
              });
              setIsMembershipModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A192F] rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center space-x-2 font-black"
          >
            <UserPlus className="h-4 w-4 text-[#0A192F]" />
            <span>Assign Member</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex border-b border-gray-200 space-x-6">
        <button
          onClick={() => { setActiveSubTab('DASHBOARD'); setSelectedCommittee(null); }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeSubTab === 'DASHBOARD' && !selectedCommittee
              ? 'border-[#D4AF37] text-[#0A192F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers className="h-4 w-4 text-[#D4AF37]" />
          <span>Committee Dashboard</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('COMMITTEES'); setSelectedCommittee(null); }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeSubTab === 'COMMITTEES' && !selectedCommittee
              ? 'border-[#D4AF37] text-[#0A192F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building2 className="h-4 w-4 text-[#D4AF37]" />
          <span>Committees Directory ({committees.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('MEMBERSHIPS'); setSelectedCommittee(null); }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeSubTab === 'MEMBERSHIPS' && !selectedCommittee
              ? 'border-[#D4AF37] text-[#0A192F]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 text-[#D4AF37]" />
          <span>All Memberships ({memberships.length})</span>
        </button>

        {selectedCommittee && (
          <div className="pb-3 text-xs font-black uppercase tracking-wider border-b-2 border-[#0A192F] text-[#0A192F] flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span>Detail: {selectedCommittee.name}</span>
            <button 
              onClick={() => setSelectedCommittee(null)}
              className="ml-2 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px]"
            >
              Close View
            </button>
          </div>
        )}
      </div>

      {/* SELECTED COMMITTEE DETAIL VIEW */}
      {selectedCommittee ? (
        <div className="space-y-6">
          <div className="bg-[#0A192F] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Building2 className="w-48 h-48 text-[#D4AF37]" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-2.5 py-1 bg-[#D4AF37]/20 text-[#FFD700] rounded text-[10px] font-mono tracking-widest border border-[#D4AF37]/40">
                  {selectedCommittee.reference}
                </span>
                <span className="px-2.5 py-1 bg-white/10 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                  {selectedCommittee.committeeType}
                </span>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedCommittee.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {selectedCommittee.status}
                </span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                {selectedCommittee.name}
              </h2>
              <p className="text-gray-300 text-sm max-w-3xl mb-4 leading-relaxed">
                {selectedCommittee.description || selectedCommittee.purpose || 'No description provided.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Chairperson</span>
                  <span className="font-bold text-[#FFD700]">{selectedCommittee.chairpersonId ? getPersonName(selectedCommittee.chairpersonId) : 'Not assigned'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Secretary</span>
                  <span className="font-bold text-white">{selectedCommittee.secretaryId ? getPersonName(selectedCommittee.secretaryId) : 'Not assigned'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Secretariat Liaison</span>
                  <span className="font-bold text-white">{selectedCommittee.secretariatLiaison || 'Summit Secretariat'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Active Members</span>
                  <span className="font-bold text-[#FFD700]">
                    {memberships.filter(m => m.committeeId === selectedCommittee.id && m.status === 'ACTIVE').length} Assigned
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Members List for Committee */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-[#0A192F]">Assigned Committee Members</h3>
                <p className="text-xs text-gray-500">Official personnel roster and role allocations for {selectedCommittee.name}</p>
              </div>
              <button
                onClick={() => {
                  setMembForm({
                    committeeId: selectedCommittee.id,
                    personId: people[0]?.id || '',
                    role: 'Member',
                    startDate: new Date().toISOString().slice(0, 10),
                    status: 'ACTIVE',
                    appointmentReference: '',
                    assignedResponsibilities: [],
                    notes: ''
                  });
                  setIsMembershipModalOpen(true);
                }}
                className="px-3 py-2 bg-[#0A192F] text-[#FFD700] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2"
              >
                <Plus className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-200">
                    <th className="p-3">Reference / Member</th>
                    <th className="p-3">Organisation</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Responsibilities</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {memberships.filter(m => m.committeeId === selectedCommittee.id).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No members currently assigned to this committee.
                      </td>
                    </tr>
                  ) : (
                    memberships.filter(m => m.committeeId === selectedCommittee.id).map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <span className="font-mono text-gray-400 block text-[10px]">{m.membershipReference}</span>
                          <span className="font-bold text-[#0A192F] text-sm">{getPersonName(m.personId)}</span>
                        </td>
                        <td className="p-3 text-gray-600 font-medium">
                          {getPersonOrg(m.personId)}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-[#D4AF37]/10 text-[#0A192F] font-bold rounded text-[11px] border border-[#D4AF37]/30">
                            {m.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {m.assignedResponsibilities && m.assignedResponsibilities.length > 0 ? (
                              m.assignedResponsibilities.map((resp, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px]">
                                  {resp}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 italic">None assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'ACTIVE' || m.status === 'APPOINTED' ? 'bg-emerald-100 text-emerald-800' :
                            m.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {m.status === 'PENDING_APPROVAL' && (
                              <button
                                onClick={() => handleUpdateMembershipStatus(m.id, 'ACTIVE')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {m.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleUpdateMembershipStatus(m.id, 'SUSPENDED')}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'DASHBOARD' ? (
        <div className="space-y-6">
          {/* Dashboard Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Committees</span>
              <span className="text-3xl font-black text-[#0A192F]">{stats.totalCommittees}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Active</span>
              <span className="text-3xl font-black text-emerald-600">{stats.activeCommittees}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Members</span>
              <span className="text-3xl font-black text-blue-600">{stats.totalMembers}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Pending Approvals</span>
              <span className="text-3xl font-black text-amber-600">{stats.pendingApprovals}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Appointments</span>
              <span className="text-3xl font-black text-[#D4AF37]">{stats.activeAppointments}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Inactive</span>
              <span className="text-3xl font-black text-gray-500">{stats.inactiveCommittees}</span>
            </div>
          </div>

          {/* Quick Overview & Active Committees Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-[#0A192F]">Committees Overview</h3>
                <button
                  onClick={() => setActiveSubTab('COMMITTEES')}
                  className="text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
                >
                  View All Committees →
                </button>
              </div>
              <div className="space-y-3">
                {committees.slice(0, 5).map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedCommittee(c)}
                    className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/50 hover:bg-amber-50/10 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-gray-400">{c.reference}</span>
                        <span className="px-2 py-0.5 bg-[#0A192F]/5 text-[#0A192F] font-bold rounded text-[10px]">{c.committeeType}</span>
                      </div>
                      <h4 className="font-bold text-[#0A192F] text-sm mt-1">{c.name}</h4>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500 font-medium">
                        {memberships.filter(m => m.committeeId === c.id).length} Members
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-black text-[#0A192F] mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {memberships.filter(m => m.status === 'PENDING_APPROVAL' || m.status === 'NOMINATED').length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-6 text-center">No pending membership approvals.</p>
                ) : (
                  memberships.filter(m => m.status === 'PENDING_APPROVAL' || m.status === 'NOMINATED').map(m => {
                    const comm = committees.find(c => c.id === m.committeeId);
                    return (
                      <div key={m.id} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/50 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-[#0A192F]">{getPersonName(m.personId)}</span>
                          <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[9px] font-bold uppercase">{m.status}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium">
                          Role: <span className="text-[#0A192F] font-bold">{m.role}</span> in <span className="italic">{comm?.name || 'Committee'}</span>
                        </p>
                        <div className="flex justify-end space-x-2 pt-1">
                          <button
                            onClick={() => handleUpdateMembershipStatus(m.id, 'ACTIVE')}
                            className="px-2.5 py-1 bg-[#0A192F] text-[#FFD700] rounded text-[10px] font-bold"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'COMMITTEES' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search committees by name or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Committee Types</option>
                {COMMITTEE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="CONCLUDED">Concluded</option>
              </select>
            </div>
          </div>

          {/* Committees Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-200">
                  <th className="p-3">Reference / Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Chairperson</th>
                  <th className="p-3">Members</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCommittees.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="p-3">
                      <span className="font-mono text-gray-400 block text-[10px]">{c.reference}</span>
                      <span className="font-black text-[#0A192F] text-sm">{c.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-900 font-bold rounded text-[10px] border border-blue-200">
                        {c.committeeType}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-700">
                      {c.chairpersonId ? getPersonName(c.chairpersonId) : 'Not assigned'}
                    </td>
                    <td className="p-3 font-bold text-[#0A192F]">
                      {memberships.filter(m => m.committeeId === c.id).length} Assigned
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedCommittee(c)}
                        className="px-3 py-1.5 bg-[#0A192F] hover:bg-[#112240] text-[#FFD700] rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-[#0A192F]">All Committee Memberships ({memberships.length})</h3>
            <button
              onClick={() => {
                setMembForm({
                  committeeId: committees[0]?.id || '',
                  personId: people[0]?.id || '',
                  role: 'Member',
                  startDate: new Date().toISOString().slice(0, 10),
                  status: 'ACTIVE',
                  appointmentReference: '',
                  assignedResponsibilities: [],
                  notes: ''
                });
                setIsMembershipModalOpen(true);
              }}
              className="px-3 py-2 bg-[#D4AF37] text-[#0A192F] rounded-xl text-xs font-bold uppercase tracking-wider font-black"
            >
              Assign New Member
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-200">
                  <th className="p-3">Reference / Member</th>
                  <th className="p-3">Committee</th>
                  <th className="p-3">Organisation</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {memberships.map(m => {
                  const comm = committees.find(c => c.id === m.committeeId);
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50">
                      <td className="p-3">
                        <span className="font-mono text-gray-400 block text-[10px]">{m.membershipReference}</span>
                        <span className="font-bold text-[#0A192F] text-sm">{getPersonName(m.personId)}</span>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{comm?.name || 'Unknown Committee'}</td>
                      <td className="p-3 text-gray-600">{getPersonOrg(m.personId)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-900 font-bold rounded text-[10px] border border-amber-200">
                          {m.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {m.status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => handleUpdateMembershipStatus(m.id, 'ACTIVE')}
                            className="px-3 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW COMMITTEE MODAL */}
      {isCommitteeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-black text-[#0A192F]">Create New Committee</h3>
              <button onClick={() => setIsCommitteeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveCommittee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Committee Name *</label>
                <input
                  type="text"
                  required
                  value={commForm.name}
                  onChange={(e) => setCommForm({ ...commForm, name: e.target.value })}
                  placeholder="e.g. Aviation Safety & Airspace Security Committee"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Committee Type *</label>
                  <select
                    value={commForm.committeeType}
                    onChange={(e) => setCommForm({ ...commForm, committeeType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    {COMMITTEE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Initial Status</label>
                  <select
                    value={commForm.status}
                    onChange={(e) => setCommForm({ ...commForm, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Purpose / Mandate</label>
                <textarea
                  rows={3}
                  value={commForm.purpose}
                  onChange={(e) => setCommForm({ ...commForm, purpose: e.target.value })}
                  placeholder="Describe the core mandate and objectives..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Chairperson</label>
                  <select
                    value={commForm.chairpersonId}
                    onChange={(e) => setCommForm({ ...commForm, chairpersonId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="">-- Select Chairperson --</option>
                    {people.map(p => (
                      <option key={p.id} value={p.id}>{p.title} {p.firstName} {p.lastName} ({p.organisation})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Secretary</label>
                  <select
                    value={commForm.secretaryId}
                    onChange={(e) => setCommForm({ ...commForm, secretaryId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="">-- Select Secretary --</option>
                    {people.map(p => (
                      <option key={p.id} value={p.id}>{p.title} {p.firstName} {p.lastName} ({p.organisation})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCommitteeModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A192F] hover:bg-[#112240] text-[#FFD700] rounded-xl text-xs font-bold uppercase tracking-wider shadow"
                >
                  Save Committee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW MEMBERSHIP MODAL */}
      {isMembershipModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-black text-[#0A192F]">Assign Committee Membership</h3>
              <button onClick={() => setIsMembershipModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveMembership} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Select Committee *</label>
                <select
                  required
                  value={membForm.committeeId}
                  onChange={(e) => setMembForm({ ...membForm, committeeId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="">-- Select Committee --</option>
                  {committees.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.reference})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Select Person (from Master Directory) *</label>
                <select
                  required
                  value={membForm.personId}
                  onChange={(e) => setMembForm({ ...membForm, personId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="">-- Select Person --</option>
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.title} {p.firstName} {p.lastName} — {p.designation} ({p.organisation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Committee Role *</label>
                  <select
                    value={membForm.role}
                    onChange={(e) => setMembForm({ ...membForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    {COMMITTEE_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Initial Status</label>
                  <select
                    value={membForm.status}
                    onChange={(e) => setMembForm({ ...membForm, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="NOMINATED">Nominated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Assigned Responsibilities</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-xl border">
                  {RESPONSIBILITIES_LIST.map(resp => {
                    const isChecked = membForm.assignedResponsibilities.includes(resp);
                    return (
                      <label key={resp} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMembForm({ ...membForm, assignedResponsibilities: [...membForm.assignedResponsibilities, resp] });
                            } else {
                              setMembForm({ ...membForm, assignedResponsibilities: membForm.assignedResponsibilities.filter(r => r !== resp) });
                            }
                          }}
                          className="rounded text-[#0A192F]"
                        />
                        <span>{resp}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsMembershipModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A192F] rounded-xl text-xs font-bold uppercase tracking-wider shadow font-black"
                >
                  Assign Membership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
