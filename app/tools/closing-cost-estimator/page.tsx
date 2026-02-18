import type { Metadata } from "next";

export const metadata: Metadata = { title: "Closing Cost Estimator", description: "Estimate lender and third-party closing costs." };

export default function ClosingCostEstimatorPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Tools</div><h1>Closing Cost Estimator</h1><p className="section-intro">This page is reserved for a detailed closing cost and cash-to-close estimator.</p></div></section>
  );
}
