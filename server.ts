import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "MyFlixAI Financial Intelligence",
    timestamp: new Date().toISOString(),
  });
});

// 2. Comprehensive AI Financial Audit & Insights
app.post("/api/financial-insights/ai-audit", async (req, res) => {
  try {
    const { category, currentMetrics, platformEconomics, pricingTiers } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the Principal Chief Financial Officer (CFO) and Marketplace Unit-Economics Strategist for "myflixai.com", a digital marketplace where independent creators publish and monetize AI-generated entertainment (AI feature films, series, seasons, episodes, sequels/prequels) with a central 30% commission engine and next-day creator settlement (T+1).

Your task is to analyze the operational and financial data provided, detect vulnerabilities, calculate unit economics, evaluate working capital & float risks, and output a highly actionable, structured strategic financial audit for the founder and small business leadership.

Always provide concrete numbers, percentages, realistic market analogies, and immediate tactical actions.`;

    const userPrompt = `Generate a rigorous financial advisory audit for category: "${category || 'executive_summary'}".

Current Marketplace Metrics:
- Base Commission: ${(platformEconomics?.baseCommissionRate * 100 || 30).toFixed(1)}%
- Payment Gateway Fee: ${platformEconomics?.paymentGatewayFeePercent || 2}% + ₹${platformEconomics?.paymentGatewayFixedFee || 3} fixed
- Next-Day Creator Settlement: Day 1 purchase -> Day 2 payout (${platformEconomics?.creatorPayoutDelayDays || 1} day delay)
- Payment Gateway Settlement Delay: ${platformEconomics?.gatewaySettlementDays || 2.5} days (Creates working capital float requirement)
- Refund Reserve Withholding: ${platformEconomics?.refundReservePercent || 5}%
- Monthly Fixed Opex: ₹${(
      Object.values(platformEconomics?.monthlyFixedOpex || {}).reduce((a: any, b: any) => Number(a) + Number(b), 0)
    ).toLocaleString()}
- Monthly Estimated GMV: ₹${Number(currentMetrics?.totalGmv || 3500000).toLocaleString()}
- Content Pricing Mix:
${(pricingTiers || []).map((t: any) => `  * ${t.name}: ₹${t.defaultPrice} (Est. ${t.estMonthlyVolume} units/mo)`).join('\n')}

Analyze:
1. Unit economics per transaction and aggregate margin health.
2. Next-Day Settlement liquidity risks (the spread between Day 1 creator payout and Day 2.5 PG collection).
3. Commission elasticity (the impact of shifting from 30% to 25% or 20% on creator acquisition vs platform EBITDA).
4. Concrete actionable recommendations for short-term and medium-term execution.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            keyFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metricOrArea: { type: Type.STRING },
                  status: { type: Type.STRING }, // 'optimal' | 'warning' | 'critical' | 'opportunity'
                  observation: { type: Type.STRING },
                  impact: { type: Type.STRING },
                },
                required: ["metricOrArea", "status", "observation", "impact"],
              },
            },
            actionableRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING },
                  action: { type: Type.STRING },
                  expectedFinancialRoi: { type: Type.STRING },
                  implementationSteps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  riskMitigation: { type: Type.STRING },
                },
                required: ["priority", "action", "expectedFinancialRoi", "implementationSteps", "riskMitigation"],
              },
            },
            sensitivityNotes: { type: Type.STRING },
          },
          required: ["title", "category", "executiveSummary", "keyFindings", "actionableRecommendations", "sensitivityNotes"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Audit error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI financial insights",
      fallback: getFallbackReport(req.body?.category),
    });
  }
});

