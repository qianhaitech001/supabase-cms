import { toPlainText, type Product } from "@global-trade/core";
import Link from "next/link";

export function LatestProductsList({ products, title = "Latest Products" }: { products: Product[]; title?: string }) {
  return (
    <div className="latest-products">
      <h2 className="latest-products-title">{title}</h2>
      <ul className="latest-products-list">
        {products.map((product) => {
          const summary = toPlainText(product.summary || product.richText).slice(0, 160);
          return (
            <li className="latest-products-item" key={product.id}>
              <Link className="latest-products-item_link" href={`/products/${product.slug}`}>
                <span className="product-thumbnail">
                  {product.primaryImage?.publicUrl ? <img src={product.primaryImage.publicUrl} alt={product.title} /> : null}
                </span>
                <span className="product-info">
                  <h3>{product.title}</h3>
                  <p>{summary || "Product details and specifications"}</p>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
