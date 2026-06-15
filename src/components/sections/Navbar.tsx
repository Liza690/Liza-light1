"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Models", href: "/providers" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={scrolled ? "scrolled" : ""}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scrolled ? "12px 60px" : "18px 60px",
        background: "var(--accent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        transition: "padding 0.3s, box-shadow 0.3s",
        boxShadow: scrolled ? "0 2px 30px rgba(124,58,237,0.25)" : "none",
      }}
    >
      <a href="/" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem", color: "var(--white)", letterSpacing: "0.08em" }}>
        Bengal Beauties
      </a>

      <ul
        style={{
          gap: "36px",
          listStyle: "none",
          alignItems: "center",
        }}
        className={menuOpen ? "nav-links open" : "nav-links"}
      >
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                transition: "color 0.2s",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--accent)",
          background: "var(--white)",
          padding: "11px 26px",
          fontWeight: 700,
          borderRadius: "50px",
          border: "2px solid transparent",
          boxShadow: "0 4px 18px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
          transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
          overflow: "hidden",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = "transparent";
          el.style.color = "var(--white)";
          el.style.borderColor = "var(--white)";
          el.style.boxShadow = "0 6px 28px rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.2)";
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = "var(--white)";
          el.style.color = "var(--accent)";
          el.style.borderColor = "transparent";
          el.style.boxShadow = "0 4px 18px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.8)";
          el.style.transform = "none";
        }}
      >
        Book Now
      </a>

      <button
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--white)",
          fontSize: "1.5rem",
        }}
        className="mobile-toggle"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <style jsx>{`
        .nav-links {
          display: flex;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        @media (max-width: 800px) {
          nav :global(a[href="#contact"]) { display: none; }
          .nav-links {
            display: none;
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            flex-direction: column;
            background: var(--accent);
            padding: 20px 30px;
            gap: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            transform: none;
          }
          .nav-links.open {
            display: flex;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
