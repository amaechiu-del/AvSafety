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
  specialRole?: string;
  publicVisibility?: 'PUBLIC' | 'INTERNAL_ONLY';
}

export const INITIAL_SPEAKER_RECORDS: SpeakerKnowledgeRecord[] = [
  {
    id: 'skr-shettima',
    speakerName: 'H.E. Sen. Kashim Shettima, GCON',
    organisation: 'Federal Republic of Nigeria (The Presidency)',
    position: 'Vice President of the Federal Republic of Nigeria',
    photographUrl: 'https://statehouse.gov.ng/wp-content/uploads/2023/06/VP-Shettima-Portrait.jpg',
    logoUrl: 'https://statehouse.gov.ng/wp-content/uploads/2023/06/Nigeria-Seal.png',
    approvedTopic: 'Sovereign Imperatives for Aviation Safety: Airspace Integrity, Economic Stability & National Security',
    session: 'Summit Grand Opening Ceremony & Presidential Safety Address',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSamplePresidency/embed',
    audioFileName: 'VP_Shettima_Presidential_Address_2026.mp3',
    originalAudioUrl: '#',
    editedAudioUrl: '#',
    transcript: 'The prosperity of our nation travels on the wings of aviation. Every Nigerian and international guest flying through our airspace deserves absolute confidence in our safety ecosystem.',
    editedTranscript: 'The prosperity of our nation travels on the wings of aviation. Every Nigerian and international guest flying through our airspace deserves absolute confidence in our safety ecosystem. Aviation safety is national economic security.',
    handbookTitle: 'SOVEREIGN IMPERATIVES FOR NIGERIAN AIRSPACE SAFETY',
    handbookStatus: 'APPROVED',
    podcastTitle: 'Special Plenary: Sovereign Mandates for Aviation Resilience & Safety',
    podcastStatus: 'APPROVED',
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
    isbn: '978-978-987-000-0',
    publicationDate: '2026-11-17',
    pageCount: 168,
    softCopyPrice: 5000,
    hardCopyPrice: 12000,
    podcastEpisodeNumber: 0,
    podcastDescription: 'Official presidential address and policy imperatives steering the future of civil aviation safety in Nigeria and West Africa.',
    showNotes: [
      '00:00 - Sovereign Welcome and Opening Presidential Declaration',
      '10:15 - National Economic Council Priorities in Transport Safety',
      '22:40 - Sovereign Funding for Critical Radar and Aerodrome Surveillance',
      '35:50 - Multi-Agency Emergency Preparedness Protocols'
    ],
    keyTakeaways: [
      'Aviation safety directly underpins national sovereign security and investor trust.',
      'Sovereign support is guaranteed for independent regulatory enforcement without interference.',
      'Inter-modal transport integration will elevate Nigeria as West Africa’s premier air hub.'
    ],
    category: 'Sovereign Keynote',
    specialRole: 'Special Guest of Honour (Presiding)',
    publicVisibility: 'PUBLIC'
  },
  {
    id: 'skr-akpabio',
    speakerName: 'H.E. Sen. Godswill Obot Akpabio, GCON',
    organisation: 'Senate of the Federal Republic of Nigeria (10th National Assembly)',
    position: 'President of the Senate of the Federal Republic of Nigeria',
    photographUrl: 'https://nass.gov.ng/assets/images/senators/Akpabio.jpg',
    logoUrl: 'https://nass.gov.ng/assets/images/logo.png',
    approvedTopic: 'Legislative Imperatives for Aviation Safety: Statutory Independence, Infrastructure Appropriations & Sovereign Oversight',
    session: 'Summit Grand Opening Ceremony: Sovereign Legislative Keynote',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSampleSenate/embed',
    audioFileName: 'Senate_President_Akpabio_Keynote_2026.mp3',
    originalAudioUrl: '#',
    editedAudioUrl: '#',
    transcript: 'Air safety cannot be left to goodwill alone; it must be anchored in enforceable laws, independent regulators, and sustained public investment in critical safety technologies.',
    editedTranscript: 'Air safety cannot be left to goodwill alone; it must be anchored in enforceable laws, independent regulators, and sustained public investment in critical safety technologies. The 10th Senate guarantees ring-fenced budgetary oversight.',
    handbookTitle: 'PARLIAMENTARY MANDATES FOR AVIATION SAFETY & REVENUE RESILIENCE',
    handbookStatus: 'APPROVED',
    podcastTitle: 'Sovereign Legislative Keynote: Statutory Oversight & Airspace Appropriations',
    podcastStatus: 'APPROVED',
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
    isbn: '978-978-987-000-2',
    publicationDate: '2026-11-17',
    pageCount: 160,
    softCopyPrice: 5000,
    hardCopyPrice: 12000,
    podcastEpisodeNumber: 2,
    podcastDescription: 'Official legislative keynote detailing parliamentary support for civil aviation safety, regulatory independence, and budget allocations for air navigation systems.',
    showNotes: [
      '00:00 - Opening Legislative Declaration and Constitutional Mandate',
      '12:30 - Codifying ICAO SARPs and Cape Town Convention into Domestic Law',
      '25:10 - Ring-Fencing Capital Budgets for Airspace Radar and Runway Lighting',
      '38:40 - Public Accountability and Aviation Committee Oversight'
    ],
    keyTakeaways: [
      'Statutory independence of NCAA and NSIB is safeguarded against executive encroachment.',
      'Parliamentary appropriations will prioritize airport perimeter security and Category III ILS.',
      'Transparent oversight strengthens investor confidence in aircraft leasing and aerospace partnerships.'
    ],
    category: 'Sovereign Legislative Keynote',
    specialRole: 'Special Guest of Honour & Sovereign Legislative Keynote',
    publicVisibility: 'PUBLIC'
  },
  {
    id: 'skr-keyamo',
    speakerName: 'Barr. Festus Keyamo, SAN, CON, FCIArb (UK)',
    organisation: 'Federal Ministry of Aviation and Aerospace Development',
    position: 'Honourable Minister of Aviation and Aerospace Development',
    photographUrl: 'https://aviation.gov.ng/wp-content/uploads/2023/09/Keyamo.jpg',
    logoUrl: 'https://aviation.gov.ng/wp-content/uploads/2023/08/Coat_of_arms_of_Nigeria.svg',
    approvedTopic: 'The 5-Point Aviation Safety Roadmap: Regulatory Independence, Consumer Protection & Fleet Modernisation',
    session: 'Ministerial Keynote Plenary: Sovereign Mandates for Aviation Safety',
    presentationUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSampleMinistry/embed',
    audioFileName: 'Minister_Keyamo_Keynote_2026.mp3',
    originalAudioUrl: '#',
    editedAudioUrl: '#',
    transcript: 'Safety is the paramount compass of our sovereign aviation policy. We will never compromise safety for political expediency or commercial convenience.',
    editedTranscript: 'Safety is the paramount compass of our sovereign aviation policy. We will never compromise safety for political expediency or commercial convenience. The 5-point agenda places passenger lives above all.',
    handbookTitle: 'THE 5-POINT AVIATION SAFETY ROADMAP FOR NIGERIA',
    handbookStatus: 'APPROVED',
    podcastTitle: 'Ministerial Keynote: Institutional Reforms & Airspace Accountability',
    podcastStatus: 'APPROVED',
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
    isbn: '978-978-987-000-1',
    publicationDate: '2026-11-17',
    pageCount: 154,
    softCopyPrice: 5000,
    hardCopyPrice: 10000,
    podcastEpisodeNumber: 1,
    podcastDescription: 'Comprehensive ministerial presentation outlining regulatory independence, the Cape Town Convention, and domestic fleet recapitalization.',
    showNotes: [
      '00:00 - The 5-Point Aviation Safety Agenda',
      '14:20 - Regulatory Autonomy for NCAA and Accident Investigation via NSIB',
      '27:10 - Enforcing the Cape Town Convention for Aircraft Leasing',
      '41:30 - Airport Infrastructure Modernization and Airspace Surveillance'
    ],
    keyTakeaways: [
      'Zero tolerance for regulatory compromise across commercial and general aviation.',
      'Cape Town Convention practice direction guarantees global financier confidence.',
      'Sustained support for Nigerian domestic carriers under stringent safety standards.'
    ],
    category: 'Ministerial Keynote',
    specialRole: 'Official Host & Keynote Speaker',
    publicVisibility: 'PUBLIC'
  },
  {
    id: 'skr-1',
    speakerName: 'Capt. Chris O. Najomo',
    organisation: 'Nigeria Civil Aviation Authority (NCAA)',
    position: 'Acting Director General Civil Aviation',
    photographUrl: '',
    logoUrl: '',
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
    photographUrl: '',
    logoUrl: '',
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
    photographUrl: '',
    logoUrl: '',
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
    photographUrl: '',
    logoUrl: '',
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
  },
  {
    id: 'skr-rel-adeboye',
    speakerName: 'PASTOR E. A. ADEBOYE',
    organisation: 'The Redeemed Christian Church of God (RCCG)',
    position: 'General Overseer',
    photographUrl: '',
    logoUrl: '',
    approvedTopic: 'Opening Prayer / Interfaith Safety Prayer',
    session: 'National Traditional & Religious Leadership Safety Colloquium',
    transcript: '',
    editedTranscript: '',
    handbookTitle: '',
    approvalStatus: {
      photo: false,
      bio: false,
      topic: false,
      transcript: false,
      handbook: false,
      podcast: false,
      cover: false,
      publication: false,
      commercialPermission: false
    },
    publicationDate: '2026-11-17',
    pageCount: 0,
    softCopyPrice: 0,
    hardCopyPrice: 0,
    podcastEpisodeNumber: 0,
    podcastDescription: '',
    handbookStatus: 'DRAFT',
    podcastTitle: '',
    podcastStatus: 'DRAFT',
    rightsAndConsent: {
      recordingPermission: false,
      transcriptApproval: false,
      publicationApproval: false,
      photoApproval: false,
      logoUsageStatus: false,
      podcastApproval: false,
      commercialPublicationApproval: false
    },
    showNotes: [],
    keyTakeaways: [],
    category: 'FAITH_LEADERSHIP',
    specialRole: 'Opening Prayer',
    publicVisibility: 'PUBLIC'
  },
  {
    id: 'skr-rel-sultan',
    speakerName: 'H.E. ALHAJI (DR.) SA’AD ABUBAKAR III, CFR',
    organisation: 'Nigeria Supreme Council for Islamic Affairs (NSCIA)',
    position: 'Sultan of Sokoto',
    photographUrl: '',
    logoUrl: '',
    approvedTopic: 'Interfaith Safety Prayer',
    session: 'National Traditional & Religious Leadership Safety Colloquium',
    transcript: '',
    editedTranscript: '',
    handbookTitle: '',
    approvalStatus: {
      photo: false,
      bio: false,
      topic: false,
      transcript: false,
      handbook: false,
      podcast: false,
      cover: false,
      publication: false,
      commercialPermission: false
    },
    publicationDate: '2026-11-17',
    pageCount: 0,
    softCopyPrice: 0,
    hardCopyPrice: 0,
    podcastEpisodeNumber: 0,
    podcastDescription: '',
    handbookStatus: 'DRAFT',
    podcastTitle: '',
    podcastStatus: 'DRAFT',
    rightsAndConsent: {
      recordingPermission: false,
      transcriptApproval: false,
      publicationApproval: false,
      photoApproval: false,
      logoUsageStatus: false,
      podcastApproval: false,
      commercialPublicationApproval: false
    },
    showNotes: [],
    keyTakeaways: [],
    category: 'FAITH_LEADERSHIP',
    specialRole: 'Interfaith Safety Prayer',
    publicVisibility: 'PUBLIC'
  },
  {
    id: 'skr-rel-olukoya',
    speakerName: 'DR. D. K. OLUKOYA',
    organisation: 'Mountain of Fire and Miracles Ministries (MFM)',
    position: 'General Overseer',
    photographUrl: '',
    logoUrl: '',
    approvedTopic: 'Interfaith Safety Prayer',
    session: 'National Traditional & Religious Leadership Safety Colloquium',
    transcript: '',
    editedTranscript: '',
    handbookTitle: '',
    approvalStatus: {
      photo: false,
      bio: false,
      topic: false,
      transcript: false,
      handbook: false,
      podcast: false,
      cover: false,
      publication: false,
      commercialPermission: false
    },
    publicationDate: '2026-11-17',
    pageCount: 0,
    softCopyPrice: 0,
    hardCopyPrice: 0,
    podcastEpisodeNumber: 0,
    podcastDescription: '',
    handbookStatus: 'DRAFT',
    podcastTitle: '',
    podcastStatus: 'DRAFT',
    rightsAndConsent: {
      recordingPermission: false,
      transcriptApproval: false,
      publicationApproval: false,
      photoApproval: false,
      logoUsageStatus: false,
      podcastApproval: false,
      commercialPublicationApproval: false
    },
    showNotes: [],
    keyTakeaways: [],
    category: 'FAITH_LEADERSHIP',
    specialRole: 'Interfaith Safety Prayer',
    publicVisibility: 'PUBLIC'
  },
  {
    id: 'skr-rel-oyedepo',
    speakerName: 'BISHOP DAVID OYEDEPO',
    organisation: 'Living Faith Church Worldwide',
    position: 'Presiding Bishop',
    photographUrl: '',
    logoUrl: '',
    approvedTopic: 'Interfaith Safety Prayer',
    session: 'National Traditional & Religious Leadership Safety Colloquium',
    transcript: '',
    editedTranscript: '',
    handbookTitle: '',
    approvalStatus: {
      photo: false,
      bio: false,
      topic: false,
      transcript: false,
      handbook: false,
      podcast: false,
      cover: false,
      publication: false,
      commercialPermission: false
    },
    publicationDate: '2026-11-17',
    pageCount: 0,
    softCopyPrice: 0,
    hardCopyPrice: 0,
    podcastEpisodeNumber: 0,
    podcastDescription: '',
    handbookStatus: 'DRAFT',
    podcastTitle: '',
    podcastStatus: 'DRAFT',
    rightsAndConsent: {
      recordingPermission: false,
      transcriptApproval: false,
      publicationApproval: false,
      photoApproval: false,
      logoUsageStatus: false,
      podcastApproval: false,
      commercialPublicationApproval: false
    },
    showNotes: [],
    keyTakeaways: [],
    category: 'FAITH_LEADERSHIP',
    specialRole: 'Interfaith Safety Prayer',
    publicVisibility: 'PUBLIC'
  }
];
