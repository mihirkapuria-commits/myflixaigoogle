import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  X, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { PlatformEconomics, ContentPricingTier, CurrencyConfig } from '../types';
import { formatCurrency, calculateMonthlyAggregate } from '../utils/financialCalculators';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformEconomics: PlatformEconomics;
  pricingTiers: ContentPricingTier[];
  currency: CurrencyConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  platformEconomics,
  pricingTiers,
  currency,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const aggregate = calculateMonthlyAggregate(pricingTiers, platformEconomics, 1.0);

  const exportText = `===============================================================
MYFLIXAI.COM — EXECUTIVE FINANCIAL INTELLIGENCE & UNIT ECONOMICS BRIEF
Derived from Founder's Memorandum (AI Entertainment Marketplace)
Generated on: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
===============================================================

1. CORE PLATFORM ECONOMICS
- Base Platform Take-Rate: ${(platformEconomics.baseCommissionRate * 100).toFixed(1)}%
- Creator Earnings Share: ${(100 - platformEconomics.baseCommissionRate * 100).toFixed(1)}%
- Creator Settlement Model: Next-Day T+1 (Day 1 purchase -> Day 2 payout)
- Payment Gateway Clearing Delay: ${platformEconomics.gatewaySettlementDays.toFixed(1)} Days
- Rolling Refund Reserve: ${platformEconomics.refundReservePercent}% (14-day hold)

2. MONTHLY OPERATIONAL RUN-RATE (CURRENT BASELINE)
- Gross Merchandise Value (GMV): ${formatCurrency(aggregate.totalGmv, currency)}
- Total Content Purchases: ${aggregate.totalUnits.toLocaleString()} units/mo
- Average Order Value (AOV): ${formatCurrency(aggregate.averageOrderValue, currency)}
- Platform Gross Revenue: ${formatCurrency(aggregate.totalGrossCommission, currency)}
- Total Creator Disbursements: ${formatCurrency(aggregate.totalCreatorPayouts, currency)}
- Direct Processing & CDN Costs: ${formatCurrency(aggregate.totalGatewayFees + aggregate.totalStreamingCost, currency)}
- Net Platform Contribution Margin: ${formatCurrency(aggregate.netPlatformContribution, currency)}
- Monthly Fixed Operating Expenses: ${formatCurrency(aggregate.fixedOpexTotal, currency)}
- Net Platform EBITDA: ${formatCurrency(aggregate.monthlyNetEbitda, currency)} (${aggregate.netEbitdaMargin.toFixed(1)}% of GMV)

3. WORKING CAPITAL & LIQUIDITY FLOAT REQUIREMENTS
- Daily Creator Disbursements: ${formatCurrency(aggregate.dailyCreatorPayout, currency)}/day
- Float Timing Gap: ${aggregate.floatDaysGap.toFixed(1)} Days (between T+1 Creator Payout and T+2.5 Gateway clearance)
- Minimum Required Working Capital Float: ${formatCurrency(aggregate.requiredFloatCapital, currency)}
- Active Refund Escrow Pool: ${formatCurrency(aggregate.rollingRefundReservePool, currency)}

4. CONTENT FORMAT BREAKDOWN
${pricingTiers.map((t) => `* ${t.name}: Price ${formatCurrency(t.defaultPrice, currency)} | Est. Volume: ${t.estMonthlyVolume.toLocaleString()} units/mo`).join('\n')}

5. STRATEGIC FINANCIAL DIRECTIVES FOR FOUNDER
- Maintain 30% baseline for standard catalog; introduce 25% Pro Tier for franchises >₹2,00,000 monthly volume.
- Ensure dedicated cash float of ${formatCurrency(aggregate.requiredFloatCapital, currency)} to support seamless next-day creator payouts without liquidity freeze.
- Drive series season passes (₹799) and cinematic bundles (₹1,299) to increase unit margin efficiency over micro-episodes (₹49).
===============================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Export Financial Executive Brief</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Ready-to-share formatted financial memorandum summarizing unit economics, working capital float, and run-rate projections.
        </p>

        {/* Formatted Text Preview */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all scrollbar-thin">
          {exportText}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit-ready pro forma summary</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-950"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
