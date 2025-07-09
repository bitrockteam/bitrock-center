"use server";

import { db } from "@/config/prisma";

export async function fetchWorkItemById({
  workItemId,
}: {
  workItemId: string;
}) {
  return db.work_items.findUnique({
    where: { id: workItemId },
    include: {
      work_item_enabled_users: {
        include: {
          user: true,
        },
      },
      project: true,
      client: true,
      timesheet: {
        include: {
          user: true,
        },
      },
    },
  });
}

export type WorkItemById = Awaited<ReturnType<typeof fetchWorkItemById>>;
