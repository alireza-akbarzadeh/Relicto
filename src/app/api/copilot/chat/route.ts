import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SENTINEL_SYSTEM_INSTRUCTION } from "@/modules/copilot/data/copilot-knowledge";
import { resolveSentinelLocalKnowledge } from "@/modules/copilot/data/copilot-resolver";
import {
  checkAiRateLimit,
  getCachedAiResponse,
  setCachedAiResponse,
} from "@/modules/copilot/lib/copilot-rate-limit";
import type { TradeDiagnostic } from "@/modules/copilot/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDiagnosticBlock(text: string): { cleanText: string; diagnostic?: TradeDiagnostic } {
  const match = text.match(/```diagnostic\s*([\s\S]*?)\s*```/);
  if (!match) return { cleanText: text };

  try {
    const rawJson = match[1].trim();
    const diagnostic = JSON.parse(rawJson) as TradeDiagnostic;
    const cleanText = text.replace(/```diagnostic[\s\S]*?```/, "").trim();
    return { cleanText, diagnostic };
  } catch {
    return { cleanText: text };
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let userMessage = "";

  try {
    const body = await req.json();
    const { message, history = [], modelOverride } = body;
    userMessage = typeof message === "string" ? message : "";

    if (!userMessage.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Check TTL cache first (0 Gemini API cost!)
    const cached = getCachedAiResponse(userMessage);
    if (cached) {
      return NextResponse.json({
        success: true,
        reply: cached.reply,
        diagnostic: cached.diagnostic,
        modelUsed: cached.modelUsed,
        latencyMs: Date.now() - startTime,
        fromCache: true,
      });
    }

    // 2. Client IP Rate Limiting Check
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rate = checkAiRateLimit(clientIp);
    if (!rate.allowed) {
      const fallback = resolveSentinelLocalKnowledge(userMessage);
      return NextResponse.json(
        {
          success: true,
          rateLimited: true,
          reply: `⚠️ Rate limit: ${rate.reason}\n\n${fallback.reply}`,
          diagnostic: fallback.diagnostic,
          modelUsed: `${fallback.modelUsed} (Throttled)`,
          retryAfter: rate.retryAfterSeconds,
          latencyMs: Date.now() - startTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
            "X-RateLimit-Limit": "6",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rate.resetSeconds),
          },
        }
      );
    }

    // 3. Make Gemini API Call
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMENI_API_KEY || "";
    let model = modelOverride || process.env.GEMINI_MODEL || "gemini-3.8-flash";
    if (model.includes("2.5") || model.includes("2.0") || model.includes("1.5")) {
      model = "gemini-3.8-flash";
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = (history || []).slice(-8).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini Gateway Timeout (8500ms)")), 8500)
    );

    const generatePromise = ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SENTINEL_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const latencyMs = Date.now() - startTime;
    const rawText = response.text || "Diagnostic analysis complete. No threats detected.";
    const { cleanText, diagnostic } = parseDiagnosticBlock(rawText);

    // Save in cache to eliminate repeat API costs
    setCachedAiResponse(userMessage, cleanText, model, diagnostic);

    return NextResponse.json(
      {
        success: true,
        reply: cleanText,
        diagnostic,
        modelUsed: model,
        latencyMs,
      },
      {
        headers: {
          "X-RateLimit-Limit": "6",
          "X-RateLimit-Remaining": String(rate.remaining),
          "X-RateLimit-Reset": String(rate.resetSeconds),
        },
      }
    );
  } catch (error: unknown) {
    console.warn("[Copilot API Route] Fallback to local codex:", error instanceof Error ? error.message : error);
    const latencyMs = Date.now() - startTime;
    const resolved = resolveSentinelLocalKnowledge(userMessage);

    return NextResponse.json({
      success: true,
      reply: resolved.reply,
      diagnostic: resolved.diagnostic,
      modelUsed: resolved.modelUsed,
      latencyMs,
    });
  }
}
