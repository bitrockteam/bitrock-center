"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchUserPermits() {
  const userInfo = await getUserInfoFromCookie();
  return db.permit.findMany({
    include: {
      user_permit_reviewer_idTouser: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      user_id: userInfo.id,
      date: {},
    },
    orderBy: {
      date: "desc",
    },
  });
}

export type UserPermit = Awaited<ReturnType<typeof fetchUserPermits>>[number];
