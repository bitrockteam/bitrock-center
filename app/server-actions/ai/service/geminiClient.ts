// ai/geminiClient.ts

import type { user } from "@/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NATURAL_LANGUAGE_PROMPT, SYSTEM_PROMPT } from "./prompt";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateSQLFromQuestion(
  question: string,
  user: user,
  contextMessages: string[] = []
) {
  const promptParts = [
    { text: SYSTEM_PROMPT(user) },
    ...contextMessages.map((msg) => ({ text: msg })),
    { text: `Question: ${question}` },
  ];
  const result = await model.generateContent(promptParts);
  return result.response.text().trim();
}

export async function generateNaturalLanguageFromSQLOutput(sqlResults: string) {
  const result = await model.generateContent([
    {
      text: NATURAL_LANGUAGE_PROMPT,
    },
    { text: `SQL Output: ${JSON.stringify(sqlResults)}` },
  ]);

  return result.response.text().trim();
}
