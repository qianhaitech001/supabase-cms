import type { Product } from "@global-trade/core";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <div className="hero-media" style={{ borderRadius: 0, aspectRatio: "4 / 3" }} />
      <div className="card__body">
        <h3>{product.title}</h3>
        <p>{product.summary ?? "Project-ready product with configurable specifications."}</p>
        <Link className="button secondary" href={`/products/${product.slug}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
