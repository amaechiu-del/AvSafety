/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DignitaryPerson {
  id: string;
  salutation: string;
  name: string;
  position: string;
  organisation: string;
  roleTitle: string;
  tierNumber: 1 | 2 | 3 | 4;
  monogram: string;
  photoUrl: string;
  status: 'CONFIRMED' | 'PROPOSED SPECIAL GUEST' | 'PROPOSED GUEST OF HONOUR' | 'PROPOSED INVITEE' | 'INVITATION TO BE SENT' | 'CONFIRMED SPECIAL GUEST' | 'CONFIRMED SPEAKER' | 'PROPOSED';
  keynoteTitle: string;
  keynoteFocus: string;
}

export interface DignitaryTier {
  id: string;
  tierNumber: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  leadHeadline: string;
  description: string;
  persons: DignitaryPerson[];
}

export const DIGNITARY_TIERS_DATA: DignitaryTier[] = [
  {
    id: 'tier-1',
    tierNumber: 1,
    title: 'Tier 1 Protocol',
    subtitle: 'SOVEREIGN EXECUTIVE & LEGISLATIVE HONOUR',
    leadHeadline: 'Presidency & National Assembly Leadership',
    description: 'The highest executive and legislative leadership presiding over the official Opening Ceremony, statutory safety mandates, and national appropriations.',
    persons: [
      {
        id: 'shettima-vp',
        salutation: 'His Excellency',
        name: 'SENATOR KASHIM SHETTIMA GCON',
        position: 'Vice President of the Federal Republic of Nigeria',
        organisation: 'Presidency, Federal Republic of Nigeria',
        roleTitle: 'Special Guest of Honour (Presiding)',
        tierNumber: 1,
        monogram: 'KS',
        photoUrl: '', // Quarantine unverified placeholders
        status: 'CONFIRMED SPECIAL GUEST',
        keynoteTitle: 'Sovereign Imperatives for Aviation Safety: Airspace Integrity, Economic Stability & National Security',
        keynoteFocus: 'Delivering the Presidential Address declaring open the DomisLink Aviation Safety Summit 2026, articulating the federal government\'s unwavering commitment to zero avoidable fatalities and sustainable infrastructure recapitalization.'
      },
      {
        id: 'akpabio-senate-pres',
        salutation: 'His Excellency',
        name: 'SENATOR GODSWILL OBOT AKPABIO GCON',
        position: 'President of the Senate of the Federal Republic of Nigeria',
        organisation: 'Senate of the Federal Republic of Nigeria (10th National Assembly)',
        roleTitle: 'Special Guest of Honour & Sovereign Legislative Keynote',
        tierNumber: 1,
        monogram: 'GA',
        photoUrl: '',
        status: 'CONFIRMED SPECIAL GUEST',
        keynoteTitle: 'Legislative Imperatives for Aviation Safety: Statutory Independence, Modern Infrastructure Appropriations & Sovereign Oversight',
        keynoteFocus: 'Delivering the Sovereign Legislative Keynote on parliamentary backing for civil aviation acts, statutory autonomy of safety regulators, and ring-fencing federal capital allocations for airspace radar and runway technologies.'
      }
    ]
  },
  {
    id: 'tier-2',
    tierNumber: 2,
    title: 'Tier 2 Protocol',
    subtitle: 'MINISTERIAL & HOST STATE EXECUTIVE LEADERSHIP',
    leadHeadline: 'Federal Ministry of Aviation & Host State Governor',
    description: 'Executive stewardship steering statutory aviation policy and host city aerodrome masterplans.',
    persons: [
      {
        id: 'keyamo-minister',
        salutation: 'Honourable Minister',
        name: 'BARR. FESTUS KEYAMO SAN, CON, FCIArb (UK)',
        position: 'Honourable Minister of Aviation and Aerospace Development',
        organisation: 'Federal Ministry of Aviation and Aerospace Development',
        roleTitle: 'Official Host & Ministerial Keynote',
        tierNumber: 2,
        monogram: 'FK',
        photoUrl: '',
        status: 'PROPOSED GUEST OF HONOUR',
        keynoteTitle: 'The 5-Point Aviation Safety Roadmap: Regulatory Independence, Consumer Protection & Fleet Modernisation',
        keynoteFocus: 'Outlining federal safety oversight, maintenance support policies, and Bilateral Air Service Agreement (BASA) safety reciprocity.'
      },
      {
        id: 'sanwo-olu-gov',
        salutation: 'His Excellency',
        name: 'MR. BABAJIDE OLUSOLA SANWO-OLU',
        position: 'Executive Governor of Lagos State',
        organisation: 'Lagos State Government (Host State)',
        roleTitle: 'Host Governor & Special Guest',
        tierNumber: 2,
        monogram: 'BS',
        photoUrl: '',
        status: 'PROPOSED SPECIAL GUEST',
        keynoteTitle: 'Lagos as West Africa\'s Premier Aviation Hub: Multi-Modal Transit, Emergency Readiness & Lekki Airport Vision',
        keynoteFocus: 'Welcoming global delegates to Lagos, highlighting state emergency response integration (LASEMA) with aerodrome search and rescue.'
      }
    ]
  },
  {
    id: 'tier-3',
    tierNumber: 3,
    title: 'Tier 3 Protocol',
    subtitle: 'CIVIL AVIATION STATUTORY REGULATORS',
    leadHeadline: 'Directors General & Chief Executive Officers of Statutory Agencies',
    description: 'The operational regulators and safety investigation authorities enforcing day-to-day airspace compliance.',
    persons: [
      {
        id: 'najomo-ncaa',
        salutation: 'Captain',
        name: 'CAPT. CHRIS O. NAJOMO',
        position: 'Director General / CEO',
        organisation: 'Nigeria Civil Aviation Authority (NCAA)',
        roleTitle: 'Statutory Regulatory Keynote',
        tierNumber: 3,
        monogram: 'CN',
        photoUrl: 'https://ncaa.gov.ng/media/5wun51qj/capt-chris-najomo-dgca.jpg',
        status: 'CONFIRMED SPEAKER',
        keynoteTitle: 'Enforcing Compliance, Safety Audits & Global Standards in Civil Aviation',
        keynoteFocus: 'Continuous surveillance, safety management system (SMS) mandates, and zero-tolerance regulatory audits.'
      },
      {
        id: 'badeh-nsib',
        salutation: 'Captain',
        name: 'CAPT. ALEX SABUNDU BADEH JNR.',
        position: 'Director General / CEO',
        organisation: 'Nigerian Safety Investigation Bureau (NSIB)',
        roleTitle: 'Accident Investigation Keynote',
        tierNumber: 3,
        monogram: 'AB',
        photoUrl: '',
        status: 'INVITATION TO BE SENT',
        keynoteTitle: 'Transforming Incident Investigation into Preventive Aviation Safety Architecture',
        keynoteFocus: 'Non-punitive safety reporting, independent multi-modal accident investigation, and life-saving preventive recommendations.'
      },
      {
        id: 'kuku-faan',
        salutation: 'Mrs.',
        name: 'MRS. OLUBUNMI OLUWASEUN KUKU',
        position: 'Managing Director / CEO',
        organisation: 'Federal Airports Authority of Nigeria (FAAN)',
        roleTitle: 'Aerodrome Authority Keynote',
        tierNumber: 3,
        monogram: 'OK',
        photoUrl: '',
        status: 'INVITATION TO BE SENT',
        keynoteTitle: 'Airfield Safety, Runway Incursion Mitigation & Airport Infrastructure Resilience',
        keynoteFocus: 'Modernizing airfield ground lighting, runway Foreign Object Debris (FOD) mitigation, and emergency evacuation drills.'
      },
      {
        id: 'farouk-nama',
        salutation: 'Engineer',
        name: 'ENGR. AHMED UMAR FAROUK',
        position: 'Managing Director / CEO',
        organisation: 'Nigerian Airspace Management Agency (NAMA)',
        roleTitle: 'Air Navigation Keynote',
        tierNumber: 3,
        monogram: 'AF',
        photoUrl: '',
        status: 'INVITATION TO BE SENT',
        keynoteTitle: 'Modernising CNS/ATM Systems: Safe Airspace Separation and Digital Navigation',
        keynoteFocus: 'Total radar coverage, VHF communication redundancy, and performance-based navigation (PBN) routes.'
      },
      {
        id: 'anosike-nimet',
        salutation: 'Professor',
        name: 'PROF. CHARLES ANOSIKE',
        position: 'Director General / CEO',
        organisation: 'Nigerian Meteorological Agency (NiMet)',
        roleTitle: 'Meteorological Keynote',
        tierNumber: 3,
        monogram: 'CA',
        photoUrl: '',
        status: 'INVITATION TO BE SENT',
        keynoteTitle: 'Early Warning Systems, Microburst Detection and Extreme Weather Flight Safety',
        keynoteFocus: 'Low-Level Windshear Alert Systems (LLWAS) and climate resilience across Nigerian flight paths.'
      },
      {
        id: 'danjuma-ncat',
        salutation: 'Dr.',
        name: 'DR. JOSEPH SHAKA DANJUMA',
        position: 'Rector / CEO',
        organisation: 'Nigerian College of Aviation Technology (NCAT) Zaria',
        roleTitle: 'Human Factors & Training Keynote',
        tierNumber: 3,
        monogram: 'JD',
        photoUrl: '',
        status: 'INVITATION TO BE SENT',
        keynoteTitle: 'Next-Generation Human Capital: Flight Simulation, Maintenance Engineering & Safety Ethics',
        keynoteFocus: 'Standardizing ab-initio pilot flight training, simulator certification, and licensed engineer safety rigor.'
      }
    ]
  },
  {
    id: 'tier-4',
    tierNumber: 4,
    title: 'Tier 4 Protocol',
    subtitle: 'AIRLINE CEOS & INDUSTRIAL LEADERSHIP',
    leadHeadline: 'Airline Operators, Energy Majors, Financiers & Telecom Leaders',
    description: 'Private and institutional executives upholding corporate safety cultures and investing in air infrastructure.',
    persons: [
      {
        id: 'onyema-airpeace',
        salutation: 'Dr.',
        name: 'DR. ALLEN ONYEMA CON',
        position: 'Chairman / CEO',
        organisation: 'Air Peace Limited',
        roleTitle: 'Commercial Airline Leadership',
        tierNumber: 4,
        monogram: 'AO',
        photoUrl: '',
        status: 'INVITATION TO BE SENT',
        keynoteTitle: 'Operational Safety Culture in High-Volume Commercial Flight Operations',
        keynoteFocus: 'Fleet maintenance investments, IOSA certification compliance, and pilot crew resource management.'
      },
      {
        id: 'mfon-ibomair',
        salutation: 'Captain',
        name: 'CAPT. MIEBAKA MFON',
        position: 'Chief Executive Officer',
        organisation: 'Ibom Air',
        roleTitle: 'Regional Airline Leadership',
        tierNumber: 4,
        monogram: 'MM',
        photoUrl: '',
        status: 'INVITATION TO BE SENT',
        keynoteTitle: 'Modern Fleet Standardization and On-Time Safety Discipline',
        keynoteFocus: 'Airbus A220 operational safety protocols and schedule reliability driven by preventive maintenance.'
      },
      {
        id: 'dangote-ind',
        salutation: 'Alhaji',
        name: 'ALIKO DANGOTE GCON',
        position: 'President / CEO',
        organisation: 'Dangote Group',
        roleTitle: 'Industrial Logistics & Aviation Energy',
        tierNumber: 4,
        monogram: 'AD',
        photoUrl: '',
        status: 'PROPOSED INVITEE',
        keynoteTitle: 'Refined Jet A-1 Quality Assurance and Energy Security for African Air Transport',
        keynoteFocus: 'Eliminating aviation fuel contamination risks and supporting domestic aviation energy self-reliance.'
      },
      {
        id: 'kyari-nnpc',
        salutation: 'Mallam',
        name: 'MELE KOLO KYARI OFR',
        position: 'Group Chief Executive Officer',
        organisation: 'NNPC Limited',
        roleTitle: 'Energy Infrastructure Stewardship',
        tierNumber: 4,
        monogram: 'MK',
        photoUrl: '',
        status: 'PROPOSED INVITEE',
        keynoteTitle: 'Offshore Helideck Safety Standards and ATK Supply Chain Integrity',
        keynoteFocus: 'Deepwater offshore aviation logistics, helideck certification, and zero-incident upstream energy transport.'
      }
    ]
  }
];
