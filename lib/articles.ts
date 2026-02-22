import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import html from "remark-html";

export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  featuredImageUrl: string;
};

export type Article = ArticleMeta & {
  contentMarkdown: string;
};

type ArticleStore = {
  articles: Article[];
};

const seedArticles: Article[] = [
  {
    slug: "wilmington-housing-market-outlook-q1-2026",
    title: "Wilmington Housing Market Outlook: Q1 2026",
    excerpt:
      "Inventory trends, buyer competition, and financing strategy for Wilmington in early 2026.",
    category: "Market Update",
    author: "Dan O Team",
    publishedAt: "2026-02-01",
    updatedAt: "2026-02-01",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    contentMarkdown: `## Key market signals in Wilmington\n\nWilmington remains supply-constrained in several submarkets, which means well-prepared buyers continue to benefit from strong pre-approval and fast lender response times.\n\n## What this means for borrowers\n\n- Pre-approval should be completed before active home tours\n- Buyers should evaluate payment comfort using current insurance and tax assumptions\n- Offer strategy often favors clean financing terms and communication speed\n\n## 2026 planning notes\n\nIf rates move incrementally, many buyers who paused in late 2025 may re-enter. In that scenario, financing readiness becomes a competitive edge.`
  },
  {
    slug: "fha-and-conventional-updates-what-borrowers-should-watch",
    title: "FHA and Conventional Updates: What Borrowers Should Watch",
    excerpt:
      "A practical summary of loan program considerations that may influence payment and approval pathways.",
    category: "Loan Options",
    author: "Dan O Team",
    publishedAt: "2026-01-20",
    updatedAt: "2026-01-20",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80",
    contentMarkdown: `## Program selection still starts with borrower goals\n\nFHA and conventional options each solve different problems. FHA may help with qualification flexibility, while conventional may optimize long-term cost structure depending on profile and down payment.\n\n## Questions to review early\n\n1. What is the lowest sustainable monthly payment under conservative assumptions?\n2. How long is the borrower likely to keep the property and financing?\n3. Is faster upfront qualification or lower lifetime cost the higher priority?\n\n## Advisor takeaway\n\nA side-by-side comparison during pre-approval avoids late-stage product switching and keeps closing timelines predictable.`
  },
  {
    slug: "va-and-usda-opportunities-in-nc-markets",
    title: "VA and USDA Opportunities in NC Markets",
    excerpt:
      "How eligible borrowers in North Carolina can evaluate VA and USDA pathways in 2026.",
    category: "Program Strategy",
    author: "Dan O Team",
    publishedAt: "2025-12-22",
    updatedAt: "2025-12-22",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80",
    contentMarkdown: `## Why VA and USDA matter\n\nFor qualified borrowers, VA and USDA structures can reduce upfront cash pressure and improve path-to-ownership timelines.\n\n## Market fit considerations\n\n- Property eligibility and location constraints should be validated first\n- Borrowers should still model reserves and post-close liquidity\n- Contract timelines should account for appraisal and underwriting sequencing\n\n## Next step\n\nA targeted consultation can confirm eligibility and compare payment scenarios against conventional alternatives.`
  }
];

function resolveDbPath() {
  const configuredPath = process.env.BLOG_DB_PATH;
  if (configuredPath) {
    return path.isAbsolute(configuredPath)
      ? configuredPath
      : path.join(process.cwd(), configuredPath);
  }

  return path.join(process.cwd(), "data", "articles.json");
}

function ensureStore(): ArticleStore {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  if (!fs.existsSync(dbPath)) {
    const initial = { articles: seedArticles };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  const raw = fs.readFileSync(dbPath, "utf8");
  try {
    const parsed = JSON.parse(raw) as ArticleStore;
    if (!parsed.articles || parsed.articles.length === 0) {
      const initial = { articles: seedArticles };
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    return parsed;
  } catch {
    const initial = { articles: seedArticles };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

function sortByPublishedAtDesc(items: Article[]) {
  return [...items].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllArticles(): ArticleMeta[] {
  const store = ensureStore();
  return sortByPublishedAtDesc(store.articles).map(({ contentMarkdown, ...meta }) => meta);
}

export function getRecentArticles(limit = 3): ArticleMeta[] {
  return getAllArticles().slice(0, limit);
}

export function getArticleSlugs() {
  return getAllArticles().map((item) => ({ slug: item.slug }));
}

export function getArticleBySlug(slug: string): Article | null {
  const store = ensureStore();
  return store.articles.find((article) => article.slug === slug) ?? null;
}

export async function renderMarkdownToHtml(markdown: string) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

export function seedArticlesIfNeeded() {
  ensureStore();
}
