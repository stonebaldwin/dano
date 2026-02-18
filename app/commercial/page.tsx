import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commercial Loans",
  description:
    "Commercial lending guidance for owner-occupied, mixed-use, and small business properties."
};

const pages = [
  {
    title: "SBA 7(a)",
    body: "General-purpose small business financing for eligible commercial use-cases.",
    href: "/commercial/sba-7a"
  },
  {
    title: "SBA 504",
    body: "Long-term fixed asset financing for qualifying owner-occupied properties.",
    href: "/commercial/sba-504"
  },
  {
    title: "Multi-Unit",
    body: "Funding approaches for larger multifamily and mixed-use opportunities.",
    href: "/commercial/multi-unit"
  },
  {
    title: "Owner-Occupied",
    body: "Commercial property financing aligned to business occupancy goals.",
    href: "/commercial/owner-occupied"
  }
];

export default function CommercialPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Commercial Lending</div>
        <h1>Commercial Financing Solutions</h1>
        <p className="section-intro">
          Evaluate programs for business-use and income-generating properties
          with execution-focused guidance.
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
