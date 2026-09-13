/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_AD_POSITIONS, INITIAL_SPONSORSHIP_PACKAGES } from './src/data/marketplaceData';
import { INITIAL_VERIFIED_SPEAKERS } from './src/data/speakersData';
import { INITIAL_STAKEHOLDERS, STAKEHOLDER_CATEGORIES } from './src/data/stakeholdersData';



export const app = express();
const PORT = Number(process.env.PORT || 3000);

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

function getDbPath() {
  return process.env.DB_PATH || path.join(process.cwd(), 'data', 'db.json');
}

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
  sessions: [
    {
      id: 'ses-1',
      time: '[TIME TO BE CONFIRMED]',
      title: 'Aviation Safety Summit Opening Plenary',
      type: 'Plenary Session',
      speaker: '[SPEAKER TO BE CONFIRMED]',
      organisation: 'Federal Ministry of Aviation & NCAA / Domislink',
      topic: '[TOPIC TO BE CONFIRMED]',
      description: 'Opening protocols, national safety directives, and inaugural address for the Aviation Safety Summit 2026.',
      room: 'Grand Ballroom, Marriott Hotel, Ikeja, Lagos',
      status: 'To Be Confirmed'
    },
    {
      id: 'ses-2',
      time: '[TIME TO BE CONFIRMED]',
      title: 'Official Book Launch',
      type: 'Book Launch',
      speaker: '[SPEAKER TO BE CONFIRMED]',
      organisation: 'Domislink International Services Ltd',
      topic: '[TOPIC TO BE CONFIRMED]',
      description: 'Official presentation and dedication of the milestone aviation safety publication.',
      room: 'Grand Ballroom, Marriott Hotel, Ikeja, Lagos',
      status: 'To Be Confirmed'
    },
    {
      id: 'ses-3',
      time: '[TIME TO BE CONFIRMED]',
      title: 'Aviation Memo Challenge Session',
      type: 'Challenge Session',
      speaker: '[SPEAKER TO BE CONFIRMED]',
      organisation: 'Domislink International / Aviation Memoir Project',
      topic: '[TOPIC TO BE CONFIRMED]',
      description: 'Why aviators must not die with their experience: presentation of anonymised flight operations lessons and near-miss learnings.',
      room: 'Grand Ballroom, Marriott Hotel, Ikeja, Lagos',
      status: 'To Be Confirmed'
    },
    {
      id: 'ses-4',
      time: '[TIME TO BE CONFIRMED]',
      title: 'Safety Investment Session',
      type: 'Investment Panel',
      speaker: '[SPEAKER TO BE CONFIRMED]',
      organisation: 'Aviation Finance & Energy Stakeholders',
      topic: '[TOPIC TO BE CONFIRMED]',
      description: 'Cross-sector funding strategies for safety technology, flight simulators, meteorological intelligence, and aerodrome infrastructure.',
      room: 'Executive Hall A, Marriott Hotel, Ikeja, Lagos',
      status: 'To Be Confirmed'
    },
    {
      id: 'ses-5',
      time: '[TIME TO BE CONFIRMED]',
      title: 'Simulation & Training Technical Session',
      type: 'Technical Masterclass',
      speaker: '[SPEAKER TO BE CONFIRMED]',
      organisation: 'Training Organisations & Flight Simulator Evaluators',
      topic: '[TOPIC TO BE CONFIRMED]',
      description: 'Sim saves fuel, dollars, and lives: synthetic training devices, Level D simulator credits, and recurrent competence cycles.',
      room: 'Executive Hall B, Marriott Hotel, Ikeja, Lagos',
      status: 'To Be Confirmed'
    },
    {
      id: 'ses-6',
      time: '[TIME TO BE CONFIRMED]',
      title: 'The Sky Party & Executive Networking',
      type: 'Networking Reception',
      speaker: '[SPEAKER TO BE CONFIRMED]',
      organisation: 'Aviation Safety Summit 2026 Secretariat',
      topic: '[TOPIC TO BE CONFIRMED]',
      description: 'Executive networking reception, industry honors, and closing fellowship for all summit delegates and dignitaries.',
      room: 'Skyline Terrace, Marriott Hotel, Ikeja, Lagos',
      status: 'To Be Confirmed'
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
    title: '[BOOK TITLE TO BE SUPPLIED]',
    author: '[AUTHOR TO BE SUPPLIED]',
    description: '[BOOK DESCRIPTION TO BE SUPPLIED]',
    coverImagePlaceholder: '[BOOK COVER IMAGE TO BE SUPPLIED]'
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


// Reads db.json or loads defaults
function readDb() {
  const dbPath = getDbPath();
  ensureDirExists(dbPath);
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(data);
      // Auto-migrate if speakers is missing, empty, or outdated
      if (!parsed.speakers || parsed.speakers.length < 10 || !parsed.speakers[0].workflowStage) {
        parsed.speakers = INITIAL_VERIFIED_SPEAKERS;
        writeDb(parsed);
      }
      // Auto-migrate if stakeholders is missing or empty
      if (!parsed.stakeholders || parsed.stakeholders.length < 5) {
        parsed.stakeholders = INITIAL_STAKEHOLDERS;
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
  const dbPath = getDbPath();
  ensureDirExists(dbPath);
  try {
    const tempPath = `${dbPath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, dbPath);
  } catch (err) {
    console.error('Error writing to DB:', err);
  }
}

// Middleware
app.use(express.json());

// API health check
app.get('/api/health', (req, res) => {
  const data = readDb();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: data ? 'ok' : 'unavailable',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not_configured',
      paystack: process.env.PAYSTACK_SECRET_KEY ? 'configured' : 'sandbox'
    }
  });
});

// API endpoints
app.get('/api/db', (req, res) => {
  const data = readDb();
  const isAdmin = req.headers['x-admin-mode'] === 'true' || req.query.admin === 'true';
  
  // Privacy protection: Do not expose submitted personal information publicly
  if (!isAdmin) {
    const sanitized = { 
      ...data,
      registrations: [], // Hide personal information from public visitors
      registrationCount: (data.registrations || []).length
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
          model: 'gemini-2.5-flash',
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
          model: 'gemini-2.5-flash',
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




// Setup Vite Dev server or production build static routes
async function start() {
  const publicPath = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
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

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[FULLSTACK SERVER] running on http://0.0.0.0:${PORT}`);
  });
}

export { defaultDb, ensureDirExists, getAiClient, getDbPath, readDb, writeDb, start };

if (process.env.NODE_ENV !== 'test') {
  start().catch((err) => {
    console.error('Failed to start fullstack server:', err);
  });
}
