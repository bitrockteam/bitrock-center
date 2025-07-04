import { createServerClient } from "@supabase/ssr";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { user } from "../../db";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            console.error("Error setting cookies");
          }
        },
      },
    },
  );
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

async function getCookieData(): Promise<ReadonlyRequestCookies> {
  const cookieData = cookies();
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData);
    }, 1000),
  );
}

export async function getUserInfoFromCookie() {
  await checkSession();
  const cookieStore = await getCookieData();
  const cookie = cookieStore.get("x-user-info")?.value;
  if (!cookie) throw new Error("No user info cookie found");
  return JSON.parse(cookie) as user;
}

export async function tryGetUserInfoFromCookie() {
  try {
    return await getUserInfoFromCookie();
  } catch (error) {
    console.error("Error getting user info from cookie:", error);
    return null;
  }
}
