/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Users, Radio, Plane, Wrench, HeartHandshake, 
  Building2, Landmark, DollarSign, UserCheck, BookOpen, 
  Newspaper, GraduationCap, Sparkles, Home, Globe2, 
  Activity, Play, Pause, ChevronRight, CheckCircle2, 
  AlertTriangle, Eye, ArrowRight, Zap, RefreshCw,
  Compass, Award, Cpu, ShieldAlert, Heart, Layers
} from 'lucide-react';
import AircraftHeldSafeVisual from './AircraftHeldSafeVisual';

export interface StakeholderNode {
  id: string;
  name: string;
  categoryGroup: 'OPERATIONAL' | 'GOVERNANCE' | 'COMMUNITY' | 'PUBLIC';
  icon: any;
  shortTag: string;
  roleDescription: string;
  whyInvolved: string;
  keyAction: string;
  riskIfIgnored: string;
  impactColor: string;
  connectionAngle: number; // in degrees around 360 circle
  ringDistance: number; // distance from center in px (virtual coordinates)
}

export const STAKEHOLDER_NODES: StakeholderNode[] = [
  {
    id: 'pilots',
    name: 'PILOTS',
    categoryGroup: 'OPERATIONAL',
    icon: Plane,
    shortTag: 'Flight Deck Command',
    roleDescription: 'Commanding flight operations, situational decision-making, and Crew Resource Management (CRM).',
    whyInvolved: 'Pilots hold immediate custody of human lives at 35,000 feet. Every flight plan, weather detour, and emergency checklist execution directly determines survival.',
    keyAction: 'Rigorous checklist discipline, fatigue reporting, and continuous simulator training under emergency conditions.',
    riskIfIgnored: 'Spatial disorientation, CRM breakdown, complacency, and catastrophic loss of control.',
    impactColor: '#38BDF8',
    connectionAngle: 0,
    ringDistance: 240
  },
  {
    id: 'atc',
    name: 'AIR TRAFFIC CONTROLLERS',
    categoryGroup: 'OPERATIONAL',
    icon: Radio,
    shortTag: 'Airspace Separation',
    roleDescription: 'Managing radar airspace, departure/arrival sequencing, and runway separation.',
    whyInvolved: 'Air Traffic Controllers prevent mid-air collisions and ground incursions across crowded terminal sectors (TRACON) and en-route corridors.',
    keyAction: 'Flawless voice cadence, read-back hear-back adherence, and swift radar conflict resolution.',
    riskIfIgnored: 'Airspace blind spots, runway confusion, loss of standard separation, and controlled flight into terrain (CFIT).',
    impactColor: '#60A5FA',
    connectionAngle: 22.5,
    ringDistance: 280
  },
  {
    id: 'engineers',
    name: 'ENGINEERS',
    categoryGroup: 'OPERATIONAL',
    icon: Wrench,
    shortTag: 'Airworthiness & Maintenance',
    roleDescription: 'A-Check to D-Check overhauls, avionics diagnostics, powerplant maintenance, and structural audits.',
    whyInvolved: 'An aircraft is only as safe as the tightening of its last hydraulic bolt. Engineers ensure airframes, turbines, and fly-by-wire circuits meet 100% airworthiness standards.',
    keyAction: 'Zero-compromise logbook sign-offs, genuine parts verification, and root-cause defect investigations.',
    riskIfIgnored: 'Uncontained engine failures, metal fatigue cracking, instrument false-readings, and sudden depressurization.',
    impactColor: '#F59E0B',
    connectionAngle: 45,
    ringDistance: 240
  },
  {
    id: 'cabin-crew',
    name: 'CABIN CREW',
    categoryGroup: 'OPERATIONAL',
    icon: UserCheck,
    shortTag: 'In-Flight Safety & Evacuation',
    roleDescription: 'In-flight emergency management, 90-second aircraft evacuation, first aid, and cabin safety compliance.',
    whyInvolved: 'Cabin crew are certified safety officers trained to save lives in decompression, ditching, fire, medical emergencies, and uncoordinated passenger panic.',
    keyAction: 'Enforcing seatbelt and luggage stowage rules, constant alertness during critical phases of flight (taxi, takeoff, landing).',
    riskIfIgnored: 'Blocked escape doors, smoke inhalation fatalities, uncontained lithium battery fires, and unruly passenger escalations.',
    impactColor: '#EC4899',
    connectionAngle: 67.5,
    ringDistance: 280
  },
  {
    id: 'airport-workers',
    name: 'AIRPORT WORKERS',
    categoryGroup: 'OPERATIONAL',
    icon: Building2,
    shortTag: 'Ramp, Security & Ground Integrity',
    roleDescription: 'Runway Foreign Object Debris (FOD) sweeps, baggage screening, aircraft marshalling, and fueling protocols.',
    whyInvolved: 'The airfield is a dynamic hazard zone. Ground collisions, bird strikes, contaminated Jet A-1 fuel, or luggage weight miscalculations threaten safe departure.',
    keyAction: 'Continuous FOD patrols, strict adherence to apron speed limits, and meticulous cargo weight and balance loading.',
    riskIfIgnored: 'Tire blowouts on takeoff, fuel starvation from water contamination, tail-strikes from center-of-gravity imbalance.',
    impactColor: '#A855F7',
    connectionAngle: 90,
    ringDistance: 240
  },
  {
    id: 'regulators',
    name: 'REGULATORS',
    categoryGroup: 'GOVERNANCE',
    icon: Shield,
    shortTag: 'NCAA / ICAO Compliance & Audits',
    roleDescription: 'Statutory oversight, airworthiness directives, air operator certificate (AOC) audits, and incident reporting.',
    whyInvolved: 'Regulators establish the baseline of non-negotiable safety laws. Their unannounced inspections prevent corners from being cut in commercial operations.',
    keyAction: 'Rigorous enforcement of ICAO SARPs, mandatory SMS (Safety Management Systems), and whistleblower protection.',
    riskIfIgnored: 'Regulatory capture, substandard maintenance approvals, unchecked pilot duty hour violations, and FAA/EU blacklisting.',
    impactColor: '#EAB308',
    connectionAngle: 112.5,
    ringDistance: 280
  },
  {
    id: 'government',
    name: 'GOVERNMENT',
    categoryGroup: 'GOVERNANCE',
    icon: Landmark,
    shortTag: 'Policy & Infrastructure Capital',
    roleDescription: 'National aviation policy formulation, runway and ILS Category III procurement, and bilateral safety accords.',
    whyInvolved: 'Aviation requires massive sovereign commitment. State-of-the-art radar, perimeter fencing, firefighting apparatus, and meteorological equipment require national funding.',
    keyAction: 'Long-term infrastructure funding, zero-political interference in crash investigations, and judicial support for aviation rights.',
    riskIfIgnored: 'Decaying runway surfaces, obsolete analog radar, uncoordinated search and rescue responses, and sovereign economic isolation.',
    impactColor: '#10B981',
    connectionAngle: 135,
    ringDistance: 240
  },
  {
    id: 'business',
    name: 'BUSINESS',
    categoryGroup: 'GOVERNANCE',
    icon: Building2,
    shortTag: 'Corporate Duty of Care & Logistics',
    roleDescription: 'Corporate travel safety guidelines, executive mobility risks, and dangerous goods logistics management.',
    whyInvolved: 'Commerce moves at the speed of flight. Corporate executives, energy engineers, and bankers depend entirely on safe flights for national productivity.',
    keyAction: 'Procuring flights on safety-audited carriers, supporting employee travel risk policies, and investing in regional aviation development.',
    riskIfIgnored: 'Decapitation of corporate leadership teams in air mishaps, disrupted supply chains, and crippling investor liability.',
    impactColor: '#14B8A6',
    connectionAngle: 157.5,
    ringDistance: 280
  },
  {
    id: 'investors',
    name: 'INVESTORS',
    categoryGroup: 'GOVERNANCE',
    icon: DollarSign,
    shortTag: 'Safety Capital & Modern Fleets',
    roleDescription: 'Funding modern aircraft leasing, Level D simulator installations, and aviation technology startups.',
    whyInvolved: 'Safety is expensive, but an accident is catastrophic. Patient capital finances younger aircraft fleets and world-class Maintenance, Repair and Overhaul (MRO) facilities.',
    keyAction: 'Investing in local Nigerian MRO centers, simulator hubs, and safety technology bonds.',
    riskIfIgnored: 'Aged aircraft operating beyond economic lifespan due to lack of capital, high foreign exchange flight for simple maintenance.',
    impactColor: '#F59E0B',
    connectionAngle: 180,
    ringDistance: 240
  },
  {
    id: 'passengers',
    name: 'PASSENGERS',
    categoryGroup: 'PUBLIC',
    icon: Users,
    shortTag: 'Vigilance, Trust & Compliance',
    roleDescription: 'Adhering to flight safety briefings, hazardous goods restrictions, and passenger rights advocacy.',
    whyInvolved: 'Passengers are the ultimate reason the aviation system exists. Their obedience to crew instructions and responsible behavior keep the cabin secure.',
    keyAction: 'Paying full attention during safety demonstrations, keeping seatbelts fastened whenever seated, and never packing undeclared flammable items.',
    riskIfIgnored: 'Severe cabin injuries in clear-air turbulence, luggage pileups blocking aisles during emergency exits, and dangerous cargo fires.',
    impactColor: '#38BDF8',
    connectionAngle: 202.5,
    ringDistance: 280
  },
  {
    id: 'faith-communities',
    name: 'FAITH COMMUNITIES',
    categoryGroup: 'COMMUNITY',
    icon: HeartHandshake,
    shortTag: 'Moral Conscience & Intercession',
    roleDescription: 'Spiritual stewardship, dignity of human life, interfaith safety prayers, and moral accountability of leaders.',
    whyInvolved: 'In turbulence or crisis, prayers rise across every seat. Faith leaders shape the moral conscience of engineers, pilots, and regulators to reject cutting corners.',
    keyAction: 'Preaching diligence, honesty, and the sanctity of human life; organizing national interfaith prayers for airspace safety.',
    riskIfIgnored: 'Moral decay in workplace ethics, greed overriding safety decisions, loss of spiritual solace in traumatic events.',
    impactColor: '#D4AF37',
    connectionAngle: 225,
    ringDistance: 240
  },
  {
    id: 'media',
    name: 'MEDIA',
    categoryGroup: 'COMMUNITY',
    icon: Newspaper,
    shortTag: 'Objective Safety Reporting',
    roleDescription: 'Responsible aviation journalism, avoiding sensation, and educating the public on investigative findings.',
    whyInvolved: 'Accurate reporting prevents harmful panic while holding public officials and airlines strictly accountable for safety standards.',
    keyAction: 'Relying on official Accident Investigation Bureau (NSIB) reports rather than speculating during breaking air incidents.',
    riskIfIgnored: 'Sensationalist misinformation damaging national aviation reputation, premature blame undermining rigorous technical investigations.',
    impactColor: '#F43F5E',
    connectionAngle: 247.5,
    ringDistance: 280
  },
  {
    id: 'academia',
    name: 'ACADEMIA',
    categoryGroup: 'COMMUNITY',
    icon: GraduationCap,
    shortTag: 'Aviation Research & Human Factors',
    roleDescription: 'Aeronautical engineering research, human factors psychology, meteorological forecasting, and AI diagnostics.',
    whyInvolved: 'Universities and research institutes uncover the subtle psychological, aerodynamic, and material science causes behind safety trends.',
    keyAction: 'Publishing evidence-based peer-reviewed safety studies, developing localized wind-shear warning algorithms.',
    riskIfIgnored: 'Stagnant training methodologies, failure to anticipate new technological hazards (such as automation reliance).',
    impactColor: '#818CF8',
    connectionAngle: 270,
    ringDistance: 240
  },
  {
    id: 'young-people',
    name: 'YOUNG PEOPLE',
    categoryGroup: 'PUBLIC',
    icon: Sparkles,
    shortTag: 'Future Aviators & STEM Talent',
    roleDescription: 'Cadet pilot recruitment, aircraft technician apprenticeships, and youth aviation awareness.',
    whyInvolved: 'The future of safe flight depends on attracting ethical, disciplined, and passionate young talents into cockpits and maintenance hangars.',
    keyAction: 'Participating in aviation STEM fairs, glider clubs, and junior safety ambassador initiatives.',
    riskIfIgnored: 'Critical shortage of captains, controllers, and certified aircraft engineers as the veteran workforce retires.',
    impactColor: '#34D399',
    connectionAngle: 292.5,
    ringDistance: 280
  },
  {
    id: 'families',
    name: 'FAMILIES',
    categoryGroup: 'PUBLIC',
    icon: Home,
    shortTag: 'Emotional Stakeholders & Support',
    roleDescription: 'Family support networks for aviation workers, passenger welfare advocacy, and community safety trust.',
    whyInvolved: 'Every passenger and flight crew member has a family waiting on the ground. Safe skies keep families whole and protect societal stability.',
    keyAction: 'Providing emotional stability and rest support for flight personnel; demanding systemic accountability for public transport.',
    riskIfIgnored: 'Crew psychological burnout from domestic stress, profound societal trauma from preventable transport tragedies.',
    impactColor: '#FB7185',
    connectionAngle: 315,
    ringDistance: 240
  },
  {
    id: 'general-public',
    name: 'THE GENERAL PUBLIC',
    categoryGroup: 'PUBLIC',
    icon: Globe2,
    shortTag: 'Sovereign Beneficiaries & Watchdogs',
    roleDescription: 'Ground safety awareness, preventing laser pointer attacks on aircraft, and airspace vigilance.',
    whyInvolved: 'Aviation safety transcends airport fences. Citizens living near flight paths, drone operators, and ground transport commuters are all part of the safety chain.',
    keyAction: 'Reporting unauthorized drones near airports, respecting airport perimeter buffers, and fostering national pride in safety.',
    riskIfIgnored: 'Laser strikes blinding pilots on final approach, unauthorized drone collisions with jet engines, encroachment on flight obstacle corridors.',
    impactColor: '#38BDF8',
    connectionAngle: 337.5,
    ringDistance: 280
  }
];

