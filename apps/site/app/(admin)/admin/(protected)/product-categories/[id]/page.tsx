import { notFound } from "next/navigation";
import { ProductCategoryForm } from "@/components/admin/ProductCategoryForm";
import { getAdminProductCategory, listAdminProductCategories } from "@/lib/admin-data";

export default async function EditProductCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, categories] = await Promise.all([getAdminProductCategory(id), listAdminProductCategories()]);
  if (!category) notFound();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Edit Category</h1>
          <p>{category.title}</p>
        </div>
      </div>
      <ProductCategoryForm category={category} categories={categories} />
    </div>
  );
}
