// lib/hooks/useServerAction.ts
"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

type UseServerActionOptions = {
  debounceMs?: number;
};

export function useServerAction<TParams extends unknown[], TResult>(
  actionFn: (...params: TParams) => Promise<TResult>,
  initialData?: TResult,
  options: UseServerActionOptions = {}
) {
  const [data, setData] = useState<TResult | undefined>(initialData);
  const [isPending, startTransition] = useTransition();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastParams = useRef<TParams | null>(null);

  const debounceMs = options.debounceMs ?? 300;

  const runAction = useCallback(
    (...params: TParams) => {
      lastParams.current = params;

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        startTransition(async () => {
          if (lastParams.current !== null) {
            const result = await actionFn(...lastParams.current);
            setData(result);
          }
        });
      }, debounceMs);
    },
    [actionFn, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return [data, runAction, isPending] as const;
}
