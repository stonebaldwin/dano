import type { Metadata } from "next";
import Link from "next/link";
import { legalPages } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Legal and Regulatory",
  description:
    "Legal policies, disclosures, and regulatory information for Dan O Home Loans."
};

export default function LegalIndexPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Legal and Regulatory</div>
        <h1>Legal and Regulatory Pages</h1>
        <p className="section-intro">
          The following pages provide policy and disclosure content commonly
          required for mortgage websites. Final language should be reviewed by
          legal and compliance teams before publication.
        </p>
        <div className="grid-2">
          {legalPages.map((page) => (
            <Link key={page.slug} href={`/legal/${page.slug}`} className="card">
              <h3>{page.title}</h3>
              <p>{page.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
