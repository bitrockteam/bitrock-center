"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";
import { work_items } from "@bitrock/db";

export async function createWorkItem(
  workItem: Omit<work_items, "id" | "created_at">,
  enabled_users: string[],
) {
  await checkSession();
  const workItemCreated = await db.work_items.create({
    data: workItem,
  });

  return db.work_item_enabled_users.createMany({
    data: enabled_users.map((userId) => ({
      work_item_id: workItemCreated.id,
      user_id: userId,
    })),
  });
}

export type CreatedWorkItem = Awaited<ReturnType<typeof createWorkItem>>;
