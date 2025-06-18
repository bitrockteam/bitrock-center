"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";
import { user } from "@bitrock/db";

export async function createUser(
  user: Partial<Omit<user, "id" | "created_at">>,
) {
  await checkSession();
  return db.user.create({
    data: {
      name: user.name!,
      email: user.email!,
      avatar_url: user.avatar_url ?? undefined,
      role: user.role,
    },
  });
}

export type CreateUserResponse = Awaited<ReturnType<typeof createUser>>;
