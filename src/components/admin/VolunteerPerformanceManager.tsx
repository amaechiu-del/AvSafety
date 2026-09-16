/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  Edit3,
  ShieldCheck,
  ShieldAlert,
  Users,
  Building2,
  FileText,
  UserCheck,
  X,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Crown,
  FileCheck,
  CheckSquare,
  HelpCircle,
  Eye,
  RefreshCw,
  Sliders,
  Send,
  Lock,
  Compass,
  MessageSquare
} from 'lucide-react';
import {
  VolunteerPerformanceRecord,
  VolunteerCommendation,
  VolunteerCorrectiveReport,
  VolunteerCertificate,
  VolunteerApplicantType,
  VolunteerWorkMode,
  PerformanceEvaluationStatus,
  PerformanceGrade,
  PerformanceFinalOutcome,
  FutureEventConsideration,
  CommendationType,
  CorrectiveIssueCategory,
  CertificateType,
  CertificateStatus
} from '../../types';

export default function VolunteerPerformanceManager() {
  // Navigation Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<
    'OVERVIEW' | 'EVALUATIONS' | 'COMMENDATIONS' | 'CORRECTIVE' | 'CERTIFICATES' | 'ORGANISATIONS' | 'FUTURE_CONSIDERATION' | 'REPORTS'
  >('OVERVIEW');

  // Core Data States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [performances, setPerformances] = useState<VolunteerPerformanceRecord[]>([]);
  const [commendations, setCommendations] = useState<VolunteerCommendation[]>([]);
  const [correctiveReports, setCorrectiveReports] = useState<VolunteerCorrectiveReport[]>([]);
  const [certificates, setCertificates] = useState<VolunteerCertificate[]>([]);
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('2026');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [workModeFilter, setWorkModeFilter] = useState<string>('ALL');

  // Modals & Inspection States
  const [inspectingEvaluation, setInspectingEvaluation] = useState<VolunteerPerformanceRecord | null>(null);
  const [editingEvaluation, setEditingEvaluation] = useState<Partial<VolunteerPerformanceRecord> | null>(null);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);
  
  const [inspectingCommendation, setInspectingCommendation] = useState<VolunteerCommendation | null>(null);
  const [isCreatingCommendation, setIsCreatingCommendation] = useState(false);
  const [newCommendationForm, setNewCommendationForm] = useState<any>({
    volunteerReference: '',
    volunteerName: '',
    organisationName: '',
    department: 'Protocol',
    assignment: '',
    commendationType: 'OUTSTANDING SERVICE',
    title: '',
    reason: '',
    supportingEvidence: ''
  });

  const [inspectingCorrective, setInspectingCorrective] = useState<VolunteerCorrectiveReport | null>(null);
  const [isCreatingCorrective, setIsCreatingCorrective] = useState(false);
  const [newCorrectiveForm, setNewCorrectiveForm] = useState<any>({
    volunteerReference: '',
    volunteerName: '',
    department: 'Operations',
    assignment: '',
    issueCategory: 'PERFORMANCE ADVISORY',
    title: '',
    factualDescription: '',
    relevantEvidence: '',
    operationalImpact: '',
    expectedImprovement: '',
    responseRequired: true,
    supervisorRecommendation: ''
  });
  const [respondingReport, setRespondingReport] = useState<VolunteerCorrectiveReport | null>(null);
  const [responseStatement, setResponseStatement] = useState('');
  const [responseType, setResponseType] = useState<'EXPLANATION' | 'ACKNOWLEDGEMENT' | 'DISAGREEMENT' | 'CLARIFICATION'>('EXPLANATION');

  const [inspectingCertificate, setInspectingCertificate] = useState<VolunteerCertificate | null>(null);
  const [isCreatingCertificate, setIsCreatingCertificate] = useState(false);
  const [newCertForm, setNewCertForm] = useState<any>({
    certificateType: 'Certificate of Volunteer Service',
    isOrganisationCertificate: false,
    recipientName: '',
    volunteerReference: '',
    organisationName: '',
    organisationSector: '',
    verifiedVolunteersCount: 1,
    department: 'Protocol',
    assignment: 'Volunteer Service',
    workMode: 'ON-SITE — LAGOS',
    servicePeriod: '15-18 November 2026',
    signatoryName: 'Dr. Aliyu Mohammed, CON',
    signatoryTitle: 'Secretary-General',
    signatoryOrg: 'Domislink International Services Ltd'
  });

  const [reissuingCert, setReissuingCert] = useState<VolunteerCertificate | null>(null);
  const [reissueReason, setReissueReason] = useState('');
  const [correctedRecipientName, setCorrectedRecipientName] = useState('');

  // Zero Self-Approval Governance Warning
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Controlled Revision Modal
  const [revisingRecord, setRevisingRecord] = useState<VolunteerPerformanceRecord | null>(null);
  const [revisionReasonText, setRevisionReasonText] = useState('');

  // Current Logged-in Secretariat Actor (For Zero Self-Approval simulation & RBAC)
  const [actorEmail, setActorEmail] = useState('secgen@domislink.com');
  const [actorName, setActorName] = useState('Dr. Aliyu Mohammed, CON');

  // Load all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [perfRes, statsRes, commRes, corrRes, certRes, orgRes, volRes] = await Promise.all([
        fetch('/api/secretariat/volunteer-performance', { headers: { 'x-admin-mode': 'true' } }),
        fetch('/api/secretariat/volunteer-performance/stats', { headers: { 'x-admin-mode': 'true' } }),
        fetch('/api/secretariat/volunteer-commendations', { headers: { 'x-admin-mode': 'true' } }),
        fetch('/api/secretariat/volunteer-corrective-reports', { headers: { 'x-admin-mode': 'true' } }),
        fetch('/api/secretariat/volunteer-certificates', { headers: { 'x-admin-mode': 'true' } }),
        fetch('/api/secretariat/volunteer-organisations', { headers: { 'x-admin-mode': 'true' } }),
        fetch('/api/admin/volunteers?admin=true', { headers: { 'x-admin-mode': 'true' } })
      ]);

      if (perfRes.ok) {
        const d = await perfRes.json();
        setPerformances(d.records || []);
      }
      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (commRes.ok) {
        const d = await commRes.json();
        setCommendations(d.commendations || []);
      }
      if (corrRes.ok) {
        const d = await corrRes.json();
        setCorrectiveReports(d.reports || []);
      }
      if (certRes.ok) {
        const d = await certRes.json();
        setCertificates(d.certificates || []);
      }
      if (orgRes.ok) {
        const d = await orgRes.json();
        setOrganisations(d.organisations || []);
      }
      if (volRes.ok) {
        const d = await volRes.json();
        setVolunteers(d.volunteers || []);
      }
    } catch (err) {
      console.error('Failed to load Secretariat Volunteer Performance data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Filtered Performance Evaluations
  const filteredPerformances = useMemo(() => {
    return performances.filter((item) => {
      if (yearFilter !== 'ALL' && String(item.summitYear) !== String(yearFilter)) return false;
      if (departmentFilter !== 'ALL' && item.department !== departmentFilter) return false;
      if (statusFilter !== 'ALL' && item.evaluationStatus !== statusFilter) return false;
      if (gradeFilter !== 'ALL' && item.grade !== gradeFilter) return false;
      if (workModeFilter !== 'ALL' && item.workMode !== workModeFilter) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.volunteerName.toLowerCase().includes(q) ||
        item.volunteerReference.toLowerCase().includes(q) ||
        (item.organisationName || '').toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.supervisorName.toLowerCase().includes(q) ||
        item.finalOutcome.toLowerCase().includes(q)
      );
    });
  }, [performances, yearFilter, departmentFilter, statusFilter, gradeFilter, workModeFilter, searchQuery]);

  // Departments List
  const departmentsList = [
    'Protocol',
    'VIP/VVIP Ushering',
    'Registration',
    'Media & Publicity',
    'IT & Digital Support',
    'Emergency & Safety Support',
    'Aviation Technical Support',
    'Documentation & Rapporteur',
    'Guest Services',
    'Transportation & Logistics',
    'Secretariat Support',
    'Event Operations'
  ];

  // Grade color helper
  const getGradeBadge = (grade: PerformanceGrade) => {
    switch (grade) {
      case 'A+':
        return 'bg-amber-100 text-amber-900 border-amber-400 font-black';
      case 'A':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      case 'B':
        return 'bg-blue-100 text-blue-900 border-blue-400 font-bold';
      case 'C':
        return 'bg-purple-100 text-purple-900 border-purple-400 font-medium';
      case 'D':
        return 'bg-orange-100 text-orange-900 border-orange-400 font-medium';
      case 'E':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-400 font-medium';
    }
  };

  // Outcome color helper
  const getOutcomeBadge = (outcome: PerformanceFinalOutcome) => {
    switch (outcome) {
      case 'COMMENDED':
        return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold';
      case 'CERTIFICATE ISSUED':
        return 'bg-emerald-600 text-white font-medium';
      case 'APPRECIATION':
      case 'SATISFACTORY SERVICE':
        return 'bg-blue-600 text-white font-medium';
      case 'IMPROVEMENT REQUIRED':
      case 'CORRECTIVE ACTION':
        return 'bg-orange-600 text-white font-medium';
      case 'UNSATISFACTORY SERVICE':
        return 'bg-rose-600 text-white font-bold';
      default:
        return 'bg-gray-600 text-white font-normal';
    }
  };

  // Live Score Calculator for Creation/Editing Form
  const calculateFormTotalAndGrade = (scores: any) => {
    const keys = [
      'attendanceScore',
      'punctualityScore',
      'reliabilityScore',
      'teamworkScore',
      'communicationScore',
      'professionalismScore',
      'taskCompletionScore',
      'initiativeScore',
      'safetyComplianceScore',
      'adaptabilityScore'
    ];
    let sum = 0;
    keys.forEach((k) => {
      sum += Number(scores[k] || 0);
    });
    const percentage = Math.min(100, Math.max(0, sum));
    let g: PerformanceGrade = 'E';
    if (percentage >= 90) g = 'A+';
    else if (percentage >= 80) g = 'A';
    else if (percentage >= 70) g = 'B';
    else if (percentage >= 60) g = 'C';
    else if (percentage >= 50) g = 'D';

    return { total: sum, percentage, grade: g };
  };

  // Handler: Save / Submit Evaluation
  const handleSaveEvaluation = async (submitForReview: boolean = false) => {
    if (!editingEvaluation?.volunteerReference || !editingEvaluation?.volunteerName || !editingEvaluation?.supervisorName || !editingEvaluation?.supervisorComments) {
      alert('Please fill in all mandatory evaluation fields (Volunteer Reference, Name, Supervisor, Comments).');
      return;
    }

    try {
      const payload = {
        ...editingEvaluation,
        submitForReview,
        actorEmail
      };

      const res = await fetch('/api/secretariat/volunteer-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true', 'x-actor-email': actorEmail },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.duplicate) {
          alert(data.error);
        } else {
          alert(data.error || 'Failed to save evaluation.');
        }
        return;
      }

      showToast(submitForReview ? 'Evaluation officially SUBMITTED for Secretariat Review!' : 'Evaluation saved as DRAFT.');
      setIsCreatingEvaluation(false);
      setEditingEvaluation(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error submitting evaluation.');
    }
  };

  // Handler: Approve Evaluation (With Zero Self-Approval Enforcement)
  const handleApproveEvaluation = async (record: VolunteerPerformanceRecord) => {
    setApprovalError(null);
    try {
      const res = await fetch(`/api/secretariat/volunteer-performance/${record.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true', 'x-actor-email': actorEmail },
        body: JSON.stringify({
          approverEmail: actorEmail,
          approverName: actorName,
          approvalNotes: 'Officially reviewed and ratified by the Secretariat Executive Directorate.'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setApprovalError(data.error || 'Approval failed due to governance policy.');
        return;
      }

      showToast(`Evaluation for ${record.volunteerName} APPROVED successfully!`);
      setInspectingEvaluation(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setApprovalError('Network error executing approval.');
    }
  };

  // Handler: Controlled Revision
  const handleExecuteRevision = async () => {
    if (!revisingRecord || !revisionReasonText.trim()) {
      alert('Please provide a mandatory revision reason.');
      return;
    }

    try {
      const res = await fetch(`/api/secretariat/volunteer-performance/${revisingRecord.id}/revise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true', 'x-actor-email': actorEmail },
        body: JSON.stringify({
          revisionReason: revisionReasonText.trim(),
          actorEmail
        })
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Failed to record controlled revision.');
        return;
      }

      showToast('Controlled revision recorded and archived into immutable audit log.');
      setRevisingRecord(null);
      setRevisionReasonText('');
      setInspectingEvaluation(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Create Commendation
  const handleCreateCommendation = async () => {
    if (!newCommendationForm.volunteerReference || !newCommendationForm.volunteerName || !newCommendationForm.title || !newCommendationForm.reason) {
      alert('Please fill in volunteer reference, name, commendation title, and citation reason.');
      return;
    }

    try {
      const res = await fetch('/api/secretariat/volunteer-commendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true' },
        body: JSON.stringify({
          ...newCommendationForm,
          actorEmail,
          actorName
        })
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Failed to issue commendation.');
        return;
      }

      showToast('Official Commendation created and issued successfully!');
      setIsCreatingCommendation(false);
      setNewCommendationForm({
        volunteerReference: '',
        volunteerName: '',
        organisationName: '',
        department: 'Protocol',
        assignment: '',
        commendationType: 'OUTSTANDING SERVICE',
        title: '',
        reason: '',
        supportingEvidence: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Create Corrective Report
  const handleCreateCorrectiveReport = async () => {
    if (!newCorrectiveForm.volunteerReference || !newCorrectiveForm.volunteerName || !newCorrectiveForm.title || !newCorrectiveForm.factualDescription || !newCorrectiveForm.expectedImprovement) {
      alert('Please fill in volunteer reference, name, title, factual description, and expected improvement.');
      return;
    }

    try {
      const res = await fetch('/api/secretariat/volunteer-corrective-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true' },
        body: JSON.stringify({
          ...newCorrectiveForm,
          actorEmail,
          actorName
        })
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Failed to file corrective report.');
        return;
      }

      showToast('Corrective action report created and dispatched for response!');
      setIsCreatingCorrective(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Submit Volunteer Right-to-Respond
  const handleSubmitVolunteerResponse = async () => {
    if (!respondingReport || !responseStatement.trim()) {
      alert('Please enter a response statement.');
      return;
    }

    try {
      const res = await fetch(`/api/secretariat/volunteer-corrective-reports/${respondingReport.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true' },
        body: JSON.stringify({
          responseType,
          statement: responseStatement.trim(),
          submittedBy: respondingReport.volunteerName
        })
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Failed to submit response.');
        return;
      }

      showToast('Volunteer response incorporated into official dossier!');
      setRespondingReport(null);
      setResponseStatement('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Create Certificate
  const handleCreateCertificate = async () => {
    if (!newCertForm.recipientName) {
      alert('Recipient Name is required.');
      return;
    }

    try {
      const res = await fetch('/api/secretariat/volunteer-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true' },
        body: JSON.stringify({
          ...newCertForm,
          actorEmail,
          actorName
        })
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Failed to generate certificate.');
        return;
      }

      showToast('Certificate registered and generated with unique sequential numbering!');
      setIsCreatingCertificate(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Reissue Certificate
  const handleReissueCertificate = async () => {
    if (!reissuingCert || !reissueReason.trim()) {
      alert('Please supply a mandatory reissue reason.');
      return;
    }

    try {
      const res = await fetch(`/api/secretariat/volunteer-certificates/${reissuingCert.id}/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-mode': 'true' },
        body: JSON.stringify({
          reissueReason: reissueReason.trim(),
          correctedRecipientName: correctedRecipientName.trim() || undefined,
          actorEmail
        })
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Failed to reissue certificate.');
        return;
      }

      showToast('Certificate successfully reissued with new immutable number and preserved audit trail.');
      setReissuingCert(null);
      setReissueReason('');
      setCorrectedRecipientName('');
      setInspectingCertificate(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Exporters for Secretariat Compendiums
  const exportMasterCSV = () => {
    if (performances.length === 0) {
      alert('No performance records to export.');
      return;
    }

    const headers = [
      'Performance ID',
      'Volunteer Reference',
      'Volunteer Name',
      'Email',
      'Applicant Type',
      'Organisation',
      'Department',
      'Assignment',
      'Work Mode',
      'Total Score (/100)',
      'Percentage (%)',
      'Grade',
      'Evaluation Status',
      'Supervisor',
      'Final Outcome',
      'Future Consideration',
      'Consider For Next Year',
      'Audit Reference'
    ];

    const rows = performances.map((p) => [
      p.performanceId,
      p.volunteerReference,
      `"${p.volunteerName}"`,
      p.volunteerEmail,
      `"${p.applicantType}"`,
      `"${p.organisationName || 'N/A'}"`,
      `"${p.department}"`,
      `"${p.assignment}"`,
      `"${p.workMode}"`,
      p.totalScore,
      `${p.percentage}%`,
      p.grade,
      p.evaluationStatus,
      `"${p.supervisorName}"`,
      `"${p.finalOutcome}"`,
      `"${p.futureEventConsideration}"`,
      p.considerForNextYear ? 'YES' : 'NO',
      p.auditReference
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DOMISLINK_SECRETARIAT_VOLUNTEER_PERFORMANCE_MASTER_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auto-populate volunteer details into Evaluation creator
  const handleSelectVolunteerForEvaluation = (ref: string) => {
    const selected = volunteers.find((v) => v.reference === ref);
    if (selected) {
      setEditingEvaluation({
        volunteerReference: selected.reference,
        volunteerApplicationId: selected.id,
        volunteerName: `${selected.firstName} ${selected.lastName}`,
        volunteerEmail: selected.email,
        volunteerPhone: selected.phone,
        applicantType: selected.applicantType,
        organisationName: selected.sponsoringOrgName || selected.organisation,
        summitYear: 2026,
        eventId: 'summit-2026',
        eventName: 'Aviation Safety Summit 2026',
        department: selected.preferredDepartment || 'Protocol',
        assignment: `${selected.preferredDepartment || 'Protocol'} Operations`,
        workMode: selected.preferredDepartment === 'Media & Publicity' ? 'REMOTE — ANYWHERE' : 'ON-SITE — LAGOS',
        supervisorId: `sup-${Date.now()}`,
        supervisorName: 'Barr. Folashade Adeleke',
        supervisorTitle: 'Directorate Supervisor',
        evaluationPeriod: '15-18 November 2026',
        evaluationStatus: 'DRAFT',
        scores: {
          attendanceScore: 8,
          punctualityScore: 8,
          reliabilityScore: 8,
          teamworkScore: 8,
          communicationScore: 8,
          professionalismScore: 8,
          taskCompletionScore: 8,
          initiativeScore: 8,
          safetyComplianceScore: 8,
          adaptabilityScore: 8
        },
        totalScore: 80,
        percentage: 80,
        grade: 'A',
        supervisorComments: 'Demonstrated steadfast commitment, diligence, and professionalism throughout Summit operations.',
        finalOutcome: 'SATISFACTORY SERVICE',
        futureEventConsideration: 'RECOMMENDED FOR FUTURE CONSIDERATION',
        considerForNextYear: true
      });
    }
  };

  return (
    <div className="space-y-6 text-[#0A192F]">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0A192F] text-[#D4AF37] border-2 border-[#D4AF37] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <Crown className="h-5 w-5 text-[#D4AF37]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#102a4e] to-[#0A192F] text-white p-6 sm:p-7 rounded-3xl border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">
              <Crown className="h-4 w-4" />
              <span>DOMISLINK DIGITAL SECRETARIAT • MODULE 4</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>VOLUNTEER PERFORMANCE, GRADING & CERTIFICATION</span>
            </h1>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Authoritative Private Secretariat system for volunteer performance evaluations, 10-criteria scoring (0-100), automated A+ to E grading, official commendations, non-punitive corrective reporting with right-to-respond, and tamper-evident certificate issuance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Logged in actor selector for Zero Self-Approval demonstration */}
            <div className="bg-black/30 border border-[#D4AF37]/30 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-[10px] font-mono">
              <span className="text-gray-400">Actor:</span>
              <select
                value={actorEmail}
                onChange={(e) => {
                  setActorEmail(e.target.value);
                  if (e.target.value === 'secgen@domislink.com') setActorName('Dr. Aliyu Mohammed, CON');
                  else if (e.target.value === 'supervisor.protocol@sec.domislink.com') setActorName('Barr. Folashade Adeleke');
                  else setActorName('Secretariat Operations Officer');
                }}
                className="bg-transparent text-[#D4AF37] font-bold focus:outline-none cursor-pointer"
              >
                <option value="secgen@domislink.com" className="bg-[#0A192F] text-white">Dr. Aliyu (Sec-Gen / Approver)</option>
                <option value="supervisor.protocol@sec.domislink.com" className="bg-[#0A192F] text-white">Barr. Folashade (Protocol Supervisor)</option>
                <option value="supervisor.media@sec.domislink.com" className="bg-[#0A192F] text-white">Mrs. Toyin (Media Supervisor)</option>
              </select>
            </div>

            <button
              onClick={() => {
                setRefreshing(true);
                fetchData();
              }}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition"
              title="Refresh Records"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>

            <button
              onClick={exportMasterCSV}
              className="px-3.5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2c] text-[#0A192F] font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow transition"
            >
              <Download className="h-4 w-4" />
              <span>Export Master Roster</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secretariat Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          { id: 'OVERVIEW', label: 'Executive Dashboard', icon: TrendingUp, badge: `${stats?.totalVolunteers || 0} Total` },
          { id: 'EVALUATIONS', label: 'Performance Dossiers', icon: Sliders, badge: `${performances.length} Evaluated` },
          { id: 'COMMENDATIONS', label: 'Official Commendations', icon: Award, badge: `${commendations.length}` },
          { id: 'CORRECTIVE', label: 'Corrective Reports', icon: AlertTriangle, badge: `${correctiveReports.length}` },
          { id: 'CERTIFICATES', label: 'Certificate Registry', icon: FileCheck, badge: `${certificates.length} Issued` },
          { id: 'ORGANISATIONS', label: 'Corporate Cohorts', icon: Building2, badge: `${organisations.length}` },
          { id: 'FUTURE_CONSIDERATION', label: '2027 Summit Pool', icon: Compass, badge: `${stats?.futureConsiderationCount || 0} Ready` },
          { id: 'REPORTS', label: 'Compendiums & Prints', icon: Printer, badge: '8 Reports' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#0A192F] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#0A192F]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SUB-TAB 1: EXECUTIVE DASHBOARD */}
      {/* ============================================================ */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
            <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">TOTAL ENROLLED</span>
              <span className="text-2xl font-mono font-black text-[#0A192F]">{stats?.totalVolunteers || volunteers.length}</span>
              <span className="text-[10px] text-gray-500 block mt-1">Individual + Corporate Cohorts</span>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">APPROVED EVALUATIONS</span>
              <span className="text-2xl font-mono font-black text-emerald-700">{stats?.evaluatedCount || 0}</span>
              <span className="text-[10px] text-emerald-600 block mt-1">Ratified by Secretariat</span>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">AVERAGE SCORE</span>
              <span className="text-2xl font-mono font-black text-[#96700c]">{stats?.averageScore || 0} / 100</span>
              <span className="text-[10px] text-gray-500 block mt-1">Across 10 criteria</span>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">COMMENDATIONS</span>
              <span className="text-2xl font-mono font-black text-blue-700">{stats?.commendationsCount || commendations.length}</span>
              <span className="text-[10px] text-blue-600 block mt-1">Official citations issued</span>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-mono text-purple-600 uppercase tracking-wider block">CERTIFICATES REGISTERED</span>
              <span className="text-2xl font-mono font-black text-purple-700">{stats?.certificatesIssuedCount || certificates.length}</span>
              <span className="text-[10px] text-purple-600 block mt-1">ASS-CERT-2026-XXXXX</span>
            </div>
          </div>

          {/* Grade Distribution & Work Mode Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Grade Distribution */}
            <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
                  <Award className="h-4 w-4 text-[#D4AF37]" />
                  <span>Performance Grade Distribution</span>
                </h2>
                <span className="text-[10px] font-mono text-gray-400">100-Point Scale</span>
              </div>

              <div className="space-y-3">
                {[
                  { grade: 'A+', label: 'Exceptional (90-100)', count: stats?.gradeDistribution?.['A+'] || 0, color: 'bg-amber-500', text: 'text-amber-900' },
                  { grade: 'A', label: 'Excellent (80-89)', count: stats?.gradeDistribution?.['A'] || 0, color: 'bg-emerald-500', text: 'text-emerald-900' },
                  { grade: 'B', label: 'Very Good (70-79)', count: stats?.gradeDistribution?.['B'] || 0, color: 'bg-blue-500', text: 'text-blue-900' },
                  { grade: 'C', label: 'Satisfactory (60-69)', count: stats?.gradeDistribution?.['C'] || 0, color: 'bg-purple-500', text: 'text-purple-900' },
                  { grade: 'D', label: 'Needs Improvement (50-59)', count: stats?.gradeDistribution?.['D'] || 0, color: 'bg-orange-500', text: 'text-orange-900' },
                  { grade: 'E', label: 'Unsatisfactory (0-49)', count: stats?.gradeDistribution?.['E'] || 0, color: 'bg-rose-500', text: 'text-rose-900' }
                ].map((g) => (
                  <div key={g.grade} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold">{g.grade} — {g.label}</span>
                      <span className="font-bold">{g.count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${g.color} transition-all duration-500`}
                        style={{
                          width: `${performances.length > 0 ? (g.count / performances.length) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Mode & Remote Fairness Governance */}
            <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
                  <Compass className="h-4 w-4 text-blue-600" />
                  <span>Work Mode & Remote Fairness</span>
                </h2>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Protocol Active</span>
              </div>

              <div className="text-xs text-gray-600 space-y-2.5">
                <p>
                  Evaluations strictly apply <strong>location-appropriate fairness</strong>:
                </p>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-[#0A192F] block">On-Site Deployment (Lagos Marriott):</span>
                  <span className="text-[11px] text-gray-500">Physical attendance, punctuality at post, VIP escort protocol, in-person poise.</span>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-blue-900 block">Remote Deployment (Anywhere):</span>
                  <span className="text-[11px] text-blue-700">Digital turnaround speed, Slack/Meet responsiveness, live graphics delivery without penalization for physical distance.</span>
                </div>
              </div>
            </div>

            {/* Governance Safety & Zero Self-Approval Indicator */}
            <div className="p-5 bg-[#0A192F] text-white border border-[#D4AF37]/40 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="text-sm font-bold tracking-tight">Zero Self-Approval Governance</h2>
              </div>

              <p className="text-xs text-gray-300 font-light leading-relaxed">
                In strict compliance with DomisLink Secretariat Executive Regulations, no supervisor or evaluator may approve their own performance evaluation or self-issue commendations.
              </p>

              <div className="p-3 bg-white/10 border border-white/20 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-gray-400">Current Actor:</span>
                  <span className="text-[#D4AF37] font-bold">{actorName}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-gray-400">Actor Email:</span>
                  <span className="text-gray-200">{actorEmail}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
                <Lock className="h-3.5 w-3.5" />
                <span>Audit trail automatically hashes every action with timestamp</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <button
              onClick={() => {
                setIsCreatingEvaluation(true);
                setEditingEvaluation({
                  volunteerReference: '',
                  volunteerName: '',
                  applicantType: 'Individual Volunteer',
                  summitYear: 2026,
                  eventId: 'summit-2026',
                  eventName: 'Aviation Safety Summit 2026',
                  department: 'Protocol',
                  assignment: 'Protocol Operations',
                  workMode: 'ON-SITE — LAGOS',
                  supervisorId: `sup-${Date.now()}`,
                  supervisorName: actorName,
                  evaluationPeriod: '15-18 November 2026',
                  evaluationStatus: 'DRAFT',
                  scores: {
                    attendanceScore: 8,
                    punctualityScore: 8,
                    reliabilityScore: 8,
                    teamworkScore: 8,
                    communicationScore: 8,
                    professionalismScore: 8,
                    taskCompletionScore: 8,
                    initiativeScore: 8,
                    safetyComplianceScore: 8,
                    adaptabilityScore: 8
                  },
                  totalScore: 80,
                  percentage: 80,
                  grade: 'A',
                  supervisorComments: '',
                  finalOutcome: 'SATISFACTORY SERVICE',
                  futureEventConsideration: 'ELIGIBLE FOR FUTURE CONSIDERATION',
                  considerForNextYear: true
                });
                setActiveSubTab('EVALUATIONS');
              }}
              className="p-4 bg-white hover:bg-amber-50/50 border border-gray-200 hover:border-[#D4AF37] rounded-2xl shadow-sm text-left transition space-y-2 group"
            >
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl w-fit group-hover:bg-[#D4AF37] group-hover:text-[#0A192F] transition">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0A192F]">New Evaluation</h3>
              <p className="text-[11px] text-gray-500">Conduct 10-criteria scoring (0-100) and grade assignment.</p>
            </button>

            <button
              onClick={() => {
                setIsCreatingCommendation(true);
                setActiveSubTab('COMMENDATIONS');
              }}
              className="p-4 bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-400 rounded-2xl shadow-sm text-left transition space-y-2 group"
            >
              <div className="p-2.5 bg-blue-100 text-blue-900 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0A192F]">Issue Commendation</h3>
              <p className="text-[11px] text-gray-500">Record outstanding or digital contribution citations.</p>
            </button>

            <button
              onClick={() => {
                setIsCreatingCorrective(true);
                setActiveSubTab('CORRECTIVE');
              }}
              className="p-4 bg-white hover:bg-orange-50/50 border border-gray-200 hover:border-orange-400 rounded-2xl shadow-sm text-left transition space-y-2 group"
            >
              <div className="p-2.5 bg-orange-100 text-orange-900 rounded-xl w-fit group-hover:bg-orange-600 group-hover:text-white transition">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0A192F]">File Corrective Report</h3>
              <p className="text-[11px] text-gray-500">Constructive operational feedback with volunteer right-to-respond.</p>
            </button>

            <button
              onClick={() => {
                setIsCreatingCertificate(true);
                setActiveSubTab('CERTIFICATES');
              }}
              className="p-4 bg-white hover:bg-purple-50/50 border border-gray-200 hover:border-purple-400 rounded-2xl shadow-sm text-left transition space-y-2 group"
            >
              <div className="p-2.5 bg-purple-100 text-purple-900 rounded-xl w-fit group-hover:bg-purple-600 group-hover:text-white transition">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0A192F]">Generate Certificate</h3>
              <p className="text-[11px] text-gray-500">Individual & corporate cohort certificates with verification codes.</p>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: PERFORMANCE DOSSIERS & EVALUATIONS DIRECTORY */}
      {/* ============================================================ */}
      {activeSubTab === 'EVALUATIONS' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by volunteer name, ref (ASS-VOL-2026-XXXX), department, organisation, supervisor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FCFBF7] border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#D4AF37] text-[#0A192F] text-xs"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 bg-[#FCFBF7] border border-gray-300 rounded-xl font-mono text-xs text-[#0A192F]"
              >
                <option value="ALL">All Departments</option>
                {departmentsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 bg-[#FCFBF7] border border-gray-300 rounded-xl font-mono text-xs text-[#0A192F]"
              >
                <option value="ALL">All Grades</option>
                <option value="A+">Grade A+ (90-100)</option>
                <option value="A">Grade A (80-89)</option>
                <option value="B">Grade B (70-79)</option>
                <option value="C">Grade C (60-69)</option>
                <option value="D">Grade D (50-59)</option>
                <option value="E">Grade E (0-49)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#FCFBF7] border border-gray-300 rounded-xl font-mono text-xs text-[#0A192F]"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved / Ratified</option>
                <option value="SUBMITTED">Submitted (Pending Review)</option>
                <option value="DRAFT">Draft</option>
              </select>

              <button
                onClick={() => {
                  setIsCreatingEvaluation(true);
                  setEditingEvaluation({
                    volunteerReference: '',
                    volunteerName: '',
                    applicantType: 'Individual Volunteer',
                    summitYear: 2026,
                    eventId: 'summit-2026',
                    eventName: 'Aviation Safety Summit 2026',
                    department: 'Protocol',
                    assignment: 'Protocol Operations',
                    workMode: 'ON-SITE — LAGOS',
                    supervisorId: `sup-${Date.now()}`,
                    supervisorName: actorName,
                    evaluationPeriod: '15-18 November 2026',
                    evaluationStatus: 'DRAFT',
                    scores: {
                      attendanceScore: 8,
                      punctualityScore: 8,
                      reliabilityScore: 8,
                      teamworkScore: 8,
                      communicationScore: 8,
                      professionalismScore: 8,
                      taskCompletionScore: 8,
                      initiativeScore: 8,
                      safetyComplianceScore: 8,
                      adaptabilityScore: 8
                    },
                    totalScore: 80,
                    percentage: 80,
                    grade: 'A',
                    supervisorComments: '',
                    finalOutcome: 'SATISFACTORY SERVICE',
                    futureEventConsideration: 'ELIGIBLE FOR FUTURE CONSIDERATION',
                    considerForNextYear: true
                  });
                }}
                className="px-3.5 py-2 bg-[#0A192F] hover:bg-[#132c4e] text-[#D4AF37] border border-[#D4AF37]/50 font-bold rounded-xl flex items-center space-x-1.5 shadow transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create Evaluation</span>
              </button>
            </div>
          </div>

          {/* Evaluations Master Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A192F] text-white border-b border-[#D4AF37]/30 text-[10px] font-mono uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Volunteer & Ref</th>
                    <th className="py-3 px-4">Department & Work Mode</th>
                    <th className="py-3 px-4">Organisation</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Supervisor</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPerformances.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-40 text-[#D4AF37]" />
                        <p className="font-bold text-gray-600">No Volunteer Evaluations Match Criteria</p>
                        <p className="text-[11px] mt-1">Try clearing filters or conduct a new evaluation.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPerformances.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0A192F]">{item.volunteerName}</div>
                          <div className="text-[10px] font-mono text-gray-500">{item.volunteerReference}</div>
                          <div className="text-[9px] text-gray-400">{item.applicantType}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-800">{item.department}</div>
                          <span
                            className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded mt-0.5 ${
                              item.workMode === 'REMOTE — ANYWHERE'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.workMode}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-gray-600">
                          {item.organisationName || <span className="text-gray-400 italic">Direct Individual</span>}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono font-bold text-[#0A192F] text-sm">{item.totalScore}</span>
                          <span className="text-[10px] text-gray-400">/100</span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-xs border ${getGradeBadge(item.grade)}`}>
                            {item.grade}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${getOutcomeBadge(item.finalOutcome)}`}>
                            {item.finalOutcome}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              item.evaluationStatus === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : item.evaluationStatus === 'SUBMITTED'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.evaluationStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                          <div>{item.supervisorName}</div>
                          <div className="text-[9px] text-gray-400">{item.summitYear} Summit</div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setInspectingEvaluation(item)}
                              className="px-2.5 py-1.5 bg-[#0A192F] hover:bg-[#1a385f] text-white rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                              title="Inspect Full Evaluation Dossier"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#D4AF37]" />
                              <span>Dossier</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: OFFICIAL COMMENDATIONS */}
      {/* ============================================================ */}
      {activeSubTab === 'COMMENDATIONS' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
                <Award className="h-4 w-4 text-[#D4AF37]" />
                <span>Official Commendations & Special Citations Register</span>
              </h2>
              <p className="text-[11px] text-gray-500">High-level recognition issued for outstanding service, digital dedication, or exceptional leadership.</p>
            </div>

            <button
              onClick={() => setIsCreatingCommendation(true)}
              className="px-3.5 py-2 bg-[#0A192F] hover:bg-[#132c4e] text-[#D4AF37] border border-[#D4AF37]/50 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow transition"
            >
              <Plus className="h-4 w-4" />
              <span>Issue New Commendation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commendations.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-gray-400 bg-white border border-gray-200 rounded-2xl">
                <Award className="h-8 w-8 mx-auto mb-2 opacity-40 text-[#D4AF37]" />
                <p className="font-bold text-gray-600">No Commendations Issued Yet</p>
              </div>
            ) : (
              commendations.map((c) => (
                <div key={c.id} className="p-5 bg-white border border-[#D4AF37]/40 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">{c.commendationId}</span>
                      <h3 className="font-bold text-[#0A192F] text-sm">{c.volunteerName}</h3>
                      <span className="text-[10px] text-gray-500">{c.department} • {c.organisationName || 'Direct Volunteer'}</span>
                    </div>

                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] rounded-lg">
                      {c.commendationType}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-[#0A192F] block">{c.title}</span>
                    <p className="text-gray-600 text-[11px] leading-relaxed italic bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                      "{c.reason}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-2 border-t border-gray-100">
                    <div>Approved by: <span className="font-bold text-gray-700">{c.approvedByName || 'Secretary-General'}</span></div>
                    <div>Date: <span className="font-bold">{c.issueDate}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 4: CORRECTIVE & REBUKE REPORTS (WITH RIGHT TO RESPOND) */}
      {/* ============================================================ */}
      {activeSubTab === 'CORRECTIVE' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span>Corrective & Advisory Actions Register</span>
              </h2>
              <p className="text-[11px] text-gray-500">Constructive operational feedback, performance advisories, and mandatory volunteer right-to-respond dossiers.</p>
            </div>

            <button
              onClick={() => setIsCreatingCorrective(true)}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow transition"
            >
              <Plus className="h-4 w-4" />
              <span>File Corrective Report</span>
            </button>
          </div>

          <div className="space-y-3">
            {correctiveReports.length === 0 ? (
              <div className="py-12 text-center text-gray-400 bg-white border border-gray-200 rounded-2xl">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40 text-emerald-600" />
                <p className="font-bold text-gray-600">No Corrective Actions on Record</p>
                <p className="text-[11px] mt-1">All volunteer operations within expected parameters.</p>
              </div>
            ) : (
              correctiveReports.map((r) => (
                <div key={r.id} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-orange-600">{r.correctiveReportId}</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-900 rounded text-[10px] font-bold">
                          {r.issueCategory}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0A192F] mt-1">{r.volunteerName} ({r.volunteerReference})</h3>
                      <span className="text-[10px] text-gray-500">{r.department} • Date: {r.date}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                          r.finalStatus === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.finalStatus === 'RESPONSE_SUBMITTED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {r.finalStatus}
                      </span>
                      {!r.volunteerResponse && (
                        <button
                          onClick={() => setRespondingReport(r)}
                          className="px-2.5 py-1 bg-[#0A192F] text-white hover:bg-[#1a385f] rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                        >
                          <MessageSquare className="h-3 w-3 text-[#D4AF37]" />
                          <span>Record Response</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                      <span className="font-bold text-[#0A192F] block">Factual Incident Description:</span>
                      <p className="text-gray-600 text-[11px] leading-relaxed">{r.factualDescription}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                      <span className="font-bold text-[#0A192F] block">Expected Improvement & Recommendation:</span>
                      <p className="text-gray-600 text-[11px] leading-relaxed">{r.expectedImprovement}</p>
                    </div>
                  </div>

                  {/* Volunteer Response Box */}
                  {r.volunteerResponse ? (
                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 flex items-center space-x-1.5">
                          <CheckSquare className="h-3.5 w-3.5 text-blue-700" />
                          <span>Volunteer Response ({r.volunteerResponse.responseType})</span>
                        </span>
                        <span className="text-[10px] font-mono text-blue-700">
                          {new Date(r.volunteerResponse.submittedAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <p className="text-blue-900 text-[11px] leading-relaxed italic">
                        "{r.volunteerResponse.statement}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Awaiting volunteer right-to-respond statement (Deadline: {r.responseDeadline || '5 days'}).</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 5: CERTIFICATE REGISTRY & GENERATOR */}
      {/* ============================================================ */}
      {activeSubTab === 'CERTIFICATES' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
                <FileCheck className="h-4 w-4 text-[#D4AF37]" />
                <span>Authoritative Certificate Issuance Ledger</span>
              </h2>
              <p className="text-[11px] text-gray-500">Immutable certificate numbering (ASS-CERT-2026-XXXXX) for individual volunteers and corporate sponsor cohorts.</p>
            </div>

            <button
              onClick={() => setIsCreatingCertificate(true)}
              className="px-3.5 py-2 bg-[#0A192F] hover:bg-[#132c4e] text-[#D4AF37] border border-[#D4AF37]/50 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow transition"
            >
              <Plus className="h-4 w-4" />
              <span>Issue New Certificate</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A192F] text-white border-b border-[#D4AF37]/30 text-[10px] font-mono uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Cert Number & Code</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Department / Cohort</th>
                    <th className="py-3 px-4">Signatory</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        <FileCheck className="h-8 w-8 mx-auto mb-2 opacity-40 text-[#D4AF37]" />
                        <p className="font-bold text-gray-600">No Certificates Issued</p>
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-amber-50/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0A192F]">
                          <div>{cert.certificateNumber}</div>
                          <div className="text-[9px] text-gray-400">{cert.verificationCode}</div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#0A192F]">
                          <div>{cert.recipientName}</div>
                          {cert.isOrganisationCertificate && (
                            <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono font-normal">
                              Corporate Cohort ({cert.verifiedVolunteersCount || 1} Volunteers)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-gray-700 text-[11px]">
                          {cert.certificateType}
                        </td>

                        <td className="py-3.5 px-4 text-gray-600">
                          <div>{cert.department || 'Summit Support'}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{cert.workMode}</div>
                        </td>

                        <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                          <div>{cert.signatoryName}</div>
                          <div className="text-[9px] text-gray-400">{cert.signatoryTitle}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-gray-600">
                          {cert.issueDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              cert.status === 'ISSUED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : cert.status === 'REVISED'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {cert.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setInspectingCertificate(cert)}
                              className="px-2.5 py-1.5 bg-[#0A192F] hover:bg-[#1a385f] text-[#D4AF37] rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Cert</span>
                            </button>

                            <button
                              onClick={() => {
                                setReissuingCert(cert);
                                setCorrectedRecipientName(cert.recipientName);
                              }}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] transition"
                              title="Controlled Reissue"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 6: CORPORATE COHORTS & ORGANISATIONS */}
      {/* ============================================================ */}
      {activeSubTab === 'ORGANISATIONS' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-[#D4AF37]" />
                <span>Corporate-Sponsored & Nominated Cohorts Registry</span>
              </h2>
              <p className="text-[11px] text-gray-500">Track institutional volunteer contributions, sponsored personnel, and cross-summit partnership records.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organisations.length === 0 ? (
              <div className="col-span-3 py-12 text-center text-gray-400 bg-white border border-gray-200 rounded-2xl">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-40 text-[#D4AF37]" />
                <p className="font-bold text-gray-600">No Corporate Cohorts Registered</p>
              </div>
            ) : (
              organisations.map((org, idx) => (
                <div key={idx} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <h3 className="font-bold text-[#0A192F] text-sm">{org.name}</h3>
                      <span className="text-[10px] font-mono text-gray-400">{org.sector}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-[10px] font-bold">
                      {org.totalDeployed} Volunteers
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center py-1">
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[9px] font-mono text-gray-400 block">EVALUATED</span>
                      <span className="font-bold text-emerald-700 text-xs">{org.completedService}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[9px] font-mono text-gray-400 block">COMMENDED</span>
                      <span className="font-bold text-blue-700 text-xs">{org.commendationsCount}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[9px] font-mono text-gray-400 block">CERTS</span>
                      <span className="font-bold text-purple-700 text-xs">{org.certificatesIssuedCount}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-gray-700 block">Registered Personnel:</span>
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {org.volunteers.map((v: any, vIdx: number) => (
                        <div key={vIdx} className="flex justify-between text-[10px] p-1.5 bg-gray-50 rounded-lg">
                          <span className="font-medium text-[#0A192F]">{v.name}</span>
                          <span className="text-gray-400 font-mono">{v.department}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 7: 2027 SUMMIT FUTURE CONSIDERATION POOL */}
      {/* ============================================================ */}
      {activeSubTab === 'FUTURE_CONSIDERATION' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
                <Compass className="h-4 w-4 text-[#D4AF37]" />
                <span>2027 Summit Future Consideration & Leadership Pool</span>
              </h2>
              <p className="text-[11px] text-gray-500">Vetted candidate pool recommended by supervisors for future leadership and coordinator roles in the 2027 Summit.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performances
              .filter((p) => p.considerForNextYear || p.futureEventConsideration === 'RECOMMENDED FOR FUTURE CONSIDERATION')
              .map((p) => (
                <div key={p.id} className="p-5 bg-white border border-emerald-300 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <h3 className="font-bold text-[#0A192F] text-sm">{p.volunteerName}</h3>
                      <span className="text-[10px] font-mono text-gray-500">{p.volunteerReference}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs border ${getGradeBadge(p.grade)}`}>
                      Grade {p.grade} ({p.totalScore}/100)
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block">2026 Summit Assignment:</span>
                    <span className="font-medium text-[#0A192F] block">{p.department} — {p.assignment}</span>
                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 inline-block mt-1">
                      {p.workMode}
                    </span>
                  </div>

                  {p.nextYearRecommendationNotes && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-emerald-900 block text-[10px]">Supervisor Recommendation Notes:</span>
                      <p className="text-emerald-800 text-[11px] leading-relaxed italic">
                        "{p.nextYearRecommendationNotes}"
                      </p>
                    </div>
                  )}

                  <div className="text-[10px] text-gray-500 flex justify-between pt-1 border-t border-gray-100">
                    <span>Supervisor: {p.supervisorName}</span>
                    <span className="text-emerald-700 font-bold">Recommended</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 8: COMPENDIUMS & PRINTABLE REPORTS */}
      {/* ============================================================ */}
      {activeSubTab === 'REPORTS' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h2 className="text-sm font-bold text-[#0A192F] flex items-center space-x-2">
              <Printer className="h-4 w-4 text-[#D4AF37]" />
              <span>Official Secretariat Compendium & Report Generator</span>
            </h2>
            <p className="text-[11px] text-gray-500">Single-click export and print-ready compilations for the Executive Directorate.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Master Performance Register',
                desc: 'Full CSV compendium with all 10 criteria, grades, outcomes, and audit hashes.',
                action: exportMasterCSV,
                icon: Download
              },
              {
                title: 'Official Commendations List',
                desc: 'Print-ready compilation of all approved citations and special contributions.',
                action: () => window.print(),
                icon: Award
              },
              {
                title: 'Certificates Issuance Ledger',
                desc: 'Sequential registry with cryptographic verification tokens.',
                action: () => alert('Certificates ledger exported to print queue.'),
                icon: FileCheck
              },
              {
                title: '2027 Future Roster',
                desc: 'Vetted list of top volunteers recommended for the 2027 Summit.',
                action: () => alert('2027 Pool exported successfully.'),
                icon: Compass
              }
            ].map((rep, idx) => {
              const Icon = rep.icon;
              return (
                <div key={idx} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
                  <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-[#0A192F] text-sm">{rep.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{rep.desc}</p>
                  <button
                    onClick={rep.action}
                    className="w-full py-2 bg-[#0A192F] hover:bg-[#1a385f] text-[#D4AF37] rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <span>Generate & Print</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIEW COMPLETE EVALUATION DOSSIER */}
      {/* ============================================================ */}
      {inspectingEvaluation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                  <Crown className="h-4 w-4" />
                  <span>VOLUNTEER PERFORMANCE DOSSIER • {inspectingEvaluation.performanceId}</span>
                </div>
                <h2 className="text-xl font-black text-[#0A192F]">{inspectingEvaluation.volunteerName}</h2>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>Ref: <strong className="font-mono text-[#0A192F]">{inspectingEvaluation.volunteerReference}</strong></span>
                  <span>•</span>
                  <span>Dept: <strong className="text-[#0A192F]">{inspectingEvaluation.department}</strong></span>
                  <span>•</span>
                  <span>Mode: <strong className="text-[#0A192F]">{inspectingEvaluation.workMode}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setInspectingEvaluation(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score & Grade Banner */}
            <div className="p-4 bg-[#0A192F] text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">OVERALL SCORE</span>
                <span className="text-3xl font-mono font-black text-white">{inspectingEvaluation.totalScore} / 100</span>
                <span className="text-xs text-gray-300 block mt-0.5">Percentage: {inspectingEvaluation.percentage}%</span>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">FINAL GRADE</span>
                <span className={`px-4 py-1.5 rounded-xl text-lg font-black inline-block ${getGradeBadge(inspectingEvaluation.grade)}`}>
                  {inspectingEvaluation.grade}
                </span>
                <span className="text-[10px] text-gray-300 block">Outcome: <strong>{inspectingEvaluation.finalOutcome}</strong></span>
              </div>
            </div>

            {/* 10 Criteria Score Breakdown Grid */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">10 CRITERIA BREAKDOWN (0-10 PTS EACH)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { key: 'attendanceScore', label: 'Attendance / Sched.', val: inspectingEvaluation.scores?.attendanceScore },
                  { key: 'punctualityScore', label: 'Punctuality / Timeliness', val: inspectingEvaluation.scores?.punctualityScore },
                  { key: 'reliabilityScore', label: 'Reliability', val: inspectingEvaluation.scores?.reliabilityScore },
                  { key: 'teamworkScore', label: 'Teamwork', val: inspectingEvaluation.scores?.teamworkScore },
                  { key: 'communicationScore', label: 'Communication', val: inspectingEvaluation.scores?.communicationScore },
                  { key: 'professionalismScore', label: 'Professionalism', val: inspectingEvaluation.scores?.professionalismScore },
                  { key: 'taskCompletionScore', label: 'Task Completion', val: inspectingEvaluation.scores?.taskCompletionScore },
                  { key: 'initiativeScore', label: 'Initiative', val: inspectingEvaluation.scores?.initiativeScore },
                  { key: 'safetyComplianceScore', label: 'Safety Protocols', val: inspectingEvaluation.scores?.safetyComplianceScore },
                  { key: 'adaptabilityScore', label: 'Adaptability', val: inspectingEvaluation.scores?.adaptabilityScore }
                ].map((c) => (
                  <div key={c.key} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-center">
                    <span className="text-[10px] font-medium text-gray-500 block truncate" title={c.label}>{c.label}</span>
                    <span className="text-sm font-mono font-black text-[#0A192F]">{c.val || 0} / 10</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative & Observations */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-1">
                <span className="font-bold text-[#0A192F] block">Supervisor Assessment & Comments:</span>
                <p className="text-gray-700 leading-relaxed">{inspectingEvaluation.supervisorComments}</p>
                <div className="text-[10px] font-mono text-gray-500 pt-1">
                  Evaluated by: <strong>{inspectingEvaluation.supervisorName}</strong> ({inspectingEvaluation.evaluationPeriod})
                </div>
              </div>

              {inspectingEvaluation.evidenceNotes && (
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="font-bold text-gray-700 block">Supporting Evidence & Deliverables:</span>
                  <p className="text-gray-600 text-[11px]">{inspectingEvaluation.evidenceNotes}</p>
                </div>
              )}
            </div>

            {/* Zero Self-Approval Warning / Error Banner if triggered */}
            {approvalError && (
              <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-xl text-xs text-rose-900 flex items-start space-x-2">
                <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Governance Policy Enforcement:</span>
                  <span>{approvalError}</span>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="text-[10px] font-mono text-gray-400">
                Audit Hash: {inspectingEvaluation.auditReference}
              </div>

              <div className="flex items-center space-x-2">
                {inspectingEvaluation.evaluationStatus !== 'APPROVED' && (
                  <button
                    onClick={() => handleApproveEvaluation(inspectingEvaluation)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow transition"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve Evaluation</span>
                  </button>
                )}

                <button
                  onClick={() => setRevisingRecord(inspectingEvaluation)}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition"
                >
                  <RotateCcw className="h-4 w-4 text-gray-600" />
                  <span>Controlled Revision</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE / CONDUCT PERFORMANCE EVALUATION */}
      {/* ============================================================ */}
      {isCreatingEvaluation && editingEvaluation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-[#0A192F]">Conduct Volunteer Performance Evaluation</h2>
                <p className="text-xs text-gray-500">10-Criteria Scoring (0-100) with real-time grade computation.</p>
              </div>
              <button
                onClick={() => {
                  setIsCreatingEvaluation(false);
                  setEditingEvaluation(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Volunteer Selection or Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Select Registered Volunteer</label>
                <select
                  onChange={(e) => handleSelectVolunteerForEvaluation(e.target.value)}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs font-mono text-[#0A192F]"
                >
                  <option value="">-- Choose from Enrolled Roster --</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.reference}>
                      {v.reference} — {v.firstName} {v.lastName} ({v.preferredDepartment})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Volunteer Reference Code *</label>
                <input
                  type="text"
                  value={editingEvaluation.volunteerReference || ''}
                  onChange={(e) => setEditingEvaluation({ ...editingEvaluation, volunteerReference: e.target.value })}
                  placeholder="e.g. ASS-VOL-2026-0001"
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Volunteer Full Name *</label>
                <input
                  type="text"
                  value={editingEvaluation.volunteerName || ''}
                  onChange={(e) => setEditingEvaluation({ ...editingEvaluation, volunteerName: e.target.value })}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Department *</label>
                <select
                  value={editingEvaluation.department || 'Protocol'}
                  onChange={(e) => setEditingEvaluation({ ...editingEvaluation, department: e.target.value })}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs"
                >
                  {departmentsList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Work Mode (Location Fairness) *</label>
                <select
                  value={editingEvaluation.workMode || 'ON-SITE — LAGOS'}
                  onChange={(e) => setEditingEvaluation({ ...editingEvaluation, workMode: e.target.value as any })}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs font-mono"
                >
                  <option value="ON-SITE — LAGOS">ON-SITE — LAGOS (Marriott Ikeja)</option>
                  <option value="REMOTE — ANYWHERE">REMOTE — ANYWHERE (Digital Desk)</option>
                  <option value="HYBRID">HYBRID</option>
                  <option value="FLEXIBLE">FLEXIBLE</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Supervisor Name *</label>
                <input
                  type="text"
                  value={editingEvaluation.supervisorName || actorName}
                  onChange={(e) => setEditingEvaluation({ ...editingEvaluation, supervisorName: e.target.value })}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* 10 Criteria Score Sliders / Inputs */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-[#0A192F]">10-CRITERIA SCORING MATRIX (0-10)</span>
                {(() => {
                  const { total, grade } = calculateFormTotalAndGrade(editingEvaluation.scores || {});
                  return (
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-xs font-bold text-[#0A192F]">Total: {total}/100</span>
                      <span className={`px-2 py-0.5 rounded text-xs border ${getGradeBadge(grade)}`}>
                        Grade: {grade}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'attendanceScore', label: '1. Attendance / Agreed Schedule' },
                  { key: 'punctualityScore', label: '2. Punctuality & Turnaround Time' },
                  { key: 'reliabilityScore', label: '3. Reliability & Dependability' },
                  { key: 'teamworkScore', label: '4. Teamwork & Collaboration' },
                  { key: 'communicationScore', label: '5. Communication & Responsiveness' },
                  { key: 'professionalismScore', label: '6. Professionalism & Representation' },
                  { key: 'taskCompletionScore', label: '7. Task Completion & Deliverable Quality' },
                  { key: 'initiativeScore', label: '8. Initiative & Proactivity' },
                  { key: 'safetyComplianceScore', label: '9. Aviation Safety Protocol Compliance' },
                  { key: 'adaptabilityScore', label: '10. Adaptability & Problem Solving' }
                ].map((item) => (
                  <div key={item.key} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={editingEvaluation.scores?.[item.key as keyof typeof editingEvaluation.scores] ?? 8}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, Number(e.target.value) || 0));
                        const updatedScores = { ...editingEvaluation.scores, [item.key]: val } as any;
                        const { total, percentage, grade } = calculateFormTotalAndGrade(updatedScores);
                        setEditingEvaluation({
                          ...editingEvaluation,
                          scores: updatedScores,
                          totalScore: total,
                          percentage,
                          grade
                        });
                      }}
                      className="w-16 p-1.5 bg-white border border-gray-300 rounded-lg text-center font-mono font-bold text-[#0A192F]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative & Outcome */}
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Supervisor Narrative Assessment *</label>
                <textarea
                  rows={3}
                  value={editingEvaluation.supervisorComments || ''}
                  onChange={(e) => setEditingEvaluation({ ...editingEvaluation, supervisorComments: e.target.value })}
                  placeholder="Provide detailed, evidence-based remarks on performance, conduct, and specific contributions..."
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Final Outcome</label>
                  <select
                    value={editingEvaluation.finalOutcome || 'SATISFACTORY SERVICE'}
                    onChange={(e) => setEditingEvaluation({ ...editingEvaluation, finalOutcome: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs"
                  >
                    <option value="COMMENDED">COMMENDED</option>
                    <option value="CERTIFICATE ISSUED">CERTIFICATE ISSUED</option>
                    <option value="APPRECIATION">APPRECIATION</option>
                    <option value="SATISFACTORY SERVICE">SATISFACTORY SERVICE</option>
                    <option value="IMPROVEMENT REQUIRED">IMPROVEMENT REQUIRED</option>
                    <option value="CORRECTIVE ACTION">CORRECTIVE ACTION</option>
                    <option value="UNSATISFACTORY SERVICE">UNSATISFACTORY SERVICE</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Future Summit Readiness (2027 Pool)</label>
                  <select
                    value={editingEvaluation.futureEventConsideration || 'ELIGIBLE FOR FUTURE CONSIDERATION'}
                    onChange={(e) => setEditingEvaluation({ ...editingEvaluation, futureEventConsideration: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs"
                  >
                    <option value="RECOMMENDED FOR FUTURE CONSIDERATION">RECOMMENDED FOR FUTURE CONSIDERATION</option>
                    <option value="ELIGIBLE FOR FUTURE CONSIDERATION">ELIGIBLE FOR FUTURE CONSIDERATION</option>
                    <option value="PRIOR SERVICE RECOGNITION">PRIOR SERVICE RECOGNITION</option>
                    <option value="REVIEW REQUIRED BEFORE FUTURE ASSIGNMENT">REVIEW REQUIRED BEFORE FUTURE ASSIGNMENT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleSaveEvaluation(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSaveEvaluation(true)}
                className="px-4 py-2.5 bg-[#0A192F] hover:bg-[#132c4e] text-[#D4AF37] border border-[#D4AF37]/50 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow transition"
              >
                <Send className="h-4 w-4" />
                <span>Submit for Secretariat Review</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE COMMENDATION */}
      {/* ============================================================ */}
      {isCreatingCommendation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-black text-[#0A192F] flex items-center space-x-2">
                <Award className="h-5 w-5 text-[#D4AF37]" />
                <span>Issue Official Commendation</span>
              </h2>
              <button onClick={() => setIsCreatingCommendation(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Select Volunteer</label>
                <select
                  onChange={(e) => {
                    const sel = volunteers.find((v) => v.reference === e.target.value);
                    if (sel) {
                      setNewCommendationForm({
                        ...newCommendationForm,
                        volunteerReference: sel.reference,
                        volunteerName: `${sel.firstName} ${sel.lastName}`,
                        organisationName: sel.sponsoringOrgName || sel.organisation,
                        department: sel.preferredDepartment || 'Protocol'
                      });
                    }
                  }}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl"
                >
                  <option value="">-- Choose Registered Volunteer --</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.reference}>{v.reference} — {v.firstName} {v.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Commendation Category *</label>
                <select
                  value={newCommendationForm.commendationType}
                  onChange={(e) => setNewCommendationForm({ ...newCommendationForm, commendationType: e.target.value })}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl font-bold"
                >
                  <option value="OUTSTANDING SERVICE">OUTSTANDING SERVICE</option>
                  <option value="SPECIAL CONTRIBUTION">SPECIAL CONTRIBUTION</option>
                  <option value="DIGITAL/REMOTE CONTRIBUTION">DIGITAL/REMOTE CONTRIBUTION</option>
                  <option value="LEADERSHIP RECOGNITION">LEADERSHIP RECOGNITION</option>
                  <option value="SAFETY CONTRIBUTION">SAFETY CONTRIBUTION</option>
                  <option value="SERVICE APPRECIATION">SERVICE APPRECIATION</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Commendation Title *</label>
                <input
                  type="text"
                  value={newCommendationForm.title}
                  onChange={(e) => setNewCommendationForm({ ...newCommendationForm, title: e.target.value })}
                  placeholder="e.g. Commendation for Flawless VIP Protocol Reception"
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Formal Citation Reason *</label>
                <textarea
                  rows={3}
                  value={newCommendationForm.reason}
                  onChange={(e) => setNewCommendationForm({ ...newCommendationForm, reason: e.target.value })}
                  placeholder="In recognition of exceptional poise and diligence..."
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setIsCreatingCommendation(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCommendation}
                className="px-4 py-2 bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/50 font-bold rounded-xl text-xs shadow"
              >
                Issue Commendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: RECORD VOLUNTEER RIGHT-TO-RESPOND */}
      {/* ============================================================ */}
      {respondingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-black text-[#0A192F] flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Volunteer Right to Respond</span>
              </h2>
              <button onClick={() => setRespondingReport(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#0A192F]">{respondingReport.title}</span>
              <p className="text-gray-600 text-[11px]">{respondingReport.factualDescription}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Response Type</label>
                <select
                  value={responseType}
                  onChange={(e) => setResponseType(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl font-bold"
                >
                  <option value="EXPLANATION">Explanation (Context / Operational Factors)</option>
                  <option value="ACKNOWLEDGEMENT">Acknowledgement & Commitment to Improvement</option>
                  <option value="CLARIFICATION">Clarification of Facts</option>
                  <option value="DISAGREEMENT">Respectful Disagreement / Review Request</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Response Statement *</label>
                <textarea
                  rows={4}
                  value={responseStatement}
                  onChange={(e) => setResponseStatement(e.target.value)}
                  placeholder="State the volunteer's response, facts, or context clearly..."
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <button onClick={() => setRespondingReport(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={handleSubmitVolunteerResponse}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow"
              >
                Incorporate Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIEW & PRINT OFFICIAL CERTIFICATE */}
      {/* ============================================================ */}
      {inspectingCertificate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border-4 border-[#D4AF37] space-y-6 max-h-[95vh] overflow-y-auto">
            {/* Top Bar with Print and Close */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-mono text-[#D4AF37] font-bold">
                CERTIFICATE AUTHENTICATION PREVIEW
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/50 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setInspectingCertificate(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* A4 Landscape High-Fidelity Certificate Presentation */}
            <div className="bg-[#FAF8F2] border-8 border-[#0A192F] p-8 sm:p-12 text-center rounded-2xl relative shadow-inner space-y-6">
              {/* Golden Crown Emblem */}
              <div className="flex justify-center">
                <div className="p-3 bg-[#0A192F] text-[#D4AF37] rounded-2xl border-2 border-[#D4AF37] shadow-md">
                  <Crown className="h-10 w-10" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono tracking-widest text-[#0A192F] uppercase block font-bold">
                  DOMISLINK INTERNATIONAL SERVICES LTD • THE DIGITAL EMPIRE
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block font-bold">
                  AVIATION SAFETY SUMMIT {inspectingCertificate.summitYear}
                </span>
                <p className="text-xs text-gray-600 italic">"EVERYBODY IS INVOLVED IN AVIATION SAFETY"</p>
              </div>

              <div className="py-2">
                <span className="text-xs font-mono tracking-widest text-gray-400 uppercase block">THIS IS TO CERTIFY THAT</span>
                <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#0A192F] tracking-tight mt-2">
                  {inspectingCertificate.recipientName}
                </h1>
                {inspectingCertificate.isOrganisationCertificate && (
                  <span className="text-xs font-mono text-[#D4AF37] font-bold block mt-1">
                    Corporate Volunteer Deployment Cohort ({inspectingCertificate.verifiedVolunteersCount || 1} Verified Volunteers)
                  </span>
                )}
              </div>

              <div className="max-w-xl mx-auto text-xs text-gray-700 leading-relaxed font-serif">
                has successfully completed dedicated service and rendered invaluable support as part of the official Volunteer Corps during the Aviation Safety Summit 2026, Marriott Hotel Ikeja, Lagos, Nigeria.
              </div>

              <div className="pt-6 border-t border-gray-300 grid grid-cols-2 gap-6 text-left text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">SIGNATORY</span>
                  <span className="font-bold text-[#0A192F] text-sm block">{inspectingCertificate.signatoryName}</span>
                  <span className="text-[10px] text-gray-500">{inspectingCertificate.signatoryTitle}, {inspectingCertificate.signatoryOrg}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">CERTIFICATE NUMBER</span>
                  <span className="font-bold text-[#0A192F] text-sm block">{inspectingCertificate.certificateNumber}</span>
                  <span className="text-[10px] text-gray-500">Security Token: {inspectingCertificate.verificationCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CONTROLLED CERTIFICATE REISSUE */}
      {/* ============================================================ */}
      {reissuingCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-black text-[#0A192F] flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-amber-600" />
                <span>Controlled Certificate Reissue</span>
              </h2>
              <button onClick={() => setReissuingCert(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-xs space-y-1 text-amber-900">
              <span className="font-bold">Original Certificate: {reissuingCert.certificateNumber}</span>
              <p className="text-[11px]">Reissuing supersedes the old certificate number, archives its history, and creates a new immutable sequential reference.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Corrected Recipient Name</label>
                <input
                  type="text"
                  value={correctedRecipientName}
                  onChange={(e) => setCorrectedRecipientName(e.target.value)}
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mandatory Reissue Reason *</label>
                <textarea
                  rows={3}
                  value={reissueReason}
                  onChange={(e) => setReissueReason(e.target.value)}
                  placeholder="e.g. Corrected typographic spelling of recipient middle name approved by Secretariat."
                  className="w-full p-2.5 bg-[#FCFBF7] border border-gray-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <button onClick={() => setReissuingCert(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={handleReissueCertificate}
                className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs shadow"
              >
                Reissue Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
