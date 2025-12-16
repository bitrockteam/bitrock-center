"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchAllAllocations(filters?: {
  user_id?: string;
  work_item_id?: string;
  client_id?: string;
}) {
  await getUserInfoFromCookie();

  const where: {
    user_id?: string;
    work_item_id?: string;
    work_items?: {
      client_id?: string;
    };
  } = {};

  if (filters?.user_id) {
    where.user_id = filters.user_id;
  }

  if (filters?.work_item_id) {
    where.work_item_id = filters.work_item_id;
  }

  if (filters?.client_id) {
    where.work_items = {
      client_id: filters.client_id,
    };
  }

  return db.allocation.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar_url: true,
        },
      },
      work_items: {
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
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export type AllocationWithDetails = Awaited<ReturnType<typeof fetchAllAllocations>>[number];
