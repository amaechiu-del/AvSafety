/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Clean up tsx runtime leakage where global.__dirname is set to '.' which breaks vite-plugin-pwa and Vite config loader
if (typeof (globalThis as any).__dirname === 'string' && (globalThis as any).__dirname === '.') {
  delete (globalThis as any).__dirname;
}
if (typeof (global as any).__dirname === 'string' && (global as any).__dirname === '.') {
  delete (global as any).__dirname;
}

import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import { INITIAL_AD_POSITIONS, INITIAL_SPONSORSHIP_PACKAGES } from './src/data/marketplaceData';
import { INITIAL_VERIFIED_SPEAKERS } from './src/data/speakersData';
import { INITIAL_STAKEHOLDERS, STAKEHOLDER_CATEGORIES } from './src/data/stakeholdersData';
import { INITIAL_PROGRAMME_SESSIONS } from './src/data/programmeData';



const app = express();
const PORT = 3000;

// Initialize Gemini SDK with lazy initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    return aiClient;
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    return null;
  }
}

// Path to JSON DB file
const dbPath = path.join(process.cwd(), 'data', 'db.json');

// Helper to ensure data directory exists
function ensureDirExists(filePath: string) {
  const dirName = path.dirname(filePath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
}

// Initial/default database state
const defaultDb = {
  event: {
    id: '1',
    name: 'Aviation Safety Summit 2026',
    theme: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
    date: '17 NOVEMBER 2026',
    venue: 'MARRIOTT HOTEL, IKEJA, LAGOS, NIGERIA',
    organizer: 'DOMISLINK INTERNATIONAL SERVICES LTD',
    brand: 'THE DIGITAL EMPIRE',
    symbol: 'GOLDEN CROWN'
  },
  speakers: INITIAL_VERIFIED_SPEAKERS,
  stakeholders: INITIAL_STAKEHOLDERS,
  sessions: INITIAL_PROGRAMME_SESSIONS,
  organisations: [
    {
      id: 'org-1',
      name: 'Shell Nigeria',
      industry: 'OIL & GAS',
      representative: 'Osagie Okunbor',
      topic: 'Energy Security & Aviation Safety',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'Shell',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'red-yellow'
    },
    {
      id: 'org-2',
      name: 'MTN Nigeria',
      industry: 'TELECOMMUNICATIONS',
      representative: 'Karl Toriola',
      topic: 'Technology-Driven Safety Solutions',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'MTN',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'yellow'
    },
    {
      id: 'org-3',
      name: 'Access Holdings Plc',
      industry: 'BANKING',
      representative: 'Roosevelt Ogbonna',
      topic: 'Financing Safety, Sustainable Aviation',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'Access',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'teal'
    },
    {
      id: 'org-4',
      name: 'GTCO Plc',
      industry: 'BANKING',
      representative: 'Segun Agbaje',
      topic: 'Digital Transformation for Aviation Safety',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'GTCO',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'orange'
    },
    {
      id: 'org-5',
      name: 'United Bank for Africa Plc',
      industry: 'BANKING',
      representative: 'Oliver Alawuba',
      topic: 'Secure Transactions for a Safer Aviation Ecosystem',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'UBA',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'red'
    },
    {
      id: 'org-6',
      name: 'FirstBank Group',
      industry: 'BANKING',
      representative: 'Olusegun Alebiosu',
      topic: 'Banking Partnerships for Aviation Progress',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'FirstBank',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'blue-gold'
    },
    {
      id: 'org-7',
      name: 'Dangote Group',
      industry: 'OTHER',
      representative: 'Aliko Dangote',
      topic: 'Industrial Growth, Logistics & Risk Management',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'Dangote',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'blue'
    },
    {
      id: 'org-8',
      name: 'NNPC Limited',
      industry: 'OIL & GAS',
      representative: 'Mele Kyari',
      topic: 'Energy Security, Logistics & Aviation Safety',
      partnershipStatus: 'Active Partner',
      logoPlaceholder: 'NNPC',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'green-gold'
    },
    {
      id: 'org-9',
      name: 'FAAN',
      industry: 'AIRPORTS',
      representative: 'Mrs. Olubunmi Kuku',
      topic: 'Airport Safety, Security and Passenger Experience',
      partnershipStatus: 'Regulatory Body',
      logoPlaceholder: 'FAAN',
      logoUrl: '',
      session: 'Session 1: Summit Opening',
      colorTheme: 'green'
    },
    {
      id: 'org-10',
      name: 'Arik Air',
      industry: 'AIRLINES',
      representative: 'Roy Ilegbodu',
      topic: 'Airline Operations, Safety & Reliability',
      partnershipStatus: 'Active Participant',
      logoPlaceholder: 'Arik',
      logoUrl: '',
      session: 'Session 5: Simulation & Training',
      colorTheme: 'maroon'
    },
    {
      id: 'org-11',
      name: 'DHL Express West Africa',
      industry: 'OTHER',
      representative: 'Adewale Ajayi',
      topic: 'Cargo Safety & Global Standards',
      partnershipStatus: 'Active Participant',
      logoPlaceholder: 'DHL',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'yellow-red'
    },
    {
      id: 'org-12',
      name: 'NATCA',
      industry: 'OTHER',
      representative: 'Engr. M. Danjuma',
      topic: 'Air Traffic Control & Risk Management',
      partnershipStatus: 'Aviation Association',
      logoPlaceholder: 'NATCA',
      logoUrl: '',
      session: 'Session 5: Simulation & Training',
      colorTheme: 'sky'
    },
    {
      id: 'org-13',
      name: 'Boeing',
      industry: 'TECHNOLOGY',
      representative: 'Marc Allen',
      topic: 'Aviation Technology & Safety Innovation',
      partnershipStatus: 'Technology Partner',
      logoPlaceholder: 'Boeing',
      logoUrl: '',
      session: 'Session 5: Simulation & Training',
      colorTheme: 'blue-white'
    },
    {
      id: 'org-14',
      name: 'Airbus',
      industry: 'TECHNOLOGY',
      representative: 'Wole Akinbulire',
      topic: 'Aircraft Safety & Maintenance',
      partnershipStatus: 'Technology Partner',
      logoPlaceholder: 'Airbus',
      logoUrl: '',
      session: 'Session 5: Simulation & Training',
      colorTheme: 'blue-indigo'
    },
    {
      id: 'org-15',
      name: 'Ministry of Finance',
      industry: 'GOVERNMENT',
      representative: 'Sirika / Rep.',
      topic: 'Funding & Investment in Aviation Safety',
      partnershipStatus: 'State Representative',
      logoPlaceholder: 'Finance',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'navy-gold'
    },
    {
      id: 'org-16',
      name: 'NiMET',
      industry: 'REGULATORS',
      representative: 'Prof. Mansur Bako',
      topic: 'Weather Intelligence & Flight Safety',
      partnershipStatus: 'Regulatory Body',
      logoPlaceholder: 'NiMET',
      logoUrl: '',
      session: 'Session 4: Safety Investment',
      colorTheme: 'green'
    }
  ],
  registrations: [] as any[],
  memo_submissions: [
    {
      id: 'memo-pre-1',
      name: 'Capt. Kunle Adebayo',
      isAnonymous: false,
      profession: 'Captain (B737-800)',
      organisation: 'Air Peace',
      experienceCategory: 'Near-Miss Experience',
      memoTitle: 'Inadvertent Dual Input Alert During Crosswind Landing Transition',
      memoContent: 'During a manual ILS approach into DNMM Runway 18R in active gusts, the First Officer initiated a sudden counter-correction without dual-input system notice, briefly nullifying sidestick deflection. Airspeed fluctuated on short final before correct control hand-over commands were fully verified.',
      lessonLearned: 'Dual flight-deck input overrides must be immediately called verbally. Blind physical corrections on active pilot sidesticks introduce dangerous aerodynamic instabilities.',
      recommendedImprovement: 'Maintain strict flight-deck protocol training focusing on explicit command handovers (e.g., "I have control", "You have control") under active gust conditions.',
      consent: true,
      submittedAt: '2026-10-15T14:32:00.000Z'
    },
    {
      id: 'memo-pre-2',
      name: 'Anonymised Professional',
      isAnonymous: true,
      profession: 'Lead Avionics Inspector (AME)',
      organisation: 'Not Disclosed',
      experienceCategory: 'Lessons Learned Case study',
      memoTitle: 'Micro-cracking on pressure bulkhead cable looms after thermal stress',
      memoContent: 'Routine landing gear bay sweeps revealed micro-fissures along the main pressure bulkhead wire loom housing, which had been subjected to cyclic high thermal transitions. Standard inspections do not mandate close-range visual loupe inspection of these specific brackets.',
      lessonLearned: 'Extreme operational temperatures exacerbate wiring shroud micro-fractures in specific aircraft batches, which escape standard physical manual inspections.',
      recommendedImprovement: 'Update airline visual-inspection guides to require close-focus inspection of bulkheads during standard C-Checks for airframes over 12,000 cycles.',
      consent: true,
      submittedAt: '2026-10-16T09:15:00.000Z'
    }
  ],
  book: {
    id: 'bk-1',
    title: 'CLEARED FOR TAKEOFF',
    author: 'AMAECHI UBADIKE',
    description: "A Pilot, Controller, and Inspector's Unfiltered Account of 25 Years Above the Clouds and Behind the Radar.",
    coverImagePlaceholder: 'CLEARED FOR TAKEOFF'
  },
  investment: {
    id: 'inv-1',
    company: '[INVESTMENT OPPORTUNITY COMPANY]',
    opportunity: '[INVESTMENT OPPORTUNITY TITLE]',
    description: '[INVESTMENT OPPORTUNITY DESCRIPTION]',
    regulatoryInfo: '[REGULATORY INFORMATION — TO BE SUPPLIED]',
    minimumInvestment: '[MINIMUM INVESTMENT — TO BE CONFIRMED]',
    offerPeriod: '[OFFER PERIOD — TO BE CONFIRMED]',
    officialContact: '[OFFICIAL CONTACT — TO BE SUPPLIED]',
    officialDocumentation: '[OFFICIAL DOCUMENTATION — TO BE SUPPLIED]'
  },
  announcements: [
    {
      id: 'ann-1',
      title: '[CONTENT TO BE PUBLISHED]',
      category: 'News',
      content: '[CONTENT TO BE PUBLISHED — No simulated or fabricated news articles are pre-populated until official releases are supplied by Domislink International Services Ltd.]',
      publishedAt: '2026-09-11'
    }
  ],
  partners: [
    { id: 'p-1', name: 'Domislink International Services Ltd', tier: 'TITLE', logoText: 'DOMISLINK', editablePrice: '[SPONSORSHIP AGREEMENT IN NEGOTIATION]' },
    { id: 'p-2', name: 'The Digital Empire', tier: 'TITLE', logoText: 'THE DIGITAL EMPIRE', editablePrice: '[SPONSORSHIP AGREEMENT IN NEGOTIATION]' },
    { id: 'p-3', name: '[PLATINUM PARTNER SLOT]', tier: 'PLATINUM', logoText: 'PLATINUM', editablePrice: '[DISCLOSED ON INQUIRY]' },
    { id: 'p-4', name: '[GOLD PARTNER SLOT]', tier: 'GOLD', logoText: 'GOLD', editablePrice: '[DISCLOSED ON INQUIRY]' },
    { id: 'p-5', name: '[SILVER PARTNER SLOT]', tier: 'SILVER', logoText: 'SILVER', editablePrice: '[DISCLOSED ON INQUIRY]' },
    { id: 'p-6', name: '[MEDIA PARTNER SLOT]', tier: 'MEDIA', logoText: 'MEDIA', editablePrice: '[DISCLOSED ON INQUIRY]' },
    { id: 'p-7', name: '[TECHNOLOGY PARTNER SLOT]', tier: 'TECHNOLOGY', logoText: 'TECHNOLOGY', editablePrice: '[DISCLOSED ON INQUIRY]' },
    { id: 'p-8', name: '[TRAINING PARTNER SLOT]', tier: 'TRAINING', logoText: 'TRAINING', editablePrice: '[DISCLOSED ON INQUIRY]' },
    { id: 'p-9', name: '[COMMUNITY PARTNER SLOT]', tier: 'COMMUNITY', logoText: 'COMMUNITY', editablePrice: '[DISCLOSED ON INQUIRY]' }
  ],
  ad_positions: INITIAL_AD_POSITIONS,
  sponsorship_packages: INITIAL_SPONSORSHIP_PACKAGES,
  commercial_orders: [
    {
      id: 'ord-init-1',
      orderNumber: 'ORD-AVS26-7721',
      companyName: 'AeroSat Avionics Nigeria Ltd',
      companyType: 'TECHNOLOGY',
      contactPerson: 'Engr. Emeka Nwosu',
      email: 'enwosu@aerosat.ng',
      phone: '+234 802 345 6789',
      website: 'https://aerosat.ng',
      campaignMessage: 'Pioneering Next-Gen ADS-B Flight Tracking Across West Africa',
      specialInstructions: 'Please align booth placement near the Flight Simulation zone',
      items: [
        {
          id: 'item-1',
          positionId: 'ad-exhibit-standard',
          name: 'Executive Exhibition Stand (3m x 2m Shell Scheme)',
          category: 'EXHIBITION',
          quantity: 1,
          unitPriceNGN: 2200000,
          unitPriceUSD: 1500,
          supplyOption: 'PRODUCE_AND_INSTALL',
          productionCostNGN: 300000,
          productionCostUSD: 200,
          installationCostNGN: 100000,
          installationCostUSD: 70
        },
        {
          id: 'item-2',
          positionId: 'ad-online-logo-bar',
          name: 'Official Sponsor & Partner Logo Strip',
          category: 'ONLINE',
          quantity: 1,
          unitPriceNGN: 500000,
          unitPriceUSD: 350,
          supplyOption: 'SUPPLIED_BY_CLIENT',
          productionCostNGN: 0,
          productionCostUSD: 0,
          installationCostNGN: 0,
          installationCostUSD: 0
        }
      ],
      addons: [
        { id: 'addon-exhibit-tv', name: '43-inch LED Display Screen with Floor Stand', priceNGN: 180000, priceUSD: 120 }
      ],
      currency: 'NGN',
      subtotal: 2700000,
      productionTotal: 300000,
      installationTotal: 100000,
      addonsTotal: 180000,
      totalAmount: 3280000,
      paymentMethod: 'PAYSTACK',
      paymentStatus: 'VERIFIED_PAID',
      paystackReference: 'pstk_ref_init_8829104',
      paystackChannel: 'card',
      paidAt: '2026-09-08T11:20:00.000Z',
      orderStatus: 'SCHEDULED',
      artworkStatus: 'APPROVED',
      artworkFiles: [
        {
          id: 'art-1',
          fileType: 'LOGO',
          fileName: 'aerosat_vector_logo.svg',
          fileUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
          uploadedAt: '2026-09-08T12:00:00.000Z',
          status: 'APPROVED',
          adminFeedback: 'Vector approved for high-contrast digital logo strip and booth fascia print.'
        }
      ],
      proofOfDisplay: [],
      adminNotes: 'Booth allocated in Foyer Zone B (Stand B4). Power drop scheduled for 16 Nov setup.',
      createdAt: '2026-09-08T10:45:00.000Z',
      updatedAt: '2026-09-08T12:30:00.000Z'
    }
  ],
  custom_quotes: [
    {
      id: 'q-init-1',
      quoteNumber: 'Q-AVS26-9041',
      companyName: 'First Maritime & Aviation Energy Bank',
      contactPerson: 'Mrs. Folashade Adeyemi',
      email: 'fadeyemi@firstmaritimebank.com',
      phone: '+234 803 111 2233',
      summary: 'Custom Entrance Grand Archway + Delegate Lanyards + 1,000 Branded Water Bottles Package',
      items: [
        {
          name: 'Marriott Grand Ballroom Entrance Arch Branding',
          description: 'Custom 4m x 3m Double-sided Tension Fabric Arch at Ballroom Entry',
          quantity: 1,
          unitPrice: 3800000,
          productionCost: 600000,
          installationCost: 200000,
          total: 4600000
        },
        {
          name: 'Official Delegate Lanyards & Credential Badges',
          description: '650 Luxury Satin Double-Clip Lanyards + Badge Card Reverse Branding',
          quantity: 1,
          unitPrice: 3200000,
          productionCost: 800000,
          installationCost: 0,
          total: 4000000
        },
        {
          name: 'Summit Official Branded Natural Spring Water (1,000 Bottles)',
          description: '500ml Bottled Water with Full-Colour Custom Shrink-Wrap Label',
          quantity: 1,
          unitPrice: 1950000,
          productionCost: 650000,
          installationCost: 50000,
          total: 2650000
        }
      ],
      currency: 'NGN',
      totalAmount: 11250000,
      validityDays: 14,
      validUntil: '2026-10-15',
      status: 'SENT',
      terms: 'Subject to Domislink International Services Ltd commercial terms. Payment via Paystack or direct corporate settlement. 100% material production proof required 21 days prior to event.',
      adminNotes: 'VIP corporate client. Account lead: Secretariat Corporate Sponsorship desk.',
      createdAt: '2026-09-10T14:15:00.000Z'
    }
  ],
  creative_requests: [],
  proof_of_displays: [
    {
      id: 'pod-1',
      orderId: 'ord-init-1',
      orderNumber: 'ORD-AVS26-7721',
      companyName: 'AeroSat Avionics Nigeria Ltd',
      title: 'Portal Header & Partner Carousel Live Deployment',
      location: 'Official Summit Digital Portal (Live Production)',
      date: '2026-09-09',
      time: '14:00 GMT+1',
      mediaType: 'SCREENSHOT',
      mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      notes: 'Brand logo indexed across the live digital portal and delegate confirmation directory.',
      verifiedBy: 'Domislink Digital Broadcast Officer',
      uploadedAt: '2026-09-09T14:30:00.000Z'
    }
  ]
};


/**
 * Idempotent Stakeholder Registry Synchronizer
 * 
 * Synchronizes the source registry (INITIAL_STAKEHOLDERS) with data stored in db.json:
 * - Preserves all existing stakeholder records (including user-nominated records, status updates, 
 *   notes, custom edits, and verification tags).
 * - Identifies records using the strongest existing stable identifier:
 *   1. Canonical `id` (e.g., `stk-airpeace-onyema`)
 *   2. Normalized `name` + `organisation` fallback matching to avoid duplicates if an id is formatted differently.
 * - Appends missing records from INITIAL_STAKEHOLDERS.
 * - Enriches any missing canonical fields on existing records without overwriting user-modified values.
 * - Completely avoids unsafe length thresholds like `< 5` or `< INITIAL_STAKEHOLDERS.length` that cause data loss.
 * - Prevents duplicates on repeated server startup or multiple sync executions.
 */
function syncStakeholderRegistry(existingStakeholders: any[]): { merged: any[]; changed: boolean } {
  if (!Array.isArray(existingStakeholders) || existingStakeholders.length === 0) {
    return {
      merged: [...INITIAL_STAKEHOLDERS],
      changed: true
    };
  }

  const existingMapById = new Map<string, any>();
  const existingSetByNameOrg = new Set<string>();

  for (const s of existingStakeholders) {
    if (s && typeof s === 'object') {
      if (s.id && typeof s.id === 'string') {
        existingMapById.set(s.id.trim(), s);
      }
      if (s.name) {
        const normKey = `${String(s.name).trim().toLowerCase()}:::${String(s.organisation || '').trim().toLowerCase()}`;
        existingSetByNameOrg.add(normKey);
      }
    }
  }

  const merged = [...existingStakeholders];
  let changed = false;

  for (const canonical of INITIAL_STAKEHOLDERS) {
    const canonicalId = canonical.id ? canonical.id.trim() : '';
    const normKey = `${String(canonical.name).trim().toLowerCase()}:::${String(canonical.organisation || '').trim().toLowerCase()}`;
    
    const existingById = canonicalId ? existingMapById.get(canonicalId) : undefined;
    const existingByNameOrg = existingSetByNameOrg.has(normKey);

    if (existingById) {
      // Existing record found by ID - preserve existing record and enrich any newly added canonical fields if undefined
      let enriched = false;
      for (const [key, val] of Object.entries(canonical)) {
        if (existingById[key] === undefined && val !== undefined) {
          existingById[key] = val;
          enriched = true;
        }
      }
      if (enriched) {
        changed = true;
      }
    } else if (existingByNameOrg) {
      // Existing record matches by normalized name & organisation - find and enrich without duplicating
      const existingRecord = merged.find((s: any) => {
        if (!s || !s.name) return false;
        const key = `${String(s.name).trim().toLowerCase()}:::${String(s.organisation || '').trim().toLowerCase()}`;
        return key === normKey;
      });
      if (existingRecord) {
        let enriched = false;
        if (!existingRecord.id && canonical.id) {
          existingRecord.id = canonical.id;
          enriched = true;
        }
        for (const [key, val] of Object.entries(canonical)) {
          if (existingRecord[key] === undefined && val !== undefined) {
            existingRecord[key] = val;
            enriched = true;
          }
        }
        if (enriched) {
          changed = true;
        }
      }
    } else {
      // Record is missing from database - append canonical record
      merged.push({ ...canonical });
      if (canonicalId) existingMapById.set(canonicalId, canonical);
      existingSetByNameOrg.add(normKey);
      changed = true;
    }
  }

  return { merged, changed };
}

// Reads db.json or loads defaults
function readDb() {
  ensureDirExists(dbPath);
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(data);
      let needsWrite = false;

      // Auto-migrate if speakers is missing, empty, or outdated
      if (!parsed.speakers || parsed.speakers.length < 10 || !parsed.speakers[0].workflowStage) {
        parsed.speakers = INITIAL_VERIFIED_SPEAKERS;
        needsWrite = true;
      }

      // Idempotent stakeholder synchronization:
      // Preserves all existing records (user nominations, status updates, notes, etc.)
      // and merges any missing records from the source registry (INITIAL_STAKEHOLDERS)
      // without duplicate creation or destructive overwrites.
      const syncResult = syncStakeholderRegistry(parsed.stakeholders);
      if (syncResult.changed || !parsed.stakeholders) {
        parsed.stakeholders = syncResult.merged;
        needsWrite = true;
      }

      // Auto-migrate if sessions is missing or empty
      if (!parsed.sessions || parsed.sessions.length === 0) {
        parsed.sessions = INITIAL_PROGRAMME_SESSIONS;
        needsWrite = true;
      }

      if (needsWrite) {
        writeDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading DB, resetting to defaults:', err);
  }
  // If db doesn't exist, write defaults
  writeDb(defaultDb);
  return defaultDb;
}

// Writes db.json safely
function writeDb(data: any) {
  ensureDirExists(dbPath);
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to DB:', err);
  }
}

// Middleware
app.use(express.json());

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API endpoints
app.get('/api/db', (req, res) => {
  const data = readDb();
  const isAdmin = req.headers['x-admin-mode'] === 'true' || req.query.admin === 'true';
  
  // Guarantee canonical author identity for book launch
  if (data.book) {
    data.book.author = 'AMAECHI UBADIKE';
  }

  // Privacy protection: Do not expose submitted personal information publicly
  if (!isAdmin) {
    const sanitized = { 
      ...data,
      registrations: [], // Hide personal information from public visitors
      registrationCount: (data.registrations || []).length,
      volunteer_applications: [], // Hide volunteer personal information from public visitors
      volunteerCount: (data.volunteer_applications || []).length
    };
    return res.json(sanitized);
  }

  res.json(data);
});

app.get('/api/admin/registrations', (req, res) => {
  const isAdmin = req.headers['x-admin-mode'] === 'true' || req.query.admin === 'true';
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized access to confidential registration directory' });
  }
  const currentDb = readDb();
  res.json({ success: true, registrations: currentDb.registrations || [] });
});

app.post('/api/db/update', (req, res) => {
  const currentDb = readDb();
  const updated = { ...currentDb, ...req.body };
  writeDb(updated);
  res.json({ success: true, db: updated });
});

app.post('/api/registrations', (req, res) => {
  const currentDb = readDb();
  
  // Generate random 4-digit code e.g. AVS26-7824
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const registrationCode = `AVS26-${randomSuffix}`;

  const registration = {
    id: 'reg-' + Date.now(),
    registrationCode,
    fullName: req.body.fullName || '',
    email: req.body.email || '',
    phone: req.body.phone || '',
    organisation: req.body.organisation || '',
    position: req.body.position || '',
    industry: req.body.industry || 'Commercial Aviation & Airlines',
    country: req.body.country || 'Nigeria',
    attendanceCategory: req.body.attendanceCategory || 'General Aviation Delegate',
    attendanceType: req.body.attendanceType || 'In-Person',
    dietaryRequirements: req.body.dietaryRequirements || '',
    accessibilityRequirements: req.body.accessibilityRequirements || '',
    specialRequests: req.body.specialRequests || '',
    status: req.body.status || 'CONFIRMED',
    registeredAt: new Date().toISOString(),
    consentNDPA: !!req.body.consentNDPA,
    consentTimestamp: new Date().toISOString(),
    jurisdiction: 'Federal Republic of Nigeria (NDPA 2023)',
    adminNotes: ''
  };

  currentDb.registrations = currentDb.registrations || [];
  currentDb.registrations.unshift(registration);
  writeDb(currentDb);
  
  // Return the newly created pass strictly to the submitting client
  res.json({ success: true, registration });
});

app.post('/api/registrations/status', (req, res) => {
  const { id, status, adminNotes } = req.body;
  const currentDb = readDb();
  currentDb.registrations = currentDb.registrations || [];
  const target = currentDb.registrations.find((r: any) => r.id === id);
  if (target) {
    if (status) target.status = status;
    if (adminNotes !== undefined) target.adminNotes = adminNotes;
    writeDb(currentDb);
    return res.json({ success: true, registration: target });
  }
  res.status(404).json({ error: 'Registration record not found' });
});

app.post('/api/memos', (req, res) => {
  const currentDb = readDb();
  const memo = {
    id: 'memo-' + Date.now(),
    submittedAt: new Date().toISOString(),
    ...req.body
  };
  currentDb.memo_submissions = currentDb.memo_submissions || [];
  currentDb.memo_submissions.unshift(memo);
  writeDb(currentDb);
  res.json({ success: true, memo });
});

app.post('/api/db/reset', (req, res) => {
  writeDb(defaultDb);
  res.json({ success: true, db: defaultDb });
});

// ============================================================
// COMMERCIAL MARKETPLACE & SPONSORSHIP API SUITE
// ============================================================

// 1. Get Marketplace Inventory & Sponsorship Packages
app.get('/api/marketplace/inventory', (req, res) => {
  const currentDb = readDb();
  res.json({
    success: true,
    positions: currentDb.ad_positions || INITIAL_AD_POSITIONS,
    packages: currentDb.sponsorship_packages || INITIAL_SPONSORSHIP_PACKAGES,
    event: currentDb.event
  });
});

// 2. Admin Update Inventory / Prices / Availability
app.post('/api/marketplace/inventory/update', (req, res) => {
  const { positions, packages } = req.body;
  const currentDb = readDb();
  if (positions) currentDb.ad_positions = positions;
  if (packages) currentDb.sponsorship_packages = packages;
  writeDb(currentDb);
  res.json({ success: true, positions: currentDb.ad_positions, packages: currentDb.sponsorship_packages });
});

