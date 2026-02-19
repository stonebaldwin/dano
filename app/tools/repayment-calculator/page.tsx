import type { Metadata } from "next";
import AmortizationCalculator from "@/app/components/AmortizationCalculator";

export const metadata: Metadata = {
  title: "Repayment Calculator",
  description: "Analyze principal and interest payoff over the life of a mortgage."
};

export default function RepaymentCalculatorPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Calculators</div>
        <h1>Repayment Calculator</h1>
        <p className="section-intro">
          Estimate payoff timing with optional extra principal and review monthly and annual repayment breakdowns.
        </p>
        <AmortizationCalculator />
      </div>
    </section>
  );
}
