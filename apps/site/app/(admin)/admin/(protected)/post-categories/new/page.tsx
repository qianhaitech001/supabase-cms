import { PostCategoryForm } from "@/components/admin/PostCategoryForm";
import { listAdminPostCategories } from "@/lib/admin-data";

export default async function NewPostCategoryPage() {
  const categories = await listAdminPostCategories();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>New Category</h1>
          <p>Create a category for post organization.</p>
        </div>
      </div>
      <PostCategoryForm categories={categories} />
    </div>
  );
}
