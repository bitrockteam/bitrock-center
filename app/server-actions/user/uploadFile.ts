"use server";
import { checkSession, createClient } from "@/utils/supabase/server";

export async function uploadFile({ file }: { file: FormData }) {
  checkSession();
  const supabaseClient = await createClient();

  return supabaseClient.storage.from("avatars").upload("avatar.png", file.get("file") as Blob, {
    cacheControl: "3600",
    upsert: true,
  });
}
