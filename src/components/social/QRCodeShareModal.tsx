/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, X, Download, Printer, Copy, Check, 
  Sparkles, ExternalLink, ShieldCheck, Crown 
} from 'lucide-react';
import { ShareTargetType } from '../../types';
import { 
  CANONICAL_SUMMIT_URL, 
  CANONICAL_VOLUNTEER_URL, 
  trackShareEvent 
} from '../../utils/socialShare';

interface QRCodeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType?: ShareTargetType;
  customUrl?: string;
  title?: string;
  subtitle?: string;
}

export default function QRCodeShareModal({
  isOpen,
  onClose,
  targetType = 'SUMMIT',
  customUrl,
  title,
  subtitle
}: QRCodeShareModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const resolvedUrl = customUrl || (targetType === 'VOLUNTEER' || targetType === 'ORGANISATION' ? CANONICAL_VOLUNTEER_URL : CANONICAL_SUMMIT_URL);
  const displayTitle = title || (targetType === 'VOLUNTEER' ? 'Volunteer Recruitment QR Code' : targetType === 'ORGANISATION' ? 'Corporate Support QR Code' : 'Summit Public Access QR Code');
  const displaySubtitle = subtitle || (targetType === 'VOLUNTEER' ? 'Scan to apply for on-site (Lagos) or remote (worldwide) volunteer roles.' : 'Scan with any smartphone camera to visit the official Summit portal.');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      trackShareEvent({
        eventType: 'COPY_LINK',
        channel: 'copy',
        targetUrl: resolvedUrl
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `DomisLink-Summit-${targetType}-QR.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);

    trackShareEvent({
      eventType: 'QR_DISPLAY',
      channel: 'qr',
      targetUrl: resolvedUrl
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B1A]/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="bg-[#0A192F] border-2 border-[#D4AF37] rounded-2xl max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-white overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="bg-[#050D1A] p-5 border-b border-[#D4AF37]/30 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-lg text-[#FFD700]">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                OFFICIAL DOMISLINK QR
              </p>
              <h3 id="qr-modal-title" className="text-base font-serif font-bold text-white uppercase tracking-tight">
                {displayTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close QR modal"
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content & QR Canvas */}
        <div className="p-6 space-y-5 text-center flex flex-col items-center">
          <p className="text-xs text-[#8A99AD] max-w-xs leading-relaxed">
            {displaySubtitle}
          </p>

          {/* Printable Card Area */}
          <div 
            ref={qrRef}
            className="p-5 bg-white rounded-xl shadow-inner border-2 border-[#D4AF37]/50 flex flex-col items-center space-y-3 print:border-none print:shadow-none"
          >
            <div className="flex items-center space-x-1.5 text-[#0A192F] font-serif font-bold text-[11px] uppercase tracking-wider">
              <Crown className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>DOMISLINK SUMMIT 2026</span>
            </div>

            <div className="p-2 bg-white rounded-lg">
              <QRCodeSVG
                value={resolvedUrl}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#0A192F"
                level="Q"
                includeMargin={false}
              />
            </div>

            <div className="text-[10px] font-mono text-gray-700 max-w-[210px] break-all">
              {resolvedUrl}
            </div>

            <p className="text-[9px] font-sans text-gray-500 italic">
              "Everybody is involved in aviation safety"
            </p>
          </div>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-3 gap-2 text-xs font-medium">
            <button
              onClick={handleCopy}
              className={`py-2 px-3 rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                copied 
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10 text-white'
              }`}
              aria-label="Copy canonical link"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-[#D4AF37]" />}
              <span className="text-[11px]">{copied ? 'Copied' : 'Copy URL'}</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="py-2 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center space-x-1.5 transition-all"
              aria-label="Download QR as SVG vector image"
            >
              <Download className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[11px]">Save Vector</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center space-x-1.5 transition-all"
              aria-label="Print high contrast QR card"
            >
              <Printer className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[11px]">Print</span>
            </button>
          </div>

          {/* Privacy & Safe architecture assurance */}
          <div className="pt-3 border-t border-white/10 w-full flex items-center justify-center space-x-2 text-[10px] text-gray-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Public Canonical Link • Zero Private Data Embedded</span>
          </div>

        </div>

      </div>
    </div>
  );
}
