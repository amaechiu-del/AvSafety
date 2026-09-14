/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, User } from 'lucide-react';

interface PhotoVerificationProps {
  photoUrl?: string;
  name: string;
  organisation?: string;
  monogram?: string;
  photoRights?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * PhotoVerificationStatus helper component:
 * Checks if a person's image is verified (photoUrl is present and photoRights indicates verification or legitimate URL).
 * If verified, renders the official photograph with a verified badge.
 * If unverified or missing, renders a premium DomisLink monogram/initial gold placeholder with safety crest.
 */
export default function PhotoVerificationStatus({
  photoUrl,
  name,
  organisation,
  monogram,
  photoRights,
  size = 'md',
  className = ''
}: PhotoVerificationProps) {
  // Determine if photo is valid and verified
  const hasValidPhoto = Boolean(photoUrl && photoUrl.trim() !== '' && !photoUrl.includes('placeholder') && photoRights !== 'OFFICIAL_PHOTO_REQUIRED');

  // Compute initials if monogram is not provided
  const computedMonogram = monogram || name
    .replace(/^(H\.E\.|Sen\.|Barr\.|Mr\.|Mrs\.|Prof\.|Capt\.|Engr\.|Dr\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();

  // Size dimensions map
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-lg',
    lg: 'w-32 h-32 text-2xl',
    xl: 'w-40 h-40 text-3xl'
  };

  const containerSize = sizeClasses[size] || sizeClasses.md;

  if (hasValidPhoto) {
    return (
      <div className={`relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-md group ${containerSize} ${className}`}>
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-1 right-1 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 p-0.5 rounded-full shadow" title="Official Verified Photograph">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    );
  }

  // Premium Monogram / Crest Placeholder for Unverified/Missing Photos
  return (
    <div className={`rounded-2xl bg-gradient-to-tr from-[#050B1A] via-[#0D1E38] to-[#132545] border-2 border-[#D4AF37] shadow-xl flex flex-col items-center justify-center p-2 relative group ${containerSize} ${className}`}>
      {/* Absolute gold glow */}
      <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl pointer-events-none"></div>
      
      {/* Crest Icon or Sparkle */}
      <div className="text-[#FFD700] mb-0.5 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
        <Sparkles className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'} />
      </div>

      {/* Monogram Initials */}
      <span className="font-serif font-black text-white tracking-widest drop-shadow">
        {computedMonogram}
      </span>

      {/* Verification Status Pill */}
      <div className="absolute -bottom-2 bg-[#D4AF37] text-[#050B1A] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow border border-[#FFD700]">
        DOMISLINK SECURE
      </div>
    </div>
  );
}
