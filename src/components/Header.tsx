import React from 'react';
import { 
  BarChart3, 
  Sliders, 
  Clock, 
  TrendingUp, 
  ReceiptText, 
  Sparkles, 
  Film, 
  FileSpreadsheet, 
  HelpCircle,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { Currency, CurrencyConfig } from '../types';
import { CURRENCY_CONFIGS } from '../data/myflixData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: CurrencyConfig;
  setCurrency: (c: CurrencyConfig) => void;
  activePreset: string;
  applyPreset: (preset: string) => void;
  onOpenExport: () => void;
  onOpenMemoGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  activePreset,
  applyPreset,
  onOpenExport,
  onOpenMemoGuide,
}) => {
  const navItems = [
    { id: 'overview', label: 'Executive P&L & Unit Economics', icon: BarChart3 },
    { id: 'commission', label: 'Commission Engine (30%)', icon: Sliders },
    { id: 'settlement', label: 'Next-Day Settlement & Float', icon: Clock },
    { id: 'forecast', label: '3-Year Forecast & Break-Even', icon: TrendingUp },
    { id: 'ledger', label: 'Transaction Ledger & Audit Trail', icon: ReceiptText },
    { id: 'creator', label: 'Creator ROI Simulator', icon: Film },
    { id: 'ai-advisor', label: 'AI CFO & Strategic Insights', icon: Sparkles, highlight: true },
  ];

  return (
    <header id="main-header" className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-md shadow-rose-950/40 text-white font-bold tracking-wider text-lg">
              MF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">myflixai.com</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Financial Intelligence Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Founder's Memorandum Model • 30% Central Take-Rate • Next-Day T+1 Settlement Engine
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Presets dropdown */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700 text-xs">
              <span className="px-2 text-slate-400 font-medium">Model Preset:</span>
              <select
                id="preset-select"
                value={activePreset}
                onChange={(e) => applyPreset(e.target.value)}
                className="bg-slate-900 text-slate-200 rounded px-2 py-1 border border-slate-700 outline-none focus:border-amber-500 text-xs font-medium cursor-pointer"
              >
                <option value="memorandum-baseline">Founder's Memo (30% Baseline)</option>
                <option value="scale-expansion">High-Growth AI Studio Scale</option>
                <option value="creator-friendly-20">Volume Strategy (20% Take Rate)</option>
                <option value="stressed-float">Stressed Cash Float (T+3 PG Delay)</option>
              </select>
            </div>

            {/* Currency selector */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
              {(['INR', 'USD', 'EUR'] as Currency[]).map((cCode) => (
                <button
                  key={cCode}
                  id={`currency-btn-${cCode}`}
                  onClick={() => setCurrency(CURRENCY_CONFIGS[cCode])}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                    currency.code === cCode
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {CURRENCY_CONFIGS[cCode].symbol} {cCode}
                </button>
              ))}
            </div>

            {/* Memo summary modal button */}
            <button
              id="memo-guide-btn"
              onClick={onOpenMemoGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition-colors"
              title="View Founder's Memorandum Architecture"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Memo Specs</span>
            </button>

            {/* Export modal button */}
            <button
              id="export-memo-btn"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 text-xs font-bold transition-all shadow-sm shadow-amber-950"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Executive Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-t border-slate-800/90 bg-slate-900/95 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5 min-w-max" aria-label="Tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : item.highlight
                      ? 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (item.highlight ? 'text-amber-400' : 'text-amber-400') : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
