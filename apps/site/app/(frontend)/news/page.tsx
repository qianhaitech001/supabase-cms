import Link from "next/link";
import { listPosts } from "@/lib/data";

export default async function NewsPage() {
  const posts = await listPosts();
  return (
    <main className="shell section">
      <h1>News</h1>
      <div className="grid" style={{ marginTop: 24 }}>
        {posts.map((post) => (
          <Link className="card" href={`/news/${post.slug}`} key={post.id}>
            <div className="card__body">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
