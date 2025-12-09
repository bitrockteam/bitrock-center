import type { UserInfo } from "@/app/server-actions/user/getUserInfo";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const supbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supbaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supbaseUrl || !supbaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  }
  return createServerClient(supbaseUrl, supbaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          console.error("Error setting cookies");
        }
      },
    },
  });
}

export async function checkSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }
  return session;
}

export async function getUserInfoFromCookie() {
  await checkSession();
  const cookieStore = await cookies();

  const cookie = cookieStore.get("x-user-info")?.value;
  if (!cookie) throw new Error("No user info cookie found");
  return JSON.parse(cookie) as UserInfo;
}

export async function tryGetUserInfoFromCookie() {
  try {
    return await getUserInfoFromCookie();
  } catch (error) {
    console.error("Error getting user info from cookie:", error);
    return null;
  }
}
