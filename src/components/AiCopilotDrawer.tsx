import React, { useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  RefreshCw,
  ChevronRight,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { ChatMessage } from '../types/procurement';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatMessages: ChatMessage[];
  isAiTyping: boolean;
  chatInput: string;
  setChatInput: (val: string) => void;
  onSendPrompt: (promptText?: string) => void;
  onExecuteSuggestedAction: (action?: ChatMessage['suggestedAction']) => void;
  useLiveGemini: boolean;
  setUseLiveGemini: (val: boolean) => void;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  chatMessages,
  isAiTyping,
  chatInput,
  setChatInput,
  onSendPrompt,
  onExecuteSuggestedAction,
  useLiveGemini,
  setUseLiveGemini,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay (only on < lg screens) */}
      <div
        className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Drawer Shell: Fullscreen on mobile, sidebar on desktop */}
      <aside className="fixed inset-0 lg:static z-50 lg:z-auto flex w-full lg:w-96 flex-col border-l border-slate-800 bg-slate-900/98 lg:bg-slate-900/95 backdrop-blur-md shrink-0 h-full animate-in slide-in-from-right-4 duration-200">
        {/* Copilot Header */}
        <div className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-800 px-4 shrink-0 bg-slate-900">
          <div className="flex items-center gap-2.5">
            {/* Back button on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden -ml-1 p-2 rounded-lg text-slate-300 hover:bg-slate-800 active:bg-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Back to workspace"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">AI Sourcing Copilot</h3>
              <p className="text-[10px] text-slate-400">
                {useLiveGemini ? 'Gemini 3.8 Flash (Server)' : 'Deterministic Simulation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close AI Copilot"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Gemini Mode Toggle Bar */}
        <div className="border-b border-slate-800 bg-slate-950/70 p-2.5 text-[11px] space-y-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Inference Engine:</span>
            <div className="flex items-center gap-1 rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setUseLiveGemini(false)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                  !useLiveGemini
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 active:bg-slate-700'
                }`}
              >
                Offline Presets
              </button>
              <button
                type="button"
                onClick={() => setUseLiveGemini(true)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                  useLiveGemini
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 active:bg-slate-700'
                }`}
              >
                Gemini Live
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="h-3 w-3" />
              <span>Real-time Policy Verification</span>
            </span>
            <span className="text-indigo-400 font-mono">v4.2</span>
          </div>
        </div>

        {/* Chat Transcript Area */}
        <div className="flex-1 overflow-y-auto touch-scroll p-3 sm:p-4 space-y-3.5 text-xs">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'border border-slate-800 bg-slate-850 text-slate-200 rounded-bl-sm'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="mb-2 flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                    <span className="font-bold text-indigo-400">
                      {msg.mode === 'GEMINI_LIVE' ? '✨ GEMINI 3.8 FLASH' : '🛡️ SIMULATED SOURCING AI'}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed">
                  {msg.content}
                </div>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-400">Governance Evidence:</span>
                    <ul className="mt-1 space-y-0.5 list-disc list-inside text-indigo-300">
                      {msg.citations.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* In-Message Interactive Action CTA */}
                {msg.suggestedAction && (
                  <button
                    onClick={() => onExecuteSuggestedAction(msg.suggestedAction)}
                    className="mt-3 flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 px-3 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/30 active:scale-98 transition-all min-h-[40px]"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <span className="mt-1 px-1 text-[10px] text-slate-500">{msg.timestamp}</span>
            </div>
          ))}

          {isAiTyping && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-850 p-3 text-slate-400 text-xs">
              <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
              <span>Scanning compliance rulebooks & supplier data...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick AI Prompts Bar (Scrollable on small screens) */}
        <div className="border-t border-slate-800 bg-slate-950/80 p-2.5 shrink-0">
          <p className="mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Suggested Inquiries
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll pb-1 scrollbar-none">
            <button
              onClick={() => onSendPrompt('Compare bids for RFQ-2025-0891 and give me the best trade-off')}
              className="shrink-0 rounded-full border border-slate-700 bg-slate-850 px-3 py-1.5 text-[11px] text-slate-300 hover:border-indigo-500 hover:text-white active:bg-slate-800 transition-colors"
            >
              ⚖️ Compare Bids
            </button>
            <button
              onClick={() => onSendPrompt('Audit PO-2025-10493 compliance flag')}
              className="shrink-0 rounded-full border border-slate-700 bg-slate-850 px-3 py-1.5 text-[11px] text-slate-300 hover:border-indigo-500 hover:text-white active:bg-slate-800 transition-colors"
            >
              🚨 Check PO Flag
            </button>
            <button
              onClick={() => onSendPrompt('Show cost savings and price benchmarking')}
              className="shrink-0 rounded-full border border-slate-700 bg-slate-850 px-3 py-1.5 text-[11px] text-slate-300 hover:border-indigo-500 hover:text-white active:bg-slate-800 transition-colors"
            >
              💰 Spend Analytics
            </button>
          </div>
        </div>

        {/* User Chat Input Box with Safe-Area Padding */}
        <div className="border-t border-slate-800 p-2.5 sm:p-3 shrink-0 bg-slate-900 pb-safe">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSendPrompt();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Ask Copilot about bids, SOX rules..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-3.5 pr-12 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isAiTyping || !chatInput.trim()}
              className="absolute right-1.5 rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-500 disabled:opacity-40 active:scale-95 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
