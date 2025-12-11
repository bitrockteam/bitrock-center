"use server";

import { createClient, getUserInfoFromCookie } from "@/utils/supabase/server";

export const createChatSession = async (title: string = "New Chat") => {
  const userInfo = await getUserInfoFromCookie();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_session")
    .insert({
      user_id: userInfo.id,
      title,
      last_updated: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating chat session: ${error.message}`);
  }

  return data;
};
