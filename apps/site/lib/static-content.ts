import type { LocaleCode, Product, ProductCategory, SeoFields } from "@global-trade/core";
import { inshowAssets } from "./inshow-assets";
import { mockCategories, mockProducts } from "./mock-data";

export type StaticLocale = "en" | "zh";

export type StaticLocaleOption = { code: StaticLocale; label: string; shortLabel: string };

const allStaticLocales: StaticLocaleOption[] = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "zh", label: "中文", shortLabel: "中" }
];

export const defaultStaticLocale: StaticLocale = "en";
export const storefrontLocaleCookie = "storefront_locale";

export type StaticText = {
  nav: {
    home: string;
    about: string;
    products: string;
    news: string;
    contact: string;
    searchPlaceholder: string;
    searchSubmit: string;
  };
  common: {
    details: string;
    knowMore: string;
    viewProducts: string;
    sendInquiry: string;
    chatNow: string;
    contactUs: string;
    noProducts: string;
    noProductsHint: string;
  };
  home: {
    productsTitle: string;
    productsDescription: string;
    aboutTitle: string;
    aboutEyebrow: string;
    whyTitle: string;
    whyDescription: string;
    projectsTitle: string;
    certificatesTitle: string;
    quoteTitle: string;
    stats: string[];
    aboutBullets: string[];
  };
  products: {
    showing: (start: number, end: number, total: number, category?: string) => string;
    applicationsTitle: string;
    supportTitle: string;
    supportDescription: string;
    sortDefault: string;
    sortPopularity: string;
    sortLatest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    latestProducts: string;
  };
  productDetail: {
    specifications: string;
    specificationsHint: string;
    description: string;
    supportTitle: string;
    supportDescription: string;
    videoTitle: string;
    videoDescription: string;
    fullscreenImage: string;
  };
  contact: {
    heroLineOne: string;
    heroLineTwo: string;
    panelTitle: string;
    panelDescription: string;
    headquarters: string;
    regionalOffice: string;
    email: string;
    tel: string;
    address: string;
  };
  news: {
    eyebrow: string;
    title: string;
    detail: string;
  };
  staticContact: {
    eyebrow: string;
    title: string;
    description: string;
    emailUs: string;
    whatsapp: string;
    phone: string;
    address: string;
    mapCaption: string;
  };
  footer: {
    address: string;
    officeHours: string;
    getInTouch: string;
    usefulLinks: string;
    copyright: (year: number) => string;
    links: string[];
  };
};

export type StaticContent = {
  locale: StaticLocale;
  text: StaticText;
  seo: Record<"home" | "products" | "about" | "contact" | "news", SeoFields>;
  heroSlides: StaticHeroSlide[];
  categoryTiles: StaticCategoryTile[];
  contact: StaticContact;
  about: StaticAboutContent;
};

export type StaticHeroSlide = {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  logoUrl?: string | undefined;
  title: string;
  description?: string | undefined;
  ctaLabel: string;
  ctaHref: string;
};

export type StaticCategoryTile = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

export type StaticContact = {
  email: string;
  salesEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapImage: string;
  mapEmbedUrl: string;
  socialLinks: Array<{ label: string; href: string }>;
};

export type StaticAboutContent = {
  heroTitle: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
  capabilitySections: Array<{ title: string; paragraphs: string[] }>;
  worldText: string;
};

const staticContactBase = {
  email: "dennisonlien@inshowhome.com",
  salesEmail: "dennisonlien@inshowhome.com",
  phone: "+86 18957884529",
  whatsapp: "+86 18957884529",
  address: "Room.1030, No.1 Building, Logistic Center, Meishan Harbour Ningbo Zhejiang",
  mapImage: inshowAssets.contactMap,
  mapEmbedUrl: "https://www.google.com/maps?q=Meishan%20Harbour%20Ningbo%20Zhejiang&output=embed",
  socialLinks: [
    { label: "Email", href: "mailto:dennisonlien@inshowhome.com" },
    { label: "WhatsApp", href: "https://wa.me/8618957884529" },
    { label: "Phone", href: "tel:+8618957884529" }
  ]
} satisfies StaticContact;

