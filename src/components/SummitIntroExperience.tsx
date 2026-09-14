/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Shield, ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface SummitIntroExperienceProps {
  onComplete: () => void;
}

export default function SummitIntroExperience({ onComplete }: SummitIntroExperienceProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Sequence progression
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setStep(1), 600);   // Golden light expands & Crown forms
    const t2 = setTimeout(() => setStep(2), 1800);  // DOMISLINK
    const t3 = setTimeout(() => setStep(3), 2800);  // THE DIGITAL EMPIRE
    const t4 = setTimeout(() => setStep(4), 3800);  // AVIATION SAFETY SUMMIT 2026
    const t5 = setTimeout(() => setStep(5), 4800);  // EVERYBODY IS INVOLVED IN AVIATION SAFETY
    const t6 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600); // Fade out transition
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#050B1A] flex flex-col items-center justify-center p-6 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Dynamic Background Grid & Particles */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="introGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#introGrid)" />
        </svg>
      </div>

      {/* Radial Golden Light Glow */}
      <div 
        className={`absolute w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#FFD700]/10 to-transparent blur-3xl transition-all duration-1000 ${
          step >= 1 ? 'scale-125 opacity-70' : 'scale-50 opacity-20'
        }`}
      />

      {/* Main Content Assembly Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
        
        {/* Golden Crown Brand Mark Formation */}
        <div 
          className={`relative transition-all duration-1000 transform ${
            step >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-8'
          }`}
        >
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#0A192F] to-[#050B1A] border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)]">
            <Crown className="w-14 h-14 sm:w-16 sm:h-16 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full animate-ping" />
          </div>
        </div>

        {/* Brand Title Sequence */}
        <div className="space-y-2">
          {/* Step 2: DOMISLINK */}
          <div 
            className={`transition-all duration-700 transform ${
              step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="font-mono text-xs sm:text-sm tracking-[0.35em] text-[#D4AF37] uppercase font-bold">
              DOMISLINK
            </p>
          </div>

          {/* Step 3: THE DIGITAL EMPIRE */}
          <div 
            className={`transition-all duration-700 transform ${
              step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-[0.25em] text-white uppercase">
              THE DIGITAL EMPIRE
            </h2>
          </div>

          {/* Divider */}
          <div 
            className={`h-0.5 w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto transition-all duration-700 ${
              step >= 4 ? 'w-32 opacity-100' : 'w-0 opacity-0'
            }`}
          />

          {/* Step 4: AVIATION SAFETY SUMMIT 2026 */}
          <div 
            className={`transition-all duration-700 transform ${
              step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-3">
              AVIATION SAFETY <span className="text-[#FFD700]">SUMMIT 2026</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#8A99AD] mt-1 tracking-wider">
              17 NOVEMBER 2026 • MARRIOTT HOTEL, IKEJA, LAGOS
            </p>
          </div>

          {/* Step 5: EVERYBODY IS INVOLVED IN AVIATION SAFETY */}
          <div 
            className={`transition-all duration-1000 transform mt-4 ${
              step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="px-5 py-2.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 backdrop-blur-md inline-block">
              <p className="font-serif text-xs sm:text-sm font-bold tracking-widest text-[#FFD700] uppercase">
                "EVERYBODY IS INVOLVED IN AVIATION SAFETY"
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-white text-xs font-mono tracking-widest uppercase transition-all flex items-center gap-2 backdrop-blur-md group"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#FFD700] group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
