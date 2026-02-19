import type { Metadata } from "next";
import RefinanceCalculator from "@/app/components/RefinanceCalculator";

export const metadata: Metadata = {
  title: "Refinance Calculator",
  description: "Estimate refinance scenarios and break-even outcomes."
};

export default function RefinanceCalculatorPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Calculators</div>
        <h1>Refinance Calculator</h1>
        <p className="section-intro">
          Compare your current loan to a new refinance structure including points, costs, fees, and cash out.
        </p>
        <RefinanceCalculator />
      </div>
    </section>
  );
}
