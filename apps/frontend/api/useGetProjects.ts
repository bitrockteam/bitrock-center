import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { useEffect, useState } from "react";

export const useGetProjects = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { session } = useAuth();

  useEffect(() => {
    fetch(`${SERVERL_BASE_URL}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session?.access_token]);

  return { projects, isLoading };
};
