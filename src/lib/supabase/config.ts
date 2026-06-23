// Centralized read of the public Supabase env vars. Referencing
// `process.env.NEXT_PUBLIC_*` directly lets Next inline the values into the
// client bundle at build time. No secrets live here.
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
