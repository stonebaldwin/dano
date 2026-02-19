import type { Metadata } from "next";
import BuydownCalculator from "@/app/components/BuydownCalculator";

export const metadata: Metadata = {
  title: "Buydown Calculator",
  description: "Estimate payment impact for temporary and permanent rate buydown options."
};

export default function BuydownCalculatorPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Calculators</div>
        <h1>Buydown Calculator</h1>
        <p className="section-intro">
          Compare 2-1 and 1-1 buydown scenarios using loan amount, term, rate, and fees.
        </p>
        <BuydownCalculator />
      </div>
    </section>
  );
}
