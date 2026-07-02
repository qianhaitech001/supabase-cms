# Supabase CMS Development Guide

本文档面向第一次接触本项目的开发者，说明项目结构、数据结构、前后台开发方式、Supabase 配置、WordPress/WooCommerce 数据迁移，以及部署到 Vercel 或 Cloudflare Workers 的流程。

项目定位是外贸 B2B 展示型网站模板：以前台商品展示、文章内容、询盘表单和后台内容管理为核心。它不是购物车/支付/订单系统，当前阶段也不承接 WooCommerce 的交易闭环。

如果你第一次接触 Next.js 或 Supabase，请先按 [新人上手指南](new-developer-onboarding.md) 跑通本地项目，再回到本文档查具体模块。

## 0. 阅读路径

新开发者建议按这个顺序阅读：

1. `README.md`：确认项目定位、常用命令和部署目标。
2. `docs/new-developer-onboarding.md`：完成本地启动、Supabase 初始化、后台登录和最小验证。
3. `supabase/README.md`：理解新项目初始化和旧项目升级的区别。
4. 当前文档：查具体目录、数据结构、开发规则、迁移流程和部署细节。
5. `docs/frontend-page-contract.md`：开发或生成前台页面前必须阅读。

新人完成上手的最低标准：

- 本地 dev server 能启动。
- Supabase schema 已执行。
- 第一个后台用户已设置为 `owner`。
- `/admin/login` 可以登录。
- Products、Posts、Settings 页面不会报环境变量或字段缺失。
- `pnpm --filter @global-trade/site typecheck` 可以通过。

## 1. 项目概览

### 1.1 技术栈

- Next.js App Router：前台、后台和 API 都在 `apps/site`。
- React 19：前后台页面组件。
- Tailwind CSS + shadcn 风格基础组件：后台 UI 和部分前台交互。
- Supabase：Postgres、Auth、RLS、Storage。
- BlockNote / Lexical：Posts 可按环境变量启用 BlockNote；兼容富文本路径仍保留 Lexical。
- pnpm workspace：管理 `apps/*` 和 `packages/*`。
- Vercel：推荐部署路径之一，适合直接部署 Next.js full-stack 应用。
- Cloudflare Workers + OpenNext：推荐部署路径之一，适合部署 `/admin`、`/api/*`、Server Actions 和动态渲染。

### 1.2 关键设计取舍

- WordPress/WooCommerce 导入的媒体不下载，不上传到 Supabase Storage，只保存旧站远程 URL。
- 后台新上传媒体通过统一 adapter 上传；本地可用 Supabase Storage，生产可通过环境变量切换到又拍云。
- Products 只做展示和询盘，不做 cart、checkout、orders、payments、shipping、tax。
- Products 和 Posts 的前台数据通过稳定 typed data/API 读取，方便后续 AI 生成或重做前台页面。
- SEO 配置由后台 Settings 和内容表字段控制，不继承旧站 `noindex,nofollow`。

## 2. 目录结构

```text
supabase-cms-template/
├── apps/
│   └── site/
│       ├── app/
│       │   ├── (frontend)/          # 前台页面
│       │   ├── (admin)/             # 后台页面和 Server Actions
│       │   ├── api/                 # API routes
│       │   ├── layout.tsx
│       │   ├── robots.ts
│       │   └── sitemap.ts
│       ├── components/
│       │   ├── admin/               # 后台业务组件
│       │   ├── ui/                  # shadcn 风格基础组件
│       │   └── *.tsx                # 前台组件
│       ├── lib/                     # 数据访问、缓存、认证、导入、配置
│       ├── open-next.config.ts      # Cloudflare OpenNext 配置
│       ├── wrangler.jsonc           # Cloudflare Workers 配置
│       ├── next.config.ts
│       └── package.json
├── packages/
│   ├── core/                        # 共享类型、SEO、slug、前台数据 client
│   └── migrator/                    # WordPress/WooCommerce 导入解析器
├── supabase/
│   ├── schema.sql                   # 完整数据库 schema、RLS、Storage bucket
│   └── migrations/                  # 追加迁移
├── docs/
│   ├── development-guide.md         # 当前文档
│   └── media-storage-and-i18n-plan.md
├── pnpm-workspace.yaml
└── package.json
```

