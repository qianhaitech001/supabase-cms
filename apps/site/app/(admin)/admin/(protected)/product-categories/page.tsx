import Link from "next/link";
import { listAdminProductCategories } from "@/lib/admin-data";

export default async function AdminProductCategoriesPage() {
  const categories = await listAdminProductCategories();
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Categories</h1>
          <p>Create and edit product category structure.</p>
        </div>
        <Link className="payload-button" href="/admin/product-categories/new">
          New Category
        </Link>
      </div>
      <div className="payload-table-wrap">
        <table className="payload-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Parent</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <Link href={`/admin/product-categories/${category.id}`}>{category.title}</Link>
                </td>
                <td>{category.slug}</td>
                <td>{category.parentId ? categoriesById.get(category.parentId)?.title ?? "Unknown" : "None"}</td>
                <td>{category.description ?? ""}</td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td className="payload-empty-cell" colSpan={4}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
