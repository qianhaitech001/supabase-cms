import type { Product } from "@global-trade/core";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({
  products,
  emptyText = { title: "No products found", description: "Try another category or keyword." },
  detailLabel = "Details"
}: {
  products: Product[];
  emptyText?: { title: string; description: string };
  detailLabel?: string;
}) {
  if (!products.length) {
    return (
      <div className="storefront-empty-state">
        <h2>{emptyText.title}</h2>
        <p>{emptyText.description}</p>
      </div>
    );
  }

  return (
    <div className="products columns-3">
      {products.map((product) => (
        <ProductCard detailLabel={detailLabel} key={product.id} product={product} />
      ))}
    </div>
  );
}
