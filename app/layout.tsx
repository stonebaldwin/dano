import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";
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
              <div className="header-actions">
                <a className="ghost-btn header-ghost-btn" href="https://apply.alcova.com/homehub_sso" target="_blank" rel="noreferrer">
                  Existing Application
                </a>
                <a className="apply-btn" href={siteConfig.defaultApplyNowUrl} target="_blank" rel="noreferrer">
                  Apply Now
                </a>
              </div>
            </div>
          </div>
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
