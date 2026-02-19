import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";
import UtilityRatesTicker from "@/app/components/UtilityRatesTicker";
import ScrollPageBackground from "@/app/components/ScrollPageBackground";
import { siteConfig } from "@/lib/config";
import { legalPages } from "@/lib/legal";
import { navigation } from "@/lib/navigation";
import { createOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Dan Opirhory | Mortgage Guidance in NC",
    template: "%s | Dan Opirhory"
  },
  description:
    "Mortgage education and local home loan guidance for Wilmington, Southern Pines, Raleigh, and nearby North Carolina communities.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Dan Opirhory",
    description:
      "Mortgage resources and local loan guidance for NC homebuyers and homeowners.",
    url: siteConfig.domain,
    siteName: "Dan Opirhory",
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
        <ScrollPageBackground />
        <div className="site-shell">
          <div className="utility-bar">
            <div className="container utility-inner">
              <Link href="/" className="utility-brand">
                <span className="utility-logo-placeholder" aria-hidden="true">Logo</span>
                <span>ALCOVA Mortgage</span>
              </Link>
              <div className="utility-nav-cluster">
                <span className="utility-divider" aria-hidden="true">|</span>
                <SiteHeader items={navigation} />
              </div>
              <UtilityRatesTicker />
            </div>
          </div>
          <header className="header">
            <div className="container header-inner">
              <div className="brand-identity">
                <span className="headshot-placeholder" aria-hidden="true">Headshot</span>
                <div className="brand-wrap">
                  <span className="brand">
                    Daniel Opirhory | {siteConfig.phone}
                  </span>
                  <span className="brand-serving">Serving North Carolina, Texas, Tennessee, Georgia</span>
                  <a
                    className="brand-rating"
                    href="https://www.experience.com/reviews/daniel-opirhory-384903"
                    target="_blank"
                    rel="noreferrer"
                  >
                    5.0 Customer Rating (Read Reviews)
                  </a>
                  <div className="brand-socials" aria-label="Social media links">
                    <a
                      href="https://www.facebook.com/danopirhoryLO"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M13.5 8H16V5h-2.5C10.9 5 9 6.9 9 9.5V12H7v3h2v6h3v-6h3l.5-3H12V9.5c0-.9.6-1.5 1.5-1.5z" fill="currentColor" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/daniel-opirhory/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6.2 8.7a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8zM4.7 10h3v9h-3v-9zm5 0h2.8v1.3h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5V19h-3v-4c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-3v-9z" fill="currentColor" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/dan_opirhory_mlo/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9zm9.8 1.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="currentColor" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="header-actions">
                <a className="ghost-btn header-ghost-btn" href="https://apply.alcova.com/homehub_sso" target="_blank" rel="noreferrer">
                  Existing Application
                </a>
                <a className="apply-btn" href={siteConfig.defaultApplyNowUrl} target="_blank" rel="noreferrer">
                  Apply Now
                </a>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <div className="container footer-upper">
              <div className="footer-brand-block">
                <strong>Dan Opirhory</strong>
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
                          {sub.children?.length ? (
                            <ul className="footer-submenu">
                              {sub.children.map((child) => (
                                <li key={`${item.label}-${sub.label}-${child.label}`}>
                                  <Link href={child.href}>{child.label}</Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
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
