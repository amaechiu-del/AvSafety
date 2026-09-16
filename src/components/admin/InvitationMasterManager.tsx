/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Plus, ShieldCheck, FileText, 
  ChevronRight, X, Building2, Award, Download, RefreshCw, 
  Eye, AlertCircle, CheckCircle2, Clock, UserPlus, Shield, Check, 
  ArrowUpDown, AlertTriangle, UserCheck, UserX, ExternalLink, Hash,
  MapPin, Mail, Phone, Briefcase, Tag, FileSpreadsheet, Lock, Sparkles,
  Info, History, CheckSquare
} from 'lucide-react';
import { 
  MasterPerson, 
  MasterOrganisation, 
  MasterInvitation, 
  SummitSector, 
  SummitCategory, 
  InvitationType, 
  MasterInvitationStatus, 
  InvitationPurpose,
  RelationshipClassification,
  PreferredContactMethod
} from '../../types';

export const SUMMIT_SECTORS: SummitSector[] = [
  'Aviation', 'Government', 'Regulatory', 'Security', 'Emergency Services',
  'Transport', 'Finance', 'Banking', 'Insurance', 'Oil & Gas', 'Telecoms',
  'Technology', 'Manufacturing', 'Logistics', 'Healthcare', 'Education',
  'Faith', 'Media', 'Investment', 'Hospitality', 'Real Estate', 'Legal',
  'Professional Services', 'NGO/Civil Society', 'Entertainment', 'Sports',
  'Agriculture', 'Other'
];

export const SUMMIT_CATEGORIES: SummitCategory[] = [
  'Patron', 'VVIP', 'VIP', 'Government Official', 'Regulator',
  'Aviation Executive', 'Airline Representative', 'Airport Representative',
  'ATC/Airspace', 'Safety Professional', 'Security', 'Emergency Service',
  'Sponsor', 'Partner', 'Media', 'Speaker', 'Panellist', 'Moderator',
  'Exhibitor', 'Vendor', 'Delegate', 'Observer', 'Guest', 'Institutional',
  'Special Invite', 'Other'
];

export const INVITATION_TYPES: InvitationType[] = [
  'VIP', 'VVIP', 'OFFICIAL', 'SPEAKER', 'PANELLIST', 'MODERATOR', 'SPONSOR',
  'PARTNER', 'EXHIBITOR', 'MEDIA', 'GUEST', 'OBSERVER', 'DELEGATE',
  'INSTITUTIONAL', 'SPECIAL INVITE', 'OTHER'
];

export const INVITATION_STATUSES: MasterInvitationStatus[] = [
  'DRAFT', 'APPROVED', 'READY TO SEND', 'SENT', 'DELIVERED', 'VIEWED',
  'ACCEPTED', 'DECLINED', 'TENTATIVE', 'CONFIRMED', 'ATTENDED', 'CANCELLED'
];

export const INVITATION_PURPOSES: InvitationPurpose[] = [
  'Summit Delegate', 'Keynote / Speaker', 'Panel Participation', 'Government Representation',
  'Regulatory Representation', 'Strategic Partner', 'Sponsor', 'Media',
  'Industry Stakeholder', 'Community Stakeholder', 'Special Guest', 'Other'
];

export const RELATIONSHIP_CLASSIFICATIONS: RelationshipClassification[] = [
  'HEAD_OF_STATE', 'MINISTER_GOVERNOR', 'CHIEF_EXECUTIVE', 'BOARD_MEMBER',
  'DIRECTOR_GENERAL', 'COMMANDANT', 'AMBASSADOR_DIPLOMAT', 'COMMISSIONER',
  'INDUSTRY_LEADER', 'ACADEMIC_FELLOW', 'MEDIA_PRINCIPAL', 'EXECUTIVE',
  'DELEGATE_PARTICIPANT', 'SPECIAL_GUEST'
];

