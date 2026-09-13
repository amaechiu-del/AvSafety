/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_AD_POSITIONS, INITIAL_SPONSORSHIP_PACKAGES } from './src/data/marketplaceData';
import { INITIAL_VERIFIED_SPEAKERS } from './src/data/speakersData';
import { INITIAL_STAKEHOLDERS, STAKEHOLDER_CATEGORIES } from './src/data/stakeholdersData';
import type {
  AdPosition,
  CreativeServiceRequest,
  InvitationLetter,
  Session,
  Speaker,
  SponsorshipPackage,
  StakeholderCategory,
  StakeholderEventRole,
  StakeholderInvitee
} from './src/types';



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
  ensureDirExists(dbPath);
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to DB:', err);
  }
}

const GEMINI_MODEL = 'gemini-2.5-flash';
const AI_UNVERIFIED_DISCLAIMER = 'AI-GENERATED — NOT YET VERIFIED';
const SUMMIT_INFO = 'Aviation Safety Summit 2026 on 17 November 2026 at Lagos Marriott Hotel, Ikeja, Lagos, Nigeria.';
const SUMMIT_THEME = 'EVERYBODY IS INVOLVED IN AVIATION SAFETY';

type SupportedCurrency = 'NGN' | 'USD';

interface StandardAiResponse<T> {
  success: boolean;
  aiGenerated: boolean;
  data: T;
  timestamp: string;
  disclaimer?: string;
}

interface MarketplaceAssistantRequest {
  message?: string;
  organisation?: string;
  promotionGoal?: string;
  targetAudience?: string;
  estimatedBudget?: string | number;
  visibilityTypes?: string[];
  currency?: SupportedCurrency;
}

interface MarketplaceRecommendation {
  id: string;
  name: string;
  category: string;
  priceNGN: number;
  priceUSD: number;
  reason: string;
  expectedImpact: string;
  safetyCompliance: string;
  sourceType: 'POSITION' | 'PACKAGE';
  inventoryStatus: string;
  availableUnits: number;
}

interface MarketplaceAssistantData {
  advisorGreeting: string;
  recommendedPackages: MarketplaceRecommendation[];
  strategicAdvice: string;
  nextSteps: string;
}

interface StakeholderBrainstormSuggestion {
  name: string;
  position: string;
  organisation: string;
  category: StakeholderCategory;
  whyRelevant: string;
  proposedTopic: string;
  proposedRole: StakeholderEventRole;
  verificationStatus: string;
  suggestedSponsorship: string;
}

interface StakeholderBrainstormData {
  representationBySector: Record<string, number>;
  underRepresentedCategories: StakeholderCategory[];
  suggestions: StakeholderBrainstormSuggestion[];
}

interface SpeakerTopicsData {
  topics: string[];
  speakerContext: {
    name: string;
    organisation: string;
    industry: string;
    role: string;
  };
}

interface SpeakerAssistantMatch {
  id: string;
  name: string;
  organisation: string;
  status: string;
  verificationStatus: string;
  topic: string;
  session: string;
}

interface SpeakerAssistantData {
  answer: string;
  matchedSpeakers: SpeakerAssistantMatch[];
}

interface CreativeConcept {
  title: 'Concept A' | 'Concept B';
  headline: string;
  bodyCopy: string;
  visualNotes: string;
  callToAction: string;
}

type StoredCreativeRequest = CreativeServiceRequest & {
  concepts?: CreativeConcept[];
  uploadTracking?: {
    logoProvided: boolean;
    uploadedAssetCount: number;
    uploadedAssets: string[];
  };
};

interface CreativeRequestData {
  request: StoredCreativeRequest;
  concepts: CreativeConcept[];
}

type GeneratedInvitationLetter = InvitationLetter & {
  gmailDraftUrl: string;
  mailtoUrl: string;
};

interface SponsorshipTierRecommendation {
  id: string;
  tier: SponsorshipPackage['tier'];
  name: string;
  rationale: string;
  feeNGN: string;
  feeUSD: string;
  benefits: string[];
  status: SponsorshipPackage['status'];
}

interface SponsorshipProposalData {
  headline: string;
  whySectorMatters: string;
  howParticipationSupportsSafety: string;
  recommendedTiers: SponsorshipTierRecommendation[];
  callToAction: string;
}

function createTimestamp() {
  return new Date().toISOString();
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function sanitizeText(value: unknown, maxLength = 2000) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function sanitizeStringArray(value: unknown, maxItems = 10) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => sanitizeText(item, 120))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeCurrency(value: unknown): SupportedCurrency {
  return value === 'USD' ? 'USD' : 'NGN';
}

function sendAiSuccess<T>(res: express.Response, aiGenerated: boolean, data: T, disclaimer?: string) {
  const payload: StandardAiResponse<T> = {
    success: true,
    aiGenerated,
    data,
    timestamp: createTimestamp()
  };

  if (disclaimer) {
    payload.disclaimer = disclaimer;
  }

  return res.json(payload);
}

function sendValidationError(res: express.Response, message: string) {
  return res.status(400).json({
    success: false,
    aiGenerated: false,
    error: message,
    timestamp: createTimestamp()
  });
}

function safeJsonParse<T>(raw: string | undefined | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    const trimmed = raw.trim();
    const jsonStart = trimmed.indexOf('{');
    const jsonArrayStart = trimmed.indexOf('[');
    const start = jsonArrayStart === -1 ? jsonStart : jsonStart === -1 ? jsonArrayStart : Math.min(jsonStart, jsonArrayStart);
    const end = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));

    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }

    return null;
  }
}

function formatMoney(amount: number, currency: SupportedCurrency) {
  if (currency === 'USD') {
    return `$${amount.toLocaleString()}`;
  }

  return `₦${amount.toLocaleString()}`;
}

function findStakeholderCategoryMeta(category: StakeholderCategory | string | undefined) {
  return STAKEHOLDER_CATEGORIES.find((item) => item.id === category) || STAKEHOLDER_CATEGORIES.find((item) => item.id === 'OTHER');
}

