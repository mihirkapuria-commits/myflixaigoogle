import React, { useState } from 'react';
import { Header } from './components/Header';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CommissionSimulator } from './components/CommissionSimulator';
import { SettlementFlowEngine } from './components/SettlementFlowEngine';
import { FinancialForecastModeler } from './components/FinancialForecastModeler';
import { FinancialLedger } from './components/FinancialLedger';
import { CreatorRoiCalculator } from './components/CreatorRoiCalculator';
import { AiFinancialAdvisor } from './components/AiFinancialAdvisor';
import { ExportModal } from './components/ExportModal';
import { MemoReferenceModal } from './components/MemoReferenceModal';
import { 
  INITIAL_PLATFORM_ECONOMICS, 
  INITIAL_PRICING_TIERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_AUDIT_LOG,
  CURRENCY_CONFIGS 
} from './data/myflixData';
import { 
  PlatformEconomics, 
  ContentPricingTier, 
  TransactionRecord, 
  AuditLogEntry, 
  CurrencyConfig 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCY_CONFIGS.INR);
  const [activePreset, setActivePreset] = useState<string>('memorandum-baseline');

  const [platformEconomics, setPlatformEconomics] = useState<PlatformEconomics>(INITIAL_PLATFORM_ECONOMICS);
  const [pricingTiers, setPricingTiers] = useState<ContentPricingTier[]>(INITIAL_PRICING_TIERS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMemoGuideOpen, setIsMemoGuideOpen] = useState(false);

  // Preset Applier
  const handleApplyPreset = (presetKey: string) => {
    setActivePreset(presetKey);

    if (presetKey === 'memorandum-baseline') {
      setPlatformEconomics({
        ...INITIAL_PLATFORM_ECONOMICS,
        baseCommissionRate: 0.30,
        gatewaySettlementDays: 2.5,
      });
      setPricingTiers(INITIAL_PRICING_TIERS);
    } else if (presetKey === 'scale-expansion') {
      setPlatformEconomics({
        ...INITIAL_PLATFORM_ECONOMICS,
        baseCommissionRate: 0.25,
        gatewaySettlementDays: 2.0,
      });
      setPricingTiers(
        INITIAL_PRICING_TIERS.map((t) => ({
          ...t,
          estMonthlyVolume: t.estMonthlyVolume * 3.5,
        }))
      );
    } else if (presetKey === 'creator-friendly-20') {
      setPlatformEconomics({
        ...INITIAL_PLATFORM_ECONOMICS,
        baseCommissionRate: 0.20,
      });
      setPricingTiers(
        INITIAL_PRICING_TIERS.map((t) => ({
          ...t,
          estMonthlyVolume: t.estMonthlyVolume * 2.2,
        }))
      );
    } else if (presetKey === 'stressed-float') {
      setPlatformEconomics({
        ...INITIAL_PLATFORM_ECONOMICS,
        gatewaySettlementDays: 4.0, // High lag
        refundReservePercent: 8.0,
      });
    }
  };

  // Commission Update with Audit Trail
  const handleUpdateCommissionRate = (newRate: number, adminName: string, reason: string) => {
    const prevRate = platformEconomics.baseCommissionRate;
    
    setPlatformEconomics((prev) => ({
      ...prev,
      baseCommissionRate: newRate,
    }));

    const newAuditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminUser: adminName || 'Admin Controller',
      actionType: 'commission_update',
      previousValue: `${(prevRate * 100).toFixed(1)}% Take-Rate`,
      newValue: `${(newRate * 100).toFixed(1)}% Take-Rate`,
      reason: reason || 'Dynamic rate calibration in Central Commission Engine',
    };

    setAuditLogs((prev) => [newAuditEntry, ...prev]);
  };

  // Update other economic params
  const handleUpdateEconomics = (updated: Partial<PlatformEconomics>) => {
    setPlatformEconomics((prev) => ({ ...prev, ...updated }));
  };

  // Update tier pricing
  const handleUpdateTierPrice = (tierId: string, newPrice: number) => {
    setPricingTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, defaultPrice: newPrice } : t))
    );
  };

  // Update tier volume
  const handleUpdateTierVolume = (tierId: string, newVolume: number) => {
    setPricingTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, estMonthlyVolume: newVolume } : t))
    );
  };

  // Add Transaction
  const handleAddTransaction = (txn: TransactionRecord) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  // Simulate Refund
  const handleSimulateRefund = (txnId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId
          ? {
              ...t,
              status: 'refunded',
              settlementDate: 'Reversed via Policy Check',
              creatorEarnings: 0,
              platformCommission: 0,
              netPlatformProfit: 0,
            }
          : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        activePreset={activePreset}
        applyPreset={handleApplyPreset}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenMemoGuide={() => setIsMemoGuideOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <ExecutiveDashboard
            pricingTiers={pricingTiers}
            platformEconomics={platformEconomics}
            currency={currency}
            onNavigateTab={setActiveTab}
            onUpdateTierPrice={handleUpdateTierPrice}
            onUpdateTierVolume={handleUpdateTierVolume}
          />
        )}

        {activeTab === 'commission' && (
          <CommissionSimulator
            platformEconomics={platformEconomics}
            pricingTiers={pricingTiers}
            currency={currency}
            auditLogs={auditLogs}
            onUpdateCommissionRate={handleUpdateCommissionRate}
          />
        )}

        {activeTab === 'settlement' && (
          <SettlementFlowEngine
            platformEconomics={platformEconomics}
            pricingTiers={pricingTiers}
            currency={currency}
            onUpdateEconomics={handleUpdateEconomics}
          />
        )}

        {activeTab === 'forecast' && (
          <FinancialForecastModeler
            pricingTiers={pricingTiers}
            platformEconomics={platformEconomics}
            currency={currency}
          />
        )}

        {activeTab === 'ledger' && (
          <FinancialLedger
            transactions={transactions}
            platformEconomics={platformEconomics}
            currency={currency}
            onAddTransaction={handleAddTransaction}
            onSimulateRefund={handleSimulateRefund}
          />
        )}

        {activeTab === 'creator' && (
          <CreatorRoiCalculator
            platformEconomics={platformEconomics}
            currency={currency}
          />
        )}

        {activeTab === 'ai-advisor' && (
          <AiFinancialAdvisor
            platformEconomics={platformEconomics}
            pricingTiers={pricingTiers}
            currency={currency}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-300">myflixai.com Financial Intelligence Suite</span> • Modeled on Founder's Memorandum Specifications
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Central 30% Commission</span>
            <span>•</span>
            <span>Next-Day T+1 Settlement</span>
            <span>•</span>
            <span>Gemini 3.7 AI CFO</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        platformEconomics={platformEconomics}
        pricingTiers={pricingTiers}
        currency={currency}
      />

      <MemoReferenceModal
        isOpen={isMemoGuideOpen}
        onClose={() => setIsMemoGuideOpen(false)}
      />
    </div>
  );
}
