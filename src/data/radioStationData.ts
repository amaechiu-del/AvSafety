/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RadioHost {
  id: 'host-captain-segun' | 'host-engr-amara' | 'host-author-amaechi' | 'host-anchor-aisha';
  name: string;
  role: string;
  avatarBadge: string;
  voiceGender: 'male' | 'female';
  geminiVoice: 'Fenrir' | 'Kore' | 'Puck' | 'Aoede';
  speechPitch: number; // 0.5 to 1.5
  speechRate: number;  // 0.8 to 1.2
  colorTheme: {
    badge: string;
    border: string;
    glow: string;
    bg: string;
    text: string;
  };
  bio: string;
  catchphrase: string;
  expertise: string[];
}

export interface RadioDialogueTurn {
  id: string;
  speakerId: 'host-captain-segun' | 'host-engr-amara' | 'host-author-amaechi' | 'host-anchor-aisha' | 'caller';
  speakerName: string;
  roleTitle: string;
  text: string;
  timestamp: string;
  sentiment?: 'authoritative' | 'technical' | 'urgent' | 'enthusiastic' | 'thoughtful' | 'caller';
}

export interface RadioSegment {
  id: string;
  frequency: string; // e.g., "98.5 MHz"
  category: 'SECRETARIAT_JOBS' | 'DYING_LIBRARY_ICAO' | 'GOVERNANCE_PSC' | 'OFFSHORE_HELICOPTER' | 'MAINTENANCE_MRO' | 'AIRSPACE_ATC' | 'SIMULATION' | 'FUEL_QUALITY' | 'PASSENGER_SAFETY' | 'FINANCE_CAPE_TOWN' | 'MORAL_FAITH';
  categoryLabel: string;
  title: string;
  tagline: string;
  duration: string;
  turns: RadioDialogueTurn[];
  secretariatNotice?: {
    type: 'JOB_OFFER' | 'PROCEDURE' | 'SUMMIT_UPDATE';
    title: string;
    details: string;
    actionLabel: string;
    actionUrl?: string;
  };
}

export interface SecretariatJobListing {
  id: string;
  title: string;
  department: string;
  type: 'Full-Time Contract' | 'Summit Project Role' | 'Senior Specialist' | 'Bilingual Trainee';
  stipend: string;
  location: string;
  slots: number;
  deadline: string;
  description: string;
  requirements: string[];
  procedure: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  onAirHostNote: string;
}

