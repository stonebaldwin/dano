import Image from "next/image";
import Link from "next/link";
import ArticleCarousel from "@/app/components/ArticleCarousel";
import FaqAccordion from "@/app/components/FaqAccordion";
import LoanApplicationWidget from "@/app/components/LoanApplicationWidget";
import LoanProgramsGrid from "@/app/components/LoanProgramsGrid";
import RateTrendsWidget from "@/app/components/RateTrendsWidget";
import { getAllArticles } from "@/lib/articles";
import { advisorProfile, siteConfig, targetLocations } from "@/lib/config";
import { getExperienceReviews } from "@/lib/experienceReviews";
import { getMortgageRatesSnapshot } from "@/lib/mortgageRates";

export const revalidate = 60 * 60 * 6;

const highIntentPaths = [
  {
    title: "First-Time Homebuyer Loans",
    body: "Guidance on down payment strategy, qualification, and first-purchase readiness.",
    href: "/residential"
  },
  {
    title: "VA Loans",
    body: "Support for eligible service members and veterans navigating VA financing pathways.",
    href: "/residential"
  },
  {
    title: "Refinance Options",
    body: "Rate-and-term and cash-out approaches based on payment and equity objectives.",
    href: "/residential"
  },
  {
    title: "DSCR Loans",
    body: "Investment-focused options designed around rental income and property cash flow.",
    href: "/investment"
  }
];

const loanPrograms = [
  {
    tag: "Conventional",
    title: "Conforming Fixed & ARM",
    description: "Flexible options for strong-credit borrowers seeking competitive long-term terms."
  },
  {
    tag: "Government",
    title: "FHA Loans",
    description: "Accessible qualification paths with low down payment options for primary homes."
  },
  {
    tag: "Veteran",
    title: "VA Loans",
    description: "Benefit-focused financing for eligible military borrowers and veterans."
  },
  {
    tag: "Rural",
    title: "USDA Loans",
    description: "Zero-down opportunities in qualifying areas for eligible borrowers."
  },
  {
    tag: "Jumbo",
    title: "Jumbo Financing",
    description: "Loan structures for higher-value purchases above conforming limits."
  },
  {
    tag: "Investor",
    title: "DSCR Investor Loans",
    description: "Cash-flow-focused financing for rental and portfolio investment properties."
  },
  {
    tag: "Commercial",
    title: "Owner-Occupied Commercial",
    description: "Lending support for businesses purchasing or refinancing occupied properties."
  },
  {
    tag: "Bridge",
    title: "Bridge Loan Options",
    description: "Short-term transitional financing when timing between transactions matters."
  }
];

const fallbackTestimonials = [
  {
    quote:
      "Dan made the financing process clear from day one. We knew exactly what to expect at each stage and closed on schedule.",
    name: "Sarah M.",
    detail: "Homebuyer in Wilmington",
    rating: 5
  },
  {
    quote:
      "We were comparing refinance options and Dan walked us through tradeoffs with real numbers, not sales pressure.",
    name: "Jason R.",
    detail: "Refinance client in Raleigh",
    rating: 5
  },
  {
    quote:
      "As an investor, I value speed and communication. Dan's team delivered both and kept every detail organized.",
    name: "Monica T.",
    detail: "Investor in Southern Pines",
    rating: 5
  }
];

const faqs = [
  {
    question: "How long does mortgage pre-approval take in North Carolina?",
    answer:
      "Most pre-approvals can be completed quickly once documents are submitted, and timing depends on income complexity and responsiveness."
  },
  {
    question: "What credit score is needed for a first-time homebuyer loan?",
    answer:
      "Program requirements vary by loan type; Dan reviews score, debt profile, and reserves to identify the most realistic loan path."
  },
  {
    question: "Can I use a VA loan more than once?",
    answer:
      "Yes, many eligible borrowers can reuse VA entitlement depending on prior usage and current entitlement status."
  },
  {
    question: "When does refinancing make sense for homeowners?",
    answer:
      "Refinancing may make sense when payment goals, term strategy, or equity access benefits outweigh total transaction costs."
  },
  {
    question: "How does a DSCR loan work for rental property financing?",
    answer:
      "DSCR loans focus heavily on property cash flow and may require less reliance on personal income documentation."
  }
];

function socialIcon(label: string) {
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 8H16V5h-2.5C10.9 5 9 6.9 9 9.5V12H7v3h2v6h3v-6h3l.5-3H12V9.5c0-.9.6-1.5 1.5-1.5z" fill="currentColor" />
      </svg>
    );
  }
  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.2 8.7a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8zM4.7 10h3v9h-3v-9zm5 0h2.8v1.3h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5V19h-3v-4c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-3v-9z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9zm9.8 1.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="currentColor" />
    </svg>
  );
}

