"use server";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import {
  generateNaturalLanguageFromSQLOutput,
  generateSQLFromQuestion,
} from "./geminiClient";
import { supabase } from "./supabase";

type AiSearchResult = {
  sql: string;
  error: string | null;
  data: {
    key: string;
  }[];
  output: string | undefined;
};

export async function smartSearch(question: string): Promise<AiSearchResult> {
  const user = await getUserInfoFromCookie();
  const sql = await generateSQLFromQuestion(question, user);
  // Optional logging
  console.log("🧠 Generated SQL:", sql);
  // 2. Run the SQL against local Supabase (Postgres)
  const result = await supabase.rpc("execute_sql", { sql });
  console.log("📊 SQL Result:", result);

  if (result.error) {
    console.error("❌ SQL Execution Error:", result.error);
    throw new Error(`SQL Execution Error: ${result.error.message}`);
  }

  const formattedResult = await generateNaturalLanguageFromSQLOutput(
    result.data,
  );

  return {
    sql,
    data: result.data,
    error: result.error,
    output: formattedResult,
  };
}

export type SmartSearchResult = Awaited<ReturnType<typeof smartSearch>>;
