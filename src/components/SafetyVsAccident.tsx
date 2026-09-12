/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, 
  ArrowDown, DollarSign, TrendingUp, Sparkles, Scale 
} from 'lucide-react';

export default function SafetyVsAccident() {
  const safetyPillars = [
    { title: 'Training & Practice', desc: 'Rigorous recurring flight deck, cabin crew, and ground team preparation.' },
    { title: 'Full Flight Simulation', desc: 'Safe rehearsal of compounding catastrophic failures without risking aircraft or passengers.' },
    { title: 'Airworthiness & Maintenance', desc: 'Strict pre-flight checks, genuine OEM spare parts, and zero-defect dispatch criteria.' },
    { title: 'Non-Punitive Reporting', desc: 'Safe reporting of near-misses through the Aviation Memo Challenge.' },
    { title: 'Professional Competence', desc: 'Continuous skills assessment and human factors / CRM mastery.' },
    { title: 'Predictive Technology', desc: 'Real-time telemetry, avionics upgrades, and satellite weather monitoring.' },
    { title: 'Total Preparedness', desc: 'Rapid airport rescue teams, clear checklists, and emergency plans.' }
  ];

  const mishapConsequences = [
    { title: 'Irreplaceable Loss of Life', desc: 'Passengers and crew lost to preventable mechanical or human oversights.' },
    { title: 'Profound Human Suffering', desc: 'Devastating lifetime emotional trauma for surviving families and loved ones.' },
    { title: 'Catastrophic Aircraft Damage', desc: 'Complete hull write-offs costing tens or hundreds of millions of dollars.' },
    { title: 'Severe Operational Disruption', desc: 'Grounded fleets, cancelled route schedules, and airport gridlock.' },
    { title: 'Protracted Legal & State Investigations', desc: 'Months of multi-agency probes, audit suspensions, and sanctions.' },
    { title: 'Crushing Financial Consequences', desc: 'Insurmountable insurance surcharges, passenger compensation lawsuits, and debt.' },
    { title: 'Irreparable Brand & Reputational Ruin', desc: 'Erosion of public trust that takes decades to recover—or closes airlines permanently.' }
  ];

  return (
    <section id="safety-vs-mishap" className="py-24 bg-white border-b border-[#D4AF37]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#AA7C11]">
            <Scale className="h-4 w-4 mr-1 text-[#D4AF37]" />
            THE HIGH-STAKES COMPARISON
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight uppercase">
            INVEST IN SAFETY <span className="text-[#8A99AD] font-light">VERSUS</span> PAY THE PRICE OF A MISHAP
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            The cost of preventing an accident through training, simulation, and modern maintenance is minor compared to the devastating human, operational, and financial aftermath of a single disaster.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Column 1: INVEST IN SAFETY (Emerald & Navy Theme) */}
          <div className="bg-[#FCFBF7] border-2 border-emerald-600/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-600/20">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold tracking-widest uppercase">PROACTIVE PATHWAY</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F] tracking-wide">
                      INVEST IN SAFETY
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  PREVENTION
                </span>
              </div>

              <div className="space-y-3.5">
                {safetyPillars.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-emerald-900/10 shadow-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#0A192F] font-sans">{item.title}</p>
                      <p className="text-[11px] text-[#5A6E85] font-light mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome Banner */}
            <div className="mt-8 pt-6 border-t border-emerald-600/20 text-center">
              <div className="flex items-center justify-center text-emerald-600 mb-2">
                <ArrowDown className="h-5 w-5 animate-bounce" />
              </div>
              <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md">
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-100">THE SYSTEM OUTCOME</p>
                <p className="text-lg font-serif font-extrabold tracking-wide uppercase mt-0.5">
                  LOWER RISK • RESILIENT AIRSPACE • BETTER PREPAREDNESS
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: PAY THE PRICE OF A MISHAP (Crimson & Dark Slate Theme) */}
          <div className="bg-[#0A192F] border-2 border-rose-600/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl text-white relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-xl">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold tracking-widest uppercase">REACTIVE CONSEQUENCE</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide">
                      PAY THE PRICE OF A MISHAP
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
                  CATASTROPHE
                </span>
              </div>

              <div className="space-y-3.5">
                {mishapConsequences.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <XCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-rose-200 font-sans">{item.title}</p>
                      <p className="text-[11px] text-[#8A99AD] font-light mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catastrophic Conclusion */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <div className="flex items-center justify-center text-rose-400 mb-2">
                <ArrowDown className="h-5 w-5 animate-bounce" />
              </div>
              <div className="p-4 bg-rose-600/90 text-white rounded-2xl shadow-md border border-rose-500/50">
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-rose-100">THE SYSTEM OUTCOME</p>
                <p className="text-lg font-serif font-extrabold tracking-wide uppercase mt-0.5">
                  HUMAN TRAGEDY • FINANCIAL RUIN • LOST TRUST
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom takeaway quote */}
        <div className="mt-12 p-6 bg-[#FCFBF7] border border-[#D4AF37]/30 rounded-2xl text-center max-w-4xl mx-auto shadow-sm">
          <p className="text-sm sm:text-base font-serif font-bold text-[#0A192F] uppercase tracking-wide">
            "If you think safety is expensive, try an accident."
          </p>
          <p className="text-xs text-[#5A6E85] mt-1 font-light">
            Aviation Safety Summit 2026 brings the funding, simulation technology, and operational will together so that no organisation ever pays the price of negligence.
          </p>
        </div>

      </div>
    </section>
  );
}
