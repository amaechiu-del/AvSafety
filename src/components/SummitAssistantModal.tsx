import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

interface SummitAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SummitAssistantModal({ isOpen, onClose }: SummitAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the official Aviation Safety Summit 2026 AI Assistant. You can ask me about speakers, sessions, topics, or schedules.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error: ' + data.error }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am unable to reach the server right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#D4AF37]/30 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col relative overflow-hidden h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0A192F] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-[#D4AF37] rounded-lg">
              <Bot className="h-5 w-5 text-[#0A192F]" />
            </div>
            <div>
              <h3 className="font-serif font-black uppercase text-[#D4AF37] leading-tight">Summit AI</h3>
              <p className="text-[10px] font-mono text-gray-400">OFFICIAL PROGRAMME ASSISTANT</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#FCFBF7] space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-[#0A192F] text-[#D4AF37]'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-gray-100 text-[#0A192F] rounded-tr-sm' 
                    : 'bg-white border border-[#D4AF37]/20 shadow-sm text-[#5A6E85] rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 h-8 w-8 rounded-full bg-[#0A192F] text-[#D4AF37] flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="px-4 py-3 bg-white border border-[#D4AF37]/20 shadow-sm rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-[#D4AF37] animate-spin" />
                  <span className="text-xs text-gray-400 font-mono">Analyzing Programme...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about speakers, sessions, etc..."
              className="flex-1 px-4 py-3 bg-[#FCFBF7] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-[#0A192F] text-white rounded-xl hover:bg-[#1a2f52] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[9px] text-center text-gray-400 mt-2 font-mono">
            Powered by Gemini. AI can make mistakes, verify on official schedules.
          </p>
        </div>

      </div>
    </div>
  );
}
