import type { Metadata } from "next";

export const metadata: Metadata = { title: "USDA Loans", description: "USDA home loan options in eligible areas." };

export default function UsdaPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Residential</div><h1>USDA Loans</h1><p className="section-intro">USDA loans support eligible borrowers in qualifying locations with low down payment barriers.</p></div></section>
  );
}
