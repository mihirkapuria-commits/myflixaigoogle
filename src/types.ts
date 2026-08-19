export type Currency = 'INR' | 'USD' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rateToInr: number;
}

export type ContentType = 'film' | 'series_season' | 'episode' | 'bundle_universe' | 'prequel_sequel';

export interface ContentPricingTier {
  id: string;
  name: string;
  type: ContentType;
  defaultPrice: number;
  minPrice: number;
  maxPrice: number;
  estMonthlyVolume: number; // estimated monthly units sold
  streamingGbSize: number;
}

export interface PlatformEconomics {
  baseCommissionRate: number; // e.g., 0.30 (30%)
  paymentGatewayFeePercent: number; // e.g. 2.0%
  paymentGatewayFixedFee: number; // e.g. ₹3
  streamingCostPerGb: number; // e.g. ₹1.5 per GB
  storageCostPerGbMonth: number; // e.g. ₹0.5
  refundReservePercent: number; // e.g. 5% withheld for 14 days
  creatorPayoutDelayDays: number; // 1 day (Next-day settlement)
  gatewaySettlementDays: number; // 2-3 days (gateway payout delay)
  monthlyFixedOpex: {
    cloudHosting: number;
    securityDrmTokenization: number;
    adminContentReviewOps: number;
    customerSupport: number;
    miscLegalCompliance: number;
  };
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  contentTitle: string;
  contentType: ContentType;
  creatorName: string;
  creatorId: string;
  viewerId: string;
  grossPrice: number;
  commissionRate: number;
  platformCommission: number;
  creatorEarnings: number;
  gatewayFee: number;
  netPlatformProfit: number;
  status: 'settled' | 'pending_settlement' | 'refunded' | 'chargeback';
  settlementDate: string;
  isAiDisclosed: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser: string;
  actionType: 'commission_update' | 'reserve_update' | 'pricing_cap' | 'settlement_policy';
  previousValue: string;
  newValue: string;
  reason: string;
}

export interface ForecastMonth {
  month: number;
  label: string;
  activeViewers: number;
  activeCreators: number;
  totalCatalogTitles: number;
  transactionsCount: number;
  gmv: number;
  platformGrossRevenue: number;
  creatorPayouts: number;
  paymentGatewayCost: number;
  streamingCdnCost: number;
  fixedOpex: number;
  totalCost: number;
  netEbitda: number;
  cumulativeCash: number;
  requiredFloatCapital: number;
}

export interface AiInsightReport {
  title: string;
  category: 'unit_economics' | 'settlement_risk' | 'commission_optimization' | 'monetization_expansion' | 'executive_summary';
  executiveSummary: string;
  keyFindings: Array<{
    metricOrArea: string;
    status: 'optimal' | 'warning' | 'critical' | 'opportunity';
    observation: string;
    impact: string;
  }>;
  actionableRecommendations: Array<{
    priority: 'Immediate (Week 1-2)' | 'Medium-Term (Month 1-3)' | 'Strategic (Q2-Q4)';
    action: string;
    expectedFinancialRoi: string;
    implementationSteps: string[];
    riskMitigation: string;
  }>;
  sensitivityNotes: string;
}

export interface CreatorRoiModel {
  creatorTier: 'Indie Solo' | 'AI Studio Small' | 'Prolific Series Creator';
  productionCost: number; // AI subscription tools, prompts, voiceover, render
  timeInvestmentHours: number;
  contentType: ContentType;
  salePrice: number;
  commissionRate: number;
  salesToBreakEven: number;
  monthlySalesEstimate: number;
  monthlyNetIncome: number;
  annualRoiPercent: number;
}
