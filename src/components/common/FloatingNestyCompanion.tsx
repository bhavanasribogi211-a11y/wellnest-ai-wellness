import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { NestyMascot } from './NestyMascot';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRight,
  Maximize2,
  ExternalLink,
  RotateCcw,
  Bot,
  User,
  Radio,
  Sliders,
} from 'lucide-react';

export const FloatingNestyCompanion: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    chatMessages,
    sendChatMessage,
    isChatLoading,
    userProfile,
    currentPhase,
    currentCycleDay,
    n8nAgentStatus,
    isN8nAgentEnabled,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Web Speech Recognition setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        setInputVal(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use keyboard input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Text-To-Speech for Nesty responses when voice is enabled
  useEffect(() => {
    if (isSpeakingEnabled && chatMessages.length > 0 && isOpen) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.sender === 'nesty' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Remove markdown formatting for voice
        const cleanText = lastMsg.text.replace(/[*#_`]/g, '').slice(0, 280);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [chatMessages, isSpeakingEnabled, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, isChatLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isChatLoading) return;
    sendChatMessage(inputVal);
    setInputVal('');
    setTranscript('');
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // If on the full Chat screen, don't show floating window to avoid duplicate UI
  if (currentScreen === 'chat') return null;

  return (
    <>
      {/* Floating Trigger Buddy (Bottom Right) */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 flex flex-col items-end select-none">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-purple-200 text-xs font-bold text-slate-800 animate-in fade-in slide-in-from-right-4 duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Talk to Nesty AI 🐣</span>
            </div>

            <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 p-0.5 shadow-xl hover:scale-110 active:scale-95 transition-all">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                <span className="text-2xl animate-bounce">🐣</span>
                <span className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>

              {/* Status indicator badge */}
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                ✓
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Assistant Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-4 z-50 flex flex-col sm:w-[420px] sm:h-[580px] bg-white sm:rounded-3xl shadow-2xl border border-purple-200 animate-in zoom-in-95 duration-200 overflow-hidden">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <NestyMascot mood="happy" size="sm" className="shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm font-heading">Nesty AI Assistant</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-900 font-extrabold uppercase">
                    n8n Agent
                  </span>
                </div>
                <p className="text-[10px] text-purple-100">
                  Day {currentCycleDay} • {currentPhase} Phase
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                className={`p-1.5 rounded-xl transition-colors ${
                  isSpeakingEnabled ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
                title={isSpeakingEnabled ? 'Mute Voice Readout' : 'Enable Voice Readout'}
              >
                {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentScreen('chat');
                }}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Open Full Screen Chat"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="px-3 py-1.5 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between text-[11px] text-purple-900 shrink-0">
            <span className="flex items-center gap-1 font-medium truncate">
              <span>🌸</span> {userProfile.name ? `For ${userProfile.name.split(' ')[0]}` : 'Wellness Companion'} • {userProfile.skinType} skin
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-purple-200">
              Live Agent
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'nesty' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-400 flex items-center justify-center text-xs shrink-0 shadow-2xs">
                    🐣
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-2.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.quickAction && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setCurrentScreen(msg.quickAction!.screen);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700 flex items-center gap-1 shadow-2xs transition-all"
                      >
                        <span>{msg.quickAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-[11px] text-purple-700 font-medium p-2 bg-purple-50/60 rounded-xl w-fit">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                <span>Nesty is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Live Visualizer if listening */}
          {isListening && (
            <div className="p-2.5 bg-rose-50 border-t border-rose-100 flex items-center justify-between text-xs text-rose-700 animate-pulse">
              <span className="flex items-center gap-1.5 font-bold">
                <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
                <span>Listening to your voice... Speak now!</span>
              </span>
              <button
                type="button"
                onClick={toggleMic}
                className="text-[10px] text-rose-600 underline font-semibold"
              >
                Stop
              </button>
            </div>
          )}

          {/* Quick Questions Pills */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 text-[10px]">
            {['Hormone balance tips', 'Period cramp relief', 'Skin actives today', 'Emergency helpline'].map(
              (chip, idx) => (
                <button
                  key={idx}
                  onClick={() => sendChatMessage(chip)}
                  className="px-2 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 whitespace-nowrap border border-purple-200/60 font-medium"
                >
                  {chip}
                </button>
              )
            )}
          </div>

          {/* Input & Voice Controls */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 shrink-0"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Input (Speak to Nesty)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Type or speak your question...'}
              disabled={isChatLoading}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-purple-500 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isChatLoading}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all disabled:opacity-40"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
