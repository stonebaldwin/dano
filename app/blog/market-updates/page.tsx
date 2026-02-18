import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Market Updates", description: "Mortgage and housing market updates." };

export default function MarketUpdatesPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Insights</div><h1>Market Updates</h1><p className="section-intro">Track housing and mortgage market movement with practical borrower-facing context.</p><Link className="link-arrow" href="/blog/articles">Browse articles</Link></div></section>
  );
}
