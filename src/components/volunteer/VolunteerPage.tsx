/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, ShieldCheck, HeartHandshake, CheckCircle2, AlertCircle, 
  Send, User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Sparkles, Clock, Calendar, Printer, Copy, Check, ArrowLeft, 
  Search, FileText, ChevronRight, Users, Shield, Award, HelpCircle,
  Share2, Globe, Laptop, Building2
} from 'lucide-react';
import { VolunteerDepartment, VolunteerApplication, VolunteerApplicantType, NatureOfVolunteerSupport } from '../../types';
import DomisLinkSocialShare from '../social/DomisLinkSocialShare';
import CertificateVerificationModal from '../social/CertificateVerificationModal';
import { 
  sanitizeReferralToken, 
  trackShareEvent, 
  generateVolunteerReferralToken, 
  CANONICAL_VOLUNTEER_URL 
} from '../../utils/socialShare';

interface VolunteerPageProps {
  onBackToSummit?: () => void;
  onNavigateToRegister?: () => void;
}

const APPLICANT_TYPES: { id: VolunteerApplicantType; title: string; subtitle: string; icon: string }[] = [
  {
    id: 'Individual Volunteer',
    title: 'Individual Volunteer',
    subtitle: 'Applying independently as a student, graduate, or professional.',
    icon: '👤'
  },
  {
    id: 'Corporate-Sponsored Volunteer',
    title: 'Corporate-Sponsored Volunteer',
    subtitle: 'Sponsored or supported by an airline, aviation enterprise, or corporation.',
    icon: '🏢'
  },
  {
    id: 'Organisation-Nominated Volunteer',
    title: 'Organisation-Nominated Volunteer',
    subtitle: 'Nominated or deployed by an industry association, agency, or institution.',
    icon: '🏛️'
  }
];

const ORGANISATION_TYPES = [
  'Airline / Commercial Carrier',
  'Civil Aviation Authority / Regulatory Agency',
  'Airport Authority / Terminal Operator',
  'Ground Handling & Logistics Provider',
  'Aviation Training Organisation / Academy',
  'Corporate Enterprise / Financial Sponsor',
  'Aviation Professional Association / Trade Union',
  'Non-Governmental Organisation (NGO)',
  'University / Educational Institution',
  'Other Corporate / Institution'
];

const NATURE_OF_SUPPORT_OPTIONS: NatureOfVolunteerSupport[] = [
  'Sponsored Volunteer',
  'Nominated Volunteer',
  'Deployed Staff Member',
  'Corporate Volunteer Team',
  'Other'
];

const DEPARTMENTS: { name: VolunteerDepartment; description: string; icon: string }[] = [
  { name: 'Protocol', description: 'Diplomatic reception, VIP dignitary courtesies, and stage escort services.', icon: '🏛️' },
  { name: 'Registration', description: 'Delegate check-in, credential verification, and summit badge issuance.', icon: '🎟️' },
  { name: 'Guest Services', description: 'Delegate guidance, venue directions, and attendee help desk operations.', icon: '🤝' },
  { name: 'VIP/VVIP Ushering', description: 'Executive lounge hospitality and reserved dignitary seating assistance.', icon: '👑' },
  { name: 'Logistics & Venue Operations', description: 'Hall arrangements, acoustic/signage monitoring, and supply distribution.', icon: '📦' },
  { name: 'Media & Publicity', description: 'Press room coordination, social coverage support, and media escorts.', icon: '📸' },
  { name: 'IT & Digital Support', description: 'Summit app support, live stream monitoring, and presentation sync.', icon: '💻' },
  { name: 'Documentation & Rapporteur', description: 'Session note-taking, policy memo summaries, and communiqué drafting.', icon: '📝' },
  { name: 'Programme Support', description: 'Speaker timekeeping, microphone runners, and masterclass coordination.', icon: '⏱️' },
  { name: 'Hospitality & Refreshments', description: 'Executive dining liaison, coffee break flow, and catering support.', icon: '☕' },
  { name: 'Airport & Transport Coordination', description: 'Lagos airport reception, shuttle desk, and hotel transit liaison.', icon: '✈️' },
  { name: 'Emergency & Safety Support', description: 'First aid liaison, safety muster points, and safety drill monitoring.', icon: '🛡️' },
  { name: 'General Volunteer Support', description: 'Cross-functional operational workforce deployed wherever needed.', icon: '⭐' },
  { name: 'Other', description: 'Specialized capabilities aligned with Secretariat committee requirements.', icon: '✨' }
];

const AGE_GROUPS = [
  '18 - 24 years',
  '25 - 34 years',
  '35 - 44 years',
  '45 - 54 years',
  '55+ years'
];

