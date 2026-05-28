import type { PostCategory } from "@global-trade/core";
import { savePostCategoryAction } from "@/app/(admin)/admin/actions";

export function PostCategoryForm({
  category,
  categories
}: {
  category?: Partial<PostCategory>;
  categories: PostCategory[];
}) {
  const parentOptions = categories.filter((item) => item.id !== category?.id);

  return (
    <form action={savePostCategoryAction} className="payload-form">
      {category?.id && <input name="id" type="hidden" value={category.id} />}
      <section className="payload-form-section">
        <h2>Category</h2>
        <div className="payload-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required defaultValue={category?.title ?? ""} />
        </div>
        <div className="payload-field">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={category?.slug ?? ""} />
        </div>
        <div className="payload-field">
          <label htmlFor="parentId">Parent category</label>
          <select id="parentId" name="parentId" defaultValue={category?.parentId ?? ""}>
            <option value="">No parent</option>
            {parentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </section>
      <button className="payload-button" type="submit">
        Save category
      </button>
    </form>
  );
}
