import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Specialty Lending",
  description: "Specialized mortgage and real-estate financing options for non-standard scenarios."
};

export default function SpecialtyLendingPage() {
  const pages = [
    { title: "New construction", href: "/commercial/construction/new-construction" },
    { title: "Renovation", href: "/commercial/construction/fix-and-flip-loans" },
    { title: "Land loans", href: "/investment/rental-property" },
    { title: "Commercial loans", href: "/commercial" },
    { title: "Bridge loans", href: "/investment/bridge-loans" },
    { title: "Reverse mortgages", href: "/commercial/specialty-lending" }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Loan Options</div>
        <h1>Specialty Lending</h1>
        <p className="section-intro">
          Review specialized financing paths for construction, land, bridge,
          commercial, and other non-standard scenarios.
        </p>
        <div className="grid-2">
          {pages.map((page) => (
            <Link key={page.title} href={page.href} className="card">
              <h3>{page.title}</h3>
              <span className="link-arrow">Learn more</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