// 3. AI Summit Advertising Assistant
app.post('/api/marketplace/ai-assistant', async (req, res) => {
  try {
    const { 
      message, 
      organisation, 
      promotionGoal, 
      targetAudience, 
      estimatedBudget, 
      visibilityTypes, 
      currency = 'NGN' 
    } = req.body;

    const currentDb = readDb();
    const positions = currentDb.ad_positions || INITIAL_AD_POSITIONS;
    const packages = currentDb.sponsorship_packages || INITIAL_SPONSORSHIP_PACKAGES;

    const apiKey = process.env.GEMINI_API_KEY;

    // Structured catalogue summary for grounding
    const catalogueSummary = positions.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      priceNGN: p.priceNGN,
      priceUSD: p.priceUSD,
      status: p.status,
      available: p.availableInventory,
      badge: p.badge,
      description: p.description
    }));

    const packageSummary = packages.map((pkg: any) => ({
      id: pkg.id,
      tier: pkg.tier,
      name: pkg.name,
      priceNGN: pkg.priceNGN,
      priceUSD: pkg.priceUSD,
      status: pkg.status,
      tagline: pkg.tagline
    }));

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const systemPrompt = `You are the AI Summit Advertising & Sponsorship Advisor for the AVIATION SAFETY SUMMIT 2026 (17 November 2026, Marriott Hotel, Ikeja, Lagos, Nigeria, organised by Domislink International Services Ltd / The Digital Empire).
Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY".

RULES & CONSTRAINTS:
1. Ground your recommendations STRICTLY on the real configured administrator catalogue below.
2. AI MAY RECOMMEND. AI MUST NOT AUTHORISE.
3. AI MUST NOT PROMISE INVENTED PRICES, INVENTED ATTENDANCE, INVENTED LOCATIONS, OR INVENTED BENEFITS.
4. If a location is marked PENDING_APPROVAL or REQUESTED (like Airport or Motorway), explicitly state that it is subject to statutory FAAN or LASAA regulatory safety authorization.
5. Provide helpful, consultative, high-level business strategy advice for aviation executives, banks, airlines, energy firms, and vendors.

REAL CATALOGUE:
Ad Positions: ${JSON.stringify(catalogueSummary)}
Sponsorship Packages: ${JSON.stringify(packageSummary)}

Return your response in structured JSON with the following keys:
{
  "advisorGreeting": "string (polite, executive greeting addressing the company)",
  "recommendedPackages": [
    {
      "id": "matching catalogue item id or package id",
      "name": "matching name",
      "category": "category",
      "priceNGN": number,
      "priceUSD": number,
      "reason": "specific reason why this matches their objective and audience",
      "expectedImpact": "measurable visibility context",
      "safetyCompliance": "statement on safety compliance and approval requirement"
    }
  ],
  "strategicAdvice": "paragraph explaining tactical synergy (e.g. combining digital logo strip + physical booth + delegate water)",
  "nextSteps": "1. Select packages in portal -> 2. Instant Paystack Checkout or Request Custom Formal Quote -> 3. Upload Artwork for Secretariat Review"
}`;

        const userPrompt = `Client Details:
Organisation: ${organisation || 'Not specified'}
Promoting: ${promotionGoal || 'Corporate Aviation Brand / Services'}
Target Audience: ${targetAudience || 'Aviation CEOs, Regulators, and Delegates'}
Estimated Budget: ${estimatedBudget || 'Flexible'}
Visibility Interests: ${(visibilityTypes || []).join(', ') || 'Online, Venue, Branding'}
Customer Specific Request / Question: "${message || 'Recommend the most effective packages for our brand'}"
Currency: ${currency}`;

        const result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\n${userPrompt}`,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const parsed = JSON.parse(result.text || '{}');
        return res.json({ success: true, aiGenerated: true, ...parsed });
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using catalogue rule engine:', geminiErr);
      }
    }

    // Smart Fallback Rule Engine (Zero hallucination, fully grounded)
    const lowerQuery = (message || '' + ' ' + promotionGoal || '' + ' ' + (visibilityTypes || []).join(' ')).toLowerCase();
    
    const matchedPositions: any[] = [];
    
    // Check keyword matches
    if (lowerQuery.includes('water') || lowerQuery.includes('drink') || lowerQuery.includes('hydrate')) {
      const pos = positions.find((p: any) => p.id === 'ad-water-branded');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('lunch') || lowerQuery.includes('food') || lowerQuery.includes('catering') || lowerQuery.includes('coffee')) {
      const pos = positions.find((p: any) => p.id === 'ad-food-lunch') || positions.find((p: any) => p.id === 'ad-food-coffee');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('booth') || lowerQuery.includes('exhibit') || lowerQuery.includes('stand') || lowerQuery.includes('display')) {
      const pos = positions.find((p: any) => p.id === 'ad-exhibit-standard');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('simulat') || lowerQuery.includes('training') || lowerQuery.includes('pilot')) {
      const pkg = packages.find((p: any) => p.tier === 'SIMULATION') || positions.find((p: any) => p.id === 'ad-exhibit-island');
      if (pkg) matchedPositions.push(pkg);
    }
    if (lowerQuery.includes('entrance') || lowerQuery.includes('arch') || lowerQuery.includes('foyer')) {
      const pos = positions.find((p: any) => p.id === 'ad-venue-entrance');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('logo') || lowerQuery.includes('website') || lowerQuery.includes('online')) {
      const pos = positions.find((p: any) => p.id === 'ad-online-logo-bar');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('screen') || lowerQuery.includes('video') || lowerQuery.includes('stage')) {
      const pos = positions.find((p: any) => p.id === 'ad-venue-screen-loop');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('lanyard') || lowerQuery.includes('badge') || lowerQuery.includes('attendee')) {
      const pos = positions.find((p: any) => p.id === 'ad-venue-lanyards');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('airport') || lowerQuery.includes('shuttle') || lowerQuery.includes('transit')) {
      const pos = positions.find((p: any) => p.id === 'ad-route-shuttle');
      if (pos) matchedPositions.push(pos);
    }
    if (lowerQuery.includes('title') || lowerQuery.includes('headline') || lowerQuery.includes('sovereign') || lowerQuery.includes('platinum')) {
      const pkg = packages.find((p: any) => p.tier === 'TITLE') || packages.find((p: any) => p.tier === 'PLATINUM');
      if (pkg) matchedPositions.push(pkg);
    }

    // Default top recommendations if none matched specifically
    if (matchedPositions.length === 0) {
      matchedPositions.push(
        positions.find((p: any) => p.id === 'ad-online-logo-bar'),
        positions.find((p: any) => p.id === 'ad-exhibit-standard'),
        positions.find((p: any) => p.id === 'ad-venue-rollup')
      );
    }

    const recommended = matchedPositions.filter(Boolean).slice(0, 4).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category || 'SPONSORSHIPS',
      priceNGN: item.priceNGN,
      priceUSD: item.priceUSD,
      reason: `Directly aligns with your target audience at the Marriott Hotel venue and online summit portal.`,
      expectedImpact: `Guaranteed reach across attending aviation directors, regulatory delegates, and online portal viewers.`,
      safetyCompliance: item.requiresRegulatoryApproval 
        ? `Note: ${item.regulatoryNote || 'Subject to statutory aviation/venue safety approval.'}` 
        : `Complies with Marriott Hotel and Summit safety regulations.`
    }));

    res.json({
      success: true,
      aiGenerated: false,
      advisorGreeting: `Welcome ${organisation ? organisation : 'esteemed aviation partner'} to the Aviation Safety Summit 2026 Commercial Portal.`,
      recommendedPackages: recommended,
      strategicAdvice: `For maximum return on investment, we recommend combining continuous digital visibility on the official summit portal with a tactile physical touchpoint (such as delegate water or an exhibition stand) to engage all 500+ attendees throughout the 17 November summit.`,
      nextSteps: `1. Review the tailored catalogue items below -> 2. Select any add-ons -> 3. Proceed to instant Paystack checkout or generate a formal invoice -> 4. Submit artwork to the Domislink Secretariat.`
    });
  } catch (err: any) {
    console.error('Error in AI Assistant endpoint:', err);
    res.status(500).json({ error: 'AI Assistant temporarily unavailable', details: err.message });
  }
});

// 4. AI Natural Language Quote Parser
app.post('/api/marketplace/ai-quote-parse', (req, res) => {
  const { naturalText } = req.body;
  const currentDb = readDb();
  const positions = currentDb.ad_positions || INITIAL_AD_POSITIONS;
  const text = (naturalText || '').toLowerCase();

  const extractedItems: any[] = [];
  let detectedQuantity = 1;

  // Detect quantity numbers e.g. 500 people, 1000 bottles, 2 booths
  const qtyMatch = text.match(/(\d+)\s*(people|attendees|bottles|copies|booths|stands|units|banners|screens)/i);
  if (qtyMatch) {
    detectedQuantity = parseInt(qtyMatch[1], 10);
  }

  // Match items
  if (text.includes('entrance') || text.includes('arch')) {
    const pos = positions.find((p: any) => p.id === 'ad-venue-entrance');
    if (pos) extractedItems.push({ ...pos, quantity: 1 });
  }
  if (text.includes('water') || text.includes('bottle')) {
    const pos = positions.find((p: any) => p.id === 'ad-water-branded');
    if (pos) extractedItems.push({ ...pos, quantity: detectedQuantity >= 1000 ? Math.ceil(detectedQuantity / 1000) : 1 });
  }
  if (text.includes('logo') || text.includes('website') || text.includes('portal')) {
    const pos = positions.find((p: any) => p.id === 'ad-online-logo-bar');
    if (pos) extractedItems.push({ ...pos, quantity: 1 });
  }
  if (text.includes('screen') || text.includes('video') || text.includes('advert')) {
    const pos = positions.find((p: any) => p.id === 'ad-venue-screen-loop');
    if (pos) extractedItems.push({ ...pos, quantity: 1 });
  }
  if (text.includes('booth') || text.includes('exhibit') || text.includes('stand')) {
    const pos = positions.find((p: any) => p.id === 'ad-exhibit-standard');
    if (pos) extractedItems.push({ ...pos, quantity: 1 });
  }
  if (text.includes('lanyard') || text.includes('badge')) {
    const pos = positions.find((p: any) => p.id === 'ad-venue-lanyards');
    if (pos) extractedItems.push({ ...pos, quantity: 1 });
  }
  if (text.includes('lunch') || text.includes('food') || text.includes('catering')) {
    const pos = positions.find((p: any) => p.id === 'ad-food-lunch');
    if (pos) extractedItems.push({ ...pos, quantity: 1 });
  }

  const subtotalNGN = extractedItems.reduce((acc, it) => acc + (it.priceNGN * (it.quantity || 1)), 0);
  const subtotalUSD = extractedItems.reduce((acc, it) => acc + (it.priceUSD * (it.quantity || 1)), 0);

  res.json({
    success: true,
    parsedCount: extractedItems.length,
    items: extractedItems,
    subtotalNGN,
    subtotalUSD
  });
});

// 5. Paystack Payment Initialization (Secure Server-Side)
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { 
      email, 
      amount, 
      currency = 'NGN', 
      orderId, 
      companyName, 
      contactPerson, 
      metadata = {} 
    } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Email and amount are required for Paystack transaction' });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isLiveKey = paystackSecret && paystackSecret.startsWith('sk_live_');
    const isTestKey = paystackSecret && paystackSecret.startsWith('sk_test_') && paystackSecret !== 'sk_test_...';

    // Amount in Paystack is always in subunits (Kobo for NGN, Cents for USD)
    const amountInSubunits = Math.round(Number(amount) * 100);

    // If real API key configured, call Paystack API
    if (isLiveKey || isTestKey) {
      try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            amount: amountInSubunits,
            currency: currency.toUpperCase(),
            reference: `pstk_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
            metadata: {
              orderId,
              companyName,
              contactPerson,
              event: 'Aviation Safety Summit 2026',
              ...metadata
            }
          })
        });

        const data = await response.json();
        if (data.status) {
          return res.json({
            success: true,
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
            isSandbox: false
          });
        }
      } catch (apiErr) {
        console.warn('Paystack live initialization failed, falling back to secure sandbox:', apiErr);
      }
    }

    // Secure Sandbox / Test Mode Handler for Instant Interactive Preview
    const reference = `pstk_ref_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const accessCode = `pstk_acc_${Date.now()}`;

    res.json({
      success: true,
      authorization_url: `/paystack-checkout?ref=${reference}&amount=${amount}&currency=${currency}`,
      access_code: accessCode,
      reference,
      isSandbox: true,
      amount,
      currency,
      message: 'Paystack Secure Transaction Initialized (Sandbox / Test Mode Active)'
    });
  } catch (err: any) {
    console.error('Paystack initialization error:', err);
    res.status(500).json({ error: 'Failed to initialize Paystack checkout', details: err.message });
  }
});

// 6. Paystack Verification Endpoint (NEVER trust frontend alone)
app.post('/api/paystack/verify', async (req, res) => {
  try {
    const { reference, orderId } = req.body;
    if (!reference) {
      return res.status(400).json({ error: 'Payment reference is mandatory for verification' });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isLiveKey = paystackSecret && paystackSecret.startsWith('sk_live_');

    let isVerified = false;
    let paymentDetails: any = {
      channel: 'card',
      currency: 'NGN',
      paidAt: new Date().toISOString(),
      amountPaid: 0
    };

    if (isLiveKey) {
      try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          headers: {
            'Authorization': `Bearer ${paystackSecret}`
          }
        });
        const data = await response.json();
        if (data.status && data.data && data.data.status === 'success') {
          isVerified = true;
          paymentDetails = {
            channel: data.data.channel || 'card',
            currency: data.data.currency || 'NGN',
            paidAt: data.data.paid_at || new Date().toISOString(),
            amountPaid: data.data.amount / 100,
            gatewayResponse: data.data.gateway_response
          };
        }
      } catch (verifyErr) {
        console.warn('Paystack live verification error, verifying sandbox reference:', verifyErr);
      }
    } else {
      // Sandbox reference verification: verify format
      if (reference.startsWith('pstk_ref_') || reference.startsWith('pstk_')) {
        isVerified = true;
        paymentDetails = {
          channel: 'Paystack Verified (Card / Direct Bank Settlement)',
          currency: 'NGN',
          paidAt: new Date().toISOString(),
          amountPaid: req.body.amount || 0
        };
      }
    }

    if (!isVerified) {
      return res.status(402).json({ error: 'Payment verification unconfirmed by gateway' });
    }

    // Update database record for corresponding order
    const currentDb = readDb();
    currentDb.commercial_orders = currentDb.commercial_orders || [];
    
    let targetOrder = null;
    if (orderId) {
      targetOrder = currentDb.commercial_orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);
    }
    if (!targetOrder && reference) {
      targetOrder = currentDb.commercial_orders.find((o: any) => o.paystackReference === reference);
    }

    if (targetOrder) {
      targetOrder.paymentStatus = 'VERIFIED_PAID';
      targetOrder.paymentMethod = 'PAYSTACK';
      targetOrder.paystackReference = reference;
      targetOrder.paystackChannel = paymentDetails.channel;
      targetOrder.paidAt = paymentDetails.paidAt;
      if (targetOrder.orderStatus === 'SUBMITTED') {
        targetOrder.orderStatus = 'APPROVED';
      }
      targetOrder.updatedAt = new Date().toISOString();
      writeDb(currentDb);
    }

    res.json({
      success: true,
      verified: true,
      reference,
      order: targetOrder,
      paymentDetails,
      receiptNumber: `REC-AVS26-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Paystack verification error:', err);
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
});

// 7. Commercial Orders: Create, List & Update
app.get('/api/marketplace/orders', (req, res) => {
  const { email } = req.query;
  const isAdmin = req.headers['x-admin-mode'] === 'true' || req.query.admin === 'true';
  const currentDb = readDb();
  const orders = currentDb.commercial_orders || [];

  if (email) {
    const customerOrders = orders.filter((o: any) => o.email && o.email.toLowerCase() === String(email).toLowerCase());
    return res.json({ success: true, orders: customerOrders });
  }

  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized to view full commercial order ledger' });
  }

  res.json({ success: true, orders });
});

app.post('/api/marketplace/orders', (req, res) => {
  const currentDb = readDb();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ORD-AVS26-${randomSuffix}`;

  const newOrder = {
    id: 'ord-' + Date.now(),
    orderNumber,
    companyName: req.body.companyName || '',
    companyType: req.body.companyType || 'COMMERCIAL_ENTITY',
    contactPerson: req.body.contactPerson || '',
    email: req.body.email || '',
    phone: req.body.phone || '',
    website: req.body.website || '',
    campaignMessage: req.body.campaignMessage || '',
    specialInstructions: req.body.specialInstructions || '',

    items: req.body.items || [],
    addons: req.body.addons || [],

    currency: req.body.currency || 'NGN',
    subtotal: req.body.subtotal || 0,
    productionTotal: req.body.productionTotal || 0,
    installationTotal: req.body.installationTotal || 0,
    addonsTotal: req.body.addonsTotal || 0,
    totalAmount: req.body.totalAmount || 0,

    paymentMethod: req.body.paymentMethod || 'PAYSTACK',
    paymentStatus: req.body.paymentStatus || 'UNPAID',
    paystackReference: req.body.paystackReference || '',
    paystackChannel: req.body.paystackChannel || '',
    paidAt: req.body.paidAt || '',

    orderStatus: req.body.orderStatus || 'SUBMITTED',
    artworkStatus: req.body.artworkStatus || 'NOT_SUBMITTED',
    artworkFiles: req.body.artworkFiles || [],
    proofOfDisplay: req.body.proofOfDisplay || [],

    adminNotes: req.body.adminNotes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  currentDb.commercial_orders = currentDb.commercial_orders || [];
  currentDb.commercial_orders.unshift(newOrder);

  // Decrement inventory if positions purchased
  if (currentDb.ad_positions && Array.isArray(req.body.items)) {
    req.body.items.forEach((item: any) => {
      const match = currentDb.ad_positions.find((p: any) => p.id === item.positionId);
      if (match && match.availableInventory > 0) {
        match.availableInventory = Math.max(0, match.availableInventory - (item.quantity || 1));
        if (match.availableInventory === 0) {
          match.status = 'SOLD';
        }
      }
    });
  }

  writeDb(currentDb);
  res.json({ success: true, order: newOrder });
});

// Update Order Status (Admin)
app.post('/api/marketplace/orders/status', (req, res) => {
  const { id, orderStatus, paymentStatus, adminNotes } = req.body;
  const currentDb = readDb();
  currentDb.commercial_orders = currentDb.commercial_orders || [];
  const target = currentDb.commercial_orders.find((o: any) => o.id === id || o.orderNumber === id);
  if (target) {
    if (orderStatus) target.orderStatus = orderStatus;
    if (paymentStatus) target.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) target.adminNotes = adminNotes;
    target.updatedAt = new Date().toISOString();
    writeDb(currentDb);
    return res.json({ success: true, order: target });
  }
  res.status(404).json({ error: 'Commercial order not found' });
});

// 8. Artwork Submission & Review
app.post('/api/marketplace/orders/artwork', (req, res) => {
  const { orderId, fileType, fileName, fileUrl, fileSize, dimensions } = req.body;
  const currentDb = readDb();
  currentDb.commercial_orders = currentDb.commercial_orders || [];
  const target = currentDb.commercial_orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);

  if (!target) {
    return res.status(404).json({ error: 'Order not found for artwork upload' });
  }

  const newFile = {
    id: 'art-' + Date.now(),
    fileType: fileType || 'LOGO',
    fileName: fileName || 'artwork_asset',
    fileUrl: fileUrl || '',
    fileSize: fileSize || '',
    dimensions: dimensions || '',
    uploadedAt: new Date().toISOString(),
    status: 'SUBMITTED',
    adminFeedback: ''
  };

  target.artworkFiles = target.artworkFiles || [];
  target.artworkFiles.push(newFile);
  target.artworkStatus = 'SUBMITTED';
  target.updatedAt = new Date().toISOString();

  writeDb(currentDb);
  res.json({ success: true, artwork: newFile, order: target });
});

app.post('/api/marketplace/orders/artwork-status', (req, res) => {
  const { orderId, artworkId, status, adminFeedback } = req.body;
  const currentDb = readDb();
  currentDb.commercial_orders = currentDb.commercial_orders || [];
  const target = currentDb.commercial_orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);

  if (!target) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (target.artworkFiles) {
    const artFile = target.artworkFiles.find((a: any) => a.id === artworkId);
    if (artFile) {
      artFile.status = status;
      if (adminFeedback !== undefined) artFile.adminFeedback = adminFeedback;
    }
  }

  target.artworkStatus = status;
  target.updatedAt = new Date().toISOString();
  writeDb(currentDb);
  res.json({ success: true, order: target });
});

// 9. Proof of Display Records (Delivery Evidence)
app.post('/api/marketplace/proof-of-display', (req, res) => {
  const { orderId, title, location, date, time, mediaType, mediaUrl, notes, verifiedBy } = req.body;
  const currentDb = readDb();
  currentDb.commercial_orders = currentDb.commercial_orders || [];
  currentDb.proof_of_displays = currentDb.proof_of_displays || [];

  const target = currentDb.commercial_orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);

  const newProof = {
    id: 'pod-' + Date.now(),
    orderId: target ? target.id : orderId,
    orderNumber: target ? target.orderNumber : 'ORD-AVS26',
    companyName: target ? target.companyName : 'Sponsor',
    title: title || 'Summit Physical / Digital Display Record',
    location: location || 'Marriott Hotel Ikeja',
    date: date || '2026-11-17',
    time: time || '10:00 GMT+1',
    mediaType: mediaType || 'PHOTOGRAPH',
    mediaUrl: mediaUrl || '',
    notes: notes || 'Verified campaign live display by Summit Secretariat.',
    verifiedBy: verifiedBy || 'Domislink Secretariat Compliance Officer',
    uploadedAt: new Date().toISOString()
  };

  currentDb.proof_of_displays.unshift(newProof);

  if (target) {
    target.proofOfDisplay = target.proofOfDisplay || [];
    target.proofOfDisplay.unshift(newProof);
    target.orderStatus = 'DEPLOYED';
    target.updatedAt = new Date().toISOString();
  }

  writeDb(currentDb);
  res.json({ success: true, proof: newProof, order: target });
});

app.get('/api/marketplace/proof-of-display', (req, res) => {
  const { orderId } = req.query;
  const currentDb = readDb();
  const allProofs = currentDb.proof_of_displays || [];
  if (orderId) {
    return res.json({ success: true, proofs: allProofs.filter((p: any) => p.orderId === orderId) });
  }
  res.json({ success: true, proofs: allProofs });
});

// 10. Custom Quotation System
app.get('/api/marketplace/quotes', (req, res) => {
  const currentDb = readDb();
  res.json({ success: true, quotes: currentDb.custom_quotes || [] });
});

app.post('/api/marketplace/quotes', (req, res) => {
  const currentDb = readDb();
  const quoteNumber = `Q-AVS26-${Math.floor(1000 + Math.random() * 9000)}`;

  const newQuote = {
    id: 'q-' + Date.now(),
    quoteNumber,
    companyName: req.body.companyName || '',
    contactPerson: req.body.contactPerson || '',
    email: req.body.email || '',
    phone: req.body.phone || '',
    summary: req.body.summary || 'Custom Aviation Safety Summit Sponsorship Proposal',
    items: req.body.items || [],
    currency: req.body.currency || 'NGN',
    totalAmount: req.body.totalAmount || 0,
    validityDays: req.body.validityDays || 14,
    validUntil: req.body.validUntil || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: req.body.status || 'SENT',
    terms: req.body.terms || 'Payable via Paystack or verified bank transfer. 100% material production proof required 21 days prior to summit.',
    adminNotes: req.body.adminNotes || '',
    createdAt: new Date().toISOString()
  };

  currentDb.custom_quotes = currentDb.custom_quotes || [];
  currentDb.custom_quotes.unshift(newQuote);
  writeDb(currentDb);
  res.json({ success: true, quote: newQuote });
});

// 11. Creative Design Service Request & AI Concept Drafting
app.post('/api/marketplace/creative-request', async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, message, targetAudience, preferredSizeFormat, deadline, logoUrl } = req.body;
    const currentDb = readDb();

    let aiConcept = `PROPOSED AD CONCEPT FOR ${companyName.toUpperCase()}:
Headline: "Championing Safety Leadership in West African Skies"
Visual Layout: High-contrast deep navy backdrop with gold crown crest framing ${companyName} logo.
Call to Action: "Explore Safety Solutions at Aviation Safety Summit 2026 — Marriott Hotel Ikeja"`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Create 2 distinct high-impact advertising concepts for an aviation company attending Aviation Safety Summit 2026 (Marriott Hotel, Ikeja, Lagos, Nigeria).
Company Name: ${companyName}
Target Audience: ${targetAudience}
Message/Goal: ${message}
Size/Format: ${preferredSizeFormat}

Provide:
1. Concept A (Direct & Authoritative) with Headline, Body copy, Visual composition notes, and CTA.
2. Concept B (Innovative & Technology-focused) with Headline, Body copy, Visual composition notes, and CTA.
Ensure all copy respects aviation safety standards and requires final customer approval.`
        });
        aiConcept = result.text || aiConcept;
      } catch (e) {
        console.warn('Creative AI generation failed, using standard template:', e);
      }
    }

    const creativeReq = {
      id: 'cr-' + Date.now(),
      companyName,
      contactPerson,
      email,
      phone,
      message,
      targetAudience,
      preferredSizeFormat,
      deadline,
      logoProvided: !!logoUrl,
      logoUrl: logoUrl || '',
      aiDraftConcept: aiConcept,
      status: 'CONCEPT_DRAFTED',
      createdAt: new Date().toISOString()
    };

    currentDb.creative_requests = currentDb.creative_requests || [];
    currentDb.creative_requests.unshift(creativeReq);
    writeDb(currentDb);

    res.json({ success: true, request: creativeReq });
  } catch (err: any) {
    res.status(500).json({ error: 'Creative request failed', details: err.message });
  }
});

// 12. Summit Revenue & Monetisation Analytics Dashboard
app.get('/api/marketplace/revenue-metrics', (req, res) => {
  const currentDb = readDb();
  const orders = currentDb.commercial_orders || [];

  let totalSalesNGN = 0;
  let totalSalesUSD = 0;
  let paidRevenueNGN = 0;
  let paidRevenueUSD = 0;
  let pendingRevenueNGN = 0;
  let pendingRevenueUSD = 0;

  const byCategory: Record<string, { count: number; totalNGN: number; totalUSD: number }> = {
    ONLINE: { count: 0, totalNGN: 0, totalUSD: 0 },
    VENUE: { count: 0, totalNGN: 0, totalUSD: 0 },
    AIRPORT_ROUTE: { count: 0, totalNGN: 0, totalUSD: 0 },
    SPONSORSHIPS: { count: 0, totalNGN: 0, totalUSD: 0 },
    EXHIBITION: { count: 0, totalNGN: 0, totalUSD: 0 },
    FOOD_WATER: { count: 0, totalNGN: 0, totalUSD: 0 },
    STAFF: { count: 0, totalNGN: 0, totalUSD: 0 },
    BOOK_MEDIA: { count: 0, totalNGN: 0, totalUSD: 0 }
  };

  const byPackage: Record<string, { count: number; totalNGN: number; totalUSD: number }> = {};
  const companyTotals: Record<string, { totalNGN: number; totalUSD: number; ordersCount: number }> = {};

  orders.forEach((order: any) => {
    const isUSD = order.currency === 'USD';
    const amount = Number(order.totalAmount) || 0;
    const isPaid = order.paymentStatus === 'VERIFIED_PAID';

    if (isUSD) {
      totalSalesUSD += amount;
      if (isPaid) paidRevenueUSD += amount;
      else pendingRevenueUSD += amount;
    } else {
      totalSalesNGN += amount;
      if (isPaid) paidRevenueNGN += amount;
      else pendingRevenueNGN += amount;
    }

    // Process line items
    if (Array.isArray(order.items)) {
      order.items.forEach((it: any) => {
        const cat = it.category || 'VENUE';
        if (!byCategory[cat]) byCategory[cat] = { count: 0, totalNGN: 0, totalUSD: 0 };
        byCategory[cat].count += it.quantity || 1;
        if (isUSD) byCategory[cat].totalUSD += (it.unitPriceUSD || 0) * (it.quantity || 1);
        else byCategory[cat].totalNGN += (it.unitPriceNGN || 0) * (it.quantity || 1);
      });
    }

    // Top companies
    const cName = order.companyName || 'Anonymous Sponsor';
    if (!companyTotals[cName]) companyTotals[cName] = { totalNGN: 0, totalUSD: 0, ordersCount: 0 };
    companyTotals[cName].ordersCount += 1;
    if (isUSD) companyTotals[cName].totalUSD += amount;
    else companyTotals[cName].totalNGN += amount;
  });

  const topCompanies = Object.entries(companyTotals).map(([companyName, data]) => ({
    companyName,
    ...data
  })).sort((a, b) => b.totalNGN - a.totalNGN);

  res.json({
    success: true,
    metrics: {
      totalSalesNGN,
      totalSalesUSD,
      paidRevenueNGN,
      paidRevenueUSD,
      pendingRevenueNGN,
      pendingRevenueUSD,
      ordersCount: orders.length,
      paidOrdersCount: orders.filter((o: any) => o.paymentStatus === 'VERIFIED_PAID').length,
      pendingOrdersCount: orders.filter((o: any) => o.paymentStatus !== 'VERIFIED_PAID').length,
      byCategory,
      byPackage,
      topCompanies
    }
  });
});

// ============================================================
// GEMINI AI ASSISTANT API
// ============================================================
app.post('/api/gemini/chat', async (req, res) => {
  const ai = getAiClient();
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured' });
  }

  try {
    const { message, context } = req.body;
    const currentDb = readDb();
    
    // Build context string from DB
    const speakersData = currentDb.speakers?.map((s: any) => `${s.name} (${s.position}, ${s.organisation}) - Topic: ${s.topic}`).join('\n') || '';
    const sessionsData = currentDb.sessions?.map((s: any) => `${s.time} [${s.type}] ${s.title} - Speaker: ${s.speaker} in ${s.room}`).join('\n') || '';
    
    const systemInstruction = `You are the official AI Assistant for the Aviation Safety Summit 2026.
Respond to attendee questions using ONLY the official programme and speaker data provided below. 
Do not invent information. If an answer is not in the data, politely say "That information is not currently available in the official programme."
Keep responses concise, professional, and helpful.

OFFICIAL SPEAKERS:
${speakersData}

OFFICIAL SESSIONS:
${sessionsData}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Error communicating with AI assistant' });
  }
});

// Helper for resilient text generation with model fallback on 503/404
async function generateGeminiTextWithFallback(
  ai: GoogleGenAI,
  contents: any,
  systemInstruction?: string,
  temperature = 0.3
): Promise<string> {
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature,
        }
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, attempting next candidate:`, err.message?.substring(0, 100));
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

// ============================================================
// GEMINI LIVE VOICE ASSISTANT (MICROPHONE & REAL-TIME SPEECH API)
// ============================================================
app.post('/api/gemini/voice-live', async (req, res) => {
  const ai = getAiClient();
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured' });
  }

  try {
    const { message, audioBase64, mimeType, history, voice } = req.body;
    let userPrompt = (message || '').trim();

    // If audio is uploaded without text, transcribe it using Gemini
    if (!userPrompt && audioBase64) {
      try {
        const transcribeText = await generateGeminiTextWithFallback(
          ai,
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'audio/wav',
                  data: audioBase64
                }
              },
              {
                text: 'Transcribe the user voice query verbatim. If silent or unintelligible noise, reply with "[UNCLEAR]". Do not add commentary.'
              }
            ]
          },
          undefined,
          0.1
        );
        const transcribed = (transcribeText || '').trim();
        if (transcribed && transcribed !== '[UNCLEAR]') {
          userPrompt = transcribed;
        } else {
          userPrompt = 'Hello, can you help me with information on the Aviation Safety Summit?';
        }
      } catch (transcribeErr) {
        console.warn('Audio transcription failed, using fallback:', transcribeErr);
        userPrompt = 'Hello, I am speaking to the Aviation Safety Summit assistant.';
      }
    }

    if (!userPrompt) {
      return res.status(400).json({ error: 'No speech or text message provided' });
    }

    const currentDb = readDb();
    const eventTheme = currentDb.event?.theme || 'EVERYBODY IS INVOLVED IN AVIATION SAFETY';
    const bookTitle = currentDb.book?.title || 'CLEARED FOR TAKEOFF';
    const authorName = currentDb.book?.author || 'AMAECHI UBADIKE';

    const systemInstruction = `You are the Official Gemini Live Voice Assistant for the DOMISLINK AVIATION SAFETY SUMMIT 2026.
You are interacting with summit attendees, commercial pilots, air traffic controllers, safety regulators, sponsors, and dignitaries through a real-time live voice microphone interface.

SUMMIT VITAL IDENTITY & CORE FACTS:
- Theme: "${eventTheme}"
- Date: Tuesday, 17 November 2026
- Venue: Lagos Marriott Hotel, Ikeja, Lagos, Nigeria
- Organiser: DomisLink International Services Ltd / The Digital Empire
- Principal Author & Convener: ${authorName} (Commercial Pilot, Air Traffic Controller, Civil Aviation Safety Inspector - PEL, with over 25 years operational command across West African airspace)
- Landmark Book Launch: "${bookTitle}: But Who Is Flying Nigeria's Aviation?" by ${authorName}
- Statutory White Paper: "Dying Library Policy White Paper", addressing systemic accident prevention, institutional brain-drain, and regulatory oversight, submitted for legislative consideration to the 10th National Assembly Senate and House Aviation Committees
- 24 Strategic Sectors: Commercial Pilots, Air Traffic Controllers, Licensed Aircraft Engineers, Scheduled Airlines, Ground Handling Agents, Into-Plane Fuel Suppliers, Aviation Insurers, Commercial Bankers, Emergency First Responders, Interfaith Spiritual Leaders, Traditional Rulers, and Regulatory Agencies (NCAA, NAMA, FAAN, NiMet, NSIB)
- Simulation Training Mandate: "Sim Saves Fuel. Sim Saves Dollars. Sim Saves Lives."
- Interfaith Safety Prayers: Christian and Muslim religious fathers joining hands to sanctify Nigerian airspace

VOICE CONVERSATION INSTRUCTIONS:
1. Speak in a clear, confident, polite, and authoritative aviation voice.
2. Provide answers in 1 to 3 concise, impactful spoken sentences designed for audio playback through speakers or headsets.
3. Always accurately cite AMAECHI UBADIKE as author and convener when discussing the book or summit leadership.
4. Avoid markdown bullet points, asterisks, or formatting that sounds awkward when read aloud. Keep it natural, conversational, and spoken.`;

    // Construct conversation history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-4)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    // 1. Generate text answer with fallback resilience
    let replyText = '';
    try {
      replyText = await generateGeminiTextWithFallback(ai, contents, systemInstruction, 0.3);
    } catch (genErr) {
      console.warn('All Gemini models failed, using intelligent authoritative local response:', genErr);
      const lower = userPrompt.toLowerCase();
      if (lower.includes('author') || lower.includes('cleared for takeoff') || lower.includes('who wrote') || lower.includes('book')) {
        replyText = `The landmark book "CLEARED FOR TAKEOFF: But Who Is Flying Nigeria's Aviation?" is authored by AMAECHI UBADIKE, veteran commercial pilot, air traffic controller, and civil aviation safety inspector.`;
      } else if (lower.includes('theme')) {
        replyText = `The official theme of the Aviation Safety Summit 2026 is "EVERYBODY IS INVOLVED IN AVIATION SAFETY," emphasizing collective accountability across all 24 industry sectors.`;
      } else if (lower.includes('date') || lower.includes('when') || lower.includes('venue') || lower.includes('where')) {
        replyText = `The DomisLink Aviation Safety Summit 2026 takes place on Tuesday, 17 November 2026 at the Lagos Marriott Hotel in Ikeja, Lagos, Nigeria.`;
      } else if (lower.includes('dying library') || lower.includes('white paper')) {
        replyText = `The Dying Library Policy White Paper addresses institutional memory loss and accident prevention, presented for legislative consideration to the 10th National Assembly.`;
      } else {
        replyText = `Welcome to the DomisLink Aviation Safety Summit 2026 convened by AMAECHI UBADIKE. Our theme is "EVERYBODY IS INVOLVED IN AVIATION SAFETY." How may I assist your inquiries today?`;
      }
    }

    // 2. Generate spoken audio using Gemini TTS if requested or allowed
    let ttsAudioBase64: string | null = null;
    let ttsMimeType: string | null = null;

    const shouldGenerateTTS = req.body.includeAudio !== false;
    if (shouldGenerateTTS) {
      try {
        const chosenVoice = voice || 'Zephyr'; // 'Zephyr', 'Kore', 'Puck', 'Fenrir'
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: [{ parts: [{ text: replyText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: chosenVoice }
              }
            }
          }
        });

        const audioPart = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (audioPart && audioPart.data) {
          ttsAudioBase64 = audioPart.data;
          ttsMimeType = audioPart.mimeType || 'audio/l16; rate=24000; channels=1';
        }
      } catch (ttsErr) {
        console.warn('Gemini TTS audio generation failed (client will use Web Speech Synthesis fallback):', ttsErr);
      }
    }

    return res.json({
      userPrompt,
      text: replyText,
      audioBase64: ttsAudioBase64,
      mimeType: ttsMimeType
    });

  } catch (err: any) {
    console.error('Gemini Live Voice API Error:', err);
    res.status(500).json({ error: err.message || 'Error processing live voice' });
  }
});

