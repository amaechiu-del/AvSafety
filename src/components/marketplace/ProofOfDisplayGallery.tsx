/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Image as ImageIcon, CheckCircle2, MapPin, 
  Clock, Calendar, Search, Filter, Sparkles, ExternalLink 
} from 'lucide-react';
import { ProofOfDisplayRecord } from '../../types';

interface ProofOfDisplayGalleryProps {
  initialProofs?: ProofOfDisplayRecord[];
}

export default function ProofOfDisplayGallery({ initialProofs = [] }: ProofOfDisplayGalleryProps) {
  const [proofs, setProofs] = useState<ProofOfDisplayRecord[]>(initialProofs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const res = await fetch('/api/marketplace/proof-of-display?visibility=public');
      if (res.ok) {
        const data = await res.json();
        if (data.proofs) setProofs(data.proofs);
      }
    } catch (err) {
      console.error('Failed to load proofs of display:', err);
    }
  };

  const filtered = proofs.filter((p) => {
    const matchesSearch = 
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || p.mediaType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-900 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Proof of Display & Delivery Evidence</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auditable live photographic and digital records confirming exact execution of sponsor advertising inventory.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search company or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 pr-8 w-48"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Media Types</option>
            <option value="PHOTOGRAPH">Venue Photos</option>
            <option value="SCREENSHOT">Digital Portal</option>
            <option value="VIDEO_CLIP">Video Broadcast</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">No Proof of Display Records Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Records are uploaded by Domislink compliance officers during deployment and event execution.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proof) => (
            <div key={proof.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between">
              
              {/* Media Preview */}
              <div className="relative h-48 bg-slate-950 overflow-hidden group">
                <img
                  src={proof.mediaUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                  alt={proof.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-sm text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VERIFIED LIVE</span>
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm text-slate-300 text-[10px] font-mono rounded">
                    {proof.orderNumber}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">
                    {proof.companyName}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{proof.title}</h4>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{proof.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{proof.date} at {proof.time}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {proof.notes}
                </p>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Verified By:</span>
                  <span className="text-slate-300 font-medium">{proof.verifiedBy}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