### 2.1 Workspace 包说明

`apps/site`

- Next.js 应用。
- 包含前台、后台、API、样式、组件和运行时数据访问。
- 运行时依赖 Supabase 环境变量。

`packages/core`

- 项目共享类型。
- SEO 元数据和 JSON-LD 工具。
- Slug 生成工具。
- `FrontendDataClient`，负责把 Supabase row 映射成 typed data。

`packages/migrator`

- 数据迁移接口和实体类型。
- WordPress WXR/XML 解析。
- WooCommerce CSV 解析。
- 媒体 URL、SEO meta、商品规格表格解析。

`supabase`

- 数据库结构和安全策略的权威来源。
- 新项目初始化时优先执行 `supabase/schema.sql`。

## 3. 本地开发

### 3.1 环境要求

- Node.js 20+。
- pnpm 9.15.4。
- 一个 Supabase 项目。

推荐通过 Corepack 固定 pnpm 版本：

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

### 3.2 环境变量

复制示例文件：

```bash
cp apps/site/.env.example apps/site/.env.local
```

最少需要：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase Project URL。
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`：推荐使用 Supabase 新的 publishable key。
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：兼容旧 anon key；如果没有 publishable key，会使用它。
- `SUPABASE_SERVICE_ROLE_KEY`：只允许服务端使用。后台 Users 创建/删除用户需要它。
- `NEXT_PUBLIC_SITE_URL`：部署后填写正式域名、Vercel 预览域名或 Cloudflare 预览域名，用于 SEO、sitemap、robots。

媒体相关：

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

可用 provider：

- `supabase`：本地和默认上传路径，使用 Supabase Storage。
- `upyun`：已实现，又拍云上传路径，使用 `UPYUN_*` 环境变量。
- `ali_oss`：预留值，当前不能直接上传。

### 3.3 启动项目

```bash
pnpm --filter @global-trade/site dev
```

常用地址：

- 前台：首页 `/`
- 产品列表 `/products`
- 新闻 `/news`
- 联系页 `/contact`
- 后台登录 `/admin/login`
- 后台首页 `/admin`

### 3.4 检查命令

```bash
pnpm --filter @global-trade/site typecheck
pnpm --filter @global-trade/site test
pnpm --filter @global-trade/site build
pnpm --filter @global-trade/core test
pnpm --filter @global-trade/migrator test
```

全仓库检查：

```bash
pnpm typecheck
pnpm test
pnpm build
```

## 4. Supabase 配置

### 4.1 创建项目

1. 登录 Supabase。
2. 创建新 Project。
3. 进入 Project Settings，复制 Project URL 和 API keys。
4. 填入 `apps/site/.env.local`。

### 4.2 初始化数据库

新 Supabase 项目或空数据库，进入 Supabase SQL Editor，执行：

```sql
-- 粘贴并执行 supabase/schema.sql
```

`supabase/schema.sql` 会创建：

- 枚举类型。
- 数据表。
- 索引。
- RLS policy。
- `private` schema 中的角色判断函数。
- `profiles` 自动创建 trigger。
- `media` Storage bucket。
- Storage RLS policy。
- `anon` 和 `authenticated` 的 table grants。

如果项目已存在旧 schema，不要重跑 `supabase/schema.sql`。只按顺序执行需要的增量补丁：

```text
supabase/migrations/20260529_products_admin_fields.sql
supabase/migrations/20260530_inquiries_unified_inbox.sql
```

完整规则见 `supabase/README.md`：新项目只跑完整 schema，旧项目只跑 migrations。

### 4.3 创建第一个后台管理员

Auth 用户创建后，`profiles.role` 默认是 `viewer`。第一个管理员需要手动提升为 `owner`。

1. 在 Supabase Dashboard 的 Authentication 中创建用户。
2. 用户创建后执行：

```sql
update public.profiles
set role = 'owner'
where email = 'admin@example.com';
```

3. 用该账号登录 `/admin/login`。
4. 后续可以在 `/admin/users` 创建和管理其他后台用户。

### 4.4 用户角色

角色定义在 `public.user_role`：

- `owner`：最高权限。可管理 users、settings、内容和迁移。
- `admin`：可管理 users、settings、内容和迁移，但不能管理 owner。
- `editor`：可管理产品、文章、分类、媒体。
- `sales`：可查看并处理 inquiries。
- `viewer`：只读能力较弱，主要用于后台查看。

### 4.5 RLS 访问模型

公开访问：

- `anon` 可以读取 published products、published posts、published pages。
- `anon` 可以读取 categories、tags、media、site_settings、redirects。
- `anon` 可以 insert inquiries，但不能读取 inquiries。

登录后台：

- `authenticated` 根据 `profiles.role` 获得更高权限。
- Staff 角色可以写 products、posts、categories、media。
- Sales 角色可以更新 inquiry 状态。
- Owner/admin 可以管理 users、settings、migrations。

重要文件：

- `supabase/schema.sql`
- `apps/site/lib/auth.ts`
- `apps/site/app/(admin)/admin/actions.ts`

### 4.6 Storage

`schema.sql` 会创建 public bucket：

```text
bucket id: media
max file size: 50 MB
allowed mime types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml, application/pdf
```

后台上传逻辑在：

```text
apps/site/lib/media-storage.ts
```

当前规则：

- 导入媒体：写入 `media_assets`，`kind='remote'`，`public_url` 等于旧站 URL。
- 后台上传媒体：通过 `apps/site/lib/media-storage.ts` 统一 adapter 上传，写入 `media_assets`，`kind='local'`。
- 当前支持 Supabase Storage 和又拍云；未来新增 provider 时保持 `media_assets.public_url` 合同不变，只替换上传 adapter。

## 5. 数据结构

共享 TypeScript 类型在：

```text
packages/core/src/types.ts
```

数据库 schema 在：

```text
supabase/schema.sql
```

### 5.1 `site_settings`

用于保存站点配置，主要 key：

```text
key = 'site_config'
value = SiteConfig JSON
```

`SiteConfig` 包含：

- `name`
- `domain`
- `locale`
- `logoUrl`
- `inquiryEmail`
- `inquiryPhone`
- `inquiryWhatsApp`
- `inquiryWeChat`
- `defaultSeo`
- `pageSeo.home`
- `pageSeo.products`
- `pageSeo.news`
- `pageSeo.contact`
- `navigation`
- `footer`
- `i18n`
- `media`

读取入口：

```text
apps/site/lib/site-config.ts
```

后台配置页面：

```text
apps/site/app/(admin)/admin/(protected)/settings/page.tsx
```

### 5.2 `media_assets`

字段摘要：

- `kind`: `remote` 或 `local`。
- `source`: 来源元数据。
- `storage_path`: 远程 URL 或 provider path，唯一。
- `public_url`: 前台真正使用的 URL。
- `alt`
- `title`
- `caption`
- `mime_type`
- `width`
- `height`

设计原则：

- 产品、文章、分类、富文本都只依赖 `publicUrl`。
- 不让前台关心媒体来自 WordPress、Supabase Storage、又拍云还是 Ali OSS。

### 5.3 `product_categories`

字段摘要：

- `slug`
- `title`
- `display_title`
- `description`
- `parent_id`
- `image`
- `seo`
- `source`

特点：

- 支持多级分类。
- WooCommerce 分类树通过 `parent_id` 表达。
- 旧站中类似 `- Bathroom` 的原名保留在 `title`，后台展示可用 `display_title` 清理。
- 分类图片保存为 media object JSON，不强制写入 Storage。

### 5.4 `products`

字段摘要：

- `slug`
- `title`
- `status`: `draft`、`published`、`archived`
- `sku`
- `product_type`
- `summary`
- `content_json`: 富文本编辑器 JSON
- `rich_text`: HTML
- `legacy_html`: 旧站 HTML
- `category_ids`
- `tag_ids`
- `primary_image`
- `gallery`
- `specifications`
- `regular_price`
- `sale_price`
- `currency`
- `price_text`
- `stock_status`
- `stock_quantity`
- `seo`
- `legacy_meta`
- `source`

本项目中 Products 表达“展示型商品”：

- 价格只是展示字段。
- 库存只是展示字段。
- 不做库存扣减。
- 不做订单、支付、优惠券、物流、税务。
- 商品详情页主要用于展示 + 询盘。

### 5.5 `post_categories` / `post_tags`

用于 WordPress 文章分类和标签。

`post_categories` 字段：

- `slug`
- `title`
- `parent_id`
- `source`

`post_tags` 字段：

- `slug`
- `title`
- `source`

### 5.6 `posts`

字段摘要：

- `slug`
- `title`
- `status`
- `author`
- `excerpt`
- `content_json`
- `rich_text`
- `published_at`
- `modified_at`
- `category_ids`
- `tag_ids`
- `featured_image`
- `seo`
- `source`

WordPress 的 `post`、`news`、`faqs` 等可导入为 posts。保留分类、标签、作者、发布时间、修改时间、特色图、SEO 和源站信息。

### 5.7 `pages`

字段摘要：

- `slug`
- `title`
- `status`
- `content_json`
- `rich_text`
- `seo`
- `source`

当前 Pages 先用于保存旧站页面内容，不作为复杂页面搭建器。

### 5.8 `inquiries`

字段摘要：

- `status`: `new`、`contacted`、`closed`、`spam`
- `form_type`
- `subject`
- `name`
- `email`
- `phone`
- `messenger`
- `company`
- `message`
- `product_id`
- `source_url`
- `payload`
- `field_labels`
- `metadata`

当前后台将它展示为统一收件箱：

- Date
- Form name
- Form data
- View dialog

前台提交接口支持：

```json
{
  "formName": "Product Inquiry",
  "formData": {
    "name": "Alice",
    "email": "alice@example.com",
    "question": "Need quotation"
  },
  "formType": "product_inquiry",
  "subject": "Product inquiry",
  "fieldLabels": {
    "question": "Question"
  }
}
```

API 入口：

```text
apps/site/app/api/inquiries/route.ts
```

### 5.9 `migration_batches` / `migration_items`

预留给更完整的迁移批次跟踪。当前主要导入逻辑走 `/admin/migrations` 页面和 API routes，不强依赖这两张表。

## 6. 前台开发

前台路由在：

```text
apps/site/app/(frontend)
```

### 6.1 前台页面

```text
app/(frontend)/page.tsx                         # 首页
app/(frontend)/about-us/page.tsx                 # About Us
app/(frontend)/products/page.tsx                 # 产品列表
app/(frontend)/products/[slug]/page.tsx          # 产品详情
app/(frontend)/product-category/[...slug]/page.tsx
app/(frontend)/news/page.tsx                     # 新闻列表
app/(frontend)/news/[slug]/page.tsx              # 新闻详情
app/(frontend)/contact/page.tsx                  # Contact
```

共同布局：

```text
apps/site/app/(frontend)/layout.tsx
apps/site/components/Header.tsx
apps/site/components/HeaderNavigation.tsx
apps/site/components/Footer.tsx
```

旧站 INSHOW HOME 的图片、视频和视觉资产集中在：

```text
apps/site/lib/inshow-assets.ts
```

### 6.2 前台数据读取

前台页面不直接散落写 Supabase 查询，优先使用：

```text
apps/site/lib/data.ts
```

它提供：

- `listProducts()`
- `getProduct(slug)`
- `listCategories()`
- `listPosts()`
- `getPost(slug)`

底层 typed client：

```text
packages/core/src/frontend-client.ts
```

### 6.3 缓存和更新

前台使用 `unstable_cache` 和 tag-based revalidate。

配置入口：

```text
apps/site/lib/cache-tags.ts
```

默认：

```ts
export const FRONTEND_REVALIDATE_SECONDS = 300;
```

后台保存产品、文章、分类、Settings 或完成导入后，会调用对应 revalidate 函数，使前台数据尽快更新。

### 6.4 SEO

SEO 工具在：

```text
packages/core/src/seo.ts
```

站点配置读取在：

```text
apps/site/lib/site-config.ts
```

每个详情页一般这样生成 metadata：

```ts
const metadata = createMetadata(siteConfig, product.seo, `/products/${product.slug}`);
```

全站 sitemap 和 robots：

```text
apps/site/app/sitemap.ts
apps/site/app/robots.ts
```

不要直接继承 WordPress 旧站的 `noindex,nofollow`。是否允许索引应在后台 Settings 中明确配置。

### 6.5 前台表单

表单组件：

```text
apps/site/components/InquiryForm.tsx
apps/site/components/ProductListInquiryForm.tsx
apps/site/components/ChatNowDialog.tsx
```

所有表单统一提交：

```text
POST /api/inquiries
```

建议新表单按以下格式提交：

```ts
await fetch("/api/inquiries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    formName: "Contact Form",
    formData: {
      name,
      email,
      message,
      sourceUrl: "/contact"
    },
    formType: "contact",
    subject: "Contact Form",
    name,
    email,
    message,
    sourceUrl: "/contact",
    fieldLabels: {
      name: "Name",
      email: "Email",
      message: "Message"
    }
  })
});
```

## 7. 后台开发

后台路由在：

```text
apps/site/app/(admin)/admin
```

### 7.1 后台页面

```text
app/(admin)/admin/login/page.tsx                 # 登录
app/(admin)/admin/(protected)/layout.tsx         # 后台布局
app/(admin)/admin/(protected)/page.tsx           # Dashboard
app/(admin)/admin/(protected)/products/page.tsx
app/(admin)/admin/(protected)/products/new/page.tsx
app/(admin)/admin/(protected)/products/[id]/page.tsx
app/(admin)/admin/(protected)/product-categories/page.tsx
app/(admin)/admin/(protected)/posts/page.tsx
app/(admin)/admin/(protected)/post-categories/page.tsx
app/(admin)/admin/(protected)/inquiries/page.tsx
app/(admin)/admin/(protected)/migrations/page.tsx
app/(admin)/admin/(protected)/settings/page.tsx
app/(admin)/admin/(protected)/users/page.tsx
```

`media/page.tsx` 目前保留但不在后台导航展示。媒体上传应优先通过产品、文章、分类和编辑器中的统一上传入口完成。

### 7.2 后台导航

后台导航组件：

```text
apps/site/components/admin/AdminNav.tsx
```

要新增后台模块：

1. 在 `app/(admin)/admin/(protected)` 下新增页面。
2. 在 `AdminNav.tsx` 加入 nav item。
3. 如需权限控制，设置 `roles`。
4. 如需写操作，在 `actions.ts` 增加 Server Action 并调用 `requireAdminRole()`。

### 7.3 后台数据读取

后台列表和详情数据集中在：

```text
apps/site/lib/admin-data.ts
```

它提供分页版本：

- `listAdminProductsPage()`
- `listAdminPostsPage()`
- `listAdminInquiriesPage()`

后台列表页优先使用分页函数，避免一次读取过多数据。

### 7.4 后台写操作

Server Actions 集中在：

```text
apps/site/app/(admin)/admin/actions.ts
```

常见 actions：

- `savePostAction`
- `saveProductAction`
- `saveProductCategoryAction`
- `saveSettingsAction`
- `updateProductStatusAction`
- `updatePostStatusAction`
- `updateInquiryStatusAction`
- `createUserAction`
- `updateUserRoleAction`
- `deleteUserAction`
- `uploadMediaAction`

写操作必须：

1. 校验登录：`requireAdminSession()`。
2. 校验角色：`requireAdminRole([...])`。
3. 使用 Zod 校验输入。
4. 写入 Supabase。
5. 调用对应 revalidate 函数。
6. `redirect()` 回列表或详情。

### 7.5 后台表单组件

主要组件：

```text
components/admin/ProductForm.tsx
components/admin/PostForm.tsx
components/admin/ProductCategoryDialog.tsx
components/admin/ProductCategoryTreeTable.tsx
components/admin/CategoryTreeSelect.tsx
components/admin/RichTextEditor.tsx
components/admin/FileDropzone.tsx
components/admin/SplitActionsTable.tsx
components/admin/InquiryDataDialog.tsx
```

富文本编辑器：

- Posts 可通过 `POST_EDITOR_ENGINE=blocknote` 和 `NEXT_PUBLIC_POST_BLOCK_EDITOR_ENABLED=true` 启用 BlockNote 编辑器。
- 未启用 BlockNote 时，Posts 和其他兼容富文本表单继续使用 Lexical 组件。
- `content_json` 保存当前编辑器 JSON。
- `rich_text` 保存 HTML。
- 导入旧站 HTML 时不能退化为纯文本，应尽量保留标题、图片、链接、表格。

### 7.6 后台 UI 约定

- 列表页使用 `payload-table` 样式。
- Products 和 Posts 使用 `SplitActionsTable` 处理右侧 actions 固定列。
- 表单使用 `payload-form`、`payload-form-section`、`payload-field`。
- 新交互优先使用 `components/ui` 中的 shadcn 风格基础组件。
- 不要在后台页面加入营销式 hero。后台是操作界面，优先密度、清晰度和可扫描性。

## 8. 数据迁移

### 8.1 支持的导入格式

当前支持：

- WordPress WXR/XML。
- WooCommerce Products CSV。
- WooCommerce Product Categories CSV。
- WooCommerce Store API 补充同步。

导入解析器：

```text
packages/migrator/src/wordpress/wxr.ts
packages/migrator/src/woocommerce/csv.ts
packages/migrator/src/connectors.ts
```

后台迁移页：

```text
apps/site/app/(admin)/admin/(protected)/migrations/page.tsx
```

API：

```text
POST /api/migrations/preview
POST /api/migrations/import
POST /api/migrations/woocommerce-sync
```

### 8.2 导入流程

1. 从 WordPress 导出 WXR/XML。
2. 从 WooCommerce 导出 Products CSV。
3. 如有分类缩略图，导出 Product Categories CSV，字段需包含 `Thumbnail`。
4. 登录后台 `/admin/migrations`。
5. 上传 XML/CSV 文件。
6. 点击 Preview。
7. 检查 counts、samples、warnings。
8. 点击 Import。
9. 如分类图片或产品字段缺失，使用 WooCommerce REST sync 补充。

### 8.3 URL 替换

迁移页提供两个可选字段：

- Old URL to find
- New replacement URL

用途：

- 如果旧站 URL 仍保留，两个字段可以为空。
- 如果需要把 XML/CSV 中的旧域名改成新域名，填写两者后会在 preview/import 前替换文本。

当前 INSHOW HOME 迁移场景一般保留旧站媒体 URL，不需要替换。

### 8.4 Upsert 规则

导入不是简单追加。

- Media：按 `storage_path/public_url` 远程 URL upsert。
- Categories：按 slug upsert。
- Tags：按 slug upsert。
- Products/Posts/Pages：优先按 source 或 slug upsert。

再次导入同一个 CSV/XML 时，会更新已有记录中对应字段，而不是无条件插入重复数据。若源数据中 slug 冲突或导出文件存在重复 slug，解析器会尽量生成唯一 slug。

### 8.5 WooCommerce REST sync

后台 Migrations 中的 WooCommerce REST sync 用于补充数据。

输入：

- Site URL，例如 `https://inshowhome.com`
- API key，可选

