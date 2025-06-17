import { useAuth } from "@/app/(auth)/AuthProvider";
import { project } from "@bitrock/db";
import { useEffect, useState } from "react";
import { fetchProjectById } from "./server/project/fetchProjectById";

export const useGetProjectById = (id: string) => {
  const [project, setProject] = useState<project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuth();

  useEffect(() => {
    fetchProjectById({ projectId: id })
      .then((data) => {
        setProject(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session?.access_token, id]);

  return { project, isLoading };
};
