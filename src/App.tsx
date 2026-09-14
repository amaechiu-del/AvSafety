/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, Mail, Phone, MapPin, ExternalLink, Calendar, 
  Clock, CheckCircle, ShieldCheck, Database, Award, 
  HelpCircle, MessageSquare, Menu, X, ArrowUp, Sparkles 
} from 'lucide-react';

// Modular Subcomponents
import TopEventBar from './components/TopEventBar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SafetyMessage from './components/SafetyMessage';
import About from './components/About';
import SummitGlance from './components/SummitGlance';
import SummitPoster from './components/SummitPoster';
import Speakers from './components/Speakers';
import GovernmentLeaders from './components/GovernmentLeaders';
import IndustryParticipants from './components/IndustryParticipants';
import StakeholderSection from './components/stakeholders/StakeholderSection';
import SummitProgramme from './components/SummitProgramme';
import GoogleWorkspaceHub from './components/GoogleWorkspaceHub';
import AviationMemoirChallenge from './components/AviationMemoirChallenge';
import BookLaunch from './components/BookLaunch';
import SafetyInvestment from './components/SafetyInvestment';
import SimulationTraining from './components/SimulationTraining';
import SafetyVsAccident from './components/SafetyVsAccident';
import SkyParty from './components/SkyParty';
import InteractiveMap from './components/InteractiveMap';
import FeedbackSuggestionFocus from './components/FeedbackSuggestionFocus';
import KnowledgeHub from './components/KnowledgeHub';
import Partnership from './components/Partnership';
import RegistrationForm from './components/RegistrationForm';
import StickyMobileRegister from './components/StickyMobileRegister';
import AdminPanel from './components/AdminPanel';
import MarketplaceHub from './components/marketplace/MarketplaceHub';
import DomisLinkBookstore from './components/bookstore/DomisLinkBookstore';
import SpeakerHandbookEngine from './components/publishing/SpeakerHandbookEngine';
import HandbookGenerator from './components/publishing/HandbookGenerator';
import SpeakerKnowledgeHub from './components/publishing/SpeakerKnowledgeHub';
import SpeakerApprovalDashboard from './components/publishing/SpeakerApprovalDashboard';
import PodcastEngineHub from './components/publishing/PodcastEngineHub';
import QRConnector from './components/publishing/QRConnector';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

