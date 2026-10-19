export type CopilotMode = "copilot" | "audit" | "codex";

export interface TradeDiagnostic {
  tradeId: string;
  assetName: string;
  counterparty: string;
  counterpartyLevel?: number;
  steamId64: string;
  escrowStatus: string;
  isVerified: boolean;
  floatValue?: string;
  checks: string[];
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tag?: string;
  diagnostic?: TradeDiagnostic;
}

export interface CopilotConfig {
  model: string;
  availableModels: string[];
  latencyMs: number;
}
