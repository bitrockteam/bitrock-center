"use server";
import { db } from "@/config/prisma";
import type { message } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { generateNaturalLanguageFromSQLOutput, generateSQLFromQuestion } from "./geminiClient";
import { supabase } from "./supabase";

type AiSearchResult = {
  sql: string;
  error: string | null;
  data: {
    key: string;
  }[];
  output: string | undefined;
  isJson: boolean;
  jsonData?: unknown;
};

export async function smartSearch({
  question,
  chat_session_id,
}: {
  question: string;
  chat_session_id: string;
}): Promise<AiSearchResult> {
  const user = await getUserInfoFromCookie();
  // Fetch last 10 messages for memory
  const previousMessages = await db.message.findMany({
    where: { chat_session_id },
    orderBy: { timestamp: "asc" },
    take: 10,
  });
  // Format messages as context
  const contextMessages = previousMessages.map((msg) => {
    return `${msg.type === "user" ? "User" : "Assistant"}: ${msg.content}`;
  });
  const sql = await generateSQLFromQuestion(question, user, contextMessages);
  // Optional logging
  console.log("🧠 Generated SQL:", sql);
  // 2. Run the SQL against local Supabase (Postgres)
  const result = await supabase.rpc("execute_sql", { sql });
  console.log("📊 SQL Result:", result);

  if (result.error) {
    console.error("❌ SQL Execution Error:", result.error);
    throw new Error(`SQL Execution Error: ${result.error.message}`);
  }

  const formattedResult = await generateNaturalLanguageFromSQLOutput(result.data);

  const userMessage: Omit<message, "id"> = {
    content: question,
    type: "user",
    chat_session_id: chat_session_id,
    json_data: null, // Assuming no JSON data for user messages
    timestamp: new Date(),
    is_json: false, // Assuming the input is not JSON
    confirmed: false, // Assuming user messages are not confirmed
  };
  const botMessage: Omit<message, "id"> = {
    content: formattedResult,
    type: "bot",
    chat_session_id: chat_session_id,
    json_data: result.data, // Assuming the output is JSON data
    timestamp: new Date(),
    is_json: false, // Assuming the output is not JSON
    confirmed: false, // Assuming bot messages are confirmed
  };

  // Fix for Prisma JSON type compatibility: convert null to undefined for json_data
  await db.message.createMany({
    data: [userMessage, botMessage].map((msg) => ({
      ...msg,
      json_data: msg.json_data === null ? undefined : msg.json_data,
    })),
    skipDuplicates: true, // Avoid duplicates if the same message is sent again
  });

  return {
    sql,
    data: result.data,
    error: result.error,
    output: formattedResult,
    isJson: false,
  };
}

export type SmartSearchResult = Awaited<ReturnType<typeof smartSearch>>;
