export interface RewriteMediaResult {
  html: string;
  urls: string[];
}

const srcRegex = /\b(?:src|href)=["']([^"']*\/wp-content\/uploads\/[^"']+)["']/gi;

export function extractWordPressMediaUrls(html: string, sourceSiteUrl: string): string[] {
  const urls = new Set<string>();
  for (const match of html.matchAll(srcRegex)) {
    const raw = match[1];
    if (!raw) continue;
    urls.add(toAbsoluteUrl(raw, sourceSiteUrl));
  }
  return [...urls];
}

export function rewriteMediaUrls(html: string, mapping: Map<string, string>, sourceSiteUrl: string): RewriteMediaResult {
  const urls: string[] = [];
  const rewritten = html.replace(srcRegex, (full, raw: string) => {
    const absolute = toAbsoluteUrl(raw, sourceSiteUrl);
    const replacement = mapping.get(absolute);
    if (!replacement) {
      urls.push(absolute);
      return full;
    }
    return full.replace(raw, replacement);
  });
  return { html: rewritten, urls };
}

export function storagePathForSourceUrl(sourceUrl: string): string {
  const url = new URL(sourceUrl);
  return url.pathname.replace(/^\/+/, "").replace(/[^a-zA-Z0-9./_-]/g, "-");
}

function toAbsoluteUrl(raw: string, sourceSiteUrl: string): string {
  return new URL(raw, sourceSiteUrl).toString();
}
