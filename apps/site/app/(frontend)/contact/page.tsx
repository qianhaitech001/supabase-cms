import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { StaticContactPanel } from "@/components/storefront/StaticContactPanel";
import { inshowAssets } from "@/lib/inshow-assets";
import { getStaticContent } from "@/lib/static-content";
import { getRequestLocale } from "@/lib/static-locale";
import { getStorefrontDataMode } from "@/lib/storefront-mode";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const seo = getStaticContent(locale).seo.contact;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description
    }
  };
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const content = getStaticContent(locale);
  const text = content.text.contact;
  const isStaticMode = getStorefrontDataMode() === "static";
  const headquartersCards = [
    { title: text.email, value: content.contact.email, Icon: Mail },
    { title: text.tel, value: content.contact.phone, Icon: Phone },
    { title: text.address, value: content.contact.address, Icon: MapPin }
  ];
  const regionalCards = [
    { title: text.address, value: content.contact.address },
    { title: text.address, value: content.contact.address }
  ];

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <img src={inshowAssets.contactHero} alt="Contact INSHOW HOME" />
        <div className="contact-hero-copy">
          <p>{text.heroLineOne}</p>
          <p>{text.heroLineTwo}</p>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-shell">
          {isStaticMode ? (
            <StaticContactPanel
              description={text.panelDescription}
              locale={locale}
              title={text.panelTitle}
            />
          ) : (
            <InquiryForm formType="contact" sourceUrl="/contact" />
          )}
        </div>
      </section>

      <section className="contact-offices-section">
        <div className="contact-offices-inner">
          <h2>{text.headquarters}</h2>
          <div className="contact-card-grid contact-card-grid--three">
            {headquartersCards.map(({ title, value, Icon }) => (
              <article className="contact-office-card" key={title}>
                <Icon size={36} strokeWidth={1.9} />
                <h3>{title}</h3>
                <p>{value}</p>
              </article>
            ))}
          </div>

          <h2>{text.regionalOffice}</h2>
          <div className="contact-card-grid contact-card-grid--two">
            {regionalCards.map(({ title, value }, index) => (
              <article className="contact-office-card" key={`${title}-${index}`}>
                <MapPin size={36} strokeWidth={1.9} />
                <h3>{title}</h3>
                <p>{value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
