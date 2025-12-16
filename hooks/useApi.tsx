"use client";

import { useCallback, useRef, useState } from "react";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type UseApiOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
};

export const useApi = <T = unknown>(options: UseApiOptions = {}) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  optionsRef.current = options;

  const callApi = useCallback(
    async <R = T>(url: string, config: RequestInit = {}): Promise<R> => {
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

        if (!response.ok) {
          let errorMessage = "API request failed";
          try {
            const errorResult: ApiResponse<R> = await response.json();
            errorMessage = errorResult.error || errorMessage;
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const result: ApiResponse<R> = await response.json();

        if (result.success) {
          setData(result.data as T);
          optionsRef.current.onSuccess?.(result.data);
          return result.data as R;
        } else {
          throw new Error(result.error || "API request failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : err instanceof TypeError && err.message === "Failed to fetch"
              ? "Network error: Unable to connect to the server. Please check your connection."
              : "Unknown error";
        setError(errorMessage);
        optionsRef.current.onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [] // Empty dependency array to ensure callApi is stable
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
