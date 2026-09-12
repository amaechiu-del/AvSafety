/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QrCode, Copy, Download, ExternalLink, CheckCircle, Radio, BookOpen, Shield } from 'lucide-react';
import { INITIAL_SPEAKER_RECORDS, SpeakerKnowledgeRecord } from '../../data/speakerPublicationData';

interface QRConnectorProps {
  initialUrl?: string;
}

export default function QRConnector({ initialUrl }: QRConnectorProps) {
  const [records] = useState<SpeakerKnowledgeRecord[]>(INITIAL_SPEAKER_RECORDS);
  const [selectedId, setSelectedId] = useState<string>(records[0].id);
  const [targetType, setTargetType] = useState<'handbook' | 'podcast' | 'custom'>('handbook');
  const [customUrl, setCustomUrl] = useState<string>('https://ais-dev-agzgmoke2krir5r36mvn3l-791168170011.europe-west2.run.app/knowledge');
  const [copied, setCopied] = useState<boolean>(false);

  const currentRecord = records.find(r => r.id === selectedId) || records[0];

  const activeUrl = targetType === 'handbook' 
    ? `https://ais-dev-agzgmoke2krir5r36mvn3l-791168170011.europe-west2.run.app/bookstore/handbook-${currentRecord.id}`
    : targetType === 'podcast'
    ? `https://ais-dev-agzgmoke2krir5r36mvn3l-791168170011.europe-west2.run.app/podcast/ep-${currentRecord.podcastEpisodeNumber}`
    : customUrl;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="qr-connector" className="py-20 bg-[#071324] text-white relative overflow-hidden border-t border-[#D4AF37]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono uppercase">
              <QrCode className="h-3.5 w-3.5" />
              <span>DomisLink QR Connector & Physical-Digital Bridge</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight uppercase mt-2">
              Publication QR Code Generator
            </h2>
            <p className="text-xs sm:text-sm text-[#8A99AD] font-light mt-1">
              Connect physical handbook editions and podcast transcripts instantly to the DomisLink Digital Knowledge Hub.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="px-4 py-2.5 bg-[#0A192F] border border-[#D4AF37]/40 text-xs font-mono text-white rounded-xl focus:border-[#D4AF37] focus:outline-none"
            >
              {records.map(rec => (
                <option key={rec.id} value={rec.id}>
                  {rec.speakerName} ({rec.organisation})
                </option>
              ))}
            </select>
          </div>
        </div>

        {copied && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Target URL successfully copied to clipboard!</span>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Config Panel */}
          <div className="lg:col-span-7 bg-[#0A192F] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#D4AF37]">
              QR Destination & Payload Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#8A99AD] mb-2">Select Publication Type:</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTargetType('handbook')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono uppercase transition cursor-pointer flex items-center justify-center space-x-2 border ${
                      targetType === 'handbook' ? 'bg-[#D4AF37] text-[#0A192F] font-bold border-[#D4AF37]' : 'bg-[#071324] text-[#8A99AD] border-white/10 hover:text-white'
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Handbook</span>
                  </button>

                  <button
                    onClick={() => setTargetType('podcast')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono uppercase transition cursor-pointer flex items-center justify-center space-x-2 border ${
                      targetType === 'podcast' ? 'bg-[#D4AF37] text-[#0A192F] font-bold border-[#D4AF37]' : 'bg-[#071324] text-[#8A99AD] border-white/10 hover:text-white'
                    }`}
                  >
                    <Radio className="h-3.5 w-3.5" />
                    <span>Podcast</span>
                  </button>

                  <button
                    onClick={() => setTargetType('custom')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono uppercase transition cursor-pointer flex items-center justify-center space-x-2 border ${
                      targetType === 'custom' ? 'bg-[#D4AF37] text-[#0A192F] font-bold border-[#D4AF37]' : 'bg-[#071324] text-[#8A99AD] border-white/10 hover:text-white'
                    }`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Custom URL</span>
                  </button>
                </div>
              </div>

              {targetType === 'custom' ? (
                <div>
                  <label className="block text-xs font-mono text-[#8A99AD] mb-1">Custom Destination URL *</label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071324] border border-white/15 rounded-xl text-white font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              ) : (
                <div className="p-4 bg-[#071324] rounded-xl border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#8A99AD]">Speaker:</span>
                    <span className="text-white font-bold">{currentRecord.speakerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A99AD]">Organisation:</span>
                    <span className="text-white">{currentRecord.organisation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A99AD]">Asset Title:</span>
                    <span className="text-[#D4AF37] truncate max-w-[220px]">
                      {targetType === 'handbook' ? currentRecord.handbookTitle : `Ep #${currentRecord.podcastEpisodeNumber}: ${currentRecord.approvedTopic}`}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-[#8A99AD] mb-1">Active Target URL:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={activeUrl}
                    className="w-full px-3 py-2 bg-[#071324] border border-white/15 rounded-xl text-emerald-400 font-mono text-[11px]"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-xl hover:brightness-110 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right QR Display Box */}
          <div className="lg:col-span-5 bg-[#0A192F] border-2 border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl relative text-center">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono">
              High Resolution SVG
            </div>

            <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center border-4 border-[#071324]">
              {/* Simulated Precision QR Code Matrix SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Corner Finder Patterns */}
                <rect x="0" y="0" width="28" height="28" fill="#0A192F" rx="4" />
                <rect x="4" y="4" width="20" height="20" fill="white" rx="2" />
                <rect x="9" y="9" width="10" height="10" fill="#0A192F" rx="1" />

                <rect x="72" y="0" width="28" height="28" fill="#0A192F" rx="4" />
                <rect x="76" y="4" width="20" height="20" fill="white" rx="2" />
                <rect x="81" y="9" width="10" height="10" fill="#0A192F" rx="1" />

                <rect x="0" y="72" width="28" height="28" fill="#0A192F" rx="4" />
                <rect x="4" y="76" width="20" height="20" fill="white" rx="2" />
                <rect x="9" y="81" width="10" height="10" fill="#0A192F" rx="1" />

                {/* Data Matrix Dots Pattern Simulation */}
                <rect x="34" y="4" width="6" height="6" fill="#0A192F" />
                <rect x="44" y="4" width="6" height="6" fill="#0A192F" />
                <rect x="54" y="4" width="6" height="6" fill="#0A192F" />
                <rect x="64" y="10" width="6" height="6" fill="#0A192F" />
                <rect x="34" y="16" width="6" height="6" fill="#0A192F" />
                <rect x="54" y="16" width="6" height="6" fill="#0A192F" />

                <rect x="4" y="34" width="6" height="6" fill="#0A192F" />
                <rect x="14" y="34" width="6" height="6" fill="#0A192F" />
                <rect x="24" y="40" width="6" height="6" fill="#0A192F" />
                <rect x="34" y="34" width="6" height="6" fill="#0A192F" />
                <rect x="44" y="44" width="6" height="6" fill="#0A192F" />
                <rect x="54" y="34" width="6" height="6" fill="#0A192F" />
                <rect x="64" y="34" width="6" height="6" fill="#0A192F" />
                <rect x="74" y="40" width="6" height="6" fill="#0A192F" />
                <rect x="84" y="34" width="6" height="6" fill="#0A192F" />

                <rect x="4" y="54" width="6" height="6" fill="#0A192F" />
                <rect x="24" y="54" width="6" height="6" fill="#0A192F" />
                <rect x="34" y="64" width="6" height="6" fill="#0A192F" />
                <rect x="44" y="54" width="6" height="6" fill="#0A192F" />
                <rect x="54" y="64" width="6" height="6" fill="#0A192F" />
                <rect x="64" y="54" width="6" height="6" fill="#0A192F" />
                <rect x="74" y="64" width="6" height="6" fill="#0A192F" />
                <rect x="84" y="54" width="6" height="6" fill="#0A192F" />
                <rect x="94" y="54" width="6" height="6" fill="#0A192F" />

                <rect x="34" y="74" width="6" height="6" fill="#0A192F" />
                <rect x="44" y="84" width="6" height="6" fill="#0A192F" />
                <rect x="54" y="74" width="6" height="6" fill="#0A192F" />
                <rect x="64" y="84" width="6" height="6" fill="#0A192F" />
                <rect x="74" y="74" width="6" height="6" fill="#0A192F" />
                <rect x="84" y="84" width="6" height="6" fill="#0A192F" />
                <rect x="94" y="74" width="6" height="6" fill="#0A192F" />
                <rect x="84" y="94" width="6" height="6" fill="#0A192F" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-white font-bold block">{currentRecord.speakerName}</span>
              <span className="text-[11px] font-mono text-[#D4AF37] block">Scan to Access Digital Hub</span>
            </div>

            <button
              onClick={() => alert(`Downloading high-res QR SVG for ${currentRecord.speakerName} publication...`)}
              className="w-full py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <Download className="h-4 w-4" />
              <span>Download Print-Ready QR SVG</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
