"use client";

import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { personal } from "@/data/portfolio";
import { ThemeToggle } from "./ThemeToggle";

const links = ["About", "Experience", "Projects", "Skills", "Contact"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const close = () => setOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sectionIds = links.map((l) => l.toLowerCase());
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="nav-wrap">
      <nav className="nav">
        <a href="#top" className="brand" onClick={close}>
          <b>HPS</b>
          <span>Harsh Pratap Singh</span>
        </a>

        <div className={open ? "nav-links open" : "nav-links"}>
          {links.map((link) => {
            const id = link.toLowerCase();
            const isActive = activeSection === id;
            return (
              <a
                key={link}
                href={`#${id}`}
                onClick={close}
                className={isActive ? "active" : ""}
              >
                {link}
              </a>
            );
          })}
          <a
            className="nav-resume"
            href={personal.resume || "#contact"}
            download={Boolean(personal.resume)}
            onClick={close}
          >
            Download resume <ArrowUpRight size={14} />
          </a>
          <div className="nav-toggle-wrap mobile-only">
            <ThemeToggle />
          </div>
        </div>

        <div className="nav-actions">
          <div className="nav-toggle-wrap desktop-only">
            <ThemeToggle />
          </div>
          <button
            className="menu"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
}
