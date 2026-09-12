/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, HelpCircle, Shield, ArrowRight, Zap, MapPin } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function InteractiveMap() {
  const [activeNode, setActiveNode] = useState<string>('Aviation Safety');

  // Marriott Hotel Ikeja Lagos coordinates
  const summitVenuePosition = { lat: 6.5905, lng: 3.3547 };

  const nodeDetails: Record<string, { role: string; connection: string }> = {
    'Aviation Safety': {
      role: 'The Central Axis / Ultimate Priority',
      connection: 'The core metric. Everything, from a single passenger checking in to a minister drafting a civil aviation act, rotates around maintaining flawless, safe flight operations.'
    },
    'Government': {
      role: 'Policy Formulation & Infrastructure Funding',
      connection: 'Powers the Regulators with statutory authority and secures capital to deploy standard airfield radar, runways, and emergency equipment.'
    },
    'Regulators': {
      role: 'Standard Enforcement & Compliance Audits',
      connection: 'Validates airline operational safety, issues carrier licenses, and checks controller and engineer readiness against international criteria.'
    },
    'Airlines': {
      role: 'Active Flight Operations & Safety Culture',
      connection: 'Deploys airworthy aircraft, implements Crew Resource Management (CRM), and supports non-punitive incident reporting for flight decks.'
    },
    'Airports': {
      role: 'Ground Security & Airfield Integrity',
      connection: 'Maintains obstacle-free runways, clears foreign object debris (FOD), manages fire response teams, and ensures bird-hazard compliance.'
    },
    'ATC': {
      role: 'Air Traffic Control & Collision Separation',
      connection: 'Actively monitors flight paths, maintains safe spacing in congested Lagos skies, and guides captains safely through extreme weather.'
    },
    'Engineers': {
      role: 'Aircraft Airworthiness & Scheduled Overhauls',
      connection: 'Executes detailed maintenance cycles, verifies engine systems, and blocks flight dispatches if technical anomalies exist.'
    },
    'Training': {
      role: 'Professional Competencies & Sim Training',
      connection: 'Drills flight crews under extreme simulated emergencies (SIMS) to build flawless muscle memories and critical thinking skills.'
    },
    'Technology': {
      role: 'Predictive Diagnostics & Telemetry Tools',
      connection: 'Deploys ADS-B radar, intelligent cloud black boxes, flight recorders, and digital predictive maintenance trackers.'
    },
    'Oil & Gas': {
      role: 'Fuel Quality Control & Chemical Integrity',
      connection: 'Fuels turbine engines with absolute contaminant-free Jet A-1 fuel, which is crucial to avoid dual engine failure on takeoff.'
    },
    'Banks': {
      role: 'Financing Infrastructure & Simulators',
      connection: 'Directs structured institutional capital to purchase younger fleets and modern Level D simulators, making safety easier to fund.'
    },
    'Industry': {
      role: 'Private Sector Support & Cargo Logistical Compliance',
      connection: 'Adheres strictly to weight and hazardous material codes on freight shipments, ensuring cabin and airframe stability.'
    },
    'Investors': {
      role: 'Strategic Asset Funding & Safety Bonds',
      connection: 'Backs regional aviation growth by investing in certified carrier startups and high-efficiency airport construction projects.'
    },
    'Passengers': {
      role: 'Compliance, Trust & Active Vigilance',
      connection: 'The ultimate beneficiaries. Comply with crew mandates, behave responsibly, and trust the air safety system.'
    }
  };

  const hierarchy = [
    { level: 'Level 1: Sovereign Authority', nodes: ['Government'] },
    { level: 'Level 2: Strategic Control', nodes: ['Regulators'] },
    { level: 'Level 3: Ground & Sky Operations', nodes: ['Airlines', 'Airports', 'ATC'] },
    { level: 'Level 4: Technical & Human Assets', nodes: ['Engineers', 'Training', 'Technology'] },
    { level: 'Level 5: Commercial Support', nodes: ['Oil & Gas', 'Banks', 'Industry'] },
    { level: 'Level 6: Capital Resource', nodes: ['Investors'] },
    { level: 'Level 7: System Beneficiary', nodes: ['Passengers'] }
  ];

  return (
    <section className="py-24 bg-white border-b border-[#D4AF37]/10 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold flex items-center justify-center space-x-1.5">
            <Network className="h-4 w-4" />
            <span>INTERACTIVE ECOSYSTEM & MAPS</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            THE SAFETY ECOSYSTEM & VENUE MAP
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            Explore the safety relationship graph and locate the official summit venue at Marriott Hotel, Ikeja, Lagos via Google Maps.
          </p>
        </div>

        {/* 1. Relationship Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-7 bg-[#0A192F] p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/20 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-5">
              {hierarchy.map((lvl, lIdx) => (
                <div key={lIdx} className="w-full space-y-2 flex flex-col items-center">
                  <span className="text-[8px] font-mono tracking-widest text-[#8A99AD] uppercase">
                    {lvl.level}
                  </span>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {lvl.nodes.map((node) => (
                      <button
                        key={node}
                        onClick={() => setActiveNode(node)}
                        className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                          activeNode === node
                            ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37] shadow-lg scale-105'
                            : 'bg-white/5 text-[#E2E8F0] border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10'
                        }`}
                      >
                        {node}
                      </button>
                    ))}
                  </div>

                  {lIdx < hierarchy.length - 1 && (
                    <div className="h-4 w-px bg-gradient-to-b from-[#D4AF37]/30 to-[#D4AF37]/10 my-1"></div>
                  )}
                </div>
              ))}

              <div className="w-full pt-4 border-t border-white/10 flex flex-col items-center">
                <span className="text-[8px] font-mono tracking-widest text-[#8A99AD] uppercase mb-1">Central Core Node</span>
                <button
                  onClick={() => setActiveNode('Aviation Safety')}
                  className={`px-6 py-3.5 rounded-xl text-xs font-serif font-black tracking-widest uppercase transition-all duration-200 border-2 ${
                    activeNode === 'Aviation Safety'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89025] text-[#0A192F] border-[#D4AF37] shadow-xl'
                      : 'bg-white/10 text-white border-white/20 hover:border-[#D4AF37]'
                  }`}
                >
                  AVIATION SAFETY
                </button>
              </div>

            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FCFBF7] border border-[#D4AF37]/20 p-6 sm:p-8 rounded-2xl shadow-md flex flex-col justify-between h-full relative">
            <div className="space-y-6">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-[#0A192F] text-white rounded-lg">
                  <Shield className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase block">NODE PROFILE</span>
                  <h3 className="text-base sm:text-lg font-serif font-black text-[#0A192F] uppercase">
                    {activeNode}
                  </h3>
                </div>
              </div>

              <div className="h-px bg-gray-200"></div>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase">Functional Role:</p>
                  <p className="text-sm font-bold text-[#0A192F] mt-0.5">
                    {nodeDetails[activeNode]?.role}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-mono tracking-wider text-gray-400 uppercase">Cascade Interaction:</p>
                  <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed font-light mt-1">
                    {nodeDetails[activeNode]?.connection}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 text-[9px] font-mono text-gray-400 flex items-center justify-between">
              <span>ACTIVE SCHEMA LINKED</span>
              <span className="text-[#D4AF37] font-bold">100% CONCENTRATE</span>
            </div>
          </div>

        </div>

        {/* 2. GOOGLE MAPS INTEGRATION SECTION */}
        <div className="space-y-6 pt-8 border-t border-[#D4AF37]/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#0A192F] flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-[#D4AF37]" />
                <span>Summit Venue Location: Marriott Hotel, Ikeja, Lagos</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6E85]">
                Official venue for the Aviation Safety Summit 2026 on 17 November 2026.
              </p>
            </div>
            <div className="px-4 py-2 bg-[#0A192F] text-[#D4AF37] rounded-xl text-xs font-mono font-bold shadow-md">
              GPS: 6.5905° N, 3.3547° E
            </div>
          </div>

          <div className="w-full h-[450px] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl relative bg-[#0A192F] flex flex-col items-center justify-center p-8 text-center">
            {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                  defaultZoom={15}
                  defaultCenter={summitVenuePosition}
                  mapId="aviation_safety_summit_map"
                  style={{ width: '100%', height: '100%' }}
                >
                  <AdvancedMarker position={summitVenuePosition}>
                    <Pin background={'#D4AF37'} glyphColor={'#0A192F'} borderColor={'#0A192F'} />
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            ) : (
              <div className="max-w-xl space-y-4">
                <div className="w-16 h-16 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-2xl flex items-center justify-center mx-auto text-[#D4AF37]">
                  <MapPin className="h-8 w-8 animate-bounce" />
                </div>
                <h4 className="text-xl font-serif font-bold text-white">Marriott Hotel, Ikeja, Lagos</h4>
                <p className="text-xs sm:text-sm text-[#8A99AD] font-light leading-relaxed">
                  Official Summit Venue. Located in the heart of Ikeja GRA, Lagos, Nigeria. Easily accessible from Murtala Muhammed International Airport (LOS) via Isaac John Street.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
                  <span className="px-3 py-1.5 bg-[#071324] border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl">GPS: 6.5905° N, 3.3547° E</span>
                  <span className="px-3 py-1.5 bg-[#D4AF37] text-[#0A192F] font-bold rounded-xl">17 November 2026</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
