/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Cpu, Shield, GraduationCap, HardDrive, DollarSign, ArrowRight, Heart } from 'lucide-react';

export default function About() {
  const platforms = [
    { label: 'Knowledge Sharing', desc: 'Sharing practical frameworks, everyday methods, and accident lessons across all aviation sectors.' },
    { label: 'Real Experience', desc: 'Helping experienced professionals pass down valuable lessons to prevent costly mistakes.' },
    { label: 'Open Discussion', desc: 'Creating open, blame-free talks to fix daily problems in rules and flight operations.' },
    { label: 'Technology & Tools', desc: 'Exploring modern flight tools, artificial intelligence, and cockpit automation systems.' },
    { label: 'Training & Practice', desc: 'Using flight simulators so pilots and crews can practice and learn safely from mistakes.' },
    { label: 'Smart Investment', desc: 'Helping companies and governments put money into better airport equipment and safety gear.' },
    { label: 'Teamwork', desc: 'Bringing together airlines, airports, tech groups, and fuel suppliers into one safety team.' },
    { label: 'Learning from Incidents', desc: 'Encouraging everyone to report near-misses honestly so the whole industry learns.' }
  ];

  const formulaItems = [
    { icon: <Users className="h-6 w-6 text-[#D4AF37]" />, text: 'PEOPLE', label: 'Trained Team' },
    { icon: <Cpu className="h-6 w-6 text-[#1E3A8A]" />, text: 'TECHNOLOGY', label: 'Modern Tools' },
    { icon: <GraduationCap className="h-6 w-6 text-[#1E3A8A]" />, text: 'TRAINING', label: 'Continuous Practice' },
    { icon: <Shield className="h-6 w-6 text-[#D4AF37]" />, text: 'REGULATION', label: 'Clear Standards' },
    { icon: <HardDrive className="h-6 w-6 text-[#1E3A8A]" />, text: 'INFRASTRUCTURE', label: 'Safe Airports' },
    { icon: <DollarSign className="h-6 w-6 text-[#D4AF37]" />, text: 'INVESTMENT', label: 'Resources' }
  ];

  return (
    <section id="about" className="py-24 bg-white border-y border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">OUR MISSION</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            WHY THE SUMMIT EXISTS
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-base sm:text-lg text-[#5A6E85] font-light leading-relaxed">
            Aviation safety is a team effort. If one link fails, everyone is affected. The Aviation Safety Summit 2026 brings everyone together to learn, share solutions, and keep air travel safe for all.
          </p>
        </div>

        {/* Content Splitting Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Text Block */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0A192F] tracking-wide">
              BRINGING AVIATION PROFESSIONALS TOGETHER
            </h3>
            <p className="text-[#5A6E85] leading-relaxed text-sm sm:text-base font-light">
              We believe in one simple truth: <strong className="text-[#0A192F] font-semibold">An airplane accident does not choose tribe, job, company, wealth, or nationality.</strong> Passengers place their lives in the hands of a system that must work together perfectly.
            </p>
            <p className="text-[#5A6E85] leading-relaxed text-sm sm:text-base font-light">
              Safety is never just the captain's job. It depends on a complete chain of managers, engineers, fuel suppliers, ground crew, air traffic controllers, and regulators. We meet to discuss, fix, and improve:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {platforms.map((p, idx) => (
                <div key={idx} className="p-4 bg-[#FCFBF7] hover:bg-[#F3E5AB]/10 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-lg transition-all duration-200">
                  <h4 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-1 flex items-center">
                    <span className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full mr-2"></span>
                    {p.label}
                  </h4>
                  <p className="text-xs text-[#5A6E85] leading-relaxed font-light">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Formula Block (Mandated) */}
          <div className="space-y-6">
            <div className="bg-[#0A192F] p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-full"></div>
              
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#D4AF37] tracking-wider uppercase mb-6 text-center">
                THE AVIATION SAFETY FORMULA
              </h3>

              <div className="flex flex-col space-y-4">
                {formulaItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2 bg-white/10 rounded-lg border border-white/10">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs text-[#8A99AD] font-mono tracking-wider">{item.label}</p>
                          <p className="text-sm font-bold text-white tracking-wide">{item.text}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#D4AF37] font-semibold">PART 0{index + 1}</span>
                    </div>
                    {index < formulaItems.length - 1 && (
                      <div className="flex justify-center text-[#D4AF37] font-mono text-lg font-bold py-1">
                        +
                      </div>
                    )}
                  </React.Fragment>
                ))}

                <div className="flex justify-center text-[#D4AF37] font-mono text-xl font-bold py-2">
                  =
                </div>

                <div className="p-5 bg-gradient-to-r from-[#D4AF37] to-[#B89025] rounded-xl border border-[#D4AF37]/30 shadow-lg text-[#0A192F] text-center">
                  <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#0A192F]/70">OUR GOAL</p>
                  <p className="text-lg font-serif font-black tracking-widest uppercase">SAFER AVIATION</p>
                  <p className="text-xs mt-1 font-sans text-[#0A192F]/80 font-medium">Protecting passengers, crew, aircraft, and everyday flight operations</p>
                </div>
              </div>
            </div>
            
            {/* Safe Skies Insight Label */}
            <div className="p-4 bg-[#FCFBF7] border border-[#D4AF37]/15 rounded-xl flex items-start space-x-3">
              <div className="p-2 bg-amber-500/10 text-[#AA7C11] rounded font-semibold text-xs mt-0.5">NOTE</div>
              <p className="text-xs text-[#5A6E85] leading-relaxed font-light">
                Every part matters. If even one area is weak—like bad fuel checks or outdated training—the safety of the whole flight is at risk.
              </p>
            </div>
          </div>

        </div>

        {/* Organizer Leadership & Founder's Vision */}
        <div className="mt-20 border-t border-[#D4AF37]/15 pt-16">
          <div className="bg-[#0A192F] rounded-2xl border border-[#D4AF37]/25 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              
              {/* Left Profile Section */}
              <div className="md:col-span-4 bg-[#050C17] p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-[#D4AF37]/20 relative">
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[8px] font-mono tracking-wider font-bold uppercase">
                    ORGANIZER & CONVENER
                  </span>
                </div>
                
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 to-[#0A192F] border-2 border-[#D4AF37] flex items-center justify-center font-serif font-black text-3xl text-[#D4AF37] mb-4 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                  AU
                </div>
                
                <h4 className="text-xl font-serif font-black text-white uppercase tracking-wide">
                  AMAECHI UBADIKE
                </h4>
                <p className="text-xs text-[#D4AF37] font-mono mt-1 font-bold">FOUNDER & CEO</p>
                <p className="text-[11px] text-slate-300 font-medium">DomisLink International Services Ltd</p>
                
                <div className="w-full border-t border-white/10 mt-6 pt-4 space-y-1.5 text-left text-xs text-slate-300 font-sans">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-1">PROVEN AIRSPACE EXPERTISE:</p>
                  <p>• Commercial Pilot Licence (CPL)</p>
                  <p>• Radar Air Traffic Controller (ATC)</p>
                  <p>• Civil Aviation Safety Inspector (PEL)</p>
                  <p>• Author, <em>"Cleared for Takeoff"</em></p>
                </div>
              </div>

              {/* Right Message Section */}
              <div className="md:col-span-8 p-8 sm:p-10 flex flex-col justify-center space-y-4">
                <h3 className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                  FOUNDER'S VISIONARY STATEMENT
                </h3>
                <h4 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-snug">
                  "Safe Skies Are Built on Absolute Vigilance and Shared Responsibility"
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  "As the Founder and CEO of DomisLink International Services Ltd and convener of the Aviation Safety Summit 2026, my mission is to bridge the critical operational realities of the tarmac with strategic boardroom leadership. Aviation safety is not a single achievement we record once and celebrate forever; it is a relentless, hourly discipline."
                </p>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  "Through my years as a commercial pilot, radar controller, and safety inspector, I have learned that the safety of our skies is an unbroken chain. Every controller, pilot, engineer, and executive holds a link. This summit is our collective commitment to keeping that chain unbreakable."
                </p>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#D4AF37] font-mono font-bold">
                  <span>DOMISLINK INTERNATIONAL SERVICES LTD</span>
                  <span className="text-white/40">★ 2026 SAFETY MANDATE ★</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
