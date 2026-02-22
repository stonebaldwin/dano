import type { Metadata } from "next";
import CustomRatesExperience from "@/app/components/CustomRatesExperience";

export const metadata: Metadata = {
  title: "Mortgage Rates",
  description: "Get custom mortgage rate guidance based on your homebuying scenario."
};

export default function MortgageRatesPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Let&apos;s Find the Right Rate for You</h1>
        <p className="section-intro rates-page-intro">
          Stop guessing what your mortgage rate might be. The best way to find the lowest price is to get a quote based on your specific details, and we&apos;ve made the process simple.
        </p>
        <CustomRatesExperience />
      </div>
    </section>
  );
}
