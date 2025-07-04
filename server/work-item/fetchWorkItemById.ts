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
      project: {
        include: {
          timesheet: {
            include: {
              user: true,
            },
          },
        },
      },
      client: true,
    },
  });
}

export type WorkItemById = Awaited<ReturnType<typeof fetchWorkItemById>>;
