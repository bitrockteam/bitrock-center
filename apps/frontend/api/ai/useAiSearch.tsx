import { useState } from "react";
import { smartSearch, SmartSearchResult } from "./service";

export function useAiSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SmartSearchResult>();

  const search = async (question: string) => {
    setLoading(true);
    setError(null);
    setResult(undefined);

    try {
      const data = await smartSearch(question);
      console.log("AI search result:", data);
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
