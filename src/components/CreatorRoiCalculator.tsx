import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Layers, 
  DollarSign,
  Tv
} from 'lucide-react';
import { PlatformEconomics, CurrencyConfig } from '../types';
import { formatCurrency, calculateCreatorRoi } from '../utils/financialCalculators';

interface CreatorRoiCalculatorProps {
  platformEconomics: PlatformEconomics;
  currency: CurrencyConfig;
}

export const CreatorRoiCalculator: React.FC<CreatorRoiCalculatorProps> = ({
  platformEconomics,
  currency,
}) => {
  // Creator AI Production Stack Cost Inputs
  const [midjourneyPlan, setMidjourneyPlan] = useState(5000); // ₹5,000 (~$60/mo)
  const [runwayVideoPlan, setRunwayVideoPlan] = useState(8000); // ₹8,000 (~$95/mo)
  const [elevenLabsVoice, setElevenLabsVoice] = useState(2000); // ₹2,000 (~$24/mo)
  const [topazRenderUpscale, setTopazRenderUpscale] = useState(1500); // ₹1,500
  const [otherAssetsMusic, setOtherAssetsMusic] = useState(1500); // ₹1,500

  // Production Parameters
  const [contentTitle, setContentTitle] = useState('Cyber-Samurai: The Neo-Edo Chronicles');
  const [salePrice, setSalePrice] = useState(299); // ₹299 default
  const [productionHours, setProductionHours] = useState(35); // 35 hours
  const [estMonthlyPurchases, setEstMonthlyPurchases] = useState(650); // 650 viewers

  const totalToolingCost = midjourneyPlan + runwayVideoPlan + elevenLabsVoice + topazRenderUpscale + otherAssetsMusic;
  const commissionRate = platformEconomics.baseCommissionRate; // 30%

  const roiModel = calculateCreatorRoi(
    totalToolingCost,
    productionHours,
    salePrice,
    commissionRate,
    estMonthlyPurchases
  );

  const netPerSale = salePrice * (1 - commissionRate);
  const hourlyReturn = productionHours > 0 ? (roiModel.monthlyNetIncome / productionHours) : 0;

  return (
    <div id="creator-roi-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Film className="w-3.5 h-3.5" />
                Section 23: Creator Business & Production ROI Engine
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Creator Production Economics & Break-Even Calculator
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Calculate how AI tooling subscriptions (Midjourney, Runway, ElevenLabs) convert into profitable digital entertainment businesses on <strong>myflixai.com</strong> at a 70% net creator share.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-right">
            <div className="text-xs text-slate-400">Net Take Per Sale (70%)</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {formatCurrency(netPerSale, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Cost Breakdown & Output Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Production Stack Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Production Tooling Costs & Project Parameters</span>
          </h3>
          <p className="text-xs text-slate-400">
            Configure monthly subscription expenses across standard AI entertainment creation software:
          </p>

          <div className="space-y-3.5 pt-2">
            {/* Tool 1: Visual Generation (Midjourney / Stable Diffusion) */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Visual Generation & Concept Art (Midjourney Pro / DALL-E):</span>
                <span className="font-bold text-white font-mono">{formatCurrency(midjourneyPlan, currency)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={midjourneyPlan}
                onChange={(e) => setMidjourneyPlan(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Tool 2: Video Generation (Runway / Kling / Sora / Luma) */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>AI Video Generation & Animation (Runway Gen-3 / Kling / Luma):</span>
                <span className="font-bold text-white font-mono">{formatCurrency(runwayVideoPlan, currency)}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="25000"
                step="500"
                value={runwayVideoPlan}
                onChange={(e) => setRunwayVideoPlan(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Tool 3: Voiceover & Dialogue AI (ElevenLabs) */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Voice Synthesis & Character Dialogue (ElevenLabs):</span>
                <span className="font-bold text-white font-mono">{formatCurrency(elevenLabsVoice, currency)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="500"
                value={elevenLabsVoice}
                onChange={(e) => setElevenLabsVoice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Tool 4: Upscaling & Topaz / DAW */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>4K Video Upscaling & Topaz Render Engine:</span>
                <span className="font-bold text-white font-mono">{formatCurrency(topazRenderUpscale, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6000"
                step="500"
                value={topazRenderUpscale}
                onChange={(e) => setTopazRenderUpscale(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Tool 5: Music & Sound FX (Suno / Udio) */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Cinematic AI Music & Foley FX (Suno / Udio):</span>
                <span className="font-bold text-white font-mono">{formatCurrency(otherAssetsMusic, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="250"
                value={otherAssetsMusic}
                onChange={(e) => setOtherAssetsMusic(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Production Parameters: Price & Volume */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Selling Price ({currency.symbol}):</label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Est. Monthly Purchases:</label>
                <input
                  type="number"
                  value={estMonthlyPurchases}
                  onChange={(e) => setEstMonthlyPurchases(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: ROI Results & Break-Even Highlights (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Creator Profitability & ROI Matrix</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {roiModel.creatorTier}
              </span>
            </div>

            {/* Highlighted Break-Even Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-amber-950/30 border border-emerald-800/40 space-y-2 mb-4">
              <div className="text-xs text-slate-300">Total Tooling Production Cost:</div>
              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(totalToolingCost, currency)}
              </div>
              <div className="text-xs text-emerald-300 leading-relaxed font-semibold">
                ★ Break-Even Point: Only <strong>{roiModel.salesToBreakEven} viewer purchases</strong> at {formatCurrency(salePrice, currency)} are required to completely recoup all AI subscription expenses!
              </div>
            </div>

            {/* Grid of 4 Key Creator Outcomes */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Net Monthly Earnings</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  {formatCurrency(roiModel.monthlyNetIncome, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">at {estMonthlyPurchases} sales/mo</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Annual Projected Net</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-1">
                  {formatCurrency(roiModel.monthlyNetIncome * 12, currency, true)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Recurring catalog sales</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Return on AI Tool Spend</div>
                <div className="text-lg font-bold text-purple-400 font-mono mt-1">
                  +{roiModel.annualRoiPercent.toFixed(0)}% ROI
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">On {formatCurrency(totalToolingCost, currency)} spend</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Effective Hourly Yield</div>
                <div className="text-lg font-bold text-blue-400 font-mono mt-1">
                  {formatCurrency(hourlyReturn, currency)}/hr
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Across {productionHours} creator hrs</div>
              </div>
            </div>
          </div>

          {/* Section 23 Vision Recap */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-400 leading-relaxed mt-2">
            <span className="text-white font-semibold">Founder's Vision (Section 23): </span>
            Democratizing entertainment production allows solo artists to bypass legacy Hollywood studio budgets (typically $1M+) and operate sustainable digital creator businesses on consumer AI subscriptions.
          </div>
        </div>
      </div>
    </div>
  );
};
