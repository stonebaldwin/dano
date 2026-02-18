import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rental Property Loans", description: "Financing options for rental property borrowers." };

export default function RentalPropertyPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Investment</div><h1>Rental Property Loans</h1><p className="section-intro">Evaluate acquisition and refinance structures for one-to-four unit rental properties.</p></div></section>
  );
}
