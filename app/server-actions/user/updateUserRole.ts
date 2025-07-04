"use server";
import { db } from "@/config/prisma";
import { Role } from "@/db";
import { checkSession } from "@/utils/supabase/server";

export async function updateUserRole(userId: string, role: Role) {
  await checkSession();
  return db.user.update({
    where: { id: userId },
    data: {
      role,
    },
  });
}
