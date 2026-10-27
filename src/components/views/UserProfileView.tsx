import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  User,
  ShieldCheck,
  Key,
  Laptop,
  CheckCircle2,
  Clock,
  Award,
  Globe,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const [delegatedLimit, setDelegatedLimit] = useState(150000);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            Signatory Profile & Delegated Authority
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            Corporate signatory credentials, single-source approval limits, and multi-factor hardware security.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave}>
          {saved ? 'Credentials Updated' : 'Update Credentials'}
        </Button>
      </div>

      {/* 1. Identity & Signatory Status */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#173E38] text-white font-bold text-lg shadow-sm">
              SC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#17272A] dark:text-[#EBF1F0]">
                  Sarah Chen, MBA, CPSM
                </h2>
                <Badge variant="primary" size="sm">Tier-1 Principal</Badge>
              </div>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                Strategic Sourcing Director • Global Infrastructure & Machining
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                sarah.chen@enterprise.global • Employee ID: #EMP-89410
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-[#DDE3E1] sm:dark:border-[#24423D] sm:pl-5">
            <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">Delegated Authorization Ceiling</p>
            <p className="text-xl font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]">
              ${delegatedLimit.toLocaleString()} USD
            </p>
            <span className="text-[10px] text-[#1B6A4A] dark:text-[#38B482]">Dual-Signoff required above ceiling</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#DDE3E1] dark:border-[#24423D]">
          <Input
            label="Single Authority Spend Limit ($)"
            type="number"
            value={delegatedLimit}
            onChange={(e) => setDelegatedLimit(Number(e.target.value))}
            prefixText="$"
            helperText="Contracts above this threshold automatically route to Group Treasury for co-signature."
          />
          <Input
            label="Corporate Title & Designation"
            defaultValue="Strategic Sourcing Director"
            helperText="Matches Workday corporate ledger authority matrix."
          />
        </div>
      </Card>

      {/* 2. Security & Active FIDO2 Keys */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                Hardware Security & Signatory Keys
              </h3>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                FIDO2 WebAuthn & YubiKey hardware tokens registered for PO authorization.
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm">FIDO2 Active</Badge>
        </div>

        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27]">
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />
              <div>
                <p className="text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  YubiKey 5C NFC (Primary Corporate Key)
                </p>
                <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  Serial: #YK-902819 • Registered: Nov 2024 • Last used for PO-2025-0718 approval
                </p>
              </div>
            </div>
            <Badge variant="default" size="sm">Hardware Verified</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27]">
            <div className="flex items-center gap-3">
              <Laptop className="h-4 w-4 text-[#173E38] dark:text-[#4EA89A]" />
              <div>
                <p className="text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  MacBook Pro M3 Max (Enterprise TouchID)
                </p>
                <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  IP: 194.230.14.88 (Zurich Corporate VPN) • Active Session
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>Current Session</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
