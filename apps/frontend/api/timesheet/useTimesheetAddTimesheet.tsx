import { timesheet } from "@bitrock/db";
import { useState } from "react";
import { addTimesheet } from "../server/timesheet/addTimesheet";

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
