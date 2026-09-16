/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Share2, X, Crown, HeartHandshake, Building2, 
  QrCode, Users, ShieldCheck, Sparkles 
} from 'lucide-react';
import DomisLinkSocialShare from './DomisLinkSocialShare';
import { ShareTargetType } from '../../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: ShareTargetType;
  targetType?: ShareTargetType;
  referralToken?: string | null;
}

export default function SocialShareModal({
  isOpen,
  onClose,
  initialTarget = 'SUMMIT',
  targetType,
  referralToken
}: SocialShareModalProps) {
  const [activeTab, setActiveTab] = useState<ShareTargetType>(targetType || initialTarget);
  const [userReferral, setUserReferral] = useState<string | null>(referralToken || null);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B1A]/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-modal-title"
    >
      <div className="bg-[#0A192F] border-2 border-[#D4AF37] rounded-3xl max-w-2xl w-full shadow-[0_25px_70px_rgba(0,0,0,0.8)] text-white overflow-hidden flex flex-col relative max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#050D1A] p-5 sm:p-6 border-b border-[#D4AF37]/30 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-xl text-[#FFD700]">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                DOMISLINK SOCIAL MEDIA SHARING HUB
              </p>
              <h2 id="social-modal-title" className="text-lg sm:text-xl font-serif font-extrabold text-white uppercase tracking-tight">
                Share Aviation Safety
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#071324] px-4 sm:px-6 py-2.5 border-b border-white/10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('SUMMIT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
              activeTab === 'SUMMIT'
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <Crown className="h-3.5 w-3.5" />
            <span>Summit Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('VOLUNTEER')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
              activeTab === 'VOLUNTEER'
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Volunteer Opportunity</span>
          </button>

          <button
            onClick={() => setActiveTab('ORGANISATION')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
              activeTab === 'ORGANISATION'
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Corporate / Sponsor</span>
          </button>
        </div>

        {/* Share Component Container */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <DomisLinkSocialShare
            targetType={activeTab}
            referralToken={userReferral}
            onGenerateReferral={(token) => setUserReferral(token)}
            showReferralGenerator={activeTab === 'VOLUNTEER'}
            className="border-none bg-transparent p-0 shadow-none"
          />
        </div>

      </div>
    </div>
  );
}
