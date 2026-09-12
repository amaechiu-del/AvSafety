import React, { useState } from 'react';
import { Download, Smartphone, Zap, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'floating' | 'banner' | 'footer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '', 
  variant = 'navbar' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already installed in standalone mode, show a small badge or hide
  if (isInstalled) {
    if (variant === 'floating' || variant === 'banner') return null;
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>App Installed</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  if (variant === 'floating') {
    return (
      <>
        <div className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 animate-bounce-subtle ${className}`}>
          <button
            onClick={handleClick}
            className="group flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#E5C358] hover:to-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-full shadow-2xl hover:shadow-[#D4AF37]/20 border border-white/20 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            title="Install Aviation Safety Summit 2026 Instant App"
          >
            <div className="w-6 h-6 rounded-full bg-[#0A192F] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Download className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="hidden sm:inline">Install Summit App</span>
            <span className="sm:hidden">Install App</span>
            <span className="px-1.5 py-0.5 bg-[#0A192F]/10 rounded text-[10px] font-extrabold text-[#0A192F]">
              PWA
            </span>
          </button>
        </div>
        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={`w-full bg-gradient-to-r from-[#0A192F] via-[#0E2A47] to-[#0A192F] border-b border-[#D4AF37]/30 py-2 px-4 ${className}`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-200 text-center sm:text-left">
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>
                <strong className="text-[#D4AF37]">Instant App Ready:</strong> Install Aviation Safety Summit 2026 directly to your phone or desktop for fast 1-tap offline access.
              </span>
            </div>
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37] hover:bg-[#E5C358] text-[#0A192F] font-bold rounded-lg transition text-[11px] uppercase tracking-wider shrink-0 cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install PWA App</span>
            </button>
          </div>
        </div>
        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Default navbar variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] hover:text-white transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer ${className}`}
        title="Install Summit Instant PWA App"
      >
        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Install App</span>
      </button>
      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
