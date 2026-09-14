/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowDown, ShieldCheck, Target, RefreshCw, AlertOctagon, 
  Wrench, TrendingUp, Award, HeartHandshake, BookOpen, 
  Flame, Compass, Cpu, CheckCircle2, Sliders, Layers, 
  Zap, Clock, Sparkles, ChevronRight, UserCheck, ShieldAlert,
  Info
} from 'lucide-react';

export default function SimulationTraining() {
  const [activeTab, setActiveTab] = useState<'all' | 'operations' | 'human-factors' | 'scenarios'>('all');
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // Instructional Visual Loop Steps (Strictly following the mandated sequence)
  const instructionalFlow = [
    {
      step: 1,
      title: 'TRAIN',
      short: 'System theory & aerodynamics',
      detail: 'Foundational ground schooling, systems architecture briefings, standard aircraft limitations, and flight manual procedures prior to deck entry.',
      icon: <BookOpen className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'Pre-flight technical briefing and operational boundary analysis.'
    },
    {
      step: 2,
      title: 'PRACTICE',
      short: 'Hands-on simulator execution',
      detail: 'Active manipulation of controls, switch selections, avionics programming, and flight path management in high-fidelity simulated environments.',
      icon: <Target className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'Translating written SOPs into physical control inputs and checklist cadence.'
    },
    {
      step: 3,
      title: 'REPEAT',
      short: 'Iterative scenario exposure',
      detail: 'Executing maneuvers multiple times under varying weather, gross weight, and center-of-gravity configurations until responses become procedural instinct.',
      icon: <RefreshCw className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'Eliminating hesitation through controlled, iterative repetitions.'
    },
    {
      step: 4,
      title: 'IDENTIFY ERRORS',
      short: 'Telemetry telemetry & debrief review',
      detail: 'Reviewing flight data recorder playbacks, deviation logs, altitude captures, and cockpit voice communication coordination with instructors.',
      icon: <AlertOctagon className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'Uncovering latent misinterpretations, CRM lapses, or delayed reactions.'
    },
    {
      step: 5,
      title: 'CORRECT',
      short: 'Targeted remediation',
      detail: 'Re-flying specific approach segments, adjusting control cross-checks, re-calibrating flare height recognition, and refining scan patterns.',
      icon: <Wrench className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'Targeted correction before procedural discrepancies become ingrained habits.'
    },
    {
      step: 6,
      title: 'UPDATE SKILLS',
      short: 'Modernization & type nuances',
      detail: 'Integrating updated flight management software revisions, modified departure routings, OEM service bulletins, and evolving regulatory mandates.',
      icon: <TrendingUp className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'Keeping crew competencies in lockstep with advancing flight deck technology.'
    },
    {
      step: 7,
      title: 'BUILD COMPETENCE',
      short: 'Mastery under operational stress',
      detail: 'Consolidating technical precision with sound aeronautical decision-making, threat mitigation, and effective crew resource management.',
      icon: <Award className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'Achieving consistent, dependable proficiency across standard and non-normal regimes.'
    },
    {
      step: 8,
      title: 'IMPROVE SAFETY',
      short: 'Zero-accident flight operations',
      detail: 'Delivering passengers, cargo, and aircraft reliably by deploying calm, verified, and thoroughly rehearsed flight deck reactions in the real world.',
      icon: <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />,
      actionContext: 'The ultimate summit objective: preserving life through uncompromising preparation.'
    }
  ];

  // The 8 Mandated Discussions
  const discussionPillars = [
    {
      id: 'recurrent-training',
      category: 'operations',
      title: 'Recurrent Training',
      subtitle: 'Sustaining Currency & Regulatory Compliance',
      icon: <Clock className="h-5 w-5 text-[#D4AF37]" />,
      description: 'Aviation authorities require commercial flight crew and air traffic controllers to undergo periodic evaluations at established regulatory intervals. Rather than taking commercial airliners out of service, high-fidelity Full Flight Simulators (Level D) facilitate complete recurrent checks, instrument rating renewals, and type rating endorsements under standardized, reproducible assessment criteria.'
    },
    {
      id: 'emergency-scenarios',
      category: 'operations',
      title: 'Emergency Scenarios',
      subtitle: 'Critical Malfunctions Without Physical Risk',
      icon: <Flame className="h-5 w-5 text-[#D4AF37]" />,
      description: 'Catastrophic failures—such as dual engine flameouts at low altitude, severe uncontained engine fires, complete hydraulic system depletion, explosive cabin decompression, or extreme windshear on short final—cannot be safely initiated in an actual aircraft carrying occupants. Simulators allow flight crews to confront extreme compounding emergencies, test memory items, and master checklist discipline in an environment where mistakes cause no physical injury or asset loss.'
    },
    {
      id: 'procedural-practice',
      category: 'operations',
      title: 'Procedural Practice',
      subtitle: 'Standard Operating Procedures & Discipline',
      icon: <Layers className="h-5 w-5 text-[#D4AF37]" />,
      description: 'Flight decks run on rigid Standard Operating Procedures (SOPs). Simulators enable pilots to practice callouts, cross-monitoring, flight director modes, instrument approaches (CAT II/III ILS, RNP-AR), and rejected takeoff (RTO) procedures until cooperation between Captain and First Officer becomes seamless and synchronized.'
    },
    {
      id: 'slow-learners',
      category: 'human-factors',
      title: 'Slow Learners',
      subtitle: 'Pacing, Pause, & Pressure-Free Repetition',
      icon: <UserCheck className="h-5 w-5 text-[#D4AF37]" />,
      description: 'Different individuals assimilate spatial, manual, and cognitive procedures at varying speeds. In real revenue flights, schedule pressures and fuel costs discourage pedagogical patience. Simulators permit instructors to pause the flight freeze, reposition the aircraft to the 5-mile final approach fix in one second, review mistakes constructively, and allow trainees to repeat tasks until mastery is attained without embarrassment or commercial penalty.'
    },
    {
      id: 'experimental-scenarios',
      category: 'scenarios',
      title: 'Experimental Scenarios',
      subtitle: 'Novel Route Prototyping & Edge Conditions',
      icon: <Compass className="h-5 w-5 text-[#D4AF37]" />,
      description: 'Airlines expanding into complex, high-altitude, or terrain-challenged aerodromes (such as mountain valley approaches or non-standard runway configurations) can model exact terrain profiles, obstacles, and localized micro-climates in simulation before launching revenue operations. Furthermore, researchers and test pilots evaluate new avionics suites, autopilot control logic, and wake turbulence scenarios without flight test hazards.'
    },
    {
      id: 'skill-updates',
      category: 'operations',
      title: 'Skill Updates',
      subtitle: 'Fleet Modernization & Software Revisions',
      icon: <Cpu className="h-5 w-5 text-[#D4AF37]" />,
      description: 'As aircraft manufacturers push software avionics updates, revised flight control laws, electronic flight bag (EFB) workflows, and NextGen navigation enhancements, line pilots require targeted transition training. Simulators provide an exact replica of updated systems, preventing automation confusion and mode awareness errors in active airspace.'
    },
    {
      id: 'competence-development',
      category: 'human-factors',
      title: 'Competence Development',
      subtitle: 'Threat & Error Management Under Cognitive Load',
      icon: <Award className="h-5 w-5 text-[#D4AF37]" />,
      description: 'Aviation competence is not merely manipulating sticks and rudders; it is the synthesis of situational awareness, workload distribution, assertive communication, and sound judgment under stress. Simulator sessions subject crews to multi-layered stressors—unfavorable weather, passenger medical emergencies, diversion decisions, and fuel calculations—to build robust Threat and Error Management (TEM) capability.'
    },
    {
      id: 'confidence-building',
      category: 'human-factors',
      title: 'Confidence Building',
      subtitle: 'Replacing Anxiety with Rehearsed Precision',
      icon: <HeartHandshake className="h-5 w-5 text-[#D4AF37]" />,
      description: 'Flight crew hesitation during unexpected anomalies can lead to unstable approaches or missed execution. By encountering and resolving hundreds of non-normal events in simulation, aviators replace uncertainty with muscle memory and calm decisiveness. When an alert chime sounds at 35,000 feet, the crew has already solved the identical problem repeatedly on the ground.'
    }
  ];

  const filteredPillars = activeTab === 'all' 
    ? discussionPillars 
    : discussionPillars.filter(p => p.category === activeTab);

  return (
    <section id="simulation" className="py-24 bg-[#FCFBF7] border-b border-[#D4AF37]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <div className="bg-[#0A192F] text-white rounded-3xl border border-[#D4AF37]/30 p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden mb-16">
          {/* Subtle gold grid & ambient gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
          <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-mono font-bold tracking-widest uppercase rounded-full">
                AVIATION TECHNICAL DOMAIN
              </span>
              <span className="px-3 py-1 bg-white/10 text-slate-300 border border-white/20 text-[9px] font-mono tracking-widest uppercase rounded-full">
                ICAO / NCAA TRAINING ALIGNMENT
              </span>
            </div>

            {/* MANDATED HERO STATEMENTS */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white uppercase leading-none">
                SIM SAVES FUEL.
              </h1>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#D4AF37] uppercase leading-none">
                SIM SAVES DOLLARS.
              </h1>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white uppercase leading-none">
                SIM SAVES LIVES.
              </h1>
            </div>

            <div className="h-1 w-24 bg-[#D4AF37]"></div>

            {/* MANDATED CORE EXPLANATION */}
            <div className="p-5 sm:p-6 bg-white/5 border-l-4 border-[#D4AF37] rounded-r-xl max-w-3xl backdrop-blur-sm">
              <p className="text-base sm:text-lg text-slate-200 font-serif leading-relaxed italic">
                "Simulation allows aviation professionals to practise situations without exposing passengers or aircraft to real-world operational consequences."
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-3xl">
              Modern aviation achieves extraordinary safety records because the flight deck is treated as an operational environment, not an experimental classroom. High-fidelity synthetic training devices transfer dangerous, complex, and resource-intensive scenarios from active airspace into engineered, zero-risk simulator bays.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INSTRUCTIONAL VISUAL FLOW */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-10 shadow-lg mb-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase bg-[#0A192F] px-3 py-1 rounded-full inline-block">
              INSTRUCTIONAL PROGRESSION MODEL
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#0A192F] tracking-tight uppercase">
              The Path from Training to Operational Safety
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6E85] font-light leading-relaxed">
              Every professional aviator and controller progresses through a continuous, closed-loop instructional cycle. Click any stage to inspect its operational focus.
            </p>
          </div>

          {/* Stepper Flow Grid (Responsive Vertical on mobile, progressive chain on desktop) */}
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {instructionalFlow.map((item, index) => {
              const isSelected = selectedStep === item.step;
              const isLast = index === instructionalFlow.length - 1;

              return (
                <div key={item.step} className="flex flex-col items-center">
                  {/* Step Card */}
                  <div 
                    onClick={() => setSelectedStep(isSelected ? null : item.step)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex items-start sm:items-center justify-between gap-4 ${
                      isSelected 
                        ? 'bg-[#0A192F] text-white border-[#D4AF37] shadow-xl' 
                        : isLast 
                          ? 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-500' 
                          : 'bg-[#FCFBF7] border-gray-200 hover:border-[#D4AF37]/60 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                      {/* Step Indicator Badge */}
                      <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-inner ${
                        isSelected 
                          ? 'bg-[#D4AF37] text-[#0A192F]' 
                          : isLast 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-[#0A192F] text-[#D4AF37]'
                      }`}>
                        {item.step}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base sm:text-lg font-mono font-black tracking-wider uppercase ${
                            isSelected ? 'text-[#D4AF37]' : isLast ? 'text-emerald-800' : 'text-[#0A192F]'
                          }`}>
                            {item.title}
                          </h3>
                          <span className={`text-[10px] font-mono uppercase tracking-widest hidden sm:inline-block px-2 py-0.5 rounded ${
                            isSelected ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {item.short}
                          </span>
                        </div>
                        <p className={`text-xs sm:text-sm font-light leading-snug ${
                          isSelected ? 'text-slate-200' : 'text-gray-600'
                        }`}>
                          {item.detail}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <ChevronRight className={`h-5 w-5 transition-transform ${
                        isSelected ? 'rotate-90 text-[#D4AF37]' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>

                  {/* Expanded Operational Context Drawer */}
                  {isSelected && (
                    <div className="w-full mt-2 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1 animate-fadeIn">
                      <p className="font-mono uppercase font-bold text-[10px] tracking-wider text-[#AA7C11]">
                        Operational Significance:
                      </p>
                      <p className="font-light leading-relaxed">
                        {item.actionContext}
                      </p>
                    </div>
                  )}

                  {/* Mandated Downward Flow Arrow */}
                  {!isLast && (
                    <div className="my-1.5 sm:my-2 flex items-center justify-center">
                      <div className="p-1.5 rounded-full bg-[#FCFBF7] border border-[#D4AF37]/30 text-[#D4AF37] shadow-sm">
                        <ArrowDown className="h-4 w-4 stroke-[2.5]" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[11px] font-mono uppercase text-gray-500 tracking-wider">
              Iterative Closed Loop • Applied in Type Rating, Recurrent Checks, & Command Upgrades
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE DISCUSSION PILLARS */}
        {/* ========================================================================= */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                CRITICAL VALUE DIMENSIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F] tracking-tight uppercase">
                Operational Pillars of Aviation Simulation
              </h2>
            </div>

            {/* Category Filter Controls */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                  activeTab === 'all' 
                    ? 'bg-[#0A192F] text-white shadow' 
                    : 'bg-white text-[#5A6E85] border border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                All (8 Pillars)
              </button>
              <button
                onClick={() => setActiveTab('operations')}
                className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                  activeTab === 'operations' 
                    ? 'bg-[#0A192F] text-white shadow' 
                    : 'bg-white text-[#5A6E85] border border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                Flight Deck Operations
              </button>
              <button
                onClick={() => setActiveTab('human-factors')}
                className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                  activeTab === 'human-factors' 
                    ? 'bg-[#0A192F] text-white shadow' 
                    : 'bg-white text-[#5A6E85] border border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                Human Factors & Pedagogy
              </button>
              <button
                onClick={() => setActiveTab('scenarios')}
                className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                  activeTab === 'scenarios' 
                    ? 'bg-[#0A192F] text-white shadow' 
                    : 'bg-white text-[#5A6E85] border border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                Edge Scenarios
              </button>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredPillars.map((pillar) => (
              <div 
                key={pillar.id}
                className="bg-white border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-[#0A192F] rounded-xl text-[#D4AF37] border border-[#D4AF37]/30">
                      {pillar.icon}
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#AA7C11] font-bold bg-amber-50 px-2.5 py-1 rounded border border-[#D4AF37]/20">
                      {pillar.category === 'operations' ? 'Flight Operations' : pillar.category === 'human-factors' ? 'Human Factors' : 'Research & Edge Cases'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-black text-[#0A192F] tracking-tight uppercase">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-mono text-[#D4AF37] font-semibold mt-0.5 uppercase tracking-wider">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <div className="h-px bg-gray-100"></div>

                  <p className="text-xs sm:text-sm text-[#5A6E85] font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase">
                  <span>Professional Standard</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified Training Practice
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SIMULATOR FIDELITY & REGULATORY COMPARISON REFERENCE */}
        {/* ========================================================================= */}
        <div className="mt-16 bg-[#0A192F] text-white rounded-2xl border border-[#D4AF37]/20 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                TECHNICAL BENCHMARK
              </span>
              <h3 className="text-lg font-serif font-bold uppercase text-white">
                Fidelity Classification Standards
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-light max-w-md">
              Training credits correlate directly to certified simulation fidelity levels approved by regulatory authorities (ICAO Doc 9625).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-light">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <span className="font-mono text-[#D4AF37] font-bold text-xs uppercase block">LEVEL D FFS</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Full visual cueing, 6-degrees-of-freedom motion platform, and high-fidelity sound modeling. Approved for Zero Flight Time Training (ZFTT).
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <span className="font-mono text-[#D4AF37] font-bold text-xs uppercase block">FTD LEVEL 4–7</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Replicates full cockpit hardware and flight aerodynamics without motion. Ideal for systems exploration, checklist drills, and navigation procedures.
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <span className="font-mono text-[#D4AF37] font-bold text-xs uppercase block">FMS & AVIONICS TRAINERS</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Desktop and touchscreen flight management systems training for programming departures, arrivals, fuel reserves, and airway transitions.
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <span className="font-mono text-[#D4AF37] font-bold text-xs uppercase block">ATC RADAR SIMULATORS</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Multi-position radar emulation for tower, terminal, and en-route controllers to drill airspace separation, emergency vectoring, and runway incursions.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
