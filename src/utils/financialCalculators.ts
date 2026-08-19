import { ContentPricingTier, PlatformEconomics, ForecastMonth, CreatorRoiModel, CurrencyConfig } from '../types';

export function formatCurrency(amount: number, currency: CurrencyConfig, compact = false): string {
  const converted = amount * currency.rateToInr;
  
  if (compact) {
    if (currency.code === 'INR') {
      if (Math.abs(converted) >= 10000000) {
        return `${currency.symbol}${(converted / 10000000).toFixed(2)} Cr`;
      }
      if (Math.abs(converted) >= 100000) {
        return `${currency.symbol}${(converted / 100000).toFixed(2)} L`;
      }
      if (Math.abs(converted) >= 1000) {
        return `${currency.symbol}${(converted / 1000).toFixed(1)}k`;
      }
    } else {
      if (Math.abs(converted) >= 1000000) {
        return `${currency.symbol}${(converted / 1000000).toFixed(2)}M`;
      }
      if (Math.abs(converted) >= 1000) {
        return `${currency.symbol}${(converted / 1000).toFixed(1)}k`;
      }
    }
  }

  return `${currency.symbol}${converted.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(converted) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateTransactionBreakdown(
  grossPrice: number,
  commissionRate: number,
  platformEconomics: PlatformEconomics
) {
  const platformCommission = grossPrice * commissionRate;
  const creatorEarnings = grossPrice - platformCommission;
  const gatewayFee = (grossPrice * (platformEconomics.paymentGatewayFeePercent / 100)) + platformEconomics.paymentGatewayFixedFee;
  const netPlatformProfit = platformCommission - gatewayFee;
  const netPlatformMarginPercent = grossPrice > 0 ? (netPlatformProfit / grossPrice) * 100 : 0;

  return {
    grossPrice,
    commissionRate,
    platformCommission,
    creatorEarnings,
    gatewayFee,
    netPlatformProfit,
    netPlatformMarginPercent,
  };
}

export function calculateMonthlyAggregate(
  pricingTiers: ContentPricingTier[],
  platformEconomics: PlatformEconomics,
  volumeMultiplier = 1.0
) {
  let totalGmv = 0;
  let totalUnits = 0;
  let totalGrossCommission = 0;
  let totalCreatorPayouts = 0;
  let totalGatewayFees = 0;
  let totalStreamingCost = 0;

  const tierBreakdowns = pricingTiers.map((tier) => {
    const units = Math.round(tier.estMonthlyVolume * volumeMultiplier);
    const gmv = units * tier.defaultPrice;
    const grossComm = gmv * platformEconomics.baseCommissionRate;
    const creatorShare = gmv - grossComm;
    const gatewayFees = units * ((tier.defaultPrice * (platformEconomics.paymentGatewayFeePercent / 100)) + platformEconomics.paymentGatewayFixedFee);
    const streamingCost = units * tier.streamingGbSize * platformEconomics.streamingCostPerGb;
    const netProfit = grossComm - gatewayFees - streamingCost;

    totalGmv += gmv;
    totalUnits += units;
    totalGrossCommission += grossComm;
    totalCreatorPayouts += creatorShare;
    totalGatewayFees += gatewayFees;
    totalStreamingCost += streamingCost;

    return {
      tier,
      units,
      gmv,
      grossComm,
      creatorShare,
      gatewayFees,
      streamingCost,
      netProfit,
      marginPercent: gmv > 0 ? (netProfit / gmv) * 100 : 0,
    };
  });

  const fixedOpexTotal = Object.values(platformEconomics.monthlyFixedOpex).reduce(
    (sum, val) => sum + Number(val),
    0
  );

  const netPlatformContribution = totalGrossCommission - totalGatewayFees - totalStreamingCost;
  const monthlyNetEbitda = netPlatformContribution - fixedOpexTotal;
  const netEbitdaMargin = totalGmv > 0 ? (monthlyNetEbitda / totalGmv) * 100 : 0;
  const averageOrderValue = totalUnits > 0 ? totalGmv / totalUnits : 0;

  // Working Capital Float calculation:
  // Creator payout happens in 1 day (T+1). Payment Gateway arrives in T+2.5 days.
  // Float gap = 1.5 days of daily creator disbursements.
  const dailyCreatorPayout = totalCreatorPayouts / 30;
  const floatDaysGap = Math.max(0, platformEconomics.gatewaySettlementDays - platformEconomics.creatorPayoutDelayDays);
  const requiredFloatCapital = dailyCreatorPayout * floatDaysGap * 1.30; // 30% liquidity buffer
  const rollingRefundReservePool = (totalGmv * (platformEconomics.refundReservePercent / 100));

  return {
    totalGmv,
    totalUnits,
    totalGrossCommission,
    totalCreatorPayouts,
    totalGatewayFees,
    totalStreamingCost,
    fixedOpexTotal,
    netPlatformContribution,
    monthlyNetEbitda,
    netEbitdaMargin,
    averageOrderValue,
    requiredFloatCapital,
    rollingRefundReservePool,
    dailyCreatorPayout,
    floatDaysGap,
    tierBreakdowns,
  };
}

export function generateForecast(
  pricingTiers: ContentPricingTier[],
  platformEconomics: PlatformEconomics,
  growthRateMonthly = 0.20, // 20% MoM
  initialCashReserve = 1500000,
  monthsCount = 36
): ForecastMonth[] {
  const baseAgg = calculateMonthlyAggregate(pricingTiers, platformEconomics, 1.0);
  const baseMonthlyUnits = baseAgg.totalUnits;
  const baseGmvPerUnit = baseAgg.averageOrderValue;
  
  const forecast: ForecastMonth[] = [];
  let cumulativeCash = initialCashReserve;

  let activeViewers = 12000;
  let activeCreators = 150;
  let totalCatalogTitles = 320;

  for (let m = 1; m <= monthsCount; m++) {
    // Growth multiplier with gentle saturation curve
    const growthMult = Math.pow(1 + growthRateMonthly * Math.exp(-m / 48), m - 1);
    
    activeViewers = Math.round(12000 * Math.pow(1 + (growthRateMonthly * 0.9), m - 1));
    activeCreators = Math.round(150 * Math.pow(1 + (growthRateMonthly * 0.6), m - 1));
    totalCatalogTitles = Math.round(320 + (activeCreators * 2.2 * m * 0.4));

    const units = Math.round(baseMonthlyUnits * growthMult);
    const gmv = units * baseGmvPerUnit;
    const platformGrossRevenue = gmv * platformEconomics.baseCommissionRate;
    const creatorPayouts = gmv - platformGrossRevenue;
    
    const paymentGatewayCost = units * ((baseGmvPerUnit * (platformEconomics.paymentGatewayFeePercent / 100)) + platformEconomics.paymentGatewayFixedFee);
    const streamingCdnCost = units * 3.2 * platformEconomics.streamingCostPerGb; // average 3.2 GB
    
    // Fixed opex scales moderately with volume
    const opexMultiplier = 1 + (Math.log10(m + 1) * 0.45);
    const fixedOpex = baseAgg.fixedOpexTotal * opexMultiplier;
    
    const totalCost = creatorPayouts + paymentGatewayCost + streamingCdnCost + fixedOpex;
    const netEbitda = platformGrossRevenue - paymentGatewayCost - streamingCdnCost - fixedOpex;
    
    cumulativeCash += netEbitda;
    const dailyCreator = creatorPayouts / 30;
    const floatGap = Math.max(0, platformEconomics.gatewaySettlementDays - platformEconomics.creatorPayoutDelayDays);
    const requiredFloatCapital = dailyCreator * floatGap * 1.30;

    const monthName = new Date(2026, 7 + m, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    forecast.push({
      month: m,
      label: monthName,
      activeViewers,
      activeCreators,
      totalCatalogTitles,
      transactionsCount: units,
      gmv,
      platformGrossRevenue,
      creatorPayouts,
      paymentGatewayCost,
      streamingCdnCost,
      fixedOpex,
      totalCost,
      netEbitda,
      cumulativeCash,
      requiredFloatCapital,
    });
  }

  return forecast;
}

export function calculateCreatorRoi(
  productionCost: number,
  timeInvestmentHours: number,
  salePrice: number,
  commissionRate: number,
  monthlySalesEstimate: number
): CreatorRoiModel {
  const netEarningsPerSale = salePrice * (1 - commissionRate);
  const salesToBreakEven = netEarningsPerSale > 0 ? Math.ceil(productionCost / netEarningsPerSale) : 0;
  const monthlyNetIncome = monthlySalesEstimate * netEarningsPerSale;
  const annualNetIncome = monthlyNetIncome * 12;
  const annualRoiPercent = productionCost > 0 ? ((annualNetIncome - productionCost) / productionCost) * 100 : 0;

  let creatorTier: 'Indie Solo' | 'AI Studio Small' | 'Prolific Series Creator' = 'Indie Solo';
  if (productionCost > 50000 || monthlySalesEstimate > 1000) {
    creatorTier = 'AI Studio Small';
  }
  if (productionCost > 150000 || monthlySalesEstimate > 3000) {
    creatorTier = 'Prolific Series Creator';
  }

  return {
    creatorTier,
    productionCost,
    timeInvestmentHours,
    contentType: 'film',
    salePrice,
    commissionRate,
    salesToBreakEven,
    monthlySalesEstimate,
    monthlyNetIncome,
    annualRoiPercent,
  };
}
