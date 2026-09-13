/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Shield, CheckCircle, FileText, Download, Sparkles, User, Building2, ExternalLink } from 'lucide-react';
import { INITIAL_SPEAKER_RECORDS, SpeakerKnowledgeRecord } from '../../data/speakerPublicationData';

export default function HandbookGenerator() {
  const [records, setRecords] = useState<SpeakerKnowledgeRecord[]>(INITIAL_SPEAKER_RECORDS);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0].id);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number>(1);

  const currentRecord = records.find(r => r.id === selectedRecordId) || records[0];

  const handbookSections = [
    { num: 1, title: 'COVER & TITLE PAGE', content: `${currentRecord.handbookTitle}\nSubtitle: Professional Insights from the DomisLink Aviation Safety Summit 2026\nAuthor: ${currentRecord.speakerName}` },
    { num: 2, title: 'COPYRIGHT & PUBLISHER', content: `Published by DomisLink Publishing International\nISBN: ${currentRecord.isbn || '978-978-987-001-1 (Assigned)'}\nAll rights reserved. Reproduction in any form without written permission is prohibited.` },
    { num: 3, title: 'ABOUT THE SPEAKER & ORGANISATION', content: `${currentRecord.speakerName} serves as ${currentRecord.position} at ${currentRecord.organisation}.\nOfficial verified photograph and organizational logo attached to publication record.` },
    { num: 4, title: 'INTRODUCTION & CENTRAL MESSAGE', content: `Based on the approved summit session "${currentRecord.session}":\n\n${currentRecord.editedTranscript}` },
    { num: 5, title: 'MAIN CONTENT & PRACTICAL LESSONS', content: `Core aviation safety principles articulated by ${currentRecord.speakerName}:\n- Rigorous adherence to standard operating procedures (SOPs).\n- Fostering a non-punitive reporting culture across all airline departments.\n- Continuous crew resource management and human factor training.` },
    { num: 6, title: 'CASE STUDIES & KEY SAFETY LESSONS', content: `Real-world operational case studies examined during the summit plenary sessions.\nKey Safety Lesson: Proactive incident reporting prevents catastrophic accidents.` },
    { num: 7, title: 'RECOMMENDATIONS & ACTION POINTS', content: `1. Implement mandatory safety audits across regional air carriers.\n2. Strengthen inter-agency cooperation between civil aviation authorities and investigation bureaus.\n3. Empower frontline personnel to report fatigue and equipment anomalies immediately.` },
    { num: 8, title: 'CHECKLIST & KEY QUESTIONS', content: `- Are all pre-flight safety checks fully completed?\n- Is the airline board actively reviewing safety metrics monthly?\n- Are communication channels between pilots and air traffic controllers unhindered?` },
    { num: 9, title: 'CONCLUSION & ABOUT DOMISLINK', content: `Conclusion: Safety in civil aviation is a shared regulatory burden connecting every stakeholder.\n\nAbout DomisLink: Building permanent aviation safety knowledge libraries across Africa and beyond.` }
  ];

  const handleGenerateHandbook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/publishing/ai-generate-handbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speakerName: currentRecord.speakerName,
          organisation: currentRecord.organisation,
          topic: currentRecord.approvedTopic,
          transcript: currentRecord.editedTranscript,
          preferredTitle: currentRecord.handbookTitle
        })
      });

      const data = await res.json();
      if (data?.success && data?.handbook) {
        setSuccessMsg(`Successfully generated complete tangible handbook draft for "${currentRecord.speakerName}".`);
      } else {
        setSuccessMsg('Handbook generation service returned an incomplete response.');
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (error) {
      console.error('Handbook generation failed:', error);
      setSuccessMsg('Unable to generate handbook right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="handbook-generator" className="py-20 bg-[#0A192F] text-white relative overflow-hidden border-t border-[#D4AF37]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono uppercase">
              <BookOpen className="h-3.5 w-3.5" />
              <span>DomisLink Handbook Generator (Section 5)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight uppercase mt-2">
              Generate Tangible Handbook
            </h2>
            <p className="text-xs sm:text-sm text-[#8A99AD] font-light mt-1">
              Using approved material only to produce structured book layouts adhering to DomisLink publishing standards.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedRecordId}
              onChange={e => setSelectedRecordId(e.target.value)}
              className="px-4 py-2.5 bg-[#071324] border border-[#D4AF37]/40 text-xs font-mono text-white rounded-xl focus:border-[#D4AF37] focus:outline-none"
            >
              {records.map(rec => (
                <option key={rec.id} value={rec.id}>
                  {rec.speakerName} ({rec.organisation})
                </option>
              ))}
            </select>
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

        {/* Generator Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Speaker & Structure Overview */}
          <div className="space-y-6">
            <div className="bg-[#071324] border border-white/15 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <img src={currentRecord.photographUrl} alt={currentRecord.speakerName} className="w-16 h-16 rounded-xl object-cover border-2 border-[#D4AF37]/50 shadow-md" />
                <div>
                  <h3 className="font-serif font-bold text-white text-base">{currentRecord.speakerName}</h3>
                  <p className="text-xs text-[#D4AF37] font-mono mt-0.5">{currentRecord.organisation}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono pt-3 border-t border-white/10">
                <div className="flex justify-between">
                  <span className="text-[#8A99AD]">Handbook Title:</span>
                  <span className="text-white font-bold text-right truncate max-w-[180px]">{currentRecord.handbookTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A99AD]">ISBN:</span>
                  <span className="text-[#D4AF37]">{currentRecord.isbn || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A99AD]">Page Count:</span>
                  <span className="text-white">{currentRecord.pageCount} Pages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A99AD]">Soft Copy Price:</span>
                  <span className="text-[#D4AF37]">₦{currentRecord.softCopyPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleGenerateHandbook}
                disabled={isGenerating}
                className="w-full py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shadow-lg"
              >
                {isGenerating ? <Sparkles className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
                <span>{isGenerating ? 'Generating Handbook...' : 'Generate Tangible Handbook Record'}</span>
              </button>
            </div>

            {/* Section Navigator */}
            <div className="bg-[#071324] border border-white/15 rounded-2xl p-6 space-y-3 shadow-xl">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Handbook Structure (Section 5)</h4>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
                {handbookSections.map(sec => (
                  <button
                    key={sec.num}
                    onClick={() => setActiveSection(sec.num)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition cursor-pointer flex items-center justify-between ${
                      activeSection === sec.num ? 'bg-[#D4AF37] text-[#0A192F] font-bold shadow' : 'bg-[#0A192F] text-[#8A99AD] hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{sec.num}. {sec.title}</span>
                    <span>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Book Layout Preview */}
          <div className="lg:col-span-2">
            <div className="bg-[#071324] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Handbook Preview & Layout (Section 5)</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">Approved Material Only</span>
              </div>

              {/* Active Section Preview Box */}
              <div className="bg-[#0A192F] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD] border-b border-white/10 pb-3">
                  <span>Section {activeSection} of 9</span>
                  <span className="text-[#D4AF37] font-bold">{handbookSections[activeSection - 1].title}</span>
                </div>

                <div className="space-y-4 py-4">
                  <h3 className="text-xl font-serif font-bold text-white">{handbookSections[activeSection - 1].title}</h3>
                  <div className="p-6 bg-[#071324] border border-white/10 rounded-xl font-serif text-sm text-neutral-200 whitespace-pre-line leading-relaxed">
                    {handbookSections[activeSection - 1].content}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => setActiveSection(prev => Math.max(1, prev - 1))}
                    disabled={activeSection === 1}
                    className="px-4 py-2 bg-[#071324] border border-white/15 text-xs font-mono rounded-xl text-white hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                  >
                    ← Previous Section
                  </button>
                  <span className="text-xs font-mono text-[#8A99AD] self-center">Page {activeSection * 16} of {currentRecord.pageCount}</span>
                  <button
                    onClick={() => setActiveSection(prev => Math.min(9, prev + 1))}
                    disabled={activeSection === 9}
                    className="px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs font-mono rounded-xl hover:brightness-110 disabled:opacity-40 cursor-pointer"
                  >
                    Next Section →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
