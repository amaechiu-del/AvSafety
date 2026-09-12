/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventInfo {
  id: string;
  name: string;
  theme: string;
  date: string;
  venue: string;
  organizer: string;
  brand: string;
  symbol: string;
}

export type SpeakerStatus = 
  | 'CONFIRMED SPEAKER' 
  | 'CONFIRMED GUEST' 
  | 'INVITED' 
  | 'PROPOSED' 
  | 'TO BE CONFIRMED'
  | 'CONFIRMED'
  | 'PROVISIONAL'
  | 'TO_BE_CONFIRMED'
  | 'COMPLETED';

export type SpeakerWorkflowStage = 
  | 'RESEARCHED' 
  | 'VERIFIED' 
  | 'INVITED' 
  | 'PROPOSED' 
  | 'CONFIRMED' 
  | 'TOPIC_APPROVED' 
  | 'PUBLISHED';

export type PhotoRightsStatus = 
  | 'RIGHTS_VERIFIED' 
  | 'RIGHTS_TO_BE_VERIFIED' 
  | 'OFFICIAL_PHOTO_REQUIRED';

export type SpeakerIndustry = 
  | 'AVIATION'
  | 'GOVERNMENT' 
  | 'REGULATORS' 
  | 'AIRLINES' 
  | 'AIRPORTS' 
  | 'OIL & GAS' 
  | 'BANKING' 
  | 'TELECOMMUNICATIONS' 
  | 'TECHNOLOGY' 
  | 'MANUFACTURING' 
  | 'INSURANCE' 
  | 'TRAINING' 
  | 'SIMULATION' 
  | 'INVESTORS' 
  | 'OTHER';

export interface Speaker {
  id: string;
  name: string;
  position: string;
  organisation: string;
  category: 'Special Guest' | 'Keynote Speaker' | 'Guest of Honour' | 'Panelist' | 'Industry Leader' | 'Speaker' | 'Moderator';
  topic: string;
  isTopicOfficial?: boolean;
  suggestedTopics?: string[];
  bio: string;
  safetyPerspective?: string;
  whyTopicMatters?: string;
  photoUrl: string; // Real photo URL or empty for placeholder
  photoRights?: PhotoRightsStatus;
  photoSource?: string;
  orgLogoUrl?: string;
  orgLogoSource?: string;
  industry: SpeakerIndustry;
  session: string;
  time: string;
  status: SpeakerStatus;
  workflowStage?: SpeakerWorkflowStage;
  verificationDate?: string;
  verificationSource?: string;
  verifiedBy?: string;
  companyLink?: string;
  isFeatured?: boolean;
  published?: boolean;
  archived?: boolean;
  socials?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    professionalLink?: string;
  };
}

export interface Organisation {
  id: string;
  name: string;
  industry: 'GOVERNMENT' | 'REGULATORS' | 'AIRLINES' | 'OIL & GAS' | 'BANKING' | 'TELECOMMUNICATIONS' | 'TECHNOLOGY' | 'AIRPORTS' | 'TRAINING' | 'INVESTORS' | 'OTHER';
  representative: string;
  topic: string;
  partnershipStatus: string;
  logoPlaceholder: string; // e.g. "Shell", "MTN", "Access"
  logoUrl?: string;
  session: string;
  colorTheme?: string;
}

export type ProgrammeSessionType = 
  | 'Opening Session' 
  | 'Keynote' 
  | 'Panel' 
  | 'Workshop' 
  | 'Training' 
  | 'Simulation' 
  | 'Memo Challenge' 
  | 'Book Launch' 
  | 'Exhibition' 
  | 'Networking' 
  | 'Sky Party' 
  | 'Investment'
  | 'Other';

export type SessionStatus = 'CONFIRMED' | 'PROVISIONAL' | 'INVITED' | 'TO_BE_CONFIRMED' | 'COMPLETED';

export interface Session {
  id: string;
  time: string;
  title: string;
  type: ProgrammeSessionType;
  speaker: string;
  organisation: string;
  position?: string;
  topic: string;
  description: string;
  room: string;
  status: SessionStatus;
  
  // Topic System
  officialTopic?: string;
  keyQuestions?: string[];
  sessionObjectives?: string[];
  panelQuestions?: string[];

  // Panel specific
  panelists?: Array<{
    name: string;
    photoUrl: string;
    organisation: string;
    position: string;
    questionOrTopic: string;
    status: SessionStatus;
  }>;
  moderator?: {
    name: string;
    photoUrl: string;
    organisation: string;
    position: string;
    status: SessionStatus;
  };
  
