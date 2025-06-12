import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { project } from "@bitrock/db";
import { useEffect, useState } from "react";

export const useGetProjectById = (id: string) => {
  const [project, setProject] = useState<project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuth();

  useEffect(() => {
    fetch(`${SERVERL_BASE_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session?.access_token, id]);

  return { project, isLoading };
};
