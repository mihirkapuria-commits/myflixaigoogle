import React, { useState } from 'react';
import { 
  Sliders, 
  Percent, 
  History, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Save, 
  TrendingUp, 
  Users, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { ContentPricingTier, PlatformEconomics, CurrencyConfig, AuditLogEntry } from '../types';
import { formatCurrency, calculateMonthlyAggregate, calculateTransactionBreakdown } from '../utils/financialCalculators';

interface CommissionSimulatorProps {
  platformEconomics: PlatformEconomics;
  pricingTiers: ContentPricingTier[];
  currency: CurrencyConfig;
  auditLogs: AuditLogEntry[];
  onUpdateCommissionRate: (newRate: number, adminName: string, reason: string) => void;
}

export const CommissionSimulator: React.FC<CommissionSimulatorProps> = ({
  platformEconomics,
  pricingTiers,
  currency,
  auditLogs,
  onUpdateCommissionRate,
}) => {
  const [tempRate, setTempRate] = useState<number>(platformEconomics.baseCommissionRate * 100);
  const [adminName, setAdminName] = useState('Chief Financial Officer');
  const [reason, setReason] = useState('Market adjustment to optimize creator retention and marketplace GMV.');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const currentRate = platformEconomics.baseCommissionRate;
  const simulatedRate = tempRate / 100;

  // Comparison metrics
  const baseAggregate = calculateMonthlyAggregate(pricingTiers, platformEconomics, 1.0);
  
  const simulatedEconomics: PlatformEconomics = {
    ...platformEconomics,
    baseCommissionRate: simulatedRate,
  };
  const simulatedAggregate = calculateMonthlyAggregate(pricingTiers, simulatedEconomics, 1.0);

  const diffCommission = simulatedAggregate.totalGrossCommission - baseAggregate.totalGrossCommission;
  const diffCreator = simulatedAggregate.totalCreatorPayouts - baseAggregate.totalCreatorPayouts;
  const diffEbitda = simulatedAggregate.monthlyNetEbitda - baseAggregate.monthlyNetEbitda;

  // Sensitivity test table rates: 15%, 20%, 25%, 30%, 35%, 40%
  const testRates = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40];

  const handleApplyRateChange = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCommissionRate(simulatedRate, adminName, reason);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3500);
  };

  return (
    <div id="commission-engine-view" className="space-y-6">
      {/* Header & Concept Intro */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Section 18 & 19: Central Commission Engine & Audit Trail
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Central Commission Engine & Elasticity Simulator
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Dynamically calibrate the platform take-rate (default 30%). Any updated rate is recorded in the permanent financial audit trail and propagated across all transaction projections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-right">
              <div className="text-xs text-slate-400">Current Active Rate</div>
              <div className="text-xl font-bold text-amber-400">{(currentRate * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Controller Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Slider & Admin Change Logger (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Take-Rate Adjustment Slider</span>
              </h3>
              <span className="text-xl font-black text-amber-400 font-mono">
                {tempRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Slide to test commission percentages between 10% and 50% and observe instant impacts on platform revenue and creator payouts.
            </p>

            <div className="space-y-3">
              <input
                id="commission-slider"
                type="range"
                min="10"
                max="50"
                step="1"
                value={tempRate}
                onChange={(e) => setTempRate(Number(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>10% (Ultra Low)</span>
                <span className="text-amber-400 font-bold">25% (Growth)</span>
                <span className="text-amber-300 font-bold">30% (Memo Default)</span>
                <span>40%</span>
                <span>50% (High)</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { rate: 20, label: '20% (Volume Strategy)' },
              { rate: 25, label: '25% (Pro Studio Tier)' },
              { rate: 30, label: '30% (Founder Baseline)' },
              { rate: 35, label: '35% (Premium Margin)' },
            ].map((item) => (
              <button
                key={item.rate}
                onClick={() => setTempRate(item.rate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tempRate === item.rate
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Real-Time Impact Comparison Box */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Simulated Financial Variance vs Active Rate ({(currentRate * 100).toFixed(0)}%)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Platform Revenue</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(simulatedAggregate.totalGrossCommission, currency)}
                </div>
                <div className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${diffCommission >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {diffCommission >= 0 ? '+' : ''}{formatCurrency(diffCommission, currency)} /mo
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Creator Earnings</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(simulatedAggregate.totalCreatorPayouts, currency)}
                </div>
                <div className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${diffCreator >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {diffCreator >= 0 ? '+' : ''}{formatCurrency(diffCreator, currency)} /mo
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Monthly Net EBITDA</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(simulatedAggregate.monthlyNetEbitda, currency)}
                </div>
                <div className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${diffEbitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {diffEbitda >= 0 ? '+' : ''}{formatCurrency(diffEbitda, currency)} /mo
                </div>
              </div>
            </div>
          </div>

          {/* Section 19: Record Admin Change with Audit Trail */}
          <form onSubmit={handleApplyRateChange} className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 19: Administrative Audit Log Entry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Administrator Name / Role:
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Target Rate to Apply:
                </label>
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400">
                  {tempRate.toFixed(1)}% Take-Rate
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Reason / Strategic Justification (Recorded in Audit Ledger):
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                placeholder="e.g. Lowering rate to attract top AI studio releases"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-slate-400">
                Previous: <span className="font-mono text-slate-300">{(currentRate * 100).toFixed(1)}%</span> → New: <span className="font-mono text-amber-400 font-bold">{tempRate.toFixed(1)}%</span>
              </div>
              <button
                type="submit"
                id="apply-commission-btn"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Record & Propagate Rate</span>
              </button>
            </div>

            {showSavedFeedback && (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Audit entry recorded! Commission updated to {tempRate.toFixed(1)}% across all platform ledgers.</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Sensitivity Matrix & Dynamic Tier Structure (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sensitivity Matrix */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Commission Sensitivity Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Examining creator earnings vs platform gross margin across varied take-rates for a standard <strong>₹299 AI Film</strong>:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2">Rate</th>
                    <th className="pb-2">Platform Cut</th>
                    <th className="pb-2">Creator Net</th>
                    <th className="pb-2 text-right">Net Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {testRates.map((r) => {
                    const brk = calculateTransactionBreakdown(299, r, platformEconomics);
                    const isSelected = Math.abs(currentRate - r) < 0.001;
                    return (
                      <tr
                        key={r}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <td className="py-2">
                          <span className="flex items-center gap-1">
                            {(r * 100).toFixed(0)}%
                            {isSelected && <span className="text-xs text-amber-400">★</span>}
                          </span>
                        </td>
                        <td className="py-2 text-amber-400">{formatCurrency(brk.platformCommission, currency)}</td>
                        <td className="py-2 text-emerald-400">{formatCurrency(brk.creatorEarnings, currency)}</td>
                        <td className="py-2 text-right">{brk.netPlatformMarginPercent.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Proposed Tiered Commission Architecture */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Tiered Commission Strategy (Best Practice)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To balance creator acquisition with long-term platform monetization, the platform can evolve from a flat 30% into volume-based incentive tiers:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/70">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>Standard Creator Tier</span>
                  <span className="text-amber-400 font-mono">30% Take</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Default for new creators, standalone films & single episode uploads.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/70">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>AI Studio / Pro Series Tier</span>
                  <span className="text-blue-400 font-mono">25% Take</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Unlocked when creator hits &gt; ₹2,00,000 monthly sales volume or full multi-season series.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/70">
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>Exclusive Cinematic Universe Debut</span>
                  <span className="text-emerald-400 font-mono">20% Take</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Exclusive 90-day premiere window for prequels/sequels (Sec 7 of Memo).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Audit Log Trail Table */}
      <div className="bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Permanent Administrative Audit Trail (Section 19)
            </h3>
          </div>
          <span className="text-xs text-slate-400">{auditLogs.length} logged entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Admin</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Previous State</th>
                <th className="p-3">New State</th>
                <th className="p-3">Recorded Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-semibold text-amber-400">{log.id}</td>
                  <td className="p-3 text-slate-300">{log.timestamp}</td>
                  <td className="p-3 text-white font-medium">{log.adminUser}</td>
                  <td className="p-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{log.previousValue}</td>
                  <td className="p-3 text-emerald-400 font-bold">{log.newValue}</td>
                  <td className="p-3 text-slate-300 font-sans">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
