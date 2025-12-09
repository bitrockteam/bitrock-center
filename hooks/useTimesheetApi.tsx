"use client";

import { useCallback } from "react";
import type { timesheet } from "@/db";
import { useApi } from "@/hooks/useApi";

export type TimesheetData = Omit<timesheet, "created_at" | "id">;
export type UpdateTimesheetData = Partial<TimesheetData> & { id: string };

export const useTimesheetApi = () => {
  const { callApi, loading, error, reset } = useApi();

  const createTimesheet = useCallback(
    async (data: TimesheetData) => {
      return callApi("/api/timesheet/create", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString().split("T")[0],
        }),
      });
    },
    [callApi]
  );

  const updateTimesheet = useCallback(
    async (data: UpdateTimesheetData) => {
      const { id, ...updateData } = data;
      return callApi("/api/timesheet/update", {
        method: "PUT",
        body: JSON.stringify({
          id,
          ...updateData,
          date: updateData.date?.toISOString().split("T")[0],
        }),
      });
    },
    [callApi]
  );

  const deleteTimesheet = useCallback(
    async (id: string) => {
      return callApi("/api/timesheet/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
    },
    [callApi]
  );

  const fetchTimesheets = useCallback(async () => {
    return callApi("/api/timesheet/fetch", {
      method: "GET",
    });
  }, [callApi]);

  return {
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    fetchTimesheets,
    loading,
    error,
    reset,
  };
};
