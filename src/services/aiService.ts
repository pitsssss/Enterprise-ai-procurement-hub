import { ChatMessage, RFQ, PurchaseOrder, VendorBid } from '../types/procurement';

export interface AssistantContext {
  activeRfq?: RFQ | null;
  rfqs: RFQ[];
  pos: PurchaseOrder[];
  bids: VendorBid[];
}

export class ProcurementAIService {
  public static async queryAssistant(
    prompt: string,
    context: AssistantContext,
    preferLiveModel: boolean = true,
    locale: string = 'en'
  ): Promise<Omit<ChatMessage, 'id' | 'timestamp'>> {
    const isArabic = locale === 'ar' || /[\u0600-\u06FF]/.test(prompt || '');

    // 1. Attempt Server-Side Gemini API call via secure proxy route
    if (preferLiveModel) {
      try {
        const response = await fetch('/api/gemini/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, context, locale: isArabic ? 'ar' : 'en' }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.liveAvailable && data?.content) {
            // Check if we should attach contextual suggested actions
            let suggestedAction: ChatMessage['suggestedAction'] = undefined;
            const lowerPrompt = prompt.toLowerCase();
            if (lowerPrompt.includes('compare') || lowerPrompt.includes('bid') || lowerPrompt.includes('matrix')) {
              suggestedAction = {
                label: 'Open Vendor Comparison Matrix',
                actionType: 'OPEN_COMPARISON',
                payload: context.activeRfq?.id || 'rfq-101',
              };
            } else if (lowerPrompt.includes('flag') || lowerPrompt.includes('audit') || lowerPrompt.includes('po')) {
              suggestedAction = {
                label: 'Inspect Flagged PO Ledger',
                actionType: 'NAVIGATE_TAB',
                payload: 'pos',
              };
            }

            return {
              sender: 'assistant',
              mode: 'GEMINI_LIVE',
              content: data.content,
              citations: data.citations || [
                'Google Gemini 3.8 Flash (Server Enterprise Model)',
                'SOX Delegations Register 2025',
              ],
              suggestedAction,
            };
          }
        }
      } catch (err) {
        console.warn('Server proxy unavailable, switching to local governance engine:', err);
      }
    }

    // 2. High-Fidelity Local AI Reasoning Simulation
    await new Promise((res) => setTimeout(res, 500));
    const lower = prompt.toLowerCase();

