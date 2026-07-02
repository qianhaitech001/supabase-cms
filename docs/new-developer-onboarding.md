# 新人上手指南

这份文档面向第一次接触 Next.js 和 Supabase 的开发者。目标是让你先把项目跑起来，再理解前台、后台、数据库和部署之间的关系。

## 1. 先理解项目在做什么

这个项目是一个外贸展示型 CMS 模板。它主要解决三件事：

- 前台展示产品、分类、文章、页面和联系表单。
- 后台维护产品、文章、分类、SEO、站点配置、询盘和迁移导入。
- 使用 Supabase 保存数据、处理登录权限，并保存后台新上传的媒体文件。

它不是完整商城。不要在没有明确需求时加入购物车、订单、支付、优惠券、税费、物流和客户账户。

## 2. 准备本地环境

你需要先安装：

- Node.js 20 或更高版本。
- pnpm。项目固定使用 `pnpm@9.15.4`。
- 一个 Supabase 项目，用来保存真实数据。

在项目根目录执行：

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

如果你只是阅读代码，可以暂时不连接 Supabase。如果你要登录后台、保存内容或测试接口，就必须配置 Supabase。

## 3. 创建 Supabase 项目

1. 打开 Supabase 控制台。
2. 创建一个新 Project。
3. 进入 Project Settings，找到 API 配置。
4. 复制 Project URL、publishable key 或 anon key、service role key。

注意：

- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 可以暴露给浏览器。
- `SUPABASE_SERVICE_ROLE_KEY` 只能放在服务端环境变量里，不能写进前端代码，也不能提交到 Git。

## 4. 初始化数据库

新项目或空数据库只执行完整 schema：

```text
supabase/schema.sql
```

操作方式：

1. 打开 Supabase SQL Editor。
2. 复制 `supabase/schema.sql` 的全部内容。
3. 粘贴到 SQL Editor 并执行。
4. 确认没有报错。

执行后，Supabase 会拥有项目需要的表、索引、RLS 权限策略、Storage bucket 和 grants。

如果你接手的是已有旧库，不要重跑 `schema.sql`。旧库只按顺序执行 `supabase/migrations/*.sql`。详细规则见 `supabase/README.md`。

## 5. 配置本地环境变量

复制环境变量示例：

```bash
cp apps/site/.env.example apps/site/.env.local
```

填写至少这些值：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的 publishable key
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon key
SUPABASE_SERVICE_ROLE_KEY=你的 service role key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media
```

生产环境如果使用又拍云上传新静态资源，把 `MEDIA_UPLOAD_PROVIDER` 改成 `upyun`，并配置 `UPYUN_BUCKET`、`UPYUN_OPERATOR`、`UPYUN_PASSWORD`、`UPYUN_PUBLIC_BASE_URL` 和 `UPYUN_PATH_PREFIX`。不要把这些凭证提交到 Git。

本地开发时，`NEXT_PUBLIC_SITE_URL` 可以先写 `http://localhost:3000`。

## 6. 创建第一个后台管理员

1. 在 Supabase Dashboard 的 Authentication 里创建用户。
2. 回到 SQL Editor，执行：

```sql
update public.profiles
set role = 'owner'
where email = '你的登录邮箱';
```

3. 启动项目后访问 `/admin/login`。
4. 使用刚才创建的邮箱和密码登录。

如果 `profiles` 里没有这个用户，通常说明 Auth 用户没有成功创建，或者 `schema.sql` 里的 trigger 没有执行成功。

## 7. 启动项目

执行：

```bash
pnpm dev
```

常用页面：

- 前台首页：`http://localhost:3000/`
- 产品列表：`http://localhost:3000/products`
- 新闻列表：`http://localhost:3000/news`
- 联系页：`http://localhost:3000/contact`
- 后台登录：`http://localhost:3000/admin/login`
- 后台首页：`http://localhost:3000/admin`

如果启动端口不是 3000，以终端输出为准。

## 8. 先做一个最小验证

项目跑起来后，按顺序检查：

1. `/` 能打开。
2. `/admin/login` 能打开。
3. 能用 owner 用户登录后台。
4. 后台 Products、Posts、Settings 页面不会报环境变量或字段缺失。
5. 在后台创建一篇 draft post，再保存。
6. 执行类型检查：

```bash
pnpm --filter @global-trade/site typecheck
```

做到这一步，说明本地开发环境已经可用。

## 9. 新人应该先看哪些文件

先看这些文件，不要一开始全仓库乱翻：

- `README.md`：项目定位和常用命令。
- `docs/development-guide.md`：完整开发说明。
- `supabase/README.md`：数据库初始化和迁移规则。
- `packages/core/src/types.ts`：前台可用的数据类型。
- `packages/core/src/frontend-client.ts`：Supabase row 如何变成前台 typed data。
- `apps/site/lib/data.ts`：前台页面应该从哪里取数据。
- `apps/site/lib/admin-data.ts`：后台列表和编辑页如何读取数据。

