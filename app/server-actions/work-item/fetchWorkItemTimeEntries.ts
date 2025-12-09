"use server";
import { db } from "@/config/prisma";

export async function fetchWorkItemTimeEntries(workItemId: string) {
  return db.timesheet.findMany({
    where: { work_item_id: workItemId },
    include: { user: true },
  });
}

export type WorkItemTimeEntry = Awaited<ReturnType<typeof fetchWorkItemTimeEntries>>[number];
