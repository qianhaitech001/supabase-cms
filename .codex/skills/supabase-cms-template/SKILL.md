---
name: supabase-cms-template
description: Project-specific development workflow for the Supabase CMS template. Use when working in this repository on frontend pages, admin UI, Supabase schema/RLS, WordPress/WooCommerce migration, media storage, BlockNote/post editing, deployment config, performance, tests, or documentation.
---

# Supabase CMS Template

## Overview

Use this skill to keep Codex work aligned with the repository contract. The canonical rules live in `docs/ai-development-contract.md`; do not duplicate or override them here.

## Required Workflow

1. Read `docs/ai-development-contract.md` before editing.
2. For storefront page work, also read `docs/frontend-page-contract.md`.
3. Inspect the relevant code paths with `rg` and targeted file reads.
4. For generated frontend pages, verify available data in `packages/core/src/types.ts`, `packages/core/src/frontend-client.ts`, `apps/site/lib/data.ts`, and `supabase/schema.sql`; do not invent backend fields or props.
5. Keep changes inside the existing package boundaries:
   - `apps/site` for app/runtime/UI/API work.
   - `packages/core` for shared public types and data contracts.
   - `packages/migrator` for WordPress/WooCommerce parsing.
   - `supabase` for schema, migrations, RLS, grants, and storage policy.
6. Reuse existing helpers, components, cache tags, storage adapters, and import patterns.
7. Run the smallest relevant verification command and report the result.

## Project Guardrails

- Do not add carts, checkout, orders, payments, shipping, tax, customer accounts, or coupon workflows.
- Do not migrate imported WordPress/WooCommerce media into Supabase Storage.
- Do not bypass typed data contracts or scatter raw Supabase mapping inside UI components.
- Do not invent product, category, post, page, inquiry, media, or SEO fields for generated frontend pages.
- Do not add dependencies or database fields unless the task requires it.
- Do not commit secrets or generated output such as `.next`, `.open-next`, `out`, `dist`, or `*.tsbuildinfo`.
- Keep Vercel and Cloudflare Workers/OpenNext deployment routes working.

## Verification

Pick commands based on the changed surface:

- `pnpm --filter @global-trade/site typecheck`
- `pnpm --filter @global-trade/site test`
- `pnpm --filter @global-trade/site build`
- `pnpm --filter @global-trade/core test`
- `pnpm --filter @global-trade/migrator test`
- `pnpm cf:build`

If a command cannot run, explain why and use the next-best static check.
