/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, ShieldAlert, Key, Database, RefreshCw, 
  Trash2, Award, Calendar, HelpCircle, Check, MapPin, 
  Download, Search, Filter, ShieldCheck, Mail, Phone, 
  Building, User, Tag, CheckCircle2, AlertCircle, Eye,
  Clock, X, UserPlus
} from 'lucide-react';
import { Registration, MemoSubmission } from '../types';
import StakeholderManager from './admin/StakeholderManager';

interface AdminProps {
  registrations: Registration[];
  memos: MemoSubmission[];
  onResetDb: () => void;
  onUpdateRegistrationStatus?: (id: string, status: Registration['status']) => void;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'STAKEHOLDERS' | 'REGS' | 'MEMOS' | 'SYSTEM';
}

export default function AdminPanel({ 
  registrations, 
  memos, 
  onResetDb, 
  onUpdateRegistrationStatus,
  isOpen, 
  onClose,
  initialTab = 'STAKEHOLDERS'
}: AdminProps) {
  const [activeTab, setActiveTab] = useState<'STAKEHOLDERS' | 'REGS' | 'MEMOS' | 'SYSTEM'>(initialTab);
  const [dbResetting, setDbResetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CHECKED_IN' | 'PENDING_REVIEW' | 'CANCELLED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [inspectingDelegate, setInspectingDelegate] = useState<Registration | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setDbResetting(true);
    setTimeout(() => {
      onResetDb();
      setDbResetting(false);
    }, 1500);
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // Status filter
      if (statusFilter !== 'ALL' && reg.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'ALL' && reg.attendanceCategory !== categoryFilter) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        reg.fullName.toLowerCase().includes(q) ||
        reg.email.toLowerCase().includes(q) ||
        reg.phone.toLowerCase().includes(q) ||
        reg.organisation.toLowerCase().includes(q) ||
        reg.position.toLowerCase().includes(q) ||
        (reg.registrationCode || '').toLowerCase().includes(q) ||
        reg.country.toLowerCase().includes(q) ||
        (reg.attendanceCategory || '').toLowerCase().includes(q)
      );
    });
  }, [registrations, statusFilter, categoryFilter, searchQuery]);

  // Unique categories for filter
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach(r => {
      if (r.attendanceCategory) set.add(r.attendanceCategory);
    });
    return Array.from(set);
  }, [registrations]);

  // Metrics
  const metrics = useMemo(() => {
    const total = registrations.length;
    const checkedIn = registrations.filter(r => r.status === 'CHECKED_IN').length;
    const confirmed = registrations.filter(r => r.status === 'CONFIRMED' || !r.status).length;
    const specialRequestsCount = registrations.filter(r => r.dietaryRequirements || r.accessibilityRequirements || r.specialRequests).length;
    const international = registrations.filter(r => r.country && r.country !== 'Nigeria').length;
    return { total, checkedIn, confirmed, specialRequestsCount, international };
  }, [registrations]);

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Registration Code',
      'Status',
      'Full Name',
      'Email',
      'Phone',
      'Organisation',
      'Position',
      'Attendance Category',
      'Industry',
      'Country',
      'Dietary Requirements',
      'Accessibility Requirements',
      'Special Requests',
      'NDPA Consent Given',
      'Registration Timestamp'
    ];

    const rows = registrations.map(r => [
      `"${r.registrationCode || r.id}"`,
      `"${r.status || 'CONFIRMED'}"`,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.organisation || '').replace(/"/g, '""')}"`,
      `"${(r.position || '').replace(/"/g, '""')}"`,
      `"${(r.attendanceCategory || '').replace(/"/g, '""')}"`,
      `"${(r.industry || '').replace(/"/g, '""')}"`,
      `"${(r.country || '').replace(/"/g, '""')}"`,
      `"${(r.dietaryRequirements || '').replace(/"/g, '""')}"`,
      `"${(r.accessibilityRequirements || '').replace(/"/g, '""')}"`,
      `"${(r.specialRequests || '').replace(/"/g, '""')}"`,
      `"${r.consentNDPA ? 'YES' : 'NO'}"`,
      `"${r.registeredAt || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aviation_Safety_Summit_2026_Delegates_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Header bar */}
        <div className="bg-[#0A192F] text-white p-5 border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-2 bg-[#D4AF37]/15 rounded-xl border border-[#D4AF37]/40 text-[#D4AF37]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase block">
                ADMINISTRATION & GOVERNANCE CONSOLE
              </span>
              <h2 className="text-base sm:text-lg font-serif font-black uppercase tracking-wider text-white">
                AVIATION SAFETY SUMMIT 2026 SECRETARIAT
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] rounded-xl text-xs transition-colors uppercase font-bold tracking-widest flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Close Console</span>
          </button>
        </div>

        {/* Dashboard layout */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-[#FCFBF7]">
          
          {/* Left Navigation bar */}
          <div className="md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-2 px-3">
                SYSTEM DATABASES
              </span>

              <button
                onClick={() => setActiveTab('STAKEHOLDERS')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === 'STAKEHOLDERS'
                    ? 'bg-[#0A192F] text-[#D4AF37] shadow border border-[#D4AF37]/40'
                    : 'text-gray-700 hover:bg-[#F3E5AB]/20 hover:text-[#0A192F]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <UserPlus className="h-4 w-4 text-[#D4AF37]" />
                  <span>Stakeholder Engine</span>
                </div>
                <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#0A192F] font-bold rounded text-[10px] border border-[#D4AF37]/40">
                  24+ Sectors
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('REGS')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === 'REGS'
                    ? 'bg-[#0A192F] text-white shadow'
                    : 'text-gray-600 hover:bg-[#F3E5AB]/10 hover:text-[#0A192F]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Users className="h-4 w-4" />
                  <span>Delegate Registry</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 font-bold rounded text-[10px]">
                  {registrations.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('MEMOS')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === 'MEMOS'
                    ? 'bg-[#0A192F] text-white shadow'
                    : 'text-gray-600 hover:bg-[#F3E5AB]/10 hover:text-[#0A192F]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Safety Memos</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 font-bold rounded text-[10px]">
                  {memos.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('SYSTEM')}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === 'SYSTEM'
                    ? 'bg-[#0A192F] text-white shadow'
                    : 'text-gray-600 hover:bg-[#F3E5AB]/10 hover:text-[#0A192F]'
                }`}
              >
                <Key className="h-4 w-4" />
                <span>System Reset</span>
              </button>
            </div>

            {/* Privacy Compliance Reminder */}
            <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-[10px] text-amber-900 leading-normal space-y-1">
              <div className="flex items-center space-x-1 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                <span>NDPA 2023 COMPLIANT</span>
              </div>
              <p className="text-gray-600 font-light">
                Registration details are strictly confidential. Public endpoints are sanitized to prevent personal data scraping.
              </p>
            </div>
          </div>

          {/* Right Content stage */}
          <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
            
            {/* ------------------------------------------------------------- */}
            {/* EXPANDED STAKEHOLDER & INVITATION ENGINE TAB */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'STAKEHOLDERS' && (
              <div className="space-y-4">
                <StakeholderManager />
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* DELEGATE REGISTRY TAB */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'REGS' && (
              <div className="space-y-5">
                
                {/* Metrics Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-white border border-gray-200 rounded-2xl">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">
                      TOTAL ENROLLED
                    </span>
                    <span className="text-xl font-mono font-black text-[#0A192F]">{metrics.total}</span>
                  </div>

                  <div className="p-3.5 bg-white border border-gray-200 rounded-2xl">
                    <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider block">
                      CHECKED IN AT GATE
                    </span>
                    <span className="text-xl font-mono font-black text-emerald-700">{metrics.checkedIn}</span>
                  </div>

                  <div className="p-3.5 bg-white border border-gray-200 rounded-2xl">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                      INTERNATIONAL DELEGATES
                    </span>
                    <span className="text-xl font-mono font-black text-[#AA7C11]">{metrics.international}</span>
                  </div>

                  <div className="p-3.5 bg-white border border-gray-200 rounded-2xl">
                    <span className="text-[9px] font-mono text-blue-600 uppercase tracking-wider block">
                      SPECIAL ACCOMMODATIONS
                    </span>
                    <span className="text-xl font-mono font-black text-blue-700">{metrics.specialRequestsCount}</span>
                  </div>
                </div>

                {/* Controls Bar: Search, Category Filter, Status Filter & CSV Export */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                  
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by code, name, organisation, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] text-[#0A192F] text-xs"
                    />
                  </div>

                  {/* Filters & Export */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 bg-[#FCFBF7] border border-gray-300 rounded-xl font-mono text-xs text-[#0A192F]"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CHECKED_IN">Checked-In</option>
                      <option value="PENDING_REVIEW">Pending Review</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>

                    {/* Category Filter */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 bg-[#FCFBF7] border border-gray-300 rounded-xl font-mono text-xs text-[#0A192F] max-w-[180px] truncate"
                    >
                      <option value="ALL">All Categories</option>
                      {uniqueCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    {/* Export CSV */}
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 bg-[#0A192F] hover:bg-[#1E293B] text-white font-mono text-xs uppercase font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow"
                      title="Download full delegate attendance manifest for Marriott security"
                    >
                      <Download className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Table of Registrations */}
                <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-sm max-h-[48vh]">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50 text-[9px] font-mono text-gray-500 uppercase tracking-wider sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left">Code / Status</th>
                        <th className="px-4 py-3 text-left">Delegate Full Name</th>
                        <th className="px-4 py-3 text-left">Organisation & Position</th>
                        <th className="px-4 py-3 text-left">Attendance Category</th>
                        <th className="px-4 py-3 text-left">Contact Info</th>
                        <th className="px-4 py-3 text-left">Country</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-600">
                      {filteredRegistrations.map((reg) => {
                        const status = reg.status || 'CONFIRMED';
                        const isCheckedIn = status === 'CHECKED_IN';

                        return (
                          <tr key={reg.id} className="hover:bg-gray-50/80 transition-colors">
                            {/* Code & Status */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-mono font-bold text-[#0A192F]">
                                {reg.registrationCode || reg.id.substring(0, 10).toUpperCase()}
                              </div>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                                isCheckedIn 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : status === 'CONFIRMED' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : status === 'PENDING_REVIEW'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {status}
                              </span>
                            </td>

                            {/* Full Name */}
                            <td className="px-4 py-3">
                              <div className="font-bold text-[#0A192F]">{reg.fullName}</div>
                              <div className="text-[10px] text-gray-400 font-mono">
                                Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                              </div>
                            </td>

                            {/* Organisation & Position */}
                            <td className="px-4 py-3">
                              <div className="font-semibold text-gray-800">{reg.organisation}</div>
                              <div className="text-[10px] text-gray-500">{reg.position}</div>
                            </td>

                            {/* Attendance Category */}
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-[10px] font-mono font-semibold">
                                {reg.attendanceCategory || 'General Delegate'}
                              </span>
                            </td>

                            {/* Contact Info */}
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-1 text-gray-800">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span>{reg.email}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-500 text-[10px] mt-0.5">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{reg.phone}</span>
                              </div>
                            </td>

                            {/* Country */}
                            <td className="px-4 py-3 font-semibold text-gray-800">
                              {reg.country}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {/* Toggle Check In */}
                                {onUpdateRegistrationStatus && (
                                  <button
                                    onClick={() => onUpdateRegistrationStatus(reg.id, isCheckedIn ? 'CONFIRMED' : 'CHECKED_IN')}
                                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                                      isCheckedIn
                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-800'
                                    }`}
                                    title={isCheckedIn ? 'Click to unmark check-in' : 'Click to mark checked-in at Marriott Hotel'}
                                  >
                                    {isCheckedIn ? 'Checked-In' : 'Mark Gate In'}
                                  </button>
                                )}

                                {/* Inspect details */}
                                <button
                                  onClick={() => setInspectingDelegate(reg)}
                                  className="p-1.5 text-gray-400 hover:text-[#0A192F] hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Inspect full profile & optional requests"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredRegistrations.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-400 font-light">
                            No enrolled delegates match the search query or active filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SAFETY MEMOS TAB */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'MEMOS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <h3 className="text-sm font-serif font-extrabold text-[#0A192F] uppercase tracking-wider">
                    SAFETY MEMO SUBMISSIONS REVIEW
                  </h3>
                  <span className="text-[9px] font-mono text-gray-400">UNAPPROVED CASE ARCHIVE</span>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                  {memos.map((memo) => (
                    <div key={memo.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-[#AA7C11] font-bold rounded uppercase">
                          {memo.experienceCategory}
                        </span>
                        <span className="text-gray-400">Logged: {new Date(memo.submittedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-serif font-bold text-[#0A192F]">Title: "{memo.memoTitle}"</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          Origin: {memo.isAnonymous ? 'ANONYMISED' : memo.name} ({memo.profession}, {memo.organisation || 'N/A'})
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded border border-gray-150">
                        "{memo.memoContent}"
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-[11px] p-2.5 bg-amber-50/50 border border-amber-100 rounded-lg">
                        <div>
                          <p className="font-bold text-amber-800 uppercase text-[9px] font-mono">Key Lesson:</p>
                          <p className="text-gray-600 font-light mt-0.5">{memo.lessonLearned}</p>
                        </div>
                        <div>
                          <p className="font-bold text-emerald-800 uppercase text-[9px] font-mono">Recommended Safety Improvement:</p>
                          <p className="text-gray-600 font-light mt-0.5">{memo.recommendedImprovement}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {memos.length === 0 && (
                    <div className="text-center py-12 text-gray-400 font-light bg-white border border-gray-200 rounded-xl">
                      No de-classified safety memos have been logged on the database.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SYSTEM RESET TAB */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'SYSTEM' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <h3 className="text-sm font-serif font-extrabold text-[#0A192F] uppercase tracking-wider">
                    SYSTEM DATABASE RESTORATION
                  </h3>
                  <span className="text-[9px] font-mono text-gray-400">DANGER ZONE</span>
                </div>

                <div className="p-5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-4">
                  <ShieldAlert className="h-6 w-6 text-red-600 mt-0.5 shrink-0" />
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-red-800 uppercase">Resynchronize Database back to defaults</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      This command will drop any custom delegate records, partnership sponsorships, custom session descriptions, registered delegates, and safety memo logs, restoring the system strictly back to default configurations.
                    </p>
                    <button
                      onClick={handleReset}
                      disabled={dbResetting}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs tracking-wider uppercase transition-colors flex items-center space-x-1.5 shadow"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${dbResetting ? 'animate-spin' : ''}`} />
                      <span>{dbResetting ? 'DELETING & RESTORING...' : 'FORCE FACTORY RESET'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* INSPECT DELEGATE MODAL */}
        {/* ------------------------------------------------------------- */}
        {inspectingDelegate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-fadeIn">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                    DELEGATE FILE DETAILS
                  </span>
                  <h3 className="text-base font-serif font-black text-[#0A192F] uppercase">
                    {inspectingDelegate.fullName}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectingDelegate(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-[#FCFBF7] p-3.5 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block uppercase">Registration Code</span>
                    <span className="font-mono font-bold text-[#0A192F] text-sm">
                      {inspectingDelegate.registrationCode || inspectingDelegate.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block uppercase">Status</span>
                    <span className="font-mono font-bold text-emerald-700 uppercase">
                      {inspectingDelegate.status || 'CONFIRMED'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 block uppercase">Organisation & Position</span>
                  <p className="font-semibold text-gray-900">{inspectingDelegate.position} at {inspectingDelegate.organisation}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 block uppercase">Attendance Category</span>
                  <p className="font-semibold text-[#0A192F]">{inspectingDelegate.attendanceCategory}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block uppercase">Email</span>
                    <p className="font-mono text-gray-800 text-[11px]">{inspectingDelegate.email}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block uppercase">Phone</span>
                    <p className="font-mono text-gray-800 text-[11px]">{inspectingDelegate.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block uppercase">Industry</span>
                    <p className="text-gray-800">{inspectingDelegate.industry}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block uppercase">Country</span>
                    <p className="font-semibold text-gray-800">{inspectingDelegate.country}</p>
                  </div>
                </div>

                {/* Optional Accommodations */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-200">
                  <span className="text-[9px] font-mono text-gray-500 uppercase font-bold block">
                    Optional Accommodations Logged
                  </span>
                  <p className="text-gray-700">
                    <strong>Dietary:</strong> {inspectingDelegate.dietaryRequirements || 'None specified'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Accessibility:</strong> {inspectingDelegate.accessibilityRequirements || 'None specified'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Special Requests:</strong> {inspectingDelegate.specialRequests || 'None specified'}
                  </p>
                </div>

                {/* Compliance info */}
                <div className="text-[10px] font-mono text-gray-400 space-y-0.5 pt-1">
                  <p>NDPA 2023 Consent: {inspectingDelegate.consentNDPA ? 'Verified Valid' : 'No'}</p>
                  <p>Logged Timestamp: {inspectingDelegate.registeredAt}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setInspectingDelegate(null)}
                  className="px-5 py-2 bg-[#0A192F] text-white font-mono text-xs uppercase font-bold rounded-xl"
                >
                  Close File
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
