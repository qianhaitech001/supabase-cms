export function slugify(input: string, fallback = "item"): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || fallback;
}

export function uniqueSlug(base: string, existing: Set<string>): string {
  const normalized = slugify(base);
  if (!existing.has(normalized)) {
    existing.add(normalized);
    return normalized;
  }

  let suffix = 2;
  while (existing.has(`${normalized}-${suffix}`)) {
    suffix += 1;
  }

  const value = `${normalized}-${suffix}`;
  existing.add(value);
  return value;
}
