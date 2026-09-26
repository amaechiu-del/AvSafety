/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, Play, Pause, Volume2, VolumeX, Mic, MicOff, Send, 
  Sparkles, RefreshCw, Briefcase, FileText, CheckCircle, 
  ChevronRight, Users, Award, Shield, AlertTriangle, 
  Headphones, Layers, Globe, Clock, Check, X, PhoneCall,
  Flame, MessageSquare, BookOpen, Building2, MapPin, Zap
} from 'lucide-react';
import { 
  RADIO_HOSTS, 
  INITIAL_RADIO_SEGMENTS, 
  SECRETARIAT_JOB_LISTINGS, 
  RADIO_TOPICS_CATALOGUE, 
  RadioHost, 
  RadioDialogueTurn, 
  RadioSegment,
  SecretariatJobListing 
} from '../../data/radioStationData';

interface AeroSafeRadioStudioProps {
  onNavigateToMemoir?: () => void;
  onNavigateToProgramme?: () => void;
  onNavigateToVolunteer?: () => void;
}

export default function AeroSafeRadioStudio({
  onNavigateToMemoir,
  onNavigateToProgramme,
  onNavigateToVolunteer
}: AeroSafeRadioStudioProps) {
  // Navigation tabs inside radio studio
  const [activeTab, setActiveTab] = useState<'broadcast' | 'topics' | 'jobs' | 'hosts'>('broadcast');

  // Broadcast state
  const [currentSegment, setCurrentSegment] = useState<RadioSegment>(INITIAL_RADIO_SEGMENTS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [atcAmbienceEnabled, setAtcAmbienceEnabled] = useState<boolean>(false);
  const [stationFrequency, setStationFrequency] = useState<string>('98.5 MHz');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Studio hotline (caller input)
  const [callerName, setCallerName] = useState<string>('Capt. Emeka (Lagos)');
  const [callerMessage, setCallerMessage] = useState<string>('');
  const [isCallingMic, setIsCallingMic] = useState<boolean>(false);
  const [micListening, setMicListening] = useState<boolean>(false);
  const [callerFeedbackStatus, setCallerFeedbackStatus] = useState<string | null>(null);

  // Custom Topic generation input
  const [customTopicInput, setCustomTopicInput] = useState<string>('');

  // Secretariat Job Application Modal
  const [selectedJob, setSelectedJob] = useState<SecretariatJobListing | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [jobApplicantName, setJobApplicantName] = useState<string>('');
  const [jobApplicantEmail, setJobApplicantEmail] = useState<string>('');
  const [jobApplicantPhone, setJobApplicantPhone] = useState<string>('');
  const [jobApplicantExperience, setJobApplicantExperience] = useState<string>('');
  const [jobApplicantStatement, setJobApplicantStatement] = useState<string>('');
  const [jobSubmitSuccess, setJobSubmitSuccess] = useState<boolean>(false);

  // Audio synthesis and timers
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const atcAudioContextRef = useRef<AudioContext | null>(null);
  const atcOscillatorRef = useRef<OscillatorNode | null>(null);
  const atcGainRef = useRef<GainNode | null>(null);
  const transcriptBottomRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition for caller line
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-NG'; // or en-US / en-GB
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCallerMessage(transcript);
        setMicListening(false);
        setCallerFeedbackStatus(`Voice captured: "${transcript}". Connecting to on-air hosts...`);
        // Trigger auto submit on voice capture
        handleSendCallerQuestion(transcript);
      };

      recognition.onerror = () => {
        setMicListening(false);
        setCallerFeedbackStatus('Microphone capture timeout. Please type your question or try again.');
      };

      recognition.onend = () => {
        setMicListening(false);
      };

      speechRecognitionRef.current = recognition;
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
      stopBroadcast();
    };
  }, []);

  // Web Audio Synthesizer for Radio Squelch & Station Jingles
  const playRadioBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      // AudioContext not allowed before user gesture
    }
  }, []);

  // Play dialogue turn using browser Web Speech Synthesis with host customized pitch/rate
  const speakTurn = useCallback((turn: RadioDialogueTurn, onEndCallback: () => void) => {
    if (!('speechSynthesis' in window) || isMuted) {
      // Fallback timer when speech synthesis unavailable or muted
      const duration = Math.max(3000, turn.text.length * 55);
      autoPlayTimerRef.current = setTimeout(onEndCallback, duration);
      return;
    }

    window.speechSynthesis.cancel();

    const host = turn.speakerId !== 'caller' ? RADIO_HOSTS[turn.speakerId] : null;
    const utterance = new SpeechSynthesisUtterance(turn.text);

    // Customize voice parameters to create 4 distinct personalities
    if (host) {
      utterance.pitch = host.speechPitch;
      utterance.rate = host.speechRate;
    } else {
      // Caller voice
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    utterance.volume = audioVolume;

    // Pick suitable available voices if supported
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (host?.voiceGender === 'female') {
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google UK English Female') || v.name.includes('Samantha'));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male') || v.name.includes('George'));
        if (maleVoice) utterance.voice = maleVoice;
      }
    }

    utterance.onend = () => {
      onEndCallback();
    };

    utterance.onerror = () => {
      onEndCallback();
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [audioVolume, isMuted]);

  // Handle sequential play through turns
  useEffect(() => {
    if (!isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      setActiveSpeakerId(null);
      return;
    }

    if (currentTurnIndex >= currentSegment.turns.length) {
      // Segment finished
      setIsPlaying(false);
      setCurrentTurnIndex(0);
      setActiveSpeakerId(null);
      return;
    }

    const turn = currentSegment.turns[currentTurnIndex];
    setActiveSpeakerId(turn.speakerId);
    playRadioBeep();

    // Auto scroll transcript
    if (transcriptBottomRef.current) {
      transcriptBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    speakTurn(turn, () => {
      setCurrentTurnIndex(prev => prev + 1);
    });

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlaying, currentTurnIndex, currentSegment, speakTurn, playRadioBeep]);

  // Start broadcast
  const startBroadcast = (segment?: RadioSegment) => {
    if (segment) {
      setCurrentSegment(segment);
      setCurrentTurnIndex(0);
    }
    setIsPlaying(true);
  };

  // Stop broadcast
  const stopBroadcast = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setActiveSpeakerId(null);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      stopBroadcast();
    } else {
      startBroadcast();
    }
  };

  // Jump to specific turn
  const jumpToTurn = (index: number) => {
    stopBroadcast();
    setCurrentTurnIndex(index);
    setIsPlaying(true);
  };

  // Start microphone caller line
  const handleStartCallerMic = () => {
    if (!speechRecognitionRef.current) {
      setCallerFeedbackStatus('Speech recognition not supported in this browser. Please type your message below.');
      return;
    }
    try {
      setMicListening(true);
      setCallerFeedbackStatus('🎙️ Microphone active! Speak your question or comment to the hosts now...');
      speechRecognitionRef.current.start();
    } catch (err) {
      setMicListening(false);
      setCallerFeedbackStatus('Microphone already listening or permission denied.');
    }
  };

  // Handle caller question submission to Gemini / AI generator for live on-air banter
  const handleSendCallerQuestion = async (overrideText?: string) => {
    const textToSend = overrideText || callerMessage;
    if (!textToSend.trim()) return;

    setIsGeneratingAi(true);
    setCallerFeedbackStatus('Connecting your call to the live studio feed. Aisha & Captain Segun are queuing you on air...');

    try {
      const res = await fetch('/api/radio/generate-segment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Caller Question: ${textToSend}`,
          callerName: callerName || 'Aviation Colleague',
          callerMessage: textToSend
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.turns && data.turns.length > 0) {
          const newSegment: RadioSegment = {
            id: `caller-seg-${Date.now()}`,
            frequency: stationFrequency,
            category: 'AIRSPACE_ATC',
            categoryLabel: 'Live On-Air Caller Interaction',
            title: `Caller On Line: "${textToSend.slice(0, 45)}..."`,
            tagline: `Live 4-host on-air response to ${callerName}`,
            duration: '2 mins broadcast',
            turns: data.turns
          };
          setCurrentSegment(newSegment);
          setCurrentTurnIndex(0);
          setIsPlaying(true);
          setCallerMessage('');
          setCallerFeedbackStatus('🎉 You are now ON AIR with Captain Segun, Dr. Amara, F/O Amaechi & Aisha!');
          setIsGeneratingAi(false);
          return;
        }
      }
      throw new Error('Fallback to local radio generator');
    } catch (e) {
      // Local intelligent fallback with 4-host dialogue
      const localCallerTurns: RadioDialogueTurn[] = [
        {
          id: `t-call-1`,
          speakerId: 'host-anchor-aisha',
          speakerName: 'Aisha Bello-Lawal',
          roleTitle: 'Secretariat Anchor',
          text: `We have a live caller on Line 1! ${callerName}, welcome to AeroSafe 98.5 FM. You are asking: "${textToSend}". Captain Segun, how do you see this?`,
          timestamp: '00:02',
          sentiment: 'enthusiastic'
        },
        {
          id: `t-call-2`,
          speakerId: 'host-captain-segun',
          speakerName: 'Capt. Segun Adeleke',
          roleTitle: 'Chief Flight Deck Veteran',
          text: `Thank you for that sharp question, ${callerName}! In the cockpit, this comes down to situational awareness and absolute procedural discipline. We never cut corners when lives are on the line.`,
          timestamp: '00:18',
          sentiment: 'authoritative'
        },
        {
          id: `t-call-3`,
          speakerId: 'host-engr-amara',
          speakerName: 'Engr. Dr. Amara Obi',
          roleTitle: 'Lead MRO Specialist',
          text: `And technically speaking, Dr. Amara here! What our caller is highlighting is addressed directly by Nigeria Civil Aviation Regulations and the White Paper. Every component, procedure, and handover must have verified documentation.`,
          timestamp: '00:36',
          sentiment: 'technical'
        },
        {
          id: `t-call-4`,
          speakerId: 'host-author-amaechi',
          speakerName: 'F/O Amaechi Ubadike',
          roleTitle: 'Summit Convener & Author',
          text: `Exactly. This is why our theme at the Summit is "EVERYBODY IS INVOLVED IN AVIATION SAFETY." From the ramp worker to the regulatory director general, safety is our shared sovereign burden.`,
          timestamp: '00:55',
          sentiment: 'thoughtful'
        },
        {
          id: `t-call-5`,
          speakerId: 'host-anchor-aisha',
          speakerName: 'Aisha Bello-Lawal',
          roleTitle: 'Secretariat Anchor',
          text: `Thank you for calling in, ${callerName}! Keep your dial tuned to 98.5 FM. Back to our scheduled studio segments.`,
          timestamp: '01:15',
          sentiment: 'enthusiastic'
        }
      ];

      const newSegment: RadioSegment = {
        id: `caller-seg-${Date.now()}`,
        frequency: stationFrequency,
        category: 'AIRSPACE_ATC',
        categoryLabel: 'Live On-Air Caller Interaction',
        title: `Caller On Line: "${textToSend.slice(0, 45)}..."`,
        tagline: `Live 4-host on-air response to ${callerName}`,
        duration: '2 mins broadcast',
        turns: localCallerTurns
      };

      setCurrentSegment(newSegment);
      setCurrentTurnIndex(0);
      setIsPlaying(true);
      setCallerMessage('');
      setCallerFeedbackStatus('🎉 You are now ON AIR with Captain Segun, Dr. Amara, F/O Amaechi & Aisha!');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Generate Custom AI Topic on the fly
  const handleGenerateCustomTopic = async (topicTitle: string) => {
    setIsGeneratingAi(true);
    stopBroadcast();

    try {
      const res = await fetch('/api/radio/generate-segment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.turns) {
          const newSeg: RadioSegment = {
            id: `custom-topic-${Date.now()}`,
            frequency: stationFrequency,
            category: 'DYING_LIBRARY_ICAO',
            categoryLabel: 'Custom Studio Deep-Dive',
            title: data.title || topicTitle,
            tagline: `Live 4-host panel analysis on ${topicTitle}`,
            duration: '3 mins broadcast',
            turns: data.turns
          };
          setCurrentSegment(newSeg);
          setCurrentTurnIndex(0);
          setActiveTab('broadcast');
          setIsPlaying(true);
          setIsGeneratingAi(false);
          return;
        }
      }
      throw new Error('Use fallback');
    } catch (e) {
      // Fallback dynamic script
      const fallbackTurns: RadioDialogueTurn[] = [
        {
          id: 'ft-1',
          speakerId: 'host-anchor-aisha',
          speakerName: 'Aisha Bello-Lawal',
          roleTitle: 'Secretariat Anchor',
          text: `We are pivoting live on AeroSafe 98.5 FM to an urgent listener-requested deep dive: "${topicTitle}". Amaechi, how does the Dying Library White Paper frame this?`,
          timestamp: '00:03',
          sentiment: 'enthusiastic'
        },
        {
          id: 'ft-2',
          speakerId: 'host-author-amaechi',
          speakerName: 'F/O Amaechi Ubadike',
          roleTitle: 'Summit Convener',
          text: `This touches the core of our governance and knowledge preservation reform. We cannot wait for another systemic failure; we must codify these standards now into law with the 10th National Assembly.`,
          timestamp: '00:25',
          sentiment: 'thoughtful'
        },
        {
          id: 'ft-3',
          speakerId: 'host-captain-segun',
          speakerName: 'Capt. Segun Adeleke',
          roleTitle: 'Chief Flight Deck Veteran',
          text: `From thirty years of flying line operations, I can tell you that when pilots and air traffic controllers communicate with transparency and mutual trust, incident probabilities drop exponentially.`,
          timestamp: '00:48',
          sentiment: 'authoritative'
        },
        {
          id: 'ft-4',
          speakerId: 'host-engr-amara',
          speakerName: 'Engr. Dr. Amara Obi',
          roleTitle: 'Lead MRO Specialist',
          text: `And the physical engineering integrity backing the aircraft must match that cockpit discipline. Every inspection stamp is a sacred covenant with the passengers in the cabin.`,
          timestamp: '01:10',
          sentiment: 'technical'
        }
      ];

      const newSeg: RadioSegment = {
        id: `custom-topic-${Date.now()}`,
        frequency: stationFrequency,
        category: 'DYING_LIBRARY_ICAO',
        categoryLabel: 'Custom Studio Deep-Dive',
        title: topicTitle,
        tagline: `Live 4-host panel analysis on ${topicTitle}`,
        duration: '3 mins broadcast',
        turns: fallbackTurns
      };
      setCurrentSegment(newSeg);
      setCurrentTurnIndex(0);
      setActiveTab('broadcast');
      setIsPlaying(true);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Submit Secretariat Job Application
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !jobApplicantName || !jobApplicantEmail) return;

    try {
      await fetch('/api/secretariat/job-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob.id,
          jobTitle: selectedJob.title,
          applicantName: jobApplicantName,
          email: jobApplicantEmail,
          phone: jobApplicantPhone,
          experience: jobApplicantExperience,
          statement: jobApplicantStatement,
          submittedAt: new Date().toISOString()
        })
      });
    } catch (e) {
      // Continue locally
    }

    setJobSubmitSuccess(true);
    setTimeout(() => {
      // Trigger live on-air acknowledgement from Aisha
      const onAirJobAckTurn: RadioDialogueTurn[] = [
        {
          id: `job-ack-${Date.now()}`,
          speakerId: 'host-anchor-aisha',
          speakerName: 'Aisha Bello-Lawal',
          roleTitle: 'Secretariat Anchor',
          text: `Live Secretariat Career Update! We have just received an on-air application from ${jobApplicantName} for the position of "${selectedJob.title}". Our Protocol & Human Capital Directorate has received your credentials and will send your onboarding briefing schedule via email. Welcome to the DomisLink operational team!`,
          timestamp: '00:02',
          sentiment: 'enthusiastic'
        },
        {
          id: `job-ack-2`,
          speakerId: 'host-captain-segun',
          speakerName: 'Capt. Segun Adeleke',
          roleTitle: 'Chief Flight Deck Veteran',
          text: `Congratulations ${jobApplicantName}! Bring your highest discipline and punctuality to the Marriott Hotel. We need dedicated professionals supporting our sovereign skies.`,
          timestamp: '00:20',
          sentiment: 'authoritative'
        }
      ];

      const ackSegment: RadioSegment = {
        id: `job-ack-seg-${Date.now()}`,
        frequency: '89.1 MHz · Secretariat',
        category: 'SECRETARIAT_JOBS',
        categoryLabel: 'Secretariat Application Acknowledged',
        title: `On-Air Welcome: ${jobApplicantName} (${selectedJob.title})`,
        tagline: 'Live confirmation from the Protocol & Secretariat Desk',
        duration: '1 min broadcast',
        turns: onAirJobAckTurn
      };

      setCurrentSegment(ackSegment);
      setCurrentTurnIndex(0);
      setActiveTab('broadcast');
      setIsPlaying(true);
      setIsJobModalOpen(false);
      setJobSubmitSuccess(false);
    }, 1800);
  };

  return (
    <section id="podcast" className="py-20 bg-[#050C17] text-white relative overflow-hidden border-b border-[#D4AF37]/30">
      {/* Visual background atmospheric lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Radio Station Header & Tuning Dial */}
        <div className="bg-[#0A192F] border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10 relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            
            {/* Station Branding */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-300 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>LIVE ON AIR</span>
                </span>
                
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-mono text-xs font-bold">
                  📻 AEROSAFE {stationFrequency}
                </span>

                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-mono">
                  DOMISLINK SKYPULSE STUDIO · LAGOS
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
                AeroSafe 24/7 Live Radio & 4-Host Podcast Studio
              </h2>
              <p className="text-xs sm:text-sm text-[#8A99AD] font-light max-w-2xl">
                Broadcasting deep-dive discussions with 4 distinct voices: Capt. Segun, Dr. Amara, F/O Amaechi & Anchor Aisha. Call in live, select topics, or apply for Secretariat career vacancies!
              </p>
            </div>

            {/* Master Play / Pause & Volume Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={togglePlayPause}
                className={`px-6 py-3.5 rounded-2xl font-mono font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-3 transition-all shadow-xl cursor-pointer ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50' 
                    : 'bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] shadow-[#D4AF37]/30'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 fill-current" />
                    <span>Pause Broadcast</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    <span>Listen Live Now</span>
                  </>
                )}
              </button>

              {/* Mute button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX className="h-5 w-5 text-red-400" /> : <Volume2 className="h-5 w-5 text-[#D4AF37]" />}
              </button>

              {/* Frequency Dial Dropdown */}
              <select
                value={stationFrequency}
                onChange={(e) => {
                  setStationFrequency(e.target.value);
                  playRadioBeep();
                }}
                className="bg-[#050C17] border border-[#D4AF37]/40 rounded-xl text-xs font-mono text-[#D4AF37] px-3 py-3 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="98.5 MHz">98.5 MHz · Plenary & ICAO</option>
                <option value="104.2 MHz">104.2 MHz · Tech & MRO</option>
                <option value="89.1 MHz">89.1 MHz · Secretariat Jobs</option>
              </select>
            </div>

          </div>

          {/* Active Broadcast Progress & Waveform Graphic */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* 4 Host Badges with Live Glow indicators */}
            {Object.values(RADIO_HOSTS).map((host) => {
              const isCurrentlySpeaking = isPlaying && activeSpeakerId === host.id;
              return (
                <div
                  key={host.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                    isCurrentlySpeaking 
                      ? `${host.colorTheme.border} ${host.colorTheme.bg} shadow-lg ${host.colorTheme.glow} ring-2 ring-white/20 scale-[1.02]` 
                      : 'border-white/10 bg-black/20 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${host.colorTheme.badge}`}>
                      {host.avatarBadge}
                    </span>
                    {isCurrentlySpeaking && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold animate-pulse">
                        <Mic className="h-3 w-3" />
                        <span>ON MIC</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-serif font-bold text-white leading-tight">{host.name}</h4>
                  <p className="text-[10px] text-[#8A99AD] truncate">{host.role}</p>

                  {/* Animated Voice Equalizer when speaking */}
                  {isCurrentlySpeaking && (
                    <div className="flex items-center gap-1 mt-2.5 h-3">
                      <span className="w-1 bg-current text-white rounded-full animate-[bounce_0.6s_infinite_100ms] h-full"></span>
                      <span className="w-1 bg-current text-[#D4AF37] rounded-full animate-[bounce_0.6s_infinite_200ms] h-4"></span>
                      <span className="w-1 bg-current text-emerald-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-full"></span>
                      <span className="w-1 bg-current text-cyan-400 rounded-full animate-[bounce_0.6s_infinite_150ms] h-3"></span>
                      <span className="w-1 bg-current text-purple-400 rounded-full animate-[bounce_0.6s_infinite_250ms] h-5"></span>
                    </div>
                  )}
                </div>
              );
            })}

          </div>

        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 p-1.5 bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'broadcast' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Live Broadcast & Caller Hotline</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'topics' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Topic Matrix & AI Deep Dives ({RADIO_TOPICS_CATALOGUE.reduce((acc, c) => acc + c.topics.length, 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'jobs' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Secretariat Jobs & Procedures ({SECRETARIAT_JOB_LISTINGS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hosts')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'hosts' 
                ? 'bg-[#D4AF37] text-[#0A192F] shadow-lg font-bold' 
                : 'text-[#8A99AD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Studio Hosts Directory</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LIVE BROADCAST & CALLER HOTLINE */}
        {/* ========================================================================= */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
            
            {/* Left 2 Cols: Live Transcript & Active Dialogue */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Current Segment Card */}
              <div className="bg-[#0A192F] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-xl space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold uppercase">
                      {currentSegment.categoryLabel}
                    </span>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                      {currentSegment.title}
                    </h3>
                    <p className="text-xs text-[#8A99AD] font-light">
                      {currentSegment.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{currentSegment.duration}</span>
                  </div>
                </div>

                {/* Secretariat Urgent Notice banner if present */}
                {currentSegment.secretariatNotice && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#0A192F] to-blue-950/50 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-purple-300 font-mono text-[10px] font-bold uppercase">
                        <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>SECRETARIAT ON-AIR BULLETIN: {currentSegment.secretariatNotice.title}</span>
                      </div>
                      <p className="text-xs text-gray-300">{currentSegment.secretariatNotice.details}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('jobs')}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-[11px] font-bold whitespace-nowrap transition cursor-pointer"
                      >
                        {currentSegment.secretariatNotice.actionLabel}
                      </button>
                      <a
                        href="https://summitsecretariat.netlify.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-mono text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1 shadow"
                        title="Open Summit Secretariat Official Portal"
                      >
                        <Shield className="h-3 w-3" />
                        <span>Secretariat Web Portal ↗</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Live Conversation Stream (Scrollable) */}
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentSegment.turns.map((turn, index) => {
                    const isTurnActive = isPlaying && currentTurnIndex === index;
                    const host = turn.speakerId !== 'caller' ? RADIO_HOSTS[turn.speakerId] : null;

                    return (
                      <div
                        key={turn.id}
                        onClick={() => jumpToTurn(index)}
                        className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                          isTurnActive 
                            ? 'bg-[#050C17] border-[#D4AF37] shadow-xl ring-1 ring-[#D4AF37]/50' 
                            : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              host ? host.colorTheme.badge : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {host ? host.avatarBadge : '📞 CALLER ON AIR'}
                            </span>
                            <span className="text-xs font-serif font-bold text-white">
                              {turn.speakerName}
                            </span>
                            <span className="text-[10px] text-[#8A99AD] hidden sm:inline-block">
                              ({turn.roleTitle})
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#8A99AD]">
                            <span>{turn.timestamp}</span>
                            {isTurnActive && (
                              <span className="px-1.5 py-0.2 bg-red-600 text-white font-bold rounded animate-pulse">
                                SPEAKING
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                          isTurnActive ? 'text-white font-normal' : 'text-gray-300'
                        }`}>
                          "{turn.text}"
                        </p>
                      </div>
                    );
                  })}
                  <div ref={transcriptBottomRef}></div>
                </div>

              </div>

            </div>

            {/* Right Col: Studio Hotline (Voice Mic & Text) */}
            <div className="space-y-6">
              
              {/* Call in to Studio Box */}
              <div className="bg-[#0A192F] border-2 border-[#D4AF37]/40 rounded-3xl p-6 shadow-xl space-y-5">
                
                <div className="flex items-center space-x-3 text-[#D4AF37]">
                  <div className="p-2.5 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50">
                    <PhoneCall className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">Studio Live Hotline</h3>
                    <p className="text-[10px] text-[#8A99AD] font-mono">Join the 4-Host On-Air Conversation</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Call in using your <strong>Microphone (Voice)</strong> or send a message directly to Captain Segun, Dr. Amara, F/O Amaechi, and Anchor Aisha. They will respond on-air immediately!
                </p>

                {/* Caller identity name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#8A99AD] uppercase font-bold">Your Name / Station Call Sign</label>
                  <input
                    type="text"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    placeholder="e.g. Capt. Emeka (Lagos) or Engr. Fatima (Abuja)"
                    className="w-full bg-[#050C17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Voice Call In Button */}
                <div className="pt-1">
                  <button
                    onClick={handleStartCallerMic}
                    disabled={micListening || isGeneratingAi}
                    className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      micListening 
                        ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-900/50' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/30'
                    }`}
                  >
                    {micListening ? (
                      <>
                        <Mic className="h-4 w-4 animate-ping" />
                        <span>Listening... Speak Now!</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        <span>🎙️ Call Studio via Voice (Mic)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-[#8A99AD] uppercase">Or Text Studio</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Text Message Input */}
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={callerMessage}
                    onChange={(e) => setCallerMessage(e.target.value)}
                    placeholder="Ask a safety question, report a near-miss insight, or inquire about Secretariat jobs..."
                    className="w-full bg-[#050C17] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  ></textarea>

                  <button
                    onClick={() => handleSendCallerQuestion()}
                    disabled={isGeneratingAi || !callerMessage.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isGeneratingAi ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Connecting to Studio...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send to On-Air Hosts</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Feedback status */}
                {callerFeedbackStatus && (
                  <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-[11px] text-[#D4AF37] font-mono leading-tight">
                    {callerFeedbackStatus}
                  </div>
                )}

              </div>

              {/* Quick Preset Topics to Broadcast */}
              <div className="bg-[#0A192F] border border-white/10 rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-mono font-bold text-[#D4AF37] uppercase flex items-center space-x-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  <span>Trending Radio Segments</span>
                </h4>

                <div className="space-y-2">
                  {INITIAL_RADIO_SEGMENTS.slice(0, 4).map((seg) => (
                    <button
                      key={seg.id}
                      onClick={() => startBroadcast(seg)}
                      className="w-full p-2.5 rounded-xl bg-black/30 hover:bg-white/5 border border-white/5 hover:border-[#D4AF37]/40 text-left transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold text-white group-hover:text-[#D4AF37] transition truncate">
                          {seg.title}
                        </p>
                        <p className="text-[10px] text-[#8A99AD] font-mono truncate">{seg.categoryLabel}</p>
                      </div>
                      <Play className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TOPIC MATRIX & AI DEEP DIVES */}
        {/* ========================================================================= */}
        {activeTab === 'topics' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            
            {/* Custom AI Topic Generator Bar */}
            <div className="bg-[#0A192F] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 text-[#D4AF37]">
                <Sparkles className="h-6 w-6" />
                <h3 className="text-xl font-serif font-bold text-white">Generate Any Custom Radio Broadcast Topic</h3>
              </div>
              <p className="text-xs text-[#8A99AD] font-light">
                Type any aviation subject, accident case study, or regulatory challenge. Our 4 hosts will immediately generate and broadcast an in-depth on-air debate!
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="e.g. Total Radar Coverage over Sahara, Drone Encroachment at MMIA, or Simulator Recurrent Cadence..."
                  className="flex-grow bg-[#050C17] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  onClick={() => handleGenerateCustomTopic(customTopicInput || "Airspace Radar & Safety Governance")}
                  disabled={isGeneratingAi}
                  className="px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shrink-0 cursor-pointer"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Scripting Broadcast...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Broadcast This Topic</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Categorized Topic Cards */}
            <div className="space-y-8">
              {RADIO_TOPICS_CATALOGUE.map((categoryGroup, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="text-base font-serif font-bold text-white flex items-center space-x-2 border-b border-white/10 pb-2">
                    <span className="text-[#D4AF37]">{categoryGroup.category}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryGroup.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="bg-[#0A192F] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <h5 className="font-serif font-bold text-sm text-white leading-snug">
                            {topic.title}
                          </h5>
                          <p className="text-xs text-[#8A99AD] font-light leading-relaxed">
                            {topic.desc}
                          </p>
                        </div>

                        <button
                          onClick={() => handleGenerateCustomTopic(topic.title)}
                          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0A192F] text-[#D4AF37] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
                        >
                          <Radio className="h-3.5 w-3.5" />
                          <span>Air This Topic</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SECRETARIAT JOBS, PROCEDURES & APPLICATION */}
        {/* ========================================================================= */}
        {activeTab === 'jobs' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 font-mono text-[10px] font-bold uppercase">
                <Briefcase className="w-3.5 h-3.5" />
                <span>OFFICIAL SUMMIT SECRETARIAT CAREER DESK</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Summit Secretariat Roles, Hiring Procedures & Onboarding
              </h3>
              <p className="text-xs text-[#8A99AD]">
                The DomisLink Aviation Safety Secretariat is recruiting qualified protocol officers, rapporteurs, media engineers, and translators for the Lagos Marriott Summit operations.
              </p>
              
              {/* Direct Link to Dedicated Secretariat Web App */}
              <div className="pt-2">
                <a
                  href="https://summitsecretariat.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-[#D4AF37] text-white font-mono text-xs font-bold shadow-xl hover:brightness-110 transition border border-white/20"
                >
                  <Shield className="h-4 w-4" />
                  <span>Open Dedicated Secretariat Web App: summitsecretariat.netlify.app ↗</span>
                </a>
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="space-y-6">
              {SECRETARIAT_JOB_LISTINGS.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#0A192F] border border-white/10 hover:border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-xl transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                          {job.type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                          {job.slots} Slots Available
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">
                          Deadline: {job.deadline}
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                        {job.title}
                      </h4>
                      <p className="text-xs text-[#D4AF37] font-mono">
                        {job.department} • {job.location}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs text-[#8A99AD] font-mono uppercase">Compensation / Honorarium</p>
                      <p className="text-sm sm:text-base font-mono font-bold text-emerald-400">{job.stipend}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    {job.description}
                  </p>

                  {/* Requirements & On-Air Note */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <h5 className="text-xs font-mono font-bold text-[#D4AF37] uppercase">Key Qualifications:</h5>
                      <ul className="space-y-1.5 text-xs text-gray-300 font-light">
                        {job.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="flex items-start space-x-2">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step by step procedure */}
                    <div className="space-y-2 bg-black/30 p-4 rounded-2xl border border-white/5">
                      <h5 className="text-xs font-mono font-bold text-purple-400 uppercase">Application & Selection Procedure:</h5>
                      <div className="space-y-1.5 text-[11px] text-gray-300">
                        <p><strong>1. Form:</strong> {job.procedure.step1}</p>
                        <p><strong>2. Screening:</strong> {job.procedure.step2}</p>
                        <p><strong>3. Vetting:</strong> {job.procedure.step3}</p>
                        <p><strong>4. Deployment:</strong> {job.procedure.step4}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <p className="text-[11px] text-[#8A99AD] italic font-serif">
                      {job.onAirHostNote}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setIsJobModalOpen(true);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-lg cursor-pointer"
                    >
                      <span>Apply for This Role</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STUDIO HOSTS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'hosts' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-serif font-bold text-white">The AeroSafe 98.5 FM Host Panel</h3>
              <p className="text-xs text-[#8A99AD]">
                Four distinct professional perspectives representing flight operations, systems engineering, safety policy, and media communications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(RADIO_HOSTS).map((host) => (
                <div
                  key={host.id}
                  className={`bg-[#0A192F] border-2 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl ${host.colorTheme.border}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${host.colorTheme.badge}`}>
                        {host.avatarBadge}
                      </span>
                      <h4 className="text-xl font-serif font-bold text-white mt-1">{host.name}</h4>
                      <p className="text-xs text-[#D4AF37] font-mono">{host.role}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-[#D4AF37]">
                      <Mic className="h-6 w-6" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    {host.bio}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-1">
                    <p className="text-[10px] font-mono uppercase text-[#8A99AD] font-bold">On-Air Catchphrase:</p>
                    <p className="text-xs font-serif italic text-[#D4AF37]">{host.catchphrase}</p>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {host.expertise.map((exp, eIdx) => (
                      <span key={eIdx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-300">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SECRETARIAT JOB APPLICATION MODAL */}
      {/* ========================================================================= */}
      {isJobModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A192F] border-2 border-[#D4AF37] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsJobModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase">
                SECRETARIAT APPLICATION FORM
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                {selectedJob.title}
              </h3>
              <p className="text-xs text-[#D4AF37] font-mono">
                {selectedJob.stipend} • {selectedJob.location}
              </p>
            </div>

            {jobSubmitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-white">Application Successfully Submitted!</h4>
                <p className="text-xs text-gray-300 font-light">
                  Aisha & the Secretariat are now acknowledging your submission live on air. Watch the broadcast screen!
                </p>
              </div>
            ) : (
              <form onSubmit={handleJobSubmit} className="space-y-4 text-left">
                
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-300">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={jobApplicantName}
                    onChange={(e) => setJobApplicantName(e.target.value)}
                    placeholder="e.g. F/O Tunde Balogun or Grace Chidubem"
                    className="w-full bg-[#050C17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-gray-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={jobApplicantEmail}
                      onChange={(e) => setJobApplicantEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-[#050C17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-gray-300">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={jobApplicantPhone}
                      onChange={(e) => setJobApplicantPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full bg-[#050C17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-300">Relevant Experience & Education *</label>
                  <input
                    type="text"
                    required
                    value={jobApplicantExperience}
                    onChange={(e) => setJobApplicantExperience(e.target.value)}
                    placeholder="e.g. B.Sc International Relations, 2 years event protocol / ATC trainee"
                    className="w-full bg-[#050C17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-300">Statement of Purpose & Availability *</label>
                  <textarea
                    rows={3}
                    required
                    value={jobApplicantStatement}
                    onChange={(e) => setJobApplicantStatement(e.target.value)}
                    placeholder="Describe how your skills align with this Secretariat assignment during the Summit at Lagos Marriott Hotel..."
                    className="w-full bg-[#050C17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  ></textarea>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-gray-400 font-mono">
                  <strong>Vetting Notice:</strong> All Secretariat personnel undergo preliminary security accreditation with airport and protocol security command.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B89025] text-[#0A192F] font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
                >
                  Submit Application to Secretariat Desk
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
