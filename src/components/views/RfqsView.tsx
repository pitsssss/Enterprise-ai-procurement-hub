import React from 'react';
import {
  Plus,
  FileCheck,
  Bot,
  Info,
  FileSpreadsheet,
  ChevronRight,
  Clock,
  Layers,
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
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* View Header & Action Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Requests For Quotation (RFQs)</h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Create specifications, track supplier submissions, and run automated AI spec verification
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={rfqCategoryFilter}
              onChange={(e) => setRfqCategoryFilter(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            >
              <option value="ALL">All Sourcing Categories</option>
              <option value="IT Hardware">IT Hardware</option>
              <option value="Precision Machining">Precision Machining</option>
              <option value="Facility Operations">Facility Operations</option>
              <option value="Logistics">Logistics</option>
              <option value="Raw Materials">Raw Materials</option>
            </select>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            <span>New Requisition</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. MOBILE RFQ CARDS (< md screens) */}
      {/* ========================================================= */}
      <div className="md:hidden space-y-3">
        {filteredRfqs.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-850 p-8 text-center text-slate-400">
            <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-xs">No RFQs found matching the selected filter.</p>
          </div>
        ) : (
          filteredRfqs.map((rfq) => {
            const isSelected = rfq.id === selectedRfqId;
            return (
              <div
                key={rfq.id}
                className={`rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-indigo-500/60 bg-slate-850 ring-1 ring-indigo-500/30 shadow-md'
                    : 'border-slate-800 bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">{rfq.rfqNumber}</span>
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
                </div>

                <h3 className="mt-2 text-xs font-semibold text-white leading-snug">{rfq.title}</h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {rfq.category} • {rfq.department}
                </p>

                {/* Key Metrics Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400">Target Budget:</span>
                    <p className="font-mono font-semibold text-white">${rfq.budget.toLocaleString()} USD</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Bids Received:</span>
                    <p className="font-semibold text-white">
                      {rfq.bidsReceivedCount} / {rfq.invitedVendorsCount} invited
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 pt-1 text-[10px] text-slate-400 border-t border-slate-800/60">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>Submission Deadline: {rfq.deadline}</span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRfqId(rfq.id)}
                    className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all min-h-[44px] ${
                      isSelected
                        ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                        : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Viewing Specs' : 'View Specs'}
                  </button>

                  <button
                    onClick={() => onEvaluateBids(rfq.id)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
                  >
                    <span>Evaluate Bids</span>
                    <ChevronRight className="h-3.5 w-3.5" />
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
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-800 bg-slate-850 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Title & Department</th>
              <th className="px-4 py-3">Target Budget</th>
              <th className="px-4 py-3">Bids Received</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
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
                  <td className="px-4 py-3.5 font-mono font-medium text-indigo-400">
                    {rfq.rfqNumber}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-white">{rfq.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {rfq.category} • {rfq.department}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono">
                    <div>${rfq.budget.toLocaleString()} USD</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-white">{rfq.bidsReceivedCount}</span>
                    <span className="text-slate-400"> / {rfq.invitedVendorsCount} invited</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">{rfq.deadline}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
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
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEvaluateBids(rfq.id);
                      }}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
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
      {/* 3. SELECTED RFQ SPECIFICATION SHEET */}
      {/* ========================================================= */}
      {activeRfq && (
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-indigo-400 shrink-0" />
              <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
                Line-Item Specification Sheet: {activeRfq.rfqNumber}
              </h3>
            </div>
            <button
              onClick={() => onSendPrompt(`Analyze specification compliance for ${activeRfq.rfqNumber}`)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 min-h-[36px]"
            >
              <Bot className="h-4 w-4" />
              <span>Run AI Spec Feasibility</span>
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {activeRfq.lineItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-300">{item.sku}</span>
                  <span className="text-xs font-semibold text-white">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                  <span>Target: ${item.targetPrice.toLocaleString()} / unit</span>
                  <span className="font-semibold text-slate-200">
                    Line Total: ${(item.quantity * item.targetPrice).toLocaleString()} USD
                  </span>
                </div>
              </div>
            ))}
          </div>

          {activeRfq.policyNotes && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 p-3 text-xs text-indigo-300">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
              <span className="leading-relaxed">{activeRfq.policyNotes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
