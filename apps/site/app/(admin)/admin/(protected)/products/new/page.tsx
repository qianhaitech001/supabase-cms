import { ProductForm } from "@/components/admin/ProductForm";
import { listAdminProductCategories } from "@/lib/admin-data";

export default async function NewProductPage() {
  const categories = await listAdminProductCategories();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>New Product</h1>
          <p>Create a product catalog entry.</p>
        </div>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
