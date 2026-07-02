import { cookies } from "next/headers";
import {
  getConfiguredDefaultStaticLocale,
  isStaticI18nEnabled,
  normalizeStaticLocale,
  storefrontLocaleCookie,
  type StaticLocale
} from "./static-content";

export async function getRequestLocale(): Promise<StaticLocale> {
  if (!isStaticI18nEnabled()) return getConfiguredDefaultStaticLocale();
  try {
    const cookieStore = await cookies();
    return normalizeStaticLocale(cookieStore.get(storefrontLocaleCookie)?.value);
  } catch {
    return getConfiguredDefaultStaticLocale();
  }
}