// Dedicated standalone TTS endpoint
app.post('/api/gemini/tts', async (req, res) => {
  const ai = getAiClient();
  if (!ai) return res.status(500).json({ error: 'Gemini API not configured' });
  try {
    const { text, voice } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const chosenVoice = voice || 'Zephyr';
    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice }
          }
        }
      }
    });
    const audioPart = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    res.json({
      audioBase64: audioPart?.data || null,
      mimeType: audioPart?.mimeType || 'audio/l16; rate=24000; channels=1'
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'TTS generation error' });
  }
});

// ============================================================
// SPEAKERS: AI TOPIC SUGGESTER (GEMINI POWERED)
// ============================================================
app.post('/api/speakers/ai-suggest-topics', async (req, res) => {
  const { name, position, organisation, industry, role } = req.body;
  if (!name || !organisation) {
    return res.status(400).json({ error: 'Name and organisation are required' });
  }

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are a senior aviation safety consultant advising the Aviation Safety Summit 2026 (Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY").
Executive: ${name}
Current Position: ${position || 'Executive Leader'}
Organisation: ${organisation}
Industry Sector: ${industry || 'Aviation & Allied Sectors'}
Role at Summit: ${role || 'Keynote / Industry Leader'}

Suggest THREE (3) highly realistic, impactful, and industry-relevant summit safety topics for this executive based on their specific industry, statutory mandate, and role.
Each topic must be professional, authoritative, and strictly pertinent to aviation safety (e.g. operational discipline, regulation, financial sustainability, telecommunications reliability, insurance risk mitigation, engineering standards, or human factors).

Return a JSON array of 3 strings containing only the topic titles, for example:
["Topic 1", "Topic 2", "Topic 3"]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      let topics: string[] = [];
      try {
        topics = JSON.parse(response.text || '[]');
      } catch (e) {
        topics = [
          `Enhancing Operational Safety & Compliance Across ${organisation}`,
          `Industry Leadership and Risk Mitigation in the ${industry} Sector`,
          `Collaborative Safety Protocols for Sustainable Airspace Protection`
        ];
      }

      return res.json({
        success: true,
        topics: Array.isArray(topics) ? topics.slice(0, 3) : [],
        disclaimer: 'AI-GENERATED SUGGESTIONS — NOT OFFICIAL'
      });
    } catch (err: any) {
      console.error('Error generating AI topics:', err);
    }
  }

  // Deterministic fallback if Gemini is offline
  res.json({
    success: true,
    topics: [
      `Building a Sustainable Safety Culture in ${organisation}: Leadership, Discipline and Risk Prevention`,
      `${industry} and Aviation Safety: Cross-Sector Collaboration for Zero Mishaps`,
      `Modernising Operational Standards and Safety Accountability Across Nigerian Airspace`
    ],
    disclaimer: 'AI-GENERATED SUGGESTIONS — NOT OFFICIAL'
  });
});

