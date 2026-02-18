import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Investment Loans",
  description:
    "Investment property mortgage options and financing strategy for portfolio growth."
};

const pages = [
  {
    title: "DSCR Loans",
    body: "Cash-flow based underwriting for rental-focused investments.",
    href: "/investment/dscr"
  },
  {
    title: "Rental Property Loans",
    body: "Financing options for one-to-four unit rental acquisitions and refinances.",
    href: "/investment/rental-property"
  },
  {
    title: "Portfolio Loans",
    body: "Flexible structures for experienced investors with multiple properties.",
    href: "/investment/portfolio-loans"
  },
  {
    title: "Bridge Loans",
    body: "Short-term capital for acquisition timing and transition strategies.",
    href: "/investment/bridge-loans"
  }
];

export default function InvestmentPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Investment Financing</div>
        <h1>Investment Loan Options</h1>
        <p className="section-intro">
          Structured financing guidance for investors evaluating cash flow,
          growth strategy, and portfolio performance.
        </p>
        <div className="grid-2">
          {pages.map((page) => (
            <Link key={page.title} href={page.href} className="card">
              <h3>{page.title}</h3>
              <p>{page.body}</p>
              <span className="link-arrow">Learn more</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
