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
        const hasDropdown = item.sublinks.length > 0;
        const isExternal = /^https?:\/\//i.test(item.href);

        return (
          <div key={item.label} className={`has-mega ${isOpen ? "is-open" : ""}`}>
            {hasDropdown ? (
              <>
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
                    </div>
                    <div className="mega-secondary">
                      <ul>
                        {item.sublinks.map((sub) => (
                          <li key={sub.label} className={sub.children?.length ? "mega-subgroup" : ""}>
                            <Link href={sub.href} onClick={() => setOpenMenu(null)}>
                              {sub.label}
                            </Link>
                            {sub.children?.length ? (
                              <ul className="mega-tertiary">
                                {sub.children.map((child) => (
                                  <li key={`${sub.label}-${child.label}`}>
                                    <Link href={child.href} onClick={() => setOpenMenu(null)}>
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {isExternal ? (
                  <a
                    className="menu-link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link className="menu-link" href={item.href} onClick={() => setOpenMenu(null)}>
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
