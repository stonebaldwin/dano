import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticleSlugs,
  renderMarkdownToHtml
} from "@/lib/articles";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getArticleSlugs();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/blog/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImageUrl]
    }
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const contentHtml = await renderMarkdownToHtml(article.contentMarkdown);

  return (
    <article className="section">
      <div className="container article-shell">
        <div className="kicker">{article.category}</div>
        <h1>{article.title}</h1>
        <p className="section-intro">{article.excerpt}</p>

        <div className="article-top-meta">
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          <span>{article.author}</span>
          <Link className="link-arrow" href="/blog/articles">
            All articles
          </Link>
        </div>

        <div className="article-hero-media" aria-hidden="true">
          <Image
            src={article.featuredImageUrl}
            alt=""
            width={1600}
            height={900}
            priority
          />
        </div>

        <div
          className="blog-content card article-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </article>
  );
}
