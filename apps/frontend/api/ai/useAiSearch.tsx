import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { useState } from "react";

type AiSearchResult = {
  sql: string;
  error: string | null;
  data: {
    key: string;
  };
  output: string | undefined;
};

export function useAiSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiSearchResult>();
  const { session } = useAuth();

  const search = async (question: string) => {
    setLoading(true);
    setError(null);
    setResult(undefined);

    try {
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
      setResult(data);
    } catch (err) {
      console.error("Error during AI search:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(undefined);
  };

  return { loading, error, result, search, reset };
}
