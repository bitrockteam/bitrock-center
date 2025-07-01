"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchAllWorkItems(params?: string | null) {
  const user = await getUserInfoFromCookie();

  // Example: restrict to user's enabled work items if not admin
  if (user.role !== "Admin" && user.role !== "Super_Admin") {
    return db.work_items.findMany({
      where: {
        work_item_enabled_users: {
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
        work_item_enabled_users: true,
      },
    });
  }

  if (!params)
    return db.work_items.findMany({
      include: {
        work_item_enabled_users: true,
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
      work_item_enabled_users: true,
    },
  });
}

export type WorkItem = Awaited<ReturnType<typeof fetchAllWorkItems>>[number];
