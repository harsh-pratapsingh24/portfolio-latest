"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
    if (currentTheme) {
      setTheme(currentTheme);
    } else {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        // ignore
      }
      const initial = stored === "light" ? "light" : "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: { theme: nextTheme } }));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {mounted && theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
      </span>
      <span className="theme-toggle-label">{mounted ? (theme === "dark" ? "LIGHT" : "DARK") : "THEME"}</span>
    </button>
  );
}
