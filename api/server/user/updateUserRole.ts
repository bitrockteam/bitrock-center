"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";
import { Role } from "../../../db";

export async function updateUserRole(userId: string, role: Role) {
  await checkSession();
  return db.user.update({
    where: { id: userId },
    data: {
      role,
    },
  });
}
