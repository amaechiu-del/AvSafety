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
  | 'FAITH'
  | 'INTERNATIONAL_BODY'
  | 'OTHER';

export interface Speaker {
  id: string;
  name: string;
  position: string;
  organisation: string;
  category: 'Special Guest' | 'Keynote Speaker' | 'Guest of Honour' | 'Panelist' | 'Industry Leader' | 'Speaker' | 'Moderator';
  specialRole?: 'Opening Prayer' | 'Interfaith Safety Prayer' | 'Closing Prayer' | string;
  publicVisibility?: 'PUBLIC' | 'INTERNAL_ONLY';
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
  | 'Memoir Challenge'
  | 'Memo Challenge' 
  | 'Book Launch' 
  | 'Exhibition' 
  | 'Networking' 
  | 'Sky Party' 
  | 'Investment'
  | 'Other'
  | 'Plenary Session'
  | 'Challenge Session'
  | 'Investment Panel'
  | 'Technical Masterclass'
  | 'Networking Reception';

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

export type MemoirSubmission = MemoSubmission;

export interface BookInfo {
  id: string;
  title: string;
  author: string;
  subtitle?: string;
  description: string;
  coverImagePlaceholder: string;
  coverImageUrl?: string;
  authorPhotoUrl?: string;
  authorCredentials?: string[];
  authorBio?: string;
  launchTime?: string;
  purchaseLink?: string; // Internal or external
  hasSigning?: boolean;
  publisher?: string;
  format?: string;
  isbn?: string;
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
  positionId?: string;
  packageId?: string;
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
  companyName?: string;
  orderNumber?: string;
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
  | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X'
  | 'Y' | 'Z';

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
  | 'CHRISTIAN_LEADERS'
  | 'MUSLIM_LEADERS'
  | 'MEDIA'
  | 'INVESTORS'
  | 'TRAVEL_AND_TOURISM'
  | 'EMERGENCY_AND_RESCUE'
  | 'SECURITY'
  | 'TRANSPORT'
  | 'PASSENGERS_AND_ADVOCACY'
  | 'YOUTH_AND_FUTURE_AVIATORS'
  | 'FAMILIES_AND_PUBLIC'
  | 'OTHER';

export type InvitationStatus =
  | 'PROPOSED'
  | 'INVITATION TO BE SENT'
  | 'INVITED'
  | 'PENDING RESPONSE'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CONFIRMED'
  | 'WITHDRAWN'
  | 'RESEARCH CANDIDATE'
  | 'PROPOSED INVITEE'
  | 'INVITATION SENT'
  | 'ACKNOWLEDGED'
  | 'INTERESTED'
  | 'NO RESPONSE'
  | 'ARCHIVED';

export type StakeholderStatus = InvitationStatus;

export type SummitEventRole =
  | 'OPENING PRAYER'
  | 'CLOSING PRAYER'
  | 'INTERFAITH SAFETY PRAYER'
  | 'GOODWILL MESSAGE'
  | 'SPECIAL GUEST'
  | 'PATRON'
  | 'ADVISER'
  | 'SAFETY ADVOCATE'
  | 'INVITED GUEST'
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
  description?: string;
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
  assignedTopic?: string;
  assignedAssignment?: string;
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
  gmailDraftUrl?: string;
  mailtoUrl?: string;
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

// ============================================================
// RSVP & ATTENDANCE CONFIRMATION ENGINE TYPES
// ============================================================

export type RSVPStatus =
  | 'INVITED'
  | 'LETTER_SENT'
  | 'RSVP_PENDING'
  | 'CONFIRMED'
  | 'DECLINED'
  | 'TENTATIVE'
  | 'REPRESENTATIVE_NOMINATED'
  | 'NEEDS_INFORMATION'
  | 'ATTENDED'
  | 'NO_SHOW';

export type AttendanceOption =
  | 'I_WILL_ATTEND'
  | 'I_WILL_ATTEND_WITH_REPRESENTATIVE'
  | 'I_AM_TENTATIVE'
  | 'I_AM_UNABLE_TO_ATTEND'
  | 'WILL_ATTEND'
  | 'SEND_REPRESENTATIVE'
  | 'CANNOT_ATTEND'
  | 'NEED_MORE_INFO';

export interface RepresentativeDetails {
  fullName: string;
  position?: string;
  designation?: string;
  organisation?: string;
  email: string;
  phone: string;
}

export interface RSVPRecord {
  id: string;
  confirmationRef: string;
  invitationRef?: string;
  invitationNumber?: string;
  inviteeId?: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName: string;
  organisation: string;
  position: string;
  designation?: string;
  email: string;
  phone: string;
  attendanceOption: AttendanceOption;
  rsvpStatus: RSVPStatus;
  representative?: RepresentativeDetails;
  accessibilityRequirement?: string;
  specialRequirements?: string;
  dietary?: string;
  protocolNotes?: string;
  additionalNotes?: string;
  consentConfirmed: boolean;
  submittedAt: string;
  emailDeliveryStatus: 'NOT_CONFIGURED_STORED' | 'QUEUED' | 'SENT' | 'FAILED';
  updatedAt?: string;
  adminNotes?: string;
  category?: StakeholderCategory | string;
  protocolTier?: string;
}

export type SummitSector =
  | 'Aviation'
  | 'Government'
  | 'Regulatory'
  | 'Security'
  | 'Emergency Services'
  | 'Transport'
  | 'Finance'
  | 'Banking'
  | 'Insurance'
  | 'Oil & Gas'
  | 'Telecoms'
  | 'Technology'
  | 'Manufacturing'
  | 'Logistics'
  | 'Healthcare'
  | 'Education'
  | 'Faith'
  | 'Media'
  | 'Investment'
  | 'Hospitality'
  | 'Real Estate'
  | 'Legal'
  | 'Professional Services'
  | 'NGO/Civil Society'
  | 'Entertainment'
  | 'Sports'
  | 'Agriculture'
  | 'Airports'
  | 'Airlines'
  | 'Air Traffic Management'
  | 'Aviation Training'
  | 'Road Safety'
  | 'Banking & Finance'
  | 'Telecommunications'
  | 'Religious Organisations'
  | 'Professional Bodies'
  | 'Investors'
  | 'Tourism'
  | 'State Government'
  | 'Local Government'
  | 'International Organisations'
  | 'NGOs'
  | 'Community Organisations'
  | 'Other';

export type SummitCategory =
  | 'Patron'
  | 'VVIP'
  | 'VIP'
  | 'Government Official'
  | 'Regulator'
  | 'Aviation Executive'
  | 'Airline Representative'
  | 'Airport Representative'
  | 'ATC/Airspace'
  | 'Safety Professional'
  | 'Security'
  | 'Emergency Service'
  | 'Sponsor'
  | 'Partner'
  | 'Media'
  | 'Speaker'
  | 'Panellist'
  | 'Moderator'
  | 'Exhibitor'
  | 'Vendor'
  | 'Delegate'
  | 'Observer'
  | 'Guest'
  | 'Institutional'
  | 'Special Invite'
  | 'Airline Executive'
  | 'Airport Executive'
  | 'ATC / ATM Professional'
  | 'Aviation Safety Professional'
  | 'Pilot'
  | 'Engineer'
  | 'Cabin Crew'
  | 'Dispatcher'
  | 'Aviation Trainer'
  | 'Security Organisation'
  | 'Business Leader'
  | 'Investor'
  | 'Academic'
  | 'Religious Leader'
  | 'Traditional / Community Leader'
  | 'Professional Association'
  | 'NGO Representative'
  | 'Technology Leader'
  | 'Legal Professional'
  | 'Healthcare Professional'
  | 'Logistics Professional'
  | 'Hospitality Representative'
  | 'Student / Young Professional'
  | 'Other';

export type InvitationType =
  | 'VIP'
  | 'VVIP'
  | 'OFFICIAL'
  | 'Official'
  | 'SPEAKER'
  | 'Speaker'
  | 'PANELLIST'
  | 'Panellist'
  | 'MODERATOR'
  | 'Moderator'
  | 'SPONSOR'
  | 'Sponsor'
  | 'PARTNER'
  | 'Partner'
  | 'EXHIBITOR'
  | 'Exhibitor'
  | 'MEDIA'
  | 'Media'
  | 'GUEST'
  | 'Guest'
  | 'OBSERVER'
  | 'Observer'
  | 'DELEGATE'
  | 'Delegate'
  | 'INSTITUTIONAL'
  | 'Institutional'
  | 'SPECIAL INVITE'
  | 'Special Invite'
  | 'OTHER'
  | 'Other';

export type MasterInvitationStatus =
  | 'DRAFT'
  | 'APPROVED'
  | 'READY TO SEND'
  | 'SENT'
  | 'DELIVERED'
  | 'VIEWED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'TENTATIVE'
  | 'CONFIRMED'
  | 'ATTENDED'
  | 'CANCELLED';

export type InvitationPurpose =
  | 'Summit Delegate'
  | 'Keynote / Speaker'
  | 'Panel Participation'
  | 'Government Representation'
  | 'Regulatory Representation'
  | 'Strategic Partner'
  | 'Sponsor'
  | 'Media'
  | 'Industry Stakeholder'
  | 'Community Stakeholder'
  | 'Special Guest'
  | 'Other';

export type PreferredContactMethod = 
  | 'EMAIL' 
  | 'PHONE' 
  | 'WHATSAPP' 
  | 'OFFICIAL_LETTER' 
  | 'OFFICIAL_DISPATCH' 
  | 'COURIER' 
  | 'ASSISTANT';

export type RelationshipClassification = 
  | 'HEAD_OF_STATE'
  | 'MINISTER_GOVERNOR'
  | 'CHIEF_EXECUTIVE'
  | 'BOARD_MEMBER'
  | 'DIRECTOR_GENERAL'
  | 'COMMANDANT'
  | 'AMBASSADOR_DIPLOMAT'
  | 'COMMISSIONER'
  | 'INDUSTRY_LEADER'
  | 'ACADEMIC_FELLOW'
  | 'MEDIA_PRINCIPAL'
  | 'PRIMARY_CONTACT' 
  | 'DECISION_MAKER' 
  | 'TECHNICAL_LEAD' 
  | 'PROTOCOL_LIAISON' 
  | 'EXECUTIVE' 
  | 'REPRESENTATIVE' 
  | 'DELEGATE_PARTICIPANT'
  | 'SPECIAL_GUEST'
  | 'OTHER';

export interface MasterPerson {
  id: string;
  stakeholderId?: string;
  personId?: string;
  organisationId?: string;
  referenceNumber: string;
  fullName?: string;
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  designation: string;
  position?: string;
  organisation: string;
  organisationName?: string;
  organisationType?: string;
  department?: string;
  email: string;
  phone: string;
  altPhone?: string;
  alternativePhone?: string;
  address?: string;
  country: string;
  state?: string;
  city?: string;
  sector: SummitSector;
  category: SummitCategory;
  stakeholderCategory?: SummitCategory;
  subcategory?: string;
  preferredContactMethod?: PreferredContactMethod;
  relationshipClassification?: RelationshipClassification;
  notes?: string;
  activeStatus?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MasterOrganisation {
  id: string;
  organisationId?: string;
  name: string;
  type: string;
  sector: SummitSector;
  country: string;
  state?: string;
  city?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  activeStatus?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MasterInvitation {
  id: string;
  invitationId?: string;
  invitationReference?: string;
  invitationNumber: string;
  personId: string;
  stakeholderId?: string;
  orgId: string;
  organisationId?: string;
  sector: SummitSector;
  category: SummitCategory;
  invitationType: InvitationType;
  invitationPurpose?: InvitationPurpose;
  responsibleOfficer?: string;
  invitationDate?: string;
  eventDate?: string;
  currentStatus?: MasterInvitationStatus;
  invitationStatus: MasterInvitationStatus;
  internalNotes?: string;
  auditReference?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export type CorrespondenceType =
  | 'General Corporate Correspondence'
  | 'Aviation Safety Summit Correspondence'
  | 'Official Invitation Letter'
  | 'Appointment Letter'
  | 'Committee Letter'
  | 'Government / Regulatory Letter'
  | 'Vendor / Partner Letter'
  | 'Official Notice'
  | 'General Secretariat Letter';

export type CorrespondenceStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'PRINT_READY'
  | 'ARCHIVED'
  | 'CANCELLED';

export interface LetterheadProfile {
  id: string;
  name: string;
  purpose: string;
  legalOrganisationName: string;
  displayName: string;
  rcNumber: string;
  rcNumberX: number; // default 29.4
  rcNumberY: number; // default 28.1
  tagline: string;
  address: string;
  telephone: string;
  mobile: string;
  email: string;
  website: string;
  logoUrl?: string;
  headerText: string;
  footerText: string;
  referencePrefix: string;
  referenceFormat: string;
  dateFormat: string;
  defaultSignatoryId?: string;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CorrespondenceTemplate {
  id: string;
  title: string;
  correspondenceType: CorrespondenceType;
  subjectTemplate: string;
  bodyTemplate: string;
  salutationTemplate: string;
  closingTemplate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorrespondenceDocumentVersion {
  versionNumber: number;
  subject: string;
  body: string;
  updatedAt: string;
  updatedBy: string;
  changeReason?: string;
}

export interface CorrespondenceDocument {
  id: string;
  documentNumber: string;
  profileId: string;
  correspondenceType: CorrespondenceType;
  templateId?: string;
  reference: string;
  date: string;
  recipientName: string;
  recipientOrganisation: string;
  recipientAddress: string;
  attention?: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
  signatoryId: string;
  attachments?: string;
  cc?: string;
  status: CorrespondenceStatus;
  currentVersion: number;
  versions: CorrespondenceDocumentVersion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalComment?: string;
}

export interface CorrespondenceSignatory {
  id: string;
  name: string;
  title: string;
  organisation: string;
  signatureUrl?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
}

export type VolunteerDepartment =
  | 'Protocol'
  | 'Registration'
  | 'Guest Services'
  | 'VIP/VVIP Ushering'
  | 'Logistics & Venue Operations'
  | 'Media & Publicity'
  | 'IT & Digital Support'
  | 'Documentation & Rapporteur'
  | 'Programme Support'
  | 'Hospitality & Refreshments'
  | 'Airport & Transport Coordination'
  | 'Emergency & Safety Support'
  | 'General Volunteer Support'
  | 'Other';

export type VolunteerApplicantType = 
  | 'Individual Volunteer'
  | 'Corporate-Sponsored Volunteer'
  | 'Organisation-Nominated Volunteer';

export type NatureOfVolunteerSupport = 
  | 'Sponsored Volunteer'
  | 'Nominated Volunteer'
  | 'Deployed Staff Member'
  | 'Corporate Volunteer Team'
  | 'Other';

export interface VolunteerApplication {
  id: string;
  reference: string;
  applicantType: VolunteerApplicantType;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  dobOrAgeGroup: string;
  gender?: string;
  country: string;
  state: string;
  city: string;
  
  // Contact
  email: string;
  phone: string;
  altPhone?: string;
  address: string;

  // Professional / Educational
  occupation: string;
  organisation?: string;
  profession?: string;
  educationStatus: 'Student' | 'Graduate' | 'Employed Professional' | 'Self-Employed' | 'Other';
  qualifications?: string;
  skills: string;

  // Corporate / Sponsoring / Nominating Organisation Details (When applicantType !== 'Individual Volunteer')
  sponsoringOrgName?: string;
  sponsoringOrgType?: string;
  sponsoringOrgSector?: string;
  sponsoringOrgAddress?: string;
  sponsoringOrgEmail?: string;
  sponsoringOrgPhone?: string;
  orgContactPersonName?: string;
  orgContactPersonPosition?: string;
  orgContactPersonEmail?: string;
  orgContactPersonPhone?: string;

  // Nature of Support / Deployment
  natureOfSupport?: NatureOfVolunteerSupport;
  sponsoredVolunteersCount?: number;
  supportDescription?: string;
  corporateMessage?: string;
  specialRequirements?: string;

  // Volunteer Interest
  preferredDepartment: VolunteerDepartment;
  secondaryDepartment?: VolunteerDepartment;
  experience?: string;
  aviationExperience?: string;
  languages?: string;
  specialSkills?: string;
  availability: 'Full Summit (All Days)' | 'Summit Day Only (17 Nov)' | 'Pre-Summit & Summit Days' | 'Specific Shifts Only';
  preferredPeriod?: string;
  preferredShift?: 'Morning Shift' | 'Afternoon / Evening Shift' | 'Full Day' | 'Flexible';
  motivation: string;
  additionalInfo?: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyContactPhone: string;

  // Consent & Status
  consentConfirmed: boolean;
  status: 'SUBMITTED';
  createdAt: string;
  updatedAt: string;
  source: 'PUBLIC_WEB';
  auditReference: string;
}

// ============================================================
// VOLUNTEER PERFORMANCE, COMMENDATION, CORRECTIVE REPORT & CERTIFICATION
// ============================================================

export type VolunteerWorkMode =
  | 'ON-SITE — LAGOS'
  | 'REMOTE — ANYWHERE'
  | 'HYBRID'
  | 'FLEXIBLE'
  | 'TO BE DETERMINED';

export type PerformanceEvaluationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'APPROVED'
  | 'FINAL'
  | 'RETURNED_FOR_CORRECTION';

export type PerformanceGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'E';

export type PerformanceFinalOutcome =
  | 'COMMENDED'
  | 'CERTIFICATE ISSUED'
  | 'APPRECIATION'
  | 'SATISFACTORY SERVICE'
  | 'IMPROVEMENT REQUIRED'
  | 'CORRECTIVE ACTION'
  | 'UNSATISFACTORY SERVICE'
  | 'REVIEW REQUIRED'
  | 'NO FORMAL ACTION';

export type FutureEventConsideration =
  | 'ELIGIBLE FOR FUTURE CONSIDERATION'
  | 'RECOMMENDED FOR FUTURE CONSIDERATION'
  | 'PRIOR SERVICE RECOGNITION'
  | 'ORGANISATION PARTNERSHIP CONTINUATION'
  | 'REVIEW REQUIRED BEFORE FUTURE ASSIGNMENT'
  | 'NOT CURRENTLY RECOMMENDED FOR FUTURE ASSIGNMENT'
  | 'NO DECISION RECORDED';

export interface PerformanceCriteriaScores {
  attendanceScore: number;         // 0-10 (On-site availability or agreed schedule)
  punctualityScore: number;        // 0-10 (Timeliness / deadline compliance)
  reliabilityScore: number;        // 0-10 (Consistency of commitments)
  teamworkScore: number;           // 0-10 (Collaboration with team)
  communicationScore: number;      // 0-10 (Digital/verbal responsiveness)
  professionalismScore: number;    // 0-10 (Conduct and representation)
  taskCompletionScore: number;     // 0-10 (Quality of assigned deliverables)
  initiativeScore: number;         // 0-10 (Proactivity)
  safetyComplianceScore: number;   // 0-10 (Aviation safety/event protocols)
  adaptabilityScore: number;       // 0-10 (Dynamic context agility)
}

export interface VolunteerPerformanceRecord {
  id: string;
  performanceId: string;
  volunteerApplicationId: string;
  volunteerReference: string;
  personId?: string;
  organisationId?: string;
  organisationName?: string;
  stakeholderId?: string;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone: string;
  applicantType: VolunteerApplicantType;
  summitYear: number;
  eventId: string;
  eventName: string;
  department: string;
  assignment: string;
  workMode: VolunteerWorkMode;
  supervisorId: string;
  supervisorName: string;
  supervisorTitle?: string;
  evaluationPeriod: string;
  evaluationStatus: PerformanceEvaluationStatus;
  
  // Scoring & Grading
  scores: PerformanceCriteriaScores;
  totalScore: number;      // 0-100
  percentage: number;      // 0-100
  grade: PerformanceGrade; // A+, A, B, C, D, E
  
  // Evidence & Observations
  evidenceNotes?: string;
  deliverablesReference?: string;
  attendanceRecordSummary?: string;
  supervisorObservations?: string;
  incidentReference?: string;
  
  // Narrative Comments
  supervisorComments: string;
  volunteerComments?: string;
  reviewerComments?: string;
  approvalNotes?: string;
  
  // Outcome & Future Consideration
  finalOutcome: PerformanceFinalOutcome;
  futureEventConsideration: FutureEventConsideration;
  considerForNextYear: boolean;
  nextYearRecommendationNotes?: string;
  
  // Governance & Review Lifecycle
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  updatedBy?: string;
  updatedAt: string;
  auditReference: string;
  
  // Versioning
  isRevision?: boolean;
  revisionReason?: string;
  originalRecordId?: string;
}

export type CommendationType =
  | 'COMMENDATION'
  | 'OUTSTANDING SERVICE'
  | 'EXCELLENT SERVICE'
  | 'SPECIAL CONTRIBUTION'
  | 'LEADERSHIP RECOGNITION'
  | 'SERVICE APPRECIATION'
  | 'TEAM CONTRIBUTION'
  | 'DIGITAL/REMOTE CONTRIBUTION'
  | 'SAFETY CONTRIBUTION'
  | 'OTHER';

export interface VolunteerCommendation {
  id: string;
  commendationId: string;
  volunteerReference: string;
  volunteerApplicationId: string;
  volunteerName: string;
  organisationId?: string;
  organisationName?: string;
  applicantType: VolunteerApplicantType;
  summitYear: number;
  eventId: string;
  department: string;
  assignment: string;
  commendationType: CommendationType;
  title: string;
  reason: string;
  supportingEvidence: string;
  issuedBy: string;
  issuedByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  issueDate: string;
  status: 'DRAFT' | 'APPROVED' | 'ISSUED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  auditReference: string;
}

export type CorrectiveIssueCategory =
  | 'PERFORMANCE ADVISORY'
  | 'IMPROVEMENT NOTICE'
  | 'FORMAL REPRIMAND'
  | 'UNSATISFACTORY SERVICE RECORD'
  | 'OTHER CORRECTIVE ACTION';

export type CorrectiveReportStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'RESPONSE_SUBMITTED'
  | 'REVIEWED'
  | 'RESOLVED'
  | 'ESCALATED'
  | 'ARCHIVED';

export interface VolunteerCorrectiveReport {
  id: string;
  correctiveReportId: string;
  volunteerReference: string;
  volunteerApplicationId: string;
  personId?: string;
  organisationId?: string;
  organisationName?: string;
  volunteerName: string;
  summitYear: number;
  eventId: string;
  department: string;
  assignment: string;
  date: string;
  issueCategory: CorrectiveIssueCategory;
  title: string;
  factualDescription: string;
  relevantEvidence: string;
  operationalImpact: string;
  expectedImprovement: string;
  responseRequired: boolean;
  responseDeadline?: string;
  
  // Volunteer Right-to-Respond
  volunteerResponse?: {
    responseType: 'ACKNOWLEDGEMENT' | 'EXPLANATION' | 'DISAGREEMENT' | 'CLARIFICATION';
    statement: string;
    supportingInformation?: string;
    submittedAt: string;
    submittedBy: string;
  };
  
  supervisorRecommendation: string;
  reviewerDecision?: string;
  finalStatus: CorrectiveReportStatus;
  
  issuedBy: string;
  issuedByName?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  auditReference: string;
}

export type CertificateType =
  | 'Certificate of Volunteer Service'
  | 'Certificate of Appreciation'
  | 'Certificate of Outstanding Volunteer Service'
  | 'Certificate of Special Contribution'
  | 'Certificate of Leadership Service'
  | 'Organisation Certificate of Appreciation'
  | 'Other authorised certificate type';

export type CertificateStatus = 'ISSUED' | 'REVISED' | 'REISSUED' | 'REVOKED';

export interface VolunteerCertificate {
  id: string;
  certificateNumber: string; // e.g. ASS-CERT-2026-00001
  certificateType: CertificateType;
  summitYear: number;
  eventId: string;
  eventName: string;
  summitTheme: string;
  
  // Recipient info (Individual or Organisation)
  isOrganisationCertificate: boolean;
  recipientName: string;
  volunteerReference?: string;
  volunteerApplicationId?: string;
  organisationId?: string;
  organisationName?: string;
  department?: string;
  assignment?: string;
  workMode?: VolunteerWorkMode;
  servicePeriod?: string;
  
  // Corporate / Organisation specific metrics
  verifiedVolunteersCount?: number;
  organisationSector?: string;
  contributionDescription?: string;
  
  // Signatory & Issuance Details
  signatoryId: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryOrg: string;
  issueDate: string;
  verificationCode: string; // Secure token / verification reference
  qrVerificationUrl?: string;
  status: CertificateStatus;
  
  // Reissue / Revision controls
  reissueReason?: string;
  previousCertificateNumber?: string;
  supersededBy?: string;
  
  issuedBy: string;
  issuedByName?: string;
  createdAt: string;
  updatedAt: string;
  auditReference: string;
}

// ============================================================
// SOCIAL MEDIA SHARING & VOLUNTEER REFERRAL TRACKING TYPES
// ============================================================

export type SocialShareChannel = 
  | 'whatsapp' 
  | 'facebook' 
  | 'twitter' 
  | 'linkedin' 
  | 'telegram' 
  | 'email' 
  | 'copy' 
  | 'native' 
  | 'qr';

export type ShareTargetType = 
  | 'SUMMIT' 
  | 'VOLUNTEER' 
  | 'ORGANISATION' 
  | 'CERTIFICATE';

export interface ShareAnalyticsEvent {
  id: string;
  eventType: 
    | 'SUMMIT_SHARE_CLICK' 
    | 'VOLUNTEER_SHARE_CLICK' 
    | 'ORGANISATION_SHARE_CLICK' 
    | 'COPY_LINK' 
    | 'NATIVE_SHARE' 
    | 'QR_DISPLAY' 
    | 'REFERRAL_LANDING';
  channel?: SocialShareChannel | string;
  targetUrl: string;
  referralToken?: string;
  landingPage?: string;
  deviceCategory?: 'desktop' | 'mobile' | 'tablet';
  timestamp: string;
  source?: string;
}

export interface ReferralRecord {
  token: string;
  targetType: 'VOLUNTEER' | 'SUMMIT';
  generatedAt: string;
  landingCount: number;
  applicationCount: number;
  lastLandingAt?: string;
}

export interface PublicVerifiedCertificate {
  certificateNumber: string;
  recipientName: string;
  certificateType: string;
  summitYear: number;
  eventName: string;
  summitTheme: string;
  department?: string;
  isOrganisationCertificate: boolean;
  organisationName?: string;
  verifiedVolunteersCount?: number;
  signatoryName: string;
  signatoryTitle: string;
  signatoryOrg: string;
  issueDate: string;
  status: CertificateStatus;
}