  // Sponsor Integration
  sponsorDetails?: {
    type: 'PRESENTED BY' | 'SUPPORTED BY' | 'SPONSORED BY' | 'PARTNER';
    sponsorName: string;
    sponsorId?: string;
  };

  published: boolean;
}

export interface Registration {
  id: string;
  registrationCode: string;
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  position: string;
  industry: string;
  country: string;
  attendanceCategory: string;
  attendanceType?: 'In-Person' | 'Virtual';
  
  // Optional requirements
  dietaryRequirements?: string;
  accessibilityRequirements?: string;
  specialRequests?: string;

  // Administrator-ready governance metadata
  status: 'CONFIRMED' | 'CHECKED_IN' | 'PENDING_REVIEW' | 'CANCELLED';
  registeredAt: string;
  consentNDPA: boolean;
  consentTimestamp: string;
  jurisdiction: string;
  adminNotes?: string;
}

export interface MemoSubmission {
  id: string;
  name?: string;
  isAnonymous: boolean;
  profession: string;
  organisation: string;
  experienceCategory: string;
  memoTitle: string;
  memoContent: string;
  lessonLearned: string;
  recommendedImprovement: string;
  consent: boolean;
  submittedAt: string;
}

export interface BookInfo {
  id: string;
  title: string;
  author: string;
  authorPhotoUrl?: string;
  description: string;
  coverImagePlaceholder: string;
  launchTime?: string;
  purchaseLink?: string; // Internal or external
  hasSigning?: boolean;
}

export interface SkyPartyInfo {
  id: string;
  date: string;
  time: string;
  location: string;
  description: string;
  accessType: 'PUBLIC' | 'INVITATION_ONLY' | 'PAID' | 'SPONSOR_ACCESS' | 'TO_BE_CONFIRMED';
  ticketInfo?: string;
  hospitalityDetails?: string;
  sponsorName?: string;
}

export interface InvestmentOpportunity {
  id: string;
  company: string;
  opportunity: string;
  description: string;
  regulatoryInfo: string;
  minimumInvestment: string;
  offerPeriod: string;
  officialContact: string;
  officialDocumentation: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Safety Article' | 'Video' | 'Report' | 'News' | 'Announcement';
  content: string;
  publishedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  tier: 'TITLE' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'MEDIA' | 'TECHNOLOGY' | 'TRAINING' | 'COMMUNITY';
  logoText: string;
  editablePrice?: string;
}

// ==========================================
// COMMERCIAL MARKETPLACE & SPONSORSHIP TYPES
// ==========================================

export type MarketCategory = 
  | 'ONLINE' 
  | 'VENUE' 
  | 'AIRPORT_ROUTE' 
  | 'SPONSORSHIPS' 
  | 'EXHIBITION' 
  | 'FOOD_WATER' 
  | 'STAFF' 
  | 'BOOK_MEDIA' 
  | 'CREATIVE_PRINT'
  | 'CUSTOM_BUILDER';

export type InventoryStatus = 
  | 'AVAILABLE' 
  | 'HELD' 
  | 'PAYMENT_PENDING' 
  | 'SOLD' 
  | 'PENDING_APPROVAL' 
  | 'REQUESTED' 
  | 'TO_BE_CONFIRMED' 
  | 'NOT_AVAILABLE';

export interface AdPosition {
  id: string;
  name: string;
  category: MarketCategory;
  subcategory?: string;
  description: string;
  location: string;
  sizeFormat: string;
  duration: string;
  targetAudience: string;
  whatCustomerProvides: string;
  whatDomislinkProvides: string;
  whatIsIncluded: string[];
  optionalAddons: Array<{
    id: string;
    name: string;
    priceNGN: number;
    priceUSD: number;
  }>;
  priceNGN: number;
  priceUSD: number;
  isPriceCustom: boolean;
  productionCostNGN: number;
  productionCostUSD: number;
  installationCostNGN: number;
  installationCostUSD: number;
  totalInventory: number;
  availableInventory: number;
  status: InventoryStatus;
  exclusive: boolean;
  requiresRegulatoryApproval: boolean;
  regulatoryNote?: string;
  badge?: string;
}

