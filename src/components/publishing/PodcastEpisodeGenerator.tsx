/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Radio, Sparkles, Mic, FileText, CheckCircle, BookOpen, Clock, Calendar, ExternalLink } from 'lucide-react';
import { INITIAL_SPEAKER_RECORDS, SpeakerKnowledgeRecord } from '../../data/speakerPublicationData';

interface PodcastEpisodeGeneratorProps {
  onEpisodeGenerated?: (episodeTitle: string) => void;
}

export default function PodcastEpisodeGenerator({ onEpisodeGenerated }: PodcastEpisodeGeneratorProps) {
  const [records, setRecords] = useState<SpeakerKnowledgeRecord[]>(INITIAL_SPEAKER_RECORDS);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>(records[0].id);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentRecord = records.find(r => r.id === selectedSpeakerId) || records[0];

  const [episodeTitle, setEpisodeTitle] = useState<string>(`Episode #${currentRecord.podcastEpisodeNumber}: ${currentRecord.approvedTopic}`);
  const [episodeDescription, setEpisodeDescription] = useState<string>(currentRecord.podcastDescription);
  const [showNotes, setShowNotes] = useState<string>(currentRecord.showNotes.join('\n'));
  const [keyTakeaways, setKeyTakeaways] = useState<string>(currentRecord.keyTakeaways.join('\n'));
  const [status, setStatus] = useState<SpeakerKnowledgeRecord['podcastStatus']>(currentRecord.podcastStatus);

  const handleSpeakerChange = (id: string) => {
    setSelectedSpeakerId(id);
    const rec = records.find(r => r.id === id);
    if (rec) {
      setEpisodeTitle(`Episode #${rec.podcastEpisodeNumber}: ${rec.approvedTopic}`);
      setEpisodeDescription(rec.podcastDescription);
      setShowNotes(rec.showNotes.join('\n'));
      setKeyTakeaways(rec.keyTakeaways.join('\n'));
      setStatus(rec.podcastStatus);
    }
  };

  const handleGenerateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/publishing/ai-generate-podcast-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speakerName: currentRecord.speakerName,
          organisation: currentRecord.organisation,
          approvedTopic: currentRecord.approvedTopic,
          editedTranscript: currentRecord.editedTranscript,
          podcastEpisodeNumber: currentRecord.podcastEpisodeNumber
        })
      });

      const data = await res.json();
      const episode = data?.episode;
      let finalTitle = episodeTitle;
      if (data?.success && episode) {
        finalTitle = episode.episodeTitle || episodeTitle;
        setEpisodeTitle(episode.episodeTitle || episodeTitle);
        setEpisodeDescription(episode.episodeDescription || episodeDescription);
        if (Array.isArray(episode.showNotes)) {
          setShowNotes(episode.showNotes.join('\n'));
        }
        if (Array.isArray(episode.keyTakeaways)) {
          setKeyTakeaways(episode.keyTakeaways.join('\n'));
        }
        if (episode.status) {
          setStatus(episode.status);
        }
      }

      setSuccessMsg('Podcast episode metadata, show notes, and chapter markers successfully generated from approved speaker recording and transcript!');
      if (onEpisodeGenerated) {
        onEpisodeGenerated(finalTitle);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (error) {
      console.error('Episode generation failed:', error);
      setSuccessMsg('Unable to reach podcast generation service. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono uppercase">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>DomisLink Podcast Episode & Live Summit Generator (Sections 11 & 12)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
            Generate Podcast Episode from Speaker Recording
          </h3>
          <p className="text-xs text-[#8A99AD] mt-1">
            Inputs: Approved speaker recording, edited transcript, speaker biography, summit information, and verified key questions.
          </p>
        </div>

        <select
          value={selectedSpeakerId}
          onChange={e => handleSpeakerChange(e.target.value)}
          className="px-4 py-2.5 bg-[#071324] border border-[#D4AF37]/40 text-xs font-mono text-white rounded-xl focus:border-[#D4AF37] focus:outline-none"
        >
          {records.map(rec => (
            <option key={rec.id} value={rec.id}>
              {rec.speakerName} ({rec.organisation})
            </option>
          ))}
        </select>
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

      <form onSubmit={handleGenerateEpisode} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Inputs Source Material */}
          <div className="bg-[#071324] border border-white/10 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span>Source Materials & Speaker Profile</span>
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#0A192F] rounded-lg border border-white/10 space-y-1">
                <span className="text-[#8A99AD] block">Speaker & Position:</span>
                <span className="text-white font-bold">{currentRecord.speakerName} ({currentRecord.position}, {currentRecord.organisation})</span>
              </div>

              <div className="p-3 bg-[#0A192F] rounded-lg border border-white/10 space-y-1">
                <span className="text-[#8A99AD] block">Approved Topic & Session:</span>
                <span className="text-[#D4AF37] font-bold">{currentRecord.approvedTopic} ({currentRecord.session})</span>
              </div>

              <div className="p-3 bg-[#0A192F] rounded-lg border border-white/10 space-y-1">
                <span className="text-[#8A99AD] block">Original Audio & Transcript File:</span>
                <span className="text-emerald-400 font-bold">{currentRecord.audioFileName} (Verified & Cleaned)</span>
              </div>

              <div className="space-y-1 pt-1">
                <label className="block text-[#8A99AD]">Edited Transcript Excerpt:</label>
                <textarea
                  readOnly
                  rows={4}
                  value={currentRecord.editedTranscript}
                  className="w-full px-3 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-neutral-300 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Generated Episode Metadata */}
          <div className="bg-[#071324] border border-white/10 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Generated Episode Output & Metadata</span>
            </h4>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-[#8A99AD] mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  value={episodeTitle}
                  onChange={e => setEpisodeTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0A192F] border border-white/15 rounded-xl text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8A99AD] mb-1">Episode Description *</label>
                <textarea
                  rows={3}
                  required
                  value={episodeDescription}
                  onChange={e => setEpisodeDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0A192F] border border-white/15 rounded-xl text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#8A99AD] mb-1">Show Notes / Timestamps (one per line)</label>
                  <textarea
                    rows={3}
                    value={showNotes}
                    onChange={e => setShowNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-white font-mono text-[11px] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#8A99AD] mb-1">Key Takeaways (one per line)</label>
                  <textarea
                    rows={3}
                    value={keyTakeaways}
                    onChange={e => setKeyTakeaways(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-white font-mono text-[11px] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#8A99AD] mb-1">Podcast Release State</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="px-3 py-1.5 bg-[#0A192F] border border-white/15 text-xs font-mono text-[#D4AF37] rounded-xl"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="EDITORIAL_REVIEW">EDITORIAL REVIEW</option>
                    <option value="SPEAKER_REVIEW">SPEAKER REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center space-x-2 cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  {isGenerating ? <Sparkles className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
                  <span>{isGenerating ? 'Generating Episode Package...' : 'Generate & Save Episode'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
