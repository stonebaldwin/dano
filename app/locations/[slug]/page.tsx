import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, targetLocations } from "@/lib/config";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return targetLocations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const location = targetLocations.find((item) => item.slug === slug);
  if (!location) return {};

  return {
    title: location.title,
    description: location.description,
    alternates: {
      canonical: `/locations/${location.slug}`
    }
  };
}

export default async function LocationPage({ params }: Params) {
  const { slug } = await params;
  const location = targetLocations.find((item) => item.slug === slug);
  if (!location) notFound();

  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Local Market Lending</div>
        <h1>{location.title}</h1>
        <p className="section-intro">{location.description}</p>

        <div className="grid-2">
          <article className="card">
            <span className="badge">{location.city} Homebuyers</span>
            <h2>How Dan O supports borrowers in {location.city}</h2>
            <p>
              Financing strategy is tailored for local pace, inventory pressure,
              and affordability targets. Unique content for each city should grow
              over time with neighborhood-specific guidance.
            </p>
            <p>Key neighborhood focus: {location.neighborhoods.join(", ")}.</p>
            <Link className="link-arrow" href="/mortgage-guides">
              Explore mortgage guides
            </Link>
          </article>

          <article className="card card-soft">
            <span className="badge">Next Step</span>
            <h2>Start your online application</h2>
            <p>
              Once you are ready, move directly into the secure application flow
              to begin pre-approval.
            </p>
            <div className="cta-row">
              <a className="apply-btn" href={siteConfig.defaultApplyNowUrl} target="_blank" rel="noreferrer">
                Apply Now
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
