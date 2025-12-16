"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export type ProjectionWithAllocations = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  created_by: string;
  creator_name: string;
  is_active: boolean;
  allocations: Array<{
    id: string;
    user_id: string;
    user_name: string;
    work_item_id: string | null;
    work_item_title: string | null;
    start_date: Date;
    end_date: Date | null;
    percentage: number;
  }>;
};

export async function fetchProjections(): Promise<ProjectionWithAllocations[]> {
  await getUserInfoFromCookie();

  const projections = await db.projection.findMany({
    where: {
      is_active: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      allocations: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
          work_items: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return projections.map((proj) => ({
    id: proj.id,
    name: proj.name,
    description: proj.description,
    created_at: proj.created_at,
    created_by: proj.created_by,
    creator_name: proj.user.name,
    is_active: proj.is_active,
    allocations: proj.allocations.map((alloc) => ({
      id: alloc.id,
      user_id: alloc.user_id,
      user_name: alloc.user.name,
      work_item_id: alloc.work_item_id,
      work_item_title: alloc.work_items?.title ?? null,
      start_date: alloc.start_date,
      end_date: alloc.end_date,
      percentage: alloc.percentage,
    })),
  }));
}

