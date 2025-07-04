"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function deleteChatSession(chatSessionId: string) {
  const user = await getUserInfoFromCookie();
  // Assicura che l'utente possa eliminare solo le proprie chat
  const session = await db.chat_session.findUnique({
    where: { id: chatSessionId },
  });
  if (!session || session.user_id !== user.id) {
    throw new Error("Unauthorized or chat session not found");
  }
  await db.message.deleteMany({ where: { chat_session_id: chatSessionId } });
  await db.chat_session.delete({ where: { id: chatSessionId } });
  return { success: true };
}
