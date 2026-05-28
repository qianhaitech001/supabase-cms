# Global Trade Site Framework

Reusable framework for foreign-trade showcase websites. It provides shared content types, Supabase schema, admin foundations, SEO utilities, inquiry APIs, and a WordPress/WooCommerce migration pipeline. Each client site is deployed independently to EdgeOne Pages with its own Supabase project.

## Packages

- `packages/core`: public interfaces, content models, SEO helpers, and frontend data client.
- `packages/migrator`: migration connector contracts plus WordPress WXR and WooCommerce CSV support.
- `apps/site`: starter Next.js App Router site with a generic admin and storefront.
- `supabase/schema.sql`: database schema, indexes, and RLS policies.

## Quick Start

```bash
pnpm install
pnpm test
pnpm dev
```

Copy `apps/site/.env.example` to `apps/site/.env.local` and fill Supabase credentials before running the site against a real project.

## Migration Flow

1. Export WordPress WXR/XML from the old site.
2. Export WooCommerce products CSV with custom meta columns enabled.
3. Open `/admin/migrations`, upload the files, and preview the detected content.
4. Confirm import to normalize products, categories, posts, pages, media references, SEO fields, and redirects.

The first version intentionally excludes carts, checkout, orders, payments, inventory transactions, and customer accounts.
