# Supabase CMS Template

这是一个面向外贸展示型网站的可复用 CMS 模板，核心能力包括：前台展示页、后台内容管理、Supabase 数据结构、SEO 配置、询盘接口、媒体引用、WordPress/WooCommerce 数据迁移，以及 Vercel / Cloudflare Workers 部署配置。

项目定位是“商品展示 + 内容发布 + 询盘”，不是完整交易型商城。默认不包含购物车、结账、订单、支付、物流、税务、优惠券和客户账户等功能。

## 文档入口

- [新人上手指南](docs/new-developer-onboarding.md)：面向第一次接触 Next.js 和 Supabase 的开发者，按顺序完成环境准备、Supabase 初始化、后台登录和第一个验证。
- [静态 / 动态站点搭建操作手册](docs/site-build-operations.md)：说明如何从零搭建静态版本或 Supabase 动态版本站点，并完成本地开发、数据配置、媒体上传和部署检查。
- [开发指南](docs/development-guide.md)：完整说明项目结构、数据模型、前后台开发、Supabase 配置、迁移流程和部署方式。
- [演示说明](docs/demo-overview.md)：用于讲解和演示的简洁版本，重点说明 Supabase 连接、Vercel 部署和 Cloudflare Workers 部署流程。
- [媒体存储与国际化规划](docs/media-storage-and-i18n-plan.md)：说明 Supabase / 又拍云上传适配和国际化预留方案。
- [前台双架构对照清单](docs/frontend-dual-architecture-gap-analysis.md)：对照静态版 / Supabase 动态版需求，说明已覆盖能力、当前缺口和后续开发边界。
- [AI 开发契约](docs/ai-development-contract.md)：Codex、Claude Code 等 AI 工具必须遵守的统一项目规范。
- [前台页面生成契约](docs/frontend-page-contract.md)：约束 AI 生成前台页面时必须匹配后台数据结构，不能虚构字段。
- [前台页面提示模板](docs/frontend-page-prompt-template.md)：后端同事让 AI 生成前台页面时可直接复制使用的中文模板。

## 使用 AI 工具开发前

使用 Claude、Cursor、Trae、Codex 或其他 AI 编程工具前，请先让 AI 阅读这些文件：

1. [AI_RULES.md](AI_RULES.md)
2. [AI 开发契约](docs/ai-development-contract.md)
3. [静态 / 动态站点搭建操作手册](docs/site-build-operations.md)
4. [前台页面生成契约](docs/frontend-page-contract.md)
5. [前台页面提示模板](docs/frontend-page-prompt-template.md)

工具入口文件：

- `AGENTS.md`：Codex / 类 Codex 工具。
- `CLAUDE.md`：Claude Code。
- `.cursor/rules/*.mdc`：Cursor。
- `TRAE.md`：Trae 或其他不能稳定读取 Cursor/Codex 规则的工具。

无论使用哪种工具，前台页面都不能虚构后台字段；静态版本读取 `static-content.ts` / `mock-data.ts`，动态版本读取 `apps/site/lib/data.ts` 和 `packages/core` typed data。

## 项目结构

- `apps/site`：Next.js App Router 应用，包含前台页面、后台页面、API、Server Actions、组件和运行时数据访问。
- `packages/core`：共享类型、内容模型、SEO 类型、slug 工具和前台 typed data client。
- `packages/migrator`：WordPress WXR/XML、WooCommerce CSV、WooCommerce REST 等迁移解析逻辑。
- `supabase/schema.sql`：新项目或空库初始化用的完整数据库模板。
- `supabase/migrations`：已有项目升级用的增量数据库补丁。
- `docs`：开发、部署、迁移、AI 协作和团队交接文档。

## 快速启动

如果你第一次接触 Next.js 或 Supabase，请先读 [新人上手指南](docs/new-developer-onboarding.md)，再执行下面的命令。

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm typecheck
pnpm --filter @global-trade/site dev
```

本地连接真实 Supabase 项目前，复制环境变量文件：

```bash
cp apps/site/.env.example apps/site/.env.local
```

然后填写 Supabase 相关配置。

## 环境变量

连接真实 Supabase 项目时至少需要：

```bash
STOREFRONT_DATA_MODE=auto
STOREFRONT_THEME=inshow
NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false
NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

`STOREFRONT_DATA_MODE` 用于切换前台数据分支：

- `auto`：默认，Supabase 可用时读动态数据，否则读本地静态 typed data。
- `static`：强制纯静态展示分支，适合无后台、无数据库的展示站调试。
- `supabase`：强制动态分支，适合连接真实后台数据的环境。

`STOREFRONT_THEME` 用于切换前台视觉语气，不影响数据结构：

