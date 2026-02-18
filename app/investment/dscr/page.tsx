import type { Metadata } from "next";

export const metadata: Metadata = { title: "DSCR Loans", description: "Debt-service coverage ratio loan options for investors." };

export default function DscrPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Investment</div><h1>DSCR Loans</h1><p className="section-intro">DSCR financing emphasizes property income performance and can streamline investor underwriting profiles.</p></div></section>
  );
}
