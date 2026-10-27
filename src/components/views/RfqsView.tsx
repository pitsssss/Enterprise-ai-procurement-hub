import React, { useState } from 'react';
import { RFQ } from '../../types/procurement';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  FileText,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  Building,
} from 'lucide-react';

interface RfqsViewProps {
  rfqs: RFQ[];
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  onOpenCreateModal: () => void;
  onEvaluateBids: (rfqId: string) => void;
  onSendPrompt: (prompt: string) => void;
}

export const RfqsView: React.FC<RfqsViewProps> = ({
  rfqs,
  categoryFilter,
  setCategoryFilter,
  onOpenCreateModal,
  onEvaluateBids,
  onSendPrompt,
}) => {
  const [expandedRfqId, setExpandedRfqId] = useState<string | null>('rfq-101');

  const categories = ['ALL', 'IT Hardware', 'Precision Machining', 'Facility Operations', 'Logistics', 'Raw Materials'];

  const filteredRfqs = rfqs.filter((r) => {
    if (categoryFilter === 'ALL') return true;
    return r.category === categoryFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedRfqId(expandedRfqId === id ? null : id);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            RFQs & Capital Requisitions
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            Audit specification sheets, target prices, vendor response quotas, and deadline tracking.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreateModal}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create Requisition
        </Button>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto touch-scroll scrollbar-none py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
              categoryFilter === cat
                ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] shadow-2xs font-semibold'
                : 'bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6] dark:hover:bg-[#1D3732]'
            }`}
          >
            {cat === 'ALL' ? 'All Portfolios' : cat}
          </button>
        ))}
      </div>

      {/* 3. High-Density Desktop Data Table (>= md screens) */}
      <div className="hidden md:block rounded-xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] font-semibold text-[#647A7B] dark:text-[#8BA39F]">
            <tr>
              <th className="py-3 px-4">RFQ Ref / Title</th>
              <th className="py-3 px-4">Category & Department</th>
              <th className="py-3 px-4 text-right">Budget Limit</th>
              <th className="py-3 px-4 text-center">Bids Received</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE3E1] dark:divide-[#24423D]">
            {filteredRfqs.map((rfq) => (
              <React.Fragment key={rfq.id}>
                <tr className="hover:bg-[#FAF9F6] dark:hover:bg-[#162B27]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleExpand(rfq.id)}
                        className="mt-0.5 text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0]"
                      >
                        {expandedRfqId === rfq.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <span className="font-mono text-xs font-bold text-[#173E38] dark:text-[#4EA89A]">
                          {rfq.rfqNumber}
                        </span>
                        <p className="font-semibold text-[#17272A] dark:text-[#EBF1F0] mt-0.5">
                          {rfq.title}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="default" size="sm">{rfq.category}</Badge>
                    <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F] mt-1">
                      {rfq.department}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    ${rfq.budget.toLocaleString()}
                    <span className="block text-[10px] text-[#647A7B] dark:text-[#8BA39F] font-normal">
                      Est. ${rfq.estTotalValue.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#173E38] dark:text-[#4EA89A] tabular-nums">
                      {rfq.bidsReceivedCount} / {rfq.invitedVendorsCount}
                    </span>
                    <span className="block text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                      Quotes Logged
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        rfq.status === 'EVALUATION'
                          ? 'accent'
                          : rfq.status === 'OPEN_FOR_BIDS'
                          ? 'primary'
                          : 'success'
                      }
                      size="sm"
                      dot
                    >
                      {rfq.status === 'EVALUATION' ? 'Evaluation Active' : rfq.status}
                    </Badge>
                    <span className="block text-[10px] text-[#647A7B] dark:text-[#8BA39F] mt-0.5">
                      Deadline: {rfq.deadline}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEvaluateBids(rfq.id)}
                      >
                        Bid Matrix
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendPrompt(`Analyze price variance and policy compliance for ${rfq.rfqNumber}: ${rfq.title}`)}
                      >
                        Copilot
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* Collapsible Line Items Accordion for Desktop */}
                {expandedRfqId === rfq.id && (
                  <tr className="bg-[#FAF9F6]/80 dark:bg-[#162B27]/40">
                    <td colSpan={6} className="p-4 border-t border-[#DDE3E1] dark:border-[#24423D]">
                      <div className="rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#17272A] dark:text-[#EBF1F0] flex items-center gap-2">
                            <Package className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />
                            <span>Specification Line Items ({rfq.lineItems.length} Verified SKUs)</span>
                          </p>
                          <span className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                            Created: {rfq.createdAt}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9F6] dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F]">
                              <tr>
                                <th className="p-2">SKU Code</th>
                                <th className="p-2">Component Description</th>
                                <th className="p-2 text-right">Quantity</th>
                                <th className="p-2">Unit</th>
                                <th className="p-2 text-right">Target Unit Price</th>
                                <th className="p-2 text-right">Total Baseline</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DDE3E1] dark:divide-[#24423D]">
                              {rfq.lineItems.map((item) => (
                                <tr key={item.id}>
                                  <td className="p-2 font-mono font-medium text-[#173E38] dark:text-[#4EA89A]">{item.sku}</td>
                                  <td className="p-2 text-[#17272A] dark:text-[#EBF1F0]">{item.description}</td>
                                  <td className="p-2 text-right tabular-nums">{item.quantity.toLocaleString()}</td>
                                  <td className="p-2 text-[#647A7B] dark:text-[#8BA39F]">{item.unit}</td>
                                  <td className="p-2 text-right font-mono tabular-nums">${item.targetPrice.toLocaleString()}</td>
                                  <td className="p-2 text-right font-mono font-semibold tabular-nums">
                                    ${(item.quantity * item.targetPrice).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {rfq.policyNotes && (
                          <div className="rounded bg-[#FAF9F6] dark:bg-[#162B27] p-2.5 text-[11px] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D]">
                            <strong className="text-[#17272A] dark:text-[#EBF1F0]">Policy Annotation: </strong>
                            {rfq.policyNotes}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Responsive Mobile Cards (< md screens) */}
      <div className="md:hidden space-y-3">
        {filteredRfqs.map((rfq) => {
          const isExpanded = expandedRfqId === rfq.id;
          return (
            <Card key={rfq.id} padding="sm" className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#173E38] dark:text-[#4EA89A]">
                      {rfq.rfqNumber}
                    </span>
                    <Badge variant="default" size="sm">{rfq.category}</Badge>
                  </div>
                  <h3 className="mt-1 font-semibold text-xs text-[#17272A] dark:text-[#EBF1F0]">
                    {rfq.title}
                  </h3>
                </div>

                <Badge
                  variant={rfq.status === 'EVALUATION' ? 'accent' : 'primary'}
                  size="sm"
                  dot
                >
                  {rfq.status === 'EVALUATION' ? 'Evaluation' : rfq.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#DDE3E1] dark:border-[#24423D]">
                <div>
                  <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">Budget Ceiling</span>
                  <p className="font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    ${rfq.budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">Bids Received</span>
                  <p className="font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]">
                    {rfq.bidsReceivedCount} / {rfq.invitedVendorsCount} Vendors
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleExpand(rfq.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#173E38] dark:text-[#4EA89A]"
                >
                  <span>{isExpanded ? 'Hide Line Items' : `View ${rfq.lineItems.length} SKUs`}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEvaluateBids(rfq.id)}
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Bid Matrix
                </Button>
              </div>

              {/* Mobile Accordion */}
              {isExpanded && (
                <div className="mt-2 space-y-2 border-t border-[#DDE3E1] dark:border-[#24423D] pt-2 text-xs">
                  {rfq.lineItems.map((item) => (
                    <div key={item.id} className="p-2 rounded bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D]">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="font-semibold text-[#173E38] dark:text-[#4EA89A]">{item.sku}</span>
                        <span className="tabular-nums font-bold">${item.targetPrice.toLocaleString()} / {item.unit}</span>
                      </div>
                      <p className="text-[11px] text-[#34484B] dark:text-[#C2D3CF] mt-0.5">{item.description}</p>
                      <div className="mt-1 flex justify-between text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                        <span>Quantity: {item.quantity}</span>
                        <span className="tabular-nums font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                          Line Total: ${(item.quantity * item.targetPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
