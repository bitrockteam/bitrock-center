"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

type ProjectionAllocationInput = {
  user_id: string;
  work_item_id?: string | null;
  start_date: Date;
  end_date?: Date | null;
  percentage: number;
};

export async function updateProjectionAllocations(
  projectionId: string,
  allocations: ProjectionAllocationInput[]
) {
  await getUserInfoFromCookie();

  return db.$transaction(async (tx) => {
    // Delete existing allocations for this projection
    await tx.projection_allocation.deleteMany({
      where: {
        projection_id: projectionId,
      },
    });

    // Create new allocations
    if (allocations.length > 0) {
      await tx.projection_allocation.createMany({
        data: allocations.map((alloc) => ({
          projection_id: projectionId,
          user_id: alloc.user_id,
          work_item_id: alloc.work_item_id ?? null,
          start_date: alloc.start_date,
          end_date: alloc.end_date ?? null,
          percentage: Math.round(alloc.percentage),
        })),
      });
    }

    return { success: true };
  });
}

