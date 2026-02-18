import type { Metadata } from "next";

export const metadata: Metadata = { title: "Portfolio Loans", description: "Portfolio lending for experienced real estate investors." };

export default function PortfolioLoansPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Investment</div><h1>Portfolio Loans</h1><p className="section-intro">Portfolio options can provide flexibility for investors operating across multiple properties and entities.</p></div></section>
  );
}
