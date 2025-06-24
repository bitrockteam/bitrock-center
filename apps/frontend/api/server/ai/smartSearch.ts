"use server";

import { SERVERL_BASE_URL } from "@/config";
import { checkSession } from "@/utils/supabase/server";

type AiSearchResult = {
  sql: string;
  error: string | null;
  data: {
    key: string;
  }[];
  output: string | undefined;
};

export async function smartSearch({ question }: { question: string }) {
  const session = await checkSession();
  const response = await fetch(`${SERVERL_BASE_URL}/smart-search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as AiSearchResult;

  return data;
}

export type SmartSearchResult = Awaited<ReturnType<typeof smartSearch>>;
