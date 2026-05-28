import Link from "next/link";
import {
  deletePostAction,
  updatePostStatusAction,
} from "@/app/(admin)/admin/actions";
import { listAdminPostCategories, listAdminPosts } from "@/lib/admin-data";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const [{ error, success }, posts, categories] = await Promise.all([
    searchParams,
    listAdminPosts(),
    listAdminPostCategories(),
  ]);
  const categoriesById = new Map(categories.map(c => [c.id, c]));

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>Posts</h1>
          <p>Create and edit news or article content.</p>
        </div>
        <Link className="payload-button" href="/admin/posts/new">
          New Post
        </Link>
      </div>

      {error && (
        <div className="payload-alert payload-alert--danger">{error}</div>
      )}
      {success && (
        <div className="payload-alert payload-alert--success">{success}</div>
      )}

      <div className="payload-table-wrap">
        <table className="payload-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Categories</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => {
              const postCategories = (post.categoryIds ?? [])
                .map(id => categoriesById.get(id)?.title)
                .filter(Boolean);

              return (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>
                    <span className="payload-categories-cell">
                      {postCategories.length > 0
                        ? postCategories.join(", ")
                        : "Uncategorized"}
                    </span>
                  </td>
                  <td>
                    <span className={`payload-status payload-status--${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>
                    {new Date(
                      post.publishedAt ?? post.updatedAt
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="payload-table-actions">
                      <Link
                        className="payload-button payload-button--small"
                        href={`/admin/posts/${post.id}`}
                      >
                        Edit
                      </Link>
                      {post.status === "published" && (
                        <form action={updatePostStatusAction} className="payload-inline-form">
                          <input name="id" type="hidden" value={post.id} />
                          <input name="status" type="hidden" value="draft" />
                          <button
                            className="payload-button payload-button--ghost payload-button--small"
                            type="submit"
                          >
                            Revert to Draft
                          </button>
                        </form>
                      )}
                      <form action={deletePostAction}>
                        <input name="id" type="hidden" value={post.id} />
                        <button
                          className="payload-button payload-button--danger payload-button--small"
                          type="submit"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {posts.length === 0 && (
              <tr>
                <td className="payload-empty-cell" colSpan={5}>
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
