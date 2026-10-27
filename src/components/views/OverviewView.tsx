import React from 'react';
import {
  DollarSign,
  Sparkles,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  Bot,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { RFQ, PurchaseOrder } from '../../types/procurement';

interface OverviewViewProps {
  rfqs: RFQ[];
  pos: PurchaseOrder[];
  totalPipelineSpend: number;
  flaggedPosCount: number;
  onSelectRfqForBids: (rfqId: string) => void;
  onNavigateTab: (tab: 'rfqs' | 'bids' | 'pos') => void;
  onSendPrompt: (promptText: string) => void;
  onResolveFlag: (poId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  rfqs,
  pos,
  totalPipelineSpend,
  flaggedPosCount,
  onSelectRfqForBids,
  onNavigateTab,
  onSendPrompt,
  onResolveFlag,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. KPI Header Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Pipeline Spend */}
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pipeline Spend Under Review</span>
            <DollarSign className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-white tracking-tight">
            ${(totalPipelineSpend / 1000).toFixed(1)}k USD
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{rfqs.length} Active RFQ competitions</span>
          </div>
        </div>

        {/* Negotiated Savings */}
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">AI Negotiated Savings (YTD)</span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-white tracking-tight">
            $148,200 USD
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-400">
            <span>12.4% avg variance below baseline</span>
          </div>
        </div>

        {/* SOX & Compliance Exceptions */}
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">SOX & Compliance Exceptions</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-amber-400 tracking-tight">
            {flaggedPosCount} Action Required
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Single-source threshold exceeded</span>
          </div>
        </div>

        {/* Avg Supplier Turnaround */}
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Supplier Turnaround</span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-white tracking-tight">
            6.2 Business Days
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <span>2.4 days faster with automated RFQ</span>
          </div>
        </div>
      </div>

      {/* 2. Highlight AI Autonomous Recommendation Card */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
              <Bot className="h-3.5 w-3.5 text-indigo-400" />
              <span>AI Sourcing Trade-Off Ready</span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
              RFQ-2025-0891: Apex Data Infrastructures is optimal choice (Score: 95/100)
            </h3>
            <p className="max-w-2xl text-xs text-slate-300 leading-relaxed">
              Apex Data’s $388,500 quote saves 5 weeks of critical lead-time compared to HyperScale, avoiding an estimated $42,000 in scheduled engineering idle costs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row shrink-0 gap-2 pt-1 lg:pt-0">
            <button
              onClick={() => onSelectRfqForBids('rfq-101')}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
            >
              Open Evaluation Matrix
            </button>
            <button
              onClick={() => onSendPrompt('Draft a $378,000 counter-offer for Apex Data')}
              className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
            >
              Draft Counter-Offer
            </button>
          </div>
        </div>
      </div>

      {/* 3. Dual Column Analytics Widgets: Stack on mobile, grid on desktop */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Priority Requisitions Under Review */}
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-slate-800 bg-slate-850 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Priority Requisitions</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">Real-time status of active bidding competitions</p>
            </div>
            <button
              onClick={() => onNavigateTab('rfqs')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 min-h-[36px] flex items-center"
            >
              View All ({rfqs.length}) &rarr;
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-800">
            {rfqs.slice(0, 3).map((rfq) => (
              <div
                key={rfq.id}
                onClick={() => onSelectRfqForBids(rfq.id)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 cursor-pointer hover:bg-slate-800/30 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{rfq.rfqNumber}</span>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {rfq.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">{rfq.category}</span>
                    <span>•</span>
                    <span className="font-mono">${rfq.budget.toLocaleString()} USD</span>
                    <span>•</span>
                    <span>{rfq.bidsReceivedCount} Bids</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-1 sm:pt-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      rfq.status === 'EVALUATION'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : rfq.status === 'AWARDED'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                    }`}
                  >
                    {rfq.status.replace('_', ' ')}
                  </span>
                  <div className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 group-hover:border-indigo-500/50 group-hover:text-white transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Governance Watchdog */}
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs sm:text-sm font-semibold text-white">Compliance Watchdog</h4>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                Policy v4.2
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {pos
                .filter((p) => p.status === 'FLAGGED')
                .map((p) => (
                  <div key={p.id} className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 sm:p-3.5">
                    <div className="flex items-start gap-2.5 text-rose-300">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                      <div className="flex-1">
                        <p className="font-bold text-xs">{p.poNumber} — Threshold Block</p>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {p.complianceWarning}
                        </p>
                        <button
                          onClick={() => onResolveFlag(p.id)}
                          className="mt-2.5 w-full sm:w-auto flex items-center justify-center rounded-lg bg-rose-600/30 px-3 py-2 text-xs font-semibold text-rose-200 border border-rose-500/40 hover:bg-rose-600/40 active:scale-98 transition-all min-h-[44px]"
                        >
                          Attach Simulated Form CS-8 &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Dual-Approval Audit Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All purchase commitments over $50,000 USD require secondary VP signoff. Anti-split logic running continuously.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
            <span>SOX Section 404 Audit</span>
            <span className="text-emerald-400 font-mono">100% Cleared</span>
          </div>
        </div>
      </div>
    </div>
  );
};
