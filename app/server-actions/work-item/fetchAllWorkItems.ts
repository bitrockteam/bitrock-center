"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchAllWorkItems(params?: string | null) {
  const user = await getUserInfoFromCookie();
  // Example: restrict to user's enabled work items if not admin
  if (user.permissions.find((perm) => perm === "CAN_SEE_WORK_ITEM") == null) {
    return db.work_items.findMany({
      where: {
        allocation: {
          some: {
            user_id: user.id,
          },
        },
        ...(params
          ? {
              title: {
                contains: params || "",
                mode: "insensitive",
              },
            }
          : {}),
      },
      include: {
        allocation: {
          include: {
            user: true,
          },
        },
        client: true,
        project: true,
      },
    });
  }

  if (!params)
    return db.work_items.findMany({
      include: {
        allocation: {
          include: {
            user: true,
          },
        },
        client: true,
        project: true,
      },
    });

  return db.work_items.findMany({
    where: {
      title: {
        contains: params,
        mode: "insensitive",
      },
    },
    include: {
      allocation: {
        include: {
          user: true,
        },
      },
      client: true,
      project: true,
    },
  });
}

export type WorkItem = Awaited<ReturnType<typeof fetchAllWorkItems>>[number];
