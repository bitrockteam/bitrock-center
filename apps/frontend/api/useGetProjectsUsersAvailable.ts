"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IUser } from "@bitrock/types";
import { useCallback, useEffect, useState } from "react";

export function useGetProjectsUsersAvailable(projectId: string) {
  const { session } = useAuth();

  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(
    async () =>
      fetch(`${SERVERL_BASE_URL}/projects/${projectId}/users/available`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .finally(() => setIsLoading(false)),
    [projectId, session?.access_token],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading };
}
