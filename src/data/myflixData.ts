import { ContentPricingTier, PlatformEconomics, TransactionRecord, AuditLogEntry, CurrencyConfig } from '../types';

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateToInr: 1 },
  USD: { code: 'USD', symbol: '$', rateToInr: 0.0118 }, // ~85 INR/USD
  EUR: { code: 'EUR', symbol: '€', rateToInr: 0.0110 }, // ~91 INR/EUR
};

export const INITIAL_PLATFORM_ECONOMICS: PlatformEconomics = {
  baseCommissionRate: 0.30, // 30% default from Memorandum
  paymentGatewayFeePercent: 2.0, // 2% PG fee (Razorpay/Stripe standard)
  paymentGatewayFixedFee: 3.0, // ₹3 fixed per transaction
  streamingCostPerGb: 1.20, // ₹1.20 per GB on AWS CloudFront / BunnyCDN
  storageCostPerGbMonth: 0.80, // S3 + DRM tokenization
  refundReservePercent: 5.0, // 5% rolling reserve against chargebacks
  creatorPayoutDelayDays: 1, // Next-day settlement
  gatewaySettlementDays: 2.5, // Payment gateway settles in T+2 or T+3 days
  monthlyFixedOpex: {
    cloudHosting: 45000,
    securityDrmTokenization: 35000,
    adminContentReviewOps: 60000,
    customerSupport: 30000,
    miscLegalCompliance: 25000,
  }
};

