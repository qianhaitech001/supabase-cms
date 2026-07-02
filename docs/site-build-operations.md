# 静态 / 动态站点搭建操作手册

本文档说明如何基于当前项目从零搭建一个外贸展示型站点，并按需要选择“静态版本”或“Supabase 动态版本”。两种版本共用同一套 Next.js 前台组件、视觉主题、数据类型和部署流程，区别主要在数据来源和后台能力。

## 1. 先确认站点形态

开始前先确定站点使用哪种模式。

| 模式 | 适合场景 | 数据来源 | 后台 | 表单提交 |
| --- | --- | --- | --- | --- |
| 静态版本 | 快速交付展示站、客户暂时不需要后台、内容变动少 | 本地静态 typed data / 配置文件 | 不依赖后台 | 可使用 mailto、WhatsApp、外部表单或后续接 API |
| 动态版本 | 需要后台管理产品、文章、SEO、询盘、迁移旧站数据 | Supabase Postgres + Storage / 又拍云 | 使用 `/admin` | 提交到 `/api/inquiries` 并写入 Supabase |

项目通过环境变量切换前台数据模式：

```bash
STOREFRONT_DATA_MODE=static    # 强制静态版本
STOREFRONT_DATA_MODE=supabase  # 强制 Supabase 动态版本
STOREFRONT_DATA_MODE=auto      # 默认，Supabase 可用时读动态数据，否则回退静态数据
```

建议：

- 做纯展示站或前期视觉开发：先用 `static`。
- 做带后台的正式站：使用 `supabase`。
- 做模板演示或本地兼容开发：使用 `auto`。

## 2. 准备本地环境

### 2.1 安装 Node 与 pnpm

项目建议使用 Node.js 20+ 和 pnpm 9.15.4。

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

### 2.2 复制环境变量

```bash
cp apps/site/.env.example apps/site/.env.local
```

本地只开发静态版本时，最少配置：

```bash
STOREFRONT_DATA_MODE=static
STOREFRONT_THEME=inshow
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en
```

连接 Supabase 动态版本时，至少配置：

```bash
STOREFRONT_DATA_MODE=supabase
STOREFRONT_THEME=inshow
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

说明：

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 至少填写一个。
- `SUPABASE_SERVICE_ROLE_KEY` 只能服务端使用，不能写入前台代码。
- 没有正式域名时，`NEXT_PUBLIC_SITE_URL` 本地填 `http://localhost:3000`，部署后再换成平台域名或正式域名。
- 不需要多语言的站点保持 `NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false`，只维护默认语言内容即可。

### 2.3 启动项目

```bash
pnpm --filter @global-trade/site dev
```

常用入口：

- 前台首页：`http://localhost:3000/`
- 产品页：`http://localhost:3000/products`
- 新闻页：`http://localhost:3000/news`
- 联系页：`http://localhost:3000/contact`
- 后台登录：`http://localhost:3000/admin/login`

## 3. 搭建静态版本

静态版本不要求 Supabase 可用，适合先做视觉、内容结构和静态展示。

### 3.1 设置静态模式

在 `apps/site/.env.local` 中配置：

```bash
STOREFRONT_DATA_MODE=static
STOREFRONT_THEME=inshow
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en
```

### 3.2 配置语言

单语言英文站：

```bash
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en
```

单语言中文站：

```bash
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=zh
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=zh
```

中英双语站：

```bash
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=true
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en,zh
```

关闭多语言时：

- 不显示 Header 语言切换按钮。
- 不读取语言 cookie。
- 页面始终使用 `NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE`。
- 不要求维护另一套语言文案。

### 3.3 修改静态内容

静态内容集中放在：

```text
apps/site/lib/static-content.ts
```

主要包含：

- 中英文文案。
- 首页 hero、产品分类区、About、Contact、Footer 文案。
- 静态产品和分类的本地化补充。
- 静态 SEO title / description。
- 联系邮箱、电话、WhatsApp、地图地址。

产品与分类的基础 mock 数据在：

```text
apps/site/lib/mock-data.ts
```

建议做法：

1. 先在 `mock-data.ts` 中维护产品、分类、图片 URL、slug、摘要、规格。
2. 再在 `static-content.ts` 中补充中英文显示文案。
3. 页面组件只读取 typed data，不在页面里临时写死产品字段。

### 3.4 切换视觉语气

视觉主题通过环境变量切换：

```bash
STOREFRONT_THEME=inshow
STOREFRONT_THEME=minimal
STOREFRONT_THEME=industrial
STOREFRONT_THEME=warm
```

主题定义位于：

```text
apps/site/lib/storefront-theme.ts
apps/site/app/globals.css
```

开发新风格时，优先扩展 CSS 变量和可复用组件，不要在页面中大量写死颜色、圆角、阴影和按钮样式。

### 3.5 静态版联系与询盘

静态版本默认不写 Supabase。

可使用的方式：

