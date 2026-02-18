# Dan O Home Loans - Next.js Starter

Starter project focused on SEO + conversion for a mortgage originator website.

## Includes

- Next.js 14 App Router with TypeScript
- Conversion CTA plumbing via `NEXT_PUBLIC_APPLY_NOW_URL`
- SEO foundations: metadata, canonical paths, robots, sitemap, schema markup
- Location pages scaffolded for:
  - Wilmington, NC
  - Southern Pines, NC
  - Raleigh, NC
- Blog/resource center backed by a JSON datastore (`data/articles.json`)
- Dynamic article routes + dedicated `/blog/articles` index page
- Seed workflow for article content (`npm run db:seed`)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Key Files

- `app/page.tsx`: Homepage with primary conversion flow
- `app/locations/[slug]/page.tsx`: Location SEO pages
- `app/mortgage-guides/page.tsx`: Topical authority page
- `app/blog/page.tsx`: Insights landing page
- `app/blog/articles/page.tsx`: Full article listing page
- `app/blog/[slug]/page.tsx`: Dynamic article template
- `lib/articles.ts`: Article datastore queries and markdown rendering
- `lib/config.ts`: Site/domain/configuration and target locations
- `app/sitemap.ts`, `app/robots.ts`: Crawl/index setup

## Database Notes

Article data is stored in a JSON datastore (`BLOG_DB_PATH`, default `./data/articles.json`).
The app auto-initializes the data file and includes 3 starter housing/loan update
articles. Run `npm run db:seed` anytime to upsert the sample records.

## Domain + Redirect Strategy

Use `danohomeloans.com` as the canonical domain. Point location-based domains
(e.g., `mortgagewilmington.com`) with 301 redirects to relevant location pages:

- `mortgagewilmington.com` -> `https://www.danohomeloans.com/locations/wilmington-nc`
- `mortgagesouthernpines.com` -> `https://www.danohomeloans.com/locations/southern-pines-nc`
- `mortgageraleigh.com` -> `https://www.danohomeloans.com/locations/raleigh-nc`

This preserves a single site authority while still capturing exact-match domain traffic.
