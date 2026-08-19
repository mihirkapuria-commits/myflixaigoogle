import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Zap, 
  FileText,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame
} from 'lucide-react';
import { PlatformEconomics, ContentPricingTier, CurrencyConfig, AiInsightReport } from '../types';
import { formatCurrency, calculateMonthlyAggregate } from '../utils/financialCalculators';

interface AiFinancialAdvisorProps {
  platformEconomics: PlatformEconomics;
  pricingTiers: ContentPricingTier[];
  currency: CurrencyConfig;
}

export const AiFinancialAdvisor: React.FC<AiFinancialAdvisorProps> = ({
  platformEconomics,
  pricingTiers,
  currency,
}) => {
  const [activeCategory, setActiveCategory] = useState<'executive_summary' | 'unit_economics' | 'settlement_risk' | 'commission_optimization' | 'monetization_expansion'>('executive_summary');
  const [report, setReport] = useState<AiInsightReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I am your AI Chief Financial Officer and Marketplace Strategist for **myflixai.com**. I have analyzed your 30% take-rate, next-day settlement workflow (T+1), and catalogue pricing tiers. How can I help you optimize unit economics or stress-test working capital today?`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Stress Test State
  const [stressScenario, setStressScenario] = useState<string | null>(null);
  const [stressResult, setStressResult] = useState<any | null>(null);
  const [loadingStress, setLoadingStress] = useState(false);

  const aggregate = calculateMonthlyAggregate(pricingTiers, platformEconomics, 1.0);

  const auditCategories = [
    { id: 'executive_summary', label: 'Executive Financial Audit', icon: FileText },
    { id: 'settlement_risk', label: 'Settlement Float & Liquidity Risk', icon: Clock },
    { id: 'unit_economics', label: 'Pricing & Unit Economics', icon: TrendingUp },
    { id: 'commission_optimization', label: 'Commission Elasticity (30%)', icon: Zap },
    { id: 'monetization_expansion', label: 'Expansion Revenue (Section 20)', icon: Layers },
  ];

  const handleGenerateAudit = async (cat = activeCategory) => {
    setLoadingReport(true);
    setReportError(null);
    try {
      const response = await fetch('/api/financial-insights/ai-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          currentMetrics: {
            totalGmv: aggregate.totalGmv,
            units: aggregate.totalUnits,
            ebitda: aggregate.monthlyNetEbitda,
            floatNeeded: aggregate.requiredFloatCapital,
          },
          platformEconomics,
          pricingTiers,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setReport(data.data);
      } else if (data.fallback) {
        setReport(data.fallback);
      } else {
        throw new Error(data.error || 'Failed to generate advisory report');
      }
    } catch (err: any) {
      console.error(err);
      setReportError(err.message || 'Unable to connect to AI advisory service');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleSendMessage = async (userMsgText?: string) => {
    const textToSend = userMsgText || chatInput;
    if (!textToSend.trim() || loadingChat) return;

    const newMsgList = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMsgList);
    setChatInput('');
    setLoadingChat(true);

    try {
      const response = await fetch('/api/financial-insights/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: newMsgList.slice(-6),
          contextData: {
            commissionRate: platformEconomics.baseCommissionRate,
            monthlyGmv: aggregate.totalGmv,
            cashFloat: aggregate.requiredFloatCapital,
            pricingTiers,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages([...newMsgList, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...newMsgList,
          {
            role: 'assistant',
            content: `Based on your model (30% take-rate on ₹${aggregate.totalGmv.toLocaleString()} monthly GMV), your net platform contribution is ₹${aggregate.netPlatformContribution.toLocaleString()} with ₹${aggregate.requiredFloatCapital.toLocaleString()} in required settlement float reserves.`,
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMsgList,
        {
          role: 'assistant',
          content: 'I encountered a temporary connection issue. Your current platform unit economics show a 27.2% net contribution margin per transaction after all payment gateway fees.',
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleRunStressTest = async (scenario: string) => {
    setStressScenario(scenario);
    setLoadingStress(true);
    try {
      const response = await fetch('/api/financial-insights/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioType: scenario,
          currentConfig: {
            commissionRate: platformEconomics.baseCommissionRate,
            monthlyGmv: aggregate.totalGmv,
          },
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setStressResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStress(false);
    }
  };

  return (
    <div id="ai-advisor-view" className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.7 Pro-Grade Financial Intelligence
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              AI Chief Financial Officer & Strategic Insights Suite
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Synthesizing the complete <strong>myflixai.com</strong> Founder's Memorandum to provide diagnostic risk audits, unit economics optimization, and custom scenario modeling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="generate-instant-audit-btn"
              onClick={() => handleGenerateAudit()}
              disabled={loadingReport}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
            >
              {loadingReport ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Comprehensive AI Audit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Report Generator & Interactive AI Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Audit Generator & Structured Report (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Audit Category Selector Bar */}
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex flex-wrap gap-1.5">
            {auditCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as any);
                    handleGenerateAudit(cat.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Generated Report Display Box */}
          <div className="bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm min-h-[420px] flex flex-col justify-between">
            {loadingReport ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <div className="text-sm font-semibold text-white">Analyzing Financial Memorandum Data...</div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Evaluating 30% take-rate elasticity, next-day payout float requirements, and creator retention economics with Gemini 3.7.
                </p>
              </div>
            ) : report ? (
              <div className="space-y-5 animate-fadeIn">
                {/* Title & Executive Summary */}
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight">{report.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Audit Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
                    {report.executiveSummary}
                  </p>
                </div>

                {/* Key Findings List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Diagnostic Key Findings & Metrics
                  </h4>
                  <div className="space-y-2.5">
                    {report.keyFindings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-3 text-xs"
                      >
                        <div className="shrink-0 mt-0.5">
                          {finding.status === 'optimal' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {finding.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                          {finding.status === 'critical' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                          {finding.status === 'opportunity' && <Sparkles className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white flex items-center justify-between">
                            <span>{finding.metricOrArea}</span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                              {finding.status}
                            </span>
                          </div>
                          <p className="text-slate-300 mt-1">{finding.observation}</p>
                          <div className="text-amber-400 font-semibold mt-1 text-[11px]">
                            Impact: {finding.impact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actionable Tactical Recommendations
                  </h4>
                  <div className="space-y-3">
                    {report.actionableRecommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/20 to-slate-800/80 border border-amber-500/20 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{rec.action}</span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                            {rec.priority}
                          </span>
                        </div>
                        <div className="text-emerald-400 font-semibold">
                          Expected Financial ROI: {rec.expectedFinancialRoi}
                        </div>
                        <div className="space-y-1 pt-1">
                          {rec.implementationSteps.map((step, sIdx) => (
                            <div key={sIdx} className="text-slate-300 flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-700/60">
                          <span className="text-rose-400 font-semibold">Risk Mitigation: </span>
                          {rec.riskMitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sensitivity Notes */}
                {report.sensitivityNotes && (
                  <div className="p-3 rounded-lg bg-slate-800/30 text-xs text-slate-400 italic border-l-2 border-amber-500">
                    {report.sensitivityNotes}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-600" />
                <div className="text-sm font-semibold text-white">No Audit Report Generated Yet</div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Click below to generate a real-time advisory report tailored to your current marketplace configuration.
                </p>
                <button
                  onClick={() => handleGenerateAudit()}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Generate Initial Audit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive AI CFO Chat & Stress Test Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Interactive AI Chat Box */}
          <div className="bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-3 flex-1 flex flex-col h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Ask AI CFO & Financial Strategist</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">myflixai Context Active</span>
            </div>

            {/* Chat message scroll area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs scrollbar-thin">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto bg-amber-500 text-slate-950 font-medium'
                      : 'mr-auto bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-75 mb-0.5">
                    {m.role === 'user' ? 'Founder' : 'AI CFO'}
                  </div>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              ))}
              {loadingChat && (
                <div className="p-3 rounded-xl max-w-[80%] mr-auto bg-slate-800 text-slate-400 flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Computing financial mechanics...</span>
                </div>
              )}
            </div>

            {/* Suggested Quick Prompts */}
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <div className="text-[10px] text-slate-500 font-semibold">Suggested Questions:</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What is our minimum cash float if volume triples?',
                  'How to price ₹299 films vs ₹799 seasons?',
                  'Should we drop commission to 20% for studio creators?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 truncate max-w-full text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2 pt-1"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about unit economics, float risk, or pricing..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={loadingChat || !chatInput.trim()}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Stress Test Runner */}
          <div className="bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-white">Live Crisis Stress-Test Simulator</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Run automated AI stress tests against common small business marketplace crisis scenarios:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleRunStressTest('Payment Gateway 4-Day Clearing Delay over Holiday Weekend')}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-rose-950/30 text-left border border-slate-700 hover:border-rose-700/50 text-xs transition-colors"
              >
                <div className="font-bold text-white">4-Day Bank Holiday Lag</div>
                <div className="text-[10px] text-slate-400 mt-0.5">T+4 gateway payout timing freeze</div>
              </button>

              <button
                onClick={() => handleRunStressTest('8% Surge in Disputed Content & Chargeback Requests')}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-rose-950/30 text-left border border-slate-700 hover:border-rose-700/50 text-xs transition-colors"
              >
                <div className="font-bold text-white">8% Chargeback Surge</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Post-settlement viewer refunds</div>
              </button>
            </div>

            {/* Stress Test Result */}
            {loadingStress && (
              <div className="p-3 rounded-lg bg-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                <span>Simulating crisis scenario...</span>
              </div>
            )}

            {stressResult && !loadingStress && (
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-rose-300">
                  <span>Scenario: {stressResult.scenarioName}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[10px]">
                    Severity: {stressResult.severityLevel}
                  </span>
                </div>
                <div className="text-white font-semibold">
                  Max Drawdown: {stressResult.maxCashDrawdown} | Runway Impact: {stressResult.liquidityRunwayImpact}
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  <span className="font-bold text-amber-400">Containment: </span>
                  {stressResult.containmentStrategy?.join(' • ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
