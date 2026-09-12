/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';

interface StickyMobileRegisterProps {
  onNavigate: (sectionId: string) => void;
}

export default function StickyMobileRegister({ onNavigate }: StickyMobileRegisterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A192F]/95 backdrop-blur-md border-t border-[#D4AF37]/30 p-3 shadow-2xl">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold text-[#D4AF37] tracking-wider uppercase">
            17 NOV 2026
          </span>
          <span className="text-[9px] text-[#8A99AD] font-sans truncate max-w-[150px]">
            Marriott Hotel, Ikeja
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('challenge')}
            className="px-2.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            MEMO
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#B89025] hover:to-[#9E781C] text-[#0A192F] font-bold rounded-lg text-xs tracking-widest uppercase transition-all shadow flex items-center space-x-1"
          >
            <span>REGISTER</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
