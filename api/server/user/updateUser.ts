"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";
import { user } from "../../../db";

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
