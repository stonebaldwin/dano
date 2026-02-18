import type { Metadata } from "next";

export const metadata: Metadata = { title: "Multi-Unit", description: "Commercial multi-unit financing options." };

export default function MultiUnitPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Commercial</div><h1>Multi-Unit Financing</h1><p className="section-intro">Explore financing structures for larger multifamily assets and mixed-use opportunities.</p></div></section>
  );
}
