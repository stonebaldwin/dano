import type { MetadataRoute } from "next";
import { siteConfig, targetLocations } from "@/lib/config";
import { getAllArticles } from "@/lib/articles";
import { legalPages } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/mortgage-guides",
    "/mortgage-rates",
    "/blog",
    "/blog/articles",
    "/blog/market-updates",
    "/blog/buying-guides",
    "/blog/refinance",
    "/blog/local-trends",
    "/residential",
    "/residential/conventional",
    "/residential/usda",
    "/residential/fha",
    "/residential/va",
    "/investment",
    "/investment/dscr",
    "/investment/rental-property",
    "/investment/portfolio-loans",
    "/investment/bridge-loans",
    "/commercial",
    "/commercial/construction",
    "/commercial/construction/new-construction",
    "/commercial/construction/fix-and-flip-loans",
    "/commercial/construction/sweat-equity-loans",
    "/commercial/specialty-lending",
    "/commercial/specialty-lending/helocs",
    "/commercial/sba-7a",
    "/commercial/sba-504",
    "/commercial/multi-unit",
    "/commercial/owner-occupied",
    "/tools",
    "/tools/mortgage-calculator",
    "/tools/buydown-calculator",
    "/tools/refinance-calculator",
    "/tools/repayment-calculator",
    "/legal"
  ].map((route) => ({
    url: `${siteConfig.domain}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8
  }));

  const locationRoutes = targetLocations.map((location) => ({
    url: `${siteConfig.domain}/locations/${location.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const blogRoutes = getAllArticles().map((post) => ({
    url: `${siteConfig.domain}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  const legalRoutes = legalPages.map((page) => ({
    url: `${siteConfig.domain}/legal/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...locationRoutes, ...blogRoutes, ...legalRoutes];
}
