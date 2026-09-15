/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Plus, ShieldCheck, FileText, 
  ChevronRight, X, Building2, Award, Download, RefreshCw, 
  Eye, AlertCircle, CheckCircle2, Clock, UserPlus, Shield, Check, ArrowUpDown
} from 'lucide-react';
import { 
  MasterPerson, 
  MasterOrganisation, 
  MasterInvitation, 
  SummitSector, 
  SummitCategory, 
  InvitationType, 
  MasterInvitationStatus, 
  InvitationPurpose 
} from '../../types';

const SUMMIT_SECTORS: SummitSector[] = [
  'Aviation', 'Government', 'Regulatory', 'Airports', 'Airlines', 'Air Traffic Management',
  'Aviation Training', 'Security', 'Emergency Services', 'Road Safety', 'Transport',
  'Oil & Gas', 'Banking & Finance', 'Insurance', 'Telecommunications', 'Technology',
  'Manufacturing', 'Logistics', 'Healthcare', 'Education', 'Religious Organisations',
  'Media', 'Legal', 'Professional Bodies', 'Investors', 'Hospitality', 'Tourism',
  'State Government', 'Local Government', 'International Organisations', 'NGOs',
  'Community Organisations', 'Other'
];

const SUMMIT_CATEGORIES: SummitCategory[] = [
  'Government Official', 'Regulator', 'Airline Executive', 'Airport Executive',
  'ATC / ATM Professional', 'Aviation Safety Professional', 'Pilot', 'Engineer',
  'Cabin Crew', 'Dispatcher', 'Aviation Trainer', 'Security Organisation',
  'Emergency Service', 'Business Leader', 'Investor', 'Academic', 'Media',
  'Religious Leader', 'Traditional / Community Leader', 'Professional Association',
  'NGO Representative', 'Technology Leader', 'Legal Professional', 'Healthcare Professional',
  'Logistics Professional', 'Hospitality Representative', 'Student / Young Professional', 'Other'
];

const INVITATION_TYPES: InvitationType[] = [
  'VIP', 'VVIP', 'Official', 'Speaker', 'Panellist', 'Moderator', 'Sponsor',
  'Partner', 'Exhibitor', 'Media', 'Guest', 'Observer', 'Delegate', 'Institutional', 'Special Invite', 'Other'
];

const INVITATION_STATUSES: MasterInvitationStatus[] = [
  'DRAFT', 'APPROVED', 'READY TO SEND', 'SENT', 'DELIVERED', 'VIEWED',
  'ACCEPTED', 'DECLINED', 'TENTATIVE', 'CONFIRMED', 'ATTENDED', 'CANCELLED'
];

const INVITATION_PURPOSES: InvitationPurpose[] = [
  'Summit Delegate', 'Keynote / Speaker', 'Panel Participation', 'Government Representation',
  'Regulatory Representation', 'Strategic Partner', 'Sponsor', 'Media',
  'Industry Stakeholder', 'Community Stakeholder', 'Special Guest', 'Other'
];

