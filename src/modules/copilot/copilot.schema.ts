import { z } from "zod";

export const ALLOWED_COPILOT_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
] as const;

export const copilotChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

export const copilotChatInputSchema = z
  .object({
    message: z.string().trim().min(1, "Message is required").max(2000, "Message exceeds 2000 characters"),
    history: z.array(copilotChatMessageSchema).max(20).optional().default([]),
    modelOverride: z.enum(ALLOWED_COPILOT_MODELS).optional(),
  })
  .strict();

export type CopilotChatInput = z.infer<typeof copilotChatInputSchema>;

