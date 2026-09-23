import React from 'react';
import { 
  Download, X, Smartphone, Monitor, Apple, CheckCircle2, 
  Zap, WifiOff, ShieldCheck, Share, PlusSquare, ArrowRight,
  RefreshCw, Sparkles, Check
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { 
    isUpdateAvailable, 
    isUpdating, 
    isChecking, 
    justChecked, 
    checkForUpdates, 
    applyUpdate, 
    forceHardRefresh,
    appVersion 
  } = usePWAUpdate();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0A192F] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Icon & Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-[#D4AF37]/50 p-2.5 shadow-lg flex items-center justify-center shrink-0">
            <img 
              src="/pwa-192x192.png" 
              alt="Aviation Safety Summit 2026 App Icon" 
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                // Fallback to SVG if PNG is loading
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0A192F]">
              <Zap className="w-3 h-3 fill-current" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider mb-1">
              <span>Instant PWA App</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Aviation Safety Summit 2026</h3>
            <p className="text-xs text-slate-300">17 Nov 2026 • Marriott Hotel, Lagos, Nigeria</p>
          </div>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-200">Instant Launch</div>
            <div className="text-[10px] text-slate-400">Zero store download</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <WifiOff className="w-5 h-5 text-sky-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-200">Offline Ready</div>
            <div className="text-[10px] text-slate-400">Cached agenda & info</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-200">Direct Pass</div>
            <div className="text-[10px] text-slate-400">Fast badge access</div>
          </div>
        </div>

        {/* Context-aware install instructions & Update panel */}
        {isInstalled ? (
          <div className="space-y-4 mb-4">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Application Installed & Active!</h4>
              <p className="text-xs text-slate-300">
                Aviation Safety Summit 2026 is installed on your device. All updates automatically trail and sync to your local installation.
              </p>
            </div>

            {/* Live Update & Sync Status */}
            <div className="p-4 bg-slate-900/90 border border-[#D4AF37]/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Sync & Version Status</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] font-bold">
                  {appVersion}
                </span>
              </div>

              {isUpdateAvailable ? (
                <div className="p-3 bg-amber-950/50 border border-amber-500/50 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    New Summit Data Available
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Latest protocol order of precedence and church leader speeches are downloaded and ready to apply.
                  </p>
                  <button
                    onClick={() => applyUpdate()}
                    disabled={isUpdating}
                    className="w-full py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span>{isUpdating ? 'Updating...' : 'Apply Update Now'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <span>Hierarchy & Speeches:</span>
                  <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 76 Dignitaries Synced
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => checkForUpdates()}
                  disabled={isChecking}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition border border-slate-700 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-[#D4AF37]' : ''}`} />
                  <span>{isChecking ? 'Checking...' : justChecked ? 'Checked: Up to Date' : 'Check for Updates'}</span>
                </button>
                <button
                  onClick={() => forceHardRefresh()}
                  className="py-2 px-3 bg-red-950/30 hover:bg-red-900/40 text-red-300 text-xs font-medium rounded-lg transition border border-red-800/40 cursor-pointer"
                  title="Purge local cache and reload fresh files"
                >
                  Reset Cache
                </button>
              </div>
            </div>
          </div>
        ) : isInstallable ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Install the official summit application to your device with 1 click. Runs standalone without browser address bars for a smooth native experience.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C358] to-[#B89025] hover:brightness-110 text-[#0A192F] font-bold text-sm tracking-wide shadow-xl flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>INSTALL SUMMIT APP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#D4AF37]">
              <Apple className="w-4 h-4" />
              <span>How to Install on iPhone / iPad (Safari)</span>
            </div>
            <ol className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <span>Tap the <strong className="text-white inline-flex items-center gap-1 mx-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700"><Share className="w-3 h-3 text-sky-400 inline" /> Share</strong> button in your Safari bottom navigation bar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <span>Scroll down the action sheet and select <strong className="text-white inline-flex items-center gap-1 mx-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700"><PlusSquare className="w-3 h-3 text-amber-400 inline" /> Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <span>Tap <strong className="text-emerald-400 font-semibold">Add</strong> in the top right corner. The summit app icon will immediately appear on your home screen!</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-sm font-bold text-[#D4AF37] mb-1">
              <Monitor className="w-4 h-4" />
              <span>Install from Browser Menu</span>
            </div>
            <p>
              To install this Progressive Web App:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li><strong>Chrome / Edge (Desktop):</strong> Click the install icon <Download className="w-3 h-3 inline text-amber-400 mx-1" /> in the right side of the URL address bar, or choose <em>Install Aviation Safety Summit 2026</em> from browser settings (⋮).</li>
              <li><strong>Android Chrome:</strong> Tap the three dots (⋮) menu and select <em>Add to Home screen</em> or <em>Install App</em>.</li>
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Official Summit Progressive Web App</span>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white underline underline-offset-2"
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
};
