import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conventional Loans",
  description: "Conventional mortgage options for qualified homebuyers."
};

export default function ConventionalPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Residential</div><h1>Conventional Loans</h1><p className="section-intro">Conventional financing may offer strong long-term value for borrowers with stable credit and down payment flexibility.</p></div></section>
  );
}
