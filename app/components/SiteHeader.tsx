"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/navigation";

type SiteHeaderProps = {
  items: NavItem[];
};

export default function SiteHeader({ items }: SiteHeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav className="nav" aria-label="Main navigation" ref={navRef}>
      {items.map((item) => {
        const isOpen = openMenu === item.label;

        return (
          <div key={item.label} className={`has-mega ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="menu-link menu-trigger"
              aria-expanded={isOpen}
              aria-controls={`mega-${item.label.toLowerCase()}`}
              onClick={() => setOpenMenu(isOpen ? null : item.label)}
            >
              {item.label}
            </button>
            <div
              id={`mega-${item.label.toLowerCase()}`}
              className="mega-menu"
              role="group"
              aria-label={`${item.label} submenu`}
            >
              <div className="container mega-inner">
                <div className="mega-primary">
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                  <Link className="link-arrow" href={item.href} onClick={() => setOpenMenu(null)}>
                    View {item.label}
                  </Link>
                </div>
                <div className="mega-secondary">
                  <h4>Popular Topics</h4>
                  <ul>
                    {item.sublinks.map((sub) => (
                      <li key={sub.label}>
                        <Link href={sub.href} onClick={() => setOpenMenu(null)}>
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
