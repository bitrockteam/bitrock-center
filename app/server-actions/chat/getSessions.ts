"use server";

import { createClient, getUserInfoFromCookie } from "@/utils/supabase/server";

export const getChatSessions = async () => {
  const userInfo = await getUserInfoFromCookie();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_session")
    .select("*")
    .eq("user_id", userInfo.id)
    .order("last_updated", { ascending: false });

  if (error) {
    throw new Error(`Error fetching chat sessions: ${error.message}`);
  }

  return data || [];
};
