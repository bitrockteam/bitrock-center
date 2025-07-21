"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export async function createUserInfo(userInfo?: User) {
  console.log(userInfo);

  const supabase = await createClient();
  try {
    const res = await supabase.from("user").insert({
      email: userInfo?.email,
      name: userInfo?.user_metadata.name,
      avatar_url: userInfo?.user_metadata.avatar_url,
    });

    if (res.error) {
      throw new Error(`Error fetching user info: ${res.error.message}`);
    }
    return res.data;
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    throw error;
  }
}
