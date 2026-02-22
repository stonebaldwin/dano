import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refinance Loans",
  description: "Refinance loan pathways for rate-term adjustments and cash-out strategies."
};

const pages = [
  {
    title: "Home Refinance Loans",
    body: "Rate-and-term refinance options focused on payment and timeline goals.",
    href: "/tools/refinance-calculator"
  },
  {
    title: "Cash-out Refinancing",
    body: "Access home equity through refinance structures when financial goals require liquidity.",
    href: "/tools/refinance-calculator"
  }
];

export default function RefinanceLoansPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Loan Options</div>
        <h1>Refinance Loans</h1>
        <p className="section-intro">
          Compare refinance pathways based on payment reduction, term strategy,
          and equity-access objectives.
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
