import Link from "next/link";
import ArticleCarousel from "@/app/components/ArticleCarousel";
import FaqAccordion from "@/app/components/FaqAccordion";
import LoanProgramsGrid from "@/app/components/LoanProgramsGrid";
import { getAllArticles } from "@/lib/articles";
import { siteConfig, targetLocations } from "@/lib/config";
import { getExperienceReviews } from "@/lib/experienceReviews";
import { getMortgageRatesSnapshot } from "@/lib/mortgageRates";

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

function buildSmoothPath(points: string) {
  if (!points) return "";
  const pairs = points.split(" ").map((pair) => {
    const [xRaw, yRaw] = pair.split(",");
    return { x: Number(xRaw), y: Number(yRaw) };
  });
  if (pairs.length < 2) return "";

  let path = `M ${pairs[0].x} ${pairs[0].y}`;
  for (let i = 1; i < pairs.length; i += 1) {
    const prev = pairs[i - 1];
    const curr = pairs[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    path += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
  }
  const last = pairs[pairs.length - 1];
  path += ` T ${last.x} ${last.y}`;
  return path;
}

function buildRateTicks(minRate: number, maxRate: number) {
  const start = Math.floor(minRate * 10) / 10;
  const end = Math.ceil(maxRate * 10) / 10;
  const ticks: number[] = [];
  for (let value = start; value <= end + 0.0001; value += 0.1) {
    ticks.push(Number(value.toFixed(1)));
  }
  return ticks.length > 1 ? ticks : [start, Number((start + 0.1).toFixed(1))];
}

function formatDisplayDate(value: string) {
  if (!value) return value;
  const usMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!usMatch) return value;

  const month = Number(usMatch[1]);
  const day = Number(usMatch[2]);
  let year = Number(usMatch[3]);
  if (usMatch[3].length === 2) year += 2000;

  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric"
  }).format(d);
}

function formatGraphDate(value: string) {
  if (!value) return value;
  const usMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!usMatch) return value;
  const month = Number(usMatch[1]);
  const yearRaw = usMatch[3];
  const year2 = yearRaw.length === 2 ? yearRaw : yearRaw.slice(-2);
  return `${month}/${year2}`;
}

