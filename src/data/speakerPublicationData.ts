/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpeakerKnowledgeRecord {
  id: string;
  speakerName: string;
  organisation: string;
  position: string;
  photographUrl: string;
  logoUrl: string;
  approvedTopic: string;
  session: string;
  presentationUrl?: string; // Google Slides link
  audioFileName?: string;
  originalAudioUrl?: string;
  editedAudioUrl?: string;
  transcript: string;
  editedTranscript: string;
  handbookTitle: string;
  handbookStatus: 'DRAFT' | 'EDITING' | 'SPEAKER_REVIEW' | 'APPROVED' | 'PRINT_PRODUCTION' | 'PUBLISHED' | 'ARCHIVED';
  podcastTitle: string;
  podcastStatus: 'DRAFT' | 'EDITORIAL_REVIEW' | 'SPEAKER_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  approvalStatus: {
    photo: boolean;
    bio: boolean;
    topic: boolean;
    transcript: boolean;
    handbook: boolean;
    podcast: boolean;
    cover: boolean;
    publication: boolean;
    commercialPermission: boolean;
  };
  rightsAndConsent: {
    recordingPermission: boolean;
    transcriptApproval: boolean;
    publicationApproval: boolean;
    photoApproval: boolean;
    logoUsageStatus: boolean;
    podcastApproval: boolean;
    commercialPublicationApproval: boolean;
  };
  isbn?: string;
  publicationDate: string;
  pageCount: number;
  softCopyPrice: number;
  hardCopyPrice: number;
  podcastEpisodeNumber: number;
  podcastDescription: string;
  showNotes: string[];
  keyTakeaways: string[];
  category: string;
}

