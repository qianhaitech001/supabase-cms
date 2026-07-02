import type { Post } from "@global-trade/core";
import Link from "next/link";

export function NewsList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <section className="news-list-section">
        <div className="storefront-empty-state">
          <h2>No news yet</h2>
          <p>Published posts will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="news-list-section">
      <div className="news-list-grid">
        {posts.map((post, index) => (
          <Link className="news-list-card" href={`/news/${post.slug}`} key={post.id}>
            <div className="news-list-meta">
              <span>{newsCategoryLabel(post, index)}</span>
              <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time>
            </div>
            <h2>{post.title}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatNewsDate(date: string | undefined) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function newsCategoryLabel(post: Post, index: number) {
  const text = `${post.title} ${post.excerpt ?? ""}`.toLowerCase();
  if (text.includes("airbnb") || text.includes("lifestyle") || text.includes("tiny house")) return "LIFESTYLE";
  return index === 2 || index === 4 || index === 5 ? "LIFESTYLE" : "COMPANY NEWS";
}