import { 
  Speaker, Organisation, Session, Registration, 
  MemoSubmission, BookInfo, InvestmentOpportunity, Partner 
} from './types';
import { INITIAL_VERIFIED_SPEAKERS } from './data/speakersData';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(true);

  // State Store
  const [eventInfo, setEventInfo] = useState({
    name: 'Aviation Safety Summit 2026',
    theme: 'EVERYBODY IS INVOLVED IN AVIATION SAFETY',
    date: '17 NOVEMBER 2026',
    venue: 'MARRIOTT HOTEL, IKEJA, LAGOS, NIGERIA',
    organizer: 'DOMISLINK INTERNATIONAL SERVICES LTD',
    brand: 'THE DIGITAL EMPIRE',
    symbol: 'GOLDEN CROWN'
  });
  const [speakers, setSpeakers] = useState<Speaker[]>(INITIAL_VERIFIED_SPEAKERS);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [memos, setMemos] = useState<MemoSubmission[]>([]);
  const [book, setBook] = useState<BookInfo>({
    id: 'bk-1',
    title: 'CLEARED FOR TAKEOFF',
    author: 'Capt. Domis Amaechiu',
    description: 'A Pilot, Controller, and Inspector\'s Unfiltered Account of 25 Years Above the Clouds and Behind the Radar.',
    coverImagePlaceholder: 'CLEARED FOR TAKEOFF'
  });
  const [investment, setInvestment] = useState<InvestmentOpportunity>({
    id: 'inv-1',
    company: '[INVESTMENT OPPORTUNITY COMPANY]',
    opportunity: '[INVESTMENT OPPORTUNITY TITLE]',
    description: '[INVESTMENT OPPORTUNITY DESCRIPTION]',
    regulatoryInfo: '[REGULATORY INFORMATION — TO BE SUPPLIED]',
    minimumInvestment: '[MINIMUM INVESTMENT — TO BE CONFIRMED]',
    offerPeriod: '[OFFER PERIOD — TO BE CONFIRMED]',
    officialContact: '[OFFICIAL CONTACT — TO BE SUPPLIED]',
    officialDocumentation: '[OFFICIAL DOCUMENTATION — TO BE SUPPLIED]'
  });
  const [partners, setPartners] = useState<Partner[]>([]);

  // Fetch initial database state on mount
  const fetchDb = async () => {
    try {
      const res = await fetch('/api/db', {
        headers: {
          'x-admin-mode': isAdminMode ? 'true' : 'false'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.event) setEventInfo(data.event);
        if (data.speakers) setSpeakers(data.speakers);
        if (data.organisations) setOrganisations(data.organisations);
        if (data.sessions) setSessions(data.sessions);
        if (data.registrations) setRegistrations(data.registrations);
        if (data.memo_submissions) setMemos(data.memo_submissions);
        if (data.book) setBook(data.book);
        if (data.investment) setInvestment(data.investment);
        if (data.partners) setPartners(data.partners);
      }
    } catch (err) {
      console.error('Failed to load full-stack DB parameters:', err);
    }
  };

  useEffect(() => {
    fetchDb();
  }, [isAdminMode]);

  // Update whole DB helper
  const updateDbField = async (payload: any) => {
    try {
      const res = await fetch('/api/db/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchDb();
      }
    } catch (err) {
      console.error('Failed to commit database updates:', err);
    }
  };

  // State update handlers
  const handleUpdateSpeakers = (updated: Speaker[]) => {
    setSpeakers(updated);
    updateDbField({ speakers: updated });
  };

  const handleUpdateOrganisations = (updated: Organisation[]) => {
    setOrganisations(updated);
    updateDbField({ organisations: updated });
  };

  const handleUpdateSessions = (updated: Session[]) => {
    setSessions(updated);
    updateDbField({ sessions: updated });
  };

  const handleUpdateBook = (updated: BookInfo) => {
    setBook(updated);
    updateDbField({ book: updated });
  };

  const handleUpdateInvestment = (updated: InvestmentOpportunity) => {
    setInvestment(updated);
    updateDbField({ investment: updated });
  };

  const handleUpdatePartners = (updated: Partner[]) => {
    setPartners(updated);
    updateDbField({ partners: updated });
  };

  const handleUpdateMemos = (updated: MemoSubmission[]) => {
    setMemos(updated);
    updateDbField({ memo_submissions: updated });
  };

  // Action posts
  const handleRegisterDelegate = async (regData: any) => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      if (res.ok) {
        const json = await res.json();
        fetchDb();
        return json.registration;
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
    return null;
  };

  const handleUpdateRegistrationStatus = async (id: string, status: Registration['status']) => {
    try {
      const res = await fetch('/api/registrations/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (err) {
      console.error('Failed to update registration status:', err);
    }
  };

  const handleAddMemo = async (memoData: Omit<MemoSubmission, 'id' | 'submittedAt'>) => {
    try {
      const res = await fetch('/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoData)
      });
      if (res.ok) {
        fetchDb();
        return true;
      }
    } catch (err) {
      console.error('Memo submission failed:', err);
    }
    return false;
  };

  const handleResetDb = async () => {
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) {
        fetchDb();
      }
    } catch (err) {
      console.error('Factory reset failed:', err);
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Contact form submission state
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#0A192F] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#0A192F] pb-16 md:pb-0">
      
      {/* PWA Announcement Banner */}
      <PWAInstallButton variant="banner" />

      {/* 1. TOP EVENT BAR */}
      <TopEventBar onNavigate={handleNavigate} />

      {/* Sticky Navigation Header */}
      <Navigation 
        activeSection={activeSection} 
        onNavigate={handleNavigate} 
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* 2. HERO */}
      <div id="home">
        <Hero 
          onNavigate={handleNavigate} 
          eventDate={eventInfo.date} 
          venue={eventInfo.venue} 
        />
      </div>

      {/* 3. THEME: EVERYBODY IS INVOLVED IN AVIATION SAFETY */}
      <div id="theme">
        <SafetyMessage />
      </div>

      {/* 4. WHY THIS SUMMIT MATTERS */}
      <div id="about">
        <About />
      </div>

      {/* 5. SUMMIT AT A GLANCE (Poster Information Grid) */}
      <div id="glance">
        <SummitGlance onNavigate={handleNavigate} />
      </div>

      {/* 6. OFFICIAL POSTER */}
      <div id="poster">
        <SummitPoster onNavigate={handleNavigate} />
      </div>

      {/* 7. SPEAKERS & DIGNITARIES */}
      <div id="speakers">
        <Speakers 
          speakers={speakers} 
          onUpdateSpeakers={handleUpdateSpeakers} 
          isAdmin={isAdminMode} 
        />
      </div>

      {/* Government & Special Guests Plenary */}
      <GovernmentLeaders />

      {/* EXPANDED SUMMIT INVITATION & STAKEHOLDER ENGINE (24+ SECTORS) */}
      <div id="stakeholders">
        <StakeholderSection />
      </div>

      {/* 8. INDUSTRY PARTICIPANTS / 33+ COMPANIES */}
      <div id="industry">
        <IndustryParticipants 
          organisations={organisations} 
          onUpdateOrganisations={handleUpdateOrganisations} 
          isAdmin={isAdminMode} 
        />
      </div>

      {/* 9. PROGRAMME */}
      <div id="programme">
        <SummitProgramme 
          sessions={sessions} 
          onUpdateSessions={handleUpdateSessions} 
          isAdmin={isAdminMode}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Interactive Summit Relationship Network Map */}
      <InteractiveMap />

      {/* Official Google Workspace Hub (Docs, Gmail, Calendar, Slides) */}
      <GoogleWorkspaceHub />

      {/* 10. AVIATION MEMOIR CHALLENGE */}
      <div id="challenge">
        <AviationMemoirChallenge 
          memos={memos} 
          onSubmitMemo={handleAddMemo} 
          onUpdateMemos={handleUpdateMemos}
          isAdmin={isAdminMode}
        />
      </div>

      {/* 11. BOOK LAUNCH */}
      <div id="book">
        <BookLaunch 
          book={book} 
          onUpdateBook={handleUpdateBook} 
          isAdmin={isAdminMode} 
        />
      </div>

      {/* 12. SAFETY INVESTMENT ("MAKE SAFETY EASIER") */}
      <SafetyInvestment 
        investment={investment} 
        onUpdateInvestment={handleUpdateInvestment} 
        isAdmin={isAdminMode} 
      />

      {/* 13. SIMULATION & TRAINING ("SIM SAVES FUEL. SIM SAVES DOLLARS. SIM SAVES LIVES.") */}
      <div id="simulation">
        <SimulationTraining />
      </div>

      {/* 14. SAFETY VS ACCIDENT ("INVEST IN SAFETY" vs "PAY THE PRICE OF A MISHAP") */}
      <SafetyVsAccident />

      {/* 15. SKY PARTY (THE SKY PARTY) */}
      <div id="sky-party">
        <SkyParty />
      </div>

      {/* Safety Knowledge Hub */}
      <KnowledgeHub />

      {/* 16. COMMERCIAL ADVERTISING & SPONSORSHIP MARKETPLACE */}
      <section id="marketplace" className="py-8 bg-[#071324] border-y border-[#D4AF37]/30">
        <MarketplaceHub onBackToMain={() => handleNavigate('home')} />
      </section>

      {/* DOMISLINK BOOKSTORE & PUBLISHING ENGINE */}
      <DomisLinkBookstore />
      <SpeakerHandbookEngine />
      <HandbookGenerator />
      <SpeakerKnowledgeHub />
      <SpeakerApprovalDashboard />
      <PodcastEngineHub />
      <QRConnector />

      {/* 17. PARTNERS */}
      <div id="partners">
        <Partnership 
          partners={partners} 
          onUpdatePartners={handleUpdatePartners} 
          isAdmin={isAdminMode} 
        />
      </div>

      {/* 17. REGISTRATION */}
      <div id="register">
        <RegistrationForm onRegister={handleRegisterDelegate} />
      </div>

      {/* FEEDBACK & SUGGESTION FOCUS */}
      <FeedbackSuggestionFocus />

      {/* 18. CONTACT / SECRETARIAT */}
      <section id="contact" className="py-24 bg-white border-b border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">COMMUNICATIONS PORTAL</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight uppercase">
              CONTACT SUMMIT SECRETARIAT
            </h2>
            <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
            <p className="text-sm sm:text-base text-[#5A6E85] font-light">
              Connect directly with the official organizing office of Domislink International Services Ltd.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-stretch">
            {/* Contact details */}
            <div className="lg:col-span-5 bg-[#0A192F] text-white p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/35 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase">OFFICIAL SECRETARIAT</span>
                </div>

                <p className="text-xs text-[#8A99AD] leading-relaxed font-light">
                  Direct all delegate registration questions, sponsorship proposals, speaker confirmations, and verified press inquiries to the secretariat.
                </p>

                <div className="space-y-4 text-xs font-mono">
                  <div className="flex items-start space-x-3.5">
                    <MapPin className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#8A99AD] uppercase tracking-wider text-[9px] font-bold">Summmit Venue:</p>
                      <p className="text-white font-sans mt-0.5">Marriott Hotel, Ikeja, Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3.5">
                    <Mail className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#8A99AD] uppercase tracking-wider text-[9px] font-bold">Official Email:</p>
                      <p className="text-white font-sans mt-0.5">domislinkint@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3.5">
                    <Phone className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#8A99AD] uppercase tracking-wider text-[9px] font-bold">Inquiries & Desk:</p>
                      <p className="text-white font-sans mt-0.5">+234 (0) 803 300 0000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-[9px] font-mono text-[#8A99AD]">
                <span>DOMISLINK INTERNATIONAL SERVICES LTD</span>
              </div>
            </div>

            {/* Direct Contact Form */}
            <div className="lg:col-span-7 bg-[#FCFBF7] border border-[#D4AF37]/20 p-6 sm:p-8 rounded-2xl shadow-sm">
              {contactSubmitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-3.5">
                  <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0A192F]">Message Transmitted Successfully</h4>
                  <p className="text-xs text-[#5A6E85] max-w-md mx-auto">
                    The Summit Secretariat has received your message. An official credential officer will reply shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Delegate / Sender Name</label>
                      <input 
                        type="text" required placeholder="e.g. Captain Kolawole"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Email Address</label>
                      <input 
                        type="email" required placeholder="e.g. kolawole@fcaa.gov.ng"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Inquiry Subject</label>
                    <input 
                      type="text" required placeholder="e.g. Request for Executive Panel Credentials"
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800 font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Message</label>
                    <textarea 
                      rows={3} required placeholder="Please state your inquiry or request for the summit secretariat."
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#D4AF37] text-gray-800 font-light"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-colors"
                  >
                    Transmit Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 19. FOOTER */}
      <footer className="bg-[#050D18] text-[#8A99AD] py-14 border-t border-[#D4AF37]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Logo details */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-[#D4AF37]/25 border border-[#D4AF37]/45 rounded text-[#D4AF37]">
                  <Crown className="h-4 w-4" />
                </div>
                <span className="font-serif tracking-widest text-[#D4AF37] font-bold text-sm uppercase">THE DIGITAL EMPIRE</span>
              </div>
              <p className="text-[11px] text-[#8A99AD] font-light leading-relaxed max-w-sm">
                Organised by DOMISLINK INTERNATIONAL SERVICES LTD. Unifying aviation safety technologies, flight simulation, sovereign safety policies, and 33+ participating industry sectors.
              </p>
              <p className="text-[10px] text-gray-400 font-mono">
                Venue: Marriott Hotel, Ikeja, Lagos, Nigeria • 17 November 2026
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-7 grid grid-cols-3 gap-4 text-xs font-medium">
              <div className="space-y-3">
                <p className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">EXPLORE</p>
                <ul className="space-y-2">
                  <li><button onClick={() => handleNavigate('poster')} className="hover:text-white transition-colors">Summit Poster</button></li>
                  <li><button onClick={() => handleNavigate('stakeholders')} className="hover:text-white transition-colors font-semibold text-[#D4AF37]">24+ Stakeholders</button></li>
                  <li><button onClick={() => handleNavigate('industry')} className="hover:text-white transition-colors">33+ Sectors</button></li>
                  <li><button onClick={() => handleNavigate('theme')} className="hover:text-white transition-colors">Core Theme</button></li>
                  <li><button onClick={() => handleNavigate('glance')} className="hover:text-white transition-colors">At a Glance</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">INITIATIVES</p>
                <ul className="space-y-2">
                  <li><button onClick={() => handleNavigate('programme')} className="hover:text-white transition-colors">Programme</button></li>
                  <li><button onClick={() => handleNavigate('speakers')} className="hover:text-white transition-colors">Speakers Hub</button></li>
                  <li><button onClick={() => handleNavigate('challenge')} className="hover:text-white transition-colors">Memoir Challenge</button></li>
                  <li><button onClick={() => handleNavigate('book')} className="hover:text-white transition-colors">Book Launch</button></li>
                  <li><button onClick={() => handleNavigate('simulation')} className="hover:text-white transition-colors">Simulation</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">ACTION</p>
                <ul className="space-y-2">
                  <li><button onClick={() => handleNavigate('sky-party')} className="hover:text-white transition-colors">Sky Party</button></li>
                  <li><button onClick={() => handleNavigate('register')} className="hover:text-white transition-colors font-bold text-[#D4AF37]">Register Delegate</button></li>
                  <li><button onClick={() => handleNavigate('partners')} className="hover:text-white transition-colors">Partnership</button></li>
                  <li><button onClick={() => handleNavigate('contact')} className="hover:text-white transition-colors">Contact</button></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10"></div>

          {/* Copyright line */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono">
            <p>© 2026 DOMISLINK INTERNATIONAL SERVICES LTD. All Rights Reserved.</p>
            <p className="text-gray-400">INITIATIVE: THE DIGITAL EMPIRE</p>
          </div>

        </div>
      </footer>

      {/* Compact Sticky Register Button on Mobile */}
      <StickyMobileRegister onNavigate={handleNavigate} />

      {/* Floating PWA Quick Install Pill */}
      <PWAInstallButton variant="floating" />

      {/* Offline Status Alert */}
      <OfflineIndicator />

      {/* Floating Database Console Trigger Banner on Desktop */}
      <div className="fixed bottom-6 right-6 z-30 hidden md:block">
        <div className="bg-[#0A192F] border border-[#D4AF37]/45 rounded-xl p-4 shadow-2xl flex items-center space-x-3 max-w-xs backdrop-blur-md">
          <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded text-[#D4AF37]">
            <Database className="h-4 w-4" />
          </div>
          <div className="text-[11px] text-[#8A99AD] leading-normal font-light">
            <p className="font-bold text-[#D4AF37] uppercase tracking-wider text-[9px] font-mono">CMS Panel Online</p>
            <p>Database content is fully editable live in-browser.</p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="mt-1.5 text-xs text-white font-bold underline hover:text-[#D4AF37]"
            >
              OPEN DATABASE SYSTEM
            </button>
          </div>
        </div>
      </div>

      {/* Database/CMS Admin Panel Modal */}
      <AdminPanel 
        registrations={registrations} 
        memos={memos} 
        onResetDb={handleResetDb} 
        onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

    </div>
  );
}