const EDUCATION_STATUSES: ('Student' | 'Graduate' | 'Employed Professional' | 'Self-Employed' | 'Other')[] = [
  'Student',
  'Graduate',
  'Employed Professional',
  'Self-Employed',
  'Other'
];

const AVAILABILITY_OPTIONS: ('Full Summit (All Days)' | 'Summit Day Only (17 Nov)' | 'Pre-Summit & Summit Days' | 'Specific Shifts Only')[] = [
  'Full Summit (All Days)',
  'Summit Day Only (17 Nov)',
  'Pre-Summit & Summit Days',
  'Specific Shifts Only'
];

const SHIFTS: ('Morning Shift' | 'Afternoon / Evening Shift' | 'Full Day' | 'Flexible')[] = [
  'Morning Shift',
  'Afternoon / Evening Shift',
  'Full Day',
  'Flexible'
];

export default function VolunteerPage({ onBackToSummit, onNavigateToRegister }: VolunteerPageProps) {
  // Mode: 'apply' | 'lookup' | 'confirmed'
  const [activeTab, setActiveTab] = useState<'apply' | 'lookup'>('apply');

  // Form State - Applicant Type
  const [applicantType, setApplicantType] = useState<VolunteerApplicantType>('Individual Volunteer');

  // Form State - Corporate / Sponsoring / Nominating Organisation (when applicantType !== 'Individual Volunteer')
  const [sponsoringOrgName, setSponsoringOrgName] = useState('');
  const [sponsoringOrgType, setSponsoringOrgType] = useState('Airline / Commercial Carrier');
  const [sponsoringOrgSector, setSponsoringOrgSector] = useState('');
  const [sponsoringOrgAddress, setSponsoringOrgAddress] = useState('');
  const [sponsoringOrgEmail, setSponsoringOrgEmail] = useState('');
  const [sponsoringOrgPhone, setSponsoringOrgPhone] = useState('');
  const [orgContactPersonName, setOrgContactPersonName] = useState('');
  const [orgContactPersonPosition, setOrgContactPersonPosition] = useState('');
  const [orgContactPersonEmail, setOrgContactPersonEmail] = useState('');
  const [orgContactPersonPhone, setOrgContactPersonPhone] = useState('');

  // Form State - Nature of Support / Deployment
  const [natureOfSupport, setNatureOfSupport] = useState<NatureOfVolunteerSupport>('Sponsored Volunteer');
  const [sponsoredVolunteersCount, setSponsoredVolunteersCount] = useState('1');
  const [supportDescription, setSupportDescription] = useState('');
  const [corporateMessage, setCorporateMessage] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Form State - Personal
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dobOrAgeGroup, setDobOrAgeGroup] = useState('18 - 24 years');
  const [gender, setGender] = useState('Prefer not to say');
  const [country, setCountry] = useState('Nigeria');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('Ikeja');

  // Form State - Contact
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');

  // Form State - Professional / Educational
  const [occupation, setOccupation] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [profession, setProfession] = useState('');
  const [educationStatus, setEducationStatus] = useState<'Student' | 'Graduate' | 'Employed Professional' | 'Self-Employed' | 'Other'>('Graduate');
  const [qualifications, setQualifications] = useState('');
  const [skills, setSkills] = useState('');

  // Form State - Volunteer Preferences
  const [preferredDepartment, setPreferredDepartment] = useState<VolunteerDepartment>('Protocol');
  const [secondaryDepartment, setSecondaryDepartment] = useState<VolunteerDepartment>('Registration');
  const [experience, setExperience] = useState('');
  const [aviationExperience, setAviationExperience] = useState('');
  const [languages, setLanguages] = useState('English');
  const [specialSkills, setSpecialSkills] = useState('');
  const [availability, setAvailability] = useState<'Full Summit (All Days)' | 'Summit Day Only (17 Nov)' | 'Pre-Summit & Summit Days' | 'Specific Shifts Only'>('Full Summit (All Days)');
  const [preferredShift, setPreferredShift] = useState<'Morning Shift' | 'Afternoon / Evening Shift' | 'Full Day' | 'Flexible'>('Full Day');
  const [motivation, setMotivation] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Form State - Emergency
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Form State - Consent
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  // Submission / Error state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<{
    id: string;
    reference: string;
    applicantType?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredDepartment: string;
    secondaryDepartment?: string;
    availability: string;
    status: string;
    createdAt: string;
    sponsoringOrgName?: string;
  } | null>(null);

  // Copy Reference state
  const [copiedRef, setCopiedRef] = useState(false);

  // Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Social Share & Referral Tracking State
  const [incomingReferral, setIncomingReferral] = useState<string | null>(null);
  const [myReferralToken, setMyReferralToken] = useState<string>(() => generateVolunteerReferralToken());
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Parse incoming referral parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const rawRef = params.get('ref') || params.get('referral');
        const cleanRef = sanitizeReferralToken(rawRef);
        if (cleanRef) {
          setIncomingReferral(cleanRef);
          trackShareEvent({
            eventType: 'REFERRAL_LANDING',
            channel: 'referral_link',
            targetUrl: window.location.href,
            referralToken: cleanRef,
            landingPage: 'volunteer'
          });
        }
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsDuplicateError(false);

    // Client-side validations
    if (applicantType !== 'Individual Volunteer' && !sponsoringOrgName.trim()) {
      setErrorMessage('Please provide the name of the Sponsoring or Nominating Organisation.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please provide your First and Last Name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 7) {
      setErrorMessage('Please provide a valid phone number (at least 7 digits).');
      return;
    }
    if (!occupation.trim()) {
      setErrorMessage('Please state your current occupation or student major.');
      return;
    }
    if (!motivation.trim() || motivation.trim().length < 20) {
      setErrorMessage('Please write at least a brief sentence explaining your motivation to volunteer (minimum 20 characters).');
      return;
    }
    if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
      setErrorMessage('Please provide Emergency Contact Name and Telephone.');
      return;
    }
    if (!consentConfirmed) {
      setErrorMessage('You must confirm the declaration and consent before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        applicantType,
        sponsoringOrgName: applicantType !== 'Individual Volunteer' ? sponsoringOrgName.trim() : undefined,
        sponsoringOrgType: applicantType !== 'Individual Volunteer' ? sponsoringOrgType : undefined,
        sponsoringOrgSector: applicantType !== 'Individual Volunteer' ? sponsoringOrgSector.trim() : undefined,
        sponsoringOrgAddress: applicantType !== 'Individual Volunteer' ? sponsoringOrgAddress.trim() : undefined,
        sponsoringOrgEmail: applicantType !== 'Individual Volunteer' ? sponsoringOrgEmail.trim().toLowerCase() : undefined,
        sponsoringOrgPhone: applicantType !== 'Individual Volunteer' ? sponsoringOrgPhone.trim() : undefined,
        orgContactPersonName: applicantType !== 'Individual Volunteer' ? orgContactPersonName.trim() : undefined,
        orgContactPersonPosition: applicantType !== 'Individual Volunteer' ? orgContactPersonPosition.trim() : undefined,
        orgContactPersonEmail: applicantType !== 'Individual Volunteer' ? orgContactPersonEmail.trim().toLowerCase() : undefined,
        orgContactPersonPhone: applicantType !== 'Individual Volunteer' ? orgContactPersonPhone.trim() : undefined,
        natureOfSupport: applicantType !== 'Individual Volunteer' ? natureOfSupport : undefined,
        sponsoredVolunteersCount: applicantType !== 'Individual Volunteer' && sponsoredVolunteersCount ? parseInt(sponsoredVolunteersCount, 10) : undefined,
        supportDescription: applicantType !== 'Individual Volunteer' ? supportDescription.trim() : undefined,
        corporateMessage: applicantType !== 'Individual Volunteer' ? corporateMessage.trim() : undefined,
        specialRequirements: applicantType !== 'Individual Volunteer' ? specialRequirements.trim() : undefined,
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
        preferredName: preferredName.trim() || undefined,
        dobOrAgeGroup,
        gender,
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        address: address.trim(),
        occupation: occupation.trim(),
        organisation: organisation.trim() || (applicantType !== 'Individual Volunteer' ? sponsoringOrgName.trim() : undefined),
        profession: profession.trim() || undefined,
        educationStatus,
        qualifications: qualifications.trim() || undefined,
        skills: skills.trim(),
        preferredDepartment,
        secondaryDepartment,
        experience: experience.trim() || undefined,
        aviationExperience: aviationExperience.trim() || undefined,
        languages: languages.trim() || undefined,
        specialSkills: specialSkills.trim() || undefined,
        availability,
        preferredShift,
        motivation: motivation.trim(),
        additionalInfo: additionalInfo.trim() || undefined,
        emergencyContactName: emergencyContactName.trim(),
        emergencyRelationship: emergencyRelationship.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        referralCode: incomingReferral || undefined,
        consentConfirmed: true
      };

      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedApplication(data.application);
      } else {
        if (res.status === 409 || data.duplicate) {
          setIsDuplicateError(true);
          setErrorMessage(data.error || 'We found an existing volunteer application using these contact details. Please contact the Summit Secretariat if you need to update your application.');
        } else {
          setErrorMessage(data.error || 'Unable to submit application. Please check your details and try again.');
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('A network error occurred while communicating with the Summit Intake server. Please check your connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    if (!lookupQuery.trim()) {
      setLookupError('Please enter an application reference (e.g. ASS-VOL-2026-0001) or email address.');
      return;
    }

    setLookupLoading(true);
    try {
      const isRef = lookupQuery.toUpperCase().startsWith('ASS-VOL-');
      const param = isRef ? `reference=${encodeURIComponent(lookupQuery.trim().toUpperCase())}` : `email=${encodeURIComponent(lookupQuery.trim().toLowerCase())}`;
      const res = await fetch(`/api/volunteers/lookup?${param}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setLookupResult(data.application);
      } else {
        setLookupError(data.error || 'No matching volunteer application was found. Please verify your reference or email.');
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setLookupError('Network communication failure. Please retry.');
    } finally {
      setLookupLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#0A192F] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#0A192F] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top Breadcrumb / Return to Summit */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={onBackToSummit}
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0A192F] hover:text-[#D4AF37] transition-colors bg-white px-3.5 py-2 rounded-lg border border-[#D4AF37]/30 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#D4AF37]" />
          <span>Return to Summit</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'apply'
                ? 'bg-[#0A192F] text-[#FFD700] shadow-md border border-[#D4AF37]'
                : 'bg-white text-gray-600 hover:text-[#0A192F] border border-gray-200'
            }`}
          >
            Apply to Volunteer
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'lookup'
                ? 'bg-[#0A192F] text-[#FFD700] shadow-md border border-[#D4AF37]'
                : 'bg-white text-gray-600 hover:text-[#0A192F] border border-gray-200'
            }`}
          >
            Verify Reference
          </button>
          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all bg-white hover:bg-gray-50 text-[#0A192F] border border-[#D4AF37]/50 shadow-sm flex items-center space-x-1"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Verify Certificate</span>
          </button>
        </div>
      </div>

      {/* Incoming Referral Banner (if linked via ?ref=...) */}
      {incomingReferral && (
        <div className="max-w-5xl mx-auto mb-6 p-4 bg-emerald-950/90 text-white rounded-xl border border-emerald-400 shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                INVITATION & REFERRAL DETECTED
              </p>
              <p className="text-xs text-white">
                You were invited to apply by a Summit advocate (Token: <strong>{incomingReferral}</strong>). Your referral will be registered with your intake.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 bg-emerald-800 rounded border border-emerald-600 text-emerald-200 font-bold hidden sm:inline-block">
            VALID REFERRAL
          </span>
        </div>
      )}

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#0A192F] text-[#D4AF37] rounded-full border border-[#D4AF37]/40 shadow-sm">
          <Crown className="h-4 w-4 text-[#D4AF37]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FFD700]">
            WORKFORCE & VOLUNTEER INTAKE // 2026
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#0A192F] tracking-tight uppercase">
          VOLUNTEER WITH US
        </h1>

        <p className="text-[#B89025] font-serif italic text-base sm:text-lg max-w-2xl mx-auto">
          "Everybody is involved in aviation safety."
        </p>

        <p className="text-sm sm:text-base text-[#475569] font-light max-w-3xl mx-auto leading-relaxed">
          Join the dedicated operational workforce supporting the <strong className="text-[#0A192F] font-semibold">DomisLink Aviation Safety Summit 2026</strong>. Gain firsthand experience working alongside regulators, airlines, engineers, and international dignitaries.
        </p>
      </div>

      {/* VOLUNTEER FROM WHEREVER YOU ARE - Flexibility & Global Remote Highlight */}
      <div className="max-w-5xl mx-auto mb-10 bg-gradient-to-r from-[#0A192F] via-[#112340] to-[#0A192F] rounded-2xl border-2 border-[#D4AF37]/60 p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-[#FFD700]">
              <Globe className="h-5 w-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                FLEXIBLE WORKFORCE & REMOTE CONTRIBUTIONS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight uppercase text-white">
              VOLUNTEER FROM WHEREVER YOU ARE
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              <strong>You do not necessarily have to be in Lagos.</strong> Some assignments can be performed remotely from anywhere, subject to the Summit schedule and operational requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full lg:w-auto shrink-0">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
              <span className="block text-xs font-mono font-bold text-[#FFD700]">ON-SITE</span>
              <span className="text-[10px] text-gray-300">Marriott Lagos</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
              <span className="block text-xs font-mono font-bold text-[#FFD700]">REMOTE</span>
              <span className="text-[10px] text-gray-300">Worldwide</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center col-span-2 sm:col-span-1">
              <span className="block text-xs font-mono font-bold text-[#FFD700]">HYBRID</span>
              <span className="text-[10px] text-gray-300">Flexible Teams</span>
            </div>
          </div>
        </div>

        {/* Quick Social Sharing Bar inside Volunteer Hero */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase font-bold tracking-wider flex items-center space-x-1.5">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share this opportunity with friends, colleagues &amp; associations:</span>
            </span>
          </div>
          <DomisLinkSocialShare
            targetType="VOLUNTEER"
            variant="compact"
            referralToken={myReferralToken}
          />
        </div>
      </div>

      {/* SUCCESS CONFIRMATION VIEW */}
      {submittedApplication ? (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-10 space-y-8 animate-fadeIn">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
              OFFICIAL INTAKE RECEIPT
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#0A192F] uppercase">
              VOLUNTEER APPLICATION RECEIVED
            </h2>
            <p className="text-sm text-[#475569] max-w-lg mx-auto">
              Thank you for volunteering to support the <strong>DomisLink Aviation Safety Summit 2026</strong>. Your application has been logged in the volunteer intake registry.
            </p>
          </div>

          {/* Reference Banner */}
          <div className="p-6 bg-[#0A192F] rounded-xl border border-[#D4AF37]/50 text-white text-center space-y-3 shadow-lg">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              OFFICIAL APPLICATION REFERENCE NUMBER
            </span>
            <div className="flex items-center justify-center space-x-3">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#FFD700] tracking-wider selection:bg-white selection:text-black">
                {submittedApplication.reference}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(submittedApplication.reference)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors border border-white/20"
                title="Copy Reference"
              >
                {copiedRef ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#8A99AD] font-sans">
              Keep this reference safe. You will need it for any communications with the Summit Secretariat.
            </p>
          </div>

          {/* Application Details Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans border border-gray-200 rounded-xl p-5 bg-gray-50/70">
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Applicant Name</span>
              <span className="font-bold text-[#0A192F] text-sm">{submittedApplication.firstName} {submittedApplication.lastName}</span>
            </div>
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Application Category</span>
              <span className="font-bold text-[#0A192F] inline-flex items-center space-x-1">
                <span>{submittedApplication.applicantType || 'Individual Volunteer'}</span>
              </span>
            </div>
            {submittedApplication.sponsoringOrgName && (
              <div className="sm:col-span-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                <span className="text-amber-800 font-mono text-[10px] uppercase block font-semibold">Sponsoring / Nominating Organisation</span>
                <span className="font-bold text-sm text-[#0A192F]">{submittedApplication.sponsoringOrgName}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Registered Email</span>
              <span className="font-semibold text-gray-800">{submittedApplication.email}</span>
            </div>
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Primary Volunteer Area</span>
              <span className="font-bold text-[#0A192F]">{submittedApplication.preferredDepartment}</span>
            </div>
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Availability Schedule</span>
              <span className="font-medium text-gray-800">{submittedApplication.availability}</span>
            </div>
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Intake Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {submittedApplication.status}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Date Logged</span>
              <span className="font-mono text-gray-700">{new Date(submittedApplication.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Official Secretariat Notice */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start space-x-3 text-xs text-amber-900 leading-relaxed">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 uppercase text-[11px] mb-1 font-mono">
                NEXT STEPS & SECRETARIAT REVIEW
              </p>
              <p>
                Your application has been received by the Summit volunteer intake system. Submission does not constitute selection or appointment. The Secretariat will review applications according to committee operational requirements and contact shortlisted applicants via email and phone.
              </p>
            </div>
          </div>

          {/* Share with Friends & Colleagues Banner */}
          <div className="p-5 bg-gradient-to-r from-[#0A192F] to-[#132545] rounded-xl border border-[#D4AF37]/40 text-white space-y-4 shadow-md">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#FFD700]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFD700]">
                Invite Colleagues to Join the Summit Workforce
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Know colleagues, students, or fellow aviation professionals who should volunteer? Share your invitation link with them.
            </p>
            <DomisLinkSocialShare
              targetType="VOLUNTEER"
              variant="compact"
              referralToken={myReferralToken}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-gray-100 text-[#0A192F] font-bold text-xs rounded-xl border border-gray-300 shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <Printer className="h-4 w-4 text-[#D4AF37]" />
              <span>Print Application Receipt</span>
            </button>

            <button
              onClick={onBackToSummit}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0A192F] hover:bg-[#1E293B] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <span>Return to Summit Main</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : activeTab === 'lookup' ? (
        /* REFERENCE LOOKUP VIEW */
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#D4AF37]/40 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-serif font-bold text-[#0A192F] uppercase">
              Verify Volunteer Application
            </h2>
            <p className="text-xs text-[#5A6E85]">
              Check the registration status of your volunteer intake submission.
            </p>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-gray-600 uppercase font-bold mb-1">
                Application Reference (e.g. ASS-VOL-2026-0001) or Email
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="ASS-VOL-2026-0001 or name@example.com"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="flex-1 text-xs p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="px-5 py-3 bg-[#0A192F] hover:bg-[#1E293B] text-[#FFD700] font-bold text-xs rounded-lg uppercase tracking-wider flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <Search className="h-4 w-4" />
                  <span>{lookupLoading ? 'Checking...' : 'Verify'}</span>
                </button>
              </div>
            </div>

            {lookupError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}

            {lookupResult && (
              <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase font-mono">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Application Found in Registry</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Reference</span>
                    <span className="font-mono font-bold text-[#0A192F]">{lookupResult.reference}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Applicant</span>
                    <span className="font-semibold text-gray-900">{lookupResult.firstName} {lookupResult.lastName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Department</span>
                    <span className="font-semibold text-gray-900">{lookupResult.preferredDepartment}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Status</span>
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                      {lookupResult.status}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 italic pt-2 border-t border-emerald-100">
                  Application logged on {new Date(lookupResult.createdAt).toLocaleDateString()}. The Secretariat will communicate interview/briefing schedules directly.
                </p>
              </div>
            )}
          </form>
        </div>
      ) : (
        /* APPLICATION FORM VIEW */
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Volunteer Department Highlights Grid */}
          <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-[#0A192F] uppercase flex items-center space-x-2">
                <Users className="h-5 w-5 text-[#D4AF37]" />
                <span>Available Volunteer Departments & Areas</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Select your primary and secondary preferences in the application below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {DEPARTMENTS.slice(0, 12).map((dept) => (
                <div
                  key={dept.name}
                  onClick={() => setPreferredDepartment(dept.name)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    preferredDepartment === dept.name
                      ? 'bg-[#0A192F] border-[#D4AF37] text-white shadow-md'
                      : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-[#D4AF37]/50 text-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-base">{dept.icon}</span>
                    <h4 className={`text-xs font-bold ${preferredDepartment === dept.name ? 'text-[#FFD700]' : 'text-[#0A192F]'}`}>
                      {dept.name}
                    </h4>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${preferredDepartment === dept.name ? 'text-[#8A99AD]' : 'text-gray-500'}`}>
                    {dept.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* APPLICATION FORM */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D4AF37]/35 shadow-xl p-6 sm:p-10 space-y-10">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                isDuplicateError
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-[11px] font-mono">
                    {isDuplicateError ? 'Existing Application Detected' : 'Submission Alert'}
                  </p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* SECTION 1: APPLICANT CATEGORY & NOMINATION TYPE */}
            <div className="space-y-5">
              <div className="border-b border-[#D4AF37]/20 pb-3 flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#FFD700] text-xs font-mono font-bold flex items-center justify-center">1</span>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">
                    Applicant Category & Nomination Status
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Select whether you are applying independently or sponsored/nominated by an organisation.
                  </p>
                </div>
              </div>

              {/* Applicant Type Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {APPLICANT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setApplicantType(type.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      applicantType === type.id
                        ? 'bg-[#0A192F] border-[#D4AF37] text-white shadow-md ring-2 ring-[#D4AF37]/50'
                        : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-[#D4AF37]/40 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-xl">{type.icon}</span>
                      <h4 className={`text-xs font-bold ${applicantType === type.id ? 'text-[#FFD700]' : 'text-[#0A192F]'}`}>
                        {type.title}
                      </h4>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${applicantType === type.id ? 'text-[#CBD5E1]' : 'text-gray-500'}`}>
                      {type.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              {applicantType !== 'Individual Volunteer' && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start space-x-2.5 text-xs text-blue-900">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-mono text-[10px] uppercase block text-blue-950">
                      INDIVIDUAL DEPLOYMENT ARCHITECTURE
                    </span>
                    <p className="text-[11px] text-blue-800">
                      Corporate-sponsored and nominated volunteers remain individual participants. Multiple volunteers may be deployed by the same organisation; each applicant receives their own separate <strong>ASS-VOL-2026-XXXX</strong> reference and individual profile.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: CORPORATE / SPONSORING ORGANISATION DETAILS (Only when Corporate or Nominated) */}
            {applicantType !== 'Individual Volunteer' && (
              <div className="space-y-5 p-5 bg-amber-50/40 rounded-xl border border-amber-200/80 animate-fadeIn">
                <div className="border-b border-amber-200 pb-3 flex items-center space-x-2">
                  <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#FFD700] text-xs font-mono font-bold flex items-center justify-center">2</span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">
                      Sponsoring / Nominating Organisation Information
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      Details of the airline, agency, institution, or corporate entity sponsoring your deployment.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-700 uppercase font-semibold">
                      Organisation / Corporate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Air Peace Ltd / NCAA / NAMA / Skyway Handling"
                      value={sponsoringOrgName}
                      onChange={(e) => setSponsoringOrgName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-gray-700 uppercase font-semibold">
                      Organisation Type
                    </label>
                    <select
                      value={sponsoringOrgType}
                      onChange={(e) => setSponsoringOrgType(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    >
                      {ORGANISATION_TYPES.map((ot) => (
                        <option key={ot} value={ot}>{ot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-gray-700 uppercase font-semibold">
                      Organisation Sector / Industry
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Commercial Aviation, Ground Operations, Telecoms"
                      value={sponsoringOrgSector}
                      onChange={(e) => setSponsoringOrgSector(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-gray-700 uppercase font-semibold">
                      Official Organisation Email
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. corporate@organisation.com"
                      value={sponsoringOrgEmail}
                      onChange={(e) => setSponsoringOrgEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-gray-700 uppercase font-semibold">
                      Official Organisation Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +234 1 234 5678"
                      value={sponsoringOrgPhone}
                      onChange={(e) => setSponsoringOrgPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-700 uppercase font-semibold">
                    Organisation Physical / Head Office Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Murtala Muhammed International Airport Complex, Ikeja, Lagos"
                    value={sponsoringOrgAddress}
                    onChange={(e) => setSponsoringOrgAddress(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                {/* Organisation Liaison / Contact Person */}
                <div className="pt-3 border-t border-amber-200/60">
                  <h4 className="text-xs font-mono font-bold uppercase text-[#0A192F] mb-3">
                    Corporate Liaison / Authorising Contact Person
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-600 uppercase">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Kemi Balogun"
                        value={orgContactPersonName}
                        onChange={(e) => setOrgContactPersonName(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-600 uppercase">
                        Position / Designation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Head of HR & CSR"
                        value={orgContactPersonPosition}
                        onChange={(e) => setOrgContactPersonPosition(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-600 uppercase">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. liaison@company.com"
                        value={orgContactPersonEmail}
                        onChange={(e) => setOrgContactPersonEmail(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-600 uppercase">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +234 802 000 1111"
                        value={orgContactPersonPhone}
                        onChange={(e) => setOrgContactPersonPhone(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Nature of Support / Deployment */}
                <div className="pt-3 border-t border-amber-200/60 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-[#0A192F]">
                    Nature of Support & Deployment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-600 uppercase">
                        Support / Deployment Category
                      </label>
                      <select
                        value={natureOfSupport}
                        onChange={(e) => setNatureOfSupport(e.target.value as NatureOfVolunteerSupport)}
                        className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none font-medium"
                      >
                        {NATURE_OF_SUPPORT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-gray-600 uppercase">
                        Total Volunteers Nominated / Deployed by Organisation
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        placeholder="e.g. 1, 5, 10"
                        value={sponsoredVolunteersCount}
                        onChange={(e) => setSponsoredVolunteersCount(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-gray-600 uppercase">
                      Description of Support / Corporate Message
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly state the corporate objective or message supporting the Summit..."
                      value={corporateMessage || supportDescription}
                      onChange={(e) => {
                        setCorporateMessage(e.target.value);
                        setSupportDescription(e.target.value);
                      }}
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-gray-600 uppercase">
                      Special Requirements / Duty Preferences (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Protocol deployment, Airport reception liaison, Executive hospitality"
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 3: PERSONAL INFORMATION */}
            <div className="space-y-5">
              <div className="border-b border-[#D4AF37]/20 pb-3 flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#FFD700] text-xs font-mono font-bold flex items-center justify-center">
                  {applicantType === 'Individual Volunteer' ? '2' : '3'}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">
                    Individual Volunteer Personal Information
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Your personal identity and profile as a participating volunteer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Middle Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Babatunde"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Last Name / Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adeyemi"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Preferred Name / Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sam"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Age Bracket <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dobOrAgeGroup}
                    onChange={(e) => setDobOrAgeGroup(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    {AGE_GROUPS.map((ag) => (
                      <option key={ag} value={ag}>{ag}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Gender (Optional)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Country of Residence <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    State / Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    City / Municipality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ikeja"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: CONTACT INFORMATION */}
            <div className="space-y-5">
              <div className="border-b border-[#D4AF37]/20 pb-3 flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#FFD700] text-xs font-mono font-bold flex items-center justify-center">2</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. samuel.adeyemi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-400">Used for official Secretariat dispatch & duplicate prevention.</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Primary Telephone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 802 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Alternative Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 706 111 2233"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                  Residential / Local Address in Lagos or Vicinity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 Isaac John Street, GRA Ikeja, Lagos"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* SECTION 3: PROFESSIONAL / EDUCATIONAL */}
            <div className="space-y-5">
              <div className="border-b border-[#D4AF37]/20 pb-3 flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#FFD700] text-xs font-mono font-bold flex items-center justify-center">3</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">
                  Educational & Professional Background
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Status / Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={educationStatus}
                    onChange={(e) => setEducationStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    {EDUCATION_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Occupation / Course of Study <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aeronautical Engineering Student / Protocol Officer"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Institution or Employer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nigerian College of Aviation Technology (NCAT) / University of Lagos"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Key Qualifications / Certifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Sc, HND, ICAO cert, First Aid cert, Customer Care"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Relevant Skills (Technical, Languages, Public Speaking) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fast typing, French fluency, Audio mixing, VIP ushering"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: VOLUNTEER PREFERENCES & AVAILABILITY */}
            <div className="space-y-5">
              <div className="border-b border-[#D4AF37]/20 pb-3 flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#FFD700] text-xs font-mono font-bold flex items-center justify-center">4</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">
                  Volunteer Preferences & Availability
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    1st Preference Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={preferredDepartment}
                    onChange={(e) => setPreferredDepartment(e.target.value as VolunteerDepartment)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none font-medium"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    2nd Preference Department (Backup)
                  </label>
                  <select
                    value={secondaryDepartment}
                    onChange={(e) => setSecondaryDepartment(e.target.value as VolunteerDepartment)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Availability Period <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    {AVAILABILITY_OPTIONS.map((av) => (
                      <option key={av} value={av}>{av}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Preferred Shift
                  </label>
                  <select
                    value={preferredShift}
                    onChange={(e) => setPreferredShift(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    {SHIFTS.map((sh) => (
                      <option key={sh} value={sh}>{sh}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. English, Yoruba, Hausa, French"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                  Why do you want to volunteer for the Aviation Safety Summit 2026? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share what inspires you to support this national aviation safety milestone..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                  Prior Event / Aviation Experience (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe any past conferences, aviation events, or volunteer roles you have held..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 5: EMERGENCY CONTACT */}
            <div className="space-y-5">
              <div className="border-b border-[#D4AF37]/20 pb-3 flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-[#0A192F] text-[#FFD700] text-xs font-mono font-bold flex items-center justify-center">5</span>
                <h3 className="font-serif font-bold text-base text-[#0A192F] uppercase">
                  Emergency Contact
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Emergency Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Folashade Adeyemi"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parent / Spouse / Sibling"
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-gray-600 uppercase font-semibold">
                    Emergency Telephone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 999 8888"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: DECLARATION & CONSENT */}
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="volunteerConsent"
                  required
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#D4AF37] rounded border-gray-300 focus:ring-[#D4AF37] cursor-pointer"
                />
                <label htmlFor="volunteerConsent" className="text-xs text-gray-700 leading-relaxed cursor-pointer select-none">
                  <strong className="text-[#0A192F]">Official Declaration & Data Consent:</strong> I hereby certify that the information supplied in this application is true and accurate. I understand that submitting this application does not guarantee appointment or selection, and that final deployment is subject to Summit Secretariat review. If appointed, I agree to abide by the Summit code of conduct, volunteer orientation directives, and security guidelines. I consent to the processing of this data for official Summit administration under the Nigeria Data Protection Act (NDPA 2023).
                </label>
              </div>
            </div>

            {/* SUBMISSION BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-[#0A192F] via-[#132545] to-[#0A192F] hover:from-[#132545] hover:to-[#0A192F] border-2 border-[#D4AF37] text-[#FFD700] hover:text-white font-serif font-bold text-sm tracking-widest uppercase rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-2xl"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#FFD700] border-t-transparent"></span>
                    <span>Transmitting Application to Intake Registry...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Volunteer Application</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-gray-400 font-mono mt-2">
                No fee is required to apply. Voluntary service is governed by DomisLink International Services Ltd.
              </p>
            </div>

          </form>

        </div>
      )}

      {/* Public Safe Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />

    </div>
  );
}
