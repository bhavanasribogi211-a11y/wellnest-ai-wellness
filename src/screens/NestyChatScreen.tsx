import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NestyMascot } from '../components/common/NestyMascot';
import {
  NESTY_MASTER_SYSTEM_PROMPT,
  WELLNEST_KNOWLEDGE_BASE_TEXT,
  N8N_WORKFLOW_TEMPLATE,
} from '../data/agentSystemPrompt';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Settings,
  Bell,
  Heart,
  UtensilsCrossed,
  CalendarHeart,
  ShoppingBag,
  ShieldAlert,
  Info,
  Radio,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode,
  Copy,
  Check,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookOpen,
  Code2,
  Workflow,
  Terminal,
  Zap,
  Download,
} from 'lucide-react';
import { ScreenId } from '../types';

export const NestyChatScreen: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    clearChatHistory,
    isChatLoading,
    setCurrentScreen,
    setHealingPlanTab,
    userProfile,
    currentPhase,
    currentCycleDay,
    setIsNotificationSettingsOpen,
    setIsNotificationsOpen,
    unreadNotificationCount,
    n8nWebhookUrl,
    setN8nWebhookUrl,
    isN8nAgentEnabled,
    setIsN8nAgentEnabled,
    useTestWebhookMode,
    setUseTestWebhookMode,
    n8nAgentStatus,
    testN8nConnection,
    showToast,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isAgentConfigOpen, setIsAgentConfigOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [activeTrainingTab, setActiveTrainingTab] = useState<'prompt' | 'knowledge' | 'workflow' | 'diagnostics'>('prompt');
  
  const [copiedState, setCopiedState] = useState<'prompt' | 'knowledge' | 'workflow' | 'payload' | 'url' | null>(null);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; hint?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Web Speech Recognition setup
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
        setInputVal(text);
      };

      recognition.onerror = () => {
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
      showToast('Speech recognition not supported in this browser.', 'warning');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Voice Readout for Nesty messages when enabled
  useEffect(() => {
    if (isSpeakingEnabled && chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.sender === 'nesty' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = lastMsg.text.replace(/[*#_`]/g, '').slice(0, 300);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [chatMessages, isSpeakingEnabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isChatLoading) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testN8nConnection();
    setIsTesting(false);
    setTestResult(res);
    if (res.success) {
      showToast('n8n Agent is connected and responding!', 'success');
    } else {
      showToast(res.message, 'warning');
    }
  };

  const copyToClipboard = (text: string, type: 'prompt' | 'knowledge' | 'workflow' | 'payload' | 'url') => {
    navigator.clipboard.writeText(text);
    setCopiedState(type);
    showToast('Copied to clipboard! 📋', 'success');
    setTimeout(() => setCopiedState(null), 3000);
  };

  const downloadWorkflowJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'wellnest-n8n-chart-board.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded wellnest-n8n-chart-board.json 📥', 'success');
  };

  const samplePrompts = [
    `How does my ${currentPhase} phase affect my energy today?`,
    'What should I eat to prevent evening sugar cravings?',
    `Which product is best for my ${userProfile.skinType} skin?`,
    'Recommend a gentle 10-minute yoga pose for period cramps',
    'I need to book a gynecologist near Indiranagar',
  ];

  const samplePayloadJson = JSON.stringify(
    {
      chatInput: "How should I eat during my luteal phase?",
      message: "How should I eat during my luteal phase?",
      sessionId: `wellnest-user-${userProfile.name || 'guest'}`,
      systemPrompt: "[WellNest Master System Prompt]",
      user: {
        name: userProfile.name,
        age: userProfile.age,
        bmi: userProfile.bmi,
        bmiCategory: userProfile.bmiCategory,
        cycleDay: currentCycleDay,
        phase: currentPhase,
        skinType: userProfile.skinType,
        hairType: userProfile.hairType,
        scalpType: userProfile.scalpType,
        location: userProfile.location?.area,
      },
    },
    null,
    2
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 pt-4 px-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-5rem)]">
      {/* Top Companion Header */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white p-4 sm:p-5 rounded-3xl shadow-lg flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <NestyMascot mood="happy" size="md" className="shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-extrabold font-heading">
                Meet Nesty 🐣
              </h1>
              <span className="text-[10px] bg-emerald-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                Active 24/7
              </span>

              {/* n8n Agent Live Indicator Pill */}
              <button
                onClick={() => setIsAgentConfigOpen(!isAgentConfigOpen)}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  !isN8nAgentEnabled
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-400/40'
                    : n8nAgentStatus === 'ready'
                    ? 'bg-emerald-500/90 text-white border border-emerald-300'
                    : n8nAgentStatus === 'inactive'
                    ? 'bg-amber-400/90 text-amber-950 border border-amber-300'
                    : 'bg-white/20 text-white border border-white/30'
                }`}
                title="Click to view n8n Agent settings"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    !isN8nAgentEnabled
                      ? 'bg-purple-300'
                      : n8nAgentStatus === 'ready'
                      ? 'bg-white animate-pulse'
                      : n8nAgentStatus === 'inactive'
                      ? 'bg-amber-900'
                      : 'bg-yellow-300'
                  }`}
                />
                <span>
                  {!isN8nAgentEnabled
                    ? 'Local Nesty Mode'
                    : n8nAgentStatus === 'ready'
                    ? '⚡ n8n Cloud Agent Live'
                    : n8nAgentStatus === 'inactive'
                    ? '⚠️ n8n Inactive (Local Backup Active)'
                    : 'n8n Agent Connected'}
                </span>
                {isAgentConfigOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-xs text-purple-100 mt-0.5">
              Synced with Day {currentCycleDay} ({currentPhase} phase) • n8n webhook integrated
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Open Training Data Modal */}
          <button
            onClick={() => setIsTrainingModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Train My Agent / View Knowledge Base"
          >
            <BookOpen className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">Train Agent</span>
          </button>

          <button
            onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSpeakingEnabled ? 'bg-white text-purple-700' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isSpeakingEnabled ? 'Voice Readout Enabled' : 'Voice Readout Disabled'}
          >
            {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsAgentConfigOpen(!isAgentConfigOpen)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isAgentConfigOpen ? 'bg-white text-purple-700' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="n8n Agent Settings & Webhook Config"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors relative cursor-pointer"
            title="Open Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsNotificationSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Notification Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Helpful Status Banner if n8n is Inactive in Cloud */}
      {isN8nAgentEnabled && n8nAgentStatus === 'inactive' && (
        <div className="mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-base shrink-0">💡</span>
            <div>
              <p className="font-bold">
                n8n Webhook Reached: Workflow is currently inactive in your n8n workspace.
              </p>
              <p className="text-[11px] text-amber-800/90">
                To receive AI responses from n8n Cloud, toggle the switch to <strong>Active</strong> in the top-right of your n8n canvas. Meanwhile, Nesty's local engine is answering!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTrainingModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap cursor-pointer transition-all active:scale-95"
          >
            Setup Guide
          </button>
        </div>
      )}

      {/* Expandable n8n Agent Configuration Drawer */}
      {isAgentConfigOpen && (
        <div className="mb-3 p-4 bg-white rounded-3xl border border-purple-200 shadow-md text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700 font-bold">⚡</span>
              <div>
                <h3 className="font-extrabold text-slate-800 text-xs">
                  n8n AI Agent Integration Settings
                </h3>
                <p className="text-[11px] text-slate-500">
                  Connected to your n8n cloud workflow webhook
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChatHistory}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
              <button
                onClick={() => setIsAgentConfigOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                n8n Webhook Endpoint URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={n8nWebhookUrl}
                  onChange={e => setN8nWebhookUrl(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 bg-slate-50 focus:bg-white focus:border-purple-500"
                />
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold whitespace-nowrap transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  {isTesting ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Test Ping</span>
                  )}
                </button>
              </div>
            </div>

            {/* Test result status feedback */}
            {testResult && (
              <div
                className={`p-2.5 rounded-xl border text-[11px] ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
                {testResult.hint && (
                  <p className="mt-1 pl-5 text-[10px] text-amber-800/90 leading-relaxed font-medium">
                    💡 <strong>n8n tip:</strong> {testResult.hint}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                <div>
                  <span className="font-bold text-slate-800 block">Use n8n Agent Backend</span>
                  <span className="text-[10px] text-slate-500">Route chat requests to webhook</span>
                </div>
                <input
                  type="checkbox"
                  checked={isN8nAgentEnabled}
                  onChange={e => setIsN8nAgentEnabled(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                <div>
                  <span className="font-bold text-slate-800 block">Test URL Mode (/webhook-test/)</span>
                  <span className="text-[10px] text-slate-500">Use when testing on n8n canvas</span>
                </div>
                <input
                  type="checkbox"
                  checked={useTestWebhookMode}
                  onChange={e => setUseTestWebhookMode(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-slate-500 font-medium">
                Train your n8n Agent with complete WellNest knowledge
              </span>
              <button
                type="button"
                onClick={() => setIsTrainingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Agent Training Center</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Quick Shortcuts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 shrink-0 text-xs font-bold">
        <button
          onClick={() => {
            setHealingPlanTab('diet');
            setCurrentScreen('healing-plan');
          }}
          className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" /> Diet Lab
        </button>

        <button
          onClick={() => {
            setHealingPlanTab('period');
            setCurrentScreen('healing-plan');
          }}
          className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <CalendarHeart className="w-3.5 h-3.5" /> Period Tracker
        </button>

        <button
          onClick={() => setCurrentScreen('store')}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Well Store
        </button>

        <button
          onClick={() => setCurrentScreen('sos')}
          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> SOS Help
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-purple-100 shadow-sm overflow-y-auto space-y-4">
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'nesty' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-400 flex items-center justify-center text-base shrink-0 shadow-xs">
                🐣
              </div>
            )}

            <div
              className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-br-xs shadow-md'
                  : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-bl-xs'
              }`}
            >
              {/* Agent Source Tag */}
              {msg.sender === 'nesty' && (
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold">
                  {msg.agentSource === 'n8n' ? (
                    <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                      ⚡ n8n AI Cloud Agent
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>🐣</span>
                      <span>Nesty Wellness Engine</span>
                    </span>
                  )}
                </div>
              )}

              <p className="whitespace-pre-wrap">{msg.text}</p>

              <div
                className={`text-[10px] mt-1.5 flex items-center justify-between ${
                  msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>
              </div>

              {msg.quickAction && (
                <div className="mt-2.5 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentScreen(msg.quickAction!.screen)}
                    className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    <span>{msg.quickAction.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator when agent is responding */}
        {isChatLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-400 flex items-center justify-center text-base shrink-0 shadow-xs">
              🐣
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-purple-100 rounded-bl-xs text-xs text-slate-500 flex items-center gap-2">
              <span className="font-bold text-purple-700">
                {isN8nAgentEnabled ? 'n8n Agent is thinking...' : 'Nesty is typing...'}
              </span>
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Try Asking:
        </span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendChatMessage(prompt)}
            className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-medium whitespace-nowrap border border-purple-200/60 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="shrink-0 flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={
              isListening
                ? '🎙️ Listening... speak your question now...'
                : isN8nAgentEnabled
                ? 'Ask your n8n Agent about cycle, nutrition, skin, or healthcare...'
                : 'Ask Nesty about your cycle, recipes, vitamins, skin or doctors...'
            }
            disabled={isChatLoading}
            className={`w-full py-3 pl-4 pr-10 rounded-2xl bg-white border text-xs sm:text-sm font-medium focus:outline-hidden shadow-xs transition-all disabled:opacity-60 ${
              isListening
                ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                : 'border-slate-200 focus:border-purple-500'
            }`}
          />
          {isListening && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-rose-600 font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Rec
            </span>
          )}
        </div>

        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleMic}
          className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs active:scale-95 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
              : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
          }`}
          title={isListening ? 'Click to stop listening' : 'Voice input (click to speak)'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          type="submit"
          disabled={!inputVal.trim() || isChatLoading}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Safety Notice */}
      <div className="pt-2 text-center text-[10px] text-slate-400">
        Nesty & n8n Agent provide wellness insights. Always consult registered medical practitioners for clinical diagnoses.
      </div>

      {/* COMPREHENSIVE AGENT TRAINING & SETUP CENTER MODAL */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsTrainingModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-purple-100 z-10 text-xs animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-purple-100 text-purple-700 font-bold">
                  <Zap className="w-5 h-5 text-purple-600" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 font-heading">
                    n8n AI Agent Training & Integration Center
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Webhook: <span className="font-mono text-purple-700 font-semibold">{n8nWebhookUrl}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTrainingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 py-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTrainingTab('prompt')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTrainingTab === 'prompt'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>1. Master System Prompt</span>
              </button>

              <button
                onClick={() => setActiveTrainingTab('knowledge')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTrainingTab === 'knowledge'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Website Knowledge Base</span>
              </button>

              <button
                onClick={() => setActiveTrainingTab('workflow')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTrainingTab === 'workflow'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>3. n8n Chart Board & Workflow</span>
              </button>

              <button
                onClick={() => setActiveTrainingTab('diagnostics')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTrainingTab === 'diagnostics'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>4. Diagnostics & Payload</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-3 overflow-y-auto flex-1 space-y-3">
              {/* TAB 1: SYSTEM PROMPT */}
              {activeTrainingTab === 'prompt' && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Instructions for n8n AI Agent Node:</p>
                      <p className="mt-0.5 text-purple-800 leading-relaxed text-[11px]">
                        Copy and paste this full prompt into the <strong>System Message</strong> of your n8n AI Agent or OpenAI / Gemini Chat Model node. It instructs Nesty on all 15 wellness areas, cycle syncing, emergency triage, and empathetic guardrails.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">
                      Master Prompt (15 Full Sections • Complete Guidelines)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(NESTY_MASTER_SYSTEM_PROMPT, 'prompt')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedState === 'prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState === 'prompt' ? 'Copied Prompt!' : 'Copy Master Prompt'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] leading-relaxed max-h-[48vh] overflow-y-auto whitespace-pre-wrap select-all">
                    {NESTY_MASTER_SYSTEM_PROMPT}
                  </pre>
                </div>
              )}

              {/* TAB 2: KNOWLEDGE BASE */}
              {activeTrainingTab === 'knowledge' && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Information from WellNest to Train Your Agent:</p>
                      <p className="mt-0.5 text-blue-800 leading-relaxed text-[11px]">
                        This document contains the entire application data: Diet Lab recipes, calorie & nutrient breakdown, Diet Kits, Menstrual Cycle phases, Well Store product catalog with prices, and Emergency Hospital contacts. You can load this into an n8n Vector Store or Knowledge Base tool.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">
                      Application Reference Document (Markdown)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(WELLNEST_KNOWLEDGE_BASE_TEXT, 'knowledge')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedState === 'knowledge' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState === 'knowledge' ? 'Copied Knowledge Base!' : 'Copy Knowledge Base'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] leading-relaxed max-h-[48vh] overflow-y-auto whitespace-pre-wrap select-all">
                    {WELLNEST_KNOWLEDGE_BASE_TEXT}
                  </pre>
                </div>
              )}

              {/* TAB 3: WORKFLOW & CHART BOARD */}
              {activeTrainingTab === 'workflow' && (
                <div className="space-y-3">
                  {/* Webhook Endpoint Callout Box */}
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-purple-200 text-purple-800 font-bold">⚡</span>
                      <div>
                        <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                          Your Webhook Endpoint URL (Chart Board Trigger)
                        </span>
                        <code className="text-xs font-mono font-bold text-slate-800 break-all select-all">
                          {n8nWebhookUrl}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(n8nWebhookUrl, 'url')}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                      >
                        {copiedState === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedState === 'url' ? 'Copied URL!' : 'Copy Webhook URL'}</span>
                      </button>
                      <a
                        href="https://bhavana21.app.n8n.cloud"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-purple-800 font-bold text-xs flex items-center gap-1 border border-purple-200 transition-all cursor-pointer"
                      >
                        <span>Open n8n</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Instructions Box */}
                  <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span>How to Add to your n8n Chart Board (2 Easy Steps):</span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={downloadWorkflowJson}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 cursor-pointer shadow-xs transition-all active:scale-95"
                          title="Download workflow file for importing"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Download .json</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2), 'workflow')
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                        >
                          {copiedState === 'workflow' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedState === 'workflow' ? 'Copied Chart Board!' : '1-Click Copy Chart Board'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="p-2 bg-white/80 rounded-xl border border-emerald-100">
                        <p className="font-bold text-emerald-800 mb-0.5">Step 1: Copy & Paste</p>
                        <p className="text-slate-600">Click <strong>1-Click Copy</strong> above, open your n8n chart board at <strong>bhavana21.app.n8n.cloud</strong>, and press <strong>Ctrl + V</strong> (Cmd + V).</p>
                      </div>
                      <div className="p-2 bg-white/80 rounded-xl border border-emerald-100">
                        <p className="font-bold text-emerald-800 mb-0.5">Step 2: Connect Model</p>
                        <p className="text-slate-600">Click on the <strong>Google Gemini Chat Model</strong> node to add your Gemini API Key credential.</p>
                      </div>
                      <div className="p-2 bg-white/80 rounded-xl border border-emerald-100">
                        <p className="font-bold text-emerald-800 mb-0.5">Step 3: Toggle to Active</p>
                        <p className="text-slate-600">Turn on the toggle switch in the top-right of your n8n canvas to <strong>Active</strong>!</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Chart Board Flowchart Representation */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        n8n Chart Board Layout Preview
                      </span>
                      <span className="text-[10px] text-purple-300 font-mono">
                        Webhook Path: b634992d-9383-4493-a980-a84db05a68d4/chat
                      </span>
                    </div>

                    {/* Node Cards Canvas Simulation */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center text-xs">
                      {/* Node 1: Webhook */}
                      <div className="p-3 rounded-xl bg-slate-800 border-2 border-emerald-500/80 shadow-md space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 text-[11px]">1. Webhook</span>
                          <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[9px] font-mono">POST</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-mono truncate">
                          /b634992d.../chat
                        </p>
                        <p className="text-[9px] text-slate-400">Respond: Via Respond Node</p>
                      </div>

                      {/* Node 2: AI Agent */}
                      <div className="p-3 rounded-xl bg-purple-900/60 border-2 border-purple-400 shadow-md space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-200 text-[11px]">2. Nesty AI Agent</span>
                          <span className="text-base">🐣</span>
                        </div>
                        <p className="text-[10px] text-purple-200/90 font-medium">
                          Prompt: {"{{ $json.chatInput }}"}
                        </p>
                        <div className="text-[9px] text-purple-300/80 bg-purple-950/60 p-1 rounded font-mono">
                          System Message: Master Prompt
                        </div>
                      </div>

                      {/* Sub-nodes connected into Agent */}
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-slate-800/90 border border-blue-400/60 text-[10px]">
                          <span className="font-bold text-blue-300 block">✨ Gemini Model</span>
                          <span className="text-[9px] text-slate-400">gemini-2.5-flash</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/90 border border-amber-400/60 text-[10px]">
                          <span className="font-bold text-amber-300 block">🧠 Memory Buffer</span>
                          <span className="text-[9px] text-slate-400">Key: {"{{ $json.sessionId }}"}</span>
                        </div>
                      </div>

                      {/* Node 3: Respond to Webhook */}
                      <div className="p-3 rounded-xl bg-slate-800 border-2 border-pink-500/80 shadow-md space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-pink-400 text-[11px]">3. Respond</span>
                          <span className="px-1.5 py-0.5 bg-pink-950 text-pink-300 rounded text-[9px] font-mono">JSON</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-mono truncate">
                          {"output: $json.output"}
                        </p>
                        <p className="text-[9px] text-emerald-400 font-medium">✓ Sends answer to WellNest</p>
                      </div>
                    </div>
                  </div>

                  {/* Raw JSON Code for direct importing */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">
                        Complete n8n Chart Board JSON Definition:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2), 'workflow')
                        }
                        className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedState === 'workflow' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>Copy JSON</span>
                      </button>
                    </div>

                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] leading-relaxed max-h-[35vh] overflow-y-auto whitespace-pre-wrap select-all">
                      {JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 4: DIAGNOSTICS & PAYLOAD */}
              {activeTrainingTab === 'diagnostics' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-xs mb-1">
                      Live Connection Health Check
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Sends a test request to your n8n cloud webhook to check if it is active.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {isTesting ? (
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        <span>Run Test Ping</span>
                      </button>

                      <span className="text-[11px] font-semibold text-slate-600">
                        Current Status:{' '}
                        <span
                          className={`font-bold ${
                            n8nAgentStatus === 'ready'
                              ? 'text-emerald-600'
                              : n8nAgentStatus === 'inactive'
                              ? 'text-amber-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {n8nAgentStatus === 'ready'
                            ? 'Ready (200 OK)'
                            : n8nAgentStatus === 'inactive'
                            ? 'Reached but Workflow Inactive (404)'
                            : n8nAgentStatus}
                        </span>
                      </span>
                    </div>

                    {testResult && (
                      <div
                        className={`mt-2 p-2.5 rounded-xl border text-[11px] ${
                          testResult.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <p className="font-bold">{testResult.message}</p>
                        {testResult.hint && (
                          <p className="mt-1 text-[10px] text-amber-800/90 font-medium">
                            💡 {testResult.hint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-600">
                        Exact JSON Payload Sent by WellNest App to Webhook:
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(samplePayloadJson, 'payload')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedState === 'payload' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Sample Payload</span>
                      </button>
                    </div>

                    <pre className="p-3 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] leading-relaxed max-h-[35vh] overflow-y-auto whitespace-pre-wrap select-all">
                      {samplePayloadJson}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                WellNest • Nesty 🐣 AI Agent Integration
              </span>
              <button
                type="button"
                onClick={() => setIsTrainingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
