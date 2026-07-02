import { FrontendDataClient, type LocaleCode, type Post, type Product, type ProductCategory } from "@global-trade/core";
import { unstable_cache } from "next/cache";
import { cacheTags, FRONTEND_REVALIDATE_SECONDS } from "./cache-tags";
import { mockPosts } from "./mock-data";
import { getStaticCategories, getStaticProducts } from "./static-content";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "./supabase";
import { shouldUseStaticStorefrontData } from "./storefront-mode";

export async function listProducts(locale?: LocaleCode): Promise<Product[]> {
  if (shouldUseStaticStorefrontData(isSupabaseConfigured())) return getStaticProducts(locale);
  try {
    return await getCachedProducts();
  } catch {
    return getStaticProducts(locale);
  }
}

export async function getProduct(slug: string, locale?: LocaleCode): Promise<Product | null> {
  if (shouldUseStaticStorefrontData(isSupabaseConfigured())) return getStaticProducts(locale).find((product) => product.slug === slug) ?? null;
  try {
    return await getCachedProduct(slug);
  } catch {
    return getStaticProducts(locale).find((product) => product.slug === slug) ?? null;
  }
}

export async function listCategories(locale?: LocaleCode): Promise<ProductCategory[]> {
  if (shouldUseStaticStorefrontData(isSupabaseConfigured())) return getStaticCategories(locale);
  try {
    return await getCachedCategories();
  } catch {
    return getStaticCategories(locale);
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (shouldUseStaticStorefrontData(isSupabaseConfigured())) return mockPosts.find((post) => post.slug === slug) ?? null;
  try {
    return await getCachedPost(slug);
  } catch {
    return mockPosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function listPosts(): Promise<Post[]> {
  if (shouldUseStaticStorefrontData(isSupabaseConfigured())) return mockPosts;
  try {
    return await getCachedPosts();
  } catch {
    return mockPosts;
  }
}

const getCachedProducts = unstable_cache(
  async () => new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).listProducts(200),
  ["products-list"],
  { tags: [cacheTags.productsList], revalidate: FRONTEND_REVALIDATE_SECONDS }
);

const getCachedCategories = unstable_cache(
  async () => new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).listCategories(),
  ["product-categories"],
  { tags: [cacheTags.productCategories], revalidate: FRONTEND_REVALIDATE_SECONDS }
);

const getCachedPosts = unstable_cache(
  async () => new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).listPosts(200),
  ["posts-list"],
  { tags: [cacheTags.postsList], revalidate: FRONTEND_REVALIDATE_SECONDS }
);

function getCachedProduct(slug: string) {
  return unstable_cache(
    async () => new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).getProductBySlug(slug),
    ["product", slug],
    { tags: [cacheTags.product(slug)], revalidate: FRONTEND_REVALIDATE_SECONDS }
  )();
}

function getCachedPost(slug: string) {
  return unstable_cache(
    async () => new FrontendDataClient({ supabase: createBrowserSupabaseClient() }).getPostBySlug(slug),
    ["post", slug],
    { tags: [cacheTags.post(slug)], revalidate: FRONTEND_REVALIDATE_SECONDS }
  )();
}
