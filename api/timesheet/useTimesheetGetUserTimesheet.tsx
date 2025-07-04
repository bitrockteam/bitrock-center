import {
  fetchUserTimesheet,
  UserTimesheet,
} from "@/server/timesheet/fetchUserTimesheet";
import { useCallback, useEffect, useState } from "react";

export function useTimesheetGetUserTimesheet() {
  const [isLoading, setIsLoading] = useState(false);
  const [timesheets, setTimesheets] = useState<UserTimesheet[]>([]);
  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchUserTimesheet();
      setTimesheets(res);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { refetch, timesheets, isLoading };
}
