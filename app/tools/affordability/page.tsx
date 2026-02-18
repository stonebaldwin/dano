import type { Metadata } from "next";

export const metadata: Metadata = { title: "Affordability Tool", description: "Affordability planning tool for prospective borrowers." };

export default function AffordabilityPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Tools</div><h1>Affordability Tool</h1><p className="section-intro">This page is reserved for a full affordability calculator and budget-planning assistant.</p></div></section>
  );
}
