import React, { useState } from 'react';
import { 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Wallet, 
  Building2, 
  RefreshCw, 
  Sliders,
  Calendar,
  Lock,
  BadgeAlert
} from 'lucide-react';
import { PlatformEconomics, CurrencyConfig, ContentPricingTier } from '../types';
import { formatCurrency, calculateMonthlyAggregate } from '../utils/financialCalculators';

interface SettlementFlowEngineProps {
  platformEconomics: PlatformEconomics;
  pricingTiers: ContentPricingTier[];
  currency: CurrencyConfig;
  onUpdateEconomics: (updated: Partial<PlatformEconomics>) => void;
}

export const SettlementFlowEngine: React.FC<SettlementFlowEngineProps> = ({
  platformEconomics,
  pricingTiers,
  currency,
  onUpdateEconomics,
}) => {
  const [dailyVolumeScale, setDailyVolumeScale] = useState(1.0); // 1x, 2x, 5x stress test
  const [gatewayDelayDays, setGatewayDelayDays] = useState(platformEconomics.gatewaySettlementDays);
  const [refundReservePct, setRefundReservePct] = useState(platformEconomics.refundReservePercent);
  const [reserveHoldDays, setReserveHoldDays] = useState(14);

  const aggregate = calculateMonthlyAggregate(pricingTiers, platformEconomics, dailyVolumeScale);
  const dailyGmv = aggregate.totalGmv / 30;
  const dailyGrossCommission = aggregate.totalGrossCommission / 30;
  const dailyCreatorDisbursements = aggregate.totalCreatorPayouts / 30;

  // Float calculations
  const creatorPayoutDelay = platformEconomics.creatorPayoutDelayDays; // 1 day
  const floatDaysGap = Math.max(0, gatewayDelayDays - creatorPayoutDelay);
  const bareFloatNeeded = dailyCreatorDisbursements * floatDaysGap;
  const safetyBufferFactor = 1.30; // 30% buffer for weekend banking halts
  const recommendedCashFloat = bareFloatNeeded * safetyBufferFactor;

  // Rolling Reserve calculations
  const dailyReserveWithheld = dailyCreatorDisbursements * (refundReservePct / 100);
  const totalRollingReservePool = dailyReserveWithheld * reserveHoldDays;

  // Example ₹1,000 Purchase from Section 10 of Memorandum
  const examplePurchase = 1000;
  const exampleCommission = examplePurchase * platformEconomics.baseCommissionRate;
  const exampleCreatorRaw = examplePurchase - exampleCommission;
  const exampleReserveWithheld = exampleCreatorRaw * (refundReservePct / 100);
  const exampleNextDayPayout = exampleCreatorRaw - exampleReserveWithheld;

  const handleSaveParameters = () => {
    onUpdateEconomics({
      gatewaySettlementDays: gatewayDelayDays,
      refundReservePercent: refundReservePct,
    });
  };

  return (
    <div id="settlement-engine-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Section 10 of Memorandum: Next-Day Creator Settlement
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Next-Day Settlement (T+1) & Cashflow Float Engine
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Model creator payout eligibility on Day 2, calculate payment gateway settlement clearing lag, and manage working capital cash reserves to ensure zero liquidity bottlenecks.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-right">
            <div className="text-xs text-slate-400">Required Float Reserve</div>
            <div className="text-xl font-bold text-rose-400 font-mono">
              {formatCurrency(recommendedCashFloat, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Settlement Timeline Diagram */}
      <div className="bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>The Next-Day Settlement Timeline & Capital Float Anatomy</span>
        </h3>
        <p className="text-xs text-slate-400">
          Tracking the exact flow of funds from viewer purchase on Day 1 to creator disbursement on Day 2, and gateway fund clearance on Day 3-4:
        </p>

        {/* 3-Step Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Day 1: Purchase */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400 mb-2">
              <span>DAY 1: TRANSACTION</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">T+0</span>
            </div>
            <div className="text-lg font-bold text-white">Viewer Pays Content Price</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Viewer purchases ₹1,000 content via Payment Gateway. Platform logs 30% commission (₹300) and creator net (₹700) to ledger.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700/80 flex justify-between text-xs">
              <span className="text-slate-400">Gateway Balance:</span>
              <span className="text-blue-400 font-mono font-bold">+ {formatCurrency(examplePurchase, currency)}</span>
            </div>
          </div>

          {/* Day 2: Next-Day Creator Disbursement */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-2">
              <span>DAY 2: NEXT-DAY PAYOUT</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">T+1 (Memorandum Rule)</span>
            </div>
            <div className="text-lg font-bold text-emerald-300">Creator Earnings Disbursed</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Subject to fraud and refund checks, creator receives ₹700 (or ₹665 with 5% reserve) transferred directly to their bank account.
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-800/50 flex justify-between text-xs">
              <span className="text-slate-300">Platform Outflow:</span>
              <span className="text-emerald-400 font-mono font-bold">- {formatCurrency(exampleCreatorRaw, currency)}</span>
            </div>
          </div>

          {/* Day 3.5: Gateway Clearance */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2">
              <span>DAY 3-4: GATEWAY CLEARANCE</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">T+2.5 (Standard Bank Lag)</span>
            </div>
            <div className="text-lg font-bold text-amber-300">Gateway Funds Deposited</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Payment Gateway deposits ₹980 into platform bank account (net of 2% processing fees). Reimburses platform cash float.
            </p>
            <div className="mt-3 pt-3 border-t border-amber-800/50 flex justify-between text-xs">
              <span className="text-slate-300">Platform Inflow:</span>
              <span className="text-amber-400 font-mono font-bold">+ {formatCurrency(examplePurchase * 0.98, currency)}</span>
            </div>
          </div>
        </div>

        {/* The Float Dilemma Warning Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/30 to-amber-950/30 border border-rose-800/40 flex flex-col md:flex-row md:items-center justify-between gap-3 mt-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">The Working Capital Float Gap ({floatDaysGap.toFixed(1)} Days)</div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Because Day 2 creator disbursements happen <strong>{floatDaysGap.toFixed(1)} days before</strong> payment gateway funds hit your bank, your platform must pre-fund payouts from working capital reserves.
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs text-slate-400">Daily Cash Outflow</div>
            <div className="text-base font-bold text-rose-400">{formatCurrency(dailyCreatorDisbursements, currency)}/day</div>
          </div>
        </div>
      </div>

      {/* Two Column Simulator & Policy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Working Capital Float Stress-Tester (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Settlement Lag & Float Simulator</span>
            </h3>
            <span className="text-xs font-mono text-amber-400">
              Scale: {dailyVolumeScale}x Volume
            </span>
          </div>

          <div className="space-y-4">
            {/* Slider 1: Transaction Volume Multiplier */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Transaction Volume Multiplier (Stress Test Surge):</span>
                <span className="font-bold text-white">{dailyVolumeScale}x ({Math.round(aggregate.totalUnits).toLocaleString()} orders/mo)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={dailyVolumeScale}
                onChange={(e) => setDailyVolumeScale(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                <span>0.5x (Slow)</span>
                <span>1.0x (Current)</span>
                <span>2.5x</span>
                <span>5.0x (Viral Surge)</span>
              </div>
            </div>

            {/* Slider 2: Gateway Settlement Clearing Lag */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Payment Gateway Clearing Delay:</span>
                <span className="font-bold text-white">{gatewayDelayDays.toFixed(1)} Days (T+{gatewayDelayDays})</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={gatewayDelayDays}
                onChange={(e) => setGatewayDelayDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                <span>T+1 (Instant Gateway)</span>
                <span>T+2.5 (Standard)</span>
                <span>T+4 (Weekend Lag)</span>
                <span>T+5 (International)</span>
              </div>
            </div>

            {/* Resulting Float Metrics */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Daily Creator Disbursements:</span>
                <span className="font-mono font-bold text-white">{formatCurrency(dailyCreatorDisbursements, currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Net Days Floating Required:</span>
                <span className="font-mono font-bold text-amber-400">{floatDaysGap.toFixed(1)} Days</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Bare Float Required (Zero Buffer):</span>
                <span className="font-mono text-slate-300">{formatCurrency(bareFloatNeeded, currency)}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-white">Recommended Safety Cash Float (+30% Buffer):</span>
                <span className="text-base font-bold text-rose-400 font-mono">{formatCurrency(recommendedCashFloat, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rolling Refund & Fraud Reserve Controller (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Rolling Refund & Chargeback Reserve Pool</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              {refundReservePct}% Withheld
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            As mandated in Section 10 of Memorandum, settlements are subject to <strong>refund rules, fraud checks, and chargebacks</strong>. Withholding a rolling percentage for 14 days protects the platform from paying out unrecoverable funds.
          </p>

          <div className="space-y-4">
            {/* Reserve Percentage Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Refund Reserve Withholding Percentage:</span>
                <span className="font-bold text-white">{refundReservePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={refundReservePct}
                onChange={(e) => setRefundReservePct(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Retention Window */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Reserve Retention Window:</span>
                <span className="font-bold text-white">{reserveHoldDays} Calendar Days</span>
              </div>
              <input
                type="range"
                min="7"
                max="30"
                step="1"
                value={reserveHoldDays}
                onChange={(e) => setReserveHoldDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Reserve Calculations */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Immediate Day 2 Payout (on ₹1,000 film):</span>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(exampleNextDayPayout, currency)} (95%)</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Withheld to Creator Reserve Escrow:</span>
                <span className="font-mono font-bold text-amber-400">{formatCurrency(exampleReserveWithheld, currency)} (5%)</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-white">Active Rolling Reserve Escrow Balance:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{formatCurrency(totalRollingReservePool, currency)}</span>
              </div>
            </div>

            <button
              id="save-settlement-policy-btn"
              onClick={handleSaveParameters}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Settlement & Reserve Rules</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
