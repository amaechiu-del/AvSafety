import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy } from 'lucide-react';

interface QrCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QrCodeGeneratorModal({ isOpen, onClose }: QrCodeGeneratorModalProps) {
  const [url, setUrl] = useState('');
  const [size, setSize] = useState(256);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white font-serif">Generate Booth QR Code</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Enter URL for QR Code</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/booth"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
            />
          </div>

          {url && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl">
              <QRCodeSVG value={url} size={size} />
            </div>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              alert('URL copied to clipboard!');
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy URL</span>
          </button>
        </div>
      </div>
    </div>
  );
}
