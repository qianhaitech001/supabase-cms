# AI Development Contract

This document is the single source of truth for AI-assisted development in this repository. All AI tools and human operators must follow it before editing code, schema, styles, tests, or deployment config.

## AI Tool Entrypoints

- `AI_RULES.md`: common entrypoint for Claude, Cursor, Trae, Codex, and other AI coding tools.
- `AGENTS.md`: Codex and Codex-compatible agents.
- `CLAUDE.md`: Claude Code.
- `.cursor/rules/*.mdc`: Cursor project rules.
- `TRAE.md`: Trae or tools that do not reliably read Codex/Cursor rule files.
- `docs/frontend-page-prompt-template.md`: Chinese prompt template for AI-generated storefront pages.

These files should point back to this contract instead of duplicating long, divergent rule sets.

## Project Identity

- This repository is a reusable B2B foreign-trade showcase CMS template.
- The product surface is content management, product display, news/posts, SEO, migration, media references, and inquiries.
- This is not an ecommerce transaction system. Do not add carts, checkout, orders, payments, shipping, tax rules, customer accounts, or coupon workflows unless the product scope is explicitly changed.
- Imported WordPress and WooCommerce media stays as remote URLs. Do not download old-site media or upload imported media into Supabase Storage.

## Stack And Runtime

- Monorepo package manager: pnpm workspace.
- App runtime: Next.js App Router in `apps/site`.
- UI: React, Tailwind CSS, shadcn-style primitives, Radix UI where already used.
- Data: Supabase Postgres, Auth, RLS, and optional Storage for new admin uploads.
- Shared contracts: `packages/core`.
- Migration parsing: `packages/migrator`.
- Deployment targets: Vercel, or Cloudflare Workers + OpenNext. Do not assume a static hosting or legacy CI deployment path by default.

## Directory Ownership

- `apps/site/app/(frontend)`: storefront pages and route-level rendering.
- `apps/site/app/(admin)`: admin pages, admin server actions, and admin-only UI flows.
- `apps/site/app/api`: route handlers for public and admin APIs.
- `apps/site/components/ui`: reusable shadcn-style primitives only.
- `apps/site/components/admin`: admin business components.
- `apps/site/components`: storefront and shared product/content components.
- `apps/site/lib`: runtime data access, auth, cache tags, media storage, import persistence, and helpers.
- `packages/core/src`: public shared types, SEO helpers, slug utilities, and typed data clients.
- `packages/migrator/src`: WordPress/WooCommerce parsing and normalized migration entities.
- `supabase/schema.sql`: authoritative full bootstrap schema for new or empty Supabase projects.
- `supabase/migrations`: additive upgrade patches for existing projects; do not treat them as required after a fresh schema bootstrap.
- `docs`: operating, migration, deployment, and team guidance.

## Data And API Rules

- Keep typed interfaces in `packages/core` stable. Frontend code should consume typed data through existing helpers instead of scattering raw Supabase row mapping.
- Add runtime data queries in `apps/site/lib` before adding query logic directly inside components.
- Preserve existing records during imports. Prefer upsert and missing-field supplementation over destructive replacement.
- Do not assume a new database column exists in production until a schema or migration file is added.
- Every schema change must update both the full bootstrap schema and the existing-project migration path when applicable, and must consider existing data, RLS, grants, indexes, and rollback risk.
- Public writes must remain narrow. Inquiry creation may be public; admin reads and updates must stay authenticated and role-gated.

## Frontend Rules

- Storefront pages must read site settings, SEO fields, products, categories, posts, media, and inquiries through established data contracts.
- When generating or modifying storefront pages, also follow `docs/frontend-page-contract.md`.
- AI-generated storefront code must inspect the backend data structure first: `packages/core/src/types.ts`, `packages/core/src/frontend-client.ts`, `apps/site/lib/data.ts`, and `supabase/schema.sql`.
- Do not invent fields, tables, API responses, category relationships, SEO values, inquiry fields, media shapes, or product attributes. If required data is missing, document the gap and add the smallest typed/schema change only when the task requires it.
- SEO metadata, sitemap, and robots must use current site settings; do not inherit old WordPress `noindex,nofollow`.
- Keep old-site media as remote URLs when rendering migrated content.
- Preserve the INSHOW-inspired storefront style unless a task explicitly requests redesign.
- Prefer cache-tag aware data helpers and existing `revalidate` patterns so admin updates can refresh frontend data.

## Admin Rules

- Admin UI should remain dense, operational, and shadcn-style. Avoid marketing-style sections inside admin screens.
- Lists should support pagination, refresh, filters where relevant, status badges, row actions, empty states, and stable table layouts.
- Edit forms should be grouped by meaningful sections: main content, taxonomy, media, SEO, publishing/source metadata.
- Product management is for display and inquiries only. Avoid transaction fields that belong to a shopping system.
- Post editing may use BlockNote where enabled, but legacy HTML must be preserved unless the user edits content.

## Media Rules

- Migrated media records are `remote` references and keep old public URLs.
- New admin uploads must go through the unified media storage adapter.
- Supabase Storage is the local/default provider.
- UpYun is the implemented production media provider and must be selected through environment variables, not database settings.
- Ali OSS remains a reserved provider value only until its adapter is implemented.
- Do not add a backend Media module surface unless explicitly requested; the Media page is intentionally hidden for now.

## Migration Rules

- Supported inputs: WordPress WXR/XML, WooCommerce CSV, WooCommerce REST supplementation.
- REST and file imports should supplement and normalize existing data without duplicating products, categories, posts, or media.
- Product category thumbnail import/sync must keep remote URLs unless a future task explicitly migrates assets.
- URL replacement is optional and must be explicit. Never rewrite old URLs silently.
- Migration reports should show counts, updated/skipped records, warnings, and useful samples.

## Deployment Rules

- Vercel and Cloudflare Workers/OpenNext are the preferred deployment paths.
- Do not commit generated outputs: `.next`, `.open-next`, `out`, `dist`, `coverage`, `*.tsbuildinfo`, or environment files.
- Required runtime variables are documented in `apps/site/.env.example` and `README.md`.
- Secrets such as Supabase service-role keys and storage credentials must never be printed into docs, logs, or source code.

## Dependency And Refactor Rules

- Do not add dependencies unless the task explicitly needs them and existing packages cannot reasonably solve the problem.
- Prefer existing local patterns, helpers, and components before new abstractions.
- Keep diffs narrow. Do not perform unrelated cleanup while implementing a feature.
- Never revert user changes unless explicitly asked.
- Avoid moving files or renaming public APIs unless the task requires it and all callers are updated.

## Validation Rules

Choose the smallest verification that proves the change:

- Site typecheck: `pnpm --filter @global-trade/site typecheck`
- Site tests: `pnpm --filter @global-trade/site test`
- Site build: `pnpm --filter @global-trade/site build`
- Core tests: `pnpm --filter @global-trade/core test`
- Migrator tests: `pnpm --filter @global-trade/migrator test`
- Cloudflare build: `pnpm cf:build`
- Full workspace checks: `pnpm typecheck`, `pnpm test`, `pnpm build`

Run targeted tests for changed behavior. Run builds when routing, Next.js config, deployment config, CSS compilation, or server/runtime behavior changes.

## AI Working Rules

- Read this contract and inspect relevant code before editing.
- Search with `rg` before assuming file locations or existing patterns.
- Use existing architecture boundaries; do not bypass them for convenience.
- Document verification results in the final response.
- If verification cannot run, state the exact command that was skipped and why.
- Keep generated documentation and prompts concise, operational, and free of private credentials.