当前实现优先调用 WooCommerce Store API：

```text
/wp-json/wc/store/v1/products/categories
/wp-json/wc/store/v1/products
```

它会尝试补充：

- 分类 description。
- 分类 image。
- 分类 source。
- 产品 type、summary、rich text。
- 产品 primary image、gallery。
- 产品价格、库存、分类关联。

注意：当前 `apiKey` 字段已预留，但 Store API 公开接口不一定使用该 key。如果后续要调用 WooCommerce REST API v3，需要扩展 route 中的认证逻辑。

### 8.6 媒体迁移原则

导入媒体一律不下载。

写入示例：

```json
{
  "kind": "remote",
  "storagePath": "https://inshowhome.com/wp-content/uploads/...",
  "publicUrl": "https://inshowhome.com/wp-content/uploads/..."
}
```

这样不会占用 Supabase 免费 Storage 容量。

## 9. 部署到 Vercel 或 Cloudflare

当前项目优先考虑：

- Vercel：最接近 Next.js 原生运行环境，适合快速上线和预览分支。
- Cloudflare Workers + OpenNext：适合希望使用 Cloudflare 边缘网络和 Worker 运行时的项目。

不要按纯静态站点部署。本项目包含 `/admin`、`/api/*`、Server Actions、cookies 和动态渲染。

