import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Refinance Insights", description: "Refinance-focused strategy and market commentary." };

export default function RefinanceInsightsPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Insights</div><h1>Refinance Insights</h1><p className="section-intro">Learn when refinancing may align with payment, term, or equity goals.</p><Link className="link-arrow" href="/blog/articles">Browse articles</Link></div></section>
  );
}
