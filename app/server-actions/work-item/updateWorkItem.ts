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
    db.work_item_enabled_users.deleteMany({
      where: { work_item_id: id },
    }),
    db.work_item_enabled_users.createMany({
      data: enabled_users.map((userId) => ({
        work_item_id: id,
        user_id: userId,
      })),
    }),
  ]);
}

export type UpdatedWorkItem = Awaited<ReturnType<typeof updateWorkItem>>;
