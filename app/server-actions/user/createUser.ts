"use server";
import { db } from "@/config/prisma";
import type { user } from "@/db";
import { checkSession } from "@/utils/supabase/server";

export async function createUser(user: Partial<Omit<user, "id" | "created_at">>) {
  await checkSession();
  if (!user.name || !user.email) {
    throw new Error("Name and email are required");
  }
  return db.user.create({
    data: {
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url ?? undefined,
      role: user.role,
      referent_id: user.referent_id ?? null,
    },
  });
}

export type CreateUserResponse = Awaited<ReturnType<typeof createUser>>;
