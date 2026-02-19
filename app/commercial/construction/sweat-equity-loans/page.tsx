import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sweat Equity Loans",
  description: "Loan options that may allow eligible borrower labor contributions in project financing."
};

export default function SweatEquityLoansPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Construction</div>
        <h1>Sweat Equity Loans</h1>
        <p className="section-intro">
          Learn how eligible sweat equity contributions can be considered within select renovation and construction programs.
        </p>
      </div>
    </section>
  );
}
