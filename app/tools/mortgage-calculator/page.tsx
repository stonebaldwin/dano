import type { Metadata } from "next";
import MortgageCalculator from "@/app/components/MortgageCalculator";

export const metadata: Metadata = {
  title: "Mortgage Calculator",
  description:
    "Estimate mortgage payments with loan-program-specific costs including FHA UFMIP and VA funding fee."
};

export default function MortgageCalculatorPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Calculators</div>
        <h1>Mortgage Calculator</h1>
        <p className="section-intro">
          Compare payment scenarios by loan program. Adjust purchase assumptions,
          escrows, and program fees to understand estimated monthly payment and
          cash-to-close impact.
        </p>
        <MortgageCalculator />
      </div>
    </section>
  );
}
