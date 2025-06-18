"use client";
import { user } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";
import { fetchProjectsUsersAvailable } from "./server/allocation/fetchProjectsUsersAvailable";

export function useGetProjectsUsersAvailable(projectId: string) {
  const [users, setUsers] = useState<user[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(
    async () =>
      fetchProjectsUsersAvailable({ project_id: projectId })
        .then((data) => setUsers(data))
        .finally(() => setIsLoading(false)),
    [projectId],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading };
}
