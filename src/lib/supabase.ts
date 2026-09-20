import { createClient } from '@supabase/supabase-js';

/**
 * Credentials come from the Supabase resource provisioned through the Vercel
 * Marketplace (Storage tab → unchain-website-db). Vercel injects them as
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY into every environment;
 * `vercel env pull` writes them to .env.local for local work. The VITE_ names are
 * kept as a fallback for hand-written .env files.
 */
const env = import.meta.env;
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key not found. Run `vercel env pull .env.local` to fetch them from the Vercel project.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
