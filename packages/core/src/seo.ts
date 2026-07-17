import type { Product, SeoFields, SiteConfig } from "./types";
import { toPlainText } from "./text";

export interface MetadataLike {
  title: string;
  description: string;
  canonicalUrl?: string;
  openGraph: {
    title: string;
    description: string;
    url?: string;
    images: string[];
  };
  robots?: {
    index: boolean;
    follow: boolean;
  };
}

export function createMetadata(config: SiteConfig, seo?: SeoFields, path = "/"): MetadataLike {
  const canonicalUrl = seo?.canonicalUrl ?? absoluteUrl(config.domain, path);
  const title = seo?.title ?? config.defaultSeo.title ?? config.name;
  const description = toPlainText(seo?.description ?? config.defaultSeo.description ?? "");
  const image = seo?.ogImageUrl ?? config.defaultSeo.ogImageUrl;

  const metadata: MetadataLike = {
    title,
    description,
    canonicalUrl,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: image ? [image] : []
    }
  };

  if (seo?.noindex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export function seoForFixedPage(config: SiteConfig, page: keyof NonNullable<SiteConfig["pageSeo"]>): SeoFields | undefined {
  return config.pageSeo?.[page];
}

export function createProductJsonLd(config: SiteConfig, product: Product): Record<string, unknown> {
  const imageUrls = [
    product.primaryImage?.publicUrl,
    ...(product.gallery ?? []).map((asset) => asset.publicUrl)
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: toPlainText(product.summary ?? product.seo?.description ?? config.defaultSeo.description),
    image: imageUrls,
    url: absoluteUrl(config.domain, `/products/${product.slug}`),
    brand: {
      "@type": "Brand",
      name: config.name
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "USD",
      url: absoluteUrl(config.domain, `/products/${product.slug}`)
    }
  };
}

export function absoluteUrl(domain: string, path: string): string {
  const normalizedDomain = domain.startsWith("http") ? domain : `https://${domain}`;
  return new URL(path, normalizedDomain).toString();
}
