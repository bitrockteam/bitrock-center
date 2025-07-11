import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Please define SUPABASE_PROJECT_URL and SUPABASE_PROJECT_KEY in your .env file",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
