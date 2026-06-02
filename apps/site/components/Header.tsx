import Link from "next/link";
import { Search } from "lucide-react";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { listCategories } from "@/lib/data";
import { inshowAssets } from "@/lib/inshow-assets";

export async function Header() {
  const categories = await listCategories();

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
        <HeaderNavigation categories={categories} />
        <form className="search-form" action="/products">
          <button aria-label="Search" className="search-submit inShow-submit" type="submit">
            <Search size={15} />
          </button>
          <input aria-label="Search products" className="search-field" name="q" placeholder="搜索..." type="search" />
        </form>
      </div>
    </header>
  );
}
