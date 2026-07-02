# Trae Project Instructions

在 Trae 中开发本项目时，请先让 AI 阅读：

1. `AI_RULES.md`
2. `docs/ai-development-contract.md`
3. `docs/site-build-operations.md`
4. `docs/frontend-page-contract.md`
5. `docs/frontend-page-prompt-template.md`

## 必须遵守

- 开发静态站点前，确认 `STOREFRONT_DATA_MODE=static`，并读取 `apps/site/lib/static-content.ts`、`apps/site/lib/mock-data.ts`、`apps/site/lib/inshow-assets.ts`。
- 开发 Supabase 动态站点前，确认数据来自 `apps/site/lib/data.ts`、`packages/core/src/frontend-client.ts` 和 `packages/core/src/types.ts`。
- 不能虚构产品、分类、文章、SEO、询盘、媒体字段。
- 不能把页面临时需要的数据硬编码到 React 页面中。
- 不能把 WordPress/WooCommerce 导入媒体自动迁移到 Supabase Storage。
- 不能新增购物车、订单、支付、物流、税费、优惠券、会员账户等交易型模块，除非任务明确要求。
- 不能提交环境变量、密钥或构建产物。

## 推荐工作流

1. 先读共享规则文档。
2. 用搜索确认现有组件、类型、数据入口。
3. 复用 `apps/site/components/storefront`、`apps/site/components/admin`、`apps/site/components/ui`。
4. 按静态 / 动态模式选择数据来源。
5. 修改后运行最小验证命令。
6. 汇报改动文件、验证结果和未验证风险。

## 常用验证

```bash
pnpm --filter @global-trade/site typecheck
pnpm --filter @global-trade/site build
pnpm --filter @global-trade/core test
pnpm --filter @global-trade/migrator test
```
