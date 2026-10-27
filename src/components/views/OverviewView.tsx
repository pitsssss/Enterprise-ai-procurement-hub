import React from 'react';
import { RFQ, PurchaseOrder } from '../../types/procurement';
import { Card } from '../ui/Card';
import { KpiMetric } from '../ui/KpiMetric';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  TrendingUp,
  AlertTriangle,
  Scale,
  Award,
  ArrowRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';

interface OverviewViewProps {
  rfqs: RFQ[];
  pos: PurchaseOrder[];
  totalPipelineSpend: number;
  openRfqsCount: number;
  bidsUnderReviewCount: number;
  flaggedPosCount: number;
  onNavigateTab: (tab: any) => void;
  onResolveFlag: (poId: string) => void;
  onEvaluateBids: (rfqId: string) => void;
  onSendPrompt: (prompt: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  rfqs,
  pos,
  totalPipelineSpend,
  openRfqsCount,
  bidsUnderReviewCount,
  flaggedPosCount,
  onNavigateTab,
  onResolveFlag,
  onEvaluateBids,
  onSendPrompt,
}) => {
  const flaggedPos = pos.filter((p) => p.status === 'FLAGGED');
  const evaluatedRfqs = rfqs.filter((r) => r.status === 'EVALUATION' || r.status === 'OPEN_FOR_BIDS');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Quick Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            Strategic Spend & Sourcing Analytics
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            FY-2025 Capital allocations, multi-vendor bid convergence, and SOX Section 404 audit queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md" dot>
            OData ERP Stream Active
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSendPrompt('Provide an executive summary of current procurement pipeline risks and savings targets')}
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-[#C17C43] dark:text-[#D48D55]" />}
          >
            Copilot Briefing
          </Button>
        </div>
      </div>

      {/* 2. Structured Enterprise KPI Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiMetric
          label="Active Pipeline Spend"
          value={`$${(totalPipelineSpend / 1000).toFixed(1)}k`}
          subValue="USD"
          trend={{ direction: 'up', value: '+14.2%', label: 'vs Q3 Baseline', positive: true }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiMetric
          label="Open Sourcing RFQs"
          value={openRfqsCount}
          subValue="Active Cycles"
          trend={{ direction: 'neutral', value: '4 Sourcing Packages', label: 'IT & Machining' }}
          icon={<FileText className="h-4 w-4" />}
        />
        <KpiMetric
          label="Proposals in Evaluation"
          value={bidsUnderReviewCount}
          subValue="Vendor Bids"
          trend={{ direction: 'up', value: '3 Ready for Award', label: 'Apex, HyperScale, SwissFab', positive: true }}
          icon={<Award className="h-4 w-4" />}
        />
        <KpiMetric
          label="SOX Exception Holds"
          value={flaggedPosCount}
          subValue="Action Needed"
          trend={{
            direction: flaggedPosCount > 0 ? 'down' : 'up',
            value: flaggedPosCount > 0 ? 'Form CS-8 Pending' : 'All Orders Cleared',
            label: 'Threshold >$250k',
            positive: flaggedPosCount === 0,
          }}
          icon={<ShieldCheck className="h-4 w-4" />}
          badge={
            flaggedPosCount > 0 ? (
              <Badge variant="danger" size="sm">Hold Active</Badge>
            ) : (
              <Badge variant="success" size="sm">Compliant</Badge>
            )
          }
        />
      </div>

      {/* 3. Executive Strategic Trade-Off Radar Card */}
      <Card padding="md" className="border-l-4 border-l-[#C17C43] dark:border-l-[#D48D55]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#C17C43] dark:bg-[#D48D55]" />
              <Badge variant="accent" size="sm">EXECUTIVE SOURCING RECOMMENDATION</Badge>
              <span className="text-xs font-mono text-[#647A7B] dark:text-[#8BA39F]">RFQ-2025-0891</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#17272A] dark:text-[#EBF1F0] tracking-tight">
              High-Density GPU Nodes: Apex Data vs. HyperScale Micro-Electronics
            </h2>
            <p className="text-xs sm:text-sm text-[#34484B] dark:text-[#C2D3CF] leading-relaxed">
              Apex Data offers <strong className="text-[#17272A] dark:text-[#EBF1F0]">$388,500 total commitment</strong> (7.5% below budget ceiling) with a 36-month enterprise warranty. HyperScale proposes a lower upfront price ($362,000) but requires an 8-week delivery lead time, incurring an estimated $42,000 platform delay penalty.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('bids')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Open Bid Matrix
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSendPrompt('Compare Apex Data Infrastructures warranty terms against HyperScale lead time penalty')}
            >
              Consult Copilot
            </Button>
          </div>
        </div>

        {/* Trade-off Micro Comparative Strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#DDE3E1] dark:border-[#24423D]">
          <div className="p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-[#17272A] dark:text-[#EBF1F0]">Apex Data Infrastructures</p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">4-Week Delivery • 36 Mo. Warranty • 94 Score</p>
            </div>
            <Badge variant="success" size="sm">Recommended</Badge>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-[#17272A] dark:text-[#EBF1F0]">HyperScale Micro-Electronics</p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">8-Week Delivery • 12 Mo. Warranty • 86 Score</p>
            </div>
            <Badge variant="warning" size="sm">Lead Time Risk</Badge>
          </div>
        </div>
      </Card>

      {/* 4. Active Requisition Pipeline & SOX Compliance Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Sourcing Requisitions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#17272A] dark:text-[#EBF1F0] tracking-tight">
              Active Sourcing Requisitions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab('rfqs')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              View All RFQs
            </Button>
          </div>

          <div className="space-y-2.5">
            {evaluatedRfqs.map((rfq) => (
              <Card
                key={rfq.id}
                padding="sm"
                interactive
                onClick={() => onEvaluateBids(rfq.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#173E38] dark:text-[#4EA89A]">
                      {rfq.rfqNumber}
                    </span>
                    <Badge variant="default" size="sm">{rfq.category}</Badge>
                    <Badge
                      variant={rfq.status === 'EVALUATION' ? 'accent' : 'primary'}
                      size="sm"
                    >
                      {rfq.status === 'EVALUATION' ? 'Evaluation Active' : 'Open for Bids'}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                    {rfq.title}
                  </p>
                  <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                    {rfq.department} • Deadline: {rfq.deadline} • {rfq.lineItems.length} SKUs
                  </p>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#DDE3E1] dark:border-[#24423D] shrink-0">
                  <span className="text-xs text-[#647A7B] dark:text-[#8BA39F]">Authorized Budget</span>
                  <span className="text-sm font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    ${rfq.budget.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#C17C43] dark:text-[#D48D55] font-medium">
                    {rfq.bidsReceivedCount} Quotes Received
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: SOX Section 404 Watchdog */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#17272A] dark:text-[#EBF1F0] tracking-tight">
              SOX Section 404 Watchdog
            </h2>
            <Badge variant="danger" size="sm">Mandatory Dual-Audit</Badge>
          </div>

          <Card padding="md" className="space-y-3.5 bg-white dark:bg-[#11211E]">
            {flaggedPos.length > 0 ? (
              flaggedPos.map((po) => (
                <div key={po.id} className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A22424]/10 text-[#A22424] shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#A22424] dark:text-[#EA5454]">
                        Single-Source Capital Hold
                      </p>
                      <p className="font-mono text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                        {po.poNumber} • ${po.amount.toLocaleString()} USD
                      </p>
                      <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F] mt-0.5">
                        {po.vendorName}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] p-2.5 border border-[#DDE3E1] dark:border-[#24423D] text-[11px] text-[#34484B] dark:text-[#C2D3CF] leading-relaxed">
                    {po.complianceWarning}
                  </div>

                  <div className="pt-1 flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => onResolveFlag(po.id)}
                      leftIcon={<CheckCircle2 className="h-4 w-4" />}
                    >
                      Authorize Form CS-8 Sole-Source Waiver
                    </Button>
                    <button
                      onClick={() => onNavigateTab('pos')}
                      className="text-center text-[11px] text-[#647A7B] dark:text-[#8BA39F] hover:underline"
                    >
                      Inspect Full Purchase Order File
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[#1B6A4A] dark:text-[#38B482]" />
                <p className="text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  All Commitments Reconciled
                </p>
                <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  Zero active SOX single-source holds.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
