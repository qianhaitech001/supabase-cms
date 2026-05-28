import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { listCategories, listProducts } from "@/lib/data";

export default async function HomePage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <main>
      <section className="shell hero">
        <div>
          <h1>Reusable framework for export-ready product websites.</h1>
          <p>
            Build fast, secure, SEO-friendly foreign-trade showcase sites with a reusable admin, Supabase data layer,
            EdgeOne deployment target, and WordPress/WooCommerce migration pipeline.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
            <Link className="button" href="/contact">
              Start an inquiry
            </Link>
            <Link className="button secondary" href="/admin/migrations">
              Open migration wizard
            </Link>
          </div>
        </div>
        <div className="hero-media" />
      </section>

      <section className="shell section">
        <div className="section-title">
          <h2>Product Categories</h2>
        </div>
        <div className="grid">
          {categories.map((category) => (
            <Link className="card" href={`/product-category/${category.slug}`} key={category.id}>
              <div className="card__body">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-title">
          <h2>Featured Products</h2>
        </div>
        <div className="grid">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
