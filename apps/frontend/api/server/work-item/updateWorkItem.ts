"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";
import { work_items } from "@bitrock/db";

export async function updateWorkItem(
  id: string,
  updates: Partial<Omit<work_items, "id" | "created_at">>,
) {
  await checkSession();
  return db.work_items.update({
    where: { id },
    data: updates,
  });
}

export type UpdatedWorkItem = Awaited<ReturnType<typeof updateWorkItem>>;
