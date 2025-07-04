"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function getChatSessions() {
  const user = await getUserInfoFromCookie();
  return db.chat_session.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      last_updated: "desc",
    },
    include: {
      message: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}

export type ChatSession = Awaited<ReturnType<typeof getChatSessions>>[number];
