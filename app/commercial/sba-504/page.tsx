import type { Metadata } from "next";

export const metadata: Metadata = { title: "SBA 504", description: "SBA 504 fixed-asset financing guidance." };

export default function Sba504Page() {
  return (
    <section className="section"><div className="container"><div className="kicker">Commercial</div><h1>SBA 504</h1><p className="section-intro">SBA 504 lending is typically used for qualifying fixed assets and owner-occupied business property.</p></div></section>
  );
}
