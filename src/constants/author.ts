/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ============================================================
 * CENTRAL AUTHOR & BOOK PUBLISHING IDENTITY CONFIGURATION
 * ============================================================
 * Confirmed and permanent author identity for the DomisLink
 * Aviation Safety Summit 2026 and headline book publication.
 * 
 * AUTHOR IDENTITY: AMAECHI UBADIKE
 * PUBLISHER: DomisLink International Services Ltd / The Digital Empire
 * ============================================================
 */

export const AUTHOR_NAME = 'AMAECHI UBADIKE';
export const AUTHOR_FULL_TITLE = 'F/O Amaechi Ubadike';
export const AUTHOR_ROLE = 'Commercial Pilot · Air Traffic Controller · Civil Aviation Safety Inspector';

export const AUTHOR_CREDENTIALS = [
  'Commercial Pilot Licence (CPL)',
  'Air Traffic Controller (ATC)',
  'Aviation Safety Inspector — Personnel Licensing (PEL)',
  '25+ Years Cross-Disciplinary Airspace Command'
] as const;

export const AUTHOR_BIO = 
  'Amaechi Ubadike is a seasoned aviation professional with over 25 years of operational command, regulatory audits, and airspace oversight across West African skies. Uniquely credentialed as a commercial pilot, radar air traffic controller, and civil aviation safety inspector, he provides an uncompromising insider perspective on aviation governance, cockpit culture, human factors, and systemic accident prevention. He serves as the Convener of the DomisLink Aviation Safety Summit 2026.';

export const AUTHOR_CAREER_HIGHLIGHTS = [
  {
    role: 'Commercial Pilot',
    description: 'Extensive command experience across multi-engine civil aircraft and regional flight operations.'
  },
  {
    role: 'Air Traffic Controller',
    description: 'Radar and tower airspace management ensuring separation integrity under severe traffic and weather regimes.'
  },
  {
    role: 'Safety Inspector (PEL)',
    description: 'Statutory oversight, flight crew proficiency evaluation, and adherence to ICAO Annex safety benchmarks.'
  },
  {
    role: 'Summit Convener & Author',
    description: 'Architect of the 2026 National Aviation Safety Summit and the landmark memoir "Cleared for Takeoff".'
  }
] as const;

export const BOOK_PRIMARY = {
  id: 'bk-1',
  title: 'CLEARED FOR TAKEOFF',
  subtitle: "But Who Is Flying Nigeria's Aviation?",
  author: AUTHOR_NAME,
  formalAuthorLine: `By ${AUTHOR_NAME}`,
  description: "A Pilot, Controller, and Inspector's Unfiltered Account of 25 Years Above the Clouds and Behind the Radar.",
  publisher: 'DomisLink International Services Ltd',
  publisherImprint: 'The Digital Empire',
  coverImagePlaceholder: 'CLEARED FOR TAKEOFF',
  format: 'Commemorative Hardcover & Digital Monograph',
  edition: 'First Summit Limited Commemorative Edition 2026'
} as const;