export const CONTACT_METHODS: PreferredContactMethod[] = ['EMAIL', 'PHONE', 'WHATSAPP', 'OFFICIAL_DISPATCH', 'ASSISTANT'];

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
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NAME' | 'ORG' | 'SECTOR' | 'INV_NUM' | 'DATE' | 'STATUS'>('DATE');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Modals & Drawers
  const [isStakeholderModalOpen, setIsStakeholderModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<MasterInvitation | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<MasterPerson | null>(null);
  const [selectedOrganisation, setSelectedOrganisation] = useState<MasterOrganisation | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // Duplicate warning states
  const [stkDuplicateWarning, setStkDuplicateWarning] = useState<any[] | null>(null);
  const [invDuplicateWarning, setInvDuplicateWarning] = useState<any[] | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  // Deactivation confirmation modal
  const [deactivatingStakeholder, setDeactivatingStakeholder] = useState<MasterPerson | null>(null);
  const [deactivationReason, setDeactivationReason] = useState('');

  // Form states
  const [stakeholderForm, setStakeholderForm] = useState({
    title: 'Mr.',
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    designation: '',
    organisation: '',
    organisationType: 'Corporate',
    department: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    country: 'Nigeria',
    state: '',
    city: '',
    sector: 'Aviation' as SummitSector,
    category: 'Government Official' as SummitCategory,
    preferredContactMethod: 'EMAIL' as PreferredContactMethod,
    relationshipClassification: 'EXECUTIVE' as RelationshipClassification,
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
    invitationType: 'DELEGATE' as InvitationType,
    invitationPurpose: 'Summit Delegate' as InvitationPurpose,
    responsibleOfficer: 'Secretariat Officer',
    internalNotes: ''
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
  const getPerson = (id?: string) => stakeholders.find(s => s.id === id || s.stakeholderId === id || s.personId === id);
  const getOrg = (id?: string) => organisations.find(o => o.id === id || o.organisationId === id);
  const getPersonInvitations = (personId?: string) => invitations.filter(i => i.personId === personId || i.stakeholderId === personId);
  const getOrgStakeholders = (orgName?: string, orgId?: string) => stakeholders.filter(s => 
    (orgId && s.organisationId === orgId) || (orgName && (s.organisation === orgName || s.organisationName === orgName))
  );

  // Metrics calculations
  const metrics = useMemo(() => {
    const totalStakeholders = stakeholders.length;
    const activeStakeholders = stakeholders.filter(s => s.isActive !== false && s.activeStatus !== false).length;
    const totalOrganisations = organisations.length;
    const totalInvitations = invitations.length;
    const draftInvitations = invitations.filter(i => i.invitationStatus === 'DRAFT').length;
    const approvedInvitations = invitations.filter(i => i.invitationStatus === 'APPROVED').length;
    const sentInvitations = invitations.filter(i => i.invitationStatus === 'SENT' || i.invitationStatus === 'DELIVERED').length;
    const confirmedInvitations = invitations.filter(i => i.invitationStatus === 'CONFIRMED' || i.invitationStatus === 'ACCEPTED').length;
    const uniqueSectors = new Set([...stakeholders.map(s => s.sector), ...invitations.map(i => i.sector)]).size;

    return {
      totalStakeholders,
      activeStakeholders,
      totalOrganisations,
      totalInvitations,
      draftInvitations,
      approvedInvitations,
      sentInvitations,
      confirmedInvitations,
      uniqueSectors
    };
  }, [stakeholders, organisations, invitations]);

  // Handle Create Stakeholder
  const handleCreateStakeholder = async (forceCreate = false) => {
    try {
      setError(null);
      setStkDuplicateWarning(null);

      const res = await fetch('/api/secretariat/stakeholders-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...stakeholderForm, 
          forceCreate, 
          overrideReason: forceCreate ? overrideReason : undefined,
          actorEmail: 'admin@sec.domislink.com'
        })
      });
      const data = await res.json();
      
      if (res.status === 409 && data.warning) {
        setStkDuplicateWarning(data.duplicates);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to create stakeholder record');

      setSuccessMessage(data.message || 'Stakeholder master record created successfully.');
      setIsStakeholderModalOpen(false);
      setOverrideReason('');
      setStakeholderForm({
        title: 'Mr.',
        firstName: '',
        middleName: '',
        lastName: '',
        preferredName: '',
        designation: '',
        organisation: '',
        organisationType: 'Corporate',
        department: '',
        email: '',
        phone: '',
        altPhone: '',
        address: '',
        country: 'Nigeria',
        state: '',
        city: '',
        sector: 'Aviation',
        category: 'Government Official',
        preferredContactMethod: 'EMAIL',
        relationshipClassification: 'EXECUTIVE',
        notes: ''
      });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Deactivate Stakeholder
  const handleDeactivateStakeholder = async () => {
    if (!deactivatingStakeholder) return;
    try {
      setError(null);
      const res = await fetch(`/api/secretariat/stakeholders-master/${deactivatingStakeholder.id}/deactivate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorEmail: 'admin@sec.domislink.com',
          reason: deactivationReason || 'Authorised stakeholder record deactivation'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to deactivate stakeholder');

      setSuccessMessage(`Stakeholder ${deactivatingStakeholder.firstName} ${deactivatingStakeholder.lastName} deactivated.`);
      setDeactivatingStakeholder(null);
      setDeactivationReason('');
      if (selectedStakeholder?.id === deactivatingStakeholder.id) {
        setSelectedStakeholder({ ...selectedStakeholder, isActive: false, activeStatus: false });
      }
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
        body: JSON.stringify({ ...orgForm, actorEmail: 'admin@sec.domislink.com' })
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
  const handleCreateInvitation = async (forceCreate = false) => {
    try {
      setError(null);
      setInvDuplicateWarning(null);

      const targetPerson = stakeholders.find(s => s.id === inviteForm.personId);
      const res = await fetch('/api/secretariat/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...inviteForm, 
          orgId: targetPerson?.organisationId || targetPerson?.organisation || 'org-unspecified',
          forceCreate, 
          overrideReason: forceCreate ? overrideReason : undefined,
          actorEmail: 'admin@sec.domislink.com'
        })
      });
      const data = await res.json();
      
      if (res.status === 409 && data.warning) {
        setInvDuplicateWarning(data.duplicates);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to generate invitation');

      setSuccessMessage(data.message || `Private invitation ${data.invitation.invitationNumber} generated successfully.`);
      setIsInviteModalOpen(false);
      setOverrideReason('');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Status Update / Approval
  const handleUpdateStatus = async (id: string, newStatus: MasterInvitationStatus, reason?: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/secretariat/invitations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          invitationStatus: newStatus, 
          userEmail: 'admin@sec.domislink.com',
          reason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update invitation status');

      setSuccessMessage(data.message);
      if (selectedInvite && selectedInvite.id === id) {
        setSelectedInvite({ ...selectedInvite, invitationStatus: newStatus, currentStatus: newStatus });
      }
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Export CSV Handlers with Server Audit Logging
  const exportStakeholdersCSV = async () => {
    try {
      const headers = ['Stakeholder ID', 'Reference Number', 'Title', 'First Name', 'Middle Name', 'Last Name', 'Designation', 'Organisation', 'Sector', 'Category', 'Email', 'Phone', 'Alt Phone', 'Country', 'State', 'City', 'Contact Method', 'Classification', 'Active Status', 'Created At'];
      const rows = stakeholders.map(s => [
        s.id,
        s.referenceNumber || '',
        s.title || '',
        `"${s.firstName || ''}"`,
        `"${s.middleName || ''}"`,
        `"${s.lastName || ''}"`,
        `"${s.designation || ''}"`,
        `"${s.organisation || s.organisationName || ''}"`,
        `"${s.sector || ''}"`,
        `"${s.category || s.stakeholderCategory || ''}"`,
        s.email || '',
        s.phone || '',
        s.altPhone || '',
        s.country || '',
        s.state || '',
        s.city || '',
        s.preferredContactMethod || '',
        s.relationshipClassification || '',
        s.isActive !== false ? 'ACTIVE' : 'INACTIVE',
        s.createdAt || ''
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `domislink_stakeholders_master_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Record export in audit trail
      await fetch('/api/secretariat/audit-logs/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType: 'STAKEHOLDER_MASTER_EXPORT',
          recordsCount: stakeholders.length,
          actorEmail: 'admin@sec.domislink.com',
          filterSummary: `Sector: ${sectorFilter}, Status: ${activeStatusFilter}`
        })
      });
      fetchData();
      setSuccessMessage('Stakeholder master records exported and logged to audit trail.');
    } catch (e: any) {
      setError('Export failed: ' + e.message);
    }
  };

  const exportInvitationsCSV = async () => {
    try {
      const headers = ['Invitation ID', 'Invitation Number', 'Recipient Name', 'Organisation', 'Sector', 'Category', 'Invitation Type', 'Purpose', 'Status', 'Responsible Officer', 'Date Issued', 'Audit Ref', 'Created At'];
      const rows = invitations.map(inv => {
        const p = getPerson(inv.personId);
        const org = getOrg(inv.orgId);
        return [
          inv.id,
          inv.invitationNumber || inv.invitationReference || '',
          p ? `"${p.title || ''} ${p.firstName} ${p.lastName}"` : 'Unknown',
          org ? `"${org.name}"` : `"${p?.organisation || ''}"`,
          `"${inv.sector}"`,
          `"${inv.category}"`,
          inv.invitationType,
          `"${inv.invitationPurpose}"`,
          inv.invitationStatus,
          `"${inv.responsibleOfficer || ''}"`,
          inv.invitationDate || '',
          inv.auditReference || '',
          inv.createdAt || ''
        ];
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `domislink_invitations_master_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Record export in audit trail
      await fetch('/api/secretariat/audit-logs/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType: 'INVITATION_MASTER_EXPORT',
          recordsCount: invitations.length,
          actorEmail: 'admin@sec.domislink.com',
          filterSummary: `Sector: ${sectorFilter}, Status: ${statusFilter}, Type: ${typeFilter}`
        })
      });
      fetchData();
      setSuccessMessage('Invitation master records exported and logged to audit trail.');
    } catch (e: any) {
      setError('Export failed: ' + e.message);
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

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pName = person ? `${person.firstName} ${person.lastName} ${person.title || ''}`.toLowerCase() : '';
        const oName = (org?.name || person?.organisation || '').toLowerCase();
        const invNum = (inv.invitationNumber || inv.invitationReference || '').toLowerCase();
        const email = (person?.email || '').toLowerCase();
        if (!pName.includes(q) && !oName.includes(q) && !invNum.includes(q) && !email.includes(q)) return false;
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
        valA = oA?.name || pA?.organisation || '';
        valB = oB?.name || pB?.organisation || '';
      } else if (sortBy === 'SECTOR') {
        valA = a.sector;
        valB = b.sector;
      } else if (sortBy === 'INV_NUM') {
        valA = a.invitationNumber || a.invitationReference || '';
        valB = b.invitationNumber || b.invitationReference || '';
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
  }, [invitations, stakeholders, organisations, sectorFilter, categoryFilter, statusFilter, typeFilter, searchQuery, sortBy, sortOrder]);

  // Filtered & Sorted Stakeholders
  const filteredStakeholders = useMemo(() => {
    return stakeholders.filter(stk => {
      if (sectorFilter !== 'ALL' && stk.sector !== sectorFilter) return false;
      if (categoryFilter !== 'ALL' && stk.category !== categoryFilter && stk.stakeholderCategory !== categoryFilter) return false;
      if (activeStatusFilter === 'ACTIVE' && (stk.isActive === false || stk.activeStatus === false)) return false;
      if (activeStatusFilter === 'INACTIVE' && (stk.isActive !== false && stk.activeStatus !== false)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = `${stk.title || ''} ${stk.firstName} ${stk.lastName}`.toLowerCase();
        const org = (stk.organisation || stk.organisationName || '').toLowerCase();
        const email = (stk.email || '').toLowerCase();
        const phone = (stk.phone || '').toLowerCase();
        const ref = (stk.referenceNumber || stk.id).toLowerCase();
        if (!name.includes(q) && !org.includes(q) && !email.includes(q) && !phone.includes(q) && !ref.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      let valA = `${a.lastName} ${a.firstName}`;
      let valB = `${b.lastName} ${b.firstName}`;
      if (sortBy === 'ORG') {
        valA = a.organisation || a.organisationName || '';
        valB = b.organisation || b.organisationName || '';
      } else if (sortBy === 'SECTOR') {
        valA = a.sector;
        valB = b.sector;
      } else if (sortBy === 'DATE') {
        valA = a.createdAt;
        valB = b.createdAt;
      }
      if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });
  }, [stakeholders, sectorFilter, categoryFilter, activeStatusFilter, searchQuery, sortBy, sortOrder]);

  // Filtered Organisations
  const filteredOrganisations = useMemo(() => {
    return organisations.filter(org => {
      if (sectorFilter !== 'ALL' && org.sector !== sectorFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (org.name || '').toLowerCase();
        const contact = (org.contactPerson || '').toLowerCase();
        const email = (org.email || '').toLowerCase();
        if (!name.includes(q) && !contact.includes(q) && !email.includes(q)) return false;
      }
      return true;
    });
  }, [organisations, sectorFilter, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* SECRETARIAT MASTER RECORDS HEADER & METRICS BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0A192F] text-white p-5 rounded-3xl border border-[#D4AF37]/30 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest border border-[#D4AF37]/40">
                Authoritative Master System
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Module 3 Master Records</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-white tracking-wide mt-1">
              Invitation & Stakeholder Master Records
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Private Secretariat registry for summit stakeholders, participating organisations, and authoritative private invitation credentials.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={exportStakeholdersCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Export Stakeholders CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Export Stakeholders</span>
            </button>
            <button
              onClick={exportInvitationsCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Export Invitations CSV"
            >
              <Download className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Export Invitations</span>
            </button>
            <button
              onClick={fetchData}
              title="Refresh Registry"
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2 border-t border-slate-800">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Stakeholders</div>
            <div className="text-lg font-bold text-white mt-0.5">{metrics.totalStakeholders}</div>
            <div className="text-[10px] text-emerald-400 font-mono">{metrics.activeStakeholders} Active</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Organisations</div>
            <div className="text-lg font-bold text-white mt-0.5">{metrics.totalOrganisations}</div>
            <div className="text-[10px] text-slate-400 font-mono">Master Orgs</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Invitations</div>
            <div className="text-lg font-bold text-[#D4AF37] mt-0.5">{metrics.totalInvitations}</div>
            <div className="text-[10px] text-slate-400 font-mono">Total Issued</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Draft</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">{metrics.draftInvitations}</div>
            <div className="text-[10px] text-amber-400/80 font-mono">Pending Review</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Approved</div>
            <div className="text-lg font-bold text-emerald-300 mt-0.5">{metrics.approvedInvitations}</div>
            <div className="text-[10px] text-emerald-400/80 font-mono">Ready to Dispatch</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Sent</div>
            <div className="text-lg font-bold text-blue-300 mt-0.5">{metrics.sentInvitations}</div>
            <div className="text-[10px] text-blue-400/80 font-mono">Dispatched</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Confirmed</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">{metrics.confirmedInvitations}</div>
            <div className="text-[10px] text-indigo-400/80 font-mono">Attending</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Sectors</div>
            <div className="text-lg font-bold text-purple-300 mt-0.5">{metrics.uniqueSectors}</div>
            <div className="text-[10px] text-purple-400/80 font-mono">Represented</div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-NAVIGATION TABS & ACTION BUTTONS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('INVITATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
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
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
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
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
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
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
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
              onClick={() => {
                setStkDuplicateWarning(null);
                setIsStakeholderModalOpen(true);
              }}
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
              onClick={() => {
                setInvDuplicateWarning(null);
                if (stakeholders.length > 0 && !inviteForm.personId) {
                  const first = stakeholders[0];
                  setInviteForm(prev => ({
                    ...prev,
                    personId: first.id,
                    sector: first.sector,
                    category: first.category
                  }));
                }
                setIsInviteModalOpen(true);
              }}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Invitation</span>
            </button>
          )}
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 font-bold hover:text-emerald-900">&times;</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-700 font-bold hover:text-rose-900">&times;</button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. INVITATIONS MASTER TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'INVITATIONS' && (
        <div className="space-y-4">
          {/* Search & Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by invitation number (ASS-INV-2026-XXXX), recipient name, organisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Sectors ({SUMMIT_SECTORS.length})</option>
                  {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Categories</option>
                  {SUMMIT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  <option value="INV_NUM">Sort: Invitation #</option>
                  <option value="NAME">Sort: Recipient Name</option>
                  <option value="ORG">Sort: Organisation</option>
                  <option value="SECTOR">Sort: Sector</option>
                  <option value="STATUS">Sort: Status</option>
                </select>

                <button
                  onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900"
                  title={`Order: ${sortOrder}`}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>
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
                    <th className="p-3.5">Recipient & Organisation</th>
                    <th className="p-3.5">Sector & Category</th>
                    <th className="p-3.5">Type & Purpose</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date Issued</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInvitations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-mono text-xs">
                        No private invitation records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredInvitations.map(inv => {
                      const person = getPerson(inv.personId);
                      const org = getOrg(inv.orgId);
                      const invNum = inv.invitationNumber || inv.invitationReference;
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-[#0A192F]">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[#D4AF37]">#</span>
                              <span>{invNum}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">{inv.auditReference}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">
                              {person ? `${person.title || ''} ${person.firstName} ${person.lastName}` : 'Stakeholder Unlinked'}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              {person?.designation ? `${person.designation} • ` : ''}
                              {org?.name || person?.organisation || person?.organisationName || 'Private Delegate'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {person?.email} {person?.phone ? `| ${person.phone}` : ''}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800">{inv.sector}</div>
                            <div className="text-[10px] text-slate-500">{inv.category}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300/80 rounded font-bold text-[10px] tracking-wide inline-block">
                              {inv.invitationType}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5">{inv.invitationPurpose}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                              inv.invitationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              inv.invitationStatus === 'READY TO SEND' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              inv.invitationStatus === 'SENT' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                              inv.invitationStatus === 'CONFIRMED' || inv.invitationStatus === 'ACCEPTED' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
                              inv.invitationStatus === 'DECLINED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                              inv.invitationStatus === 'CANCELLED' ? 'bg-red-100 text-red-800 border border-red-300' :
                              'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}>
                              <span>{inv.invitationStatus}</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-[11px] font-mono text-slate-500">
                            {inv.invitationDate || inv.createdAt?.slice(0, 10) || '2026-09-16'}
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            {inv.invitationStatus === 'DRAFT' && (
                              <button
                                onClick={() => handleUpdateStatus(inv.id, 'APPROVED')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase transition-colors"
                                title="Approve Invitation"
                              >
                                Approve
                              </button>
                            )}
                            {inv.invitationStatus === 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(inv.id, 'READY TO SEND')}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] uppercase transition-colors"
                                title="Mark Ready to Send"
                              >
                                Ready
                              </button>
                            )}
                            {inv.invitationStatus === 'READY TO SEND' && (
                              <button
                                onClick={() => handleUpdateStatus(inv.id, 'SENT')}
                                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[10px] uppercase transition-colors"
                                title="Mark Sent"
                              >
                                Mark Sent
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedInvite(inv)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors inline-flex items-center"
                              title="View Invitation Dossier"
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
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by stakeholder name, organisation, email, phone, reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Sectors</option>
                  {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Categories</option>
                  {SUMMIT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={activeStatusFilter}
                  onChange={(e) => setActiveStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="ALL">All Records</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Deactivated Only</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="NAME">Sort: Stakeholder Name</option>
                  <option value="ORG">Sort: Organisation</option>
                  <option value="SECTOR">Sort: Sector</option>
                  <option value="DATE">Sort: Date Registered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stakeholders Directory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A192F] text-white font-mono uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Reference #</th>
                    <th className="p-3.5">Stakeholder Full Name</th>
                    <th className="p-3.5">Designation & Organisation</th>
                    <th className="p-3.5">Sector & Category</th>
                    <th className="p-3.5">Contact Method</th>
                    <th className="p-3.5">Country</th>
                    <th className="p-3.5">Active Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStakeholders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-mono text-xs">
                        No stakeholder master records match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStakeholders.map(stk => {
                      const isActive = stk.isActive !== false && stk.activeStatus !== false;
                      const relatedInvs = getPersonInvitations(stk.id);
                      return (
                        <tr key={stk.id} className={`hover:bg-slate-50/80 transition-colors ${!isActive ? 'opacity-60 bg-slate-50/50' : ''}`}>
                          <td className="p-3.5 font-mono text-slate-600 font-bold">
                            {stk.referenceNumber || stk.id}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 flex items-center space-x-1">
                              <span>{stk.title || ''} {stk.firstName} {stk.middleName ? `${stk.middleName} ` : ''}{stk.lastName}</span>
                            </div>
                            {stk.preferredName && (
                              <div className="text-[10px] text-slate-400 italic">Preferred: "{stk.preferredName}"</div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800">{stk.designation || 'Executive'}</div>
                            <div className="text-[11px] text-slate-500">{stk.organisation || stk.organisationName}</div>
                            {stk.department && <div className="text-[10px] text-slate-400">{stk.department}</div>}
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800">{stk.sector}</div>
                            <div className="text-[10px] text-slate-500">{stk.category || stk.stakeholderCategory}</div>
                          </td>
                          <td className="p-3.5 text-[11px] text-slate-600 font-mono">
                            <div>{stk.email}</div>
                            <div>{stk.phone}</div>
                          </td>
                          <td className="p-3.5 font-medium">{stk.country || 'Nigeria'}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                              isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                              <span>{isActive ? 'Active' : 'Inactive'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => {
                                setInviteForm({
                                  personId: stk.id,
                                  orgId: stk.organisationId || stk.organisation || '',
                                  sector: stk.sector,
                                  category: stk.category || stk.stakeholderCategory,
                                  invitationType: 'DELEGATE',
                                  invitationPurpose: 'Summit Delegate',
                                  responsibleOfficer: 'Secretariat Officer',
                                  internalNotes: ''
                                });
                                setIsInviteModalOpen(true);
                              }}
                              className="px-2 py-1 bg-[#0A192F] hover:bg-slate-800 text-[#D4AF37] font-bold rounded text-[10px] uppercase transition-colors"
                              title="Issue Private Invitation"
                            >
                              + Invite
                            </button>
                            <button
                              onClick={() => setSelectedStakeholder(stk)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors inline-flex items-center"
                              title="View Stakeholder Dossier"
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
      {/* 3. ORGANISATIONS MASTER TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'ORGANISATIONS' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search organisations by name, contact person, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="ALL">All Sectors</option>
                {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A192F] text-white font-mono uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Organisation Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Sector</th>
                    <th className="p-3.5">Country / Location</th>
                    <th className="p-3.5">Contact Person</th>
                    <th className="p-3.5">Attached Stakeholders</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrganisations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-mono text-xs">
                        No organisation records found in master registry.
                      </td>
                    </tr>
                  ) : (
                    filteredOrganisations.map(org => {
                      const attachedStks = getOrgStakeholders(org.name, org.id);
                      return (
                        <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                              <span>{org.name}</span>
                            </div>
                            {org.website && (
                              <a href={org.website} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center space-x-0.5 mt-0.5">
                                <span>{org.website}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-bold">
                              {org.type}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-800">{org.sector}</td>
                          <td className="p-3.5">
                            <div>{org.country}</div>
                            {org.city && <div className="text-[10px] text-slate-400">{org.city}, {org.state}</div>}
                          </td>
                          <td className="p-3.5 text-slate-700">
                            <div className="font-medium">{org.contactPerson || '—'}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{org.email || org.phone}</div>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-[#0A192F]">
                            {attachedStks.length} Persons
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedOrganisation(org)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors inline-flex items-center"
                              title="View Organisation Dossier"
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
      {/* 4. AUDIT TRAIL TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#0A192F] uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                <span>Immutable Secretariat Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500">
                Authoritative chronological record of all stakeholder creation, duplicate overrides, deactivations, invitations, approvals, and data exports.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
              Total Entries: {auditLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A192F] text-white font-mono uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Timestamp (UTC)</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Entity Type</th>
                  <th className="p-3.5">Reference #</th>
                  <th className="p-3.5">Actor / Officer</th>
                  <th className="p-3.5">Reason / Justification</th>
                  <th className="p-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-mono text-xs">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="p-3.5 text-slate-500">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('en-GB') : 'Just now'}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action?.includes('OVERRIDE') ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          log.action?.includes('DEACTIVAT') ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          log.action?.includes('CREATED') || log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          log.action?.includes('APPROV') ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
                          log.action?.includes('EXPORT') ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{log.entityType}</td>
                      <td className="p-3.5 text-[#0A192F] font-bold">{log.referenceNumber || log.recordId}</td>
                      <td className="p-3.5 text-slate-600">{log.performedBy}</td>
                      <td className="p-3.5 text-slate-500 font-sans text-xs max-w-xs truncate">
                        {log.reason || '—'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedAuditLog(log)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                          title="Inspect Log Entry"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
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
      {/* MODAL: CREATE STAKEHOLDER PERSON */}
      {/* ------------------------------------------------------------- */}
      {isStakeholderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">Secretariat Master Records</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">Create Stakeholder Master Record</h3>
              </div>
              <button onClick={() => setIsStakeholderModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Duplicate Detection Warning Banner */}
            {stkDuplicateWarning && (
              <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl text-amber-950 text-xs space-y-3">
                <div className="font-bold flex items-center space-x-2 text-sm text-amber-900">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>Potential Duplicate Stakeholder Record Detected</span>
                </div>
                <p className="text-slate-800">
                  The system matched the following existing stakeholder records based on email, telephone, or name & organisation:
                </p>
                <div className="space-y-2 bg-white/80 p-3 rounded-xl border border-amber-200">
                  {stkDuplicateWarning.map((d: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between text-[11px] font-mono border-b border-amber-100 last:border-0 pb-1">
                      <div>
                        <div className="font-bold text-slate-900">{d.name} ({d.organisation})</div>
                        <div className="text-slate-600">{d.email} | {d.phone}</div>
                        <div className="text-amber-800 text-[10px]">{d.matchReason}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold text-[10px]">
                        {d.matchType}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-amber-200">
                  <label className="block font-bold text-slate-800 text-xs">
                    Officer Justification for Duplicate Override (Audit Trail Required) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distinct individual with shared corporate email confirmed by secretariat"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                  />
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleCreateStakeholder(true)}
                      disabled={!overrideReason.trim()}
                      className={`px-4 py-2 text-white font-bold rounded-xl text-xs uppercase tracking-wider ${
                        overrideReason.trim() ? 'bg-amber-700 hover:bg-amber-800' : 'bg-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Authorise Duplicate Override & Save
                    </button>
                    <button
                      onClick={() => setStkDuplicateWarning(null)}
                      className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                    >
                      Go Back / Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Honorific Title</label>
                <select
                  value={stakeholderForm.title}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Chief">Chief</option>
                  <option value="Otunba">Otunba</option>
                  <option value="Alhaji">Alhaji</option>
                  <option value="Hajiya">Hajiya</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Bishop">Bishop</option>
                  <option value="Engr.">Engr.</option>
                  <option value="Capt.">Capt.</option>
                  <option value="Hon.">Hon.</option>
                  <option value="Distinguished Senator">Distinguished Senator</option>
                  <option value="His Excellency">His Excellency</option>
                  <option value="Her Excellency">Her Excellency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={stakeholderForm.firstName}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, firstName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Adebayo"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Name (Surname) *</label>
                <input
                  type="text"
                  value={stakeholderForm.lastName}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, lastName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Ogunlesi"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  value={stakeholderForm.middleName}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, middleName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Name / Badge Alias</label>
                <input
                  type="text"
                  value={stakeholderForm.preferredName}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, preferredName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Bayo"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Designation *</label>
                <input
                  type="text"
                  value={stakeholderForm.designation}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, designation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Managing Director"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organisation *</label>
                <input
                  type="text"
                  value={stakeholderForm.organisation}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, organisation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Federal Airports Authority of Nigeria"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department / Directorate</label>
                <input
                  type="text"
                  value={stakeholderForm.department}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Aerodrome Operations"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  value={stakeholderForm.email}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. a.ogunlesi@faan.gov.ng"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Telephone *</label>
                <input
                  type="text"
                  value={stakeholderForm.phone}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. +234 803 000 0000"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alternative Phone</label>
                <input
                  type="text"
                  value={stakeholderForm.altPhone}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, altPhone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Summit Sector *</label>
                <select
                  value={stakeholderForm.sector}
                  onChange={(e: any) => setStakeholderForm({ ...stakeholderForm, sector: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stakeholder Category *</label>
                <select
                  value={stakeholderForm.category}
                  onChange={(e: any) => setStakeholderForm({ ...stakeholderForm, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {SUMMIT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Relationship Tier</label>
                <select
                  value={stakeholderForm.relationshipClassification}
                  onChange={(e: any) => setStakeholderForm({ ...stakeholderForm, relationshipClassification: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {RELATIONSHIP_CLASSIFICATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Contact Method</label>
                <select
                  value={stakeholderForm.preferredContactMethod}
                  onChange={(e: any) => setStakeholderForm({ ...stakeholderForm, preferredContactMethod: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={stakeholderForm.country}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, country: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={stakeholderForm.state}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, state: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Lagos / FCT"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={stakeholderForm.city}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Ikeja / Abuja"
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
                className="px-5 py-2 bg-[#0A192F] text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Save Stakeholder Master Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE ORGANISATION */}
      {/* ------------------------------------------------------------- */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">Secretariat Master Records</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">Create Organisation Record</h3>
              </div>
              <button onClick={() => setIsOrgModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Organisation Full Legal Name *</label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Nigerian Civil Aviation Authority (NCAA)"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Entity Type</label>
                  <select
                    value={orgForm.type}
                    onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Government Ministry / Department">Government Ministry / Agency</option>
                    <option value="Regulatory Authority">Regulatory Authority</option>
                    <option value="Airline Operator">Airline Operator</option>
                    <option value="Airport Authority">Airport Authority</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Financial Institution">Financial Institution</option>
                    <option value="Diplomatic Mission">Diplomatic Mission</option>
                    <option value="Professional Association">Professional Association</option>
                    <option value="NGO / Civil Society">NGO / Civil Society</option>
                    <option value="Media House">Media House</option>
                    <option value="Academic Institution">Academic Institution</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector *</label>
                  <select
                    value={orgForm.sector}
                    onChange={(e: any) => setOrgForm({ ...orgForm, sector: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designated Focal Contact Person</label>
                <input
                  type="text"
                  value={orgForm.contactPerson}
                  onChange={(e) => setOrgForm({ ...orgForm, contactPerson: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Director of Protocol"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={orgForm.email}
                    onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="contact@ncaa.gov.ng"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={orgForm.phone}
                    onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="+234 1 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Website</label>
                <input
                  type="text"
                  value={orgForm.website}
                  onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="https://ncaa.gov.ng"
                />
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
                className="px-5 py-2 bg-[#0A192F] text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Save Organisation Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: GENERATE PRIVATE INVITATION */}
      {/* ------------------------------------------------------------- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">Secretariat Master Records</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">Generate Authoritative Private Invitation</h3>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Duplicate Warning */}
            {invDuplicateWarning && (
              <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl text-amber-950 text-xs space-y-3">
                <div className="font-bold flex items-center space-x-2 text-sm text-amber-900">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>Existing Active Invitation Found for Stakeholder</span>
                </div>
                <p className="text-slate-800">
                  This stakeholder already has an active summit invitation in the master records:
                </p>
                <div className="space-y-1 bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[11px] font-mono">
                  {invDuplicateWarning.map((d: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span><strong>{d.invitationNumber}</strong> ({d.invitationType})</span>
                      <span className="font-bold text-indigo-900">{d.invitationStatus}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-2 border-t border-amber-200">
                  <label className="block font-bold text-slate-800 text-xs">
                    Officer Justification for Duplicate Invitation Override *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Additional category allocation approved by CEO Domislink"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs"
                  />
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleCreateInvitation(true)}
                      disabled={!overrideReason.trim()}
                      className={`px-4 py-2 text-white font-bold rounded-xl text-xs uppercase ${
                        overrideReason.trim() ? 'bg-amber-700 hover:bg-amber-800' : 'bg-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Override & Generate Invitation
                    </button>
                    <button
                      onClick={() => setInvDuplicateWarning(null)}
                      className="px-3 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Registered Stakeholder Master Record *</label>
                <select
                  value={inviteForm.personId}
                  onChange={(e) => {
                    const p = stakeholders.find(s => s.id === e.target.value);
                    setInviteForm({
                      ...inviteForm,
                      personId: e.target.value,
                      sector: p ? p.sector : inviteForm.sector,
                      category: p ? (p.category || p.stakeholderCategory) : inviteForm.category
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="">-- Choose registered stakeholder --</option>
                  {stakeholders.map(stk => (
                    <option key={stk.id} value={stk.id}>
                      {stk.title || ''} {stk.firstName} {stk.lastName} ({stk.organisation || stk.organisationName}) - {stk.sector}
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {INVITATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Summit Purpose *</label>
                  <select
                    value={inviteForm.invitationPurpose}
                    onChange={(e: any) => setInviteForm({ ...inviteForm, invitationPurpose: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {INVITATION_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector *</label>
                  <select
                    value={inviteForm.sector}
                    onChange={(e: any) => setInviteForm({ ...inviteForm, sector: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {SUMMIT_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={inviteForm.category}
                    onChange={(e: any) => setInviteForm({ ...inviteForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {SUMMIT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Secretariat Notes</label>
                <textarea
                  rows={2}
                  value={inviteForm.internalNotes}
                  onChange={(e) => setInviteForm({ ...inviteForm, internalNotes: e.target.value })}
                  placeholder="Special protocol notes, seating allocation, or bilateral briefing requirements..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
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
                onClick={() => handleCreateInvitation(false)}
                disabled={!inviteForm.personId}
                className={`px-5 py-2 text-[#D4AF37] font-bold rounded-xl text-xs uppercase tracking-wider ${
                  inviteForm.personId ? 'bg-[#0A192F] hover:bg-slate-800' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Generate Official Invitation Number
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOSSIER MODAL: VIEW INVITATION DETAILS */}
      {/* ------------------------------------------------------------- */}
      {selectedInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">Authoritative Private Credential</span>
                <h3 className="font-serif font-bold text-lg text-[#0A192F]">
                  {selectedInvite.invitationNumber || selectedInvite.invitationReference}
                </h3>
              </div>
              <button onClick={() => setSelectedInvite(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {(() => {
              const person = getPerson(selectedInvite.personId);
              const org = getOrg(selectedInvite.orgId);
              return (
                <div className="space-y-4 text-xs">
                  {/* Recipient Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Designated Recipient</span>
                      <span className="px-2 py-0.5 bg-[#0A192F] text-[#D4AF37] text-[10px] font-mono rounded">
                        Ref: {person?.referenceNumber || person?.id || 'N/A'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-base">
                      {person ? `${person.title || ''} ${person.firstName} ${person.middleName ? `${person.middleName} ` : ''}${person.lastName}` : 'Unlinked Person'}
                    </div>
                    <div className="text-slate-700 font-medium">
                      {person?.designation} • <span className="font-bold">{org?.name || person?.organisation || person?.organisationName}</span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px] pt-1 border-t border-slate-200 flex flex-wrap gap-x-4">
                      <span>📧 {person?.email}</span>
                      <span>📞 {person?.phone}</span>
                      <span>📍 {person?.city ? `${person.city}, ` : ''}{person?.country || 'Nigeria'}</span>
                    </div>
                  </div>

                  {/* Summit Classification */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 border border-slate-200 rounded-2xl bg-white">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Sector & Category</span>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedInvite.sector}</div>
                      <div className="text-slate-600">{selectedInvite.category}</div>
                    </div>
                    <div className="p-3.5 border border-slate-200 rounded-2xl bg-white">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Type & Purpose</span>
                      <div className="font-bold text-amber-900 text-sm mt-0.5">{selectedInvite.invitationType}</div>
                      <div className="text-slate-600">{selectedInvite.invitationPurpose}</div>
                    </div>
                  </div>

                  {/* Status & Governance Panel */}
                  <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">Master Invitation Status</span>
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider inline-block mt-1 ${
                          selectedInvite.invitationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          selectedInvite.invitationStatus === 'READY TO SEND' ? 'bg-blue-100 text-blue-800' :
                          selectedInvite.invitationStatus === 'SENT' ? 'bg-sky-100 text-sky-800' :
                          selectedInvite.invitationStatus === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-800' :
                          selectedInvite.invitationStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-200 text-slate-800'
                        }`}>
                          {selectedInvite.invitationStatus}
                        </span>
                      </div>

                      <div className="space-x-1.5">
                        {selectedInvite.invitationStatus === 'DRAFT' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedInvite.id, 'APPROVED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase"
                          >
                            Approve Invitation
                          </button>
                        )}
                        {selectedInvite.invitationStatus === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedInvite.id, 'READY TO SEND')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase"
                          >
                            Mark Ready
                          </button>
                        )}
                        {selectedInvite.invitationStatus === 'READY TO SEND' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedInvite.id, 'SENT')}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs uppercase"
                          >
                            Mark Sent
                          </button>
                        )}
                        {selectedInvite.invitationStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedInvite.id, 'CANCELLED', 'Cancelled by Secretariat officer')}
                            className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs uppercase"
                          >
                            Cancel Invite
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 pt-2 border-t border-slate-200">
                      <div>Issued: {selectedInvite.invitationDate || '2026-09-16'}</div>
                      <div>Event Date: {selectedInvite.eventDate || '2026-11-17'}</div>
                      <div>Officer: {selectedInvite.responsibleOfficer || 'Secretariat Officer'}</div>
                      <div>Audit Ref: {selectedInvite.auditReference}</div>
                    </div>
                  </div>

                  {selectedInvite.internalNotes && (
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs">
                      <span className="font-bold text-amber-900 block mb-1">Internal Notes:</span>
                      <p className="text-slate-700">{selectedInvite.internalNotes}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedInvite(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOSSIER MODAL: VIEW STAKEHOLDER PERSON */}
      {/* ------------------------------------------------------------- */}
      {selectedStakeholder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">Stakeholder Master Record</span>
                <h3 className="font-serif font-bold text-lg text-[#0A192F]">
                  {selectedStakeholder.title || ''} {selectedStakeholder.firstName} {selectedStakeholder.middleName ? `${selectedStakeholder.middleName} ` : ''}{selectedStakeholder.lastName}
                </h3>
              </div>
              <button onClick={() => setSelectedStakeholder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Reference #</span>
                  <span className="font-mono font-bold text-[#0A192F]">{selectedStakeholder.referenceNumber || selectedStakeholder.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Status</span>
                  <span className={`font-bold ${selectedStakeholder.isActive !== false ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedStakeholder.isActive !== false ? 'ACTIVE' : 'DEACTIVATED'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Relationship Tier</span>
                  <span className="font-bold text-slate-800">{selectedStakeholder.relationshipClassification || 'EXECUTIVE'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Designation</span>
                  <span className="font-semibold text-slate-800">{selectedStakeholder.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Organisation</span>
                  <span className="font-bold text-slate-900">{selectedStakeholder.organisation || selectedStakeholder.organisationName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Department</span>
                  <span className="text-slate-700">{selectedStakeholder.department || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Summit Sector</span>
                  <span className="font-bold text-slate-800">{selectedStakeholder.sector}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Category</span>
                  <span className="font-semibold text-slate-800">{selectedStakeholder.category || selectedStakeholder.stakeholderCategory}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Contact Method</span>
                  <span className="text-slate-700">{selectedStakeholder.preferredContactMethod || 'EMAIL'}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-600 flex flex-wrap gap-x-4">
                  <span>📧 {selectedStakeholder.email}</span>
                  <span>📞 {selectedStakeholder.phone}</span>
                  {selectedStakeholder.altPhone && <span>Alt: {selectedStakeholder.altPhone}</span>}
                  <span>📍 {selectedStakeholder.city ? `${selectedStakeholder.city}, ` : ''}{selectedStakeholder.country || 'Nigeria'}</span>
                </div>
              </div>

              {/* Related Invitations Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#0A192F] uppercase tracking-wider">
                    Associated Private Invitations ({getPersonInvitations(selectedStakeholder.id).length})
                  </h4>
                  <button
                    onClick={() => {
                      setInviteForm({
                        personId: selectedStakeholder.id,
                        orgId: selectedStakeholder.organisationId || selectedStakeholder.organisation || '',
                        sector: selectedStakeholder.sector,
                        category: selectedStakeholder.category || selectedStakeholder.stakeholderCategory,
                        invitationType: 'DELEGATE',
                        invitationPurpose: 'Summit Delegate',
                        responsibleOfficer: 'Secretariat Officer',
                        internalNotes: ''
                      });
                      setSelectedStakeholder(null);
                      setIsInviteModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F] font-bold rounded-lg text-[10px] uppercase"
                  >
                    + Generate New Invite
                  </button>
                </div>

                {getPersonInvitations(selectedStakeholder.id).length === 0 ? (
                  <div className="p-3 bg-slate-50 border rounded-xl text-slate-400 text-center text-xs">
                    No invitations generated for this stakeholder yet.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {getPersonInvitations(selectedStakeholder.id).map(inv => (
                      <div key={inv.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#0A192F]">{inv.invitationNumber || inv.invitationReference}</span>
                          <div className="text-[11px] text-slate-500">{inv.invitationType} • {inv.invitationPurpose}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.invitationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {inv.invitationStatus}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedInvite(inv);
                              setSelectedStakeholder(null);
                            }}
                            className="p-1 bg-white border rounded text-slate-700"
                            title="View Invitation"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Deactivation action */}
              {selectedStakeholder.isActive !== false && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-900 block text-xs">Record Status Control</span>
                    <span className="text-[11px] text-rose-700">Deactivate stakeholder if transferred or retired.</span>
                  </div>
                  <button
                    onClick={() => {
                      setDeactivatingStakeholder(selectedStakeholder);
                      setSelectedStakeholder(null);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase"
                  >
                    Deactivate Record
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedStakeholder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOSSIER MODAL: VIEW ORGANISATION */}
      {/* ------------------------------------------------------------- */}
      {selectedOrganisation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">Organisation Master Record</span>
                <h3 className="font-serif font-bold text-lg text-[#0A192F]">{selectedOrganisation.name}</h3>
              </div>
              <button onClick={() => setSelectedOrganisation(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Entity Type</span>
                  <span className="font-bold text-slate-800">{selectedOrganisation.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Sector</span>
                  <span className="font-bold text-slate-800">{selectedOrganisation.sector}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Country / State</span>
                  <span className="text-slate-700">{selectedOrganisation.country} {selectedOrganisation.state ? `(${selectedOrganisation.state})` : ''}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Focal Contact Person</span>
                  <span className="text-slate-700">{selectedOrganisation.contactPerson || '—'}</span>
                </div>
                {selectedOrganisation.website && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Website</span>
                    <a href={selectedOrganisation.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {selectedOrganisation.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Attached Stakeholders */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[#0A192F] uppercase tracking-wider">
                  Associated Stakeholders ({getOrgStakeholders(selectedOrganisation.name, selectedOrganisation.id).length})
                </h4>
                {getOrgStakeholders(selectedOrganisation.name, selectedOrganisation.id).length === 0 ? (
                  <div className="p-3 bg-slate-50 border rounded-xl text-slate-400 text-center text-xs">
                    No individuals recorded under this organisation yet.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {getOrgStakeholders(selectedOrganisation.name, selectedOrganisation.id).map(stk => (
                      <div key={stk.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{stk.title || ''} {stk.firstName} {stk.lastName}</div>
                          <div className="text-[11px] text-slate-500">{stk.designation} • {stk.email}</div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStakeholder(stk);
                            setSelectedOrganisation(null);
                          }}
                          className="p-1 bg-white border rounded text-slate-700"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedOrganisation(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DEACTIVATE STAKEHOLDER CONFIRMATION */}
      {/* ------------------------------------------------------------- */}
      {deactivatingStakeholder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-rose-500 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-700">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="font-serif font-bold text-base uppercase text-slate-900">Deactivate Stakeholder Record</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to deactivate the master record for <strong>{deactivatingStakeholder.title} {deactivatingStakeholder.firstName} {deactivatingStakeholder.lastName}</strong>?
            </p>
            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-700">Deactivation Reason / Authority *</label>
              <input
                type="text"
                value={deactivationReason}
                onChange={(e) => setDeactivationReason(e.target.value)}
                placeholder="e.g. Completed tenure / reassigned to non-summit portfolio"
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setDeactivatingStakeholder(null)}
                className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateStakeholder}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: AUDIT LOG INSPECTION */}
      {/* ------------------------------------------------------------- */}
      {selectedAuditLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase">Audit Event Inspector</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F]">{selectedAuditLog.action}</h3>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl font-mono text-[11px]">
                <div>Entity: {selectedAuditLog.entityType}</div>
                <div>Ref: {selectedAuditLog.referenceNumber || selectedAuditLog.recordId}</div>
                <div>Officer: {selectedAuditLog.performedBy}</div>
                <div>Time: {new Date(selectedAuditLog.timestamp).toLocaleString('en-GB')}</div>
              </div>

              {selectedAuditLog.reason && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 block mb-0.5">Stated Justification:</span>
                  <p className="text-slate-700">{selectedAuditLog.reason}</p>
                </div>
              )}

              {selectedAuditLog.newValue && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Recorded State Payload:</span>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] overflow-x-auto max-h-48">
                    {JSON.stringify(selectedAuditLog.newValue, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedAuditLog(null)}
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
