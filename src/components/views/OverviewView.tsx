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
  CheckCircle2,
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
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Title Header (Clean and purposeful) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
            Procurement Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pipeline commitments, savings & SOX compliance audit
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
          <Bot className="h-3.5 w-3.5 text-indigo-400" />
          <span>Copilot Engine v4.2</span>
        </div>
      </div>

      {/* 2. Responsive KPI Grid: 2x2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Pipeline Spend */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-medium">Pipeline Spend</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-2xl font-bold text-white tracking-tight">
              ${(totalPipelineSpend / 1000).toFixed(1)}k
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="h-3 w-3 shrink-0" />
              <span className="truncate">{rfqs.length} Events Active</span>
            </div>
          </div>
        </div>

        {/* Realized Savings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-medium">YTD Savings</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-2xl font-bold text-white tracking-tight">
              $148,200
            </div>
            <div className="mt-1 text-[10px] sm:text-xs text-indigo-400 font-medium truncate">
              12.4% below budget
            </div>
          </div>
        </div>

        {/* SOX Policy Flags */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-medium">Policy Flags</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-2xl font-bold text-amber-400 tracking-tight">
              {flaggedPosCount} Action Req.
            </div>
            <div className="mt-1 text-[10px] sm:text-xs text-slate-400 font-medium truncate">
              Single-source cap
            </div>
          </div>
        </div>

        {/* Avg Turnaround */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-medium">Avg Cycle Time</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-2xl font-bold text-white tracking-tight">
              6.2 Days
            </div>
            <div className="mt-1 text-[10px] sm:text-xs text-emerald-400 font-medium truncate">
              -2.4d with auto RFQ
            </div>
          </div>
        </div>
      </div>

      {/* 3. Highlight AI Strategic Recommendation Banner */}
      <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-b sm:bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/40 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/20 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                <Bot className="h-3 w-3 text-indigo-300" />
                <span>Trade-Off Analysis Ready</span>
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-400">
                Score: 95/100
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-white leading-snug">
              Apex Data Infrastructures recommended for RFQ-2025-0891
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Apex’s $388,500 bid delivers in 4 weeks, avoiding an estimated <strong>$42,000 in downstream idle labor costs</strong> associated with HyperScale’s 9-week turnaround.
            </p>

            {/* Quick Micro Comparison Table on Mobile */}
            <div className="grid grid-cols-2 gap-2 pt-1 sm:hidden text-[11px]">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5">
                <div className="font-bold text-emerald-300">Apex Data (Recommended)</div>
                <div className="font-mono text-white text-xs font-semibold mt-0.5">$388,500</div>
                <div className="text-[10px] text-slate-300">4-week delivery • 92 ESG</div>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5">
                <div className="font-bold text-amber-300">HyperScale (High Risk)</div>
                <div className="font-mono text-white text-xs font-semibold mt-0.5">$365,000</div>
                <div className="text-[10px] text-slate-300">9-week shipping penalty</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row shrink-0 gap-2 pt-2 lg:pt-0">
            <button
              onClick={() => onSelectRfqForBids('rfq-101')}
              className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
            >
              Open Evaluation Matrix
            </button>
            <button
              onClick={() => onSendPrompt('Draft a $378,000 counter-offer for Apex Data')}
              className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
            >
              Draft Counter-Offer
            </button>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Dashboard Widgets */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Priority Requisitions List */}
        <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Priority Requisitions</h3>
              <p className="text-[11px] text-slate-400">Live bidding and technical evaluation status</p>
            </div>
            <button
              onClick={() => onNavigateTab('rfqs')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 min-h-[36px] flex items-center"
            >
              View All ({rfqs.length}) &rarr;
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-800/80">
            {rfqs.slice(0, 3).map((rfq) => (
              <div
                key={rfq.id}
                onClick={() => onSelectRfqForBids(rfq.id)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2.5 cursor-pointer hover:bg-slate-800/40 -mx-2 px-2.5 rounded-xl transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{rfq.rfqNumber}</span>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {rfq.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300 font-medium">
                      {rfq.category}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-300">${rfq.budget.toLocaleString()} USD</span>
                    <span>•</span>
                    <span className="font-medium">{rfq.bidsReceivedCount} Bids</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      rfq.status === 'EVALUATION'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : rfq.status === 'AWARDED'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                    }`}
                  >
                    {rfq.status.replace('_', ' ')}
                  </span>
                  <div className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 group-hover:border-indigo-500 group-hover:text-white transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Watchdog */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-white">Compliance Watchdog</h3>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                SOX v4.2
              </span>
            </div>

            <div className="mt-3.5 space-y-3">
              {pos
                .filter((p) => p.status === 'FLAGGED')
                .map((p) => (
                  <div key={p.id} className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-3 sm:p-3.5">
                    <div className="flex items-start gap-2.5 text-rose-300">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                      <div className="flex-1">
                        <p className="font-bold text-xs">{p.poNumber} — Threshold Block</p>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {p.complianceWarning}
                        </p>
                        <button
                          onClick={() => onResolveFlag(p.id)}
                          className="mt-2.5 w-full flex items-center justify-center rounded-xl bg-rose-600/30 px-3 py-2 text-xs font-bold text-rose-200 border border-rose-500/40 hover:bg-rose-600/40 active:scale-98 transition-all min-h-[44px]"
                        >
                          Attach Form CS-8 Waiver &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Dual-Approval Audit Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All commitments &gt; $50k require secondary VP sign-off. Anti-split algorithms active.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
            <span>SOX Governance Status</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              100% Monitored
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
