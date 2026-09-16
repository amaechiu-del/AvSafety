/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Award, CheckCircle, AlertCircle, 
  X, Printer, ExternalLink, Crown, Calendar, User, Building 
} from 'lucide-react';
import { PublicVerifiedCertificate } from '../../types';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export default function CertificateVerificationModal({
  isOpen,
  onClose,
  initialCode = ''
}: CertificateVerificationModalProps) {
  const [queryCode, setQueryCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicVerifiedCertificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryCode.trim()) {
      setError('Please enter a certificate number or verification token.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const cleanCode = encodeURIComponent(queryCode.trim());
      const res = await fetch(`/api/certificates/verify/${cleanCode}`);
      const data = await res.json();

      if (res.ok && data.success && data.certificate) {
        setResult(data.certificate);
      } else {
        setError(data.error || 'No matching certificate record found. Please verify the certificate number.');
      }
    } catch (err) {
      console.error('Verification query failed:', err);
      setError('Failed to reach the verification directory. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B1A]/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-verify-title"
    >
      <div className="bg-[#0A192F] border-2 border-[#D4AF37] rounded-2xl max-w-lg w-full shadow-2xl text-white overflow-hidden flex flex-col relative max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#050D1A] p-5 border-b border-[#D4AF37]/30 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-lg text-[#FFD700]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                PUBLIC VERIFICATION PORTAL
              </p>
              <h3 id="cert-verify-title" className="text-base font-serif font-bold text-white uppercase tracking-tight">
                Certificate Authenticity Verification
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          <p className="text-xs text-[#8A99AD] leading-relaxed">
            Verify official volunteer service credentials issued by the DomisLink Aviation Safety Summit 2026 Secretariat. Enter the certificate number (e.g. <code>ASS-CERT-2026-00001</code>) or the secure token.
          </p>

          {/* Search Form */}
          <form onSubmit={handleVerify} className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value)}
                placeholder="e.g. ASS-CERT-2026-00001 or DOMIS-CERT-..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-mono uppercase"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center space-x-1.5 shrink-0"
              >
                {loading ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Verify</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-start space-x-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Verification Result Card */}
          {result && (
            <div className="bg-[#050D1A] border-2 border-[#D4AF37]/50 rounded-xl p-5 space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Official Certificate Verified
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  result.status === 'ISSUED' 
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {result.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-mono text-[11px]">Certificate Number:</span>
                  <span className="font-mono text-[#FFD700] font-bold">{result.certificateNumber}</span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-mono text-[11px]">Recipient Name:</span>
                  <span className="text-white font-bold">{result.recipientName}</span>
                </div>

                {result.isOrganisationCertificate && result.organisationName && (
                  <div className="flex justify-between items-start border-b border-white/5 pb-2">
                    <span className="text-gray-400 font-mono text-[11px]">Organisation:</span>
                    <span className="text-white font-semibold">{result.organisationName}</span>
                  </div>
                )}

                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-mono text-[11px]">Certificate Type:</span>
                  <span className="text-white">{result.certificateType}</span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-mono text-[11px]">Summit Year:</span>
                  <span className="text-white font-mono">{result.summitYear}</span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-mono text-[11px]">Date Issued:</span>
                  <span className="text-white font-mono">{result.issueDate}</span>
                </div>

                <div className="flex justify-between items-start pt-1">
                  <span className="text-gray-400 font-mono text-[11px]">Authorised Signatory:</span>
                  <span className="text-right text-gray-300 font-light text-[11px]">
                    {result.signatoryName}<br />
                    <span className="text-[10px] text-gray-400">{result.signatoryTitle}, {result.signatoryOrg}</span>
                  </span>
                </div>
              </div>

              {/* Strict Privacy Notice */}
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-[10px] text-gray-400 font-mono space-y-1">
                <p className="text-[#D4AF37] font-bold uppercase">Safe Verification Standard:</p>
                <p>
                  In accordance with DomisLink Data Protection Standards, internal performance evaluations, supervisory grades, corrective reports, and private comments remain strictly confidential within the Secretariat.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#050D1A] p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono uppercase transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
