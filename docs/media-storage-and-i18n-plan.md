# Media Storage and Internationalization Plan

## Current Position

The site keeps WordPress-imported media as remote URLs. New admin uploads go through a media provider abstraction. Local development can use Supabase Storage, while production can use UpYun by setting environment variables. Media upload provider selection is controlled only by environment variables, not by Admin Settings.

Internationalization is reserved at the `site_config` level. The current frontend keeps its existing routes, and locale-prefix routing should only be enabled when translated content and localized routes are ready.

## Media Provider Plan

### Data Contract

Keep `media_assets` stable:

- `kind`: `remote` for imported WordPress assets, `local` for admin uploads.
- `storage_path`: provider path or remote URL.
- `public_url`: final public URL used by frontend pages.
- `source`: include `{ "type": "admin-upload", "provider": "supabase" | "upyun" | "ali_oss" }`.

Products, posts, categories, rich text, and gallery fields should continue storing media objects with `publicUrl`. They should not care which storage provider produced the URL.

### Environment Variables

Media storage config should stay in deployment environment variables:

```bash
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media

UPYUN_BUCKET=
UPYUN_OPERATOR=
UPYUN_PASSWORD=
UPYUN_API_ENDPOINT=https://v0.api.upyun.com
UPYUN_PUBLIC_BASE_URL=https://inshowhome.metainshow.com
UPYUN_PATH_PREFIX=uploads/admin

ALI_OSS_ACCESS_KEY_ID=
ALI_OSS_ACCESS_KEY_SECRET=
ALI_OSS_BUCKET=
ALI_OSS_REGION=
ALI_OSS_ENDPOINT=
ALI_OSS_PUBLIC_BASE_URL=
ALI_OSS_PATH_PREFIX=inshow-home
```

When UpYun is enabled, change `MEDIA_UPLOAD_PROVIDER=upyun` and configure the `UPYUN_*` variables. Keep Supabase only as the database of record. Do not store UpYun credentials or provider switching controls in `site_settings`.

`MEDIA_UPLOAD_PROVIDER=ali_oss` is still reserved for future use, but the Ali adapter is not implemented yet.

### CDN and Global Access

For overseas visitors, use a CDN-backed media domain such as `https://inshowhome.metainshow.com` and set it as `UPYUN_PUBLIC_BASE_URL`. Keep uploaded paths under a stable prefix such as `uploads/admin` so migrated WordPress media and new admin uploads remain easy to distinguish.

## Internationalization Plan

### Current Reserved Config

Settings now stores:

- `i18n.defaultLocale`
- `i18n.fallbackLocale`
- `i18n.locales`
- `i18n.routingStrategy`

The current default is `routingStrategy: "none"` so existing routes keep working.

### Future Route Strategy

When translated content is ready:

1. Change routing strategy to `path-prefix`.
2. Add locale-aware route handling, for example `/en/products` and `/zh-CN/products`.
3. Use `apps/site/lib/i18n.ts` to normalize locale values and build locale-aware links.
4. Add localized SEO fields first for Settings, products, categories, posts, and fixed pages.
5. Keep fallback behavior: missing translation falls back to default locale.

### Content Model Direction

Avoid duplicating product rows per language. Prefer localized JSON fields for display text:

```ts
title: string | { en: string; "zh-CN": string }
summary: string | { en: string; "zh-CN": string }
seo.title: string | { en: string; "zh-CN": string }
```

The helper `pickLocalizedValue()` already supports this future shape.