- `mailto:` 邮件链接。
- WhatsApp 链接。
- 电话链接。
- 外部表单服务。
- 后续接入自己的 API。

当前可复用联系组件：

```text
apps/site/components/storefront/StaticContactPanel.tsx
apps/site/components/ReachUsSection.tsx
```

### 3.6 静态版检查

```bash
pnpm --filter @global-trade/site typecheck
pnpm --filter @global-trade/site build
```

重点检查：

- 首页、产品页、产品详情、新闻、联系页能打开。
- 中英文切换后文案正常。
- 图片和视频 URL 可以加载。
- SEO title / description 不为空。

## 4. 搭建 Supabase 动态版本

动态版本适合需要后台编辑、询盘入库、WordPress/WooCommerce 迁移和 SEO 管理的站点。

### 4.1 创建 Supabase 项目

在 Supabase 控制台创建项目后，复制：

- Project URL
- Publishable key 或 Anon key
- Service role key

写入 `apps/site/.env.local`：

```bash
STOREFRONT_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4.2 初始化数据库

新项目或空库只执行：

```text
supabase/schema.sql
```

执行方式：

1. 打开 Supabase SQL Editor。
2. 复制 `supabase/schema.sql` 全部内容。
3. 执行 SQL。

不要在新库初始化后再重复执行 `supabase/migrations`。`migrations` 只用于旧库升级。

### 4.3 创建第一个后台管理员

先在 Supabase Authentication 中创建用户。

然后在 SQL Editor 执行：

```sql
update public.profiles
set role = 'owner'
where email = '你的管理员邮箱';
```

登录后台：

```text
/admin/login
```

### 4.4 配置后台 Settings

进入：

```text
/admin/settings
```

至少配置：

- Site name
- Domain
- 默认 SEO title / description
- 首页 SEO
- 产品列表 SEO
- 新闻列表 SEO
- 联系页 SEO
- 是否允许搜索引擎索引

前台 metadata、robots、sitemap 都应读取后台配置，不继承旧站 `noindex,nofollow`。

### 4.5 管理产品、文章和分类

后台常用模块：

- `/admin/products`：产品列表、编辑、上架/草稿、图片、图库、规格、SEO。
- `/admin/product-categories`：产品分类树、分类图片、父子级关系。
- `/admin/posts`：文章列表、BlockNote / 表单编辑器、分类、标签、SEO。
- `/admin/inquiries`：统一询盘收件箱。
- `/admin/migrations`：WordPress/WooCommerce 导入和 WooCommerce REST 补全。

前台页面不要直接假设数据库字段，应该通过：

```text
apps/site/lib/data.ts
packages/core/src/frontend-client.ts
packages/core/src/types.ts
```

读取稳定 typed data。

### 4.6 导入旧站数据

导入入口：

```text
/admin/migrations
```

支持：

- WordPress WXR/XML。
- WooCommerce CSV。
- WooCommerce REST 补全。

推荐流程：

1. 上传 WXR/XML 和 WooCommerce CSV。
2. 点击 Preview migration。
3. 查看 counts、samples、warnings。
4. 确认后执行导入。
5. 如分类图片或产品图片缺失，再用 WooCommerce REST 补全。

导入规则：

- 产品、分类、文章以 upsert 为主，不重复插入已有记录。
- WordPress/WooCommerce 旧媒体默认保留远程 URL。
- 不自动把旧站媒体上传到 Supabase Storage。
- 如果已有静态资源已迁移到 CDN，可通过 URL 替换功能把旧域名替换为新 CDN 域名。

## 5. 媒体上传配置

导入旧站媒体和后台新上传媒体是两套逻辑。

### 5.1 旧站导入媒体

旧站导入媒体保存为 remote URL，例如：

```text
https://old-site.com/wp-content/uploads/...
```

它不会占用 Supabase Storage。

### 5.2 后台新上传媒体

后台新上传走统一 storage adapter。

本地使用 Supabase Storage：

```bash
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media
```

生产使用又拍云：

```bash
MEDIA_UPLOAD_PROVIDER=upyun
UPYUN_BUCKET=
UPYUN_OPERATOR=
UPYUN_PASSWORD=
UPYUN_API_ENDPOINT=https://v0.api.upyun.com
UPYUN_PUBLIC_BASE_URL=https://your-cdn-domain.com
UPYUN_PATH_PREFIX=uploads/admin
```

页面里只使用返回的 `publicUrl`，不要关心底层是 Supabase Storage 还是又拍云。

## 6. 开发前台页面

前台页面位于：

```text
apps/site/app/(frontend)
```

可复用组件优先放在：

```text
apps/site/components/storefront
```

开发规则：

- 页面读取 `apps/site/lib/data.ts`，不要散落 Supabase 查询。
- 类型以 `packages/core/src/types.ts` 为准。
- SEO 使用后台 Settings 或 `static-content.ts`。
- 图片、视频使用数据中的 URL，不在页面里硬编码临时资源。
- 需要新字段时，先补类型和数据入口，再补页面。
- 静态版与动态版能共用的 UI 要抽成组件。

新增页面建议流程：

1. 先确认页面需要的 typed data。
2. 检查 `packages/core/src/types.ts` 是否已有字段。
3. 检查 `apps/site/lib/data.ts` 是否已有读取入口。
4. 在 `components/storefront` 写可复用组件。
5. 在 `app/(frontend)` 写页面组合。
6. 同时检查 `static` 和 `supabase` 两种数据模式。

## 7. 部署静态 / 动态版本

### 7.1 Vercel

Vercel 适合直接部署完整 Next.js 应用。

建议配置：

```text
Root Directory: apps/site
Install Command: corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm install --frozen-lockfile
Build Command: pnpm build
Output Directory: 保持默认
Node.js Version: 20
```

静态版本环境变量示例：

```bash
STOREFRONT_DATA_MODE=static
STOREFRONT_THEME=inshow
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en
```

动态版本环境变量示例：

```bash
STOREFRONT_DATA_MODE=supabase
STOREFRONT_THEME=inshow
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MEDIA_UPLOAD_PROVIDER=upyun
UPYUN_BUCKET=
UPYUN_OPERATOR=
UPYUN_PASSWORD=
UPYUN_PUBLIC_BASE_URL=
UPYUN_PATH_PREFIX=uploads/admin
```

### 7.2 Cloudflare Workers + OpenNext

如果需要部署 `/admin`、`/api/*`、Server Actions、cookies 和动态渲染，应使用 Cloudflare Workers + OpenNext。

本地构建：

```bash
pnpm cf:build
```

本地预览：

```bash
pnpm cf:preview
```

部署：

```bash
pnpm cf:deploy
```

Cloudflare 环境变量与 Vercel 类似，需要在 Worker 环境中配置。

不要提交：

```text
.next
.open-next
.vercel
.env.local
```

## 8. 交付前检查清单

### 8.1 通用检查

```bash
pnpm --filter @global-trade/site typecheck
pnpm --filter @global-trade/site build
```

检查页面：

- `/`
- `/products`
- `/products/[slug]`
- `/news`
- `/contact`
- `/admin/login`

### 8.2 静态版本检查

- `STOREFRONT_DATA_MODE=static`。
- 页面不依赖 Supabase 环境变量。
- 产品、分类、新闻、联系信息来自静态 typed data。
- 中英切换能正常刷新文案。
- 联系方式能打开 email、WhatsApp、电话或外部链接。
- SEO title / description 已替换为当前站点内容。

### 8.3 动态版本检查

- Supabase schema 已执行。
- 管理员账号可登录。
- Products、Posts、Categories、Settings 可正常读写。
- `/api/inquiries` 可提交询盘。
- RLS 未阻止正常后台操作。
- 前台页面数据来自 Supabase typed data。
- 新上传图片能返回可访问的 `publicUrl`。

## 9. 常见问题

### 页面显示静态数据，不显示后台数据

检查：

```bash
STOREFRONT_DATA_MODE
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

如果 `STOREFRONT_DATA_MODE=static`，前台会强制使用静态数据。

### 后台登录后页面报缺字段

说明代码依赖的数据库字段没有执行到当前库。

处理方式：

- 新库：确认执行的是最新 `supabase/schema.sql`。
- 旧库：按顺序执行缺失的 `supabase/migrations/*.sql`。

不要在已有旧库上直接重跑完整 schema。

### 图片上传失败

检查：

- `MEDIA_UPLOAD_PROVIDER` 是否正确。
- Supabase bucket 或又拍云 bucket 是否存在。
- 又拍云操作员、密码、服务名、CDN 域名是否匹配。
- 返回的 `publicUrl` 是否可以直接访问。

### 部署后 `/admin` 或 `/api/*` 不可用

说明部署成了纯静态站，或平台没有启用 Next.js 动态能力。

处理方式：

- Vercel：不要配置静态 `out`。
- Cloudflare：使用 Workers + OpenNext，不要只用纯静态 Pages。

## 10. 推荐建站顺序

静态版本：

1. 配置 `STOREFRONT_DATA_MODE=static`。
2. 修改 `static-content.ts` 和 `mock-data.ts`。
3. 调整主题变量。
4. 完成首页、产品页、详情页、新闻页、联系页。
5. 跑 typecheck/build。
6. 部署到 Vercel 或 Cloudflare Workers。

动态版本：

1. 创建 Supabase 项目。
2. 执行 `supabase/schema.sql`。
3. 配置环境变量。
4. 创建后台管理员。
5. 登录 `/admin` 配置 Settings。
6. 录入或迁移 Products、Posts、Categories、Media、SEO。
7. 检查前台 typed data。
8. 配置媒体上传 provider。
9. 跑 typecheck/build。
10. 部署到 Vercel 或 Cloudflare Workers。
