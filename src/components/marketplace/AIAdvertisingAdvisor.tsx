/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Bot, Send, ArrowRight, ShieldCheck, CheckCircle2, 
  HelpCircle, RefreshCw, ShoppingCart, Award, Layers, Zap, Info
} from 'lucide-react';
import { AdPosition, SponsorshipPackage } from '../../types';

interface AIAdvertisingAdvisorProps {
  onAddToCart: (position: AdPosition, quantity?: number) => void;
  onSelectPackage: (pkg: SponsorshipPackage) => void;
  currency: 'NGN' | 'USD';
}

export default function AIAdvertisingAdvisor({
  onAddToCart,
  onSelectPackage,
  currency
}: AIAdvertisingAdvisorProps) {
  const [organisation, setOrganisation] = useState('');
  const [companyType, setCompanyType] = useState('Airlines & Commercial Aviation');
  const [promotionGoal, setPromotionGoal] = useState('Brand Leadership & Executive Visibility');
  const [targetAudience, setTargetAudience] = useState('All 500+ Attending Executives & Regulators');
  const [estimatedBudget, setEstimatedBudget] = useState('₦3,000,000 – ₦10,000,000');
  const [customMessage, setCustomMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);

  const quickPrompts = [
    {
      label: 'Airline Executive Presence',
      org: 'Premier West African Airline',
      type: 'Airlines & Commercial Aviation',
      goal: 'Brand Leadership & VIP Presence',
      msg: 'We want maximum executive visibility including airport shuttle branding, stage video, and VIP gala table.'
    },
    {
      label: 'Flight Simulation & Training',
      org: 'Aviation Flight Simulator Academy',
      type: 'Flight Training & Simulation',
      goal: 'Product / Hardware Showcase',
      msg: 'We have flight simulator equipment to demonstrate in the main foyer and want title sponsorship of the Simulation Session.'
    },
    {
      label: 'Banking & Aviation Finance',
      org: 'Pan-African Investment Bank',
      type: 'Banking, Finance & Insurance',
      goal: 'Dealmaking & High-Value B2B',
      msg: 'We want Platinum or Gold tier sponsorship with prime speaking time on the Safety Investment panel.'
    },
    {
      label: 'Delegate Hydration & Water',
      org: 'Natural Mineral Spring Water Brand',
      type: 'Food, Beverage & Catering',
      goal: '100% Attendee Touchpoint',
      msg: 'We want to sponsor all branded bottled water and coffee break refreshments for the 500 delegates.'
    }
  ];

  const handleApplyPreset = (preset: typeof quickPrompts[0]) => {
    setOrganisation(preset.org);
    setCompanyType(preset.type);
    setPromotionGoal(preset.goal);
    setCustomMessage(preset.msg);
  };

  const handleGenerateRecommendations = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setRecommendationResult(null);

    try {
      const res = await fetch('/api/marketplace/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organisation: organisation || 'Aviation Partner',
          promotionGoal: `${companyType} — ${promotionGoal}`,
          targetAudience,
          estimatedBudget,
          message: customMessage || `Recommend optimal summit advertising positions for our organization`,
          currency
        })
      });

      const data = await res.json();
      const payload = data.data || data;
      if (data.success) {
        setRecommendationResult(payload);
      }
    } catch (err) {
      console.error('AI recommendation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currencySymbol = currency === 'USD' ? '$' : '₦';

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-[#0A192F] to-slate-950 rounded-2xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shrink-0 mt-0.5">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white font-serif tracking-wide">
                  AI Commercial Sponsorship & Advertising Advisor
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  GEMINI-POWERED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Describe your organization’s marketing goals, target attendees, and budget. The AI Assistant will evaluate the official catalogue of 40+ summit inventory items to structure an optimized visibility package.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI Recommends Verified Catalogue • Zero Hallucinations</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Or Quick Select an Industry Blueprint:
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {quickPrompts.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-left transition space-y-1 group"
            >
              <span className="text-xs font-bold text-amber-300 block group-hover:text-amber-200">
                {preset.label}
              </span>
              <span className="text-[11px] text-slate-400 block line-clamp-1">
                {preset.goal}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Input Form */}
      <form onSubmit={handleGenerateRecommendations} className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Company / Organisation Name
            </label>
            <input
              type="text"
              placeholder="e.g. AeroSat Nigeria, Zenith Bank, Air Peace"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Industry Category
            </label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option>Airlines & Commercial Aviation</option>
              <option>Flight Training & Simulation</option>
              <option>Banking, Finance & Insurance</option>
              <option>Oil, Gas & Energy Aviation</option>
              <option>Aircraft Maintenance & MRO</option>
              <option>Telecommunications & Tech</option>
              <option>Food, Beverage & Catering</option>
              <option>Hospitality & Hotel Logistics</option>
              <option>Safety Equipment & Radar Systems</option>
              <option>Government Agency / Regulator</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Primary Objective
            </label>
            <select
              value={promotionGoal}
              onChange={(e) => setPromotionGoal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option>Brand Leadership & Executive Visibility</option>
              <option>Product / Hardware Showcase (Booth)</option>
              <option>100% Attendee Touchpoint (Water/Badges)</option>
              <option>Thought Leadership & Stage Keynote</option>
              <option>Aviation Memo Safety Contribution</option>
              <option>Gala Sky Party Hospitality</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Estimated Budget
            </label>
            <select
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option>Under ₦1,000,000 ($700)</option>
              <option>₦1,000,000 – ₦3,000,000 ($2,000)</option>
              <option>₦3,000,000 – ₦10,000,000 ($6,800)</option>
              <option>₦10,000,000 – ₦25,000,000+ ($17,000 Title)</option>
              <option>Flexible / Custom Proposal</option>
            </select>
          </div>

        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Specific Requirements or Custom Request (Natural Language)
          </label>
          <div className="relative">
            <textarea
              rows={2}
              placeholder="e.g. We are launching a new radar collision avoidance system and want a 6m exhibition space + stage video advert and 4 VIP passes."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none pr-32"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`absolute right-2.5 bottom-3.5 px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition flex items-center space-x-2 ${
                isLoading
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Output Recommendations */}
      {recommendationResult && (
        <div className="p-6 bg-slate-900 rounded-2xl border border-amber-500/30 space-y-6 animate-fadeIn">
          
          {/* Executive Greeting & Context */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 block font-mono">
              OFFICIAL SPONSORSHIP CONSULTATION SUMMARY
            </span>
            <p className="text-sm font-semibold text-white">
              {recommendationResult.advisorGreeting}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {recommendationResult.strategicAdvice}
            </p>
          </div>

          {/* Recommended Positions Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Tailored Recommendation Matrix ({recommendationResult.recommendedPackages?.length || 0} Matches):
              </h4>
              <span className="text-[11px] text-teal-400 font-mono">
                Verified In Stock
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendationResult.recommendedPackages?.map((item: any, idx: number) => {
                const price = currency === 'USD' ? item.priceUSD : item.priceNGN;
                return (
                  <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                          {item.category}
                        </span>
                        <span className="text-base font-extrabold text-amber-400 font-mono">
                          {currencySymbol}{(price || 0).toLocaleString()}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-white">{item.name}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-2 text-[11px]">
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Audience Impact:</strong> {item.expectedImpact}
                      </div>
                      <div className="text-amber-200/80 flex items-start space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item.safetyCompliance}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart({
                            id: item.id,
                            name: item.name,
                            category: item.category,
                            priceNGN: item.priceNGN || 1000000,
                            priceUSD: item.priceUSD || 700,
                            description: item.reason,
                            location: 'Summit Venue / Digital Portal',
                            sizeFormat: 'Standard Specifications',
                            duration: 'Summit Period',
                            targetAudience: 'Aviation Stakeholders',
                            whatCustomerProvides: 'Brand Logo and approved artwork',
                            whatDomislinkProvides: 'Production and deployment',
                            whatIsIncluded: ['Placement and technical deployment'],
                            optionalAddons: [],
                            isPriceCustom: false,
                            productionCostNGN: 0,
                            productionCostUSD: 0,
                            installationCostNGN: 0,
                            installationCostUSD: 0,
                            totalInventory: 5,
                            availableInventory: 5,
                            status: 'AVAILABLE',
                            exclusive: false,
                            requiresRegulatoryApproval: false
                          });
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add Position to Booking Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Steps Guide */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-300 block">Recommended Execution Protocol:</span>
              <span className="text-[11px]">{recommendationResult.nextSteps}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
