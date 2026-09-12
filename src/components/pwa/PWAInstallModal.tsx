import React from 'react';
import { 
  Download, X, Smartphone, Monitor, Apple, CheckCircle2, 
  Zap, WifiOff, ShieldCheck, Share, PlusSquare, ArrowRight 
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

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

        {/* Context-aware install instructions */}
        {isInstalled ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">Application Already Installed!</h4>
            <p className="text-xs text-slate-300">
              You can launch Aviation Safety Summit 2026 anytime directly from your device home screen or applications menu.
            </p>
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
