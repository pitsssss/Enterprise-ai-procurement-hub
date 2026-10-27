import React from 'react';
import { ShieldAlert, AlertTriangle, Check } from 'lucide-react';
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
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Purchase Orders & Approval Controls</h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Verify SOX delegations, release payment vouchers, and clear single-source exception flags
          </p>
        </div>
        <button
          onClick={onBatchAudit}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
        >
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span>Batch Audit Ledger</span>
        </button>
      </div>

      {/* PO List Cards */}
      <div className="space-y-3">
        {pos.map((po) => (
          <div
            key={po.id}
            className={`rounded-xl border p-4 sm:p-5 transition-all ${
              po.status === 'FLAGGED'
                ? 'border-amber-500/40 bg-slate-850 ring-1 ring-amber-500/20 shadow-md'
                : 'border-slate-800 bg-slate-850'
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-mono text-sm font-bold text-white">{po.poNumber}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
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
                  <span className="text-xs text-slate-400">Terms: {po.paymentTerms}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Supplier: <span className="font-medium text-white">{po.vendorName}</span> • Linked Requisition:{' '}
                  <span className="font-mono text-indigo-400">{po.rfqRef}</span>
                </div>
              </div>

              {/* Value & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Commitment</span>
                  <p className="font-mono text-sm sm:text-base font-bold text-white leading-tight">
                    ${po.amount.toLocaleString()} {po.currency}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {po.status === 'FLAGGED' ? (
                    <button
                      onClick={() => onResolveFlag(po.id)}
                      className="rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 active:scale-98 transition-all min-h-[44px]"
                    >
                      Resolve Compliance
                    </button>
                  ) : po.status === 'PENDING_APPROVAL' ? (
                    <button
                      onClick={() => onApprovePo(po.id)}
                      className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-98 transition-all min-h-[44px]"
                    >
                      Authorize PO
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                      <Check className="h-4 w-4" /> Approved
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Compliance Warning Banner */}
            {po.complianceWarning && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 p-3 text-xs text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-rose-200">Audit Flag: </span>
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
