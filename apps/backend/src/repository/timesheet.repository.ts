import { timesheet } from "@bitrock/db";
import { db } from "../config/prisma";

export function getTimesheetByUserId(userId: string) {
  return db.timesheet.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
}

export function createTimesheet(data: Omit<timesheet, "id" | "created_at">) {
  return db.timesheet.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
}
