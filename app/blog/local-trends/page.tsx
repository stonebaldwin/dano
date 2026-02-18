import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Local Trends", description: "Location-focused mortgage and housing trend commentary." };

export default function LocalTrendsPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Insights</div><h1>Local Trends</h1><p className="section-intro">Follow borrower-relevant local market trends across Wilmington, Raleigh, and surrounding areas.</p><Link className="link-arrow" href="/blog/articles">Browse articles</Link></div></section>
  );
}
