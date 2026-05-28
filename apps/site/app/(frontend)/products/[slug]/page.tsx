import { createMetadata, createProductJsonLd } from "@global-trade/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { getProduct } from "@/lib/data";
import { getRuntimeSiteConfig } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [product, siteConfig] = await Promise.all([getProduct(slug), getRuntimeSiteConfig()]);
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
  const [product, siteConfig] = await Promise.all([getProduct(slug), getRuntimeSiteConfig()]);
  if (!product) notFound();

  return (
    <main className="shell section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createProductJsonLd(siteConfig, product)) }} />
      <div className="hero" style={{ paddingTop: 24 }}>
        <div>
          <p style={{ color: "var(--accent)", fontWeight: 700 }}>Product</p>
          <h1>{product.title}</h1>
          <p>{product.summary}</p>
        </div>
        <div className="hero-media" />
      </div>
      <section className="section">
        <h2>Specifications</h2>
        <div className="rich-text">
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
      </section>
      <section className="section rich-text" dangerouslySetInnerHTML={{ __html: product.richText }} />
      <section className="section">
        <h2>Send Inquiry</h2>
        <InquiryForm productId={product.id} sourceUrl={`/products/${product.slug}`} />
      </section>
    </main>
  );
}
