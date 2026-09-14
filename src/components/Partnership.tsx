/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Edit, Save, ShieldAlert, Sparkles, X, Check } from 'lucide-react';
import { Partner } from '../types';

interface PartnershipProps {
  partners: Partner[];
  onUpdatePartners: (updated: Partner[]) => void;
  isAdmin: boolean;
}

export default function Partnership({ partners, onUpdatePartners, isAdmin }: PartnershipProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  const handleStartEdit = (p: Partner) => {
    setEditingId(p.id);
    setEditPrice(p.editablePrice || '');
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = (partnerId: string) => {
    const updated = partners.map(p => {
      if (p.id === partnerId) {
        return { ...p, editablePrice: editPrice };
      }
      return p;
    });
    onUpdatePartners(updated);
    setEditingId(null);
  };

  return (
    <section id="partners" className="py-24 bg-white border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">SPONSORSHIP COALITION</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            BECOME A SUMMIT PARTNER
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            Position your organization as a major international anchor of global aviation safety standards. Join sovereign representatives and private carriers in Lagos.
          </p>
        </div>

        {/* PROMINENT DONOR / SPONSOR / ADVERTISER BANNER */}
        <div className="mb-14 rounded-2xl bg-gradient-to-r from-[#050B1A] via-[#0D1E38] to-[#132545] border-2 border-[#D4AF37] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#FFD700] text-[10px] font-mono font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Global Donor, Sponsor & Advertiser Portal</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wide">
                Partner with Aviation Safety Summit 2026
              </h3>
              <p className="text-sm text-[#8A99AD] max-w-2xl font-light">
                Unlock premier visibility across official summit publications, VIP delegate lounges, and international broadcast channels. Custom sponsorship and advertiser placement opportunities available.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <a
                href="#contact-secretariat"
                className="px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#050B1A] font-serif font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition-all text-center"
              >
                Inquire Sponsorship
              </a>
              <a
                href="mailto:INFO@DOMISLINK.COM?subject=Donor%20or%20Sponsor%20Inquiry%20-%20Aviation%20Safety%20Summit%202026"
                className="px-6 py-3.5 bg-[#0A192F] border border-[#D4AF37]/50 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl shadow hover:bg-[#132545] transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Email Secretariat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Partnership Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partners.map((partner) => {
            const isEditing = editingId === partner.id;

            return (
              <div 
                key={partner.id}
                className="bg-[#FCFBF7] border border-[#D4AF37]/20 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#D4AF37]/45 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Tier Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[9px] font-bold tracking-widest font-mono uppercase rounded ${
                      partner.tier === 'TITLE' 
                        ? 'bg-[#1E3A8A] text-white' 
                        : partner.tier === 'PLATINUM' 
                          ? 'bg-amber-500 text-[#0A192F]'
                          : partner.tier === 'GOLD' 
                            ? 'bg-[#0A192F] text-[#D4AF37]'
                            : 'bg-white border border-gray-200 text-gray-500'
                    }`}>
                      {partner.tier}
                    </span>
                    {isAdmin && !isEditing && (
                      <button
                        onClick={() => handleStartEdit(partner)}
                        className="p-1 text-gray-400 hover:text-[#D4AF37] border border-transparent hover:border-gray-150 rounded"
                        title="Edit Partnership Value"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Title & Name info */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase">Slot Placement:</h3>
                    <h4 className="text-sm font-serif font-extrabold text-[#0A192F] tracking-wide leading-snug">
                      {partner.name}
                    </h4>
                  </div>

                  <div className="h-px bg-gray-200"></div>

                  {/* Price Block */}
                  <div className="space-y-1.5 p-3.5 bg-white border border-gray-150 rounded-lg">
                    <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Pricing & Terms:</p>
                    {isEditing ? (
                      <div className="space-y-2 text-xs">
                        <input
                          type="text"
                          className="w-full text-xs p-1.5 border border-gray-300 rounded bg-white text-gray-800 font-semibold"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                        />
                        <div className="flex items-center justify-end space-x-1">
                          <button onClick={handleCancel} className="p-1 bg-gray-50 text-gray-500 rounded hover:bg-gray-100">
                            <X className="h-3 w-3" />
                          </button>
                          <button onClick={() => handleSave(partner.id)} className="p-1 bg-[#D4AF37] text-white rounded hover:bg-[#B89025]">
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-serif font-black text-[#0A192F] tracking-wider uppercase leading-none">
                        {partner.editablePrice || '[DISCLOSED ON INQUIRY]'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[8px] font-mono text-gray-400">
                  <span>PL_CODE // {partner.id.toUpperCase()}</span>
                  <span className="text-[#D4AF37] font-semibold">● ACTIVE SLOT</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Pricing notice (No invented sponsorship prices) */}
        <div className="p-4 bg-[#FCFBF7] border border-[#D4AF37]/20 rounded-xl max-w-2xl mx-auto flex items-start space-x-3.5">
          <ShieldAlert className="h-5 w-5 text-[#AA7C11] flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-gray-600 leading-relaxed font-light">
            <strong className="text-[#0A192F] font-bold uppercase block mb-0.5">Sponsorship Pricing Disclaimer</strong>
            In accordance with official summit requirements, pricing fields are maintained as pending negotiations. Official partners can use the secure portal link or contact the secretariat to formalize package tiers and custom rates.
          </div>
        </div>

      </div>
    </section>
  );
}
