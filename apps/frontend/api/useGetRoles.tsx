import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { IRole } from "@bitrock/types";
import { useEffect, useState } from "react";

export const useGetRoles = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuth();

  useEffect(() => {
    fetch(`${SERVERL_BASE_URL}/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session?.access_token]);

  return { roles, isLoading };
};