### 9.1 Vercel 部署

Vercel 项目建议配置：

```text
Root Directory: apps/site
Install Command: corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm install --frozen-lockfile
Build Command: pnpm build
Output Directory: 保持默认
Node.js Version: 20
```

Vercel 环境变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media
UPYUN_BUCKET=
UPYUN_OPERATOR=
UPYUN_PASSWORD=
UPYUN_API_ENDPOINT=https://v0.api.upyun.com
UPYUN_PUBLIC_BASE_URL=https://inshowhome.metainshow.com
UPYUN_PATH_PREFIX=uploads/admin
```

如果还没有正式域名，`NEXT_PUBLIC_SITE_URL` 可以先填写 Vercel 分配的预览域名。绑定正式域名后再更新。

### 9.2 Cloudflare Workers + OpenNext 部署

Cloudflare 配置文件：

```text
apps/site/wrangler.jsonc
apps/site/open-next.config.ts
```

本地构建：

```bash
pnpm cf:build
```

本地预览 Worker：

```bash
pnpm cf:preview
```

部署：

```bash
pnpm cf:deploy
```

Cloudflare Worker 环境变量同样需要配置 Supabase 和站点变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media
UPYUN_BUCKET=
UPYUN_OPERATOR=
UPYUN_PASSWORD=
UPYUN_API_ENDPOINT=https://v0.api.upyun.com
UPYUN_PUBLIC_BASE_URL=https://inshowhome.metainshow.com
UPYUN_PATH_PREFIX=uploads/admin
```