export default async function HomePage() {
  const advisorPhoneDial = advisorProfile.phone.replace(/\D/g, "");
  const articles = getAllArticles();
  const experienceTestimonials = await getExperienceReviews("daniel-opirhory-384903", 10);
  const rateSnapshot = await getMortgageRatesSnapshot();
  const testimonials =
    experienceTestimonials.length > 0 ? experienceTestimonials : fallbackTestimonials;
  const rollingTestimonials = [...testimonials, ...testimonials];
  const trendSeriesSeed: Array<{
    key: (typeof rateSnapshot.products)[number]["key"];
    color: string;
  }> = [
    { key: "30 Yr. Fixed", color: "#23b6f2" },
    { key: "15 Yr. Fixed", color: "#50BFE4" },
    { key: "30 Yr. FHA", color: "#D8743D" },
    { key: "30 Yr. VA", color: "#F2C45C" }
  ];
  const trendLabelByKey: Partial<Record<(typeof rateSnapshot.products)[number]["key"], string>> = {
    "30 Yr. Fixed": "30 yr Conforming",
    "15 Yr. Fixed": "15 yr Conforming",
    "30 Yr. FHA": "FHA",
    "30 Yr. VA": "VA"
  };

  const trendSeries = trendSeriesSeed
    .map((entry) => {
      const product = rateSnapshot.products.find((item) => item.key === entry.key);
      const currentRate = product?.rate ?? 0;
      const currentChange = product?.change ?? 0;
      const todayIso = new Date().toISOString().slice(0, 10);
      const points = (rateSnapshot.historyByProduct[entry.key] ?? [])
        .filter((point) => point.rate > 0)
        .map((point) => ({
          isoDate: point.isoDate,
          rate: point.rate
        }));

      if (currentRate > 0) {
        const latest = points[points.length - 1];
        if (!latest || latest.isoDate !== todayIso || latest.rate !== currentRate) {
          points.push({
            isoDate: todayIso,
            rate: currentRate
          });
        }
      }

      return {
        key: entry.key,
        label: trendLabelByKey[entry.key] ?? entry.key,
        color: entry.color,
        currentRate,
        currentChange,
        points
      };
    })
    .filter((entry) => entry.points.length >= 2);
  const conventionalSeries = trendSeries.find((entry) => entry.key === "30 Yr. Fixed");
  const latestRate = conventionalSeries?.currentRate ?? 0;
  const latestChange = conventionalSeries?.currentChange ?? 0;

  return (
    <>
      <section className="hero">
        <div className="hero-video-wrap" aria-hidden="true">
          <div className="hero-overlay" />
        </div>
        <div className="container hero-grid">
          <div className="hero-main">
            <div className="headshot-wrap">
              <Image
                src={advisorProfile.headshotPath}
                alt={advisorProfile.name}
                width={140}
                height={140}
                className="headshot-photo"
                priority
              />
            </div>
            <div className="kicker">{advisorProfile.title}</div>
            <h2>{advisorProfile.name}</h2>
            <p>
              Contact: <a href={`tel:${advisorPhoneDial}`}>{advisorProfile.phone}</a> |{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
            <p>{advisorProfile.serving}</p>
            <p>
              <a className="brand-rating" href={advisorProfile.ratingUrl} target="_blank" rel="noreferrer">
                {advisorProfile.ratingLabel.replace(/\s*\(Read Reviews\)/i, "")}
              </a>
            </p>
            <div className="brand-socials" aria-label="Social media links">
              {advisorProfile.socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                  {socialIcon(social.label)}
                </a>
              ))}
            </div>
          </div>

          <aside className="hero-panel rate-chart-card">
            <h2 className="rate-chart-title">30 Year Conforming Rate</h2>
            <div className="rate-chart-current">
              <strong>{latestRate.toFixed(3)}%</strong>
              <em className={latestChange > 0 ? "is-up" : latestChange < 0 ? "is-down" : ""}>
                {latestChange > 0 ? "+" : ""}
                {latestChange.toFixed(3)}%
              </em>
            </div>
            <RateTrendsWidget
              series={trendSeries}
              updatedLabel={rateSnapshot.updatedLabel}
              fetchedAtEtLabel={rateSnapshot.fetchedAtEtLabel}
            />
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Start with the Right Loan Path</h2>
          </div>
          <div className="grid-4">
            {highIntentPaths.map((path) => (
              <Link key={path.title} className="card" href={path.href}>
                <h3>{path.title}</h3>
                <p>{path.body}</p>
                <span className="link-arrow">Explore</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tone">
        <div className="container authority-grid">
          <article className="card authority-main">
            <div className="kicker">Why Work With Dan?</div>
            <h2>Local market knowledge backed by disciplined mortgage execution.</h2>
            <p>
              Dan combines hometown market familiarity with a process-oriented approach
              that keeps borrowers informed, prepared, and positioned to close.
            </p>
            <div className="authority-metrics">
              <div>
                <div className="stat-value">500+</div>
                <div className="stat-label">Loans Guided (Placeholder)</div>
              </div>
              <div>
                <div className="stat-value">4.9</div>
                <div className="stat-label">Average Client Rating</div>
              </div>
              <div>
                <div className="stat-value">4 States</div>
                <div className="stat-label">Licensed Coverage</div>
              </div>
            </div>
          </article>
          <div className="authority-side">
            <article className="card card-soft">
              <h3>High-Context Advice</h3>
              <p>
                Strategic recommendations tailored to your timeline, property type,
                and long-term financial goals.
              </p>
            </article>
            <article className="card card-soft">
              <h3>Fast, Transparent Communication</h3>
              <p>
                Clear milestones and proactive updates so you always know what is
                happening next.
              </p>
            </article>
            <article className="card card-soft">
              <h3>Execution You Can Trust</h3>
              <p>
                Process rigor from pre-approval to close, reducing surprises and
                helping transactions stay on track.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Markets Dan Knows Best</h2>
            <Link className="link-arrow" href="/locations/wilmington-nc">
              View All Markets
            </Link>
          </div>
          <div className="grid-3">
            {targetLocations.map((location) => (
              <Link key={location.slug} className="card card-soft" href={`/locations/${location.slug}`}>
                <span className="badge">{location.city}</span>
                <h3>{location.title}</h3>
                <p>{location.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tone">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Loan Programs Overview</h2>
          </div>
          <LoanProgramsGrid programs={loanPrograms} initialVisible={4} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Recent Articles</h2>
            <Link className="link-arrow" href="/blog/articles">
              View All Articles
            </Link>
          </div>
          <ArticleCarousel articles={articles} />
        </div>
      </section>

      <section className="section section-tone">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">What Clients Are Saying</h2>
            <a
              className="link-arrow"
              href="https://www.experience.com/reviews/daniel-opirhory-384903"
              target="_blank"
              rel="noreferrer"
            >
              View All Reviews
            </a>
          </div>
          <div className="reviews-marquee" aria-label="Customer reviews from Experience.com">
            <div className="reviews-track">
              {rollingTestimonials.map((item, index) => (
                <article key={`${item.name}-${index}`} className="card testimonial-card rolling-testimonial">
                  <div className="review-stars" aria-hidden="true">
                    {"\u2605".repeat(item.rating)}
                  </div>
                  <p className="testimonial-quote">"{item.quote}"</p>
                  <strong>{item.name}</strong>
                  <p className="muted-meta">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <article className="card">
            <div className="kicker">Request Guidance</div>
            <h2>Let&apos;s discuss your mortgage goals.</h2>
            <form className="contact-form">
              <label>
                Full Name
                <input type="text" name="name" placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" />
              </label>
              <label>
                Phone
                <input type="tel" name="phone" placeholder="(910) 555-0148" />
              </label>
              <label>
                What are you looking for?
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Buying, refinancing, investment, or general questions"
                />
              </label>
              <button type="submit" className="apply-btn">
                Submit Request
              </button>
            </form>
          </article>

          <article className="card card-soft">
            <div className="kicker">Simple Process</div>
            <h2>What type of loan are you looking for?</h2>
            <LoanApplicationWidget />
          </article>
        </div>
      </section>

      <section className="section section-tone">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Mortgage FAQ</h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="card final-cta">
            <h2>Ready to Take the Next Step Toward Homeownership?</h2>
            <p>
              Get pre-approved today and move forward with confidence.
            </p>
            <div className="cta-row">
              <a className="apply-btn" href={siteConfig.defaultApplyNowUrl} target="_blank" rel="noreferrer">
                Apply Now
              </a>
              <a className="ghost-btn" href="https://calendly.com/dopirhory-alcova/30min" target="_blank" rel="noreferrer">
                Schedule a Call
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
