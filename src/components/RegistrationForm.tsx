/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Send, CheckCircle2, Ticket, Printer, MapPin, Calendar, 
  Building, User, Mail, Phone, Globe, Briefcase, Tag, 
  ShieldCheck, AlertCircle, ChevronDown, ChevronUp, Copy, 
  Check, Download, ExternalLink, Sparkles, FileText, ArrowRight,
  RefreshCw, Utensils, Accessibility, HeartHandshake, EyeOff
} from 'lucide-react';
import { Registration } from '../types';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

interface RegisterProps {
  onRegister: (reg: {
    fullName: string;
    email: string;
    phone: string;
    organisation: string;
    position: string;
    industry: string;
    country: string;
    attendanceCategory: string;
    attendanceType?: 'In-Person' | 'Virtual';
    dietaryRequirements?: string;
    accessibilityRequirements?: string;
    specialRequests?: string;
    consentNDPA: boolean;
  }) => Promise<Registration | null>;
}

const INDUSTRY_OPTIONS = [
  'Airlines & Air Transport',
  'Aviation Agencies & Regulators (NCAA, FAAN, NAMA, NiMet, NSIB)',
  'Airports & Ground Services',
  'Air Traffic Control & Flight Navigation',
  'Aircraft Maintenance & Repairs (MRO)',
  'Aircraft Manufacturing & Parts',
  'Aviation Schools & Flight Training',
  'Aviation Fuel & Oil Supply',
  'Banking, Finance & Insurance',
  'Emergency Services & Rescue',
  'IT, Software & Aviation Tech',
  'Charter Flights & Private Jets',
  'News & Media',
  'Other Aviation Field'
];

const ATTENDANCE_CATEGORIES = [
  'Airline Leader / Manager',
  'Government Official / Regulator',
  'Pilot / Flight Crew',
  'Air Traffic Controller / Flight Dispatcher',
  'Aircraft Engineer / Technician',
  'Safety & Quality Manager',
  'Flight Instructor / Trainer',
  'Fuel & Airport Operations Staff',
  'Finance, Legal & Insurance Specialist',
  'Journalist / Media',
  'General Attendee / Guest'
];

const TOP_COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Rwanda',
  'Ethiopia',
  'Egypt',
  'United Kingdom',
  'United States',
  'United Arab Emirates',
  'France',
  'Germany',
  'Canada',
  'Other Country'
];

