import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Purchase Loans",
  description:
    "Home purchase financing options across conventional, government, jumbo, and non-QM pathways."
};

const pages = [
  {
    title: "Conventional Loans",
    body: "Flexible financing for qualified borrowers seeking long-term payment stability.",
    href: "/residential/conventional"
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
  },
  {
    title: "USDA Loans",
    body: "Zero-down options in eligible areas for qualifying borrowers.",
    href: "/residential/usda"
  },
  {
    title: "DSCR",
    body: "Investor-focused qualification based on rental cash-flow performance.",
    href: "/investment/dscr"
  },
  {
    title: "Jumbo",
    body: "Financing structures for higher-balance purchase scenarios.",
    href: "/commercial/specialty-lending"
  },
  {
    title: "Bank Statement Loans",
    body: "Alternative income documentation for self-employed borrowers.",
    href: "/commercial/specialty-lending"
  },
  {
    title: "1099 Loans",
    body: "Financing options designed around 1099 income profiles.",
    href: "/commercial/specialty-lending"
  },
  {
    title: "Buy before you sell loans",
    body: "Bridge-style purchase options when transitioning between properties.",
    href: "/commercial/specialty-lending"
  }
];

export default function ResidentialPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Loan Options</div>
        <h1>Purchase Loans</h1>
        <p className="section-intro">
          Explore home purchase financing solutions across conforming, government,
          and specialty lending pathways.
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
