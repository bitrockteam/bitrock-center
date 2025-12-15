"use server";
import { db } from "@/config/prisma";
import type { work_items } from "@/db";
import { checkSession } from "@/utils/supabase/server";

type Allocation = {
  user_id: string;
  percentage: number;
};

export async function updateWorkItem(
  id: string,
  updates: Partial<Omit<work_items, "id" | "created_at">>,
  allocations: Allocation[]
) {
  await checkSession();
  return db.$transaction(async (tx) => {
    const updatedWorkItem = await tx.work_items.update({
      where: { id },
      data: updates,
    });

    await tx.allocation.deleteMany({
      where: { work_item_id: id },
    });

    if (allocations.length > 0) {
      await tx.allocation.createMany({
        data: allocations.map((alloc) => ({
          work_item_id: id,
          user_id: alloc.user_id,
          percentage: Math.round(alloc.percentage),
          start_date: new Date(),
        })),
      });
    }

    return updatedWorkItem;
  });
}

export type UpdatedWorkItem = Awaited<ReturnType<typeof updateWorkItem>>;
