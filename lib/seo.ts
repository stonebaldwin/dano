import { siteConfig } from "@/lib/config";

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteConfig.domain,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: ["Wilmington NC", "Southern Pines NC", "Raleigh NC"]
  };
}
