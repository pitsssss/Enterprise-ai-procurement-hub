import React from 'react';
import { Building2 } from 'lucide-react';
import { Vendor } from '../../types/procurement';

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
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Vendor Repository & Performance</h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Global supplier master records with real-time ESG metrics and on-time delivery audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={vendorTierFilter}
            onChange={(e) => setVendorTierFilter(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[44px]"
          >
            <option value="ALL">All Supplier Tiers</option>
            <option value="TIER_1_STRATEGIC">Tier 1 Strategic</option>
            <option value="PREFERRED">Preferred</option>
            <option value="APPROVED">Approved</option>
            <option value="PROBATIONARY">Probationary</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. MOBILE VENDOR CARDS (< md screens) */}
      {/* ========================================================= */}
      <div className="md:hidden space-y-3">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">{vendor.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{vendor.contactEmail}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${
                  vendor.status === 'ACTIVE'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                {vendor.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                {vendor.tier.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-300">{vendor.category}</span>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-400">{vendor.country}</span>
            </div>

            {/* Performance Metrics Box */}
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px]">On-Time</span>
                <p className="font-mono font-bold text-emerald-400">{vendor.onTimeDeliveryRate}%</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Quality</span>
                <p className="font-mono font-bold text-slate-200">{vendor.qualityScore}%</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Annual Spend</span>
                <p className="font-mono font-semibold text-white">
                  ${(vendor.annualSpendUSD / 1000).toFixed(0)}k
                </p>
              </div>
            </div>

            <button
              onClick={() => onAuditVendor(vendor.name)}
              className="w-full flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
            >
              Audit Vendor with Copilot
            </button>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP VENDOR TABLE (>= md screens) */}
      {/* ========================================================= */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-800 bg-slate-850 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Supplier Name</th>
              <th className="px-4 py-3">Tier & Category</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">On-Time Delivery</th>
              <th className="px-4 py-3">Quality Score</th>
              <th className="px-4 py-3">Annual Volume</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5 font-medium text-white">
                  <div>{vendor.name}</div>
                  <div className="text-[11px] text-slate-400">{vendor.contactEmail}</div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                    {vendor.tier.replace('_', ' ')}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">{vendor.category}</div>
                </td>
                <td className="px-4 py-3.5 text-slate-300">{vendor.country}</td>
                <td className="px-4 py-3.5 font-mono text-emerald-400">
                  {vendor.onTimeDeliveryRate}%
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-200">
                  {vendor.qualityScore}%
                </td>
                <td className="px-4 py-3.5 font-mono">
                  ${vendor.annualSpendUSD.toLocaleString()} USD
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      vendor.status === 'ACTIVE'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => onAuditVendor(vendor.name)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700"
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