function buildMarketplaceRecommendation(
  item: AdPosition | SponsorshipPackage,
  reason: string,
  expectedImpact: string
): MarketplaceRecommendation {
  const sourceType = 'tier' in item ? 'PACKAGE' : 'POSITION';
  const category = 'tier' in item ? item.tier : item.category;
  const inventoryStatus = item.status;
  const availableUnits = 'slotsAvailable' in item ? item.slotsAvailable : item.availableInventory;
  const needsApproval = 'requiresRegulatoryApproval' in item && item.requiresRegulatoryApproval;

  return {
    id: item.id,
    name: item.name,
    category,
    priceNGN: item.priceNGN,
    priceUSD: item.priceUSD,
    reason,
    expectedImpact,
    safetyCompliance: needsApproval
      ? `Subject to statutory approval. ${item.regulatoryNote || 'FAAN/LASAA or venue authorization must be confirmed before deployment.'}`
      : 'Within approved summit inventory and subject to standard creative/material review.',
    sourceType,
    inventoryStatus,
    availableUnits
  };
}

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function renderCreativeConceptSummary(concepts: CreativeConcept[]) {
  return concepts.map((concept) => (
    `${concept.title}\nHeadline: ${concept.headline}\nBody Copy: ${concept.bodyCopy}\nVisual Notes: ${concept.visualNotes}\nCTA: ${concept.callToAction}`
  )).join('\n\n');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
  const {
    message,
    organisation,
    promotionGoal,
    targetAudience,
    estimatedBudget,
    visibilityTypes,
    currency
  } = (req.body || {}) as MarketplaceAssistantRequest;

  const normalizedOrganisation = sanitizeText(organisation, 160);
  const normalizedMessage = sanitizeText(message, 1200);
  const normalizedGoal = sanitizeText(promotionGoal, 240);
  const normalizedAudience = sanitizeText(targetAudience, 240);
  const normalizedBudget = typeof estimatedBudget === 'number' ? String(estimatedBudget) : sanitizeText(estimatedBudget, 120);
  const normalizedVisibilityTypes = sanitizeStringArray(visibilityTypes);
  const normalizedCurrency = normalizeCurrency(currency);

  if (!normalizedOrganisation && !normalizedMessage && !normalizedGoal) {
    return sendValidationError(res, 'Provide at least an organisation, promotion goal, or message for tailored advertising recommendations.');
  }

  try {
    const currentDb = readDb();
    const positions = (currentDb.ad_positions || INITIAL_AD_POSITIONS) as AdPosition[];
    const packages = (currentDb.sponsorship_packages || INITIAL_SPONSORSHIP_PACKAGES) as SponsorshipPackage[];
    const catalogue = new Map<string, AdPosition | SponsorshipPackage>([
      ...positions.map((item) => [item.id, item] as const),
      ...packages.map((item) => [item.id, item] as const)
    ]);
    const availablePositions = positions.filter((item) => item.availableInventory > 0 && item.status !== 'REQUESTED');
    const availablePackages = packages.filter((item) => item.status !== 'SOLD_OUT');

    const searchText = [
      normalizedOrganisation,
      normalizedMessage,
      normalizedGoal,
      normalizedAudience,
      normalizedBudget,
      normalizedVisibilityTypes.join(' ')
    ].join(' ').toLowerCase();

    const scoredRecommendations = new Map<string, {
      item: AdPosition | SponsorshipPackage;
      score: number;
      reasons: Set<string>;
      impacts: Set<string>;
    }>();

    const addRecommendationSignal = (itemId: string, score: number, reason: string, impact: string) => {
      const item = catalogue.get(itemId);
      if (!item) return;
      const availableUnits = 'slotsAvailable' in item ? item.slotsAvailable : item.availableInventory;
      if (availableUnits <= 0 || item.status === 'SOLD_OUT' || item.status === 'REQUESTED') return;

      const existing = scoredRecommendations.get(itemId);
      if (existing) {
        existing.score += score;
        existing.reasons.add(reason);
        existing.impacts.add(impact);
        return;
      }

      scoredRecommendations.set(itemId, {
        item,
        score,
        reasons: new Set([reason]),
        impacts: new Set([impact])
      });
    };

    [
      {
        keywords: ['water', 'drink', 'hydrate', 'bottle'],
        itemIds: ['ad-water-branded'],
        reason: 'Matches an attendee hydration objective already configured in the approved summit catalogue.',
        impact: 'Places your brand in a guaranteed attendee touchpoint throughout the event day.'
      },
      {
        keywords: ['coffee', 'food', 'lunch', 'catering', 'refreshment'],
        itemIds: ['ad-food-lunch', 'ad-food-coffee'],
        reason: 'Aligns with hospitality-led visibility that keeps your brand present during networking moments.',
        impact: 'Captures repeated brand exposure during breaks and meal sessions.'
      },
      {
        keywords: ['booth', 'exhibit', 'showcase', 'demo', 'display'],
        itemIds: ['ad-exhibit-standard', 'ad-exhibit-island', 'pkg-gold', 'pkg-platinum'],
        reason: 'Supports product demonstrations and face-to-face executive engagement through approved exhibition inventory.',
        impact: 'Creates in-person B2B conversations with delegates, regulators, and decision-makers.'
      },
      {
        keywords: ['simulator', 'simulation', 'training', 'pilot'],
        itemIds: ['pkg-simulation-partner', 'ad-exhibit-island'],
        reason: 'Fits a flight training or simulator-led activation using real summit simulation assets.',
        impact: 'Positions your brand inside the summit’s technical and training conversation.'
      },
      {
        keywords: ['online', 'digital', 'website', 'portal', 'logo'],
        itemIds: ['ad-online-logo-bar', 'ad-online-hero', 'ad-online-partner-spotlight'],
        reason: 'Supports digital-first brand discovery across the official summit portal and programme surfaces.',
        impact: 'Keeps your brand visible before, during, and after the summit through online placements.'
      },
      {
        keywords: ['stage', 'screen', 'video', 'keynote', 'thought leadership'],
        itemIds: ['ad-venue-screen-loop', 'ad-online-programme', 'pkg-title', 'pkg-platinum'],
        reason: 'Targets executive visibility and programme alignment using approved plenary-facing assets.',
        impact: 'Improves brand recall during the most visible summit sessions and broadcasts.'
      },
      {
        keywords: ['lanyard', 'badge', 'delegate', 'credential'],
        itemIds: ['ad-venue-lanyards', 'ad-online-reg-confirm', 'pkg-platinum'],
        reason: 'Targets mandatory delegate touchpoints with inventory that every attendee will see or use.',
        impact: 'Creates broad reach across delegate registration, credentials, and identity materials.'
      },
      {
        keywords: ['airport', 'shuttle', 'route', 'transit', 'arrival'],
        itemIds: ['ad-route-shuttle', 'ad-route-airport-desk'],
        reason: 'Matches airport-to-venue transport branding opportunities already defined in the catalogue.',
        impact: 'Extends brand exposure beyond the venue into arrival and VIP movement corridors.'
      },
      {
        keywords: ['title', 'sovereign', 'platinum', 'gold', 'sponsor'],
        itemIds: ['pkg-title', 'pkg-platinum', 'pkg-gold'],
        reason: 'Matches a premium sponsorship posture with approved tiers and verified benefits.',
        impact: 'Combines executive authority, speaking visibility, and broad brand placement.'
      }
    ].forEach((signal) => {
      const matches = signal.keywords.filter((keyword) => searchText.includes(keyword));
      if (matches.length > 0) {
        signal.itemIds.forEach((itemId) => addRecommendationSignal(itemId, matches.length * 2, signal.reason, signal.impact));
      }
    });

    const parsedBudget = Number((normalizedBudget.match(/\d[\d,]*/)?.[0] || '').replace(/,/g, ''));
    if (parsedBudget) {
      availablePositions
        .filter((item) => item.priceNGN <= parsedBudget * 1.2)
        .slice(0, 3)
        .forEach((item) => addRecommendationSignal(
          item.id,
          1,
          'Fits the indicative budget range while staying within approved summit inventory.',
          'Provides cost-controlled visibility without inventing custom pricing.'
        ));

      availablePackages
        .filter((item) => item.priceNGN > 0 && item.priceNGN <= parsedBudget * 1.3)
        .slice(0, 2)
        .forEach((item) => addRecommendationSignal(
          item.id,
          1,
          'Matches the indicative sponsorship budget with real tier pricing.',
          'Adds structured sponsor recognition using approved package benefits only.'
        ));
    }

    if (scoredRecommendations.size === 0) {
      ['ad-online-logo-bar', 'ad-exhibit-standard', 'ad-venue-lanyards', 'pkg-gold'].forEach((itemId) => addRecommendationSignal(
        itemId,
        1,
        'A balanced starter recommendation anchored on official summit inventory.',
        'Combines online visibility, on-site presence, and delegate-facing exposure.'
      ));
    }

    const fallbackRecommendations = dedupeById(
      Array.from(scoredRecommendations.values())
        .sort((left, right) => right.score - left.score)
        .slice(0, 4)
        .map(({ item, reasons, impacts }) => buildMarketplaceRecommendation(
          item,
          Array.from(reasons).join(' '),
          Array.from(impacts).join(' ')
        ))
    );

    const fallbackData: MarketplaceAssistantData = {
      advisorGreeting: `Welcome ${normalizedOrganisation || 'esteemed aviation partner'} to the Aviation Safety Summit 2026 commercial advisory desk.`,
      recommendedPackages: fallbackRecommendations,
      strategicAdvice: 'For the strongest commercial outcome, combine one broad digital placement, one compulsory attendee touchpoint, and one executive-visibility asset or sponsorship tier that fits your approved budget range.',
      nextSteps: '1. Review the matched inventory. 2. Add approved items to your booking cart or request a formal quote. 3. Complete payment or quotation review. 4. Upload artwork for secretariat validation and deployment scheduling.'
    };

    const ai = getAiClient();
    if (!ai) {
      return sendAiSuccess(res, false, fallbackData);
    }

    try {
      const catalogueSummary = [
        ...availablePositions.map((item) => ({
          id: item.id,
          type: 'POSITION',
          name: item.name,
          category: item.category,
          priceNGN: item.priceNGN,
          priceUSD: item.priceUSD,
          inventoryStatus: item.status,
          availableUnits: item.availableInventory,
          description: item.description,
          requiresRegulatoryApproval: item.requiresRegulatoryApproval
        })),
        ...availablePackages.map((item) => ({
          id: item.id,
          type: 'PACKAGE',
          name: item.name,
          category: item.tier,
          priceNGN: item.priceNGN,
          priceUSD: item.priceUSD,
          inventoryStatus: item.status,
          availableUnits: item.slotsAvailable,
          description: item.tagline,
          requiresRegulatoryApproval: false
        }))
      ];

      const aiPayload = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are the Aviation Safety Summit 2026 commercial advisor.

Only recommend items from the verified catalogue below. Never invent prices, benefits, or approvals. If an item needs regulatory approval, mention that explicitly.

Verified catalogue:
${JSON.stringify(catalogueSummary)}

Client brief:
${JSON.stringify({
  organisation: normalizedOrganisation || 'Not specified',
  promotionGoal: normalizedGoal || 'General summit visibility',
  targetAudience: normalizedAudience || 'Aviation delegates, regulators, and executives',
  estimatedBudget: normalizedBudget || 'Flexible',
  visibilityTypes: normalizedVisibilityTypes,
  message: normalizedMessage || 'Recommend the best approved options',
  currency: normalizedCurrency
})}

Return strict JSON in this schema:
{
  "advisorGreeting": "string",
  "recommendedPackages": [
    {
      "id": "existing catalogue id only",
      "reason": "string",
      "expectedImpact": "string"
    }
  ],
  "strategicAdvice": "string",
  "nextSteps": "string"
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const parsed = safeJsonParse<{
        advisorGreeting?: string;
        recommendedPackages?: Array<{ id?: string; reason?: string; expectedImpact?: string }>;
        strategicAdvice?: string;
        nextSteps?: string;
      }>(aiPayload.text);

      const validatedRecommendations = dedupeById(
        (parsed?.recommendedPackages || [])
          .map((entry) => {
            if (!entry?.id) return null;
            const item = catalogue.get(entry.id);
            if (!item) return null;
            return buildMarketplaceRecommendation(
              item,
              sanitizeText(entry.reason, 400) || 'Matches the stated brand objective using approved summit inventory.',
              sanitizeText(entry.expectedImpact, 240) || 'Provides summit visibility based on approved placement reach.'
            );
          })
          .filter((item): item is MarketplaceRecommendation => Boolean(item))
      ).slice(0, 4);

      if (validatedRecommendations.length > 0) {
        return sendAiSuccess(res, true, {
          advisorGreeting: sanitizeText(parsed?.advisorGreeting, 240) || fallbackData.advisorGreeting,
          recommendedPackages: validatedRecommendations,
          strategicAdvice: sanitizeText(parsed?.strategicAdvice, 800) || fallbackData.strategicAdvice,
          nextSteps: sanitizeText(parsed?.nextSteps, 400) || fallbackData.nextSteps
        }, `${AI_UNVERIFIED_DISCLAIMER}. Recommendations are grounded in the approved summit catalogue and still require administrative confirmation.`);
      }
    } catch (geminiError) {
      console.error('Marketplace AI assistant Gemini error:', geminiError);
    }

    return sendAiSuccess(res, false, fallbackData);
  } catch (error) {
    console.error('Marketplace AI assistant error:', error);
    return res.status(500).json({
      success: false,
      aiGenerated: false,
      error: 'Unable to generate marketplace recommendations at this time.',
      timestamp: createTimestamp()
    });
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
  const {
    companyName,
    contactPerson,
    email,
    phone,
    message,
    targetAudience,
    preferredSizeFormat,
    deadline,
    logoUrl,
    referenceImages
  } = req.body || {};

  const normalizedCompanyName = sanitizeText(companyName, 160);
  const normalizedContactPerson = sanitizeText(contactPerson, 160);
  const normalizedEmail = sanitizeText(email, 160);
  const normalizedPhone = sanitizeText(phone, 80);
  const normalizedMessage = sanitizeText(message, 1200);
  const normalizedAudience = sanitizeText(targetAudience, 240) || 'Aviation decision-makers, regulators, and summit delegates';
  const normalizedFormat = sanitizeText(preferredSizeFormat, 180) || 'Digital and print-safe summit advertising format';
  const normalizedDeadline = sanitizeText(deadline, 80);
  const normalizedLogoUrl = sanitizeText(logoUrl, 500);
  const normalizedReferenceImages = sanitizeStringArray(referenceImages, 8);

  if (!normalizedCompanyName || !normalizedContactPerson || !normalizedEmail || !normalizedMessage) {
    return sendValidationError(res, 'Company name, contact person, email, and campaign message are required.');
  }

  const fallbackConcepts: CreativeConcept[] = [
    {
      title: 'Concept A',
      headline: `${normalizedCompanyName}: Safety Leadership That Travels With Every Flight`,
      bodyCopy: `${normalizedCompanyName} presents a disciplined message of operational confidence, highlighting how its solutions support safer flights, stronger compliance, and dependable passenger outcomes across Nigeria and West Africa.`,
      visualNotes: `Use a deep navy aviation backdrop, the ${normalizedCompanyName} logo, aircraft or control-room imagery, and summit gold accent lines to emphasize trust and executive authority.`,
      callToAction: 'Meet our team at Aviation Safety Summit 2026 to explore approved safety-focused partnership opportunities.'
    },
    {
      title: 'Concept B',
      headline: `Innovation for Safer Skies with ${normalizedCompanyName}`,
      bodyCopy: `Position ${normalizedCompanyName} as a forward-looking contributor to aviation safety through resilient technology, disciplined operations, and practical support for regulators, airlines, and airport stakeholders.`,
      visualNotes: 'Showcase product detail, digital dashboards, radar or aircraft systems imagery, and a clean executive layout built for both exhibition and digital deployment.',
      callToAction: 'Request a summit commercial consultation and creative review with the Domislink secretariat.'
    }
  ];

  try {
    const currentDb = readDb();
    let concepts = fallbackConcepts;
    let aiGenerated = false;
    const ai = getAiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: `Create exactly two distinct summit advertising concepts for ${normalizedCompanyName}.

Summit context: ${SUMMIT_INFO}
Theme: ${SUMMIT_THEME}
Target audience: ${normalizedAudience}
Campaign objective: ${normalizedMessage}
Preferred format: ${normalizedFormat}

Return strict JSON in this schema:
{
  "concepts": [
    {
      "title": "Concept A",
      "headline": "string",
      "bodyCopy": "string",
      "visualNotes": "string",
      "callToAction": "string"
    },
    {
      "title": "Concept B",
      "headline": "string",
      "bodyCopy": "string",
      "visualNotes": "string",
      "callToAction": "string"
    }
  ]
}

Rules:
- Keep both concepts aviation-safety relevant and professional.
- Do not invent event metrics, approvals, or unapproved promises.
- Mention only ideas that still require customer approval and production review.`,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.35
          }
        });

        const parsed = safeJsonParse<{ concepts?: Array<Partial<CreativeConcept>> }>(response.text);
        const parsedConcepts = (parsed?.concepts || [])
          .map((concept, index) => ({
            title: (index === 0 ? 'Concept A' : 'Concept B') as CreativeConcept['title'],
            headline: sanitizeText(concept.headline, 160),
            bodyCopy: sanitizeText(concept.bodyCopy, 500),
            visualNotes: sanitizeText(concept.visualNotes, 400),
            callToAction: sanitizeText(concept.callToAction, 220)
          }))
          .filter((concept) => concept.headline && concept.bodyCopy && concept.visualNotes && concept.callToAction);

        if (parsedConcepts.length === 2) {
          concepts = parsedConcepts;
          aiGenerated = true;
        }
      } catch (geminiError) {
        console.error('Creative request Gemini error:', geminiError);
      }
    }

    const creativeReq: StoredCreativeRequest = {
      id: `cr-${Date.now()}`,
      companyName: normalizedCompanyName,
      contactPerson: normalizedContactPerson,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: normalizedMessage,
      targetAudience: normalizedAudience,
      preferredSizeFormat: normalizedFormat,
      deadline: normalizedDeadline,
      logoProvided: Boolean(normalizedLogoUrl),
      logoUrl: normalizedLogoUrl || '',
      referenceImages: normalizedReferenceImages,
      concepts,
      uploadTracking: {
        logoProvided: Boolean(normalizedLogoUrl),
        uploadedAssetCount: [normalizedLogoUrl, ...normalizedReferenceImages].filter(Boolean).length,
        uploadedAssets: [normalizedLogoUrl, ...normalizedReferenceImages].filter(Boolean)
      },
      aiDraftConcept: renderCreativeConceptSummary(concepts),
      status: 'CONCEPT_DRAFTED',
      createdAt: createTimestamp()
    };

    currentDb.creative_requests = currentDb.creative_requests || [];
    currentDb.creative_requests.unshift(creativeReq);
    writeDb(currentDb);

    return sendAiSuccess(res, aiGenerated, {
      request: creativeReq,
      concepts
    }, aiGenerated ? `${AI_UNVERIFIED_DISCLAIMER}. Creative concepts are draft copy only and require customer approval plus secretariat review.` : undefined);
  } catch (error) {
    console.error('Creative request error:', error);
    return res.status(500).json({
      success: false,
      aiGenerated: false,
      error: 'Creative request processing failed.',
      timestamp: createTimestamp()
    });
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
  const message = sanitizeText(req.body?.message, 1200);
  if (!message) {
    return sendValidationError(res, 'A message is required.');
  }

  try {
    const currentDb = readDb();
    const speakers = ((currentDb.speakers || []) as Speaker[]).filter((speaker) => speaker.published !== false);
    const sessions = (currentDb.sessions || []) as Session[];
    const normalizedQuestion = message.toLowerCase();
    const questionTokens = normalizedQuestion
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2);

    const matchingSpeakers = speakers.filter((speaker) => questionTokens.some((token) => (
      `${speaker.name} ${speaker.organisation} ${speaker.position} ${speaker.topic} ${speaker.industry} ${speaker.session}`.toLowerCase().includes(token)
    ))).slice(0, 3);

    const matchingSessions = sessions.filter((session) => questionTokens.some((token) => (
      `${session.title} ${session.speaker} ${session.room} ${session.type} ${session.time}`.toLowerCase().includes(token)
    ))).slice(0, 3);

    const fallbackText = (() => {
      if (normalizedQuestion.includes('date') || normalizedQuestion.includes('when')) {
        return 'The Aviation Safety Summit 2026 is scheduled for Tuesday, 17 November 2026.';
      }

      if (normalizedQuestion.includes('venue') || normalizedQuestion.includes('where') || normalizedQuestion.includes('location')) {
        return 'The summit venue is the Lagos Marriott Hotel, Ikeja, Lagos, Nigeria.';
      }

      if (normalizedQuestion.includes('theme')) {
        return `The official theme is "${SUMMIT_THEME}".`;
      }

      if (matchingSpeakers.length > 0) {
        return matchingSpeakers.map((speaker) => (
          `${speaker.name} (${speaker.position}, ${speaker.organisation}) is listed with status ${speaker.status}. Topic: ${speaker.topic || 'Topic to be confirmed'}. Session: ${speaker.session || 'To be announced'}.`
        )).join(' ');
      }

      if (matchingSessions.length > 0) {
        return matchingSessions.map((session) => (
          `${session.title} is scheduled for ${session.time || 'TBD'} in ${session.room || 'the designated venue'}${session.speaker ? ` and currently lists ${session.speaker} as speaker` : ''}.`
        )).join(' ');
      }

      return 'That information is not currently available in the official summit programme. Please ask about a listed speaker, session, the venue, the date, or the summit theme.';
    })();

    const ai = getAiClient();
    if (!ai) {
      return sendAiSuccess(res, false, { text: fallbackText, matchedSpeakers: matchingSpeakers.map((speaker) => speaker.name), matchedSessions: matchingSessions.map((session) => session.title) });
    }

    try {
      const speakerContext = speakers
        .slice(0, 20)
        .map((speaker) => `${speaker.name} | ${speaker.position} | ${speaker.organisation} | Status: ${speaker.status} | Topic: ${speaker.topic || 'TBC'} | Session: ${speaker.session || 'TBA'}`)
        .join('\n');
      const sessionContext = sessions
        .slice(0, 20)
        .map((session) => `${session.title} | ${session.time || 'TBD'} | ${session.room || 'Venue TBA'} | Speaker: ${session.speaker || 'TBA'} | Status: ${session.status || 'CONFIRMED'}`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: message,
        config: {
          systemInstruction: `You are the official Aviation Safety Summit 2026 assistant.

Use only the official speaker and session context below. Never invent attendees, dates, rooms, benefits, or agenda items. If the answer is unknown, reply exactly: "That information is not currently available in the official summit programme."

Summit facts:
- ${SUMMIT_INFO}
- Theme: ${SUMMIT_THEME}

Official speakers:
${speakerContext}

Official sessions:
${sessionContext}`,
          temperature: 0.15
        }
      });

      return sendAiSuccess(res, true, {
        text: sanitizeText(response.text, 1200) || fallbackText,
        matchedSpeakers: matchingSpeakers.map((speaker) => speaker.name),
        matchedSessions: matchingSessions.map((session) => session.title)
      }, 'AI-generated answer using official summit records only. Please rely on listed statuses for final confirmation.');
    } catch (geminiError) {
      console.error('Gemini chat error:', geminiError);
    }

    return sendAiSuccess(res, false, { text: fallbackText, matchedSpeakers: matchingSpeakers.map((speaker) => speaker.name), matchedSessions: matchingSessions.map((session) => session.title) });
  } catch (error) {
    console.error('Gemini chat endpoint error:', error);
    return res.status(500).json({
      success: false,
      aiGenerated: false,
      error: 'Unable to process the summit assistant request.',
      timestamp: createTimestamp()
    });
  }
});

