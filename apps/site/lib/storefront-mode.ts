export type StorefrontDataMode = "auto" | "static" | "supabase";

export function getStorefrontDataMode(): StorefrontDataMode {
  const value = (process.env.STOREFRONT_DATA_MODE ?? process.env.NEXT_PUBLIC_STOREFRONT_DATA_MODE ?? "auto")
    .trim()
    .toLowerCase();
  if (value === "static" || value === "supabase") return value;
  return "auto";
}

export function shouldUseStaticStorefrontData(isSupabaseReady: boolean) {
  const mode = getStorefrontDataMode();
  if (mode === "static") return true;
  if (mode === "supabase") return !isSupabaseReady;
  return !isSupabaseReady;
}
