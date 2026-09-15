/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, HeartHandshake, Plane, Sparkles, CheckCircle2, 
  Users, Globe, Compass, Wrench, Radio, UserCheck, Landmark 
} from 'lucide-react';

export interface SupportingHand {
  id: string;
  name: string;
  ethnicityTone: string; // e.g. '#2B1704' (Deep Ebony), '#8D5524' (Caramel Brown), '#C68642' (Bronze/Olive), '#F1C27D' (Golden Tan), '#FFDBAC' (Fair Tone)
  toneName: string;
  role: string;
  positionLabel: string;
  x: number; // percentage coordinate in SVG
  y: number;
  rotation: number;
  description: string;
  safetyPledge: string;
}

export const SUPPORTING_HANDS: SupportingHand[] = [
  {
    id: 'hand-black-left-wing',
    name: 'African & Global South Engineers',
    ethnicityTone: '#3D2314',
    toneName: 'Deep Ebony & Melanin',
    role: 'Airframe & Hydraulic Integrity',
    positionLabel: 'Left Wing Spar Support',
    x: 18,
    y: 62,
    rotation: -25,
    description: 'Holding the wing assembly, ensuring every titanium bolt, turbine blade, and hydraulic actuator is certified without compromise.',
    safetyPledge: 'We pledge zero-compromise maintenance; human lives depend on the tightness of every fastener.'
  },
  {
    id: 'hand-brown-cockpit',
    name: 'Flight Deck & Airspace Pilots',
    ethnicityTone: '#8D5524',
    toneName: 'Warm Caramel & Brown',
    role: 'Cockpit Command & Navigation',
    positionLabel: 'Nose & Cockpit Cradle',
    x: 48,
    y: 28,
    rotation: 0,
    description: 'Gently cradling the radome and flight deck, upholding situational awareness, Crew Resource Management, and steady hand at the controls.',
    safetyPledge: 'We command with humble vigilance, continuous learning, and absolute situational clarity.'
  },
  {
    id: 'hand-white-right-wing',
    name: 'Avionics & Global Regulators',
    ethnicityTone: '#FCD7B6',
    toneName: 'Fair & Northern Tone',
    role: 'Avionics & International Oversight',
    positionLabel: 'Right Wing Spar Support',
    x: 78,
    y: 62,
    rotation: 25,
    description: 'Supporting the starboard wing and fly-by-wire sensors, verifying strict ICAO compliance, radar separation, and safetyDirectives.',
    safetyPledge: 'We uphold international airworthiness standards without exception or commercial pressure.'
  },
  {
    id: 'hand-bronze-keel',
    name: 'Cabin Crew & Ground Operations',
    ethnicityTone: '#C68642',
    toneName: 'Rich Bronze & Olive',
    role: 'Fuselage Keel & Apron Safety',
    positionLabel: 'Fuselage Belly Keel',
    x: 32,
    y: 78,
    rotation: -10,
    description: 'Holding the belly of the airliner aloft, managing FOD sweeps, passenger evacuation preparedness, cargo balance, and fuel purity.',
    safetyPledge: 'We safeguard passengers on the ramp and in the cabin with alertness every second of every flight.'
  },
  {
    id: 'hand-golden-empennage',
    name: 'Faith Leaders & Community Stewards',
    ethnicityTone: '#E0AC69',
    toneName: 'Golden Tan & Amber',
    role: 'Moral Conscience & Intercession',
    positionLabel: 'Tail & Empennage Stabilizer',
    x: 65,
    y: 78,
    rotation: 10,
    description: 'Stabilizing the vertical rudder with moral clarity, ethics of leadership, pastoral solace for aviation families, and interfaith prayers.',
    safetyPledge: 'We awaken the conscience of leaders and intercede for continuous divine protection across all skies.'
  }
];

