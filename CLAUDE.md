# Claude Code Instructions

Read `AI_RULES.md` and `docs/ai-development-contract.md` before editing this repository. `docs/ai-development-contract.md` is the single source of truth for project architecture, coding constraints, data rules, UI rules, migration behavior, deployment paths, and validation.

When generating or modifying storefront pages, also read `docs/site-build-operations.md` and `docs/frontend-page-contract.md`. Verify available data against `packages/core/src/types.ts`, `packages/core/src/frontend-client.ts`, `apps/site/lib/data.ts`, and `supabase/schema.sql`; do not invent fields, props, tables, or API responses.

## Claude Code Workflow

- First inspect the relevant files and existing patterns.
- Confirm whether the task targets static storefront mode, Supabase dynamic mode, or both.
- Keep changes small, local, and easy to review.
- Reuse existing helpers and shadcn-style components before creating new abstractions.
- Do not add packages, database fields, migrations, or deployment config unless the task explicitly requires it.
- Do not silently rewrite imported WordPress/WooCommerce remote media URLs or upload imported media to Supabase Storage.
- Do not introduce carts, checkout, orders, payments, shipping, tax, customer accounts, or coupon workflows.
- Do not commit secrets or generated build output.
- After changes, run the smallest relevant verification command and report it.

## Static / Dynamic Storefront Notes

- Static storefront work reads `apps/site/lib/static-content.ts`, `apps/site/lib/mock-data.ts`, and `apps/site/lib/inshow-assets.ts`.
- Supabase dynamic storefront work reads through `apps/site/lib/data.ts` and `packages/core/src/frontend-client.ts`.
- For static site build flow, follow `docs/site-build-operations.md`.
- For AI-generated page prompts, use the Chinese template in `docs/frontend-page-prompt-template.md`.

When rules appear to conflict, follow `docs/ai-development-contract.md`.
