"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";

export async function deleteClient(id: string) {
  await checkSession();
  return db.client.delete({
    where: { id },
  });
}

export type DeletedClient = Awaited<ReturnType<typeof deleteClient>>;
