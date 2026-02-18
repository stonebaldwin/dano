import type { Metadata } from "next";

export const metadata: Metadata = { title: "FHA Loans", description: "FHA loan options for primary-home financing." };

export default function FhaPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Residential</div><h1>FHA Loans</h1><p className="section-intro">FHA programs can expand qualification pathways and reduce upfront barriers for many borrowers.</p></div></section>
  );
}
