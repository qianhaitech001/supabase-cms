# Supabase 与部署流程说明

这份文档用于演示和讲解项目整体流程，重点说明两件事：

- Supabase 如何连接和初始化。
- 项目如何部署到 Vercel 或 Cloudflare Workers。

## 1. Supabase 连接流程

### 1.1 创建 Supabase 项目

在 Supabase 控制台创建一个新项目。

创建完成后，进入项目设置，复制：

- Project URL
- Publishable key 或 Anon key
- Service role key

### 1.2 配置本地环境变量

复制环境变量示例文件：

```bash
cp apps/site/.env.example apps/site/.env.local
```

填写 Supabase 相关变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的 Supabase Publishable key
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase Anon key
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase Service role key
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL` 必填。
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 至少填一个。
- `SUPABASE_SERVICE_ROLE_KEY` 只在服务端使用，后台创建/删除用户需要它。
- 不要把 `SUPABASE_SERVICE_ROLE_KEY` 暴露到前台代码中。

### 1.3 初始化数据库

新项目或空数据库，打开 Supabase SQL Editor，执行：

```text
supabase/schema.sql
```

这个 SQL 会创建：

- 产品表。
- 分类表。
- 文章表。
- 页面表。
- 媒体表。
- 询盘表。
- 站点配置表。
- 后台用户资料表。
- RLS 权限策略。
- Supabase Storage 的 `media` bucket。

如果是旧数据库升级，不要重跑完整 `schema.sql`，只按顺序执行对应的 `supabase/migrations` 文件。详细规则见 `supabase/README.md`。

### 1.4 创建第一个后台管理员

先在 Supabase Authentication 里创建一个用户。

然后在 SQL Editor 执行：

```sql
update public.profiles
set role = 'owner'
where email = '你的管理员邮箱';
```

之后就可以用这个账号登录：

```text
/admin/login
```

### 1.5 本地验证连接

安装依赖：

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

启动项目：

```bash
pnpm --filter @global-trade/site dev
```

访问：

```text
http://localhost:3000/admin/login
```

如果能登录后台，并且 Products、Posts、Settings 页面能正常读取数据，说明 Supabase 连接正常。

## 2. 运行时环境变量

部署到 Vercel 或 Cloudflare Workers 后，需要在对应平台配置同样的运行时环境变量。

必填：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

媒体上传本地可使用 Supabase Storage，生产可切换到又拍云：

```bash
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media
# or
MEDIA_UPLOAD_PROVIDER=upyun
UPYUN_BUCKET=
UPYUN_OPERATOR=
UPYUN_PASSWORD=
UPYUN_PUBLIC_BASE_URL=https://inshowhome.metainshow.com
UPYUN_PATH_PREFIX=uploads/admin
```

如果暂时没有正式域名，`NEXT_PUBLIC_SITE_URL` 可以先填写 Vercel 或 Cloudflare 分配的预览域名。绑定正式域名后再更新。

## 3. Vercel 部署流程

Vercel 适合直接部署 Next.js full-stack 应用。

建议配置：

```text
Root Directory: apps/site
Install Command: corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm install --frozen-lockfile
Build Command: pnpm build
Output Directory: 保持默认
Node.js Version: 20
```

部署前确认：

- Vercel 项目已经配置 Supabase 环境变量。
- `NEXT_PUBLIC_SITE_URL` 已填写预览域名或正式域名。
- 构建命令没有使用静态导出。

## 4. Cloudflare Workers + OpenNext 部署流程

项目包含 `/admin`、`/api/*`、Server Actions、cookies 和动态渲染。如果部署到 Cloudflare，应走 Workers + OpenNext，而不是纯静态 Pages。

配置文件：

```text
apps/site/wrangler.jsonc
apps/site/open-next.config.ts
```

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

部署前确认：

- Cloudflare Worker 已配置 Supabase 环境变量。
- `apps/site/wrangler.jsonc` 的 `main` 指向 `.open-next/worker.js`。
- `pnpm cf:build` 能在本地通过。
- `.open-next` 没有提交到 Git。

## 5. 部署后检查

部署成功后，依次检查：

```text
/
/products
/news
/contact
/admin/login
/api/inquiries
```

如果 `/admin/login` 或 `/admin` 报错，优先检查：

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

如果构建日志出现 `pnpm: not found`，检查部署平台 install command 是否包含：

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

## 6. 最小上线清单

上线前确认：

- Supabase schema 已执行。
- 第一个后台用户已经设置为 `owner`。
- 部署平台已配置 Supabase 环境变量。
- 构建能通过 typecheck。
- 前台页面能读取 Supabase 数据。
- `/admin/login` 能登录。
- `/api/inquiries` 能提交询盘。