export default function AircraftHeldSafeVisual() {
  const [selectedHandId, setSelectedHandId] = useState<string>('hand-brown-cockpit');
  const [hoveredHandId, setHoveredHandId] = useState<string | null>(null);

  const activeHand = SUPPORTING_HANDS.find(h => h.id === selectedHandId) || SUPPORTING_HANDS[0];

  return (
    <div className="w-full bg-[#030816] rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-10 shadow-2xl overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Visual Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-mono font-bold tracking-widest uppercase">
            <Globe className="h-3.5 w-3.5 text-[#FFD700]" />
            <span>GLOBAL HUMAN SOLIDARITY IN AIR SAFETY</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-2">
            Held Safe in Our Hands: Black, Brown & White Unity
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            An aircraft cannot fly safely through isolated effort. From cockpit to tarmac, pulpit to hangar—hands of every shade and creed hold flight safe.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 shrink-0">
          <HeartHandshake className="h-6 w-6 text-[#FFD700]" />
          <div>
            <p className="text-xs font-bold text-white">Every Hand Counts</p>
            <p className="text-[10px] text-[#D4AF37] font-mono">Zero Discrimination at 35,000 ft</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: The Multi-Ethnic Hands Holding Aircraft Artwork (7 cols) */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] bg-gradient-to-b from-[#071324] via-[#050C1B] to-[#02050E] rounded-2xl border border-slate-800 p-4 overflow-hidden">
          
          {/* Shimmering celestial stars & air current particles */}
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
          
          {/* Glowing Golden Safe Energy Field surrounding the plane */}
          <div className="absolute w-[280px] sm:w-[420px] h-[180px] sm:h-[240px] rounded-full bg-gradient-to-r from-amber-500/15 via-[#D4AF37]/25 to-sky-400/15 blur-2xl animate-pulse pointer-events-none"></div>

          {/* SVG Artwork Container */}
          <svg className="w-full max-w-[540px] h-auto" viewBox="0 0 600 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Gold Gradient for Aircraft */}
              <linearGradient id="planeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#FFF2B2" />
                <stop offset="70%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#8A6D1C" />
              </linearGradient>

              {/* Energy Rays */}
              <radialGradient id="auraGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#050C1B" stopOpacity="0" />
              </radialGradient>

              {/* Hand drop shadow */}
              <filter id="handGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#D4AF37" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Radiant Safety Aura Behind Aircraft */}
            <circle cx="300" cy="210" r="140" fill="url(#auraGold)" opacity="0.35" />
            <circle cx="300" cy="210" r="90" stroke="#FFD700" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" className="animate-spin" style={{ transformOrigin: '300px 210px', animationDuration: '30s' }} />

            {/* ============================================================ */}
            {/* CENTRAL COMMERCIAL AIRLINER (TOP-FORWARD PERSPECTIVE) */}
            {/* ============================================================ */}
            <g id="aircraft-body" className="transition-transform duration-700 hover:scale-105" style={{ transformOrigin: '300px 210px' }}>
              {/* Aircraft Shadow / Grounding Energy */}
              <ellipse cx="300" cy="245" rx="140" ry="25" fill="#020611" opacity="0.6" filter="blur(8px)" />

              {/* Left Wing */}
              <path 
                d="M 285 200 L 120 230 L 100 238 L 275 220 Z" 
                fill="url(#planeGoldGrad)" 
                stroke="#FFE57F" 
                strokeWidth="1.5"
              />
              {/* Left Winglet */}
              <path d="M 100 238 L 96 220 L 104 228 Z" fill="#FFD700" />
              {/* Left Engine */}
              <ellipse cx="195" cy="222" rx="14" ry="9" fill="#0A192F" stroke="#D4AF37" strokeWidth="2" />
              <ellipse cx="195" cy="222" rx="8" ry="5" fill="#1E293B" />

              {/* Right Wing */}
              <path 
                d="M 315 200 L 480 230 L 500 238 L 325 220 Z" 
                fill="url(#planeGoldGrad)" 
                stroke="#FFE57F" 
                strokeWidth="1.5"
              />
              {/* Right Winglet */}
              <path d="M 500 238 L 504 220 L 496 228 Z" fill="#FFD700" />
              {/* Right Engine */}
              <ellipse cx="405" cy="222" rx="14" ry="9" fill="#0A192F" stroke="#D4AF37" strokeWidth="2" />
              <ellipse cx="405" cy="222" rx="8" ry="5" fill="#1E293B" />

              {/* Fuselage Core */}
              <path 
                d="M 300 110 C 316 130, 322 220, 318 280 L 282 280 C 278 220, 284 130, 300 110 Z" 
                fill="url(#planeGoldGrad)" 
                stroke="#FFFFFF" 
                strokeWidth="2"
              />

              {/* Cockpit Windshield */}
              <path 
                d="M 292 132 C 297 129, 303 129, 308 132 L 312 142 L 288 142 Z" 
                fill="#050C1B" 
                stroke="#60A5FA" 
                strokeWidth="1.5"
              />

              {/* Passenger Windows Stripe */}
              <line x1="293" y1="160" x2="293" y2="270" stroke="#050C1B" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="307" y1="160" x2="307" y2="270" stroke="#050C1B" strokeWidth="2" strokeDasharray="3 3" />

              {/* Tail Empennage & Stabilizers */}
              <path d="M 300 270 L 300 310 L 308 305 L 300 270 Z" fill="#FFD700" stroke="#FFFFFF" strokeWidth="1" />
              <path d="M 300 290 L 250 315 L 260 320 L 300 300 Z" fill="#D4AF37" />
              <path d="M 300 290 L 350 315 L 340 320 L 300 300 Z" fill="#D4AF37" />

              {/* Center Beacon Strobe Light */}
              <circle cx="300" cy="180" r="3.5" fill="#EF4444" className="animate-ping" style={{ animationDuration: '1.5s' }} />
              <circle cx="300" cy="180" r="2.5" fill="#FF0000" />
            </g>

            {/* ============================================================ */}
            {/* SUPPORTING HANDS OF DIFFERENT SKIN TONES HOLDING AIRCRAFT */}
            {/* ============================================================ */}

            {/* HAND 1: Deep Ebony / Black Skin Tone (Left Wing Support) */}
            <g 
              id="hand-black-left-wing-grp"
              onClick={() => setSelectedHandId('hand-black-left-wing')}
              onMouseEnter={() => setHoveredHandId('hand-black-left-wing')}
              onMouseLeave={() => setHoveredHandId(null)}
              className="cursor-pointer transition-all duration-300"
              filter="url(#handGlow)"
            >
              {/* Golden Energy Conduits to Wing */}
              <path d="M 175 320 Q 180 270 185 240" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
              
              {/* Arm & Palm Rendering (Deep Melanin/Ebony: #3D2314 with highlight #6B3E23) */}
              <path 
                d="M 120 420 L 145 340 C 150 320, 160 305, 175 300 C 185 296, 205 305, 215 320 L 225 350 L 190 430 Z" 
                fill="#3D2314" 
                stroke={selectedHandId === 'hand-black-left-wing' ? '#FFD700' : '#6B3E23'} 
                strokeWidth={selectedHandId === 'hand-black-left-wing' ? '3' : '1.5'}
              />
              {/* Extended Supportive Fingers cupping wing spar */}
              <path d="M 175 300 C 172 275, 180 255, 192 245 C 196 255, 194 275, 190 295 Z" fill="#4E2E1B" stroke="#8D5524" strokeWidth="1" />
              <path d="M 188 298 C 188 270, 198 250, 208 244 C 212 254, 208 274, 202 298 Z" fill="#3D2314" stroke="#6B3E23" strokeWidth="1" />
              <path d="M 200 305 C 205 280, 215 260, 224 255 C 228 265, 222 285, 215 308 Z" fill="#311B0E" stroke="#5A3319" strokeWidth="1" />
              {/* Thumb */}
              <path d="M 152 335 C 160 325, 175 320, 182 325 Z" fill="#4E2E1B" />
              
              {/* Pulse Marker */}
              <circle cx="192" cy="245" r="5" fill="#FFD700" className="animate-ping" style={{ animationDuration: '2.2s' }} />
              <circle cx="192" cy="245" r="3" fill="#FFFFFF" />

              {/* Tag Label */}
              <rect x="70" y="380" width="130" height="24" rx="12" fill="#0A192F" stroke="#D4AF37" strokeWidth="1.2" />
              <text x="135" y="396" fill="#FFD700" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                AFRICAN / BLACK HAND
              </text>
            </g>

            {/* HAND 2: Warm Caramel / Brown Skin Tone (Cockpit & Radar Radome Cradle) */}
            <g 
              id="hand-brown-cockpit-grp"
              onClick={() => setSelectedHandId('hand-brown-cockpit')}
              onMouseEnter={() => setHoveredHandId('hand-brown-cockpit')}
              onMouseLeave={() => setHoveredHandId(null)}
              className="cursor-pointer transition-all duration-300"
              filter="url(#handGlow)"
            >
              {/* Golden Energy Conduits to Nose */}
              <path d="M 300 70 Q 300 100 300 115" stroke="#FFD700" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.9" />

              {/* Gentle Cradling Palms from Top-Center (#8D5524 with highlight #B2733C) */}
              <path 
                d="M 260 20 L 275 80 C 280 95, 290 105, 300 105 C 310 105, 320 95, 325 80 L 340 20 Z" 
                fill="#8D5524" 
                stroke={selectedHandId === 'hand-brown-cockpit' ? '#FFD700' : '#B2733C'} 
                strokeWidth={selectedHandId === 'hand-brown-cockpit' ? '3' : '1.5'}
              />
              {/* Cradling fingers around radome */}
              <path d="M 275 80 C 275 98, 285 110, 295 115 C 298 108, 292 92, 285 80 Z" fill="#A0632F" stroke="#C68642" strokeWidth="1" />
              <path d="M 325 80 C 325 98, 315 110, 305 115 C 302 108, 308 92, 315 80 Z" fill="#A0632F" stroke="#C68642" strokeWidth="1" />
              
              {/* Pulse Marker */}
              <circle cx="300" cy="112" r="5" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '2s' }} />
              <circle cx="300" cy="112" r="3" fill="#FFFFFF" />

              {/* Tag Label */}
              <rect x="235" y="5" width="130" height="24" rx="12" fill="#0A192F" stroke="#D4AF37" strokeWidth="1.2" />
              <text x="300" y="21" fill="#FFD700" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                BROWN / ASIAN HAND
              </text>
            </g>

            {/* HAND 3: Fair / White Skin Tone (Right Wing & Avionics Support) */}
            <g 
              id="hand-white-right-wing-grp"
              onClick={() => setSelectedHandId('hand-white-right-wing')}
              onMouseEnter={() => setHoveredHandId('hand-white-right-wing')}
              onMouseLeave={() => setHoveredHandId(null)}
              className="cursor-pointer transition-all duration-300"
              filter="url(#handGlow)"
            >
              {/* Golden Energy Conduits to Right Wing */}
              <path d="M 425 320 Q 420 270 415 240" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />

              {/* Arm & Palm (#FCD7B6 with highlight #FFFFFF) */}
              <path 
                d="M 480 420 L 455 340 C 450 320, 440 305, 425 300 C 415 296, 395 305, 385 320 L 375 350 L 410 430 Z" 
                fill="#FCD7B6" 
                stroke={selectedHandId === 'hand-white-right-wing' ? '#FFD700' : '#E8B991'} 
                strokeWidth={selectedHandId === 'hand-white-right-wing' ? '3' : '1.5'}
              />
              {/* Extended Supportive Fingers */}
              <path d="M 425 300 C 428 275, 420 255, 408 245 C 404 255, 406 275, 410 295 Z" fill="#FFE1C6" stroke="#D9A880" strokeWidth="1" />
              <path d="M 412 298 C 412 270, 402 250, 392 244 C 388 254, 392 274, 398 298 Z" fill="#FCD7B6" stroke="#E8B991" strokeWidth="1" />
              <path d="M 400 305 C 395 280, 385 260, 376 255 C 372 265, 378 285, 385 308 Z" fill="#ECC4A0" stroke="#C89772" strokeWidth="1" />
              {/* Thumb */}
              <path d="M 448 335 C 440 325, 425 320, 418 325 Z" fill="#FFE1C6" />

              {/* Pulse Marker */}
              <circle cx="408" cy="245" r="5" fill="#FFD700" className="animate-ping" style={{ animationDuration: '2.5s' }} />
              <circle cx="408" cy="245" r="3" fill="#FFFFFF" />

              {/* Tag Label */}
              <rect x="400" y="380" width="130" height="24" rx="12" fill="#0A192F" stroke="#D4AF37" strokeWidth="1.2" />
              <text x="465" y="396" fill="#FFD700" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                WHITE / CAUCASIAN HAND
              </text>
            </g>

            {/* HAND 4: Bronze / Olive Tone (Belly & Keel Support) */}
            <g 
              id="hand-bronze-keel-grp"
              onClick={() => setSelectedHandId('hand-bronze-keel')}
              onMouseEnter={() => setHoveredHandId('hand-bronze-keel')}
              onMouseLeave={() => setHoveredHandId(null)}
              className="cursor-pointer transition-all duration-300"
              filter="url(#handGlow)"
            >
              {/* Palm lifting belly (#C68642) */}
              <path 
                d="M 230 450 L 245 360 C 250 340, 265 330, 280 328 C 290 328, 298 335, 300 348 L 305 450 Z" 
                fill="#C68642" 
                stroke={selectedHandId === 'hand-bronze-keel' ? '#FFD700' : '#9E6429'} 
                strokeWidth={selectedHandId === 'hand-bronze-keel' ? '3' : '1.5'}
              />
              <path d="M 275 330 C 275 305, 282 290, 290 280 C 293 290, 290 310, 285 330 Z" fill="#D99B5B" stroke="#9E6429" strokeWidth="1" />
              
              <circle cx="290" cy="280" r="4" fill="#10B981" />

              {/* Tag Label */}
              <rect x="180" y="445" width="115" height="22" rx="11" fill="#0A192F" stroke="#10B981" strokeWidth="1" />
              <text x="237" y="460" fill="#6EE7B7" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                BRONZE / LATIN HAND
              </text>
            </g>

            {/* HAND 5: Golden Tan / Amber Tone (Tail Empennage & Spiritual Balance) */}
            <g 
              id="hand-golden-empennage-grp"
              onClick={() => setSelectedHandId('hand-golden-empennage')}
              onMouseEnter={() => setHoveredHandId('hand-golden-empennage')}
              onMouseLeave={() => setHoveredHandId(null)}
              className="cursor-pointer transition-all duration-300"
              filter="url(#handGlow)"
            >
              {/* Palm supporting empennage (#E0AC69) */}
              <path 
                d="M 370 450 L 355 360 C 350 340, 335 330, 320 328 C 310 328, 302 335, 300 348 L 295 450 Z" 
                fill="#E0AC69" 
                stroke={selectedHandId === 'hand-golden-empennage' ? '#FFD700' : '#B88242'} 
                strokeWidth={selectedHandId === 'hand-golden-empennage' ? '3' : '1.5'}
              />
              <path d="M 325 330 C 325 305, 318 290, 310 280 C 307 290, 310 310, 315 330 Z" fill="#F0C285" stroke="#B88242" strokeWidth="1" />
              
              <circle cx="310" cy="280" r="4" fill="#D4AF37" />

              {/* Tag Label */}
              <rect x="305" y="445" width="115" height="22" rx="11" fill="#0A192F" stroke="#D4AF37" strokeWidth="1" />
              <text x="362" y="460" fill="#FFD700" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                GOLDEN / FAITH HAND
              </text>
            </g>

          </svg>

          {/* Floating Instruction Hint */}
          <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            Click any hand to inspect its unique support mandate
          </div>
        </div>

        {/* Right: Selected Hand Dossier & Safety Pledge (5 cols) */}
        <div className="lg:col-span-5 bg-[#071324] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {activeHand.positionLabel}
              </span>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                {activeHand.name}
              </h4>
              <p className="text-xs text-[#D4AF37] font-mono mt-0.5">
                Representing: {activeHand.toneName}
              </p>
            </div>

            <div 
              className="w-10 h-10 rounded-full border-2 border-white shadow-lg shrink-0 flex items-center justify-center font-bold text-white text-xs"
              style={{ backgroundColor: activeHand.ethnicityTone }}
            >
              <HeartHandshake className="h-5 w-5 text-white/90" />
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
            <p className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider">
              Safety Support Role
            </p>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeHand.description}
            </p>
          </div>

          {/* The Sacred Safety Pledge */}
          <div className="p-4 bg-gradient-to-br from-[#0A192F] to-[#050C1B] border border-[#D4AF37]/40 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold font-mono uppercase">
              <Sparkles className="h-4 w-4 text-[#FFD700]" />
              <span>THE SOLEMN SAFETY PLEDGE</span>
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-amber-100 leading-relaxed">
              "{activeHand.safetyPledge}"
            </p>
          </div>

          {/* Rapid Selector for All 5 Hands */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
              Explore All Supporting Hands:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUPPORTING_HANDS.map((h) => {
                const isSelected = selectedHandId === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHandId(h.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37] shadow-lg font-bold'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-white/60 shrink-0" 
                      style={{ backgroundColor: h.ethnicityTone }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{h.name}</p>
                      <p className={`text-[9px] font-mono truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                        {h.positionLabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Footer Moral Commitment Quote */}
      <div className="mt-8 pt-6 border-t border-slate-800/90 text-center max-w-4xl mx-auto space-y-2">
        <p className="text-xs sm:text-sm font-serif italic text-amber-200">
          "When an aircraft encounters severe turbulence, there is no separate air for the rich or the poor, the captain or the passenger, the African, the European, or the Asian. The atmosphere is one, the danger is one, and our salvation is one. That is why everybody is involved."
        </p>
        <p className="text-[11px] font-mono text-[#D4AF37]">
          — 2026 National Aviation Safety & Security Summit Charter
        </p>
      </div>

    </div>
  );
}
