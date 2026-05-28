import type { Product, ProductCategory, Post, PostCategory } from "@global-trade/core";

export const mockCategories: ProductCategory[] = [
  { id: "prefab", slug: "prefab-house", title: "Prefab House", description: "Modular and prefabricated building systems." },
  { id: "materials", slug: "building-materials", title: "Building Materials", description: "Interior and exterior materials for projects." },
  { id: "smart", slug: "smart-home", title: "Smart Home", description: "Connected devices for modern spaces." }
];

export const mockPostCategories: PostCategory[] = [
  { id: "news", slug: "industry-news", title: "Industry News" },
  { id: "tutorials", slug: "tutorials", title: "Tutorials" },
  { id: "company", slug: "company-updates", title: "Company Updates" }
];

export const mockProducts: Product[] = [
  {
    id: "1",
    slug: "light-steel-villa",
    title: "Light Steel Villa",
    status: "published",
    summary: "Customizable light steel villas for residential projects.",
    richText: "<p>Engineered for fast installation, durability, and flexible layouts.</p>",
    categoryIds: ["prefab"],
    specifications: [
      { name: "Structure", value: "Light steel", group: "General" },
      { name: "Usage", value: "Residential", group: "General" }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    slug: "modern-kitchen-cabinet",
    title: "Modern Kitchen Cabinet",
    status: "published",
    summary: "Project-ready kitchen cabinet systems with configurable finishes.",
    richText: "<p>Designed for apartments, villas, and hospitality interiors.</p>",
    categoryIds: ["materials"],
    specifications: [{ name: "Finish", value: "Custom", group: "Material" }],
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    slug: "smart-door-lock",
    title: "Smart Door Lock",
    status: "published",
    summary: "Smart access control for homes, hotels, and serviced apartments.",
    richText: "<p>Supports PIN, card, app, and fingerprint access modes.</p>",
    categoryIds: ["smart"],
    specifications: [{ name: "Access", value: "PIN / Card / App / Fingerprint", group: "Features" }],
    updatedAt: new Date().toISOString()
  }
];

export const mockPosts: Post[] = [
  {
    id: "post-1",
    slug: "how-to-plan-prefab-projects",
    title: "How to Plan a Prefab Housing Project",
    status: "published",
    excerpt: "A practical guide for evaluating scope, timeline, and supplier readiness.",
    richText: "<p>Start with site requirements, budget, climate, and local compliance.</p>",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
