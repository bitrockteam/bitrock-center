"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchUserTimesheet() {
  const userInfo = await getUserInfoFromCookie();
  return db.timesheet.findMany({
    where: {
      user_id: userInfo.id,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export type UserTimesheet = Awaited<ReturnType<typeof fetchUserTimesheet>>[number];