export interface SponsorshipPackage {
  id: string;
  tier: 'TITLE' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'SAFETY' | 'SIMULATION' | 'TRAINING' | 'MEMO' | 'BOOK_LAUNCH' | 'SKY_PARTY' | 'HOSPITALITY' | 'WATER' | 'FOOD' | 'TRANSPORT' | 'MEDIA' | 'TECHNOLOGY' | 'REGISTRATION' | 'EMERGENCY' | 'CUSTOM';
  name: string;
  tagline: string;
  description: string;
  priceNGN: number;
  priceUSD: number;
  isCustomPrice: boolean;
  benefits: string[];
  slotsTotal: number;
  slotsAvailable: number;
  status: 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT' | 'CUSTOM_INQUIRY';
  popular?: boolean;
  colorAccent: string;
}

export interface BookingItem {
  id: string;
  positionId: string;
  name: string;
  category: MarketCategory;
  quantity: number;
  unitPriceNGN: number;
  unitPriceUSD: number;
  supplyOption: 'SUPPLIED_BY_CLIENT' | 'PRODUCE_BY_DOMISLINK' | 'PRODUCE_AND_INSTALL';
  productionCostNGN: number;
  productionCostUSD: number;
  installationCostNGN: number;
  installationCostUSD: number;
  customRequirements?: string;
}

export interface BookingAddon {
  id: string;
  name: string;
  priceNGN: number;
  priceUSD: number;
}

export interface ArtworkFile {
  id: string;
  fileType: 'LOGO' | 'BANNER' | 'POSTER' | 'VIDEO' | 'ADVERT' | 'BOOK_COVER' | 'PRODUCT_IMAGE' | 'BRAND_GUIDELINE' | 'OTHER';
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  dimensions?: string;
  uploadedAt: string;
  adminFeedback?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'DISPLAYED';
}

export interface ProofOfDisplayRecord {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  mediaType: 'PHOTOGRAPH' | 'SCREENSHOT' | 'VIDEO' | 'DISPLAY_LOG';
  mediaUrl: string;
  notes: string;
  verifiedBy: string;
  uploadedAt: string;
}

export interface CommercialOrder {
  id: string;
  orderNumber: string; // e.g. ORD-AVS26-8812
  companyName: string;
  companyType: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  campaignMessage?: string;
  specialInstructions?: string;

  items: BookingItem[];
  addons: BookingAddon[];

  currency: 'NGN' | 'USD';
  subtotal: number;
  productionTotal: number;
  installationTotal: number;
  addonsTotal: number;
  totalAmount: number;

  paymentMethod: 'PAYSTACK' | 'DIRECT_BANK_TRANSFER' | 'INVOICE_TERMS';
  paymentStatus: 'UNPAID' | 'PAYMENT_PENDING' | 'VERIFIED_PAID' | 'REFUNDED' | 'FAILED';
  paystackReference?: string;
  paystackChannel?: string;
  paidAt?: string;

  orderStatus: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'DEPLOYED' | 'COMPLETED' | 'CANCELLED';
  artworkStatus: 'NOT_SUBMITTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'DISPLAYED';
  artworkFiles: ArtworkFile[];
  proofOfDisplay: ProofOfDisplayRecord[];

  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomQuote {
  id: string;
  quoteNumber: string; // e.g. Q-AVS26-5120
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  summary: string;
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    productionCost: number;
    installationCost: number;
    total: number;
  }>;
  currency: 'NGN' | 'USD';
  totalAmount: number;
  validityDays: number;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'PAID' | 'EXPIRED';
  terms: string;
  adminNotes?: string;
  createdAt: string;
}

export interface CreativeServiceRequest {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  message: string;
  targetAudience: string;
  preferredSizeFormat: string;
  deadline: string;
  logoProvided: boolean;
  logoUrl?: string;
  referenceImages?: string[];
  aiDraftConcept?: string;
  status: 'SUBMITTED' | 'CONCEPT_DRAFTED' | 'CUSTOMER_APPROVED' | 'IN_PRODUCTION' | 'COMPLETED';
  createdAt: string;
}

export interface RevenueMetrics {
  totalSalesNGN: number;
  totalSalesUSD: number;
  paidRevenueNGN: number;
  paidRevenueUSD: number;
  pendingRevenueNGN: number;
  pendingRevenueUSD: number;
  ordersCount: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  byCategory: Record<string, { count: number; totalNGN: number; totalUSD: number }>;
  byPackage: Record<string, { count: number; totalNGN: number; totalUSD: number }>;
  topCompanies: Array<{ companyName: string; totalNGN: number; totalUSD: number; ordersCount: number }>;
}

