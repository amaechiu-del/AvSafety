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
  Lock,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Laptop,
  Activity
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

/**
 * Visual Sound Wave Indicator Component
 * Renders dynamic animated sound wave frequency bars with audio-level reactivity
 */
function SoundWaveVisualizer({
  isSpeaking,
  isGenerating,
  audioLevel = 0,
  voiceName = 'Zephyr',
  onStop
}: {
  isSpeaking: boolean;
  isGenerating: boolean;
  audioLevel?: number;
  voiceName?: string;
  onStop?: () => void;
}) {
  const bars = [
    { height: 35, delay: '0.05s' },
    { height: 65, delay: '0.15s' },
    { height: 95, delay: '0.25s' },
    { height: 50, delay: '0.10s' },
    { height: 85, delay: '0.20s' },
    { height: 100, delay: '0.30s' },
    { height: 60, delay: '0.12s' },
    { height: 90, delay: '0.22s' },
    { height: 45, delay: '0.08s' },
    { height: 80, delay: '0.18s' },
    { height: 95, delay: '0.28s' },
    { height: 55, delay: '0.14s' },
    { height: 85, delay: '0.24s' },
    { height: 40, delay: '0.06s' }
  ];

  if (!isSpeaking && !isGenerating) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A192F]/90 via-[#0E2A47]/95 to-[#0A192F]/90 border border-[#D4AF37]/50 px-4 py-2.5 shadow-[0_0_30px_rgba(212,175,55,0.3)] backdrop-blur-md animate-fadeIn flex flex-wrap items-center justify-between gap-3">
      {/* Background ambient audio glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-emerald-500/10 to-[#D4AF37]/10 animate-pulse pointer-events-none" />

      {/* Left Icon & Information */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C701B] flex items-center justify-center shadow-md">
            {isSpeaking ? (
              <Volume2 className="w-4 h-4 text-[#0A192F] animate-pulse" />
            ) : (
              <Loader2 className="w-4 h-4 text-[#0A192F] animate-spin" />
            )}
          </div>
          <span className="absolute -inset-1 rounded-xl bg-[#D4AF37]/40 animate-ping pointer-events-none" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              {isGenerating ? 'AI Generating Spoken Audio...' : `AI Speaking (${voiceName} Voice)`}
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            {isGenerating
              ? 'Synthesizing neural 24kHz PCM voice response...'
              : 'Streaming live broadcast audio to your speakers/headphones'}
          </p>
        </div>
      </div>

      {/* Center Dynamic Sound Wave Oscilloscope Bars */}
      <div className="flex items-end gap-1 h-7 px-3 py-0.5 bg-black/40 border border-slate-700/60 rounded-xl relative z-10">
        {bars.map((bar, i) => {
          const dynamicHeight = isSpeaking
            ? Math.max(25, Math.min(100, bar.height * (0.6 + (audioLevel / 100) * 0.8)))
            : bar.height * 0.5;

          return (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isGenerating
                  ? 'bg-gradient-to-t from-amber-500 via-amber-300 to-white animate-soundwave-bar'
                  : 'bg-gradient-to-t from-[#D4AF37] via-[#FFF2B2] to-emerald-300 shadow-[0_0_8px_rgba(212,175,55,0.7)] animate-soundwave-bar'
              }`}
              style={{
                height: `${dynamicHeight}%`,
                animationDuration: isSpeaking ? '0.8s' : '1.4s',
                animationDelay: bar.delay
              }}
            />
          );
        })}
      </div>

      {/* Right Stop Audio Button if currently speaking */}
      {isSpeaking && onStop && (
        <button
          onClick={onStop}
          className="relative z-10 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-[#D4AF37]/50 text-[#D4AF37] hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
          title="Stop Audio Playback"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>Stop Audio</span>
        </button>
      )}
    </div>
  );
}

export default function GeminiLiveVoiceModal({ isOpen, onClose }: GeminiLiveVoiceModalProps) {
  // Session States
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  // Permission & Error States
  const [permissionState, setPermissionState] = useState<'granted' | 'prompt' | 'denied' | 'unknown'>('unknown');
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Voice & Customisation
  const [activeVoice, setActiveVoice] = useState<'Zephyr' | 'Kore' | 'Puck' | 'Fenrir'>('Zephyr');
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
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

  // Check microphone permissions on mount
  useEffect(() => {
    if (!isOpen) return;

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state as any);
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state as any);
            if (permissionStatus.state === 'granted') {
              setShowPermissionHelp(false);
              setErrorMessage(null);
            }
          };
        })
        .catch(() => {
          setPermissionState('unknown');
        });
    }
  }, [isOpen]);

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
    setSpeakingMessageId(null);
  }, []);

  // Play audio buffer (raw PCM or WAV) or fallback to SpeechSynthesis
  const playAssistantSpeech = useCallback(async (text: string, messageId?: string, audioBase64?: string, mimeType?: string) => {
    if (isSpeakerMuted) return;
    stopAssistantAudio();

    if (messageId) {
      setSpeakingMessageId(messageId);
    }

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
              setSpeakingMessageId(null);
              currentAudioSourceRef.current = null;
            };

            source.start(0);
            return;
          }
        }
      } catch (err) {
        console.warn('[Gemini Voice] Web Audio decode note, using speech synthesis fallback:', err);
      }
    }

    // 2. High-quality browser speech synthesis fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'))
        || voices.find(v => v.lang.startsWith('en'));
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => setIsAssistantSpeaking(true);
      utterance.onend = () => {
        setIsAssistantSpeaking(false);
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setIsAssistantSpeaking(false);
        setSpeakingMessageId(null);
      };

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

      // Play audio response with sound wave animation
      playAssistantSpeech(replyText, assistantMessageId, audioData, audioMime);
    } catch (err: any) {
      console.error('[Gemini Voice] Query failed:', err);
      setErrorMessage(err.message || 'Unable to connect to voice engine. Please check network connection.');
      const fallbackText = 'I am currently processing offline. The Aviation Safety Summit 2026 takes place on Tuesday, 17 November 2026 at Lagos Marriott Hotel, convened by Captain AMAECHI UBADIKE.';
      const fallbackId = `fallback-${Date.now()}`;
      setTranscript(prev => [
        ...prev,
        {
          id: fallbackId,
          sender: 'gemini',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playAssistantSpeech(fallbackText, fallbackId);
    } finally {
      setIsProcessing(false);
    }
  }, [activeVoice, isProcessing, playAssistantSpeech, transcript]);

  // Start microphone streaming & audio metering with robust multi-stage permission handling
  const startMicSession = useCallback(async () => {
    setErrorMessage(null);
    setShowPermissionHelp(false);

    // 1. Check if mediaDevices is supported in this browser context
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Microphone access is not supported by your browser environment or requires an HTTPS secure origin.');
      setShowPermissionHelp(true);
      return;
    }

    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) throw new Error('Web Audio is not supported in this browser.');

      let stream: MediaStream;

      // Try preferred audio constraints first, with graceful fallback to simple constraints
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      } catch (advancedConstraintErr) {
        console.warn('[Gemini Voice] Advanced mic constraints failed, retrying with basic audio constraints:', advancedConstraintErr);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      mediaStreamRef.current = stream;
      setPermissionState('granted');
      setShowPermissionHelp(false);

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
      setPermissionState('denied');
      setIsSessionActive(false);
      setIsListening(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was blocked or denied by your browser settings.');
        setShowPermissionHelp(true);
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No physical microphone device was detected on your computer or phone.');
        setShowPermissionHelp(true);
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('Your microphone is currently in use by another application.');
        setShowPermissionHelp(true);
      } else {
        setErrorMessage(err.message || 'Microphone permission not granted. Please allow microphone access in your browser.');
        setShowPermissionHelp(true);
      }
    }
  }, [getAudioContext, sendQueryToGemini]);

  // Stop microphone session cleanly
  const stopMicSession = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
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
                    ? 'bg-[#D4AF37]/30 border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-audio-aura'
                    : isProcessing
                    ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                    : isListening
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                {isAssistantSpeaking ? (
                  <Volume2 className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                ) : isProcessing ? (
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
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
                      : isProcessing
                      ? 'bg-amber-400 animate-ping'
                      : isListening
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isAssistantSpeaking
                    ? `Gemini Speaking (${activeVoice} Voice)`
                    : isProcessing
                    ? 'Generating Voice Audio & Airspace Intelligence...'
                    : isListening
                    ? 'Live Microphone Active — Speak Now'
                    : 'Voice Engine Ready'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAssistantSpeaking
                  ? `Broadcasting via ${activeVoice} voice synthesis at 24kHz HD`
                  : isProcessing
                  ? 'Compiling protocol knowledge and synthesizing spoken audio stream'
                  : isListening
                  ? 'Real-time duplex voice recognition listening for your question'
                  : 'Press "Start Live Voice" or type below to interact'}
              </p>
            </div>
          </div>

          {/* Dynamic Audio Bars */}
          <div className="flex items-end gap-1 h-6">
            {[40, 75, 55, 90, 60, 85, 45, 95, 60, 80, 50, 70].map((height, i) => {
              const active = isSessionActive || isAssistantSpeaking || isProcessing;
              const scale = isAssistantSpeaking
                ? Math.max(25, (audioLevel * height) / 100)
                : isProcessing
                ? Math.max(20, (height * 0.7))
                : isListening
                ? Math.max(20, (audioLevel * height) / 100)
                : 15;

              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isAssistantSpeaking
                      ? 'bg-gradient-to-t from-[#D4AF37] to-white animate-soundwave-bar'
                      : isProcessing
                      ? 'bg-gradient-to-t from-amber-400 to-amber-200 animate-soundwave-bar'
                      : isListening
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: `${scale}%`,
                    animationDelay: `${(i % 5) * 0.15}s`
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Global Sound Wave Speaking Indicator Banner when AI is active */}
        {(isAssistantSpeaking || isProcessing) && (
          <div className="px-5 py-2.5 bg-[#081526] border-b border-[#D4AF37]/30 shrink-0">
            <SoundWaveVisualizer
              isSpeaking={isAssistantSpeaking}
              isGenerating={isProcessing}
              audioLevel={audioLevel}
              voiceName={activeVoice}
              onStop={stopAssistantAudio}
            />
          </div>
        )}

        {/* Microphone Permission Helper Modal / Banner */}
        {showPermissionHelp && (
          <div className="bg-[#1A0D15]/95 border-b-2 border-amber-500/60 p-4 sm:p-5 text-slate-200 shrink-0 animate-fadeIn shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[#0A192F] text-[10px] font-black uppercase tracking-wider">
                      Microphone Permission Guide
                    </span>
                    <span className="text-xs font-semibold text-amber-300">
                      Enable 1-Click Voice Mode
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    How to grant microphone access in your browser:
                  </h4>
                </div>
              </div>

              <button
                onClick={() => setShowPermissionHelp(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                aria-label="Dismiss guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3.5 text-xs text-slate-300">
              <div className="p-3 bg-black/40 border border-slate-700/60 rounded-xl space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-[#D4AF37]" /> On Chrome / Edge / Desktop:
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  1. Click the <strong>Lock / Settings icon</strong> (🔒 or 🎛️) at the left of your browser address bar.
                  <br />
                  2. Toggle <strong>Microphone</strong> to <strong>"Allow"</strong>.
                  <br />
                  3. Click the <em>"Try Granting Access"</em> button below.
                </p>
              </div>

              <div className="p-3 bg-black/40 border border-slate-700/60 rounded-xl space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" /> On iPhone (Safari) / Android:
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  1. Tap <strong>"aA"</strong> or <strong>Site Settings</strong> in your phone browser bar.
                  <br />
                  2. Select <strong>Website Settings ➔ Microphone ➔ Allow</strong>.
                  <br />
                  3. You can also type queries below and hear full Gemini AI voice answers!
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400 italic">
                Tip: You can ask questions via the text input below and Gemini will still speak the response aloud!
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPermissionHelp(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer transition"
                >
                  Use Text & Voice Playback
                </button>
                <button
                  onClick={startMicSession}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:brightness-110 text-[#0A192F] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Granting Access</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification Alert */}
        {errorMessage && !showPermissionHelp && (
          <div className="bg-red-950/80 border-b border-red-500/50 px-5 py-2.5 flex items-center justify-between text-xs text-red-200 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPermissionHelp(true)}
                className="underline text-amber-300 hover:text-amber-200 font-semibold cursor-pointer"
              >
                Help Fix This
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
          {transcript.map((item) => {
            const isUser = item.sender === 'user';
            const isCopied = copiedId === item.id;
            const isCurrentMessageSpeaking = isAssistantSpeaking && speakingMessageId === item.id;

            return (
              <div
                key={item.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C701B] p-0.5 shrink-0 mt-0.5 relative">
                    <div className="w-full h-full bg-[#0A192F] rounded-[10px] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    {isCurrentMessageSpeaking && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]" />
                      </span>
                    )}
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5`}>
                  {/* Inline Speaking Sound Wave Badge */}
                  {isCurrentMessageSpeaking && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider w-max shadow-sm animate-fadeIn">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                      <span>Speaking now ({activeVoice})</span>
                      <div className="flex items-end gap-0.5 h-3 pl-1 border-l border-[#D4AF37]/40">
                        <span className="w-0.5 h-full bg-[#D4AF37] rounded-full animate-soundwave-bar" style={{ animationDelay: '0ms' }} />
                        <span className="w-0.5 h-full bg-[#D4AF37] rounded-full animate-soundwave-bar" style={{ animationDelay: '150ms' }} />
                        <span className="w-0.5 h-full bg-[#D4AF37] rounded-full animate-soundwave-bar" style={{ animationDelay: '300ms' }} />
                        <span className="w-0.5 h-full bg-[#D4AF37] rounded-full animate-soundwave-bar" style={{ animationDelay: '80ms' }} />
                      </div>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md transition-all ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-tr-none'
                        : isCurrentMessageSpeaking
                        ? 'bg-[#0E2A47] border-2 border-[#D4AF37] text-slate-100 rounded-tl-none shadow-[0_0_20px_rgba(212,175,55,0.25)]'
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
                        onClick={() => playAssistantSpeech(item.text, item.id, item.audioBase64, item.mimeType)}
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

          {/* Processing Indicator with Audio Generation Shimmer Wave */}
          {isProcessing && (
            <div className="flex gap-3 justify-start animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-[#0A192F] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
              </div>
              <div className="bg-[#0E2A47]/80 border border-[#D4AF37]/40 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-200 space-y-2 max-w-[85%] shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D4AF37]">Synthesizing Gemini Voice Answer</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>

                {/* Animated sound wave bars while waiting for audio payload */}
                <div className="flex items-center gap-1.5 py-1">
                  {[30, 60, 90, 45, 75, 100, 50, 85, 40, 70].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-amber-400 to-amber-200 rounded-full animate-soundwave-bar"
                      style={{
                        height: `${h * 0.25}px`,
                        animationDelay: `${i * 0.12}s`
                      }}
                    />
                  ))}
                  <span className="text-[11px] text-slate-300 ml-2 font-mono">
                    Generating audio...
                  </span>
                </div>
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
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow"
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

              {permissionState === 'denied' && (
                <button
                  onClick={() => setShowPermissionHelp(true)}
                  className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="View Microphone Permission Help"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden md:inline">Permission Help</span>
                </button>
              )}
            </div>

            {/* Live Status indicator with mini soundwave */}
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              {isAssistantSpeaking ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>{activeVoice} Voice Active</span>
                </div>
              ) : isProcessing ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Audio...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Gemini 3.1 Flash Lite • Dual Live Protocol Engine</span>
                </div>
              )}
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
