"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const creditScoreOptions = [
  "Excellent (Above 720)",
  "Good (680-719)",
  "Fair (620-679)",
  "Needs improvement (under 620)"
];

const propertyUseOptions = ["Primary residence", "Second home", "Investment property"];

const preferenceOptions = ["Lower payment", "Lower down payment"];

export default function CustomRatesExperience() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [showContactStep, setShowContactStep] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const scenarioFormRef = useRef<HTMLFormElement | null>(null);
  const contactFormRef = useRef<HTMLFormElement | null>(null);
  const formCardRef = useRef<HTMLElement | null>(null);

  const handleSeeRates = () => {
    setIsHighlighted(true);
    firstInputRef.current?.focus();
  };

  useEffect(() => {
    if (!isHighlighted) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!formCardRef.current) return;
      const target = event.target as Node;
      if (!formCardRef.current.contains(target)) {
        setIsHighlighted(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isHighlighted]);

  const handleGetStarted = () => {
    if (!scenarioFormRef.current) return;
    if (!scenarioFormRef.current.reportValidity()) return;
    setShowContactStep(true);
  };

  const handleFinalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactFormRef.current) return;
    if (!contactFormRef.current.reportValidity()) return;
  };

  return (
    <>
      {isHighlighted ? <div className="custom-rates-page-dim" aria-hidden="true" /> : null}
      <div className="custom-rates-grid">
      <article ref={formCardRef} className={`card custom-rates-form-card ${isHighlighted ? "is-highlighted" : ""}`}>
        {!showContactStep ? (
          <>
            <h2>Get your custom rates</h2>
            <p className="custom-rates-intro">Enter homebuying scenario</p>
            <form ref={scenarioFormRef} className="custom-rates-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Property value
                <input ref={firstInputRef} type="text" name="propertyValue" placeholder="$450,000" required />
              </label>
              <label>
                Down payment
                <input type="text" name="downPayment" placeholder="$45,000" required />
              </label>
              <label>
                ZIP code
                <input type="text" name="zipCode" placeholder="28403" required />
              </label>
              <label>
                Credit score
                <select name="creditScore" defaultValue="" required>
                  <option value="" disabled>
                    Select credit score
                  </option>
                  {creditScoreOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Property use
                <select name="propertyUse" defaultValue="" required>
                  <option value="" disabled>
                    Select property use
                  </option>
                  {propertyUseOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Preference
                <select name="preference" defaultValue="" required>
                  <option value="" disabled>
                    Select preference
                  </option>
                  {preferenceOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="custom-rates-check">
                <input type="checkbox" name="isVeteranOrMilitary" />
                I am a Veteran or in the military
              </label>
              <button
                type="button"
                className="apply-btn custom-rates-submit"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>See your rates</h2>
            <form ref={contactFormRef} className="custom-rates-form" onSubmit={handleFinalSubmit}>
              <label>
                First Name
                <input type="text" name="firstName" required />
              </label>
              <label>
                Last Name
                <input type="text" name="lastName" required />
              </label>
              <label>
                Email Address
                <input type="email" name="emailAddress" required />
              </label>
              <label>
                Phone Number
                <input type="tel" name="phoneNumber" required />
              </label>
              <label>
                Property state
                <select name="propertyState" defaultValue="" required>
                  <option value="" disabled>
                    Select property state
                  </option>
                  <option>Alabama</option>
                  <option>Alaska</option>
                  <option>Arizona</option>
                  <option>Arkansas</option>
                  <option>California</option>
                  <option>Colorado</option>
                  <option>Connecticut</option>
                  <option>Delaware</option>
                  <option>Florida</option>
                  <option>Georgia</option>
                  <option>Hawaii</option>
                  <option>Idaho</option>
                  <option>Illinois</option>
                  <option>Indiana</option>
                  <option>Iowa</option>
                  <option>Kansas</option>
                  <option>Kentucky</option>
                  <option>Louisiana</option>
                  <option>Maine</option>
                  <option>Maryland</option>
                  <option>Massachusetts</option>
                  <option>Michigan</option>
                  <option>Minnesota</option>
                  <option>Mississippi</option>
                  <option>Missouri</option>
                  <option>Montana</option>
                  <option>Nebraska</option>
                  <option>Nevada</option>
                  <option>New Hampshire</option>
                  <option>New Jersey</option>
                  <option>New Mexico</option>
                  <option>New York</option>
                  <option>North Carolina</option>
                  <option>North Dakota</option>
                  <option>Ohio</option>
                  <option>Oklahoma</option>
                  <option>Oregon</option>
                  <option>Pennsylvania</option>
                  <option>Rhode Island</option>
                  <option>South Carolina</option>
                  <option>South Dakota</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Utah</option>
                  <option>Vermont</option>
                  <option>Virginia</option>
                  <option>Washington</option>
                  <option>West Virginia</option>
                  <option>Wisconsin</option>
                  <option>Wyoming</option>
                </select>
              </label>
              <label className="custom-rates-check custom-rates-consent">
                <input type="checkbox" name="communicationsConsent" required />
                <span>
                  I confirm that I have read and agree to the{" "}
                  <a href="/legal/sms-and-communication-consent" target="_blank" rel="noreferrer">
                    Communications Consent
                  </a>
                </span>
              </label>
              <button type="submit" className="apply-btn custom-rates-submit">
                See my rates
              </button>
            </form>
          </>
        )}
      </article>

      <article className="card custom-rates-preview-card">
        <div className="custom-rates-preview-content" aria-hidden="true">
          <div className="preview-head">
            <strong>Live Pricing Snapshot</strong>
            <span>Updated 2 mins ago</span>
          </div>
          <div className="preview-rate-grid">
            <div><span>30 Yr Fixed</span><strong>6.125%</strong><em>-0.021%</em></div>
            <div><span>15 Yr Fixed</span><strong>5.676%</strong><em>-0.018%</em></div>
            <div><span>FHA 30 Yr</span><strong>5.982%</strong><em>+0.012%</em></div>
            <div><span>VA 30 Yr</span><strong>5.741%</strong><em>-0.007%</em></div>
          </div>
          <div className="preview-costs">
            <p>Estimated Closing Costs</p>
            <p>Discount Points</p>
            <p>Lender Credits</p>
            <p>Monthly Payment Range</p>
          </div>
        </div>
        <div className="custom-rates-preview-blur" aria-hidden="true" />
        <button type="button" className="apply-btn custom-rates-cta" onClick={handleSeeRates}>
          See my rates
        </button>
      </article>
      </div>
    </>
  );
}