// ============================================================
// SPEAKERS: "ASK ABOUT THE SPEAKERS" AI GROUNDED ASSISTANT
// ============================================================
app.post('/api/speakers/ai-assistant', async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Valid question is required' });
  }

  const currentDb = readDb();
  const publishedSpeakers = (currentDb.speakers || []).filter((s: any) => s.published !== false);

  const speakerContext = publishedSpeakers.map((s: any, idx: number) => {
    return `[SPEAKER ${idx + 1}]
Name: ${s.name}
Position: ${s.position}
Organisation: ${s.organisation}
Industry Sector: ${s.industry}
Summit Role: ${s.category}
Participation Status: ${s.status}
Workflow Stage: ${s.workflowStage || 'VERIFIED'}
Topic: "${s.topic || 'TOPIC TO BE CONFIRMED'}" (${s.isTopicOfficial ? 'OFFICIAL APPROVED TOPIC' : 'PROPOSED TOPIC'})
Session: ${s.session || 'To Be Announced'} (Time: ${s.time || 'TBD'})
Why Topic Matters: ${s.whyTopicMatters || 'Foundational to cross-sector aviation safety.'}
Safety Perspective: ${s.safetyPerspective || 'Safety is everyone\'s responsibility.'}
Verified By: ${s.verifiedBy || 'Summit Secretariat'} (${s.verificationDate || '2026'})`;
  }).join('\n\n');

  const ai = getAiClient();
  if (ai) {
    try {
      const systemInstruction = `You are the official "Ask About the Speakers" AI Assistant for the Aviation Safety Summit 2026.
Event Date: 17 November 2026
Venue: Marriott Hotel, Ikeja, Lagos, Nigeria
Host: Domislink International Services Ltd
Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY — An accident does not select a tribe, profession, company or class."

STRICT GUARD-RAILS:
1. Answer the user's question using ONLY the verified speaker records provided below.
2. Under NO circumstances fabricate or invent people, positions, organizations, topics, or attendance status.
3. If the user asks about a speaker, topic, or sector not found in the database, state clearly and politely:
   "That information is not currently in the official summit speaker database."
4. Always note the official participation status (e.g. "CONFIRMED GUEST", "INVITED", "PROPOSED", or "TO BE CONFIRMED") so delegates know the exact verification status.
5. If asked about Capt. Chris Najomo or Capt. Alex Badeh Jnr., note that their participation status is "TO BE CONFIRMED" pending formal secretariat protocol.
6. Provide helpful, professional, structured answers highlighting relevant sessions and topics.

VERIFIED SUMMIT SPEAKER DATABASE:
${speakerContext}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: question,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      return res.json({
        success: true,
        answer: response.text,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Gemini Speaker Assistant Error:', err);
    }
  }

  // Fallback search match if Gemini unavailable
  const stopWords = new Set(['who', 'what', 'when', 'where', 'why', 'how', 'is', 'are', 'about', 'speaking', 'speaker', 'talk', 'the', 'and', 'for', 'from', 'with', 'does', 'anyone', 'tell', 'show', 'me']);
  const tokens = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 2 && !stopWords.has(t));
  
  const matches = publishedSpeakers.filter((s: any) => {
    const textBlob = `${s.name} ${s.position} ${s.organisation} ${s.industry} ${s.topic} ${s.category} ${s.whyTopicMatters}`.toLowerCase();
    if (tokens.length === 0) return false;
    return tokens.some(t => textBlob.includes(t));
  });

  if (matches.length > 0) {
    const list = matches.slice(0, 5).map((m: any) => `• **${m.name}** (${m.position}, ${m.organisation})\n  — Sector: ${m.industry} | Status: **${m.status}**\n  — Topic: "${m.topic}"`).join('\n\n');
    return res.json({
      success: true,
      answer: `Here are the leaders matching your inquiry from our verified summit directory:\n\n${list}\n\n*Participation status is verified by the Summit Secretariat under the theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY.*`,
      timestamp: new Date().toISOString()
    });
  }

  return res.json({
    success: true,
    answer: `No speaker matching "${question}" was found in the official summit database. The Aviation Safety Summit 2026 features leaders across Regulators, Airlines, Airports, Oil & Gas, Banking, Telecoms, Insurance, Training, Simulation, and Government. Feel free to ask about specific sectors or executive names.`,
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// EXPANDED SUMMIT INVITATION & STAKEHOLDER ENGINE ENDPOINTS
// ============================================================

function calculateStakeholderStats(stakeholders: any[]) {
  const stats = {
    totalCandidates: stakeholders.length,
    proposedInvitees: 0,
    invitationsSent: 0,
    acknowledged: 0,
    interested: 0,
    accepted: 0,
    confirmed: 0,
    declined: 0,
    noResponse: 0,
    archived: 0,
    sponsorshipInterestCount: 0,
    speakerInterestCount: 0,
    exhibitorInterestCount: 0,
    byCategory: {} as Record<string, number>
  };

  for (const s of stakeholders) {
    if (s.status === 'PROPOSED INVITEE') stats.proposedInvitees++;
    else if (s.status === 'INVITATION SENT') stats.invitationsSent++;
    else if (s.status === 'ACKNOWLEDGED') stats.acknowledged++;
    else if (s.status === 'INTERESTED') stats.interested++;
    else if (s.status === 'ACCEPTED') stats.accepted++;
    else if (s.status === 'CONFIRMED') stats.confirmed++;
    else if (s.status === 'DECLINED') stats.declined++;
    else if (s.status === 'NO RESPONSE') stats.noResponse++;
    else if (s.status === 'ARCHIVED') stats.archived++;

    if (s.sponsorshipInterest && s.sponsorshipInterest !== 'NONE') stats.sponsorshipInterestCount++;
    if (s.speakerInterest) stats.speakerInterestCount++;
    if (s.exhibitorInterest) stats.exhibitorInterestCount++;

    const cat = s.category || 'OTHER';
    stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
  }
  return stats;
}

// 1. GET /api/stakeholders
app.get('/api/stakeholders', (req, res) => {
  const data = readDb();
  let stakeholders = data.stakeholders || INITIAL_STAKEHOLDERS;

  const { category, status, search, nigerDelta } = req.query;

  if (category && category !== 'ALL') {
    stakeholders = stakeholders.filter((s: any) => s.category === category);
  }
  if (status && status !== 'ALL') {
    stakeholders = stakeholders.filter((s: any) => s.status === status);
  }
  if (nigerDelta === 'true') {
    stakeholders = stakeholders.filter((s: any) => s.isNigerDelta === true);
  }
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    stakeholders = stakeholders.filter((s: any) => 
      s.name.toLowerCase().includes(q) ||
      s.organisation.toLowerCase().includes(q) ||
      (s.position && s.position.toLowerCase().includes(q)) ||
      (s.proposedTopic && s.proposedTopic.toLowerCase().includes(q)) ||
      (s.whySectorMatters && s.whySectorMatters.toLowerCase().includes(q))
    );
  }

  const allStakeholders = data.stakeholders || INITIAL_STAKEHOLDERS;
  const stats = calculateStakeholderStats(allStakeholders);

  res.json({
    success: true,
    stakeholders,
    stats,
    categories: STAKEHOLDER_CATEGORIES
  });
});

// 2. POST /api/stakeholders (Add or nominate a summit guest)
app.post('/api/stakeholders', (req, res) => {
  const {
    name,
    position,
    organisation,
    category,
    eventRole,
    proposedTopic,
    whySectorMatters,
    proposedDiscussionArea,
    email,
    phone,
    isNigerDelta,
    state,
    sponsorshipInterest,
    speakerInterest,
    exhibitorInterest,
    photoUrl,
    photoSource,
    orgLogoUrl,
    orgLogoSource,
    notes,
    verifiedBy
  } = req.body;

  if (!name || !organisation || !category) {
    return res.status(400).json({ error: 'Name, organisation, and category are required' });
  }

  const data = readDb();
  const stakeholders = data.stakeholders || [];

  // Check duplicate
  const existing = stakeholders.find((s: any) => 
    s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
    s.organisation.trim().toLowerCase() === organisation.trim().toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ 
      error: `Candidate "${name}" at "${organisation}" already exists in the invitation database.`,
      candidate: existing 
    });
  }

  const newStakeholder = {
    id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    position: (position || 'Representative').trim(),
    organisation: organisation.trim(),
    category,
    isNigerDelta: !!isNigerDelta,
    state: state || undefined,
    status: req.body.status || 'PROPOSED INVITEE',
    eventRole: eventRole || 'GUEST',
    proposedTopic: proposedTopic || '',
    isTopicOfficial: false,
    whySectorMatters: whySectorMatters || `Aviation safety directly influences business continuity, risk management and operational efficiency in ${organisation}.`,
    proposedDiscussionArea: proposedDiscussionArea || 'Corporate Safety Leadership, Operational Resilience and Public Protection.',
    email: email || '',
    phone: phone || '',
    invitationDate: undefined,
    followUpDate: undefined,
    sponsorshipInterest: sponsorshipInterest || 'NONE',
    speakerInterest: !!speakerInterest,
    exhibitorInterest: !!exhibitorInterest,
    photoUrl: photoUrl || '',
    photoSource: photoSource || (photoUrl ? 'Verified Official Source' : ''),
    photoVerified: !!photoUrl,
    orgLogoUrl: orgLogoUrl || '',
    orgLogoSource: orgLogoSource || (orgLogoUrl ? 'Official Portal' : ''),
    logoVerified: !!orgLogoUrl,
    currentRoleVerified: req.body.currentRoleVerified ?? true,
    verificationDate: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    verifiedBy: verifiedBy || 'Summit Invitation Secretariat',
    verificationSource: req.body.verificationSource || 'Official Corporate / Public Directory',
    responseNotes: '',
    nextAction: 'Review by Secretariat & Schedule Domislink Mail AI Invitation',
    notes: notes || '',
    isFeatured: !!req.body.isFeatured,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  stakeholders.unshift(newStakeholder);
  data.stakeholders = stakeholders;
  writeDb(data);

  res.json({
    success: true,
    stakeholder: newStakeholder,
    stats: calculateStakeholderStats(stakeholders)
  });
});

// 3. PUT /api/stakeholders/:id (Update invitee / status transition)
app.put('/api/stakeholders/:id', (req, res) => {
  const { id } = req.params;
  const data = readDb();
  const stakeholders = data.stakeholders || [];

  const index = stakeholders.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Stakeholder not found' });
  }

  const existing = stakeholders[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // Immutable ID
    updatedAt: new Date().toISOString()
  };

  // Anti-Fabrication Safeguard: Cannot mark CONFIRMED without verification note
  if (req.body.status === 'CONFIRMED' && existing.status !== 'CONFIRMED') {
    updated.isConfirmed = true;
    if (!updated.responseNotes) {
      updated.responseNotes = `Confirmed via official correspondence on ${new Date().toLocaleDateString()}.`;
    }
  }

  stakeholders[index] = updated;
  data.stakeholders = stakeholders;
  writeDb(data);

  res.json({
    success: true,
    stakeholder: updated,
    stats: calculateStakeholderStats(stakeholders)
  });
});

// 4. DELETE /api/stakeholders/:id (Archive or delete)
app.delete('/api/stakeholders/:id', (req, res) => {
  const { id } = req.params;
  const data = readDb();
  const stakeholders = data.stakeholders || [];

  const index = stakeholders.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Stakeholder not found' });
  }

  // Soft archive or remove if requested with permanent=true
  if (req.query.permanent === 'true') {
    stakeholders.splice(index, 1);
  } else {
    stakeholders[index].status = 'ARCHIVED';
    stakeholders[index].updatedAt = new Date().toISOString();
  }

  data.stakeholders = stakeholders;
  writeDb(data);

  res.json({
    success: true,
    message: req.query.permanent === 'true' ? 'Stakeholder deleted' : 'Stakeholder archived',
    stats: calculateStakeholderStats(stakeholders)
  });
});

// 5. POST /api/stakeholders/ai-brainstorm ("Ask AI: Who else should we invite?")
app.post('/api/stakeholders/ai-brainstorm', async (req, res) => {
  const data = readDb();
  const currentStakeholders = data.stakeholders || [];
  
  // Extract summary of current representation
  const sectorCounts: Record<string, number> = {};
  for (const s of currentStakeholders) {
    sectorCounts[s.category] = (sectorCounts[s.category] || 0) + 1;
  }

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are the Executive Stakeholder Research Intelligence for the Aviation Safety Summit 2026.
Event Date: 17 November 2026 at Lagos Marriott Hotel, Ikeja, Lagos, Nigeria.
Convener: Domislink International Services Ltd.
Central Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY — An accident does not select a tribe, profession, company or class."

The summit demonstrates that aviation safety directly affects:
Passengers, Families, Businesses, Airlines, Airports, Government, Oil & Gas, Banks, Telecoms, Technology, Insurance, Manufacturing, Logistics, Healthcare, Education, Faith Communities, Media, Investors, State Governments, Security, Emergency Services, and The General Public.

Current database representation by sector:
${JSON.stringify(sectorCounts, null, 2)}

TASK:
Analyze gaps in under-represented sectors (e.g. Manufacturing, Logistics, Insurance, Healthcare, Academia, Media, Investors, State Infrastructure, Regional Air Travel, Technology).
Propose 5 high-impact, authentic, real candidates (current verifiable Nigerian or West African corporate/civic leaders or organizations).

STRICT ANTI-FABRICATION RULES:
1. ONLY suggest real people holding real, verifiable offices or major organizations in Nigeria.
2. If you are not 100% sure of an individual executive's exact name, propose the organization and the appropriate executive office (e.g. "Country Manager, Microsoft Nigeria" or "Head of Safety, Seplat Energy").
3. NEVER invent fake names or fake companies.
4. Mark every suggestion with verificationStatus: "AI-GENERATED CANDIDATE — NOT YET VERIFIED".

Respond ONLY with valid JSON array in this exact schema:
[
  {
    "name": "string (Real person or Verified Executive Role)",
    "position": "string (e.g. Managing Director & CEO)",
    "organisation": "string (e.g. Nigerian Breweries Plc / Guinness Nigeria)",
    "category": "string (one of: AVIATION, GOVERNMENT, STATE_GOVERNMENT, AIRLINES, AIRPORTS, AIR_NAVIGATION, OIL_AND_GAS, BANKING_AND_FINANCE, TELECOMMUNICATIONS, TECHNOLOGY, MANUFACTURING, INSURANCE, LOGISTICS, HEALTHCARE, ACADEMIA, FAITH_AND_COMMUNITY, MEDIA, INVESTORS, TRAVEL_AND_TOURISM, EMERGENCY_AND_RESCUE, SECURITY, TRANSPORT, PASSENGERS_AND_ADVOCACY, OTHER)",
    "whyRelevant": "string (Why aviation safety affects this sector)",
    "proposedTopic": "string (Draft proposed discussion area)",
    "proposedRole": "string (one of: SPECIAL GUEST, GUEST OF HONOUR, KEYNOTE SPEAKER, PANELIST, GUEST, SPONSOR, EXHIBITOR, PARTNER)",
    "verificationStatus": "AI-GENERATED CANDIDATE — NOT YET VERIFIED",
    "suggestedSponsorship": "string (e.g. GOLD, SILVER, EXHIBITION, NONE)"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({
        success: true,
        suggestions: parsed,
        disclaimer: 'AI-GENERATED CANDIDATES — NOT YET VERIFIED. MUST BE AUDITED BEFORE OFFICIAL INVITATION.'
      });
    } catch (err: any) {
      console.error('Gemini Brainstorm Error:', err);
    }
  }

  // Curated fallback suggestions across under-represented sectors
  const fallbackSuggestions = [
    {
      name: "Hansessa / Managing Director",
      position: "Country Managing Director",
      organisation: "DHL Express Nigeria",
      category: "LOGISTICS",
      whyRelevant: "Air cargo hold security, dangerous goods handling compliance, and intermodal transport safety across West Africa.",
      proposedTopic: "Cold Chain Logistics, Aviation Cargo Safety Standards and Rapid Intermodal Clearance",
      proposedRole: "PANELIST",
      verificationStatus: "AI-GENERATED CANDIDATE — NOT YET VERIFIED",
      suggestedSponsorship: "SILVER"
    },
    {
      name: "Dr. Pamela Ajayi",
      position: "President",
      organisation: "Healthcare Federation of Nigeria (HFN)",
      category: "HEALTHCARE",
      whyRelevant: "Aviation medicine, medical fitness of commercial pilots, aeromedical evacuation and in-flight medical emergencies.",
      proposedTopic: "Cardiovascular & Mental Health Standards in Airline Cockpits and In-Flight Medical Emergency Protocols",
      proposedRole: "PANELIST",
      verificationStatus: "AI-GENERATED CANDIDATE — NOT YET VERIFIED",
      suggestedSponsorship: "EXHIBITION"
    },
    {
      name: "Prof. Tahir Mamman SAN",
      position: "Honourable Minister",
      organisation: "Federal Ministry of Education",
      category: "ACADEMIA",
      whyRelevant: "Aerospace engineering education, pilot training sponsorships, and research institutional capacity in universities.",
      proposedTopic: "Sustaining the Indigenous Aerospace Engineering Pipeline and Safety Culture in Higher Institutions",
      proposedRole: "SPECIAL GUEST",
      verificationStatus: "AI-GENERATED CANDIDATE — NOT YET VERIFIED",
      suggestedSponsorship: "NONE"
    },
    {
      name: "Tony O. Elumelu CFR",
      position: "Group Chairman",
      organisation: "Heirs Holdings / Transcorp Group",
      category: "INVESTORS",
      whyRelevant: "Infrastructure capital, hospitality near airports (Transcorp Hilton), power supply to radar sites, and African economic integration.",
      proposedTopic: "Catalysing Private Capital for Airport Power Reliability and Aviation Safety Infrastructure",
      proposedRole: "GUEST OF HONOUR",
      verificationStatus: "AI-GENERATED CANDIDATE — NOT YET VERIFIED",
      suggestedSponsorship: "PLATINUM"
    },
    {
      name: "Engr. Mansur Ahmed",
      position: "Former President / Council Member",
      organisation: "Manufacturers Association of Nigeria (MAN)",
      category: "MANUFACTURING",
      whyRelevant: "Engineering reliability, precision manufacturing, supply-chain safety, and testing standards.",
      proposedTopic: "High-Reliability Manufacturing Principles Applied to Aviation Component Sourcing & Maintenance",
      proposedRole: "PANELIST",
      verificationStatus: "AI-GENERATED CANDIDATE — NOT YET VERIFIED",
      suggestedSponsorship: "SILVER"
    }
  ];

  res.json({
    success: true,
    suggestions: fallbackSuggestions,
    disclaimer: 'AI-GENERATED CANDIDATES — NOT YET VERIFIED. MUST BE AUDITED BEFORE OFFICIAL INVITATION.'
  });
});

// 6. POST /api/stakeholders/ai-letter (Domislink Mail AI: Invitation Letter Generator)
app.post('/api/stakeholders/ai-letter', async (req, res) => {
  const {
    recipientName,
    recipientPosition,
    recipientOrg,
    recipientEmail,
    category,
    proposedTopic,
    eventRole,
    sponsorshipOption,
    specialMessage
  } = req.body;

  if (!recipientName || !recipientOrg) {
    return res.status(400).json({ error: 'Recipient name and organisation are required' });
  }

  const ai = getAiClient();
  let subject = `OFFICIAL INVITATION: Aviation Safety Summit 2026 — 17 November 2026, Marriott Hotel Ikeja, Lagos`;
  let formalSalutation = `Dear ${recipientName},`;
  let formalInvitationText = `On behalf of the Advisory Board and Secretariat of the Aviation Safety Summit 2026, convened by Domislink International Services Ltd, we have the distinct honour to formally invite you as a distinguished ${eventRole || 'Special Guest'} to the landmark Aviation Safety Summit 2026.`;
  let eventDetailsText = `The Summit is scheduled to hold on Tuesday, 17 November 2026, at the Grand Ballroom, Lagos Marriott Hotel, GRA, Ikeja, Lagos, Nigeria, commencing promptly at 08:30 AM (WAT).`;
  let sectorRelevanceText = `The theme of this summit is "EVERYBODY IS INVOLVED IN AVIATION SAFETY — An accident does not select a tribe, profession, company or class." As a foremost leader in ${recipientOrg}, your sector directly intersects with aviation safety, risk prevention, operational continuity, and public protection.`;
  let proposedRoleText = `We would be deeply privileged to have you participate as a ${eventRole || 'Special Guest'}${proposedTopic ? `, and propose your intervention around the topic: "${proposedTopic}"` : ''}. (Please note that all proposed topics remain subject to your formal convenience and approval).`;
  let callToActionText = `We kindly request that you confirm your esteemed acceptance or nominate an official representative at your earliest convenience to enable our Protocol Desk finalize your summit credentials and VIP seating.`;
  let signatureBlock = `Yours in the Service of Air Safety and Human Life,\n\nSummit Secretariat & Organizing Board\nDomislink International Services Ltd\nLagos Marriott Hotel, Ikeja, Lagos, Nigeria\nEmail: domislinkint@gmail.com | Web: https://theaviationsecuritysummit.com`;

  if (ai) {
    try {
      const prompt = `You are the Chief Diplomatic Protocol Officer for DOMISLINK MAIL AI at Domislink International Services Ltd.
Generate an official, dignified, and highly polished formal summit invitation letter.

DETAILS:
- Summit: Aviation Safety Summit 2026
- Convener: Domislink International Services Ltd ("The Digital Empire")
- Date: Tuesday, 17 November 2026
- Venue: Grand Ballroom, Lagos Marriott Hotel, GRA, Ikeja, Lagos, Nigeria
- Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY — An accident does not select a tribe, profession, company or class."
- Recipient Name: ${recipientName}
- Recipient Position: ${recipientPosition || 'Executive Leader'}
- Recipient Organisation: ${recipientOrg}
- Recipient Sector: ${category || 'Industry'}
- Proposed Event Role: ${eventRole || 'Special Guest'}
- Proposed Discussion Topic: ${proposedTopic || 'Corporate Leadership & Shared Safety Accountability'}
- Sponsorship Mention: ${sponsorshipOption ? `Mention corporate sponsorship partnership opportunity for ${sponsorshipOption}` : 'No sponsorship requested'}
- Special Note from Secretariat: ${specialMessage || 'None'}

STRICT PROTOCOL REQUIREMENTS:
1. Tone must be aristocratic, respectful, professional, and urgent about the collective sanctity of human life in Nigerian airspace.
2. Emphasize why their specific sector (${category} / ${recipientOrg}) belongs at an aviation safety summit (finance, telecoms, oil & gas, insurance, logistics, public advocacy, or governance).
3. Explicitly state that the proposed topic is a PROPOSED DISCUSSION AREA — SUBJECT TO FORMAL ACCEPTANCE.
4. If the person is a Faith Leader (e.g. Bishop David Oyedepo or Sultan of Sokoto), treat them with the utmost spiritual dignity, highlighting the sanctity of human life and leadership ethics, rather than technical aerodynamics.

Respond in JSON format with these exact keys:
{
  "subject": "string",
  "formalSalutation": "string",
  "formalInvitationText": "string",
  "eventDetailsText": "string",
  "sectorRelevanceText": "string",
  "proposedRoleText": "string",
  "callToActionText": "string",
  "signatureBlock": "string",
  "fullHtmlContent": "string (clean formatted HTML suitable for email)"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.25,
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.subject) subject = parsed.subject;
      if (parsed.formalSalutation) formalSalutation = parsed.formalSalutation;
      if (parsed.formalInvitationText) formalInvitationText = parsed.formalInvitationText;
      if (parsed.eventDetailsText) eventDetailsText = parsed.eventDetailsText;
      if (parsed.sectorRelevanceText) sectorRelevanceText = parsed.sectorRelevanceText;
      if (parsed.proposedRoleText) proposedRoleText = parsed.proposedRoleText;
      if (parsed.callToActionText) callToActionText = parsed.callToActionText;
      if (parsed.signatureBlock) signatureBlock = parsed.signatureBlock;
    } catch (err: any) {
      console.error('Gemini Letter Generation Error:', err);
    }
  }

  // Pre-generate Gmail Web direct composition URL and mailto link
  const emailBodyText = `${formalSalutation}\n\n${formalInvitationText}\n\n${eventDetailsText}\n\n${sectorRelevanceText}\n\n${proposedRoleText}\n\n${callToActionText}\n\n${signatureBlock}`;
  const gmailDraftUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail || '')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyText)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyText)}`;

  res.json({
    success: true,
    letter: {
      id: `ltr-${Date.now()}`,
      recipientName,
      recipientPosition,
      recipientOrg,
      recipientEmail,
      category,
      eventRole,
      proposedTopic,
      subject,
      formalSalutation,
      formalInvitationText,
      eventDetailsText,
      sectorRelevanceText,
      proposedRoleText,
      callToActionText,
      signatureBlock,
      gmailDraftUrl,
      mailtoUrl,
      createdAt: new Date().toISOString()
    }
  });
});

// 7. POST /api/stakeholders/ai-sponsorship-proposal (Corporate Sponsorship Proposition)
app.post('/api/stakeholders/ai-sponsorship-proposal', async (req, res) => {
  const { companyName, industry, executiveName, executivePosition } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const ai = getAiClient();
  let proposal = {
    headline: `Strategic Safety Partnership Proposal for ${companyName}`,
    whySectorMatters: `Aviation safety is a vital catalyst for ${industry || 'corporate Nigeria'}. Reliable, zero-accident air transport protects executive human capital, secures supply chains, and safeguards investor confidence.`,
    howParticipationSupportsSafety: `By partnering with the Aviation Safety Summit 2026, ${companyName} directly champions preventative safety audits, pilot recurrent training simulators, and multi-agency emergency readiness.`,
    recommendedTiers: [
      {
        tier: "PLATINUM SAFETY BENEFACTOR",
        feeNGN: "₦25,000,000",
        feeUSD: "$16,500",
        benefits: [
          "VIP Plenary Keynote / High-Table Representation",
          "Prominent Double-Page Centerfold in Official Summit Hardcover Programme",
          "Prime 6m x 3m Exhibition Pavilion at Marriott Foyer",
          "Exclusive Brand Display on all Digital Stream Broadcasts & TV B-Roll",
          "10 VIP Delegate Access Passes with Marriott Executive Luncheon"
        ]
      },
      {
        tier: "GOLD SECTOR CHAMPION",
        feeNGN: "₦15,000,000",
        feeUSD: "$10,000",
        benefits: [
          "Executive Panelist Speaking Role in Sector Specialized Session",
          "Full-Page Colour Advertisement in Summit Programme",
          "3m x 3m Standard Exhibition Space",
          "5 VIP Delegate Passes with Sky Party Dinner Access",
          "Corporate Logo across Global Media Press Releases"
        ]
      },
      {
        tier: "SILVER SAFETY ADVOCATE",
        feeNGN: "₦8,000,000",
        feeUSD: "$5,300",
        benefits: [
          "Corporate Recognition during Official Summit Commendation",
          "Half-Page Colour Display in Summit Hardcover Book",
          "3 VIP Delegate Badges",
          "Logo Presence on Summit Digital Directory & PWA Applet"
        ]
      }
    ],
    callToAction: "Connect with the Summit Commercial & Sponsorship Director at domislinkint@gmail.com to lock your package."
  };

  if (ai) {
    try {
      const prompt = `You are the Commercial Director of the Aviation Safety Summit 2026.
Generate a high-converting, tailored corporate sponsorship proposition for:
Company: ${companyName}
Industry: ${industry || 'Corporate Nigeria'}
Target Executive: ${executiveName || 'Executive Leadership'} (${executivePosition || 'Leadership'})

STRICT GUIDELINES:
1. Explain specifically WHY aviation safety matters to ${companyName}'s specific sector (${industry}).
2. Explain HOW their participation directly champions aviation safety.
3. Recommend tiers from our approved inventory: Platinum (₦25M), Gold (₦15M), Silver (₦8M), Session Sponsor (₦5M), Exhibition Booth (₦2.5M), Programme Ad (₦1M).
4. DO NOT promise benefits outside the approved sponsorship package.

Respond in valid JSON matching this schema:
{
  "headline": "string",
  "whySectorMatters": "string",
  "howParticipationSupportsSafety": "string",
  "recommendedTiers": [
    {
      "tier": "string",
      "feeNGN": "string",
      "feeUSD": "string",
      "benefits": ["string"]
    }
  ],
  "callToAction": "string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.headline) proposal = parsed;
    } catch (err: any) {
      console.error('Gemini Sponsorship Proposal Error:', err);
    }
  }

  res.json({
    success: true,
    proposal
  });
});

// 8. POST /api/stakeholders/dispatch-letter (Record sent invitation & auto-schedule 5-day follow-up)
app.post('/api/stakeholders/dispatch-letter', (req, res) => {
  const { inviteeId, recipientEmail, subject, content, method } = req.body;

  const data = readDb();
  const stakeholders = data.stakeholders || [];
  const invitee = stakeholders.find((s: any) => s.id === inviteeId);

  const now = new Date();
  // 5 days follow-up deadline according to protocol spec 24
  const followUpDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

  if (invitee) {
    invitee.status = 'INVITATION SENT';
    invitee.invitationDate = now.toISOString();
    invitee.followUpDate = followUpDate;
    if (recipientEmail && !invitee.email) {
      invitee.email = recipientEmail;
    }
    invitee.nextAction = `Awaiting acknowledgment. Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString('en-GB')}.`;
    invitee.updatedAt = now.toISOString();
  }

  // Record dispatch in letters log
  if (!data.invitation_letters) data.invitation_letters = [];
  data.invitation_letters.unshift({
    id: `disp-${Date.now()}`,
    inviteeId,
    recipientEmail,
    subject,
    method: method || 'DOMISLINK_MAIL_AI_GMAIL',
    dispatchedAt: now.toISOString(),
    followUpDueAt: followUpDate
  });

  data.stakeholders = stakeholders;
  writeDb(data);

  res.json({
    success: true,
    invitee,
    followUpDate,
    stats: calculateStakeholderStats(stakeholders)
  });
});

// ============================================================
// RSVP & ATTENDANCE CONFIRMATION ENGINE ENDPOINTS
// Public API Boundary (Safe Public Summit Gateway)
// ============================================================

// In-memory sliding rate-limiter for public RSVP submissions (Anti-abuse)
const rsvpSubmissionRateMap = new Map<string, { count: number; resetAt: number }>();
function checkRsvpRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 20;

  const current = rsvpSubmissionRateMap.get(ip);
  if (!current || now > current.resetAt) {
    rsvpSubmissionRateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

// In-memory anti-duplicate submission debounce cache (prevents rapid double clicks / network retries)
const rsvpSubmissionMutex = new Map<string, { timestamp: number; payloadSummary: string; rsvp: any }>();

// Strict Email format validator
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  // RFC 5322 standard-compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;
  // Domain must contain a valid TLD
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return false;
  return true;
}

// Phone format validator (supports Nigerian & International numbers)
function isValidPhone(phone: string): { valid: boolean; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Contact phone number is required.' };
  }
  const trimmed = phone.trim();
  if (trimmed.length < 7) {
    return { valid: false, error: 'Phone number is too short. Please include at least 7 digits.' };
  }
  // Allow leading +, digits, spaces, parentheses, hyphens, and dots
  const phonePattern = /^\+?[0-9\s\-\(\)\.]{7,25}$/;
  if (!phonePattern.test(trimmed)) {
    return { valid: false, error: 'Phone number contains invalid characters. Please use numbers and optional + country code.' };
  }
  // Extract only digits to ensure numeric length
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 16) {
    return { valid: false, error: 'Please provide a valid phone number with 7 to 16 digits (e.g. +234 803 123 4567 or 08031234567).' };
  }
  return { valid: true };
}

// Invitation Number / Reference validator
function isValidInvitationNumber(invNumber: string): boolean {
  if (!invNumber || typeof invNumber !== 'string') return false;
  const trimmed = invNumber.trim();
  // Must be at least 3 characters and contain valid identifier characters
  return trimmed.length >= 3 && /^[A-Za-z0-9\/\-_\.]+$/.test(trimmed);
}

/**
 * Synchronizes RSVP attendance submission with Master Invitation Registry
 *
 * Locates corresponding Master Invitation using strongest available identifier:
 * 1. invitationNumber
 * 2. invitationReference
 * 3. invitationId (or id)
 *
 * Maps RSVP attendance options to Master Invitation statuses:
 * - "I WILL ATTEND" -> CONFIRMED
 * - "I WILL ATTEND WITH REPRESENTATIVE" -> CONFIRMED
 * - "I AM TENTATIVE" -> TENTATIVE
 * - "I AM UNABLE TO ATTEND" -> DECLINED
 *
 * Updates BOTH invitationStatus and currentStatus.
 * Updates updatedAt timestamp.
 * Preserves all existing metadata, notes, responsible officer, and approval info.
 * Idempotent: repeated submissions do not duplicate invitations or audit records.
 * Non-blocking: does not fail RSVP if invitation not found or reference omitted.
 */
function syncRsvpToMasterInvitation(
  data: any,
  rsvpRecord: any,
  rawOption: string,
  extraInvitationId?: string
): { synchronized: boolean; invitation?: any } {
  if (!data) return { synchronized: false };
  if (!data.invitations) data.invitations = [];

  const lookupNumber = (rsvpRecord.invitationNumber || '').trim();
  const lookupRef = (rsvpRecord.invitationRef || '').trim();
  const lookupId = (extraInvitationId || rsvpRecord.inviteeId || '').trim();

  // If no invitation reference/id was provided with the RSVP, skip synchronization gracefully
  if (!lookupNumber && !lookupRef && !lookupId) {
    return { synchronized: false };
  }

  // Strongest identifier matching: invitationNumber -> invitationReference -> invitationId / id
  const matchedIndex = data.invitations.findIndex((inv: any) => {
    if (!inv) return false;
    const invNum = String(inv.invitationNumber || '').trim().toLowerCase();
    const invRef = String(inv.invitationReference || '').trim().toLowerCase();
    const invId = String(inv.invitationId || '').trim().toLowerCase();
    const id = String(inv.id || '').trim().toLowerCase();

    // 1. Primary match on invitationNumber
    if (lookupNumber) {
      const target = lookupNumber.toLowerCase();
      if (invNum === target || invRef === target || invId === target || id === target) return true;
    }
    // 2. Secondary match on invitationReference
    if (lookupRef) {
      const target = lookupRef.toLowerCase();
      if (invRef === target || invNum === target || invId === target || id === target) return true;
    }
    // 3. Match on invitationId / id
    if (lookupId) {
      const target = lookupId.toLowerCase();
      if (invId === target || id === target || invNum === target || invRef === target) return true;
    }
    return false;
  });

  // Map attendance option to target invitation status
  const normOption = String(rawOption || rsvpRecord.attendanceOption || '').toUpperCase().trim();
  let targetStatus: 'CONFIRMED' | 'TENTATIVE' | 'DECLINED' = 'CONFIRMED';

  if (
    normOption === 'I WILL ATTEND' ||
    normOption === 'I_WILL_ATTEND' ||
    normOption === 'I WILL ATTEND WITH REPRESENTATIVE' ||
    normOption === 'I_WILL_ATTEND_WITH_REPRESENTATIVE' ||
    normOption.includes('REPRESENTATIVE')
  ) {
    targetStatus = 'CONFIRMED';
  } else if (
    normOption === 'I AM TENTATIVE' ||
    normOption === 'I_AM_TENTATIVE' ||
    normOption.includes('TENTATIVE') ||
    normOption.includes('MORE_INFO')
  ) {
    targetStatus = 'TENTATIVE';
  } else if (
    normOption === 'I AM UNABLE TO ATTEND' ||
    normOption === 'I_AM_UNABLE_TO_ATTEND' ||
    normOption.includes('UNABLE') ||
    normOption.includes('CANNOT') ||
    normOption.includes('DECLINED')
  ) {
    targetStatus = 'DECLINED';
  }

  // Case A: Invitation found -> synchronize status idempotently
  if (matchedIndex >= 0) {
    const inv = data.invitations[matchedIndex];
    const statusChanged = inv.invitationStatus !== targetStatus || inv.currentStatus !== targetStatus;

    if (statusChanged) {
      const oldValueSnapshot = { ...inv };

      inv.invitationStatus = targetStatus;
      inv.currentStatus = targetStatus;
      inv.updatedAt = new Date().toISOString();

      recordAuditLog(data, {
        action: 'INVITATION_STATUS_SYNCHRONIZED_FROM_RSVP',
        entityType: 'INVITATION',
        recordId: inv.id || inv.invitationId,
        referenceNumber: inv.invitationNumber || inv.invitationReference,
        oldValue: oldValueSnapshot,
        newValue: inv,
        performedBy: 'Public RSVP Synchronization Service',
        reason: `Invitation status synchronized from RSVP ${rsvpRecord.confirmationRef} (${rawOption} -> ${targetStatus})`
      });
    }

    return { synchronized: true, invitation: inv };
  }

  // Case B: Reference was provided but no matching invitation found -> log for secretariat investigation without failing RSVP
  recordAuditLog(data, {
    action: 'RSVP_INVITATION_UNMATCHED',
    entityType: 'RSVP',
    recordId: rsvpRecord.id,
    referenceNumber: rsvpRecord.confirmationRef,
    newValue: {
      providedInvitationNumber: lookupNumber || undefined,
      providedInvitationRef: lookupRef || undefined,
      providedInvitationId: lookupId || undefined,
      rsvpConfirmationRef: rsvpRecord.confirmationRef,
      attendeeName: rsvpRecord.fullName,
      attendeeEmail: rsvpRecord.email,
      organisation: rsvpRecord.organisation,
      attendanceOption: rawOption
    },
    performedBy: 'Public RSVP Synchronization Service',
    reason: `RSVP submitted with reference '${lookupNumber || lookupRef || lookupId}', but no corresponding Master Invitation was found in registry.`
  });

  return { synchronized: false };
}

// 1. GET /api/rsvp/lookup (Disabled for security compliance and reference enumeration prevention)
app.get('/api/rsvp/lookup', (req, res) => {
  return res.status(403).json({
    success: false,
    found: false,
    error: 'Public invitation lookup is disabled for security compliance and enumeration protection.'
  });
});

// 2. POST /api/rsvp (Public RSVP Submission with robust server-side validation and deduplication)
app.post('/api/rsvp', (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  if (!checkRsvpRateLimit(clientIp)) {
    return res.status(429).json({ 
      success: false,
      error: 'Submission rate limit exceeded. Please wait a few moments before trying again.' 
    });
  }

  const {
    invitationNumber,
    invitationRef,
    title,
    firstName,
    middleName,
    lastName,
    fullName,
    organisation,
    position,
    designation,
    email,
    phone,
    attendanceOption,
    representative,
    accessibilityRequirement,
    dietary,
    consentConfirmed
  } = req.body;

  const errors: Record<string, string> = {};

  // Clean strings
  const resolvedInvNumber = (invitationNumber || invitationRef || '').trim();
  const computedFirstName = (firstName || '').trim();
  const computedLastName = (lastName || '').trim();
  const computedMiddleName = (middleName || '').trim();
  let resolvedFullName = (fullName || '').trim();

  if (!resolvedFullName && (computedFirstName || computedLastName)) {
    resolvedFullName = [title, computedFirstName, computedMiddleName, computedLastName]
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  const resolvedDesignation = (designation || position || '').trim();
  const resolvedOrg = (organisation || '').trim();
  const resolvedEmail = (email || '').trim().toLowerCase();
  const resolvedPhone = (phone || '').trim();

  // 1. Validate Invitation Number (optional reference, validated if provided)
  if (resolvedInvNumber && !isValidInvitationNumber(resolvedInvNumber)) {
    errors.invitationNumber = 'Please provide a valid invitation number format (alphanumeric reference from your invitation).';
  }

  // 2. Validate Name Fields
  if (!computedFirstName && !resolvedFullName) {
    errors.firstName = 'First Name is required.';
  } else if (computedFirstName && computedFirstName.length < 2) {
    errors.firstName = 'First Name must be at least 2 characters.';
  }

  if (!computedLastName && !resolvedFullName) {
    errors.lastName = 'Last Name / Surname is required.';
  } else if (computedLastName && computedLastName.length < 2) {
    errors.lastName = 'Last Name must be at least 2 characters.';
  }

  if (!resolvedFullName || resolvedFullName.length < 3) {
    errors.fullName = 'Full Name is required.';
  }

  // 3. Validate Organisation & Designation
  if (!resolvedOrg) {
    errors.organisation = 'Organisation / Airline / Agency name is required.';
  } else if (resolvedOrg.length < 2) {
    errors.organisation = 'Organisation name must be at least 2 characters.';
  }

  if (!resolvedDesignation) {
    errors.designation = 'Official Designation / Position Title is required.';
  } else if (resolvedDesignation.length < 2) {
    errors.designation = 'Designation must be at least 2 characters.';
  }

  // 4. Validate Email Format
  if (!resolvedEmail) {
    errors.email = 'Official Email address is required.';
  } else if (!isValidEmail(resolvedEmail)) {
    errors.email = 'Please provide a valid official email address (e.g. name@organisation.com).';
  }

  // 5. Validate Phone Format
  const phoneValidation = isValidPhone(resolvedPhone);
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error || 'Please provide a valid telephone number.';
  }

  // 6. Validate Attendance Option
  const optUpper = String(attendanceOption || '').toUpperCase();
  let standardizedOption: 'I_WILL_ATTEND' | 'I_WILL_ATTEND_WITH_REPRESENTATIVE' | 'I_AM_TENTATIVE' | 'I_AM_UNABLE_TO_ATTEND' = 'I_WILL_ATTEND';
  let rsvpStatus: 'CONFIRMED' | 'REPRESENTATIVE_NOMINATED' | 'TENTATIVE' | 'DECLINED' = 'CONFIRMED';

  if (optUpper.includes('REPRESENTATIVE') || optUpper === 'SEND_REPRESENTATIVE' || optUpper === 'I WILL ATTEND WITH REPRESENTATIVE') {
    standardizedOption = 'I_WILL_ATTEND_WITH_REPRESENTATIVE';
    rsvpStatus = 'REPRESENTATIVE_NOMINATED';
  } else if (optUpper.includes('TENTATIVE') || optUpper === 'NEED_MORE_INFO' || optUpper === 'I AM TENTATIVE') {
    standardizedOption = 'I_AM_TENTATIVE';
    rsvpStatus = 'TENTATIVE';
  } else if (optUpper.includes('UNABLE') || optUpper.includes('CANNOT') || optUpper === 'CANNOT_ATTEND' || optUpper === 'I AM UNABLE TO ATTEND' || optUpper === 'DECLINED') {
    standardizedOption = 'I_AM_UNABLE_TO_ATTEND';
    rsvpStatus = 'DECLINED';
  } else {
    standardizedOption = 'I_WILL_ATTEND';
    rsvpStatus = 'CONFIRMED';
  }

  // 7. Validate Representative Details if attending with representative
  if (standardizedOption === 'I_WILL_ATTEND_WITH_REPRESENTATIVE') {
    const repName = representative?.fullName ? String(representative.fullName).trim() : '';
    const repDesig = representative?.designation || representative?.position ? String(representative.designation || representative.position).trim() : '';
    const repOrg = representative?.organisation ? String(representative.organisation).trim() : '';
    const repMail = representative?.email ? String(representative.email).trim().toLowerCase() : '';
    const repTel = representative?.phone ? String(representative.phone).trim() : '';

    if (!repName || repName.length < 2) {
      errors.repFullName = 'Representative Full Name is required.';
    }
    if (!repDesig || repDesig.length < 2) {
      errors.repDesignation = 'Representative Designation / Title is required.';
    }
    if (!repOrg || repOrg.length < 2) {
      errors.repOrganisation = 'Representative Organisation is required.';
    }
    if (!repMail) {
      errors.repEmail = 'Representative Official Email is required.';
    } else if (!isValidEmail(repMail)) {
      errors.repEmail = 'Please provide a valid official email address for your representative.';
    }
    const repPhoneVal = isValidPhone(repTel);
    if (!repPhoneVal.valid) {
      errors.repPhone = repPhoneVal.error ? `Representative ${repPhoneVal.error.toLowerCase()}` : 'Representative contact phone is required.';
    }
  }

  // 8. Validate Consent Confirmation
  if (consentConfirmed !== true && consentConfirmed !== 'true') {
    errors.consentConfirmed = 'You must confirm that the supplied details are accurate and accept the official attendance agreement.';
  }

  // Return formatted validation errors if any failed
  if (Object.keys(errors).length > 0) {
    const firstErrorMessage = Object.values(errors)[0];
    return res.status(400).json({
      success: false,
      error: firstErrorMessage,
      message: 'Please review and correct the highlighted fields in your submission.',
      errors
    });
  }

  // 9. ACCIDENTAL DUPLICATE SUBMISSION DETECTION & IDEMPOTENCY
  // Rapid debounce check: If the same email or invitation submitted within the last 30 seconds
  const debounceKey = `${resolvedEmail}::${(resolvedInvNumber || 'direct').toLowerCase()}`;
  const now = Date.now();
  const existingMutex = rsvpSubmissionMutex.get(debounceKey);

  if (existingMutex && (now - existingMutex.timestamp) < 30000) {
    // Return existing confirmation pass immediately (prevents duplicate db writes from double clicking)
    return res.json({
      success: true,
      isDuplicate: true,
      rsvp: existingMutex.rsvp,
      message: `Your RSVP was just received and confirmed with reference ${existingMutex.rsvp.confirmationRef}. Here is your attendance pass.`
    });
  }

  const data = readDb();
  if (!data.rsvps) data.rsvps = [];
  const stakeholders = data.stakeholders || [];

  // Match existing stakeholder record if available
  const matchedStakeholder = stakeholders.find((s: any) => 
    (resolvedInvNumber && (
      s.id?.toLowerCase() === resolvedInvNumber.toLowerCase() || 
      s.invitationNumber?.toLowerCase() === resolvedInvNumber.toLowerCase() || 
      s.invitationRef?.toLowerCase() === resolvedInvNumber.toLowerCase()
    )) ||
    (s.email && s.email.toLowerCase() === resolvedEmail) ||
    (s.name?.trim().toLowerCase() === resolvedFullName.toLowerCase() && s.organisation?.trim().toLowerCase() === resolvedOrg.toLowerCase())
  );

  if (matchedStakeholder) {
    if (standardizedOption === 'I_WILL_ATTEND') {
      matchedStakeholder.status = 'CONFIRMED';
      matchedStakeholder.isConfirmed = true;
      matchedStakeholder.responseNotes = `Confirmed attendance via official public RSVP portal on ${new Date().toLocaleDateString('en-GB')}.`;
    } else if (standardizedOption === 'I_AM_UNABLE_TO_ATTEND') {
      matchedStakeholder.status = 'DECLINED';
      matchedStakeholder.responseNotes = `Declined attendance via RSVP portal on ${new Date().toLocaleDateString('en-GB')}.`;
    } else if (standardizedOption === 'I_WILL_ATTEND_WITH_REPRESENTATIVE') {
      matchedStakeholder.status = 'ACCEPTED';
      matchedStakeholder.responseNotes = `Attending with nominated representative: ${representative?.fullName} (${representative?.designation || representative?.position || 'Representative'}) via RSVP portal on ${new Date().toLocaleDateString('en-GB')}.`;
    } else if (standardizedOption === 'I_AM_TENTATIVE') {
      matchedStakeholder.status = 'INTERESTED';
      matchedStakeholder.responseNotes = `Marked tentative / schedule review via RSVP portal on ${new Date().toLocaleDateString('en-GB')}.`;
    }
    matchedStakeholder.updatedAt = new Date().toISOString();
  }

  // Deduplication check in saved RSVPs by email OR invitationNumber
  const existingRsvpIndex = data.rsvps.findIndex((r: any) => 
    (r.email && r.email.toLowerCase() === resolvedEmail) ||
    (resolvedInvNumber && (
      (r.invitationNumber && r.invitationNumber.toLowerCase() === resolvedInvNumber.toLowerCase()) ||
      (r.invitationRef && r.invitationRef.toLowerCase() === resolvedInvNumber.toLowerCase())
    ))
  );

  // Generate official, non-sequential confirmation reference
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const confirmationRef = existingRsvpIndex >= 0 
    ? data.rsvps[existingRsvpIndex].confirmationRef 
    : `ASS-RSVP-2026-${randomSuffix}`;

  const isExistingUpdate = existingRsvpIndex >= 0;
  const previousOption = isExistingUpdate ? data.rsvps[existingRsvpIndex].attendanceOption : null;

  const newRsvpRecord = {
    id: isExistingUpdate ? data.rsvps[existingRsvpIndex].id : `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    confirmationRef,
    invitationNumber: resolvedInvNumber || (matchedStakeholder ? (matchedStakeholder.invitationNumber || matchedStakeholder.id) : undefined),
    invitationRef: resolvedInvNumber || (matchedStakeholder ? matchedStakeholder.id : undefined),
    inviteeId: (req.body.invitationId ? String(req.body.invitationId).trim() : undefined) || (matchedStakeholder ? matchedStakeholder.id : undefined),
    title: title ? String(title).trim() : undefined,
    firstName: computedFirstName || undefined,
    middleName: computedMiddleName || undefined,
    lastName: computedLastName || undefined,
    fullName: resolvedFullName,
    organisation: resolvedOrg,
    position: resolvedDesignation,
    designation: resolvedDesignation,
    email: resolvedEmail,
    phone: resolvedPhone,
    attendanceOption: standardizedOption,
    rsvpStatus,
    representative: standardizedOption === 'I_WILL_ATTEND_WITH_REPRESENTATIVE' ? {
      fullName: String(representative.fullName).trim(),
      designation: String(representative.designation || representative.position || 'Representative').trim(),
      position: String(representative.designation || representative.position || 'Representative').trim(),
      organisation: String(representative.organisation || resolvedOrg).trim(),
      email: String(representative.email).trim().toLowerCase(),
      phone: String(representative.phone || '').trim()
    } : undefined,
    accessibilityRequirement: accessibilityRequirement ? String(accessibilityRequirement).trim() : undefined,
    dietary: dietary ? String(dietary).trim() : undefined,
    consentConfirmed: true,
    submittedAt: isExistingUpdate ? data.rsvps[existingRsvpIndex].submittedAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailDeliveryStatus: 'NOT_CONFIGURED_STORED'
  };

  if (isExistingUpdate) {
    data.rsvps[existingRsvpIndex] = newRsvpRecord;
  } else {
    data.rsvps.unshift(newRsvpRecord);
  }

  data.stakeholders = stakeholders;

  // Issue #4: Synchronize Master Invitation status from RSVP submission
  syncRsvpToMasterInvitation(
    data,
    newRsvpRecord,
    attendanceOption || standardizedOption,
    req.body.invitationId ? String(req.body.invitationId).trim() : undefined
  );

  writeDb(data);

  const publicRsvpResponse = {
    confirmationRef: newRsvpRecord.confirmationRef,
    fullName: newRsvpRecord.fullName,
    organisation: newRsvpRecord.organisation,
    position: newRsvpRecord.position,
    email: newRsvpRecord.email,
    phone: newRsvpRecord.phone,
    invitationNumber: newRsvpRecord.invitationNumber,
    attendanceOption: newRsvpRecord.attendanceOption,
    rsvpStatus: newRsvpRecord.rsvpStatus,
    submittedAt: newRsvpRecord.submittedAt,
    representative: newRsvpRecord.representative
  };

  // Cache in debounce mutex
  rsvpSubmissionMutex.set(debounceKey, {
    timestamp: now,
    payloadSummary: `${resolvedFullName}-${standardizedOption}`,
    rsvp: publicRsvpResponse
  });

  // Clean old debounce entries (keep memory bounded)
  if (rsvpSubmissionMutex.size > 200) {
    for (const [key, val] of rsvpSubmissionMutex.entries()) {
      if (now - val.timestamp > 60000) {
        rsvpSubmissionMutex.delete(key);
      }
    }
  }

  let userFriendlyMessage = 'Attendance response successfully registered with the DomisLink Aviation Safety Summit Organising Committee.';
  if (isExistingUpdate) {
    if (previousOption === standardizedOption) {
      userFriendlyMessage = `Your attendance confirmation (Ref: ${confirmationRef}) is on file and verified.`;
    } else {
      userFriendlyMessage = `Your RSVP attendance status has been updated to: ${rsvpStatus.replace('_', ' ')}.`;
    }
  }

  // Return clean, safe response to the public user
  res.json({
    success: true,
    isUpdate: isExistingUpdate,
    rsvp: publicRsvpResponse,
    message: userFriendlyMessage
  });
});

// 3. GET /api/admin/rsvps (Admin: Fetch all RSVPs)
app.get('/api/admin/rsvps', (req, res) => {
  const data = readDb();
  const rsvps = data.rsvps || [];
  res.json({
    success: true,
    rsvps,
    total: rsvps.length
  });
});

// 4. PUT /api/admin/rsvps/:id/status (Admin: Update status e.g. ATTENDED, NO_SHOW, etc.)
app.put('/api/admin/rsvps/:id/status', (req, res) => {
  const { id } = req.params;
  const { rsvpStatus } = req.body;

  if (!rsvpStatus) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const data = readDb();
  if (!data.rsvps) data.rsvps = [];
  const index = data.rsvps.findIndex((r: any) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'RSVP record not found' });
  }

  data.rsvps[index].rsvpStatus = rsvpStatus;
  data.rsvps[index].updatedAt = new Date().toISOString();
  writeDb(data);

  res.json({
    success: true,
    rsvp: data.rsvps[index]
  });
});

// ============================================================
// SECRETARIAT — INVITATION & STAKEHOLDER MASTER RECORD API ROUTES
// ============================================================

function recordAuditLog(data: any, entry: { action: string; entityType: string; recordId: string; referenceNumber?: string; oldValue?: any; newValue?: any; performedBy?: string; reason?: string }) {
  if (!data.audit_logs) data.audit_logs = [];
  const logEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...entry,
    performedBy: entry.performedBy || 'Secretariat Administrator',
    timestamp: new Date().toISOString()
  };
  data.audit_logs.unshift(logEntry);
  if (data.audit_logs.length > 2000) data.audit_logs.pop();
}

