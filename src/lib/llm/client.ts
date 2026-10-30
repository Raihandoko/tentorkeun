export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  json?: boolean;
}

export interface LLMClient {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>;
}

export interface LLMConfig {
  baseUrl: string;
  apiKey: string | undefined;
  model: string;
}

export function llmConfig(): LLMConfig {
  const key =
    process.env.LLM_API_KEY ?? process.env.OPENAI_API_KEY ?? undefined;
  return {
    baseUrl: process.env.LLM_BASE_URL ?? "https://api.openai.com/v1",
    apiKey: key,
    model: process.env.LLM_MODEL ?? (key ? "gpt-4o-mini" : "mock"),
  };
}

/** True bila API key tersedia sehingga LLM sungguhan dipakai. */
export function llmEnabled(): boolean {
  return Boolean(
    process.env.LLM_API_KEY ?? process.env.OPENAI_API_KEY,
  );
}