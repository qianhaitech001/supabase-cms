import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { NewsList } from "@/components/storefront/NewsList";
import { listPosts } from "@/lib/data";
import { getStaticContent } from "@/lib/static-content";
import { getRequestLocale } from "@/lib/static-locale";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const seo = getStaticContent(locale).seo.news;
  return {
    title: seo.title,
    description: seo.description
  };
}

export default async function NewsPage() {
  const locale = await getRequestLocale();
  const content = getStaticContent(locale);
  const posts = await listPosts();
  const [featuredPost, ...remainingPosts] = posts;
  const newsItems = remainingPosts.slice(0, 6);

  return (
    <main className="news-page">
      {featuredPost ? (
        <section className="news-hero">
          <p>{content.text.news.eyebrow}</p>
          <h1>{featuredPost.title}</h1>
          <Link className="news-detail-button" href={`/news/${featuredPost.slug}`}>
            {content.text.news.detail} <ArrowRight size={18} />
          </Link>
        </section>
      ) : (
        <section className="news-hero">
          <p>{content.text.news.eyebrow}</p>
          <h1>{content.text.news.title}</h1>
        </section>
      )}

      <NewsList posts={newsItems} />
    </main>
  );
}
