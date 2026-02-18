import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refinance Savings Tool", description: "Estimate refinance scenarios and break-even outcomes." };

export default function RefinanceSavingsPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Tools</div><h1>Refinance Savings Tool</h1><p className="section-intro">This page is ready for side-by-side refinance comparison and break-even estimation.</p></div></section>
  );
}
