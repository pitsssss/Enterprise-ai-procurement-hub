import React from 'react';
import { FileText, X, Sparkles } from 'lucide-react';

interface CreateRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (val: string) => void;
  category: 'IT Hardware' | 'Precision Machining' | 'Facility Operations' | 'Logistics' | 'Raw Materials';
  setCategory: (val: any) => void;
  budget: number;
  setBudget: (val: number) => void;
  department: string;
  setDepartment: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateRfqModal: React.FC<CreateRfqModalProps> = ({
  isOpen,
  onClose,
  title,
  setTitle,
  category,
  setCategory,
  budget,
  setBudget,
  department,
  setDepartment,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto touch-scroll">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">Draft New RFQ Requisition</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Requisition Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next-Gen Liquid Cooled Data Center Pods"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[44px]"
              >
                <option value="IT Hardware">IT Hardware</option>
                <option value="Precision Machining">Precision Machining</option>
                <option value="Facility Operations">Facility Operations</option>
                <option value="Logistics">Logistics</option>
                <option value="Raw Materials">Raw Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Budget (USD)</label>
              <input
                type="number"
                min={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs sm:text-sm text-slate-200 focus:border-indigo-500 focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Requesting Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs sm:text-sm text-slate-200 focus:border-indigo-500 focus:outline-none min-h-[44px]"
            />
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-[11px] text-indigo-300 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
            <span className="leading-relaxed">
              Our AI engine will auto-verify line-item standard tolerances and invite 3 Tier-1 approved suppliers upon publishing.
            </span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
            >
              Publish Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
