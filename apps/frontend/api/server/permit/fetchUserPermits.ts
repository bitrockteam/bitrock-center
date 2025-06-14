"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchUserPermits() {
  const userInfo = await getUserInfoFromCookie();
  return db.permit.findMany({
    where: {
      user_id: userInfo.id,
      start_date: {},
    },
    orderBy: {
      start_date: "desc",
    },
  });
}

export type UserTimesheet = Awaited<
  ReturnType<typeof fetchUserPermits>
>[number];
