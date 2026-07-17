"use client";

import { toPlainText, type Product } from "@global-trade/core";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SearchProduct = Pick<Product, "id" | "slug" | "title" | "sku" | "summary">;

export function ProductSearchForm({
  products,
  labels
}: {
  products: SearchProduct[];
  labels: { searchPlaceholder: string; searchSubmit: string };
}) {
  const [query, setQuery] = useState("");
  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return products
      .filter((product) => `${product.title} ${product.sku ?? ""} ${toPlainText(product.summary)}`.toLowerCase().includes(term))
      .slice(0, 5);
  }, [products, query]);

  return (
    <form className="search-form product-search-form" action="/products">
      <button aria-label={labels.searchSubmit} className="search-submit" type="submit">
        <Search size={15} />
      </button>
      <input
        aria-label={labels.searchSubmit}
        autoComplete="off"
        className="search-field"
        name="q"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={labels.searchPlaceholder}
        type="search"
        value={query}
      />
      {suggestions.length > 0 ? (
        <div className="product-search-suggestions">
          {suggestions.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id}>
              <strong>{product.title}</strong>
              {product.sku ? <span>{product.sku}</span> : null}
            </Link>
          ))}
        </div>
      ) : null}
    </form>
  );
}
