import type { Metadata } from "next";

export const metadata: Metadata = { title: "SBA 7(a)", description: "SBA 7(a) commercial lending guidance." };

export default function Sba7aPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Commercial</div><h1>SBA 7(a)</h1><p className="section-intro">SBA 7(a) programs support qualifying small business financing across a broad range of use-cases.</p></div></section>
  );
}
