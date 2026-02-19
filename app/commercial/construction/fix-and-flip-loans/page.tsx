import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fix and Flip Loans",
  description: "Short-term financing for acquisition and renovation of investment properties."
};

export default function FixAndFlipLoansPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Construction</div>
        <h1>Fix and Flip Loans</h1>
        <p className="section-intro">
          Evaluate financing structures for purchase-rehab-exit strategies on one-to-four unit investment properties.
        </p>
      </div>
    </section>
  );
}