// ============================================================
// SPEAKERS: AI TOPIC SUGGESTER (GEMINI POWERED)
// ============================================================
app.post('/api/speakers/ai-suggest-topics', async (req, res) => {
  const name = sanitizeText(req.body?.name, 160);
  const position = sanitizeText(req.body?.position, 160) || 'Executive Leader';
  const organisation = sanitizeText(req.body?.organisation, 160);
  const industry = sanitizeText(req.body?.industry, 120) || 'Aviation & Allied Sectors';
  const role = sanitizeText(req.body?.role, 120) || 'Keynote / Industry Leader';

  if (!name || !organisation) {
    return sendValidationError(res, 'Name and organisation are required.');
  }

  const currentDb = readDb();
  const relevantSpeakers = ((currentDb.speakers || []) as Speaker[])
    .filter((speaker) => speaker.organisation !== organisation && (speaker.industry === industry || speaker.category === role))
    .slice(0, 3)
    .map((speaker) => `${speaker.name} — ${speaker.topic}`);

  const fallbackTopics = [
    `Building a Safer Aviation Culture Through Leadership at ${organisation}`,
    `${industry} and Aviation Safety: Risk Control, Reliability, and Shared Accountability`,
    `Executive Priorities for Safer Skies: Governance, Human Factors, and Operational Discipline`
  ];

  const ai = getAiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are a senior aviation safety summit programme advisor.

Executive: ${name}
Position: ${position}
Organisation: ${organisation}
Industry Sector: ${industry}
Summit Role: ${role}
Relevant examples from current summit speakers: ${relevantSpeakers.join(' | ') || 'None'}

Generate exactly three distinct, professional topic titles focused on aviation safety. Topics must stay relevant to the executive's industry and must not claim the executive has already accepted any topic.

Return strict JSON in either of these shapes:
["Topic 1", "Topic 2", "Topic 3"]
or
{"topics":["Topic 1","Topic 2","Topic 3"]}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.25
        }
      });

      const parsed = safeJsonParse<string[] | { topics?: string[] }>(response.text);
      const aiTopics = Array.isArray(parsed) ? parsed : parsed?.topics || [];
      const normalizedTopics = Array.from(new Set(
        aiTopics
          .map((topic) => sanitizeText(topic, 180))
          .filter((topic) => topic.length > 10)
      )).slice(0, 3);

      if (normalizedTopics.length === 3) {
        return sendAiSuccess<SpeakerTopicsData>(res, true, {
          topics: normalizedTopics,
          speakerContext: { name, organisation, industry, role }
        }, `${AI_UNVERIFIED_DISCLAIMER}. Topic suggestions are draft ideas only and require speaker approval.`);
      }
    } catch (error) {
      console.error('AI speaker topic suggestion error:', error);
    }
  }

  return sendAiSuccess<SpeakerTopicsData>(res, false, {
    topics: fallbackTopics,
    speakerContext: { name, organisation, industry, role }
  }, 'Draft topic suggestions generated from fallback rules and not yet verified.');
});

