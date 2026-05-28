import { ProductCategoryForm } from "@/components/admin/ProductCategoryForm";
import { listAdminProductCategories } from "@/lib/admin-data";

export default async function NewProductCategoryPage() {
  const categories = await listAdminProductCategories();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>New Category</h1>
          <p>Create a category for product catalog organization.</p>
        </div>
      </div>
      <ProductCategoryForm categories={categories} />
    </div>
  );
}
