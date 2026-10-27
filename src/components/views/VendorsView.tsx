import React from 'react';
import { Building2, Bot, Globe, ShieldCheck } from 'lucide-react';
import { Vendor } from '../../types/procurement';

interface VendorsViewProps {
  filteredVendors: Vendor[];
  vendorTierFilter: string;
  setVendorTierFilter: (tier: string) => void;
  onAuditVendor: (vendorName: string) => void;
}

const TIERS = [
  { key: 'ALL', label: 'All Tiers' },
  { key: 'TIER_1_STRATEGIC', label: 'Tier 1 Strategic' },
  { key: 'PREFERRED', label: 'Preferred' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PROBATIONARY', label: 'Probationary' },
];

export const VendorsView: React.FC<VendorsViewProps> = ({
  filteredVendors,
  vendorTierFilter,
  setVendorTierFilter,
  onAuditVendor,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
          Vendor Master Directory
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Supplier scorecards, real-time SLA metrics, ESG ratings, and audit histories
        </p>
      </div>

      {/* Horizontal Tier Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll pb-1 scrollbar-none">
        {TIERS.map((tier) => (
          <button
            key={tier.key}
            onClick={() => setVendorTierFilter(tier.key)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all min-h-[38px] ${
              vendorTierFilter === tier.key
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850 active:bg-slate-800'
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. MOBILE VENDOR CARDS (< md screens) */}
      {/* ========================================================= */}
      <div className="md:hidden space-y-3">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-white">{vendor.name}</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{vendor.contactEmail}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border shrink-0 ${
                  vendor.status === 'ACTIVE'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                {vendor.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/20">
                {vendor.tier.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-300 font-medium">{vendor.category}</span>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-400">{vendor.country}</span>
            </div>

            {/* Performance Metrics Box */}
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">On-Time</span>
                <p className="font-mono font-bold text-emerald-400 text-sm">
                  {vendor.onTimeDeliveryRate}%
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Quality</span>
                <p className="font-mono font-bold text-slate-200 text-sm">
                  {vendor.qualityScore}%
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Annual Spend</span>
                <p className="font-mono font-bold text-white text-sm">
                  ${(vendor.annualSpendUSD / 1000).toFixed(0)}k
                </p>
              </div>
            </div>

            <button
              onClick={() => onAuditVendor(vendor.name)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
            >
              <Bot className="h-4 w-4 text-indigo-400" />
              <span>Audit Supplier with Copilot</span>
            </button>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP VENDOR TABLE (>= md screens) */}
      {/* ========================================================= */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Supplier Name</th>
              <th className="px-5 py-3.5">Tier & Category</th>
              <th className="px-5 py-3.5">Country</th>
              <th className="px-5 py-3.5">On-Time Delivery</th>
              <th className="px-5 py-3.5">Quality Score</th>
              <th className="px-5 py-3.5">Annual Volume</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-4 font-medium text-white">
                  <div className="font-semibold text-white">{vendor.name}</div>
                  <div className="text-[11px] text-slate-400">{vendor.contactEmail}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/20">
                    {vendor.tier.replace('_', ' ')}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">{vendor.category}</div>
                </td>
                <td className="px-5 py-4 text-slate-300">{vendor.country}</td>
                <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                  {vendor.onTimeDeliveryRate}%
                </td>
                <td className="px-5 py-4 font-mono font-bold text-slate-200">
                  {vendor.qualityScore}%
                </td>
                <td className="px-5 py-4 font-mono font-semibold">
                  ${vendor.annualSpendUSD.toLocaleString()} USD
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      vendor.status === 'ACTIVE'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onAuditVendor(vendor.name)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    Audit Vendor
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
