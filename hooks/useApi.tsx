"use client";

import { useCallback, useRef, useState } from "react";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type UseApiOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
};

export const useApi = <T = unknown,>(options: UseApiOptions = {}) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  optionsRef.current = options;

  const callApi = useCallback(
    async (url: string, config: RequestInit = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
          ...config,
        });

        const result: ApiResponse<T> = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "API request failed");
        }

        if (result.success) {
          setData(result.data);
          optionsRef.current.onSuccess?.(result.data);
          return result.data;
        } else {
          throw new Error(result.error || "API request failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        optionsRef.current.onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [], // Empty dependency array to ensure callApi is stable
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    callApi,
    reset,
  };
};