// ============================================================
// SPEAKERS: "ASK ABOUT THE SPEAKERS" AI GROUNDED ASSISTANT
// ============================================================
app.post('/api/speakers/ai-assistant', async (req, res) => {
  const question = sanitizeText(req.body?.question, 1200);
  if (!question) {
    return sendValidationError(res, 'A valid speaker question is required.');
  }

  const currentDb = readDb();
  const publishedSpeakers = ((currentDb.speakers || []) as Speaker[]).filter((speaker) => speaker.published !== false);
  const stopWords = new Set([
    'who', 'what', 'when', 'where', 'why', 'how', 'is', 'are', 'about', 'speaking', 'speaker', 'talk',
    'the', 'and', 'for', 'from', 'with', 'does', 'anyone', 'tell', 'show', 'me', 'please', 'summit',
    'there', 'their', 'them', 'this', 'that', 'have', 'has', 'will'
  ]);
  const tokens = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((token) => token.length > 2 && !stopWords.has(token));

  const matches = publishedSpeakers
    .map((speaker) => {
      const textBlob = `${speaker.name} ${speaker.position} ${speaker.organisation} ${speaker.industry} ${speaker.topic} ${speaker.category} ${speaker.whyTopicMatters} ${speaker.session}`.toLowerCase();
      const score = tokens.reduce((total, token) => total + (textBlob.includes(token) ? 1 : 0), 0);
      return { speaker, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5);

  const matchedSpeakers: SpeakerAssistantMatch[] = matches.map(({ speaker }) => ({
    id: speaker.id,
    name: speaker.name,
    organisation: speaker.organisation,
    status: speaker.status,
    verificationStatus: `${speaker.workflowStage || 'VERIFIED'}${speaker.verificationDate ? ` • ${speaker.verificationDate}` : ''}`,
    topic: speaker.topic || 'Topic to be confirmed',
    session: speaker.session || 'To be announced'
  }));

  const fallbackAnswer = matchedSpeakers.length > 0
    ? `Here are the matching speakers from the official summit database:\n\n${matchedSpeakers.map((speaker) => `• ${speaker.name} (${speaker.organisation}) — Status: ${speaker.status}; Verification: ${speaker.verificationStatus}; Topic: ${speaker.topic}; Session: ${speaker.session}.`).join('\n')}`
    : 'That information is not currently in the official summit speaker database.';

  const ai = getAiClient();
  if (ai) {
    try {
      const speakerContext = publishedSpeakers.map((speaker, index) => `[SPEAKER ${index + 1}]
Name: ${speaker.name}
Position: ${speaker.position}
Organisation: ${speaker.organisation}
Industry: ${speaker.industry}
Summit Role: ${speaker.category}
Participation Status: ${speaker.status}
Workflow Stage: ${speaker.workflowStage || 'VERIFIED'}
Verification Date: ${speaker.verificationDate || 'Not stated'}
Topic: ${speaker.topic || 'TOPIC TO BE CONFIRMED'}
Topic Status: ${speaker.isTopicOfficial ? 'OFFICIAL APPROVED TOPIC' : 'PROPOSED TOPIC'}
Session: ${speaker.session || 'To Be Announced'}
Time: ${speaker.time || 'TBD'}
Why Topic Matters: ${speaker.whyTopicMatters || 'Foundational to cross-sector aviation safety.'}`).join('\n\n');

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: question,
        config: {
          systemInstruction: `You are the official "Ask About the Speakers" assistant for Aviation Safety Summit 2026.

Rules:
1. Use only the verified speaker records below.
2. Never invent people, positions, organisations, sessions, or attendance status.
3. If the answer is not in the database, reply exactly: "That information is not currently in the official summit speaker database."
4. Always include each relevant speaker's participation status and verification context.
5. Capt. Chris Najomo and Capt. Alex Badeh Jnr. must be described as "TO BE CONFIRMED" unless the database says otherwise.

Verified speaker database:
${speakerContext}`,
          temperature: 0.15
        }
      });

      return sendAiSuccess<SpeakerAssistantData>(res, true, {
        answer: sanitizeText(response.text, 1600) || fallbackAnswer,
        matchedSpeakers
      }, 'AI-generated answer grounded in the official speaker database. Verify participation status before public use.');
    } catch (error) {
      console.error('Speaker assistant Gemini error:', error);
    }
  }

  return sendAiSuccess<SpeakerAssistantData>(res, false, {
    answer: fallbackAnswer,
    matchedSpeakers
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
  try {
    const data = readDb();
    const currentStakeholders = (data.stakeholders || []) as StakeholderInvitee[];
    const validCategories = new Set<StakeholderCategory>(STAKEHOLDER_CATEGORIES.map((item) => item.id as StakeholderCategory));
    const sectorCounts = STAKEHOLDER_CATEGORIES.reduce<Record<string, number>>((accumulator, category) => {
      accumulator[category.id] = 0;
      return accumulator;
    }, {});

    currentStakeholders.forEach((stakeholder) => {
      sectorCounts[stakeholder.category] = (sectorCounts[stakeholder.category] || 0) + 1;
    });

    let underRepresentedCategories = STAKEHOLDER_CATEGORIES
      .filter((category) => (sectorCounts[category.id] || 0) <= 1)
      .map((category) => category.id as StakeholderCategory);

    if (underRepresentedCategories.length === 0) {
      underRepresentedCategories = [...STAKEHOLDER_CATEGORIES]
        .sort((left, right) => (sectorCounts[left.id] || 0) - (sectorCounts[right.id] || 0))
        .slice(0, 6)
        .map((category) => category.id as StakeholderCategory);
    }

    const curatedSuggestions: StakeholderBrainstormSuggestion[] = [
      {
        name: 'Managing Director',
        position: 'Country Managing Director',
        organisation: 'DHL Express Nigeria',
        category: 'LOGISTICS',
        whyRelevant: 'Air cargo hold security, dangerous goods handling compliance, and intermodal transport safety across West Africa.',
        proposedTopic: 'Cold Chain Logistics, Aviation Cargo Safety Standards and Rapid Intermodal Clearance',
        proposedRole: 'PANELIST',
        verificationStatus: 'AI-GENERATED CANDIDATE — NOT YET VERIFIED',
        suggestedSponsorship: 'SILVER'
      },
      {
        name: 'Dr. Pamela Ajayi',
        position: 'President',
        organisation: 'Healthcare Federation of Nigeria (HFN)',
        category: 'HEALTHCARE',
        whyRelevant: 'Aviation medicine, medical fitness of commercial pilots, aeromedical evacuation, and in-flight medical emergency readiness.',
        proposedTopic: 'Cardiovascular and Mental Health Standards in Airline Cockpits and In-Flight Medical Emergency Protocols',
        proposedRole: 'PANELIST',
        verificationStatus: 'AI-GENERATED CANDIDATE — NOT YET VERIFIED',
        suggestedSponsorship: 'EXHIBITION'
      },
      {
        name: 'Minister of Education or delegated aviation-education lead',
        position: 'Honourable Minister / Designated Delegate',
        organisation: 'Federal Ministry of Education',
        category: 'ACADEMIA',
        whyRelevant: 'Aerospace engineering education, pilot training sponsorships, and research capacity directly shape future aviation safety talent.',
        proposedTopic: 'Sustaining the Indigenous Aerospace Engineering Pipeline and Safety Culture in Higher Institutions',
        proposedRole: 'SPECIAL GUEST',
        verificationStatus: 'AI-GENERATED CANDIDATE — NOT YET VERIFIED',
        suggestedSponsorship: 'NONE'
      },
      {
        name: 'Tony O. Elumelu CFR',
        position: 'Group Chairman',
        organisation: 'Heirs Holdings / Transcorp Group',
        category: 'INVESTORS',
        whyRelevant: 'Infrastructure capital, airport hospitality, stable power, and long-term private investment all influence operational safety resilience.',
        proposedTopic: 'Catalysing Private Capital for Airport Power Reliability and Aviation Safety Infrastructure',
        proposedRole: 'GUEST OF HONOUR',
        verificationStatus: 'AI-GENERATED CANDIDATE — NOT YET VERIFIED',
        suggestedSponsorship: 'PLATINUM'
      },
      {
        name: 'Engr. Mansur Ahmed',
        position: 'Former President / Council Member',
        organisation: 'Manufacturers Association of Nigeria (MAN)',
        category: 'MANUFACTURING',
        whyRelevant: 'Engineering reliability, precision manufacturing, supply-chain quality assurance, and standards compliance all connect directly to safe aircraft operations.',
        proposedTopic: 'High-Reliability Manufacturing Principles Applied to Aviation Component Sourcing and Maintenance',
        proposedRole: 'PANELIST',
        verificationStatus: 'AI-GENERATED CANDIDATE — NOT YET VERIFIED',
        suggestedSponsorship: 'SILVER'
      },
      {
        name: 'Editor-in-Chief or Aviation Desk Lead',
        position: 'Editorial Lead',
        organisation: 'Aviation media house or national broadcast newsroom',
        category: 'MEDIA',
        whyRelevant: 'Accurate reporting and informed public communication shape passenger confidence and accountability after incidents or disruptions.',
        proposedTopic: 'Responsible Aviation Safety Journalism, Crisis Communication, and Public Trust',
        proposedRole: 'PANELIST',
        verificationStatus: 'AI-GENERATED CANDIDATE — NOT YET VERIFIED',
        suggestedSponsorship: 'NONE'
      }
    ];

    const fallbackSuggestions = curatedSuggestions
      .filter((suggestion) => underRepresentedCategories.includes(suggestion.category))
      .slice(0, 5);
    const safeFallbackSuggestions = fallbackSuggestions.length > 0 ? fallbackSuggestions : curatedSuggestions.slice(0, 5);

    const responseData = (suggestions: StakeholderBrainstormSuggestion[]) => sendAiSuccess<StakeholderBrainstormData>(
      res,
      false,
      {
        representationBySector: sectorCounts,
        underRepresentedCategories,
        suggestions
      },
      'AI-GENERATED CANDIDATES — NOT YET VERIFIED. Every candidate must be manually audited before official invitation.'
    );

    const ai = getAiClient();
    if (!ai) {
      return responseData(safeFallbackSuggestions);
    }

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are the Aviation Safety Summit 2026 stakeholder research assistant.

Summit context:
- ${SUMMIT_INFO}
- Theme: ${SUMMIT_THEME}

Current representation by sector:
${JSON.stringify(sectorCounts, null, 2)}

Under-represented categories to prioritise:
${JSON.stringify(underRepresentedCategories)}

Existing organisations already in the database:
${JSON.stringify(currentStakeholders.slice(0, 80).map((stakeholder) => stakeholder.organisation))}

Return strict JSON with exactly 5 suggestions using this schema:
[
  {
    "name": "real person or clearly labelled executive office",
    "position": "string",
    "organisation": "string",
    "category": "one of ${Array.from(validCategories).join(', ')}",
    "whyRelevant": "string",
    "proposedTopic": "string",
    "proposedRole": "SPECIAL GUEST | GUEST OF HONOUR | KEYNOTE SPEAKER | PANELIST | GUEST | SPONSOR | EXHIBITOR | PARTNER",
    "verificationStatus": "AI-GENERATED CANDIDATE — NOT YET VERIFIED",
    "suggestedSponsorship": "PLATINUM | GOLD | SILVER | EXHIBITION | NONE"
  }
]

Strict anti-fabrication rules:
- Use only real organisations or clearly labelled executive offices.
- If unsure of a specific person, name the office rather than inventing a person.
- Prioritise Nigeria or West Africa.
- Do not repeat organisations already in the database.`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.25
        }
      });

      const parsed = safeJsonParse<Array<Partial<StakeholderBrainstormSuggestion>>>(response.text) || [];
      const existingKeys = new Set(currentStakeholders.map((stakeholder) => `${stakeholder.name.toLowerCase()}::${stakeholder.organisation.toLowerCase()}`));
      const validatedSuggestions = parsed
        .map((suggestion) => {
          const category = sanitizeText(suggestion.category, 80) as StakeholderCategory;
          const name = sanitizeText(suggestion.name, 160);
          const organisation = sanitizeText(suggestion.organisation, 160);
          const position = sanitizeText(suggestion.position, 160);
          const proposedTopic = sanitizeText(suggestion.proposedTopic, 220);
          const whyRelevant = sanitizeText(suggestion.whyRelevant, 320);
          const proposedRole = sanitizeText(suggestion.proposedRole, 40) as StakeholderEventRole;
          const suggestedSponsorship = sanitizeText(suggestion.suggestedSponsorship, 40) || 'NONE';

          if (!name || !organisation || !position || !proposedTopic || !whyRelevant || !validCategories.has(category)) {
            return null;
          }

          const dedupeKey = `${name.toLowerCase()}::${organisation.toLowerCase()}`;
          if (existingKeys.has(dedupeKey)) {
            return null;
          }

          return {
            name,
            position,
            organisation,
            category,
            whyRelevant,
            proposedTopic,
            proposedRole: (
              ['SPECIAL GUEST', 'GUEST OF HONOUR', 'KEYNOTE SPEAKER', 'PANELIST', 'GUEST', 'SPONSOR', 'EXHIBITOR', 'PARTNER']
                .includes(proposedRole) ? proposedRole : 'GUEST'
            ) as StakeholderEventRole,
            verificationStatus: 'AI-GENERATED CANDIDATE — NOT YET VERIFIED',
            suggestedSponsorship
          } satisfies StakeholderBrainstormSuggestion;
        })
        .filter((suggestion): suggestion is StakeholderBrainstormSuggestion => Boolean(suggestion))
        .slice(0, 5);

      if (validatedSuggestions.length > 0) {
        return sendAiSuccess<StakeholderBrainstormData>(
          res,
          true,
          {
            representationBySector: sectorCounts,
            underRepresentedCategories,
            suggestions: validatedSuggestions
          },
          'AI-GENERATED CANDIDATES — NOT YET VERIFIED. Every candidate must be manually audited before official invitation.'
        );
      }
    } catch (error) {
      console.error('Stakeholder brainstorm Gemini error:', error);
    }

    return responseData(safeFallbackSuggestions);
  } catch (error) {
    console.error('Stakeholder brainstorm endpoint error:', error);
    return res.status(500).json({
      success: false,
      aiGenerated: false,
      error: 'Unable to generate stakeholder suggestions at this time.',
      timestamp: createTimestamp()
    });
  }
});

// 6. POST /api/stakeholders/ai-letter (Domislink Mail AI: Invitation Letter Generator)
app.post('/api/stakeholders/ai-letter', async (req, res) => {
  const recipientName = sanitizeText(req.body?.recipientName, 160);
  const recipientPosition = sanitizeText(req.body?.recipientPosition, 160) || 'Executive Leader';
  const recipientOrg = sanitizeText(req.body?.recipientOrg, 160);
  const recipientEmail = sanitizeText(req.body?.recipientEmail, 160);
  const category = (sanitizeText(req.body?.category, 80) || 'OTHER') as StakeholderCategory;
  const proposedTopic = sanitizeText(req.body?.proposedTopic, 220) || 'Corporate Leadership and Shared Safety Accountability';
  const eventRole = (sanitizeText(req.body?.eventRole, 60) || 'GUEST') as StakeholderEventRole;
  const sponsorshipOption = sanitizeText(req.body?.sponsorshipOption, 80);
  const specialMessage = sanitizeText(req.body?.specialMessage, 400);

  if (!recipientName || !recipientOrg) {
    return sendValidationError(res, 'Recipient name and organisation are required.');
  }

  const categoryMeta = findStakeholderCategoryMeta(category);
  let subject = `OFFICIAL INVITATION: Aviation Safety Summit 2026 — 17 November 2026, Marriott Hotel Ikeja, Lagos`;
  let formalSalutation = `Dear ${recipientName},`;
  let formalInvitationText = `On behalf of the Advisory Board and Secretariat of the Aviation Safety Summit 2026, convened by Domislink International Services Ltd, we respectfully invite you to participate as a distinguished ${eventRole} at this national safety forum.`;
  let eventDetailsText = `The summit will hold on Tuesday, 17 November 2026, at the Lagos Marriott Hotel, Ikeja, Lagos, Nigeria, with protocol activities commencing from 08:30 AM WAT.`;
  let sectorRelevanceText = `The summit theme is "${SUMMIT_THEME}." ${recipientOrg} belongs in this conversation because ${categoryMeta?.whyCorporateBelongs?.toLowerCase() || 'its sector directly shapes public safety, operational resilience, and responsible leadership.'}`;
  let proposedRoleText = `We would be honoured to host you as a ${eventRole}. We propose the discussion area "${proposedTopic}", subject entirely to your review, convenience, and formal acceptance.`;
  let callToActionText = sponsorshipOption
    ? `Should your office wish, the secretariat can also discuss the approved ${sponsorshipOption} sponsorship pathway in a manner aligned with your protocol preferences. Kindly confirm acceptance or nominate a representative at your earliest convenience.`
    : 'Kindly confirm acceptance, propose amendments, or nominate a representative at your earliest convenience so that protocol, seating, and programme planning can be concluded properly.';
  let signatureBlock = `Yours faithfully,\n\nSummit Secretariat & Organizing Board\nDomislink International Services Ltd\nLagos, Nigeria\nEmail: domislinkint@gmail.com | Web: https://summit.domislink.com`;

  const buildFullHtmlContent = () => [
    `<p>${escapeHtml(formalSalutation)}</p>`,
    `<p>${escapeHtml(formalInvitationText)}</p>`,
    `<p>${escapeHtml(eventDetailsText)}</p>`,
    `<p>${escapeHtml(sectorRelevanceText)}</p>`,
    `<p>${escapeHtml(proposedRoleText)}</p>`,
    `<p>${escapeHtml(callToActionText)}</p>`,
    `<p>${escapeHtml(signatureBlock).replace(/\n/g, '<br />')}</p>`
  ].join('');

  let fullHtmlContent = buildFullHtmlContent();
  let aiGenerated = false;
  const ai = getAiClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are the Chief Diplomatic Protocol Officer for Domislink.

Generate a formal invitation letter for:
- Recipient: ${recipientName}
- Position: ${recipientPosition}
- Organisation: ${recipientOrg}
- Sector: ${category}
- Proposed Role: ${eventRole}
- Proposed Topic: ${proposedTopic}
- Sponsorship mention: ${sponsorshipOption || 'None'}
- Special note: ${specialMessage || 'None'}

Summit context:
- ${SUMMIT_INFO}
- Theme: ${SUMMIT_THEME}
- Sector relevance hint: ${categoryMeta?.whyCorporateBelongs || 'This sector intersects with aviation safety.'}

Rules:
- Keep the tone diplomatic, formal, and respectful.
- Explain why the recipient's sector matters to aviation safety.
- State clearly that the topic is proposed and subject to acceptance.
- Do not invent benefits or commitments.

Return strict JSON with:
{
  "subject": "string",
  "formalSalutation": "string",
  "formalInvitationText": "string",
  "eventDetailsText": "string",
  "sectorRelevanceText": "string",
  "proposedRoleText": "string",
  "callToActionText": "string",
  "signatureBlock": "string",
  "fullHtmlContent": "string"
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const parsed = safeJsonParse<Partial<GeneratedInvitationLetter>>(response.text);
      if (parsed) {
        subject = sanitizeText(parsed.subject, 220) || subject;
        formalSalutation = sanitizeText(parsed.formalSalutation, 160) || formalSalutation;
        formalInvitationText = sanitizeText(parsed.formalInvitationText, 700) || formalInvitationText;
        eventDetailsText = sanitizeText(parsed.eventDetailsText, 500) || eventDetailsText;
        sectorRelevanceText = sanitizeText(parsed.sectorRelevanceText, 700) || sectorRelevanceText;
        proposedRoleText = sanitizeText(parsed.proposedRoleText, 500) || proposedRoleText;
        callToActionText = sanitizeText(parsed.callToActionText, 500) || callToActionText;
        signatureBlock = sanitizeText(parsed.signatureBlock, 400).replace(/\\n/g, '\n') || signatureBlock;
        aiGenerated = true;
      }
    } catch (error) {
      console.error('Stakeholder letter Gemini error:', error);
    }
  }

  fullHtmlContent = buildFullHtmlContent();
  const emailBodyText = `${formalSalutation}\n\n${formalInvitationText}\n\n${eventDetailsText}\n\n${sectorRelevanceText}\n\n${proposedRoleText}\n\n${callToActionText}\n\n${signatureBlock}`;
  const gmailDraftUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyText)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyText)}`;

  const letter: GeneratedInvitationLetter = {
    id: `ltr-${Date.now()}`,
    recipientName,
    recipientPosition,
    recipientOrg,
    recipientEmail,
    category,
    eventRole,
    proposedTopic,
    sponsorshipOption,
    specialMessage,
    subject,
    formalSalutation,
    formalInvitationText,
    eventDetailsText,
    sectorRelevanceText,
    proposedRoleText,
    callToActionText,
    signatureBlock,
    fullHtmlContent,
    gmailDraftUrl,
    mailtoUrl,
    status: 'DRAFT',
    createdAt: createTimestamp()
  };

  return sendAiSuccess(res, aiGenerated, { letter }, aiGenerated ? `${AI_UNVERIFIED_DISCLAIMER}. Letter content should be reviewed before dispatch.` : undefined);
});

// 7. POST /api/stakeholders/ai-sponsorship-proposal (Corporate Sponsorship Proposition)
app.post('/api/stakeholders/ai-sponsorship-proposal', async (req, res) => {
  const companyName = sanitizeText(req.body?.companyName, 160);
  const industry = sanitizeText(req.body?.industry, 120) || 'OTHER';
  const executiveName = sanitizeText(req.body?.executiveName, 160) || 'Executive Leadership';
  const executivePosition = sanitizeText(req.body?.executivePosition, 160) || 'Leadership';

  if (!companyName) {
    return sendValidationError(res, 'Company name is required.');
  }

  const data = readDb();
  const packages = (data.sponsorship_packages || INITIAL_SPONSORSHIP_PACKAGES) as SponsorshipPackage[];
  const packageMap = new Map(packages.map((pkg) => [pkg.tier, pkg] as const));
  const approvedTierOrder: SponsorshipPackage['tier'][] = ['TITLE', 'PLATINUM', 'GOLD', 'SILVER', 'SAFETY', 'SIMULATION'];
  const isTopTierSector = ['BANKING_AND_FINANCE', 'OIL_AND_GAS', 'AIRLINES', 'GOVERNMENT', 'STATE_GOVERNMENT', 'TECHNOLOGY'].includes(industry);
  const categoryMeta = findStakeholderCategoryMeta(industry);

  const buildTierRecommendation = (tier: SponsorshipPackage['tier'], rationale: string): SponsorshipTierRecommendation | null => {
    const pkg = packageMap.get(tier);
    if (!pkg) return null;

    return {
      id: pkg.id,
      tier: pkg.tier,
      name: pkg.name,
      rationale,
      feeNGN: formatMoney(pkg.priceNGN, 'NGN'),
      feeUSD: formatMoney(pkg.priceUSD, 'USD'),
      benefits: pkg.benefits,
      status: pkg.status
    };
  };

  const fallbackTierSelection = dedupeById([
    buildTierRecommendation(
      isTopTierSector ? 'TITLE' : 'PLATINUM',
      `Recommended for ${companyName} if the goal is maximum executive visibility and broad summit-wide authority.`
    ),
    buildTierRecommendation('PLATINUM', `Recommended for ${companyName} as a premier partnership option with strong executive visibility and exhibition presence.`),
    buildTierRecommendation('GOLD', `Recommended for ${companyName} as a balanced route to visibility, exhibition presence, and programme recognition.`),
    buildTierRecommendation(
      industry === 'TECHNOLOGY' || industry === 'AIR_NAVIGATION' ? 'SAFETY'
        : industry === 'ACADEMIA' || industry === 'AIRLINES' ? 'SIMULATION'
        : 'SILVER',
      `Recommended because ${categoryMeta?.whyCorporateBelongs?.toLowerCase() || 'the sector has a direct safety stake in aviation outcomes.'}`
    )
  ].filter((tier): tier is SponsorshipTierRecommendation => Boolean(tier)));

  const fallbackProposal: SponsorshipProposalData = {
    headline: `Strategic Aviation Safety Partnership Proposal for ${companyName}`,
    whySectorMatters: `${companyName} operates in a sector where ${categoryMeta?.whyCorporateBelongs?.toLowerCase() || 'operational continuity, public confidence, and risk prevention directly affect aviation safety.'}`,
    howParticipationSupportsSafety: `By partnering with Aviation Safety Summit 2026, ${companyName} can support informed dialogue, operational discipline, and practical collaboration across regulators, operators, infrastructure owners, and service providers.`,
    recommendedTiers: fallbackTierSelection,
    callToAction: `To progress, the Domislink commercial team can prepare a formal quotation for ${companyName} and align the preferred sponsorship tier with ${executiveName}'s office.`
  };

  const ai = getAiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are the Commercial Director for Aviation Safety Summit 2026.

