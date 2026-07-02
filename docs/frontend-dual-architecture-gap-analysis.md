# 前台双架构需求对照清单

本文对照《企业外贸独立站前端双架构功能需求文档（静态+Supabase动态）》，记录当前模板的覆盖情况和后续开发边界。

## 已具备

- 核心页面：Home、Products、Product Category、Product Detail、News、News Detail、About Us、Contact。
- 动态数据：Products、Categories、Posts、Settings、Inquiries 已通过 Supabase typed data/API 读取或写入。
- 静态兜底：未配置 Supabase 时使用本地 typed mock data，保证模板可直接运行。
- 商品功能：分类筛选、分类折叠、排序、分页、产品卡片、详情图库、图片全屏预览、产品询盘。
- 新闻功能：新闻列表、新闻详情、发布时间、SEO typed data。
- 留言功能：统一 Inquiries API，支持 contact 与 product inquiry。
- 媒体策略：旧站远程媒体继续引用；新上传通过统一 storage adapter，当前支持 Supabase / UpYun provider 配置。
- SEO：Settings / typed SEO / sitemap / robots 已有基础链路。
- 后台：Products、Categories、Posts、Inquiries、Migrations、Settings、Users 已有管理入口。

## 本轮补足

- 新增显式前台数据模式：
  - `STOREFRONT_DATA_MODE=auto`：默认，Supabase 可用时读取动态数据，否则读取静态数据。
  - `STOREFRONT_DATA_MODE=static`：强制纯静态展示分支。
  - `STOREFRONT_DATA_MODE=supabase`：强制 Supabase 动态分支，并保留失败兜底。
- 新增前台视觉语气 preset：
  - `STOREFRONT_THEME=inshow`：默认外贸 B2B 站点语气。
  - `minimal`、`industrial`、`warm`：用于不同风格独立站的起始视觉方向。
  - 新页面必须复用 storefront 组件和 CSS 变量，避免把某个客户站点的颜色、圆角、阴影写死。
- 新增 storefront 功能组件层，避免页面继续堆业务 UI：
  - `HomeHero`
  - `CategoryShowcase`
  - `ProductFeatureMosaic`
  - `ProductGrid`
  - `LatestProductsList`
  - `NewsList`
  - `ProductSearchForm`
  - `SectionHeader`
- 静态模式下首页支持轮播 Hero，产品详情可展示远程视频，Contact / Product inquiry 区域会降级为 mailto、电话、WhatsApp 等静态联系方式。
- Header 搜索改为 typed product data 驱动，支持关键词建议，不在组件内散落 Supabase 查询。
- 产品列表、首页、新闻页迁移为“路由加载数据 + 功能组件展示”的结构，便于后续静态/动态分支复用同一套 UI。

## 仍欠缺但不应在本轮硬改

这些能力涉及数据库结构、后台内容模型或全站路由策略，直接改会影响现有数据与线上兼容性，需要单独计划：

- 完整多语言路由：如 `/en`、`/zh`、`/es` 形式的独立 SEO 路由。
- 多语言数据模型：产品、分类、新闻、Settings 按语言独立字段或 translation tables 存储。
- 后台多语言编辑：同一产品/新闻的多语言 tab、语言完成度、缺失语言 fallback。
- Banner / 首页模块后台配置：静态分支已有组件级轮播能力，但还没有后台可视化配置。
- 产品视频结构化字段：静态分支可从 `legacyMeta` 读取视频 URL，但 `Product` typed contract 里还没有独立 `videos` 字段。
- Google Map / WhatsApp 等 Contact 扩展配置：静态分支已有降级展示，动态版仍需要放入 Settings 后再渲染，避免硬编码。
- 新闻置顶：当前按发布时间列表展示，未增加 `pinned` 数据字段。
- 静态分页导出：当前是 Next route 分页，不是预生成所有静态分页 HTML。

## 开发原则

- 静态版和动态版 UI 必须共用 storefront 组件，只替换数据服务层。
- 新页面先看 `docs/frontend-page-contract.md`，再看 `packages/core/src/types.ts` 和 `apps/site/lib/data.ts`。
- 前台组件不得虚构数据库字段；缺数据时先补 typed contract 和 schema/migration。
- 旧站媒体保持远程 URL，不在页面层做下载、迁移或 URL 猜测。
