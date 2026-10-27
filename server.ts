import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Server-side Gemini initialization with telemetry header
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
  });

  app.post('/api/gemini/copilot', async (req, res) => {
    const { prompt, context } = req.body;

    if (!ai) {
      return res.json({
        liveAvailable: false,
        message: 'No server-side Gemini API key configured.',
      });
    }

    try {
      const systemInstruction = `You are Synthetix Copilot, an elite enterprise Procurement & Strategic Sourcing AI.
Your job is to provide crisp, highly structured, data-grounded procurement advice.
When evaluating bids: focus on total cost of ownership (TCO), supplier ESG rating, lead time disruption penalties, and contract terms.
When evaluating POs: strictly enforce SOX delegations, single-source thresholds ($250,000+ requires Form CS-8 Sole-Source waiver), and payment term optimizations.
Keep responses concise, executive-ready, and formatted with clean Markdown headings and bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Context:
Active RFQs: ${JSON.stringify(
          (context?.rfqs || []).map((r: any) => ({
            id: r.rfqNumber,
            title: r.title,
            budget: r.budget,
            bidsReceived: r.bidsReceivedCount,
            status: r.status,
          }))
        )}
Active Purchase Orders: ${JSON.stringify(
          (context?.pos || []).map((p: any) => ({
            id: p.poNumber,
            amount: p.amount,
            status: p.status,
            vendor: p.vendorName,
            warning: p.complianceWarning,
          }))
        )}
Current Selected RFQ: ${JSON.stringify(context?.activeRfq || null)}
Current Active Bids: ${JSON.stringify(
          (context?.bids || []).map((b: any) => ({
            rfqId: b.rfqId,
            vendor: b.vendorName,
            price: b.unitPriceTotal,
            leadWeeks: b.leadTimeWeeks,
            score: b.aiRecommendationScore,
            risk: b.riskLevel,
          }))
        )}

User Request: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';

      return res.json({
        liveAvailable: true,
        content: responseText,
        citations: [
          'Google Gemini 3.8 Flash (Enterprise Engine)',
          'SOX Procurement Delegations Register 2025',
          'Synthetix Supplier ESG Intelligence Index',
        ],
      });
    } catch (err: any) {
      console.error('Server-side Gemini generation error:', err);
      return res.json({
        liveAvailable: false,
        error: err?.message || 'Model inference failed',
      });
    }
  });

  // Serve Vite in development or static dist in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Procurement Hub Server running at http://localhost:${PORT}`);
  });
}

startServer();