const content: Record<StaticLocale, StaticContent> = {
  en: {
    locale: "en",
    text: {
      nav: {
        home: "Home",
        about: "About Us",
        products: "Products",
        news: "News",
        contact: "Contact",
        searchPlaceholder: "Search...",
        searchSubmit: "Search"
      },
      common: {
        details: "Details",
        knowMore: "Know More",
        viewProducts: "View Products",
        sendInquiry: "Send Inquiry",
        chatNow: "Chat Now",
        contactUs: "Contact us",
        noProducts: "No products found",
        noProductsHint: "Try another category or keyword."
      },
      home: {
        productsTitle: "PRODUCTS",
        productsDescription: "Discover Our Advanced Products Range",
        aboutTitle: "ABOUT US",
        aboutEyebrow: "POWERED BY CBNB, SAILING ON THE WORLD",
        whyTitle: "WHY INSHOW HOME",
        whyDescription: "Since 1985, CHINA-BASE has been committed to providing stable, reliable, and high-value services to trading clients. Building on decades of global supply chain networks, logistics, warehousing, and international relations, we are taking our service to the next level with INSHOW HOME.",
        projectsTitle: "INSHOW HOME PROJECTS",
        certificatesTitle: "CERTIFICATES",
        quoteTitle: "Get a project quote",
        stats: [
          "One-Stop Management",
          "84 Units Subsidiaries",
          "Worldwide Branches",
          "USD 6 Billion 2024 Import & Export Volume",
          "China's Top500 Enterprise"
        ],
        aboutBullets: [
          "Supply Chain & Logistics & Warehouse Network & Finance",
          "Worldwide Branches & Relations",
          "40 Years Business Experience",
          "Strong R&D Input",
          "High Tech Support"
        ]
      },
      products: {
        showing: (start, end, total, category) => `Showing ${start}-${end} of ${total} results${category ? ` in ${category}` : ""}`,
        applicationsTitle: "Light Steel House Construction Applications",
        supportTitle: "Contact Customer Support",
        supportDescription: "If you are in need of immediate assistance, you can reach us at +18002208056.",
        sortDefault: "Default sorting",
        sortPopularity: "Sort by popularity",
        sortLatest: "Sort by latest",
        sortPriceAsc: "Sort by price: low to high",
        sortPriceDesc: "Sort by price: high to low",
        latestProducts: "Latest Products"
      },
      productDetail: {
        specifications: "Specifications",
        specificationsHint: "Imported key attributes are kept structured for generated frontend sections.",
        description: "Description",
        supportTitle: "Contact Customer Support",
        supportDescription: "If you are in need of immediate assistance, you can reach us at +18002208056.",
        videoTitle: "Product Video",
        videoDescription: "Static and dynamic product pages can reuse hosted video URLs without copying files into the app.",
        fullscreenImage: "View product image fullscreen"
      },
      contact: {
        heroLineOne: "Any Questions?",
        heroLineTwo: "Contact us.",
        panelTitle: "Talk to the sales team",
        panelDescription: "This static branch keeps the page fully usable without Supabase. Replace the links and map asset for each independent site.",
        headquarters: "Inshowhome Headquarters",
        regionalOffice: "Saudi Arabia Regional Office",
        email: "Email",
        tel: "Tel",
        address: "Address"
      },
      news: {
        eyebrow: "COMPANY NEWS",
        title: "News",
        detail: "Detail"
      },
      staticContact: {
        eyebrow: "Static contact",
        title: "Contact Customer Support",
        description: "Static storefront mode does not submit data to Supabase. Use the contact methods below to reach the sales team.",
        emailUs: "Email us",
        whatsapp: "WhatsApp",
        phone: "Phone",
        address: "Address",
        mapCaption: "Open the location or replace this map with the customer site's map asset."
      },
      footer: {
        address: "Address",
        officeHours: "Office Hours",
        getInTouch: "Get in Touch",
        usefulLinks: "Usefull Link",
        copyright: (year) => `© ${year} INSHOW HOME. All Rights Reserved.`,
        links: ["Warranty & Complaints", "Order & Shipping", "Tracking Order", "About Us", "Terms", "FAQ"]
      }
    },
    seo: {
      home: { title: "INSHOW HOME | Full range customization", description: "INSHOW HOME provides prefab house, building material, and smart home sourcing solutions for global project buyers." },
      products: { title: "Products | INSHOW HOME", description: "Browse prefab houses, building materials, and smart home product solutions." },
      about: { title: "About INSHOW HOME", description: "Learn about INSHOW HOME, China-Base supply chain capability, global service network, and project support." },
      contact: { title: "Contact INSHOW HOME", description: "Contact INSHOW HOME for product inquiries, project quotations, and sourcing support." },
      news: { title: "News | INSHOW HOME", description: "Read INSHOW HOME company news, product insights, and project updates." }
    },
    heroSlides: [
      {
        id: "inshow-future",
        mediaUrl: inshowAssets.heroVideo,
        mediaType: "video",
        logoUrl: inshowAssets.logo,
        title: "Contributing to the Society by Manufacturing Products that Create the Future",
        description: "Full range customization for building systems, materials, and smart home solutions.",
        ctaLabel: "Know More",
        ctaHref: "/about-us"
      },
      {
        id: "prefab-house",
        mediaUrl: inshowAssets.categoryPrefab,
        mediaType: "image",
        title: "Prefab house systems for global project delivery",
        description: "Ready-made building systems for residential, commercial, and project-site needs.",
        ctaLabel: "View Products",
        ctaHref: "/products"
      },
      {
        id: "building-materials",
        mediaUrl: inshowAssets.categoryMaterials,
        mediaType: "image",
        title: "Integrated building materials and fit-out sourcing",
        description: "One supplier interface for decoration, materials, and smart home products.",
        ctaLabel: "Explore Range",
        ctaHref: "/products"
      }
    ],
    categoryTiles: [
      { title: "Prefab House", subtitle: "Ready-Made Living", href: "/product-category/prefab-house", image: inshowAssets.categoryPrefab },
      { title: "Building Materials", subtitle: "Integrated decoration and fit-out materials", href: "/product-category/building-materials", image: inshowAssets.categoryMaterials },
      { title: "Smart Home", subtitle: "Style Your Space", href: "/product-category/smart-home", image: inshowAssets.categorySmartHome }
    ],
    contact: staticContactBase,
    about: {
      heroTitle: "ABOUT INSHOW HOME",
      sections: [
        {
          title: "40 Years of Production and Supply Expertise:",
          paragraphs: ["Since 1985, CHINA-BASE has been dedicated to delivering stable, reliable, and high-value services to trading clients worldwide."]
        },
        {
          title: "Comprehensive Understanding of Production and Customer Needs:",
          paragraphs: [
            "Traditional trade often faces pressure from both production and demand. INSHOW HOME reduces these inefficiencies through integrated supply chain management, logistics, warehousing, finance, and digital tools."
          ]
        }
      ],
      capabilitySections: [
        {
          title: "Cutting-Edge Technologies:",
          paragraphs: ["With tools like Metabigbuyer, customers can access product information online and integrate items into real-world purchasing scenarios."]
        },
        {
          title: "A One-Stop Solution in the Building Materials Industry:",
          paragraphs: ["INSHOW HOME provides a comprehensive service system for prefabricated houses, interior and exterior building materials, and interior decor solutions."]
        }
      ],
      worldText: "Rooted in Ningbo and thriving globally, we bring China's supply chain excellence to the world and help clients create higher trade value."
    }
  },
  zh: {
    locale: "zh",
    text: {
      nav: {
        home: "首页",
        about: "关于我们",
        products: "产品中心",
        news: "新闻",
        contact: "联系我们",
        searchPlaceholder: "搜索产品...",
        searchSubmit: "搜索"
      },
      common: {
        details: "详情",
        knowMore: "了解更多",
        viewProducts: "查看产品",
        sendInquiry: "发送询盘",
        chatNow: "立即沟通",
        contactUs: "联系我们",
        noProducts: "未找到产品",
        noProductsHint: "请尝试其他分类或关键词。"
      },
      home: {
        productsTitle: "产品中心",
        productsDescription: "探索我们的核心产品系列",
        aboutTitle: "关于我们",
        aboutEyebrow: "依托中基，服务全球",
        whyTitle: "为什么选择 INSHOW HOME",
        whyDescription: "自 1985 年以来，CHINA-BASE 持续为贸易客户提供稳定、可靠、高价值的服务。INSHOW HOME 依托全球供应链、物流、仓储和国际资源网络，为海外项目客户提供更完整的一站式支持。",
        projectsTitle: "INSHOW HOME 项目",
        certificatesTitle: "资质证书",
        quoteTitle: "获取项目报价",
        stats: ["一站式管理", "84 家子公司", "全球分支网络", "2024 年进出口额 60 亿美元", "中国企业 500 强"],
        aboutBullets: ["供应链、物流、仓储与金融支持", "全球分支与合作关系", "40 年业务经验", "持续研发投入", "高技术支持"]
      },
      products: {
        showing: (start, end, total, category) => `显示 ${start}-${end}，共 ${total} 个结果${category ? `，分类：${category}` : ""}`,
        applicationsTitle: "轻钢房屋结构应用场景",
        supportTitle: "联系客户支持",
        supportDescription: "如需快速支持，可通过下方联系方式与我们沟通。",
        sortDefault: "默认排序",
        sortPopularity: "按热度排序",
        sortLatest: "按最新排序",
        sortPriceAsc: "价格从低到高",
        sortPriceDesc: "价格从高到低",
        latestProducts: "最新产品"
      },
      productDetail: {
        specifications: "产品参数",
        specificationsHint: "导入的关键属性会保留为结构化数据，便于生成前台展示区块。",
        description: "产品描述",
        supportTitle: "联系客户支持",
        supportDescription: "如需快速支持，可通过下方联系方式与我们沟通。",
        videoTitle: "产品视频",
        videoDescription: "静态和动态产品页都可以直接复用已托管的视频地址，无需复制文件。",
        fullscreenImage: "全屏查看产品图片"
      },
      contact: {
        heroLineOne: "有任何问题？",
        heroLineTwo: "欢迎联系我们。",
        panelTitle: "联系销售团队",
        panelDescription: "静态版本无需 Supabase 也可完整展示联系方式。为新站点制作时可替换为对应客户的链接与地图。",
        headquarters: "Inshowhome 总部",
        regionalOffice: "沙特区域办公室",
        email: "邮箱",
        tel: "电话",
        address: "地址"
      },
      news: {
        eyebrow: "公司新闻",
        title: "新闻",
        detail: "详情"
      },
      staticContact: {
        eyebrow: "静态联系方式",
        title: "联系客户支持",
        description: "静态站点模式不会向 Supabase 提交数据。请通过下方方式联系销售团队。",
        emailUs: "发送邮件",
        whatsapp: "WhatsApp",
        phone: "电话",
        address: "地址",
        mapCaption: "可打开位置，也可替换为客户站点自己的地图资源。"
      },
      footer: {
        address: "地址",
        officeHours: "营业时间",
        getInTouch: "联系我们",
        usefulLinks: "常用链接",
        copyright: (year) => `© ${year} INSHOW HOME. 版权所有。`,
        links: ["质保与投诉", "订单与运输", "订单跟踪", "关于我们", "条款", "常见问题"]
      }
    },
    seo: {
      home: { title: "INSHOW HOME | 全品类定制", description: "INSHOW HOME 为全球项目客户提供预制房屋、建材与智能家居采购解决方案。" },
      products: { title: "产品中心 | INSHOW HOME", description: "浏览预制房屋、建筑材料和智能家居产品方案。" },
      about: { title: "关于 INSHOW HOME", description: "了解 INSHOW HOME 的供应链能力、全球服务网络与项目支持。" },
      contact: { title: "联系 INSHOW HOME", description: "联系 INSHOW HOME 获取产品询盘、项目报价和采购支持。" },
      news: { title: "新闻 | INSHOW HOME", description: "浏览 INSHOW HOME 公司新闻、产品洞察与项目动态。" }
    },
    heroSlides: [
      {
        id: "inshow-future",
        mediaUrl: inshowAssets.heroVideo,
        mediaType: "video",
        logoUrl: inshowAssets.logo,
        title: "制造创造未来的产品，贡献社会价值",
        description: "为建筑系统、装饰材料和智能家居提供全范围定制。",
        ctaLabel: "了解更多",
        ctaHref: "/about-us"
      },
      {
        id: "prefab-house",
        mediaUrl: inshowAssets.categoryPrefab,
        mediaType: "image",
        title: "面向全球项目交付的预制房屋系统",
        description: "适用于住宅、商业和项目现场的成套建筑系统。",
        ctaLabel: "查看产品",
        ctaHref: "/products"
      },
      {
        id: "building-materials",
        mediaUrl: inshowAssets.categoryMaterials,
        mediaType: "image",
        title: "建筑材料与室内配套一体化采购",
        description: "以统一供应商入口连接装饰、材料和智能家居产品。",
        ctaLabel: "探索系列",
        ctaHref: "/products"
      }
    ],
    categoryTiles: [
      { title: "预制房屋", subtitle: "快速交付的居住空间", href: "/product-category/prefab-house", image: inshowAssets.categoryPrefab },
      { title: "建筑材料", subtitle: "装饰与项目材料一体化采购", href: "/product-category/building-materials", image: inshowAssets.categoryMaterials },
      { title: "智能家居", subtitle: "打造现代生活空间", href: "/product-category/smart-home", image: inshowAssets.categorySmartHome }
    ],
    contact: staticContactBase,
    about: {
      heroTitle: "关于 INSHOW HOME",
      sections: [
        {
          title: "40 年生产与供应经验：",
          paragraphs: ["自 1985 年以来，CHINA-BASE 一直致力于为全球贸易客户提供稳定、可靠且高价值的服务。"]
        },
        {
          title: "理解生产与客户需求：",
          paragraphs: ["传统贸易同时面对生产端和需求端压力。INSHOW HOME 通过供应链管理、物流、仓储、金融和数字化工具，帮助客户提升项目采购效率。"]
        }
      ],
      capabilitySections: [
        {
          title: "前沿数字化能力：",
          paragraphs: ["借助 Metabigbuyer 等工具，客户可在线查看产品信息，并将产品应用到真实采购场景中。"]
        },
        {
          title: "建筑材料行业一站式解决方案：",
          paragraphs: ["INSHOW HOME 围绕预制房屋、内外装建筑材料和室内装饰方案，提供完整的一站式服务体系。"]
        }
      ],
      worldText: "扎根宁波，服务全球。我们将中国供应链能力带向世界，帮助客户获得更高的贸易价值。"
    }
  }
};