export default function RegistrationForm({ onRegister }: RegisterProps) {
  const [submitting, setSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<Registration | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Required Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [position, setPosition] = useState('');
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [country, setCountry] = useState('Nigeria');
  const [customCountry, setCustomCountry] = useState('');
  const [attendanceCategory, setAttendanceCategory] = useState(ATTENDANCE_CATEGORIES[0]);

  // Optional Fields State
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [accessibilityRequirements, setAccessibilityRequirements] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Legal Consent & Jurisdiction (Nigeria Data Protection Act 2023)
  const [consentNDPA, setConsentNDPA] = useState(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !organisation.trim() || !position.trim()) {
      setErrorMessage('Please fill in all required fields marked with an asterisk (*).');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!consentNDPA) {
      setErrorMessage('Please check the box to agree to the privacy and data protection terms.');
      return;
    }

    setSubmitting(true);
    try {
      const finalCountry = country === 'Other Country' && customCountry.trim() ? customCountry.trim() : country;
      
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organisation: organisation.trim(),
        position: position.trim(),
        industry,
        country: finalCountry,
        attendanceCategory,
        attendanceType: 'In-Person' as const,
        dietaryRequirements: dietaryRequirements.trim(),
        accessibilityRequirements: accessibilityRequirements.trim(),
        specialRequests: specialRequests.trim(),
        consentNDPA
      };

      const result = await onRegister(payload);
      if (result) {
        setConfirmationData(result);
        // Scroll to confirmation view smoothly
        const element = document.getElementById('register');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setErrorMessage('Could not save your registration. Please check your connection and try again.');
      }
    } catch (err) {
      console.error('Registration submit error:', err);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset to form
  const handleRegisterAnother = () => {
    setConfirmationData(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganisation('');
    setPosition('');
    setIndustry(INDUSTRY_OPTIONS[0]);
    setCountry('Nigeria');
    setCustomCountry('');
    setAttendanceCategory(ATTENDANCE_CATEGORIES[0]);
    setDietaryRequirements('');
    setAccessibilityRequirements('');
    setSpecialRequests('');
    setConsentNDPA(false);
    setErrorMessage('');
    setShowOptionalFields(false);
  };

  // Copy registration code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download iCal event
  const handleDownloadCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Domislink International//Aviation Safety Summit 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Aviation Safety Summit 2026',
      'DESCRIPTION:National & International Aviation Safety Summit 2026. Theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY. Hosted by Domislink International Services Ltd.',
      'LOCATION:Marriott Hotel\\, Ikeja\\, Lagos\\, Nigeria',
      'DTSTART:20261117T080000Z',
      'DTEND:20261117T180000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Aviation_Safety_Summit_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download VIP Pass PDF with jsPDF
  const handleDownloadPdf = () => {
    if (!confirmationData) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [10, 25, 47]; // #0A192F
    const goldColor = [212, 175, 55]; // #D4AF37

    doc.setFillColor(252, 251, 247);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(10, 10, 190, 45, 'F');

    doc.setLineWidth(0.8);
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(10, 10, 190, 45, 'S');

    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('DOMISLINK INTERNATIONAL SERVICES LTD', 20, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('OFFICIAL VIP DELEGATE PASS', 20, 33);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('AVIATION SAFETY SUMMIT 2026', 20, 42);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(10, 60, 190, 150, 3, 3, 'FD');

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('REGISTRATION CODE:', 20, 75);
    doc.setTextColor(10, 25, 47);
    doc.setFontSize(14);
    doc.text(confirmationData.registrationCode || confirmationData.id, 20, 83);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('FULL NAME:', 20, 98);
    doc.setTextColor(10, 25, 47);
    doc.setFontSize(14);
    doc.text(confirmationData.fullName.toUpperCase(), 20, 106);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('POSITION & ORGANISATION:', 20, 121);
    doc.setTextColor(10, 25, 47);
    doc.setFontSize(11);
    doc.text(`${confirmationData.position} - ${confirmationData.organisation}`, 20, 129);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('ATTENDANCE CATEGORY & INDUSTRY:', 20, 144);
    doc.setTextColor(10, 25, 47);
    doc.setFontSize(11);
    doc.text(`${confirmationData.attendanceCategory} | ${confirmationData.industry}`, 20, 152);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('COUNTRY & ACCESS:', 20, 167);
    doc.setTextColor(10, 25, 47);
    doc.setFontSize(11);
    doc.text(`${confirmationData.country} (${confirmationData.attendanceType || 'In-Person'})`, 20, 175);

    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, 185, 170, 20, 2, 2, 'F');
    doc.setTextColor(10, 25, 47);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('VENUE: Marriott Hotel, Ikeja, Lagos, Nigeria  |  DATE: 17 November 2026', 25, 197);

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Protected under Nigeria Data Protection Act (NDPA) 2023. Please present this pass at reception.', 15, 230);
    doc.text('Domislink International Services Ltd - Official Accreditation', 15, 236);

    doc.save(`Domislink_VIP_Pass_${confirmationData.registrationCode || confirmationData.id}.pdf`);
  };

  return (
    <section id="register" className="py-16 sm:py-24 bg-[#FCFBF7] border-b border-[#D4AF37]/15 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* POST-SUBMISSION CONFIRMATION PAGE (WHEN REGISTRATION IS SUBMITTED) */}
        {/* ========================================================================= */}
        {confirmationData ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* MANDATED EXACT CONFIRMATION HEADER */}
            <div className="bg-[#0A192F] text-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left">
              <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <CheckCircle2 className="h-9 w-9 sm:h-11 sm:w-11" />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-[10px] font-mono font-bold tracking-widest uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>REGISTRATION CONFIRMED</span>
                  </div>

                  {/* MANDATED TEXT: REGISTRATION RECEIVED */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white uppercase pt-1">
                    REGISTRATION RECEIVED
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
                    Your registration is confirmed. Please save or print this event pass and show your registration code at the reception desk when you arrive.
                  </p>
                </div>
              </div>

              {/* MANDATED EVENT, DATE, AND VENUE FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-left">
                {/* Event */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
                    EVENT:
                  </span>
                  <p className="text-base sm:text-lg font-serif font-bold text-white uppercase mt-1">
                    Aviation Safety Summit 2026
                  </p>
                </div>

                {/* Date */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
                    DATE:
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                    <p className="text-base sm:text-lg font-bold text-white">
                      17 November 2026
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
                    VENUE:
                  </span>
                  <div className="flex items-start space-x-2 mt-1">
                    <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      Marriott Hotel, Ikeja, Lagos, Nigeria
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* DIGITAL DELEGATE ACCREDITATION PASS CARD */}
            <div className="bg-white border-2 border-dashed border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden print:border-solid print:shadow-none">
              
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                    DOMISLINK INTERNATIONAL SERVICES LTD
                  </span>
                  <h2 className="text-xl font-serif font-black text-[#0A192F] uppercase tracking-wide">
                    OFFICIAL EVENT PASS
                  </h2>
                </div>

                {/* Reference Code with Copy button */}
                <div className="bg-[#FCFBF7] border border-[#D4AF37]/40 rounded-xl p-2.5 sm:px-4 flex items-center space-x-3">
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">
                      REGISTRATION CODE
                    </span>
                    <span className="text-base sm:text-lg font-mono font-black text-[#0A192F]">
                      {confirmationData.registrationCode || confirmationData.id}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(confirmationData.registrationCode || confirmationData.id)}
                    className="p-2 bg-white border border-gray-200 hover:border-[#D4AF37] rounded-lg text-gray-600 hover:text-[#0A192F] transition-colors"
                    title="Copy Registration Code"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Delegate Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-b border-gray-100 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
                    FULL NAME
                  </span>
                  <p className="text-base font-bold text-[#0A192F]">{confirmationData.fullName}</p>
                </div>

                {/* Position */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
                    JOB TITLE
                  </span>
                  <p className="text-sm font-semibold text-gray-800">{confirmationData.position}</p>
                </div>

                {/* Organisation */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
                    ORGANISATION
                  </span>
                  <p className="text-sm font-semibold text-gray-800">{confirmationData.organisation}</p>
                </div>

                {/* Attendance Category */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
                    CATEGORY
                  </span>
                  <span className="inline-block px-2.5 py-1 bg-[#0A192F] text-[#D4AF37] text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider">
                    {confirmationData.attendanceCategory}
                  </span>
                </div>

                {/* Industry */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
                    INDUSTRY
                  </span>
                  <p className="text-xs font-semibold text-gray-700">{confirmationData.industry}</p>
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
                    COUNTRY
                  </span>
                  <p className="text-xs font-bold text-gray-800">{confirmationData.country}</p>
                </div>
              </div>

              {/* Optional Accommodations Summary (if specified) */}
              {(confirmationData.dietaryRequirements || confirmationData.accessibilityRequirements || confirmationData.specialRequests) && (
                <div className="py-4 border-b border-gray-100 bg-[#FCFBF7] rounded-xl p-4 my-4 space-y-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase font-bold tracking-wider block">
                    RECORDED SPECIAL REQUESTS & NEEDS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {confirmationData.dietaryRequirements && (
                      <div>
                        <span className="text-[9px] text-gray-400 block font-mono">DIETARY:</span>
                        <span className="font-semibold text-gray-800">{confirmationData.dietaryRequirements}</span>
                      </div>
                    )}
                    {confirmationData.accessibilityRequirements && (
                      <div>
                        <span className="text-[9px] text-gray-400 block font-mono">ACCESSIBILITY:</span>
                        <span className="font-semibold text-gray-800">{confirmationData.accessibilityRequirements}</span>
                      </div>
                    )}
                    {confirmationData.specialRequests && (
                      <div>
                        <span className="text-[9px] text-gray-400 block font-mono">SPECIAL REQUEST:</span>
                        <span className="font-semibold text-gray-800">{confirmationData.specialRequests}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pass Security & Barcode Footnote */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 font-mono">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>NDPA 2023 PROTECTED RECORD</span>
                  </div>
                  <p className="text-gray-500">
                    Pass ID: {confirmationData.id.replace('reg-', 'AVS26-')} | Venue: Marriott Hotel Ikeja, Lagos
                  </p>
                </div>

                {/* Aesthetic Barcode Representation for Pass */}
                <div className="h-10 flex items-center space-x-1 opacity-75">
                  <div className="w-1 h-8 bg-gray-900"></div>
                  <div className="w-0.5 h-8 bg-gray-900"></div>
                  <div className="w-2 h-8 bg-gray-900"></div>
                  <div className="w-1 h-8 bg-gray-900"></div>
                  <div className="w-0.5 h-8 bg-gray-900"></div>
                  <div className="w-1.5 h-8 bg-gray-900"></div>
                  <div className="w-1 h-8 bg-gray-900"></div>
                  <div className="w-2 h-8 bg-gray-900"></div>
                  <div className="w-0.5 h-8 bg-gray-900"></div>
                  <div className="w-1.5 h-8 bg-gray-900"></div>
                  <div className="w-1 h-8 bg-gray-900"></div>
                  <div className="w-0.5 h-8 bg-gray-900"></div>
                  <div className="w-2 h-8 bg-gray-900"></div>
                  <div className="w-1 h-8 bg-gray-900"></div>
                </div>
              </div>

            </div>

            {/* Action Bar (Print, Calendar, New Registration) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
              <button
                onClick={handleRegisterAnother}
                className="px-6 py-3.5 border-2 border-gray-300 hover:border-[#0A192F] text-gray-700 hover:text-[#0A192F] font-mono text-xs uppercase font-bold rounded-xl transition-all text-center flex items-center justify-center space-x-2 bg-white"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Register Another Person</span>
              </button>

              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <button
                  onClick={handleDownloadPdf}
                  className="px-5 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:brightness-110 text-[#050B1A] font-mono text-xs uppercase font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download VIP Pass (PDF)</span>
                </button>

                <button
                  onClick={handleDownloadCalendar}
                  className="px-5 py-3.5 bg-white border border-[#D4AF37]/50 hover:bg-[#FCFBF7] text-[#0A192F] font-mono text-xs uppercase font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-4 w-4 text-[#D4AF37]" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-6 py-3.5 bg-[#0A192F] hover:bg-[#1E293B] text-white font-mono text-xs uppercase font-bold rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Printer className="h-4 w-4 text-[#D4AF37]" />
                  <span>Print / Save Pass</span>
                </button>
              </div>
            </div>

            {/* Privacy & Confidentiality Notice (Non-public reassurance) */}
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 text-xs flex items-start space-x-3">
              <EyeOff className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
              <div className="space-y-1 text-[11px] leading-relaxed">
                <span className="font-bold text-slate-800 uppercase block font-mono">
                  YOUR PRIVACY IS PROTECTED
                </span>
                <p>
                  To protect your privacy under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>, your phone number and email address are kept safe in our private records and are <strong>never shown on any public list</strong>.
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* MOBILE-FIRST REGISTRATION FORM */
          /* ========================================================================= */
          <div className="space-y-10">
            
            {/* Header / Intro */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full text-[#AA7C11] text-[10px] font-mono font-bold tracking-widest uppercase">
                <Ticket className="h-3 w-3" />
                <span>SUMMIT REGISTRATION</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0A192F] uppercase tracking-tight">
                EVENT REGISTRATION
              </h2>
              
              <p className="text-xs sm:text-sm text-[#5A6E85] font-light max-w-xl mx-auto leading-relaxed">
                Fill out the simple form below to register. It takes less than 2 minutes and works smoothly on mobile phones. Attendance is free for registered participants.
              </p>
            </div>

            {/* Quick Event Metadata Reminder Card */}
            <div className="bg-[#0A192F] text-white p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#D4AF37]/20 rounded-xl text-[#D4AF37]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase block">DATE</span>
                  <span className="font-bold text-white">17 November 2026</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#D4AF37]/20 rounded-xl text-[#D4AF37]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase block">VENUE</span>
                  <span className="font-bold text-white">Marriott Hotel, Ikeja, Lagos</span>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>NDPA 2023 PROTECTED</span>
              </div>
            </div>

            {/* Main Form Container */}
            <form 
              onSubmit={handleSubmit} 
              className="bg-white border border-[#D4AF37]/25 rounded-3xl p-5 sm:p-8 md:p-10 shadow-lg space-y-8"
              noValidate
            >
              {/* Error Notification */}
              {errorMessage && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-xs animate-shake">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold uppercase font-mono">Please Note:</span>
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------------------- */}
              {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
              {/* --------------------------------------------------------------------- */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <User className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-[#0A192F] uppercase tracking-wider">
                    1. Personal & Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label 
                      htmlFor="fullName"
                      className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Captain Aisha Bello"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 transition-all min-h-[48px]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="email"
                      className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        required
                        autoComplete="email"
                        placeholder="e.g. pilot.bello@airpeace.com.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 transition-all min-h-[48px]"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="phone"
                      className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        placeholder="e.g. +234 803 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 font-mono transition-all min-h-[48px]"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* SECTION 2: ORGANISATION & WORK DETAILS */}
              {/* --------------------------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <Building className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-[#0A192F] uppercase tracking-wider">
                    2. Organisation & Work Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Organisation */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="organisation"
                      className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                    >
                      Organisation <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="organisation"
                      name="organisation"
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder="e.g. Air Peace, NCAA, NAMA, FAAN"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 transition-all min-h-[48px]"
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="position"
                      className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                    >
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      required
                      autoComplete="organization-title"
                      placeholder="e.g. Flight Director, Pilot, Engineer"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 transition-all min-h-[48px]"
                    />
                  </div>

                  {/* Industry */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label 
                      htmlFor="industry"
                      className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                    >
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="industry"
                        name="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 transition-all appearance-none cursor-pointer min-h-[48px] pr-10"
                      >
                        {INDUSTRY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label 
                      htmlFor="country"
                      className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 transition-all appearance-none cursor-pointer min-h-[48px] pr-10 font-medium"
                      >
                        {TOP_COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {country === 'Other Country' && (
                      <input
                        type="text"
                        placeholder="Please type your country name..."
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        className="w-full text-sm p-3.5 mt-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        autoFocus
                      />
                    )}
                  </div>

                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* SECTION 3: ATTENDANCE CATEGORY */}
              {/* --------------------------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <Tag className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-[#0A192F] uppercase tracking-wider">
                    3. Attendance Category
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label 
                    htmlFor="attendanceCategory"
                    className="block text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wide"
                  >
                    Attendance Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="attendanceCategory"
                      name="attendanceCategory"
                      value={attendanceCategory}
                      onChange={(e) => setAttendanceCategory(e.target.value)}
                      className="w-full text-sm p-3.5 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white text-gray-900 transition-all appearance-none cursor-pointer min-h-[48px] pr-10 font-bold"
                    >
                      {ATTENDANCE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-gray-500 font-light pt-0.5">
                    This helps us prepare your name badge and group materials for the day.
                  </p>
                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* SECTION 4: OPTIONAL REQUIREMENTS */}
              {/* --------------------------------------------------------------------- */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="w-full p-4 bg-[#FCFBF7] hover:bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-between text-left transition-all min-h-[48px]"
                >
                  <div className="flex items-center space-x-3">
                    <HeartHandshake className="h-5 w-5 text-[#D4AF37]" />
                    <div>
                      <span className="text-xs font-mono font-bold text-[#0A192F] uppercase tracking-wider block">
                        Optional: Special Needs & Preferences
                      </span>
                      <span className="text-[11px] text-gray-500 font-light">
                        Dietary requirements, accessibility assistance, or special requests
                      </span>
                    </div>
                  </div>
                  <div className="p-1 text-gray-400">
                    {showOptionalFields ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {showOptionalFields && (
                  <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl mt-3 space-y-4 animate-fadeIn text-xs">
                    
                    {/* Dietary Requirements */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="dietary"
                        className="block font-mono font-bold text-gray-700 uppercase flex items-center space-x-1.5"
                      >
                        <Utensils className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>Dietary Requirements (Optional)</span>
                      </label>
                      <input
                        id="dietary"
                        type="text"
                        placeholder="e.g. Halal, Vegetarian, Vegan, Nut Allergy, Gluten-Free"
                        value={dietaryRequirements}
                        onChange={(e) => setDietaryRequirements(e.target.value)}
                        className="w-full text-xs p-3 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] text-gray-800 min-h-[44px]"
                      />
                    </div>

                    {/* Accessibility Requirements */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="accessibility"
                        className="block font-mono font-bold text-gray-700 uppercase flex items-center space-x-1.5"
                      >
                        <Accessibility className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>Accessibility Requirements (Optional)</span>
                      </label>
                      <input
                        id="accessibility"
                        type="text"
                        placeholder="e.g. Wheelchair access, hearing assistance"
                        value={accessibilityRequirements}
                        onChange={(e) => setAccessibilityRequirements(e.target.value)}
                        className="w-full text-xs p-3 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] text-gray-800 min-h-[44px]"
                      />
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="specialRequests"
                        className="block font-mono font-bold text-gray-700 uppercase flex items-center space-x-1.5"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>Special Requests (Optional)</span>
                      </label>
                      <textarea
                        id="specialRequests"
                        rows={2}
                        placeholder="e.g. Group seating, media interview request"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full text-xs p-3 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] text-gray-800 leading-relaxed"
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* SECTION 5: PRIVACY & DATA CONSENT (NDPA 2023 / NIGERIA) */}
              {/* --------------------------------------------------------------------- */}
              <div className="p-4 sm:p-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3.5 text-xs text-amber-950">
                <div className="flex items-center space-x-2 text-amber-900 font-mono font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                  <span>Privacy Notice & Consent (NDPA 2023)</span>
                </div>

                <p className="text-[11px] leading-relaxed text-gray-700 font-light">
                  This event is hosted in Nigeria by <strong>Domislink International Services Ltd</strong>. Your information is protected under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>.
                </p>

                {/* Mandatory Consent Checkbox (Touch target >= 44px) */}
                <label className="flex items-start space-x-3 cursor-pointer pt-2 group">
                  <input
                    type="checkbox"
                    required
                    checked={consentNDPA}
                    onChange={(e) => setConsentNDPA(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-400 text-[#0A192F] focus:ring-[#D4AF37] shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-900 leading-snug">
                    <strong className="text-[#0A192F]">I agree</strong> to share my registration details for check-in, venue entry at Marriott Hotel Ikeja, and event updates under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>. I know my personal contact details will not be shared publicly. <span className="text-red-600">*</span>
                  </span>
                </label>

                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-amber-200/60 font-mono">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyPolicyModal(true)}
                    className="text-[#0A192F] hover:text-[#D4AF37] underline font-bold flex items-center space-x-1"
                  >
                    <span>Read Privacy Policy</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  <span className="text-gray-400 hidden sm:inline-block">Location: Nigeria</span>
                </div>
              </div>

              {/* Submit Button (Mobile-first large touch target) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 bg-[#0A192F] hover:bg-[#1E293B] disabled:bg-gray-400 text-white font-mono text-sm uppercase font-black tracking-widest rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-3 min-h-[54px] active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin text-[#D4AF37]" />
                      <span>SUBMITTING REGISTRATION...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT REGISTRATION</span>
                      <Send className="h-4 w-4 text-[#D4AF37]" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-gray-400 font-mono uppercase tracking-wider pt-2">
                  Free Registration • Instant Pass
                </p>
              </div>

            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: NDPA 2023 PRIVACY & DATA PROTECTION JURISDICTION POLICY */}
        {/* ========================================================================= */}
        {showPrivacyPolicyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
              
              <div className="bg-[#0A192F] text-white p-5 border-b border-[#D4AF37]/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                      PRIVACY & PROTECTION
                    </span>
                    <h3 className="text-base font-serif font-black uppercase text-white">
                      Privacy Policy Notice
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrivacyPolicyModal(false)}
                  className="p-2 text-gray-300 hover:text-white rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed font-light">
                <div className="p-3 bg-[#FCFBF7] border-l-4 border-[#D4AF37] rounded-r-xl">
                  <span className="font-mono font-bold text-gray-900 block text-[10px] uppercase">
                    Governing Law
                  </span>
                  <p className="text-gray-600 mt-0.5">
                    Nigeria Data Protection Act (NDPA) 2023
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#0A192F] uppercase font-mono text-xs">
                    1. Event Organiser
                  </h4>
                  <p>
                    The event organizer for the Aviation Safety Summit 2026 is <strong>Domislink International Services Ltd</strong> in Nigeria.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#0A192F] uppercase font-mono text-xs">
                    2. How We Use Your Information
                  </h4>
                  <p>
                    Your information (Full Name, Email, Phone, Organisation, Position, Industry, Country, Attendance Category, and optional needs) is only used for:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Creating your entry pass and name badge;</li>
                    <li>Managing venue check-in at Marriott Hotel, Ikeja, Lagos;</li>
                    <li>Sending you event updates and schedule information;</li>
                    <li>Handling your meal or accessibility needs.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#0A192F] uppercase font-mono text-xs">
                    3. No Public Sharing of Personal Info
                  </h4>
                  <p>
                    Your contact information is never made public. Phone numbers and emails are kept safe and will not be sold or shared with outside advertisers.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#0A192F] uppercase font-mono text-xs">
                    4. Your Rights
                  </h4>
                  <p>
                    Under Nigerian law, you can ask to see, update, or remove your registration details at any time. For questions, email: <strong>domislinkint@gmail.com</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPrivacyPolicyModal(false)}
                  className="px-5 py-2.5 bg-[#0A192F] text-white font-mono text-xs uppercase font-bold rounded-xl hover:bg-[#1E293B]"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
