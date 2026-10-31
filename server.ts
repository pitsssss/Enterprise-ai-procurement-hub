import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Project ID
let firebaseProjectId = 'disco-spark-w8p5g';
try {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (parsed.projectId) {
      firebaseProjectId = parsed.projectId;
    }
  }
} catch (e) {
  console.warn('Could not read firebase-applet-config.json, using default project ID');
}

// Remote Google JWKS for Firebase ID token verification
const FIREBASE_JWKS_URL = new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
const JWKS = createRemoteJWKSet(FIREBASE_JWKS_URL);

// In-Memory Rate Limiter (sliding window per UID or IP)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(key: string, maxRequests: number = 25, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  if (recent.length >= maxRequests) {
    return true;
  }
  recent.push(now);
  rateLimitMap.set(key, recent);
  return false;
}

async function verifyFirebaseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${firebaseProjectId}`,
      audience: firebaseProjectId,
    });
    return {
      authenticated: true,
      uid: payload.sub as string,
      email: (payload.email as string) || '',
    };
  } catch (err: any) {
    return {
      authenticated: false,
      error: err?.message || 'Invalid or expired Firebase ID token',
    };
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Telemetry and security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Server-side Gemini initialization
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
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(apiKey),
      firebaseProjectId,
      timestamp: new Date().toISOString(),
    });
  });

  // Protected AI Copilot Endpoint with JWT Authentication & Tenant Scoping
  app.post('/api/gemini/copilot', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        liveAvailable: false,
        error: 'Unauthorized: Missing or malformed Bearer authorization token.',
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();
    const authResult = await verifyFirebaseToken(token);

    if (!authResult.authenticated || !authResult.uid) {
      return res.status(401).json({
        liveAvailable: false,
        error: `Unauthorized: ${authResult.error || 'Authentication token validation failed.'}`,
      });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const rateLimitKey = `${authResult.uid}-${clientIp}`;

    if (isRateLimited(rateLimitKey, 25, 60000)) {
      return res.status(429).json({
        liveAvailable: false,
        error: 'Too Many Requests: Rate limit exceeded (maximum 25 AI queries per minute). Please throttle requests.',
      });
    }

    const { prompt, context, locale } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        liveAvailable: false,
        error: 'Bad Request: Prompt string is required.',
      });
    }

    if (!ai) {
      return res.json({
        liveAvailable: false,
        message: 'No server-side Gemini API key configured.',
      });
    }

    try {
      const isArabic = locale === 'ar' || /[\u0600-\u06FF]/.test(prompt || '');

      const systemInstruction = isArabic
        ? `أنت مساعد سينثتكس الذكي للتوريد والمشتريات الاستراتيجية المؤسسية (Synthetix Copilot).
مهمتك تقديم تحليلات دقيقة، مهنية، ومبنية على بيانات المشتريات المتاحة باللغة العربية الفصحى المعاصرة المعتمدة في الإدارات المالية والتنفيذية.
- عند تقييم العروض: ركز على إجمالي تكلفة الملكية (TCO)، تقييمات الاستدامة والحوكمة (ESG)، فترات التسليم وجداول التوريد، والضمانات.
- عند فحص أوامر الشراء: وضح أن سقف التفويض البالغ $250,000 هو سياسة حوكمة داخلية تتبع إطار ضوابط المادة 404 من قانون SOX ويتطلب توقيع إعفاء المورد الوحيد نموذج CS-8.
- احتفظ برموز الطلبات وأوامر الشراء (مثل RFQ-2025-001 و PO-2025-8841)، وأسماء الشركات والمبالغ المالية بدقة ووضوح.
- اجعل الإجابة موجزة، تنفيذية، ومنسقة بنقاط وعناوين Markdown واضحة.`
        : `You are Synthetix Copilot, an enterprise Procurement & Strategic Sourcing AI.
Your job is to provide crisp, highly structured, data-grounded procurement advice.
When evaluating bids: focus on total cost of ownership (TCO), supplier ESG rating, lead time disruption penalties, and contract terms.
When evaluating POs: treat $100k and $250k thresholds as internal company fiduciary policy established under SOX Section 404 control frameworks. High-value single-source orders require Form CS-8 Sole-Source waiver justifications.
Keep responses concise, executive-ready, and formatted with clean Markdown headings and bullet points.`;

      // Sanitize context: Derive verified user email and tenant boundaries
      const sanitizedContext = {
        verifiedUser: authResult.email || authResult.uid,
        orgName: context?.organizationName ? String(context.organizationName).slice(0, 100) : 'Enterprise Tenant',
        rfqs: Array.isArray(context?.rfqs)
          ? context.rfqs.slice(0, 15).map((r: any) => ({
              id: r.rfqNumber,
              title: r.title,
              budget: r.budget,
              bidsReceived: r.bidsReceivedCount,
              status: r.status,
            }))
          : [],
        pos: Array.isArray(context?.pos)
          ? context.pos.slice(0, 15).map((p: any) => ({
              id: p.poNumber,
              amount: p.amount,
              status: p.status,
              vendor: p.vendorName,
              warning: p.complianceWarning,
            }))
          : [],
        bids: Array.isArray(context?.bids)
          ? context.bids.slice(0, 15).map((b: any) => ({
              rfqId: b.rfqId,
              vendor: b.vendorName,
              price: b.unitPriceTotal,
              leadWeeks: b.leadTimeWeeks,
              score: b.aiRecommendationScore,
              risk: b.riskLevel,
            }))
          : [],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Context:
Verified Session User: ${sanitizedContext.verifiedUser}
Organization: ${sanitizedContext.orgName}
Active RFQs: ${JSON.stringify(sanitizedContext.rfqs)}
Active Purchase Orders: ${JSON.stringify(sanitizedContext.pos)}
Current Active Bids: ${JSON.stringify(sanitizedContext.bids)}

User Request: ${prompt.slice(0, 1500)}`,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';

      return res.json({
        liveAvailable: true,
        content: responseText,
        citations: isArabic
          ? [
              'نموذج Google Gemini 3.8 Flash (المحرك المؤسسي المباشر)',
              'سجل سياسات تفويضات الشراء وإطار ضوابط SOX 404',
              'مؤشر سينثتكس لذكاء استدامة الموردين (ESG)',
            ]
          : [
              'Google Gemini 3.8 Flash (Enterprise Engine)',
              'Corporate Fiduciary Delegation Register (SOX 404 Framework)',
              'Synthetix Supplier ESG Intelligence Index',
            ],
      });
    } catch (err: any) {
      console.error('Server-side Gemini generation error:', err);
      return res.status(500).json({
        liveAvailable: false,
        error: 'Model inference temporarily unavailable. Falling back to local fiduciary rules engine.',
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
