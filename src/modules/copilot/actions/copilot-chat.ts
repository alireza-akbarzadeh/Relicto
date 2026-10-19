"use server";

import { GoogleGenAI } from "@google/genai";
import { SENTINEL_SYSTEM_INSTRUCTION } from "../data/copilot-knowledge";
import { resolveSentinelLocalKnowledge } from "../data/copilot-resolver";
import type { TradeDiagnostic } from "../types";

export interface SendChatMessageInput {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  modelOverride?: string;
}

export interface SendChatMessageOutput {
  success: boolean;
  reply: string;
  diagnostic?: TradeDiagnostic;
  modelUsed: string;
  latencyMs: number;
  error?: string;
}

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

export async function sendChatMessageAction(
  input: SendChatMessageInput
): Promise<SendChatMessageOutput> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMENI_API_KEY || "";

  let model = input.modelOverride || process.env.GEMINI_MODEL || "gemini-3.8-flash";
  if (model.includes("2.5") || model.includes("2.0") || model.includes("1.5")) {
    model = "gemini-3.8-flash";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents = (input.history ?? []).slice(-8).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: input.message }],
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

    return {
      success: true,
      reply: cleanText,
      diagnostic,
      modelUsed: model,
      latencyMs,
    };
  } catch (error: any) {
    console.warn("[sendChatMessageAction] Fallback to local codex:", error?.message || error);
    const latencyMs = Date.now() - startTime;
    const resolved = resolveSentinelLocalKnowledge(input.message);

    return {
      success: true,
      reply: resolved.reply,
      diagnostic: resolved.diagnostic,
      modelUsed: resolved.modelUsed,
      latencyMs,
    };
  }
}
