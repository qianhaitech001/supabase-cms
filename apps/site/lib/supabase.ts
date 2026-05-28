import { createClient } from "@supabase/supabase-js";

export function createBrowserSupabaseClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requirePublicSupabaseKey();
  return createClient(url, key);
}

export function createServiceSupabaseClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getPublicSupabaseKey());
}

export function isSupabaseServiceRoleConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function requirePublicSupabaseKey() {
  const value = getPublicSupabaseKey();
  if (!value) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return value;
}

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
