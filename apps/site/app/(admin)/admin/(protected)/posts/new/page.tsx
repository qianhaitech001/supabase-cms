import { PostForm } from "@/components/admin/PostForm";
import { listAdminPostCategories } from "@/lib/admin-data";

export default async function NewPostPage() {
  const categories = await listAdminPostCategories();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>New Post</h1>
          <p>Create a draft post, then publish it when ready.</p>
        </div>
      </div>
      <PostForm categories={categories} />
    </div>
  );
}
