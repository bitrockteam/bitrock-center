"use server";

import { createClient, getUserInfoFromCookie } from "@/utils/supabase/server";

export const getChatMessages = async (sessionId: string) => {
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

  const { data, error } = await supabase
    .from("message")
    .select("*")
    .eq("chat_session_id", sessionId)
    .order("timestamp", { ascending: true });

  if (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  }

  return data || [];
};