export default function EverybodyIsInvolvedNetwork() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('faith-communities');
  const [activeGroupFilter, setActiveGroupFilter] = useState<'ALL' | 'OPERATIONAL' | 'GOVERNANCE' | 'COMMUNITY' | 'PUBLIC'>('ALL');
  const [isRotating, setIsRotating] = useState(true);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const [viewMode, setViewMode] = useState<'ORBIT' | 'GRID' | 'HANDS'>('ORBIT');

  // Animation frame for smooth gentle rotation
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isRotating && !hoveredNodeId) {
        setRotationOffset(prev => (prev + delta * 2) % 360);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, hoveredNodeId]);

  // Periodic heartbeat pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount(c => c + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const selectedNode = useMemo(() => {
    return STAKEHOLDER_NODES.find(n => n.id === selectedNodeId) || STAKEHOLDER_NODES[0];
  }, [selectedNodeId]);

  const filteredNodes = useMemo(() => {
    if (activeGroupFilter === 'ALL') return STAKEHOLDER_NODES;
    return STAKEHOLDER_NODES.filter(n => n.categoryGroup === activeGroupFilter);
  }, [activeGroupFilter]);

  // Center coordinate of virtual canvas (600 x 600 box)
  const center = { x: 300, y: 300 };

  return (
    <div className="w-full bg-[#050B1A] border-y border-[#D4AF37]/30 text-slate-100 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial gold glow and coordinate grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#D4AF37]/5 via-[#0A192F]/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase shadow-md">
            <Globe2 className="h-3.5 w-3.5 text-[#FFD700]" />
            <span>DYNAMIC VISUAL NETWORK // DOMISLINK MIDNIGHT NAVY + GOLD</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-white font-bold tracking-tight">
            EVERYBODY IS INVOLVED IN AVIATION SAFETY
          </h2>

          <p className="text-sm sm:text-lg text-[#D4AF37] font-serif italic max-w-3xl mx-auto">
            "An accident does not select a tribe, profession, religion, company or social class."
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Explore how all 16 vital human, technical, civic, and moral sectors connect directly to the central mandate of <strong className="text-white">Aviation Safety</strong>. Click any node in the dynamic neural mesh to inspect their specific duty of care.
          </p>

          {/* Filter Bar and View Mode Switch */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {(['ALL', 'OPERATIONAL', 'GOVERNANCE', 'COMMUNITY', 'PUBLIC'] as const).map((grp) => (
              <button
                key={grp}
                onClick={() => setActiveGroupFilter(grp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all border ${
                  activeGroupFilter === grp
                    ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37] shadow-lg scale-105'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {grp === 'ALL' ? 'ALL 16 SECTORS' : grp}
              </button>
            ))}

            <div className="flex items-center border border-[#D4AF37]/50 rounded-lg overflow-hidden ml-1 sm:ml-2 bg-slate-900/90 shadow-md">
              <button
                onClick={() => setViewMode('ORBIT')}
                className={`px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                  viewMode === 'ORBIT' ? 'bg-[#D4AF37] text-[#0A192F]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Orbital Mesh
              </button>
              <button
                onClick={() => setViewMode('HANDS')}
                className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center space-x-1 transition-all ${
                  viewMode === 'HANDS' ? 'bg-[#D4AF37] text-[#0A192F]' : 'text-amber-300 hover:text-white'
                }`}
              >
                <HeartHandshake className="h-3.5 w-3.5 inline mr-1" />
                <span>Held Safe (Artwork)</span>
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={`px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                  viewMode === 'GRID' ? 'bg-[#D4AF37] text-[#0A192F]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Bento Matrix
              </button>
            </div>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all ml-1"
              title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            >
              {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-[#D4AF37]" />}
            </button>
          </div>
        </div>

        {/* Dynamic Display Area: Artwork (HANDS) OR Orbital Mesh OR Bento Matrix */}
        {viewMode === 'HANDS' ? (
          <AircraftHeldSafeVisual />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Canvas: Interactive Orbital SVG Neural Net (7 cols) */}
          <div className="lg:col-span-7 bg-[#071324] rounded-2xl border border-[#D4AF37]/35 p-4 sm:p-6 shadow-2xl relative flex items-center justify-center min-h-[480px] sm:min-h-[580px] overflow-hidden">
            
            {/* Background Radar Conduits */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[180px] h-[180px] rounded-full border border-[#D4AF37]/20"></div>
              <div className="w-[320px] h-[320px] rounded-full border border-dashed border-[#D4AF37]/15"></div>
              <div className="w-[460px] h-[460px] rounded-full border border-[#D4AF37]/10"></div>
              <div className="w-[560px] h-[560px] rounded-full border border-dashed border-slate-800"></div>
            </div>

            {viewMode === 'ORBIT' ? (
              <div className="relative w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] shrink-0">
                
                {/* SVG Connecting Vector Lines & Pulses */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
                  <defs>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="goldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#0A192F" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Connecting lines from every node to the center */}
                  {filteredNodes.map((node) => {
                    const angleRad = ((node.connectionAngle + rotationOffset) * Math.PI) / 180;
                    // Responsive scale factor: virtual coordinate system 600x600
                    const distance = node.ringDistance * 0.95;
                    const nx = center.x + distance * Math.cos(angleRad);
                    const ny = center.y + distance * Math.sin(angleRad);
                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;

                    return (
                      <g key={`line-${node.id}`}>
                        <line
                          x1={center.x}
                          y1={center.y}
                          x2={nx}
                          y2={ny}
                          stroke={isSelected || isHovered ? '#FFD700' : '#D4AF37'}
                          strokeWidth={isSelected || isHovered ? 2.5 : 1}
                          strokeOpacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.25}
                          strokeDasharray={isSelected ? 'none' : '4 4'}
                        />

                        {/* Animated traveling energy pulse */}
                        {(isSelected || isHovered || pulseCount % 2 === 0) && (
                          <circle
                            cx={center.x + (nx - center.x) * ((pulseCount % 10) / 10)}
                            cy={center.y + (ny - center.y) * ((pulseCount % 10) / 10)}
                            r={isSelected ? 3.5 : 2}
                            fill="#FFD700"
                            opacity={0.8}
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Central Hub: AVIATION SAFETY */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer"
                  onClick={() => setSelectedNodeId('faith-communities')}
                >
                  <div className="relative">
                    {/* Pulsing Aura */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] blur-md opacity-40 animate-ping"></div>
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#0A192F] via-[#050B1A] to-[#02050D] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center text-center p-2 transition-transform hover:scale-110">
                      <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-[#FFD700] mb-0.5 animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase leading-tight">
                        AVIATION
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-serif font-black text-white tracking-wider uppercase leading-tight">
                        SAFETY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Satellite Nodes */}
                {filteredNodes.map((node) => {
                  const angleRad = ((node.connectionAngle + rotationOffset) * Math.PI) / 180;
                  // In percentage coordinates inside container
                  const distancePct = (node.ringDistance / 300) * 42; // scaling factor
                  const xPct = 50 + distancePct * Math.cos(angleRad);
                  const yPct = 50 + distancePct * Math.sin(angleRad);
                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const IconComp = node.icon;

                  return (
                    <motion.div
                      key={node.id}
                      style={{
                        position: 'absolute',
                        left: `${xPct}%`,
                        top: `${yPct}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: isSelected ? 30 : 10
                      }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer group select-none"
                    >
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 border ${
                            isSelected
                              ? 'bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] text-[#0A192F] border-white shadow-[0_0_20px_rgba(255,215,0,0.6)] scale-125 font-bold'
                              : isHovered
                              ? 'bg-slate-800 text-white border-[#D4AF37] scale-110 shadow-lg'
                              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <IconComp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                        </div>

                        {/* Node Label */}
                        <div className={`mt-1 text-[8px] sm:text-[9px] font-mono tracking-wider font-bold whitespace-nowrap px-1.5 py-0.5 rounded transition-all ${
                          isSelected
                            ? 'bg-[#D4AF37] text-[#0A192F] shadow-md font-extrabold'
                            : 'bg-slate-950/80 text-slate-300 border border-slate-800'
                        }`}>
                          {node.name}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

              </div>
            ) : (
              /* Bento Matrix View for Quick Inspection */
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const IconComp = node.icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37] shadow-lg font-bold'
                          : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <IconComp className={`h-4 w-4 ${isSelected ? 'text-[#0A192F]' : 'text-[#D4AF37]'}`} />
                        <span className={`text-[8px] font-mono px-1 rounded ${
                          isSelected ? 'bg-[#0A192F] text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {node.categoryGroup}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-bold leading-tight">{node.name}</p>
                        <p className={`text-[9px] mt-0.5 font-mono truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                          {node.shortTag}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Orbit Telemetry Badge */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>MESH STATUS: ACTIVE CONVERGENCE</span>
              </span>
              <span className="text-[#D4AF37] font-bold">16 OF 16 SECTORS LINKED</span>
            </div>

          </div>

          {/* Right Panel: Selected Sector Dossier & Duty of Care (5 cols) */}
          <div className="lg:col-span-5 bg-[#071324] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header info */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {selectedNode.categoryGroup} SECTOR
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: #{selectedNode.id.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold flex items-center space-x-2 mt-2">
                  <span>{selectedNode.name}</span>
                </h3>
                <p className="text-xs text-[#D4AF37] font-mono font-semibold">
                  {selectedNode.shortTag}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-300 shrink-0 shadow-md">
                <selectedNode.icon className="h-6 w-6" />
              </div>
            </div>

            {/* Why Involved */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
              <p className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider flex items-center space-x-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Why They Connect Directly to Aviation Safety:</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                {selectedNode.whyInvolved}
              </p>
            </div>

            {/* Core Action & Risk Matrix */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg space-y-1">
                <p className="text-emerald-300 font-bold font-mono text-[10px] flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>PRIMARY SAFETY ACTION MANDATE:</span>
                </p>
                <p className="text-slate-300 text-xs">
                  {selectedNode.keyAction}
                </p>
              </div>

              <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg space-y-1">
                <p className="text-rose-300 font-bold font-mono text-[10px] flex items-center space-x-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>SYSTEMIC RISK IF THIS SECTOR IS IGNORED:</span>
                </p>
                <p className="text-slate-300 text-xs">
                  {selectedNode.riskIfIgnored}
                </p>
              </div>
            </div>

            {/* Special Highlight for Faith & Community Leaders */}
            {selectedNode.id === 'faith-communities' && (
              <div className="p-4 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-transparent border border-[#D4AF37]/50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-300 font-bold font-serif">
                  <Heart className="h-4 w-4 text-[#D4AF37]" />
                  <span>The Spiritual Shield & Ethical Conscience in Flight:</span>
                </div>
                <p className="text-slate-300 italic leading-relaxed text-[11px]">
                  "When turbulence strikes at night over storm clouds, every passenger, regardless of background, turns to prayer. Faith leaders remind us that safety is not just an engineering checklist—it is the sacred duty of preserving God-given human life."
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-amber-200">
                  <span>Supported Summit Roles:</span>
                  <span className="font-bold">Interfaith Safety Prayer / Special Guest</span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href="#stakeholders"
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all font-mono"
              >
                <span>Inspect Stakeholder Roster for {selectedNode.name}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

          </div>

        </div>
        )}

        {/* Dedicated Unity Visual Feature (Visible when not in direct HANDS mode) */}
        {viewMode !== 'HANDS' && (
          <div className="pt-8 border-t border-[#D4AF37]/20">
            <AircraftHeldSafeVisual />
          </div>
        )}

      </div>
    </div>
  );
}
