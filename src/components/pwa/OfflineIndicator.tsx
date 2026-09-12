import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-xl bg-[#0A192F]/95 border border-amber-500/50 px-4 py-2.5 text-xs text-white shadow-2xl backdrop-blur-md animate-fadeIn">
      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div>
        <div className="font-bold text-amber-300">Offline Mode Active</div>
        <div className="text-[11px] text-slate-300">
          Summit schedule, delegate guides & cached records remain fully available.
        </div>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition ml-1"
        title="Check connection"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