- `inshow`：默认外贸 B2B 橙色强调 + 深蓝页脚。
- `minimal`：更克制的黑白编辑型风格。
- `industrial`：硬朗工业风格，适合设备、建材、制造业。
- `warm`：暖色家居/生活方式风格。

新增前台页面时应优先使用 `components/storefront` 下的可复用组件和 CSS 变量，不要在页面里写死品牌色、圆角、阴影和按钮风格。

`NEXT_PUBLIC_STOREFRONT_I18N_ENABLED` 用于控制前台是否启用语言切换：

- 单语言英文站：`NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false`、`NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en`、`NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en`。
- 单语言中文站：`NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false`、`NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=zh`、`NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=zh`。
- 中英双语站：`NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=true`、`NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE=en`、`NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES=en,zh`。

关闭多语言时不会显示语言切换按钮，也不会读取语言 cookie；站点只使用默认语言内容。

媒体上传提供商只通过环境变量控制。WordPress/WooCommerce 导入的旧站媒体默认保持远程 URL，不会自动上传到 Supabase Storage。

本地默认可以继续使用 Supabase Storage：

```bash
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media
```

生产环境新上传静态资源建议使用又拍云：

```bash
MEDIA_UPLOAD_PROVIDER=upyun
UPYUN_BUCKET=
UPYUN_OPERATOR=
UPYUN_PASSWORD=
UPYUN_API_ENDPOINT=https://v0.api.upyun.com
UPYUN_PUBLIC_BASE_URL=https://inshowhome.metainshow.com
UPYUN_PATH_PREFIX=uploads/admin
```

不要提交 `.env.local`、Supabase service-role key、又拍云操作员密码、Ali OSS access key、`.next`、`.open-next` 等本地配置或构建产物。

## 数据迁移流程

数据库结构初始化请先查看 [Supabase 目录说明](supabase/README.md)：

- 新项目或空库：只执行 `supabase/schema.sql`。
- 已有旧库：不要重跑完整 schema，只按顺序执行需要的 `supabase/migrations/*.sql`。

1. 从旧 WordPress 站点导出 WXR/XML。
2. 从 WooCommerce 导出商品 CSV，并尽量包含自定义 meta 字段。
3. 进入后台 `/admin/migrations`，上传文件并先 Preview。
4. 确认导入后，系统会规范化产品、分类、文章、页面、媒体引用、SEO 字段和重定向数据。

迁移以 upsert 和补全字段为主，避免重复插入已有产品、分类、文章和媒体。导入媒体保持旧站远程 URL，不占用 Supabase Storage。

## 前台页面开发约束

AI 或开发者生成前台页面前，必须先理解后台数据结构：

- 查看 `packages/core/src/types.ts` 了解前台可用类型。
- 查看 `packages/core/src/frontend-client.ts` 了解数据库字段如何映射为 typed data。
- 查看 `apps/site/lib/data.ts` 了解前台页面应使用的数据入口。
- 查看 `supabase/schema.sql` 确认真实表结构和字段名。

禁止为了页面效果虚构字段、props、接口返回、表结构或分类关系。页面需要的新数据如果当前不存在，应先说明缺口，再做最小的类型或数据库变更。

更完整规则见 [前台页面生成契约](docs/frontend-page-contract.md)。

## Vercel 部署

Vercel 是当前推荐的部署路径之一。由于这是 pnpm workspace 项目，部署时建议：

- Root Directory：`apps/site`
- Install Command：`corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm install --frozen-lockfile`
- Build Command：`pnpm build`
- Output Directory：保持 Vercel 默认，不要配置为静态 `out`

Vercel 项目环境变量需要配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
MEDIA_UPLOAD_PROVIDER=supabase
SUPABASE_MEDIA_BUCKET=media
```

## Cloudflare Workers + OpenNext

项目包含 `/admin`、`/api/*`、Server Actions、cookies 和动态渲染，因此如果部署到 Cloudflare，应走 Workers + OpenNext，而不是纯静态 Cloudflare Pages。

本地构建 Worker：

```bash
pnpm cf:build
```

本地预览：

```bash
pnpm cf:preview
```

部署到 Cloudflare：

```bash
pnpm cf:deploy
```

Cloudflare 配置文件位于 `apps/site/wrangler.jsonc`，OpenNext adapter 配置位于 `apps/site/open-next.config.ts`。

## 常用验证命令

```bash
pnpm --filter @global-trade/site typecheck
pnpm --filter @global-trade/site test
pnpm --filter @global-trade/site build
pnpm --filter @global-trade/core test
pnpm --filter @global-trade/migrator test
pnpm cf:build
```

只改文档或 AI 规范时，不需要运行应用构建；改到前台、后台、数据访问、Next.js 配置、CSS 或部署配置时，应按改动范围选择对应验证命令。
