import React, { useState } from 'react';
import { MessageSquare, Lightbulb, Send, CheckCircle, BrainCircuit } from 'lucide-react';

export default function FeedbackSuggestionFocus() {
  const [submitted, setSubmitted] = useState(false);
  const [focusArea, setFocusArea] = useState('aviation-safety');

  return (
    <section id="feedback" className="py-24 bg-[#071324] border-t border-[#D4AF37]/30 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-[#D4AF37] mb-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-mono tracking-widest text-[11px] uppercase font-bold">Post-Event Engagement</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight uppercase">
            Feedback & Suggestion Focus
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            Your insights drive the future of aviation safety. Submit your strategic feedback, policy suggestions, or operational concerns directly to the Domislink Aviation Research Group.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Focus Areas Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0A192F] p-6 rounded-xl border border-[#D4AF37]/20 shadow-xl space-y-6">
              <h3 className="text-white font-serif font-bold text-lg border-b border-white/10 pb-4">Key Focus Areas</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setFocusArea('aviation-safety')}
                  className={`w-full text-left p-3 rounded-lg flex items-start space-x-3 transition-colors ${focusArea === 'aviation-safety' ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/50' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                >
                  <BrainCircuit className={`h-5 w-5 mt-0.5 ${focusArea === 'aviation-safety' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                  <div>
                    <h4 className={`text-sm font-bold ${focusArea === 'aviation-safety' ? 'text-[#D4AF37]' : 'text-gray-300'}`}>Aviation Safety Policy</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Regulatory frameworks, operational protocols, and safety management systems.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setFocusArea('event-experience')}
                  className={`w-full text-left p-3 rounded-lg flex items-start space-x-3 transition-colors ${focusArea === 'event-experience' ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/50' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                >
                  <MessageSquare className={`h-5 w-5 mt-0.5 ${focusArea === 'event-experience' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                  <div>
                    <h4 className={`text-sm font-bold ${focusArea === 'event-experience' ? 'text-[#D4AF37]' : 'text-gray-300'}`}>Summit Experience</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Feedback regarding the plenary sessions, networking, and overall summit organization.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setFocusArea('innovations')}
                  className={`w-full text-left p-3 rounded-lg flex items-start space-x-3 transition-colors ${focusArea === 'innovations' ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/50' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                >
                  <Lightbulb className={`h-5 w-5 mt-0.5 ${focusArea === 'innovations' ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                  <div>
                    <h4 className={`text-sm font-bold ${focusArea === 'innovations' ? 'text-[#D4AF37]' : 'text-gray-300'}`}>Industry Innovations</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Propose new technologies, training standards, or technological integrations.</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Form Engine */}
          <div className="lg:col-span-8 bg-[#0A192F] border border-[#D4AF37]/20 p-6 sm:p-8 rounded-xl shadow-2xl relative">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-2 shadow-inner">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">Insight Transmitted</h3>
                <p className="text-sm text-gray-400 max-w-md">
                  Your feedback has been securely submitted to the Domislink Editorial & Research Board for review.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 border border-[#D4AF37]/50 text-[#D4AF37] rounded hover:bg-[#D4AF37]/10 transition-colors text-xs tracking-widest uppercase font-bold"
                >
                  Submit Another Insight
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Full Name / Callsign</label>
                    <input 
                      type="text" required placeholder="Captain Jane Doe"
                      className="w-full p-3 bg-[#050D18] border border-[#D4AF37]/30 rounded text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Organization / Airline</label>
                    <input 
                      type="text" required placeholder="NCAA / NSIB / Airline"
                      className="w-full p-3 bg-[#050D18] border border-[#D4AF37]/30 rounded text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Primary Subject</label>
                  <input 
                    type="text" required placeholder="e.g. Recommendation for AI in Air Traffic Control"
                    className="w-full p-3 bg-[#050D18] border border-[#D4AF37]/30 rounded text-white text-sm font-semibold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Detailed Insight & Suggestion</label>
                  <textarea 
                    required rows={5} placeholder="Provide your detailed feedback, analysis, or strategic suggestion here..."
                    className="w-full p-3 bg-[#050D18] border border-[#D4AF37]/30 rounded text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-y"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#B89025] hover:to-[#9A7B1C] text-[#0A192F] font-bold rounded shadow-lg hover:shadow-xl transition-all text-sm tracking-widest uppercase"
                  >
                    <Send className="h-4 w-4" />
                    <span>Transmit Feedback to Board</span>
                  </button>
                </div>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
