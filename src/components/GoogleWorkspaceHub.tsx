/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, ExternalLink, Plus, RefreshCw, Trash2, Edit3, 
  Search, CheckCircle, AlertCircle, Eye, LogOut, ShieldCheck, 
  Crown, Sparkles, Clock, FolderOpen, ArrowRight, X, AlertTriangle, 
  Mail, Calendar, Presentation, Send, Check
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
import { 
  listGmailMessages, 
  sendGmailMessage, 
  GmailMessageSummary 
} from '../services/gmailService';
import { 
  listCalendarEvents, 
  createCalendarEvent, 
  CalendarEventSummary 
} from '../services/calendarService';
import { 
  createGoogleSlidePresentation, 
  GoogleSlidePresentationSummary 
} from '../services/slidesService';
import { User } from 'firebase/auth';

export default function GoogleWorkspaceHub() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'docs' | 'gmail' | 'calendar' | 'slides'>('docs');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Docs state
  const [docs, setDocs] = useState<GoogleDocSummary[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [docSearch, setDocSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<GoogleDocDetail | null>(null);

  // Gmail state
  const [emails, setEmails] = useState<GmailMessageSummary[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('Aviation Safety Summit 2026 - Official Safety Brief');
  const [emailBody, setEmailBody] = useState('Dear Colleague,\n\nEverybody is involved in aviation safety. Please review the official summit documents and working resolutions.\n\nBest regards,\nSummit Secretariat');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Calendar state
  const [events, setEvents] = useState<CalendarEventSummary[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Slides state
  const [slidesCreated, setSlidesCreated] = useState<GoogleSlidePresentationSummary[]>([]);
  const [isCreatingSlides, setIsCreatingSlides] = useState(false);

  // Modals for Docs
  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  // Confirmation modal
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    isDestructive: boolean;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadAllWorkspaceData(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setDocs([]);
        setEmails([]);
        setEvents([]);
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
        await loadAllWorkspaceData(res.accessToken);
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
      setEmails([]);
      setEvents([]);
      showNotification('info', 'Signed out from Google Workspace.');
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  const loadAllWorkspaceData = async (accessToken?: string) => {
    const activeToken = accessToken || token;
    if (!activeToken) return;

    // Load Docs
    setIsLoadingDocs(true);
    try {
      const items = await listGoogleDocs(activeToken);
      setDocs(items);
    } catch (e) {
      console.error('Failed to load docs:', e);
    } finally {
      setIsLoadingDocs(false);
    }

    // Load Gmail
    setIsLoadingEmails(true);
    try {
      const mailItems = await listGmailMessages(activeToken);
      setEmails(mailItems);
    } catch (e) {
      console.error('Failed to load emails:', e);
    } finally {
      setIsLoadingEmails(false);
    }

    // Load Calendar
    setIsLoadingEvents(true);
    try {
      const calItems = await listCalendarEvents(activeToken);
      setEvents(calItems);
    } catch (e) {
      console.error('Failed to load calendar events:', e);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Gmail Send
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !emailTo.trim()) return;

    setIsSendingEmail(true);
    try {
      await sendGmailMessage(token, emailTo.trim(), emailSubject, emailBody);
      showNotification('success', `Email successfully dispatched via Gmail to ${emailTo}!`);
      setIsComposeModalOpen(false);
      setEmailTo('');
      await loadAllWorkspaceData();
    } catch (err: any) {
      console.error('Gmail send error:', err);
      showNotification('error', `Failed to send email: ${err.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Calendar Add Summit Event
  const handleAddSummitToCalendar = async () => {
    if (!token) return;
    setIsCreatingEvent(true);
    try {
      const start = '2026-11-17T09:00:00+01:00';
      const end = '2026-11-17T17:00:00+01:00';
      await createCalendarEvent(
        token,
        'Aviation Safety Summit 2026',
        'Theme: Everybody Is Involved in Aviation Safety. Venue: Marriott Hotel, Ikeja, Lagos, Nigeria. Organized by Domislink International Services Ltd.',
        'Marriott Hotel, Ikeja, Lagos, Nigeria',
        start,
        end
      );
      showNotification('success', 'Aviation Safety Summit 2026 successfully added to your Google Calendar!');
      await loadAllWorkspaceData();
    } catch (err: any) {
      console.error('Calendar add error:', err);
      showNotification('error', `Failed to add calendar event: ${err.message}`);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Google Slides create
  const handleCreateSlidesDeck = async (deckTitle: string) => {
    if (!token) return;
    setIsCreatingSlides(true);
    try {
      const presentation = await createGoogleSlidePresentation(token, deckTitle);
      setSlidesCreated(prev => [presentation, ...prev]);
      showNotification('success', `Google Slides deck "${presentation.title}" created successfully!`);
    } catch (err: any) {
      console.error('Slides create error:', err);
      showNotification('error', `Failed to create Slides presentation: ${err.message}`);
    } finally {
      setIsCreatingSlides(false);
    }
  };

  return (
    <section id="google-workspace" className="py-20 bg-gradient-to-b from-[#0A192F] via-[#0E203C] to-[#0A192F] text-white border-y border-[#D4AF37]/25 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Google Workspace Integration (Docs, Gmail, Calendar, Slides)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight uppercase">
            Official Google Workspace Hub
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            Manage your summit documents, dispatch safety briefing emails via Gmail, schedule plenary events in Google Calendar, and generate keynote presentations in Google Slides.
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

        {/* Auth State */}
        {!user || !token ? (
          <div className="max-w-2xl mx-auto bg-[#071324] border border-[#D4AF37]/30 rounded-2xl p-8 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
              <Crown className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">Connect Google Workspace</h3>
              <p className="text-xs sm:text-sm text-[#8A99AD] max-w-md mx-auto">
                Sign in with Google to enable Docs, Gmail dispatches, Calendar scheduling, and Google Slides presentation creation.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center space-x-3 bg-white text-[#1f1f1f] hover:bg-neutral-100 px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.87c2.26-2.09 3.675-5.17 3.675-9.12z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.12C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.61H1.26C.46 8.22 0 10.06 0 12s.46 3.78 1.26 5.39l4.01-3.12z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.61l4.01 3.12c.95-2.85 3.6-4.98 6.73-4.98z"/>
                </svg>
                <span className="font-sans font-semibold tracking-wide">
                  {isLoggingIn ? 'Connecting...' : 'Sign in with Google Workspace'}
                </span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-center space-x-2 text-[11px] text-[#8A99AD] font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Full secure access to Gmail, Calendar, Docs, and Slides</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* User Bar */}
            <div className="bg-[#071324] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-[#D4AF37] object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white font-sans">{user.displayName || 'Google User'}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">Connected</span>
                  </div>
                  <p className="text-xs text-[#8A99AD] font-mono">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => loadAllWorkspaceData()}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg border border-white/15 transition cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Sync All</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs rounded-lg border border-rose-500/30 transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>

            {/* Workspace Service Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('docs')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'docs' ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg' : 'bg-[#071324] text-[#8A99AD] hover:text-white border border-white/10'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Google Docs ({docs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gmail')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'gmail' ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg' : 'bg-[#071324] text-[#8A99AD] hover:text-white border border-white/10'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Gmail ({emails.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'calendar' ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg' : 'bg-[#071324] text-[#8A99AD] hover:text-white border border-white/10'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Google Calendar ({events.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'slides' ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg' : 'bg-[#071324] text-[#8A99AD] hover:text-white border border-white/10'
                }`}
              >
                <Presentation className="h-4 w-4" />
                <span>Google Slides ({slidesCreated.length})</span>
              </button>
            </div>

            {/* TAB 1: GOOGLE DOCS */}
            {activeTab === 'docs' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">Summit Google Docs Repository</h3>
                    <p className="text-xs text-[#8A99AD]">Create or open Google Docs documents directly in your Drive.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDocTitle('Aviation Safety Summit 2026 - Working Paper');
                      setNewDocContent(SUMMIT_DOC_TEMPLATES[0].content);
                      setIsCreateDocModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Google Doc</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SUMMIT_DOC_TEMPLATES.map(tmpl => (
                    <div key={tmpl.id} className="bg-[#071324] border border-[#D4AF37]/20 rounded-xl p-5 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-semibold">{tmpl.category}</span>
                        <h4 className="font-serif font-bold text-sm text-white mt-2">{tmpl.name}</h4>
                        <p className="text-xs text-[#8A99AD] mt-1 line-clamp-2">{tmpl.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsCreatingDoc(true);
                          try {
                            await createGoogleDoc(token!, tmpl.defaultTitle, tmpl.content);
                            showNotification('success', `Created "${tmpl.defaultTitle}" in Google Docs!`);
                            loadAllWorkspaceData();
                          } catch (e: any) {
                            showNotification('error', e.message);
                          } finally {
                            setIsCreatingDoc(false);
                          }
                        }}
                        disabled={isCreatingDoc}
                        className="w-full py-2 bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0A192F] text-xs font-bold rounded-lg transition cursor-pointer"
                      >
                        Create in Google Docs
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {docs.map(doc => (
                    <div key={doc.id} className="bg-[#071324] border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-white line-clamp-1">{doc.name}</h4>
                        <p className="text-[10px] text-[#8A99AD] font-mono mt-1">Updated: {doc.modifiedTime ? new Date(doc.modifiedTime).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <a href={doc.webViewLink || `https://docs.google.com/document/d/${doc.id}/edit`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center space-x-1">
                          <span>Open in Docs</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: GMAIL */}
            {activeTab === 'gmail' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">Gmail Integration & Dispatches</h3>
                    <p className="text-xs text-[#8A99AD]">Send safety advisories and delegate updates directly via Gmail API.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsComposeModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 transition cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Compose & Send Email</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Recent Gmail Messages</h4>
                  {isLoadingEmails ? (
                    <div className="py-12 text-center text-xs text-[#8A99AD]">Loading Gmail messages...</div>
                  ) : emails.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#8A99AD] bg-[#071324] rounded-xl border border-white/10">No messages found in Gmail inbox.</div>
                  ) : (
                    <div className="space-y-2">
                      {emails.map(msg => (
                        <div key={msg.id} className="bg-[#071324] border border-white/10 rounded-xl p-4 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-white">{msg.subject || '(No Subject)'}</span>
                            <span className="text-[10px] text-[#8A99AD] font-mono">{msg.date}</span>
                          </div>
                          <p className="text-xs text-[#8A99AD]">From: {msg.from}</p>
                          <p className="text-xs text-neutral-300 line-clamp-2 mt-1">{msg.snippet}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: GOOGLE CALENDAR */}
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">Google Calendar Scheduling</h3>
                    <p className="text-xs text-[#8A99AD]">Add the Aviation Safety Summit 2026 to your official calendar.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSummitToCalendar}
                    disabled={isCreatingEvent}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{isCreatingEvent ? 'Adding Event...' : 'Add Summit to Calendar (17 Nov 2026)'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Upcoming Calendar Events</h4>
                  {isLoadingEvents ? (
                    <div className="py-12 text-center text-xs text-[#8A99AD]">Loading calendar events...</div>
                  ) : events.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#8A99AD] bg-[#071324] rounded-xl border border-white/10">No upcoming events found on your primary calendar.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.map(ev => (
                        <div key={ev.id} className="bg-[#071324] border border-white/10 rounded-xl p-4 space-y-2">
                          <h4 className="font-semibold text-sm text-white">{ev.summary}</h4>
                          {ev.location && <p className="text-xs text-[#8A99AD]">Location: {ev.location}</p>}
                          <p className="text-[11px] text-[#D4AF37] font-mono">Start: {ev.start?.dateTime || ev.start?.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: GOOGLE SLIDES */}
            {activeTab === 'slides' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">Google Slides Presentation Generator</h3>
                    <p className="text-xs text-[#8A99AD]">Create keynotes and plenary slide decks for the Aviation Safety Summit.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCreateSlidesDeck('Aviation Safety Summit 2026 - Keynote Presentation')}
                    disabled={isCreatingSlides}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                  >
                    <Presentation className="h-4 w-4" />
                    <span>{isCreatingSlides ? 'Creating Slides...' : 'Create Keynote Deck in Slides'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slidesCreated.map(slide => (
                    <div key={slide.presentationId} className="bg-[#071324] border border-[#D4AF37]/30 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-white">{slide.title}</h4>
                        <p className="text-[10px] text-[#8A99AD] font-mono mt-1">ID: {slide.presentationId}</p>
                      </div>
                      <a href={slide.webViewLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold hover:bg-blue-600/30 flex items-center space-x-1">
                        <span>Open Slides</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gmail Compose Modal */}
            {isComposeModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white font-serif flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-[#D4AF37]" />
                      <span>Compose Gmail Message</span>
                    </h3>
                    <button type="button" onClick={() => setIsComposeModalOpen(false)} className="text-white/60 hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">To Email *</label>
                      <input 
                        type="email" 
                        required
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="colleague@airline.com"
                        className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Message</label>
                      <textarea 
                        rows={6}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button type="button" onClick={() => setIsComposeModalOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg">Cancel</button>
                      <button type="submit" disabled={isSendingEmail} className="px-5 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg hover:brightness-110 flex items-center space-x-1.5">
                        {isSendingEmail ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        <span>{isSendingEmail ? 'Sending...' : 'Send via Gmail'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Create Doc Modal */}
            {isCreateDocModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#071324] border border-[#D4AF37]/40 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white font-serif">Create Google Doc</h3>
                    <button type="button" onClick={() => setIsCreateDocModalOpen(false)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Title</label>
                      <input type="text" value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)} className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Initial Content</label>
                      <textarea rows={6} value={newDocContent} onChange={e => setNewDocContent(e.target.value)} className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white font-mono" />
                    </div>
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button type="button" onClick={() => setIsCreateDocModalOpen(false)} className="px-4 py-2 bg-white/10 text-white text-xs rounded-lg">Cancel</button>
                      <button type="button" disabled={isCreatingDoc} onClick={async () => {
                        setIsCreatingDoc(true);
                        try {
                          await createGoogleDoc(token!, newDocTitle, newDocContent);
                          showNotification('success', 'Google Doc created!');
                          setIsCreateDocModalOpen(false);
                          loadAllWorkspaceData();
                        } catch (e: any) {
                          showNotification('error', e.message);
                        } finally {
                          setIsCreatingDoc(false);
                        }
                      }} className="px-5 py-2 bg-[#D4AF37] text-[#0A192F] font-bold text-xs rounded-lg">Create</button>
                    </div>
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
