"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Slide = {
  key: string;
  label: string;
  valueLabel: string;
  changeLabel: string;
  changeDirection: "up" | "down" | "flat";
  points: number[];
  href: string;
};

function buildSparklinePoints(values: number[], width: number, height: number) {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

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

type Props = {
  slides: Slide[];
};

export default function UtilityRatesCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 6300);
    return () => window.clearInterval(timer);
  }, [count]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  if (count === 0) return null;

  return (
    <div className="utility-rate-carousel" aria-label="Market rate carousel">
      <div className="utility-rate-viewport">
        <div
          className="utility-rate-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => {
            const sparkPoints = buildSparklinePoints(slide.points, 110, 28);
            const smoothPath = buildSmoothPath(sparkPoints);
            return (
              <div key={slide.key} className="utility-rate-slide">
                <Link href={slide.href} className="utility-rate-link" aria-label={`View ${slide.label}`}>
                  <span className="utility-rate-meta">
                    <strong>{slide.label} {slide.valueLabel}</strong>
                    <em
                      className={
                        slide.changeDirection === "up"
                          ? "is-up"
                          : slide.changeDirection === "down"
                            ? "is-down"
                            : ""
                      }
                    >
                      {slide.changeLabel}
                    </em>
                  </span>
                  <svg
                    className="utility-rate-spark"
                    width="110"
                    height="28"
                    viewBox="0 0 110 28"
                    role="img"
                  aria-label={`${slide.label} trend`}
                >
                    {smoothPath ? (
                      <path
                        d={smoothPath}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <line x1="0" y1="14" x2="110" y2="14" stroke="currentColor" strokeWidth="1.5" />
                    )}
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 ? (
        <div className="utility-rate-dots" aria-hidden="true">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.key}
              type="button"
              className={`utility-rate-dot ${dotIndex === index ? "is-active" : ""}`}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
