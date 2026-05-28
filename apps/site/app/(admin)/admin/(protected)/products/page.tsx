import Link from "next/link";
import { listAdminProducts } from "@/lib/admin-data";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();
  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Products</h1>
          <p>Create and edit product catalog entries.</p>
        </div>
        <Link className="payload-button" href="/admin/products/new">
          New Product
        </Link>
      </div>
      <div className="payload-table-wrap">
        <table className="payload-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Slug</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link href={`/admin/products/${product.id}`}>{product.title}</Link>
                </td>
                <td>
                  <span className={`payload-status payload-status--${product.status}`}>{product.status}</span>
                </td>
                <td>{product.slug}</td>
                <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
