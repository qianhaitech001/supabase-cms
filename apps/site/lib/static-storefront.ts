import type { Product } from "@global-trade/core";
import { inshowAssets } from "./inshow-assets";

export type StaticHeroSlide = {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  logoUrl?: string | undefined;
  title: string;
  description?: string | undefined;
  ctaLabel: string;
  ctaHref: string;
};

export const staticHeroSlides: StaticHeroSlide[] = [
  {
    id: "inshow-future",
    mediaUrl: inshowAssets.heroVideo,
    mediaType: "video",
    logoUrl: inshowAssets.logo,
    title: "Contributing to the Society by Manufacturing Products that Create the Future",
    description: "Full range customization for building systems, materials, and smart home solutions.",
    ctaLabel: "Know More",
    ctaHref: "/about-us"
  },
  {
    id: "prefab-house",
    mediaUrl: inshowAssets.categoryPrefab,
    mediaType: "image",
    title: "Prefab house systems for global project delivery",
    description: "Use the same component contract for static pages and Supabase-backed product data.",
    ctaLabel: "View Products",
    ctaHref: "/products"
  },
  {
    id: "building-materials",
    mediaUrl: inshowAssets.categoryMaterials,
    mediaType: "image",
    title: "Integrated building materials and fit-out sourcing",
    description: "Static storefronts can still show rich categories, contact paths, media, and SEO-ready content.",
    ctaLabel: "Explore Range",
    ctaHref: "/products"
  }
];

export const staticContact = {
  email: "info/sales@inshowhome.com",
  salesEmail: "sales@cbhtglobal.com",
  phone: "+86 136-8588-2988",
  whatsapp: "+8613685882988",
  address: "Room.1030, No.1 Building, Logistic Center, Meishan Harbour Ningbo Zhejiang",
  mapImage: inshowAssets.contactMap,
  socialLinks: [
    { label: "Email", href: "mailto:info/sales@inshowhome.com" },
    { label: "WhatsApp", href: "https://wa.me/8613685882988" },
    { label: "Phone", href: "tel:+8613685882988" }
  ]
};

export function getStaticProductVideos(product: Product): string[] {
  const meta = product.legacyMeta ?? {};
  const candidates = [
    meta.video,
    meta.videoUrl,
    meta.video_url,
    meta.productVideo,
    meta.product_video,
    meta.videos,
    meta.videoUrls,
    meta.video_urls
  ];

  return candidates
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => typeof value === "string" && /^https:\/\//i.test(value));
}
