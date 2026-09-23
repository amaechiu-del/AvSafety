/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RefreshCw, Sparkles, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';

export const PWAUpdateNotification: React.FC = () => {
  const { isUpdateAvailable, isUpdating, applyUpdate, justChecked } = usePWAUpdate();
  const [dismissed, setDismissed] = useState(false);

  // If update is available and not dismissed, show the prompt
  if (isUpdateAvailable && !dismissed) {
    return (
      <div 
        className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl animate-fadeIn"
        role="alert"
        aria-live="assertive"
      >
        <div className="bg-[#0A192F]/98 border-2 border-[#D4AF37] rounded-2xl shadow-2xl p-4 sm:p-5 backdrop-blur-xl text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0A192F] text-[10px] font-black uppercase tracking-wider">
                    PWA Update Ready
                  </span>
                  <span className="text-xs text-[#D4AF37] font-semibold">
                    Rev 7.2 Synced
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Summit Compendium & Hierarchy Updated
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Latest protocol order of precedence, 24 church leader addresses, and curated official portraits are now available for your installed application.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-end gap-2.5">
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-medium rounded-lg transition cursor-pointer"
            >
              Later
            </button>
            <button
              onClick={() => applyUpdate()}
              disabled={isUpdating}
              className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Updating PWA...' : 'Update & Refresh Now'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Toast confirmation when user manually checks and app is already fresh
  if (justChecked && !isUpdateAvailable) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 animate-fadeIn"
        role="status"
        aria-live="polite"
      >
        <div className="bg-[#0A192F]/95 border border-emerald-500/50 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md text-white flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-emerald-400">PWA Is Up To Date</div>
            <div className="text-slate-300 text-[11px]">All 76 protocol dignitaries, speeches & offline assets are synced.</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
