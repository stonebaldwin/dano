import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Buying Guides", description: "Educational buyer-focused mortgage guidance." };

export default function BuyingGuidesPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Insights</div><h1>Buying Guides</h1><p className="section-intro">Practical guidance for first-time and repeat buyers evaluating financing options.</p><Link className="link-arrow" href="/blog/articles">Browse articles</Link></div></section>
  );
}
