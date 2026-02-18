export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{ heading: string; body: string }>;
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How personal information is collected, used, and safeguarded.",
    sections: [
      {
        heading: "Information We Collect",
        body: "We may collect contact details, financial profile information provided through applications, analytics data, and communication preferences."
      },
      {
        heading: "How Information Is Used",
        body: "Information is used to evaluate loan inquiries, provide mortgage services, communicate updates, and comply with legal and regulatory obligations."
      },
      {
        heading: "Data Sharing",
        body: "Information may be shared with processors, investors, and service providers as required for underwriting, compliance, fraud prevention, and servicing."
      }
    ]
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    description: "Terms governing access and use of this website.",
    sections: [
      {
        heading: "Website Use",
        body: "By using this website, users agree to lawful use, accurate information submission, and compliance with applicable lending and consumer protection laws."
      },
      {
        heading: "No Loan Commitment",
        body: "Website content is informational only and does not constitute a commitment to lend, rate quote, or guarantee of loan approval."
      },
      {
        heading: "Limitation of Liability",
        body: "The website is provided on an as-is basis. Users remain responsible for independent decisions regarding financing and legal matters."
      }
    ]
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: "How cookies and tracking technologies are used.",
    sections: [
      {
        heading: "Cookie Categories",
        body: "Cookies may include essential functionality cookies, analytics cookies, and performance cookies used to improve site experience and reporting."
      },
      {
        heading: "Managing Preferences",
        body: "Users can adjust browser settings to block cookies, though some features may become unavailable or operate with reduced functionality."
      }
    ]
  },
  {
    slug: "accessibility-statement",
    title: "Accessibility Statement",
    description: "Accessibility practices and support contact details.",
    sections: [
      {
        heading: "Commitment",
        body: "This website strives to provide an accessible experience and continuous improvements aligned with WCAG accessibility principles."
      },
      {
        heading: "Support",
        body: "If you encounter accessibility barriers, contact support so we can provide information through an alternative method."
      }
    ]
  },
  {
    slug: "equal-housing-opportunity",
    title: "Equal Housing Opportunity",
    description: "Equal housing and non-discrimination statement.",
    sections: [
      {
        heading: "Equal Housing Lender",
        body: "We support equal housing opportunity and do not discriminate on prohibited bases under federal, state, or local fair lending laws."
      },
      {
        heading: "Reporting Concerns",
        body: "Borrowers who believe they were treated unfairly may contact us and applicable regulatory agencies to report concerns."
      }
    ]
  },
  {
    slug: "fair-lending-notice",
    title: "Fair Lending Notice",
    description: "Fair lending commitments and borrower rights.",
    sections: [
      {
        heading: "Borrower Protections",
        body: "Our practices are intended to comply with ECOA, Fair Housing Act, and related anti-discrimination requirements."
      },
      {
        heading: "Notice of Action",
        body: "Applicants receive required notices for approvals, denials, counteroffers, or incomplete applications within applicable timelines."
      }
    ]
  },
  {
    slug: "licensing-and-nmls",
    title: "Licensing and NMLS",
    description: "Licensing disclosures and NMLS consumer access information.",
    sections: [
      {
        heading: "License Information",
        body: "Loan originator and company licensing details, including NMLS identifiers, should be listed here and kept current."
      },
      {
        heading: "Consumer Access",
        body: "Consumers can verify licensing information through NMLS Consumer Access and relevant state regulatory agencies."
      }
    ]
  },
  {
    slug: "advertising-disclosure",
    title: "Advertising Disclosure",
    description: "Disclosure for marketing claims, examples, and rate references.",
    sections: [
      {
        heading: "Informational Content",
        body: "Examples and scenarios are illustrative and may not reflect your individual qualification, available rates, or product eligibility."
      },
      {
        heading: "APR and Terms",
        body: "Where applicable, disclosed rates and APR examples should include assumptions, effective dates, and applicable conditions."
      }
    ]
  },
  {
    slug: "sms-and-communication-consent",
    title: "SMS and Communication Consent",
    description: "Terms for text messaging and communication consent.",
    sections: [
      {
        heading: "Consent",
        body: "By opting in, users agree to receive informational texts and calls regarding their inquiry or loan process. Message frequency may vary."
      },
      {
        heading: "Opt-Out",
        body: "Users may opt out by replying STOP to SMS messages. Carrier message and data rates may apply."
      }
    ]
  },
  {
    slug: "do-not-sell-or-share",
    title: "Do Not Sell or Share",
    description: "Consumer privacy rights request notice.",
    sections: [
      {
        heading: "Request Rights",
        body: "Where applicable by law, consumers may request access, deletion, correction, and limits on selling or sharing personal information."
      },
      {
        heading: "Submitting Requests",
        body: "Use the designated contact channels to submit verifiable consumer requests and include enough detail to identify the request scope."
      }
    ]
  }
];

export function getLegalPageBySlug(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}
