import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ShieldAlert, 
  Film, 
  Tv, 
  Disc3, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  DollarSign, 
  Layers, 
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ContentPricingTier, PlatformEconomics, CurrencyConfig } from '../types';
import { formatCurrency, calculateMonthlyAggregate } from '../utils/financialCalculators';

interface ExecutiveDashboardProps {
  pricingTiers: ContentPricingTier[];
  platformEconomics: PlatformEconomics;
  currency: CurrencyConfig;
  onNavigateTab: (tabId: string) => void;
  onUpdateTierPrice: (tierId: string, newPrice: number) => void;
  onUpdateTierVolume: (tierId: string, newVolume: number) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  pricingTiers,
  platformEconomics,
  currency,
  onNavigateTab,
  onUpdateTierPrice,
  onUpdateTierVolume,
}) => {
  const aggregate = calculateMonthlyAggregate(pricingTiers, platformEconomics, 1.0);

  // Representative Film Unit Economics (₹299 baseline from Memorandum Sec 21)
  const sampleFilmPrice = 299;
  const sampleFilmCommission = sampleFilmPrice * platformEconomics.baseCommissionRate;
  const sampleFilmCreator = sampleFilmPrice - sampleFilmCommission;
  const sampleFilmPgFee = (sampleFilmPrice * (platformEconomics.paymentGatewayFeePercent / 100)) + platformEconomics.paymentGatewayFixedFee;
  const sampleFilmCdnFee = 2.4 * platformEconomics.streamingCostPerGb; // 2.4GB HD stream
  const sampleFilmNetProfit = sampleFilmCommission - sampleFilmPgFee - sampleFilmCdnFee;
  const sampleFilmNetMarginPct = (sampleFilmNetProfit / sampleFilmPrice) * 100;

  return (
    <div id="executive-dashboard-view" className="space-y-6">
      {/* Top Welcome & Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Model Synchronized with Memorandum
              </span>
              <span className="text-xs text-slate-400">
                Base Take-Rate: {(platformEconomics.baseCommissionRate * 100).toFixed(0)}%
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Executive Financial Health & Unit Economics
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Evaluating the <strong>myflixai.com</strong> business architecture: 30% central commission, micro-transaction margins across films & series, and working capital float requirements for next-day creator settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="goto-ai-advisor-btn"
              onClick={() => onNavigateTab('ai-advisor')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-rose-400 transition-all flex items-center gap-2 shadow-lg shadow-rose-950/30"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Run AI Financial Audit</span>
            </button>
            <button
              id="goto-commission-btn"
              onClick={() => onNavigateTab('commission')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Percent className="w-4 h-4 text-amber-400" />
              <span>Simulate Rate Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly GMV */}
        <div id="kpi-card-gmv" className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Gross Merchandise Value (GMV)</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(aggregate.totalGmv, currency)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-400">{aggregate.totalUnits.toLocaleString()} content purchases/mo</span>
            <span className="text-blue-400 font-semibold">AOV: {formatCurrency(aggregate.averageOrderValue, currency)}</span>
          </div>
        </div>

        {/* Metric 2: Platform Gross Commission */}
        <div id="kpi-card-commission" className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Platform Gross Revenue ({(platformEconomics.baseCommissionRate * 100).toFixed(0)}%)</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {formatCurrency(aggregate.totalGrossCommission, currency)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-400">Net Take: {(platformEconomics.baseCommissionRate * 100).toFixed(1)}%</span>
            <span className="text-amber-400/90 font-semibold">
              Contribution: {formatCurrency(aggregate.netPlatformContribution, currency)}
            </span>
          </div>
        </div>

        {/* Metric 3: Creator Disbursements */}
        <div id="kpi-card-creators" className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Creator Earnings (70%)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {formatCurrency(aggregate.totalCreatorPayouts, currency)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-400">Daily Payouts: {formatCurrency(aggregate.dailyCreatorPayout, currency)}</span>
            <span className="text-emerald-400 font-semibold">T+1 Settlement</span>
          </div>
        </div>

        {/* Metric 4: Working Capital Float Needed */}
        <div id="kpi-card-float" className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Required Settlement Float</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            {formatCurrency(aggregate.requiredFloatCapital, currency)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-400">{aggregate.floatDaysGap.toFixed(1)} days PG clearing lag</span>
            <span className="text-rose-400/90 font-semibold">Liquidity Buffer</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Unit Economics Breakdown & Format Revenue Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Waterfall / Memorandum Example Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Unit Economics Breakdown (Standard ₹299 AI Feature Film)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact transaction anatomy matching Section 21 of the Founder's Memorandum
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold">
              Net Platform Margin: {sampleFilmNetMarginPct.toFixed(1)}%
            </span>
          </div>

          {/* Visual Step-by-Step Waterfall */}
          <div className="space-y-3 pt-2">
            {/* Step 1: Gross Viewer Purchase */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  100%
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Viewer Purchase Price (Gross)</div>
                  <div className="text-xs text-slate-400">Total amount paid at checkout by viewer</div>
                </div>
              </div>
              <div className="text-base font-bold text-white">
                {formatCurrency(sampleFilmPrice, currency)}
              </div>
            </div>

            {/* Step 2: Creator Share (70%) */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  70%
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-300">Creator Earnings Allocation</div>
                  <div className="text-xs text-slate-400">Eligible for Next-Day (Day 2) settlement</div>
                </div>
              </div>
              <div className="text-base font-bold text-emerald-400">
                - {formatCurrency(sampleFilmCreator, currency)}
              </div>
            </div>

            {/* Step 3: Platform Gross Commission (30%) */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  30%
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-300">Platform Gross Commission</div>
                  <div className="text-xs text-slate-400">Central engine take-rate deduction</div>
                </div>
              </div>
              <div className="text-base font-bold text-amber-400">
                + {formatCurrency(sampleFilmCommission, currency)}
              </div>
            </div>

            {/* Deductions from Platform Take */}
            <div className="pl-4 pr-3 py-3 rounded-xl bg-slate-800/30 border border-dashed border-slate-700/80 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Variable Fulfillment & Gateway Drag on Platform Take:
              </div>

              {/* Payment gateway */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  Payment Gateway Fee ({platformEconomics.paymentGatewayFeePercent}% + ₹{platformEconomics.paymentGatewayFixedFee})
                </span>
                <span className="text-rose-400 font-medium">- {formatCurrency(sampleFilmPgFee, currency)}</span>
              </div>

              {/* CDN Streaming */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  Secure Video Streaming CDN (2.4 GB @ ₹{platformEconomics.streamingCostPerGb}/GB)
                </span>
                <span className="text-rose-400 font-medium">- {formatCurrency(sampleFilmCdnFee, currency)}</span>
              </div>
            </div>

            {/* Final Net Margin Result */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Net Platform Profit Per Film</div>
                <div className="text-xs text-amber-400/90">After all direct transaction costs</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-400">
                  {formatCurrency(sampleFilmNetProfit, currency)}
                </div>
                <div className="text-xs text-slate-400">{sampleFilmNetMarginPct.toFixed(1)}% net margin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Monthly Content Format Breakdown & Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white">Content Format Mix & Volumes</h3>
              <span className="text-xs text-slate-400">Live Interactive</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Adjust prices and monthly estimated volumes across the four core entertainment formats defined in the memorandum.
            </p>

            <div className="space-y-3.5">
              {pricingTiers.map((tier) => {
                const breakdown = aggregate.tierBreakdowns.find((b) => b.tier.id === tier.id);
                return (
                  <div
                    key={tier.id}
                    id={`tier-card-${tier.id}`}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {tier.type === 'film' && <Film className="w-3.5 h-3.5 text-amber-400" />}
                        {tier.type === 'series_season' && <Tv className="w-3.5 h-3.5 text-blue-400" />}
                        {tier.type === 'episode' && <Disc3 className="w-3.5 h-3.5 text-emerald-400" />}
                        {tier.type === 'bundle_universe' && <Layers className="w-3.5 h-3.5 text-purple-400" />}
                        {tier.name}
                      </span>
                      <span className="text-xs font-semibold text-amber-400">
                        {formatCurrency(breakdown?.gmv || 0, currency, true)} GMV
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Price:</span>
                          <span className="text-white font-medium">{formatCurrency(tier.defaultPrice, currency)}</span>
                        </div>
                        <input
                          type="range"
                          min={tier.minPrice}
                          max={tier.maxPrice}
                          step={tier.type === 'episode' ? 5 : 50}
                          value={tier.defaultPrice}
                          onChange={(e) => onUpdateTierPrice(tier.id, Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Monthly Vol:</span>
                          <span className="text-white font-medium">{tier.estMonthlyVolume.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={25000}
                          step={100}
                          value={tier.estMonthlyVolume}
                          onChange={(e) => onUpdateTierVolume(tier.id, Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 mt-3">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Monthly Fixed Opex (Hosting, DRM, Ops):</span>
              <span className="font-semibold text-white">{formatCurrency(aggregate.fixedOpexTotal, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span>Net Platform Contribution:</span>
              <span className="font-semibold text-amber-400">{formatCurrency(aggregate.netPlatformContribution, currency)}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
              <span className="text-sm font-bold text-white">Monthly Net EBITDA:</span>
              <span className={`text-base font-bold ${aggregate.monthlyNetEbitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(aggregate.monthlyNetEbitda, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Operational Risk Flags & Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk 1: Settlement Timing Gap */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Next-Day Payout Liquidity Gap</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Platform pays creators on <strong>Day 2 (T+1)</strong>, but payment gateways deposit viewer funds on <strong>Day 3.5</strong>. A rolling cash float of <strong>{formatCurrency(aggregate.requiredFloatCapital, currency)}</strong> is required.
          </p>
          <button
            id="view-settlement-risk-btn"
            onClick={() => onNavigateTab('settlement')}
            className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Inspect Settlement Flow</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Risk 2: Micro-Transaction Gateway Fee Friction */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1.5">
            <Disc3 className="w-4 h-4 text-blue-400" />
            <span>₹49 Episode Fee Drag</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The ₹3 fixed PG fee absorbs 20.4% of the platform's ₹14.70 commission on ₹49 episodes. Encouraging <strong>Season Passes (₹799)</strong> increases margin efficiency by <strong>2.8x</strong>.
          </p>
          <button
            id="view-forecast-btn"
            onClick={() => onNavigateTab('forecast')}
            className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>Model Season Bundling</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Opportunity 3: Dynamic Pro Creator Tiers */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Commission Engine Elasticity</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Per Section 18 of Memorandum, testing a <strong>25% or 20% tier</strong> for high-volume studio creators can attract top AI franchises while growing overall GMV to offset lower take-rates.
          </p>
          <button
            id="view-commission-engine-btn"
            onClick={() => onNavigateTab('commission')}
            className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>Adjust Central Engine</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