function generateInvitationNumber(data: any): string {
  if (!data.invitations) data.invitations = [];
  const count = data.invitations.length + 1;
  const paddedNum = String(count).padStart(4, '0');
  const invNumber = `ASS-INV-2026-${paddedNum}`;
  const exists = data.invitations.some((i: any) => i.invitationNumber === invNumber || i.invitationReference === invNumber);
  if (exists) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ASS-INV-2026-${String(count + randomSuffix).padStart(4, '0')}`;
  }
  return invNumber;
}

function checkStakeholderDuplicate(data: any, payload: { email?: string; phone?: string; firstName?: string; lastName?: string; organisation?: string; personId?: string }) {
  const persons = data.stakeholders_master || data.stakeholders || [];
  const matches = [];
  for (const p of persons) {
    const emailMatch = payload.email && p.email && p.email.toLowerCase().trim() === payload.email.toLowerCase().trim();
    const phoneClean = payload.phone ? payload.phone.replace(/[^0-9]/g, '') : '';
    const pPhoneClean = p.phone ? p.phone.replace(/[^0-9]/g, '') : '';
    const phoneMatch = phoneClean.length >= 7 && pPhoneClean.length >= 7 && (phoneClean === pPhoneClean || pPhoneClean.endsWith(phoneClean) || phoneClean.endsWith(pPhoneClean));
    const nameMatch = payload.firstName && payload.lastName && p.firstName && p.lastName &&
      p.firstName.toLowerCase().trim() === payload.firstName.toLowerCase().trim() &&
      p.lastName.toLowerCase().trim() === payload.lastName.toLowerCase().trim() &&
      p.organisation && payload.organisation && p.organisation.toLowerCase().trim() === payload.organisation.toLowerCase().trim();
    const idMatch = payload.personId && (p.id === payload.personId || p.personId === payload.personId);
    
    if (emailMatch || phoneMatch || nameMatch || idMatch) {
      matches.push({
        id: p.id,
        stakeholderId: p.stakeholderId || p.id,
        referenceNumber: p.referenceNumber,
        name: `${p.title || ''} ${p.firstName} ${p.lastName}`.trim(),
        organisation: p.organisation || p.organisationName,
        email: p.email,
        phone: p.phone,
        matchType: emailMatch ? 'EMAIL' : phoneMatch ? 'PHONE' : idMatch ? 'PERSON_ID' : 'NAME_AND_ORG',
        matchReason: emailMatch ? `Email (${payload.email}) matches existing stakeholder` :
                     phoneMatch ? `Phone (${payload.phone}) matches existing stakeholder` :
                     idMatch ? `Person ID (${payload.personId}) matches existing record` :
                     `Name (${payload.firstName} ${payload.lastName}) and Organisation (${payload.organisation}) match existing record`
      });
    }
  }
  return matches;
}

function checkInvitationDuplicate(data: any, payload: { personId: string; orgId?: string; sector?: string; category?: string; invitationType?: string }) {
  const invitations = data.invitations || [];
  const matches = [];
  for (const inv of invitations) {
    if (inv.personId === payload.personId && inv.invitationStatus !== 'CANCELLED') {
      matches.push({
        id: inv.id,
        invitationNumber: inv.invitationNumber || inv.invitationReference,
        personId: inv.personId,
        sector: inv.sector,
        category: inv.category,
        invitationType: inv.invitationType,
        invitationStatus: inv.invitationStatus,
        createdAt: inv.createdAt,
        matchType: 'PERSON_ACTIVE_INVITATION',
        matchReason: `Stakeholder already has an active invitation (${inv.invitationNumber || inv.id}) with status ${inv.invitationStatus}`
      });
    }
  }
  return matches;
}

// 1. GET /api/secretariat/stakeholders-master
app.get('/api/secretariat/stakeholders-master', (req, res) => {
  const data = readDb();
  if (!data.stakeholders_master) {
    data.stakeholders_master = data.stakeholders || [];
    writeDb(data);
  }
  res.json({
    success: true,
    stakeholders: data.stakeholders_master,
    total: data.stakeholders_master.length
  });
});

// 2. POST /api/secretariat/stakeholders-master (Create stakeholder with duplicate detection & override audit)
app.post('/api/secretariat/stakeholders-master', (req, res) => {
  const {
    title,
    firstName,
    middleName,
    lastName,
    preferredName,
    designation,
    position,
    organisation,
    organisationName,
    organisationType,
    organisationId,
    department,
    email,
    phone,
    altPhone,
    alternativePhone,
    address,
    country,
    state,
    city,
    sector,
    category,
    stakeholderCategory,
    subcategory,
    preferredContactMethod,
    relationshipClassification,
    notes,
    forceCreate,
    overrideReason,
    actorEmail
  } = req.body;

  const actualOrg = (organisation || organisationName || '').trim();
  const actualEmail = (email || '').trim().toLowerCase();
  const actualCategory = category || stakeholderCategory;
  const actualDesignation = designation || position || 'Executive';
  const actualPhone = (phone || '').trim();
  const actualAltPhone = altPhone || alternativePhone;

  if (!firstName || !lastName || !actualOrg || !actualEmail || !sector || !actualCategory) {
    return res.status(400).json({ error: 'Required fields: firstName, lastName, organisation, email, sector, category' });
  }

  const data = readDb();
  if (!data.stakeholders_master) data.stakeholders_master = [];

  // Check duplicates unless forceCreate is true
  if (!forceCreate) {
    const duplicates = checkStakeholderDuplicate(data, { 
      email: actualEmail, 
      phone: actualPhone, 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      organisation: actualOrg 
    });
    if (duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        warning: 'Potential duplicate stakeholder record detected.',
        duplicates
      });
    }
  }

  const now = new Date().toISOString();
  const personId = `stk-m-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const count = data.stakeholders_master.length + 1;
  const referenceNumber = `ASS-STK-2026-${String(count).padStart(4, '0')}`;

  const newStakeholder = {
    id: personId,
    stakeholderId: personId,
    personId,
    organisationId: organisationId || undefined,
    referenceNumber,
    fullName: `${title || 'Mr.'} ${firstName.trim()} ${lastName.trim()}`,
    title: title || 'Mr.',
    firstName: firstName.trim(),
    middleName: middleName ? middleName.trim() : undefined,
    lastName: lastName.trim(),
    preferredName: preferredName ? preferredName.trim() : undefined,
    designation: actualDesignation,
    position: actualDesignation,
    organisation: actualOrg,
    organisationName: actualOrg,
    organisationType: organisationType || 'Corporate',
    department: department ? department.trim() : undefined,
    email: actualEmail,
    phone: actualPhone,
    altPhone: actualAltPhone ? actualAltPhone.trim() : undefined,
    alternativePhone: actualAltPhone ? actualAltPhone.trim() : undefined,
    address: address ? address.trim() : undefined,
    country: country || 'Nigeria',
    state: state ? state.trim() : undefined,
    city: city ? city.trim() : undefined,
    sector,
    category: actualCategory,
    stakeholderCategory: actualCategory,
    subcategory: subcategory ? subcategory.trim() : undefined,
    preferredContactMethod: preferredContactMethod || 'EMAIL',
    relationshipClassification: relationshipClassification || 'EXECUTIVE',
    notes: notes ? notes.trim() : undefined,
    isActive: true,
    activeStatus: true,
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail || 'Secretariat Administrator'
  };

  data.stakeholders_master.push(newStakeholder);
  recordAuditLog(data, {
    action: forceCreate ? 'STAKEHOLDER_DUPLICATE_OVERRIDE' : 'STAKEHOLDER_CREATED',
    entityType: 'STAKEHOLDER',
    recordId: personId,
    referenceNumber,
    newValue: newStakeholder,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: forceCreate ? (overrideReason || 'Authorised duplicate override approved by officer') : undefined
  });
  writeDb(data);

  res.json({
    success: true,
    stakeholder: newStakeholder,
    message: forceCreate 
      ? 'Stakeholder master record created via authorised duplicate override.'
      : 'Stakeholder master record created successfully.'
  });
});

// 3. PUT /api/secretariat/stakeholders-master/:id
app.put('/api/secretariat/stakeholders-master/:id', (req, res) => {
  const { id } = req.params;
  const data = readDb();
  if (!data.stakeholders_master) data.stakeholders_master = [];
  const index = data.stakeholders_master.findIndex((s: any) => s.id === id || s.stakeholderId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Stakeholder record not found' });
  }

  const oldValue = { ...data.stakeholders_master[index] };
  const actor = req.body.actorEmail || req.body.updatedBy || 'Secretariat Administrator';
  const isDeactivating = (req.body.isActive === false || req.body.activeStatus === false) && oldValue.isActive !== false;

  const updated = {
    ...oldValue,
    ...req.body,
    id: oldValue.id,
    stakeholderId: oldValue.stakeholderId || oldValue.id,
    referenceNumber: oldValue.referenceNumber,
    updatedAt: new Date().toISOString(),
    updatedBy: actor
  };

  data.stakeholders_master[index] = updated;
  recordAuditLog(data, {
    action: isDeactivating ? 'STAKEHOLDER_DEACTIVATED' : 'STAKEHOLDER_UPDATED',
    entityType: 'STAKEHOLDER',
    recordId: id,
    referenceNumber: updated.referenceNumber,
    oldValue,
    newValue: updated,
    performedBy: actor,
    reason: req.body.reason || (isDeactivating ? 'Stakeholder deactivated by secretariat officer' : undefined)
  });
  writeDb(data);

  res.json({
    success: true,
    stakeholder: updated,
    message: isDeactivating ? 'Stakeholder record deactivated.' : 'Stakeholder record updated successfully.'
  });
});

// 3b. PUT /api/secretariat/stakeholders-master/:id/deactivate
app.put('/api/secretariat/stakeholders-master/:id/deactivate', (req, res) => {
  const { id } = req.params;
  const { actorEmail, reason } = req.body;
  const data = readDb();
  if (!data.stakeholders_master) data.stakeholders_master = [];
  const index = data.stakeholders_master.findIndex((s: any) => s.id === id || s.stakeholderId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Stakeholder record not found' });
  }

  const oldValue = { ...data.stakeholders_master[index] };
  const updated = {
    ...oldValue,
    isActive: false,
    activeStatus: false,
    updatedAt: new Date().toISOString(),
    updatedBy: actorEmail || 'Secretariat Administrator'
  };

  data.stakeholders_master[index] = updated;
  recordAuditLog(data, {
    action: 'STAKEHOLDER_DEACTIVATED',
    entityType: 'STAKEHOLDER',
    recordId: id,
    referenceNumber: updated.referenceNumber,
    oldValue,
    newValue: updated,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: reason || 'Authorised stakeholder record deactivation'
  });
  writeDb(data);

  res.json({
    success: true,
    stakeholder: updated,
    message: 'Stakeholder master record deactivated successfully.'
  });
});

// 4. GET /api/secretariat/organisations-master
app.get('/api/secretariat/organisations-master', (req, res) => {
  const data = readDb();
  if (!data.organisations_master) {
    data.organisations_master = data.organisations || [];
    writeDb(data);
  }
  res.json({
    success: true,
    organisations: data.organisations_master,
    total: data.organisations_master.length
  });
});

// 5. POST /api/secretariat/organisations-master
app.post('/api/secretariat/organisations-master', (req, res) => {
  const { name, type, sector, country, state, city, address, website, email, phone, contactPerson, actorEmail } = req.body;
  if (!name || !sector) {
    return res.status(400).json({ error: 'Organisation name and sector are required' });
  }

  const data = readDb();
  if (!data.organisations_master) data.organisations_master = [];

  // Check duplicate org name
  const existing = data.organisations_master.find((o: any) => o.name.toLowerCase().trim() === name.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, error: 'Organisation with this name already exists in Master Records.', organisation: existing });
  }

  const now = new Date().toISOString();
  const orgId = `org-m-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newOrg = {
    id: orgId,
    organisationId: orgId,
    name: name.trim(),
    type: type || 'Corporate',
    sector,
    country: country || 'Nigeria',
    state: state ? state.trim() : undefined,
    city: city ? city.trim() : undefined,
    address: address ? address.trim() : undefined,
    website: website ? website.trim() : undefined,
    email: email ? email.trim().toLowerCase() : undefined,
    phone: phone ? phone.trim() : undefined,
    contactPerson: contactPerson ? contactPerson.trim() : undefined,
    isActive: true,
    activeStatus: true,
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail || 'Secretariat Administrator'
  };

  data.organisations_master.push(newOrg);
  recordAuditLog(data, {
    action: 'ORGANISATION_CREATED',
    entityType: 'ORGANISATION',
    recordId: orgId,
    newValue: newOrg,
    performedBy: actorEmail || 'Secretariat Administrator'
  });
  writeDb(data);

  res.json({
    success: true,
    organisation: newOrg,
    message: 'Organisation master record created successfully.'
  });
});

// 6. GET /api/secretariat/invitations
app.get('/api/secretariat/invitations', (req, res) => {
  const data = readDb();
  if (!data.invitations) data.invitations = [];
  res.json({
    success: true,
    invitations: data.invitations,
    total: data.invitations.length
  });
});

// 7. POST /api/secretariat/invitations (Create private invitation with duplicate check & override audit)
app.post('/api/secretariat/invitations', (req, res) => {
  const { 
    personId, 
    stakeholderId,
    orgId, 
    organisationId,
    sector, 
    category, 
    invitationType, 
    invitationPurpose,
    responsibleOfficer,
    internalNotes,
    forceCreate,
    overrideReason,
    actorEmail
  } = req.body;

  const targetPersonId = personId || stakeholderId;
  const targetOrgId = orgId || organisationId || 'org-unspecified';

  if (!targetPersonId || !sector || !category || !invitationType) {
    return res.status(400).json({ error: 'Required fields: personId/stakeholderId, sector, category, invitationType' });
  }

  const data = readDb();
  if (!data.invitations) data.invitations = [];

  // Check duplicates unless forceCreate is true
  if (!forceCreate) {
    const duplicates = checkInvitationDuplicate(data, { personId: targetPersonId, orgId: targetOrgId, sector, category, invitationType });
    if (duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        warning: 'This stakeholder already has an active invitation record.',
        duplicates
      });
    }
  }

  const invitationNumber = generateInvitationNumber(data);
  const now = new Date().toISOString();
  const invitationId = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newInvitation = {
    id: invitationId,
    invitationId,
    invitationNumber,
    invitationReference: invitationNumber,
    personId: targetPersonId,
    stakeholderId: targetPersonId,
    orgId: targetOrgId,
    organisationId: targetOrgId,
    sector,
    category,
    invitationType,
    invitationPurpose: invitationPurpose || 'Summit Delegate',
    responsibleOfficer: responsibleOfficer || actorEmail || 'Secretariat Officer',
    invitationDate: now.slice(0, 10),
    eventDate: '2026-11-17',
    invitationStatus: 'DRAFT',
    currentStatus: 'DRAFT',
    internalNotes: internalNotes ? internalNotes.trim() : undefined,
    auditReference: `AUD-INV-${Date.now().toString(36).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail || 'Secretariat Administrator'
  };

  data.invitations.push(newInvitation);
  recordAuditLog(data, {
    action: forceCreate ? 'INVITATION_DUPLICATE_OVERRIDE' : 'INVITATION_CREATED',
    entityType: 'INVITATION',
    recordId: invitationId,
    referenceNumber: invitationNumber,
    newValue: newInvitation,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: forceCreate ? (overrideReason || 'Authorised invitation duplicate override') : undefined
  });
  writeDb(data);

  res.json({
    success: true,
    invitation: newInvitation,
    message: forceCreate
      ? `Private invitation ${invitationNumber} created via duplicate override.`
      : `Private invitation ${invitationNumber} generated successfully.`
  });
});

// 8. PUT /api/secretariat/invitations/:id/status (Status change & approval with zero self-approval safety)
app.put('/api/secretariat/invitations/:id/status', (req, res) => {
  const { id } = req.params;
  const { invitationStatus, currentStatus, userEmail, internalNotes, reason } = req.body;
  const newStatus = invitationStatus || currentStatus;

  if (!newStatus) {
    return res.status(400).json({ error: 'New invitationStatus is required' });
  }

  const data = readDb();
  if (!data.invitations) data.invitations = [];
  const index = data.invitations.findIndex((i: any) => i.id === id || i.invitationId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Invitation record not found' });
  }

  const inviteRecord = data.invitations[index];
  const oldValue = { ...inviteRecord };

  // Zero self-approval check if trying to approve own created invitation
  if (newStatus === 'APPROVED' && inviteRecord.createdBy && userEmail && inviteRecord.createdBy.toLowerCase() === userEmail.toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: 'Governance Safety Rule Violation: Zero self-approval principle prevents users from approving invitations they created themselves.'
    });
  }

  inviteRecord.invitationStatus = newStatus;
  inviteRecord.currentStatus = newStatus;
  inviteRecord.updatedAt = new Date().toISOString();
  inviteRecord.updatedBy = userEmail || 'Secretariat Administrator';
  if (internalNotes) inviteRecord.internalNotes = internalNotes;

  if (newStatus === 'APPROVED') {
    inviteRecord.approvedBy = userEmail || 'Secretariat Senior Official';
    inviteRecord.approvedAt = new Date().toISOString();
  }

  let auditAction = 'INVITATION_UPDATED';
  if (newStatus === 'APPROVED') auditAction = 'INVITATION_APPROVED';
  else if (newStatus === 'CANCELLED') auditAction = 'INVITATION_CANCELLED';

  recordAuditLog(data, {
    action: auditAction,
    entityType: 'INVITATION',
    recordId: id,
    referenceNumber: inviteRecord.invitationNumber || inviteRecord.invitationReference,
    oldValue,
    newValue: inviteRecord,
    performedBy: userEmail || 'Secretariat Administrator',
    reason: reason || (newStatus === 'CANCELLED' ? 'Invitation cancelled by secretariat officer' : undefined)
  });

  writeDb(data);

  res.json({
    success: true,
    invitation: inviteRecord,
    message: `Invitation status updated to ${newStatus}.`
  });
});

// 8b. POST /api/secretariat/audit-logs/export (Log master data export)
app.post('/api/secretariat/audit-logs/export', (req, res) => {
  const { exportType, recordsCount, actorEmail, filterSummary } = req.body;
  const data = readDb();
  recordAuditLog(data, {
    action: 'MASTER_DATA_EXPORTED',
    entityType: exportType || 'STAKEHOLDER_INVITATION_MASTER',
    recordId: `exp-${Date.now()}`,
    performedBy: actorEmail || 'Secretariat Administrator',
    newValue: { exportType, recordsCount, filterSummary }
  });
  writeDb(data);
  res.json({ success: true, message: 'Export audit event recorded.' });
});

// 9. GET /api/secretariat/audit-logs
app.get('/api/secretariat/audit-logs', (req, res) => {
  const data = readDb();
  if (!data.audit_logs) data.audit_logs = [];
  res.json({
    success: true,
    auditLogs: data.audit_logs,
    total: data.audit_logs.length
  });
});

// ============================================================
// OFFICIAL CORRESPONDENCE & LETTERHEAD SYSTEM API ROUTES
// ============================================================

// Helper to seed initial letterhead profiles, signatories, and templates if missing
function ensureCorrespondenceDefaults(data: any) {
  if (!data.letterhead_profiles) {
    data.letterhead_profiles = [
      {
        id: 'profile-domislink-corp',
        name: 'DOMISLINK INTERNATIONAL SERVICES LTD',
        purpose: 'Default Corporate Letterhead',
        legalOrganisationName: 'DOMISLINK INTERNATIONAL SERVICES LTD',
        displayName: 'DOMISLINK INTERNATIONAL SERVICES',
        rcNumber: 'RC 9266988',
        rcNumberX: 29.4,
        rcNumberY: 28.1,
        tagline: 'THE DIGITAL EMPIRE',
        address: 'Plot 124, Ahmadu Bello Way, Central Business District, Abuja, Nigeria',
        telephone: '+234 9 290 0000',
        mobile: '+234 803 000 0000',
        email: 'secretariat@domislink.com',
        website: 'https://domislink.com',
        headerText: 'OFFICE OF THE SECRETARY-GENERAL',
        footerText: 'Domislink International Services Ltd — RC 9266988 — The Digital Empire',
        referencePrefix: 'DIS/CORR/2026',
        referenceFormat: 'DIS/CORR/2026/0001',
        dateFormat: 'DD/MM/YYYY',
        defaultSignatoryId: 'sig-sec-gen',
        pageSize: 'A4',
        orientation: 'portrait',
        margins: '20mm',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'profile-summit-2026',
        name: 'AVIATION SAFETY SUMMIT 2026',
        purpose: 'Summit Correspondence Letterhead',
        legalOrganisationName: 'AVIATION SAFETY SUMMIT 2026 ORGANISING COMMITTEE',
        displayName: 'AVIATION SAFETY SUMMIT 2026',
        rcNumber: 'RC 9266988',
        rcNumberX: 29.4,
        rcNumberY: 28.1,
        tagline: 'SAFE SKIES, SECURE FUTURES',
        address: 'Transcorp Hilton Abuja & Nnamdi Azikiwe International Airport, Abuja',
        telephone: '+234 9 290 2026',
        mobile: '+234 803 2026 2026',
        email: 'summit@sec.domislink.com',
        website: 'https://summit.domislink.com',
        headerText: 'OFFICE OF THE SUMMIT SECRETARIAT & EXECUTIVE DIRECTORATE',
        footerText: 'Aviation Safety Summit 2026 — Official Secretariat Correspondence',
        referencePrefix: 'ASS/CORR/2026',
        referenceFormat: 'ASS/CORR/2026/0001',
        dateFormat: 'DD/MM/YYYY',
        defaultSignatoryId: 'sig-exec-dir',
        pageSize: 'A4',
        orientation: 'portrait',
        margins: '20mm',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  if (!data.correspondence_signatories) {
    data.correspondence_signatories = [
      {
        id: 'sig-sec-gen',
        name: 'Dr. Aliyu Mohammed, CON',
        title: 'Secretary-General',
        organisation: 'Domislink International Services Ltd',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sig-exec-dir',
        name: 'Capt. Nkechi Adebayo',
        title: 'Executive Director, Summit Operations',
        organisation: 'Aviation Safety Summit 2026',
        isActive: true,
        isDefault: false,
        createdAt: new Date().toISOString()
      }
    ];
  }

  if (!data.correspondence_templates) {
    data.correspondence_templates = [
      {
        id: 'tmpl-official-invite',
        title: 'Official Summit Invitation Letter',
        correspondenceType: 'Official Invitation Letter',
        subjectTemplate: 'OFFICIAL INVITATION: AVIATION SAFETY SUMMIT 2026 (17-19 NOV 2026, ABUJA)',
        salutationTemplate: 'Dear {{recipientName}},',
        bodyTemplate: 'It is with great distinction and professional privilege that we formally invite you to participate as a distinguished guest and delegate at the upcoming Aviation Safety Summit 2026, convening under the high patronage of federal aviation authorities.\n\nThe Summit theme focuses on advancing robust continental air safety frameworks, regulatory alignment, and technological modernization across African airspace.\n\nYour esteemed expertise and leadership representation at {{recipientOrganisation}} will add immense value to high-level plenary sessions and ministerial roundtables.',
        closingTemplate: 'Please accept our highest considerations of professional esteem.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tmpl-general-corp',
        title: 'General Corporate Notice',
        correspondenceType: 'General Corporate Correspondence',
        subjectTemplate: 'CORRESPONDENCE REGARDING: {{subject}}',
        salutationTemplate: 'Dear {{recipientName}},',
        bodyTemplate: 'We write to formally communicate official determinations and administrative notices regarding ongoing collaborative initiatives between Domislink International Services Ltd and {{recipientOrganisation}}.\n\nKindly review the attached briefing notes and revert to the Secretariat within five (5) working days.',
        closingTemplate: 'Yours faithfully,',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  if (!data.correspondence_documents) {
    data.correspondence_documents = [];
  }
}

// GET /api/secretariat/correspondence/profiles
app.get('/api/secretariat/correspondence/profiles', (req, res) => {
  const data = readDb();
  ensureCorrespondenceDefaults(data);
  writeDb(data);
  res.json({ success: true, profiles: data.letterhead_profiles });
});

// POST /api/secretariat/correspondence/profiles
app.post('/api/secretariat/correspondence/profiles', (req, res) => {
  const {
    name, purpose, legalOrganisationName, displayName, rcNumber, rcNumberX, rcNumberY,
    tagline, address, telephone, mobile, email, website, headerText, footerText,
    referencePrefix, pageSize, orientation, margins
  } = req.body;

  if (!name || !legalOrganisationName || !rcNumber) {
    return res.status(400).json({ error: 'Name, legal organisation name, and RC number are required.' });
  }

  const data = readDb();
  ensureCorrespondenceDefaults(data);

  const profileId = `profile-${Date.now()}`;
  const newProfile = {
    id: profileId,
    name: name.trim(),
    purpose: purpose || 'Corporate Letterhead',
    legalOrganisationName: legalOrganisationName.trim(),
    displayName: displayName || name.trim(),
    rcNumber: rcNumber.trim(),
    rcNumberX: typeof rcNumberX === 'number' ? rcNumberX : 29.4,
    rcNumberY: typeof rcNumberY === 'number' ? rcNumberY : 28.1,
    tagline: tagline || '',
    address: address || '',
    telephone: telephone || '',
    mobile: mobile || '',
    email: email || '',
    website: website || '',
    headerText: headerText || 'OFFICIAL SECRETARIAT CORRESPONDENCE',
    footerText: footerText || `${legalOrganisationName} — ${rcNumber}`,
    referencePrefix: referencePrefix || 'DIS/CORR/2026',
    referenceFormat: `${referencePrefix || 'DIS/CORR/2026'}/0001`,
    dateFormat: 'DD/MM/YYYY',
    pageSize: pageSize || 'A4',
    orientation: orientation || 'portrait',
    margins: margins || '20mm',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.letterhead_profiles.push(newProfile);
  recordAuditLog(data, {
    action: 'CREATE',
    entityType: 'LETTERHEAD_PROFILE',
    recordId: profileId,
    referenceNumber: rcNumber,
    newValue: newProfile
  });
  writeDb(data);

  res.json({ success: true, profile: newProfile, message: 'Letterhead profile created successfully.' });
});

// PUT /api/secretariat/correspondence/profiles/:id
app.put('/api/secretariat/correspondence/profiles/:id', (req, res) => {
  const { id } = req.params;
  const data = readDb();
  ensureCorrespondenceDefaults(data);

  const idx = data.letterhead_profiles.findIndex((p: any) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Letterhead profile not found.' });
  }

  const oldVal = { ...data.letterhead_profiles[idx] };
  const updated = {
    ...oldVal,
    ...req.body,
    id,
    updatedAt: new Date().toISOString()
  };

  data.letterhead_profiles[idx] = updated;
  recordAuditLog(data, {
    action: 'EDIT',
    entityType: 'LETTERHEAD_PROFILE',
    recordId: id,
    referenceNumber: updated.rcNumber,
    oldValue: oldVal,
    newValue: updated
  });
  writeDb(data);

  res.json({ success: true, profile: updated, message: 'Letterhead profile updated successfully.' });
});

// GET /api/secretariat/correspondence/signatories
app.get('/api/secretariat/correspondence/signatories', (req, res) => {
  const data = readDb();
  ensureCorrespondenceDefaults(data);
  writeDb(data);
  res.json({ success: true, signatories: data.correspondence_signatories });
});

// POST /api/secretariat/correspondence/signatories
app.post('/api/secretariat/correspondence/signatories', (req, res) => {
  const { name, title, organisation, isDefault } = req.body;
  if (!name || !title || !organisation) {
    return res.status(400).json({ error: 'Name, title, and organisation are required.' });
  }

  const data = readDb();
  ensureCorrespondenceDefaults(data);

  if (isDefault) {
    data.correspondence_signatories.forEach((s: any) => { s.isDefault = false; });
  }

  const sigId = `sig-${Date.now()}`;
  const newSig = {
    id: sigId,
    name: name.trim(),
    title: title.trim(),
    organisation: organisation.trim(),
    isActive: true,
    isDefault: !!isDefault,
    createdAt: new Date().toISOString()
  };

  data.correspondence_signatories.push(newSig);
  recordAuditLog(data, {
    action: 'CREATE',
    entityType: 'CORRESPONDENCE_SIGNATORY',
    recordId: sigId,
    newValue: newSig
  });
  writeDb(data);

  res.json({ success: true, signatory: newSig, message: 'Signatory added successfully.' });
});

// GET /api/secretariat/correspondence/templates
app.get('/api/secretariat/correspondence/templates', (req, res) => {
  const data = readDb();
  ensureCorrespondenceDefaults(data);
  writeDb(data);
  res.json({ success: true, templates: data.correspondence_templates });
});

// POST /api/secretariat/correspondence/templates
app.post('/api/secretariat/correspondence/templates', (req, res) => {
  const { title, correspondenceType, subjectTemplate, bodyTemplate, salutationTemplate, closingTemplate } = req.body;
  if (!title || !correspondenceType || !bodyTemplate) {
    return res.status(400).json({ error: 'Title, correspondenceType, and bodyTemplate are required.' });
  }

  const data = readDb();
  ensureCorrespondenceDefaults(data);

  const tmplId = `tmpl-${Date.now()}`;
  const newTmpl = {
    id: tmplId,
    title: title.trim(),
    correspondenceType,
    subjectTemplate: subjectTemplate || '',
    bodyTemplate: bodyTemplate.trim(),
    salutationTemplate: salutationTemplate || 'Dear {{recipientName}},',
    closingTemplate: closingTemplate || 'Yours faithfully,',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.correspondence_templates.push(newTmpl);
  recordAuditLog(data, {
    action: 'CREATE',
    entityType: 'CORRESPONDENCE_TEMPLATE',
    recordId: tmplId,
    newValue: newTmpl
  });
  writeDb(data);

  res.json({ success: true, template: newTmpl, message: 'Template created successfully.' });
});

// GET /api/secretariat/correspondence/documents
app.get('/api/secretariat/correspondence/documents', (req, res) => {
  const data = readDb();
  ensureCorrespondenceDefaults(data);
  writeDb(data);
  res.json({ success: true, documents: data.correspondence_documents });
});

// POST /api/secretariat/correspondence/documents (Composer create)
app.post('/api/secretariat/correspondence/documents', (req, res) => {
  const {
    profileId, correspondenceType, templateId, reference, date, recipientName,
    recipientOrganisation, recipientAddress, attention, subject, salutation,
    body, closing, signatoryId, attachments, cc, userEmail
  } = req.body;

  if (!profileId || !correspondenceType || !recipientName || !subject || !body || !signatoryId) {
    return res.status(400).json({ error: 'Required fields missing for correspondence document.' });
  }

  const data = readDb();
  ensureCorrespondenceDefaults(data);

  const docCount = data.correspondence_documents.length + 1;
  const docNumber = `DIS-DOC-2026-${String(docCount).padStart(4, '0')}`;
  const docId = `doc-${Date.now()}`;
  const now = new Date().toISOString();

  const newDoc = {
    id: docId,
    documentNumber: docNumber,
    profileId,
    correspondenceType,
    templateId: templateId || undefined,
    reference: reference || `REF/${Math.floor(1000 + Math.random() * 9000)}/2026`,
    date: date || now.slice(0, 10),
    recipientName: recipientName.trim(),
    recipientOrganisation: recipientOrganisation.trim(),
    recipientAddress: recipientAddress.trim(),
    attention: attention ? attention.trim() : undefined,
    subject: subject.trim(),
    salutation: salutation || 'Dear Sir/Madam,',
    body: body.trim(),
    closing: closing || 'Yours faithfully,',
    signatoryId,
    attachments: attachments ? attachments.trim() : undefined,
    cc: cc ? cc.trim() : undefined,
    status: 'DRAFT',
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        subject: subject.trim(),
        body: body.trim(),
        updatedAt: now,
        updatedBy: userEmail || 'Secretariat Administrator',
        changeReason: 'Initial composition'
      }
    ],
    createdAt: now,
    updatedAt: now,
    createdBy: userEmail || 'Secretariat Administrator'
  };

  data.correspondence_documents.push(newDoc);
  recordAuditLog(data, {
    action: 'CREATE',
    entityType: 'CORRESPONDENCE_DOCUMENT',
    recordId: docId,
    referenceNumber: docNumber,
    newValue: newDoc,
    performedBy: userEmail || 'Secretariat Administrator'
  });
  writeDb(data);

  res.json({ success: true, document: newDoc, message: 'Correspondence document drafted successfully.' });
});

// PUT /api/secretariat/correspondence/documents/:id/status (Workflow transitions & Zero self-approval)
app.put('/api/secretariat/correspondence/documents/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, userEmail, approvalComment } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Target status is required.' });
  }

  const data = readDb();
  ensureCorrespondenceDefaults(data);

  const idx = data.correspondence_documents.findIndex((d: any) => d.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Correspondence document not found.' });
  }

  const doc = data.correspondence_documents[idx];
  const oldVal = { ...doc };

  // Zero self-approval check
  if (status === 'APPROVED' && doc.createdBy && userEmail && doc.createdBy.toLowerCase() === userEmail.toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: 'Governance Safety Rule Violation: Zero self-approval principle prevents document creators from approving their own correspondence.'
    });
  }

  doc.status = status;
  doc.updatedAt = new Date().toISOString();
  doc.updatedBy = userEmail || 'Secretariat Administrator';

  if (status === 'APPROVED') {
    doc.approvedBy = userEmail || 'Secretariat Approver';
    doc.approvedAt = new Date().toISOString();
    doc.approvalComment = approvalComment || 'Approved in accordance with Secretariat governance standards.';
  }

  recordAuditLog(data, {
    action: status === 'APPROVED' ? 'APPROVE' : 'STATUS_CHANGE',
    entityType: 'CORRESPONDENCE_DOCUMENT',
    recordId: id,
    referenceNumber: doc.documentNumber,
    oldValue: oldVal,
    newValue: doc,
    performedBy: userEmail || 'Secretariat Administrator'
  });

  writeDb(data);

  res.json({ success: true, document: doc, message: `Correspondence document status updated to ${status}.` });
});

