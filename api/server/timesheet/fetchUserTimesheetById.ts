"use server";

import { db } from "@/config/prisma";

export async function fetchUserTimesheetById(userId: string) {
  return db.timesheet.findMany({
    where: {
      user_id: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export type UserTimesheetById = Awaited<
  ReturnType<typeof fetchUserTimesheetById>
>[number];
