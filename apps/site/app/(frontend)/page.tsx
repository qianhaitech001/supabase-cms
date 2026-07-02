import { InquiryForm } from "@/components/InquiryForm";
import type { Metadata } from "next";
import { ReachUsSection } from "@/components/ReachUsSection";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { HomeHero } from "@/components/storefront/HomeHero";
import { SectionHeader } from "@/components/storefront/SectionHeader";
import { StaticContactPanel } from "@/components/storefront/StaticContactPanel";
import { inshowAssets } from "@/lib/inshow-assets";
import { getStaticContent } from "@/lib/static-content";
import { getRequestLocale } from "@/lib/static-locale";
import { getStorefrontDataMode } from "@/lib/storefront-mode";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const seo = getStaticContent(locale).seo.home;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description
    }
  };
}

const statIcons = [
  inshowAssets.statOneStop,
  inshowAssets.statSubsidiaries,
  inshowAssets.statBranches,
  inshowAssets.statVolume,
  inshowAssets.statEnterprise,
];

const projectItems = [
  ["2010 World Expo - Japan Pavilion", inshowAssets.projectExpoJapan],
  ["2010 World Expo - Korea Pavilion", inshowAssets.projectExpoKorea],
  ["Canberra, Australi - Canberra townhouses", inshowAssets.projectCanberra],
  ["Perth, Australi - Retirement-center", inshowAssets.projectPerth],
];

const certificateItems = [
  inshowAssets.certificateReach,
  inshowAssets.certificateOne,
  inshowAssets.certificateTwo,
  inshowAssets.certificateThree,
  inshowAssets.certificateFour,
  inshowAssets.certificateFive,
  inshowAssets.certificateSix,
];

export default async function HomePage() {
  const isStaticMode = getStorefrontDataMode() === "static";
  const locale = await getRequestLocale();
  const content = getStaticContent(locale);
  const text = content.text.home;

  return (
    <main className="home-page">
      <HomeHero
        slides={isStaticMode ? content.heroSlides : undefined}
        ctaHref="/about-us"
        ctaLabel={content.text.common.knowMore}
        logoUrl={inshowAssets.logo}
        title={content.heroSlides[0]?.title}
        videoUrl={inshowAssets.heroVideo}
      />

      <section className="inshow-section products-section">
        <div className="shell">
          <SectionHeader title={text.productsTitle} description={text.productsDescription} />
          <CategoryShowcase items={content.categoryTiles} />
        </div>
      </section>

      <section className="home-about-section">
        <div className="home-about-grid">
          <div className="home-about-card">
            <img src={inshowAssets.profile} alt="CBNB profile" />
          </div>
          <div className="home-about-copy">
            <h2>
              <strong>{text.aboutTitle}</strong>
            </h2>
            <h3>{text.aboutEyebrow}</h3>
            <ul>
              {text.aboutBullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <div className="home-stats">
          {text.stats.map((label, index) => (
            <div className="home-stat-item" key={label}>
              <strong>{label}</strong>
              <img src={statIcons[index]} alt="" />
            </div>
          ))}
        </div>
      </section>

      <section className="home-why-section">
        <div className="shell">
          <SectionHeader
            title={text.whyTitle}
            description={text.whyDescription}
          />
        </div>
      </section>

      <section className="home-projects-section">
        <div className="shell">
          <SectionHeader title={text.projectsTitle} />
          <div className="home-project-grid">
            {projectItems.map(([title, image]) => (
              <article key={title}>
                <img src={image} alt={title} />
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cert-section">
        <div className="shell">
          <SectionHeader title={text.certificatesTitle} />
          <div className="certificate-strip">
            {certificateItems.map(src => (
              <img src={src} alt="INSHOW HOME certificate" key={src} />
            ))}
          </div>
        </div>
      </section>

      <ReachUsSection locale={locale} />

      <section className="home-inquiry-section">
        <div className="home-inquiry-shell">
          {isStaticMode ? <StaticContactPanel compact locale={locale} title={text.quoteTitle} /> : <InquiryForm formType="contact" sourceUrl="/" />}
        </div>
      </section>
    </main>
  );
}
