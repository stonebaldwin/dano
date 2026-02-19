import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mortgage Calculators",
  description:
    "Mortgage calculators for payment, buydown, refinance, and repayment analysis."
};

const pages = [
  {
    title: "Mortgage Calculator",
    body: "Estimate monthly payment using loan program-specific assumptions.",
    href: "/tools/mortgage-calculator"
  },
  {
    title: "Buydown Calculator",
    body: "Estimate payment impact for temporary and permanent rate buydown scenarios.",
    href: "/tools/buydown-calculator"
  },
  {
    title: "Refinance Calculator",
    body: "Compare current vs. proposed terms to estimate break-even timing.",
    href: "/tools/refinance-calculator"
  },
  {
    title: "Repayment Calculator",
    body: "View principal and interest payoff over time by month and year.",
    href: "/tools/repayment-calculator"
  }
];

export default function ToolsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Borrower Calculators</div>
        <h1>Mortgage Calculators</h1>
        <p className="section-intro">
          Use these calculators to estimate payment, buydown, and financing
          scenarios before speaking with an advisor.
        </p>
        <div className="grid-2">
          {pages.map((page) => (
            <Link key={page.title} href={page.href} className="card">
              <h3>{page.title}</h3>
              <p>{page.body}</p>
              <span className="link-arrow">Open calculator</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
