import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getRequestLocale } from "@/lib/static-locale";
import { getStorefrontTheme } from "@/lib/storefront-theme";

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const theme = getStorefrontTheme();
  const locale = await getRequestLocale();

  return (
    <div className="storefront-shell" data-storefront-theme={theme} lang={locale}>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </div>
  );
}
