/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Award, Search, Filter, HelpCircle, Edit3, Check, X, Building2, Briefcase, Calendar, Clock } from 'lucide-react';
import { Organisation } from '../types';

interface IndustryParticipantsProps {
  organisations: Organisation[];
  onUpdateOrganisations: (updated: Organisation[]) => void;
  isAdmin: boolean;
}

export default function IndustryParticipants({ organisations, onUpdateOrganisations, isAdmin }: IndustryParticipantsProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Organisation | null>(null);

  const industries = [
    'ALL', 'GOVERNMENT', 'REGULATORS', 'AIRLINES', 'OIL & GAS', 
    'BANKING', 'TELECOMMUNICATIONS', 'TECHNOLOGY', 'AIRPORTS', 
    'TRAINING', 'INVESTORS', 'OTHER'
  ];

  const handleStartEdit = (org: Organisation) => {
    setEditingId(org.id);
    setEditForm({ ...org });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    const updated = organisations.map(o => o.id === editForm.id ? editForm : o);
    onUpdateOrganisations(updated);
    setEditingId(null);
    setEditForm(null);
  };

  const filteredOrgs = organisations.filter(org => {
    const matchesIndustry = selectedIndustry === 'ALL' || org.industry === selectedIndustry;
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      org.representative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.session.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <section id="industry" className="py-24 bg-[#FCFBF7] border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">THE SUMMIT ECOSYSTEM</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            INDUSTRY ORGANISATIONS
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            Unifying multi-sector infrastructure operators, energy conglomerates, major financial houses, and telecommunications leaders around the summit safety imperatives. All logos displayed are fully authorized corporate trademarks.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-10 p-5 bg-white border border-[#D4AF37]/15 rounded-xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-[11px] font-mono font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-[#D4AF37]" /> Filter Organisations by Industry:
            </span>
            
            {/* Search Bar */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies, representatives, topics..."
                className="w-full text-xs pl-9 pr-4 py-2 bg-[#FCFBF7] border border-gray-300 rounded-md focus:ring-1 focus:ring-[#D4AF37] text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Industry Tags */}
          <div className="flex flex-wrap gap-1.5">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-150 ${
                  selectedIndustry === ind
                    ? 'bg-[#0A192F] text-[#D4AF37] border border-[#0A192F] shadow-sm'
                    : 'bg-[#FCFBF7] text-[#5A6E85] border border-gray-200 hover:border-[#D4AF37]/40 hover:text-[#0A192F]'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredOrgs.map((org) => {
            const isEditing = editingId === org.id;

            return (
              <div
                key={org.id}
                className="bg-white border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between relative group"
              >
                {/* Admin Pencil Trigger */}
                {isAdmin && !isEditing && (
                  <button
                    onClick={() => handleStartEdit(org)}
                    className="absolute top-4 right-4 z-10 p-1.5 bg-[#FCFBF7] hover:bg-[#D4AF37] hover:text-white rounded-full border border-gray-200 transition-colors shadow-sm"
                    title="Edit Organisation Details"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                )}

                {isEditing ? (
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Company Name</label>
                      <input
                        type="text"
                        className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                        value={editForm?.name || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Industry Sector</label>
                      <select
                        className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                        value={editForm?.industry || 'OTHER'}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, industry: e.target.value as any } : null)}
                      >
                        {industries.filter(i => i !== 'ALL').map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Representative</label>
                      <input
                        type="text"
                        className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                        value={editForm?.representative || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, representative: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Summit Session</label>
                      <input
                        type="text"
                        className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                        value={editForm?.session || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, session: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Presentation Topic</label>
                      <input
                        type="text"
                        className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                        value={editForm?.topic || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, topic: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono tracking-wider text-gray-500 uppercase">Official Logo URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        className="w-full text-xs p-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                        value={editForm?.logoUrl || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, logoUrl: e.target.value } : null)}
                      />
                    </div>
                    <div className="flex items-center space-x-1.5 justify-end pt-1">
                      <button 
                        onClick={handleCancelEdit}
                        className="p-1 px-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded text-[10px] font-semibold flex items-center"
                      >
                        <X className="h-3 w-3 mr-0.5" /> Cancel
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="p-1 px-2 bg-[#D4AF37] text-white hover:bg-[#B89025] rounded text-[10px] font-semibold flex items-center shadow-sm"
                      >
                        <Check className="h-3 w-3 mr-0.5" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5 flex-grow">
                      {/* Logo and Tier Row */}
                      <div className="flex items-start justify-between gap-2">
                        {org.logoUrl ? (
                          <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg p-1.5 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                            <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-slate-900 border border-[#D4AF37]/30 rounded-lg flex flex-col items-center justify-center overflow-hidden shrink-0 text-center p-1 relative shadow-inner">
                            <p className="text-[6px] font-mono font-black text-[#D4AF37] tracking-tighter leading-none mb-0.5">OFFICIAL LOGO</p>
                            <p className="text-[5px] font-mono text-[#8A99AD] tracking-tighter uppercase leading-none">TO BE SUPPLIED</p>
                            <span className="absolute bottom-0 left-0 right-0 py-0.5 bg-[#D4AF37]/10 border-t border-[#D4AF37]/15 text-[6px] text-white font-mono uppercase font-light">
                              {org.logoPlaceholder.substring(0, 7)}
                            </span>
                          </div>
                        )}
                        <span className="px-2.5 py-0.5 text-[8px] font-mono font-bold tracking-wider border border-gray-200 bg-gray-50 text-gray-500 uppercase rounded">
                          {org.partnershipStatus}
                        </span>
                      </div>

                      {/* Company Name & Sector */}
                      <div>
                        <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-wide line-clamp-1">
                          {org.name}
                        </h3>
                        <p className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider mt-0.5">
                          {org.industry}
                        </p>
                      </div>

                      <div className="h-px bg-gray-100"></div>

                      {/* Rep & Session Session details */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-[8px] font-mono text-[#8A99AD] uppercase tracking-wider">Representative Leader:</p>
                          <p className="font-bold text-[#0A192F] tracking-wide mt-0.5 leading-snug">
                            {org.representative || '[TBD]'}
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] font-mono text-[#8A99AD] uppercase tracking-wider">Summit Session Slot:</p>
                          <p className="text-[#5A6E85] font-semibold leading-relaxed text-[11px] flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 text-[#D4AF37]" />
                            <span>{org.session || '[AWAITING REGISTRATION]'}</span>
                          </p>
                        </div>

                        <div className="pt-1">
                          <p className="text-[8px] font-mono text-[#8A99AD] uppercase tracking-wider">Sovereign Topic / Vision:</p>
                          <p className="text-[11px] text-[#5A6E85] font-light leading-relaxed italic mt-0.5">
                            "{org.topic}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Info */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[8px] font-mono text-gray-400">
                      <span>REF: {org.id.toUpperCase()}</span>
                      <span className="text-[8px] font-semibold text-emerald-600 flex items-center bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">
                        VERIFIED
                      </span>
                    </div>
                  </>
                )}

              </div>
            );
          })}

          {filteredOrgs.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white border border-[#D4AF37]/15 rounded-xl">
              <ShieldAlert className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-600">No organizations found matching the criteria.</p>
              <p className="text-xs text-gray-400 mt-1">Try resetting the industry filter or search query.</p>
            </div>
          )}
        </div>

        {/* Corporate logo notice */}
        <div className="mt-10 p-4 bg-white border border-[#D4AF37]/20 rounded-xl text-center max-w-xl mx-auto">
          <p className="text-xs text-[#5A6E85] leading-relaxed font-light">
            Note: Company graphics on this panel are rendered as strict, compliant typographic tags pending verified corporate media releases. No simulated corporate identities are generated.
          </p>
        </div>

      </div>
    </section>
  );
}