const localizedCategoryText: Record<StaticLocale, Record<string, Partial<ProductCategory>>> = {
  en: {},
  zh: {
    prefab: { title: "预制房屋", displayTitle: "预制房屋", description: "模块化与预制建筑系统。" },
    "container-house": { title: "- 集装箱房", displayTitle: "集装箱房", description: "适用于项目现场的快速搭建模块化集装箱系统。" },
    "light-steel-villa": { title: "- 轻钢别墅", displayTitle: "轻钢别墅", description: "适用于住宅项目的轻钢别墅结构。" },
    materials: { title: "建筑材料", displayTitle: "建筑材料", description: "适用于项目的内外装材料。" },
    kitchen: { title: "- 厨房", displayTitle: "厨房", description: "橱柜、水槽、五金及厨房配套材料。" },
    smart: { title: "智能家居", displayTitle: "智能家居", description: "面向现代空间的智能设备。" },
    "motorized-blinds": { title: "- 电动窗帘", displayTitle: "电动窗帘", description: "电动遮阳帘与控制系统。" }
  }
};

const localizedProductText: Record<StaticLocale, Record<string, Partial<Product>>> = {
  en: {},
  zh: {
    "light-steel-villa": {
      title: "轻钢别墅",
      summary: "适用于住宅项目的可定制轻钢别墅。",
      richText: "<p>为快速安装、耐用结构和灵活布局而设计。</p>",
      specifications: [
        { name: "结构", value: "轻钢", group: "基础信息" },
        { name: "用途", value: "住宅", group: "基础信息" }
      ]
    },
    "modern-kitchen-cabinet": {
      title: "现代厨房橱柜",
      summary: "面向项目交付的厨房橱柜系统，支持定制饰面。",
      richText: "<p>适用于公寓、别墅和酒店室内项目。</p>",
      specifications: [{ name: "饰面", value: "可定制", group: "材料" }]
    },
    "smart-door-lock": {
      title: "智能门锁",
      summary: "适用于住宅、酒店和服务式公寓的智能门禁方案。",
      richText: "<p>支持密码、卡片、App 和指纹等多种开锁方式。</p>",
      specifications: [{ name: "开锁方式", value: "密码 / 卡片 / App / 指纹", group: "功能" }]
    }
  }
};

