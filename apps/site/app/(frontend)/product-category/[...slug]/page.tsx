import { ProductCard } from "@/components/ProductCard";
import { listCategories, listProducts } from "@/lib/data";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const categorySlug = slug.at(-1) ?? "";
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const category = categories.find((item) => item.slug === categorySlug);

  return (
    <main className="shell section">
      <h1>{category?.title ?? "Products"}</h1>
      <p style={{ color: "var(--muted)" }}>{category?.description ?? "Browse product catalog."}</p>
      <div className="grid" style={{ marginTop: 24 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