export default async function HomePage() {
  const articles = getAllArticles();
  const experienceTestimonials = await getExperienceReviews("daniel-opirhory-384903", 10);
  const rateSnapshot = await getMortgageRatesSnapshot();
  const testimonials =
    experienceTestimonials.length > 0 ? experienceTestimonials : fallbackTestimonials;
  const rollingTestimonials = [...testimonials, ...testimonials];
  const current30Fixed = rateSnapshot.products.find((p) => p.key === "30 Yr. Fixed");
  const history30Fixed = (rateSnapshot.historyByProduct["30 Yr. Fixed"] ?? [])
    .filter((point) => point.rate > 0)
    .slice(-124);

  const chartSeries = [...history30Fixed];
  if (current30Fixed && current30Fixed.rate > 0) {
    const last = chartSeries[chartSeries.length - 1];
    if (!last || last.rate !== current30Fixed.rate) {
      chartSeries.push({
        dateLabel: rateSnapshot.updatedLabel ?? "Today",
        isoDate: new Date().toISOString().slice(0, 10),
        rate: current30Fixed.rate,
        change: current30Fixed.change
      });
    }
  }

  const rates = chartSeries.map((point) => point.rate);
  const minRate = rates.length ? Math.min(...rates) : 0;
  const maxRate = rates.length ? Math.max(...rates) : 0.1;
  const xTicks = buildRateTicks(minRate, maxRate);

  const chart = {
    width: 620,
    height: 300,
    marginTop: 14,
    marginRight: 12,
    marginBottom: 36,
    marginLeft: 64
  };
  const plotWidth = chart.width - chart.marginLeft - chart.marginRight;
  const plotHeight = chart.height - chart.marginTop - chart.marginBottom;
  const xMin = xTicks[0];
  const xMax = xTicks[xTicks.length - 1];
  const xRange = xMax - xMin || 0.1;

  const points = chartSeries
    .map((point, index) => {
      const x = chart.marginLeft + (index / Math.max(chartSeries.length - 1, 1)) * plotWidth;
      const y = chart.marginTop + plotHeight - ((point.rate - xMin) / xRange) * plotHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const trendPath = buildSmoothPath(points);

  const timelineMarks = chartSeries.length
    ? [
        { x: chart.marginLeft, label: chartSeries[0].dateLabel },
        {
          x: chart.marginLeft + plotWidth / 2,
          label: chartSeries[Math.floor((chartSeries.length - 1) / 2)].dateLabel
        },
        { x: chart.marginLeft + plotWidth, label: chartSeries[chartSeries.length - 1].dateLabel }
      ]
    : [];

  const leftRateRows = [
    "30 Yr. Fixed",
    "15 Yr. Fixed",
    "30 Yr. FHA",
    "30 Yr. VA"
  ].map((key) => {
    const product = rateSnapshot.products.find((p) => p.key === key);
    return {
      key,
      rate: product?.rate ?? 0,
      change: product?.change ?? 0
    };
  });

  return (
    <>
      <section className="hero">
        <div className="hero-video-wrap" aria-hidden="true">
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
          </div>

          <aside className="hero-panel rate-index-panel">
            <div className="daily-index-shell">
              <div className="daily-index-head">Mortgage Rates : Daily Index</div>
              <div className="daily-index-main">
                <div className="daily-index-left">
                  {leftRateRows.map((row) => (
                    <div key={row.key} className="daily-index-row">
                      <strong>{row.key}</strong>
                      <span>{row.rate > 0 ? `${row.rate.toFixed(2)}%` : "--"}</span>
                      <em className={row.change > 0 ? "is-up" : row.change < 0 ? "is-down" : ""}>
                        {row.rate > 0 ? `${row.change > 0 ? "+" : ""}${row.change.toFixed(2)}%` : "N/A"}
                      </em>
                    </div>
                  ))}
                </div>

                <div className="daily-index-chart-wrap">
                  <svg
                    className="daily-index-chart"
                    width={chart.width}
                    height={chart.height}
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                    role="img"
                    aria-label="30 year fixed rate timeline chart"
                  >
                    {xTicks.map((tick, idx) => {
                      const y = chart.marginTop + plotHeight - ((tick - xMin) / xRange) * plotHeight;
                      const showLabel = idx === 0 || idx === xTicks.length - 1 || idx % 2 === 0;
                      return (
                        <g key={tick}>
                          <line
                            x1={chart.marginLeft}
                            y1={y}
                            x2={chart.marginLeft + plotWidth}
                            y2={y}
                            stroke="rgba(216, 228, 240, 0.2)"
                            strokeWidth="1"
                          />
                          {showLabel ? (
                            <text x={10} y={y + 3} textAnchor="start" className="rate-axis-label">
                              {tick.toFixed(1)}%
                            </text>
                          ) : null}
                        </g>
                      );
                    })}

                    {timelineMarks.map((mark, index) => (
                      <g key={`${mark.label}-${index}`}>
                        <line
                          x1={mark.x}
                          y1={chart.marginTop}
                          x2={mark.x}
                          y2={chart.marginTop + plotHeight}
                          stroke="rgba(216, 228, 240, 0.16)"
                          strokeWidth="1"
                        />
                      <text x={mark.x} y={chart.height - 8} textAnchor="middle" className="rate-axis-label rate-axis-date">
                        {formatGraphDate(mark.label)}
                      </text>
                    </g>
                  ))}

                    {trendPath ? (
                      <path
                        d={trendPath}
                        fill="none"
                        stroke="#e6edf4"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : null}

                    {chartSeries.length ? (
                      <circle
                        cx={chart.marginLeft + plotWidth}
                        cy={
                          chart.marginTop +
                          plotHeight -
                          ((chartSeries[chartSeries.length - 1].rate - xMin) / xRange) * plotHeight
                        }
                        r="3.4"
                        fill="#f4c889"
                      />
                    ) : null}
                  </svg>
                </div>
              </div>
              <div className="daily-index-date">
                Updated {rateSnapshot.fetchedAtEtLabel}
                {rateSnapshot.updatedLabel ? ` | Market Date: ${formatDisplayDate(rateSnapshot.updatedLabel)}` : ""}
                {" | "}
                Source: Mortgage News Daily
              </div>

              <p className="rate-disclaimer">
                Rates are an average lender index and for informational purposes only, not a lock, APR quote, or loan offer.
              </p>
            </div>
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
