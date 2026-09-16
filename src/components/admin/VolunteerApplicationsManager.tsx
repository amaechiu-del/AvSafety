/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Download, Eye, RefreshCw, 
  CheckCircle2, Mail, Phone, MapPin, Calendar, Clock, 
  ShieldCheck, AlertCircle, Sparkles, Building, GraduationCap,
  X, Briefcase
} from 'lucide-react';
import { VolunteerApplication } from '../../types';

export default function VolunteerApplicationsManager() {
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [applicantTypeFilter, setApplicantTypeFilter] = useState('ALL');
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerApplication | null>(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/volunteers', {
        headers: { 'x-admin-mode': 'true' }
      });
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data.volunteers || []);
      }
    } catch (err) {
      console.error('Failed to load volunteer records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    volunteers.forEach(v => {
      if (v.preferredDepartment) set.add(v.preferredDepartment);
    });
    return Array.from(set);
  }, [volunteers]);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(v => {
      if (applicantTypeFilter !== 'ALL' && (v.applicantType || 'Individual Volunteer') !== applicantTypeFilter) {
        return false;
      }
      if (departmentFilter !== 'ALL' && v.preferredDepartment !== departmentFilter) {
        return false;
      }
      if (availabilityFilter !== 'ALL' && v.availability !== availabilityFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (v.reference || '').toLowerCase().includes(q) ||
        (v.firstName || '').toLowerCase().includes(q) ||
        (v.lastName || '').toLowerCase().includes(q) ||
        (v.email || '').toLowerCase().includes(q) ||
        (v.phone || '').toLowerCase().includes(q) ||
        (v.occupation || '').toLowerCase().includes(q) ||
        (v.sponsoringOrgName || '').toLowerCase().includes(q) ||
        (v.organisation || '').toLowerCase().includes(q) ||
        (v.city || '').toLowerCase().includes(q) ||
        (v.preferredDepartment || '').toLowerCase().includes(q)
      );
    });
  }, [volunteers, applicantTypeFilter, departmentFilter, availabilityFilter, searchQuery]);

  const handleExportCSV = () => {
    if (volunteers.length === 0) {
      alert('No volunteer applications available to export.');
      return;
    }

    const headers = [
      'Reference',
      'Status',
      'Applicant Category',
      'Sponsoring Organisation',
      'Organisation Type',
      'Organisation Sector',
      'Organisation Address',
      'Organisation Email',
      'Organisation Phone',
      'Org Contact Person',
      'Org Contact Position',
      'Org Contact Email',
      'Org Contact Phone',
      'Nature of Support',
      'Sponsored Volunteers Count',
      'Corporate Message',
      'Special Requirements',
      'First Name',
      'Middle Name',
      'Last Name',
      'Preferred Name',
      'Email',
      'Phone',
      'Alt Phone',
      'Age Group',
      'Gender',
      'Country',
      'State',
      'City',
      'Address',
      'Occupation',
      'Personal Organisation',
      'Education Status',
      'Qualifications',
      'Skills',
      'Primary Department',
      'Secondary Department',
      'Availability',
      'Preferred Shift',
      'Motivation',
      'Past Experience',
      'Languages',
      'Emergency Contact Name',
      'Emergency Relationship',
      'Emergency Phone',
      'Date Submitted'
    ];

    const rows = volunteers.map(v => [
      `"${v.reference || ''}"`,
      `"${v.status || 'SUBMITTED'}"`,
      `"${v.applicantType || 'Individual Volunteer'}"`,
      `"${(v.sponsoringOrgName || '').replace(/"/g, '""')}"`,
      `"${(v.sponsoringOrgType || '').replace(/"/g, '""')}"`,
      `"${(v.sponsoringOrgSector || '').replace(/"/g, '""')}"`,
      `"${(v.sponsoringOrgAddress || '').replace(/"/g, '""')}"`,
      `"${(v.sponsoringOrgEmail || '').replace(/"/g, '""')}"`,
      `"${(v.sponsoringOrgPhone || '').replace(/"/g, '""')}"`,
      `"${(v.orgContactPersonName || '').replace(/"/g, '""')}"`,
      `"${(v.orgContactPersonPosition || '').replace(/"/g, '""')}"`,
      `"${(v.orgContactPersonEmail || '').replace(/"/g, '""')}"`,
      `"${(v.orgContactPersonPhone || '').replace(/"/g, '""')}"`,
      `"${(v.natureOfSupport || '').replace(/"/g, '""')}"`,
      `"${v.sponsoredVolunteersCount || ''}"`,
      `"${(v.corporateMessage || '').replace(/"/g, '""')}"`,
      `"${(v.specialRequirements || '').replace(/"/g, '""')}"`,
      `"${(v.firstName || '').replace(/"/g, '""')}"`,
      `"${(v.middleName || '').replace(/"/g, '""')}"`,
      `"${(v.lastName || '').replace(/"/g, '""')}"`,
      `"${(v.preferredName || '').replace(/"/g, '""')}"`,
      `"${(v.email || '').replace(/"/g, '""')}"`,
      `"${(v.phone || '').replace(/"/g, '""')}"`,
      `"${(v.altPhone || '').replace(/"/g, '""')}"`,
      `"${(v.dobOrAgeGroup || '').replace(/"/g, '""')}"`,
      `"${(v.gender || '').replace(/"/g, '""')}"`,
      `"${(v.country || '').replace(/"/g, '""')}"`,
      `"${(v.state || '').replace(/"/g, '""')}"`,
      `"${(v.city || '').replace(/"/g, '""')}"`,
      `"${(v.address || '').replace(/"/g, '""')}"`,
      `"${(v.occupation || '').replace(/"/g, '""')}"`,
      `"${(v.organisation || '').replace(/"/g, '""')}"`,
      `"${(v.educationStatus || '').replace(/"/g, '""')}"`,
      `"${(v.qualifications || '').replace(/"/g, '""')}"`,
      `"${(v.skills || '').replace(/"/g, '""')}"`,
      `"${(v.preferredDepartment || '').replace(/"/g, '""')}"`,
      `"${(v.secondaryDepartment || '').replace(/"/g, '""')}"`,
      `"${(v.availability || '').replace(/"/g, '""')}"`,
      `"${(v.preferredShift || '').replace(/"/g, '""')}"`,
      `"${(v.motivation || '').replace(/"/g, '""')}"`,
      `"${(v.experience || '').replace(/"/g, '""')}"`,
      `"${(v.languages || '').replace(/"/g, '""')}"`,
      `"${(v.emergencyContactName || '').replace(/"/g, '""')}"`,
      `"${(v.emergencyRelationship || '').replace(/"/g, '""')}"`,
      `"${(v.emergencyContactPhone || '').replace(/"/g, '""')}"`,
      `"${v.createdAt || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aviation_Safety_Summit_2026_Volunteers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
            SECRETARIAT INTAKE REGISTRY
          </span>
          <h2 className="text-xl font-serif font-black text-[#0A192F] uppercase">
            Public Volunteer Applications
          </h2>
          <p className="text-xs text-gray-500">
            Review public applicant submissions for summit workforce deployment.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchVolunteers}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-[#0A192F] hover:bg-[#1E293B] text-[#FFD700] text-xs font-bold font-mono uppercase rounded-lg border border-[#D4AF37]/50 flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Intake</span>
          <span className="text-2xl font-serif font-black text-[#0A192F]">{volunteers.length}</span>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Corporate / Nominated</span>
          <span className="text-2xl font-serif font-black text-[#D4AF37]">
            {volunteers.filter(v => v.applicantType && v.applicantType !== 'Individual Volunteer').length}
          </span>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Protocol & VIP</span>
          <span className="text-2xl font-serif font-black text-amber-700">
            {volunteers.filter(v => v.preferredDepartment?.includes('Protocol') || v.preferredDepartment?.includes('VIP')).length}
          </span>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Registration & Desk</span>
          <span className="text-2xl font-serif font-black text-blue-700">
            {volunteers.filter(v => v.preferredDepartment?.includes('Registration') || v.preferredDepartment?.includes('Guest')).length}
          </span>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Full Summit Avail</span>
          <span className="text-2xl font-serif font-black text-emerald-700">
            {volunteers.filter(v => v.availability?.includes('Full Summit')).length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by reference (ASS-VOL-...), applicant name, email, organisation, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>

        <select
          value={applicantTypeFilter}
          onChange={(e) => setApplicantTypeFilter(e.target.value)}
          className="text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
        >
          <option value="ALL">All Applicant Types</option>
          <option value="Individual Volunteer">Individual Volunteers</option>
          <option value="Corporate-Sponsored Volunteer">Corporate-Sponsored</option>
          <option value="Organisation-Nominated Volunteer">Organisation-Nominated</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
        >
          <option value="ALL">All Departments ({volunteers.length})</option>
          {departmentsList.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
        >
          <option value="ALL">All Availabilities</option>
          <option value="Full Summit (All Days)">Full Summit (All Days)</option>
          <option value="Summit Day Only (17 Nov)">Summit Day Only (17 Nov)</option>
          <option value="Pre-Summit & Summit Days">Pre-Summit & Summit Days</option>
          <option value="Specific Shifts Only">Specific Shifts Only</option>
        </select>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#D4AF37] mb-2" />
            <p className="text-xs">Loading volunteer intake registry...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Users className="h-8 w-8 mx-auto text-gray-300" />
            <p className="text-xs font-semibold text-gray-600">No Volunteer Applications Found</p>
            <p className="text-[11px]">Applications submitted via summit.domislink.com/volunteer will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A192F] text-white uppercase text-[10px] font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Applicant Name & Category</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">1st Choice Dept</th>
                  <th className="py-3 px-4">Occupation / Background</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredVolunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0A192F] whitespace-nowrap">
                      {vol.reference}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{vol.firstName} {vol.lastName}</div>
                      {vol.applicantType && vol.applicantType !== 'Individual Volunteer' ? (
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {vol.sponsoringOrgName || vol.applicantType}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-mono">Individual</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-gray-900">{vol.email}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{vol.phone}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#0A192F] border border-[#D4AF37]/30">
                        {vol.preferredDepartment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="font-medium truncate max-w-[150px]">{vol.occupation || 'N/A'}</div>
                      <div className="text-[10px] text-gray-400">{vol.educationStatus}</div>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-gray-600 whitespace-nowrap">
                      {vol.availability}
                    </td>
                    <td className="py-3 px-4 text-[10px] font-mono text-gray-400 whitespace-nowrap">
                      {new Date(vol.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedVolunteer(vol)}
                        className="px-2.5 py-1 bg-[#0A192F] hover:bg-[#1E293B] text-[#FFD700] rounded text-[10px] font-bold uppercase transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECT VOLUNTEER DETAIL MODAL */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#D4AF37] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold tracking-widest block">
                  APPLICANT DOSSIER // {selectedVolunteer.reference}
                </span>
                <h3 className="text-xl font-serif font-black text-[#0A192F] uppercase">
                  {selectedVolunteer.firstName} {selectedVolunteer.middleName || ''} {selectedVolunteer.lastName}
                </h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-200">
                  {selectedVolunteer.applicantType || 'Individual Volunteer'}
                </span>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sponsoring / Nominating Org Dossier */}
            {selectedVolunteer.sponsoringOrgName && (
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 text-xs space-y-2">
                <span className="text-[10px] font-mono text-amber-900 uppercase font-bold block">
                  Sponsoring / Nominating Corporate Details
                </span>
                <div className="grid grid-cols-2 gap-2 text-gray-800">
                  <p><strong className="text-[#0A192F]">Organisation:</strong> {selectedVolunteer.sponsoringOrgName}</p>
                  <p><strong className="text-[#0A192F]">Type:</strong> {selectedVolunteer.sponsoringOrgType || 'N/A'}</p>
                  <p><strong className="text-[#0A192F]">Sector:</strong> {selectedVolunteer.sponsoringOrgSector || 'N/A'}</p>
                  <p><strong className="text-[#0A192F]">Nature of Support:</strong> {selectedVolunteer.natureOfSupport || 'Sponsored Volunteer'}</p>
                  {selectedVolunteer.sponsoredVolunteersCount && (
                    <p><strong className="text-[#0A192F]">Total Deployed by Org:</strong> {selectedVolunteer.sponsoredVolunteersCount}</p>
                  )}
                  {selectedVolunteer.orgContactPersonName && (
                    <p><strong className="text-[#0A192F]">Liaison Officer:</strong> {selectedVolunteer.orgContactPersonName} ({selectedVolunteer.orgContactPersonPosition || 'Liaison'})</p>
                  )}
                  {selectedVolunteer.orgContactPersonEmail && (
                    <p><strong className="text-[#0A192F]">Liaison Email:</strong> {selectedVolunteer.orgContactPersonEmail}</p>
                  )}
                  {selectedVolunteer.orgContactPersonPhone && (
                    <p><strong className="text-[#0A192F]">Liaison Phone:</strong> {selectedVolunteer.orgContactPersonPhone}</p>
                  )}
                </div>
                {selectedVolunteer.corporateMessage && (
                  <div className="pt-2 border-t border-amber-200 text-gray-700 italic">
                    "{selectedVolunteer.corporateMessage}"
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Contact Coordinates</span>
                <p className="font-semibold text-gray-900">{selectedVolunteer.email}</p>
                <p className="font-mono text-gray-700">{selectedVolunteer.phone} {selectedVolunteer.altPhone ? `(Alt: ${selectedVolunteer.altPhone})` : ''}</p>
                <p className="text-gray-600 mt-1">{selectedVolunteer.address}, {selectedVolunteer.city}, {selectedVolunteer.state}, {selectedVolunteer.country}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Volunteer Preferences</span>
                <p className="font-bold text-[#0A192F]">1st: {selectedVolunteer.preferredDepartment}</p>
                {selectedVolunteer.secondaryDepartment && (
                  <p className="text-gray-700">2nd: {selectedVolunteer.secondaryDepartment}</p>
                )}
                <p className="text-gray-600">Availability: {selectedVolunteer.availability} ({selectedVolunteer.preferredShift || 'Flexible'})</p>
                <p className="text-gray-500 text-[11px]">Languages: {selectedVolunteer.languages || 'English'}</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Background & Education</span>
              <p><strong className="text-[#0A192F]">Occupation:</strong> {selectedVolunteer.occupation} {selectedVolunteer.organisation ? `at ${selectedVolunteer.organisation}` : ''}</p>
              <p><strong className="text-[#0A192F]">Category:</strong> {selectedVolunteer.educationStatus}</p>
              {selectedVolunteer.qualifications && <p><strong className="text-[#0A192F]">Qualifications:</strong> {selectedVolunteer.qualifications}</p>}
              <p><strong className="text-[#0A192F]">Skills:</strong> {selectedVolunteer.skills}</p>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-1">
              <span className="text-[10px] font-mono text-amber-800 uppercase font-bold block">Motivation Statement</span>
              <p className="text-gray-800 leading-relaxed italic">"{selectedVolunteer.motivation}"</p>
              {selectedVolunteer.experience && (
                <div className="pt-2 border-t border-amber-200/50 mt-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Prior Event / Aviation Experience</span>
                  <p className="text-gray-700">{selectedVolunteer.experience}</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-red-50/40 rounded-xl border border-red-200 text-xs space-y-1">
              <span className="text-[10px] font-mono text-red-700 uppercase font-bold block">Emergency Contact</span>
              <p className="font-semibold text-gray-900">{selectedVolunteer.emergencyContactName} ({selectedVolunteer.emergencyRelationship})</p>
              <p className="font-mono text-gray-800">{selectedVolunteer.emergencyContactPhone}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-[10px] font-mono text-gray-400">
              <span>Source: {selectedVolunteer.source}</span>
              <span>Logged: {new Date(selectedVolunteer.createdAt).toLocaleString()}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
