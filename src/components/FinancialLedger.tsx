import React, { useState } from 'react';
import { 
  ReceiptText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Film, 
  Tv, 
  Disc3, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Download
} from 'lucide-react';
import { TransactionRecord, PlatformEconomics, CurrencyConfig, ContentType } from '../types';
import { formatCurrency, calculateTransactionBreakdown } from '../utils/financialCalculators';

interface FinancialLedgerProps {
  transactions: TransactionRecord[];
  platformEconomics: PlatformEconomics;
  currency: CurrencyConfig;
  onAddTransaction: (txn: TransactionRecord) => void;
  onSimulateRefund: (txnId: string) => void;
}

export const FinancialLedger: React.FC<FinancialLedgerProps> = ({
  transactions,
  platformEconomics,
  currency,
  onAddTransaction,
  onSimulateRefund,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form state
  const [newTitle, setNewTitle] = useState('Solaris Genesis: Season 1');
  const [newType, setNewType] = useState<ContentType>('series_season');
  const [newCreator, setNewCreator] = useState('Hyperion AI Studio');
  const [newPrice, setNewPrice] = useState(799);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      t.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || t.contentType === filterType;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const breakdown = calculateTransactionBreakdown(
      newPrice,
      platformEconomics.baseCommissionRate,
      platformEconomics.paymentGatewayFeePercent ? platformEconomics : platformEconomics
    );

    const newRecord: TransactionRecord = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      contentTitle: newTitle,
      contentType: newType,
      creatorName: newCreator,
      creatorId: `CR-${Math.floor(100 + Math.random() * 800)}`,
      viewerId: `VW-${Math.floor(1000 + Math.random() * 9000)}`,
      grossPrice: newPrice,
      commissionRate: platformEconomics.baseCommissionRate,
      platformCommission: breakdown.platformCommission,
      creatorEarnings: breakdown.creatorEarnings,
      gatewayFee: breakdown.gatewayFee,
      netPlatformProfit: breakdown.netPlatformProfit,
      status: 'pending_settlement',
      settlementDate: 'Next-Day Eligible (T+1)',
      isAiDisclosed: true,
    };

    onAddTransaction(newRecord);
    setShowAddModal(false);
  };

  return (
    <div id="financial-ledger-view" className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ReceiptText className="w-3.5 h-3.5" />
                Section 21: Financial Ledger & Transaction Registry
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Real-Time Financial Ledger & Next-Day Settlement Queue
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Every content purchase is itemized with gross price, 30% platform commission, 70% creator share, payment gateway deductions, and T+1 disbursement status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="simulate-txn-btn"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-950"
            >
              <Plus className="w-4 h-4" />
              <span>Simulate Viewer Purchase</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, creator, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Content Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-amber-500"
          >
            <option value="all">All Content Types</option>
            <option value="film">AI Feature Films</option>
            <option value="series_season">Full Series Seasons</option>
            <option value="episode">Single Episodes</option>
            <option value="bundle_universe">Cinematic Bundles</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-amber-500"
          >
            <option value="all">All Settlement Statuses</option>
            <option value="pending_settlement">Pending Settlement (Day 2)</option>
            <option value="settled">Settled (Disbursed)</option>
            <option value="refunded">Refunded / Reversed</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-slate-950/80 text-slate-400 font-sans border-b border-slate-800">
              <tr>
                <th className="p-3.5">Txn ID & Time</th>
                <th className="p-3.5">Content & Creator</th>
                <th className="p-3.5 text-right">Gross Price</th>
                <th className="p-3.5 text-right text-amber-400">Platform 30%</th>
                <th className="p-3.5 text-right text-emerald-400">Creator 70%</th>
                <th className="p-3.5 text-right text-rose-400">PG Fee</th>
                <th className="p-3.5 text-right text-white">Net Margin</th>
                <th className="p-3.5 text-center">Settlement Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.map((txn) => {
                return (
                  <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* ID & Time */}
                    <td className="p-3.5">
                      <div className="font-bold text-amber-400">{txn.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{txn.timestamp}</div>
                    </td>

                    {/* Content & Creator */}
                    <td className="p-3.5 font-sans">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {txn.contentType === 'film' && <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {txn.contentType === 'series_season' && <Tv className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                        {txn.contentType === 'episode' && <Disc3 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {txn.contentType === 'bundle_universe' && <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                        <span className="truncate max-w-[200px]">{txn.contentTitle}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>By {txn.creatorName}</span>
                        {txn.isAiDisclosed && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                            AI Disclosed
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Gross */}
                    <td className="p-3.5 text-right font-bold text-white">
                      {formatCurrency(txn.grossPrice, currency)}
                    </td>

                    {/* Platform */}
                    <td className="p-3.5 text-right font-bold text-amber-400">
                      {formatCurrency(txn.platformCommission, currency)}
                    </td>

                    {/* Creator */}
                    <td className="p-3.5 text-right font-bold text-emerald-400">
                      {formatCurrency(txn.creatorEarnings, currency)}
                    </td>

                    {/* PG Fee */}
                    <td className="p-3.5 text-right text-rose-400">
                      - {formatCurrency(txn.gatewayFee, currency)}
                    </td>

                    {/* Net Margin */}
                    <td className="p-3.5 text-right font-bold text-white">
                      {formatCurrency(txn.netPlatformProfit, currency)}
                    </td>

                    {/* Settlement Status */}
                    <td className="p-3.5 text-center font-sans">
                      {txn.status === 'settled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Settled
                        </span>
                      )}
                      {txn.status === 'pending_settlement' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Day 2 Eligible
                        </span>
                      )}
                      {txn.status === 'refunded' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <RotateCcw className="w-3 h-3" />
                          Refunded
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center font-sans">
                      {txn.status === 'pending_settlement' && (
                        <button
                          onClick={() => onSimulateRefund(txn.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-[11px] transition-colors"
                          title="Simulate Buyer Refund Check"
                        >
                          Simulate Refund
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulate Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Simulate Viewer Content Purchase</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Content Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Content Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const t = e.target.value as ContentType;
                      setNewType(t);
                      if (t === 'film') setNewPrice(299);
                      if (t === 'series_season') setNewPrice(799);
                      if (t === 'episode') setNewPrice(49);
                      if (t === 'bundle_universe') setNewPrice(1299);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="film">AI Feature Film</option>
                    <option value="series_season">Full Series Season</option>
                    <option value="episode">Single Episode</option>
                    <option value="bundle_universe">Cinematic Universe Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Creator Name / Studio:</label>
                  <input
                    type="text"
                    value={newCreator}
                    onChange={(e) => setNewCreator(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Purchase Price ({currency.symbol}):
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 font-mono font-bold"
                  required
                />
              </div>

              {/* Instant math preview */}
              <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Price:</span>
                  <span className="text-white font-bold">{formatCurrency(newPrice, currency)}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Platform Commission ({(platformEconomics.baseCommissionRate * 100).toFixed(0)}%):</span>
                  <span className="font-bold">+ {formatCurrency(newPrice * platformEconomics.baseCommissionRate, currency)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Creator Payout (70%):</span>
                  <span className="font-bold">- {formatCurrency(newPrice * (1 - platformEconomics.baseCommissionRate), currency)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Record Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
