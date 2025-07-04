"use server";
import { db } from "@/config/prisma";
import { timesheet } from "@/db";

export const addTimesheet = async ({
  timesheet,
}: {
  timesheet: Omit<timesheet, "created_at" | "id">;
}) => {
  return db.timesheet.create({
    data: timesheet,
  });
};
