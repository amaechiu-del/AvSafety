/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Landmark, Users, CheckCircle } from 'lucide-react';

export default function GovernmentLeaders() {
  const govLeaders = [
    { name: 'H.E. Sen. Kashim Shettima', position: 'Vice President of Nigeria', group: 'Federal Administration' },
    { name: 'Festus Keyamo, SAN', position: 'Minister of Aviation and Aerospace Development', group: 'Federal Administration' },
    { name: 'Sen. Hadi Sirika', position: 'Former Minister of Aviation', group: 'Aviation Stalwarts' },
    { name: 'Capt. Chris Najomo', position: 'Director General, NCAA', group: 'Regulators & Oversight' },
    { name: 'C. Musa Nuhu', position: 'Managing Director, NAMA', group: 'Regulators & Oversight' },
    { name: 'Gov. Siminalayi Fubara', position: 'Executive Governor, Rivers State', group: 'Regional Administration' },
    { name: 'Prof. Mansur Bako', position: 'Director General, NiMET', group: 'Regulators & Oversight' },
    { name: 'Mrs. Olubunmi Kuku', position: 'Managing Director, FAAN', group: 'Airport Authority' }
  ];

  const industryLeaders = [
    { name: 'Aliko Dangote', position: 'President & CEO, Dangote Group', group: 'Industrial Growth' },
    { name: 'Mele Kyari', position: 'Group Chief Executive Officer, NNPC Limited', group: 'Energy Security' },
    { name: 'Osagie Okunbor', position: 'Managing Director, Shell Nigeria', group: 'Energy Security' },
    { name: 'Karl Toriola', position: 'CEO, MTN Nigeria', group: 'Technology Solutions' },
    { name: 'Roosevelt Ogbonna', position: 'MD/CEO, Access Holdings Plc', group: 'Banking & Finance' },
    { name: 'Segun Agbaje', position: 'Group CEO, GTCO Plc', group: 'Banking & Finance' },
    { name: 'Oliver Alawuba', position: 'Group MD/CEO, United Bank for Africa Plc', group: 'Banking & Finance' },
    { name: 'Olusegun Alebiosu', position: 'Managing Director/CEO, FirstBank Group', group: 'Banking & Finance' }
  ];

  return (
    <section id="leaders" className="py-24 bg-white border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">STATE & CORPORATE COALITION</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            GOVERNMENT & INDUSTRY LEADERS
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            A safe airspace requires synergy between sovereign policy authorities and high-capacity capital. We present the unified state-industry safety forum.
          </p>
        </div>

        {/* Structured Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Government & Regulators Block */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37]">
                <Landmark className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#0A192F] uppercase tracking-wider">
                Federal Government & Oversight Heads
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {govLeaders.map((lead, index) => (
                <div 
                  key={index}
                  className="p-4 bg-[#FCFBF7] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-xl transition-all duration-150 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded w-fit uppercase">
                      {lead.group}
                    </span>
                    <h4 className="text-xs font-serif font-extrabold text-[#0A192F]">{lead.name}</h4>
                    <p className="text-[11px] text-[#5A6E85] font-medium leading-relaxed">{lead.position}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-gray-400">
                    <span>PORTRAIT SLOT: GOV_0{index + 1}</span>
                    <span className="text-[#D4AF37]">● ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry & Corporate Executives Block */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-[#0A192F]/10 border border-[#0A192F]/20 rounded-lg text-[#0A192F]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#0A192F] uppercase tracking-wider">
                Industrial, Energy & Banking CEOs
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industryLeaders.map((lead, index) => (
                <div 
                  key={index}
                  className="p-4 bg-[#FCFBF7] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-xl transition-all duration-150 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded w-fit uppercase">
                      {lead.group}
                    </span>
                    <h4 className="text-xs font-serif font-extrabold text-[#0A192F]">{lead.name}</h4>
                    <p className="text-[11px] text-[#5A6E85] font-medium leading-relaxed">{lead.position}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-gray-400">
                    <span>PORTRAIT SLOT: IND_0{index + 1}</span>
                    <span className="text-[#D4AF37]">● ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
