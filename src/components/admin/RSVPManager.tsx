/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Crown, Users, CheckCircle2, XCircle, UserCheck, 
  HelpCircle, Search, Filter, Download, Plus, Eye, 
  Calendar, Clock, MapPin, Mail, Phone, Building2, 
  User, RefreshCw, AlertCircle, ArrowUpDown, Check, 
  Share2, ExternalLink, X, Printer, Shield, Tag, Bookmark
} from 'lucide-react';
import { RSVPRecord, RSVPStatus, AttendanceOption, StakeholderCategory } from '../../types';
import RSVPQRCode from '../rsvp/RSVPQRCode';

interface RSVPManagerProps {
  onClose?: () => void;
}

export default function RSVPManager({ onClose }: RSVPManagerProps) {
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<string>('ALL');

  // Modals & Details
  const [selectedRsvp, setSelectedRsvp] = useState<RSVPRecord | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Manual RSVP form state
  const [manualForm, setManualForm] = useState({
    invitationRef: '',
    fullName: '',
    organisation: '',
    position: '',
    email: '',
    phone: '',
    attendanceOption: 'WILL_ATTEND' as AttendanceOption,
    repFullName: '',
    repPosition: '',
    repEmail: '',
    repPhone: '',
    dietary: '',
    additionalNotes: '',
    adminNotes: 'Logged manually by Summit Secretariat Protocol Desk'
  });
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  // Fetch RSVPs from server
  const fetchRsvps = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/rsvps');
      if (!res.ok) throw new Error('Failed to load RSVP records from secretariat registry');
      const data = await res.json();
      setRsvps(data.rsvps || []);
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, []);

  // Filtered list
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      // Status filter
      if (statusFilter !== 'ALL' && r.rsvpStatus !== statusFilter) {
        return false;
      }
      // Attendance filter
      if (attendanceFilter !== 'ALL' && r.attendanceOption !== attendanceFilter) {
        return false;
      }
      // Search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.organisation.toLowerCase().includes(q) ||
        r.position.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.confirmationRef.toLowerCase().includes(q) ||
        (r.invitationRef && r.invitationRef.toLowerCase().includes(q)) ||
        (r.representative && r.representative.fullName.toLowerCase().includes(q)) ||
        (r.representative && r.representative.position && r.representative.position.toLowerCase().includes(q)) ||
        (r.representative && r.representative.email && r.representative.email.toLowerCase().includes(q))
      );
    });
  }, [rsvps, statusFilter, attendanceFilter, searchQuery]);

  // Key Attendance Metrics
  const metrics = useMemo(() => {
    const total = rsvps.length;
    const confirmed = rsvps.filter(r => r.rsvpStatus === 'CONFIRMED' || r.attendanceOption === 'WILL_ATTEND').length;
    const representatives = rsvps.filter(r => r.rsvpStatus === 'REPRESENTATIVE_NOMINATED' || r.attendanceOption === 'SEND_REPRESENTATIVE').length;
    const declined = rsvps.filter(r => r.rsvpStatus === 'DECLINED' || r.attendanceOption === 'CANNOT_ATTEND').length;
    const needsInfo = rsvps.filter(r => r.rsvpStatus === 'NEEDS_INFORMATION' || r.attendanceOption === 'NEED_MORE_INFO').length;
    const attended = rsvps.filter(r => r.rsvpStatus === 'ATTENDED').length;
    const noShow = rsvps.filter(r => r.rsvpStatus === 'NO_SHOW').length;
    return { total, confirmed, representatives, declined, needsInfo, attended, noShow };
  }, [rsvps]);

  // Update Status Action
  const handleUpdateStatus = async (id: string, newStatus: RSVPStatus) => {
    try {
      const res = await fetch(`/api/admin/rsvps/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvpStatus: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setRsvps(prev => prev.map(r => r.id === id ? { ...r, rsvpStatus: newStatus } : r));
        if (selectedRsvp && selectedRsvp.id === id) {
          setSelectedRsvp({ ...selectedRsvp, rsvpStatus: newStatus });
        }
        setActionSuccess(`Status updated to ${newStatus}`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Submit Manual RSVP
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !manualForm.organisation.trim() || !manualForm.email.trim()) {
      setManualError('Name, Organisation, and Email are required.');
      return;
    }

    setManualSubmitting(true);
    setManualError(null);

    const payload = {
      invitationRef: manualForm.invitationRef.trim() || undefined,
      fullName: manualForm.fullName.trim(),
      organisation: manualForm.organisation.trim(),
      position: manualForm.position.trim() || 'Delegate',
      email: manualForm.email.trim().toLowerCase(),
      phone: manualForm.phone.trim() || 'N/A',
      attendanceOption: manualForm.attendanceOption,
      representative: manualForm.attendanceOption === 'SEND_REPRESENTATIVE' ? {
        fullName: manualForm.repFullName.trim(),
        position: manualForm.repPosition.trim() || 'Representative',
        email: manualForm.repEmail.trim().toLowerCase(),
        phone: manualForm.repPhone.trim() || 'N/A'
      } : undefined,
      dietary: manualForm.dietary.trim() || undefined,
      additionalNotes: manualForm.additionalNotes.trim() || undefined,
      adminNotes: manualForm.adminNotes.trim()
    };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.rsvp) {
          setRsvps(prev => [json.rsvp, ...prev]);
        }
        setIsManualModalOpen(false);
        setActionSuccess('RSVP confirmation successfully logged.');
        setTimeout(() => setActionSuccess(null), 3000);
        // Reset form
        setManualForm({
          invitationRef: '',
          fullName: '',
          organisation: '',
          position: '',
          email: '',
          phone: '',
          attendanceOption: 'WILL_ATTEND',
          repFullName: '',
          repPosition: '',
          repEmail: '',
          repPhone: '',
          dietary: '',
          additionalNotes: '',
          adminNotes: 'Logged manually by Summit Secretariat Protocol Desk'
        });
      } else {
        const errJson = await res.json();
        setManualError(errJson.error || 'Failed to log RSVP record.');
      }
    } catch (err: any) {
      setManualError(err.message || 'Connection error.');
    } finally {
      setManualSubmitting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (rsvps.length === 0) return;

    const headers = [
      'Confirmation Ref',
      'Invitation Ref',
      'Full Name',
      'Organisation',
      'Position',
      'Email',
      'Phone',
      'Attendance Option',
      'RSVP Status',
      'Representative Name',
      'Representative Title',
      'Representative Email',
      'Representative Phone',
      'Dietary Requirements',
      'Special Notes',
      'Submission Timestamp'
    ];

    const rows = filteredRsvps.map(r => [
      `"${r.confirmationRef || ''}"`,
      `"${r.invitationRef || ''}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.organisation.replace(/"/g, '""')}"`,
      `"${r.position.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.attendanceOption}"`,
      `"${r.rsvpStatus}"`,
      `"${r.representative?.fullName || ''}"`,
      `"${r.representative?.position || ''}"`,
      `"${r.representative?.email || ''}"`,
      `"${r.representative?.phone || ''}"`,
      `"${r.dietary || ''}"`,
      `"${(r.additionalNotes || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DomisLink-Summit-2026-RSVP-Registry-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFBF7] text-[#0A192F]">
      
      {/* Top Protocol Action Bar */}
      <div className="p-4 sm:p-5 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#0A192F] font-mono text-[10px] font-bold uppercase rounded">
              SUMMIT PROTOCOL DESK
            </span>
            <span className="text-xs font-mono text-gray-500">17 November 2026</span>
          </div>
          <h2 className="text-lg font-serif font-black text-[#0A192F] uppercase tracking-tight mt-0.5">
            RSVP & ATTENDANCE CONFIRMATION REGISTRY
          </h2>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <button
            onClick={() => setIsQRCodeModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors border border-slate-300"
          >
            <Crown className="h-4 w-4 text-[#D4AF37]" />
            <span>RSVP QR / URL</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={rsvps.length === 0}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors shadow"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2 bg-[#0A192F] hover:bg-[#122644] text-[#D4AF37] border border-[#D4AF37]/50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Log Protocol RSVP</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-mono font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 p-4 bg-gray-50 border-b border-gray-200 text-center font-mono">
        <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-500 uppercase block">Total Logged</span>
          <span className="text-lg font-bold text-[#0A192F]">{metrics.total}</span>
        </div>

        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm">
          <span className="text-[10px] text-emerald-700 uppercase font-bold block">Confirmed</span>
          <span className="text-lg font-bold text-emerald-800">{metrics.confirmed}</span>
        </div>

        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 shadow-sm">
          <span className="text-[10px] text-amber-700 uppercase font-bold block">Representatives</span>
          <span className="text-lg font-bold text-amber-800">{metrics.representatives}</span>
        </div>

        <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 shadow-sm">
          <span className="text-[10px] text-rose-700 uppercase font-bold block">Declined</span>
          <span className="text-lg font-bold text-rose-800">{metrics.declined}</span>
        </div>

        <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 shadow-sm">
          <span className="text-[10px] text-sky-700 uppercase font-bold block">Inquiries</span>
          <span className="text-lg font-bold text-sky-800">{metrics.needsInfo}</span>
        </div>

        <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
          <span className="text-[10px] text-purple-700 uppercase font-bold block">Attended</span>
          <span className="text-lg font-bold text-purple-800">{metrics.attended}</span>
        </div>

        <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-300 shadow-sm">
          <span className="text-[10px] text-slate-600 uppercase font-bold block">No-Show</span>
          <span className="text-lg font-bold text-slate-700">{metrics.noShow}</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, org, ref, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="REPRESENTATIVE_NOMINATED">REPRESENTATIVE</option>
            <option value="DECLINED">DECLINED</option>
            <option value="NEEDS_INFORMATION">NEEDS INFORMATION</option>
            <option value="ATTENDED">ATTENDED (Check-in)</option>
            <option value="NO_SHOW">NO SHOW</option>
          </select>

          {/* Attendance Option Filter */}
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          >
            <option value="ALL">All Intentions</option>
            <option value="WILL_ATTEND">WILL ATTEND</option>
            <option value="SEND_REPRESENTATIVE">SEND REPRESENTATIVE</option>
            <option value="CANNOT_ATTEND">CANNOT ATTEND</option>
            <option value="NEED_MORE_INFO">NEED MORE INFO</option>
          </select>

          <button
            onClick={fetchRsvps}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-300 transition-colors"
            title="Refresh RSVP Registry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* RSVP Records Table */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="h-8 w-8 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-600">Connecting to Summit Protocol Registry...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto text-rose-500" />
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchRsvps}
              className="px-4 py-2 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredRsvps.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-2xl border border-gray-200">
            <Crown className="h-10 w-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">No RSVP Records Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              No confirmation records match your current filters. Share the public RSVP link with summit stakeholders.
            </p>
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-4 py-2 bg-[#0A192F] text-[#D4AF37] rounded-xl text-xs font-bold"
            >
              Log First RSVP Manually
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A192F] text-white font-mono text-[10px] uppercase tracking-wider">
                    <th className="p-3.5">Reference</th>
                    <th className="p-3.5">Invitee & Organisation</th>
                    <th className="p-3.5">Attendance Status</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Nominated Rep</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                      {/* Ref */}
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-[#0A192F] block">{r.confirmationRef}</span>
                        {r.invitationRef && (
                          <span className="text-[10px] text-gray-400">Inv: {r.invitationRef}</span>
                        )}
                      </td>

                      {/* Invitee & Org */}
                      <td className="p-3.5">
                        <span className="font-bold text-[#0A192F] text-sm block">{r.fullName}</span>
                        <span className="text-gray-600 block">{r.organisation}</span>
                        <span className="text-[10px] text-gray-400 italic block">{r.position}</span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                          {r.rsvpStatus === 'CONFIRMED' && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span>CONFIRMED</span>
                            </span>
                          )}
                          {r.rsvpStatus === 'REPRESENTATIVE_NOMINATED' && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <UserCheck className="h-3 w-3 text-amber-600" />
                              <span>REPRESENTATIVE</span>
                            </span>
                          )}
                          {r.rsvpStatus === 'DECLINED' && (
                            <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <XCircle className="h-3 w-3 text-slate-500" />
                              <span>DECLINED</span>
                            </span>
                          )}
                          {r.rsvpStatus === 'NEEDS_INFORMATION' && (
                            <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <HelpCircle className="h-3 w-3 text-sky-600" />
                              <span>NEEDS INFO</span>
                            </span>
                          )}
                          {r.rsvpStatus === 'ATTENDED' && (
                            <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <Check className="h-3 w-3 text-purple-600" />
                              <span>ATTENDED</span>
                            </span>
                          )}
                          {r.rsvpStatus === 'NO_SHOW' && (
                            <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <X className="h-3 w-3 text-rose-600" />
                              <span>NO SHOW</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3.5 font-mono text-[11px] text-gray-600">
                        <p className="text-gray-900 font-medium">{r.email}</p>
                        <p>{r.phone}</p>
                      </td>

                      {/* Rep */}
                      <td className="p-3.5">
                        {r.representative ? (
                          <div className="text-[11px]">
                            <p className="font-bold text-amber-900">{r.representative.fullName}</p>
                            <p className="text-gray-500 text-[10px]">{r.representative.position}</p>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono text-[10px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => setSelectedRsvp(r)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="h-3.5 w-3.5 inline mr-1" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(r.id, r.rsvpStatus === 'ATTENDED' ? 'CONFIRMED' : 'ATTENDED')}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                            r.rsvpStatus === 'ATTENDED'
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                          title="Event Day Check-In"
                        >
                          <Check className="h-3.5 w-3.5 inline mr-1" />
                          <span>{r.rsvpStatus === 'ATTENDED' ? 'Checked-In' : 'Check-In'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Inspect RSVP Details */}
      {selectedRsvp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-[#0A192F] shadow-2xl border-2 border-[#D4AF37] relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setSelectedRsvp(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-[#0A192F] text-[#D4AF37] rounded-xl">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                  OFFICIAL PROTOCOL CONFIRMATION RECORD
                </span>
                <h3 className="text-xl font-serif font-black text-[#0A192F]">
                  {selectedRsvp.fullName}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Primary Info */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase text-gray-400 font-bold">Confirmation Reference</p>
                  <p className="font-mono font-bold text-sm text-[#0A192F]">{selectedRsvp.confirmationRef}</p>
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase text-gray-400 font-bold">Current Protocol Status</p>
                  <p className="font-mono font-bold text-sm text-emerald-700">{selectedRsvp.rsvpStatus}</p>
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase text-gray-400 font-bold">Organisation & Role</p>
                  <p className="font-semibold text-gray-900">{selectedRsvp.organisation}</p>
                  <p className="text-gray-500">{selectedRsvp.position}</p>
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase text-gray-400 font-bold">Direct Contact</p>
                  <p className="font-mono">{selectedRsvp.email}</p>
                  <p className="font-mono">{selectedRsvp.phone}</p>
                </div>
              </div>

              {/* Representative (if any) */}
              {selectedRsvp.representative && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <p className="text-[10px] font-mono uppercase text-amber-800 font-bold">Nominated Representative</p>
                  <p className="font-bold text-sm text-amber-950">{selectedRsvp.representative.fullName}</p>
                  <p className="text-amber-900">{selectedRsvp.representative.position}</p>
                  <p className="font-mono text-[11px] text-amber-800">{selectedRsvp.representative.email} • {selectedRsvp.representative.phone}</p>
                </div>
              )}

              {/* Dietary & Notes */}
              {(selectedRsvp.dietary || selectedRsvp.additionalNotes) && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  {selectedRsvp.dietary && (
                    <div>
                      <p className="text-[10px] font-mono uppercase text-gray-400 font-bold">Dietary Requirements</p>
                      <p className="text-gray-800">{selectedRsvp.dietary}</p>
                    </div>
                  )}
                  {selectedRsvp.additionalNotes && (
                    <div>
                      <p className="text-[10px] font-mono uppercase text-gray-400 font-bold">Special Requests / Notes</p>
                      <p className="text-gray-800">{selectedRsvp.additionalNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Status Update Quick Toggles */}
              <div className="p-4 bg-[#0A192F] text-white rounded-2xl space-y-2">
                <p className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">
                  Update Protocol Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedRsvp.id, 'CONFIRMED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-mono text-[11px] font-bold"
                  >
                    CONFIRMED
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRsvp.id, 'ATTENDED')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-mono text-[11px] font-bold"
                  >
                    ATTENDED (Check-In)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRsvp.id, 'NO_SHOW')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-mono text-[11px] font-bold"
                  >
                    NO SHOW
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRsvp.id, 'DECLINED')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg font-mono text-[11px] font-bold"
                  >
                    DECLINED
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400">
                Submitted: {new Date(selectedRsvp.submittedAt).toLocaleString()}
              </span>
              <button
                onClick={() => setSelectedRsvp(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Public QR Code & RSVP Link Generator */}
      {isQRCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setIsQRCodeModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1 mb-4">
              <Crown className="h-8 w-8 text-[#D4AF37] mx-auto" />
              <h3 className="text-lg font-serif font-black text-white uppercase">
                Official Summit RSVP Pathway
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                https://summit.domislink.com/rsvp
              </p>
            </div>

            <RSVPQRCode size={200} showTitle={false} darkTheme={true} />

            <div className="mt-4 pt-4 border-t border-slate-800 text-center">
              <button
                onClick={() => setIsQRCodeModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Manual RSVP Protocol Logger */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 text-[#0A192F] shadow-2xl border-2 border-[#D4AF37] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-[#0A192F] text-[#D4AF37] rounded-xl">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                  SUMMIT SECRETARIAT PROTOCOL
                </span>
                <h3 className="text-xl font-serif font-black text-[#0A192F]">
                  Log RSVP Confirmation
                </h3>
              </div>
            </div>

            {manualError && (
              <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-rose-800 text-xs mb-4">
                {manualError}
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Attendance Intention *</label>
                <select
                  value={manualForm.attendanceOption}
                  onChange={(e) => setManualForm({ ...manualForm, attendanceOption: e.target.value as AttendanceOption })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="WILL_ATTEND">I WILL ATTEND (CONFIRMED)</option>
                  <option value="SEND_REPRESENTATIVE">SEND REPRESENTATIVE (REPRESENTATIVE)</option>
                  <option value="CANNOT_ATTEND">CANNOT ATTEND (DECLINED)</option>
                  <option value="NEED_MORE_INFO">NEED MORE INFO (INQUIRY)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Invitee Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Captain Alex Badeh"
                    value={manualForm.fullName}
                    onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Organisation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NSIB"
                    value={manualForm.organisation}
                    onChange={(e) => setManualForm({ ...manualForm, organisation: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Position / Official Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Director General"
                    value={manualForm.position}
                    onChange={(e) => setManualForm({ ...manualForm, position: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Invitation Reference (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. STK-7721"
                    value={manualForm.invitationRef}
                    onChange={(e) => setManualForm({ ...manualForm, invitationRef: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="executive@organisation.gov.ng"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {manualForm.attendanceOption === 'SEND_REPRESENTATIVE' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <p className="text-amber-800 font-bold font-mono text-[10px] uppercase">Representative Information</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Representative Full Name"
                      value={manualForm.repFullName}
                      onChange={(e) => setManualForm({ ...manualForm, repFullName: e.target.value })}
                      className="p-2 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Representative Position"
                      value={manualForm.repPosition}
                      onChange={(e) => setManualForm({ ...manualForm, repPosition: e.target.value })}
                      className="p-2 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                    <input
                      type="email"
                      placeholder="Representative Email"
                      value={manualForm.repEmail}
                      onChange={(e) => setManualForm({ ...manualForm, repEmail: e.target.value })}
                      className="p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono"
                    />
                    <input
                      type="tel"
                      placeholder="Representative Phone"
                      value={manualForm.repPhone}
                      onChange={(e) => setManualForm({ ...manualForm, repPhone: e.target.value })}
                      className="p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualSubmitting}
                  className="px-5 py-2 bg-[#0A192F] hover:bg-[#122644] text-[#D4AF37] font-bold rounded-xl shadow"
                >
                  {manualSubmitting ? 'Logging...' : 'Save RSVP Confirmation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