    if (
      lower.includes('compare') ||
      lower.includes('bid') ||
      lower.includes('matrix') ||
      lower.includes('h200') ||
      lower.includes('rfq-2025-0891') ||
      lower.includes('مقارنة') ||
      lower.includes('عروض') ||
      lower.includes('مصفوفة')
    ) {
      if (isArabic) {
        return {
          sender: 'assistant',
          mode: 'SIMULATED_PRESET',
          content: `### ⚖️ تحليل المفاضلة بين عروض الموردين (RFQ-2025-0891)

**1. شركة Apex للبنى التحتية — الترسية الموصى بها (التقييم: 95/100)**
- **السعر الإجمالي:** $388,500 (يوفر $31,500 مقارنة بسقف الميزانية المعتمدة $420,000).
- **جدول التوريد:** تسليم خلال 4 أسابيع يلبي متطلبات الربع الثاني دون غرامات تأخير.
- **الحوكمة وESG:** مورد مصنف فئة أولى (Tier-1) مع تقييم 92/100 ونسبة التزام 99.4%.

**2. شركة HyperScale Grid Tech — مخاطر تأخير التوريد (التقييم: 81/100)**
- **السعر الإجمالي:** $365,000 (أرخص بمقدار $23,500 مبدئياً عن Apex).
- **عامل المخاطرة:** مدة الشحن (9 أسابيع) تسبب تكاليف تعطل عمالة تقدر بـ **$42,000**، مما يلغي ميزة الخصم.

**3. شركة Synapse Server Works GmbH — خيار الضمان الممتد (التقييم: 79/100)**
- **السعر الإجمالي:** $412,000 (قريب من الحد الأقصى للميزانية؛ يوفر أطول فترة ضمان 48 شهراً).

**توصية المساعد الذكي:** المضي قدماً مع **Apex Data Infrastructures** مع إمكانية تقديم عرض مضاد بسعر $378,000.`,
          citations: [
            'دليل التوريد الاستراتيجي المؤسسي §4.2',
            'قاعدة بيانات التزامات الموردين الفئة الأولى',
            'تحليلات الإنفاق لفئات التوريد 2025',
          ],
          suggestedAction: {
            label: 'فتح مصفوفة مقارنة الموردين',
            actionType: 'OPEN_COMPARISON',
            payload: 'rfq-101',
          },
        };
      }

      return {
        sender: 'assistant',
        mode: 'SIMULATED_PRESET',
        content: `### ⚖️ Multi-Vendor Bid Trade-Off Analysis (RFQ-2025-0891)

**1. Apex Data Infrastructures — Recommended Award (Score: 95/100)**
- **Price:** $388,500 ($31,500 below internal budget ceiling of $420k).
- **Schedule:** 4-week lead time fulfills Q2 Milestone 3 requirements without penalties.
- **ESG & Risk:** Tier-1 OEM status with a 92/100 ESG rating and 99.4% SLA adherence.

**2. HyperScale Grid Tech — High Schedule Risk (Score: 81/100)**
- **Price:** $365,000 (Saves $23,500 upfront over Apex).
- **Risk Factor:** 9-week shipping introduces an estimated **$42,000 in idle labor downstream costs**, offsetting the initial purchase discount.

**3. Synapse Server Works GmbH — Premium Buffer (Score: 79/100)**
- **Price:** $412,000 (Near maximum cap; longest 48-month warranty).

**AI Recommendation:** Proceed with **Apex Data Infrastructures** and initiate a counter-offer targeting $378,000.`,
        citations: [
          'Corp Strategic Sourcing Manual §4.2',
          'OEM SLA Tier-1 Database',
          'Category Spend Analytics 2025',
        ],
        suggestedAction: {
          label: 'Open Vendor Comparison Matrix',
          actionType: 'OPEN_COMPARISON',
          payload: 'rfq-101',
        },
      };
    }

    if (
      lower.includes('flag') ||
      lower.includes('compliance') ||
      lower.includes('po-2025-10493') ||
      lower.includes('audit') ||
      lower.includes('sox')
    ) {
      return {
        sender: 'assistant',
        mode: 'SIMULATED_PRESET',
        content: `### 🚨 PO Compliance Exception: PO-2025-10493

- **Vendor:** Global Silicon Wafer Corp
- **Committed Amount:** $512,000 USD
- **Policy Violation:** Corporate Policy §11.4 limits single-source purchase approvals to **$250,000** without a Legal Exemption Certificate (Form CS-8).
- **Risk Level:** Vendor is currently on **PROBATIONARY** status with an 82.5% on-time delivery rate.

**Remediation Action Path:**
1. Generate and attach **Form CS-8 Sole-Source justification** signed by Group Legal, or
2. Trigger an immediate 3-way competitive mini-bid to restore dual-sourcing compliance.`,
        citations: [
          'Corporate Governance & SOX Delegations Manual p. 52',
          'Supplier Risk Registry Q1-2025',
        ],
        suggestedAction: {
          label: 'Inspect Flagged PO Ledger',
          actionType: 'NAVIGATE_TAB',
          payload: 'pos',
        },
      };
    }

    if (lower.includes('saving') || lower.includes('spend') || lower.includes('cost') || lower.includes('benchmark')) {
      return {
        sender: 'assistant',
        mode: 'SIMULATED_PRESET',
        content: `### 📈 Sourcing Performance & Savings Intelligence (YTD)

- **Negotiated Realized Savings:** **$148,200 USD** (12.4% avg reduction across closed RFQs).
- **Immediate Opportunity:** Titanium Fasteners (RFQ-2025-0892) is currently quoting at $92,000 (8.2% over budget baseline). Consolidating volume with AeroPrecision Alloys can recoup ~$8,500 under annual Tier-1 rebate terms.
- **Contract Coverage:** 78% of active spend is under master service agreements (MSAs).`,
        citations: ['Price Intelligence Index v3', 'Global Material Index 2025'],
      };
    }

