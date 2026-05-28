import { createMetadata } from "@global-trade/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data";
import { getRuntimeSiteConfig } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [post, siteConfig] = await Promise.all([getPost(slug), getRuntimeSiteConfig()]);
  if (!post) return {};
  const metadata = createMetadata(siteConfig, post.seo, `/news/${post.slug}`);
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: { canonical: metadata.canonicalUrl },
    robots: metadata.robots,
    openGraph: metadata.openGraph
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="shell section">
      <article>
        <p style={{ color: "var(--accent)", fontWeight: 700 }}>News</p>
        <h1>{post.title}</h1>
        {post.excerpt && <p style={{ color: "var(--muted)" }}>{post.excerpt}</p>}
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: post.richText }} />
      </article>
    </main>
  );
}
