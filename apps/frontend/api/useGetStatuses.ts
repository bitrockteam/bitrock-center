import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { status } from "@bitrock/db";
import { useEffect, useState } from "react";

export const useGetStatuses = () => {
  const [statuses, setStatuses] = useState<status[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { session } = useAuth();

  useEffect(() => {
    fetch(`${SERVERL_BASE_URL}/statuses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStatuses(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session?.access_token]);

  return { statuses, isLoading };
};
