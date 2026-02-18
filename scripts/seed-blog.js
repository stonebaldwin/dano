const fs = require("node:fs");
const path = require("node:path");

const configuredPath = process.env.BLOG_DB_PATH;
const dbPath = configuredPath
  ? path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(process.cwd(), configuredPath)
  : path.join(process.cwd(), "data", "articles.json");

const seedArticles = [
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
    contentMarkdown:
      "## Key market signals in Wilmington\\n\\nWilmington remains supply-constrained in several submarkets.\\n\\n## What this means for borrowers\\n\\n- Pre-approval should be completed before tours\\n- Buyers should evaluate payment comfort early\\n- Offer strategy benefits from lender response speed"
  },
  {
    slug: "fha-and-conventional-updates-what-borrowers-should-watch",
    title: "FHA and Conventional Updates: What Borrowers Should Watch",
    excerpt:
      "A practical summary of loan program considerations that may influence payment and approval pathways.",
    category: "Loan Programs",
    author: "Dan O Team",
    publishedAt: "2026-01-20",
    updatedAt: "2026-01-20",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80",
    contentMarkdown:
      "## Program selection still starts with borrower goals\\n\\nFHA and conventional options each solve different problems."
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
    contentMarkdown:
      "## Why VA and USDA matter\\n\\nFor qualified borrowers, VA and USDA structures can reduce upfront cash pressure."
  }
];

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

let existing = { articles: [] };
if (fs.existsSync(dbPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch {
    existing = { articles: [] };
  }
}

const bySlug = new Map((existing.articles || []).map((a) => [a.slug, a]));
for (const article of seedArticles) {
  bySlug.set(article.slug, article);
}

const merged = {
  articles: Array.from(bySlug.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
};

fs.writeFileSync(dbPath, JSON.stringify(merged, null, 2), "utf8");
console.log(`Seeded ${seedArticles.length} articles into ${dbPath}`);
