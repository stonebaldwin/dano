import type { Metadata } from "next";

export const metadata: Metadata = { title: "Owner-Occupied Commercial", description: "Owner-occupied commercial loan guidance." };

export default function OwnerOccupiedPage() {
  return (
    <section className="section"><div className="container"><div className="kicker">Commercial</div><h1>Owner-Occupied Commercial</h1><p className="section-intro">Owner-occupied commercial financing aligns lending structure with long-term business operations.</p></div></section>
  );
}
