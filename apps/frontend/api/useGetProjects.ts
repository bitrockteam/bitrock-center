"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { project } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";
import { fetchAllProjects } from "./server/project/fetchAllProjects";

export const useGetProjects = () => {
  const [projects, setProjects] = useState<project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { session } = useAuth();

  const refetch = useCallback(() => {
    setIsLoading(true);
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("params");

    fetchAllProjects({ params: search })
      .then((data) => setProjects(data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (session?.access_token) refetch();
  }, [refetch, session?.access_token]);

  return { projects, isLoading, refetch };
};