export const RADIO_HOSTS: Record<string, RadioHost> = {
  'host-captain-segun': {
    id: 'host-captain-segun',
    name: 'Capt. Segun Adeleke',
    role: 'Chief Flight Deck Veteran & Senior Host',
    avatarBadge: '👨🏾‍✈️ CAPTAIN',
    voiceGender: 'male',
    geminiVoice: 'Fenrir',
    speechPitch: 0.85,
    speechRate: 0.95,
    colorTheme: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      border: 'border-amber-500',
      glow: 'shadow-amber-500/30',
      bg: 'bg-amber-950/30',
      text: 'text-amber-400'
    },
    bio: 'Veteran airline captain with 18,000+ flight hours on Boeing 737, Airbus A330 and ATR-72 across West Africa and Europe. Master of Cockpit Resource Management (CRM).',
    catchphrase: '"The flight deck is no place for egos; altitude and airspeed are our only religion."',
    expertise: ['Flight Operations', 'Near-Miss Analysis', 'CRM', 'Severe Weather Navigation']
  },
  'host-engr-amara': {
    id: 'host-engr-amara',
    name: 'Engr. Dr. Amara Obi',
    role: 'Chief MRO Systems & Avionics Specialist',
    avatarBadge: '👩🏾‍🔧 LEAD ENGINEER',
    voiceGender: 'female',
    geminiVoice: 'Kore',
    speechPitch: 1.22,
    speechRate: 1.05,
    colorTheme: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      border: 'border-cyan-500',
      glow: 'shadow-cyan-500/30',
      bg: 'bg-cyan-950/30',
      text: 'text-cyan-400'
    },
    bio: 'Airframe & Powerplant (A&P) licensed aerospace engineer with a PhD in Structural Fatigue Diagnostics. Former Lead Technical Inspector for NCAA and regional hangars.',
    catchphrase: '"An aircraft never lies; every vibration and turbine spool tells a physical truth."',
    expertise: ['Turbine Maintenance', 'Bogus Parts Detection', 'Jet A-1 Quality', 'Avionics Redundancy']
  },
  'host-author-amaechi': {
    id: 'host-author-amaechi',
    name: 'F/O Amaechi Ubadike',
    role: 'Summit Convener & Author ("The Dying Library")',
    avatarBadge: '📜 CONVENER / PILOT / ATC',
    voiceGender: 'male',
    geminiVoice: 'Puck',
    speechPitch: 0.96,
    speechRate: 0.98,
    colorTheme: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      border: 'border-emerald-500',
      glow: 'shadow-emerald-500/30',
      bg: 'bg-emerald-950/30',
      text: 'text-emerald-400'
    },
    bio: 'Commercial Pilot, licensed Air Traffic Controller, and Aviation Safety Inspector (PEL). Convener of the Summit and author of "Cleared for Takeoff" & "The Dying Library".',
    catchphrase: '"When an experienced aviator dies without writing their memoir, an entire library of near-misses burns down."',
    expertise: ['Annex 19 SARP', 'PSC Model Governance', 'Memoir Challenge', 'Regulatory Oversight']
  },
  'host-anchor-aisha': {
    id: 'host-anchor-aisha',
    name: 'Aisha Bello-Lawal',
    role: 'Secretariat Anchor & Head of Operations Desk',
    avatarBadge: '🎙️ SECRETARIAT ANCHOR',
    voiceGender: 'female',
    geminiVoice: 'Aoede',
    speechPitch: 1.12,
    speechRate: 1.02,
    colorTheme: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      border: 'border-purple-500',
      glow: 'shadow-purple-500/30',
      bg: 'bg-purple-950/30',
      text: 'text-purple-400'
    },
    bio: 'Senior aviation broadcaster, Secretariat Chief of Communications, and coordinator of the Summit Career Desk, Job Applications, and International VIP Envoys.',
    catchphrase: '"Live from the DomisLink Skyline Studio, connecting the skies, the ground, and your career."',
    expertise: ['Secretariat Protocols', 'Job Offers & Hiring', 'ICAO Envoys Liaison', 'Summit Logistics']
  }
};

