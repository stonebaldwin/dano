import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specialty Lending",
  description: "Specialized mortgage and real-estate financing options for non-standard scenarios."
};

export default function SpecialtyLendingPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Loan Programs</div>
        <h1>Specialty Lending</h1>
        <p className="section-intro">
          Review specialty financing options including bridge lending and HELOC solutions for qualified borrowers.
        </p>
      </div>
    </section>
  );
}
