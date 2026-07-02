# Frontend Page Generation Contract

Use this document when an AI tool generates or modifies storefront pages. It extends `docs/ai-development-contract.md`; if rules conflict, the main AI development contract wins.

## Goal

Backend developers should be able to ask an AI tool to create frontend pages without producing invented data models, ad hoc Supabase queries, or inconsistent UI. The generated page must match the existing CMS data contracts and deployment constraints.

## Required Context Before Writing Code

Before generating page code, inspect these files as needed:

- `packages/core/src/types.ts`: public frontend types such as `Product`, `ProductCategory`, `Post`, `Page`, `SiteConfig`, `MediaAsset`, `SeoFields`, and `Inquiry`.
- `packages/core/src/frontend-client.ts`: how database rows are mapped into frontend typed data.
- `apps/site/lib/data.ts`: storefront data helper entry points and cache behavior.
- `apps/site/lib/cache-tags.ts`: cache tags and revalidation behavior.
- `apps/site/lib/frontend-helpers.ts`: category/path helper functions.
- `apps/site/lib/storefront-theme.ts`: storefront visual tone presets and allowed theme values.
- `supabase/schema.sql`: authoritative database schema and column names.
- Existing page examples under `apps/site/app/(frontend)` and shared components under `apps/site/components`.
- Storefront feature components under `apps/site/components/storefront`.
- Dual-architecture status in `docs/frontend-dual-architecture-gap-analysis.md`.

Do not invent fields, tables, API responses, or relationships. If the required data does not exist in the typed contracts or schema, stop and add a clear implementation note instead of guessing.

## Data Access Rules

- Storefront pages should consume data through `apps/site/lib` helpers and `packages/core` types.
- Static and Supabase storefront branches must share the same UI components. Switch data through `STOREFRONT_DATA_MODE` and `apps/site/lib/data.ts`, not by forking route UI.
- Do not scatter raw Supabase queries inside page components or presentational components.
- Do not use mock data in production logic except through existing fallback helpers.
- Do not infer category names, image fields, SEO fields, prices, stock, inquiry fields, or media URLs from screenshots.
- If a page needs new data:
  - add or extend a typed contract in `packages/core`;
  - add runtime access in `apps/site/lib`;
  - add schema or migration only when the database lacks the field;
  - preserve existing records and old migrated data.

## Current Public Data Shapes

Use these public types instead of invented props:

- `Product`: `id`, `slug`, `title`, `status`, `sku`, `productType`, `summary`, `richText`, `legacyHtml`, `categoryIds`, `tagIds`, `primaryImage`, `gallery`, `specifications`, `regularPrice`, `salePrice`, `currency`, `priceText`, `stockStatus`, `stockQuantity`, `seo`, `source`, `updatedAt`.
- `ProductCategory`: `id`, `slug`, `title`, `displayTitle`, `description`, `parentId`, `image`, `seo`, `source`.
- `Post`: `id`, `slug`, `title`, `status`, `author`, `excerpt`, `richText`, `publishedAt`, `modifiedAt`, `categoryIds`, `tagIds`, `featuredImage`, `seo`, `source`, `updatedAt`.
- `Page`: `id`, `slug`, `title`, `status`, `richText`, `seo`, `source`, `updatedAt`.
- `MediaAsset`: `id`, `kind`, `sourceUrl`, `storagePath`, `publicUrl`, `alt`, `title`, `caption`, `mimeType`, `width`, `height`, `source`.
- `SiteConfig`: `name`, `domain`, `locale`, `logoUrl`, contact fields, `defaultSeo`, `pageSeo`, `navigation`, `footer`, optional `i18n`, optional `media`.
- `Inquiry`: standard contact fields plus `formType`, `subject`, `payload`, `fieldLabels`, and `metadata`.

Database column names are snake_case; UI-facing types are camelCase through `packages/core/src/frontend-client.ts`.

## Page Structure Rules

- Keep route-level data loading in the page or server component layer.
- Keep presentational UI in reusable components when logic repeats. New storefront feature UI should usually live in `apps/site/components/storefront`.
- Handle empty states for product lists, category lists, news lists, and search results.
- Handle missing optional fields without layout breakage.
- Render migrated HTML with the existing sanitized/rendering pattern; do not parse arbitrary HTML with new ad hoc regex logic.
- Use existing `revalidate` and cache-tag patterns when pages depend on admin-managed data.

## SEO Rules

- Use site settings and `SeoFields` from typed data.
- Do not inherit old WordPress `noindex,nofollow`.
- Product, category, post, and fixed pages should prefer item-level SEO, then page/site defaults.
- Never hardcode production domains unless the task explicitly requires it.

## Media Rules

- Use `MediaAsset.publicUrl` or existing remote URLs.
- Imported WordPress/WooCommerce media remains remote.
- New upload flows must go through the storage adapter; page generation should not create upload logic unless explicitly requested.
- Do not rewrite remote media URLs to Supabase, UpYun, or Ali OSS inside frontend page code.

## Inquiry And Form Rules

- Contact and product inquiry forms must submit through the existing inquiry API contract.
- Use `formType` and structured payload fields instead of creating a new table or route for each form.
- Do not expose SMTP, service-role keys, or storage credentials in frontend code.

## UI Rules

- Use existing Tailwind tokens, shadcn-style primitives, and storefront components.
- Preserve the current storefront tone unless the task explicitly asks for a redesign.
- Visual tone must be controlled through `STOREFRONT_THEME` and `.storefront-shell` CSS variables. New pages should use variables such as `--storefront-primary`, `--storefront-ink`, `--storefront-surface`, `--storefront-radius-*`, and `--storefront-shadow` instead of hardcoding one site's colors, radius, shadows, and button style.
- Do not fork route UI only to create another visual style. Keep reusable layout in `apps/site/components/storefront`, and make the tone configurable.
- Pages must be responsive. Do not rely on desktop-only layouts.
- Avoid inline styles except for unavoidable dynamic values.
- Do not add heavy animation, carousels, map SDKs, or visual dependencies unless explicitly requested.

## Verification

For generated frontend pages, run the smallest relevant check:

- `pnpm --filter @global-trade/site typecheck`
- `pnpm --filter @global-trade/site test`
- `pnpm --filter @global-trade/site build` when route, CSS, runtime, or deployment behavior changes

If the command cannot run, state the exact reason and provide the next-best static check.
