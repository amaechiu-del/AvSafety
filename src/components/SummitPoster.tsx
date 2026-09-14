/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Crown, ZoomIn, ZoomOut, Maximize2, Share2, Download, 
  Printer, Check, FileText, Info, ShieldCheck, Calendar, 
  MapPin, Users, Award, ExternalLink, X 
} from 'lucide-react';

interface SummitPosterProps {
  onNavigate: (sectionId: string) => void;
}

export default function SummitPoster({ onNavigate }: SummitPosterProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'transcript'>('visual');

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const handleShare = async () => {
    const shareData = {
      title: 'Aviation Safety Summit 2026 Poster',
      text: 'Official Poster: Aviation Safety Summit 2026 — 17 November 2026, Marriott Hotel, Ikeja, Lagos, Nigeria.',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="poster" className="py-24 bg-[#0A192F] text-white border-b border-[#D4AF37]/20 relative overflow-hidden">
      
      {/* Editorial grid background */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="poster-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#poster-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            <Crown className="h-4 w-4 mr-1 text-[#D4AF37]" />
            PRIMARY VISUAL & CONTENT REFERENCE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-white tracking-tight">
            THE SUMMIT POSTER
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            Every material detail, dignitary, sector, and initiative shown on the official summit artwork is presented below both in authentic visual artwork and fully accessible text.
          </p>
        </div>

        {/* View Switcher & Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          
          {/* Left: View Tabs */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === 'visual'
                  ? 'bg-[#D4AF37] text-[#0A192F] shadow'
                  : 'bg-white/5 hover:bg-white/10 text-[#8A99AD] hover:text-white'
              }`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>OFFICIAL POSTER ARTWORK</span>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === 'transcript'
                  ? 'bg-[#D4AF37] text-[#0A192F] shadow'
                  : 'bg-white/5 hover:bg-white/10 text-[#8A99AD] hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>ACCESSIBLE HTML TRANSCRIPT</span>
            </button>
          </div>

          {/* Right: Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {activeTab === 'visual' && (
              <div className="flex items-center bg-black/30 rounded-lg p-1 border border-white/10">
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset Zoom"
                  className="px-2 py-1 text-[11px] font-bold text-[#D4AF37] hover:underline"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => setIsFullScreen(true)}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>FULL SCREEN</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium flex items-center space-x-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED LINK</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>SHARE</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#B89025] hover:to-[#9E781C] text-[#0A192F] font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>PRINT / DOWNLOAD</span>
            </button>
          </div>

        </div>

        {/* Main Display Area */}
        {activeTab === 'visual' ? (
          <div className="bg-[#050D18] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-8 overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 text-xs text-[#8A99AD] font-mono">
              <span className="flex items-center text-[#D4AF37]">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                OFFICIAL ARTWORK CANVASES (DESKTOP & MOBILE COMPATIBLE)
              </span>
              <span>DOMISLINK // THE DIGITAL EMPIRE</span>
            </div>

            {/* Poster Canvas Frame with Zoom & Pan Handling */}
            <div className="overflow-auto max-h-[750px] p-2 flex justify-center items-center bg-[#071324] rounded-xl border border-white/5">
              <div 
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
                className="max-w-4xl w-full bg-[#0A192F] border-2 border-[#D4AF37] rounded-xl p-6 sm:p-10 shadow-2xl text-center relative"
              >
                {/* Poster Graphic Header */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="p-2 bg-[#D4AF37] rounded-lg text-[#0A192F]">
                      <Crown className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                    DOMISLINK INTERNATIONAL SERVICES LTD PRESENTS
                  </div>
                  <div className="text-xs font-serif tracking-widest text-[#E2E8F0] font-bold uppercase">
                    THE DIGITAL EMPIRE
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-4"></div>

                  <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white uppercase leading-tight">
                    AVIATION SAFETY <br />
                    <span className="text-[#D4AF37]">SUMMIT 2026</span>
                  </h1>

                  <div className="p-3 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-lg max-w-2xl mx-auto">
                    <p className="text-sm sm:text-lg font-serif font-bold text-white tracking-widest uppercase">
                      EVERYBODY IS INVOLVED IN AVIATION SAFETY
                    </p>
                  </div>
                </div>

                {/* Poster Date & Location Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl max-w-2xl mx-auto mb-8 font-mono text-xs">
                  <div className="flex items-center justify-center space-x-2 text-[#D4AF37]">
                    <Calendar className="h-4 w-4" />
                    <span className="text-white font-bold text-sm">17 NOVEMBER 2026</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-[#D4AF37]">
                    <MapPin className="h-4 w-4" />
                    <span className="text-white font-bold text-sm">MARRIOTT HOTEL, IKEJA, LAGOS</span>
                  </div>
                </div>

                {/* Poster Core Key Initiatives Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-8 text-[11px] font-sans font-semibold">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    <p className="text-[#D4AF37] font-mono text-[9px] uppercase">FLAGSHIP</p>
                    <p className="mt-1">SUMMIT SESSIONS</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    <p className="text-[#D4AF37] font-mono text-[9px] uppercase">INITIATIVE</p>
                    <p className="mt-1">BOOK LAUNCH</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    <p className="text-[#D4AF37] font-mono text-[9px] uppercase">CHALLENGE</p>
                    <p className="mt-1">MEMOIR CHALLENGE</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">
                    <p className="text-[#D4AF37] font-mono text-[9px] uppercase">FINANCE</p>
                    <p className="mt-1">SAFETY INVESTMENT</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white col-span-2 sm:col-span-1">
                    <p className="text-[#D4AF37] font-mono text-[9px] uppercase">EVENING</p>
                    <p className="mt-1">SKY PARTY</p>
                  </div>
                </div>

                {/* Simulation Key Statement */}
                <div className="p-4 bg-gradient-to-r from-[#D4AF37] to-[#B89025] text-[#0A192F] rounded-xl font-serif font-black tracking-widest uppercase text-sm sm:text-base max-w-2xl mx-auto mb-8 shadow-lg">
                  SIM SAVES FUEL. SIM SAVES DOLLARS. SIM SAVES LIVES.
                </div>

                {/* Poster Footer Information */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#8A99AD] font-mono gap-2">
                  <span>ORGANISER: DOMISLINK INTERNATIONAL SERVICES LTD</span>
                  <span className="text-[#D4AF37]">DOMISLINKINT@GMAIL.COM</span>
                  <span>MARRIOTT HOTEL, IKEJA, LAGOS</span>
                </div>

              </div>
            </div>

            <div className="mt-4 text-center text-xs text-[#8A99AD] flex items-center justify-center space-x-1.5">
              <Info className="h-4 w-4 text-[#D4AF37]" />
              <span>Use the zoom and fullscreen controls above to inspect every fine detail, or switch to the Accessible HTML Transcript tab.</span>
            </div>
          </div>
        ) : (
          /* Accessible HTML Transcript (Requirement 4) */
          <div className="bg-[#050D18] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase font-bold">ACCESSIBLE TEXT EQUIVALENT</span>
              <h3 className="text-2xl font-serif font-bold text-white">Full Poster Content Transcript</h3>
              <p className="text-xs text-[#8A99AD]">
                This complete HTML transcript reproduces all textual content, hierarchies, dignitary roles, and sessions on the official summit posters for screen-reader accessibility and mobile readability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              
              {/* Event Metadata */}
              <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">1. EVENT CORE METADATA</h4>
                <ul className="space-y-2 text-xs text-[#E2E8F0] font-mono">
                  <li><strong className="text-white">EVENT NAME:</strong> AVIATION SAFETY SUMMIT 2026</li>
                  <li><strong className="text-white">CORE THEME:</strong> EVERYBODY IS INVOLVED IN AVIATION SAFETY</li>
                  <li><strong className="text-white">EVENT DATE:</strong> 17 NOVEMBER 2026</li>
                  <li><strong className="text-white">OFFICIAL VENUE:</strong> MARRIOTT HOTEL</li>
                  <li><strong className="text-white">LOCATION:</strong> IKEJA, LAGOS, NIGERIA</li>
                  <li><strong className="text-white">CONVENER / ORGANISER:</strong> DOMISLINK INTERNATIONAL SERVICES LTD</li>
                  <li><strong className="text-white">BRAND / PUBLISHER:</strong> THE DIGITAL EMPIRE</li>
                  <li><strong className="text-white">OFFICIAL SYMBOL:</strong> GOLDEN CROWN SYMBOL</li>
                </ul>
              </div>

              {/* Central Safety Statement */}
              <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">2. CENTRAL SAFETY MESSAGE</h4>
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  When an aviation accident occurs, it does not select a tribe, profession, company, social class, or nationality. Passengers may become victims of circumstances and of trusting the aviation system. Therefore aviation safety is a shared responsibility.
                </p>
                <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-xs text-[#D4AF37] font-mono">
                  KEY PRINCIPLE: Aviators must not die with their experience. Let experience speak before it becomes a lesson written in blood.
                </div>
              </div>

              {/* Flagship Components */}
              <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">3. PROGRAMME HIGHLIGHTS</h4>
                <ul className="space-y-2 text-xs text-[#E2E8F0]">
                  <li>• <strong>Aviation Safety Summit Plenary:</strong> Executive addresses by government, regulators, and airline chairmen.</li>
                  <li>• <strong>Book Launch:</strong> Official aviation safety publication unveiling.</li>
                  <li>• <strong>Aviation Memoir Challenge:</strong> Safe reporting mechanism for pilots, engineers, and controllers.</li>
                  <li>• <strong>Safety Investment Session:</strong> "Make Safety Easier" funding discussion.</li>
                  <li>• <strong>Simulation & Training:</strong> "SIM SAVES FUEL. SIM SAVES DOLLARS. SIM SAVES LIVES."</li>
                  <li>• <strong>Sky Party:</strong> VIP gala dinner, networking, and safety recognition.</li>
                </ul>
              </div>

              {/* Sectors & Ecosystem Participants */}
              <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">4. SECTORS REPRESENTED (33+ ORGANISATIONS)</h4>
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  Airlines, Oil & Gas / Jet A-1 Fuel Suppliers, Banking & Finance, Telecommunications, Manufacturing, Technology & Avionics, Airports & Ground Handling, Government & Presidency, Regulators (NCAA, NAMA, NiMet), Flight Training Organisations, and Emergency Rescue Services.
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => onNavigate('industry')}
                    className="text-xs text-[#D4AF37] font-bold hover:underline"
                  >
                    View All 33+ Company Profiles →
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-[#D4AF37]" />
              <span className="font-serif font-bold text-sm text-[#D4AF37]">OFFICIAL SUMMIT POSTER FULLSCREEN VIEW</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="px-3 py-1 bg-[#D4AF37] text-[#0A192F] rounded text-xs font-bold"
              >
                Print / Save
              </button>
              <button
                onClick={() => setIsFullScreen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-[#0A192F] border-2 border-[#D4AF37] rounded-xl p-8 text-center text-white shadow-2xl">
              <Crown className="h-10 w-10 text-[#D4AF37] mx-auto mb-3" />
              <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">DOMISLINK INTERNATIONAL SERVICES LTD</p>
              <p className="text-xs font-serif tracking-widest text-[#E2E8F0] uppercase">THE DIGITAL EMPIRE</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-white mt-4 uppercase">
                AVIATION SAFETY SUMMIT 2026
              </h2>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto my-3"></div>
              <p className="text-lg font-serif font-bold text-[#D4AF37] uppercase">EVERYBODY IS INVOLVED IN AVIATION SAFETY</p>
              
              <div className="my-6 p-4 bg-white/5 border border-white/10 rounded-lg text-xs font-mono flex justify-around">
                <span>17 NOVEMBER 2026</span>
                <span>MARRIOTT HOTEL, IKEJA, LAGOS</span>
              </div>

              <div className="p-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded uppercase tracking-widest">
                SIM SAVES FUEL. SIM SAVES DOLLARS. SIM SAVES LIVES.
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
