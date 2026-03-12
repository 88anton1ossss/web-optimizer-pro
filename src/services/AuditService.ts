import { GoogleGenAI } from "@google/genai";
import type { AuditData } from "../App";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// All current models (2.0+, 2.5+) require v1beta
const ai = new GoogleGenAI({ apiKey: API_KEY, httpOptions: { apiVersion: 'v1beta' } });

export class AuditService {
    /**
     * Fetches the HTML content of a website using a CORS proxy.
     */
    static async fetchWebsiteContent(url: string): Promise<string> {
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`
        ];

        let lastError = null;

        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl);
                if (!response.ok) continue;

                if (proxyUrl.includes('allorigins')) {
                    const data = await response.json();
                    if (data.contents) return data.contents;
                } else {
                    const text = await response.text();
                    if (text) return text;
                }
            } catch (error) {
                console.warn(`Proxy failed: ${proxyUrl}`, error);
                lastError = error;
            }
        }

        console.error("All CORS proxies failed:", lastError);
        throw new Error(
            "Could not reach this website. This usually happens if the site has strict Cloudflare protection, anti-bot firewalls, or if the URL is typed incorrectly.\n\n" +
            "How to fix this to run an audit:\n" +
            "1. Check if the URL is correct (e.g. including https://)\n" +
            "2. If it's your site, temporarily whitelist CORS/Scrapers.\n" +
            "3. Try scanning a different, less strictly protected page (like a blog post)."
        );
    }

    /**
     * Analyzes the website content using Gemini AI (Neural Engine v3).
     * Returns comprehensive audit data matching the AI Studio report format.
     */
    static async analyzeWebsite(url: string, html: string, plan: 'free' | 'pro' | 'enterprise', language: string = 'English'): Promise<AuditData> {
        const cleanHtml = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
            .substring(0, 25000);

        const prompt = `
WEB OPTIMIZER PRO — DEEP AUDIT PROTOCOL V2.0
TARGET URL: ${url}
HTML CONTENT FOR ANALYSIS:
${cleanHtml}

You are an elite SEO analyst. Perform a comprehensive website audit. Be DETERMINISTIC — produce the SAME scores for the same content every time. Base scores entirely on measurable technical criteria.

Analyze these 10 areas (return number based on plan):
1. Initial Site Overview (overall health, purpose, niche identification)
2. Technical SEO & Performance (Core Web Vitals, HTML structure, page speed, SSL)
3. AI Visibility (How ChatGPT/Gemini/Perplexity perceive this site)
4. Voice Search Readiness (conversational content, featured snippet eligibility)
5. User Intent & Conversion (CTA effectiveness, funnel optimization, UX)
6. Trust & Social Proof (reviews, testimonials, authority signals)
7. Local SEO (Google Business, geo-targeting, maps, NAP consistency)
8. Content Depth (readability, structure, engagement, content velocity)
9. Competitor Differentiation (unique value proposition, market positioning)
10. Scoring & ROI (revenue potential, traffic growth estimate)

RETURN ONLY VALID JSON (no markdown, no code blocks):
{
  "url": "${url}",
  "score": <integer 0-100>,
  "plan": "${plan}",
  "identifiedNiche": "Provide a highly specific and accurate micro-niche for targeting (e.g., 'High-End Cinematic Destination Wedding Videography')",
  "aiPerception": "A 2-3 sentence first-person AI perception of this site (what AI 'sees' when analyzing it)",
  "executiveBrief": "A 3-4 sentence executive summary of the overall audit findings",
  "quickWins": ["Quick win 1", "Quick win 2", "Quick win 3"],
  "trafficGain": "Estimated traffic gain (e.g. '+40% Organic Search Traffic')",
  "leadIncrease": "Estimated lead increase (e.g. '1.5x Monthly Inquiries')",
  "revenueProjection": "Revenue projection (e.g. '$10k-25k/mo additional booking potential')",
  "sections": [
    {
      "id": "slug-here",
      "title": "Section Title",
      "score": <integer 0-100>,
      "status": "excellent" | "good" | "needs-improvement" | "critical",
      "summary": "Detailed technical summary",
      "details": ["Finding 1", "Finding 2", "Finding 3"],
      "recommendations": ["Action 1", "Action 2", "Action 3"]
    }
  ],
  "keywords": ["<Highly specific long-tail buyer-intent keyword 1>", "<Profitable search phrase 2>", "<Geo-targeted service keyword 3>", "<Competitor alternative keyword 4>", "keyword 5", "keyword 6", "keyword 7", "keyword 8", "keyword 9", "keyword 10", "keyword 11", "keyword 12"],
  "ads": [
    {
      "headlines": [
        "Create high-converting headline 1 (max 30 chars)",
        "Headline 2",
        "Headline 3",
        "Headline 4",
        "Headline 5",
        "Headline 6",
        "Headline 7",
        "Headline 8"
      ],
      "descriptions": [
        "Benefit-driven description 1 (max 90 chars)",
        "Description 2",
        "Description 3",
        "Description 4"
      ],
      "type": "search",
      "sitelinks": ["Specific Service Link", "Pricing Info", "Contact Us", "Testimonials"]
    }
  ],
  "campaignStrategy": [
    "Budget Split: Specify exactly how to distribute budget across Search vs Display vs Retargeting",
    "Bidding Strategy: Recommend specific bidding (e.g., Target CPA vs Maximize Clicks)",
    "Match Types: Specify exact/phrase match recommendations for top keywords",
    "Negative Keywords: List 3-5 specific negative keywords to prevent wasted spend"
  ],
  "targetAudience": [
    "Demographics: Detailed breakdown (Age, Gender, Location, Income)",
    "Psychographics: Interests, values, lifestyle",
    "Pain Points: Primary problems this audience faces",
    "Buying Triggers: What motivates them to finally convert"
  ],
  "actionPlan": [
    {
      "phase": "Immediate Triage (Days 1-3)",
      "focus": "Fixing critical technical roadblocks blocking indexation or conversions.",
      "tasks": [
        "Highly specific, actionable step based EXACTLY on the weakest point found in the audit.",
        "Clear instruction 2"
      ]
    },
    {
      "phase": "Mid-Term Injection (Days 4-14)",
      "focus": "Addressing content gaps and structural UX issues.",
      "tasks": [
        "Instruction 1",
        "Instruction 2"
      ]
    },
    {
      "phase": "Long-Term Dominance (Days 15-30)",
      "focus": "Scaling traffic and reinforcing authority.",
      "tasks": [
        "Instruction 1",
        "Instruction 2"
      ]
    }
  ]
}

CRITICAL: THE ENTIRE OUTPUT MUST BE TRANSLATED INTO AND WRITTEN IN THIS LANGUAGE: ${language}. If the language is not English, translate all titles, summaries, recommendations, keywords, and ad copies to ${language}.

RULES:
- free plan: return 3 sections only
- pro plan: return 7 sections
- enterprise plan: return all 10 sections
- Be DETERMINISTIC: same HTML = same scores (don't randomize)
- All scores must be integers, NOT strings
- actionPlan: Must contain EXACTLY 3 phases. The tasks MUST NOT BE GENERIC (like "Setup Analytics"). They must specifically reference weaknesses or missing elements found in the actual HTML of the audited site.
- keywords: return top 10 highly profitable keywords + top 10 specific key phrases (mix of long-tail and geo-targeted). The keywords MUST be highly relevant to the SPECIFIC LOCATION/MARKET of the audited website. Return exactly 20 items.
- ads: return 4 highly professional, high-converting Google Ads (2 search, 2 display) with 4 realistic sitelinks each. Base these on Google Trends and Google Ads best practices. For search ads, generate exactly 8 distinct headlines and 4 distinct descriptions for RSA (Responsive Search Ads) format.
- campaignStrategy: return exactly 4 highly detailed and actionable PPC strategy steps covering Budget, Bidding, Match Types, and Negative Keywords.
- targetAudience: return exactly 4 deeply researched audience personas covering Demographics, Psychographics, Pain Points, and Buying Triggers.
`;

        const fallbackModels = [
            "gemini-2.0-flash", // Using 2.0-flash as primary for better logic/reasoning
            "gemini-2.5-flash",
            "gemini-2.0-flash-lite",
            "gemini-flash-latest"
        ];

        let lastError: any = null;

        for (const modelName of fallbackModels) {
            try {
                console.log(`Neural Engine: Attempting ${modelName}...`);
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                    config: { temperature: 0.0, topP: 0.1, topK: 1 } // Strictly deterministic
                });

                let text = response.text ?? "";
                console.log(`Neural Engine: Protocol established via ${modelName}`);

                text = text.replace(/```json/g, "").replace(/```/g, "").trim();

                try {
                    const audit = JSON.parse(text) as AuditData;
                    audit.id = Date.now().toString();
                    audit.date = new Date().toISOString();
                    audit.status = 'completed';
                    return audit;
                } catch {
                    const match = text.match(/\{[\s\S]*\}/);
                    if (match) {
                        const audit = JSON.parse(match[0]) as AuditData;
                        audit.id = Date.now().toString();
                        audit.date = new Date().toISOString();
                        audit.status = 'completed';
                        return audit;
                    }
                    throw new Error("Neural Engine: Could not parse AI response.");
                }
            } catch (error: any) {
                console.warn(`Neural Engine failure on ${modelName}:`, error.message);
                lastError = error;
            }
        }

        console.error("Neural Engine Total Protocol Failure:", lastError);
        throw new Error(`Neural Engine failure: ${lastError?.message || "Quota exceeded across all models. Check API key."}`);
    }

    /**
     * Chat with the AI about the audit data.
     */
    static async chatWithAudit(message: string, auditContext: string): Promise<string> {
        const fallbackModels = ["gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
        let lastError: any = null;

        for (const modelName of fallbackModels) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: `You are an elite, professional advertiser, targetologist, SEO auditor, and ad account setup expert. You act as a creative assistant helping the user implement the data from the report into their website and ad accounts for maximum profit. Reply in the user's inferred language. You have access to this website audit data:\n\n${auditContext}\n\nUser question: ${message}\n\nProvide a concise, expert, and actionable answer in 2-4 sentences max. Help them easily implement this.`,
                });
                return response.text ?? "Protocol timeout. Please try again.";
            } catch (error: any) {
                console.warn(`Chat model ${modelName} failed`, error.message);
                lastError = error;
                // If it's a 429 quota error, we should tell the user immediately or try the next model. Next model might share quota, but it's worth trying.
            }
        }

        if (lastError?.status === 429 || lastError?.message?.includes('429') || lastError?.message?.includes('quota')) {
            return `Protocol Error (429): Google Gemini API quota exceeded for the free tier. Please wait about 60 seconds before sending another request, or check your API billing plan.`;
        }

        return `Protocol error: ${lastError?.message || "All models failed. Free tier quota may be exhausted."}`;
    }
}
