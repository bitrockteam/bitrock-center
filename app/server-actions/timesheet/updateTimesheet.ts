"use server";
import { db } from "@/config/prisma";
import type { timesheet } from "@/db";

export const updateTimesheet = async ({
  id,
  timesheet: timesheetData,
}: {
  id: string;
  timesheet: Partial<Omit<timesheet, "created_at" | "id">>;
}) => {
  return db.timesheet.update({
    where: { id },
    data: timesheetData,
  });
};