OpenNext 构建会生成 `.open-next`，这是构建产物，不要提交到 Git。

### 9.3 部署后检查

部署成功后，依次访问：

```text
/
/products
/news
/contact
/admin/login
/api/inquiries
```

如果 `/admin/login` 或 `/admin` 报错，优先检查：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Supabase RLS 和后台用户角色

如果前台数据没有更新，优先检查后台保存动作是否触发 revalidate，或检查 `FRONTEND_REVALIDATE_SECONDS`。

## 10. 开发新功能的流程

### 10.1 新增前台页面

1. 在 `apps/site/app/(frontend)` 下创建 route。
2. 若页面读取产品、分类或文章，优先使用 `apps/site/lib/data.ts`。
3. 若页面需要 SEO，使用 `getRuntimeSiteConfig()` 和 `createMetadata()`。
4. 若页面包含表单，统一提交 `/api/inquiries`。
5. 加上 `export const revalidate = 300`，或根据需要调整。
6. 检查移动端和桌面布局。

### 10.2 新增后台模块

1. 在 `apps/site/app/(admin)/admin/(protected)` 下创建页面。
2. 在 `apps/site/components/admin` 创建表单、表格或 dialog 组件。
3. 在 `apps/site/lib/admin-data.ts` 增加读取函数。
4. 在 `apps/site/app/(admin)/admin/actions.ts` 增加写操作。
5. 在 `AdminNav.tsx` 增加菜单项。
6. 在 Supabase schema 中补充表、索引、RLS、grant。
7. 写完后运行 typecheck。

