import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HELOCs",
  description: "Home equity line of credit options for access to revolving equity-based funds."
};

export default function HelocsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Specialty Lending</div>
        <h1>HELOCs</h1>
        <p className="section-intro">
          Compare HELOC structures, draw periods, and repayment options based on your home equity and borrowing goals.
        </p>
      </div>
    </section>
  );
}
