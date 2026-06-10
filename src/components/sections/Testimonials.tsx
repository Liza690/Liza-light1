"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "An evening I will never forget. My companion was intelligent, warm, and utterly captivating. Liza exceeded every expectation.",
    name: "Rahul K.",
    meta: "Mumbai · Verified Client",
    initial: "R",
  },
  {
    quote: "Absolute discretion, seamless booking, and a companion who made me feel like the only person in the world. This service is in a league of its own.",
    name: "Arjun M.",
    meta: "Delhi · VIP Member",
    initial: "A",
  },
  {
    quote: "I travel for business frequently and Liza has become my trusted partner in every city. Professional, private, and unparalleled quality.",
    name: "Vikram S.",
    meta: "Bangalore · Travel Client",
    initial: "V",
  },
  {
    quote: "The booking experience was flawless and my companion was breathtakingly beautiful — intelligent and made the whole evening effortlessly magical.",
    name: "Suresh P.",
    meta: "Hyderabad · Gold Member",
    initial: "S",
  },
];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function Testimonials() {
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
    <section id="testimonials" ref={sectionRef} style={{ position: "relative", overflow: "hidden", padding: "90px 80px", textAlign: "left" }}>
      <div className="t-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src="/images/testimonialModel.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block", filter: "blur(1px) brightness(0.5)", transform: "scale(1.04)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,4,18,0.48)" }} />
      </div>

      <div className="t-header reveal" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "50px" }}>
        <h2 style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1 }}>
          Client Experiences
        </h2>
        <span className="t-label" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500 }}>
          Discreet Reviews
        </span>
      </div>

      <div className="t-grid" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className="t-card reveal"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "28px 24px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              transition: "background 0.3s, border-color 0.3s, transform 0.3s",
            }}
          >
            <div className="t-stars" style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
              {[...Array(5)].map((_, si) => (
                <StarIcon key={si} />
              ))}
            </div>

            <blockquote style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "24px" }}>
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="t-author" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="t-avatar" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
                {t.initial}
              </div>
              <div className="t-author-info">
                <span className="t-name" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#fff", display: "block", lineHeight: 1.2 }}>{t.name}</span>
                <span className="t-meta" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginTop: "2px", display: "block" }}>{t.meta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .t-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(124,58,237,0.3);
          transform: translateY(-4px);
        }
        @media (max-width: 800px) {
          .t-grid { grid-template-columns: 1fr 1fr; }
          .t-header h2 { font-size: 1.1rem; }
        }
      `}</style>
    </section>
  );
}
