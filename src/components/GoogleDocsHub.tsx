/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, ExternalLink, Plus, RefreshCw, Trash2, Edit3, 
  Search, CheckCircle, AlertCircle, Eye, LogOut, ShieldCheck, 
  Crown, Sparkles, Clock, FolderOpen, ArrowRight, X, AlertTriangle, Layers
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../services/googleAuth';
import { 
  listGoogleDocs, 
  getGoogleDoc, 
  createGoogleDoc, 
  appendTextToGoogleDoc, 
  deleteGoogleDoc, 
  extractDocPlainText,
  SUMMIT_DOC_TEMPLATES, 
  GoogleDocSummary, 
  GoogleDocDetail 
} from '../services/googleDocsService';
import { User } from 'firebase/auth';

export default function GoogleDocsHub() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [docs, setDocs] = useState<GoogleDocSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Document Viewer State
  const [selectedDoc, setSelectedDoc] = useState<GoogleDocDetail | null>(null);
  const [isLoadingDocDetail, setIsLoadingDocDetail] = useState(false);

  // Document Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Append Content Modal State
  const [isAppendModalOpen, setIsAppendModalOpen] = useState(false);
  const [targetAppendDoc, setTargetAppendDoc] = useState<GoogleDocSummary | null>(null);
  const [appendText, setAppendText] = useState('');
  const [isAppending, setIsAppending] = useState(false);

  // Mandatory Confirmation Modal for Destructive / Mutating operations
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    isDestructive: boolean;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadUserDocs(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setDocs([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(prev => prev?.text === text ? null : prev);
    }, 6000);
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        showNotification('success', `Signed in as ${res.user.displayName || res.user.email}`);
        await loadUserDocs(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      showNotification('error', err?.message || 'Sign in failed. Please ensure popups are allowed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setDocs([]);
      setSelectedDoc(null);
      showNotification('info', 'Signed out from Google Workspace.');
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  const loadUserDocs = async (accessToken?: string) => {
    const activeToken = accessToken || token;
    if (!activeToken) return;

    setIsLoadingDocs(true);
    try {
      const items = await listGoogleDocs(activeToken);
      setDocs(items);
    } catch (err: any) {
      console.error('Failed to load Google Docs:', err);
      showNotification('error', `Could not load Google Docs: ${err.message}`);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleOpenDocViewer = async (docSummary: GoogleDocSummary) => {
    if (!token) return;
    setIsLoadingDocDetail(true);
    setSelectedDoc(null);
    try {
      const detail = await getGoogleDoc(token, docSummary.id);
      setSelectedDoc(detail);
    } catch (err: any) {
      console.error('Failed to get doc content:', err);
      showNotification('error', `Failed to open document: ${err.message}`);
    } finally {
      setIsLoadingDocDetail(false);
    }
  };

  const handleCreateDocument = async (title: string, bodyText?: string) => {
    if (!token) {
      showNotification('error', 'Please sign in with your Google account first.');
      return;
    }
    if (!title.trim()) {
      showNotification('error', 'Please enter a document title.');
      return;
    }

    setIsCreating(true);
    try {
      const created = await createGoogleDoc(token, title.trim(), bodyText);
      showNotification('success', `Document "${created.title}" successfully created in your Google Drive!`);
      setIsCreateModalOpen(false);
      setNewDocTitle('');
      setNewDocContent('');
      await loadUserDocs();
    } catch (err: any) {
      console.error('Failed to create doc:', err);
      showNotification('error', `Document creation failed: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFromTemplate = (template: typeof SUMMIT_DOC_TEMPLATES[0]) => {
    setNewDocTitle(template.defaultTitle);
    setNewDocContent(template.content);
    setIsCreateModalOpen(true);
  };

  // Required confirmation for appending content to user document
  const triggerAppendContent = (docSummary: GoogleDocSummary) => {
    setTargetAppendDoc(docSummary);
    setAppendText(
      `\n--- AVIATION SAFETY SUMMIT 2026 RESOLUTION ADDENDUM ---\n` +
      `Date Added: ${new Date().toLocaleString()}\n` +
      `Resolution: "Everybody is involved in aviation safety. Commitment to proactive risk reporting and zero preventable incidents."\n`
    );
    setIsAppendModalOpen(true);
  };

  const executeAppendContent = async () => {
    if (!token || !targetAppendDoc || !appendText.trim()) return;

    // Trigger explicit confirmation dialog before mutating user document
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Document Update',
      description: `You are about to append text into Google Doc "${targetAppendDoc.name}". This will modify the document on your Google Drive.`,
      actionLabel: 'Confirm & Append Text',
      isDestructive: false,
      onConfirm: async () => {
        setIsAppending(true);
        try {
          await appendTextToGoogleDoc(token, targetAppendDoc.id, appendText.trim());
          showNotification('success', `Successfully updated "${targetAppendDoc.name}" with summit content!`);
          setIsAppendModalOpen(false);
          setTargetAppendDoc(null);
          // Refresh open doc if it's the current one
          if (selectedDoc?.documentId === targetAppendDoc.id) {
            handleOpenDocViewer(targetAppendDoc);
          }
        } catch (err: any) {
          console.error('Append content error:', err);
          showNotification('error', `Failed to update document: ${err.message}`);
        } finally {
          setIsAppending(false);
        }
      }
    });
  };

  // Required confirmation for deleting document
  const triggerDeleteDoc = (docSummary: GoogleDocSummary) => {
    if (!token) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Google Document?',
      description: `Are you sure you want to permanently delete "${docSummary.name}" from your Google Drive? This action cannot be undone.`,
      actionLabel: 'Permanently Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteGoogleDoc(token, docSummary.id);
          showNotification('success', `"${docSummary.name}" was removed from Google Drive.`);
          if (selectedDoc?.documentId === docSummary.id) {
            setSelectedDoc(null);
          }
          await loadUserDocs();
        } catch (err: any) {
          console.error('Delete document error:', err);
          showNotification('error', `Failed to delete document: ${err.message}`);
        }
      }
    });
  };

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="google-docs" className="py-20 bg-gradient-to-b from-[#0A192F] via-[#0E203C] to-[#0A192F] text-white border-y border-[#D4AF37]/25 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
            <FileText className="h-3.5 w-3.5" />
            <span>Official Google Docs Integration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight uppercase">
            Summit Working Papers & Google Docs
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            Create, view, and collaborate on official Summit Communiqués, Safety Memos, Resolutions, and Delegate Working Papers directly inside your connected Google Docs workspace.
          </p>
        </div>

        {/* Status / Toast Notification */}
        {statusMessage && (
          <div className={`mb-8 p-4 rounded-xl flex items-center justify-between border max-w-2xl mx-auto transition-all animate-in fade-in slide-in-from-top-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200' :
            statusMessage.type === 'error' ? 'bg-rose-950/70 border-rose-500/40 text-rose-200' :
            'bg-sky-950/70 border-sky-500/40 text-sky-200'
          }`}>
            <div className="flex items-center space-x-3">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" /> :
               statusMessage.type === 'error' ? <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" /> :
               <Sparkles className="h-5 w-5 text-sky-400 shrink-0" />}
              <span className="text-xs sm:text-sm font-medium">{statusMessage.text}</span>
            </div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="text-white/60 hover:text-white p-1 ml-3"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Authenticated Workspace or Sign-In Card */}
        {!user || !token ? (
          /* Sign-In Presentation Card */
          <div className="max-w-2xl mx-auto bg-[#071324] border border-[#D4AF37]/30 rounded-2xl p-8 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
              <FileText className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">Connect Your Google Account</h3>
              <p className="text-xs sm:text-sm text-[#8A99AD] max-w-md mx-auto">
                Sign in with Google to read and create official Aviation Safety Summit papers, draft communiqués, and export hazard reports directly to your Google Docs.
              </p>
            </div>

            {/* Official Material Design Style Sign in with Google Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center space-x-3 bg-white text-[#1f1f1f] hover:bg-neutral-100 px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {/* Official Google 'G' Icon */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.87c2.26-2.09 3.675-5.17 3.675-9.12z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.12C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.61H1.26C.46 8.22 0 10.06 0 12s.46 3.78 1.26 5.39l4.01-3.12z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.61l4.01 3.12c.95-2.85 3.6-4.98 6.73-4.98z"/>
                </svg>
                <span className="font-sans font-semibold tracking-wide">
                  {isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}
                </span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-center space-x-2 text-[11px] text-[#8A99AD] font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Permission granted directly with your secure Google credentials</span>
            </div>
          </div>
        ) : (
          /* Connected User Workspace */
          <div className="space-y-10">
            
            {/* User Account Bar & Quick Actions */}
            <div className="bg-[#071324] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Google Profile'} 
                    className="w-12 h-12 rounded-full border-2 border-[#D4AF37] object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white font-sans">{user.displayName || 'Google User'}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-[#8A99AD] font-mono">{user.email}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setNewDocTitle('');
                    setNewDocContent('');
                    setIsCreateModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A192F] font-bold text-xs rounded-lg shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Google Doc</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadUserDocs()}
                  disabled={isLoadingDocs}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg border border-white/15 transition cursor-pointer disabled:opacity-50"
                  title="Refresh Docs List"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingDocs ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs rounded-lg border border-rose-500/30 transition cursor-pointer"
                  title="Disconnect Google Account"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>

            {/* Summit Document Templates (1-Click Creation) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                    <span>Summit Official Document Blueprints</span>
                  </h3>
                  <p className="text-xs text-[#8A99AD]">
                    One-click generate structured official drafts directly into your Google Docs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SUMMIT_DOC_TEMPLATES.map((tmpl) => (
                  <div 
                    key={tmpl.id}
                    className="bg-[#071324] border border-[#D4AF37]/25 hover:border-[#D4AF37] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group hover:-translate-y-1 shadow-lg"
                  >
                    <div className="space-y-2.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-semibold">
                        {tmpl.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {tmpl.name}
                      </h4>
                      <p className="text-xs text-[#8A99AD] font-light line-clamp-3">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => handleCreateFromTemplate(tmpl)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0A192F] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create in Google Docs</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Google Docs Explorer */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4 text-[#D4AF37]" />
                    <span>My Google Docs</span>
                    <span className="text-xs font-mono text-[#8A99AD] font-normal">({filteredDocs.length} files)</span>
                  </h3>
                  <p className="text-xs text-[#8A99AD]">
                    Documents retrieved securely from your Google Drive account.
                  </p>
                </div>

                {/* Search box */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A99AD]" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#071324] border border-white/15 focus:border-[#D4AF37] rounded-lg text-xs text-white placeholder-[#8A99AD] focus:outline-none"
                  />
                </div>
              </div>

              {/* Documents Grid / Table */}
              {isLoadingDocs ? (
                <div className="py-16 text-center bg-[#071324] rounded-2xl border border-white/10">
                  <RefreshCw className="h-6 w-6 text-[#D4AF37] animate-spin mx-auto mb-3" />
                  <p className="text-xs text-[#8A99AD] font-mono">Fetching Google Docs from Drive...</p>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="py-16 text-center bg-[#071324] rounded-2xl border border-white/10 p-6 space-y-3">
                  <FileText className="h-10 w-10 text-[#8A99AD]/40 mx-auto" />
                  <p className="text-sm font-semibold text-white">No Google Docs Found</p>
                  <p className="text-xs text-[#8A99AD] max-w-sm mx-auto">
                    {searchQuery ? `No files match "${searchQuery}".` : 'You do not have any Google Docs in your Drive yet, or none were found.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDocTitle('Aviation Safety Summit 2026 - My Working Notes');
                      setNewDocContent(SUMMIT_DOC_TEMPLATES[3].content);
                      setIsCreateModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF37] text-[#0A192F] rounded-lg text-xs font-bold hover:brightness-110 cursor-pointer mt-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create First Summit Google Doc</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="bg-[#071324] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 rounded-xl p-4 flex flex-col justify-between space-y-4 transition shadow-md hover:shadow-xl"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <h4 className="font-semibold text-sm text-white line-clamp-2 leading-tight" title={doc.name}>
                              {doc.name}
                            </h4>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#8A99AD] space-y-1 font-mono pt-1">
                          {doc.modifiedTime && (
                            <div className="flex items-center space-x-1.5">
                              <Clock className="h-3 w-3 text-[#D4AF37]" />
                              <span>Updated {new Date(doc.modifiedTime).toLocaleDateString()}</span>
                            </div>
                          )}
                          {doc.owners && doc.owners[0]?.displayName && (
                            <div className="text-[10px] text-[#8A99AD] truncate">
                              Owner: {doc.owners[0].displayName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-1.5">
                          {/* Preview in app */}
                          <button
                            type="button"
                            onClick={() => handleOpenDocViewer(doc)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                            title="Inspect document preview"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Append summit resolutions */}
                          <button
                            type="button"
                            onClick={() => triggerAppendContent(doc)}
                            className="p-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] transition cursor-pointer"
                            title="Append Summit Safety Addendum"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Doc */}
                          <button
                            type="button"
                            onClick={() => triggerDeleteDoc(doc)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                            title="Delete document"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Open in Google Docs */}
                        <a
                          href={doc.webViewLink || `https://docs.google.com/document/d/${doc.id}/edit`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold transition"
                        >
                          <span>Open in Docs</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Viewer Modal */}
            {selectedDoc && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0A192F]">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-serif">{selectedDoc.title}</h3>
                        <p className="text-[10px] text-[#8A99AD] font-mono">Document ID: {selectedDoc.documentId}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://docs.google.com/document/d/${selectedDoc.documentId}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 transition"
                      >
                        <span>Open in Google Docs</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(null)}
                        className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Document Body Preview */}
                  <div className="p-6 overflow-y-auto font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed space-y-4 bg-[#0A192F]/50 flex-1">
                    <div className="p-4 bg-black/30 rounded-xl border border-white/5 font-mono text-xs whitespace-pre-wrap">
                      {extractDocPlainText(selectedDoc) || '(This document has no readable plain text content yet.)'}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-[#8A99AD] bg-[#071324]">
                    <span>Revision ID: {selectedDoc.revisionId || 'Current'}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(null)}
                      className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Create Document Modal */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
                  
                  <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0A192F]">
                    <div className="flex items-center space-x-2.5">
                      <Plus className="h-5 w-5 text-[#D4AF37]" />
                      <h3 className="text-base font-bold text-white font-serif">Create New Google Doc</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="text-white/60 hover:text-white p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#8A99AD] mb-1.5">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="e.g. Aviation Safety Summit 2026 - Working Paper"
                        className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm text-white focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#8A99AD] mb-1.5">
                        Initial Content (Optional)
                      </label>
                      <textarea
                        rows={8}
                        value={newDocContent}
                        onChange={(e) => setNewDocContent(e.target.value)}
                        placeholder="Type or paste the initial document content..."
                        className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/10 flex items-center justify-end space-x-3 bg-[#071324]">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isCreating || !newDocTitle.trim()}
                      onClick={() => handleCreateDocument(newDocTitle, newDocContent)}
                      className="inline-flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isCreating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                      <span>{isCreating ? 'Creating in Docs...' : 'Create Google Doc'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Append Content Modal */}
            {isAppendModalOpen && targetAppendDoc && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
                  
                  <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0A192F]">
                    <div className="flex items-center space-x-2.5">
                      <Edit3 className="h-5 w-5 text-[#D4AF37]" />
                      <h3 className="text-base font-bold text-white font-serif">Append to Document</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAppendModalOpen(false)}
                      className="text-white/60 hover:text-white p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-[#8A99AD]">
                      Add text to the end of <strong className="text-white">"{targetAppendDoc.name}"</strong>.
                    </p>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#8A99AD] mb-1.5">
                        Content to Append
                      </label>
                      <textarea
                        rows={6}
                        value={appendText}
                        onChange={(e) => setAppendText(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/10 flex items-center justify-end space-x-3 bg-[#071324]">
                    <button
                      type="button"
                      onClick={() => setIsAppendModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isAppending || !appendText.trim()}
                      onClick={executeAppendContent}
                      className="inline-flex items-center space-x-1.5 px-5 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isAppending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Edit3 className="h-3.5 w-3.5" />}
                      <span>{isAppending ? 'Updating...' : 'Proceed to Update'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MANDATORY Explicit User Confirmation Modal for Destructive / Mutating operations */}
            {confirmDialog?.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#0A192F] border border-[#D4AF37]/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${
                      confirmDialog.isDestructive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-serif">{confirmDialog.title}</h4>
                      <p className="text-[11px] text-[#8A99AD] font-mono">Explicit Confirmation Required</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#8A99AD] leading-relaxed">
                    {confirmDialog.description}
                  </p>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDialog(null)}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const action = confirmDialog.onConfirm;
                        setConfirmDialog(null);
                        await action();
                      }}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow-md cursor-pointer ${
                        confirmDialog.isDestructive 
                          ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                          : 'bg-[#D4AF37] hover:bg-amber-400 text-[#0A192F]'
                      }`}
                    >
                      {confirmDialog.actionLabel}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
