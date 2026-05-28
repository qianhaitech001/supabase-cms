import { slugify, type PublishStatus } from "@global-trade/core";
import { XMLParser } from "fast-xml-parser";
import { extractWordPressMediaUrls } from "../adapters/media";
import { mapSeo } from "../adapters/seo";
import type { MigrationEntity, MigrationWarning } from "../types";

export interface ParsedWxr {
  entities: MigrationEntity[];
  warnings: MigrationWarning[];
  detectedSeoPlugins: string[];
}

interface WxrItem {
  title?: string;
  link?: string;
  pubDate?: string;
  "content:encoded"?: string;
  "excerpt:encoded"?: string;
  "wp:post_id"?: number | string;
  "wp:post_name"?: string;
  "wp:post_type"?: string;
  "wp:status"?: string;
  "wp:post_date"?: string;
  "wp:post_date_gmt"?: string;
  "wp:post_modified"?: string;
  "wp:post_modified_gmt"?: string;
  "wp:creator"?: string;
  "wp:attachment_url"?: string;
  "wp:postmeta"?: WxrMeta | WxrMeta[];
  category?: WxrCategory | WxrCategory[];
}

interface WxrMeta {
  "wp:meta_key"?: string;
  "wp:meta_value"?: string;
}

interface WxrCategory {
  "@_domain"?: string;
  "@_nicename"?: string;
  "#text"?: string;
}

export function parseWordPressWxr(xml: string, sourceSiteUrl: string): ParsedWxr {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "#text",
    trimValues: false,
    parseTagValue: false
  });
  const parsed = parser.parse(xml);
  const rawItems = parsed?.rss?.channel?.item;
  const items: WxrItem[] = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
  const entities: MigrationEntity[] = [];
  const warnings: MigrationWarning[] = [];
  const detectedSeoPlugins = new Set<string>();

  for (const item of items) {
    const postType = item["wp:post_type"];
    if (postType !== "post" && postType !== "page" && postType !== "attachment") continue;

    const sourceId = String(item["wp:post_id"] ?? item.link ?? item.title ?? cryptoRandomFallback());
    const source = compactUndefined({
      siteUrl: sourceSiteUrl,
      sourceType: `wordpress:${postType}`,
      sourceId,
      sourceSlug: item["wp:post_name"] || undefined,
      sourceUrl: item.link
    });

    if (postType === "attachment") {
      const sourceUrl = item["wp:attachment_url"] ?? item.link;
      if (sourceUrl) {
        entities.push({
          kind: "media",
          source,
          data: compactUndefined({
            sourceUrl,
            title: item.title
          })
        });
      }
      continue;
    }

    const meta = normalizeMeta(item["wp:postmeta"]);
    const { pluginId, seo } = mapSeo(meta);
    if (pluginId) detectedSeoPlugins.add(pluginId);

    const status: PublishStatus = item["wp:status"] === "publish" ? "published" : "draft";
    const richText = item["content:encoded"] ?? "";
    const taxonomies = normalizeCategories(item.category);
    const postCategoryIds: string[] = [];
    const postTagIds: string[] = [];

    for (const category of taxonomies.filter((row) => row.domain === "category")) {
      const slug = category.slug || slugify(category.title);
      postCategoryIds.push(slug);
      entities.push({
        kind: "postCategory",
        source: {
          siteUrl: sourceSiteUrl,
          sourceType: "wordpress:category",
          sourceId: slug,
          sourceSlug: slug,
          sourceUrl: new URL(`/category/${slug}/`, sourceSiteUrl).toString()
        },
        data: {
          slug,
          title: category.title,
          source: {
            siteUrl: sourceSiteUrl,
            sourceType: "wordpress:category",
            sourceId: slug,
            sourceSlug: slug,
            sourceUrl: new URL(`/category/${slug}/`, sourceSiteUrl).toString()
          }
        }
      });
    }

    for (const tag of taxonomies.filter((row) => row.domain === "post_tag")) {
      const slug = tag.slug || slugify(tag.title);
      postTagIds.push(slug);
      entities.push({
        kind: "postTag",
        source: {
          siteUrl: sourceSiteUrl,
          sourceType: "wordpress:post-tag",
          sourceId: slug,
          sourceSlug: slug,
          sourceUrl: new URL(`/tag/${slug}/`, sourceSiteUrl).toString()
        },
        data: {
          slug,
          title: tag.title,
          source: {
            siteUrl: sourceSiteUrl,
            sourceType: "wordpress:post-tag",
            sourceId: slug,
            sourceSlug: slug,
            sourceUrl: new URL(`/tag/${slug}/`, sourceSiteUrl).toString()
          }
        }
      });
    }

    const mediaUrls = extractWordPressMediaUrls(richText, sourceSiteUrl);
    for (const mediaUrl of mediaUrls) {
      entities.push({
        kind: "media",
        source: {
          siteUrl: sourceSiteUrl,
          sourceType: "wordpress:embedded-media",
          sourceId: mediaUrl,
          sourceUrl: mediaUrl
        },
        data: {
          sourceUrl: mediaUrl
        }
      });
    }

    const base = {
      slug: item["wp:post_name"] || slugify(item.title ?? sourceId),
      title: item.title ?? "Untitled",
      status,
      richText,
      seo,
      source
    };

    if (postType === "post") {
      entities.push({
        kind: "post",
        source,
        data: compactUndefined({
          ...base,
          author: item["wp:creator"] || undefined,
          excerpt: item["excerpt:encoded"] || undefined,
          publishedAt: parseDate(item.pubDate ?? item["wp:post_date_gmt"] ?? item["wp:post_date"]),
          modifiedAt: parseDate(item["wp:post_modified_gmt"] ?? item["wp:post_modified"]),
          categoryIds: postCategoryIds,
          tagIds: postTagIds
        })
      });
    } else {
      entities.push({
        kind: "page",
        source,
        data: base
      });
    }
  }

  if (items.length === 0) {
    warnings.push({
      code: "wxr.empty",
      message: "No WordPress items were detected in the XML file.",
      severity: "warning"
    });
  }

  return {
    entities,
    warnings,
    detectedSeoPlugins: [...detectedSeoPlugins]
  };
}

function normalizeCategories(input: WxrCategory | WxrCategory[] | undefined): Array<{ domain: string; slug: string; title: string }> {
  const rows = Array.isArray(input) ? input : input ? [input] : [];
  return rows
    .map((row) => ({
      domain: row["@_domain"] ?? "",
      slug: row["@_nicename"] ?? "",
      title: row["#text"] ?? row["@_nicename"] ?? ""
    }))
    .filter((row) => row.domain && row.title);
}

function parseDate(input: string | undefined): string | undefined {
  if (!input) return undefined;
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function normalizeMeta(input: WxrMeta | WxrMeta[] | undefined): Record<string, string> {
  const rows = Array.isArray(input) ? input : input ? [input] : [];
  const output: Record<string, string> = {};
  for (const row of rows) {
    if (!row["wp:meta_key"]) continue;
    output[row["wp:meta_key"]] = row["wp:meta_value"] ?? "";
  }
  return output;
}

function cryptoRandomFallback(): string {
  return Math.random().toString(36).slice(2);
}

function compactUndefined<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as T;
}
