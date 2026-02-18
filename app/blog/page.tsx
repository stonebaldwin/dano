import type { Metadata } from "next";
import Link from "next/link";
import { getRecentArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Mortgage Blog",
  description:
    "Mortgage education articles focused on buying and refinancing in Wilmington, Southern Pines, and Raleigh."
};

export default function BlogPage() {
  const posts = getRecentArticles(3);
  const subpages = [
    {
      title: "Articles",
      body: "Browse the complete archive of market and mortgage guidance posts.",
      href: "/blog/articles"
    },
    {
      title: "Market Updates",
      body: "Track changing conditions in rates, inventory, and buyer competition.",
      href: "/blog/market-updates"
    },
    {
      title: "Buying Guides",
      body: "Practical playbooks for first-time and repeat buyers.",
      href: "/blog/buying-guides"
    },
    {
      title: "Refinance Insights",
      body: "Explore timing, break-even, and equity strategy considerations.",
      href: "/blog/refinance"
    },
    {
      title: "Local Trends",
      body: "Local market movement for Wilmington, Raleigh, and nearby areas.",
      href: "/blog/local-trends"
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Insights and Analysis</div>
        <h1>Mortgage Insights</h1>
        <p className="section-intro">
          Explore housing market commentary and loan program strategy updates. Use
          the articles hub to browse the full archive.
        </p>
        <p>
          <Link className="link-arrow" href="/blog/articles">
            View all articles
          </Link>
        </p>
        <div className="grid-3 section-spacer-sm">
          {subpages.map((page) => (
            <Link key={page.title} href={page.href} className="card card-soft">
              <h3>{page.title}</h3>
              <p>{page.body}</p>
              <span className="link-arrow">Explore</span>
            </Link>
          ))}
        </div>
        <div className="grid-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
              <span className="badge">{post.category}</span>
              <h3>{post.title}</h3>
              <p>{new Date(post.publishedAt).toLocaleDateString()} | {post.author}</p>
              <p>{post.excerpt}</p>
              <span className="link-arrow">Read article</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
