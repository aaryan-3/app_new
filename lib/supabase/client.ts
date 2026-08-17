import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether real Supabase persistence is configured for this deployment.
 * The app runs fully in "local" mode (data in this browser only, via
 * lib/store.ts) until both env vars below are set — so it works out of
 * the box with zero setup, and upgrades to real cloud sync + auth once
 * you connect a Supabase project.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(url as string, anonKey as string);
}
