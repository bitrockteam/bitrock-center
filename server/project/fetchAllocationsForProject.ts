"use server";

import { db } from "@/config/prisma";

export async function fetchAllocationsForProject({
  projectId,
}: {
  projectId: string;
}) {
  return db.work_items.findMany({
    where: {
      project_id: projectId,
    },
    include: {
      work_item_enabled_users: {
        include: {
          user: true,
        },
      },
    },
  });
}

export type UserAllocated = Awaited<
  ReturnType<typeof fetchAllocationsForProject>
>[number];
