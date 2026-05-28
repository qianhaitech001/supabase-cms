import Link from "next/link";
import { listAdminPosts, listAdminProductCategories, listAdminProducts, listAdminUsers } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminHomePage() {
  const [session, posts, products, categories, users] = await Promise.all([
    requireAdminSession(),
    listAdminPosts(),
    listAdminProducts(),
    listAdminProductCategories(),
    listAdminUsers()
  ]);

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage site content, product catalog, inquiries, and migration batches.</p>
        </div>
      </div>
      <section className="payload-banner">
        <h2>Welcome to your dashboard!</h2>
        <p>Use the collections below to create content manually or import from WordPress/WooCommerce.</p>
      </section>
      <div className="payload-grid">
        <Link className="payload-card" href="/admin/posts">
          <h2>Posts</h2>
          <p>{posts.length} entries</p>
        </Link>
        <Link className="payload-card" href="/admin/products">
          <h2>Products</h2>
          <p>{products.length} entries</p>
        </Link>
        <Link className="payload-card" href="/admin/product-categories">
          <h2>Categories</h2>
          <p>{categories.length} entries</p>
        </Link>
        <Link className="payload-card" href="/admin/migrations">
          <h2>Migrations</h2>
          <p>Preview and import WXR/CSV files.</p>
        </Link>
        {["owner", "admin"].includes(session.profile.role) && (
          <Link className="payload-card" href="/admin/users">
            <h2>Users</h2>
            <p>{users.length} accounts</p>
          </Link>
        )}
      </div>
    </div>
  );
}
