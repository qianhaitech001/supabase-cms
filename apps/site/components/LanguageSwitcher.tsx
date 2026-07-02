"use client";

import { useRouter } from "next/navigation";
import { storefrontLocaleCookie, type StaticLocale, type StaticLocaleOption } from "@/lib/static-content";

export function LanguageSwitcher({ locale, locales }: { locale: StaticLocale; locales: StaticLocaleOption[] }) {
  const router = useRouter();

  if (locales.length <= 1) return null;

  function switchLocale(nextLocale: StaticLocale) {
    if (nextLocale === locale) return;
    document.cookie = `${storefrontLocaleCookie}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="language-switcher" aria-label="Language">
      {locales.map((item) => (
        <button
          aria-pressed={item.code === locale}
          className={item.code === locale ? "is-active" : undefined}
          key={item.code}
          onClick={() => switchLocale(item.code)}
          type="button"
        >
          {item.shortLabel}
        </button>
      ))}
    </div>
  );
}
