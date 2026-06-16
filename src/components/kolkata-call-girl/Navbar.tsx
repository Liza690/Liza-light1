"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Models", href: "/providers" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const scrollTo = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleNav = (link: typeof navLinks[0]) => {
    if (link.href.startsWith("#")) {
      scrollTo(link.href.slice(1));
    } else {
      setOpen(false);
      router.push(link.href);
    }
  };

  return (
    <>
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

        <div className="nav-right">
          <ul className="nav-links">
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
                  onClick={(e) => { e.preventDefault(); handleNav(link); }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="desktop-book-btn"
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
            className={`nav-hamburger${open ? " open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setOpen((p) => !p)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-drawer${open ? " open" : ""}`}>
        <ul className="mobile-nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => { e.preventDefault(); handleNav(link); }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-drawer-cta">
          <a
            className="drawer-book-btn"
            href="#companions"
            onClick={(e) => { e.preventDefault(); scrollTo("companions"); }}
          >
            Book Now
          </a>
        </div>
      </div>

      <style jsx>{`
        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
          align-items: center;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 38px;
          height: 38px;
          gap: 5px;
          cursor: pointer;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          padding: 0;
          transition: border-color 0.2s;
        }
        .nav-hamburger:hover { border-color: var(--white); }
        .nav-hamburger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background: rgba(255,255,255,0.85);
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        @media (max-width: 800px) {
          .desktop-book-btn { display: none; }
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>
    </>
  );
}
