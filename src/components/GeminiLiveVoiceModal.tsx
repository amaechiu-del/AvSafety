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
  Compass,
  CheckCircle2,
  Volume1
} from 'lucide-react';

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TranscriptItem {
  sender: 'user' | 'gemini';
  text: string;
  time: string;
}

export default function GeminiLiveVoiceModal({ isOpen, onClose }: GeminiLiveVoiceModalProps) {
  // Session States
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  // Audio & Hardware states
  const [audioLevel, setAudioLevel] = useState(0);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [activeVoice, setActiveVoice] = useState<'Zephyr' | 'Kore' | 'Puck' | 'Fenrir'>('Zephyr');

  // Transcripts & Input
  const [transcript, setTranscript] = useState<TranscriptItem[]>([
    {
      sender: 'gemini',
      text: 'Welcome to Gemini Live Voice for the DomisLink Aviation Safety Summit 2026. Click "Start Live Microphone" or ask anything about Convener AMAECHI UBADIKE, the summit theme, book launch, or safety white paper.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [interimSpeech, setInterimSpeech] = useState<string>('');
  const [textInput, setTextInput] = useState('');

  // Media & Web Audio Refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isSessionActiveRef = useRef(false);
  const isAssistantSpeakingRef = useRef(false);
  const isMicMutedRef = useRef(false);

  // Keep refs in sync with state for callbacks
  useEffect(() => {
    isSessionActiveRef.current = isSessionActive;
  }, [isSessionActive]);

  useEffect(() => {
    isAssistantSpeakingRef.current = isAssistantSpeaking;
  }, [isAssistantSpeaking]);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  // Scroll to bottom when transcript changes or interim speech arrives
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, interimSpeech]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopAllMedia();
    }
  }, [isOpen]);

  // Initialize AudioContext lazily
  const getOrCreateAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioContextRef.current = new AudioCtxClass();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Stop all active media, streams, and speech recognition
  const stopAllMedia = useCallback(() => {
    // 1. Stop animation loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 2. Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    // 3. Stop active audio playing
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {
        // ignore
      }
      currentAudioSourceRef.current = null;
    }

    // 4. Cancel browser TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 5. Stop microphone media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      mediaStreamRef.current = null;
    }

    setIsSessionActive(false);
    setIsListening(false);
    setIsProcessing(false);
    setIsAssistantSpeaking(false);
    setIsConnecting(false);
    setAudioLevel(0);
    setInterimSpeech('');
  }, []);

  // Play PCM Base64 audio stream returned by Gemini TTS
  const playPCMBase64 = useCallback((base64Data: string, sampleRate = 24000): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audioCtx = getOrCreateAudioContext();
        if (!audioCtx) {
          return reject(new Error('AudioContext unavailable'));
        }

        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
          float32Array[i] = int16Array[i] / 32768.0;
        }

        const audioBuffer = audioCtx.createBuffer(1, float32Array.length, sampleRate);
        audioBuffer.getChannelData(0).set(float32Array);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);

        currentAudioSourceRef.current = source;

        source.onended = () => {
          currentAudioSourceRef.current = null;
          resolve();
        };

        source.start(0);
      } catch (err) {
        console.warn('PCM playback failed:', err);
        reject(err);
      }
    });
  }, [getOrCreateAudioContext]);

  // Speak assistant response aloud (Gemini PCM audio with SpeechSynthesis fallback)
  const speakAssistantResponse = useCallback(async (text: string, audioBase64?: string | null) => {
    if (isSpeakerMuted) {
      return;
    }

    setIsAssistantSpeaking(true);
    isAssistantSpeakingRef.current = true;

    // Pause speech recognition while speaking to prevent feedback loops
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    try {
      if (audioBase64) {
        // Try Gemini 24kHz PCM audio playback first
        await playPCMBase64(audioBase64, 24000);
      } else if ('speechSynthesis' in window) {
        // Fallback to Web Speech Synthesis API
        await new Promise<void>((resolve) => {
          window.speechSynthesis.cancel();
          const cleanText = text.replace(/[*_#`~]/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          window.speechSynthesis.speak(utterance);
        });
      }
    } catch (e) {
      console.warn('Speech playback error, falling back to speech synthesis:', e);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*_#`~]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsAssistantSpeaking(false);
      isAssistantSpeakingRef.current = false;

      // Resume speech recognition if session is still alive and not muted
      if (isSessionActiveRef.current && !isMicMutedRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          // ignore already started
        }
      }
    }
  }, [isSpeakerMuted, playPCMBase64]);

  // Send a query (spoken or typed) to the Gemini backend
  const sendVoiceQuery = useCallback(async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    // Add user message to transcript
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript(prev => [...prev, { sender: 'user', text: trimmed, time: userTime }]);
    setInterimSpeech('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/gemini/voice-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          voice: activeVoice,
          includeAudio: !isSpeakerMuted,
          history: transcript.slice(-6)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to query live voice assistant');
      }

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscript(prev => [...prev, {
        sender: 'gemini',
        text: data.text,
        time: replyTime
      }]);

      setIsProcessing(false);

      // Speak assistant reply
      await speakAssistantResponse(data.text, data.audioBase64);

    } catch (err: any) {
      console.error('Error querying voice assistant:', err);
      setIsProcessing(false);
      setTranscript(prev => [...prev, {
        sender: 'gemini',
        text: 'I apologize, but I encountered an error connecting to the airspace voice server. Please try asking again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [activeVoice, isSpeakerMuted, speakAssistantResponse, transcript]);

  // Initialize Speech Recognition (Web Speech API)
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      console.warn('SpeechRecognition API not available in this browser');
      return null;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalPhrase = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalPhrase += transcriptChunk;
          } else {
            currentInterim += transcriptChunk;
          }
        }

        if (currentInterim) {
          setInterimSpeech(currentInterim);
        }

        if (finalPhrase.trim()) {
          setInterimSpeech('');
          sendVoiceQuery(finalPhrase.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionError('Microphone access was denied in browser permissions. Please allow microphone access.');
          stopAllMedia();
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically restart if session is active and not muted
        if (isSessionActiveRef.current && !isAssistantSpeakingRef.current && !isMicMutedRef.current) {
          try {
            recognition.start();
            setIsListening(true);
          } catch (e) {
            // Already started or busy
          }
        }
      };

      return recognition;
    } catch (e) {
      console.error('Failed to create SpeechRecognition:', e);
      return null;
    }
  }, [sendVoiceQuery, stopAllMedia]);

  // Start Live Session (requests mic, sets up real audio visualizer, starts recognition)
  const startLiveSession = async () => {
    setIsConnecting(true);
    setMicPermissionError(null);

    try {
      // 1. Hardware Microphone Check & Stream Acquisition
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio capture.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });
      mediaStreamRef.current = stream;

      // 2. Set up Web Audio API Analyser for real physical volume monitoring
      const audioCtx = getOrCreateAudioContext();
      if (audioCtx) {
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateAudioMeter = () => {
          if (!isSessionActiveRef.current && !mediaStreamRef.current) return;
          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Scale to 0-100
          const scaled = Math.min(100, Math.round((avg / 128) * 100));
          setAudioLevel(scaled);

          animationFrameRef.current = requestAnimationFrame(updateAudioMeter);
        };

        animationFrameRef.current = requestAnimationFrame(updateAudioMeter);
      }

      // 3. Set up Speech Recognition
      const recognition = initSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.warn('Initial recognition.start failed:', e);
        }
      }

      setIsSessionActive(true);
      isSessionActiveRef.current = true;
      setIsConnecting(false);
      setIsListening(true);

      // Announce connection in transcript
      const welcomeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscript(prev => [
        ...prev,
        {
          sender: 'gemini',
          text: 'Microphone active! I am listening. Speak into your microphone to ask about Summit 2026, Convener AMAECHI UBADIKE, or the aviation book launch.',
          time: welcomeTime
        }
      ]);

    } catch (err: any) {
      console.error('Microphone capture error:', err);
      setIsConnecting(false);
      setIsSessionActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermissionError(
          'Microphone access was denied. Please allow microphone permissions in your browser settings (click the lock or camera icon in the URL bar) and retry.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicPermissionError('No microphone hardware was detected on your system. Please connect a microphone or headset.');
      } else {
        setMicPermissionError(err.message || 'Unable to access your microphone. You can also type your questions below.');
      }
    }
  };

  // Toggle Microphone Mute
  const toggleMicMute = () => {
    if (mediaStreamRef.current) {
      const newMuted = !isMicMuted;
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMuted;
      });
      setIsMicMuted(newMuted);

      if (newMuted) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // ignore
          }
        }
        setIsListening(false);
        setAudioLevel(0);
      } else {
        if (recognitionRef.current && isSessionActive) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // ignore
          }
        }
        setIsListening(true);
      }
    }
  };

  // Interrupt / Stop assistant speaking
  const handleStopSpeaking = () => {
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {
        // ignore
      }
      currentAudioSourceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAssistantSpeaking(false);
    isAssistantSpeakingRef.current = false;

    if (isSessionActive && !isMicMuted && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // ignore
      }
    }
  };

  // Clear Transcript History
  const clearTranscript = () => {
    setTranscript([
      {
        sender: 'gemini',
        text: 'Session history reset. The microphone is ready for your inquiries.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Quick Inquiries Chips
  const quickQuestions = [
    'Who is Amaechi Ubadike?',
    'What is the theme of Summit 2026?',
    'Tell me about the book Cleared for Takeoff',
    'What is the Dying Library White Paper?',
    'What are the 24 strategic sectors?'
  ];

  if (!isOpen) return null;

  return (
    <div id="gemini-live-voice-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div id="gemini-live-voice-container" className="bg-gradient-to-br from-[#0A192F] via-[#0D1F38] to-[#050B1A] border-2 border-[#D4AF37]/60 rounded-3xl w-full max-w-2xl shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col relative overflow-hidden h-[700px] max-h-[94vh] text-white">

        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#050B1A]/90">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 ${
              isAssistantSpeaking
                ? 'bg-[#FFD700] text-[#0A192F] shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-pulse'
                : isListening
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-[#132545] text-[#D4AF37]'
            }`}>
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="font-serif font-black text-[#FFD700] tracking-wider text-base sm:text-lg">
                  GEMINI LIVE VOICE
                </h3>
                {/* Live Status Pill */}
                {isSessionActive ? (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 border ${
                    isAssistantSpeaking
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : isProcessing
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 animate-pulse'
                      : isMicMuted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isAssistantSpeaking
                        ? 'bg-amber-400 animate-ping'
                        : isProcessing
                        ? 'bg-indigo-400'
                        : isMicMuted
                        ? 'bg-rose-400'
                        : 'bg-emerald-400 animate-ping'
                    }`} />
                    {isAssistantSpeaking
                      ? 'SPEAKING'
                      : isProcessing
                      ? 'THINKING'
                      : isMicMuted
                      ? 'MIC MUTED'
                      : 'MIC LIVE'}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    STANDBY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Aviation Airspace Voice AI • Convener AMAECHI UBADIKE
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="clear-live-transcript-btn"
              onClick={clearTranscript}
              title="Reset Transcript"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              id="close-gemini-live-modal-btn"
              onClick={() => {
                stopAllMedia();
                onClose();
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Permission Error Banner */}
        {micPermissionError && (
          <div className="mx-4 mt-3 p-3 bg-red-950/80 border border-red-500/60 rounded-xl flex items-start space-x-3 text-xs text-red-200">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-300 mb-1">Microphone Access Notice</p>
              <p>{micPermissionError}</p>
              <button
                onClick={startLiveSession}
                className="mt-2 px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-medium rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Mic className="h-3.5 w-3.5" />
                Retry Microphone Access
              </button>
            </div>
          </div>
        )}

        {/* Central Visualizer & Stage */}
        <div className="px-4 py-3 sm:py-4 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#050B1A]/40 to-[#0A192F]/60">

          {/* Interactive Microphone Orb */}
          <div className="relative my-2 flex items-center justify-center">
            {/* Animated Pulse Rings based on Real Hardware Audio Level */}
            {isSessionActive && !isMicMuted && (
              <>
                <div
                  className="absolute rounded-full transition-all duration-150"
                  style={{
                    width: `${110 + audioLevel * 1.2}px`,
                    height: `${110 + audioLevel * 1.2}px`,
                    backgroundColor: isAssistantSpeaking ? 'rgba(255, 215, 0, 0.15)' : 'rgba(16, 185, 129, 0.2)',
                    filter: 'blur(8px)'
                  }}
                />
                <div
                  className="absolute rounded-full transition-all duration-100"
                  style={{
                    width: `${90 + audioLevel * 0.7}px`,
                    height: `${90 + audioLevel * 0.7}px`,
                    backgroundColor: isAssistantSpeaking ? 'rgba(255, 215, 0, 0.25)' : 'rgba(16, 185, 129, 0.35)',
                    filter: 'blur(4px)'
                  }}
                />
              </>
            )}

            {/* Center Orb Button */}
            <button
              id="live-orb-button"
              onClick={isSessionActive ? toggleMicMute : startLiveSession}
              disabled={isConnecting}
              title={isSessionActive ? (isMicMuted ? 'Unmute Microphone' : 'Mute Microphone') : 'Click to start voice'}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 relative z-10 ${
                isConnecting
                  ? 'bg-[#132545] border-2 border-[#D4AF37]/50 text-[#D4AF37]'
                  : isAssistantSpeaking
                  ? 'bg-gradient-to-tr from-[#D4AF37] via-[#FFD700] to-[#FFF3B0] text-[#0A192F] scale-105 shadow-[0_0_40px_rgba(255,215,0,0.8)]'
                  : isSessionActive && !isMicMuted
                  ? 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white scale-105 shadow-[0_0_35px_rgba(16,185,129,0.7)]'
                  : isSessionActive && isMicMuted
                  ? 'bg-gradient-to-tr from-rose-800 to-rose-900 border-2 border-rose-500/70 text-white'
                  : 'bg-[#132545] hover:bg-[#1a345f] border-2 border-[#D4AF37]/70 text-[#FFD700] hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              {isConnecting ? (
                <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
              ) : isAssistantSpeaking ? (
                <div className="flex flex-col items-center">
                  <Volume2 className="h-8 w-8 animate-bounce" />
                  <span className="text-[9px] font-mono font-bold tracking-widest mt-1">SPEAKING</span>
                </div>
              ) : isSessionActive && !isMicMuted ? (
                <div className="flex flex-col items-center">
                  <Mic className="h-8 w-8 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold tracking-widest mt-1">LIVE MIC</span>
                </div>
              ) : isSessionActive && isMicMuted ? (
                <div className="flex flex-col items-center">
                  <MicOff className="h-8 w-8 text-rose-300" />
                  <span className="text-[9px] font-mono font-bold tracking-widest mt-1">MUTED</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="h-8 w-8 opacity-90 mb-1" />
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase">START MIC</span>
                </div>
              )}
            </button>
          </div>

          {/* Real Audio Dynamic Frequency Bars */}
          {isSessionActive && !isMicMuted && (
            <div className="flex items-center justify-center space-x-1 mt-2 h-7 px-4 py-1 bg-black/40 rounded-full border border-emerald-500/30 backdrop-blur-sm">
              {[...Array(24)].map((_, i) => {
                const variance = ((i * 7) % 5) + 1;
                const height = Math.min(100, Math.max(12, (audioLevel * variance) / 2.8));
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      isAssistantSpeaking
                        ? 'bg-gradient-to-t from-[#D4AF37] to-[#FFD700]'
                        : 'bg-gradient-to-t from-emerald-500 to-teal-300'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          )}

          {/* Real-time speech preview banner */}
          {interimSpeech && (
            <div className="w-full mt-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">Listening:</span>
              <span className="italic truncate">"{interimSpeech}..."</span>
            </div>
          )}

          {/* Assistant Speaking banner with interrupt button */}
          {isAssistantSpeaking && (
            <div className="w-full mt-2 px-3 py-1.5 bg-amber-950/70 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2 truncate">
                <Volume2 className="h-3.5 w-3.5 text-[#FFD700] animate-pulse shrink-0" />
                <span className="truncate">Assistant is speaking...</span>
              </div>
              <button
                onClick={handleStopSpeaking}
                className="px-2.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0"
              >
                <Square className="h-3 w-3 fill-current" />
                Stop
              </button>
            </div>
          )}

          {/* Quick Questions Chips */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none no-scrollbar">
            <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">Ask:</span>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendVoiceQuery(q)}
                disabled={isProcessing}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-[#132545]/80 hover:bg-[#1f3a6b] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-slate-200 hover:text-white rounded-lg transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

        </div>

        {/* Transcript Conversation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#050B1A]/70 border-t border-b border-[#D4AF37]/20 text-xs font-sans">
          {transcript.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl ${
                  item.sender === 'user'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#0A192F] font-semibold rounded-br-none shadow-md'
                    : 'bg-[#0D1F38] text-slate-200 border border-[#D4AF37]/30 rounded-bl-none shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[9px] font-mono opacity-75 mb-1 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    {item.sender === 'user' ? (
                      <>
                        <User className="h-3 w-3" />
                        <span>You (Mic Input)</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3 text-[#FFD700]" />
                        <span className="text-[#FFD700] font-bold">Gemini Live Assistant</span>
                      </>
                    )}
                  </span>
                  <span>{item.time}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{item.text}</p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#FFD700]" />
              <span className="font-mono text-[11px] text-[#FFD700]">Gemini processing aviation query...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Text Input Fallback Bar */}
        <div className="px-4 py-2 bg-[#050B1A] border-b border-[#D4AF37]/20 flex items-center gap-2">
          <input
            id="gemini-live-text-input"
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && textInput.trim()) {
                sendVoiceQuery(textInput);
                setTextInput('');
              }
            }}
            placeholder="Type your question or speak into your microphone..."
            className="flex-1 bg-[#0A192F] border border-slate-700 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
          />
          <button
            id="gemini-live-send-text-btn"
            onClick={() => {
              if (textInput.trim()) {
                sendVoiceQuery(textInput);
                setTextInput('');
              }
            }}
            disabled={!textInput.trim() || isProcessing}
            className="p-2 bg-[#D4AF37] hover:bg-[#FFD700] disabled:opacity-40 disabled:hover:bg-[#D4AF37] text-[#0A192F] font-bold rounded-xl transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Footer Action Controls & Toggles */}
        <div className="p-3 sm:p-4 bg-[#050B1A] flex items-center justify-between flex-wrap gap-2">
          
          {/* Secondary Toggles */}
          <div className="flex items-center space-x-2">
            {/* Mic Mute Toggle */}
            {isSessionActive && (
              <button
                id="toggle-mic-mute-btn"
                onClick={toggleMicMute}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isMicMuted
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                    : 'bg-[#132545] border-emerald-500/40 text-emerald-300 hover:bg-[#1b3664]'
                }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="hidden sm:inline">{isMicMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
              </button>
            )}

            {/* Speaker Audio Toggle */}
            <button
              id="toggle-speaker-mute-btn"
              onClick={() => {
                if (!isSpeakerMuted && isAssistantSpeaking) {
                  handleStopSpeaking();
                }
                setIsSpeakerMuted(!isSpeakerMuted);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSpeakerMuted
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-[#132545] border-[#D4AF37]/40 text-[#FFD700] hover:bg-[#1b3664]'
              }`}
              title={isSpeakerMuted ? 'Unmute Speaker Audio' : 'Mute Speaker Audio'}
            >
              {isSpeakerMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isSpeakerMuted ? 'Audio Off' : 'Audio On'}</span>
            </button>

            {/* Voice Persona Selector */}
            <select
              value={activeVoice}
              onChange={(e) => setActiveVoice(e.target.value as any)}
              className="bg-[#132545] border border-slate-700 text-slate-300 text-xs rounded-xl px-2 py-2 outline-none"
              title="Voice Model Persona"
            >
              <option value="Zephyr">Voice: Zephyr</option>
              <option value="Kore">Voice: Kore</option>
              <option value="Puck">Voice: Puck</option>
              <option value="Fenrir">Voice: Fenrir</option>
            </select>
          </div>

          {/* Primary Action Button */}
          <div>
            {!isSessionActive ? (
              <button
                id="start-live-voice-btn"
                onClick={startLiveSession}
                disabled={isConnecting}
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#C59B27] hover:brightness-110 text-[#0A192F] font-bold rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Accessing Mic...</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Start Live Microphone</span>
                  </>
                )}
              </button>
            ) : (
              <button
                id="end-live-voice-btn"
                onClick={stopAllMedia}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <MicOff className="h-4 w-4" />
                <span>End Voice Session</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
