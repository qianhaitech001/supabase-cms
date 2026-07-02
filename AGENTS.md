# Repository Instructions For AI Agents

This repository is a reusable template, so consistency matters more than individual tool preferences.

Before editing, read and follow `AI_RULES.md` and `docs/ai-development-contract.md`. Treat `docs/ai-development-contract.md` as the single source of truth for architecture, data, UI, migration, media, deployment, and validation rules.

When generating or modifying storefront pages, also read `docs/site-build-operations.md` and `docs/frontend-page-contract.md`. Do not invent backend fields or frontend props; verify data shapes against `packages/core/src/types.ts`, `packages/core/src/frontend-client.ts`, `apps/site/lib/data.ts`, and `supabase/schema.sql`.

## Required Workflow

- Inspect existing code before changing it. Use `rg` for search.
- Confirm whether the task targets static storefront mode, Supabase dynamic mode, or both.
- Prefer existing helpers, components, schemas, and package boundaries.
- Keep diffs small and scoped to the user request.
- Do not add dependencies, database columns, public APIs, or deployment targets unless the task requires it.
- Do not revert user changes unless explicitly asked.
- Do not commit or generate tracked secrets or build outputs.
- Verify with the smallest relevant command and report the result.

## Important Paths

- `apps/site`: Next.js app, admin, storefront, APIs, UI, runtime data access.
- `packages/core`: shared public types and data contracts.
- `packages/migrator`: WordPress/WooCommerce migration parsing.
- `supabase`: schema, migrations, RLS, grants, and storage policy.
- `docs/ai-development-contract.md`: mandatory AI development contract.
- `docs/site-build-operations.md`: static / dynamic site build workflow.
- `docs/frontend-page-contract.md`: mandatory storefront page generation contract.
- `docs/frontend-page-prompt-template.md`: Chinese prompt template for AI-generated storefront pages.

## Generated Files

Never commit `.env`, `.env.local`, `.env.*.local`, `.next`, `.open-next`, `out`, `dist`, `coverage`, or `*.tsbuildinfo`.
