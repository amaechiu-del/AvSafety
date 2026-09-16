/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Share2, Copy, Check, QrCode, Mail, 
  Send, ExternalLink, Sparkles, HeartHandshake,
  Users, Building2, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { SocialShareChannel, ShareTargetType } from '../../types';
import { 
  buildShareUrl, 
  getShareContent, 
  trackShareEvent, 
  generateVolunteerReferralToken,
  CANONICAL_SUMMIT_URL,
  CANONICAL_VOLUNTEER_URL
} from '../../utils/socialShare';
import QRCodeShareModal from './QRCodeShareModal';

interface DomisLinkSocialShareProps {
  targetType?: ShareTargetType;
  referralToken?: string | null;
  onGenerateReferral?: (token: string) => void;
  variant?: 'card' | 'bar' | 'compact' | 'volunteer' | 'organisation';
  customTitle?: string;
  customSubtitle?: string;
  showReferralGenerator?: boolean;
  className?: string;
}

export default function DomisLinkSocialShare({
  targetType = 'SUMMIT',
  referralToken,
  onGenerateReferral,
  variant = 'card',
  customTitle,
  customSubtitle,
  showReferralGenerator = false,
  className = ''
}: DomisLinkSocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [activeReferral, setActiveReferral] = useState<string | null>(referralToken || null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  });

  const content = getShareContent(targetType, activeReferral);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(content.url);
      setCopied(true);
      trackShareEvent({
        eventType: 'COPY_LINK',
        channel: 'copy',
        targetUrl: content.url,
        referralToken: activeReferral || undefined
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Copy link failed:', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.shortText,
          url: content.url
        });
        trackShareEvent({
          eventType: 'NATIVE_SHARE',
          channel: 'native',
          targetUrl: content.url,
          referralToken: activeReferral || undefined
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fallback to copy link if user didn't simply cancel
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleChannelClick = (channel: SocialShareChannel) => {
    const url = buildShareUrl(channel, targetType, activeReferral);
    trackShareEvent({
      eventType: targetType === 'VOLUNTEER' ? 'VOLUNTEER_SHARE_CLICK' : 'SUMMIT_SHARE_CLICK',
      channel,
      targetUrl: content.url,
      referralToken: activeReferral || undefined
    });

    if (channel === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer,width=650,height=550');
    }
  };

  const handleGenerateNewReferral = () => {
    const newToken = generateVolunteerReferralToken();
    setActiveReferral(newToken);
    if (onGenerateReferral) {
      onGenerateReferral(newToken);
    }
    trackShareEvent({
      eventType: 'VOLUNTEER_SHARE_CLICK',
      channel: 'referral_create',
      targetUrl: `${CANONICAL_VOLUNTEER_URL}?ref=${newToken}`,
      referralToken: newToken
    });
  };

  // -------------------------------------------------------------
  // Compact / Bar Variant (For Headers, Footers, Quick bars)
  // -------------------------------------------------------------
  if (variant === 'compact' || variant === 'bar') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {/* WhatsApp */}
        <button
          onClick={() => handleChannelClick('whatsapp')}
          aria-label="Share via WhatsApp"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold transition-all focus:ring-2 focus:ring-[#25D366] focus:outline-none"
        >
          <span className="font-bold">WhatsApp</span>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleChannelClick('facebook')}
          aria-label="Share via Facebook"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#5B9DF8] text-xs font-semibold transition-all focus:ring-2 focus:ring-[#1877F2] focus:outline-none"
        >
          <span className="font-bold">Facebook</span>
        </button>

        {/* X / Twitter */}
        <button
          onClick={() => handleChannelClick('twitter')}
          aria-label="Share via X"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold transition-all focus:ring-2 focus:ring-white focus:outline-none"
        >
          <span className="font-bold">X</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleChannelClick('linkedin')}
          aria-label="Share via LinkedIn"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 border border-[#0A66C2]/40 text-[#70B5F9] text-xs font-semibold transition-all focus:ring-2 focus:ring-[#0A66C2] focus:outline-none"
        >
          <span className="font-bold">LinkedIn</span>
        </button>

        {/* Telegram */}
        <button
          onClick={() => handleChannelClick('telegram')}
          aria-label="Share via Telegram"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-[#5EC4F7] text-xs font-semibold transition-all focus:ring-2 focus:ring-[#229ED9] focus:outline-none"
        >
          <Send className="h-3 w-3 mr-0.5" />
          <span className="font-bold">Telegram</span>
        </button>

        {/* Email */}
        <button
          onClick={() => handleChannelClick('email')}
          aria-label="Share via Email"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-gray-200 text-xs font-semibold transition-all focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
        >
          <Mail className="h-3 w-3 mr-0.5 text-[#D4AF37]" />
          <span>Email</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          aria-label="Copy canonical share link"
          className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all focus:ring-2 focus:ring-[#D4AF37] focus:outline-none ${
            copied
              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
              : 'bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border-[#D4AF37]/50 text-[#FFD700]'
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'LINK COPIED' : 'Copy Link'}</span>
        </button>

        {/* Native Share button (if supported) */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            aria-label="Native device share"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F] text-xs font-bold transition-all focus:ring-2 focus:ring-white focus:outline-none shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        )}

        {/* QR Code trigger */}
        <button
          onClick={() => setIsQRModalOpen(true)}
          aria-label="Show QR code for sharing"
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/20 text-gray-300 text-xs transition-all focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
          title="Display QR code"
        >
          <QrCode className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span>QR</span>
        </button>

        <QRCodeShareModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          targetType={targetType}
          customUrl={content.url}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // Full Card Variant (For Dedicated Sections)
  // -------------------------------------------------------------
  return (
    <div className={`bg-[#0A192F] text-white border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${className}`}>
      
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16"></div>

      <div className="relative z-10 space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-lg text-[#FFD700]">
                {targetType === 'VOLUNTEER' ? (
                  <HeartHandshake className="h-4 w-4" />
                ) : targetType === 'ORGANISATION' ? (
                  <Building2 className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </span>
              <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                {targetType === 'VOLUNTEER' 
                  ? 'VOLUNTEER RECRUITMENT & CITIZEN ADVOCACY' 
                  : targetType === 'ORGANISATION' 
                  ? 'CORPORATE & ORGANISATION PARTICIPATION'
                  : 'OFFICIAL SUMMIT PUBLIC SHARING'
                }
              </p>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-white tracking-tight uppercase">
              {customTitle || (
                targetType === 'VOLUNTEER'
                  ? 'SHARE THIS VOLUNTEER OPPORTUNITY'
                  : targetType === 'ORGANISATION'
                  ? 'SHARE FOR CORPORATE & SPONSOR SUPPORT'
                  : 'SHARE THE AVIATION SAFETY SUMMIT'
              )}
            </h3>

            <p className="text-xs sm:text-sm text-[#8A99AD] font-light leading-relaxed max-w-2xl">
              {customSubtitle || (
                targetType === 'VOLUNTEER'
                  ? 'Help spread the word: "VOLUNTEER FROM WHEREVER YOU ARE". Positions available for both on-site (Lagos) and remote assignments worldwide.'
                  : targetType === 'ORGANISATION'
                  ? 'Invite organisations to nominate, sponsor, or deploy staff volunteers to support national aviation safety.'
                  : 'Help spread the national safety mandate: "EVERYBODY IS INVOLVED IN AVIATION SAFETY".'
              )}
            </p>
          </div>

          {/* Quick Canonical Copy or Native button */}
          <div className="flex items-center space-x-2 shrink-0">
            {hasNativeShare && (
              <button
                onClick={handleNativeShare}
                className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:brightness-110 text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center space-x-2 transition-all"
                aria-label="Native share"
              >
                <Share2 className="h-4 w-4" />
                <span>Native Share</span>
              </button>
            )}

            <button
              onClick={() => setIsQRModalOpen(true)}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl text-white text-xs font-mono uppercase flex items-center space-x-1.5 transition-all"
              aria-label="Show QR Code"
            >
              <QrCode className="h-4 w-4 text-[#D4AF37]" />
              <span>QR Code</span>
            </button>
          </div>
        </div>

        {/* Share Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* WhatsApp */}
          <button
            onClick={() => handleChannelClick('whatsapp')}
            aria-label="Share to WhatsApp"
            className="p-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/35 rounded-xl flex flex-col items-center justify-center space-y-1.5 text-center group transition-all hover:scale-[1.02] focus:ring-2 focus:ring-[#25D366] focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
              <span className="font-bold text-sm font-sans">WA</span>
            </div>
            <span className="text-xs font-bold text-white">WhatsApp</span>
            <span className="text-[10px] text-gray-400">Direct Message</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleChannelClick('facebook')}
            aria-label="Share to Facebook"
            className="p-3.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/35 rounded-xl flex flex-col items-center justify-center space-y-1.5 text-center group transition-all hover:scale-[1.02] focus:ring-2 focus:ring-[#1877F2] focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#1877F2]/20 flex items-center justify-center text-[#5B9DF8] group-hover:scale-110 transition-transform">
              <span className="font-bold text-sm font-sans">FB</span>
            </div>
            <span className="text-xs font-bold text-white">Facebook</span>
            <span className="text-[10px] text-gray-400">Post & Feed</span>
          </button>

          {/* X / Twitter */}
          <button
            onClick={() => handleChannelClick('twitter')}
            aria-label="Share to X (formerly Twitter)"
            className="p-3.5 bg-white/5 hover:bg-white/15 border border-white/20 rounded-xl flex flex-col items-center justify-center space-y-1.5 text-center group transition-all hover:scale-[1.02] focus:ring-2 focus:ring-white focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <span className="font-serif font-black text-sm">𝕏</span>
            </div>
            <span className="text-xs font-bold text-white">X / Twitter</span>
            <span className="text-[10px] text-gray-400">Tweet Message</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleChannelClick('linkedin')}
            aria-label="Share to LinkedIn"
            className="p-3.5 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/35 rounded-xl flex flex-col items-center justify-center space-y-1.5 text-center group transition-all hover:scale-[1.02] focus:ring-2 focus:ring-[#0A66C2] focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#0A66C2]/20 flex items-center justify-center text-[#70B5F9] group-hover:scale-110 transition-transform">
              <span className="font-bold text-sm font-sans">in</span>
            </div>
            <span className="text-xs font-bold text-white">LinkedIn</span>
            <span className="text-[10px] text-gray-400">Professional Feed</span>
          </button>

          {/* Telegram */}
          <button
            onClick={() => handleChannelClick('telegram')}
            aria-label="Share to Telegram"
            className="p-3.5 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/35 rounded-xl flex flex-col items-center justify-center space-y-1.5 text-center group transition-all hover:scale-[1.02] focus:ring-2 focus:ring-[#229ED9] focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#229ED9]/20 flex items-center justify-center text-[#5EC4F7] group-hover:scale-110 transition-transform">
              <Send className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white">Telegram</span>
            <span className="text-[10px] text-gray-400">Group or Chat</span>
          </button>

          {/* Email */}
          <button
            onClick={() => handleChannelClick('email')}
            aria-label="Share via Email"
            className="p-3.5 bg-white/5 hover:bg-white/15 border border-white/20 rounded-xl flex flex-col items-center justify-center space-y-1.5 text-center group transition-all hover:scale-[1.02] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white">Email</span>
            <span className="text-[10px] text-gray-400">Official Invitation</span>
          </button>

        </div>

        {/* Copy Link Bar with feedback */}
        <div className="bg-[#050D1A] p-4 rounded-xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
            <span className="p-2 bg-white/5 rounded-lg text-[#D4AF37] shrink-0">
              <Copy className="h-4 w-4" />
            </span>
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-mono uppercase text-gray-400">
                {activeReferral ? 'Personal Referral Share Link:' : 'Canonical Public Link:'}
              </p>
              <p className="text-xs font-mono text-[#FFD700] truncate font-semibold">
                {content.url}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <button
              onClick={handleCopyLink}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                copied
                  ? 'bg-emerald-600 border border-emerald-400 text-white'
                  : 'bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A192F]'
              }`}
              aria-label="Copy canonical link to clipboard"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'LINK COPIED' : 'COPY LINK'}</span>
            </button>
          </div>
        </div>

        {/* Optional Volunteer Referral Link Generator */}
        {(showReferralGenerator || targetType === 'VOLUNTEER') && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Invite a Friend or Colleague (Volunteer Referral Link)
                </span>
              </div>
              <button
                onClick={handleGenerateNewReferral}
                className="text-[11px] font-mono text-[#D4AF37] hover:underline flex items-center space-x-1 self-start sm:self-auto"
              >
                <Sparkles className="h-3 w-3" />
                <span>Generate New Referral Link</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed font-light">
              When you share a referral link, the Summit Secretariat can track how many friends and colleagues were inspired to apply through your advocacy. No personal data is stored in the link.
            </p>

            {activeReferral && (
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Active Referral Token: <strong>{activeReferral}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Privacy and Security Assurance */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-gray-400 border-t border-white/5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Privacy Assured: Zero private volunteer scores or personal profiles exposed.</span>
          </div>
          <span>DOMISLINK DIGITAL SECRETARIAT</span>
        </div>

      </div>

      <QRCodeShareModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        targetType={targetType}
        customUrl={content.url}
      />
    </div>
  );
}
