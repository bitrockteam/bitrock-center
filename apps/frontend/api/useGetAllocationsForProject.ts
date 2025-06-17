import { useAuth } from "@/app/(auth)/AuthProvider";
import { useCallback, useEffect, useState } from "react";
import {
  fetchAllocationsForProject,
  UserAllocated,
} from "./server/project/fetchAllocationsForProject";

export function useGetAllocationsForProject(projectId: string) {
  const { session } = useAuth();
  const [allocations, setAllocations] = useState<UserAllocated[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllocations = useCallback(() => {
    setIsLoading(true);
    return fetchAllocationsForProject({ projectId })
      .then((data) => setAllocations(data))
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations, projectId, session?.access_token]);

  return { allocations, isLoading, fetchAllocations };
}
