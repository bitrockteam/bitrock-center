import { useState, useCallback } from 'react';

type ApiCall = (...args: unknown[]) => Promise<Response>;

function useApiCall(apiCall: ApiCall) {
  const [ data, setData ] = useState(null);
  const [ error, setError ] = useState<Error | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

    const execute = useCallback(async (...args: Parameters<ApiCall>) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiCall(...args);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || 'An error occurred');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    }, [apiCall]);

    return { data, error, isLoading, execute  };
}
