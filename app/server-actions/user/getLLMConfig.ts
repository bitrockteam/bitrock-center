"use server";

import { getChatConfig } from "@/lib/chat/config";
import { getDefaultProvider } from "@/lib/chat/providers";

export async function getLLMConfig() {
  const config = getChatConfig();
  const provider = getDefaultProvider();

  // Check if API key is set (without exposing it)
  const hasApiKey =
    !!process.env.OPENAI_API_KEY || !!process.env.ANTHROPIC_API_KEY || !!process.env.GOOGLE_API_KEY;

  // Mask API key for display (show first 4 and last 4 characters)
  const getMaskedApiKey = () => {
    const apiKey =
      process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return null;
    if (apiKey.length <= 8) return "••••••••";
    return `${apiKey.substring(0, 4)}${"•".repeat(Math.max(0, apiKey.length - 8))}${apiKey.substring(apiKey.length - 4)}`;
  };

  return {
    provider: provider.charAt(0).toUpperCase() + provider.slice(1),
    model: config.model || "N/A",
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    hasApiKey,
    maskedApiKey: getMaskedApiKey(),
  };
}
