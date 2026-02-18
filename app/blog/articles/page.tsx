import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Browse all mortgage market and loan program articles from Dan O Home Loans."
};

export default function BlogArticlesPage() {
  const articles = getAllArticles();

  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Insights Library</div>
        <h1>All Articles</h1>
        <p className="section-intro">
          Market updates, financing strategy, and program guidance for North
          Carolina homebuyers and homeowners.
        </p>

        <div className="article-list">
          {articles.map((article) => (
            <article key={article.slug} className="card article-row">
              <div>
                <span className="badge">{article.category}</span>
                <h2 className="article-row-title">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>
                <p>{article.excerpt}</p>
              </div>
              <div className="article-meta">
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                <span>{article.author}</span>
                <Link className="link-arrow" href={`/blog/${article.slug}`}>
                  Read Article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
