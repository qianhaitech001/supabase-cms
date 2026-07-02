"use client";

import type { ProductCategory } from "@global-trade/core";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryPath, categoryTitle } from "@/lib/frontend-helpers";

type HeaderNavigationLabels = {
  home: string;
  about: string;
  products: string;
  news: string;
  contact: string;
};

export function HeaderNavigation({ categories, labels }: { categories: ProductCategory[]; labels: HeaderNavigationLabels }) {
  const pathname = usePathname();
  const topCategories = categories.filter((category) => !category.parentId).slice(0, 3);
  const staticNav = [
    { label: labels.home, href: "/" },
    { label: labels.about, href: "/about-us" },
    { label: labels.news, href: "/news" },
    { label: labels.contact, href: "/contact" }
  ];

  return (
    <>
      <nav id="site-navigation" className="main-navigation" aria-label="Main navigation">
        <ul className="nav-menu">
          <li className={isActivePath(pathname, "/") ? "is-active" : undefined}>
            <Link href="/">{labels.home}</Link>
          </li>
          <li className={isActivePath(pathname, "/about-us") ? "is-active" : undefined}>
            <Link href="/about-us">{labels.about}</Link>
          </li>
          <li className={`menu-item-has-children menu-item-product ${isProductsActive(pathname) ? "is-active" : ""}`}>
            <Link href="/products">
              {labels.products} <ChevronDown size={12} strokeWidth={3} />
            </Link>
            <div className="dropdown-content">
              <div className="flex-container">
                {topCategories.map((category) => {
                  const children = categories.filter((item) => item.parentId === category.id).slice(0, 8);
                  return (
                    <div className="category-item flex-item" key={category.id}>
                      <Link className="first-level-link" href={categoryPath(category, categories)}>
                        {categoryTitle(category)}
                      </Link>
                      <div className="subcategories">
                        {children.map((child) => (
                          <Link href={categoryPath(child, categories)} key={child.id}>
                            {categoryTitle(child)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </li>
          <li className={isActivePath(pathname, "/news") ? "is-active" : undefined}>
            <Link href="/news">{labels.news}</Link>
          </li>
          <li className={isActivePath(pathname, "/contact") ? "is-active" : undefined}>
            <Link href="/contact">{labels.contact}</Link>
          </li>
        </ul>
      </nav>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {staticNav.map((item) => (
          <Link className={isActivePath(pathname, item.href) ? "is-active" : undefined} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
        <Link className={isProductsActive(pathname) ? "is-active" : undefined} href="/products">
          {labels.products}
        </Link>
      </nav>
    </>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isProductsActive(pathname: string) {
  return pathname === "/products" || pathname.startsWith("/products/") || pathname.startsWith("/product-category/");
}
