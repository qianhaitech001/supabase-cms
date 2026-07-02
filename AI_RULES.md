# AI 工具项目规则

本文件是给 Claude、Cursor、Trae、Codex 以及其他 AI 编程工具使用的通用入口。开始修改本项目之前，必须先阅读并遵守下列文档：

1. `docs/ai-development-contract.md`：项目总开发契约，包含架构、数据、后台、媒体、迁移、部署和验证规则。
2. `docs/site-build-operations.md`：静态版本 / Supabase 动态版本站点从零搭建流程。
3. `docs/frontend-page-contract.md`：生成或修改前台页面时必须遵守的数据结构和页面规则。
4. `docs/frontend-page-prompt-template.md`：让 AI 生成前台页面时使用的中文提示模板。

## 工作前必须确认

- 当前任务是静态版本还是 Supabase 动态版本。
- 静态版本读取 `apps/site/lib/static-content.ts`、`apps/site/lib/mock-data.ts`、`apps/site/lib/inshow-assets.ts`。
- 动态版本通过 `apps/site/lib/data.ts` 和 `packages/core/src/frontend-client.ts` 读取 Supabase typed data。
- 数据类型以 `packages/core/src/types.ts` 为准。
- 数据库结构以 `supabase/schema.sql` 为准。
- 前台页面不能虚构字段、props、接口返回、表结构或分类关系。

## 静态站点规则

- 使用 `STOREFRONT_DATA_MODE=static`。
- 先确认站点是否需要多语言；不需要时使用 `NEXT_PUBLIC_STOREFRONT_I18N_ENABLED=false`，只维护默认语言内容。
- 静态内容集中维护在 `static-content.ts` 和 `mock-data.ts`，不要散落在页面组件里。
- 图片、视频、Logo、地图、证书等资源应使用 CDN URL，不要把大文件提交进仓库。
- 询盘和留言默认不能直接写数据库；静态模式优先使用 mailto、WhatsApp、第三方 Form Backend 或后续明确实现的 provider。
- 如果要接 Vercel Function、Cloudflare Worker、Formspree、Basin、Forminit 等表单存储方案，必须先明确 provider、字段结构、反垃圾和数据导出方式。

## 动态站点规则

- 使用 `STOREFRONT_DATA_MODE=supabase`。
- 新 Supabase 项目只执行 `supabase/schema.sql`。
- 旧项目升级只执行需要的 `supabase/migrations/*.sql`，不要重跑完整 schema。
- 后台数据更新后，前台应通过 typed data、缓存和 revalidate 机制读取最新数据。
- 询盘使用统一 `formName` / `formData` 结构，不为每种表单随意新增表。

## 前台开发规则

- 页面文件在 `apps/site/app/(frontend)`。
- 可复用展示组件放在 `apps/site/components/storefront`。
- 不要在页面中直接写 Supabase 查询。
- 不要硬编码不属于当前站点的数据。
- 需要新字段时，先检查类型、数据入口和 schema，再做最小变更。
- 视觉风格通过 `STOREFRONT_THEME`、`apps/site/lib/storefront-theme.ts` 和 CSS 变量控制，不要在页面里大量写死品牌色。

## 后台开发规则

- 后台页面保持 shadcn 风格、操作型布局和稳定表格。
- Products 只用于展示和询盘，不加入购物车、订单、支付、税费、物流、优惠券等交易能力。
- Posts 编辑器必须保留旧 HTML 数据，除非用户主动编辑内容。
- Media 页面当前默认隐藏，不要未经要求重新暴露。

## 禁止事项

- 禁止提交 `.env`、`.env.local`、`.next`、`.open-next`、`out`、`dist`、`coverage`、`*.tsbuildinfo`。
- 禁止在文档、代码或日志中写入真实密钥。
- 禁止把 WordPress/WooCommerce 导入媒体自动上传到 Supabase Storage。
- 禁止为了页面效果虚构后端字段。
- 禁止未经要求新增大型依赖、交易型商城模块或新部署目标。

## 验证命令

按改动范围选择最小验证：

```bash
pnpm --filter @global-trade/site typecheck
pnpm --filter @global-trade/site test
pnpm --filter @global-trade/site build
pnpm --filter @global-trade/core test
pnpm --filter @global-trade/migrator test
pnpm cf:build
```

只改文档时不需要运行应用构建，但需要检查链接、路径和描述是否准确。
