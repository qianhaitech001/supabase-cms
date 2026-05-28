import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/data";

export default async function ProductsPage() {
  const products = await listProducts();
  return (
    <main className="shell section">
      <h1>Products</h1>
      <div className="grid" style={{ marginTop: 24 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
