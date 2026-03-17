"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchOrgUsers() {
  await getUserInfoFromCookie();

  return db.user.findMany({
    where: {},
    include: {
      area: {
        select: {
          id: true,
          name: true,
        },
      },
      societa: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });
}

export type OrgUser = Awaited<ReturnType<typeof fetchOrgUsers>>[number];
