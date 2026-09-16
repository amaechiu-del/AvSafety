/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SocialShareChannel, ShareTargetType, ShareAnalyticsEvent } from '../types';

export const CANONICAL_SUMMIT_URL = 'https://summit.domislink.com';
export const CANONICAL_VOLUNTEER_URL = 'https://summit.domislink.com/volunteer';
export const CANONICAL_RSVP_URL = 'https://summit.domislink.com/rsvp';

/**
 * Generate a cryptographically non-sensitive volunteer referral token.
 * Never includes personal information, scores, email, phone, or internal DB IDs.
 * Format: VOL2026-XXXX (e.g. VOL2026-A8K2)
 */
export function generateVolunteerReferralToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Base32 without confusing 0/O, 1/I
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VOL2026-${code}`;
}

/**
 * Sanitizes and validates a referral token to prevent XSS, open redirects, or injection.
 * Accepts only alphanumeric characters and hyphens/underscores, 3 to 24 characters.
 */
export function sanitizeReferralToken(token: string | null | undefined): string | null {
  if (!token) return null;
  const clean = token.trim();
  if (/^[A-Za-z0-9_-]{3,24}$/.test(clean)) {
    return clean.toUpperCase();
  }
  return null;
}

/**
 * Detect client device category safely without invasive tracking
 */
export function getDeviceCategory(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Get share text templates for different target types
 */
export function getShareContent(target: ShareTargetType, referralToken?: string | null) {
  const volunteerUrl = referralToken 
    ? `${CANONICAL_VOLUNTEER_URL}?ref=${encodeURIComponent(referralToken)}`
    : CANONICAL_VOLUNTEER_URL;

  switch (target) {
    case 'VOLUNTEER':
      return {
        title: 'Volunteer for DomisLink Aviation Safety Summit 2026',
        subject: 'Volunteer Opportunity: DomisLink Aviation Safety Summit 2026',
        shortText: 'VOLUNTEER FROM WHEREVER YOU ARE — DomisLink Aviation Safety Summit 2026 (17 Nov 2026, Marriott Lagos & Remote). Join the team.',
        fullText: `VOLUNTEER FOR THE
DOMISLINK AVIATION SAFETY SUMMIT 2026

17 NOVEMBER 2026
Marriott Hotel, Ikeja, Lagos, Nigeria & Remote Worldwide

Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY"

You do not necessarily have to be in Lagos.
Some assignments can be performed remotely from anywhere, subject to the Summit schedule and operational requirements.

Volunteer opportunities include:
• Media & Digital Content
• Documentation & Rapporteur
• IT & Digital Support
• Protocol & VIP Courtesies
• Guest Services & Registration
• Aviation Safety Research
• Administration & Communications

