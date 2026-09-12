/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BookProduct {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  organisation: string;
  publisher: string;
  format: 'SOFT_COPY' | 'HARD_COPY' | 'EBOOK' | 'SPEAKER_HANDBOOK' | 'SUMMIT_PUBLICATION';
  softCopyPrice: number; // default 4500
  hardCopyPrice: number; // default 9000
  customPrice?: number;
  coverUrl?: string;
  description: string;
  previewSample: string;
  tableOfContents: string[];
  status: 'PROPOSED' | 'IN_DEVELOPMENT' | 'EDITING' | 'READY_FOR_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  category: 'AVIATION_SAFETY' | 'AIRLINES' | 'AIRPORTS' | 'AIR_NAVIGATION' | 'HUMAN_FACTORS' | 'SIMULATION' | 'TECHNOLOGY' | 'LEADERSHIP' | 'INVESTMENT' | 'PASSENGER_SAFETY' | 'REGULATION' | 'OTHER';
  isSpeakerHandbook: boolean;
  speakerId?: string;
  revenueArrangement?: 'DOMISLINK_PUBLISHED' | 'SPEAKER_CONTRIBUTOR' | 'CO_PUBLISHED' | 'OTHER';
  publishedDate: string;
  isbn?: string;
}

export const INITIAL_DOMISLINK_BOOKS: BookProduct[] = [
  {
    id: 'book-1',
    title: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
    subtitle: 'Understanding the Shared Responsibility for Safer Aviation',
    author: 'Capt. Chris O. Najomo & DomisLink Editorial Board',
    organisation: 'Nigeria Civil Aviation Authority (NCAA)',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'An authoritative exploration of how safety in civil aviation is not merely the domain of regulators or pilots, but an unbroken chain connecting every passenger, mechanic, controller, and corporate executive.',
    previewSample: 'Chapter 1: The Chain of Responsibility. In modern civil aviation, a safe landing is the culmination of thousands of interconnected decisions made months before takeoff. When one link weakens, the entire system absorbs the stress...',
    tableOfContents: [
      '1. The Chain of Shared Responsibility',
      '2. Regulatory Oversight & Unannounced Audits',
      '3. The Human Element in Air Traffic Control',
      '4. Airline Operations & Corporate Safety Culture',
      '5. Passenger Vigilance and Trust'
    ],
    status: 'PUBLISHED',
    category: 'AVIATION_SAFETY',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-001-1'
  },
  {
    id: 'book-2',
    title: 'SAFETY BEFORE THE ACCIDENT',
    subtitle: 'Turning Aviation Experience, Reporting and Prevention into Action',
    author: 'Capt. Alex Sabundu Badeh Jnr. & NSIB Editorial Team',
    organisation: 'Nigerian Safety Investigation Bureau (NSIB)',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'SUMMIT_PUBLICATION',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'A vital handbook on multimodal safety investigation, emphasizing that incident reporting must be non-punitive and proactively analyzed to prevent catastrophe before it strikes.',
    previewSample: 'Introduction: Every accident investigation is a sacred obligation to the travelling public. We investigate not to apportion blame, but to ensure that the circumstances are never repeated...',
    tableOfContents: [
      '1. The Philosophy of Non-Punitive Incident Reporting',
      '2. Decoding Flight Data Recorders and Voice Logs',
      '3. Transforming Safety Recommendations into National Law',
      '4. Cross-Modal Synergy: Aviation, Rail and Maritime Safety',
      '5. Zero Accident Target: Myth or Achievable Destiny?'
    ],
    status: 'PUBLISHED',
    category: 'REGULATION',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-002-8'
  },
  {
    id: 'book-3',
    title: 'THE HUMAN FACTOR IN AVIATION SAFETY',
    subtitle: 'People, Communication, Fatigue, Decisions and the Prevention of Accidents',
    author: 'Domislink Aviation Research Group',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Examining human psychology, fatigue management, cockpit resource management (CRM), and situational awareness in high-pressure aviation environments.',
    previewSample: 'Preface: Machines are engineered for precision, but humans operate them through perception and judgment. Understanding fatigue and cognitive overload is paramount...',
    tableOfContents: [
      '1. Cognitive Limitations and Situational Awareness',
      '2. Cockpit Resource Management (CRM) in Crisis',
      '3. Fatigue Risk Management Systems (FRMS)',
      '4. Effective Communication Between Flight Deck and ATC',
      '5. Human Error vs. Systemic Flaws'
    ],
    status: 'PUBLISHED',
    category: 'HUMAN_FACTORS',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-003-5'
  },
  {
    id: 'book-4',
    title: 'THE LESSONS WE ALMOST LOST',
    subtitle: 'Why Aviation Experience Must Be Reported, Shared and Learned From',
    author: 'Aviation Safety Summit Editorial Board',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'SUMMIT_PUBLICATION',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Compiling critical near-misses, historical occurrences, and near-catastrophic lessons that nearly slipped into oblivion due to administrative silence.',
    previewSample: 'Foreword: History teaches what procedures protect. When near-misses are concealed, we invite the recurrence of disaster...',
    tableOfContents: [
      '1. The Danger of Silent Near-Misses',
      '2. Case Studies in Airspace Congestion Near-Collisions',
      '3. Weather Deviation Discrepancies and Resolution',
      '4. Building an Open Safety Reporting Database',
      '5. Institutional Memory in Airline Management'
    ],
    status: 'PUBLISHED',
    category: 'AVIATION_SAFETY',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-004-2'
  },
  {
    id: 'book-5',
    title: 'SIMULATE BEFORE YOU FLY',
    subtitle: 'How Flight Simulation Can Save Fuel, Money, Time and Lives',
    author: 'DomisLink Aviation Simulation Council',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'An in-depth analysis of Level D full-flight simulators, emergency drill repetition, and how simulation eliminates risk during pilot training.',
    previewSample: 'Chapter 1: The Economics of Safety. Training pilots in real aircraft during engine failure scenarios is unthinkable. Simulation allows infinite repetition without physical risk...',
    tableOfContents: [
      '1. The Evolution of Full-Flight Simulators (FFS)',
      '2. Practicing Catastrophic Engine Failures on Ground',
      '3. Weather Anomaly Simulation and Recovery',
      '4. Cost-Benefit Analysis of Advanced Simulator Investment',
      '5. Future Trends in Virtual Reality Flight Training'
    ],
    status: 'PUBLISHED',
    category: 'SIMULATION',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-005-9'
  },
  {
    id: 'book-6',
    title: 'SAFETY IS EVERYBODY\'S BUSINESS',
    subtitle: 'Leadership, Accountability and the Culture of Safe Aviation',
    author: 'Domislink Executive Leadership Series',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Guiding airline CEOs, board directors, and aviation executives on embedding safety culture from the top down rather than viewing safety as a compliance overhead.',
    previewSample: 'Introduction: Safety culture starts in the boardroom. If financial profitability overrides safety margins, disaster is only a matter of time...',
    tableOfContents: [
      '1. Boardroom Accountability for Airworthiness',
      '2. Just Culture vs. Blame Culture in Aviation Enterprises',
      '3. Allocating Resources for Proactive Maintenance',
      '4. Whistleblower Protection and Internal Safety Audits',
      '5. The CEO’s Personal Commitment to Zero Accidents'
    ],
    status: 'PUBLISHED',
    category: 'LEADERSHIP',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-006-6'
  },
  {
    id: 'book-7',
    title: 'INVESTING IN SAFETY',
    subtitle: 'Why Preventing Aviation Accidents Is Better Than Paying for Their Consequences',
    author: 'Aviation Financial Services Group',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Exploring the financial economics of safety investment, insurance premiums, asset depreciation, and capital financing for modern fleet acquisitions.',
    previewSample: 'Executive Summary: Accidents destroy capital, reputation, and human life. Investing in state-of-the-art avionics and maintenance yields immediate insurance and operational returns...',
    tableOfContents: [
      '1. The True Cost of an Aviation Catastrophe',
      '2. Insurance Underwriting and Safety Compliance Ratings',
      '3. Structured Financing for Fleet Modernization',
      '4. Return on Investment for Proactive Maintenance Tech',
      '5. Investor Confidence in Safe Airline Brands'
    ],
    status: 'PUBLISHED',
    category: 'INVESTMENT',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-007-3'
  },
  {
    id: 'book-8',
    title: 'FROM THE RUNWAY TO THE BOARDROOM',
    subtitle: 'How Every Decision Can Influence Aviation Safety',
    author: 'Domislink Operational Governance Desk',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Connecting operational realities on the tarmac with strategic decisions made in executive suites across African and global aviation hubs.',
    previewSample: 'Preface: A decision made in a corporate office regarding turnaround times directly impacts the stress levels of ramp engineers and cabin crew...',
    tableOfContents: [
      '1. Bridging the Gap Between Management and Operations',
      '2. Turnaround Pressures and Safety Compromise Risks',
      '3. Ground Handling Coordination and Equipment Standards',
      '4. Meteorology and Dispatcher-Pilot Synergy',
      '5. Enterprise Risk Management for Airlines'
    ],
    status: 'PUBLISHED',
    category: 'AIRLINES',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-008-0'
  },
  {
    id: 'book-9',
    title: 'AFRICAN AVIATION SAFETY',
    subtitle: 'Challenges, Opportunities and Practical Solutions',
    author: 'African Aviation Safety Council & Domislink',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'SUMMIT_PUBLICATION',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'A comprehensive analysis of African airspace infrastructure, regulatory harmonization under AFCAC, navigational aids, and regional safety targets.',
    previewSample: 'Introduction: Africa boasts immense aviation potential, yet faces unique infrastructural, navigational, and regulatory challenges that demand localized, decisive solutions...',
    tableOfContents: [
      '1. The State of African Airspace Navigation and Radar',
      '2. Regulatory Harmonization and Bilateral Air Service Agreements',
      '3. Financing Regional Maintenance, Repair and Overhaul (MRO)',
      '4. Training the Next Generation of African Pilots and Engineers',
      '5. Collaborative Safety Roadmaps for 2030'
    ],
    status: 'PUBLISHED',
    category: 'AVIATION_SAFETY',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-009-7'
  },
  {
    id: 'book-10',
    title: 'WHAT AVIATORS KNOW',
    subtitle: 'Preserving Professional Experience for the Next Generation',
    author: 'Veteran Captains Roundtable & Domislink',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Oral histories, operational wisdom, and tactical decision-making frameworks passed down from veteran airline captains to junior flight officers.',
    previewSample: 'Foreword: Flying is hours of utter boredom punctuated by seconds of sheer terror. The wisdom accumulated over decades in the clouds must be preserved...',
    tableOfContents: [
      '1. Weather Intuition and Radar Interpretation Wisdom',
      '2. Handling Sudden System Failures Without Panic',
      '3. Mentorship and Junior Officer Empowerment',
      '4. Navigating Complex Crosswinds and Mountainous Terrains',
      '5. The Psychological Resilience of Career Aviators'
    ],
    status: 'PUBLISHED',
    category: 'HUMAN_FACTORS',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-010-3'
  },
  {
    id: 'book-11',
    title: 'THE DIGITAL FUTURE OF AVIATION SAFETY',
    subtitle: 'Data, Artificial Intelligence, Simulation and Smarter Safety Systems',
    author: 'Domislink Technology & AI Aviation Lab',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Exploring ADS-B tracking, predictive maintenance algorithms, AI-driven flight anomaly detection, and cloud-based black box telemetry.',
    previewSample: 'Introduction: The digital revolution is transforming aviation from reactive investigation into proactive, predictive safety intelligence...',
    tableOfContents: [
      '1. Predictive Maintenance via IoT Engine Sensors',
      '2. Artificial Intelligence in Air Traffic Flow Management',
      '3. Cloud-Based Flight Data Monitoring (FDM)',
      '4. Cybersecurity Risks in Modern Avionics and Navigation',
      '5. Autonomous Flight Systems and Safety Governance'
    ],
    status: 'PUBLISHED',
    category: 'TECHNOLOGY',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-011-0'
  },
  {
    id: 'book-12',
    title: 'THE PASSENGER TRUST',
    subtitle: 'What Travellers Should Expect from a Safe Aviation System',
    author: 'Domislink Consumer & Passenger Advocacy Desk',
    organisation: 'Domislink International Services Ltd',
    publisher: 'DomisLink International Services Ltd / The Digital Empire',
    format: 'EBOOK',
    softCopyPrice: 4500,
    hardCopyPrice: 9000,
    description: 'Educating air travellers on safety rights, aircraft airworthiness verification, emergency preparedness, and consumer trust in commercial aviation.',
    previewSample: 'Preface: When a passenger steps onto an aircraft, they entrust their life to the entire aviation ecosystem. Maintaining that absolute trust is our highest calling...',
    tableOfContents: [
      '1. Understanding Passenger Rights and Safety Standards',
      '2. How to Verify Airline Safety Certifications',
      '3. Emergency Briefing Attention and Cabin Safety',
      '4. Dealing with Flight Delays and Operational Safety Limits',
      '5. The Psychological Foundation of Passenger Confidence'
    ],
    status: 'PUBLISHED',
    category: 'PASSENGER_SAFETY',
    isSpeakerHandbook: false,
    publishedDate: '2026-09-01',
    isbn: '978-978-987-012-7'
  }
];