// ============================================================
// EXPANDED SUMMIT INVITATION & STAKEHOLDER ENGINE TYPES
// ============================================================

export type StakeholderCategoryKey =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
  | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P'
  | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X';

export type StakeholderCategory =
  | 'AVIATION'
  | 'GOVERNMENT'
  | 'STATE_GOVERNMENT'
  | 'AIRLINES'
  | 'AIRPORTS'
  | 'AIR_NAVIGATION'
  | 'OIL_AND_GAS'
  | 'BANKING_AND_FINANCE'
  | 'TELECOMMUNICATIONS'
  | 'TECHNOLOGY'
  | 'MANUFACTURING'
  | 'INSURANCE'
  | 'LOGISTICS'
  | 'HEALTHCARE'
  | 'ACADEMIA'
  | 'FAITH_AND_COMMUNITY'
  | 'MEDIA'
  | 'INVESTORS'
  | 'TRAVEL_AND_TOURISM'
  | 'EMERGENCY_AND_RESCUE'
  | 'SECURITY'
  | 'TRANSPORT'
  | 'PASSENGERS_AND_ADVOCACY'
  | 'OTHER';

export type InvitationStatus =
  | 'RESEARCH CANDIDATE'
  | 'PROPOSED INVITEE'
  | 'INVITATION TO BE SENT'
  | 'INVITATION SENT'
  | 'ACKNOWLEDGED'
  | 'INTERESTED'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'DECLINED'
  | 'NO RESPONSE'
  | 'ARCHIVED';

export type StakeholderStatus = InvitationStatus;

export type SummitEventRole =
  | 'SPECIAL GUEST'
  | 'GUEST OF HONOUR'
  | 'KEYNOTE SPEAKER'
  | 'PANELIST'
  | 'SPEAKER'
  | 'GUEST'
  | 'SPONSOR'
  | 'EXHIBITOR'
  | 'PARTNER'
  | 'ADVERTISER'
  | 'ATTENDEE';

export type StakeholderEventRole = SummitEventRole;

export interface StakeholderCategoryMeta {
  key: StakeholderCategoryKey;
  id: StakeholderCategory;
  title: string;
  shortLabel: string;
  iconName: string;
  whyCorporateBelongs: string;
  defaultDiscussionArea: string;
}

export interface StakeholderInvitee {
  id: string;
  name: string;
  position: string;
  organisation: string;
  category: StakeholderCategory;
  isNigerDelta?: boolean;
  state?: string;
  status: InvitationStatus;
  eventRole: SummitEventRole;
  proposedTopic?: string;
  isTopicOfficial?: boolean;
  whySectorMatters: string;
  proposedDiscussionArea: string;
  email?: string;
  phone?: string;
  invitationDate?: string;
  followUpDate?: string;
  sponsorshipInterest?: 'NONE' | 'EXPLORING' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'EXHIBITION' | 'PROGRAMME_AD';
  speakerInterest?: boolean;
  exhibitorInterest?: boolean;
  photoUrl: string;
  photoSource?: string;
  photoVerified: boolean;
  orgLogoUrl: string;
  orgLogoSource?: string;
  logoVerified: boolean;
  currentRoleVerified: boolean;
  verificationDate?: string;
  verifiedBy?: string;
  verificationSource?: string;
  responseNotes?: string;
  nextAction?: string;
  notes?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvitationLetter {
  id: string;
  inviteeId?: string;
  recipientName: string;
  recipientPosition: string;
  recipientOrg: string;
  recipientEmail: string;
  category: StakeholderCategory;
  eventRole: SummitEventRole;
  proposedTopic: string;
  sponsorshipOption?: string;
  specialMessage?: string;
  subject: string;
  formalSalutation: string;
  formalInvitationText: string;
  eventDetailsText: string;
  sectorRelevanceText: string;
  proposedRoleText: string;
  callToActionText: string;
  signatureBlock: string;
  fullHtmlContent: string;
  status: 'DRAFT' | 'APPROVED' | 'SENT' | 'GMAIL_DRAFTED';
  sentAt?: string;
  followUpDueAt?: string;
  createdAt: string;
}

export interface StakeholderStats {
  totalCandidates: number;
  proposedInvitees: number;
  invitationsSent: number;
  acknowledged: number;
  interested: number;
  accepted: number;
  confirmed: number;
  declined: number;
  noResponse: number;
  archived: number;
  sponsorshipInterestCount: number;
  speakerInterestCount: number;
  exhibitorInterestCount: number;
  byCategory: Record<string, number>;
}

