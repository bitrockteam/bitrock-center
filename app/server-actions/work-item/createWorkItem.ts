"use server";
import { db } from "@/config/prisma";
import type { work_items } from "@/db";
import { checkSession } from "@/utils/supabase/server";

export async function createWorkItem(
  workItem: Omit<work_items, "id" | "created_at">,
  enabled_users: string[]
) {
  await checkSession();

  return db.$transaction(async (tx) => {
    const workItemCreated = await tx.work_items.create({
      data: workItem,
    });

    if (enabled_users.length > 0) {
      await tx.allocation.createMany({
        data: enabled_users.map((userId) => ({
          work_item_id: workItemCreated.id,
          user_id: userId,
          percentage: 100,
        })),
      });
    }

    return workItemCreated;
  });
}

export type CreatedWorkItem = Awaited<ReturnType<typeof createWorkItem>>;
