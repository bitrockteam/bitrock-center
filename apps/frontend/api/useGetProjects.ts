"use client";
import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { project } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";

export const useGetProjects = () => {
  const [projects, setProjects] = useState<project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { session } = useAuth();

  const refetch = useCallback(() => {
    setIsLoading(true);
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("params");

    fetch(`${SERVERL_BASE_URL}/projects${search ? `?params=${search}` : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [session]);

  useEffect(() => {
    if (session?.access_token) refetch();
  }, [refetch, session?.access_token]);

  return { projects, isLoading, refetch };
};
