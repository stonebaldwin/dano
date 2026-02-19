import Link from "next/link";
import ArticleCarousel from "@/app/components/ArticleCarousel";
import FaqAccordion from "@/app/components/FaqAccordion";
import LoanProgramsGrid from "@/app/components/LoanProgramsGrid";
import { getAllArticles } from "@/lib/articles";
import { siteConfig, targetLocations } from "@/lib/config";
import { getExperienceReviews } from "@/lib/experienceReviews";

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

export default async function HomePage() {
  const articles = getAllArticles();
  const experienceTestimonials = await getExperienceReviews("daniel-opirhory-384903", 10);
  const testimonials =
    experienceTestimonials.length > 0 ? experienceTestimonials : fallbackTestimonials;
  const rollingTestimonials = [...testimonials, ...testimonials];

  return (
    <>
      <section className="hero">
        <div className="hero-video-wrap" aria-hidden="true">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-suburban-houses-and-neighborhood-1579/1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-overlay" />
        </div>
        <div className="container hero-grid">
          <div className="hero-main">
            <div className="kicker">Wilmington, NC Mortgage Advisor</div>
            <h1>Local mortgage expertise with clear guidance from first call to closing.</h1>
            <p>
              Serving Wilmington and surrounding markets with strategy-driven lending
              support for residential, refinance, investment, and commercial borrowers.
            </p>
            <div className="cta-row">
              <a className="apply-btn" href={siteConfig.defaultApplyNowUrl} target="_blank" rel="noreferrer">
                Apply Now
              </a>
              <a className="ghost-btn" href="https://calendly.com/dopirhory-alcova/30min" target="_blank" rel="noreferrer">
                Schedule a Call
              </a>
            </div>
            <div className="trust-strip">
              <span className="trust-pill">NMLS ID# 2619871</span>
              <span className="trust-pill">Licensed in NC, TX, TN, GA</span>
              <span className="trust-pill">4.9/5 Customer Rating</span>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="kicker">Trust Indicators</div>
            <h2>Expertise built for confident decisions.</h2>
            <ul className="list-clean">
              <li>Local insight across coastal and growth-market neighborhoods</li>
              <li>Clear guidance on conventional, VA, FHA, USDA, and investor paths</li>
              <li>Consistent communication through underwriting and close</li>
            </ul>
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
                    {"★".repeat(item.rating)}
                  </div>
                  <p className="testimonial-quote">"{item.quote}"</p>
                  <strong>{item.name}</strong>
                  <p className="muted-meta">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <p className="muted-meta">
            Live reviews from Experience.com. Hover to pause scrolling.
          </p>
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
            <h2>Move forward with less stress.</h2>
            <ol className="process-list">
              <li>
                <strong>Apply Online</strong>
                <p>Complete a secure application and share key financial details.</p>
              </li>
              <li>
                <strong>Get Pre-Approved</strong>
                <p>Review your options, payment strategy, and ideal loan structure.</p>
              </li>
              <li>
                <strong>Close with Confidence</strong>
                <p>Execute with clear communication through underwriting and closing.</p>
              </li>
            </ol>
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
