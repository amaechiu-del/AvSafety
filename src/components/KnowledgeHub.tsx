/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Newspaper, FileText, Video, Play, Download, HelpCircle, GraduationCap } from 'lucide-react';

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Resources' },
    { id: 'articles', label: 'Safety Articles' },
    { id: 'memos', label: 'Aviation Memoirs' },
    { id: 'presentations', label: 'Presentations' },
    { id: 'videos', label: 'Videos' },
    { id: 'reports', label: 'Technical Reports' },
    { id: 'books', label: 'Books' },
    { id: 'training', label: 'Training Materials' },
    { id: 'photos', label: 'Photos' },
    { id: 'announcements', label: 'Announcements' }
  ];

  const futureItems = [
    { cat: 'articles', title: 'Safety Article', size: '2.4 MB' },
    { cat: 'memos', title: 'Aviation Memoir File', size: '1.1 MB' },
    { cat: 'presentations', title: 'Technical Presentation', size: '8.7 MB' },
    { cat: 'videos', title: 'Summit Video Feed', size: '4K Stream' },
    { cat: 'reports', title: 'Safety Report', size: '12.4 MB' },
    { cat: 'books', title: 'Literary Release', size: '18.0 MB' },
    { cat: 'training', title: 'Simulation training Syllabus', size: '4.5 MB' },
    { cat: 'photos', title: 'High-Res Event Photo Archive', size: '240 MB' },
    { cat: 'announcements', title: 'Official Press Announcement', size: '350 KB' }
  ];

  const filteredItems = activeTab === 'ALL' 
    ? futureItems 
    : futureItems.filter(item => item.cat === activeTab);

  return (
    <section className="py-24 bg-[#FCFBF7] border-b border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-bold">DIGITAL LIBRARY</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            SAFETY KNOWLEDGE HUB
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm sm:text-base text-[#5A6E85] font-light leading-relaxed">
            The official repository for publishing presentation slidedecks, safety checklists, simulator manuals, and recorded summit debates.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1.5 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === cat.id
                  ? 'bg-[#0A192F] text-[#D4AF37] border border-[#0A192F]'
                  : 'bg-white text-[#5A6E85] border border-gray-200 hover:border-[#D4AF37]/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Placeholder Grid (MANDATED - No simulated texts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white border border-[#D4AF37]/10 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[8px] font-mono font-bold uppercase text-gray-500">
                    {item.cat.toUpperCase()}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 font-semibold">{item.size}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-mono font-extrabold text-[#0A192F] uppercase tracking-wider">
                    {item.title}
                  </h3>
                  
                  {/* Mandated Placeholder Notice */}
                  <div className="p-3 bg-gray-50 rounded border border-gray-150 text-center">
                    <p className="text-[10px] font-mono font-bold text-gray-500 tracking-wider">
                      [CONTENT TO BE PUBLISHED]
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-sans">Official Release Pending Summit Adjournment</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[8px] font-mono text-gray-400">
                <span>REQUISITION // {item.cat.substring(0, 3).toUpperCase()}_0{index + 1}</span>
                <span className="text-gray-400">● STAGED</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
