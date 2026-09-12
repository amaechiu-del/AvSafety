/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle, Shield, User, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { INITIAL_SPEAKER_RECORDS, SpeakerKnowledgeRecord } from '../../data/speakerPublicationData';

export default function SpeakerApprovalDashboard() {
  const [records, setRecords] = useState<SpeakerKnowledgeRecord[]>(INITIAL_SPEAKER_RECORDS);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleApproval = (recordId: string, field: keyof SpeakerKnowledgeRecord['approvalStatus']) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          approvalStatus: {
            ...rec.approvalStatus,
            [field]: !rec.approvalStatus[field]
          }
        };
      }
      return rec;
    }));
    setSuccessMsg(`Successfully updated approval gate for ${field}.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const approvalFields: { key: keyof SpeakerKnowledgeRecord['approvalStatus']; label: string }[] = [
    { key: 'photo', label: 'PHOTO' },
    { key: 'bio', label: 'BIO' },
    { key: 'topic', label: 'TOPIC' },
    { key: 'transcript', label: 'TRANSCRIPT' },
    { key: 'handbook', label: 'HANDBOOK' },
    { key: 'podcast', label: 'PODCAST' },
    { key: 'cover', label: 'COVER' },
    { key: 'publication', label: 'PUBLICATION' }
  ];

  return (
    <section id="speaker-approval-dashboard" className="py-20 bg-[#071324] text-white relative overflow-hidden border-t border-[#D4AF37]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono uppercase">
              <Shield className="h-3.5 w-3.5" />
              <span>DomisLink Quality Control & Speaker Approval Dashboard (Section 28)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight uppercase mt-2">
              Speaker Approval Control Center
            </h2>
            <p className="text-xs sm:text-sm text-[#8A99AD] font-light mt-1">
              No speaker publication becomes public until required approvals across photo, bio, topic, transcript, handbook, and podcast are fully complete.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono rounded-xl">
              Total Speakers: {records.length}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-white/60 hover:text-white">✕</button>
          </div>
        )}

        {/* Speakers Approval Cards Grid */}
        <div className="space-y-8">
          {records.map(rec => {
            const allApproved = Object.values(rec.approvalStatus).every(Boolean);

            return (
              <div 
                key={rec.id}
                className="bg-[#0A192F] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={rec.photographUrl} alt={rec.speakerName} className="w-16 h-16 rounded-xl object-cover border-2 border-[#D4AF37]/50 shadow-md" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono">{rec.category}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono ${allApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {allApproved ? 'READY FOR PUBLIC RELEASE' : 'PENDING APPROVALS'}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">{rec.speakerName}</h3>
                      <p className="text-xs text-[#8A99AD] font-mono">{rec.position} • <span className="text-white">{rec.organisation}</span></p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-[#8A99AD]">
                    <span>Topic: <strong className="text-white">{rec.approvedTopic}</strong></span>
                  </div>
                </div>

                {/* Checklist Grid as per Section 28 */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-3">
                    Section 28 Quality Checklist Gates
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {approvalFields.map(field => {
                      const isApproved = rec.approvalStatus[field.key];

                      return (
                        <div
                          key={field.key}
                          onClick={() => handleToggleApproval(rec.id, field.key)}
                          className={`p-3.5 rounded-xl border text-center cursor-pointer transition flex flex-col items-center justify-between space-y-2 ${
                            isApproved 
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-md' 
                              : 'bg-[#071324] border-white/10 text-[#8A99AD] hover:border-[#D4AF37]/40'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold tracking-wide">{field.label}</span>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner ${
                            isApproved ? 'bg-emerald-500 text-[#0A192F]' : 'bg-white/10 text-neutral-400'
                          }`}>
                            {isApproved ? '✓' : '□'}
                          </div>
                          <span className={`text-[9px] font-mono uppercase ${isApproved ? 'text-emerald-400 font-bold' : 'text-neutral-500'}`}>
                            {isApproved ? 'APPROVED' : '[ ] PENDING'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
