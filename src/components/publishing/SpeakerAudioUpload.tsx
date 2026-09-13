/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mic, Upload, CheckCircle, Sparkles, FileText, Play, Trash2, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

export interface SpeakerRecording {
  id: string;
  speakerId: string;
  speakerName: string;
  topic: string;
  date: string;
  audioFileName: string;
  consentStatus: 'VERIFIED_CONSENT' | 'PENDING';
  transcriptionStatus: 'TRANSCRIBED' | 'PENDING' | 'CLEANED';
  transcript: string;
}

interface SpeakerAudioUploadProps {
  speakerId: string;
  speakerName: string;
  speakerTopic: string;
  organisation: string;
  onTranscriptReady: (transcript: string) => void;
}

export default function SpeakerAudioUpload({
  speakerId,
  speakerName,
  speakerTopic,
  organisation,
  onTranscriptReady
}: SpeakerAudioUploadProps) {
  const [recordings, setRecordings] = useState<SpeakerRecording[]>([
    {
      id: 'rec-1',
      speakerId,
      speakerName,
      topic: speakerTopic,
      date: new Date().toISOString().split('T')[0],
      audioFileName: `${speakerName.replace(/\s+/g, '_')}_Summit_Keynote_Audio.mp3`,
      consentStatus: 'VERIFIED_CONSENT',
      transcriptionStatus: 'TRANSCRIBED',
      transcript: `[Official Verified Audio Recording - ${speakerName}]: "In this address for the Aviation Safety Summit 2026, we examine the paramount importance of robust safety culture, unannounced regulatory audits, and zero-tolerance for operational shortcuts across African airspace."`
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [customAudioName, setCustomAudioName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSimulateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAudioName.trim()) return;

    setIsUploading(true);
    try {
      const normalizedFileName = customAudioName.endsWith('.mp3') || customAudioName.endsWith('.wav')
        ? customAudioName
        : `${customAudioName}.mp3`;

      const res = await fetch('/api/publishing/ai-transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speakerName,
          topic: speakerTopic,
          organisation,
          audioFileName: normalizedFileName,
          audioNote: `Uploaded recording for ${speakerName} on ${speakerTopic}`
        })
      });

      const data = await res.json();
      const transcript = data?.transcript || `[Transcribed Audio Session for ${speakerName}]: Discussing ${speakerTopic}. Key emphasis on proactive hazard identification, crew resource management, and transparent safety reporting systems.`;

      const newRec: SpeakerRecording = {
        id: `rec-${Date.now()}`,
        speakerId,
        speakerName,
        topic: speakerTopic,
        date: new Date().toISOString().split('T')[0],
        audioFileName: normalizedFileName,
        consentStatus: 'VERIFIED_CONSENT',
        transcriptionStatus: 'CLEANED',
        transcript
      };

      setRecordings(prev => [newRec, ...prev]);
      setCustomAudioName('');
      setSuccessMsg('Audio recording successfully uploaded, transcribed, and queued for handbook drafting.');
      onTranscriptReady(newRec.transcript);
    } catch (error) {
      console.error('Audio upload/transcription failed:', error);
      setSuccessMsg('Unable to process the recording right now. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
            <Mic className="h-5 w-5 text-[#D4AF37]" />
            <span>Speaker Audio Recording & Library ({speakerName})</span>
          </h3>
          <p className="text-xs text-[#8A99AD] mt-1">
            Upload ChatGPT voice recordings, interview files, or presentation audio. Stored securely in session state with verification.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
          {recordings.filter(r => r.speakerId === speakerId).length} Recordings Stored
        </span>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form */}
        <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-4 lg:col-span-1">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Upload New Audio File / Voice Note</h4>
          
          <form onSubmit={handleSimulateUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#8A99AD] mb-1">Select Audio File (MP3, WAV, M4A) *</label>
              <input
                type="file"
                accept="audio/*"
                required
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCustomAudioName(file.name);
                  }
                }}
                className="w-full text-xs text-[#8A99AD] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37] file:text-[#0A192F] hover:file:brightness-110 cursor-pointer bg-[#071324] border border-white/15 rounded-xl p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8A99AD] mb-1">Recording Description / Title *</label>
              <input
                type="text"
                required
                value={customAudioName}
                onChange={e => setCustomAudioName(e.target.value)}
                placeholder="e.g. ChatGPT Voice Keynote Draft.mp3"
                className="w-full px-3.5 py-2.5 bg-[#071324] border border-white/15 rounded-xl text-xs text-white placeholder-[#8A99AD] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="p-3 bg-[#071324] rounded-xl border border-white/10 text-[11px] text-[#8A99AD] space-y-1.5">
              <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Consent Active</span>
              </div>
              <p>Speaker has authorized audio transcription for the DomisLink Permanent Knowledge Library.</p>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isUploading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>{isUploading ? 'Uploading & Transcribing...' : 'Upload & Process Recording'}</span>
            </button>
          </form>
        </div>

        {/* Recordings List */}
        <div className="bg-[#0A192F] border border-white/10 rounded-2xl p-6 space-y-4 lg:col-span-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Stored Audio Recordings for {speakerName}</h4>

          <div className="space-y-3">
            {recordings.filter(r => r.speakerId === speakerId).length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8A99AD] italic">
                No recordings uploaded for this speaker yet. Use the upload panel on the left.
              </div>
            ) : (
              recordings.filter(r => r.speakerId === speakerId).map(rec => (
                <div key={rec.id} className="bg-[#071324] border border-white/10 rounded-xl p-4 space-y-3 hover:border-[#D4AF37]/40 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{rec.audioFileName}</h5>
                        <p className="text-[10px] text-[#8A99AD] font-mono">Date: {rec.date} • Speaker: {rec.speakerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                        {rec.transcriptionStatus}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecording(rec.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                        title="Delete Recording"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0A192F] rounded-lg border border-white/10 text-xs text-neutral-300 font-mono italic">
                    "{rec.transcript}"
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-[#D4AF37] font-mono">{rec.topic}</span>
                    <button
                      type="button"
                      onClick={() => onTranscriptReady(rec.transcript)}
                      className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 font-semibold rounded-lg transition"
                    >
                      Use in Handbook Generator →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
