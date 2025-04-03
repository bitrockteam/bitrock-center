import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_PROJECT_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Please define SUPABASE_PROJECT_URL and SUPABASE_PROJECT_KEY in your .env file",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
