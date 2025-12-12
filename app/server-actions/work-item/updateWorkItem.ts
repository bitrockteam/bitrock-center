"use server";
import { db } from "@/config/prisma";
import type { work_items } from "@/db";
import { checkSession } from "@/utils/supabase/server";

export async function updateWorkItem(
  id: string,
  updates: Partial<Omit<work_items, "id" | "created_at">>,
  enabled_users: string[]
) {
  await checkSession();
  return db.$transaction([
    db.work_items.update({
      where: { id },
      data: updates,
    }),
    db.allocation.deleteMany({
      where: { work_item_id: id },
    }),
    db.allocation.createMany({
      data: enabled_users.map((userId) => ({
        work_item_id: id,
        user_id: userId,
        percentage: 100,
      })),
    }),
  ]);
}

export type UpdatedWorkItem = Awaited<ReturnType<typeof updateWorkItem>>;
