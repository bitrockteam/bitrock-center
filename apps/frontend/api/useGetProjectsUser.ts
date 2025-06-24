"use client";
import { project } from "@bitrock/db";
import { useCallback, useEffect, useState } from "react";
import { fetchAllProjects } from "./server/project/fetchAllProjects";

export function useGetProjectsUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<project[]>([]);

  const fetchProjects = useCallback(async () => {
    return fetchAllProjects()
      .then((data) => setProjects(data))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading };
}
