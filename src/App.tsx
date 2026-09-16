/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Crown, Mail, Phone, MapPin, ExternalLink, Calendar, 
  Clock, CheckCircle, ShieldCheck, Database, Award, 
  HelpCircle, MessageSquare, Menu, X, ArrowUp, Sparkles 
} from 'lucide-react';

// Modular Subcomponents
import TopEventBar from './components/TopEventBar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SummitIntroExperience from './components/SummitIntroExperience';
import SafetyPulse from './components/SafetyPulse';
import SafetyMessage from './components/SafetyMessage';
import About from './components/About';
import SummitGlance from './components/SummitGlance';
import SummitPoster from './components/SummitPoster';
import OfficialDignitariesSection from './components/dignitaries/OfficialDignitariesSection';
import Speakers from './components/Speakers';
import GovernmentLeaders from './components/GovernmentLeaders';
import IndustryParticipants from './components/IndustryParticipants';
import StakeholderSection from './components/stakeholders/StakeholderSection';
import EverybodyIsInvolvedNetwork from './components/stakeholders/EverybodyIsInvolvedNetwork';
import SummitProgramme from './components/SummitProgramme';
import GoogleWorkspaceHub from './components/GoogleWorkspaceHub';
import AviationMemoirChallenge from './components/AviationMemoirChallenge';
import BookLaunch from './components/BookLaunch';
import DyingLibraryPolicy from './components/DyingLibraryPolicy';
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
import { BOOK_PRIMARY } from './constants/author';
import DomisLinkBookstore from './components/bookstore/DomisLinkBookstore';
import DynamicFlowTicker from './components/DynamicFlowTicker';
import KineticWordRibbon from './components/KineticWordRibbon';
import SpeakerHandbookEngine from './components/publishing/SpeakerHandbookEngine';
import HandbookGenerator from './components/publishing/HandbookGenerator';
import SpeakerKnowledgeHub from './components/publishing/SpeakerKnowledgeHub';
import SpeakerApprovalDashboard from './components/publishing/SpeakerApprovalDashboard';
import PodcastEngineHub from './components/publishing/PodcastEngineHub';
import QRConnector from './components/publishing/QRConnector';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import GeminiLiveVoiceModal from './components/GeminiLiveVoiceModal';
import RSVPPage from './components/rsvp/RSVPPage';
import VolunteerPage from './components/volunteer/VolunteerPage';
import DomisLinkSocialShare from './components/social/DomisLinkSocialShare';
import SocialShareModal from './components/social/SocialShareModal';
import CertificateVerificationModal from './components/social/CertificateVerificationModal';
import { Share2, QrCode } from 'lucide-react';
import { ShareTargetType } from './types';

import { 
  Speaker, Organisation, Session, Registration, 
  MemoSubmission, BookInfo, InvestmentOpportunity, Partner 
} from './types';
import { INITIAL_VERIFIED_SPEAKERS } from './data/speakersData';
import { INITIAL_PROGRAMME_SESSIONS } from './data/programmeData';
import { useAdminAuth, AdminProtectedView } from './components/AdminAuthWrapper';
import { useNavigation } from './hooks/useNavigation';

