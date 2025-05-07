import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { useState } from "react";

export function useUpdateAllocation() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateAllocation = async (
    project_id: string,
    user_id: string,
    {
      start_date,
      end_date,
      percentage,
    }: {
      start_date?: string;
      end_date?: string;
      percentage?: number;
    },
  ) => {
    setIsLoading(true);
    return fetch(`${SERVERL_BASE_URL}/allocation/${project_id}/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ start_date, end_date, percentage }),
    })
      .then((res) => res.json())
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { updateAllocation, isLoading };
}
