import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from '../types/procurement';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  FileText,
  Zap,
} from 'lucide-react';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatMessages: ChatMessage[];
  isAiTyping: boolean;
  chatInput: string;
  setChatInput: (input: string) => void;
  onSendPrompt: (promptText?: string) => void;
  onExecuteSuggestedAction: (action: ChatMessage['suggestedAction']) => void;
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
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = isArabic
    ? [
        t('copilot.p1'),
        t('copilot.p2'),
        t('copilot.p3'),
        t('copilot.p4'),
      ]
    : [
        'Compare Apex Data vs HyperScale lead-time trade-off',
        'Audit open purchase orders for SOX Section 404 holds',
        'Recommend counter-offer target for RFQ-2025-0892',
        'Evaluate supplier ESG ratings across Tier-1 vendors',
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end rtl:justify-start bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full md:w-[460px] h-full bg-[#F6F5F1] dark:bg-[#0B1614] border-l rtl:border-l-0 rtl:border-r border-[#DDE3E1] dark:border-[#24423D] flex flex-col shadow-2xl animate-in slide-in-from-right rtl:slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Executive Copilot Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#DDE3E1] dark:border-[#24423D] px-5 shrink-0 bg-white dark:bg-[#11211E]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173E38] text-white shadow-2xs">
              <Sparkles className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-[#17272A] dark:text-[#EBF1F0]">
                  {t('copilot.title')}
                </h2>
                <Badge variant="primary" size="sm">Gemini 3.8 Flash</Badge>
              </div>
              <p className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                {t('copilot.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Model Toggle */}
            <button
              onClick={() => setUseLiveGemini(!useLiveGemini)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                useLiveGemini
                  ? 'border-[#173E38]/30 bg-[#173E38]/10 text-[#173E38] dark:border-[#2E7A6F]/40 dark:text-[#4EA89A]'
                  : 'border-[#DDE3E1] bg-[#FAF9F6] text-[#647A7B] dark:border-[#24423D] dark:bg-[#162B27] dark:text-[#8BA39F]'
              }`}
              title="Toggle Live Server-Side Gemini API vs Deterministic Heuristics"
            >
              <Zap className="h-3 w-3" />
              <span>{useLiveGemini ? (isArabic ? 'الذكاء الحي' : 'Live AI') : (isArabic ? 'بدون إنترنت' : 'Offline')}</span>
            </button>

            <button
              onClick={onClose}
              className="text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] p-1 rounded-md"
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 2. Messages Stream */}
        <div className="flex-1 overflow-y-auto touch-scroll p-4 space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[#647A7B] dark:text-[#8BA39F] px-1">
                  <span>{isUser ? (isArabic ? 'المفوض بالتوقيع' : 'Signatory Director') : t('copilot.title')}</span>
                  <span>•</span>
                  <span dir="ltr">{msg.timestamp}</span>
                </div>

                <div
                  className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed max-w-[92%] shadow-2xs ${
                    isUser
                      ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] rounded-br-xs rtl:rounded-br-2xl rtl:rounded-bl-xs'
                      : 'bg-white dark:bg-[#11211E] text-[#17272A] dark:text-[#EBF1F0] border border-[#DDE3E1] dark:border-[#24423D] rounded-bl-xs rtl:rounded-bl-2xl rtl:rounded-br-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Governance Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#DDE3E1] dark:border-[#24423D] flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] uppercase font-semibold">
                        {t('copilot.citations')}:
                      </span>
                      {msg.citations.map((cite, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#FAF9F6] dark:bg-[#162B27] text-[#173E38] dark:text-[#4EA89A] border border-[#DDE3E1] dark:border-[#24423D]"
                        >
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Procurement Actions */}
                  {msg.suggestedAction && (
                    <div className="mt-3 pt-2.5 border-t border-[#DDE3E1] dark:border-[#24423D]">
                      <Button
                        variant="accent"
                        size="sm"
                        fullWidth
                        onClick={() => onExecuteSuggestedAction(msg.suggestedAction)}
                        rightIcon={<ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />}
                      >
                        {msg.suggestedAction.label}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isAiTyping && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] text-xs text-[#647A7B] dark:text-[#8BA39F] w-fit">
              <span className="h-2 w-2 rounded-full bg-[#173E38] dark:bg-[#4EA89A] animate-ping" />
              <span>{t('copilot.typing')}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. Quick Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] overflow-x-auto touch-scroll scrollbar-none flex items-center gap-1.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSendPrompt(q)}
              className="px-2.5 py-1 rounded-md bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D] text-[11px] text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] hover:bg-white dark:hover:bg-[#1D3732] shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 4. Chat Input Bar */}
        <div className="p-3.5 bg-white dark:bg-[#11211E] border-t border-[#DDE3E1] dark:border-[#24423D] pb-safe">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={t('copilot.inputPlaceholder')}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] px-3 py-2.5 text-xs sm:text-sm text-[#17272A] dark:text-[#EBF1F0] placeholder-[#92A4A3] focus:border-[#173E38] dark:focus:border-[#2E7A6F] focus:outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!chatInput.trim() || isAiTyping}
              leftIcon={<Send className="h-4 w-4 rtl:-scale-x-100" />}
            >
              {t('copilot.btnSend')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
