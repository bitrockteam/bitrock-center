import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { allocation } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";

export function useGetAllocationsForProject(projectId: string) {
  const { session } = useAuth();
  const [allocations, setAllocations] = useState<allocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllocations = useCallback(() => {
    setIsLoading(true);
    return fetch(`${SERVERL_BASE_URL}/allocations/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAllocations(data))
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId, session?.access_token]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations, projectId, session?.access_token]);

  return { allocations, isLoading, fetchAllocations };
}