export const INITIAL_SPEAKER_RECORDS: SpeakerKnowledgeRecord[] = [
  {
    id: 'skr-1',
    speakerName: 'Capt. Chris O. Najomo',
    organisation: 'Nigeria Civil Aviation Authority (NCAA)',
    position: 'Acting Director General Civil Aviation',
    photographUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    approvedTopic: 'Everybody Is Involved in Aviation Safety: The Shared Regulatory Burden',
    session: 'Keynote Plenary Session 1',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSampleNCAA/embed',
    audioFileName: 'Capt_Najomo_Keynote_2026.mp3',
    originalAudioUrl: '#',
    editedAudioUrl: '#',
    transcript: 'Safety in civil aviation is not merely the domain of regulators or pilots. It is an unbroken chain connecting every passenger, mechanic, controller, and corporate executive across African skies.',
    editedTranscript: 'Safety in civil aviation is not merely the domain of regulators or pilots. It is an unbroken chain connecting every passenger, mechanic, air traffic controller, and corporate executive across African skies.',
    handbookTitle: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
    handbookStatus: 'PUBLISHED',
    podcastTitle: 'Episode 1: The Chain of Shared Responsibility in African Aviation',
    podcastStatus: 'PUBLISHED',
    approvalStatus: {
      photo: true,
      bio: true,
      topic: true,
      transcript: true,
      handbook: true,
      podcast: true,
      cover: true,
      publication: true,
      commercialPermission: true
    },
    rightsAndConsent: {
      recordingPermission: true,
      transcriptApproval: true,
      publicationApproval: true,
      photoApproval: true,
      logoUsageStatus: true,
      podcastApproval: true,
      commercialPublicationApproval: true
    },
    isbn: '978-978-987-001-1',
    publicationDate: '2026-09-01',
    pageCount: 142,
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    podcastEpisodeNumber: 1,
    podcastDescription: 'An authoritative exploration of how safety in civil aviation is an unbroken chain connecting every stakeholder.',
    showNotes: [
      '00:00 - Introduction to Shared Responsibility',
      '12:30 - NCAA Regulatory Oversight and Unannounced Audits',
      '28:45 - The Human Element in Air Traffic Control',
      '45:15 - Building a Non-Punitive Safety Culture across African Airlines'
    ],
    keyTakeaways: [
      'Safety is everyone\'s responsibility, not just the regulator\'s.',
      'Non-punitive reporting fosters incident transparency.',
      'Regional cooperation across AFCAC member states is paramount.'
    ],
    category: 'AVIATION_SAFETY'
  },
  {
    id: 'skr-2',
    speakerName: 'Capt. Alex Sabundu Badeh Jnr.',
    organisation: 'Nigerian Safety Investigation Bureau (NSIB)',
    position: 'Director General / CEO',
    photographUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    approvedTopic: 'Safety Before the Accident: Proactive Investigation & Multimodal Synergy',
    session: 'Plenary Session 2: Accident Investigation & Prevention',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSampleNSIB/embed',
    audioFileName: 'Capt_Badeh_NSIB_2026.mp3',
    originalAudioUrl: '#',
    editedAudioUrl: '#',
    transcript: 'Every accident investigation is a sacred obligation to the travelling public. We investigate not to apportion blame, but to ensure that the circumstances are never repeated.',
    editedTranscript: 'Every accident investigation is a sacred obligation to the travelling public. We investigate not to apportion blame, but to ensure that the circumstances are never repeated.',
    handbookTitle: 'SAFETY BEFORE THE ACCIDENT',
    handbookStatus: 'PUBLISHED',
    podcastTitle: 'Episode 2: Multimodal Safety Investigation & Zero Accident Targets',
    podcastStatus: 'PUBLISHED',
    approvalStatus: {
      photo: true,
      bio: true,
      topic: true,
      transcript: true,
      handbook: true,
      podcast: true,
      cover: true,
      publication: true,
      commercialPermission: true
    },
    rightsAndConsent: {
      recordingPermission: true,
      transcriptApproval: true,
      publicationApproval: true,
      photoApproval: true,
      logoUsageStatus: true,
      podcastApproval: true,
      commercialPublicationApproval: true
    },
    isbn: '978-978-987-002-8',
    publicationDate: '2026-09-01',
    pageCount: 168,
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    podcastEpisodeNumber: 2,
    podcastDescription: 'Transforming safety recommendations into national law and strengthening multimodal incident reporting.',
    showNotes: [
      '00:00 - The Philosophy of Non-Punitive Investigation',
      '15:20 - Decoding Flight Data Recorders and Cockpit Voice Logs',
      '34:10 - Cross-Modal Synergy: Aviation, Rail and Maritime Safety'
    ],
    keyTakeaways: [
      'Investigations must be independent and blameless.',
      'Safety recommendations must be implemented without bureaucratic delay.',
      'Multimodal intelligence sharing prevents recurrence.'
    ],
    category: 'REGULATION'
  },
  {
    id: 'skr-3',
    speakerName: 'Engr. Akin Olateru',
    organisation: 'Aviation Safety Advisory Council',
    position: 'Principal Aviation Consultant & Former DG NSIB',
    photographUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    approvedTopic: 'The Human Factor and Organizational Culture in Airline Safety',
    session: 'Technical Session 3: Human Factors & CRM',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSampleOlateru/embed',
    audioFileName: 'Engr_Olateru_HumanFactor_2026.mp3',
    originalAudioUrl: '#',
    editedAudioUrl: '#',
    transcript: 'Machines are engineered for precision, but humans operate them through perception and judgment. Understanding fatigue and cognitive overload is paramount.',
    editedTranscript: 'Machines are engineered for precision, but humans operate them through perception and judgment. Understanding fatigue and cognitive overload is paramount.',
    handbookTitle: 'THE HUMAN FACTOR IN AVIATION SAFETY',
    handbookStatus: 'APPROVED',
    podcastTitle: 'Episode 3: Fatigue, Cognitive Overload & Cockpit Resource Management',
    podcastStatus: 'SCHEDULED',
    approvalStatus: {
      photo: true,
      bio: true,
      topic: true,
      transcript: true,
      handbook: true,
      podcast: true,
      cover: true,
      publication: true,
      commercialPermission: true
    },
    rightsAndConsent: {
      recordingPermission: true,
      transcriptApproval: true,
      publicationApproval: true,
      photoApproval: true,
      logoUsageStatus: true,
      podcastApproval: true,
      commercialPublicationApproval: true
    },
    isbn: '978-978-987-003-5',
    publicationDate: '2026-09-05',
    pageCount: 156,
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    podcastEpisodeNumber: 3,
    podcastDescription: 'Examining human psychology, fatigue risk management systems, and situational awareness in high-pressure environments.',
    showNotes: [
      '00:00 - Introduction to Human Factors',
      '18:40 - Cockpit Resource Management (CRM) in Crisis',
      '39:10 - Fatigue Risk Management Systems (FRMS) for Flight Crews'
    ],
    keyTakeaways: [
      'Human error is often a symptom of deeper system design flaws.',
      'CRM training must be continuous and practical.',
      'Fatigue management protects both crew and passengers.'
    ],
    category: 'HUMAN_FACTORS'
  },
  {
    id: 'skr-4',
    speakerName: 'Capt. Dapo Olumide',
    organisation: 'Nigerian Airways / Airline Executives Forum',
    position: 'Veteran Aviation Executive & Pilot',
    photographUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    approvedTopic: 'Safety Is Everybody\'s Business: Boardroom Accountability & Financial Resilience',
    session: 'Executive Plenary Session 4',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSampleOlumide/embed',
    audioFileName: 'Capt_Olumide_Boardroom_2026.mp3',
    originalAudioUrl: '#',
    editedAudioUrl: '#',
    transcript: 'Safety culture starts in the boardroom. If financial profitability overrides safety margins, disaster is only a matter of time.',
    editedTranscript: 'Safety culture starts in the boardroom. If financial profitability overrides safety margins, disaster is only a matter of time.',
    handbookTitle: 'SAFETY IS EVERYBODY\'S BUSINESS',
    handbookStatus: 'APPROVED',
    podcastTitle: 'Episode 4: Boardroom Accountability & Airline Financial Health',
    podcastStatus: 'SCHEDULED',
    approvalStatus: {
      photo: true,
      bio: true,
      topic: true,
      transcript: true,
      handbook: true,
      podcast: true,
      cover: true,
      publication: true,
      commercialPermission: true
    },
    rightsAndConsent: {
      recordingPermission: true,
      transcriptApproval: true,
      publicationApproval: true,
      photoApproval: true,
      logoUsageStatus: true,
      podcastApproval: true,
      commercialPublicationApproval: true
    },
    isbn: '978-978-987-006-6',
    publicationDate: '2026-09-08',
    pageCount: 134,
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    podcastEpisodeNumber: 4,
    podcastDescription: 'Guiding airline CEOs and board directors on embedding safety culture from the top down.',
    showNotes: [
      '00:00 - The Boardroom Responsibility for Airworthiness',
      '21:15 - Just Culture vs. Blame Culture in Commercial Airlines',
      '42:30 - Allocating Capital for Proactive Maintenance & Training'
    ],
    keyTakeaways: [
      'Safety investments yield direct returns in insurance and reliability.',
      'CEOs must personally champion safety management systems.',
      'Transparent reporting prevents catastrophic financial ruin.'
    ],
    category: 'LEADERSHIP'
  }
];
