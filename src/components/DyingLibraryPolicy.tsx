/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, ShieldCheck, Scale, AlertTriangle, FileText, 
  Landmark, Award, Globe, Users, ExternalLink, ChevronDown, 
  ChevronUp, CheckCircle2, BookmarkCheck, ArrowRight, ShieldAlert,
  Building2, GraduationCap, Gavel, Sparkles, Send, Mic, Volume2,
  MapPin, Clock, Flag, Check
} from 'lucide-react';
import { AUTHOR_NAME, AUTHOR_FULL_TITLE, BOOK_PRIMARY } from '../constants/author';

interface DyingLibraryProps {
  onNavigateToMemoir?: () => void;
}

export default function DyingLibraryPolicy({ onNavigateToMemoir }: DyingLibraryProps) {
  const [activeTab, setActiveTab] = useState<'whitepaper' | 'speeches' | 'recommendations' | 'psc-model' | 'accidents' | 'contacts'>('whitepaper');
  const [expandedRec, setExpandedRec] = useState<number | null>(1);
  const [selectedAccidentFilter, setSelectedAccidentFilter] = useState<'all' | 'commercial' | 'helicopter' | 'ground'>('all');

  const allocatedSpeeches = [
    {
      id: "speech-icao-canada",
      recipient: "International Civil Aviation Organisation (ICAO Headquarters) · Montreal, Canada",
      rep: "ICAO Headquarters Special Envoy of the Secretary General",
      location: "Montréal, Quebec H3C 5H7, Canada",
      flag: "🌐 Canada / Global",
      sessionTime: "09:15 AM - 09:40 AM (Plenary)",
      speechTitle: "Global Adoption of Annex 19 SARP for Knowledge Preservation & The ICAO 80th Anniversary Memoir Challenge",
      recommendationLink: "Recommendations 1 & 2",
      coreTheme: "Establishing a multilateral Standard and Recommended Practice (SARP) under ICAO Annex 19 for National Aviation Memoir Archives, Universal Safety Oversight Audit Programme (USOAP) compliance, and sovereign knowledge preservation anniversary pledges.",
      keyPoints: [
        "Formal proposal to designate the Memoir Challenge as an official ICAO 80th Anniversary Initiative.",
        "Adopting Annex 19 SARPs obligating contracting states to establish independently governed aviation knowledge archives.",
        "Non-punitive legal protections for retiring pilots, controllers, and inspectors submitting career near-miss testimonies."
      ],
      badge: "Global Multilateral Keynote"
    },
    {
      id: "speech-icao-wacaf",
      recipient: "ICAO Western & Central African (WACAF) Regional Office · Dakar, Senegal",
      rep: "ICAO WACAF Regional Director / Special Envoy",
      location: "Dakar-Yoff, BP 2356, Dakar, Senegal",
      flag: "🌍 West Africa / ECOWAS",
      sessionTime: "09:40 AM - 10:05 AM (Plenary)",
      speechTitle: "Regional Knowledge Retention, Safety Governance Oversight & West African Airspace Harmonisation",
      recommendationLink: "Recommendations 1, 3 & 6",
      coreTheme: "Operationalizing regional safety knowledge retention, cross-border incident transparency across 24 WACAF member states, and establishing offshore helicopter safety standards parity in the Niger Delta and Gulf of Guinea.",
      keyPoints: [
        "Harmonising Safety Management System (SMS) career archive protocols across ECOWAS and WACAF civil aviation authorities.",
        "Eliminating safety disparities for offshore rotary-wing oil & gas operations (North Sea / Gulf of Mexico standards parity).",
        "Cross-border accident prevention intelligence sharing to prevent recurring fatal failure modes."
      ],
      badge: "Regional Multilateral Keynote"
    },
    {
      id: "speech-nass-senate",
      recipient: "Senate & House Committees on Aviation · 10th National Assembly",
      rep: "H.E. Senator Godswill Obot Akpabio, GCON (Senate President)",
      location: "National Assembly Complex, Three Arms Zone, Abuja",
      flag: "🇳🇬 Sovereign Legislature",
      sessionTime: "08:35 AM - 08:55 AM (Opening Keynote)",
      speechTitle: "Legislative Imperatives: The Independent Aviation Appointments Commission (The PSC Model)",
      recommendationLink: "Recommendations 4 & 9",
      coreTheme: "Enacting statutory legislation establishing the independent Aviation Appointments Commission modelled on Section 153 (Police Service Commission model), codifying ministerial technical prerequisites, and protecting institutional safety memory.",
      keyPoints: [
        "Constitutional firewall insulating NCAA, FAAN, NAMA, NSIB, and NCAT leadership from political turnover.",
        "Codifying minimum technical qualification requirements for the Minister of Aviation.",
        "Establishing a permanent civil service Director of Aviation to ensure regulatory continuity."
      ],
      badge: "Sovereign Legislative Directive"
    },
    {
      id: "speech-fed-minister",
      recipient: "Federal Ministry of Aviation & Aerospace Development",
      rep: "Barr. Festus Keyamo SAN, CON, FCIArb (UK) (Honourable Minister)",
      location: "Federal Secretariat, Constitution Avenue, Abuja",
      flag: "🇳🇬 Federal Government",
      sessionTime: "08:55 AM - 09:15 AM (Ministerial Keynote)",
      speechTitle: "The 5-Point Safety Roadmap: Implementing White Paper Governance & Infrastructure Safeguards",
      recommendationLink: "Recommendations 6, 7 & 8",
      coreTheme: "Responding to White Paper directives: full statutory funding for AIB/NSIB 30-day reporting, creating a national registry protecting general aviation aerodromes (Magbo Aerodrome precedent), and offshore safety audits.",
      keyPoints: [
        "Statutory protection against land encroachment on active aerodromes and general aviation training grounds.",
        "Sustaining non-punitive safety reporting channels and regulatory independence for NCAA and NSIB.",
        "Strengthening national aviation training curricula through veteran oral history preservation."
      ],
      badge: "Ministerial Policy Address"
    }
  ];

  const policyRecommendations = [
    {
      id: 1,
      number: "RECOMMENDATION 1",
      target: "ICAO (International Civil Aviation Organisation)",
      title: "Adopt an ICAO SARP for National Aviation Knowledge Archive Programmes",
      summary: "ICAO should adopt a Standard and Recommended Practice (SARP) under Annex 19 requiring every member state to establish an independently governed national aviation memoir and knowledge archive programme.",
      details: [
        "Defines minimum standards for programme design, data governance, and knowledge application to Safety Management Systems (SMS).",
        "Guarantees source anonymity protection and non-punitive disclosures.",
        "Mandates monitoring and verification of state compliance through the Universal Safety Oversight Audit Programme (USOAP)."
      ],
      badge: "Global Standard"
    },
    {
      id: 2,
      number: "RECOMMENDATION 2",
      target: "ICAO (International Civil Aviation Organisation)",
      title: "Establish the Memoir Challenge as an ICAO Anniversary Initiative",
      summary: "ICAO's 80th anniversary provides a compelling platform for the formal launch of the Global Aviation Memoir Initiative led by the Secretary General.",
      details: [
        "Invites member states to commit to national aviation knowledge preservation programmes as sovereign anniversary pledges.",
        "Positions career retrospectives and unrecorded near-misses as core pillars of next-generation aviation safety."
      ],
      badge: "Multilateral Action"
    },
    {
      id: 3,
      number: "RECOMMENDATION 3",
      target: "NCAA Nigeria & All National Aviation Authorities (NAAs)",
      title: "Require Career Testimony as a Condition of Final Licence Renewal",
      summary: "Every national aviation authority should require, as a condition of final licence renewal before retirement, the submission of an authentic career testimony to the national knowledge archive.",
      details: [
        "Structured not as a bureaucratic form, but as a personal testimony in the professional's own words.",
        "Can be anonymised upon request to protect career standing and colleagues.",
        "Legally ring-fenced and protected from enforcement action, preserved purely for safety training and operational research."
      ],
      badge: "Regulatory Prerequisite"
    },
    {
      id: 4,
      number: "RECOMMENDATION 4",
      target: "National Assembly of Nigeria (10th Assembly)",
      title: "Establish the Aviation Appointments Commission (The PSC Model)",
      summary: "Enact legislation establishing an independent constitutional Aviation Appointments Commission modelled on Section 153 of the 1999 Constitution (Police Service Commission model).",
      details: [
        "Creates a constitutional firewall between political will and aviation safety oversight.",
        "Mandates an independent technical merit panel to shortlist heads for NCAA, FAAN, NAMA, NSIB/AIB, and NCAT.",
        "Requires presidential appointments to be drawn strictly from the Commission's technical shortlist.",
        "Codifies mandatory minimum technical qualifications for the Minister of Aviation and establishes a permanent civil service Director of Aviation for institutional continuity."
      ],
      badge: "Constitutional Reform"
    },
    {
      id: 5,
      number: "RECOMMENDATION 5",
      target: "NCAA Nigeria, NATCA & NAAPE",
      title: "Establish an Annual National Aviation Memoir Award",
      summary: "NCAA in partnership with professional associations (NATCA, NAAPE, NAEC) should inaugurate an annual high-distinction safety award with financial prizes.",
      details: [
        "Recognises the retired pilot, air traffic controller, inspector, or engineer whose published memoir yields the most impactful systemic safety insights.",
        "Transforms candid error disclosure from an institutional stigma into a celebrated badge of honour."
      ],
      badge: "Professional Recognition"
    },
    {
      id: 6,
      number: "RECOMMENDATION 6",
      target: "NCAA Nigeria & NSIB / AIB Nigeria",
      title: "Mandate Offshore Helicopter Safety Standards Parity",
      summary: "NCAA must mandate that helicopter operators conducting offshore oil and gas missions across the Niger Delta meet identical night operations, approach guidance, and emergency response standards to the North Sea and Gulf of Mexico.",
      details: [
        "Eliminates unjustified disparity in offshore safety standards between Nigerian airspace and Western regimes.",
        "Enforces a strict 24-month compliance timeline with mandatory 6-month and 12-month interim progress audits."
      ],
      badge: "Offshore Parity"
    },
    {
      id: 7,
      number: "RECOMMENDATION 7",
      target: "Federal Ministry of Aviation & National Assembly",
      title: "Fund and Staff AIB/NSIB Nigeria to Full International Standards",
      summary: "Ensure full statutory funding for Nigeria's Accident Investigation Bureau to conduct investigations strictly to ICAO Annex 13 standards without resource delays.",
      details: [
        "Mandates publication of preliminary safety investigation findings within 30 days of serious occurrences.",
        "Funds a full-time National Aviation Oral History Programme to capture retiring professionals' testimonies."
      ],
      badge: "Investigation Sovereignty"
    },
    {
      id: 8,
      number: "RECOMMENDATION 8",
      target: "FAAN & Federal Ministry of Aviation",
      title: "Protect and Expand General Aviation Training Infrastructure",
      summary: "Establish a statutory registry of aviation infrastructure with robust legal protection against land encroachment, industrial conversion, or unauthorized real estate development.",
      details: [
        "Formally acknowledges the historic loss of Magbo Aerodrome to urban encroachment.",
        "Secures and revitalises training airfields, aerodromes, and navigation corridors nationwide."
      ],
      badge: "Infrastructure Safeguard"
    },
    {
      id: 9,
      number: "RECOMMENDATION 9",
      target: "Senate Committee & House Committee on Aviation",
      title: "Formal Legislative Consideration by the 10th National Assembly",
      summary: "Formally submits this White Paper to the Senate and House Committees on Aviation to advance legislative bills codifying the Aviation Appointments Commission and Knowledge Archives.",
      details: [
        `Companion policy instrument to '${BOOK_PRIMARY.title}: ${BOOK_PRIMARY.subtitle}' by ${AUTHOR_NAME}.`,
        "Presented for full public hearing and committee enactment during the 2026 legislative session."
      ],
      badge: "Statutory Bill"
    }
  ];

  const accidentRecords = [
    {
      date: "4 May 2002",
      operator: "EAS Airlines",
      aircraft: "BAC 1-11",
      location: "Kano (Gwammaja residential area)",
      fatalities: "71 aboard + 73 on ground (144 total)",
      finding: "Runway overrun on takeoff; engine ingestion; catastrophic impact in dense residential suburb destroying 2 mosques and 2 schools.",
      type: "ground"
    },
    {
      date: "22 Oct 2005",
      operator: "Bellview Airlines",
      aircraft: "Boeing 737-200",
      location: "Lisa, Ogun State",
      fatalities: "117 aboard",
      finding: "In-flight loss of control and structural breakup shortly after departure from Lagos; systemic maintenance and oversight factors.",
      type: "commercial"
    },
    {
      date: "10 Dec 2005",
      operator: "Sosoliso Airlines",
      aircraft: "McDonnell Douglas DC-9",
      location: "Port Harcourt International Airport",
      fatalities: "108 / 110 aboard",
      finding: "Hard landing and fire during convective windshear approach; tragically claimed ~60 secondary school students from Loyola Jesuit College Abuja.",
      type: "commercial"
    },
    {
      date: "29 Oct 2006",
      operator: "ADC Airlines",
      aircraft: "Boeing 737-200",
      location: "Abuja Airport perimeter",
      fatalities: "96 / 105 aboard",
      finding: "Windshear encounter immediately following takeoff; Sultan of Sokoto among the deceased in cornfield impact.",
      type: "commercial"
    },
    {
      date: "15 Mar 2008",
      operator: "Wing Aviation",
      aircraft: "Beechcraft 1900D",
      location: "Cross River mountainous forest",
      fatalities: "4 crew members",
      finding: "Controlled flight into terrain; wreckage remained unlocated for 6 months due to terrain and inadequate emergency location tracking.",
      type: "commercial"
    },
    {
      date: "3 Jun 2012",
      operator: "Dana Air",
      aircraft: "McDonnell Douglas MD-83",
      location: "Lagos (Iju-Ishaga residential area)",
      fatalities: "153 aboard + 6 on ground (159 total)",
      finding: "Dual engine failure on final approach into Lagos; killed all passengers including 15 foreign nationals from 9 countries and residents in buildings.",
      type: "ground"
    },
    {
      date: "3 Oct 2013",
      operator: "Associated Aviation",
      aircraft: "Embraer EMB 120 Brasilia",
      location: "Lagos Airport (Runway 18L)",
      fatalities: "16 / 20 aboard",
      finding: "Takeoff with unconfigured flaps / engine power deficit (Agagu funeral charter); safety inspector eyewitness on tarmac.",
      type: "commercial"
    },
    {
      date: "24 Oct 2024",
      operator: "Eastwind Aviation",
      aircraft: "Sikorsky SK76 Helicopter",
      location: "Atlantic Ocean / Bonny Finima offshore",
      fatalities: "8 / 8 aboard",
      finding: "Offshore crew shuttle carrying NNPC engineers; lost at sea. Claimed NAAPE VP Capt. Yakubu Dukas & Dr. Tamunoemi Suku. Demonstrates acute offshore rotary vulnerability.",
      type: "helicopter"
    }
  ];

  const submissionContacts = [
    {
      entity: "International Civil Aviation Organisation (ICAO)",
      address: "999 Robert-Bourassa Boulevard, Montréal, Quebec H3C 5H7, Canada",
      rep: "Secretary General",
      email: "icaohq@icao.int"
    },
    {
      entity: "Flight Safety Foundation (FSF)",
      address: "701 N. Fairfax Street, Suite 250, Alexandria, VA 22314, USA",
      rep: "President & CEO",
      email: "fsf@flightsafety.org"
    },
    {
      entity: "African Civil Aviation Commission (AFCAC)",
      address: "Airport of Dakar-Yoff, BP 2356, Dakar, Senegal",
      rep: "Secretary General",
      email: "info@afcac-cafac.org"
    },
    {
      entity: "Nigerian Safety Investigation Bureau (NSIB / AIB)",
      address: "Nnamdi Azikiwe International Airport, Abuja, Nigeria",
      rep: "Director General / Commissioner",
      email: "commissioner@aib.gov.ng"
    },
    {
      entity: "Nigerian Civil Aviation Authority (NCAA)",
      address: "Aviation House, Murtala Muhammed International Airport, Lagos / Abuja",
      rep: "Director General of Civil Aviation",
      email: "info@ncaa.gov.ng"
    },
    {
      entity: "Federal Ministry of Aviation & Aerospace Development",
      address: "Federal Secretariat, Constitution Avenue, Abuja, Nigeria",
      rep: "Honourable Minister of Aviation",
      email: "info@aviation.gov.ng"
    }
  ];

  const filteredAccidents = accidentRecords.filter(acc => {
    if (selectedAccidentFilter === 'all') return true;
    return acc.type === selectedAccidentFilter;
  });

  return (
    <section id="dying-library-policy" className="py-20 bg-[#071322] text-white border-y border-[#D4AF37]/30 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* White Paper Header Title */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            <span>OFFICIAL POLICY WHITE PAPER · LAGOS 2025/2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            THE DYING LIBRARY
          </h2>
          <p className="text-sm sm:text-lg text-[#D4AF37] font-serif italic max-w-3xl mx-auto">
            A Policy White Paper on Aviation Knowledge Preservation, Memoir Institutionalisation, and Governance Reform
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#8A99AD]">
            <span>Author: <strong>{AUTHOR_NAME}</strong></span>
            <span>•</span>
            <span>Commercial Pilot · Air Traffic Controller · Safety Inspector</span>
            <span>•</span>
            <span className="text-[#D4AF37] font-semibold">DomisLink International Services Ltd (RC - 9266988)</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl max-w-5xl mx-auto">
          <button
            onClick={() => setActiveTab('whitepaper')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'whitepaper' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>White Paper Core</span>
          </button>

          <button
            onClick={() => setActiveTab('speeches')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'speeches' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>ICAO & Government Speeches</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'recommendations' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>9 Recommendations</span>
          </button>

          <button
            onClick={() => setActiveTab('psc-model')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'psc-model' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>Police PSC Model</span>
          </button>

          <button
            onClick={() => setActiveTab('accidents')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'accidents' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Accident Record Evidence</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'contacts' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Submission Addresses</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: WHITEPAPER CORE MANIFESTO */}
        {/* ========================================================================= */}
        {activeTab === 'whitepaper' && (
          <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
            
            {/* The Central Quote Card */}
            <div className="bg-[#0A192F] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[180px] font-serif font-black text-white/5 leading-none select-none pointer-events-none">
                “
              </div>
              <div className="relative z-10 space-y-6">
                <p className="text-xl sm:text-2xl font-serif text-[#D4AF37] italic leading-relaxed text-center sm:text-left">
                  “I make a challenge — not as a suggestion, not as an aspiration, but as a formal professional challenge addressed to every aviator, every controller, every engineer, every inspector, every dispatcher, every cabin crew member who has ever served in any capacity in civil aviation anywhere on earth. Keep your memoir. Write it down. Publish it. The sky you flew is not yours alone to keep.”
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#D4AF37]/20 pt-4 gap-3 text-xs font-mono">
                  <span className="text-white font-bold tracking-wider uppercase">— {AUTHOR_NAME}</span>
                  <span className="text-[#8A99AD]">Companion to: {BOOK_PRIMARY.title}: {BOOK_PRIMARY.subtitle}</span>
                </div>
              </div>
            </div>

            {/* Three Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#0A192F] p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-mono font-bold">
                  01
                </div>
                <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider">
                  The Problem: The Dying Library
                </h3>
                <p className="text-xs text-[#8A99AD] leading-relaxed font-light">
                  Aviation learns from crashes through accident investigation. It learns from incidents through reporting. What it does not yet have is a system to learn from entire careers. Every pilot, controller, or inspector who retires takes decades of unrecorded near-misses and pattern recognition to the grave.
                </p>
              </div>

              <div className="bg-[#0A192F] p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-mono font-bold">
                  02
                </div>
                <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider">
                  The Solution: Institutionalisation
                </h3>
                <p className="text-xs text-[#8A99AD] leading-relaxed font-light">
                  Institutionalise knowledge capture at 6 levels: ICAO SARPs, National Aviation Authority final licence mandates, Airline protected memoir programs, simulator oral history curricula, professional memoir awards, and investigative journalism.
                </p>
              </div>

              <div className="bg-[#0A192F] p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-mono font-bold">
                  03
                </div>
                <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider">
                  The Prerequisite: Governance Reform
                </h3>
                <p className="text-xs text-[#8A99AD] leading-relaxed font-light">
                  Cultural disclosure cannot thrive under politicised hiring. Establishing the Aviation Appointments Commission (modelled on the Police Service Commission) provides the constitutional merit filter needed for institutional safety memory to survive political transitions.
                </p>
              </div>

            </div>

            {/* Call to action for the Memoir portal */}
            {onNavigateToMemoir && (
              <div className="p-6 bg-gradient-to-r from-[#0A192F] to-[#1E3A8A] border border-[#D4AF37]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-serif font-bold text-white">Ready to Contribute to the National Aviation Archive?</h4>
                  <p className="text-xs text-[#8A99AD]">Submit your career testimony, near-miss report, or operational lesson learned confidentially.</p>
                </div>
                <button
                  onClick={onNavigateToMemoir}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center space-x-2 shrink-0 cursor-pointer"
                >
                  <span>Enter Memoir Challenge Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ALLOCATED SPEECHES (ICAO CANADA, ICAO WEST AFRICA & GOVERNMENT) */}
        {/* ========================================================================= */}
        {activeTab === 'speeches' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-mono text-[10px] font-bold uppercase">
                <Mic className="w-3.5 h-3.5" />
                <span>OFFICIAL SUMMIT PLENARY ALLOCATIONS</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Allocated Speeches: ICAO Envoys & Sovereign Government
              </h3>
              <p className="text-xs text-[#8A99AD]">
                In accordance with the Dying Library White Paper directives, dedicated plenary keynotes have been assigned to ICAO Headquarters (Montreal, Canada), ICAO West Africa (Dakar, Senegal), the National Assembly, and the Federal Ministry of Aviation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allocatedSpeeches.map((sp) => (
                <div
                  key={sp.id}
                  className="bg-[#0A192F] border-2 border-[#D4AF37]/40 rounded-3xl p-6 space-y-4 shadow-xl hover:border-[#D4AF37] transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold uppercase">
                        {sp.badge}
                      </span>
                      <div className="text-xs font-mono text-[#D4AF37] font-bold flex items-center gap-1.5 mt-1">
                        <span>{sp.flag}</span>
                        <span>•</span>
                        <span>{sp.sessionTime}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono font-bold">
                      {sp.recommendationLink}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-serif font-bold text-white leading-snug">
                      "{sp.speechTitle}"
                    </h4>
                    <p className="text-xs font-semibold text-slate-300 mt-1">
                      {sp.rep}
                    </p>
                    <p className="text-[11px] text-[#8A99AD] font-mono">
                      {sp.recipient}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 font-light leading-relaxed border-t border-slate-800 pt-3">
                    {sp.coreTheme}
                  </p>

                  <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                    <p className="font-bold text-[#D4AF37] text-[10px] uppercase font-mono">Mandated Keynote Deliverables:</p>
                    {sp.keyPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 9 POLICY RECOMMENDATIONS (ICAO & SOVEREIGN) */}
        {/* ========================================================================= */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">9 ACTIONABLE POLICY RECOMMENDATIONS</h3>
              <p className="text-xs text-[#8A99AD]">
                Formally addressed to ICAO, National Aviation Authorities (NCAA), the Federal Ministry of Aviation, and the 10th National Assembly of Nigeria.
              </p>
            </div>

            <div className="space-y-4">
              {policyRecommendations.map((rec) => {
                const isExpanded = expandedRec === rec.id;
                return (
                  <div 
                    key={rec.id}
                    className={`bg-[#0A192F] rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded ? 'border-[#D4AF37] shadow-xl' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedRec(isExpanded ? null : rec.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] font-bold">
                            {rec.number}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">
                            Addressed to: {rec.target}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] hidden sm:inline-block">
                            {rec.badge}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-[#8A99AD] font-light leading-relaxed">
                          {rec.summary}
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-white/5 text-[#D4AF37] shrink-0 mt-1">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/5 space-y-3 bg-black/20">
                        <p className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                          Key Operational Directives:
                        </p>
                        <ul className="space-y-2">
                          {rec.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start space-x-2 text-xs text-gray-300 font-light">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: THE POLICE SERVICE COMMISSION (PSC) GOVERNANCE MODEL */}
        {/* ========================================================================= */}
        {activeTab === 'psc-model' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            
            {/* Header comparison card */}
            <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-6">
              <div className="flex items-center space-x-3 text-[#D4AF37]">
                <Scale className="h-6 w-6" />
                <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                  THE AVIATION APPOINTMENTS COMMISSION PROPOSAL
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#8A99AD] leading-relaxed font-light">
                Why does the Police Service Commission (PSC) model work? Under <strong>Section 153 of Nigeria’s 1999 Constitution</strong>, the PSC handles appointments, promotions, and dismissals independently of executive whim. It provides a constitutional firewall between political influence and technical appointment. The President still appoints — but strictly from a rigorous technical merit shortlist.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                {/* Current Vulnerable Framework */}
                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold uppercase">
                    <AlertTriangle className="h-4 w-4" />
                    <span>CURRENT NIGERIAN STATUS QUO</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300 font-light">
                    <li>• Agency heads (NCAA, FAAN, NAMA, AIB, NCAT) appointed purely by ministerial recommendation to the President.</li>
                    <li>• No published technical qualification criteria enforced in practice.</li>
                    <li>• No independent technical assessment panel or Senate confirmation requirement.</li>
                    <li>• Ministerial transitions trigger complete leadership turnovers, flushing out institutional memory and disrupting ongoing safety oversight.</li>
                  </ul>
                </div>

                {/* Proposed PSC Architecture */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <ShieldCheck className="h-4 w-4" />
                    <span>PROPOSED AVIATION COMMISSION (PSC MODEL)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300 font-light">
                    <li>• Independent statutory/constitutional body with a technical assessment mandate.</li>
                    <li>• Creates transparent merit shortlists for all federal aviation leadership seats.</li>
                    <li>• Rejection of shortlisted candidates requires published written justification to the National Assembly.</li>
                    <li>• Enacts mandatory minimum technical qualifications for the Minister of Aviation and establishes a permanent civil service Director of Aviation.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Proposed Commission Structure */}
            <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <h4 className="text-base sm:text-lg font-serif font-bold text-white flex items-center space-x-2">
                <Landmark className="h-5 w-5 text-[#D4AF37]" />
                <span>MANDATED COMMISSION COMPOSITION (NO COMMERCIAL CONFLICTS)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <p className="font-mono text-[#D4AF37] font-bold uppercase text-[10px]">COMMISSION CHAIR</p>
                  <p className="text-white font-semibold">Retired Aviation Professional of International Standing</p>
                  <p className="text-[#8A99AD] text-[11px] font-light">Former DG of ICAO or former DG of a peer-state NAA; single non-renewable term.</p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <p className="font-mono text-[#D4AF37] font-bold uppercase text-[10px]">TECHNICAL CORE</p>
                  <p className="text-white font-semibold">Two Serving Aviation Professionals</p>
                  <p className="text-[#8A99AD] text-[11px] font-light">Formally nominated by Nigeria's certified aviation professional bodies (NATCA, NAAPE).</p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <p className="font-mono text-[#D4AF37] font-bold uppercase text-[10px]">LEGAL OVERSIGHT</p>
                  <p className="text-white font-semibold">One Constitutional & Administrative Law Expert</p>
                  <p className="text-[#8A99AD] text-[11px] font-light">Ensures statutory compliance and transparent administrative justice.</p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <p className="font-mono text-[#D4AF37] font-bold uppercase text-[10px]">ECONOMIC GOVERNANCE</p>
                  <p className="text-white font-semibold">One Transport Economist</p>
                  <p className="text-[#8A99AD] text-[11px] font-light">Demonstrated expertise in airline viability, airport concessions, and public fiscal audit.</p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <p className="font-mono text-[#D4AF37] font-bold uppercase text-[10px]">CIVIL SOCIETY</p>
                  <p className="text-white font-semibold">One Consumer Rights Representative</p>
                  <p className="text-[#8A99AD] text-[11px] font-light">Advocate from recognized national passenger protection and safety organizations.</p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                  <p className="font-mono text-[#D4AF37] font-bold uppercase text-[10px]">INTERNATIONAL VALIDATION</p>
                  <p className="text-white font-semibold">One ICAO Nominated Member</p>
                  <p className="text-[#8A99AD] text-[11px] font-light">Provides external multilateral auditing and global technical parity.</p>
                </div>

              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-200 font-mono">
                <strong>STRICT EXCLUSION CLAUSE:</strong> No serving political appointee, active airline executive, concessionaire, or commercial aviation vendor may sit on the Commission.
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ACCIDENT RECORD EVIDENCE (GROUND, ROTARY, AIRLINE) */}
        {/* ========================================================================= */}
        {activeTab === 'accidents' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h3 className="text-xl font-serif font-bold text-white">APPENDIX A: SELECTED NIGERIAN ACCIDENT RECORD</h3>
              <p className="text-xs text-[#8A99AD] font-light">
                Aviation safety is not the exclusive concern of those who fly. Evidence demonstrates that residents beneath flight paths, offshore workers, and international passengers all share aviation risk.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setSelectedAccidentFilter('all')}
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedAccidentFilter === 'all' 
                    ? 'bg-[#D4AF37] text-[#0A192F]' 
                    : 'bg-white/5 text-[#8A99AD] hover:text-white'
                }`}
              >
                All Selected Accidents ({accidentRecords.length})
              </button>
              <button
                onClick={() => setSelectedAccidentFilter('ground')}
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedAccidentFilter === 'ground' 
                    ? 'bg-[#D4AF37] text-[#0A192F]' 
                    : 'bg-white/5 text-[#8A99AD] hover:text-white'
                }`}
              >
                Ground Casualties (Kano / Dana)
              </button>
              <button
                onClick={() => setSelectedAccidentFilter('helicopter')}
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedAccidentFilter === 'helicopter' 
                    ? 'bg-[#D4AF37] text-[#0A192F]' 
                    : 'bg-white/5 text-[#8A99AD] hover:text-white'
                }`}
              >
                Offshore Rotary (Eastwind)
              </button>
            </div>

            {/* Table layout */}
            <div className="bg-[#0A192F] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-[#D4AF37] font-mono text-[11px] uppercase tracking-wider">
                      <th className="p-4">Date</th>
                      <th className="p-4">Operator / Aircraft</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Fatalities</th>
                      <th className="p-4">Key Safety Finding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {filteredAccidents.map((acc, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono text-[#D4AF37] font-bold whitespace-nowrap">{acc.date}</td>
                        <td className="p-4 font-semibold text-white">
                          <div>{acc.operator}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{acc.aircraft}</div>
                        </td>
                        <td className="p-4 text-gray-300">{acc.location}</td>
                        <td className="p-4 font-mono font-bold text-red-400 whitespace-nowrap">{acc.fatalities}</td>
                        <td className="p-4 text-[#8A99AD] font-light leading-relaxed max-w-md">{acc.finding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 font-mono text-center">
              Source: Accident Investigation Bureau (AIB/NSIB) Nigeria investigation reports & official international aviation safety databases.
            </p>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SUBMISSION CONTACTS */}
        {/* ========================================================================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">APPENDIX B: CONTACT ADDRESSES FOR WHITE PAPER SUBMISSION</h3>
              <p className="text-xs text-[#8A99AD]">
                Formally dispatched to international civil aviation bodies, federal regulators, and legislative committees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissionContacts.map((contact, cIdx) => (
                <div key={cIdx} className="p-5 bg-[#0A192F] border border-white/10 rounded-2xl space-y-3 hover:border-[#D4AF37]/40 transition-all">
                  <div className="flex items-start justify-between">
                    <h4 className="font-serif font-bold text-white text-sm">{contact.entity}</h4>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-[#D4AF37]">OFFICIAL RECIPIENT</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{contact.rep}</p>
                  <p className="text-xs text-[#8A99AD] font-light">{contact.address}</p>
                  <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-[#D4AF37]">
                    Email: <a href={contact.email ? `mailto:${contact.email}` : '#'} className="underline hover:text-white">{contact.email}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl text-center space-y-2">
              <p className="text-xs font-mono text-[#D4AF37] font-bold uppercase">ISSUED BY:</p>
              <p className="text-sm font-serif font-bold text-white">DOMISLINK INTERNATIONAL SERVICES LTD</p>
              <p className="text-xs text-gray-400 font-mono">19 Powerline, Asiwaju Dada, Lagos, Nigeria • +234 904 983 7474 • domislinkint@gmail.com • RC - 9266988</p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
