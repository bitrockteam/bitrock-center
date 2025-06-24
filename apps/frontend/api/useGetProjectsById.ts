import { project } from "@bitrock/db";
import { useEffect, useState } from "react";
import { fetchProjectById } from "./server/project/fetchProjectById";

export const useGetProjectById = (id: string) => {
  const [project, setProject] = useState<project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjectById({ projectId: id })
      .then((data) => {
        setProject(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return { project, isLoading };
};
