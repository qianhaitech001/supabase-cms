import Link from "next/link";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProductSearchForm } from "@/components/storefront/ProductSearchForm";
import { listCategories, listProducts } from "@/lib/data";
import { inshowAssets } from "@/lib/inshow-assets";
import { getStaticContent, getSupportedStaticLocales, isStaticI18nEnabled, type StaticLocale } from "@/lib/static-content";

export async function Header({ locale }: { locale: StaticLocale }) {
  const content = getStaticContent(locale);
  const locales = getSupportedStaticLocales();
  const shouldShowLanguageSwitcher = isStaticI18nEnabled() && locales.length > 1;
  const [categories, products] = await Promise.all([listCategories(locale), listProducts(locale)]);

  return (
    <header id="masthead" className="site-header">
      <div className="site-branding">
        <Link className="custom-logo-link" href="/">
          <img className="custom-logo" src={inshowAssets.logo} alt="INSHOW HOME" />
        </Link>
        <div className="site-title-block">
          <p className="site-title"><Link href="/">INSHOW HOME</Link></p>
          <p className="site-description">Full range customization.</p>
        </div>
      </div>
      <div className="menu-search-block">
        <HeaderNavigation categories={categories} labels={content.text.nav} />
        <ProductSearchForm labels={content.text.nav} products={products} />
        {shouldShowLanguageSwitcher ? <LanguageSwitcher locale={locale} locales={locales} /> : null}
      </div>
    </header>
  );
}
