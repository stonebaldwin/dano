"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArticleMeta } from "@/lib/articles";

type ArticleCarouselProps = {
  articles: ArticleMeta[];
};

export default function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const [index, setIndex] = useState(0);
  const perView = 2;
  const maxIndex = Math.max(articles.length - perView, 0);

  const translatePercent = useMemo(() => index * (100 / perView), [index]);

  return (
    <div className="carousel-wrap">
      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-btn"
          onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
          disabled={index === 0}
          aria-label="Scroll previous articles"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="carousel-btn"
          onClick={() => setIndex((prev) => Math.min(prev + 1, maxIndex))}
          disabled={index === maxIndex}
          aria-label="Scroll next articles"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${translatePercent}%)` }}
        >
          {articles.map((article) => (
            <article key={article.slug} className="card carousel-card">
              <span className="badge">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <p className="muted-meta">
                {new Date(article.publishedAt).toLocaleDateString()} | {article.author}
              </p>
              <Link className="link-arrow" href={`/blog/${article.slug}`}>
                Read Article
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
