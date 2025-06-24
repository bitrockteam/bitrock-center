"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function findUserById(userId: string) {
  await getUserInfoFromCookie();
  return db.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export type FindUserById = Awaited<ReturnType<typeof findUserById>>;