export const INITIAL_PRICING_TIERS: ContentPricingTier[] = [
  {
    id: 'film-standard',
    name: 'Standalone AI Feature Film',
    type: 'film',
    defaultPrice: 299, // ₹299 as in memorandum example (Sec 21)
    minPrice: 99,
    maxPrice: 999,
    estMonthlyVolume: 4500,
    streamingGbSize: 2.4,
  },
  {
    id: 'series-season',
    name: 'Full AI Series Season (e.g. 4-8 eps)',
    type: 'series_season',
    defaultPrice: 799,
    minPrice: 299,
    maxPrice: 1999,
    estMonthlyVolume: 2200,
    streamingGbSize: 6.8,
  },
  {
    id: 'series-episode',
    name: 'Individual Episode Purchase',
    type: 'episode',
    defaultPrice: 49,
    minPrice: 19,
    maxPrice: 199,
    estMonthlyVolume: 8500,
    streamingGbSize: 0.9,
  },
  {
    id: 'bundle-universe',
    name: 'Cinematic Universe (Prequel + Sequel Bundle)',
    type: 'bundle_universe',
    defaultPrice: 1299,
    minPrice: 499,
    maxPrice: 3499,
    estMonthlyVolume: 950,
    streamingGbSize: 11.2,
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-9021',
    timestamp: '2026-08-19 07:15',
    contentTitle: 'Chronicles of Neo-Kyoto: The Awakening',
    contentType: 'film',
    creatorName: 'Aetheria Studios (Rohan M.)',
    creatorId: 'CR-104',
    viewerId: 'VW-8821',
    grossPrice: 299,
    commissionRate: 0.30,
    platformCommission: 89.70,
    creatorEarnings: 209.30,
    gatewayFee: 8.98,
    netPlatformProfit: 80.72,
    status: 'pending_settlement',
    settlementDate: '2026-08-20 (Day 2 Eligible)',
    isAiDisclosed: true,
  },
  {
    id: 'TXN-9020',
    timestamp: '2026-08-19 06:42',
    contentTitle: 'The Last Colony: Season 1 (Eps 1-4)',
    contentType: 'series_season',
    creatorName: 'Synthetic Horizon Productions',
    creatorId: 'CR-102',
    viewerId: 'VW-9142',
    grossPrice: 799,
    commissionRate: 0.30,
    platformCommission: 239.70,
    creatorEarnings: 559.30,
    gatewayFee: 18.98,
    netPlatformProfit: 220.72,
    status: 'pending_settlement',
    settlementDate: '2026-08-20 (Day 2 Eligible)',
    isAiDisclosed: true,
  },
  {
    id: 'TXN-9019',
    timestamp: '2026-08-19 05:18',
    contentTitle: 'Quantum Solitude (AI Short Film)',
    contentType: 'film',
    creatorName: 'Neural CineLab',
    creatorId: 'CR-109',
    viewerId: 'VW-3419',
    grossPrice: 199,
    commissionRate: 0.30,
    platformCommission: 59.70,
    creatorEarnings: 139.30,
    gatewayFee: 6.98,
    netPlatformProfit: 52.72,
    status: 'pending_settlement',
    settlementDate: '2026-08-20 (Day 2 Eligible)',
    isAiDisclosed: true,
  },
  {
    id: 'TXN-9018',
    timestamp: '2026-08-18 21:04',
    contentTitle: 'The Last Colony: Season 2 Episode 3',
    contentType: 'episode',
    creatorName: 'Synthetic Horizon Productions',
    creatorId: 'CR-102',
    viewerId: 'VW-7720',
    grossPrice: 49,
    commissionRate: 0.30,
    platformCommission: 14.70,
    creatorEarnings: 34.30,
    gatewayFee: 3.98,
    netPlatformProfit: 10.72,
    status: 'settled',
    settlementDate: '2026-08-19 (Settled)',
    isAiDisclosed: true,
  },
  {
    id: 'TXN-9017',
    timestamp: '2026-08-18 19:30',
    contentTitle: 'Cyber-Vedic Odyssey Trilogy Bundle',
    contentType: 'bundle_universe',
    creatorName: 'Kalki AI Narrative Lab',
    creatorId: 'CR-115',
    viewerId: 'VW-5011',
    grossPrice: 1499,
    commissionRate: 0.30,
    platformCommission: 449.70,
    creatorEarnings: 1049.30,
    gatewayFee: 32.98,
    netPlatformProfit: 416.72,
    status: 'settled',
    settlementDate: '2026-08-19 (Settled)',
    isAiDisclosed: true,
  },
  {
    id: 'TXN-9016',
    timestamp: '2026-08-18 16:15',
    contentTitle: 'Neon Monsoon (4K AI Feature)',
    contentType: 'film',
    creatorName: 'Aetheria Studios (Rohan M.)',
    creatorId: 'CR-104',
    viewerId: 'VW-2098',
    grossPrice: 299,
    commissionRate: 0.30,
    platformCommission: 89.70,
    creatorEarnings: 209.30,
    gatewayFee: 8.98,
    netPlatformProfit: 80.72,
    status: 'settled',
    settlementDate: '2026-08-19 (Settled)',
    isAiDisclosed: true,
  },
  {
    id: 'TXN-9015',
    timestamp: '2026-08-18 11:20',
    contentTitle: 'Deep Space Mirage: Episode 1',
    contentType: 'episode',
    creatorName: 'CosmoCraft AI',
    creatorId: 'CR-121',
    viewerId: 'VW-1104',
    grossPrice: 49,
    commissionRate: 0.30,
    platformCommission: 14.70,
    creatorEarnings: 34.30,
    gatewayFee: 3.98,
    netPlatformProfit: 10.72,
    status: 'refunded',
    settlementDate: 'Reversed via Policy Check',
    isAiDisclosed: true,
  }
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'AUDIT-101',
    timestamp: '2026-08-15 10:00',
    adminUser: 'Founder / Lead Admin',
    actionType: 'commission_update',
    previousValue: 'Platform Inception',
    newValue: '30.0% Base Rate',
    reason: 'Initial platform baseline defined in Section 9 & 18 of Memorandum.'
  },
  {
    id: 'AUDIT-102',
    timestamp: '2026-08-16 14:30',
    adminUser: 'Financial Controller',
    actionType: 'settlement_policy',
    previousValue: 'Instant T+0',
    newValue: 'Next-Day T+1 Settlement with 5% rolling reserve',
    reason: 'Mitigates chargeback risk and accommodates payment gateway settlement window.'
  }
];

export const FOUNDER_MEMORANDUM_EXCERPTS = {
  businessName: 'myflixai.com',
  tagline: "Founder's Memorandum — AI Entertainment Marketplace",
  coreModel: "Creator ↔ Viewer Marketplace for AI films, web series, seasons, episodes, sequels, prequels",
  defaultCommission: "30% default commission engine with next-day settlement (Day 1 purchase -> Day 2 payout)",
  vision: "Democratise entertainment production and distribution. Allow creators to turn AI-generated entertainment into a business without traditional studios.",
  keyFinancialPillars: [
    "30% Central Commission Engine dynamically managed by Admin",
    "Next-Day Settlement (T+1) for Creator Earnings subject to fraud and refund checks",
    "Micro-transaction granularity: ₹49 per Episode to ₹1,499+ Cinematic Universe Bundles",
    "Zero upfront distribution gatekeepers; full rights and AI disclosure workflow",
    "Future expansion roadmap: Pro subscriptions, featured slots, content licensing, enterprise syndication"
  ]
};
