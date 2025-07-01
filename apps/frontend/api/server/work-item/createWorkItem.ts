"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";
import { work_items } from "@bitrock/db";

export async function createWorkItem(
  workItem: Omit<work_items, "id" | "created_at">,
) {
  await checkSession();
  return db.work_items.create({
    data: workItem,
  });
}

export type CreatedWorkItem = Awaited<ReturnType<typeof createWorkItem>>;
