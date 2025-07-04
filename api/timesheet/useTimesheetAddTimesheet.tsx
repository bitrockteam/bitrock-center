import { timesheet } from "@/db";
import { addTimesheet } from "@/server/timesheet/addTimesheet";
import { useState } from "react";

export function useTimesheetAddTimesheet() {
  const [isLoading, setIsLoading] = useState(false);
  const execute = async ({
    timesheet,
  }: {
    timesheet: Omit<timesheet, "created_at" | "id">;
  }) => {
    setIsLoading(true);
    try {
      return addTimesheet({ timesheet });
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading };
}
