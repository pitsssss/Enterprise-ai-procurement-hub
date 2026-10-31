import React from 'react';
import { useTranslation } from 'react-i18next';
import { Vendor } from '../../types/procurement';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/formatters';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sparkles,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface VendorsViewProps {
  filteredVendors: Vendor[];
  vendorTierFilter: string;
  setVendorTierFilter: (tier: string) => void;
  onAuditVendor: (vendorName: string) => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({
  filteredVendors,
  vendorTierFilter,
  setVendorTierFilter,
  onAuditVendor,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const tiers = [
    { id: 'ALL', label: t('vendors.tierFilter') },
    { id: 'TIER_1_STRATEGIC', label: t('status.TIER_1_STRATEGIC') },
    { id: 'PREFERRED', label: t('status.PREFERRED') },
    { id: 'APPROVED', label: t('status.APPROVED_TIER') },
    { id: 'PROBATIONARY', label: t('status.PROBATIONARY') },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            {t('vendors.title')}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            {t('vendors.subtitle')}
          </p>
        </div>

        <Badge variant="primary" size="md">
          {filteredVendors.length} {isArabic ? 'موردين معتمدين' : 'Verified Suppliers'}
        </Badge>
      </div>

      {/* 2. Tier Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto touch-scroll scrollbar-none py-1">
        {tiers.map((tItem) => (
          <button
            key={tItem.id}
            onClick={() => setVendorTierFilter(tItem.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
              vendorTierFilter === tItem.id
                ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] shadow-2xs font-semibold'
                : 'bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6] dark:hover:bg-[#1D3732]'
            }`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {/* 3. Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVendors.map((vendor) => {
          const isStrategic = vendor.tier === 'TIER_1_STRATEGIC';
          return (
            <Card
              key={vendor.id}
              padding="md"
              className="flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#17272A] dark:text-[#EBF1F0]">
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] flex items-center gap-1.5 mt-0.5">
                      <Globe className="h-3.5 w-3.5 text-[#173E38] dark:text-[#4EA89A]" />
                      <span>
                        {t(`countries.${vendor.country}`, { defaultValue: vendor.country })} • {t(`categories.${vendor.category}`, { defaultValue: vendor.category })}
                      </span>
                    </p>
                  </div>

                  <Badge
                    variant={isStrategic ? 'primary' : vendor.tier === 'PREFERRED' ? 'accent' : 'default'}
                    size="sm"
                  >
                    {t(`status.${vendor.tier}`, vendor.tier)}
                  </Badge>
                </div>

                {/* Scorecard Strip */}
                <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D]">
                  <div>
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">
                      {isArabic ? 'الالتزام بالتسليم' : 'On-Time Del.'}
                    </span>
                    <span className="font-bold tabular-nums text-xs sm:text-sm text-[#1B6A4A] dark:text-[#38B482]">
                      {formatPercent(vendor.onTimeDeliveryRate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">
                      {isArabic ? 'جودة ISO' : 'ISO Quality'}
                    </span>
                    <span className="font-bold tabular-nums text-xs sm:text-sm text-[#17272A] dark:text-[#EBF1F0]">
                      {vendor.qualityScore} / 100
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">
                      {t('vendors.colEsg')}
                    </span>
                    <span className="font-bold tabular-nums text-xs sm:text-sm text-[#173E38] dark:text-[#4EA89A]">
                      {vendor.esgScore}
                    </span>
                  </div>
                </div>

                {/* Commitments & Spend */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#647A7B] dark:text-[#8BA39F]">
                    <span>{t('vendors.colContracts')}:</span>
                    <span className="font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                      {vendor.activeContractsCount} {isArabic ? 'عقود إطارية' : 'Framework Agmts'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#647A7B] dark:text-[#8BA39F]">
                    <span>{t('vendors.colSpend')}:</span>
                    <span className="font-semibold font-mono text-[#17272A] dark:text-[#EBF1F0]">
                      {formatCurrency(vendor.annualSpendUSD)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#647A7B] dark:text-[#8BA39F]">
                    <span>{t('vendors.contact')}:</span>
                    <span className="text-[11px] font-mono truncate max-w-[170px] text-[#173E38] dark:text-[#4EA89A]">
                      <bdi dir="ltr">{vendor.contactEmail}</bdi>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[#DDE3E1] dark:border-[#24423D]">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => onAuditVendor(vendor.name)}
                  leftIcon={<Sparkles className="h-3.5 w-3.5 text-[#C17C43] dark:text-[#D48D55]" />}
                >
                  {isArabic ? 'تدقيق المورد بالمساعد الذكي' : 'Audit Supplier with Copilot'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
