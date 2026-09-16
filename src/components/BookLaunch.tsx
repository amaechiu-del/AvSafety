/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Edit2, Save, X, ExternalLink, 
  CheckCircle2, Shield, Award, Feather, Bookmark, Compass, ArrowRight,
  UserCheck, ShieldCheck, Plane, Radio, FileCheck
} from 'lucide-react';
import { BookInfo } from '../types';
import { 
  AUTHOR_NAME, 
  AUTHOR_BIO, 
  AUTHOR_ROLE, 
  AUTHOR_CREDENTIALS, 
  AUTHOR_CAREER_HIGHLIGHTS, 
  BOOK_PRIMARY 
} from '../constants/author';

interface BookLaunchProps {
  book: BookInfo;
  onUpdateBook: (updated: BookInfo) => void;
  isAdmin: boolean;
}

export default function BookLaunch({ book, onUpdateBook, isAdmin }: BookLaunchProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<BookInfo | null>(null);
  const [showExcerptModal, setShowExcerptModal] = useState(false);

  // Directly consume live state with explicit canonical fallbacks
  const currentTitle = book?.title?.trim() || BOOK_PRIMARY.title;
  const currentAuthor = book?.author?.trim() || AUTHOR_NAME;
  const currentDescription = book?.description?.trim() || BOOK_PRIMARY.description;

  const handleStartEdit = () => {
    setIsEditing(true);
    setFormState({ 
      id: book?.id || 'bk-1',
      title: currentTitle,
      author: currentAuthor,
      description: currentDescription,
      coverImagePlaceholder: book?.coverImagePlaceholder || 'CLEARED FOR TAKEOFF'
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormState(null);
  };

  const handleSave = () => {
    if (!formState) return;
    onUpdateBook(formState);
    setIsEditing(false);
    setFormState(null);
  };

  return (
    <section id="book" className="py-24 bg-[#071324] text-slate-100 relative overflow-hidden border-b border-[#D4AF37]/20">
      
      {/* Background Architectural Light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap">
            <Feather className="w-3.5 h-3.5" />
            <span>OFFICIAL SUMMIT LITERARY DEBUT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-tight">
            The Headline <span className="text-[#D4AF37]">Book Launch</span>
          </h2>
          
          <div className="h-0.5 w-20 bg-[#D4AF37] mx-auto rounded-full"></div>

          <p className="text-base text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            The definitive insider chronicle unveiling 25 years of operational command, regulatory audits, and airspace oversight across West African skies.
          </p>
        </div>

        {/* Premium Book Showcase Card */}
        <div className="max-w-5xl mx-auto bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Hardcover Book Silhouette with Dynamic Hover and Floating Aura */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Dynamic Golden Aura Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 via-amber-500/10 to-transparent rounded-2xl blur-2xl pointer-events-none animate-beacon" />

              <div className="w-72 sm:w-80 h-[460px] bg-[#050C17] border-2 border-[#D4AF37]/70 rounded-r-xl shadow-[0_15px_40px_rgba(212,175,55,0.2)] relative flex flex-col justify-between p-6 text-center overflow-hidden animate-float-gentle z-10">
                
                {/* Book Spine Texture */}
                <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/80 to-transparent border-r border-[#D4AF37]/20"></div>
                
                {/* Book Header & Title */}
                <div className="z-10 mt-4 space-y-3 px-2">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono font-bold uppercase tracking-widest whitespace-nowrap">
                    MEMOIR & SAFETY TREATISE
                  </span>

                  <h3 className="text-white font-serif text-2xl sm:text-3xl font-black tracking-wide uppercase leading-tight pt-1">
                    {currentTitle}
                  </h3>
                  
                  <p className="text-[#D4AF37] font-serif text-xs sm:text-sm font-semibold tracking-wide italic">
                    But Who Is Flying Nigeria's Aviation?
                  </p>

                  <p className="text-slate-300 font-sans text-xs italic leading-relaxed pt-2 line-clamp-3">
                    "{currentDescription}"
                  </p>
                </div>

                {/* Author Badge */}
                <div className="z-10 flex flex-col items-center space-y-1 my-auto">
                  <div className="w-10 h-10 rounded-full bg-[#0A192F] border border-[#D4AF37] flex items-center justify-center font-serif font-black text-sm text-[#D4AF37] shadow-inner mb-1">
                    AU
                  </div>
                  <p className="text-slate-400 font-serif text-[10px] italic">Authored by</p>
                  <p className="text-[#D4AF37] font-serif text-lg font-bold tracking-wider uppercase">
                    {currentAuthor}
                  </p>
                  <div className="space-y-0.5 pt-1 text-[8px] font-mono text-slate-300 leading-tight">
                    <p>Commercial Pilot Licence (CPL)</p>
                    <p>Air Traffic Controller (ATC)</p>
                    <p>Aviation Safety Inspector — PEL</p>
                  </div>
                </div>

                {/* Publisher Imprint */}
                <div className="z-10 border-t border-[#D4AF37]/20 pt-2 pb-1">
                  <p className="text-[#D4AF37] font-mono text-[8px] tracking-widest uppercase font-bold whitespace-nowrap">
                    DomisLink International Services Ltd
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Executive Detail & Editorial Dossier */}
            <div className="lg:col-span-7 space-y-6">
              
              {isEditing ? (
                <div className="bg-[#050C17] border border-[#D4AF37]/30 rounded-xl p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-[#D4AF37] font-bold uppercase">Edit Book Record</span>
                    <button onClick={handleCancel} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Book Title</label>
                    <input 
                      type="text"
                      className="w-full text-xs p-2.5 border border-[#D4AF37]/40 rounded bg-[#0A192F] text-white font-bold"
                      value={formState?.title || ''}
                      onChange={(e) => setFormState(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Author Name</label>
                    <input 
                      type="text"
                      className="w-full text-xs p-2.5 border border-[#D4AF37]/40 rounded bg-[#0A192F] text-white font-bold"
                      value={formState?.author || ''}
                      onChange={(e) => setFormState(prev => prev ? { ...prev, author: e.target.value } : null)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Book Synopsis</label>
                    <textarea 
                      rows={4}
                      className="w-full text-xs p-2.5 border border-[#D4AF37]/40 rounded bg-[#0A192F] text-white font-sans"
                      value={formState?.description || ''}
                      onChange={(e) => setFormState(prev => prev ? { ...prev, description: e.target.value } : null)}
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button 
                      onClick={handleCancel} 
                      className="px-4 py-2 border border-white/20 rounded text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave} 
                      className="px-5 py-2 bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-bold rounded flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Book</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Status & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-[10px] font-bold tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] rounded-full border border-[#D4AF37]/30 font-mono uppercase whitespace-nowrap">
                        ★ EXCLUSIVE SUMMIT RELEASE
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-white/5 text-slate-300 rounded-full border border-white/10 whitespace-nowrap">
                        LIMITED COMMEMORATIVE EDITION
                      </span>
                    </div>

                    {isAdmin && (
                      <button 
                        onClick={handleStartEdit}
                        className="px-3 py-1 text-xs font-mono text-[#D4AF37] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit Book State</span>
                      </button>
                    )}
                  </div>

                  {/* Title & Author Block */}
                  <div className="space-y-2 border-b border-white/10 pb-5">
                    <h3 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight uppercase leading-tight">
                      {currentTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-base">
                      <span className="text-slate-400 font-serif italic">Authored by</span>
                      <span className="text-[#D4AF37] font-serif font-black tracking-wide text-lg sm:text-xl">
                        {currentAuthor}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        • 25 Years Airspace Veteran
                      </span>
                    </div>
                  </div>

                  {/* Synopsis Text */}
                  <div className="space-y-3">
                    <p className="text-base text-slate-200 leading-relaxed font-sans">
                      "{currentDescription}"
                    </p>
                  </div>

                  {/* Editorial Highlights */}
                  <div className="space-y-2.5 border-t border-b border-white/10 py-4 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span><strong>Cockpit & Radar Insights:</strong> Firsthand narratives from commercial pilot command and air traffic control consoles.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span><strong>Regulatory Oversight:</strong> Insider view of aviation safety inspection, personnel licensing, and audit frameworks.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span><strong>Strategic Blueprint:</strong> Practical recommendations for institutional reform and zero avoidable aviation fatalities.</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setShowExcerptModal(true)}
                      className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-bold rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md whitespace-nowrap"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>READ EXCLUSIVE EXCERPT</span>
                    </button>

                    <button 
                      onClick={() => {
                        const target = document.getElementById('domislink-bookstore') || document.getElementById('knowledge-hub') || document.getElementById('challenge');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-white/15 whitespace-nowrap"
                    >
                      <span>ORDER IN SUMMIT BOOKSTORE</span>
                      <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* Author Biography & Profile Dossier */}
        <div className="max-w-5xl mx-auto bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" />
                <span>AUTHOR BIOGRAPHY & EDITORIAL PROFILE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide uppercase">
                {AUTHOR_NAME}
              </h3>
              <p className="text-sm font-sans text-[#D4AF37] font-semibold">
                {AUTHOR_ROLE}
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Verified 25+ Years Airspace Veteran</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Author Identity Seal & Licensures */}
            <div className="lg:col-span-4 bg-[#050C17] border border-[#D4AF37]/20 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 to-[#0A192F] border-2 border-[#D4AF37] flex items-center justify-center font-serif font-black text-3xl text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                AU
              </div>
              
              <div className="space-y-0.5">
                <h4 className="text-lg font-serif font-black text-white uppercase tracking-wide">
                  {AUTHOR_NAME}
                </h4>
                <p className="text-xs text-[#D4AF37] font-mono">Principal Author & Convener</p>
                <p className="text-[11px] text-slate-400">DomisLink Aviation Safety Summit 2026</p>
              </div>

              <div className="w-full border-t border-white/10 pt-4 space-y-2 text-left">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                  Statutory Licensures & Qualifications:
                </p>
                <div className="space-y-1.5">
                  {AUTHOR_CREDENTIALS.map((cred, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="font-medium">{cred}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 text-center">
                Publisher: <strong className="text-slate-200">DomisLink International Services Ltd</strong> / The Digital Empire
              </div>
            </div>

            {/* Right: Detailed Biography & Career Highlights */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="space-y-3">
                <h4 className="text-sm font-mono text-[#D4AF37] uppercase tracking-wider font-bold">
                  Biography & Airspace Chronicle
                </h4>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  {AUTHOR_BIO}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  Across a distinguished quarter-century in the aviation sector, {AUTHOR_NAME} has navigated the operational realities of air navigation services, airline line operations, and high-level regulatory audits. His writing merges the technical precision of flight deck procedures with an urgent moral call to preserve human life across the African continent.
                </p>
              </div>

              {/* Career Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {AUTHOR_CAREER_HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="bg-[#050C17]/80 border border-white/10 rounded-lg p-3.5 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold">
                      {idx === 0 && <Plane className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      {idx === 1 && <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      {idx === 2 && <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      {idx === 3 && <Award className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      <span>{item.role}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Excerpt Modal */}
        {showExcerptModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0A192F] border border-[#D4AF37]/50 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-mono font-bold uppercase whitespace-nowrap">
                    EXCLUSIVE CHAPTER PREVIEW
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
                    {currentTitle}
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-semibold">By {currentAuthor}</p>
                </div>
                <button
                  onClick={() => setShowExcerptModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-serif">
                <p className="text-sm font-semibold text-white italic border-l-2 border-[#D4AF37] pl-3 py-1">
                  "Aviation safety is not an achievement you record once and celebrate forever; it is a relentless, hourly discipline of vigilance, honest reporting, and uncompromising standards."
                </p>

                <p>
                  From the command seat of commercial cockpits to the high-stakes separation consoles of radar control centers, and through the rigorous auditing corridors of civil aviation licensing, <em>{currentTitle}</em> captures 25 years of unfiltered operational truth.
                </p>

                <p>
                  This volume confronts the delicate balance between commercial aviation pressures and non-negotiable safety ethics. It asks the critical question: <em>Who is truly flying Nigeria's aviation?</em> And provides a blueprint for pilots, controllers, engineers, and regulators to preserve airspace sanctity for the next generation.
                </p>

                <div className="bg-[#050C17] border border-[#D4AF37]/20 rounded-xl p-4 space-y-2 font-sans text-xs">
                  <p className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold">COMMEMORATIVE SUMMIT RELEASE INCLUDES:</p>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Full unedited author commentary and incident case studies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Regulatory inspection checklist templates and crew CRM frameworks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Official Summit commemorative hardcover with author signature</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <span className="text-[11px] font-mono text-slate-400">Published by DomisLink International Services Ltd</span>
                <button
                  onClick={() => setShowExcerptModal(false)}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-bold rounded-lg text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  Close Preview
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}

