import { createClient } from "@supabase/supabase-js";

const metaEnv = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : (typeof process !== "undefined" ? process.env : {});

const supabaseUrl = (metaEnv as any)?.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = (metaEnv as any)?.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  (metaEnv as any)?.VITE_SUPABASE_URL && (metaEnv as any)?.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
