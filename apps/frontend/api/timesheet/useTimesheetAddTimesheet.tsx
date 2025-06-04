import { useAuth } from "@/app/(auth)/AuthProvider";
import { SERVERL_BASE_URL } from "@/config";
import { timesheet } from "@bitrock/db";
import { useState } from "react";

export function useTimesheetAddTimesheet() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const execute = async ({
    timesheet,
  }: {
    timesheet: Omit<timesheet, "created_at" | "id">;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${SERVERL_BASE_URL}/timesheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(timesheet),
      });
      const data = await res.json();
      return data as timesheet;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading };
}
