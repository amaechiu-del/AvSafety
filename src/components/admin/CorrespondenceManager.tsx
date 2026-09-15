/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, Building2, Award, Plus, CheckCircle2, AlertCircle, 
  Printer, Edit, ArrowRight, ShieldCheck, Clock, User, X, Check, Eye
} from 'lucide-react';
import { 
  LetterheadProfile, 
  CorrespondenceTemplate, 
  CorrespondenceDocument, 
  CorrespondenceSignatory,
  CorrespondenceType,
  CorrespondenceStatus
} from '../../types';

interface CorrespondenceManagerProps {
  userEmail?: string;
  userRole?: string;
}

export default function CorrespondenceManager({ userEmail = 'admin@domislink.com', userRole = 'SECRETARIAT_ADMIN' }: CorrespondenceManagerProps) {
  const [subTab, setSubTab] = useState<'DOCUMENTS' | 'PROFILES' | 'TEMPLATES' | 'SIGNATORIES' | 'COMPOSER'>('DOCUMENTS');
  
  const [profiles, setProfiles] = useState<LetterheadProfile[]>([]);
  const [templates, setTemplates] = useState<CorrespondenceTemplate[]>([]);
  const [documents, setDocuments] = useState<CorrespondenceDocument[]>([]);
  const [signatories, setSignatories] = useState<CorrespondenceSignatory[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Preview / Print Modal state
  const [previewDoc, setPreviewDoc] = useState<CorrespondenceDocument | null>(null);
  const [previewProfile, setPreviewProfile] = useState<LetterheadProfile | null>(null);
  const [previewSignatory, setPreviewSignatory] = useState<CorrespondenceSignatory | null>(null);

  // Composer Form State
  const [composerForm, setComposerForm] = useState({
    profileId: '',
    correspondenceType: 'Official Invitation Letter' as CorrespondenceType,
    templateId: '',
    reference: '',
    date: new Date().toISOString().slice(0, 10),
    recipientName: '',
    recipientOrganisation: '',
    recipientAddress: '',
    attention: '',
    subject: '',
    salutation: 'Dear Sir/Madam,',
    body: '',
    closing: 'Yours faithfully,',
    signatoryId: '',
    attachments: '',
    cc: ''
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    purpose: '',
    legalOrganisationName: '',
    displayName: '',
    rcNumber: '',
    rcNumberX: 29.4,
    rcNumberY: 28.1,
    tagline: '',
    address: '',
    telephone: '',
    mobile: '',
    email: '',
    website: '',
    headerText: '',
    footerText: '',
    referencePrefix: 'DIS/CORR/2026',
    pageSize: 'A4' as 'A4' | 'Letter',
    orientation: 'portrait' as 'portrait' | 'landscape',
    margins: '20mm'
  });
  const [selectedProfile, setSelectedProfile] = useState<LetterheadProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Signatory Form State
  const [signatoryForm, setSignatoryForm] = useState({
    name: '',
    title: '',
    organisation: '',
    isDefault: false
  });
  const [isSignatoryModalOpen, setIsSignatoryModalOpen] = useState(false);

  // Template Form State
  const [templateForm, setTemplateForm] = useState({
    title: '',
    correspondenceType: 'Official Invitation Letter' as CorrespondenceType,
    subjectTemplate: '',
    bodyTemplate: '',
    salutationTemplate: 'Dear {{recipientName}},',
    closingTemplate: 'Yours faithfully,'
  });
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profRes, tmplRes, docRes, sigRes] = await Promise.all([
        fetch('/api/secretariat/correspondence/profiles'),
        fetch('/api/secretariat/correspondence/templates'),
        fetch('/api/secretariat/correspondence/documents'),
        fetch('/api/secretariat/correspondence/signatories')
      ]);

      if (profRes.ok) {
        const d = await profRes.json();
        setProfiles(d.profiles || []);
        if (d.profiles && d.profiles.length > 0 && !composerForm.profileId) {
          setComposerForm(prev => ({ ...prev, profileId: d.profiles[0].id }));
        }
      }
      if (tmplRes.ok) {
        const d = await tmplRes.json();
        setTemplates(d.templates || []);
      }
      if (docRes.ok) {
        const d = await docRes.json();
        setDocuments(d.documents || []);
      }
      if (sigRes.ok) {
        const d = await sigRes.json();
        setSignatories(d.signatories || []);
        const defSig = d.signatories?.find((s: any) => s.isDefault);
        if (defSig && !composerForm.signatoryId) {
          setComposerForm(prev => ({ ...prev, signatoryId: defSig.id }));
        } else if (d.signatories?.[0] && !composerForm.signatoryId) {
          setComposerForm(prev => ({ ...prev, signatoryId: d.signatories[0].id }));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load correspondence system data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Template Selection in Composer
  const handleTemplateSelect = (tmplId: string) => {
    setComposerForm(prev => ({ ...prev, templateId: tmplId }));
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) {
      setComposerForm(prev => ({
        ...prev,
        templateId: tmplId,
        correspondenceType: tmpl.correspondenceType,
        subject: tmpl.subjectTemplate,
        body: tmpl.bodyTemplate,
        salutation: tmpl.salutationTemplate,
        closing: tmpl.closingTemplate
      }));
    }
  };

  // Submit Composer Document
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch('/api/secretariat/correspondence/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...composerForm, userEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create correspondence document.');

      setSuccessMessage(data.message || 'Correspondence document created successfully.');
      await fetchData();
      setSubTab('DOCUMENTS');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update Status
  const handleUpdateStatus = async (id: string, status: CorrespondenceStatus, comment?: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/secretariat/correspondence/documents/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, userEmail, approvalComment: comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update document status.');

      setSuccessMessage(data.message);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Create Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const url = selectedProfile ? `/api/secretariat/correspondence/profiles/${selectedProfile.id}` : '/api/secretariat/correspondence/profiles';
      const method = selectedProfile ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save letterhead profile.');

      setSuccessMessage(data.message);
      setIsProfileModalOpen(false);
      setSelectedProfile(null);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Create Signatory
  const handleSaveSignatory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch('/api/secretariat/correspondence/signatories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signatoryForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add signatory.');

      setSuccessMessage(data.message);
      setIsSignatoryModalOpen(false);
      setSignatoryForm({ name: '', title: '', organisation: '', isDefault: false });
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Create Template
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch('/api/secretariat/correspondence/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create template.');

      setSuccessMessage(data.message);
      setIsTemplateModalOpen(false);
      setTemplateForm({ title: '', correspondenceType: 'Official Invitation Letter', subjectTemplate: '', bodyTemplate: '', salutationTemplate: 'Dear {{recipientName}},', closingTemplate: 'Yours faithfully,' });
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openPreview = (doc: CorrespondenceDocument) => {
    const prof = profiles.find(p => p.id === doc.profileId) || profiles[0];
    const sig = signatories.find(s => s.id === doc.signatoryId) || signatories[0];
    setPreviewDoc(doc);
    setPreviewProfile(prof || null);
    setPreviewSignatory(sig || null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-900 text-amber-400 rounded-xl shadow">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Official Correspondence & Letterhead System</h1>
                <p className="text-sm text-slate-600">Secure Secretariat document composition, A4 letterhead profiles, and RBAC workflow approvals</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubTab('COMPOSER')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium text-sm transition shadow"
            >
              <Plus className="w-4 h-4" />
              Compose Correspondence
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 border-b border-slate-200 pb-3">
          {[
            { id: 'DOCUMENTS', label: 'Correspondence Documents', count: documents.length },
            { id: 'PROFILES', label: 'Letterhead Profiles', count: profiles.length },
            { id: 'TEMPLATES', label: 'Templates', count: templates.length },
            { id: 'SIGNATORIES', label: 'Signatories', count: signatories.length },
            { id: 'COMPOSER', label: 'New Composer' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                subTab === tab.id
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${subTab === tab.id ? 'bg-amber-400 text-blue-950' : 'bg-slate-200 text-slate-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: DOCUMENTS */}
      {subTab === 'DOCUMENTS' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Correspondence Documents Registry</h3>
            <span className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-semibold">
              Total Documents: {documents.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Doc No / Ref</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status / Version</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No correspondence documents found. Click "Compose Correspondence" to create one.
                    </td>
                  </tr>
                ) : (
                  documents.map(doc => {
                    const prof = profiles.find(p => p.id === doc.profileId);
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="font-bold text-blue-950">{doc.documentNumber}</div>
                          <div className="text-xs text-slate-500">{doc.reference}</div>
                          <div className="text-xs text-amber-700 font-medium">{prof?.displayName || 'Standard Profile'}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium">
                            {doc.correspondenceType}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{doc.recipientName}</div>
                          <div className="text-xs text-slate-500">{doc.recipientOrganisation}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-800 max-w-xs truncate" title={doc.subject}>
                          {doc.subject}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${
                              doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                              doc.status === 'REVIEW' ? 'bg-amber-100 text-amber-800' :
                              doc.status === 'PRINT_READY' ? 'bg-blue-100 text-blue-800' :
                              doc.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {doc.status}
                            </span>
                            <span className="text-xs text-slate-500">v{doc.currentVersion} • {doc.date}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openPreview(doc)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                              title="Preview & Print A4"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {doc.status === 'DRAFT' && (
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'REVIEW')}
                                className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700"
                              >
                                Submit Review
                              </button>
                            )}
                            {doc.status === 'REVIEW' && (
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'APPROVED', 'Approved by Senior Official')}
                                className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800"
                                title="Enforces zero self-approval"
                              >
                                Approve
                              </button>
                            )}
                            {doc.status === 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'PRINT_READY')}
                                className="px-2.5 py-1 bg-blue-900 text-white rounded-lg text-xs font-medium hover:bg-blue-800"
                              >
                                Mark Ready
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILES */}
      {subTab === 'PROFILES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Reusable Letterhead Profiles</h3>
            <button
              onClick={() => {
                setSelectedProfile(null);
                setProfileForm({
                  name: '', purpose: '', legalOrganisationName: '', displayName: '', rcNumber: '',
                  rcNumberX: 29.4, rcNumberY: 28.1, tagline: '', address: '', telephone: '',
                  mobile: '', email: '', website: '', headerText: '', footerText: '',
                  referencePrefix: 'DIS/CORR/2026', pageSize: 'A4', orientation: 'portrait', margins: '20mm'
                });
                setIsProfileModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
            >
              <Plus className="w-4 h-4" /> Add Letterhead Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.map(prof => (
              <div key={prof.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{prof.purpose}</span>
                    <h4 className="text-lg font-bold text-slate-900">{prof.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">RC Number: {prof.rcNumber} (Pos: X={prof.rcNumberX}%, Y={prof.rcNumberY}%)</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Active</span>
                </div>
                <div className="text-sm text-slate-700 space-y-1 border-t border-slate-100 pt-3">
                  <p><strong className="text-slate-900">Legal Entity:</strong> {prof.legalOrganisationName}</p>
                  <p><strong className="text-slate-900">Tagline:</strong> {prof.tagline}</p>
                  <p><strong className="text-slate-900">Address:</strong> {prof.address}</p>
                  <p><strong className="text-slate-900">Contacts:</strong> {prof.telephone} | {prof.email}</p>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedProfile(prof);
                      setProfileForm({
                        name: prof.name,
                        purpose: prof.purpose,
                        legalOrganisationName: prof.legalOrganisationName,
                        displayName: prof.displayName,
                        rcNumber: prof.rcNumber,
                        rcNumberX: prof.rcNumberX,
                        rcNumberY: prof.rcNumberY,
                        tagline: prof.tagline,
                        address: prof.address,
                        telephone: prof.telephone,
                        mobile: prof.mobile,
                        email: prof.email,
                        website: prof.website,
                        headerText: prof.headerText,
                        footerText: prof.footerText,
                        referencePrefix: prof.referencePrefix,
                        pageSize: prof.pageSize,
                        orientation: prof.orientation,
                        margins: prof.margins
                      });
                      setIsProfileModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEMPLATES */}
      {subTab === 'TEMPLATES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Correspondence Templates</h3>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
            >
              <Plus className="w-4 h-4" /> Add Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(tmpl => (
              <div key={tmpl.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">{tmpl.correspondenceType}</span>
                    <h4 className="text-md font-bold text-slate-900 mt-1">{tmpl.title}</h4>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100 line-clamp-3">
                  {tmpl.bodyTemplate}
                </div>
                <div className="text-xs text-slate-400">Created: {new Date(tmpl.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SIGNATORIES */}
      {subTab === 'SIGNATORIES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Authorized Signatories</h3>
            <button
              onClick={() => setIsSignatoryModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
            >
              <Plus className="w-4 h-4" /> Add Signatory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signatories.map(sig => (
              <div key={sig.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
                    <User className="w-5 h-5" />
                  </div>
                  {sig.isDefault && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full text-xs font-bold">Default</span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{sig.name}</h4>
                <p className="text-xs font-medium text-amber-700">{sig.title}</p>
                <p className="text-xs text-slate-500">{sig.organisation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COMPOSER */}
      {subTab === 'COMPOSER' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">Correspondence Composer</h3>
          <form onSubmit={handleCreateDocument} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Letterhead Profile</label>
                <select
                  value={composerForm.profileId}
                  onChange={e => setComposerForm({ ...composerForm, profileId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  required
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.purpose})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Correspondence Type</label>
                <select
                  value={composerForm.correspondenceType}
                  onChange={e => setComposerForm({ ...composerForm, correspondenceType: e.target.value as CorrespondenceType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  required
                >
                  {[
                    'General Corporate Correspondence',
                    'Aviation Safety Summit Correspondence',
                    'Official Invitation Letter',
                    'Appointment Letter',
                    'Committee Letter',
                    'Government / Regulatory Letter',
                    'Vendor / Partner Letter',
                    'Official Notice',
                    'General Secretariat Letter'
                  ].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Use Template (Optional)</label>
                <select
                  value={composerForm.templateId}
                  onChange={e => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="">-- Select Template --</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Reference Number</label>
                <input
                  type="text"
                  value={composerForm.reference}
                  onChange={e => setComposerForm({ ...composerForm, reference: e.target.value })}
                  placeholder="e.g. DIS/CORR/2026/001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Date</label>
                <input
                  type="date"
                  value={composerForm.date}
                  onChange={e => setComposerForm({ ...composerForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Authorized Signatory</label>
                <select
                  value={composerForm.signatoryId}
                  onChange={e => setComposerForm({ ...composerForm, signatoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  required
                >
                  {signatories.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={composerForm.recipientName}
                  onChange={e => setComposerForm({ ...composerForm, recipientName: e.target.value })}
                  placeholder="e.g. Dr. Haddi Ahmed"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Recipient Organisation</label>
                <input
                  type="text"
                  value={composerForm.recipientOrganisation}
                  onChange={e => setComposerForm({ ...composerForm, recipientOrganisation: e.target.value })}
                  placeholder="e.g. Nigerian Civil Aviation Authority"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Attention (Optional)</label>
                <input
                  type="text"
                  value={composerForm.attention}
                  onChange={e => setComposerForm({ ...composerForm, attention: e.target.value })}
                  placeholder="e.g. Directorate of Air Safety"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Recipient Address</label>
              <textarea
                value={composerForm.recipientAddress}
                onChange={e => setComposerForm({ ...composerForm, recipientAddress: e.target.value })}
                placeholder="Full postal or physical address"
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Subject</label>
              <input
                type="text"
                value={composerForm.subject}
                onChange={e => setComposerForm({ ...composerForm, subject: e.target.value })}
                placeholder="Document subject line"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Salutation</label>
                <input
                  type="text"
                  value={composerForm.salutation}
                  onChange={e => setComposerForm({ ...composerForm, salutation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Closing</label>
                <input
                  type="text"
                  value={composerForm.closing}
                  onChange={e => setComposerForm({ ...composerForm, closing: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Document Body (Markdown / Text supported)</label>
              <textarea
                value={composerForm.body}
                onChange={e => setComposerForm({ ...composerForm, body: e.target.value })}
                placeholder="Type or paste correspondence body content..."
                rows={8}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSubTab('DOCUMENTS')}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 shadow"
              >
                Save & Draft Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* A4 PRINT & PREVIEW MODAL */}
      {previewDoc && previewProfile && previewSignatory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">A4 Print Preview — {previewDoc.documentNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-blue-950 font-bold rounded-lg text-xs hover:bg-amber-400 shadow"
                >
                  <Printer className="w-4 h-4" /> Print A4 Document
                </button>
                <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-slate-100 flex justify-center">
              {/* A4 Sheet Container */}
              <div className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-xl text-slate-900 relative flex flex-col justify-between font-serif">
                {/* Header with RC number positioned at configurable coordinates X/Y */}
                <div>
                  <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6 relative">
                    <div>
                      <div className="text-xs font-bold tracking-widest text-amber-700 uppercase mb-1">{previewProfile.headerText}</div>
                      <h2 className="text-2xl font-black text-blue-950 tracking-wide">{previewProfile.legalOrganisationName}</h2>
                      <p className="text-xs text-slate-600 mt-1">{previewProfile.tagline}</p>
                    </div>
                    {/* Configurable RC Number Positioned via inline style */}
                    <div 
                      className="absolute px-3 py-1 bg-slate-900 text-amber-400 rounded text-xs font-mono font-bold shadow"
                      style={{ top: `${previewProfile.rcNumberY}%`, left: `${previewProfile.rcNumberX}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {previewProfile.rcNumber}
                    </div>
                    <div className="text-right text-xs text-slate-600 space-y-0.5">
                      <p>{previewProfile.address}</p>
                      <p>{previewProfile.telephone} | {previewProfile.email}</p>
                      <p>{previewProfile.website}</p>
                    </div>
                  </div>

                  {/* Ref & Date */}
                  <div className="flex justify-between text-sm mb-6 font-sans">
                    <div>
                      <span className="text-slate-500 font-semibold">OUR REF:</span> <span className="font-bold text-slate-900">{previewDoc.reference}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">DATE:</span> <span className="font-bold text-slate-900">{previewDoc.date}</span>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="text-sm mb-6 space-y-0.5 font-sans">
                    <p className="font-bold text-slate-900">{previewDoc.recipientName}</p>
                    <p className="text-slate-700 font-medium">{previewDoc.recipientOrganisation}</p>
                    {previewDoc.attention && <p className="text-slate-600 text-xs">ATTN: {previewDoc.attention}</p>}
                    <p className="text-slate-600 whitespace-pre-line">{previewDoc.recipientAddress}</p>
                  </div>

                  {/* Subject */}
                  <div className="mb-6 font-sans">
                    <p className="font-bold text-blue-950 underline text-sm uppercase tracking-wider">
                      {previewDoc.subject}
                    </p>
                  </div>

                  {/* Salutation & Body */}
                  <div className="text-sm space-y-4 leading-relaxed text-slate-800 font-serif">
                    <p className="font-semibold">{previewDoc.salutation}</p>
                    <div className="whitespace-pre-line">{previewDoc.body}</div>
                    <p className="pt-2">{previewDoc.closing}</p>
                  </div>
                </div>

                {/* Signatory & Footer */}
                <div className="mt-12 pt-6 border-t border-slate-200">
                  <div className="mb-8">
                    <div className="h-12"></div> {/* Space for physical signature */}
                    <p className="font-bold text-slate-900 text-sm font-sans">{previewSignatory.name}</p>
                    <p className="text-xs text-amber-800 font-medium font-sans">{previewSignatory.title}</p>
                    <p className="text-xs text-slate-500 font-sans">{previewSignatory.organisation}</p>
                  </div>

                  <div className="text-center text-[10px] text-slate-500 border-t border-slate-200 pt-3 font-sans">
                    <p>{previewProfile.footerText}</p>
                    <p className="mt-0.5">Document ID: {previewDoc.documentNumber} • Version v{previewDoc.currentVersion} • Status: {previewDoc.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LETTERHEAD PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">
                {selectedProfile ? 'Edit Letterhead Profile' : 'Create Letterhead Profile'}
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Profile Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose</label>
                  <input
                    type="text"
                    value={profileForm.purpose}
                    onChange={e => setProfileForm({ ...profileForm, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Legal Organisation Name</label>
                  <input
                    type="text"
                    value={profileForm.legalOrganisationName}
                    onChange={e => setProfileForm({ ...profileForm, legalOrganisationName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">RC Number</label>
                  <input
                    type="text"
                    value={profileForm.rcNumber}
                    onChange={e => setProfileForm({ ...profileForm, rcNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RC Number Position X (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.rcNumberX}
                    onChange={e => setProfileForm({ ...profileForm, rcNumberX: parseFloat(e.target.value) || 29.4 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RC Number Position Y (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.rcNumberY}
                    onChange={e => setProfileForm({ ...profileForm, rcNumberY: parseFloat(e.target.value) || 28.1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={profileForm.telephone}
                    onChange={e => setProfileForm({ ...profileForm, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIGNATORY MODAL */}
      {isSignatoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Add Authorized Signatory</h3>
              <button onClick={() => setIsSignatoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSignatory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  value={signatoryForm.name}
                  onChange={e => setSignatoryForm({ ...signatoryForm, name: e.target.value })}
                  placeholder="e.g. Dr. Aliyu Mohammed, CON"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Official Designation</label>
                <input
                  type="text"
                  value={signatoryForm.title}
                  onChange={e => setSignatoryForm({ ...signatoryForm, title: e.target.value })}
                  placeholder="e.g. Secretary-General"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Organisation</label>
                <input
                  type="text"
                  value={signatoryForm.organisation}
                  onChange={e => setSignatoryForm({ ...signatoryForm, organisation: e.target.value })}
                  placeholder="e.g. Domislink International Services Ltd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefaultSig"
                  checked={signatoryForm.isDefault}
                  onChange={e => setSignatoryForm({ ...signatoryForm, isDefault: e.target.checked })}
                  className="rounded border-slate-300 text-blue-900"
                />
                <label htmlFor="isDefaultSig" className="text-sm text-slate-700">Set as default signatory</label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSignatoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
                >
                  Save Signatory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATE MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Create Correspondence Template</h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Template Title</label>
                <input
                  type="text"
                  value={templateForm.title}
                  onChange={e => setTemplateForm({ ...templateForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Correspondence Type</label>
                <select
                  value={templateForm.correspondenceType}
                  onChange={e => setTemplateForm({ ...templateForm, correspondenceType: e.target.value as CorrespondenceType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  required
                >
                  {[
                    'General Corporate Correspondence',
                    'Aviation Safety Summit Correspondence',
                    'Official Invitation Letter',
                    'Appointment Letter',
                    'Committee Letter',
                    'Government / Regulatory Letter',
                    'Vendor / Partner Letter',
                    'Official Notice',
                    'General Secretariat Letter'
                  ].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Subject Template</label>
                <input
                  type="text"
                  value={templateForm.subjectTemplate}
                  onChange={e => setTemplateForm({ ...templateForm, subjectTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Body Template</label>
                <textarea
                  value={templateForm.bodyTemplate}
                  onChange={e => setTemplateForm({ ...templateForm, bodyTemplate: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
