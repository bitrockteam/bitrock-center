"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";

export async function deleteWorkItem(id: string) {
  await checkSession();
  return db.work_items.delete({
    where: { id },
  });
}

export type DeletedWorkItem = Awaited<ReturnType<typeof deleteWorkItem>>;
