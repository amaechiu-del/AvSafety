/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, Calendar, Clock, MapPin, CheckCircle2, XCircle, 
  UserCheck, HelpCircle, Shield, AlertCircle, Sparkles, 
  ArrowRight, Download, Mail, Phone, Building2, User, 
  FileText, Share2, Check, ArrowLeft, Printer, ExternalLink,
  ShieldCheck, RefreshCw, ChevronRight, Bookmark, Search,
  Compass, Award, Info, Lock
} from 'lucide-react';
import { RSVPRecord, AttendanceOption, RSVPStatus } from '../../types';
import RSVPQRCode from './RSVPQRCode';

interface RSVPPageProps {
  onBackToSummit?: () => void;
  onNavigateToRegister?: () => void;
  initialReference?: string;
}

export default function RSVPPage({ onBackToSummit, onNavigateToRegister, initialReference }: RSVPPageProps) {
  // Extract reference or token from URL path, query parameters, or prop
  const [invitationRef, setInvitationRef] = useState<string>(initialReference || '');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupSuccess, setLookupSuccess] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Form Fields - Primary Invitee
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // 4 Clear RSVP Options
  const [attendanceChoice, setAttendanceChoice] = useState<
    'I WILL ATTEND' | 'I WILL ATTEND WITH REPRESENTATIVE' | 'I AM TENTATIVE' | 'I AM UNABLE TO ATTEND'
  >('I WILL ATTEND');
  
  // Representative fields (conditional for "I WILL ATTEND WITH REPRESENTATIVE")
  const [repFullName, setRepFullName] = useState('');
  const [repDesignation, setRepDesignation] = useState('');
  const [repOrganisation, setRepOrganisation] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repPhone, setRepPhone] = useState('');
  
  // Optional Information
  const [accessibilityRequirement, setAccessibilityRequirement] = useState('');
  const [dietary, setDietary] = useState('');
  
  // Consent
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  // Submission States
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedRSVP, setSubmittedRSVP] = useState<RSVPRecord | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    id: number;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
  } | null>(null);

  const showToast = (title: string, message: string, type: 'error' | 'success' | 'info' | 'warning' = 'error') => {
    const id = Date.now();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current);
    }, 6000);
  };

  // Parse reference / token from path e.g. /rsvp/{token} or query e.g. ?ref=... or ?token=...
  useEffect(() => {
    try {
      const pathParts = window.location.pathname.split('/rsvp/');
      let urlToken = '';
      if (pathParts.length > 1 && pathParts[1].trim()) {
        urlToken = decodeURIComponent(pathParts[1].split('/')[0].split('?')[0].trim());
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('ref') || urlParams.get('token') || urlParams.get('invitation') || urlToken || initialReference;
      
      if (queryParam) {
        setInvitationRef(queryParam);
        handleLookupReference(queryParam);
      }
    } catch (e) {
      console.warn('URL parsing notice:', e);
    }
  }, []);

  // Lookup invitation reference/token from server database (Safe public endpoint)
  const handleLookupReference = async (refToSearch: string) => {
    const cleanRef = refToSearch.trim();
    if (!cleanRef) return;
    setLookupLoading(true);
    setLookupError(null);
    setLookupSuccess(null);

    try {
      const res = await fetch(`/api/rsvp/lookup?ref=${encodeURIComponent(cleanRef)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.invitee) {
          const inv = data.invitee;
          if (inv.title) setTitle(inv.title);
          if (inv.name) {
            const parts = inv.name.split(' ');
            if (parts.length === 1) {
              setFirstName(parts[0]);
            } else if (parts.length === 2) {
              setFirstName(parts[0]);
              setLastName(parts[1]);
            } else if (parts.length >= 3) {
              setFirstName(parts[0]);
              setMiddleName(parts[1]);
              setLastName(parts.slice(2).join(' '));
            }
          }
          if (inv.organisation) {
            setOrganisation(inv.organisation);
            if (!repOrganisation) setRepOrganisation(inv.organisation);
          }
          if (inv.position) setDesignation(inv.position);
          setLookupSuccess(`Verified Invitation for: ${inv.name} (${inv.organisation})`);
        } else {
          setLookupError('Invitation reference not found in registry. You may continue to confirm details manually.');
        }
      } else {
        setLookupError('Unable to verify reference. You can continue and fill your attendance information.');
      }
    } catch (err) {
      setLookupError('Network service reachable. Please proceed with manual confirmation.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Form Validation with complete format checking
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Invitation Number validation
    if (!invitationRef.trim()) {
      errors.invitationRef = 'Official Invitation Number or Reference is required (e.g., ASS/INV/2026/0001).';
    } else if (invitationRef.trim().length < 3) {
      errors.invitationRef = 'Invitation Number must be at least 3 characters.';
    }

    // Name validations
    if (!firstName.trim()) {
      errors.firstName = 'First Name is required.';
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'First Name must be at least 2 characters.';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last Name / Surname is required.';
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'Last Name must be at least 2 characters.';
    }

    if (!designation.trim()) {
      errors.designation = 'Designation / Official Title is required.';
    } else if (designation.trim().length < 2) {
      errors.designation = 'Designation must be at least 2 characters.';
    }

    if (!organisation.trim()) {
      errors.organisation = 'Organisation / Agency / Airline is required.';
    } else if (organisation.trim().length < 2) {
      errors.organisation = 'Organisation name must be at least 2 characters.';
    }

    // Strict Email validation (RFC standard)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email.trim()) {
      errors.email = 'Official Email address is required.';
    } else if (!emailRegex.test(email.trim()) || !email.includes('.') || email.trim().endsWith('.')) {
      errors.email = 'Please provide a valid official email address (e.g. name@organisation.gov.ng).';
    }

    // Phone validation with digit length checking
    const phonePattern = /^\+?[0-9\s\-\(\)\.]{7,25}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      errors.phone = 'Official Contact Telephone number is required.';
    } else if (!phonePattern.test(phone.trim()) || digitsOnly.length < 7 || digitsOnly.length > 16) {
      errors.phone = 'Please provide a valid phone number with 7 to 16 digits (e.g. +234 803 123 4567 or 08031234567).';
    }

    // Conditional validation for representative
    if (attendanceChoice === 'I WILL ATTEND WITH REPRESENTATIVE') {
      if (!repFullName.trim()) {
        errors.repFullName = 'Representative Full Name is required.';
      } else if (repFullName.trim().length < 2) {
        errors.repFullName = 'Representative name must be at least 2 characters.';
      }

      if (!repDesignation.trim()) {
        errors.repDesignation = 'Representative Designation is required.';
      }

      if (!repOrganisation.trim()) {
        errors.repOrganisation = 'Representative Organisation is required.';
      }

      const repDigitsOnly = repPhone.replace(/\D/g, '');
      if (!repEmail.trim()) {
        errors.repEmail = 'Representative Email is required.';
      } else if (!emailRegex.test(repEmail.trim()) || !repEmail.includes('.') || repEmail.trim().endsWith('.')) {
        errors.repEmail = 'Please provide a valid official email address for your representative.';
      }

      if (!repPhone.trim()) {
        errors.repPhone = 'Representative Contact Phone is required.';
      } else if (!phonePattern.test(repPhone.trim()) || repDigitsOnly.length < 7 || repDigitsOnly.length > 16) {
        errors.repPhone = 'Please provide a valid phone number for your representative (e.g. +234 802 987 6543).';
      }
    }

    // Consent validation
    if (!consentConfirmed) {
      errors.consentConfirmed = 'You must confirm and accept the official attendance agreement before submitting.';
    }

    setFormErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  // Handle Form Submission
  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Trigger validation service
    const validation = validateForm();
    if (!validation.isValid) {
      const errorCount = Object.keys(validation.errors).length;
      const firstErrKey = Object.keys(validation.errors)[0];
      const firstErrorMessage = validation.errors[firstErrKey];
      
      const el = document.getElementById(firstErrKey === 'invitationNumber' ? 'invitationRef' : firstErrKey);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }

      setSubmissionError('Please review and correct the highlighted required fields below.');
      showToast(
        'Required Information Missing',
        firstErrorMessage || `Please complete ${errorCount} required field(s) marked in red before confirming attendance.`,
        'warning'
      );
      return;
    }

    setSubmitting(true);

    const fullInviteeName = [title, firstName.trim(), middleName.trim(), lastName.trim()]
      .filter(Boolean)
      .join(' ')
      .trim();

    const payload = {
      invitationNumber: invitationRef.trim() || undefined,
      invitationRef: invitationRef.trim() || undefined,
      title,
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim(),
      fullName: fullInviteeName,
      designation: designation.trim(),
      organisation: organisation.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      attendanceOption: attendanceChoice,
      representative: attendanceChoice === 'I WILL ATTEND WITH REPRESENTATIVE' ? {
        fullName: repFullName.trim(),
        designation: repDesignation.trim(),
        organisation: repOrganisation.trim() || organisation.trim(),
        email: repEmail.trim().toLowerCase(),
        phone: repPhone.trim()
      } : undefined,
      accessibilityRequirement: accessibilityRequirement.trim() || undefined,
      dietary: dietary.trim() || undefined,
      consentConfirmed: true
    };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        // If server returned structured field errors, map them onto form fields
        if (data.errors && typeof data.errors === 'object') {
          const mappedErrors: Record<string, string> = { ...data.errors };
          if (mappedErrors.invitationNumber) {
            mappedErrors.invitationRef = mappedErrors.invitationNumber;
          }
          setFormErrors(prev => ({
            ...prev,
            ...mappedErrors
          }));
          
          const firstServerErr = Object.keys(data.errors)[0];
          const el = document.getElementById(firstServerErr === 'invitationNumber' ? 'invitationRef' : firstServerErr);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
          }

          const primaryMsg = data.error || Object.values(data.errors)[0] as string || 'Validation error received from server.';
          showToast('Validation Error', primaryMsg, 'error');
        } else {
          showToast('Submission Notice', data.error || data.message || 'Unable to register attendance confirmation.', 'error');
        }
        
        throw new Error(data.message || data.error || 'Failed to register your attendance confirmation.');
      }

      setSubmittedRSVP(data.rsvp);
      showToast(
        'Attendance Registered',
        data.message || `Official confirmation pass issued for ${data.rsvp.fullName}.`,
        'success'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred while communicating with the Secretariat server. Please try again.';
      setSubmissionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper Calendar links
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent("DOMISLINK Aviation Safety Summit 2026");
    const details = encodeURIComponent(
      "Theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY\n\nOfficial attendance confirmed for DomisLink Aviation Safety Summit 2026.\nVenue: Marriott Hotel, Ikeja, Lagos, Nigeria.\n\nWebsite: https://summit.domislink.com"
    );
    const location = encodeURIComponent("Marriott Hotel, Ikeja, Lagos, Nigeria");
    const start = "20261117T080000Z";
    const end = "20261117T180000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const handleDownloadICS = () => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DomisLink International//Aviation Safety Summit 2026//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "SUMMARY:DOMISLINK Aviation Safety Summit 2026",
      "DESCRIPTION:Theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY\\nOfficial attendance confirmation for DomisLink Aviation Safety Summit 2026.\\nWebsite: https://summit.domislink.com",
      "LOCATION:Marriott Hotel\\, Ikeja\\, Lagos\\, Nigeria",
      "DTSTART:20261117T080000Z",
      "DTEND:20261117T180000Z",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "DomisLink-Aviation-Safety-Summit-2026.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  const handleCopyRSVPLink = () => {
    const link = submittedRSVP?.confirmationRef 
      ? `${window.location.origin}/rsvp?ref=${submittedRSVP.confirmationRef}`
      : `${window.location.origin}/rsvp`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // ============================================================
  // SUCCESS SCREEN
  // ============================================================
  if (submittedRSVP) {
    const isAttending = submittedRSVP.attendanceOption === 'I_WILL_ATTEND' || submittedRSVP.attendanceOption === ('I WILL ATTEND' as any);
    const isAttendingWithRep = submittedRSVP.attendanceOption === 'I_WILL_ATTEND_WITH_REPRESENTATIVE' || submittedRSVP.attendanceOption === ('I WILL ATTEND WITH REPRESENTATIVE' as any);
    const isTentative = submittedRSVP.attendanceOption === 'I_AM_TENTATIVE' || submittedRSVP.attendanceOption === ('I AM TENTATIVE' as any);
    const isDeclined = submittedRSVP.attendanceOption === 'I_AM_UNABLE_TO_ATTEND' || submittedRSVP.attendanceOption === ('I AM UNABLE TO ATTEND' as any);

    return (
      <div className="min-h-screen bg-[#0A192F] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37] selection:text-[#0A192F]">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header Return Banner */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
            <button
              onClick={onBackToSummit || (() => window.location.href = '/')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              RETURN TO SUMMIT WEBSITE
            </button>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-mono tracking-widest uppercase text-slate-300">DOMISLINK SUMMIT 2026</span>
            </div>
          </div>

          {/* Official Printable Pass / Status Card */}
          <div className="bg-[#0D2137] border-2 border-[#D4AF37]/40 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-black">
            
            {/* Watermark & Top Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37]" />

            {/* Status Header */}
            <div className="text-center space-y-3 pb-8 border-b border-slate-700/60 print:border-gray-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-2 print:bg-gray-100">
                {isAttending ? (
                  <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                ) : isAttendingWithRep ? (
                  <UserCheck className="w-8 h-8 text-[#D4AF37]" />
                ) : isTentative ? (
                  <Clock className="w-8 h-8 text-[#D4AF37]" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400" />
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
                {isAttending ? 'ATTENDANCE CONFIRMED' : 'RSVP RECEIVED'}
              </h1>
              
              <p className="text-sm text-slate-300 max-w-lg mx-auto print:text-gray-700">
                {isAttending && "Your attendance confirmation has been successfully logged with the Summit Organising Secretariat. We look forward to welcoming you."}
                {isAttendingWithRep && "Your attendance and nominated representative details have been registered with the Summit Organising Secretariat."}
                {isTentative && "Your provisional attendance notice has been recorded. Our Protocol Secretariat will follow up regarding your schedule."}
                {isDeclined && "Thank you for notifying the Organising Committee. Your response has been recorded with our Protocol Desk."}
              </p>

              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 font-mono text-xs text-[#D4AF37] font-bold tracking-wider uppercase print:border-black print:text-black">
                  REFERENCE: {submittedRSVP.confirmationRef}
                </span>
              </div>
            </div>

            {/* Details Summary Grid */}
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-700/60 print:border-gray-300">
              
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-semibold">GUEST NAME</p>
                <p className="text-base font-bold text-white print:text-black">{submittedRSVP.fullName}</p>
                <p className="text-xs text-slate-400 print:text-gray-600">{submittedRSVP.position}</p>
                <p className="text-xs text-slate-300 font-medium print:text-gray-800">{submittedRSVP.organisation}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-semibold">ATTENDANCE STATUS</p>
                <p className="text-base font-bold text-[#D4AF37] print:text-black">
                  {isAttending && "Confirmed (In-Person Delegate)"}
                  {isAttendingWithRep && "Attending With Representative"}
                  {isTentative && "Tentative / Schedule Review"}
                  {isDeclined && "Unable to Attend (Declined)"}
                </p>
                <p className="text-xs text-slate-400 print:text-gray-600">Recorded: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              {submittedRSVP.representative && (
                <div className="sm:col-span-2 p-4 rounded-xl bg-[#081528] border border-[#D4AF37]/30 space-y-1.5 print:bg-gray-50 print:border-gray-300">
                  <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">NOMINATED REPRESENTATIVE</p>
                  <p className="text-sm font-bold text-white print:text-black">{submittedRSVP.representative.fullName}</p>
                  <p className="text-xs text-slate-300 print:text-gray-700">
                    {submittedRSVP.representative.designation || submittedRSVP.representative.position} • {submittedRSVP.representative.organisation}
                  </p>
                  <p className="text-xs text-slate-400 font-mono print:text-gray-600">
                    {submittedRSVP.representative.email} | {submittedRSVP.representative.phone}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-semibold">EVENT DATE</p>
                <p className="text-sm font-semibold text-white print:text-black">17 November 2026</p>
                <p className="text-xs text-slate-400 print:text-gray-600">08:00 AM – 18:00 PM (WAT)</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-semibold">VENUE</p>
                <p className="text-sm font-semibold text-white print:text-black">Marriott Hotel, Ikeja</p>
                <p className="text-xs text-slate-400 print:text-gray-600">Lagos, Nigeria</p>
              </div>

              <div className="sm:col-span-2 space-y-1 pt-2">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-semibold">SUMMIT THEME</p>
                <p className="text-xs font-mono text-slate-200 uppercase tracking-wide print:text-black font-semibold">
                  EVERYBODY IS INVOLVED IN AVIATION SAFETY
                </p>
              </div>

            </div>

            {/* Verification QR & Actions */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl border border-[#D4AF37]/40 shadow-inner">
                  <RSVPQRCode 
                    reference={submittedRSVP.confirmationRef} 
                    invitationRef={submittedRSVP.invitationNumber || submittedRSVP.invitationRef}
                    size={90} 
                  />
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-xs font-mono font-bold text-[#D4AF37] uppercase">OFFICIAL QR PASS</p>
                  <p className="text-[11px] text-slate-400 max-w-[200px]">
                    Present this verification reference at the Summit Protocol Desk for swift accreditation.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrintConfirmation}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-600 transition-colors"
                >
                  <Printer className="w-4 h-4 text-[#D4AF37]" />
                  PRINT CONFIRMATION
                </button>
                <button
                  onClick={handleCopyRSVPLink}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  {copiedLink ? 'LINK COPIED' : 'SHARE PASS'}
                </button>
              </div>
            </div>

          </div>

          {/* Calendar & Next Steps Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#0D2137] hover:bg-[#122b47] border border-[#D4AF37]/30 text-xs font-bold text-white transition-all shadow-md group"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              ADD TO GOOGLE CALENDAR
            </a>

            <button
              onClick={handleDownloadICS}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#0D2137] hover:bg-[#122b47] border border-[#D4AF37]/30 text-xs font-bold text-white transition-all shadow-md group"
            >
              <Download className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              ADD TO OUTLOOK / APPLE CALENDAR (.ICS)
            </button>
          </div>

          {/* Future Architecture Cards */}
          <div className="bg-[#0D2137]/60 border border-slate-700/60 rounded-xl p-5 space-y-4 print:hidden">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
              SUMMIT LOGISTICS & CONCIERGE INFORMATION
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="p-3 rounded-lg bg-[#081528] border border-slate-700/60 space-y-1 text-center">
                <FileText className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <p className="text-[11px] font-bold text-white">VIEW INVITATION</p>
                <p className="text-[9px] text-slate-400">Digital Copy on File</p>
              </div>

              <div className="p-3 rounded-lg bg-[#081528] border border-slate-700/60 space-y-1 text-center">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <p className="text-[11px] font-bold text-white">QR EVENT BADGE</p>
                <p className="text-[9px] text-slate-400">Ready at Accreditation</p>
              </div>

              <div className="p-3 rounded-lg bg-[#081528] border border-slate-700/60 space-y-1 text-center">
                <Award className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <p className="text-[11px] font-bold text-white">ACCREDITATION</p>
                <p className="text-[9px] text-slate-400">Opens 07:30 AM</p>
              </div>

              <a
                href="https://maps.google.com/?q=Lagos+Marriott+Hotel+Ikeja"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-[#081528] hover:bg-[#0c1f38] border border-slate-700/60 space-y-1 text-center transition-colors block"
              >
                <Compass className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <p className="text-[11px] font-bold text-white flex items-center justify-center gap-1">
                  VENUE DIRECTIONS <ExternalLink className="w-2.5 h-2.5 text-[#D4AF37]" />
                </p>
                <p className="text-[9px] text-slate-400">Marriott Hotel Ikeja</p>
              </a>

            </div>
          </div>

          {/* Official Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <p className="font-semibold text-slate-300 mb-1">OFFICIAL NOTICE & PROTOCOL DISCLAIMER</p>
            Confirmation of attendance is requested for planning and protocol purposes. Attendance confirmation does not constitute a public announcement of participation, speaking status, sponsorship or endorsement. Such designations will be communicated separately by the Organising Committee where applicable.
          </div>

          {/* Bottom Navigation */}
          <div className="text-center pt-4 print:hidden">
            <button
              onClick={onBackToSummit || (() => window.location.href = '/')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              RETURN TO SUMMIT PORTAL
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // PUBLIC RSVP FORM
  // ============================================================
  return (
    <div className="min-h-screen bg-[#0A192F] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37] selection:text-[#0A192F] relative">
      
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-4 sm:right-8 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-500/80 text-rose-100 shadow-rose-950/50'
              : toast.type === 'warning'
              ? 'bg-[#1a1405]/95 border-[#D4AF37] text-amber-100 shadow-[#D4AF37]/20'
              : toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100 shadow-emerald-950/50'
              : 'bg-[#08182D]/95 border-slate-600 text-slate-100'
          }`}>
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" />}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />}
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                {toast.title}
              </p>
              <p className="text-xs mt-0.5 leading-relaxed opacity-90">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white transition-colors p-1 -mr-1"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
            <button
              onClick={onBackToSummit || (() => window.location.href = '/')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Summit Portal
            </button>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-mono tracking-widest uppercase text-slate-300">DOMISLINK 2026</span>
            </div>
          </div>

          {/* Summit Hero Identity */}
          <div className="text-center space-y-4 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
              <Crown className="w-3.5 h-3.5" />
              DOMISLINK AVIATION SAFETY SUMMIT 2026
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              CONFIRM YOUR ATTENDANCE
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              To assist the Organising Committee with protocol, seating, security, hospitality and other arrangements, kindly confirm your attendance at the DomisLink Aviation Safety Summit 2026.
            </p>

            {/* Event Key Facts Bar */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D2137] border border-[#D4AF37]/25">
                <Calendar className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase text-[#D4AF37]">DATE</p>
                  <p className="text-xs font-bold text-white">17 November 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D2137] border border-[#D4AF37]/25">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase text-[#D4AF37]">VENUE</p>
                  <p className="text-xs font-bold text-white">Marriott Hotel, Ikeja</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D2137] border border-[#D4AF37]/25">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase text-[#D4AF37]">THEME</p>
                  <p className="text-[11px] font-bold text-white line-clamp-1">EVERYBODY IS INVOLVED</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Invitation Identification */}
        <div className="bg-[#0D2137] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
                STEP 1 OF 4 • INVITATION IDENTIFICATION
              </p>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Invitation Number or Reference</span>
                <span className="text-[#D4AF37] text-sm">*</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Enter your official invitation reference (e.g., <code className="text-[#D4AF37] font-mono">ASS/INV/2026/0001</code> or reference from your invitation letter/card).
              </p>
            </div>
            <Bookmark className="w-5 h-5 text-[#D4AF37] shrink-0 mt-1" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <div className="relative flex-1">
              <input
                id="invitationRef"
                type="text"
                value={invitationRef}
                onChange={(e) => {
                  setInvitationRef(e.target.value);
                  if (formErrors.invitationRef) setFormErrors(prev => ({ ...prev, invitationRef: '' }));
                }}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleLookupReference(invitationRef))}
                placeholder="e.g. ASS/INV/2026/0001"
                className={`w-full px-4 py-3 bg-[#081528] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] font-mono uppercase tracking-wider ${
                  formErrors.invitationRef ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                }`}
              />
              {formErrors.invitationRef && (
                <p className="text-[11px] text-rose-400 font-medium mt-1.5">{formErrors.invitationRef}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleLookupReference(invitationRef)}
              disabled={lookupLoading || !invitationRef.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A192F] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              {lookupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {lookupLoading ? 'VERIFYING...' : 'VERIFY INVITATION'}
            </button>
          </div>

          {lookupSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lookupSuccess}</span>
            </div>
          )}

          {lookupError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmitRSVP} className="space-y-8" noValidate>
          
          {/* Section 2: Attendance Choice */}
          <div className="bg-[#0D2137] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
                STEP 2 OF 4 • ATTENDANCE SELECTION
              </p>
              <h2 className="text-lg font-bold text-white">Your Attendance Decision</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Please indicate your attendance plan for the Summit on 17 November 2026.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Option 1 */}
              <label 
                className={`relative flex items-start p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  attendanceChoice === 'I WILL ATTEND' 
                    ? 'bg-[#081528] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' 
                    : 'bg-[#081528]/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="attendanceChoice"
                  value="I WILL ATTEND"
                  checked={attendanceChoice === 'I WILL ATTEND'}
                  onChange={() => setAttendanceChoice('I WILL ATTEND')}
                  className="sr-only"
                />
                <div className="flex items-start gap-3 w-full">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    attendanceChoice === 'I WILL ATTEND' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-slate-500'
                  }`}>
                    {attendanceChoice === 'I WILL ATTEND' && <Check className="w-3 h-3 text-[#0A192F]" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">I WILL ATTEND</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      I will be attending the Summit in person at the Marriott Hotel, Ikeja.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 2 */}
              <label 
                className={`relative flex items-start p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  attendanceChoice === 'I WILL ATTEND WITH REPRESENTATIVE' 
                    ? 'bg-[#081528] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' 
                    : 'bg-[#081528]/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="attendanceChoice"
                  value="I WILL ATTEND WITH REPRESENTATIVE"
                  checked={attendanceChoice === 'I WILL ATTEND WITH REPRESENTATIVE'}
                  onChange={() => setAttendanceChoice('I WILL ATTEND WITH REPRESENTATIVE')}
                  className="sr-only"
                />
                <div className="flex items-start gap-3 w-full">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    attendanceChoice === 'I WILL ATTEND WITH REPRESENTATIVE' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-slate-500'
                  }`}>
                    {attendanceChoice === 'I WILL ATTEND WITH REPRESENTATIVE' && <Check className="w-3 h-3 text-[#0A192F]" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">I WILL ATTEND WITH REPRESENTATIVE</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      I am nominating an official representative or accompanying executive to attend.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 3 */}
              <label 
                className={`relative flex items-start p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  attendanceChoice === 'I AM TENTATIVE' 
                    ? 'bg-[#081528] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' 
                    : 'bg-[#081528]/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="attendanceChoice"
                  value="I AM TENTATIVE"
                  checked={attendanceChoice === 'I AM TENTATIVE'}
                  onChange={() => setAttendanceChoice('I AM TENTATIVE')}
                  className="sr-only"
                />
                <div className="flex items-start gap-3 w-full">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    attendanceChoice === 'I AM TENTATIVE' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-slate-500'
                  }`}>
                    {attendanceChoice === 'I AM TENTATIVE' && <Check className="w-3 h-3 text-[#0A192F]" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">I AM TENTATIVE</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      My attendance is subject to final schedule/travel confirmation; please hold provisional protocol space.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 4 */}
              <label 
                className={`relative flex items-start p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  attendanceChoice === 'I AM UNABLE TO ATTEND' 
                    ? 'bg-[#081528] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' 
                    : 'bg-[#081528]/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="attendanceChoice"
                  value="I AM UNABLE TO ATTEND"
                  checked={attendanceChoice === 'I AM UNABLE TO ATTEND'}
                  onChange={() => setAttendanceChoice('I AM UNABLE TO ATTEND')}
                  className="sr-only"
                />
                <div className="flex items-start gap-3 w-full">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    attendanceChoice === 'I AM UNABLE TO ATTEND' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-slate-500'
                  }`}>
                    {attendanceChoice === 'I AM UNABLE TO ATTEND' && <Check className="w-3 h-3 text-[#0A192F]" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">I AM UNABLE TO ATTEND</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      I regret that I am unable to attend the Summit on this occasion.
                    </p>
                  </div>
                </div>
              </label>

            </div>
          </div>

          {/* Section 3: Invitee Details */}
          <div className="bg-[#0D2137] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
                STEP 3 OF 4 • INVITEE CREDENTIALS
              </p>
              <h2 className="text-lg font-bold text-white">Official Guest Information</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Please supply your official details for security clearance, delegate badges, and protocol records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              
              {/* Title */}
              <div className="sm:col-span-3 space-y-1.5">
                <label htmlFor="title" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Title <span className="text-[#D4AF37]">*</span>
                </label>
                <select
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#081528] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Capt.">Capt.</option>
                  <option value="Engr.">Engr.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Barr.">Barr.</option>
                  <option value="Chief">Chief</option>
                  <option value="Alhaji">Alhaji</option>
                  <option value="H.E.">H.E.</option>
                  <option value="Sen.">Sen.</option>
                  <option value="Hon.">Hon.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* First Name */}
              <div className="sm:col-span-5 space-y-1.5">
                <label htmlFor="firstName" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  First Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  placeholder="e.g. Ibrahim"
                  className={`w-full px-3.5 py-3 bg-[#081528] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                    formErrors.firstName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.firstName && <p className="text-[11px] text-rose-400 font-medium">{formErrors.firstName}</p>}
              </div>

              {/* Middle Name */}
              <div className="sm:col-span-4 space-y-1.5">
                <label htmlFor="middleName" className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Middle Name <span className="text-[10px] text-slate-500">(Optional)</span>
                </label>
                <input
                  id="middleName"
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="e.g. Chukwu"
                  className="w-full px-3.5 py-3 bg-[#081528] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Last Name */}
              <div className="sm:col-span-12 space-y-1.5">
                <label htmlFor="lastName" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Last Name / Surname <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  placeholder="e.g. Adeleke"
                  className={`w-full px-3.5 py-3 bg-[#081528] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                    formErrors.lastName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.lastName && <p className="text-[11px] text-rose-400 font-medium">{formErrors.lastName}</p>}
              </div>

              {/* Designation */}
              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="designation" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Designation / Official Title <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="designation"
                  type="text"
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                    if (formErrors.designation) setFormErrors(prev => ({ ...prev, designation: '' }));
                  }}
                  placeholder="e.g. Managing Director / Director of Flight Operations"
                  className={`w-full px-3.5 py-3 bg-[#081528] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                    formErrors.designation ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.designation && <p className="text-[11px] text-rose-400 font-medium">{formErrors.designation}</p>}
              </div>

              {/* Organisation */}
              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="organisation" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Organisation / Agency / Airline <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="organisation"
                  type="text"
                  value={organisation}
                  onChange={(e) => {
                    setOrganisation(e.target.value);
                    if (formErrors.organisation) setFormErrors(prev => ({ ...prev, organisation: '' }));
                    if (!repOrganisation) setRepOrganisation(e.target.value);
                  }}
                  placeholder="e.g. Federal Airports Authority of Nigeria (FAAN)"
                  className={`w-full px-3.5 py-3 bg-[#081528] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                    formErrors.organisation ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.organisation && <p className="text-[11px] text-rose-400 font-medium">{formErrors.organisation}</p>}
              </div>

              {/* Official Email */}
              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Official Email Address <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="e.g. executive@agency.gov.ng"
                  className={`w-full px-3.5 py-3 bg-[#081528] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                    formErrors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.email && <p className="text-[11px] text-rose-400 font-medium">{formErrors.email}</p>}
              </div>

              {/* Phone */}
              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Official Phone / Mobile <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  placeholder="e.g. +234 803 123 4567"
                  className={`w-full px-3.5 py-3 bg-[#081528] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                    formErrors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.phone && <p className="text-[11px] text-rose-400 font-medium">{formErrors.phone}</p>}
              </div>

            </div>
          </div>

          {/* Conditional Section: Representative Details */}
          {attendanceChoice === 'I WILL ATTEND WITH REPRESENTATIVE' && (
            <div className="bg-[#08182D] border-2 border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <UserCheck className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
                    REPRESENTATIVE NOMINATION DETAILS
                  </p>
                  <h3 className="text-base font-bold text-white">Nominated Representative Credentials</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Please provide the details of the official representative who will be accredited in your place or company.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Rep Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="repFullName" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Representative Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="repFullName"
                    type="text"
                    value={repFullName}
                    onChange={(e) => {
                      setRepFullName(e.target.value);
                      if (formErrors.repFullName) setFormErrors(prev => ({ ...prev, repFullName: '' }));
                    }}
                    placeholder="e.g. Engr. Samuel Oladipo"
                    className={`w-full px-3.5 py-3 bg-[#050E1C] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                      formErrors.repFullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {formErrors.repFullName && <p className="text-[11px] text-rose-400 font-medium">{formErrors.repFullName}</p>}
                </div>

                {/* Rep Designation */}
                <div className="space-y-1.5">
                  <label htmlFor="repDesignation" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Representative Designation <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="repDesignation"
                    type="text"
                    value={repDesignation}
                    onChange={(e) => {
                      setRepDesignation(e.target.value);
                      if (formErrors.repDesignation) setFormErrors(prev => ({ ...prev, repDesignation: '' }));
                    }}
                    placeholder="e.g. Head of Safety Management Systems"
                    className={`w-full px-3.5 py-3 bg-[#050E1C] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                      formErrors.repDesignation ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {formErrors.repDesignation && <p className="text-[11px] text-rose-400 font-medium">{formErrors.repDesignation}</p>}
                </div>

                {/* Rep Organisation */}
                <div className="space-y-1.5">
                  <label htmlFor="repOrganisation" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Representative Organisation <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="repOrganisation"
                    type="text"
                    value={repOrganisation}
                    onChange={(e) => {
                      setRepOrganisation(e.target.value);
                      if (formErrors.repOrganisation) setFormErrors(prev => ({ ...prev, repOrganisation: '' }));
                    }}
                    placeholder={organisation || "e.g. Same as Principal"}
                    className={`w-full px-3.5 py-3 bg-[#050E1C] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                      formErrors.repOrganisation ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {formErrors.repOrganisation && <p className="text-[11px] text-rose-400 font-medium">{formErrors.repOrganisation}</p>}
                </div>

                {/* Rep Email */}
                <div className="space-y-1.5">
                  <label htmlFor="repEmail" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Representative Email <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="repEmail"
                    type="email"
                    value={repEmail}
                    onChange={(e) => {
                      setRepEmail(e.target.value);
                      if (formErrors.repEmail) setFormErrors(prev => ({ ...prev, repEmail: '' }));
                    }}
                    placeholder="e.g. rep.safety@agency.gov.ng"
                    className={`w-full px-3.5 py-3 bg-[#050E1C] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                      formErrors.repEmail ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {formErrors.repEmail && <p className="text-[11px] text-rose-400 font-medium">{formErrors.repEmail}</p>}
                </div>

                {/* Rep Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="repPhone" className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Representative Phone <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="repPhone"
                    type="tel"
                    value={repPhone}
                    onChange={(e) => {
                      setRepPhone(e.target.value);
                      if (formErrors.repPhone) setFormErrors(prev => ({ ...prev, repPhone: '' }));
                    }}
                    placeholder="e.g. +234 802 987 6543"
                    className={`w-full px-3.5 py-3 bg-[#050E1C] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                      formErrors.repPhone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {formErrors.repPhone && <p className="text-[11px] text-rose-400 font-medium">{formErrors.repPhone}</p>}
                </div>

              </div>
            </div>
          )}

          {/* Section 4: Optional Protocol & Logistics Information */}
          <div className="bg-[#0D2137] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
                STEP 4 OF 4 • PROTOCOL & LOGISTICS (OPTIONAL)
              </p>
              <h2 className="text-lg font-bold text-white">Special Arrangements & Requirements</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                The information below is optional and strictly used by the Secretariat for hospitality and seating arrangements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Accessibility */}
              <div className="space-y-1.5">
                <label htmlFor="accessibilityRequirement" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                  Special Accessibility Requirement <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="accessibilityRequirement"
                  type="text"
                  value={accessibilityRequirement}
                  onChange={(e) => setAccessibilityRequirement(e.target.value)}
                  placeholder="e.g. Wheelchair access, step-free seating"
                  className="w-full px-3.5 py-3 bg-[#081528] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Dietary */}
              <div className="space-y-1.5">
                <label htmlFor="dietary" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                  Dietary Requirement <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="dietary"
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="e.g. Halal, Vegetarian, Nut Allergy"
                  className="w-full px-3.5 py-3 bg-[#081528] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

            </div>
          </div>

          {/* Section 5: Consent Agreement */}
          <div className="bg-[#0D2137] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <label className="flex items-start gap-3.5 cursor-pointer">
              <input
                id="consentConfirmed"
                type="checkbox"
                checked={consentConfirmed}
                onChange={(e) => {
                  setConsentConfirmed(e.target.checked);
                  if (formErrors.consentConfirmed) setFormErrors(prev => ({ ...prev, consentConfirmed: '' }));
                }}
                className="mt-1 w-5 h-5 rounded border-slate-600 bg-[#081528] text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-[#0A192F]"
              />
              <span className="text-xs text-slate-200 leading-relaxed">
                I confirm that the information supplied is accurate and may be used by the DomisLink Aviation Safety Summit Organising Committee for event planning, attendance confirmation, protocol and related administrative purposes. <span className="text-[#D4AF37] font-bold">*</span>
              </span>
            </label>
            {formErrors.consentConfirmed && (
              <p className="text-[11px] text-rose-400 font-medium pl-8">{formErrors.consentConfirmed}</p>
            )}
          </div>

          {/* Submission Error Banner & Itemized Field Guidance */}
          {submissionError && (
            <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-500/60 text-xs text-rose-200 space-y-2 shadow-lg">
              <div className="flex items-center gap-2.5 font-bold text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{submissionError}</span>
              </div>
              {Object.keys(formErrors).filter(k => formErrors[k]).length > 0 && (
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-rose-300/90">
                  {Object.entries(formErrors)
                    .filter(([_, msg]) => Boolean(msg))
                    .map(([key, msg]) => (
                      <li key={key}>{msg}</li>
                    ))}
                </ul>
              )}
            </div>
          )}

          {/* Submit Action Button */}
          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-[#0A192F] font-extrabold text-sm sm:text-base uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>PROCESSING CONFIRMATION...</span>
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 text-[#0A192F]" />
                  <span>CONFIRM MY ATTENDANCE</span>
                  <ArrowRight className="w-5 h-5 text-[#0A192F]" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Secured SSL Public Protocol Portal • DomisLink International Master Summit Engine
            </p>
          </div>

        </form>

        {/* Official Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center">
          <p className="font-semibold text-slate-300 mb-0.5">OFFICIAL DISCLAIMER</p>
          Confirmation of attendance is requested for planning and protocol purposes. Attendance confirmation does not constitute a public announcement of participation, speaking status, sponsorship or endorsement. Such designations will be communicated separately by the Organising Committee where applicable.
        </div>

      </div>
    </div>
  );
}
