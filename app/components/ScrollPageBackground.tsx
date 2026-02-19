"use client";

import { useEffect, useMemo, useState } from "react";

const PAGE_IMAGES = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=2400&q=80"
];

function layerOpacity(index: number, progress: number) {
  const base = Math.floor(progress);
  const frac = progress - base;
  if (index === base) return 1 - frac;
  if (index === base + 1) return frac;
  return 0;
}

export default function ScrollPageBackground() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const maxStep = PAGE_IMAGES.length - 1;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollable = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        const normalized = Math.max(0, Math.min(window.scrollY / scrollable, 1));
        setProgress(normalized * maxStep);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const opacities = useMemo(
    () => PAGE_IMAGES.map((_, idx) => layerOpacity(idx, progress)),
    [progress]
  );

  return (
    <div className="page-bg-stack" aria-hidden="true">
      {PAGE_IMAGES.map((src, index) => (
        <div
          key={src}
          className="page-bg-layer"
          style={{ opacity: opacities[index], backgroundImage: `url("${src}")` }}
        />
      ))}
      <div className="page-bg-overlay" />
    </div>
  );
}
