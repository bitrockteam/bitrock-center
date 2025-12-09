"use server";

import { db } from "@/config/prisma";

export async function fetchUserTimesheetById(userId: string) {
  const timesheets = await db.timesheet.findMany({
    where: {
      user_id: userId,
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  return { user, timesheets };
}

export type UserTimesheetById = Awaited<ReturnType<typeof fetchUserTimesheetById>>;
