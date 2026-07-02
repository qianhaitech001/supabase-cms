# Supabase Schema And Migrations

本目录只管理 Supabase 数据库结构、RLS、grants 和 Storage bucket 策略，不保存业务数据、真实用户、真实域名或密钥。

## 新项目初始化

新 Supabase 项目或空数据库只执行：

```text
supabase/schema.sql
```

`schema.sql` 是完整初始化模板，会创建：

- enum 类型。
- CMS 业务表。
- 索引。
- RLS policy。
- `private` schema helper functions。
- 自动维护 `updated_at` 和 profile 创建的 triggers。
- Supabase Storage `media` bucket。
- Storage policies。
- `anon` 和 `authenticated` 的 Data API grants。

不要在新项目初始化后再执行 `supabase/migrations/*.sql`。这些字段已经包含在完整 schema 中。

## 旧项目升级

已有数据库不要重跑 `schema.sql`。只按顺序执行需要的增量补丁：

```text
supabase/migrations/20260529_products_admin_fields.sql
supabase/migrations/20260530_inquiries_unified_inbox.sql
```

如果当前库已经导入 INSHOW HOME 旧站数据，并且静态资源已经迁移到又拍云，可额外执行：

```text
supabase/migrations/20260630_upyun_media_urls.sql
```

该脚本只做数据 URL 替换：把 `https://inshowhome.com/wp-content/uploads/` 替换为 `https://inshowhome.metainshow.com/uploads/`。新项目空库不需要执行它。

这些 migration 都应保持幂等，重复执行不应因为字段或索引已存在而失败。

## 后续修改规则

新增或修改数据库结构时必须同时考虑：

- `supabase/schema.sql`：新项目的完整结构。
- `supabase/migrations/*.sql`：已有项目的增量升级路径。
- RLS policy、grants、索引和触发器。
- `packages/core` 类型和 `apps/site/lib` 数据访问。

不要只改应用代码而不补 schema 或 migration，也不要只改 migration 而忘记更新完整 schema。