### 10.3 新增字段

新增字段需要同步修改：

1. `supabase/schema.sql` 或新增 migration。
2. `packages/core/src/types.ts`。
3. `packages/core/src/frontend-client.ts` 的 row mapper。
4. `apps/site/lib/admin-data.ts` 的 admin mapper 和 select。
5. 后台 form 组件。
6. `actions.ts` 的 Zod schema 和 payload。
7. 如果前台要展示，修改对应前台页面。
8. 如果导入要填充，修改 `packages/migrator` 和 `apps/site/lib/migration-import.ts`。

### 10.4 新增导入字段

1. 修改 `packages/migrator/src/woocommerce/csv.ts` 或 `wordpress/wxr.ts`。
2. 将字段映射到 `MigrationEntity.data`。
3. 修改 `apps/site/lib/migration-import.ts` 的 Supabase payload。
4. 增加 migrator 测试。
5. 运行：

```bash
pnpm --filter @global-trade/migrator test
pnpm --filter @global-trade/site typecheck
```

## 11. 常见问题

### 11.1 后台报 Missing environment variable

通常是部署平台或本地缺少：

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

至少要提供 URL 和一个 public key。

### 11.2 能登录后台但看不到/改不了数据

检查 `profiles.role`。

第一个用户默认是 `viewer`，需要手动改为：

