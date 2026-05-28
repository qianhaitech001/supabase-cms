import type { SeoAdapter } from "../types";

export const yoastSeoAdapter: SeoAdapter = {
  id: "yoast",
  detect(meta) {
    return "_yoast_wpseo_title" in meta || "_yoast_wpseo_metadesc" in meta;
  },
  map(meta) {
    return compactUndefined({
      title: stringValue(meta._yoast_wpseo_title),
      description: stringValue(meta._yoast_wpseo_metadesc),
      canonicalUrl: stringValue(meta._yoast_wpseo_canonical),
      noindex: stringValue(meta._yoast_wpseo_meta_robots_noindex) === "1"
    });
  }
};

export const rankMathSeoAdapter: SeoAdapter = {
  id: "rank-math",
  detect(meta) {
    return "rank_math_title" in meta || "rank_math_description" in meta;
  },
  map(meta) {
    return compactUndefined({
      title: stringValue(meta.rank_math_title),
      description: stringValue(meta.rank_math_description),
      canonicalUrl: stringValue(meta.rank_math_canonical_url),
      noindex: String(meta.rank_math_robots ?? "").includes("noindex")
    });
  }
};

export const defaultSeoAdapters: SeoAdapter[] = [yoastSeoAdapter, rankMathSeoAdapter];

export function mapSeo(meta: Record<string, unknown>, adapters = defaultSeoAdapters) {
  const adapter = adapters.find((candidate) => candidate.detect(meta));
  return {
    pluginId: adapter?.id,
    seo: adapter?.map(meta) ?? {}
  };
}

function stringValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function compactUndefined<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as T;
}
