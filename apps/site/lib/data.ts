import { FrontendDataClient, type Post, type Product, type ProductCategory } from "@global-trade/core";
import { mockCategories, mockPosts, mockProducts } from "./mock-data";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "./supabase";

export async function listProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return mockProducts;
  try {
    return await new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).listProducts(100);
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return mockProducts.find((product) => product.slug === slug) ?? null;
  try {
    return await new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).getProductBySlug(slug);
  } catch {
    return null;
  }
}

export async function listCategories(): Promise<ProductCategory[]> {
  if (!isSupabaseConfigured()) return mockCategories;
  try {
    return await new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).listCategories();
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return mockPosts.find((post) => post.slug === slug) ?? null;
  try {
    return await new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).getPostBySlug(slug);
  } catch {
    return null;
  }
}

export async function listPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return mockPosts;
  const client = createBrowserSupabaseClient();
  try {
    const { data, error } = await client.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false });
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
      author: row.author ?? undefined,
      excerpt: row.excerpt ?? undefined,
      richText: row.rich_text,
      publishedAt: row.published_at ?? undefined,
      modifiedAt: row.modified_at ?? undefined,
      categoryIds: row.category_ids ?? [],
      tagIds: row.tag_ids ?? [],
      featuredImage: row.featured_image ?? undefined,
      seo: row.seo ?? undefined,
      source: row.source ?? undefined,
      updatedAt: row.updated_at
    }));
  } catch {
    return [];
  }
}
