import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type ProviderType = "openai" | "anthropic" | "google";

export const getDefaultProvider = (): ProviderType => {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || "openai";
  if (provider === "openai" || provider === "anthropic" || provider === "google") {
    return provider;
  }
  return "openai";
};

export const createOpenAIProvider = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return openai;
};

export const createAnthropicProvider = () => {
  // For future implementation when @ai-sdk/anthropic is added
  throw new Error("Anthropic provider not yet implemented. Please install @ai-sdk/anthropic");
};

export const createGoogleProvider = () => {
  // For future implementation when @ai-sdk/google is added
  throw new Error("Google provider not yet implemented. Please install @ai-sdk/google");
};

export const getProvider = (): LanguageModel => {
  const providerType = getDefaultProvider();

  switch (providerType) {
    case "openai":
      return createOpenAIProvider()("gpt-4o-mini");
    case "anthropic":
      return createAnthropicProvider();
    case "google":
      return createGoogleProvider();
    default:
      return createOpenAIProvider()("gpt-4o-mini");
  }
};
