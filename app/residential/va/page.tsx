import type { Metadata } from "next";

export const metadata: Metadata = { title: "VA Loans", description: "VA loan guidance for eligible military borrowers." };

export default function VaPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Residential</div><h1>VA Loans</h1><p className="section-intro">VA financing can provide powerful benefits for eligible service members, veterans, and surviving spouses.</p></div></section>
  );
}
