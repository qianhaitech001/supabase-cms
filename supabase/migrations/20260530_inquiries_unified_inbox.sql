-- Existing-project upgrade patch.
--
-- Do not run this file after bootstrapping a new project with supabase/schema.sql.
-- The full schema already includes these columns, indexes, and the public insert
-- policy. This migration is kept for older deployments with the original
-- inquiries table.

alter table public.inquiries
  add column if not exists phone text,
  add column if not exists messenger text,
  add column if not exists company text,
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists source_url text,
  add column if not exists form_type text not null default 'product_inquiry',
  add column if not exists subject text,
  add column if not exists payload jsonb not null default '{}',
  add column if not exists field_labels jsonb not null default '{}';

create index if not exists inquiries_form_type_created_idx
on public.inquiries(form_type, created_at desc);

create index if not exists inquiries_status_created_idx
on public.inquiries(status, created_at desc);

create index if not exists inquiries_product_id_idx
on public.inquiries(product_id);

drop policy if exists "public can create inquiries" on public.inquiries;
create policy "public can create inquiries"
on public.inquiries for insert
to anon, authenticated
with check (
  status = 'new'
  and form_type ~ '^[a-z][a-z0-9_]{0,63}$'
  and char_length(trim(name)) between 1 and 200
  and email ~* '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
  and char_length(trim(message)) between 1 and 5000
  and (subject is null or char_length(subject) <= 300)
  and (phone is null or char_length(phone) <= 80)
  and (messenger is null or char_length(messenger) <= 120)
  and (company is null or char_length(company) <= 200)
  and jsonb_typeof(payload) = 'object'
  and jsonb_typeof(field_labels) = 'object'
  and octet_length(payload::text) <= 20000
  and octet_length(field_labels::text) <= 10000
  and octet_length(metadata::text) <= 10000
);
