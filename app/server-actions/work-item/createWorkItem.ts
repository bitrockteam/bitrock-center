"use server";
import { db } from "@/config/prisma";
import type { work_items } from "@/db";
import { checkSession } from "@/utils/supabase/server";

type Allocation = {
  user_id: string;
  percentage: number;
};

export async function createWorkItem(
  workItem: Omit<work_items, "id" | "created_at">,
  allocations: Allocation[]
) {
  await checkSession();

  return db.$transaction(async (tx) => {
    const workItemCreated = await tx.work_items.create({
      data: workItem,
    });

    if (allocations.length > 0) {
      await tx.allocation.createMany({
        data: allocations.map((alloc) => ({
          work_item_id: workItemCreated.id,
          user_id: alloc.user_id,
          percentage: Math.round(alloc.percentage),
          start_date: new Date(),
        })),
      });
    }

    return workItemCreated;
  });
}

export type CreatedWorkItem = Awaited<ReturnType<typeof createWorkItem>>;
