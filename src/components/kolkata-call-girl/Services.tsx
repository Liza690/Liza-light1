"use client";

import { useEffect, useRef } from "react";

const services = [
  {
    num: "01",
    tag: "Fine Dining",
    title: "Dinner Dates",
    img: "/images/model1.jpg",
    desc: "She arrives in something that makes the room forget its manners. The wine helps — but it's her laugh you'll still hear at midnight.",
    cta: "Reserve Her Tonight →",
  },
  {
    num: "02",
    tag: "Social Events",
    title: "Events & Galas",
    img: "/images/model4.webp",
    desc: "On your arm all night. Under your skin forever. She knows exactly how to play the room — and what happens after everyone else leaves.",
    cta: "Bring Her Along →",
  },
  {
    num: "03",
    tag: "Jet-Set",
    title: "Travel Companion",
    img: "/images/model2.webp",
    desc: "First-class seat, first-class everything. By the time you land, you'll have forgotten the destination — and why it ever mattered.",
    cta: "Fly Together →",
  },
  {
    num: "04",
    tag: "Exclusive",
    title: "Private Evenings",
    img: "/images/model3.jpg",
    desc: "No schedule. No interruptions. Just her warmth, your curiosity, and the kind of silence that says far more than words ever could.",
    cta: "Make it Private →",
  },
];

export default function Services() {
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
    <section id="services" ref={sectionRef} style={{ background: "var(--white)", position: "relative", padding: "100px 80px" }}>
      <div className="section-header reveal" style={{ textAlign: "center", marginBottom: "70px" }}>
        <p className="section-label" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "6px", fontWeight: 700 }}>What We Offer</p>
        <h2 className="section-title" style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", fontSize: "clamp(1.3rem, 4vw, 2rem)", color: "var(--dark)", lineHeight: 1.6, marginBottom: "10px" }}>
          Discover Top-Rated <em>Kolkata Escorts</em>  and <em>Russian Escort</em> in Kolkata 
        </h2>
        <div className="divider" style={{ width: "40px", height: "2px", background: "var(--accent)", margin: "12px auto 24px" }} />
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "var(--dark)", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto" }}>
          Discover the top rated Russian call Girls or kolkata escorts for life's special moments. Whether you need an engaging date for a gala, a travel partner, or a discreet private evening, we handle every detail seamlessly.
        </p>
      </div>

      <div className="services-grid">
        {services.map((svc, i) => (
          <div
            key={svc.num}
            className="svc-card reveal"
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              aspectRatio: "5/3",
              borderBottom: i < 2 ? "2px solid var(--white)" : "none",
              borderRight: i % 2 === 0 ? "2px solid var(--white)" : "none",
            }}
          >
            <img className="svc-img" src={svc.img} alt={svc.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)", display: "block" }} />

            <div className="svc-base" style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(13,4,6,0.3) 0%, rgba(13,4,6,0.65) 100%)", transition: "opacity 0.4s", zIndex: 1 }} />
            <div className="svc-hover-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(124,58,237,0.82) 0%, rgba(236,72,153,0.72) 100%)", opacity: 0, transition: "opacity 0.4s", zIndex: 2 }} />

            <span className="svc-num" style={{ position: "absolute", top: "20px", left: "24px", fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.15)", lineHeight: 1, zIndex: 3, transition: "color 0.4s, transform 0.4s", userSelect: "none" }}>
              {svc.num}
            </span>

            <div className="svc-content" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px", zIndex: 3, transform: "translateY(0)", transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
              <span className="svc-tag" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 400, display: "block", marginBottom: "6px", transition: "color 0.3s" }}>
                {svc.tag}
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 400, color: "#fff", lineHeight: 1.2, margin: 0 }}>{svc.title}</h3>

              <div className="svc-reveal" style={{ maxHeight: 0, overflow: "hidden", transition: "max-height 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s", opacity: 0 }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", fontWeight: 300, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: "8px 0 12px", fontStyle: "italic" }}>
                  {svc.desc}
                </p>
                <a href="#contact" className="svc-btn" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.55)", padding: "7px 18px", display: "inline-block", textDecoration: "none", borderRadius: "50px", boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  {svc.cta}
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      <style jsx>{`
        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 900px;
          margin: 0 auto;
        }
        .svc-card:hover .svc-img { transform: scale(1.08); }
        .svc-card:hover .svc-base { opacity: 0; }
        .svc-card:hover .svc-hover-overlay { opacity: 1 !important; }
        .svc-card:hover .svc-num { color: rgba(255,255,255,0.3) !important; transform: scale(1.1) translateY(-4px); }
        .svc-card:hover .svc-content { transform: translateY(-8px) !important; }
        .svc-card:hover .svc-tag { color: rgba(255,255,255,0.85) !important; }
        .svc-card:hover .svc-reveal { max-height: 90px !important; opacity: 1 !important; }
        .svc-card .svc-reveal .svc-btn:hover {
          background: rgba(255,255,255,0.92);
          color: var(--accent);
          border-color: transparent;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 8px 28px rgba(255,255,255,0.25);
        }
        @media (max-width: 800px) {
          .services-grid { grid-template-columns: 1fr; }
          .svc-card:nth-child(1),
          .svc-card:nth-child(3) { border-right: none; }
          .svc-card:nth-child(2) { border-bottom: 2px solid var(--white); }
        }
      `}</style>
    </section>
  );
}
