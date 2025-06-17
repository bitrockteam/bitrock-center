"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IProject } from "@bitrock/types";
import { useCallback, useEffect, useState } from "react";

export function useGetProjectsUser() {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<IProject[]>([]);

  const fetchProjects = useCallback(async () => {
    if (!user?.id) return;
    return fetch(`${SERVERL_BASE_URL}/projects/user/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .finally(() => setIsLoading(false));
  }, [session?.access_token, user?.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading };
}
