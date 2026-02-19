import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";
import { siteConfig } from "@/lib/config";
import { legalPages } from "@/lib/legal";
import { navigation } from "@/lib/navigation";
import { createOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Dan O Home Loans | Mortgage Guidance in NC",
    template: "%s | Dan O Home Loans"
  },
  description:
    "Mortgage education and local home loan guidance for Wilmington, Southern Pines, Raleigh, and nearby North Carolina communities.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Dan O Home Loans",
    description:
      "Mortgage resources and local loan guidance for NC homebuyers and homeowners.",
    url: siteConfig.domain,
    siteName: "Dan O Home Loans",
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = createOrganizationSchema();

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <div className="utility-bar">
            <div className="container utility-inner">
              <span>SERVING North Carolina, Texas, Tennessee, Georgia</span>
              <span>{siteConfig.phone}</span>
            </div>
          </div>
          <header className="header">
            <div className="container header-inner">
              <Link href="/" className="brand">
                Dan O Home Loans
              </Link>
              <SiteHeader items={navigation} />
              <a className="apply-btn" href={siteConfig.defaultApplyNowUrl} target="_blank" rel="noreferrer">
                Apply Now
              </a>
            </div>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <div className="container footer-upper">
              <div className="footer-brand-block">
                <strong>Dan O Home Loans</strong>
                <p className="footer-intro">
                  Institutional-grade mortgage guidance with local North Carolina market expertise for buyers, investors, and business owners.
                </p>
                <a className="apply-btn" href={siteConfig.defaultApplyNowUrl} target="_blank" rel="noreferrer">
                  Apply Now
                </a>
              </div>

              <div className="footer-nav-grid">
                {navigation.map((item) => (
                  <div key={item.label} className="footer-col">
                    <Link href={item.href} className="footer-col-title">
                      {item.label}
                    </Link>
                    <ul>
                      {item.sublinks.map((sub) => (
                        <li key={`${item.label}-${sub.label}`}>
                          <Link href={sub.href}>{sub.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="container footer-legal">
              <div className="footer-note">
                Contact: {siteConfig.phone} | {siteConfig.email}
              </div>
              <ul className="legal-links">
                {legalPages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/legal/${page.slug}`}>{page.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </footer>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