export const INITIAL_RADIO_SEGMENTS: RadioSegment[] = [
  {
    id: 'rad-seg-1',
    frequency: '98.5 MHz · Studio Live',
    category: 'DYING_LIBRARY_ICAO',
    categoryLabel: 'White Paper & ICAO Standards',
    title: 'The Dying Library: Why ICAO Must Mandate Annex 19 Memoir Archives',
    tagline: 'Capt. Segun, Dr. Amara, F/O Amaechi and Aisha break down why near-misses must be preserved before retirement.',
    duration: '4 mins broadcast',
    secretariatNotice: {
      type: 'SUMMIT_UPDATE',
      title: 'ICAO Montreal & ICAO West Africa Speeches Confirmed',
      details: 'Plenary slot allocated at 09:15 AM - 10:15 AM on Tuesday 17 November 2026 at Lagos Marriott Hotel.',
      actionLabel: 'View Programme Plenary'
    },
    turns: [
      {
        id: 't-1-1',
        speakerId: 'host-anchor-aisha',
        speakerName: 'Aisha Bello-Lawal',
        roleTitle: 'Secretariat Anchor',
        text: 'Welcome back to AeroSafe 98.5 FM, the official broadcasting voice of the DomisLink Aviation Safety Summit 2026! I am Aisha Bello, and right here in the studio we have our powerhouse panel: Captain Segun Adeleke, Engineer Dr. Amara Obi, and the Summit Convener himself, First Officer Amaechi Ubadike. Amaechi, your White Paper "The Dying Library" is sending shockwaves from Lagos to Montreal.',
        timestamp: '00:05',
        sentiment: 'enthusiastic'
      },
      {
        id: 't-1-2',
        speakerId: 'host-author-amaechi',
        speakerName: 'F/O Amaechi Ubadike',
        roleTitle: 'Summit Convener & Author',
        text: 'Thank you Aisha. You see, the fundamental tragedy of civil aviation is that we spend hundreds of millions investigating charred wreckage after a crash, but we invest virtually zero dollars capturing the forty-year career wisdom of a retiring captain who saved seven flights from crashing without anyone noticing. When that captain passes away, a whole library burns down.',
        timestamp: '00:32',
        sentiment: 'thoughtful'
      },
      {
        id: 't-1-3',
        speakerId: 'host-captain-segun',
        speakerName: 'Capt. Segun Adeleke',
        roleTitle: 'Chief Flight Deck Veteran',
        text: 'Amaechi is hitting the nail on the head! In my 18,000 hours, I have faced asymmetric flap lockups over the Sahara, microburst windshear in Port Harcourt, and fuel cross-feed anomalies that you will never find in the standard QRH checklist. If I retire tomorrow and keep those lessons in my head, the next 28-year-old first officer has to learn them the hard way.',
        timestamp: '01:05',
        sentiment: 'authoritative'
      },
      {
        id: 't-1-4',
        speakerId: 'host-engr-amara',
        speakerName: 'Engr. Dr. Amara Obi',
        roleTitle: 'Lead MRO Specialist',
        text: 'And from the engineering side, it is even more critical! When a licensed aircraft maintenance engineer spends thirty years inspecting CFM56 turbine blades, they develop tactile sensory memory. They can hear a hairline high-pressure compressor vibration before the digital telemetry flags it. That is why Recommendation 1 of the White Paper—mandating an ICAO Annex 19 SARP for national memoir archives—is a non-negotiable global necessity.',
        timestamp: '01:42',
        sentiment: 'technical'
      },
      {
        id: 't-1-5',
        speakerId: 'host-anchor-aisha',
        speakerName: 'Aisha Bello-Lawal',
        roleTitle: 'Secretariat Anchor',
        text: 'And to all our listeners across Nigeria, West Africa, and online: remember our phone lines and live studio text hotline are open right now! You can call in or send your thoughts directly into the broadcast room.',
        timestamp: '02:18',
        sentiment: 'enthusiastic'
      }
    ]
  },
  {
    id: 'rad-seg-2',
    frequency: '98.5 MHz · Secretariat Desk',
    category: 'SECRETARIAT_JOBS',
    categoryLabel: 'Secretariat Live & Career Offers',
    title: 'Secretariat Careers: Paid Summit Roles, Protocol Officers & Application Steps',
    tagline: 'Live announcements on 14 paid positions, vetting procedures, and technical rapporteur opportunities.',
    duration: '3 mins broadcast',
    secretariatNotice: {
      type: 'JOB_OFFER',
      title: '14 Active Summit Secretariat & Technical Roles Open',
      details: 'Salaries range from ₦180,000 to ₦450,000 / role. Applications close 30 October 2026.',
      actionLabel: 'Apply for Secretariat Role'
    },
    turns: [
      {
        id: 't-2-1',
        speakerId: 'host-anchor-aisha',
        speakerName: 'Aisha Bello-Lawal',
        roleTitle: 'Secretariat Anchor',
        text: 'You are tuned to AeroSafe 98.5 FM! We are now opening our official Secretariat Career & Job Desk. The DomisLink Secretariat is recruiting for 14 high-impact paid roles for the Summit operations at Lagos Marriott Hotel. We have openings for Senior Protocol Liaison Officers, Bilingual French/English Rapporteurs for the ICAO WACAF delegation, Live Broadcast Audio/Visual Engineers, and Logistics Coordinators.',
        timestamp: '00:04',
        sentiment: 'enthusiastic'
      },
      {
        id: 't-2-2',
        speakerId: 'host-author-amaechi',
        speakerName: 'F/O Amaechi Ubadike',
        roleTitle: 'Summit Convener',
        text: 'Yes! We want young aviation professionals, graduates in transport management, linguistics, mass communications, and engineering to gain direct, frontline international experience. Working side-by-side with ICAO envoys, NCAA directors, and airline CEOs will transform your career trajectory.',
        timestamp: '00:35',
        sentiment: 'thoughtful'
      },
      {
        id: 't-2-3',
        speakerId: 'host-engr-amara',
        speakerName: 'Engr. Dr. Amara Obi',
        roleTitle: 'Lead MRO Specialist',
        text: 'Let me explain the exact application procedure so everyone understands: Step one, select your desired role on this studio page. Step two, upload your CV and proof of relevant credentials. Step three, complete the short online safety aptitude questionnaire. Step four, shortlisted candidates receive a virtual briefing with the Protocol Directorate within 48 hours.',
        timestamp: '01:02',
        sentiment: 'technical'
      },
      {
        id: 't-2-4',
        speakerId: 'host-captain-segun',
        speakerName: 'Capt. Segun Adeleke',
        roleTitle: 'Chief Flight Deck Veteran',
        text: 'And let me add this as a captain: punctuality, high integrity, and strict attention to detail are what we look for. If you are passionate about air safety and national service, submit your application immediately through the Secretariat portal.',
        timestamp: '01:34',
        sentiment: 'authoritative'
      }
    ]
  },
  {
    id: 'rad-seg-3',
    frequency: '98.5 MHz · Deep Dive',
    category: 'GOVERNANCE_PSC',
    categoryLabel: 'Aviation Appointments Commission',
    title: 'The Police Service Commission (PSC) Model: Ending Politicised Aviation Leadership',
    tagline: 'Why Nigeria needs an independent constitutional commission to shortlist NCAA, FAAN, and NAMA CEOs.',
    duration: '4 mins broadcast',
    turns: [
      {
        id: 't-3-1',
        speakerId: 'host-author-amaechi',
        speakerName: 'F/O Amaechi Ubadike',
        roleTitle: 'Summit Convener',
        text: 'Let us discuss Recommendation 4 of the White Paper submitted to the 10th National Assembly. Why do we propose an Aviation Appointments Commission modelled on Section 153 Police Service Commission? Because whenever a new Minister arrives, the entire executive leadership of NCAA, FAAN, NAMA, NSIB, and NCAT is swept away in one afternoon. That destroys institutional memory and disrupts multi-year safety audits.',
        timestamp: '00:05',
        sentiment: 'thoughtful'
      },
      {
        id: 't-3-2',
        speakerId: 'host-captain-segun',
        speakerName: 'Capt. Segun Adeleke',
        roleTitle: 'Chief Flight Deck Veteran',
        text: 'It is a dangerous cycle! In civil aviation, regulatory decisions must be grounded purely in physics, aerodynamics, and ICAO Annexes, never political favor. When the regulator has statutory tenure and is appointed purely from a merit shortlist, safety inspectors on the tarmac can ground an unairworthy jet without fear of a phone call from Abuja.',
        timestamp: '00:48',
        sentiment: 'authoritative'
      },
      {
        id: 't-3-3',
        speakerId: 'host-engr-amara',
        speakerName: 'Engr. Dr. Amara Obi',
        roleTitle: 'Lead MRO Specialist',
        text: 'And the composition of the Commission in the White Paper is airtight: it includes retired DGs of international standing, professional representatives from NATCA and NAAPE, transport economists, consumer advocates, and an ICAO representative. Commercial airlines and political appointees are strictly barred from sitting on the panel.',
        timestamp: '01:25',
        sentiment: 'technical'
      }
    ]
  },
  {
    id: 'rad-seg-4',
    frequency: '98.5 MHz · Technical Analysis',
    category: 'OFFSHORE_HELICOPTER',
    categoryLabel: 'Offshore Helicopter Parity',
    title: 'Niger Delta Night Flights & Helideck Standards: North Sea Parity Now',
    tagline: 'Analyzing offshore rotary wing vulnerabilities following the Eastwind helicopter incident at Bonny Finima.',
    duration: '3 mins broadcast',
    turns: [
      {
        id: 't-4-1',
        speakerId: 'host-captain-segun',
        speakerName: 'Capt. Segun Adeleke',
        roleTitle: 'Chief Flight Deck Veteran',
        text: 'Let us look directly at the tragic 24 October 2024 Eastwind Sikorsky SK76 loss off Bonny Finima. That helicopter was carrying senior petroleum engineers and our dear NAAPE Vice President Capt. Yakubu Dukas. Flying over water in IMC conditions at dusk without real-time satellite telemetry is an unacceptable risk in the 21st century.',
        timestamp: '00:04',
        sentiment: 'authoritative'
      },
      {
        id: 't-4-2',
        speakerId: 'host-engr-amara',
        speakerName: 'Engr. Dr. Amara Obi',
        roleTitle: 'Lead MRO Specialist',
        text: 'Exactly! Recommendation 6 of the White Paper demands absolute offshore safety parity between the Niger Delta, the North Sea in Europe, and the Gulf of Mexico in the USA. That means mandatory Health and Usage Monitoring Systems (HUMS), dual-radar altimeters, automated helideck lighting sensors, and survival immersion suits for all offshore workers.',
        timestamp: '00:39',
        sentiment: 'technical'
      },
      {
        id: 't-4-3',
        speakerId: 'host-author-amaechi',
        speakerName: 'F/O Amaechi Ubadike',
        roleTitle: 'Summit Convener',
        text: 'Nigerian petroleum workers generate the sovereign revenue of this nation. They deserve the exact same safety standards that workers in Aberdeen or Houston enjoy. We have set a 24-month compliance roadmap with mandatory NCAA interim audits every six months.',
        timestamp: '01:15',
        sentiment: 'thoughtful'
      }
    ]
  },
  {
    id: 'rad-seg-5',
    frequency: '98.5 MHz · Simulator Tech',
    category: 'SIMULATION',
    categoryLabel: 'Flight Simulation & Fuel Economics',
    title: '"Sim Saves Dollars, Sim Saves Lives": The Level-D Simulator Revolution',
    tagline: 'Why synthetic flight training is the single highest-return safety investment for airlines and NCAT.',
    duration: '3 mins broadcast',
    turns: [
      {
        id: 't-5-1',
        speakerId: 'host-anchor-aisha',
        speakerName: 'Aisha Bello-Lawal',
        roleTitle: 'Secretariat Anchor',
        text: 'Our motto at the Summit is bold: "Sim Saves Fuel, Sim Saves Dollars, Sim Saves Lives." Amara, break down for our listeners why simulators are so crucial right now.',
        timestamp: '00:04',
        sentiment: 'enthusiastic'
      },
      {
        id: 't-5-2',
        speakerId: 'host-engr-amara',
        speakerName: 'Engr. Dr. Amara Obi',
        roleTitle: 'Lead MRO Specialist',
        text: 'A Boeing 737-800 burns roughly 2,500 kilograms of Jet A-1 fuel per hour. With fuel prices where they are, conducting real-aircraft base training costs tens of thousands of dollars and introduces unnecessary operational risk. A Level-D Full Flight Simulator with full-motion hydraulics allows an instructor to freeze the flight, reposition the plane 5 miles out, and simulate a dual engine flameout in thunderclouds without a drop of fuel.',
        timestamp: '00:28',
        sentiment: 'technical'
      },
      {
        id: 't-5-3',
        speakerId: 'host-captain-segun',
        speakerName: 'Capt. Segun Adeleke',
        roleTitle: 'Chief Flight Deck Veteran',
        text: 'And pedagogical patience! In a real airliner with passengers, schedule pressure prevents reflection. In a simulator, a captain can make a mistake, analyze the flight data recorder trace with the instructor, try again, and master Threat and Error Management (TEM).',
        timestamp: '01:05',
        sentiment: 'authoritative'
      }
    ]
  }
];

