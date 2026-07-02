import { ReachUsSection } from "@/components/ReachUsSection";
import type { Metadata } from "next";
import { inshowAssets } from "@/lib/inshow-assets";
import { getStaticContent } from "@/lib/static-content";
import { getRequestLocale } from "@/lib/static-locale";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const seo = getStaticContent(locale).seo.about;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description
    }
  };
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const content = getStaticContent(locale);
  const about = content.about;

  return (
    <main className="about-page">
      <section className="about-hero-block">
        <h1>{about.heroTitle}</h1>
        <div className="about-hero-grid">
          <div className="about-hero-logo">
            <img src={inshowAssets.logo} alt="INSHOW HOME" />
          </div>
          <div className="about-hero-copy">
            {about.sections.map((section) => (
              <article key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-capability-block">
        <div className="about-capability-grid">
          <div className="about-capability-copy">
            {about.capabilitySections.map((section) => (
              <article className="about-copy-item" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
            ))}
          </div>
          <div className="about-shape-images">
            <img className="about-shape-blob" src={inshowAssets.aboutBlob} alt="INSHOW HOME digital showroom" />
            <img className="about-shape-round" src={inshowAssets.aboutRound} alt="INSHOW HOME industrial park" />
          </div>
        </div>
      </section>

      <section className="about-world-section">
        <img src={inshowAssets.contactMap} alt="" />
        <p>{about.worldText}</p>
      </section>

      <ReachUsSection locale={locale} />
    </main>
  );
}
