"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchLatestNotifications() {
  const { id: userId } = await getUserInfoFromCookie();

  return db.permit.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 5, // Limit to the latest 5 notifications
  });
}

export type LastestNotification = Awaited<
  ReturnType<typeof fetchLatestNotifications>
>[number];
