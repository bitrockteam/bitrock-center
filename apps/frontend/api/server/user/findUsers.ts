"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function findUsers(search?: string) {
  await getUserInfoFromCookie();
  return db.user.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export type FindUsers = Awaited<ReturnType<typeof findUsers>>[number];
