import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Loans",
  description: "Construction financing options for new builds, renovation projects, and tailored borrower scenarios."
};

export default function ConstructionLoansPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Loan Options</div>
        <h1>Construction Loans</h1>
        <p className="section-intro">
          Review construction loan structures for new home builds, value-add projects, and unique financing scenarios.
        </p>
      </div>
    </section>
  );
}
