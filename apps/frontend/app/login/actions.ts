"use server";

import { redirect } from "next/navigation";

import { REDIRECT_URL } from "@/config";
import { createClient } from "@/utils/supabase/server";

const getURL = () => {
  let url = REDIRECT_URL;
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function login() {
  const supabase = await createClient();

  const redirectTo = getURL();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  console.log(data);

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    redirect("/error");
  }

  // revalidatePath('/', 'layout')
  // redirect('/')
}

export const logout = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
  }
  redirect("/login");
};
