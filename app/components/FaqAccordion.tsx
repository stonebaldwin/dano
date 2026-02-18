"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <article key={item.question} className="faq-item card">
            <button
              type="button"
              className="faq-question"
              onClick={() => setActiveIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className="faq-icon">{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
