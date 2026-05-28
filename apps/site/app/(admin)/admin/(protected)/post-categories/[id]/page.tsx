import { notFound } from "next/navigation";
import { PostCategoryForm } from "@/components/admin/PostCategoryForm";
import { getAdminPostCategory, listAdminPostCategories } from "@/lib/admin-data";

export default async function EditPostCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, categories] = await Promise.all([getAdminPostCategory(id), listAdminPostCategories()]);
  if (!category) notFound();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Edit Category</h1>
          <p>{category.title}</p>
        </div>
      </div>
      <PostCategoryForm category={category} categories={categories} />
    </div>
  );
}
