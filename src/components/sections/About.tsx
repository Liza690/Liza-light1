"use client";

import { useEffect, useRef } from "react";

export default function About() {
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
    <section id="about" ref={sectionRef} style={{ background: "var(--white)", padding: "80px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="about-inner" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "64px", alignItems: "center", maxWidth: "1060px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="about-visual reveal" style={{ position: "relative" }}>
          <img className="model-nobg" src="/images/aboutModel1.webp" alt="Bengal Beauties" style={{ width: "100%", height: "360px", objectFit: "cover", objectPosition: "top", borderRadius: "20px", display: "block", boxShadow: "0 16px 50px rgba(124,58,237,0.15)" }} />
          <img className="accent" src="/images/aboutModel2.webp" alt="Bengal Beauties" style={{ position: "absolute", bottom: "-16px", right: "-16px", width: "90px", height: "110px", objectFit: "cover", objectPosition: "top", borderRadius: "14px", border: "4px solid var(--white)", zIndex: 3, boxShadow: "0 8px 24px rgba(13,4,6,0.12)" }} />
        </div>

        <div className="about-text reveal" style={{ display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <p className="section-label" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "6px", fontWeight: 700 }}>
            Premium Escort Service · 100% Genuine · Verified Girls
          </p>
          <h2 className="about-heading" style={{ fontFamily: "'VeganStyle', cursive", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--dark)", lineHeight: 1.35, marginBottom: "6px", marginTop: "10px", wordSpacing: "0.2em" }}>
            Experience <em style={{ fontFamily: "'VeganStyle', cursive", fontStyle: "normal", color: "var(--accent)" }}>Unforgettable Moments</em> with Bengal Beauties
          </h2>
          <div className="about-divider" style={{ width: "40px", height: "2px", background: "var(--accent)", margin: "14px 0 20px", borderRadius: "2px" }} />
          <p className="about-body" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.82rem", lineHeight: 1.9, color: "var(--dark)", marginBottom: "28px", maxWidth: "480px", letterSpacing: "0.01em" }}>
            AT BENGAL BEAUTIES, WE BELIEVE EVERY MOMENT DESERVES TO BE SPECIAL. OUR PROFESSIONAL TEAM PROVIDES DISCREET AND <em style={{ fontStyle: "normal", color: "var(--accent)", fontWeight: 700 }}>HIGH-QUALITY COMPANIONSHIP</em> FOR THE DISCERNING INDIVIDUAL. FROM <em style={{ fontStyle: "normal", color: "var(--accent)", fontWeight: 700 }}>LOCAL FAVORITES</em> TO A STUNNING <em style={{ fontStyle: "normal", color: "var(--accent)", fontWeight: 700 }}>RUSSIAN ESCORT</em> IN KOLKATA, WE ARE DEDICATED TO CREATING A RELAXED, MEMORABLE, AND PERFECTLY CURATED EXPERIENCE JUST FOR YOU.
          </p>

          <div className="about-stats-row" style={{ display: "flex", gap: "32px", paddingTop: "24px", borderTop: "1px solid rgba(124,58,237,0.1)", flexWrap: "wrap" }}>
            <div className="astat" style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span className="num" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--dark)", lineHeight: 1 }}>200<span style={{ color: "var(--accent)" }}>+</span></span>
              <span className="lbl" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>Happy Clients</span>
            </div>
            <div className="astat" style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span className="num" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--dark)", lineHeight: 1 }}>4.9<span style={{ color: "var(--accent)" }}>★</span></span>
              <span className="lbl" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>Avg. Rating</span>
            </div>
            <div className="astat" style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span className="num" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--dark)", lineHeight: 1 }}>10<span style={{ color: "var(--accent)" }}>+</span></span>
              <span className="lbl" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>Years Active</span>
            </div>
            <div className="astat" style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span className="num" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--dark)", lineHeight: 1 }}>6<span style={{ color: "var(--accent)" }}>+</span></span>
              <span className="lbl" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>Cities</span>
            </div>
          </div>

          <div className="about-tags" style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "20px 0 0" }}>
            {["Premium Service", "100% Genuine", "Verified Girls", "Call Girls", "Discreet Booking", "24/7 Available"].map((tag) => (
              <span key={tag} className="about-tag" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", border: "1px solid rgba(124,58,237,0.18)", borderRadius: "100px", padding: "5px 14px", background: "var(--cream)", transition: "all 0.2s" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-tag:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(124,58,237,0.06);
        }
      `}</style>
    </section>
  );
}
