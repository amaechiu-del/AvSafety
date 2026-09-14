/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SafetyPulseProps {
  label?: string;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export default function SafetyPulse({ 
  label = 'THE SAFETY PULSE // DATA, PROCEDURES, PEOPLE & AIRSPACE INTEGRITY',
  className = '',
  direction = 'horizontal'
}: SafetyPulseProps) {
  if (direction === 'vertical') {
    return (
      <div className={`relative flex flex-col items-center justify-center my-6 ${className}`}>
        <div className="w-0.5 h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent relative overflow-hidden">
          <div className="w-full h-8 bg-gradient-to-b from-[#FFD700] to-transparent animate-pulse" />
        </div>
        {label && (
          <span className="text-[9px] font-mono tracking-widest text-[#D4AF37]/80 uppercase mt-2 [writing-mode:vertical-rl] rotate-180">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden py-3 pointer-events-none ${className}`}>
      {/* Background Rail */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent relative">
        {/* Moving Golden Safety Pulse Light */}
        <div 
          className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_12px_#FFD700]"
          style={{
            animation: 'pulseSlide 4s cubic-bezier(0.4, 0, 0.2, 1) infinite'
          }}
        />
      </div>

      {label && (
        <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#D4AF37]/75 uppercase px-4 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-ping inline-block" />
            SAFETY PULSE: ACTIVE
          </span>
          <span className="hidden sm:inline-block text-gray-400">{label}</span>
          <span className="text-amber-500/80 font-bold">FL350 LAGOS FIR</span>
        </div>
      )}
    </div>
  );
}
