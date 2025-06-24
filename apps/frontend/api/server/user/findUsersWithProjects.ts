"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function findUsersWithProjects(search?: string) {
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
    include: {
      allocation: {
        include: {
          project: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export type FindUsersWithProjects = Awaited<
  ReturnType<typeof findUsersWithProjects>
>[number];
