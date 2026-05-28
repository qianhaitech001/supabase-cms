import type { ProductCategory } from "@global-trade/core";
import { saveProductCategoryAction } from "@/app/(admin)/admin/actions";

export function ProductCategoryForm({
  category,
  categories
}: {
  category?: Partial<ProductCategory>;
  categories: ProductCategory[];
}) {
  const parentOptions = categories.filter((item) => item.id !== category?.id);

  return (
    <form action={saveProductCategoryAction} className="payload-form">
      {category?.id && <input name="id" type="hidden" value={category.id} />}
      <section className="payload-form-section">
        <h2>Category</h2>
        <div className="payload-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required defaultValue={category?.title ?? ""} />
        </div>
        <div className="payload-field">
          <label htmlFor="displayTitle">Display title</label>
          <input id="displayTitle" name="displayTitle" defaultValue={category?.displayTitle ?? ""} />
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
        <div className="payload-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={category?.description ?? ""} />
        </div>
      </section>
      <section className="payload-form-section">
        <h2>SEO</h2>
        <div className="payload-field">
          <label htmlFor="seoTitle">SEO title</label>
          <input id="seoTitle" name="seoTitle" defaultValue={category?.seo?.title ?? ""} />
        </div>
        <div className="payload-field">
          <label htmlFor="seoDescription">SEO description</label>
          <textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={category?.seo?.description ?? ""} />
        </div>
        <div className="payload-field">
          <label htmlFor="seoCanonicalUrl">Canonical URL</label>
          <input id="seoCanonicalUrl" name="seoCanonicalUrl" defaultValue={category?.seo?.canonicalUrl ?? ""} />
        </div>
        <div className="payload-field">
          <label htmlFor="seoOgImageUrl">OG image URL</label>
          <input id="seoOgImageUrl" name="seoOgImageUrl" defaultValue={category?.seo?.ogImageUrl ?? ""} />
        </div>
        <label className="payload-checkbox">
          <input name="seoNoindex" type="checkbox" defaultChecked={category?.seo?.noindex ?? false} />
          <span>Noindex</span>
        </label>
      </section>
      <button className="payload-button" type="submit">
        Save category
      </button>
    </form>
  );
}
