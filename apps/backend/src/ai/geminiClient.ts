// ai/geminiClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NATURAL_LANGUAGE_PROMPT, SYSTEM_PROMPT } from "./prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateSQLFromQuestion(question: string) {
  const result = await model.generateContent([
    {
      text: SYSTEM_PROMPT,
    },
    { text: `Question: ${question}` },
  ]);

  return result.response.text().trim();
}

export async function generateNaturalLanguageFromSQLOutput(sqlResults: any) {
  const result = await model.generateContent([
    {
      text: NATURAL_LANGUAGE_PROMPT,
    },
    { text: `SQL Output: ${JSON.stringify(sqlResults)}` },
  ]);

  return result.response.text().trim();
}