export default function App() {
  const { activeSection, handleNavigate } = useNavigation('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalTargetType, setShareModalTargetType] = useState<ShareTargetType>('SUMMIT');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const { isAdmin, signIn, signOutAdmin } = useAdminAuth();

  useEffect(() => {
    if (!isAdmin) setIsAdminMode(false);
  }, [isAdmin]);

  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('domislink_intro_viewed');
  });

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
  const [sessions, setSessions] = useState<Session[]>(INITIAL_PROGRAMME_SESSIONS);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [memos, setMemos] = useState<MemoSubmission[]>([]);
  const [book, setBook] = useState<BookInfo>({
    id: BOOK_PRIMARY.id,
    title: BOOK_PRIMARY.title,
    author: BOOK_PRIMARY.author,
    description: BOOK_PRIMARY.description,
    coverImagePlaceholder: BOOK_PRIMARY.coverImagePlaceholder
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

  // Fetch initial database state on mount with automatic retry
  const fetchDb = async (retries = 3, delay = 800) => {
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
        return;
      }
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchDb(retries - 1, delay * 1.5), delay);
        return;
      }
      console.warn('Database parameters synced with bundle defaults:', err);
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

  // Contact form submission state
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#0A192F] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#0A192F] pb-16 md:pb-0">
      
      {/* Dynamic Cinematic Intro Experience */}
      {showIntro && (
        <SummitIntroExperience 
          onComplete={() => {
            setShowIntro(false);
            sessionStorage.setItem('domislink_intro_viewed', 'true');
          }} 
        />
      )}

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

      {/* PROMINENT HIGH-VISIBILITY DONOR / SPONSOR / ADVERTISER TOP BANNER */}
      <div className="bg-gradient-to-r from-[#050B1A] via-[#0D1E38] to-[#050B1A] border-b-2 border-[#D4AF37] py-3.5 px-4 text-white relative z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
            </span>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFD700]">
                Global Donors, Sponsors & Advertisers Portal // Aviation Safety Summit 2026
              </p>
              <p className="text-[11px] text-[#8A99AD] font-sans">
                Position your brand at Nigeria's premier aviation safety convergence. Premium sponsorship & exhibitor packages available.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => handleNavigate('marketplace')}
              className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#050B1A] font-serif font-bold text-xs uppercase tracking-widest rounded-lg shadow-md hover:brightness-110 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explore Marketplace</span>
            </button>
            <a
              href="mailto:INFO@DOMISLINK.COM?subject=Sponsorship%20or%20Donor%20Inquiry"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase rounded-lg border border-white/25 transition-all"
            >
              Contact Desk
            </a>
          </div>
        </div>
      </div>

      {/* 2. HERO */}
      <div id="home">
        <Hero 
          onNavigate={handleNavigate} 
          eventDate={eventInfo.date} 
          venue={eventInfo.venue} 
        />
      </div>

      {/* Dynamic Flow Ticker Stream 1: National Mandate & Coordinates */}
      <DynamicFlowTicker variant="gold" initialMotionMode="stepped-pause" />

      <SafetyPulse label="SAFETY PULSE // EVERYBODY IS INVOLVED IN AVIATION SAFETY" />

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

      {/* 6.B OFFICIAL SOCIAL MEDIA SHARING & PUBLIC DISTRIBUTION HUB */}
      <div id="share" className="py-16 bg-gradient-to-b from-[#050D1A] via-[#0A192F] to-[#050D1A] border-y-2 border-[#D4AF37]/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30 text-[#D4AF37]">
              <Share2 className="h-3.5 w-3.5" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#FFD700]">
                OFFICIAL PUBLIC DISTRIBUTION &amp; ENGAGEMENT HUB
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white uppercase tracking-tight">
              SPREAD THE WORD &amp; ENGAGE YOUR NETWORK
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Share the Aviation Safety Summit 2026 across social media channels, send direct WhatsApp invitations, generate high-resolution QR codes, or invite volunteers to join the workforce.
            </p>
          </div>

          <DomisLinkSocialShare 
            targetType="SUMMIT" 
            variant="card"
          />
        </div>
      </div>

      {/* Kinetic Double-Word Ribbon: Cross-Industry Theme */}
      <KineticWordRibbon theme="dark" initialMovement="stepped-pause" />

      {/* OFFICIAL DIGNITARY HIERARCHY (TIERS 1 - 4) */}
      <div id="dignitaries">
        <OfficialDignitariesSection 
          onRegisterClick={() => handleNavigate('register')}
        />
      </div>

      {/* 7. SPEAKERS & DIGNITARIES DIRECTORY */}
      <div id="speakers">
        <Speakers 
          speakers={speakers} 
          onUpdateSpeakers={handleUpdateSpeakers} 
          isAdmin={isAdminMode} 
        />
      </div>

      {/* DYNAMIC EVERYBODY IS INVOLVED VISUAL NETWORK (16 SECTORS CONVERGING ON AVIATION SAFETY) */}
      <div id="everybody-involved">
        <EverybodyIsInvolvedNetwork />
      </div>

      {/* EXPANDED SUMMIT INVITATION & STAKEHOLDER ENGINE (24+ SECTORS) */}
      <div id="stakeholders">
        <StakeholderSection />
      </div>

      {/* Dynamic Flow Ticker Stream 2: Radar Telemetry & Sectors */}
      <DynamicFlowTicker variant="radar" initialMotionMode="slow-glide" />

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

      {/* 11.B THE DYING LIBRARY & ICAO / PSC POLICY WHITE PAPER */}
      <div id="dying-library">
        <DyingLibraryPolicy onNavigateToMemoir={() => handleNavigate('challenge')} />
      </div>

      {/* Dynamic Flow Ticker Stream 3: Faith & Book Launch Spotlight */}
      <DynamicFlowTicker variant="navy" initialMotionMode="breathing-cadence" />

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

      {/* Kinetic Ribbon: Aviation Pride & Celebration */}
      <KineticWordRibbon theme="gold" />

      {/* 15. SKY PARTY (THE SKY PARTY) */}
      <div id="sky-party">
        <SkyParty />
      </div>

      {/* Safety Knowledge Hub / Library */}
      <div id="safety-library">
        <KnowledgeHub />
      </div>

      {/* 16. COMMERCIAL ADVERTISING & SPONSORSHIP MARKETPLACE */}
      <section id="marketplace" className="py-8 bg-[#071324] border-y border-[#D4AF37]/30">
        <MarketplaceHub onBackToMain={() => handleNavigate('home')} />
      </section>

      {/* DOMISLINK BOOKSTORE & PUBLISHING ENGINE */}
      <div id="domislink-bookstore">
        <DomisLinkBookstore />
      </div>
      <SpeakerHandbookEngine />
      <HandbookGenerator />
      <SpeakerKnowledgeHub />
      <SpeakerApprovalDashboard />
      <div id="podcast">
        <PodcastEngineHub />
      </div>
      <QRConnector />

      {/* 17. PARTNERS */}
      <div id="partners">
        <Partnership 
          partners={partners} 
          onUpdatePartners={handleUpdatePartners} 
          isAdmin={isAdminMode} 
        />
      </div>

      {/* 17.B OFFICIAL RSVP & ATTENDANCE CONFIRMATION ENGINE */}
      <div id="rsvp">
        <RSVPPage 
          onBackToSummit={() => handleNavigate('hero')}
          onNavigateToRegister={() => handleNavigate('register')} 
        />
      </div>

      {/* 17.C OFFICIAL VOLUNTEER INTAKE & APPLICATION ENGINE */}
      <div id="volunteer">
        <VolunteerPage 
          onBackToSummit={() => handleNavigate('hero')}
          onNavigateToRegister={() => handleNavigate('register')} 
        />
      </div>

      {/* 18. REGISTRATION */}
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
                      <p className="text-white font-sans mt-0.5">INFO@DOMISLINK.COM<br/>domislinkint@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3.5">
                    <Phone className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#8A99AD] uppercase tracking-wider text-[9px] font-bold">Inquiries & Desk:</p>
                      <p className="text-white font-sans mt-0.5">+234 (0) 904 983 7474<br/>+234 (0) 7066117100</p>
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
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-gray-400">
                <span className="px-2 py-0.5 bg-white/5 border border-[#D4AF37]/30 rounded text-[#D4AF37] font-semibold">
                  RC - 9266988
                </span>
                <span>TIN: 2622441967501</span>
              </div>
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
                  <li><button onClick={() => { setShareModalTargetType('SUMMIT'); setIsShareModalOpen(true); }} className="hover:text-white transition-colors font-bold text-[#FFD700] flex items-center space-x-1.5"><Share2 className="h-3.5 w-3.5 text-[#D4AF37]" /><span>Share Summit Links</span></button></li>
                  <li><button onClick={() => handleNavigate('rsvp')} className="hover:text-white transition-colors font-bold text-[#FFD700]">RSVP Confirmation</button></li>
                  <li><button onClick={() => handleNavigate('volunteer')} className="hover:text-white transition-colors font-bold text-[#D4AF37]">Volunteer Intake</button></li>
                  <li><button onClick={() => setIsVerifyModalOpen(true)} className="hover:text-white transition-colors text-emerald-400 flex items-center space-x-1.5"><ShieldCheck className="h-3.5 w-3.5" /><span>Verify Certificate</span></button></li>
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

      {/* Floating Share Quick Pill */}
      <div className="fixed bottom-6 right-6 md:right-84 z-30">
        <button
          onClick={() => { setShareModalTargetType('SUMMIT'); setIsShareModalOpen(true); }}
          className="px-3.5 py-3 bg-[#0A192F]/95 hover:bg-[#132545] border border-[#D4AF37]/70 text-[#FFD700] hover:text-white rounded-2xl shadow-xl flex items-center space-x-2 font-mono text-xs uppercase font-bold tracking-wider backdrop-blur-md hover:scale-105 transition-all"
          title="Share Summit or Volunteer Links"
        >
          <Share2 className="h-4 w-4 text-[#D4AF37]" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Floating Database Console Trigger Banner on Desktop */}
      <div className="fixed bottom-6 right-6 z-30 hidden md:block">
        <div className="bg-[#0A192F] border border-[#D4AF37]/45 rounded-xl p-4 shadow-2xl flex items-center space-x-3 max-w-xs backdrop-blur-md">
          <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded text-[#D4AF37]">
            <Database className="h-4 w-4" />
          </div>
          <div className="text-[11px] text-[#8A99AD] leading-normal font-light">
            <p className="font-bold text-[#D4AF37] uppercase tracking-wider text-[9px] font-mono">CMS Panel Online</p>
            <p>Database content is fully editable live in-browser.</p>
            <div className="mt-2 flex items-center space-x-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-xs text-white font-bold underline hover:text-[#D4AF37]"
              >
                OPEN DATABASE SYSTEM
              </button>
              {isAdmin && (
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="text-xs px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded text-[#D4AF37] hover:bg-[#D4AF37]/40 transition-colors uppercase font-mono ml-2"
                >
                  {isAdminMode ? 'Disable Inline Edit' : 'Enable Inline Edit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Gemini Live Voice Assistant Trigger Pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="px-4 py-3 bg-gradient-to-r from-[#0A192F] via-[#132545] to-[#0A192F] border-2 border-[#D4AF37] text-[#FFD700] hover:text-white rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center space-x-2.5 font-serif font-bold text-xs tracking-wider uppercase hover:scale-105 transition-all duration-300"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
          </span>
          <span>Gemini Live Voice</span>
        </button>
      </div>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        targetType={shareModalTargetType}
      />

      {/* Public Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />

      {/* Database/CMS Admin Panel Modal */}
      <AdminPanel 
        registrations={registrations} 
        memos={memos} 
        onResetDb={handleResetDb} 
        onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      {/* Gemini Live Voice Modal */}
      <GeminiLiveVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

    </div>
  );
}
