import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getAdminPost, listAdminPostCategories } from "@/lib/admin-data";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getAdminPost(id), listAdminPostCategories()]);
  if (!post) notFound();

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Edit Post</h1>
          <p>{post.title}</p>
        </div>
      </div>
      <PostForm post={post} categories={categories} />
    </div>
  );
}