## 10. 如何开发前台页面

前台页面在：

```text
apps/site/app/(frontend)
```

常用组件在：

```text
apps/site/components
```

开发规则：

- 页面组件不要随手直接写 Supabase 查询。
- 优先使用 `apps/site/lib/data.ts` 里的数据入口。
- 页面需要的字段必须能在 `packages/core/src/types.ts` 和 `supabase/schema.sql` 中找到。
- 不要为了 UI 效果虚构字段、分类关系或接口返回。
- 旧站导入的图片和视频继续使用旧站 URL，不要自动上传到 Supabase Storage。

如果要让 AI 生成前台页面，先把 `docs/frontend-page-prompt-template.md` 里的中文模板复制给 AI。

## 11. 如何开发后台页面

后台页面在：

```text
apps/site/app/(admin)/admin
```

后台业务组件在：

```text
apps/site/components/admin
```

后台数据读取主要在：

```text
apps/site/lib/admin-data.ts
```

后台写入主要通过 Server Actions：

```text
apps/site/app/(admin)/admin/actions.ts
```

开发规则：

- 列表页保持分页、筛选、刷新和清晰的空状态。
- 表单页保持分区：主内容、分类/标签、媒体、SEO、发布状态、源站信息。
- 后台写操作必须检查登录和角色。
- 不要在客户端暴露 `SUPABASE_SERVICE_ROLE_KEY`。

## 12. 什么时候需要改数据库

只有在现有表和字段不能表达业务数据时，才改数据库。

改数据库时必须同时处理：

- `supabase/schema.sql`：新项目完整结构。
- `supabase/migrations/*.sql`：旧项目升级补丁。
- `packages/core/src/types.ts`：前台和后台共享类型。
- `apps/site/lib/*`：实际数据读写逻辑。
- RLS policy、grants、索引和已有数据兼容。

如果只是调整 UI、布局、按钮文案或列表展示，通常不需要改数据库。

## 13. WordPress 和 WooCommerce 数据迁移

后台迁移入口：

```text
/admin/migrations
```

支持：

- WordPress WXR/XML。
- WooCommerce CSV。
- WooCommerce REST sync。

迁移原则：

- 优先 upsert，避免重复插入已有产品、分类、文章和媒体。
- 导入媒体保存为 remote URL，不占用 Supabase Storage。
- REST sync 只补充缺失字段，不应覆盖人工整理过的数据。

## 14. 常用验证命令

改前台或后台后，至少执行：

```bash
pnpm --filter @global-trade/site typecheck
```

改 `packages/core` 后，执行：

```bash
pnpm --filter @global-trade/core test
```

改迁移解析后，执行：

```bash
pnpm --filter @global-trade/migrator test
```

改部署配置后，按目标平台执行：

```bash
pnpm --filter @global-trade/site build
pnpm cf:build
```

## 15. 常见问题

### 后台提示 Missing environment variable

检查 `apps/site/.env.local` 是否填写：

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

修改环境变量后需要重启 dev server。

### 提示 Could not find column in schema cache

说明代码已经使用了新字段，但 Supabase 数据库没有执行对应 SQL。

处理方式：

1. 检查 `supabase/schema.sql` 或 `supabase/migrations` 是否已有该字段。
2. 新项目确认是否执行了完整 `schema.sql`。
3. 旧项目确认是否执行了对应 migration。
4. Supabase 有时需要等待 schema cache 刷新，必要时重启本地 dev server 后再试。

### 登录后台后权限不足

检查 `public.profiles.role`。第一个管理员必须手动设置为 `owner`。

### 前台没有数据

检查 products、posts 或 pages 的 `status` 是否为 `published`。公开前台默认只能读取 published 内容。

### 上传媒体失败

检查：

- `MEDIA_UPLOAD_PROVIDER` 是否为 `supabase` 或 `upyun`。
- 使用 Supabase 时，检查 `SUPABASE_MEDIA_BUCKET=media`，并确认 `schema.sql` 创建了 `media` bucket 和 storage policies。
- 使用又拍云时，检查 `UPYUN_BUCKET`、`UPYUN_OPERATOR`、`UPYUN_PASSWORD`、`UPYUN_PUBLIC_BASE_URL` 和 `UPYUN_PATH_PREFIX`。
- 当前登录用户是否是 `owner`、`admin` 或 `editor`。

## 16. 开发前的最后检查

开始写代码前，先确认：

- 你知道要改的是前台、后台、数据访问、迁移、还是数据库结构。
- 你已经看过相关现有文件和相邻实现。
- 你没有虚构数据库字段或 API 返回。
- 你知道改完后要跑哪条验证命令。
- 你不会提交 `.env.local`、service role key、`.next`、`.open-next` 或其他本地构建产物。
