import type { MediaAsset, Post, PostCategory, Product, ProductCategory } from "@global-trade/core";
import { inshowAssets } from "./inshow-assets";

function remoteMedia(id: string, publicUrl: string, title: string): MediaAsset {
  return {
    id,
    kind: "remote",
    publicUrl,
    sourceUrl: publicUrl,
    storagePath: publicUrl,
    title,
    alt: title
  };
}

export const mockCategories: ProductCategory[] = [
  {
    id: "prefab",
    slug: "prefab-house",
    title: "Prefab House",
    description: "Modular and prefabricated building systems.",
    image: remoteMedia("cat-prefab", inshowAssets.categoryPrefab, "Prefab House")
  },
  {
    id: "container-house",
    slug: "container-house",
    title: "- Container House",
    displayTitle: "Container House",
    parentId: "prefab",
    description: "Fast-build modular container systems for project sites."
  },
  {
    id: "light-steel-villa",
    slug: "light-steel-villa",
    title: "- Light Steel Villa",
    displayTitle: "Light Steel Villa",
    parentId: "prefab",
    description: "Light steel villa structures for residential projects."
  },
  {
    id: "materials",
    slug: "building-materials",
    title: "Building Materials",
    description: "Interior and exterior materials for projects.",
    image: remoteMedia("cat-materials", inshowAssets.categoryMaterials, "Building Materials")
  },
  {
    id: "kitchen",
    slug: "kitchen",
    title: "- Kitchen",
    displayTitle: "Kitchen",
    parentId: "materials",
    description: "Cabinet, sink, hardware, and kitchen fit-out materials."
  },
  {
    id: "smart",
    slug: "smart-home",
    title: "Smart Home",
    description: "Connected devices for modern spaces.",
    image: remoteMedia("cat-smart", inshowAssets.categorySmartHome, "Smart Home")
  },
  {
    id: "motorized-blinds",
    slug: "motorized-blinds",
    title: "- Motorized Blinds",
    displayTitle: "Motorized Blinds",
    parentId: "smart",
    description: "Motorized shades and control systems."
  }
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
    categoryIds: ["prefab", "light-steel-villa"],
    primaryImage: remoteMedia("product-light-steel-villa", inshowAssets.categoryPrefab, "Light Steel Villa"),
    gallery: [
      remoteMedia("product-light-steel-villa-1", inshowAssets.categoryPrefab, "Light Steel Villa exterior"),
      remoteMedia("product-light-steel-villa-2", inshowAssets.projectCanberra, "Light Steel Villa project")
    ],
    specifications: [
      { name: "Structure", value: "Light steel", group: "General" },
      { name: "Usage", value: "Residential", group: "General" }
    ],
    legacyMeta: { videos: [inshowAssets.heroVideo] },
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    slug: "modern-kitchen-cabinet",
    title: "Modern Kitchen Cabinet",
    status: "published",
    summary: "Project-ready kitchen cabinet systems with configurable finishes.",
    richText: "<p>Designed for apartments, villas, and hospitality interiors.</p>",
    categoryIds: ["materials", "kitchen"],
    primaryImage: remoteMedia("product-kitchen-cabinet", inshowAssets.categoryMaterials, "Modern Kitchen Cabinet"),
    gallery: [
      remoteMedia("product-kitchen-cabinet-1", inshowAssets.categoryMaterials, "Kitchen cabinet materials"),
      remoteMedia("product-kitchen-cabinet-2", inshowAssets.projectExpoKorea, "Kitchen fit-out project")
    ],
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
    categoryIds: ["smart", "motorized-blinds"],
    primaryImage: remoteMedia("product-smart-door-lock", inshowAssets.categorySmartHome, "Smart Door Lock"),
    gallery: [
      remoteMedia("product-smart-door-lock-1", inshowAssets.categorySmartHome, "Smart home interior"),
      remoteMedia("product-smart-door-lock-2", inshowAssets.projectPerth, "Smart home project")
    ],
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