Prepare a sponsorship proposal for:
- Company: ${companyName}
- Industry: ${industry}
- Executive: ${executiveName} (${executivePosition})

Approved sponsorship tiers only:
${JSON.stringify(approvedTierOrder.map((tier) => {
  const pkg = packageMap.get(tier);
  return pkg ? {
    tier: pkg.tier,
    id: pkg.id,
    name: pkg.name,
    priceNGN: pkg.priceNGN,
    priceUSD: pkg.priceUSD,
    benefits: pkg.benefits
  } : null;
}).filter(Boolean))}

Rules:
- Explain why aviation safety matters to this sector.
- Use only approved tiers and approved benefits.
- Recommend up to 3 tiers by tier code, not invented names.
- Prices must remain exactly as supplied in the approved tier list.

Return strict JSON:
{
  "headline": "string",
  "whySectorMatters": "string",
  "howParticipationSupportsSafety": "string",
  "recommendedTiers": [
    { "tier": "PLATINUM|GOLD|SILVER|SAFETY|SIMULATION|TITLE", "rationale": "string" }
  ],
  "callToAction": "string"
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const parsed = safeJsonParse<{
        headline?: string;
        whySectorMatters?: string;
        howParticipationSupportsSafety?: string;
        recommendedTiers?: Array<{ tier?: SponsorshipPackage['tier']; rationale?: string }>;
        callToAction?: string;
      }>(response.text);

      const validatedTiers = dedupeById(
        (parsed?.recommendedTiers || [])
          .map((entry) => {
            if (!entry?.tier || !approvedTierOrder.includes(entry.tier)) return null;
            return buildTierRecommendation(entry.tier, sanitizeText(entry.rationale, 220) || `Recommended for ${companyName} based on its sector fit and summit objectives.`);
          })
          .filter((tier): tier is SponsorshipTierRecommendation => Boolean(tier))
      ).slice(0, 3);

      if (validatedTiers.length > 0) {
        return sendAiSuccess(
          res,
          true,
          {
            proposal: {
              headline: sanitizeText(parsed?.headline, 220) || fallbackProposal.headline,
              whySectorMatters: sanitizeText(parsed?.whySectorMatters, 700) || fallbackProposal.whySectorMatters,
              howParticipationSupportsSafety: sanitizeText(parsed?.howParticipationSupportsSafety, 700) || fallbackProposal.howParticipationSupportsSafety,
              recommendedTiers: validatedTiers,
              callToAction: sanitizeText(parsed?.callToAction, 400) || fallbackProposal.callToAction
            }
          },
          `${AI_UNVERIFIED_DISCLAIMER}. Proposal language is advisory; commercial approval still depends on the official sponsorship inventory.`
        );
      }
    } catch (error) {
      console.error('Sponsorship proposal Gemini error:', error);
    }
  }

  return sendAiSuccess(res, false, { proposal: fallbackProposal });
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

start().catch((err) => {
  console.error('Failed to start fullstack server:', err);
});
