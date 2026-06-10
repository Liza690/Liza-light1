"use client";

import { useEffect, useRef } from "react";

const tiers = [
  {
    plan: "Silver Tier",
    price: "500",
    duration: "Standard Booking",
    featured: false,
    perks: [
      "100% Verified Companions",
      "Fine Dining Accompaniment",
      "Chauffeur Arrival & Departure",
      "In-Call & Out-Call Bookings",
    ],
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8M12 11v11M6 2h12l-2 9a5 5 0 0 1-10 0L6 2z" />
      </svg>
    ),
  },
  {
    plan: "Gold Tier",
    price: "1,500",
    duration: "Premium Experience",
    featured: true,
    perks: [
      "Elite Roster Selection",
      "Priority Booking & Concierge",
      "Custom Travel Services",
      "Five-Star Suite Visitation",
      "Complimentary VIP Support",
    ],
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    plan: "Platinum Tier",
    price: "4,000",
    duration: "Executive Booking",
    featured: false,
    perks: [
      "Ultra-Exclusive Portfolios",
      "Full Travel & Overnight Support",
      "Dedicated Personal Liaison",
      "Ultimate Discretion Guarantee",
      "Executive Concierge Line",
    ],
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      </svg>
    ),
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} style={{ background: "#100818", textAlign: "center", padding: "100px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ content: "''", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "'Cormorant Garamond', serif", fontSize: "18vw", fontWeight: 300, fontStyle: "italic", color: "rgba(124,58,237,0.06)", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: "-0.04em", userSelect: "none", zIndex: 0 }}>
        DESIRE
      </div>

      <div className="section-header reveal" style={{ marginBottom: "70px", position: "relative", zIndex: 1 }}>
        <p className="section-label" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "6px", fontWeight: 500 }}>Indulgence, Priced Honestly</p>
        <h2 className="section-title" style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", fontSize: "2rem", lineHeight: 1.2, marginBottom: "10px", color: "#fff" }}>
          Choose Your <em>Evening</em>
        </h2>
        <div className="divider" style={{ width: "40px", height: "2px", background: "rgba(167,139,250,0.4)", margin: "12px auto 24px" }} />
        <p className="section-sub" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto" }}>
          The best things in life aren&apos;t free — they&apos;re worth every rupee. Pick your pleasure.
        </p>
      </div>

      <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", maxWidth: "1000px", margin: "0 auto", alignItems: "stretch", position: "relative", zIndex: 1 }}>
        {tiers.map((tier, i) => (
          <div
            key={tier.plan}
            className={`pricing-card ${tier.featured ? "featured" : ""} reveal`}
            style={{
              background: "#1A0F2E",
              border: tier.featured ? "1px solid var(--accent)" : "1px solid rgba(124,58,237,0.2)",
              borderTop: tier.featured ? "3px solid var(--accent)" : "1px solid rgba(124,58,237,0.2)",
              borderRadius: "6px",
              padding: "36px 32px 32px",
              textAlign: "left",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              boxShadow: tier.featured ? "0 0 0 1px rgba(124,58,237,0.4), 0 20px 60px rgba(124,58,237,0.25)" : "none",
              transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
            }}
          >
            {tier.featured && (
              <div className="pc-badge" style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", background: "var(--accent)", color: "#fff", padding: "5px 18px", borderRadius: "2px", whiteSpace: "nowrap" }}>
                Most Popular
              </div>
            )}

            <span className="plan" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "18px", display: "block" }}>
              {tier.plan}
            </span>

            <div className="pc-icon" style={{ marginBottom: "20px", display: "block", lineHeight: 1 }}>
              {tier.icon}
            </div>

            <p className="price" style={{ fontFamily: "'Jost', sans-serif", fontSize: "3.2rem", fontWeight: 800, lineHeight: 1, color: "#fff", marginBottom: "4px", display: "flex", alignItems: "baseline", gap: "4px" }}>
              <sup style={{ fontSize: "1.4rem", fontWeight: 600, verticalAlign: "baseline" }}>₹</sup>
              {tier.price}
              <sub style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(255,255,255,0.4)", verticalAlign: "baseline", marginLeft: "2px" }}>/ hr</sub>
            </p>

            <p className="duration" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 400, color: "rgba(255,255,255,0.3)", marginBottom: "28px" }}>
              {tier.duration}
            </p>

            <div className="pc-line" style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "24px" }} />

            <ul className="perks" style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              {tier.perks.map((perk) => (
                <li key={perk} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: tier.featured ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                  {perk}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="pc-btn"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                display: "block",
                width: "100%",
                padding: "16px",
                textAlign: "center",
                textDecoration: "none",
                background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                marginTop: "auto",
                boxShadow: tier.featured
                  ? "0 8px 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "0 6px 22px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)";
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 12px 36px rgba(124,58,237,0.6), inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)";
                el.style.transform = "none";
                el.style.boxShadow = tier.featured
                  ? "0 8px 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "0 6px 22px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
              }}
            >
              Select Tier
            </a>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pricing-card:hover {
          border-color: rgba(124,58,237,0.5) !important;
          transform: translateY(-4px);
          box-shadow: 0 16px 50px rgba(124,58,237,0.18);
        }
        .pricing-card.featured:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 0 1px rgba(124,58,237,0.6), 0 28px 70px rgba(124,58,237,0.35);
        }
        .perks li::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--accent);
        }
        .pricing-card.featured .perks li::before {
          background: var(--gold);
        }
        .pc-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.5s ease;
        }
        .pc-btn:hover::after { left: 100%; }
        @media (max-width: 1000px) {
          .pricing-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 800px) {
          .pricing-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </section>
  );
}