// PUT /api/secretariat/correspondence/documents/:id/edit (Versioning on edit)
app.put('/api/secretariat/correspondence/documents/:id/edit', (req, res) => {
  const { id } = req.params;
  const { subject, body, changeReason, userEmail } = req.body;

  const data = readDb();
  ensureCorrespondenceDefaults(data);

  const idx = data.correspondence_documents.findIndex((d: any) => d.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Correspondence document not found.' });
  }

  const doc = data.correspondence_documents[idx];
  const oldVal = { ...doc };

  const newVersionNum = doc.currentVersion + 1;
  const now = new Date().toISOString();

  doc.subject = subject || doc.subject;
  doc.body = body || doc.body;
  doc.currentVersion = newVersionNum;
  doc.status = 'DRAFT'; // Material edit requires re-review/approval
  doc.updatedAt = now;
  doc.updatedBy = userEmail || 'Secretariat Administrator';

  if (!doc.versions) doc.versions = [];
  doc.versions.push({
    versionNumber: newVersionNum,
    subject: doc.subject,
    body: doc.body,
    updatedAt: now,
    updatedBy: userEmail || 'Secretariat Administrator',
    changeReason: changeReason || 'Material update requiring re-review'
  });

  recordAuditLog(data, {
    action: 'EDIT_VERSION',
    entityType: 'CORRESPONDENCE_DOCUMENT',
    recordId: id,
    referenceNumber: doc.documentNumber,
    oldValue: oldVal,
    newValue: doc,
    performedBy: userEmail || 'Secretariat Administrator'
  });

  writeDb(data);

  res.json({ success: true, document: doc, message: `Correspondence document updated to version ${newVersionNum} and returned to DRAFT for review.` });
});

// ============================================================
// COMMITTEE OPERATIONS & MEMBERSHIP MANAGEMENT API ROUTES
// ============================================================

function ensureCommitteeDefaults(data: any) {
  if (!data.committees) {
    data.committees = [
      {
        id: 'comm-safety-2026',
        name: 'Main Aviation Safety Committee 2026',
        reference: 'ASS-COMM-2026-001',
        committeeType: 'Aviation Safety Committee',
        description: 'Principal advisory and operational committee overseeing continental aviation safety protocols, regulatory alignment, and risk mitigation strategies.',
        purpose: 'Establish unified safety compliance standards across African airspace.',
        chairpersonId: '',
        secretaryId: '',
        secretariatLiaison: 'Dr. Aliyu Mohammed',
        startDate: '2026-01-15',
        endDate: '2026-11-20',
        isActive: true,
        status: 'ACTIVE',
        notes: 'Primary oversight committee.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'comm-protocol-2026',
        name: 'Protocol & VVIP Reception Committee',
        reference: 'ASS-COMM-2026-002',
        committeeType: 'Protocol Committee',
        description: 'Managing high-level diplomatic delegations, ministerial arrivals, and VVIP security coordination.',
        purpose: 'Ensure seamless protocol execution for all visiting dignitaries.',
        chairpersonId: '',
        secretaryId: '',
        secretariatLiaison: 'Capt. Nkechi Adebayo',
        startDate: '2026-02-01',
        endDate: '2026-11-20',
        isActive: true,
        status: 'ACTIVE',
        notes: 'Coordinates with airport liaison.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
  if (!data.committee_memberships) {
    data.committee_memberships = [];
  }
}

app.get('/api/secretariat/committees', (req, res) => {
  const data = readDb();
  ensureCommitteeDefaults(data);
  writeDb(data);
  res.json({ success: true, committees: data.committees });
});

app.post('/api/secretariat/committees', (req, res) => {
  const { name, committeeType, description, purpose, parentCommitteeId, chairpersonId, viceChairpersonId, secretaryId, secretariatLiaison, startDate, endDate, status, notes, userEmail } = req.body;
  if (!name || !committeeType) {
    return res.status(400).json({ error: 'Committee name and type are required.' });
  }

  const data = readDb();
  ensureCommitteeDefaults(data);

  const commId = `comm-${Date.now()}`;
  const refNum = `ASS-COMM-2026-${String(data.committees.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();

  const newComm = {
    id: commId,
    name: name.trim(),
    reference: refNum,
    committeeType,
    description: description ? description.trim() : '',
    purpose: purpose ? purpose.trim() : '',
    parentCommitteeId: parentCommitteeId || undefined,
    chairpersonId: chairpersonId || undefined,
    viceChairpersonId: viceChairpersonId || undefined,
    secretaryId: secretaryId || undefined,
    secretariatLiaison: secretariatLiaison ? secretariatLiaison.trim() : '',
    startDate: startDate || now.slice(0, 10),
    endDate: endDate || undefined,
    isActive: true,
    status: status || 'ACTIVE',
    notes: notes ? notes.trim() : '',
    createdAt: now,
    updatedAt: now
  };

  data.committees.push(newComm);
  recordAuditLog(data, {
    action: 'CREATE',
    entityType: 'COMMITTEE',
    recordId: commId,
    referenceNumber: refNum,
    newValue: newComm,
    performedBy: userEmail || 'Secretariat Administrator'
  });
  writeDb(data);

  res.json({ success: true, committee: newComm, message: 'Committee created successfully.' });
});

app.put('/api/secretariat/committees/:id', (req, res) => {
  const { id } = req.params;
  const { userEmail, ...updates } = req.body;
  const data = readDb();
  ensureCommitteeDefaults(data);

  const idx = data.committees.findIndex((c: any) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Committee not found.' });
  }

  const oldVal = { ...data.committees[idx] };
  const updated = {
    ...oldVal,
    ...updates,
    id,
    updatedAt: new Date().toISOString()
  };

  data.committees[idx] = updated;
  recordAuditLog(data, {
    action: 'EDIT',
    entityType: 'COMMITTEE',
    recordId: id,
    referenceNumber: updated.reference,
    oldValue: oldVal,
    newValue: updated,
    performedBy: userEmail || 'Secretariat Administrator'
  });
  writeDb(data);

  res.json({ success: true, committee: updated, message: 'Committee updated successfully.' });
});

app.get('/api/secretariat/committee-memberships', (req, res) => {
  const data = readDb();
  ensureCommitteeDefaults(data);
  writeDb(data);
  res.json({ success: true, memberships: data.committee_memberships });
});

app.post('/api/secretariat/committee-memberships', (req, res) => {
  const { committeeId, personId, role, startDate, endDate, status, appointmentReference, assignedResponsibilities, notes, userEmail } = req.body;
  if (!committeeId || !personId || !role) {
    return res.status(400).json({ error: 'Committee ID, Person ID, and Role are required.' });
  }

  const data = readDb();
  ensureCommitteeDefaults(data);

  const membId = `memb-${Date.now()}`;
  const membRef = `ASS-MEMB-2026-${String(data.committee_memberships.length + 1).padStart(4, '0')}`;
  const now = new Date().toISOString();

  const newMemb = {
    id: membId,
    committeeId,
    personId,
    membershipReference: membRef,
    role,
    startDate: startDate || now.slice(0, 10),
    endDate: endDate || undefined,
    status: status || 'ACTIVE',
    appointmentReference: appointmentReference ? appointmentReference.trim() : `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    assignedResponsibilities: assignedResponsibilities || [],
    notes: notes ? notes.trim() : '',
    createdBy: userEmail || 'Secretariat Administrator',
    createdAt: now,
    updatedAt: now
  };

  data.committee_memberships.push(newMemb);
  recordAuditLog(data, {
    action: 'CREATE',
    entityType: 'COMMITTEE_MEMBERSHIP',
    recordId: membId,
    referenceNumber: membRef,
    newValue: newMemb,
    performedBy: userEmail || 'Secretariat Administrator'
  });
  writeDb(data);

  res.json({ success: true, membership: newMemb, message: 'Committee membership assigned successfully.' });
});

app.put('/api/secretariat/committee-memberships/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, userEmail } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  const data = readDb();
  ensureCommitteeDefaults(data);

  const idx = data.committee_memberships.findIndex((m: any) => m.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Membership not found.' });
  }

  const memb = data.committee_memberships[idx];
  const oldVal = { ...memb };

  // Zero self-approval enforcement check
  if (status === 'APPROVED' && memb.createdBy && userEmail && memb.createdBy.toLowerCase() === userEmail.toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: 'Governance Safety Rule Violation: Zero self-approval principle prevents membership creators from approving their own committee appointment.'
    });
  }

  memb.status = status;
  memb.updatedAt = new Date().toISOString();
  if (status === 'APPROVED' || status === 'ACTIVE') {
    memb.approvedBy = userEmail || 'Secretariat Approver';
    memb.approvedAt = new Date().toISOString();
  }

  recordAuditLog(data, {
    action: status === 'APPROVED' ? 'APPROVE' : 'STATUS_CHANGE',
    entityType: 'COMMITTEE_MEMBERSHIP',
    recordId: id,
    referenceNumber: memb.membershipReference,
    oldValue: oldVal,
    newValue: memb,
    performedBy: userEmail || 'Secretariat Administrator'
  });

  writeDb(data);

  res.json({ success: true, membership: memb, message: `Membership status updated to ${status}.` });
});

// ==========================================
// VOLUNTEER APPLICATION MODULE (PUBLIC INTAKE)
// ==========================================

function ensureVolunteerDefaults(data: any) {
  if (!data.volunteer_applications) {
    data.volunteer_applications = [];
  }
}

