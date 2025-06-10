import { user } from "@bitrock/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function getUserInfoFromCookie() {
  await checkSession();
  const cookieStore = await cookies();
  const cookie = cookieStore.get("x-user-info")?.value;
  if (!cookie) throw new Error("No user info cookie found");
  return JSON.parse(cookie) as user;
}
