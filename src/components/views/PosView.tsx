import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Check, Filter } from 'lucide-react';
import { PurchaseOrder } from '../../types/procurement';

interface PosViewProps {
  pos: PurchaseOrder[];
  onApprovePo: (poId: string) => void;
  onResolveFlag: (poId: string) => void;
  onBatchAudit: () => void;
}

export const PosView: React.FC<PosViewProps> = ({
  pos,
  onApprovePo,
  onResolveFlag,
  onBatchAudit,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FLAGGED' | 'PENDING_APPROVAL' | 'APPROVED'>('ALL');

  const filteredPos = pos.filter((po) => {
    if (statusFilter === 'ALL') return true;
    return po.status === statusFilter;
  });

  const flaggedCount = pos.filter((p) => p.status === 'FLAGGED').length;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header and Batch Audit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
            Purchase Orders & SOX Delegations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-source authorization, approval workflows, and commitment releases
          </p>
        </div>

        <button
          onClick={onBatchAudit}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
        >
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span>Batch Audit Ledger</span>
        </button>
      </div>

      {/* Horizontal Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll pb-1 scrollbar-none">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all min-h-[38px] ${
            statusFilter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
          }`}
        >
          All Orders ({pos.length})
        </button>

        <button
          onClick={() => setStatusFilter('FLAGGED')}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all min-h-[38px] ${
            statusFilter === 'FLAGGED'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
              : 'border border-amber-500/30 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40'
          }`}
        >
          <span>Flagged Exceptions</span>
          {flaggedCount > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[9px] font-bold text-slate-950">
              {flaggedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter('PENDING_APPROVAL')}
          className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all min-h-[38px] ${
            statusFilter === 'PENDING_APPROVAL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
          }`}
        >
          Pending Authorization
        </button>

        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all min-h-[38px] ${
            statusFilter === 'APPROVED'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
          }`}
        >
          Approved
        </button>
      </div>

      {/* PO List Cards */}
      <div className="space-y-3.5">
        {filteredPos.map((po) => (
          <div
            key={po.id}
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              po.status === 'FLAGGED'
                ? 'border-amber-500/40 bg-slate-900 ring-1 ring-amber-500/20 shadow-lg'
                : 'border-slate-800 bg-slate-900/90'
            }`}
          >
            {/* Top Row: PO Number, Status & Terms */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">{po.poNumber}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    po.status === 'APPROVED'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : po.status === 'FLAGGED'
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                      : po.status === 'DISPATCHED'
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  }`}
                >
                  {po.status.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Terms: {po.paymentTerms}</span>
            </div>

            {/* Supplier & Linked RFQ */}
            <div className="mt-2 text-xs text-slate-300">
              Supplier: <span className="font-semibold text-white">{po.vendorName}</span> • Requisition:{' '}
              <span className="font-mono text-indigo-400">{po.rfqRef}</span>
            </div>

            {/* Commitment Value and Action Button */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Commitment Value
                </span>
                <p className="font-mono text-base sm:text-xl font-bold text-white">
                  ${po.amount.toLocaleString()} {po.currency}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {po.status === 'FLAGGED' ? (
                  <button
                    onClick={() => onResolveFlag(po.id)}
                    className="w-full sm:w-auto flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-500 active:scale-98 transition-all min-h-[44px]"
                  >
                    Resolve Compliance
                  </button>
                ) : po.status === 'PENDING_APPROVAL' ? (
                  <button
                    onClick={() => onApprovePo(po.id)}
                    className="w-full sm:w-auto flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 active:scale-98 transition-all min-h-[44px]"
                  >
                    Authorize PO
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                    <Check className="h-4 w-4" /> Approved
                  </span>
                )}
              </div>
            </div>

            {/* Compliance Warning Box */}
            {po.complianceWarning && (
              <div className="mt-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-rose-200">SOX Audit Exception: </span>
                  {po.complianceWarning}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