// 3. Interactive AI Financial Advisory Chat
app.post("/api/financial-insights/chat", async (req, res) => {
  try {
    const { message, conversationHistory, contextData } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the AI Chief Financial Officer (CFO) and Venture Partner assisting the founder of myflixai.com (AI Entertainment Marketplace).
The business monetizes AI films, series, seasons, episodes, sequels/prequels with a default 30% commission and next-day (T+1) creator settlement.

Context Snapshot:
- Current Base Commission: ${(contextData?.commissionRate * 100 || 30)}%
- Average Film Price: ₹299 (Platform: ₹89.70, Creator: ₹209.30)
- Average Season Price: ₹799 (Platform: ₹239.70, Creator: ₹559.30)
- Episode Price: ₹49 (Platform: ₹14.70, Creator: ₹34.30)
- Current monthly GMV: ₹${Number(contextData?.monthlyGmv || 3500000).toLocaleString()}
- Cash Runway / Float Buffer: ₹${Number(contextData?.cashFloat || 750000).toLocaleString()}

Provide concise, analytical, highly actionable answers with exact mathematical breakdowns where appropriate. Use bullet points and bold key terms. Avoid fluff.`;

    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction: systemPrompt,
      },
    });

    // If history exists, feed previous context or send as prompt
    const fullPrompt = `${conversationHistory && conversationHistory.length > 0 ? `Previous Context:\n${conversationHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n')}\n\n` : ''}User Query: ${message}`;

    const response = await chat.sendMessage({
      message: fullPrompt,
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      reply: "I encountered an error calculating the financial projection. Please check if your environment has the GEMINI_API_KEY configured.",
    });
  }
});

// 4. Financial Stress Test Simulator
app.post("/api/financial-insights/stress-test", async (req, res) => {
  try {
    const { scenarioType, currentConfig } = req.body;
    const ai = getGeminiClient();

    const prompt = `Perform a high-stakes financial stress test for myflixai.com under the following scenario: "${scenarioType}".
Current Configuration:
- Commission: ${(currentConfig?.commissionRate * 100 || 30)}%
- Next-Day Settlement: Day 1 -> Day 2 payout
- Gateway Settlement: 2.5 days
- Monthly Fixed Opex: ₹1,95,000

Evaluate:
1. Working capital impact & liquidity drain
2. Profitability impact
3. Creator sentiment & churn risk
4. Immediate containment measures & preventive safeguards

Format response in JSON with scenarioName, severityLevel ('High' | 'Medium' | 'Critical'), maxCashDrawdown, liquidityRunwayImpact, and containmentStrategy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioName: { type: Type.STRING },
            severityLevel: { type: Type.STRING },
            maxCashDrawdown: { type: Type.STRING },
            liquidityRunwayImpact: { type: Type.STRING },
            primaryVulnerabilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            containmentStrategy: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            revisedPolicyRecommendation: { type: Type.STRING },
          },
          required: ["scenarioName", "severityLevel", "maxCashDrawdown", "liquidityRunwayImpact", "primaryVulnerabilities", "containmentStrategy", "revisedPolicyRecommendation"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Stress test simulation failed",
    });
  }
});

// Fallback generator in case of network or key quota issues
function getFallbackReport(category: string) {
  return {
    title: "MyFlixAI Core Financial & Working Capital Audit",
    category: category || "executive_summary",
    executiveSummary: "Analysis of the 30% take-rate and Next-Day (T+1) creator settlement model shows strong gross margins (88-92% of commission) but reveals a structural working capital float requirement caused by the 1.5-day timing mismatch between Day 2 creator disbursements and Day 3.5 payment gateway fund clearance.",
    keyFindings: [
      {
        metricOrArea: "30% Platform Take-Rate",
        status: "optimal",
        observation: "Provides a healthy ₹89.70 on ₹299 films and ₹239.70 on ₹799 seasons, comfortably absorbing the 2.0% + ₹3 payment gateway drag.",
        impact: "Generates ~27.2% net platform contribution margin per transaction after all variable fees."
      },
      {
        metricOrArea: "Next-Day Settlement Working Capital Float",
        status: "warning",
        observation: "Settling creators on Day 2 when payment gateways clear funds on Day 3.5 requires a rolling working capital float equal to ~2.5 days of gross creator volume.",
        impact: "At ₹35 Lakh monthly GMV, minimum required cash reserve float is ₹2,05,000 to prevent payout delays."
      },
      {
        metricOrArea: "Micro-transaction Unit Economics (₹49 Episodes)",
        status: "warning",
        observation: "On a ₹49 episode, the ₹3 fixed PG fee + 2% take ₹3.98, leaving only ₹10.72 platform profit (21.8% margin vs 27% on films).",
        impact: "Lower margin on low-ticket single episodes; bundles and season passes yield 3x higher capital efficiency."
      }
    ],
    actionableRecommendations: [
      {
        priority: "Immediate (Week 1-2)",
        action: "Establish a 5% Rolling Refund Reserve on Creator Settlements",
        expectedFinancialRoi: "Eliminates bad-debt chargeback leakage of ₹35,000–₹60,000/month",
        implementationSteps: [
          "Withhold 5% of gross earnings for 14 calendar days to absorb refund requests",
          "Auto-release remaining balance to creator wallet at day 15",
          "Update Creator Terms of Service as per Section 10 of Memorandum"
        ],
        riskMitigation: "Display clear reserve transparency in Creator Dashboard with countdown timer"
      },
      {
        priority: "Medium-Term (Month 1-3)",
        action: "Implement Tiered Dynamic Commission for Pro Studio Creators",
        expectedFinancialRoi: "Increases top creator retention by 40% while boosting overall GMV by 3.2x",
        implementationSteps: [
          "Maintain 30% baseline for standard creators",
          "Offer 25% take-rate for creators generating >₹2,00,000 monthly GMV",
          "Offer 20% for platform-exclusive cinematic universe debuts"
        ],
        riskMitigation: "Require 90-day platform exclusivity window for discounted take-rate"
      }
    ],
    sensitivityNotes: "Commission elasticity is non-linear: dropping from 30% to 20% requires a 50% increase in transaction volume to maintain identical gross platform cashflow."
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MyFlixAI Financial Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