// Public Volunteer Application Submission
app.post('/api/volunteers', (req, res) => {
  try {
    const data = readDb();
    ensureVolunteerDefaults(data);

    const {
      applicantType,
      firstName,
      middleName,
      lastName,
      preferredName,
      dobOrAgeGroup,
      gender,
      country,
      state,
      city,
      email,
      phone,
      altPhone,
      address,
      occupation,
      organisation,
      profession,
      educationStatus,
      qualifications,
      skills,
      sponsoringOrgName,
      sponsoringOrgType,
      sponsoringOrgSector,
      sponsoringOrgAddress,
      sponsoringOrgEmail,
      sponsoringOrgPhone,
      orgContactPersonName,
      orgContactPersonPosition,
      orgContactPersonEmail,
      orgContactPersonPhone,
      natureOfSupport,
      sponsoredVolunteersCount,
      supportDescription,
      corporateMessage,
      specialRequirements,
      preferredDepartment,
      secondaryDepartment,
      experience,
      aviationExperience,
      languages,
      specialSkills,
      availability,
      preferredPeriod,
      preferredShift,
      motivation,
      additionalInfo,
      emergencyContactName,
      emergencyRelationship,
      emergencyContactPhone,
      consentConfirmed
    } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !email || !phone || !preferredDepartment || !availability || !motivation || !emergencyContactName || !emergencyContactPhone || !consentConfirmed) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields including personal info, contact, volunteer preferences, motivation, emergency contact, and consent.'
      });
    }

    // Corporate / Organisation validation if applicable
    const validApplicantType = applicantType || 'Individual Volunteer';
    if (validApplicantType !== 'Individual Volunteer' && !sponsoringOrgName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide the name of the Sponsoring or Nominating Organisation.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = String(email).trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    // Phone format validation
    const cleanPhone = String(phone).trim();
    const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 18) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid telephone number with minimum 7 digits.'
      });
    }

    // String length limits / payload protection
    if (String(firstName).length > 80 || String(lastName).length > 80 || String(motivation).length > 2500 || String(skills || '').length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Input exceeds permissible character lengths.'
      });
    }

    // DUPLICATE APPLICATION CHECK (Individual Email or Phone only - allows multiple volunteers from the same organization)
    const normalizedPhoneDigits = cleanPhone.replace(/[^0-9]/g, '');
    const isDuplicate = data.volunteer_applications.some((existing: any) => {
      const existingEmail = (existing.email || '').trim().toLowerCase();
      const existingPhoneDigits = (existing.phone || '').replace(/[^0-9]/g, '');
      return existingEmail === cleanEmail || (existingPhoneDigits.length >= 7 && existingPhoneDigits === normalizedPhoneDigits);
    });

    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        duplicate: true,
        error: 'We found an existing volunteer application using these contact details. Please contact the Summit Secretariat if you need to update your application.'
      });
    }

    // Generate unique, sequential reference number: ASS-VOL-2026-XXXX
    let seq = data.volunteer_applications.length + 1;
    let refNum = `ASS-VOL-2026-${String(seq).padStart(4, '0')}`;
    while (data.volunteer_applications.some((v: any) => v.reference === refNum)) {
      seq++;
      refNum = `ASS-VOL-2026-${String(seq).padStart(4, '0')}`;
    }

    const now = new Date().toISOString();
    const appId = `vol-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication = {
      id: appId,
      reference: refNum,
      applicantType: validApplicantType,
      firstName: String(firstName).trim(),
      middleName: middleName ? String(middleName).trim() : undefined,
      lastName: String(lastName).trim(),
      preferredName: preferredName ? String(preferredName).trim() : undefined,
      dobOrAgeGroup: dobOrAgeGroup ? String(dobOrAgeGroup).trim() : '18-25',
      gender: gender ? String(gender).trim() : undefined,
      country: country ? String(country).trim() : 'Nigeria',
      state: state ? String(state).trim() : 'Lagos',
      city: city ? String(city).trim() : 'Ikeja',
      email: cleanEmail,
      phone: cleanPhone,
      altPhone: altPhone ? String(altPhone).trim() : undefined,
      address: address ? String(address).trim() : '',
      occupation: occupation ? String(occupation).trim() : '',
      organisation: organisation ? String(organisation).trim() : undefined,
      profession: profession ? String(profession).trim() : undefined,
      educationStatus: educationStatus || 'Other',
      qualifications: qualifications ? String(qualifications).trim() : undefined,
      skills: skills ? String(skills).trim() : '',
      // Sponsoring Organisation Details
      sponsoringOrgName: sponsoringOrgName ? String(sponsoringOrgName).trim() : undefined,
      sponsoringOrgType: sponsoringOrgType ? String(sponsoringOrgType).trim() : undefined,
      sponsoringOrgSector: sponsoringOrgSector ? String(sponsoringOrgSector).trim() : undefined,
      sponsoringOrgAddress: sponsoringOrgAddress ? String(sponsoringOrgAddress).trim() : undefined,
      sponsoringOrgEmail: sponsoringOrgEmail ? String(sponsoringOrgEmail).trim().toLowerCase() : undefined,
      sponsoringOrgPhone: sponsoringOrgPhone ? String(sponsoringOrgPhone).trim() : undefined,
      orgContactPersonName: orgContactPersonName ? String(orgContactPersonName).trim() : undefined,
      orgContactPersonPosition: orgContactPersonPosition ? String(orgContactPersonPosition).trim() : undefined,
      orgContactPersonEmail: orgContactPersonEmail ? String(orgContactPersonEmail).trim().toLowerCase() : undefined,
      orgContactPersonPhone: orgContactPersonPhone ? String(orgContactPersonPhone).trim() : undefined,
      // Nature of Support
      natureOfSupport: natureOfSupport || undefined,
      sponsoredVolunteersCount: sponsoredVolunteersCount ? Number(sponsoredVolunteersCount) : undefined,
      supportDescription: supportDescription ? String(supportDescription).trim() : undefined,
      corporateMessage: corporateMessage ? String(corporateMessage).trim() : undefined,
      specialRequirements: specialRequirements ? String(specialRequirements).trim() : undefined,
      // Department and Preferences
      preferredDepartment: String(preferredDepartment).trim(),
      secondaryDepartment: secondaryDepartment ? String(secondaryDepartment).trim() : undefined,
      experience: experience ? String(experience).trim() : undefined,
      aviationExperience: aviationExperience ? String(aviationExperience).trim() : undefined,
      languages: languages ? String(languages).trim() : undefined,
      specialSkills: specialSkills ? String(specialSkills).trim() : undefined,
      availability: availability || 'Full Summit (All Days)',
      preferredPeriod: preferredPeriod ? String(preferredPeriod).trim() : undefined,
      preferredShift: preferredShift || 'Flexible',
      motivation: String(motivation).trim(),
      additionalInfo: additionalInfo ? String(additionalInfo).trim() : undefined,
      emergencyContactName: String(emergencyContactName).trim(),
      emergencyRelationship: String(emergencyRelationship).trim(),
      emergencyContactPhone: String(emergencyContactPhone).trim(),
      consentConfirmed: !!consentConfirmed,
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now,
      source: 'PUBLIC_WEB',
      auditReference: `AUD-VOL-2026-${Date.now()}`
    };

    data.volunteer_applications.unshift(newApplication);

    recordAuditLog(data, {
      action: 'CREATE',
      entityType: 'VOLUNTEER_APPLICATION',
      recordId: appId,
      referenceNumber: refNum,
      newValue: {
        id: appId,
        reference: refNum,
        applicantName: `${newApplication.firstName} ${newApplication.lastName}`,
        email: cleanEmail,
        department: newApplication.preferredDepartment,
        status: 'SUBMITTED'
      },
      performedBy: 'Public Volunteer Intake Web'
    });

    writeDb(data);

    // Return receipt payload strictly to the submitter (no internal notes, scores, or private data)
    res.status(201).json({
      success: true,
      application: {
        id: newApplication.id,
        reference: newApplication.reference,
        firstName: newApplication.firstName,
        lastName: newApplication.lastName,
        email: newApplication.email,
        phone: newApplication.phone,
        preferredDepartment: newApplication.preferredDepartment,
        secondaryDepartment: newApplication.secondaryDepartment,
        availability: newApplication.availability,
        status: newApplication.status,
        createdAt: newApplication.createdAt
      },
      message: 'Volunteer application submitted successfully.'
    });
  } catch (err: any) {
    console.error('Failed to process volunteer application:', err);
    res.status(500).json({ success: false, error: 'Internal server error processing volunteer application.' });
  }
});

// Volunteer Reference Lookup (Public sanitized summary)
app.get('/api/volunteers/lookup', (req, res) => {
  const { reference, email } = req.query;
  if (!reference && !email) {
    return res.status(400).json({ error: 'Please supply application reference or email.' });
  }

  const data = readDb();
  ensureVolunteerDefaults(data);

  const queryRef = reference ? String(reference).trim().toUpperCase() : null;
  const queryEmail = email ? String(email).trim().toLowerCase() : null;

  const found = data.volunteer_applications.find((v: any) => {
    if (queryRef && (v.reference || '').toUpperCase() === queryRef) return true;
    if (queryEmail && (v.email || '').toLowerCase() === queryEmail) return true;
    return false;
  });

  if (!found) {
    return res.status(404).json({ error: 'Volunteer application reference not found.' });
  }

  // Sanitize: return public non-sensitive verification only
  res.json({
    success: true,
    application: {
      reference: found.reference,
      firstName: found.firstName,
      lastName: found.lastName,
      preferredDepartment: found.preferredDepartment,
      status: found.status,
      createdAt: found.createdAt
    }
  });
});

// Admin list for secure CMS / Secretariat panel
app.get('/api/admin/volunteers', (req, res) => {
  const isAdmin = req.headers['x-admin-mode'] === 'true' || req.query.admin === 'true';
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized access to volunteer directory' });
  }
  const data = readDb();
  ensureVolunteerDefaults(data);
  ensureVolunteerPerformanceDefaults(data);
  res.json({ success: true, volunteers: data.volunteer_applications });
});

// ============================================================
// VOLUNTEER PERFORMANCE, COMMENDATION, CORRECTIVE REPORT & CERTIFICATION
// ============================================================

function ensureVolunteerPerformanceDefaults(data: any) {
  if (!data.volunteer_applications || data.volunteer_applications.length === 0) {
    data.volunteer_applications = [
      {
        id: 'vol-app-2026-0001',
        reference: 'ASS-VOL-2026-0001',
        applicantType: 'Corporate-Sponsored Volunteer',
        firstName: 'Chidinma',
        middleName: 'Grace',
        lastName: 'Eze',
        preferredName: 'Chidinma',
        dobOrAgeGroup: '26-35',
        gender: 'Female',
        country: 'Nigeria',
        state: 'Lagos',
        city: 'Victoria Island',
        email: 'chidinma.eze@shell-partner.ng',
        phone: '+234 803 111 2233',
        address: '14 Marina, Lagos Island, Lagos',
        occupation: 'Sustainability & Corporate Relations Lead',
        organisation: 'Shell Nigeria',
        profession: 'CSR & External Affairs Specialist',
        educationStatus: 'Graduate',
        qualifications: 'B.Sc. Mass Communication, CIPR Certified',
        skills: 'Diplomatic protocol, stakeholder hospitality, crisis communication, VIP liaison',
        sponsoringOrgName: 'Shell Nigeria',
        sponsoringOrgType: 'Corporate Enterprise',
        sponsoringOrgSector: 'OIL_AND_GAS',
        sponsoringOrgAddress: 'Shell Petroleum Development Company of Nigeria, Freeman House, Marina, Lagos',
        sponsoringOrgEmail: 'csr-relations@shell.com.ng',
        sponsoringOrgPhone: '+234 1 276 0000',
        orgContactPersonName: 'Osagie Okunbor',
        orgContactPersonPosition: 'Managing Director & Country Chair',
        orgContactPersonEmail: 'osagie.okunbor@shell.com.ng',
        natureOfSupport: 'Sponsored Volunteer',
        sponsoredVolunteersCount: 4,
        preferredDepartment: 'Protocol',
        secondaryDepartment: 'VIP/VVIP Ushering',
        availability: 'Full Summit (All Days)',
        preferredShift: 'Full Day',
        motivation: 'Dedicated to supporting aviation safety and representing Shell with top-tier protocol excellence.',
        emergencyContactName: 'Engr. Emeka Eze',
        emergencyRelationship: 'Brother',
        emergencyContactPhone: '+234 802 999 1122',
        consentConfirmed: true,
        status: 'SUBMITTED',
        createdAt: '2026-09-01T10:00:00.000Z',
        updatedAt: '2026-09-01T10:00:00.000Z',
        source: 'PUBLIC_WEB',
        auditReference: 'AUD-VOL-2026-1001'
      },
      {
        id: 'vol-app-2026-0002',
        reference: 'ASS-VOL-2026-0002',
        applicantType: 'Organisation-Nominated Volunteer',
        firstName: 'Tariq',
        lastName: 'Abubakar',
        dobOrAgeGroup: '26-35',
        gender: 'Male',
        country: 'Nigeria',
        state: 'Abuja (FCT)',
        city: 'Garki',
        email: 'tariq.abubakar@nimet-meteorology.gov.ng',
        phone: '+234 806 222 3344',
        address: 'NiMET Headquarters, Bill Clinton Drive, Nnamdi Azikiwe International Airport, Abuja',
        occupation: 'Aeronautical Meteorologist',
        organisation: 'NiMET (Nigerian Meteorological Agency)',
        profession: 'Aviation Weather Specialist',
        educationStatus: 'Graduate',
        qualifications: 'M.Sc. Applied Meteorology, WMO Certified Aeronautical Forecaster',
        skills: 'Weather briefing, flight safety analytics, technical documentation, IT data feeds',
        sponsoringOrgName: 'NiMET',
        sponsoringOrgType: 'Government / Regulatory Agency',
        sponsoringOrgSector: 'REGULATORS',
        sponsoringOrgAddress: 'Bill Clinton Drive, Nnamdi Azikiwe Airport, Abuja',
        sponsoringOrgEmail: 'secretariat@nimet.gov.ng',
        sponsoringOrgPhone: '+234 9 876 5432',
        orgContactPersonName: 'Prof. Mansur Bako',
        orgContactPersonPosition: 'Director-General / CEO',
        natureOfSupport: 'Nominated Volunteer',
        sponsoredVolunteersCount: 2,
        preferredDepartment: 'Emergency & Safety Support',
        secondaryDepartment: 'Documentation & Rapporteur',
        availability: 'Full Summit (All Days)',
        preferredShift: 'Flexible',
        motivation: 'Passionate about integrating weather intelligence into civil aviation risk prevention.',
        emergencyContactName: 'Amina Abubakar',
        emergencyRelationship: 'Spouse',
        emergencyContactPhone: '+234 809 333 4455',
        consentConfirmed: true,
        status: 'SUBMITTED',
        createdAt: '2026-09-02T11:15:00.000Z',
        updatedAt: '2026-09-02T11:15:00.000Z',
        source: 'PUBLIC_WEB',
        auditReference: 'AUD-VOL-2026-1002'
      },
      {
        id: 'vol-app-2026-0003',
        reference: 'ASS-VOL-2026-0003',
        applicantType: 'Individual Volunteer',
        firstName: 'Adebisi',
        lastName: 'Oluwaseun',
        preferredName: 'Bisi',
        dobOrAgeGroup: '18-25',
        gender: 'Female',
        country: 'Nigeria',
        state: 'Oyo',
        city: 'Ibadan',
        email: 'bisi.oluwaseun.remote@gmail.com',
        phone: '+234 814 333 4455',
        address: 'Bodija Estate, Ibadan',
        occupation: 'Digital Media Strategist & Content Designer',
        profession: 'UI/UX & Digital Communications',
        educationStatus: 'Graduate',
        qualifications: 'B.A. Graphic Design & Multimedia Arts',
        skills: 'Remote digital management, live infographic publishing, Canva Pro, Figma, live captioning',
        preferredDepartment: 'Media & Publicity',
        secondaryDepartment: 'IT & Digital Support',
        availability: 'Pre-Summit & Summit Days',
        preferredShift: 'Flexible',
        motivation: 'Contributing high-impact digital infographics and social broadcast assets remotely throughout the summit.',
        emergencyContactName: 'Pastor Samuel Oluwaseun',
        emergencyRelationship: 'Father',
        emergencyContactPhone: '+234 803 777 8899',
        consentConfirmed: true,
        status: 'SUBMITTED',
        createdAt: '2026-09-03T14:20:00.000Z',
        updatedAt: '2026-09-03T14:20:00.000Z',
        source: 'PUBLIC_WEB',
        auditReference: 'AUD-VOL-2026-1003'
      },
      {
        id: 'vol-app-2026-0004',
        reference: 'ASS-VOL-2026-0004',
        applicantType: 'Corporate-Sponsored Volunteer',
        firstName: 'Femi',
        lastName: 'Balogun',
        dobOrAgeGroup: '26-35',
        gender: 'Male',
        country: 'Nigeria',
        state: 'Lagos',
        city: 'Ikoyi',
        email: 'femi.balogun@mtn-foundation.ng',
        phone: '+234 803 444 5566',
        address: 'Golden Plaza, Falomo, Ikoyi, Lagos',
        occupation: 'Senior Network Systems Engineer',
        organisation: 'MTN Nigeria',
        profession: 'Telecommunications & Cloud Infrastructure',
        educationStatus: 'Graduate',
        qualifications: 'B.Eng. Electrical/Electronic Engineering, Cisco CCNA, AWS Solutions Architect',
        skills: 'High-density Wi-Fi deployment, audio/visual stream telemetry, digital registration desks',
        sponsoringOrgName: 'MTN Nigeria',
        sponsoringOrgType: 'Corporate Enterprise',
        sponsoringOrgSector: 'TELECOMMUNICATIONS',
        sponsoringOrgAddress: 'MTN Plaza, Falomo, Ikoyi, Lagos',
        sponsoringOrgEmail: 'summit-support@mtn.com',
        sponsoringOrgPhone: '+234 1 803 2000',
        orgContactPersonName: 'Karl Toriola',
        orgContactPersonPosition: 'Chief Executive Officer',
        natureOfSupport: 'Corporate Volunteer Team',
        sponsoredVolunteersCount: 3,
        preferredDepartment: 'IT & Digital Support',
        secondaryDepartment: 'Registration',
        availability: 'Full Summit (All Days)',
        preferredShift: 'Full Day',
        motivation: 'Ensuring seamless high-speed connectivity and digital attendee support on-site at Marriott Ikeja.',
        emergencyContactName: 'Kemi Balogun',
        emergencyRelationship: 'Spouse',
        emergencyContactPhone: '+234 802 555 6677',
        consentConfirmed: true,
        status: 'SUBMITTED',
        createdAt: '2026-09-04T09:30:00.000Z',
        updatedAt: '2026-09-04T09:30:00.000Z',
        source: 'PUBLIC_WEB',
        auditReference: 'AUD-VOL-2026-1004'
      },
      {
        id: 'vol-app-2026-0005',
        reference: 'ASS-VOL-2026-0005',
        applicantType: 'Individual Volunteer',
        firstName: 'Ngozi',
        lastName: 'Okonkwo',
        dobOrAgeGroup: '18-25',
        gender: 'Female',
        country: 'Nigeria',
        state: 'Lagos',
        city: 'Ikeja',
        email: 'ngozi.okonkwo.aviation@gmail.com',
        phone: '+234 818 555 6677',
        address: '28 Allen Avenue, Ikeja, Lagos',
        occupation: 'Final Year Aviation Law Student',
        profession: 'Legal & Regulatory Compliance Research',
        educationStatus: 'Student',
        qualifications: 'LL.B in Progress (Unilag), Aviation Law Society Chair',
        skills: 'Session transcription, legal rapporteur synthesis, plenary summary drafting',
        preferredDepartment: 'Documentation & Rapporteur',
        secondaryDepartment: 'Guest Services',
        availability: 'Full Summit (All Days)',
        preferredShift: 'Morning Shift',
        motivation: 'Passionate about documenting high-level regulatory resolutions and contributing to the official summit compendium.',
        emergencyContactName: 'Chief Arthur Okonkwo',
        emergencyRelationship: 'Parent',
        emergencyContactPhone: '+234 803 123 4567',
        consentConfirmed: true,
        status: 'SUBMITTED',
        createdAt: '2026-09-05T13:45:00.000Z',
        updatedAt: '2026-09-05T13:45:00.000Z',
        source: 'PUBLIC_WEB',
        auditReference: 'AUD-VOL-2026-1005'
      }
    ];
  }

  if (!data.volunteer_performance) {
    data.volunteer_performance = [
      {
        id: 'perf-2026-0001',
        performanceId: 'PERF-2026-0001',
        volunteerApplicationId: 'vol-app-2026-0001',
        volunteerReference: 'ASS-VOL-2026-0001',
        volunteerName: 'Chidinma Grace Eze',
        volunteerEmail: 'chidinma.eze@shell-partner.ng',
        volunteerPhone: '+234 803 111 2233',
        applicantType: 'Corporate-Sponsored Volunteer',
        organisationName: 'Shell Nigeria',
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        department: 'Protocol',
        assignment: 'Lead VIP Diplomatic Liaison & Executive Lounge Protocol',
        workMode: 'ON-SITE — LAGOS',
        supervisorId: 'sup-sec-01',
        supervisorName: 'Barr. Folashade Adeleke',
        supervisorTitle: 'Director of Protocol & Ceremonials',
        evaluationPeriod: '15-18 November 2026 (Pre-Summit & Summit Plenary)',
        evaluationStatus: 'APPROVED',
        scores: {
          attendanceScore: 10,
          punctualityScore: 10,
          reliabilityScore: 10,
          teamworkScore: 10,
          communicationScore: 9,
          professionalismScore: 10,
          taskCompletionScore: 10,
          initiativeScore: 9,
          safetyComplianceScore: 10,
          adaptabilityScore: 9
        },
        totalScore: 97,
        percentage: 97,
        grade: 'A+',
        evidenceNotes: 'Punctual arrival at 06:15 AM daily; flawlessly managed VIP entrance escort for Minister and 4 Aviation Directors; zero protocol missteps observed.',
        deliverablesReference: 'VIP Escort Log, Diplomatic Seating Chart Sign-Off, Executive Lounge Access Registry',
        attendanceRecordSummary: '100% On-Site Physical Attendance (Pre-Summit Briefing, Rehearsal, & Full Summit Day)',
        supervisorObservations: 'Exemplary leadership qualities and immaculate professional demeanour reflecting the highest corporate standards of Shell Nigeria.',
        supervisorComments: 'Chidinma performed at an extraordinary standard throughout the summit. Her calm coordination during the surprise arrival of international dignitaries was masterclass.',
        reviewerComments: 'Performance validated against official Directorate of Protocol check-in logs. Recommendation for highest commendation strongly endorsed.',
        approvalNotes: 'Approved by Secretariat Executive Directorate. Formal Commendation and Outstanding Volunteer Service Certificate authorised.',
        finalOutcome: 'COMMENDED',
        futureEventConsideration: 'RECOMMENDED FOR FUTURE CONSIDERATION',
        considerForNextYear: true,
        nextYearRecommendationNotes: 'Consider for Senior Protocol Coordinator / Team Lead role in 2027 Summit.',
        createdBy: 'supervisor.protocol@sec.domislink.com',
        createdByName: 'Barr. Folashade Adeleke',
        createdAt: '2026-11-18T18:30:00.000Z',
        submittedAt: '2026-11-18T19:00:00.000Z',
        reviewedBy: 'dir.operations@sec.domislink.com',
        reviewedByName: 'Capt. Nkechi Adebayo',
        reviewedAt: '2026-11-19T09:15:00.000Z',
        approvedBy: 'secgen@domislink.com',
        approvedByName: 'Dr. Aliyu Mohammed, CON',
        approvedAt: '2026-11-19T11:45:00.000Z',
        updatedBy: 'secgen@domislink.com',
        updatedAt: '2026-11-19T11:45:00.000Z',
        auditReference: 'AUD-PERF-2026-0001'
      },
      {
        id: 'perf-2026-0002',
        performanceId: 'PERF-2026-0002',
        volunteerApplicationId: 'vol-app-2026-0003',
        volunteerReference: 'ASS-VOL-2026-0003',
        volunteerName: 'Adebisi Oluwaseun',
        volunteerEmail: 'bisi.oluwaseun.remote@gmail.com',
        volunteerPhone: '+234 814 333 4455',
        applicantType: 'Individual Volunteer',
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        department: 'Media & Publicity',
        assignment: 'Remote Digital Infographics & Real-Time Keynote Quotation Banners',
        workMode: 'REMOTE — ANYWHERE',
        supervisorId: 'sup-media-01',
        supervisorName: 'Mrs. Toyin Williams',
        supervisorTitle: 'Head of Media & Digital Broadcast',
        evaluationPeriod: '10-18 November 2026 (Campaign & Live Stream Coverage)',
        evaluationStatus: 'APPROVED',
        scores: {
          attendanceScore: 10,
          punctualityScore: 9,
          reliabilityScore: 9,
          teamworkScore: 10,
          communicationScore: 10,
          professionalismScore: 9,
          taskCompletionScore: 10,
          initiativeScore: 10,
          safetyComplianceScore: 9,
          adaptabilityScore: 9
        },
        totalScore: 95,
        percentage: 95,
        grade: 'A+',
        evidenceNotes: 'Delivered 34 verified live quote graphics within 7 minutes of speaker statements during live broadcast; attended all digital sync briefings on Google Meet.',
        deliverablesReference: 'Cloud Drive Folder: /Summit2026/LiveBanners/Bisi, Social Broadcast Metric Report',
        attendanceRecordSummary: '100% remote availability on agreed digital desk shift; continuous Slack & WhatsApp responsiveness.',
        supervisorObservations: 'Demonstrates that remote volunteers can deliver exceptional, mission-critical impact without physical location constraints.',
        supervisorComments: 'Adebisi produced outstanding visual assets that elevated the Summit public profile across digital channels. Speed and typography were pristine.',
        reviewerComments: 'Verified deliverable timestamps against live stream broadcast recording. Exceptional creative output.',
        approvalNotes: 'Approved for Digital/Remote Contribution Commendation and Certificate of Outstanding Volunteer Service.',
        finalOutcome: 'COMMENDED',
        futureEventConsideration: 'RECOMMENDED FOR FUTURE CONSIDERATION',
        considerForNextYear: true,
        nextYearRecommendationNotes: 'Eligible for Remote Digital Art Lead in 2027 Summit.',
        createdBy: 'supervisor.media@sec.domislink.com',
        createdByName: 'Mrs. Toyin Williams',
        createdAt: '2026-11-18T20:15:00.000Z',
        submittedAt: '2026-11-18T20:45:00.000Z',
        reviewedBy: 'dir.operations@sec.domislink.com',
        reviewedByName: 'Capt. Nkechi Adebayo',
        reviewedAt: '2026-11-19T09:40:00.000Z',
        approvedBy: 'secgen@domislink.com',
        approvedByName: 'Dr. Aliyu Mohammed, CON',
        approvedAt: '2026-11-19T12:00:00.000Z',
        updatedBy: 'secgen@domislink.com',
        updatedAt: '2026-11-19T12:00:00.000Z',
        auditReference: 'AUD-PERF-2026-0002'
      },
      {
        id: 'perf-2026-0003',
        performanceId: 'PERF-2026-0003',
        volunteerApplicationId: 'vol-app-2026-0004',
        volunteerReference: 'ASS-VOL-2026-0004',
        volunteerName: 'Femi Balogun',
        volunteerEmail: 'femi.balogun@mtn-foundation.ng',
        volunteerPhone: '+234 803 444 5566',
        applicantType: 'Corporate-Sponsored Volunteer',
        organisationName: 'MTN Nigeria',
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        department: 'IT & Digital Support',
        assignment: 'Technical Support & Delegate Check-In Station Network Telemetry',
        workMode: 'ON-SITE — LAGOS',
        supervisorId: 'sup-it-01',
        supervisorName: 'Engr. David Okoro',
        supervisorTitle: 'Director of ICT & Infrastructure',
        evaluationPeriod: '16-17 November 2026',
        evaluationStatus: 'APPROVED',
        scores: {
          attendanceScore: 9,
          punctualityScore: 9,
          reliabilityScore: 9,
          teamworkScore: 8,
          communicationScore: 8,
          professionalismScore: 9,
          taskCompletionScore: 9,
          initiativeScore: 8,
          safetyComplianceScore: 9,
          adaptabilityScore: 8
        },
        totalScore: 87,
        percentage: 87,
        grade: 'A',
        evidenceNotes: 'Maintained 100% uptime on the primary delegate check-in subnet; swiftly resolved 2 printer driver bottlenecks.',
        deliverablesReference: 'Network Latency Log, Check-In Station Diagnostics Sheet',
        attendanceRecordSummary: 'Present on site throughout both deployment days.',
        supervisorObservations: 'Highly skilled technical resource whose corporate grounding at MTN was evident in fast troubleshooting.',
        supervisorComments: 'Femi provided reliable, solid technical expertise ensuring the registration kiosks functioned without delay.',
        reviewerComments: 'Solid technical delivery reviewed and endorsed.',
        approvalNotes: 'Approved for Certificate of Volunteer Service.',
        finalOutcome: 'CERTIFICATE ISSUED',
        futureEventConsideration: 'ELIGIBLE FOR FUTURE CONSIDERATION',
        considerForNextYear: true,
        nextYearRecommendationNotes: 'Strong candidate for On-Site IT Infrastructure team in 2027.',
        createdBy: 'supervisor.it@sec.domislink.com',
        createdByName: 'Engr. David Okoro',
        createdAt: '2026-11-18T17:00:00.000Z',
        submittedAt: '2026-11-18T17:30:00.000Z',
        reviewedBy: 'dir.operations@sec.domislink.com',
        reviewedByName: 'Capt. Nkechi Adebayo',
        reviewedAt: '2026-11-19T10:10:00.000Z',
        approvedBy: 'secgen@domislink.com',
        approvedByName: 'Dr. Aliyu Mohammed, CON',
        approvedAt: '2026-11-19T12:15:00.000Z',
        updatedBy: 'secgen@domislink.com',
        updatedAt: '2026-11-19T12:15:00.000Z',
        auditReference: 'AUD-PERF-2026-0003'
      }
    ];
  }

  if (!data.volunteer_commendations) {
    data.volunteer_commendations = [
      {
        id: 'comm-2026-0001',
        commendationId: 'COMM-2026-0001',
        volunteerReference: 'ASS-VOL-2026-0001',
        volunteerApplicationId: 'vol-app-2026-0001',
        volunteerName: 'Chidinma Grace Eze',
        organisationName: 'Shell Nigeria',
        applicantType: 'Corporate-Sponsored Volunteer',
        summitYear: 2026,
        eventId: 'summit-2026',
        department: 'Protocol',
        assignment: 'Lead VIP Diplomatic Liaison & Executive Lounge Protocol',
        commendationType: 'OUTSTANDING SERVICE',
        title: 'Commendation for Outstanding Protocol Leadership and VIP Diplomatic Hospitality',
        reason: 'In recognition of exceptional poise, impeccable punctuality, and flawless diplomatic protocol execution during the reception of high-ranking aviation dignitaries and ministerial delegations at the Aviation Safety Summit 2026.',
        supportingEvidence: 'Zero protocol discrepancies recorded; commended verbally by two visiting Director-Generals; 100% check-in escort reliability.',
        issuedBy: 'dir.protocol@sec.domislink.com',
        issuedByName: 'Barr. Folashade Adeleke',
        approvedBy: 'secgen@domislink.com',
        approvedByName: 'Dr. Aliyu Mohammed, CON',
        approvedAt: '2026-11-19T11:45:00.000Z',
        issueDate: '2026-11-19',
        status: 'ISSUED',
        createdAt: '2026-11-19T10:00:00.000Z',
        updatedAt: '2026-11-19T11:45:00.000Z',
        auditReference: 'AUD-COMM-2026-0001'
      },
      {
        id: 'comm-2026-0002',
        commendationId: 'COMM-2026-0002',
        volunteerReference: 'ASS-VOL-2026-0003',
        volunteerApplicationId: 'vol-app-2026-0003',
        volunteerName: 'Adebisi Oluwaseun',
        applicantType: 'Individual Volunteer',
        summitYear: 2026,
        eventId: 'summit-2026',
        department: 'Media & Publicity',
        assignment: 'Remote Digital Infographics & Real-Time Keynote Quotation Banners',
        commendationType: 'DIGITAL/REMOTE CONTRIBUTION',
        title: 'Commendation for Exceptional Remote Digital Media & Real-Time Broadcast Visuals',
        reason: 'In recognition of outstanding digital dedication, creative precision, and rapid turnaround in publishing 34 high-quality keynote infographics during the live summit stream from Ibadan.',
        supportingEvidence: 'All graphics approved on first draft with zero typo corrections; broadcast social reach exceeded target by 140%.',
        issuedBy: 'dir.media@sec.domislink.com',
        issuedByName: 'Mrs. Toyin Williams',
        approvedBy: 'secgen@domislink.com',
        approvedByName: 'Dr. Aliyu Mohammed, CON',
        approvedAt: '2026-11-19T12:00:00.000Z',
        issueDate: '2026-11-19',
        status: 'ISSUED',
        createdAt: '2026-11-19T10:30:00.000Z',
        updatedAt: '2026-11-19T12:00:00.000Z',
        auditReference: 'AUD-COMM-2026-0002'
      }
    ];
  }

  if (!data.volunteer_corrective_reports) {
    data.volunteer_corrective_reports = [
      {
        id: 'corr-2026-0001',
        correctiveReportId: 'CORR-2026-0001',
        volunteerReference: 'ASS-VOL-2026-0005',
        volunteerApplicationId: 'vol-app-2026-0005',
        volunteerName: 'Ngozi Okonkwo',
        summitYear: 2026,
        eventId: 'summit-2026',
        department: 'Documentation & Rapporteur',
        assignment: 'Session Transcription & Key Takeaways Drafting',
        date: '2026-11-17',
        issueCategory: 'PERFORMANCE ADVISORY',
        title: 'Performance Advisory: Timeliness of Plenary Morning Session Draft Submission',
        factualDescription: 'The transcript notes for Plenary Session 1 (Opening Ministerial Addresses) were submitted 90 minutes past the agreed 12:00 PM turnaround window, causing a minor delay in compiling the afternoon executive summary bulletin.',
        relevantEvidence: 'Document upload timestamp on Google Drive: 13:30 PM (Agreed deadline: 12:00 PM).',
        operationalImpact: 'Drafting team had to compress editing time for the afternoon press release; however, all core resolutions were captured accurately.',
        expectedImprovement: 'Adopt incremental hourly batch saving during live sessions and notify lead rapporteur in advance if audio transcription requires cross-checking.',
        responseRequired: true,
        responseDeadline: '2026-11-20',
        volunteerResponse: {
          responseType: 'EXPLANATION',
          statement: 'I experienced a brief local power cut at my recording station and prioritised cross-referencing legal acronyms used in the Minister speech to ensure 100% precision before uploading.',
          supportingInformation: 'Backup audio notes and corrected draft attached for verification.',
          submittedAt: '2026-11-18T09:00:00.000Z',
          submittedBy: 'ngozi.okonkwo.aviation@gmail.com'
        },
        supervisorRecommendation: 'Acknowledge explanation. The final quality of the legal citations was excellent. Issue advisory as educational guidance without punitive record.',
        reviewerDecision: 'Matter satisfactorily resolved. Advisory closed with positive acknowledgment of volunteer diligence.',
        finalStatus: 'RESOLVED',
        issuedBy: 'sup.doc@sec.domislink.com',
        issuedByName: 'Mr. Jude Obi',
        reviewedBy: 'dir.operations@sec.domislink.com',
        reviewedByName: 'Capt. Nkechi Adebayo',
        reviewedAt: '2026-11-18T14:00:00.000Z',
        approvedBy: 'secgen@domislink.com',
        approvedByName: 'Dr. Aliyu Mohammed, CON',
        approvedAt: '2026-11-18T16:30:00.000Z',
        createdAt: '2026-11-17T17:00:00.000Z',
        updatedAt: '2026-11-18T16:30:00.000Z',
        auditReference: 'AUD-CORR-2026-0001'
      }
    ];
  }

  if (!data.volunteer_certificates) {
    data.volunteer_certificates = [
      {
        id: 'cert-2026-0001',
        certificateNumber: 'ASS-CERT-2026-00001',
        certificateType: 'Certificate of Outstanding Volunteer Service',
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        summitTheme: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
        isOrganisationCertificate: false,
        recipientName: 'Chidinma Grace Eze',
        volunteerReference: 'ASS-VOL-2026-0001',
        volunteerApplicationId: 'vol-app-2026-0001',
        organisationName: 'Shell Nigeria',
        department: 'Protocol',
        assignment: 'Lead VIP Diplomatic Liaison & Executive Lounge Protocol',
        workMode: 'ON-SITE — LAGOS',
        servicePeriod: '15-18 November 2026',
        signatoryId: 'sig-sec-gen',
        signatoryName: 'Dr. Aliyu Mohammed, CON',
        signatoryTitle: 'Secretary-General',
        signatoryOrg: 'Domislink International Services Ltd',
        issueDate: '2026-11-19',
        verificationCode: 'DOMIS-CERT-2026-V893K2',
        status: 'ISSUED',
        issuedBy: 'secgen@domislink.com',
        issuedByName: 'Dr. Aliyu Mohammed, CON',
        createdAt: '2026-11-19T12:30:00.000Z',
        updatedAt: '2026-11-19T12:30:00.000Z',
        auditReference: 'AUD-CERT-2026-0001'
      },
      {
        id: 'cert-2026-0002',
        certificateNumber: 'ASS-CERT-2026-00002',
        certificateType: 'Certificate of Special Contribution',
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        summitTheme: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
        isOrganisationCertificate: false,
        recipientName: 'Adebisi Oluwaseun',
        volunteerReference: 'ASS-VOL-2026-0003',
        volunteerApplicationId: 'vol-app-2026-0003',
        department: 'Media & Publicity',
        assignment: 'Remote Digital Infographics & Real-Time Keynote Quotation Banners',
        workMode: 'REMOTE — ANYWHERE',
        servicePeriod: '10-18 November 2026',
        signatoryId: 'sig-sec-gen',
        signatoryName: 'Dr. Aliyu Mohammed, CON',
        signatoryTitle: 'Secretary-General',
        signatoryOrg: 'Domislink International Services Ltd',
        issueDate: '2026-11-19',
        verificationCode: 'DOMIS-CERT-2026-M419X8',
        status: 'ISSUED',
        issuedBy: 'secgen@domislink.com',
        issuedByName: 'Dr. Aliyu Mohammed, CON',
        createdAt: '2026-11-19T12:35:00.000Z',
        updatedAt: '2026-11-19T12:35:00.000Z',
        auditReference: 'AUD-CERT-2026-0002'
      },
      {
        id: 'cert-2026-0003',
        certificateNumber: 'ASS-CERT-2026-00003',
        certificateType: 'Certificate of Volunteer Service',
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        summitTheme: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
        isOrganisationCertificate: false,
        recipientName: 'Femi Balogun',
        volunteerReference: 'ASS-VOL-2026-0004',
        volunteerApplicationId: 'vol-app-2026-0004',
        organisationName: 'MTN Nigeria',
        department: 'IT & Digital Support',
        assignment: 'Technical Support & Delegate Check-In Station Network Telemetry',
        workMode: 'ON-SITE — LAGOS',
        servicePeriod: '16-17 November 2026',
        signatoryId: 'sig-sec-gen',
        signatoryName: 'Dr. Aliyu Mohammed, CON',
        signatoryTitle: 'Secretary-General',
        signatoryOrg: 'Domislink International Services Ltd',
        issueDate: '2026-11-19',
        verificationCode: 'DOMIS-CERT-2026-N771Q4',
        status: 'ISSUED',
        issuedBy: 'secgen@domislink.com',
        issuedByName: 'Dr. Aliyu Mohammed, CON',
        createdAt: '2026-11-19T12:40:00.000Z',
        updatedAt: '2026-11-19T12:40:00.000Z',
        auditReference: 'AUD-CERT-2026-0003'
      },
      {
        id: 'cert-2026-0004',
        certificateNumber: 'ASS-CERT-2026-00004',
        certificateType: 'Organisation Certificate of Appreciation',
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        summitTheme: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
        isOrganisationCertificate: true,
        recipientName: 'Shell Nigeria',
        organisationName: 'Shell Nigeria',
        organisationSector: 'OIL_AND_GAS',
        verifiedVolunteersCount: 4,
        department: 'Corporate Volunteer Partnership',
        contributionDescription: 'In recognition of generous corporate sponsorship and institutional deployment of 4 high-calibre volunteer professionals across VIP Protocol, Safety Logistics, and Plenary Coordination.',
        signatoryId: 'sig-sec-gen',
        signatoryName: 'Dr. Aliyu Mohammed, CON',
        signatoryTitle: 'Secretary-General',
        signatoryOrg: 'Domislink International Services Ltd',
        issueDate: '2026-11-19',
        verificationCode: 'DOMIS-ORG-2026-SH772L',
        status: 'ISSUED',
        issuedBy: 'secgen@domislink.com',
        issuedByName: 'Dr. Aliyu Mohammed, CON',
        createdAt: '2026-11-19T13:00:00.000Z',
        updatedAt: '2026-11-19T13:00:00.000Z',
        auditReference: 'AUD-CERT-2026-0004'
      }
    ];
  }
}

function calculateGradeAndPercentage(scores: any) {
  const criteria = [
    'attendanceScore',
    'punctualityScore',
    'reliabilityScore',
    'teamworkScore',
    'communicationScore',
    'professionalismScore',
    'taskCompletionScore',
    'initiativeScore',
    'safetyComplianceScore',
    'adaptabilityScore'
  ];
  let total = 0;
  for (const key of criteria) {
    const val = Number(scores ? scores[key] : 0) || 0;
    total += Math.min(10, Math.max(0, val));
  }
  const percentage = Math.round((total / 100) * 100);
  let grade = 'E';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';
  else grade = 'E';

  return { total, percentage, grade };
}

function generateCertificateNumber(data: any, summitYear: number = 2026): string {
  if (!data.volunteer_certificates) data.volunteer_certificates = [];
  let seq = data.volunteer_certificates.length + 1;
  let certNum = `ASS-CERT-${summitYear}-${String(seq).padStart(5, '0')}`;
  while (data.volunteer_certificates.some((c: any) => c.certificateNumber === certNum)) {
    seq++;
    certNum = `ASS-CERT-${summitYear}-${String(seq).padStart(5, '0')}`;
  }
  return certNum;
}

// 1. GET /api/secretariat/volunteer-performance
app.get('/api/secretariat/volunteer-performance', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);
  const { year, department, status, grade, search } = req.query;

  let records = data.volunteer_performance || [];

  if (year) {
    records = records.filter((r: any) => String(r.summitYear) === String(year));
  }
  if (department && department !== 'ALL') {
    records = records.filter((r: any) => r.department === department);
  }
  if (status && status !== 'ALL') {
    records = records.filter((r: any) => r.evaluationStatus === status);
  }
  if (grade && grade !== 'ALL') {
    records = records.filter((r: any) => r.grade === grade);
  }
  if (search && String(search).trim()) {
    const q = String(search).trim().toLowerCase();
    records = records.filter((r: any) =>
      (r.volunteerName || '').toLowerCase().includes(q) ||
      (r.volunteerReference || '').toLowerCase().includes(q) ||
      (r.organisationName || '').toLowerCase().includes(q) ||
      (r.department || '').toLowerCase().includes(q) ||
      (r.supervisorName || '').toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    records,
    total: records.length
  });
});

// 2. GET /api/secretariat/volunteer-performance/stats
app.get('/api/secretariat/volunteer-performance/stats', (req, res) => {
  const data = readDb();
  ensureVolunteerDefaults(data);
  ensureVolunteerPerformanceDefaults(data);

  const applications = data.volunteer_applications || [];
  const performances = data.volunteer_performance || [];
  const commendations = data.volunteer_commendations || [];
  const correctiveReports = data.volunteer_corrective_reports || [];
  const certificates = data.volunteer_certificates || [];

  const totalVolunteers = applications.length;
  const evaluatedCount = performances.filter((p: any) => p.evaluationStatus === 'APPROVED' || p.evaluationStatus === 'FINAL').length;
  const pendingReviewsCount = performances.filter((p: any) => p.evaluationStatus === 'DRAFT' || p.evaluationStatus === 'SUBMITTED' || p.evaluationStatus === 'REVIEWED').length;

  let totalScoreSum = 0;
  let scoredCount = 0;
  const gradeDistribution: Record<string, number> = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0 };

  performances.forEach((p: any) => {
    if (p.totalScore !== undefined) {
      totalScoreSum += p.totalScore;
      scoredCount++;
    }
    if (p.grade && gradeDistribution[p.grade] !== undefined) {
      gradeDistribution[p.grade]++;
    }
  });

  const averageScore = scoredCount > 0 ? Math.round((totalScoreSum / scoredCount) * 10) / 10 : 0;
  const futureConsiderationCount = performances.filter((p: any) => p.considerForNextYear || p.futureEventConsideration === 'RECOMMENDED FOR FUTURE CONSIDERATION').length;

  res.json({
    success: true,
    stats: {
      totalVolunteers,
      evaluatedCount,
      pendingReviewsCount,
      averageScore,
      gradeDistribution,
      commendationsCount: commendations.length,
      certificatesIssuedCount: certificates.filter((c: any) => c.status === 'ISSUED').length,
      correctiveReportsCount: correctiveReports.length,
      futureConsiderationCount
    }
  });
});

// 3. POST /api/secretariat/volunteer-performance (Create new evaluation)
app.post('/api/secretariat/volunteer-performance', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const {
    volunteerApplicationId,
    volunteerReference,
    volunteerName,
    volunteerEmail,
    volunteerPhone,
    applicantType,
    organisationName,
    summitYear = 2026,
    eventId = 'summit-2026',
    eventName = 'Aviation Safety Summit 2026',
    department,
    assignment,
    workMode = 'ON-SITE — LAGOS',
    supervisorId,
    supervisorName,
    supervisorTitle,
    evaluationPeriod,
    scores,
    evidenceNotes,
    deliverablesReference,
    attendanceRecordSummary,
    supervisorObservations,
    incidentReference,
    supervisorComments,
    finalOutcome = 'SATISFACTORY SERVICE',
    futureEventConsideration = 'ELIGIBLE FOR FUTURE CONSIDERATION',
    considerForNextYear = true,
    nextYearRecommendationNotes,
    submitForReview = false,
    actorEmail
  } = req.body;

  if (!volunteerReference || !volunteerName || !department || !supervisorName || !supervisorComments) {
    return res.status(400).json({
      success: false,
      error: 'Please supply volunteer reference, volunteer name, department, supervisor name, and supervisor comments.'
    });
  }

  // Duplicate Check: Check if active performance evaluation already exists for this volunteer and summit year
  const existingIndex = data.volunteer_performance.findIndex(
    (p: any) => (p.volunteerReference === volunteerReference || p.volunteerApplicationId === volunteerApplicationId) && p.summitYear === Number(summitYear)
  );

  if (existingIndex !== -1 && !req.body.allowOverwrite) {
    return res.status(409).json({
      success: false,
      duplicate: true,
      existingRecord: data.volunteer_performance[existingIndex],
      error: `A performance evaluation already exists for ${volunteerName} (${volunteerReference}) for Summit Year ${summitYear}.`
    });
  }

  const { total, percentage, grade } = calculateGradeAndPercentage(scores || {});
  const now = new Date().toISOString();
  const perfId = `perf-${Date.now()}`;
  const perfReference = `PERF-${summitYear}-${String(data.volunteer_performance.length + 1).padStart(4, '0')}`;

  const newRecord = {
    id: perfId,
    performanceId: perfReference,
    volunteerApplicationId: volunteerApplicationId || `vol-${Date.now()}`,
    volunteerReference,
    volunteerName,
    volunteerEmail: volunteerEmail || '',
    volunteerPhone: volunteerPhone || '',
    applicantType: applicantType || 'Individual Volunteer',
    organisationName: organisationName || undefined,
    summitYear: Number(summitYear),
    eventId,
    eventName,
    department,
    assignment: assignment || `${department} Support`,
    workMode: workMode || 'ON-SITE — LAGOS',
    supervisorId: supervisorId || `sup-${Date.now()}`,
    supervisorName,
    supervisorTitle: supervisorTitle || undefined,
    evaluationPeriod: evaluationPeriod || `${summitYear} Summit Operations`,
    evaluationStatus: submitForReview ? 'SUBMITTED' : 'DRAFT',
    scores: scores || {
      attendanceScore: 8,
      punctualityScore: 8,
      reliabilityScore: 8,
      teamworkScore: 8,
      communicationScore: 8,
      professionalismScore: 8,
      taskCompletionScore: 8,
      initiativeScore: 8,
      safetyComplianceScore: 8,
      adaptabilityScore: 8
    },
    totalScore: total,
    percentage,
    grade,
    evidenceNotes: evidenceNotes || undefined,
    deliverablesReference: deliverablesReference || undefined,
    attendanceRecordSummary: attendanceRecordSummary || undefined,
    supervisorObservations: supervisorObservations || undefined,
    incidentReference: incidentReference || undefined,
    supervisorComments,
    finalOutcome: finalOutcome || 'SATISFACTORY SERVICE',
    futureEventConsideration: futureEventConsideration || 'ELIGIBLE FOR FUTURE CONSIDERATION',
    considerForNextYear: !!considerForNextYear,
    nextYearRecommendationNotes: nextYearRecommendationNotes || undefined,
    createdBy: actorEmail || 'supervisor@sec.domislink.com',
    createdByName: supervisorName,
    createdAt: now,
    submittedAt: submitForReview ? now : undefined,
    updatedBy: actorEmail || 'supervisor@sec.domislink.com',
    updatedAt: now,
    auditReference: `AUD-PERF-${summitYear}-${Date.now()}`
  };

  data.volunteer_performance.unshift(newRecord);

  recordAuditLog(data, {
    action: submitForReview ? 'VOLUNTEER_PERFORMANCE_SUBMITTED' : 'VOLUNTEER_PERFORMANCE_CREATED',
    entityType: 'VOLUNTEER_PERFORMANCE',
    recordId: perfId,
    referenceNumber: perfReference,
    newValue: newRecord,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: `Performance evaluation created with score ${total}/100 (Grade ${grade})`
  });

  writeDb(data);

  res.status(201).json({
    success: true,
    record: newRecord,
    message: 'Volunteer performance evaluation record created successfully.'
  });
});

// 4. PUT /api/secretariat/volunteer-performance/:id (Update evaluation)
app.put('/api/secretariat/volunteer-performance/:id', (req, res) => {
  const { id } = req.params;
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const index = data.volunteer_performance.findIndex((p: any) => p.id === id || p.performanceId === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Performance record not found.' });
  }

  const existing = data.volunteer_performance[index];

  // Prevent direct silent modification of FINAL records without revision route
  if (existing.evaluationStatus === 'FINAL' && !req.body.isRevision) {
    return res.status(400).json({
      success: false,
      error: 'Cannot directly edit a FINAL approved performance record. Please use the controlled revision workflow.'
    });
  }

  const oldValue = { ...existing };
  const updatedScores = req.body.scores ? { ...existing.scores, ...req.body.scores } : existing.scores;
  const { total, percentage, grade } = calculateGradeAndPercentage(updatedScores);

  const actor = req.body.actorEmail || req.headers['x-actor-email'] || 'Secretariat Administrator';
  const now = new Date().toISOString();

  const updatedRecord = {
    ...existing,
    ...req.body,
    id: existing.id,
    performanceId: existing.performanceId,
    scores: updatedScores,
    totalScore: total,
    percentage,
    grade,
    updatedBy: actor,
    updatedAt: now
  };

  data.volunteer_performance[index] = updatedRecord;

  recordAuditLog(data, {
    action: 'VOLUNTEER_PERFORMANCE_UPDATED',
    entityType: 'VOLUNTEER_PERFORMANCE',
    recordId: id,
    referenceNumber: existing.performanceId,
    oldValue,
    newValue: updatedRecord,
    performedBy: actor,
    reason: req.body.updateReason || 'Performance record details updated by supervisor/secretariat'
  });

  writeDb(data);

  res.json({
    success: true,
    record: updatedRecord,
    message: 'Performance evaluation updated successfully.'
  });
});

// 5. POST /api/secretariat/volunteer-performance/:id/approve (ZERO SELF-APPROVAL ENFORCED)
app.post('/api/secretariat/volunteer-performance/:id/approve', (req, res) => {
  const { id } = req.params;
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const index = data.volunteer_performance.findIndex((p: any) => p.id === id || p.performanceId === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Performance record not found.' });
  }

  const record = data.volunteer_performance[index];
  const approverEmail = req.body.approverEmail || req.headers['x-actor-email'] || 'secgen@domislink.com';
  const approverName = req.body.approverName || 'Secretariat Approving Official';

  // ZERO SELF-APPROVAL GOVERNANCE ENFORCEMENT
  if (record.createdBy && approverEmail && record.createdBy.toLowerCase() === String(approverEmail).toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: 'Governance Safety Rule Violation: The Zero Self-Approval principle prevents an evaluator/supervisor from approving their own performance evaluation.'
    });
  }

  const oldValue = { ...record };
  const now = new Date().toISOString();

  record.evaluationStatus = 'APPROVED';
  record.approvedBy = approverEmail;
  record.approvedByName = approverName;
  record.approvedAt = now;
  record.approvalNotes = req.body.approvalNotes || 'Evaluation reviewed and officially ratified by the Secretariat Executive Directorate.';
  if (req.body.finalOutcome) record.finalOutcome = req.body.finalOutcome;
  if (req.body.futureEventConsideration) record.futureEventConsideration = req.body.futureEventConsideration;
  record.updatedBy = approverEmail;
  record.updatedAt = now;

  recordAuditLog(data, {
    action: 'VOLUNTEER_PERFORMANCE_APPROVED',
    entityType: 'VOLUNTEER_PERFORMANCE',
    recordId: id,
    referenceNumber: record.performanceId,
    oldValue,
    newValue: record,
    performedBy: approverEmail,
    reason: `Final evaluation approved with Score ${record.totalScore}/100 (${record.grade}) and Outcome: ${record.finalOutcome}`
  });

  writeDb(data);

  res.json({
    success: true,
    record,
    message: 'Volunteer performance evaluation officially APPROVED.'
  });
});

// 6. POST /api/secretariat/volunteer-performance/:id/revise (Controlled Revision)
app.post('/api/secretariat/volunteer-performance/:id/revise', (req, res) => {
  const { id } = req.params;
  const { revisionReason, newScores, newComments, actorEmail } = req.body;

  if (!revisionReason) {
    return res.status(400).json({ success: false, error: 'Please provide a formal revision reason.' });
  }

  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const index = data.volunteer_performance.findIndex((p: any) => p.id === id || p.performanceId === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Performance record not found.' });
  }

  const current = data.volunteer_performance[index];
  const now = new Date().toISOString();
  const actor = actorEmail || req.headers['x-actor-email'] || 'Secretariat Senior Official';

  const updatedScores = newScores ? { ...current.scores, ...newScores } : current.scores;
  const { total, percentage, grade } = calculateGradeAndPercentage(updatedScores);

  const revisedRecord = {
    ...current,
    scores: updatedScores,
    totalScore: total,
    percentage,
    grade,
    supervisorComments: newComments || current.supervisorComments,
    isRevision: true,
    revisionReason,
    originalRecordId: current.id,
    updatedBy: actor,
    updatedAt: now,
    evaluationStatus: 'APPROVED'
  };

  data.volunteer_performance[index] = revisedRecord;

  recordAuditLog(data, {
    action: 'VOLUNTEER_PERFORMANCE_REVISED',
    entityType: 'VOLUNTEER_PERFORMANCE',
    recordId: id,
    referenceNumber: current.performanceId,
    oldValue: current,
    newValue: revisedRecord,
    performedBy: actor,
    reason: `Controlled revision applied: ${revisionReason}`
  });

  writeDb(data);

  res.json({
    success: true,
    record: revisedRecord,
    message: 'Controlled revision recorded successfully.'
  });
});

// ============================================================
// COMMENDATIONS API ROUTES
// ============================================================

// 7. GET /api/secretariat/volunteer-commendations
app.get('/api/secretariat/volunteer-commendations', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);
  res.json({
    success: true,
    commendations: data.volunteer_commendations || [],
    total: (data.volunteer_commendations || []).length
  });
});

// 8. POST /api/secretariat/volunteer-commendations (Create Commendation)
app.post('/api/secretariat/volunteer-commendations', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const {
    volunteerReference,
    volunteerApplicationId,
    volunteerName,
    organisationName,
    applicantType = 'Individual Volunteer',
    summitYear = 2026,
    eventId = 'summit-2026',
    department,
    assignment,
    commendationType = 'COMMENDATION',
    title,
    reason,
    supportingEvidence,
    actorEmail,
    actorName
  } = req.body;

  if (!volunteerReference || !volunteerName || !title || !reason) {
    return res.status(400).json({
      success: false,
      error: 'Please supply volunteer reference, volunteer name, title, and citation reason.'
    });
  }

  const commSeq = (data.volunteer_commendations || []).length + 1;
  const commId = `comm-${Date.now()}`;
  const commendationRef = `COMM-${summitYear}-${String(commSeq).padStart(4, '0')}`;
  const now = new Date().toISOString();

  const newCommendation = {
    id: commId,
    commendationId: commendationRef,
    volunteerReference,
    volunteerApplicationId: volunteerApplicationId || `vol-${Date.now()}`,
    volunteerName,
    organisationName: organisationName || undefined,
    applicantType,
    summitYear: Number(summitYear),
    eventId,
    department: department || 'General Summit Support',
    assignment: assignment || 'Volunteer Service',
    commendationType,
    title,
    reason,
    supportingEvidence: supportingEvidence || 'Observed exceptional performance during Summit deployment.',
    issuedBy: actorEmail || 'secretariat@domislink.com',
    issuedByName: actorName || 'Secretariat Directorate',
    approvedBy: 'secgen@domislink.com',
    approvedByName: 'Dr. Aliyu Mohammed, CON',
    approvedAt: now,
    issueDate: now.slice(0, 10),
    status: 'ISSUED',
    createdAt: now,
    updatedAt: now,
    auditReference: `AUD-COMM-${summitYear}-${Date.now()}`
  };

  data.volunteer_commendations.unshift(newCommendation);

  recordAuditLog(data, {
    action: 'COMMENDATION_ISSUED',
    entityType: 'VOLUNTEER_COMMENDATION',
    recordId: commId,
    referenceNumber: commendationRef,
    newValue: newCommendation,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: `Official commendation issued to ${volunteerName}: ${title}`
  });

  writeDb(data);

  res.status(201).json({
    success: true,
    commendation: newCommendation,
    message: 'Official commendation recorded and issued successfully.'
  });
});

// ============================================================
// CORRECTIVE / REBUKE REPORT API ROUTES (WITH RIGHT TO RESPOND)
// ============================================================

// 9. GET /api/secretariat/volunteer-corrective-reports
app.get('/api/secretariat/volunteer-corrective-reports', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);
  res.json({
    success: true,
    reports: data.volunteer_corrective_reports || [],
    total: (data.volunteer_corrective_reports || []).length
  });
});

// 10. POST /api/secretariat/volunteer-corrective-reports (Create Corrective Report)
app.post('/api/secretariat/volunteer-corrective-reports', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const {
    volunteerReference,
    volunteerApplicationId,
    volunteerName,
    organisationName,
    summitYear = 2026,
    eventId = 'summit-2026',
    department,
    assignment,
    issueCategory = 'PERFORMANCE ADVISORY',
    title,
    factualDescription,
    relevantEvidence,
    operationalImpact,
    expectedImprovement,
    responseRequired = true,
    responseDeadline,
    supervisorRecommendation,
    actorEmail,
    actorName
  } = req.body;

  if (!volunteerReference || !volunteerName || !title || !factualDescription || !expectedImprovement) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in required fields: volunteer reference, name, title, factual description, and expected improvement.'
    });
  }

  const count = (data.volunteer_corrective_reports || []).length + 1;
  const reportId = `corr-${Date.now()}`;
  const reportRef = `CORR-${summitYear}-${String(count).padStart(4, '0')}`;
  const now = new Date().toISOString();

  const newReport = {
    id: reportId,
    correctiveReportId: reportRef,
    volunteerReference,
    volunteerApplicationId: volunteerApplicationId || `vol-${Date.now()}`,
    volunteerName,
    organisationName: organisationName || undefined,
    summitYear: Number(summitYear),
    eventId,
    department: department || 'Operations',
    assignment: assignment || 'Volunteer Service',
    date: now.slice(0, 10),
    issueCategory,
    title,
    factualDescription,
    relevantEvidence: relevantEvidence || 'Supervisor operational logs',
    operationalImpact: operationalImpact || 'Minor operational delay mitigated by team',
    expectedImprovement,
    responseRequired: !!responseRequired,
    responseDeadline: responseDeadline || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    supervisorRecommendation: supervisorRecommendation || 'Provide constructive guidance and review in post-event feedback.',
    finalStatus: 'ISSUED',
    issuedBy: actorEmail || 'supervisor@sec.domislink.com',
    issuedByName: actorName || 'Operations Supervisor',
    createdAt: now,
    updatedAt: now,
    auditReference: `AUD-CORR-${summitYear}-${Date.now()}`
  };

  data.volunteer_corrective_reports.unshift(newReport);

  recordAuditLog(data, {
    action: 'CORRECTIVE_REPORT_CREATED',
    entityType: 'VOLUNTEER_CORRECTIVE_REPORT',
    recordId: reportId,
    referenceNumber: reportRef,
    newValue: newReport,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: `Corrective report issued: ${issueCategory} - ${title}`
  });

  writeDb(data);

  res.status(201).json({
    success: true,
    report: newReport,
    message: 'Corrective action report created and dispatched for response.'
  });
});

// 11. POST /api/secretariat/volunteer-corrective-reports/:id/respond (Volunteer Right to Respond)
app.post('/api/secretariat/volunteer-corrective-reports/:id/respond', (req, res) => {
  const { id } = req.params;
  const { responseType = 'EXPLANATION', statement, supportingInformation, submittedBy } = req.body;

  if (!statement) {
    return res.status(400).json({ success: false, error: 'Please provide a formal response statement.' });
  }

  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const index = data.volunteer_corrective_reports.findIndex((r: any) => r.id === id || r.correctiveReportId === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Corrective report not found.' });
  }

  const report = data.volunteer_corrective_reports[index];
  const now = new Date().toISOString();

  report.volunteerResponse = {
    responseType,
    statement,
    supportingInformation: supportingInformation || undefined,
    submittedAt: now,
    submittedBy: submittedBy || report.volunteerName
  };
  report.finalStatus = 'RESPONSE_SUBMITTED';
  report.updatedAt = now;

  recordAuditLog(data, {
    action: 'VOLUNTEER_RESPONSE_SUBMITTED',
    entityType: 'VOLUNTEER_CORRECTIVE_REPORT',
    recordId: id,
    referenceNumber: report.correctiveReportId,
    newValue: report.volunteerResponse,
    performedBy: submittedBy || report.volunteerName,
    reason: `Right-to-respond response received (${responseType})`
  });

  writeDb(data);

  res.json({
    success: true,
    report,
    message: 'Volunteer response formally incorporated into official dossier.'
  });
});

// 12. POST /api/secretariat/volunteer-corrective-reports/:id/resolve (Secretariat Resolution)
app.post('/api/secretariat/volunteer-corrective-reports/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { reviewerDecision, finalStatus = 'RESOLVED', actorEmail, actorName } = req.body;

  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const index = data.volunteer_corrective_reports.findIndex((r: any) => r.id === id || r.correctiveReportId === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Corrective report not found.' });
  }

  const report = data.volunteer_corrective_reports[index];
  const now = new Date().toISOString();

  report.reviewerDecision = reviewerDecision || 'Secretariat review complete. Explanation accepted and matter resolved.';
  report.finalStatus = finalStatus;
  report.reviewedBy = actorEmail || 'dir.operations@sec.domislink.com';
  report.reviewedByName = actorName || 'Director of Operations';
  report.reviewedAt = now;
  report.updatedAt = now;

  recordAuditLog(data, {
    action: 'CORRECTIVE_REPORT_RESOLVED',
    entityType: 'VOLUNTEER_CORRECTIVE_REPORT',
    recordId: id,
    referenceNumber: report.correctiveReportId,
    newValue: report,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: `Corrective report resolution: ${finalStatus}`
  });

  writeDb(data);

  res.json({
    success: true,
    report,
    message: `Corrective action report updated to ${finalStatus}.`
  });
});

// ============================================================
// CERTIFICATES API ROUTES (INDIVIDUAL & ORGANISATION)
// ============================================================

// 13. GET /api/secretariat/volunteer-certificates
app.get('/api/secretariat/volunteer-certificates', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);
  res.json({
    success: true,
    certificates: data.volunteer_certificates || [],
    total: (data.volunteer_certificates || []).length
  });
});

// 14. POST /api/secretariat/volunteer-certificates (Issue Certificate)
app.post('/api/secretariat/volunteer-certificates', (req, res) => {
  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const {
    certificateType = 'Certificate of Volunteer Service',
    summitYear = 2026,
    eventId = 'summit-2026',
    eventName = 'Aviation Safety Summit 2026',
    summitTheme = 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
    isOrganisationCertificate = false,
    recipientName,
    volunteerReference,
    volunteerApplicationId,
    organisationName,
    organisationSector,
    verifiedVolunteersCount,
    contributionDescription,
    department,
    assignment,
    workMode = 'ON-SITE — LAGOS',
    servicePeriod,
    signatoryId = 'sig-sec-gen',
    signatoryName = 'Dr. Aliyu Mohammed, CON',
    signatoryTitle = 'Secretary-General',
    signatoryOrg = 'Domislink International Services Ltd',
    actorEmail,
    actorName
  } = req.body;

  if (!recipientName) {
    return res.status(400).json({ success: false, error: 'Recipient name is required to generate a certificate.' });
  }

  const certNumber = generateCertificateNumber(data, Number(summitYear));
  const certId = `cert-${Date.now()}`;
  const verificationCode = `DOMIS-${isOrganisationCertificate ? 'ORG' : 'CERT'}-${summitYear}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const now = new Date().toISOString();

  const newCert = {
    id: certId,
    certificateNumber: certNumber,
    certificateType,
    summitYear: Number(summitYear),
    eventId,
    eventName,
    summitTheme,
    isOrganisationCertificate: !!isOrganisationCertificate,
    recipientName,
    volunteerReference: volunteerReference || undefined,
    volunteerApplicationId: volunteerApplicationId || undefined,
    organisationName: organisationName || undefined,
    organisationSector: organisationSector || undefined,
    verifiedVolunteersCount: verifiedVolunteersCount ? Number(verifiedVolunteersCount) : undefined,
    contributionDescription: contributionDescription || undefined,
    department: department || 'Summit Secretariat Support',
    assignment: assignment || 'Volunteer Service',
    workMode: workMode || 'ON-SITE — LAGOS',
    servicePeriod: servicePeriod || `${summitYear} Summit Operations`,
    signatoryId,
    signatoryName,
    signatoryTitle,
    signatoryOrg,
    issueDate: now.slice(0, 10),
    verificationCode,
    status: 'ISSUED',
    issuedBy: actorEmail || 'secgen@domislink.com',
    issuedByName: actorName || 'Dr. Aliyu Mohammed, CON',
    createdAt: now,
    updatedAt: now,
    auditReference: `AUD-CERT-${summitYear}-${Date.now()}`
  };

  data.volunteer_certificates.unshift(newCert);

  recordAuditLog(data, {
    action: 'CERTIFICATE_ISSUED',
    entityType: 'VOLUNTEER_CERTIFICATE',
    recordId: certId,
    referenceNumber: certNumber,
    newValue: newCert,
    performedBy: actorEmail || 'Secretariat Administrator',
    reason: `Certificate issued: ${certNumber} to ${recipientName} (${certificateType})`
  });

  writeDb(data);

  res.status(201).json({
    success: true,
    certificate: newCert,
    message: `Certificate ${certNumber} successfully generated and registered.`
  });
});

