-- Replace migrated INSHOW HOME WordPress upload URLs with the UpYun CDN URL.
-- Existing projects can run this once after the media files have been copied to UpYun.
-- New empty projects should not need this migration.

create or replace function pg_temp.replace_inshow_upload_url(value text)
returns text
language sql
immutable
returns null on null input
as $$
  select replace(
    value,
    'https://inshowhome.com/wp-content/uploads/',
    'https://inshowhome.metainshow.com/uploads/'
  );
$$;

create or replace function pg_temp.replace_inshow_upload_url(value jsonb)
returns jsonb
language sql
immutable
returns null on null input
as $$
  select replace(
    value::text,
    'https://inshowhome.com/wp-content/uploads/',
    'https://inshowhome.metainshow.com/uploads/'
  )::jsonb;
$$;

update public.media_assets
set
  public_url = pg_temp.replace_inshow_upload_url(public_url),
  source = pg_temp.replace_inshow_upload_url(source)
where public_url like '%https://inshowhome.com/wp-content/uploads/%'
   or source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.media_assets as media
set storage_path = pg_temp.replace_inshow_upload_url(media.storage_path)
where media.storage_path like 'https://inshowhome.com/wp-content/uploads/%'
  and not exists (
    select 1
    from public.media_assets as existing
    where existing.storage_path = pg_temp.replace_inshow_upload_url(media.storage_path)
  );

update public.product_categories
set
  image = pg_temp.replace_inshow_upload_url(image),
  seo = pg_temp.replace_inshow_upload_url(seo),
  source = pg_temp.replace_inshow_upload_url(source)
where image::text like '%https://inshowhome.com/wp-content/uploads/%'
   or seo::text like '%https://inshowhome.com/wp-content/uploads/%'
   or source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.product_tags
set source = pg_temp.replace_inshow_upload_url(source)
where source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.products
set
  content_json = pg_temp.replace_inshow_upload_url(content_json),
  rich_text = pg_temp.replace_inshow_upload_url(rich_text),
  legacy_html = pg_temp.replace_inshow_upload_url(legacy_html),
  primary_image = pg_temp.replace_inshow_upload_url(primary_image),
  gallery = pg_temp.replace_inshow_upload_url(gallery),
  seo = pg_temp.replace_inshow_upload_url(seo),
  legacy_meta = pg_temp.replace_inshow_upload_url(legacy_meta),
  source = pg_temp.replace_inshow_upload_url(source)
where content_json::text like '%https://inshowhome.com/wp-content/uploads/%'
   or rich_text like '%https://inshowhome.com/wp-content/uploads/%'
   or coalesce(legacy_html, '') like '%https://inshowhome.com/wp-content/uploads/%'
   or primary_image::text like '%https://inshowhome.com/wp-content/uploads/%'
   or gallery::text like '%https://inshowhome.com/wp-content/uploads/%'
   or seo::text like '%https://inshowhome.com/wp-content/uploads/%'
   or legacy_meta::text like '%https://inshowhome.com/wp-content/uploads/%'
   or source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.post_categories
set source = pg_temp.replace_inshow_upload_url(source)
where source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.post_tags
set source = pg_temp.replace_inshow_upload_url(source)
where source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.posts
set
  content_json = pg_temp.replace_inshow_upload_url(content_json),
  rich_text = pg_temp.replace_inshow_upload_url(rich_text),
  featured_image = pg_temp.replace_inshow_upload_url(featured_image),
  seo = pg_temp.replace_inshow_upload_url(seo),
  source = pg_temp.replace_inshow_upload_url(source)
where content_json::text like '%https://inshowhome.com/wp-content/uploads/%'
   or rich_text like '%https://inshowhome.com/wp-content/uploads/%'
   or featured_image::text like '%https://inshowhome.com/wp-content/uploads/%'
   or seo::text like '%https://inshowhome.com/wp-content/uploads/%'
   or source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.pages
set
  content_json = pg_temp.replace_inshow_upload_url(content_json),
  rich_text = pg_temp.replace_inshow_upload_url(rich_text),
  seo = pg_temp.replace_inshow_upload_url(seo),
  source = pg_temp.replace_inshow_upload_url(source)
where content_json::text like '%https://inshowhome.com/wp-content/uploads/%'
   or rich_text like '%https://inshowhome.com/wp-content/uploads/%'
   or seo::text like '%https://inshowhome.com/wp-content/uploads/%'
   or source::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.site_settings
set value = pg_temp.replace_inshow_upload_url(value)
where value::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.migration_batches
set
  summary = pg_temp.replace_inshow_upload_url(summary),
  report = pg_temp.replace_inshow_upload_url(report)
where summary::text like '%https://inshowhome.com/wp-content/uploads/%'
   or report::text like '%https://inshowhome.com/wp-content/uploads/%';

update public.migration_items
set
  payload = pg_temp.replace_inshow_upload_url(payload),
  error = pg_temp.replace_inshow_upload_url(error)
where payload::text like '%https://inshowhome.com/wp-content/uploads/%'
   or coalesce(error, '') like '%https://inshowhome.com/wp-content/uploads/%';
