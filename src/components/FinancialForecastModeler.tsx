import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  Film,
  Sparkles,
  Layers
} from 'lucide-react';
import { ContentPricingTier, PlatformEconomics, CurrencyConfig } from '../types';
import { formatCurrency, generateForecast } from '../utils/financialCalculators';

interface FinancialForecastModelerProps {
  pricingTiers: ContentPricingTier[];
  platformEconomics: PlatformEconomics;
  currency: CurrencyConfig;
}

export const FinancialForecastModeler: React.FC<FinancialForecastModelerProps> = ({
  pricingTiers,
  platformEconomics,
  currency,
}) => {
  const [forecastHorizon, setForecastHorizon] = useState<12 | 24 | 36>(36);
  const [growthScenario, setGrowthScenario] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [initialCapital, setInitialCapital] = useState<number>(1500000); // ₹15 Lakhs seed capital

  const growthRateMap = {
    conservative: 0.15, // 15% MoM
    moderate: 0.25,     // 25% MoM
    aggressive: 0.40,   // 40% MoM
  };

  const forecastData = generateForecast(
    pricingTiers,
    platformEconomics,
    growthRateMap[growthScenario],
    initialCapital,
    forecastHorizon
  );

  // Identify break-even month
  const breakEvenMonth = forecastData.find((m) => m.netEbitda > 0);
  const month12 = forecastData[Math.min(11, forecastData.length - 1)];
  const month36 = forecastData[forecastData.length - 1];

  // Maximum values for relative bar chart heights
  const maxGmv = Math.max(...forecastData.map((d) => d.gmv));

  return (
    <div id="forecast-modeler-view" className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Multi-Year Financial Projections & Break-Even Analysis
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              3-Year Growth, Working Capital & EBITDA Forecast
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Model user acquisition, creator catalogue expansion, gross volume, streaming fulfillment costs, and cash runway across 36 operating months.
            </p>
          </div>

          {/* Horizon & Scenario Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Horizon */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              {[12, 24, 36].map((h) => (
                <button
                  key={h}
                  onClick={() => setForecastHorizon(h as any)}
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    forecastHorizon === h ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {h} Months
                </button>
              ))}
            </div>

            {/* Scenario */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              {[
                { id: 'conservative', label: '15% MoM' },
                { id: 'moderate', label: '25% MoM (Base)' },
                { id: 'aggressive', label: '40% MoM (Viral)' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setGrowthScenario(sc.id as any)}
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    growthScenario === sc.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Highlights for Year 1 & Year 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Break-Even Month */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Operating Break-Even</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {breakEvenMonth ? `Month ${breakEvenMonth.month} (${breakEvenMonth.label})` : 'Beyond Horizon'}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {breakEvenMonth ? `Monthly GMV reaches ${formatCurrency(breakEvenMonth.gmv, currency, true)} to cover all fixed opex` : 'Requires capital injection'}
          </div>
        </div>

        {/* Card 2: Year 1 Run-Rate */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Month 12 Run-Rate (GMV)</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(month12?.gmv || 0, currency, true)} /mo
          </div>
          <div className="text-xs text-blue-400 font-semibold mt-2">
            Net EBITDA: {formatCurrency(month12?.netEbitda || 0, currency, true)} /mo
          </div>
        </div>

        {/* Card 3: Year 3 Exit Run-Rate */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Month 36 Exit Run-Rate (GMV)</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {formatCurrency(month36?.gmv || 0, currency, true)} /mo
          </div>
          <div className="text-xs text-amber-300 font-semibold mt-2">
            Net EBITDA: {formatCurrency(month36?.netEbitda || 0, currency, true)} /mo
          </div>
        </div>

        {/* Card 4: Peak Settlement Float Needed */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Peak Settlement Float Float</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            {formatCurrency(month36?.requiredFloatCapital || 0, currency, true)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            T+1 creator payouts funded during peak Month 36
          </div>
        </div>
      </div>

      {/* Visual Chart: GMV, Creator Payouts & EBITDA Progression */}
      <div className="bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart className="w-4 h-4 text-amber-400" />
              <span>Monthly Revenue & EBITDA Trajectory ({forecastHorizon} Months)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparing Gross Volume (GMV), Creator Disbursements (70%), and Net Platform EBITDA
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-300">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span>GMV</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span>Commission</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span>Net EBITDA</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart Bars */}
        <div className="h-64 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 overflow-x-auto border-b border-slate-800">
          {forecastData.map((d) => {
            const gmvHeight = Math.max(8, (d.gmv / maxGmv) * 200);
            const commHeight = Math.max(4, (d.platformGrossRevenue / maxGmv) * 200);
            const ebitdaPositive = d.netEbitda >= 0;
            const ebitdaHeight = Math.min(60, Math.max(4, (Math.abs(d.netEbitda) / maxGmv) * 200));

            return (
              <div
                key={d.month}
                className="flex-1 min-w-[20px] sm:min-w-[28px] flex flex-col items-center gap-1 group relative"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 pointer-events-none z-30 bg-slate-950 text-white text-[10px] rounded-lg p-2 shadow-xl border border-slate-700 whitespace-nowrap">
                  <div className="font-bold text-amber-400">Month {d.month} ({d.label})</div>
                  <div>GMV: {formatCurrency(d.gmv, currency)}</div>
                  <div>Commission: {formatCurrency(d.platformGrossRevenue, currency)}</div>
                  <div>EBITDA: {formatCurrency(d.netEbitda, currency)}</div>
                  <div>Viewers: {d.activeViewers.toLocaleString()}</div>
                </div>

                <div className="w-full flex items-end justify-center gap-0.5 h-[210px]">
                  {/* GMV Bar */}
                  <div
                    style={{ height: `${gmvHeight}px` }}
                    className="w-1.5 sm:w-2.5 rounded-t bg-blue-500/80 group-hover:bg-blue-400 transition-all"
                  />
                  {/* Commission Bar */}
                  <div
                    style={{ height: `${commHeight}px` }}
                    className="w-1.5 sm:w-2.5 rounded-t bg-amber-500 group-hover:bg-amber-400 transition-all"
                  />
                </div>

                <span className="text-[9px] text-slate-500 font-mono scale-90">
                  {d.month % 3 === 0 || d.month === 1 ? d.label : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Forecast Table */}
      <div className="bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Monthly Pro Forma P&L Statement</h3>
          <span className="text-xs text-slate-400">Values in {currency.code}</span>
        </div>

        <div className="overflow-x-auto max-h-96 scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="sticky top-0 bg-slate-950 text-slate-400 font-sans border-b border-slate-800 z-20">
              <tr>
                <th className="p-2.5">Month</th>
                <th className="p-2.5 text-right">Viewers</th>
                <th className="p-2.5 text-right">Creators</th>
                <th className="p-2.5 text-right">Titles</th>
                <th className="p-2.5 text-right text-blue-400">GMV</th>
                <th className="p-2.5 text-right text-amber-400">Commission (30%)</th>
                <th className="p-2.5 text-right text-emerald-400">Creator Share (70%)</th>
                <th className="p-2.5 text-right text-slate-300">Opex & CDN</th>
                <th className="p-2.5 text-right">Net EBITDA</th>
                <th className="p-2.5 text-right text-purple-400">Cumulative Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {forecastData.map((d) => (
                <tr
                  key={d.month}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    d.netEbitda > 0 ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  <td className="p-2.5 font-sans font-semibold text-white">
                    {d.label} (M{d.month})
                  </td>
                  <td className="p-2.5 text-right">{d.activeViewers.toLocaleString()}</td>
                  <td className="p-2.5 text-right">{d.activeCreators.toLocaleString()}</td>
                  <td className="p-2.5 text-right">{d.totalCatalogTitles.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-bold text-blue-400">{formatCurrency(d.gmv, currency, true)}</td>
                  <td className="p-2.5 text-right font-bold text-amber-400">{formatCurrency(d.platformGrossRevenue, currency, true)}</td>
                  <td className="p-2.5 text-right text-emerald-400">{formatCurrency(d.creatorPayouts, currency, true)}</td>
                  <td className="p-2.5 text-right">{formatCurrency(d.paymentGatewayCost + d.streamingCdnCost + d.fixedOpex, currency, true)}</td>
                  <td className={`p-2.5 text-right font-bold ${d.netEbitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(d.netEbitda, currency, true)}
                  </td>
                  <td className="p-2.5 text-right font-bold text-purple-400">{formatCurrency(d.cumulativeCash, currency, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
