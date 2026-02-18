import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalPageBySlug, legalPages } from "@/lib/legal";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/legal/${page.slug}`
    }
  };
}

export default async function LegalDetailPage({ params }: Params) {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);
  if (!page) notFound();

  return (
    <section className="section">
      <div className="container legal-wrap">
        <div className="kicker">Legal and Regulatory</div>
        <h1>{page.title}</h1>
        <p className="section-intro">{page.description}</p>
        <div className="card legal-content">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
