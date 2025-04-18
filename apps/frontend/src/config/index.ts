const SERVERL_BASE_URL = import.meta.env.VITE_SERVER_URL!;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL!;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Check if all required environment variables are set
if (!SERVERL_BASE_URL) {
  throw new Error("VITE_SERVER_URL is not defined");
}
if (!REDIRECT_URL) {
  throw new Error("VITE_REDIRECT_URL is not defined");
}
if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is not defined");
}
if (!SUPABASE_ANON_KEY) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not defined");
}

export { REDIRECT_URL, SERVERL_BASE_URL, SUPABASE_ANON_KEY, SUPABASE_URL };
