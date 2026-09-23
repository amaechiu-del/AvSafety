/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Loader2,
  Radio,
  Send,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Square,
  CheckCircle2,
  Volume1,
  Copy,
  Check,
  Headphones,
  Sliders,
  Zap,
  Info
} from 'lucide-react';

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TranscriptItem {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  time: string;
  audioBase64?: string;
  mimeType?: string;
}

const AVAILABLE_VOICES = [
  { id: 'Zephyr', name: 'Zephyr (Warm & Authoritative)', description: 'Balanced commanding aviation tone' },
  { id: 'Kore', name: 'Kore (Calm & Professional)', description: 'Crisp, articulate broadcast tone' },
  { id: 'Puck', name: 'Puck (Engaging & Clear)', description: 'Dynamic, modern technical delivery' },
  { id: 'Fenrir', name: 'Fenrir (Deep & Resonant)', description: 'Commanding executive voice' }
];

const QUICK_PROMPTS = [
  'Who is the Convener & Author?',
  'What is the Summit Theme?',
  'Tell me about the Church Leaders & Dignitaries',
  'What is the Dying Library White Paper?',
  'How do I register for a Delegate Pass?'
];

export default function GeminiLiveVoiceModal({ isOpen, onClose }: GeminiLiveVoiceModalProps) {
  // Session States
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  // Voice & Customisation
  const [activeVoice, setActiveVoice] = useState<'Zephyr' | 'Kore' | 'Puck' | 'Fenrir'>('Zephyr');
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Text query input
  const [inputText, setInputText] = useState('');
  const [interimSpeech, setInterimSpeech] = useState('');

  // Conversation transcripts
  const [transcript, setTranscript] = useState<TranscriptItem[]>([
    {
      id: 'welcome-msg',
      sender: 'gemini',
      text: 'Welcome to Gemini Live Voice for the DomisLink Aviation Safety Summit 2026. Click "Start Live Voice" to talk in real-time, or choose a topic below to explore our safety protocols, author biography, and dignitary compendium.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Audio Context & Media Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll conversation
  const scrollToBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [transcript, interimSpeech, isOpen, scrollToBottom]);

  // Initialize or get AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  // Stop currently playing assistant audio
  const stopAssistantAudio = useCallback(() => {
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
        currentAudioSourceRef.current.disconnect();
      } catch (_) {}
      currentAudioSourceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAssistantSpeaking(false);
  }, []);

  // Play audio buffer (raw PCM or WAV) or fallback to SpeechSynthesis
  const playAssistantSpeech = useCallback(async (text: string, audioBase64?: string, mimeType?: string) => {
    if (isSpeakerMuted) return;
    stopAssistantAudio();

    // 1. If Gemini returned raw audio, decode and play through Web Audio API
    if (audioBase64) {
      try {
        const audioCtx = getAudioContext();
        if (audioCtx) {
          const binaryStr = atob(audioBase64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }

          let audioBuffer: AudioBuffer | null = null;

          // Check if PCM L16 24kHz
          if (mimeType?.includes('audio/l16') || mimeType?.includes('rate=24000') || !mimeType?.includes('wav')) {
            const int16Data = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
            const sampleRate = 24000;
            audioBuffer = audioCtx.createBuffer(1, int16Data.length, sampleRate);
            const channel = audioBuffer.getChannelData(0);
            for (let i = 0; i < int16Data.length; i++) {
              channel[i] = int16Data[i] / 32768.0;
            }
          } else {
            // Standard WAV/MP3 container
            audioBuffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
          }

          if (audioBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;

            // Connect to visualizer analyser
            if (analyserRef.current) {
              source.connect(analyserRef.current);
            }
            source.connect(audioCtx.destination);

            currentAudioSourceRef.current = source;
            setIsAssistantSpeaking(true);

            source.onended = () => {
              setIsAssistantSpeaking(false);
              currentAudioSourceRef.current = null;
            };

            source.start(0);
            return;
          }
        }
      } catch (err) {
        console.warn('[Gemini Voice] Web Audio decode failed, falling back to speech synthesis:', err);
      }
    }

    // 2. High-quality browser speech synthesis fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try selecting standard professional English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'))
        || voices.find(v => v.lang.startsWith('en'));
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => setIsAssistantSpeaking(true);
      utterance.onend = () => setIsAssistantSpeaking(false);
      utterance.onerror = () => setIsAssistantSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [getAudioContext, isSpeakerMuted, stopAssistantAudio]);

  // Submit query to backend Gemini endpoint
  const sendQueryToGemini = useCallback(async (queryText: string, audioBase64?: string, mimeType?: string) => {
    if ((!queryText.trim() && !audioBase64) || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setInterimSpeech('');

    const userMessageId = `user-${Date.now()}`;
    const userText = queryText.trim() || '🎤 Voice Query';

    // Add user message to transcript
    setTranscript(prev => [
      ...prev,
      {
        id: userMessageId,
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Build message history for conversational context
    const historyPayload = transcript.slice(-6).map(t => ({
      role: t.sender === 'user' ? 'user' : 'model',
      text: t.text
    }));

    try {
      const response = await fetch('/api/gemini/voice-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText.trim(),
          audioBase64: audioBase64 || null,
          mimeType: mimeType || 'audio/webm',
          history: historyPayload,
          voice: activeVoice
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.replyText || 'Thank you for your inquiry regarding the Aviation Safety Summit 2026.';
      const audioData = data.audioBase64;
      const audioMime = data.mimeType;

      const assistantMessageId = `gemini-${Date.now()}`;
      setTranscript(prev => [
        ...prev,
        {
          id: assistantMessageId,
          sender: 'gemini',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          audioBase64: audioData,
          mimeType: audioMime
        }
      ]);

      // Play audio response
      playAssistantSpeech(replyText, audioData, audioMime);
    } catch (err: any) {
      console.error('[Gemini Voice] Query failed:', err);
      setErrorMessage(err.message || 'Unable to connect to voice engine. Please check network connection.');
      const fallbackText = 'I am currently processing offline. The Aviation Safety Summit 2026 takes place on Tuesday, 17 November 2026 at Lagos Marriott Hotel, convened by Captain AMAECHI UBADIKE.';
      setTranscript(prev => [
        ...prev,
        {
          id: `fallback-${Date.now()}`,
          sender: 'gemini',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playAssistantSpeech(fallbackText);
    } finally {
      setIsProcessing(false);
    }
  }, [activeVoice, isProcessing, playAssistantSpeech, transcript]);

  // Start microphone streaming & audio metering
  const startMicSession = useCallback(async () => {
    try {
      setErrorMessage(null);
      const audioCtx = getAudioContext();
      if (!audioCtx) throw new Error('Web Audio is not supported in this browser.');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;

      // Setup Web Audio Analyser for live frequency metering
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const pcmData = new Uint8Array(analyser.frequencyBinCount);
      const updateMeter = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(pcmData);
          let sum = 0;
          for (let i = 0; i < pcmData.length; i++) {
            sum += pcmData[i];
          }
          const avg = sum / pcmData.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        }
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();

      // Initialize SpeechRecognition if available for instantaneous transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognizer = new SpeechRecognition();
          recognizer.continuous = true;
          recognizer.interimResults = true;
          recognizer.lang = 'en-US';

          recognizer.onresult = (event: any) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
              } else {
                interim += event.results[i][0].transcript;
              }
            }
            if (interim) {
              setInterimSpeech(interim);
            }
            if (final.trim()) {
              setInterimSpeech('');
              sendQueryToGemini(final);
            }
          };

          recognizer.onerror = (e: any) => {
            if (e.error !== 'no-speech') {
              console.warn('[SpeechRecognition] Note:', e.error);
            }
          };

          recognizer.start();
          speechRecognitionRef.current = recognizer;
        } catch (recErr) {
          console.warn('[SpeechRecognition] Init warning:', recErr);
        }
      }

      // Initialize MediaRecorder for audio recording fallback
      try {
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/webm';

        const recorder = new MediaRecorder(stream, { mimeType: mime });
        audioChunksRef.current = [];

        recorder.ondataavailable = (evt) => {
          if (evt.data.size > 0) {
            audioChunksRef.current.push(evt.data);
          }
        };

        recorder.onstop = async () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: mime });
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = (reader.result as string).split(',')[1];
              if (base64Data && !speechRecognitionRef.current) {
                sendQueryToGemini('', base64Data, mime);
              }
            };
            reader.readAsDataURL(audioBlob);
            audioChunksRef.current = [];
          }
        };

        mediaRecorderRef.current = recorder;
      } catch (recInitErr) {
        console.warn('[MediaRecorder] Init note:', recInitErr);
      }

      setIsSessionActive(true);
      setIsListening(true);
    } catch (err: any) {
      console.error('[Gemini Live Voice] Mic start error:', err);
      setErrorMessage(err.message || 'Microphone access denied. Please allow microphone permissions in your browser.');
      setIsSessionActive(false);
      setIsListening(false);
    }
  }, [getAudioContext, sendQueryToGemini]);

  // Stop microphone session cleanly
  const stopMicSession = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (_) {}
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
    setIsListening(false);
    setIsSessionActive(false);
  }, []);

  // Cleanup on modal close or unmount
  useEffect(() => {
    if (!isOpen) {
      stopMicSession();
      stopAssistantAudio();
    }
  }, [isOpen, stopMicSession, stopAssistantAudio]);

  // Handle Form text submit
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const query = inputText;
    setInputText('');
    sendQueryToGemini(query);
  };

  // Copy transcript text to clipboard
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Clear conversation history
  const handleClearChat = () => {
    stopAssistantAudio();
    setTranscript([
      {
        id: `welcome-${Date.now()}`,
        sender: 'gemini',
        text: 'Conversation reset. Ask any question regarding the Aviation Safety Summit 2026, Convener AMAECHI UBADIKE, or our protocol dignitaries.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      id="gemini-live-voice-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Gemini Live Voice Assistant"
    >
      <div
        id="gemini-live-voice-container"
        className="bg-gradient-to-br from-[#0A192F] via-[#0E2A47] to-[#060D1A] border-2 border-[#D4AF37]/60 rounded-3xl w-full max-w-3xl shadow-[0_0_80px_rgba(212,175,55,0.25)] flex flex-col relative overflow-hidden h-[750px] max-h-[92vh] text-white"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/30 bg-[#0A192F]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C701B] p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-[#0A192F] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              {isSessionActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-wide text-white uppercase font-serif">
                  Gemini Live Voice
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-mono text-[10px] font-bold">
                  PRO AUDIO
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official Voice Protocol Assistant • DomisLink Aviation Safety Summit 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                showSettings
                  ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37]'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Voice & Audio Settings"
              aria-label="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Reset Conversation"
              aria-label="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950 hover:text-red-300 text-slate-400 border border-slate-700 transition cursor-pointer"
              title="Close Voice Assistant"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio / Voice Customisation Drawer */}
        {showSettings && (
          <div className="bg-[#050D1A] border-b border-[#D4AF37]/30 px-5 py-3.5 space-y-3 shrink-0 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" /> Select Gemini Vocal Persona:
              </span>
              <span className="text-slate-400 text-[11px]">Audio output sampled at 24kHz PCM</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVoice(v.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    activeVoice === v.id
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{v.id}</span>
                    {activeVoice === v.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{v.name.split('(')[1]?.replace(')', '')}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Audio Visualizer Radar Banner */}
        <div className="bg-gradient-to-r from-[#071322] via-[#0E233D] to-[#071322] border-b border-slate-800 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isAssistantSpeaking
                    ? 'bg-[#D4AF37]/30 border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)]'
                    : isListening
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                {isAssistantSpeaking ? (
                  <Volume2 className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                ) : isListening ? (
                  <Mic className="w-5 h-5 text-emerald-400 animate-pulse" />
                ) : (
                  <Radio className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAssistantSpeaking
                      ? 'bg-[#D4AF37] animate-ping'
                      : isListening
                      ? 'bg-emerald-400 animate-pulse'
                      : isProcessing
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isAssistantSpeaking
                    ? 'Gemini Is Speaking...'
                    : isProcessing
                    ? 'Analyzing Airspace Knowledge...'
                    : isListening
                    ? 'Live Microphone Active — Speak Now'
                    : 'Voice Engine Ready'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAssistantSpeaking
                  ? `Broadcasting via ${activeVoice} voice synthesis`
                  : isListening
                  ? 'Real-time duplex voice recognition listening for your question'
                  : 'Press "Start Live Voice" or type below to interact'}
              </p>
            </div>
          </div>

          {/* Dynamic Audio Bars */}
          <div className="flex items-end gap-1 h-6">
            {[40, 75, 55, 90, 60, 85, 45, 95].map((height, i) => {
              const active = isSessionActive || isAssistantSpeaking;
              const scale = active ? Math.max(20, (audioLevel * height) / 100) : 15;
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isAssistantSpeaking
                      ? 'bg-[#D4AF37]'
                      : isListening
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${scale}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="bg-red-950/80 border-b border-red-500/50 px-5 py-2.5 flex items-center justify-between text-xs text-red-200 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
          {transcript.map((item) => {
            const isUser = item.sender === 'user';
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C701B] p-0.5 shrink-0 mt-0.5">
                    <div className="w-full h-full bg-[#0A192F] rounded-[10px] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-tr-none'
                        : 'bg-[#0E2A47]/80 border border-[#D4AF37]/30 text-slate-100 rounded-tl-none backdrop-blur-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{item.text}</p>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{item.time}</span>
                    <button
                      onClick={() => handleCopyText(item.id, item.text)}
                      className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                      title="Copy text"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {!isUser && (
                      <button
                        onClick={() => playAssistantSpeech(item.text, item.audioBase64, item.mimeType)}
                        className="hover:text-[#D4AF37] transition flex items-center gap-1 cursor-pointer ml-1"
                        title="Replay Voice Audio"
                      >
                        <Volume1 className="w-3 h-3" />
                        <span>Replay</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-700/50 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 text-blue-200">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Interim Real-time Speech Caption */}
          {interimSpeech && (
            <div className="flex gap-3 justify-end animate-pulse">
              <div className="max-w-[85%] bg-blue-900/40 border border-blue-400/40 rounded-2xl rounded-tr-none px-4 py-2.5 text-xs text-blue-200 italic">
                🎤 {interimSpeech}...
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex gap-3 justify-start animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-[#0A192F] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
              </div>
              <div className="bg-[#0E2A47]/60 border border-[#D4AF37]/20 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-300 ml-1">Consulting Summit Policy & Protocol Archives...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Prompt Chips */}
        <div className="px-4 py-2 bg-[#06101E] border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] whitespace-nowrap flex items-center gap-1">
            <Zap className="w-3 h-3" /> Quick Inquiries:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendQueryToGemini(prompt)}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-[#D4AF37]/20 border border-slate-700 hover:border-[#D4AF37]/60 text-slate-300 hover:text-white text-xs whitespace-nowrap transition cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Audio Controls & Input Area */}
        <div className="p-4 bg-[#0A192F] border-t border-[#D4AF37]/30 space-y-3 shrink-0">
          {/* Main Action Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Live Mic Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isSessionActive ? (
                <button
                  id="start-live-voice-btn"
                  onClick={startMicSession}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Live Voice</span>
                </button>
              ) : (
                <button
                  id="end-live-voice-btn"
                  onClick={stopMicSession}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Live Voice</span>
                </button>
              )}

              {isAssistantSpeaking && (
                <button
                  onClick={stopAssistantAudio}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Mute Current Speech"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Audio</span>
                </button>
              )}

              {/* Speaker Toggle */}
              <button
                onClick={() => {
                  const next = !isSpeakerMuted;
                  setIsSpeakerMuted(next);
                  if (next) stopAssistantAudio();
                }}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  isSpeakerMuted
                    ? 'bg-red-950/60 border-red-500/50 text-red-300'
                    : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title={isSpeakerMuted ? 'Unmute Assistant Audio' : 'Mute Assistant Audio'}
              >
                {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Status indicator */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Gemini 3.1 Flash Lite • Dual Live Protocol Engine</span>
            </div>
          </div>

          {/* Text Input Fallback Bar */}
          <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type a question for Gemini voice..."
              disabled={isProcessing}
              className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C358] text-[#0A192F] font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
