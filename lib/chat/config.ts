export const getChatConfig = () => {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || "openai";
  const model = process.env.AI_MODEL || (provider === "openai" ? "gpt-4o-mini" : undefined);
  const temperature = parseFloat(process.env.AI_TEMPERATURE || "0.7");
  const maxTokens = parseInt(process.env.AI_MAX_TOKENS || "2000", 10);

  return {
    provider,
    model,
    temperature,
    maxTokens,
  };
};