export default function InvitationMasterManager() {
  const [activeSubTab, setActiveSubTab] = useState<'INVITATIONS' | 'STAKEHOLDERS' | 'ORGANISATIONS' | 'AUDIT'>('INVITATIONS');
  
  // Data state
  const [invitations, setInvitations] = useState<MasterInvitation[]>([]);
  const [stakeholders, setStakeholders] = useState<MasterPerson[]>([]);
  const [organisations, setOrganisations] = useState<MasterOrganisation[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NAME' | 'ORG' | 'SECTOR' | 'INV_NUM' | 'DATE' | 'STATUS'>('DATE');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Modals
  const [isStakeholderModalOpen, setIsStakeholderModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<MasterInvitation | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<any | null>(null);

  // Form states
  const [stakeholderForm, setStakeholderForm] = useState({
    title: 'Mr.',
    firstName: '',
    middleName: '',
    lastName: '',
    designation: '',
    organisation: '',
    department: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    state: '',
    city: '',
    sector: 'Aviation' as SummitSector,
    category: 'Government Official' as SummitCategory,
    notes: ''
  });

  const [orgForm, setOrgForm] = useState({
    name: '',
    type: 'Corporate',
    sector: 'Aviation' as SummitSector,
    country: 'Nigeria',
    state: '',
    city: '',
    address: '',
    website: '',
    email: '',
    phone: '',
    contactPerson: ''
  });

  const [inviteForm, setInviteForm] = useState({
    personId: '',
    orgId: '',
    sector: 'Aviation' as SummitSector,
    category: 'Government Official' as SummitCategory,
    invitationType: 'Delegate' as InvitationType,
    invitationPurpose: 'Summit Delegate' as InvitationPurpose
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invRes, stkRes, orgRes, auditRes] = await Promise.all([
        fetch('/api/secretariat/invitations'),
        fetch('/api/secretariat/stakeholders-master'),
        fetch('/api/secretariat/organisations-master'),
        fetch('/api/secretariat/audit-logs')
      ]);

      if (invRes.ok) {
        const d = await invRes.json();
        setInvitations(d.invitations || []);
      }
      if (stkRes.ok) {
        const d = await stkRes.json();
        setStakeholders(d.stakeholders || []);
      }
      if (orgRes.ok) {
        const d = await orgRes.json();
        setOrganisations(d.organisations || []);
      }
      if (auditRes.ok) {
        const d = await auditRes.json();
        setAuditLogs(d.auditLogs || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load master records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper lookups
  const getPerson = (id: string) => stakeholders.find(s => s.id === id);
  const getOrg = (id: string) => organisations.find(o => o.id === id);

  // Handle Create Stakeholder
  const handleCreateStakeholder = async (forceCreate = false) => {
    try {
      setError(null);
      setDuplicateWarning(null);
      const res = await fetch('/api/secretariat/stakeholders-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stakeholderForm, forceCreate })
      });
      const data = await res.json();
      if (res.status === 409 && data.warning) {
        setDuplicateWarning(data.duplicates);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to create stakeholder');

      setSuccessMessage('Stakeholder master record created successfully.');
      setIsStakeholderModalOpen(false);
      setStakeholderForm({
        title: 'Mr.',
        firstName: '',
        middleName: '',
        lastName: '',
        designation: '',
        organisation: '',
        department: '',
        email: '',
        phone: '',
        country: 'Nigeria',
        state: '',
        city: '',
        sector: 'Aviation',
        category: 'Government Official',
        notes: ''
      });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Create Organisation
  const handleCreateOrganisation = async () => {
    try {
      setError(null);
      const res = await fetch('/api/secretariat/organisations-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create organisation');

      setSuccessMessage('Organisation master record created successfully.');
      setIsOrgModalOpen(false);
      setOrgForm({
        name: '',
        type: 'Corporate',
        sector: 'Aviation',
        country: 'Nigeria',
        state: '',
        city: '',
        address: '',
        website: '',
        email: '',
        phone: '',
        contactPerson: ''
      });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Create Invitation
  const handleCreateInvitation = async () => {
    try {
      setError(null);
      const res = await fetch('/api/secretariat/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create invitation');

      setSuccessMessage(`Invitation ${data.invitation.invitationNumber} generated successfully.`);
      setIsInviteModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Status Update / Approval
  const handleUpdateStatus = async (id: string, newStatus: MasterInvitationStatus) => {
    try {
      setError(null);
      const res = await fetch(`/api/secretariat/invitations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationStatus: newStatus, userEmail: 'admin@sec.domislink.com' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setSuccessMessage(data.message);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Filtered & Sorted Invitations
  const filteredInvitations = useMemo(() => {
    return invitations.filter(inv => {
      const person = getPerson(inv.personId);
      const org = getOrg(inv.orgId);

      if (sectorFilter !== 'ALL' && inv.sector !== sectorFilter) return false;
      if (categoryFilter !== 'ALL' && inv.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && inv.invitationStatus !== statusFilter) return false;
      if (typeFilter !== 'ALL' && inv.invitationType !== typeFilter) return false;
      if (countryFilter !== 'ALL' && person?.country !== countryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pName = person ? `${person.firstName} ${person.lastName}`.toLowerCase() : '';
        const oName = org ? org.name.toLowerCase() : '';
        const invNum = inv.invitationNumber.toLowerCase();
        if (!pName.includes(q) && !oName.includes(q) && !invNum.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const pA = getPerson(a.personId);
      const pB = getPerson(b.personId);
      const oA = getOrg(a.orgId);
      const oB = getOrg(b.orgId);

      let valA = '';
      let valB = '';

      if (sortBy === 'NAME') {
        valA = pA ? `${pA.lastName} ${pA.firstName}` : '';
        valB = pB ? `${pB.lastName} ${pB.firstName}` : '';
      } else if (sortBy === 'ORG') {
        valA = oA?.name || '';
        valB = oB?.name || '';
      } else if (sortBy === 'SECTOR') {
        valA = a.sector;
        valB = b.sector;
      } else if (sortBy === 'INV_NUM') {
        valA = a.invitationNumber;
        valB = b.invitationNumber;
      } else if (sortBy === 'DATE') {
        valA = a.createdAt;
        valB = b.createdAt;
      } else if (sortBy === 'STATUS') {
        valA = a.invitationStatus;
        valB = b.invitationStatus;
      }

      if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });
  }, [invitations, stakeholders, organisations, sectorFilter, categoryFilter, statusFilter, typeFilter, countryFilter, searchQuery, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('INVITATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeSubTab === 'INVITATIONS'
                ? 'bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/50 shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="h-4 w-4 text-[#D4AF37]" />
            <span>Invitation Master ({invitations.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('STAKEHOLDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeSubTab === 'STAKEHOLDERS'
                ? 'bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/50 shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Stakeholders Directory ({stakeholders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ORGANISATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeSubTab === 'ORGANISATIONS'
                ? 'bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/50 shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Organisations ({organisations.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('AUDIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeSubTab === 'AUDIT'
                ? 'bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/50 shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab === 'STAKEHOLDERS' && (
            <button
              onClick={() => setIsStakeholderModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Stakeholder</span>
            </button>
          )}

          {activeSubTab === 'ORGANISATIONS' && (
            <button
              onClick={() => setIsOrgModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow"
            >
              <Plus className="h-4 w-4" />
              <span>Add Organisation</span>
            </button>
          )}

          {activeSubTab === 'INVITATIONS' && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Invitation</span>
            </button>
          )}

          <button
            onClick={fetchData}
            title="Refresh Records"
            className="p-2 border border-slate-200 hover:border-[#D4AF37] rounded-xl text-slate-600 hover:text-[#0A192F]"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-700 font-bold">&times;</button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. INVITATIONS MASTER TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'INVITATIONS' && (
        <div className="space-y-4">
          {/* Search & Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by invitation number, name, org..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Sectors</option>
                  {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Statuses</option>
                  {INVITATION_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Types</option>
                  {INVITATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="DATE">Sort: Date Created</option>
                  <option value="NAME">Sort: Name</option>
                  <option value="ORG">Sort: Organisation</option>
                  <option value="SECTOR">Sort: Sector</option>
                  <option value="INV_NUM">Sort: Invitation #</option>
                  <option value="STATUS">Sort: Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invitations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A192F] text-white font-mono uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Invitation Number</th>
                    <th className="p-3.5">Recipient & Org</th>
                    <th className="p-3.5">Sector & Category</th>
                    <th className="p-3.5">Type & Purpose</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInvitations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-mono text-xs">
                        No private invitation records match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvitations.map(inv => {
                      const person = getPerson(inv.personId);
                      const org = getOrg(inv.orgId);
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-[#0A192F]">
                            {inv.invitationNumber}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">
                              {person ? `${person.title || ''} ${person.firstName} ${person.lastName}` : 'Unknown Person'}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {org?.name || person?.organisation || 'Unspecified Organisation'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {person?.email} | {person?.phone}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800">{inv.sector}</div>
                            <div className="text-[10px] text-slate-500">{inv.category}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[10px]">
                              {inv.invitationType}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5">{inv.invitationPurpose}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${
                              inv.invitationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              inv.invitationStatus === 'SENT' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              inv.invitationStatus === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
                              inv.invitationStatus === 'DECLINED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                              'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}>
                              {inv.invitationStatus}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            {inv.invitationStatus === 'DRAFT' && (
                              <button
                                onClick={() => handleUpdateStatus(inv.id, 'APPROVED')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase"
                              >
                                Approve
                              </button>
                            )}
                            {inv.invitationStatus === 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(inv.id, 'READY TO SEND')}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] uppercase"
                              >
                                Ready
                              </button>
                            )}
                            {inv.invitationStatus === 'READY TO SEND' && (
                              <button
                                onClick={() => handleUpdateStatus(inv.id, 'SENT')}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[10px] uppercase"
                              >
                                Mark Sent
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedInvite(inv)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. STAKEHOLDERS DIRECTORY TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'STAKEHOLDERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0A192F] uppercase tracking-wider">Stakeholder Master Directory</h3>
            <span className="text-xs font-mono text-slate-500">Total: {stakeholders.length} Records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A192F] text-white font-mono uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Ref #</th>
                  <th className="p-3.5">Full Name & Title</th>
                  <th className="p-3.5">Designation & Org</th>
                  <th className="p-3.5">Sector & Category</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stakeholders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-mono text-xs">
                      No stakeholder records found in master directory.
                    </td>
                  </tr>
                ) : (
                  stakeholders.map(stk => (
                    <tr key={stk.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono text-slate-600">{stk.referenceNumber}</td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {stk.title} {stk.firstName} {stk.lastName}
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-800">{stk.designation}</div>
                        <div className="text-[11px] text-slate-500">{stk.organisation}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{stk.sector}</div>
                        <div className="text-[10px] text-slate-500">{stk.category}</div>
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-600">
                        <div>{stk.email}</div>
                        <div>{stk.phone}</div>
                      </td>
                      <td className="p-3.5 font-medium">{stk.country}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ORGANISATIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'ORGANISATIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0A192F] uppercase tracking-wider">Organisation Master Record</h3>
            <span className="text-xs font-mono text-slate-500">Total: {organisations.length} Organisations</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A192F] text-white font-mono uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Organisation Name</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Sector</th>
                  <th className="p-3.5">Country</th>
                  <th className="p-3.5">Contact Person</th>
                  <th className="p-3.5">Email / Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {organisations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-mono text-xs">
                      No organisations recorded.
                    </td>
                  </tr>
                ) : (
                  organisations.map(org => (
                    <tr key={org.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{org.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                          {org.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{org.sector}</td>
                      <td className="p-3.5">{org.country}</td>
                      <td className="p-3.5 text-slate-700">{org.contactPerson || '—'}</td>
                      <td className="p-3.5 text-[11px] text-slate-600">
                        <div>{org.email || '—'}</div>
                        <div>{org.phone || '—'}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. AUDIT TRAIL TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0A192F] uppercase tracking-wider">Immutable Secretariat Audit Log</h3>
            <span className="text-xs font-mono text-slate-500">Total Entries: {auditLogs.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A192F] text-white font-mono uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Entity</th>
                  <th className="p-3.5">Reference #</th>
                  <th className="p-3.5">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-mono text-xs">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="p-3.5 text-slate-500">{new Date(log.timestamp).toLocaleString('en-GB')}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                          log.action === 'APPROVE' ? 'bg-indigo-100 text-indigo-800' :
                          log.action === 'EDIT' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{log.entityType}</td>
                      <td className="p-3.5 text-[#0A192F]">{log.referenceNumber || log.recordId}</td>
                      <td className="p-3.5 text-slate-600">{log.performedBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD STAKEHOLDER PERSON */}
      {/* ------------------------------------------------------------- */}
      {isStakeholderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">Create Stakeholder Master Record</h3>
              <button onClick={() => setIsStakeholderModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {duplicateWarning && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center space-x-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Potential Duplicate Record Detected</span>
                </div>
                <p className="text-slate-700">Matching email, phone, or name & organisation found in master records:</p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
                  {duplicateWarning.map((d: any, idx: number) => (
                    <li key={idx}>{d.name} ({d.organisation}) - {d.email} [Match: {d.matchType}]</li>
                  ))}
                </ul>
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => handleCreateStakeholder(true)}
                    className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg text-xs"
                  >
                    Force Create Anyway
                  </button>
                  <button
                    onClick={() => setDuplicateWarning(null)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-800 font-bold rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <select
                  value={stakeholderForm.title}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Chief">Chief</option>
                  <option value="Otunba">Otunba</option>
                  <option value="Alhaji">Alhaji</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Bishop">Bishop</option>
                  <option value="Engr.">Engr.</option>
                  <option value="Capt.">Capt.</option>
                  <option value="Hon.">Hon.</option>
                  <option value="Distinguished Senator">Distinguished Senator</option>
                  <option value="His Excellency">His Excellency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={stakeholderForm.firstName}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, firstName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Adebayo"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Name (Surname) *</label>
                <input
                  type="text"
                  value={stakeholderForm.lastName}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, lastName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Ogunlesi"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Designation / Title</label>
                <input
                  type="text"
                  value={stakeholderForm.designation}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, designation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Managing Director"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organisation *</label>
                <input
                  type="text"
                  value={stakeholderForm.organisation}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, organisation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Federal Airports Authority"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  value={stakeholderForm.email}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. a.ogunlesi@faan.gov.ng"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telephone *</label>
                <input
                  type="text"
                  value={stakeholderForm.phone}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. +234 803 000 0000"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Summit Sector *</label>
                <select
                  value={stakeholderForm.sector}
                  onChange={(e: any) => setStakeholderForm({ ...stakeholderForm, sector: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stakeholder Category *</label>
                <select
                  value={stakeholderForm.category}
                  onChange={(e: any) => setStakeholderForm({ ...stakeholderForm, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  {SUMMIT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={stakeholderForm.country}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, country: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={() => setIsStakeholderModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateStakeholder(false)}
                className="px-5 py-2 bg-[#0A192F] text-[#D4AF37] font-bold rounded-xl text-xs uppercase"
              >
                Save Stakeholder Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD ORGANISATION */}
      {/* ------------------------------------------------------------- */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">Create Organisation Master Record</h3>
              <button onClick={() => setIsOrgModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Organisation Name *</label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Air Peace Limited"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={orgForm.type}
                    onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    placeholder="Airline / Regulatory"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector *</label>
                  <select
                    value={orgForm.sector}
                    onChange={(e: any) => setOrgForm({ ...orgForm, sector: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={orgForm.contactPerson}
                  onChange={(e) => setOrgForm({ ...orgForm, contactPerson: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Chief Executive Officer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={orgForm.email}
                    onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={orgForm.phone}
                    onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={() => setIsOrgModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrganisation}
                className="px-5 py-2 bg-[#0A192F] text-[#D4AF37] font-bold rounded-xl text-xs uppercase"
              >
                Save Organisation Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: GENERATE INVITATION */}
      {/* ------------------------------------------------------------- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">Generate Private Invitation</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Stakeholder *</label>
                <select
                  value={inviteForm.personId}
                  onChange={(e) => {
                    const p = stakeholders.find(s => s.id === e.target.value);
                    setInviteForm({
                      ...inviteForm,
                      personId: e.target.value,
                      sector: p ? p.sector : inviteForm.sector,
                      category: p ? p.category : inviteForm.category
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option value="">-- Choose registered stakeholder --</option>
                  {stakeholders.map(stk => (
                    <option key={stk.id} value={stk.id}>
                      {stk.title} {stk.firstName} {stk.lastName} ({stk.organisation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invitation Type *</label>
                  <select
                    value={inviteForm.invitationType}
                    onChange={(e: any) => setInviteForm({ ...inviteForm, invitationType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    {INVITATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invitation Purpose *</label>
                  <select
                    value={inviteForm.invitationPurpose}
                    onChange={(e: any) => setInviteForm({ ...inviteForm, invitationPurpose: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    {INVITATION_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector</label>
                  <select
                    value={inviteForm.sector}
                    onChange={(e: any) => setInviteForm({ ...inviteForm, sector: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={inviteForm.category}
                    onChange={(e: any) => setInviteForm({ ...inviteForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    {SUMMIT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvitation}
                className="px-5 py-2 bg-[#0A192F] text-[#D4AF37] font-bold rounded-xl text-xs uppercase"
              >
                Generate Invitation Number
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW INVITATION DETAILS */}
      {/* ------------------------------------------------------------- */}
      {selectedInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">Private Invitation Record</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F]">{selectedInvite.invitationNumber}</h3>
              </div>
              <button onClick={() => setSelectedInvite(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {(() => {
              const person = getPerson(selectedInvite.personId);
              return (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="font-bold text-slate-900 text-sm">
                      {person ? `${person.title || ''} ${person.firstName} ${person.lastName}` : 'N/A'}
                    </div>
                    <div className="text-slate-600">{person?.designation} at <span className="font-bold">{person?.organisation}</span></div>
                    <div className="text-slate-500 font-mono text-[11px]">{person?.email} | {person?.phone} | {person?.country}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-xl">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Sector & Category</span>
                      <div className="font-bold text-slate-800">{selectedInvite.sector}</div>
                      <div className="text-slate-600">{selectedInvite.category}</div>
                    </div>
                    <div className="p-3 border rounded-xl">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Type & Purpose</span>
                      <div className="font-bold text-amber-800">{selectedInvite.invitationType}</div>
                      <div className="text-slate-600">{selectedInvite.invitationPurpose}</div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Status</span>
                      <span className="font-bold text-indigo-900 text-sm">{selectedInvite.invitationStatus}</span>
                    </div>
                    <div className="space-x-1">
                      {selectedInvite.invitationStatus === 'DRAFT' && (
                        <button
                          onClick={() => {
                            handleUpdateStatus(selectedInvite.id, 'APPROVED');
                            setSelectedInvite(null);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                        >
                          Approve
                        </button>
                      )}
                      {selectedInvite.invitationStatus === 'APPROVED' && (
                        <button
                          onClick={() => {
                            handleUpdateStatus(selectedInvite.id, 'READY TO SEND');
                            setSelectedInvite(null);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs"
                        >
                          Mark Ready to Send
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedInvite(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