    if (lower.includes('draft') || lower.includes('counter') || lower.includes('378,000')) {
      return {
        sender: 'assistant',
        mode: 'SIMULATED_PRESET',
        content: `### 📝 Counter-Offer Proposal Drafted: Apex Data

**Subject:** Re: RFQ-2025-0891 Proposal Commercials Optimization
**Target Amount:** $378,000 USD (Net 45 payment terms)

*Dear Apex Commercial Team,*

Thank you for your comprehensive bid submission on RFQ-2025-0891 (Quote QU-APX-8821). We value our Tier-1 strategic partnership and high confidence in your 4-week delivery window.

To finalize commitment today, our steering committee has approved a baseline counter of **$378,000 USD**, matching corporate hardware allocation thresholds for Q2. All standard 36-month enterprise warranty stipulations remain in effect.

Please confirm acceptance to issue immediate purchase order dispatch.`,
        citations: ['Enterprise Negotiation Framework v2', 'Commercial Terms Standard Net 45'],
      };
    }

    if (lower.includes('create') || lower.includes('spec') || lower.includes('feasibility')) {
      return {
        sender: 'assistant',
        mode: 'SIMULATED_PRESET',
        content: `### 📝 Line-Item Technical Feasibility Audit

**Inspection Target:** ${context.activeRfq?.rfqNumber || 'RFQ-2025-0891'}
- **Spec Verification:** All SKUs conform to Open19 / OCP rack standards and PCIe Gen 5 topologies.
- **Supply Availability:** Lead time standard for H200 SXM5 units is 4–6 weeks globally; 3 Tier-1 vendors hold valid warehouse stock allocations.
- **Budget Realism:** Current $420,000 budget allows a healthy 7.5% safety margin against spot prices.`,
        citations: ['OCP Hardware Standards', 'Global Supply Chain Index Q1-2025'],
      };
    }

    if (isArabic) {
      return {
        sender: 'assistant',
        mode: 'SIMULATED_PRESET',
        content: `تم فحص مساحة عمل التوريد الخاصة بك بنجاح: **${context.rfqs.length} طلبات عروض أسعار نشطة**، و**${context.pos.length} أوامر شراء**، وسجلات الموردين المعتمدين.

إليك أبرز الإجراءات التي يمكنك تنفيذها الآن:
• **"مقارنة عروض طلب RFQ-2025-0891"** — مفاضلة مواعيد التسليم مقابل الأسعار
• **"تدقيق تعليق أمر الشراء PO-2025-10493"** — فحص موانع صلاحيات SOX
• **"عرض وفورات التكلفة وتحليلات الإنفاق"** — مراجعة الفروق عن الميزانية
• **"صياغة عرض مضاد لشركة Apex Data"** — تجهيز خطابات التفاوض التجاري`,
        citations: ['فهرس التوريد المؤسسي الذكي v4.2'],
      };
    }

    return {
      sender: 'assistant',
      mode: 'SIMULATED_PRESET',
      content: `I have scanned your current procurement workspace: **${context.rfqs.length} active RFQs**, **${context.pos.length} purchase orders**, and supplier master directories. 

Here are top actions you can run right now:
• **"Compare bids for RFQ-2025-0891"** — evaluate lead time vs price trade-offs
• **"Audit PO-2025-10493 compliance flag"** — view SOX delegation blockers
• **"Show cost savings and price benchmarking"** — inspect realized budget variances
• **"Draft a counter-offer for Apex Data"** — generate supplier negotiation letters`,
      citations: ['Enterprise Sourcing Core Index v4.2'],
    };
  }
}
