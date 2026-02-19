import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Construction Loans",
  description: "Financing options for ground-up residential and mixed-use construction projects."
};

export default function NewConstructionLoansPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Construction</div>
        <h1>New Construction Loans</h1>
        <p className="section-intro">
          Explore lot-to-perm and single-close construction financing options for eligible new build projects.
        </p>
      </div>
    </section>
  );
}
