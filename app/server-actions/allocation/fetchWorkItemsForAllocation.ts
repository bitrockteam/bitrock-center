"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchWorkItemsForAllocation({
  client_id,
  project_id,
}: {
  client_id: string;
  project_id?: string;
}) {
  await getUserInfoFromCookie();

  const where: {
    client_id: string;
    project_id?: string;
  } = {
    client_id,
  };

  if (project_id) {
    where.project_id = project_id;
  }

  return db.work_items.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
}

export type WorkItemForAllocation = Awaited<ReturnType<typeof fetchWorkItemsForAllocation>>[number];