function parseStaticLocale(value: string | null | undefined): StaticLocale | undefined {
  return value === "zh" || value === "en" ? value : undefined;
}

function parseBoolean(value: string | null | undefined): boolean {
  return value === "true" || value === "1" || value === "yes";
}

function getEnvValue(name: string): string | undefined {
  return process.env[name];
}

export function isStaticI18nEnabled(): boolean {
  return parseBoolean(getEnvValue("NEXT_PUBLIC_STOREFRONT_I18N_ENABLED") ?? getEnvValue("STOREFRONT_I18N_ENABLED"));
}

export function getConfiguredDefaultStaticLocale(): StaticLocale {
  return parseStaticLocale(
    getEnvValue("NEXT_PUBLIC_STOREFRONT_DEFAULT_LOCALE") ?? getEnvValue("STOREFRONT_DEFAULT_LOCALE")
  ) ?? defaultStaticLocale;
}

export function getSupportedStaticLocales(): StaticLocaleOption[] {
  const configured = getEnvValue("NEXT_PUBLIC_STOREFRONT_SUPPORTED_LOCALES") ?? getEnvValue("STOREFRONT_SUPPORTED_LOCALES");
  const defaultLocale = getConfiguredDefaultStaticLocale();
  const parsed = configured
    ?.split(",")
    .map((item) => parseStaticLocale(item.trim()))
    .filter((item): item is StaticLocale => Boolean(item));
  const supportedCodes = parsed?.length ? Array.from(new Set(parsed)) : [defaultLocale];
  const normalizedCodes = supportedCodes.includes(defaultLocale) ? supportedCodes : [defaultLocale, ...supportedCodes];
  return allStaticLocales.filter((locale) => normalizedCodes.includes(locale.code));
}

export function normalizeStaticLocale(locale: LocaleCode | null | undefined): StaticLocale {
  const defaultLocale = getConfiguredDefaultStaticLocale();
  const supported = getSupportedStaticLocales().map((item) => item.code);
  const parsed = parseStaticLocale(locale);
  return parsed && supported.includes(parsed) ? parsed : defaultLocale;
}

export function getStaticContent(locale: LocaleCode | null | undefined = defaultStaticLocale): StaticContent {
  return content[normalizeStaticLocale(locale)];
}

export function getStaticCategories(locale: LocaleCode | null | undefined = defaultStaticLocale): ProductCategory[] {
  const normalized = normalizeStaticLocale(locale);
  const labels = localizedCategoryText[normalized];
  return mockCategories.map((category) => ({ ...category, ...(labels[category.id] ?? {}) }));
}

export function getStaticProducts(locale: LocaleCode | null | undefined = defaultStaticLocale): Product[] {
  const normalized = normalizeStaticLocale(locale);
  const labels = localizedProductText[normalized];
  return mockProducts.map((product) => ({ ...product, ...(labels[product.slug] ?? {}) }));
}