```sql
update public.profiles
set role = 'owner'
where email = 'admin@example.com';
```

### 11.3 提示 schema cache 找不到列

说明代码已经使用新字段，但 Supabase 数据库还没执行对应迁移。

处理方式：

1. 查看报错列名。
2. 检查 `supabase/schema.sql` 或 `supabase/migrations` 中是否已有该列。
3. 在 Supabase SQL Editor 执行缺失迁移。
4. 等待 PostgREST schema cache 刷新，必要时重启项目或等待数十秒。

### 11.4 导入商品数量少于旧站

可能原因：

- CSV 中存在重复 slug，导入时发生 upsert。
- 商品类型或状态在导出中不完整。
- WooCommerce CSV 缺少某些字段。
- WXR 和 CSV 数据互相覆盖。
- 源数据中存在 draft/private/trash 项。
- 解析器按 source 或 slug 去重。

排查入口：

```text
packages/migrator/src/woocommerce/csv.ts
apps/site/lib/migration-import.ts
```

### 11.5 分类 Thumbnail 没导入

产品 CSV 一般不包含分类 thumbnail。需要 WooCommerce Product Categories CSV，且字段包含：

```text
Thumbnail
```

或者使用 `/admin/migrations` 中的 WooCommerce REST sync 补充。

### 11.6 构建失败，提示 pnpm not found

