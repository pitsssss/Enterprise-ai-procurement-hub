import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  ShieldCheck,
  Building,
  Lock,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Sliders,
} from 'lucide-react';

export const OrganizationSettingsView: React.FC = () => {
  const [soxThreshold, setSoxThreshold] = useState(250000);
  const [minBidsRequired, setMinBidsRequired] = useState(3);
  const [requireCs8Waiver, setRequireCs8Waiver] = useState(true);
  const [dualSignoffTreasury, setDualSignoffTreasury] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            Organization Governance & ERP Architecture
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            Configure SOX Section 404 thresholds, dual-signoff policies, and live ERP synchronizers.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
        >
          {savedSuccess ? 'Policies Saved & Applied' : 'Save Policies'}
        </Button>
      </div>

      {/* 1. SOX & Fiduciary Approval Threshold Matrix */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0]">
              SOX Section 404 Dual-Authorization Engine
            </h2>
            <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
              Mandatory dual-custody approval tiers and sole-source exception handling.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Input
            label="Single-Source Escalation Threshold (USD)"
            type="number"
            value={soxThreshold}
            onChange={(e) => setSoxThreshold(Number(e.target.value))}
            prefixText="$"
            helperText="Contracts above this amount trigger mandatory Form CS-8 Sole-Source waiver if < 3 bids."
          />

          <Input
            label="Minimum Competitive Bids for Direct Award"
            type="number"
            value={minBidsRequired}
            onChange={(e) => setMinBidsRequired(Number(e.target.value))}
            suffixText="Vendors"
            helperText="RFQ requires at least this many independent vendor quotes to bypass sole-source hold."
          />
        </div>

        <div className="pt-2 space-y-2.5 border-t border-[#DDE3E1] dark:border-[#24423D]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireCs8Waiver}
              onChange={(e) => setRequireCs8Waiver(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#DDE3E1] text-[#173E38] focus:ring-[#173E38]"
            />
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#17272A] dark:text-[#EBF1F0]">
                Enforce Form CS-8 Sole-Source Justification Upload
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                Purchase orders exceeding the single-source limit will remain in FLAGGED state until a signed justification document is approved.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dualSignoffTreasury}
              onChange={(e) => setDualSignoffTreasury(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#DDE3E1] text-[#173E38] focus:ring-[#173E38]"
            />
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#17272A] dark:text-[#EBF1F0]">
                Mandatory Group Treasury Co-Sign on CapEx &gt; $100,000
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                Requires both Strategic Sourcing Director and Treasury Officer authorization signatures.
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* 2. Enterprise Core ERP Synchronizers */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C17C43]/10 text-[#C17C43] dark:bg-[#D48D55]/20 dark:text-[#D48D55]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                Active ERP & Financial Connectors
              </h2>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                Bidirectional synchronization status with corporate systems of record.
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" dot>2 Systems Live</Badge>
        </div>

        <div className="space-y-3 pt-2">
          {/* SAP S/4HANA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-center font-bold text-xs text-[#173E38] dark:text-[#4EA89A]">
                SAP
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  SAP S/4HANA Cloud (Procurement Core)
                </p>
                <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  Endpoint: https://sap-prd.corp.internal/sap/opu/odata/ • Last Synced: 2 mins ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">Connected</Badge>
              <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                Ping
              </Button>
            </div>
          </div>

          {/* Workday Financials */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-center font-bold text-xs text-[#173E38] dark:text-[#4EA89A]">
                WD
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  Workday Financial Management (General Ledger)
                </p>
                <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  Syncs cost center allocations and dual-authorization approval hierarchies.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">Connected</Badge>
              <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                Ping
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
