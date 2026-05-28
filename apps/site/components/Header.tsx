import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="brand" href="/">
          {siteConfig.name}
        </Link>
        <nav className="nav" aria-label="Main navigation">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