export const SECRETARIAT_JOB_LISTINGS: SecretariatJobListing[] = [
  {
    id: 'job-sec-01',
    title: 'Senior Protocol Liaison Officer (Lagos Marriott VIP Desk)',
    department: 'Summit Protocol Directorate & Multilateral Desk',
    type: 'Summit Project Role',
    stipend: '₦350,000 / Contract + Full VIP Accreditation',
    location: 'Lagos Marriott Hotel, Ikeja, Lagos (On-Site)',
    slots: 4,
    deadline: '30 October 2026',
    description: 'Responsible for receiving, chaperoning, and managing executive diplomatic protocols for Presidency delegates, Ministers, State Governors, and International Civil Aviation Organisation (ICAO) envoys.',
    requirements: [
      'Minimum Bachelor’s degree in International Relations, Law, Public Admin, or Aviation Management.',
      'Demonstrated experience in high-level state, diplomatic, or corporate event protocol.',
      'Impeccable executive presence, poise, and crisis diplomacy skills.',
      'Fluency in English; working proficiency in French is an added advantage.'
    ],
    procedure: {
      step1: 'Complete the on-air / online registration form below with CV and reference letters.',
      step2: 'Pass the 15-minute Diplomatic Protocol & Order of Precedence Screening Questionnaire.',
      step3: 'Attend the Secretariat Virtual Video Interview with the Protocol Master.',
      step4: 'Receive formal Appointment Letter, Security Accreditation Badge, and Marriott Hotel briefing schedule.'
    },
    onAirHostNote: 'Aisha: "If you have diplomatic finesse and know high-level protocol, this is your direct channel to state leadership."'
  },
  {
    id: 'job-sec-02',
    title: 'Flight Operations & Technical Rapporteur',
    department: 'Technical Resolutions & White Paper Secretariat',
    type: 'Senior Specialist',
    stipend: '₦400,000 / Contract + Published Byline',
    location: 'Lagos Marriott Hotel & Hybrid Operations',
    slots: 3,
    deadline: '30 October 2026',
    description: 'Capture verbatim technical resolutions, plenary deliberations, and safety policy commitments delivered by regulatory DGs, airline CEOs, and ICAO envoys during the Summit to produce the Official 2026 Communiqué.',
    requirements: [
      'Aviation professional background (Pilot, ATC, Engineer, Dispatcher) or specialized Aviation Law / Technical Journalist.',
      'Deep understanding of ICAO Annexes (Annex 13, Annex 19) and Nigerian Civil Aviation Regulations (Nig. CARs).',
      'High-speed technical transcription and executive summary synthesis.'
    ],
    procedure: {
      step1: 'Submit your technical writing sample or past regulatory/academic conference report.',
      step2: 'Complete a 30-minute rapid-fire audio transcript test on aviation safety terminology.',
      step3: 'Panel interview with Convener F/O Amaechi Ubadike.',
      step4: 'Contract onboarding and assignment to designated Plenary Halls (A, B, or Grand Ballroom).'
    },
    onAirHostNote: 'F/O Amaechi: "We need sharp aviation minds who understand every technical nuance of our safety resolutions."'
  },
  {
    id: 'job-sec-03',
    title: 'Bilingual Multilateral Liaison Officer (French / English)',
    department: 'ICAO WACAF & AFCAC Regional Delegation Unit',
    type: 'Bilingual Trainee',
    stipend: '₦380,000 / Contract + Multilateral Recommendation',
    location: 'Lagos Marriott Hotel, Ikeja, Lagos',
    slots: 2,
    deadline: '28 October 2026',
    description: 'Provide seamless interpretation, briefing document translation, and bilateral liaison for the ICAO Western and Central Africa (WACAF) delegation from Dakar, Senegal and AFCAC representatives.',
    requirements: [
      'Native or near-native fluency in French and English (C1/C2 level).',
      'Knowledge of international civil aviation conventions and regional ECOWAS transport terms.',
      'High intercultural communication competence.'
    ],
    procedure: {
      step1: 'Submit CV and French language certification (DALF/DELF or equivalent bilingual degree).',
      step2: 'Conduct a 10-minute live spoken French/English aviation scenario evaluation.',
      step3: 'Secretariat security clearance and credential verification.',
      step4: 'Assignment to the ICAO Regional Director’s Secretariat Escort Team.'
    },
    onAirHostNote: 'Aisha: "Connecting West African civil aviation authorities across English and French language borders."'
  },
  {
    id: 'job-sec-04',
    title: 'Summit Media & Live Broadcast Audio/Visual Engineer',
    department: 'Skyline Broadcast Studio & Digital Transmission',
    type: 'Full-Time Contract',
    stipend: '₦300,000 / Contract + Equipment Allowance',
    location: 'Lagos Marriott Hotel (Broadcast Hub)',
    slots: 3,
    deadline: '25 October 2026',
    description: 'Manage multi-camera digital live-streams, podcast studio recording consoles, wireless RF microphones, and satellite feed uplinks to international aviation media networks.',
    requirements: [
      'Certified audio/video streaming engineer with minimum 3 years live broadcast experience.',
      'Proficiency with Blackmagic ATEM, OBS Studio, Dante audio networking, and digital radio transmitters.',
      'Demonstrated ability to troubleshoot live audio latency and visual glitching under high-pressure event conditions.'
    ],
    procedure: {
      step1: 'Submit portfolio/links of previous live broadcasts, conferences, or studio setups managed.',
      step2: 'Technical assessment on RF frequencies, feedback cancellation, and streaming redundancy.',
      step3: 'Hands-on rehearsal session at the Skyline Broadcast Studio.',
      step4: 'Broadcast credential issuance and deployment.'
    },
    onAirHostNote: 'Dr. Amara: "We need engineers who ensure pristine sound quality for our radio and satellite feeds."'
  },
  {
    id: 'job-sec-05',
    title: 'Aviation Safety Content Writer & Digital Archive Curators',
    department: 'Knowledge Hub & National Memoir Project',
    type: 'Summit Project Role',
    stipend: '₦250,000 / Contract',
    location: 'Remote / Lagos Hybrid',
    slots: 4,
    deadline: '02 November 2026',
    description: 'Transcribe, edit, and curate veteran aviator memoir submissions, anonymise sensitive operational reports, and prepare digital safety handbooks for the DomisLink Bookstore.',
    requirements: [
      'Degree in Journalism, English, Mass Communication, or Aviation Studies.',
      'Fastidious attention to typographical accuracy, aviation acronyms, and non-punitive confidentiality.',
      'Experience in digital publishing, CMS, or handbook layout.'
    ],
    procedure: {
      step1: 'Submit 2 published writing samples or aviation blog articles.',
      step2: 'Complete editing test on an anonymised near-miss incident narrative.',
      step3: 'Final review by Head of Editorial.',
      step4: 'Onboarding to the National Memoir Challenge Content Engine.'
    },
    onAirHostNote: 'Capt. Segun: "Transforming raw cockpit experiences into clear, readable safety lessons for the next generation."'
  }
];

