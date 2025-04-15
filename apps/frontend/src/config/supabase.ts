import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = SUPABASE_URL ?? "";
const supabaseKey = SUPABASE_ANON_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
