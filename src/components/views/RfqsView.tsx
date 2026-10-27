import React, { useState } from 'react';
import {
  Plus,
  FileCheck,
  Bot,
  Info,
  FileSpreadsheet,
  ChevronRight,
  ChevronDown,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { RFQ } from '../../types/procurement';

interface RfqsViewProps {
  filteredRfqs: RFQ[];
  activeRfq: RFQ | undefined;
  selectedRfqId: string;
  setSelectedRfqId: (id: string) => void;
  rfqCategoryFilter: string;
  setRfqCategoryFilter: (cat: string) => void;
  onOpenCreateModal: () => void;
  onEvaluateBids: (rfqId: string) => void;
  onSendPrompt: (prompt: string) => void;
}

const CATEGORIES = [
  'ALL',
  'IT Hardware',
  'Precision Machining',
  'Facility Operations',
  'Logistics',
  'Raw Materials',
];

export const RfqsView: React.FC<RfqsViewProps> = ({
  filteredRfqs,
  activeRfq,
  selectedRfqId,
  setSelectedRfqId,
  rfqCategoryFilter,
  setRfqCategoryFilter,
  onOpenCreateModal,
  onEvaluateBids,
  onSendPrompt,
}) => {
  // Track expanded mobile cards
  const [expandedRfqId, setExpandedRfqId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRfqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
            Requests For Quotation (RFQs)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active supplier solicitations, line-item specs, and proposal intake
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          <span>New Requisition</span>
        </button>
      </div>

      {/* Horizontal Category Filter Pills (Mobile + Desktop friendly) */}
      <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setRfqCategoryFilter(cat)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all min-h-[38px] ${
              rfqCategoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850 active:bg-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. MOBILE RFQ CARDS WITH PROGRESSIVE DISCLOSURE (< md) */}
      {/* ========================================================= */}
      <div className="md:hidden space-y-3">
        {filteredRfqs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-xs">No RFQs match the selected filter.</p>
          </div>
        ) : (
          filteredRfqs.map((rfq) => {
            const isExpanded = expandedRfqId === rfq.id;
            const isSelected = selectedRfqId === rfq.id;

            return (
              <div
                key={rfq.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-indigo-500/60 bg-slate-900/95 ring-1 ring-indigo-500/30 shadow-md'
                    : 'border-slate-800 bg-slate-900/80'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {rfq.rfqNumber}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      {rfq.category}
                    </span>
                  </div>
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
                </div>

                {/* Title & Department */}
                <h2 className="mt-2 text-sm font-bold text-white leading-snug">{rfq.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{rfq.department}</p>

                {/* Key Numbers Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400">Target Budget</span>
                    <p className="font-mono font-bold text-white text-sm">
                      ${rfq.budget.toLocaleString()} USD
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Bids Received</span>
                    <p className="font-bold text-emerald-400 text-sm">
                      {rfq.bidsReceivedCount}{' '}
                      <span className="text-slate-400 text-xs font-normal">
                        / {rfq.invitedVendorsCount} invited
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>Submission Deadline: {rfq.deadline}</span>
                  </div>
                </div>

                {/* Expandable Line-Items Accordion */}
                <div className="mt-3 border-t border-slate-800 pt-2.5">
                  <button
                    onClick={() => toggleExpand(rfq.id)}
                    className="flex w-full items-center justify-between py-1 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{rfq.lineItems.length} Verified Line Items</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-indigo-400' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 space-y-2 animate-in fade-in duration-150">
                      {rfq.lineItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-800 bg-slate-950/90 p-2.5 text-[11px]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-indigo-300">{item.sku}</span>
                            <span className="font-semibold text-white">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                          <p className="mt-0.5 text-slate-300 text-[11px]">{item.description}</p>
                          <div className="mt-2 flex items-center justify-between text-slate-400 border-t border-slate-850 pt-1.5">
                            <span>Target: ${item.targetPrice.toLocaleString()} / unit</span>
                            <span className="font-semibold text-white">
                              Total: ${(item.quantity * item.targetPrice).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}

                      {rfq.policyNotes && (
                        <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/20 p-2.5 text-[11px] text-indigo-300 flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-indigo-400" />
                          <span>{rfq.policyNotes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedRfqId(rfq.id);
                      onEvaluateBids(rfq.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
                  >
                    <span>Evaluate Bids Matrix</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP RFQ TABLE (>= md screens) */}
      {/* ========================================================= */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Reference</th>
              <th className="px-5 py-3.5">Title & Department</th>
              <th className="px-5 py-3.5">Target Budget</th>
              <th className="px-5 py-3.5">Bids Received</th>
              <th className="px-5 py-3.5">Deadline</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredRfqs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                  No RFQs found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredRfqs.map((rfq) => (
                <tr
                  key={rfq.id}
                  onClick={() => setSelectedRfqId(rfq.id)}
                  className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                    rfq.id === selectedRfqId ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="px-5 py-4 font-mono font-bold text-indigo-400">
                    {rfq.rfqNumber}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{rfq.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {rfq.category} • {rfq.department}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono">
                    <div className="font-semibold">${rfq.budget.toLocaleString()} USD</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-white">{rfq.bidsReceivedCount}</span>
                    <span className="text-slate-400"> / {rfq.invitedVendorsCount} invited</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{rfq.deadline}</td>
                  <td className="px-5 py-4">
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
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRfqId(rfq.id);
                        onEvaluateBids(rfq.id);
                      }}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      Evaluate Bids
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* 3. DESKTOP SPECIFICATION INSPECTOR */}
      {/* ========================================================= */}
      {activeRfq && (
        <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                Line-Item Specification Sheet: {activeRfq.rfqNumber}
              </h3>
            </div>
            <button
              onClick={() => onSendPrompt(`Analyze specification compliance for ${activeRfq.rfqNumber}`)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <Bot className="h-4 w-4" />
              <span>Run AI Spec Feasibility</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {activeRfq.lineItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-300">{item.sku}</span>
                  <span className="text-xs font-semibold text-white">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                  <span>Target: ${item.targetPrice.toLocaleString()} / unit</span>
                  <span className="font-semibold text-slate-200">
                    Line Total: ${(item.quantity * item.targetPrice).toLocaleString()} USD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