export const RADIO_TOPICS_CATALOGUE = [
  {
    category: '🏛️ Secretariat & Jobs',
    topics: [
      { id: 'top-sec-1', title: 'Secretariat Careers & Volunteer Application Procedures', desc: 'Step-by-step breakdown of paid roles, interview dates, and accreditation steps.' },
      { id: 'top-sec-2', title: 'ICAO West Africa & Montreal Protocol Preparations', desc: 'How the Secretariat is coordinating the 24-state WACAF and global ICAO delegations.' },
      { id: 'top-sec-3', title: 'Lagos Marriott Event Logistics & VIP Transport Corridors', desc: 'Helicopter shuttles, security convoys, and Marriott ballroom zoning.' }
    ]
  },
  {
    category: '📜 White Paper & ICAO',
    topics: [
      { id: 'top-wp-1', title: 'Recommendation 1: ICAO Annex 19 SARP for Knowledge Archives', desc: 'Obligating all 193 contracting states to create protected memoir archives.' },
      { id: 'top-wp-2', title: 'Recommendation 3: Career Testimony Mandatory Before Licence Renewal', desc: 'NCAA and international NAAs establishing exit testimony protocols.' },
      { id: 'top-wp-3', title: 'Recommendation 5: Annual National Aviation Memoir Award with Cash Prizes', desc: 'Celebrating pilots and engineers who candidly disclose systemic near-misses.' }
    ]
  },
  {
    category: '⚖️ Governance & Reform',
    topics: [
      { id: 'top-gov-1', title: 'The Aviation Appointments Commission (Police Service Commission Model)', desc: 'Constitutional firewall insulating NCAA, FAAN, and NAMA from political turnover.' },
      { id: 'top-gov-2', title: 'Statutory Minimum Qualifications for the Minister of Aviation', desc: 'Codifying technical prerequisites and permanent Director of Aviation post.' },
      { id: 'top-gov-3', title: 'Full Autonomy and 30-Day Preliminary Reporting for AIB/NSIB', desc: 'Ring-fencing accident investigation funds and launching oral history units.' }
    ]
  },
  {
    category: '🚁 Offshore & Rotary Safety',
    topics: [
      { id: 'top-off-1', title: 'Niger Delta Offshore Helicopter Parity with North Sea Standards', desc: 'Eliminating regulatory double standards in oil and gas helicopter logistics.' },
      { id: 'top-off-2', title: 'Lessons from the Eastwind Sikorsky SK76 Bonny Finima Crash', desc: 'Over-water telemetry, emergency float systems, and rapid marine search and rescue.' },
      { id: 'top-off-3', title: 'Helideck Lighting, Night Approaches & Upstream Energy Logistics', desc: 'Night-vision goggles (NVG) and modern precision approach guidance for oil rigs.' }
    ]
  },
  {
    category: '✈️ Cockpit, Simulators & MRO',
    topics: [
      { id: 'top-tech-1', title: '"Sim Saves Dollars, Sim Saves Lives": Level-D Full Flight Simulators', desc: 'Synthetic flight devices, microburst windshear drills, and fuel conservation.' },
      { id: 'top-tech-2', title: 'Eliminating Unapproved / Bogus Parts in Airline Maintenance', desc: 'Supply chain tracking, FAA/EASA release certificates, and local MRO hangars.' },
      { id: 'top-tech-3', title: 'Jet A-1 Fuel Purity, Sump Testing & Pipeline Quality Assurance', desc: 'Preventing water contamination, particulate debris, and engine flameout risks.' },
      { id: 'top-tech-4', title: 'Air Traffic Control Radar Separation & VHF Redundancy', desc: 'Closing communication blackspots across the Kano Flight Information Region (FIR).' }
    ]
  }
];
