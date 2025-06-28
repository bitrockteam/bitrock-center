"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function findUserById(userId: string) {
  await getUserInfoFromCookie();
  return db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      allocation: {
        select: {
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          start_date: true,
          end_date: true,
        },
      },
    },
  });
}

export type FindUserById = Awaited<ReturnType<typeof findUserById>>;
