import { createMetadata, createProductJsonLd } from "@global-trade/core";
import type { MediaAsset } from "@global-trade/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChatNowDialog } from "@/components/ChatNowDialog";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductVideoShowcase } from "@/components/storefront/ProductVideoShowcase";
import { StaticContactPanel } from "@/components/storefront/StaticContactPanel";
import { getProduct } from "@/lib/data";
import { getRuntimeSiteConfig } from "@/lib/site-config";
import { getStaticContent } from "@/lib/static-content";
import { getRequestLocale } from "@/lib/static-locale";
import { getStaticProductVideos } from "@/lib/static-storefront";
import { getStorefrontDataMode } from "@/lib/storefront-mode";

export const revalidate = 300;

function normalizeSummaryHtml(summary?: string | null) {
  if (!summary) return "";
  return summary.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [product, siteConfig] = await Promise.all([getProduct(slug, locale), getRuntimeSiteConfig()]);
  if (!product) return {};
  const metadata = createMetadata(siteConfig, product.seo, `/products/${product.slug}`);
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: { canonical: metadata.canonicalUrl },
    robots: metadata.robots,
    openGraph: metadata.openGraph
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [product, siteConfig] = await Promise.all([getProduct(slug, locale), getRuntimeSiteConfig()]);
  if (!product) notFound();
  const content = getStaticContent(locale);
  const labels = content.text.productDetail;
  const images = [product.primaryImage, ...(product.gallery ?? [])].filter((image): image is MediaAsset => Boolean(image?.publicUrl));
  const summaryHtml = normalizeSummaryHtml(product.summary);
  const isStaticMode = getStorefrontDataMode() === "static";
  const videoUrls = getStaticProductVideos(product);

  return (
    <main className="single-product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createProductJsonLd(siteConfig, product)) }} />
      <section className="single-product-main">
        <div className="inshow-product-page row">
          <div className="product-gallery-col">
            <ProductGallery fullscreenLabel={labels.fullscreenImage} images={images} title={product.title} />
          </div>
          <div className="product-summary-col">
            <h1 className="product_title">{product.title}</h1>
            {summaryHtml ? <div className="single-product-summary" dangerouslySetInnerHTML={{ __html: summaryHtml }} /> : null}
            <div className="product-custom-buttons">
              {isStaticMode ? (
                <>
                  <a className="button" href={`mailto:${content.contact.email}?subject=${encodeURIComponent(`Inquiry: ${product.title}`)}`}>
                    {content.text.common.sendInquiry}
                  </a>
                  <a className="button button-outline" href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, "")}`} rel="noreferrer" target="_blank">
                    {content.text.common.chatNow}
                  </a>
                </>
              ) : (
                <>
                  <a className="button" href="#inquiry">
                    {content.text.common.sendInquiry}
                  </a>
                  <ChatNowDialog />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {product.specifications.length > 0 && (
        <section className="single-product-section">
          <div className="single-product-container">
            <div className="inshow-section-header">
              <h2>{labels.specifications}</h2>
              <p>{labels.specificationsHint}</p>
            </div>
            <div className="rich-text single-product-table">
              <table>
                <tbody>
                  {product.specifications.map((spec) => (
                    <tr key={`${spec.group}-${spec.name}`}>
                      <th>{spec.name}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="product-description-and-tabs">
        <div className="product-description-tab">{labels.description}</div>
        <div className="single-product-content-grid">
          <article className="rich-text" dangerouslySetInnerHTML={{ __html: product.richText }} />
        </div>
        <div id="inquiry" className="product-contact-form">
          <h2>{labels.supportTitle}</h2>
          <p>{labels.supportDescription}</p>
          {isStaticMode ? (
            <StaticContactPanel compact locale={locale} productName={product.title} title={content.text.common.sendInquiry} />
          ) : (
            <InquiryForm formType="product_inquiry" productId={product.id} sourceUrl={`/products/${product.slug}`} />
          )}
        </div>
      </section>
      <ProductVideoShowcase description={labels.videoDescription} title={labels.videoTitle} videos={videoUrls} />
    </main>
  );
}