必须在部署平台或 CI 中启用 Corepack：

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

Vercel 或其他 CI 平台的 install command 需要包含上述步骤。

### 11.7 Cloudflare OpenNext 构建产物异常

如果 Cloudflare/OpenNext 构建异常，优先检查：

- `apps/site/wrangler.jsonc` 是否指向 `.open-next/worker.js`。
- `apps/site/open-next.config.ts` 是否存在。
- `pnpm cf:build` 是否可以在本地通过。
- `.open-next` 是否没有被提交到 Git。

### 11.8 前台数据更新不及时

前台缓存默认 300 秒。后台保存时会主动 revalidate。若绕过后台直接改数据库，前台可能等到 revalidate 时间才刷新。

需要立即生效时：

- 通过后台保存一次对应内容。
- 或添加专门的 revalidate API。
- 或临时调低 `FRONTEND_REVALIDATE_SECONDS`。

## 12. 安全注意事项

- 不要把 `SUPABASE_SERVICE_ROLE_KEY` 暴露到浏览器。
- 不要把 `.env.local`、Vercel/Cloudflare token、又拍云操作员密码、Ali OSS 密钥提交到 Git。
- 新表必须开启 RLS。
- 新增 public insert policy 时必须限制字段长度和 JSON 大小。
- 后台写操作必须使用 `requireAdminSession()` 或 `requireAdminRole()`。
- 不要在前台直接调用 service-role API。

## 13. 参考资料

- Supabase Next.js 指南：https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- Supabase RLS 文档：https://supabase.com/docs/guides/database/postgres/row-level-security
- Vercel Next.js 部署文档：https://vercel.com/docs/frameworks/nextjs
- OpenNext Cloudflare 文档：https://opennext.js.org/cloudflare
- Cloudflare Workers 文档：https://developers.cloudflare.com/workers/
- 项目媒体和国际化规划：`docs/media-storage-and-i18n-plan.md`
