import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supbaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supbaseUrl || !supbaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  }
  return createBrowserClient(supbaseUrl, supbaseAnonKey);
}
