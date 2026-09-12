/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Landmark, ShieldAlert, Edit2, Save, FileText, Check, HelpCircle, HardHat, PhoneCall } from 'lucide-react';
import { InvestmentOpportunity } from '../types';

interface InvestmentProps {
  investment: InvestmentOpportunity;
  onUpdateInvestment: (updated: InvestmentOpportunity) => void;
  isAdmin: boolean;
}

export default function SafetyInvestment({ investment, onUpdateInvestment, isAdmin }: InvestmentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<InvestmentOpportunity | null>(null);

  const handleStartEdit = () => {
    setIsEditing(true);
    setFormState({ ...investment });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormState(null);
  };

  const handleSave = () => {
    if (!formState) return;
    onUpdateInvestment(formState);
    setIsEditing(false);
    setFormState(null);
  };

  const resourceSectors = [
    { label: 'SIMULATION & FLIGHT TRAINING', desc: 'Acquisition and update of high-fidelity FFS Level D simulators to run flight scenarios.' },
    { label: 'MAINTENANCE & ENGINE HARDWARE', desc: 'Direct tooling support for local overhaul, engine checks, and components diagnostics.' },
    { label: 'PREDICTIVE TELEMETRY & CLOUD SYSTEM', desc: 'Deploying ADS-B receivers, smart flight data recorders, and high-speed weather telemetry.' },
    { label: 'AIRFIELD INFRASTRUCTURE & ILS', desc: 'Installation of advanced landing lights, meteorological sensors, and Category III ILS.' }
  ];

  return (
    <section id="investment" className="py-24 bg-white border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">RESOURCE ALIGNMENT</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            SAFETY INVESTMENT SESSION
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-base sm:text-lg font-serif font-bold text-[#0A192F] tracking-wide uppercase">
            MAKE SAFETY EASIER TO ACHIEVE
          </p>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            Aviation safety is not free. Cheaper training, compromised fuel sourcing, and outdated radar hardware are early pathways to emergency reports. Safe operations require structured capital and continuous funding.
          </p>
        </div>

        {/* Two-Column split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          
          {/* Resource Sectors Description */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0A192F] tracking-wide uppercase">
              STRATEGIC RESOURCE DEMANDS
            </h3>
            <p className="text-sm text-[#5A6E85] leading-relaxed font-light">
              This summit brings together institutional capital, commercial banks, public treasuries, and development partners to structure long-term liquidity for safety equipment. Key discussion sectors include:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resourceSectors.map((sector, index) => (
                <div 
                  key={index}
                  className="p-4 bg-[#FCFBF7] border border-[#D4AF37]/10 rounded-xl space-y-1"
                >
                  <h4 className="text-xs font-serif font-bold text-[#0A192F] uppercase tracking-wider">
                    {sector.label}
                  </h4>
                  <p className="text-[11px] text-[#5A6E85] leading-relaxed font-light">
                    {sector.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#0A192F] text-white rounded-xl border border-[#D4AF37]/20 flex items-start space-x-3.5">
              <div className="p-2 bg-[#D4AF37]/25 text-[#D4AF37] rounded-lg mt-0.5">
                <HardHat className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Public & Investor Participation
                </h4>
                <p className="text-xs text-[#8A99AD] leading-relaxed font-light mt-1">
                  Private investment is vital to scale training academies and simulator accessibility. All accredited institutional investors and delegates can participate in structuring safety-linked infrastructure bonds.
                </p>
              </div>
            </div>
          </div>

          {/* Editable Investment Opportunity Frame (CMS ready!) */}
          <div className="bg-[#FCFBF7] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <Landmark className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-xs font-bold text-[#0A192F] uppercase tracking-widest font-mono">
                  VERIFIED SHARE OPPORTUNITY LOG
                </h3>
              </div>
              {isAdmin && !isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="px-2.5 py-1 text-[10px] bg-white border border-[#D4AF37] text-[#D4AF37] rounded font-bold hover:bg-[#D4AF37] hover:text-white transition-colors"
                >
                  EDIT VALUE
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 text-xs text-[#0A192F]">
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Issuing Company</label>
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800"
                    value={formState?.company || ''}
                    onChange={(e) => setFormState(prev => prev ? { ...prev, company: e.target.value } : null)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Opportunity Title</label>
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800 font-bold"
                    value={formState?.opportunity || ''}
                    onChange={(e) => setFormState(prev => prev ? { ...prev, opportunity: e.target.value } : null)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Investment Description</label>
                  <textarea
                    rows={3}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800"
                    value={formState?.description || ''}
                    onChange={(e) => setFormState(prev => prev ? { ...prev, description: e.target.value } : null)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Minimum Investment</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800"
                      value={formState?.minimumInvestment || ''}
                      onChange={(e) => setFormState(prev => prev ? { ...prev, minimumInvestment: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Offer Period</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800"
                      value={formState?.offerPeriod || ''}
                      onChange={(e) => setFormState(prev => prev ? { ...prev, offerPeriod: e.target.value } : null)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Regulatory/SEC Information</label>
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800"
                    value={formState?.regulatoryInfo || ''}
                    onChange={(e) => setFormState(prev => prev ? { ...prev, regulatoryInfo: e.target.value } : null)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Official Contacts</label>
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800"
                    value={formState?.officialContact || ''}
                    onChange={(e) => setFormState(prev => prev ? { ...prev, officialContact: e.target.value } : null)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Official Documentation Link</label>
                  <input
                    type="text"
                    className="w-full text-xs p-2.5 border border-gray-300 rounded bg-white text-gray-800"
                    value={formState?.officialDocumentation || ''}
                    onChange={(e) => setFormState(prev => prev ? { ...prev, officialDocumentation: e.target.value } : null)}
                  />
                </div>

                <div className="flex items-center space-x-2 justify-end pt-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 bg-[#D4AF37] text-white rounded font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Issuing Body</p>
                  <h4 className="text-sm font-serif font-black text-[#0A192F] uppercase">
                    {investment.company}
                  </h4>
                  <p className="text-xs font-bold text-[#D4AF37]">{investment.opportunity}</p>
                </div>

                <p className="text-xs text-[#5A6E85] leading-relaxed font-light italic bg-white p-3 rounded-lg border border-[#D4AF37]/10">
                  "{investment.description}"
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-t border-dashed border-[#D4AF37]/20">
                  <div>
                    <p className="text-[8px] font-mono text-gray-400 uppercase">Minimum Investment</p>
                    <p className="font-bold text-[#0A192F]">{investment.minimumInvestment}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-mono text-gray-400 uppercase">Offer Period</p>
                    <p className="font-bold text-[#0A192F]">{investment.offerPeriod}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-gray-150 rounded-lg space-y-1.5">
                  <div className="flex items-center text-[10px] font-bold text-[#0A192F]">
                    <FileText className="h-3.5 w-3.5 mr-1 text-[#D4AF37]" />
                    REGULATORY DISCLOSURE
                  </div>
                  <p className="text-[9px] text-[#5A6E85] leading-relaxed">
                    {investment.regulatoryInfo}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-between text-xs text-[#5A6E85] font-mono">
                  <div className="flex items-center">
                    <PhoneCall className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                    <span>Contact: {investment.officialContact}</span>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] font-semibold">{investment.officialDocumentation}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Warning Notice */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-2xl mx-auto flex items-start space-x-3.5">
          <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-gray-600 leading-relaxed font-light">
            <strong className="text-amber-800 font-bold uppercase block mb-0.5">IMPORTANT INVESTMENT NOTICE</strong>
            The summit organizes a forum for structural resource discussions and does not make or issue guaranteed financial return claims. All investment programs are subject to strict financial regulation, compliance clearances, and formal vetting by sovereign authorities.
          </div>
        </div>

      </div>
    </section>
  );
}
