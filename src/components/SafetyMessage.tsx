/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Plane, Wrench, Radio, Building2, HelpCircle, 
  ShieldCheck, Landmark, Factory, Coins, GraduationCap, Cpu,
  PhoneCall, ShieldAlert, HeartHandshake, Zap, Award, Flame,
  Share2, ArrowRight, Sparkles, CheckCircle2, TrendingUp
} from 'lucide-react';

export default function SafetyMessage() {
  const [selectedRole, setSelectedRole] = useState<string>('PASSENGERS');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FLIGHT' | 'INFRASTRUCTURE' | 'POLICY_CAPITAL'>('ALL');

  // The 17 Mandated Ecosystem Nodes
  const ecosystemNodes = [
    {
      id: 'passengers',
      name: 'PASSENGERS',
      category: 'FLIGHT',
      icon: <Users className="h-5 w-5" />,
      tagline: 'Trust & Staying Alert',
      desc: 'Passengers are the core beneficiaries of aviation safety. Their primary role is following flight safety briefings, observing baggage rules, reporting unusual smells or cabin noises, and remaining alert throughout all flight phases.'
    },
    {
      id: 'pilots',
      name: 'PILOTS',
      category: 'FLIGHT',
      icon: <Plane className="h-5 w-5" />,
      tagline: 'Flight Deck Command & CRM',
      desc: 'Commanders of the flight deck. Responsible for strictly adhering to every checklist, executing Crew Resource Management (CRM), respecting duty hour rest limits, and courageously rejecting unsafe aircraft dispatches.'
    },
    {
      id: 'cabin_crew',
      name: 'CABIN CREW',
      category: 'FLIGHT',
      icon: <HeartHandshake className="h-5 w-5" />,
      tagline: 'Cabin Safety & Emergency Evacuation',
      desc: 'Frontline guardians of passenger safety. Responsible for passenger briefing compliance, rapid cabin smoke/fire detection, medical first response, and executing 90-second emergency evacuations.'
    },
    {
      id: 'engineers',
      name: 'ENGINEERS',
      category: 'FLIGHT',
      icon: <Wrench className="h-5 w-5" />,
      tagline: 'Airworthiness & Maintenance',
      desc: 'Guardians of structural and mechanical integrity. Responsible for rigorous pre-flight inspections, scheduled maintenance, authentic OEM parts certification, and stopping un-airworthy aircraft from flying.'
    },
    {
      id: 'air_traffic_controllers',
      name: 'AIR TRAFFIC CONTROLLERS',
      category: 'INFRASTRUCTURE',
      icon: <Radio className="h-5 w-5" />,
      tagline: 'Airspace Separation & Guidance',
      desc: 'Guiding aircraft across ground runways and en-route sectors. Responsible for collision avoidance, precise weather advisories, clear vectoring, and expediting emergency descent corridors.'
    },
    {
      id: 'airlines',
      name: 'AIRLINES',
      category: 'FLIGHT',
      icon: <Building2 className="h-5 w-5" />,
      tagline: 'Corporate Safety Culture',
      desc: 'Commercial flight operators. Responsible for fostering a non-punitive safety reporting culture, investing in modern avionics, giving crews proper rest, and never prioritizing profit over maintenance.'
    },
    {
      id: 'airports',
      name: 'AIRPORTS',
      category: 'INFRASTRUCTURE',
      icon: <ShieldCheck className="h-5 w-5" />,
      tagline: 'Runway Integrity & Rapid Rescue',
      desc: 'Ground operations management. Responsible for foreign object debris (FOD) sweeps, high-intensity runway lighting, friction testing, bird strike prevention, and rapid crash fire rescue capabilities.'
    },
    {
      id: 'regulators',
      name: 'REGULATORS',
      category: 'POLICY_CAPITAL',
      icon: <Landmark className="h-5 w-5" />,
      tagline: 'Standard Oversight (NCAA, NAMA)',
      desc: 'Civil aviation authorities. Responsible for enforcing international ICAO standards, conducting unannounced airline audits, and strictly grounding any operator that compromises passenger safety.'
    },
    {
      id: 'government',
      name: 'GOVERNMENT',
      category: 'POLICY_CAPITAL',
      icon: <Building2 className="h-5 w-5" />,
      tagline: 'National Policy & Funding',
      desc: 'The sovereign backbone of aviation. Responsible for progressive civil aviation laws, funding modern radar navigation infrastructure, and protecting regulatory bodies from political interference.'
    },
    {
      id: 'oil_gas',
      name: 'OIL & GAS',
      category: 'INFRASTRUCTURE',
      icon: <Factory className="h-5 w-5" />,
      tagline: 'Clean Jet A-1 Fuel Logistics',
      desc: 'Energy suppliers and into-plane refuellers. Responsible for delivering water-free, particulate-free Jet A-1 fuel to prevent catastrophic engine flameouts on takeoff and climb.'
    },
    {
      id: 'banking_finance',
      name: 'BANKING & FINANCE',
      category: 'POLICY_CAPITAL',
      icon: <Coins className="h-5 w-5" />,
      tagline: 'Capital for Aircraft Acquisition',
      desc: 'Commercial and development banks. Responsible for providing accessible leasing capital and foreign exchange facilities to replace ageing airframes with modern, fuel-efficient, fail-safe aircraft.'
    },
    {
      id: 'telecommunications',
      name: 'TELECOMMUNICATIONS',
      category: 'INFRASTRUCTURE',
      icon: <Zap className="h-5 w-5" />,
      tagline: 'High-Uptime VHF & Data Links',
      desc: 'Telecom providers. Responsible for dedicated satellite ground stations, high-bandwidth CPDLC data links, and uninterrupted voice/data channels between control towers and cockpits.'
    },
    {
      id: 'technology',
      name: 'TECHNOLOGY',
      category: 'INFRASTRUCTURE',
      icon: <Cpu className="h-5 w-5" />,
      tagline: 'Predictive Avionics & Telemetry',
      desc: 'Aviation tech developers. Responsible for real-time flight data streaming, predictive maintenance algorithms, Terrain Avoidance Warning Systems (TAWS), and NextGen cockpit software.'
    },
    {
      id: 'training',
      name: 'TRAINING',
      category: 'FLIGHT',
      icon: <GraduationCap className="h-5 w-5" />,
      tagline: 'Skill Building & Simulation',
      desc: 'Aviation training academies. Responsible for rigorous recurrent evaluations, exposing crews to compounding emergencies in Level-D simulators, and instilling absolute safety ethics.'
    },
    {
      id: 'investors',
      name: 'INVESTORS',
      category: 'POLICY_CAPITAL',
      icon: <TrendingUp className="h-5 w-5" />,
      tagline: 'Safety Infrastructure Funding',
      desc: 'Institutional capital and angel syndicates. Responsible for funding private simulator hubs, maintenance repair & overhaul (MRO) hangars, and modern airport equipment.'
    },
    {
      id: 'industry',
      name: 'INDUSTRY',
      category: 'INFRASTRUCTURE',
      icon: <Award className="h-5 w-5" />,
      tagline: 'Broad Economic Alignment',
      desc: 'Commercial manufacturers, logistics shippers, and tourism bodies. Responsible for aligning business supply chains with safety-certified air transport standards.'
    },
    {
      id: 'emergency_services',
      name: 'EMERGENCY SERVICES',
      category: 'INFRASTRUCTURE',
      icon: <Flame className="h-5 w-5" />,
      tagline: 'First Response & Evacuation',
      desc: 'Airport fire fighters, aero-medical teams, and disaster management agencies. Responsible for maintaining instantaneous 3-minute response times to any aerodrome incident.'
    }
  ];

  const filteredNodes = activeCategory === 'ALL' 
    ? ecosystemNodes 
    : ecosystemNodes.filter(n => n.category === activeCategory);

  const activeNodeData = ecosystemNodes.find(n => n.name === selectedRole) || ecosystemNodes[0];

  return (
    <section id="theme" className="py-24 bg-[#FCFBF7] border-b border-[#D4AF37]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#AA7C11]">
            <Sparkles className="h-4 w-4 mr-1 text-[#D4AF37]" />
            SHARED ECOSYSTEM MANDATE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            EVERYBODY IS INVOLVED IN AVIATION SAFETY
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-base sm:text-lg text-[#5A6E85] font-light leading-relaxed">
            When an aviation accident occurs, it does not select a tribe, profession, company, social class, or nationality. Passengers may become victims of circumstances and of trusting the aviation system. Therefore, aviation safety is a shared responsibility across all 17 ecosystem nodes.
          </p>
        </div>

        {/* Central Visual Hub: ALL CONNECT TO AVIATION SAFETY */}
        <div className="bg-[#0A192F] border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">INTERCONNECTED ECOSYSTEM</span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase">
              17 VITAL LINKS CONNECTING TO SAFE SKIES
            </h3>
            <p className="text-xs text-[#8A99AD] font-light">
              Select any node below to inspect its operational safety mandate.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'ALL', label: 'All 17 Nodes' },
              { id: 'FLIGHT', label: 'Flight & Crew' },
              { id: 'INFRASTRUCTURE', label: 'Tech & Ground Infrastructure' },
              { id: 'POLICY_CAPITAL', label: 'Government, Regulators & Capital' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#D4AF37] text-[#0A192F] shadow'
                    : 'bg-white/5 hover:bg-white/10 text-[#8A99AD] hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 17 Interactive Nodes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {filteredNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedRole(node.name)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  selectedRole === node.name
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A192F] shadow-lg scale-105 font-bold'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${
                    selectedRole === node.name ? 'bg-[#0A192F] text-[#D4AF37]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    {node.icon}
                  </div>
                  <span className={`text-[9px] font-mono font-bold ${
                    selectedRole === node.name ? 'text-[#0A192F]/70' : 'text-white/40'
                  }`}>
                    NODE
                  </span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider leading-snug">{node.name}</h4>
                  <p className={`text-[9px] mt-0.5 truncate ${
                    selectedRole === node.name ? 'text-[#0A192F]/80' : 'text-[#8A99AD]'
                  }`}>
                    {node.tagline}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Detail Spotlight Frame */}
          <div className="p-6 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-[#D4AF37]/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>ACTIVE FOCUS: {activeNodeData.name}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-serif font-black text-white uppercase tracking-wide">
                {activeNodeData.name} — {activeNodeData.tagline}
              </h4>
              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed font-light max-w-3xl">
                {activeNodeData.desc}
              </p>
            </div>

            {/* Central Node Badge */}
            <div className="shrink-0 p-5 bg-[#D4AF37] text-[#0A192F] rounded-2xl text-center shadow-lg border border-amber-300">
              <ShieldCheck className="h-8 w-8 mx-auto mb-1 text-[#0A192F]" />
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest">ALL CONNECT TO:</p>
              <p className="text-base font-serif font-black uppercase tracking-wider">AVIATION SAFETY</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