Apply here:
${volunteerUrl}`,
        url: volunteerUrl,
        xText: `Volunteer for the DomisLink Aviation Safety Summit 2026 (17 Nov 2026). On-site in Lagos or Remote from anywhere! Apply: ${volunteerUrl} #AviationSafety #DomisLink`,
        emailBody: `Dear Colleague,

You are invited to apply as a Volunteer for the DomisLink Aviation Safety Summit 2026.

Theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY
Date: 17 November 2026
Venue: Marriott Hotel, Ikeja, Lagos, Nigeria & Remote Worldwide

You do not necessarily have to be in Lagos — remote and on-site assignments are available across media, rapporteur, IT, protocol, and research.

Explore opportunities and apply:
${volunteerUrl}

DomisLink International Services Ltd
The Digital Empire`
      };

    case 'ORGANISATION':
      return {
        title: 'Corporate Volunteer & Staff Deployment — Aviation Safety Summit 2026',
        subject: 'Corporate & Organisation Volunteer Support — Aviation Safety Summit 2026',
        shortText: 'Your organisation can support aviation safety by sponsoring or deploying staff volunteers at the DomisLink Aviation Safety Summit 2026.',
        fullText: `YOUR ORGANISATION CAN SUPPORT THE DOMISLINK AVIATION SAFETY SUMMIT 2026

17 NOVEMBER 2026
Marriott Hotel, Ikeja, Lagos, Nigeria

Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY"

Ways organisations can participate:
• Sponsoring youth & professional volunteers
• Nominating industry staff members
• Deploying corporate volunteer teams
• Supporting approved summit safety activities

Learn more and register your organisation's deployment:
${volunteerUrl}`,
        url: volunteerUrl,
        xText: `Organisations across aviation, energy, banking & tech can nominate & sponsor staff volunteers for the Aviation Safety Summit 2026: ${volunteerUrl}`,
        emailBody: `Dear Executive / Partner,

Your organisation is invited to support the DomisLink Aviation Safety Summit 2026 by nominating or sponsoring staff and graduate volunteers.

Event: DomisLink Aviation Safety Summit 2026
Theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY
Date: 17 November 2026
Venue: Marriott Hotel, Ikeja, Lagos, Nigeria

Learn more:
${volunteerUrl}

DomisLink International Services Ltd`
      };

    case 'SUMMIT':
    default:
      return {
        title: 'DOMISLINK Aviation Safety Summit 2026',
        subject: 'DomisLink Aviation Safety Summit 2026',
        shortText: 'DOMISLINK AVIATION SAFETY SUMMIT 2026 — 17 Nov 2026, Marriott Ikeja, Lagos. "Everybody is involved in aviation safety."',
        fullText: `DOMISLINK AVIATION SAFETY SUMMIT 2026

17 NOVEMBER 2026
Marriott Hotel, Ikeja, Lagos, Nigeria

Theme:
"EVERYBODY IS INVOLVED IN AVIATION SAFETY"

Explore the Summit and join the conversation.
${CANONICAL_SUMMIT_URL}`,
        url: CANONICAL_SUMMIT_URL,
        xText: `Everyone is involved in aviation safety. Join the DomisLink Aviation Safety Summit 2026. 17 November 2026 | Lagos, Nigeria. ${CANONICAL_SUMMIT_URL} #AviationSafety #NigeriaAviation`,
        emailBody: `You are invited to explore the DomisLink Aviation Safety Summit 2026.

Theme:
EVERYBODY IS INVOLVED IN AVIATION SAFETY

Date: 17 November 2026
Venue: Marriott Hotel, Ikeja, Lagos, Nigeria

Summit Information:
${CANONICAL_SUMMIT_URL}

Volunteer Application:
${CANONICAL_VOLUNTEER_URL}`
      };
  }
}

/**
 * Builds official URL share links for social channels
 */
export function buildShareUrl(channel: SocialShareChannel, target: ShareTargetType, referralToken?: string | null): string {
  const content = getShareContent(target, referralToken);

  switch (channel) {
    case 'whatsapp': {
      // Official WhatsApp share intent
      const msg = `${content.fullText}`;
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    }

    case 'facebook': {
      // Facebook share dialog with canonical URL
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}&quote=${encodeURIComponent(content.shortText)}`;
    }

    case 'twitter': {
      // X / Twitter web intent
      return `https://x.com/intent/tweet?text=${encodeURIComponent(content.xText)}`;
    }

    case 'linkedin': {
      // LinkedIn share offsite URL
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url)}`;
    }

    case 'telegram': {
      // Telegram share intent
      return `https://t.me/share/url?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(content.shortText)}`;
    }

    case 'email': {
      // Mailto standard URI
      return `mailto:?subject=${encodeURIComponent(content.subject)}&body=${encodeURIComponent(content.emailBody)}`;
    }

    default:
      return content.url;
  }
}

/**
 * Dispatches lightweight, privacy-respecting analytics event
 */
export async function trackShareEvent(event: Omit<ShareAnalyticsEvent, 'id' | 'timestamp'>) {
  try {
    const payload = {
      ...event,
      timestamp: new Date().toISOString(),
      deviceCategory: event.deviceCategory || getDeviceCategory()
    };

    // Use non-blocking fetch
    fetch('/api/analytics/share-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Silently ignore network failures for analytics
    });
  } catch (e) {
    // Non-blocking
  }
}
