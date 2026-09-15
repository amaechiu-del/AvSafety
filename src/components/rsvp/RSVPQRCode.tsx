/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Crown, Copy, Check, Download, ExternalLink } from 'lucide-react';

interface RSVPQRCodeProps {
  reference?: string;
  invitationRef?: string;
  size?: number;
  showTitle?: boolean;
  showLinkAction?: boolean;
  showDownload?: boolean;
  darkTheme?: boolean;
  className?: string;
}

export default function RSVPQRCode({
  reference,
  invitationRef,
  size = 180,
  showTitle = true,
  showLinkAction = true,
  showDownload = true,
  darkTheme = true,
  className = ''
}: RSVPQRCodeProps) {
  const [copied, setCopied] = useState(false);

  // Construct URL
  const baseUrl = 'https://summit.domislink.com/rsvp';
  const effectiveRef = invitationRef || reference;
  const targetUrl = effectiveRef 
    ? `${baseUrl}?ref=${encodeURIComponent(effectiveRef)}` 
    : baseUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById(`rsvp-qr-${reference || 'main'}`);
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DomisLink-Summit-2026-RSVP-QR${reference ? `-${reference}` : ''}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all ${
        darkTheme 
          ? 'bg-[#0A192F] border-2 border-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.15)] text-white' 
          : 'bg-white border-2 border-[#D4AF37]/40 shadow-lg text-[#0A192F]'
      } ${className}`}
    >
      {showTitle && (
        <div className="mb-3 space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">
            <Crown className="h-3 w-3" />
            <span>Official Summit RSVP</span>
          </div>
          <p className="text-xs font-serif font-bold tracking-tight">
            SCAN TO CONFIRM ATTENDANCE
          </p>
        </div>
      )}

      {/* QR Code Graphic Box with Gold Corner Targets */}
      <div className="relative p-3.5 bg-white rounded-xl shadow-inner border border-[#D4AF37]/30 my-1">
        {/* Subtle decorative target corners */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37]" />

        <QRCodeSVG
          id={`rsvp-qr-${reference || 'main'}`}
          value={targetUrl}
          size={size}
          level="H"
          includeMargin={false}
          bgColor="#FFFFFF"
          fgColor="#050B1A"
          imageSettings={{
            src: '/icon.svg',
            x: undefined,
            y: undefined,
            height: Math.floor(size * 0.22),
            width: Math.floor(size * 0.22),
            excavate: true,
          }}
        />
      </div>

      {reference && (
        <div className="mt-2.5 px-2.5 py-1 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] font-bold">
          REF: {reference}
        </div>
      )}

      <p className="mt-2 text-[10px] font-mono text-[#8A99AD] break-all max-w-[220px]">
        {targetUrl}
      </p>

      {/* Actions */}
      {(showLinkAction || showDownload) && (
        <div className="mt-3.5 flex items-center justify-center gap-2 flex-wrap">
          {showLinkAction && (
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold flex items-center space-x-1.5 transition-all ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : darkTheme 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy RSVP URL'}</span>
            </button>
          )}

          {showDownload && (
            <button
              onClick={handleDownloadSVG}
              className="px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 text-[#D4AF37] hover:text-[#FFD700] rounded-lg text-[11px] font-mono font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Save QR</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
