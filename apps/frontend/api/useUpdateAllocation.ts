import { allocation } from "@bitrock/db";
import { useState } from "react";
import { fetchUpdateAllocation } from "./server/allocation/updateAllocation";

export function useUpdateAllocation() {
  const [isLoading, setIsLoading] = useState(false);

  const updateAllocation = async (
    allocation: Omit<allocation, "created_at">,
  ) => {
    setIsLoading(true);
    return fetchUpdateAllocation({
      allocation: {
        project_id: allocation.project_id,
        user_id: allocation.user_id,
        start_date: allocation.start_date,
        end_date: allocation.end_date,
        percentage: allocation.percentage,
      },
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return { updateAllocation, isLoading };
}
