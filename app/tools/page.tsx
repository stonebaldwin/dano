import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mortgage Tools",
  description:
    "Mortgage calculators and planning tools for payment, affordability, and refinance analysis."
};

const pages = [
  {
    title: "Mortgage Calculator",
    body: "Estimate monthly payment using loan program-specific assumptions.",
    href: "/tools/mortgage-calculator"
  },
  {
    title: "Affordability",
    body: "Estimate target home price ranges based on monthly budget inputs.",
    href: "/tools/affordability"
  },
  {
    title: "Refinance Savings",
    body: "Compare current vs. proposed terms to estimate break-even timing.",
    href: "/tools/refinance-savings"
  },
  {
    title: "Closing Cost Estimator",
    body: "Estimate cash-to-close with lender, third-party, and prepaid costs.",
    href: "/tools/closing-cost-estimator"
  }
];

export default function ToolsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Borrower Tools</div>
        <h1>Mortgage Planning Tools</h1>
        <p className="section-intro">
          Use these tools to estimate payment, affordability, and financing
          scenarios before speaking with an advisor.
        </p>
        <div className="grid-2">
          {pages.map((page) => (
            <Link key={page.title} href={page.href} className="card">
              <h3>{page.title}</h3>
              <p>{page.body}</p>
              <span className="link-arrow">Open tool</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
