/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, X, Image as ImageIcon, 
  ExternalLink, Sparkles, Shield, Clock, MessageSquare, RefreshCw 
} from 'lucide-react';
import { CommercialOrder, ArtworkFile } from '../../types';

interface ArtworkSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CommercialOrder | null;
  onArtworkUploaded: (updatedOrder: CommercialOrder) => void;
}

export default function ArtworkSubmissionModal({
  isOpen,
  onClose,
  order,
  onArtworkUploaded
}: ArtworkSubmissionModalProps) {
  const [fileType, setFileType] = useState<'LOGO' | 'FULL_AD' | 'VIDEO_CLIP' | 'DOCUMENT'>('LOGO');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [dimensions, setDimensions] = useState('1920x1080');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl.trim()) {
      setErrorMsg('Please enter a valid file asset URL or hosted design link (Dropbox, Google Drive, WeTransfer, S3, Cloudinary)');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/marketplace/orders/artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          fileType,
          fileName: fileName || `${order.companyName.toLowerCase().replace(/\s+/g, '_')}_${fileType.toLowerCase()}`,
          fileUrl,
          fileSize: '5.4 MB (Vector Master)',
          dimensions
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Artwork submission failed');
      }

      setSuccessMsg('Artwork successfully submitted to the Domislink Secretariat for review!');
      onArtworkUploaded(data.order);
      setFileUrl('');
      setFileName('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>APPROVED FOR PRINT & DISPLAY</span>
          </span>
        );
      case 'REVISION_REQUIRED':
        return (
          <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full text-xs font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>REVISION REQUIRED</span>
          </span>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>UNDER TECHNICAL REVIEW</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-xs font-semibold">
            PENDING ARTWORK SUBMISSION
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold text-base">Artwork Submission & Review Desk</h3>
                <span className="text-xs text-amber-400 font-mono">#{order.orderNumber}</span>
              </div>
              <p className="text-xs text-slate-400">{order.companyName} • Aviation Safety Summit 2026</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Status Tracker */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Current Approval Status</span>
              <div className="mt-1">{getStatusBadge(order.artworkStatus)}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Items Booked</span>
              <span className="text-sm font-bold text-slate-200">
                {order.items?.length || 0} Positions
              </span>
            </div>
          </div>

          {/* Booked Positions Specifications */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Target Dimensions for Your Booked Items:
            </h4>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{item.name}</span>
                    <span className="text-slate-400 text-[11px]">Category: {item.category} • Qty: {item.quantity}</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    High-Res Vector / 300 DPI CMYK
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Files List */}
          {order.artworkFiles && order.artworkFiles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Submitted Files ({order.artworkFiles.length}):
              </h4>
              <div className="space-y-2.5">
                {order.artworkFiles.map((file) => (
                  <div key={file.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-semibold text-xs text-white truncate max-w-[240px]">{file.fileName}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{file.fileType}</span>
                      </div>
                      <div>{getStatusBadge(file.status)}</div>
                    </div>
                    {file.adminFeedback && (
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-xs text-amber-200 flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-slate-300 text-[11px]">Domislink Compliance Feedback:</strong>
                          <span>{file.adminFeedback}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Asset Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-950/90 rounded-xl border border-amber-500/20 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Upload New Campaign Artwork / Brand Assets
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Asset Type</label>
                <select
                  value={fileType}
                  onChange={(e: any) => setFileType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="LOGO">Vector Brand Logo (.SVG, .AI, .EPS, .PNG)</option>
                  <option value="FULL_AD">Complete Print Banner / Poster Layout (.PDF, .TIFF)</option>
                  <option value="VIDEO_CLIP">Stage Screen HD Video Advert (.MP4, .MOV)</option>
                  <option value="DOCUMENT">Company Profile Editorial / Booklet Insertion (.PDF)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Asset Label / File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aerosat_Gold_Emblem_v2.svg"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1">
                Asset Link (Direct Image URL, Dropbox, Google Drive, WeTransfer, S3 Link)
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/... or https://domain.com/assets/logo.svg"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Direct vectors or shared drive links with view permissions are accepted.
              </span>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Secretariat...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Submit Artwork for Secretariat Clearance</span>
                </>
              )}
            </button>
          </form>

          {/* Domislink Design Assistance Callout */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="font-semibold text-white block">Don’t have finished artwork?</span>
              <span className="text-slate-400 text-[11px]">
                Domislink International Services Ltd offers in-house creative design and large-format printing.
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-slate-700 transition shrink-0 ml-3"
            >
              Request Design Help
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
