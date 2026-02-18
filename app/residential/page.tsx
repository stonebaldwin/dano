import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Residential Loans",
  description:
    "Residential mortgage options for first-time buyers, primary homes, and move-up purchases."
};

const pages = [
  {
    title: "Conventional Loans",
    body: "Flexible financing for qualified borrowers seeking long-term payment stability.",
    href: "/residential/conventional"
  },
  {
    title: "USDA Loans",
    body: "Zero-down options in eligible areas for qualifying borrowers.",
    href: "/residential/usda"
  },
  {
    title: "FHA Loans",
    body: "Accessible qualification pathways with low down payment requirements.",
    href: "/residential/fha"
  },
  {
    title: "VA Loans",
    body: "Benefit-focused financing for eligible veterans and military families.",
    href: "/residential/va"
  }
];

export default function ResidentialPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Residential Lending</div>
        <h1>Residential Loan Programs</h1>
        <p className="section-intro">
          Explore core purchase and primary-home financing solutions built around
          borrower goals and long-term affordability.
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
