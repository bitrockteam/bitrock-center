"use server";
import { db } from "@/config/prisma";
import { user } from "@/db";
import { checkSession } from "@/utils/supabase/server";

export async function updateUser(user: Partial<Omit<user, "created_at">>) {
  await checkSession();
  return db.user.update({
    where: { id: user.id! },
    data: {
      name: user.name!,
      email: user.email!,
      avatar_url: user.avatar_url ?? undefined,
      role: user.role,
    },
  });
}
