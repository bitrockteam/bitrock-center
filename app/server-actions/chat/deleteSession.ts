"use server";

import { createClient, getUserInfoFromCookie } from "@/utils/supabase/server";

export const deleteChatSession = async (sessionId: string) => {
  const userInfo = await getUserInfoFromCookie();
  const supabase = await createClient();

  // First verify the session belongs to the user
  const { data: session, error: sessionError } = await supabase
    .from("chat_session")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", userInfo.id)
    .single();

  if (sessionError || !session) {
    throw new Error("Chat session not found or access denied");
  }

  // Delete messages first (cascade should handle this, but being explicit)
  const { error: messagesError } = await supabase
    .from("message")
    .delete()
    .eq("chat_session_id", sessionId);

  if (messagesError) {
    throw new Error(`Error deleting messages: ${messagesError.message}`);
  }

  // Delete the session
  const { error } = await supabase.from("chat_session").delete().eq("id", sessionId);

  if (error) {
    throw new Error(`Error deleting chat session: ${error.message}`);
  }

  return { success: true };
};
