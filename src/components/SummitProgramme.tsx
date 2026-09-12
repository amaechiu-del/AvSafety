import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Edit, 
  Save, X, Plus, Trash2, ArrowUp, ArrowDown, Search, Filter,
  Building, User, FileText, Tag, Download, Check, ExternalLink, MessageCircle
} from 'lucide-react';
import { Session, ProgrammeSessionType, SessionStatus } from '../types';
import SummitAssistantModal from './SummitAssistantModal';

interface SummitProgrammeProps {
  sessions: Session[];
  onUpdateSessions: (updated: Session[]) => void;
  isAdmin: boolean;
  onNavigate: (view: string) => void;
}

const PLACEHOLDER_TIME = '[TIME TO BE CONFIRMED]';
const PLACEHOLDER_SPEAKER = '[SPEAKER TO BE CONFIRMED]';
const PLACEHOLDER_TOPIC = '[TOPIC TO BE CONFIRMED]';

export default function SummitProgramme({ sessions, onUpdateSessions, isAdmin, onNavigate }: SummitProgrammeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ProgrammeSessionType | 'ALL'>('ALL');
  
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const [copySuccess, setCopySuccess] = useState(false);

  const filters: (ProgrammeSessionType | 'ALL')[] = [
    'ALL', 'Keynote', 'Panel', 'Workshop', 'Training', 'Simulation', 
    'Memo Challenge', 'Book Launch', 'Exhibition', 'Networking', 'Sky Party', 'Other'
  ];

  // Normalized
  const normalizedSessions = useMemo(() => {
    return sessions.map((s, idx) => ({
      ...s,
      id: s.id || `ses-${idx + 1}`,
      time: s.time || PLACEHOLDER_TIME,
      title: s.title || `Session ${idx + 1}`,
      type: s.type || 'Other',
      speaker: s.speaker || PLACEHOLDER_SPEAKER,
      organisation: s.organisation || 'Domislink International',
      topic: s.topic || PLACEHOLDER_TOPIC,
      description: s.description || '',
      room: s.room || 'Marriott Hotel, Ikeja',
      status: s.status || 'TO_BE_CONFIRMED'
    }));
  }, [sessions]);

  // Filtered
  const filteredSessions = useMemo(() => {
    return normalizedSessions.filter(session => {
      // Type Filter
      if (activeFilter !== 'ALL' && session.type !== activeFilter) return false;

      // Search Filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        session.title.toLowerCase().includes(q) ||
        session.speaker.toLowerCase().includes(q) ||
        session.organisation.toLowerCase().includes(q) ||
        session.topic.toLowerCase().includes(q) ||
        session.description.toLowerCase().includes(q) ||
        session.room.toLowerCase().includes(q) ||
        session.type.toLowerCase().includes(q) ||
        session.time.toLowerCase().includes(q)
      );
    });
  }, [normalizedSessions, activeFilter, searchQuery]);

  // Editor Actions
  const handleOpenEdit = (session: Session) => {
    setEditingSession({ ...session });
    setIsCreatingNew(false);
    setIsEditorOpen(true);
  };

  const handleOpenCreate = () => {
    const newSession: Session = {
      id: `ses-${Date.now()}`,
      time: PLACEHOLDER_TIME,
      title: 'New Summit Session',
      type: 'Other',
      speaker: PLACEHOLDER_SPEAKER,
      organisation: 'Aviation Safety Summit',
      topic: PLACEHOLDER_TOPIC,
      description: '',
      room: 'TBC',
      status: 'TO_BE_CONFIRMED',
      published: true
    };
    setEditingSession(newSession);
    setIsCreatingNew(true);
    setIsEditorOpen(true);
  };

  const handleSaveSession = () => {
    if (!editingSession) return;
    let updatedList: Session[];
    if (isCreatingNew) {
      updatedList = [...normalizedSessions, editingSession];
    } else {
      updatedList = normalizedSessions.map(s => s.id === editingSession.id ? editingSession : s);
    }
    onUpdateSessions(updatedList);
    setIsEditorOpen(false);
    setEditingSession(null);
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm('Are you sure you want to remove this session from the programme?')) {
      const updatedList = normalizedSessions.filter(s => s.id !== id);
      onUpdateSessions(updatedList);
      if (editingSession?.id === id) {
        setIsEditorOpen(false);
        setEditingSession(null);
      }
    }
  };

  const handleMoveSession = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= normalizedSessions.length) return;
    const reordered = [...normalizedSessions];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    onUpdateSessions(reordered);
  };

  const handleExportJson = () => {
    // Only approved/published info
    const publicSessions = normalizedSessions.filter(s => s.published !== false && s.status !== 'PROVISIONAL');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(publicSessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Aviation_Safety_Summit_2026_Programme.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'INVITED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PROVISIONAL':
      case 'TO_BE_CONFIRMED':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <section id="programme" className="py-24 bg-[#FCFBF7] border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">Official Schedule</p>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0A192F] tracking-tight uppercase">
            Summit Programme
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-lg text-[#5A6E85] font-light leading-relaxed mt-4 italic">
            "Everybody is involved in aviation safety."
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-[#D4AF37]/20 rounded-2xl p-4 sm:p-6 shadow-sm mb-10 flex flex-col space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search speaker, topic, session..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FCFBF7] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-[#0A192F]"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleExportJson}
                className="px-4 py-2 bg-[#0A192F] text-white font-mono text-xs uppercase tracking-wider rounded-xl hover:bg-[#1a2f52] transition-colors flex items-center space-x-2"
              >
                {copySuccess ? <Check className="h-3.5 w-3.5 text-[#D4AF37]" /> : <Download className="h-3.5 w-3.5" />}
                <span>Download PDF Programme</span>
              </button>
              {isAdmin && (
                <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 bg-[#D4AF37] text-[#0A192F] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Session</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider uppercase rounded-md transition-all ${
                  activeFilter === filter
                    ? 'bg-[#0A192F] text-[#D4AF37] shadow'
                    : 'bg-[#FCFBF7] text-[#5A6E85] border border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

        </div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-[#D4AF37]/30 space-y-10 py-2">
          
          {filteredSessions.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-mono font-bold text-[#0A192F] uppercase">No sessions found</p>
            </div>
          ) : (
            filteredSessions.map((session, index) => {
              const isTBC = session.status === 'TO_BE_CONFIRMED' || session.status === 'PROVISIONAL';

              return (
                <div key={session.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] sm:-left-[47px] top-4 h-7 w-7 rounded-full border-2 bg-white flex items-center justify-center transition-all shadow-sm ${
                    isTBC ? 'border-amber-500 text-amber-600 bg-amber-50' : 'border-emerald-600 text-emerald-600 bg-emerald-50'
                  }`}>
                    {isTBC ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>

                  {/* Card */}
                  <div className="bg-white border border-[#D4AF37]/20 rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-md transition-all">
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase bg-[#0A192F] text-[#D4AF37] rounded-md">
                            {session.time}
                          </span>
                          <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase bg-slate-100 text-[#5A6E85] border border-gray-200 rounded-md">
                            {session.type}
                          </span>
                          <span className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border rounded-md ${getStatusColor(session.status)}`}>
                            {session.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F] uppercase">{session.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" /> {session.room}
                        </p>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex space-x-2 shrink-0">
                          <button onClick={() => handleMoveSession(index, 'UP')} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-[#0A192F] disabled:opacity-30">
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleMoveSession(index, 'DOWN')} disabled={index === filteredSessions.length - 1} className="p-1.5 text-gray-400 hover:text-[#0A192F] disabled:opacity-30">
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(session)} className="p-1.5 text-gray-400 hover:text-[#0A192F]">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">Official Topic</p>
                          <p className={`text-sm sm:text-base font-semibold mt-0.5 ${session.topic === PLACEHOLDER_TOPIC ? 'text-amber-700 italic' : 'text-[#0A192F]'}`}>
                            {session.topic}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">Speaker</p>
                          <div className="mt-0.5 flex items-start gap-2">
                            <User className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className={`text-sm font-bold ${session.speaker === PLACEHOLDER_SPEAKER ? 'text-amber-700 italic' : 'text-[#0A192F]'}`}>
                                {session.speaker}
                              </p>
                              {session.position && <p className="text-xs text-gray-500">{session.position}</p>}
                              <p className="text-xs font-semibold text-[#5A6E85]">{session.organisation}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {session.description && (
                          <div>
                            <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase">Session Description</p>
                            <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed mt-1">
                              {session.description}
                            </p>
                          </div>
                        )}

                        {/* Sponsor Tag */}
                        {session.sponsorDetails && session.sponsorDetails.sponsorName && (
                          <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl">
                            <p className="text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase">{session.sponsorDetails.type}</p>
                            <p className="text-sm font-bold text-[#0A192F] mt-0.5">{session.sponsorDetails.sponsorName}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-5 mt-5 border-t border-gray-100 flex flex-wrap gap-2">
                      <button onClick={() => onNavigate('register')} className="px-3 py-1.5 bg-[#0A192F] text-white text-[10px] font-mono uppercase font-bold rounded hover:bg-[#D4AF37] hover:text-[#0A192F] transition-colors">
                        Register
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-mono uppercase font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Add to My Programme
                      </button>
                      <button onClick={() => onNavigate('speakers')} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-mono uppercase font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <User className="h-3 w-3" /> View Speaker
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-mono uppercase font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <Tag className="h-3 w-3" /> View Topic
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-mono uppercase font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Set Reminder
                      </button>
                      <button onClick={handleExportJson} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-mono uppercase font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <Download className="h-3 w-3" /> Download Programme
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* AI Assistant Callout */}
        <div className="mt-12 p-8 bg-[#0A192F] rounded-3xl border border-[#D4AF37]/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
          <div className="relative z-10 max-w-xl">
            <h3 className="text-2xl font-serif font-black uppercase text-[#D4AF37] mb-2">Ask the Summit AI</h3>
            <p className="text-sm text-gray-300">
              Have questions about the schedule? Ask our AI assistant about speakers, topics, or when specific sessions are happening. It uses only official, published programme data.
            </p>
          </div>
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="relative z-10 px-6 py-3 bg-[#D4AF37] text-[#0A192F] font-mono font-bold uppercase rounded-xl hover:bg-white transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="h-5 w-5" /> Chat with Assistant
          </button>
        </div>

      </div>

      <SummitAssistantModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
      />

      {/* ADMIN EDITOR MODAL */}
      {isEditorOpen && editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#D4AF37]/30 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col relative max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FCFBF7] rounded-t-2xl">
              <div>
                <h3 className="font-serif font-black uppercase text-[#0A192F] text-xl">
                  {isCreatingNew ? 'Create New Session' : 'Edit Programme Session'}
                </h3>
                <p className="text-xs font-mono text-gray-500 mt-1">CMS Content Manager</p>
              </div>
              <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-white space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Time Slot</label>
                  <input type="text" value={editingSession.time} onChange={e => setEditingSession({...editingSession, time: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]" placeholder="e.g. 09:00 AM - 10:00 AM" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Session Title / Name</label>
                  <input type="text" value={editingSession.title} onChange={e => setEditingSession({...editingSession, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Session Type</label>
                  <select value={editingSession.type} onChange={e => setEditingSession({...editingSession, type: e.target.value as ProgrammeSessionType})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]">
                    {filters.filter(f => f !== 'ALL').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Location / Room</label>
                  <input type="text" value={editingSession.room} onChange={e => setEditingSession({...editingSession, room: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Status</label>
                  <select value={editingSession.status} onChange={e => setEditingSession({...editingSession, status: e.target.value as SessionStatus})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]">
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROVISIONAL">PROVISIONAL</option>
                    <option value="INVITED">INVITED</option>
                    <option value="TO_BE_CONFIRMED">TO BE CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs font-serif font-black uppercase text-[#0A192F] mb-4">Speaker & Topic Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Speaker Name</label>
                    <input type="text" value={editingSession.speaker} onChange={e => setEditingSession({...editingSession, speaker: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Speaker Position</label>
                    <input type="text" value={editingSession.position || ''} onChange={e => setEditingSession({...editingSession, position: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Organisation</label>
                    <input type="text" value={editingSession.organisation} onChange={e => setEditingSession({...editingSession, organisation: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Official Topic</label>
                    <input type="text" value={editingSession.topic} onChange={e => setEditingSession({...editingSession, topic: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase mb-1">Session Description</label>
                    <textarea rows={3} value={editingSession.description} onChange={e => setEditingSession({...editingSession, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#D4AF37]"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-2xl">
              <div>
                {!isCreatingNew && (
                  <button onClick={() => handleDeleteSession(editingSession.id)} className="px-4 py-2 text-red-600 font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-50 rounded-lg flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setIsEditorOpen(false)} className="px-4 py-2 text-gray-600 font-mono text-xs font-bold uppercase tracking-wider hover:bg-gray-200 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleSaveSession} className="px-6 py-2 bg-[#0A192F] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-[#0A192F] transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
