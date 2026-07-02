# 前台页面 AI 生成提示模板

当后端同事需要让 AI 生成或修改前台页面时，可以直接复制下面的模板。

```md
你正在 Supabase CMS 模板项目中工作。

开始写代码前，必须先阅读：
- docs/ai-development-contract.md
- docs/frontend-page-contract.md

任务说明：
- 页面或组件名称：
- 路由路径：
- 用户目标：
- 需要参考的现有页面或组件：

数据来源：
- 只能使用项目中已经存在的 typed data。
- 必须先查看 packages/core/src/types.ts、packages/core/src/frontend-client.ts、apps/site/lib/data.ts 和 supabase/schema.sql。
- 禁止虚构字段、props、表、接口返回值或关联关系。
- 如果页面需要的数据当前不存在，请明确指出缺失的数据，并提出最小的类型或数据库改动建议；不要直接编造 mock 字段。

期望 UI：
- 页面布局：
- 需要支持的状态：loading / empty / error / pagination / filters：
- 移动端表现：
- SEO 规则：

媒体资源：
- 使用 MediaAsset.publicUrl 或已有远程 URL。
- WordPress/WooCommerce 导入的旧站媒体继续保持远程 URL。
- 不要把旧站图片上传到 Supabase Storage 或又拍云，也不要在前台页面代码里自动改写为其他存储 URL。

表单：
- 如果页面需要提交询盘，使用现有 inquiry API，并通过 formType 和 payload 表达不同表单。
- 不要新增 SMTP、邮件发送逻辑或单独的表单业务表。

开发约束：
- 使用现有 Tailwind/shadcn-style 写法和已有组件模式。
- 保持 diff 小且聚焦。
- 除非任务明确要求，不要新增依赖。
- 不要新增购物车、结账、订单、支付、物流、税务、用户账户、优惠券等交易功能。

验证：
- 至少运行 pnpm --filter @global-trade/site typecheck。
- 只有在改动路由、运行时、CSS 编译或部署行为时，才需要运行 build。
```