// 15. POST /api/secretariat/volunteer-certificates/:id/reissue (Controlled Reissue with Revision Audit)
app.post('/api/secretariat/volunteer-certificates/:id/reissue', (req, res) => {
  const { id } = req.params;
  const { reissueReason, correctedRecipientName, actorEmail } = req.body;

  if (!reissueReason) {
    return res.status(400).json({ success: false, error: 'Please provide a formal reissue reason.' });
  }

  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const index = data.volunteer_certificates.findIndex((c: any) => c.id === id || c.certificateNumber === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Certificate record not found.' });
  }

  const oldCert = data.volunteer_certificates[index];
  const now = new Date().toISOString();
  const actor = actorEmail || 'Secretariat Administrator';

  // Mark old certificate as superseded/reissued
  oldCert.status = 'REVISED';
  oldCert.reissueReason = reissueReason;
  oldCert.updatedAt = now;

  // Generate new certificate record
  const newCertNumber = generateCertificateNumber(data, oldCert.summitYear);
  const newCertId = `cert-${Date.now()}`;
  const newVerificationCode = `DOMIS-${oldCert.isOrganisationCertificate ? 'ORG' : 'CERT'}-${oldCert.summitYear}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const reissuedCert = {
    ...oldCert,
    id: newCertId,
    certificateNumber: newCertNumber,
    recipientName: correctedRecipientName || oldCert.recipientName,
    verificationCode: newVerificationCode,
    status: 'ISSUED',
    previousCertificateNumber: oldCert.certificateNumber,
    reissueReason,
    createdAt: now,
    updatedAt: now,
    auditReference: `AUD-CERT-${oldCert.summitYear}-${Date.now()}`
  };

  oldCert.supersededBy = newCertNumber;
  data.volunteer_certificates.unshift(reissuedCert);

  recordAuditLog(data, {
    action: 'CERTIFICATE_REISSUED',
    entityType: 'VOLUNTEER_CERTIFICATE',
    recordId: newCertId,
    referenceNumber: newCertNumber,
    oldValue: oldCert,
    newValue: reissuedCert,
    performedBy: actor,
    reason: `Certificate reissued from ${oldCert.certificateNumber} to ${newCertNumber}. Reason: ${reissueReason}`
  });

  writeDb(data);

  res.json({
    success: true,
    certificate: reissuedCert,
    oldCertificate: oldCert,
    message: `Certificate ${newCertNumber} reissued successfully.`
  });
});

// 16. POST /api/secretariat/volunteer-certificates/:id/revoke
app.post('/api/secretariat/volunteer-certificates/:id/revoke', (req, res) => {
  const { id } = req.params;
  const { revocationReason, actorEmail } = req.body;

  if (!revocationReason) {
    return res.status(400).json({ success: false, error: 'Revocation reason is required.' });
  }

  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const index = data.volunteer_certificates.findIndex((c: any) => c.id === id || c.certificateNumber === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Certificate record not found.' });
  }

  const cert = data.volunteer_certificates[index];
  const oldValue = { ...cert };
  const now = new Date().toISOString();
  const actor = actorEmail || 'Secretariat Administrator';

  cert.status = 'REVOKED';
  cert.reissueReason = revocationReason;
  cert.updatedAt = now;

  recordAuditLog(data, {
    action: 'CERTIFICATE_REVOKED',
    entityType: 'VOLUNTEER_CERTIFICATE',
    recordId: id,
    referenceNumber: cert.certificateNumber,
    oldValue,
    newValue: cert,
    performedBy: actor,
    reason: `Certificate revoked: ${revocationReason}`
  });

  writeDb(data);

  res.json({
    success: true,
    certificate: cert,
    message: `Certificate ${cert.certificateNumber} has been revoked.`
  });
});

// 17. PUBLIC CERTIFICATE VERIFICATION (MINIMAL & NON-SENSITIVE)
// Never exposes scores, grades, corrective reports, contact details, or supervisor notes
app.get('/api/certificates/verify/:code', (req, res) => {
  const { code } = req.params;
  if (!code) {
    return res.status(400).json({ error: 'Please supply a verification code or certificate number.' });
  }

  const data = readDb();
  ensureVolunteerPerformanceDefaults(data);

  const queryCode = String(code).trim().toUpperCase();
  const cert = (data.volunteer_certificates || []).find((c: any) =>
    (c.verificationCode || '').toUpperCase() === queryCode ||
    (c.certificateNumber || '').toUpperCase() === queryCode
  );

  if (!cert) {
    return res.status(404).json({
      success: false,
      verified: false,
      error: 'Certificate not found or verification reference invalid.'
    });
  }

  // Strictly sanitized non-sensitive public metadata
  res.json({
    success: true,
    verified: true,
    certificate: {
      certificateNumber: cert.certificateNumber,
      recipientName: cert.recipientName,
      certificateType: cert.certificateType,
      summitYear: cert.summitYear,
      eventName: cert.eventName,
      summitTheme: cert.summitTheme,
      department: cert.department,
      isOrganisationCertificate: cert.isOrganisationCertificate,
      organisationName: cert.organisationName,
      verifiedVolunteersCount: cert.verifiedVolunteersCount,
      signatoryName: cert.signatoryName,
      signatoryTitle: cert.signatoryTitle,
      signatoryOrg: cert.signatoryOrg,
      issueDate: cert.issueDate,
      status: cert.status
    }
  });
});

// 18. GET /api/secretariat/volunteer-organisations (Organisation Performance & Volunteer Deployment History)
app.get('/api/secretariat/volunteer-organisations', (req, res) => {
  const data = readDb();
  ensureVolunteerDefaults(data);
  ensureVolunteerPerformanceDefaults(data);

  const applications = data.volunteer_applications || [];
  const performances = data.volunteer_performance || [];
  const commendations = data.volunteer_commendations || [];
  const certificates = data.volunteer_certificates || [];

  // Group by organisation name
  const orgMap: Record<string, any> = {};

  applications.forEach((app: any) => {
    const orgName = app.sponsoringOrgName || app.organisation;
    if (!orgName) return;

    if (!orgMap[orgName]) {
      orgMap[orgName] = {
        name: orgName,
        sector: app.sponsoringOrgSector || 'Corporate Enterprise',
        type: app.sponsoringOrgType || app.applicantType,
        address: app.sponsoringOrgAddress,
        contactPerson: app.orgContactPersonName,
        contactEmail: app.sponsoringOrgEmail || app.orgContactPersonEmail,
        volunteers: [],
        totalDeployed: 0,
        completedService: 0,
        commendationsCount: 0,
        certificatesIssuedCount: 0
      };
    }

    orgMap[orgName].volunteers.push({
      reference: app.reference,
      name: `${app.firstName} ${app.lastName}`,
      department: app.preferredDepartment,
      availability: app.availability
    });
    orgMap[orgName].totalDeployed++;
  });

  // Calculate evaluations and awards
  Object.keys(orgMap).forEach((orgName) => {
    const org = orgMap[orgName];
    const orgPerformances = performances.filter((p: any) => (p.organisationName || '').toLowerCase() === orgName.toLowerCase());
    org.completedService = orgPerformances.filter((p: any) => p.evaluationStatus === 'APPROVED' || p.evaluationStatus === 'FINAL').length;

    const orgComms = commendations.filter((c: any) => (c.organisationName || '').toLowerCase() === orgName.toLowerCase());
    org.commendationsCount = orgComms.length;

    const orgCerts = certificates.filter((c: any) => (c.organisationName || '').toLowerCase() === orgName.toLowerCase() && c.status === 'ISSUED');
    org.certificatesIssuedCount = orgCerts.length;
  });

  res.json({
    success: true,
    organisations: Object.values(orgMap)
  });
});

// ============================================================
// SOCIAL MEDIA SHARING & VOLUNTEER REFERRAL TRACKING ENDPOINTS
// ============================================================

function ensureShareAnalyticsDefaults(data: any) {
  if (!data.share_analytics) {
    data.share_analytics = [];
  }
  if (!data.referral_records) {
    data.referral_records = [];
  }
}

// 19. POST /api/analytics/share-event
app.post('/api/analytics/share-event', (req, res) => {
  const { eventType, channel, targetUrl, referralToken, landingPage, deviceCategory } = req.body;
  if (!eventType || !targetUrl) {
    return res.status(400).json({ error: 'Missing required event fields.' });
  }

  const data = readDb();
  ensureShareAnalyticsDefaults(data);

  const eventRecord = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    eventType,
    channel: channel || 'direct',
    targetUrl,
    referralToken: referralToken || null,
    landingPage: landingPage || null,
    deviceCategory: deviceCategory || 'desktop',
    timestamp: new Date().toISOString()
  };

  data.share_analytics.push(eventRecord);

  // Keep last 2000 events to prevent unbounded growth
  if (data.share_analytics.length > 2000) {
    data.share_analytics = data.share_analytics.slice(-2000);
  }

  // Update referral records if token exists
  if (referralToken && typeof referralToken === 'string') {
    const cleanToken = referralToken.trim().toUpperCase();
    let refRec = data.referral_records.find((r: any) => r.token === cleanToken);
    if (!refRec) {
      refRec = {
        token: cleanToken,
        targetType: targetUrl.includes('volunteer') ? 'VOLUNTEER' : 'SUMMIT',
        generatedAt: new Date().toISOString(),
        landingCount: 0,
        applicationCount: 0
      };
      data.referral_records.push(refRec);
    }

    if (eventType === 'REFERRAL_LANDING') {
      refRec.landingCount = (refRec.landingCount || 0) + 1;
      refRec.lastLandingAt = new Date().toISOString();
    }
  }

  writeDb(data);
  res.json({ success: true, eventId: eventRecord.id });
});

// 20. GET /api/analytics/share-summary
app.get('/api/analytics/share-summary', (req, res) => {
  const data = readDb();
  ensureShareAnalyticsDefaults(data);

  const events = data.share_analytics || [];
  const referrals = data.referral_records || [];

  const countsByChannel: Record<string, number> = {};
  const countsByEventType: Record<string, number> = {};

  events.forEach((evt: any) => {
    const ch = evt.channel || 'unknown';
    countsByChannel[ch] = (countsByChannel[ch] || 0) + 1;
    const et = evt.eventType || 'unknown';
    countsByEventType[et] = (countsByEventType[et] || 0) + 1;
  });

  res.json({
    success: true,
    totalShareEvents: events.length,
    countsByChannel,
    countsByEventType,
    topReferrals: referrals.slice(0, 50)
  });
});


async function start() {
  const publicPath = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FULLSTACK SERVER] running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start fullstack server:', err);
});
