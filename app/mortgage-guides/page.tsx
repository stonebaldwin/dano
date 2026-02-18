import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mortgage Guides",
  description:
    "Mortgage learning center covering loan basics, first-time buyer steps, and refinance strategy."
};

const guides = [
  {
    title: "How Pre-Approval Works",
    body: "Understand documentation, credit review, and how to build an offer strategy around your financing profile.",
    intent: "First-time buyer"
  },
  {
    title: "Conventional vs FHA vs VA",
    body: "Compare qualification, down payment, and monthly payment structure to identify your best fit.",
    intent: "Loan comparison"
  },
  {
    title: "When to Refinance",
    body: "Evaluate break-even timing, term strategy, and equity goals before making a refinance move.",
    intent: "Refinance planning"
  },
  {
    title: "Closing Costs in NC",
    body: "Estimate settlement and lender costs early so your cash-to-close plan is realistic.",
    intent: "Budgeting"
  }
];

export default function MortgageGuidesPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Mortgage Education Library</div>
        <h1>Mortgage Guides</h1>
        <p className="section-intro">
          These evergreen guide topics are designed to rank for high-intent search
          phrases and route visitors naturally to your application CTA.
        </p>
        <div className="grid-2">
          {guides.map((guide) => (
            <article key={guide.title} className="card">
              <span className="badge">{guide.intent}</span>
              <h3>{guide.title}</h3>
              <p>{guide.body}</p>
              <Link className="link-arrow" href="/blog">
                View related posts
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
