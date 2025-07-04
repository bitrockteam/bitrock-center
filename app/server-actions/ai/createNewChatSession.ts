"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function createNewChatSession() {
  const user = await getUserInfoFromCookie();
  return db.chat_session.create({
    data: {
      user_id: user.id,
      title: "New Chat",
    },
  });
}
