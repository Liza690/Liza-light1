"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "I've tried many services, but the Kolkata escorts at Bengal Beauties are truly in a league of their own. Completely professional and discreet.",
    name: "Rahul K.",
    meta: "Kolkata · Verified Client",
    initial: "R",
  },
  {
    quote: "Finding a genuine kolkata call girl who is both intelligent and beautiful was difficult until I used this agency. Highly recommended.",
    name: "Arjun M.",
    meta: "Kolkata · VIP Member",
    initial: "A",
  },
  {
    quote: "If you are looking for a high-end Russian escort in Kolkata, look no further. The experience was sophisticated and handled with perfect privacy.",
    name: "Vikram S.",
    meta: "Kolkata · Premium Client",
    initial: "V",
  },
  {
    quote: "The attention to detail provided for my private evening was exceptional. It's rare to find such high-quality Kolkata call girls in the city.",
    name: "Suresh P.",
    meta: "Kolkata · Gold Member",
    initial: "S",
  },
  {
    quote: "I was impressed by the ease of the booking process. It's the most reliable service for anyone needing a professional kolkata escort.",
    name: "Amit R.",
    meta: "Kolkata · First-Time Client",
    initial: "A",
  },
  {
    quote: "My dinner date was a wonderful experience. Everything was curated perfectly, making it the most memorable evening I've had in a long time.",
    name: "Deepak M.",
    meta: "Kolkata · Regular Client",
    initial: "D",
  },
  {
    quote: "Discretion and class are clearly the priorities here. It's comforting to know that Bengal Beauties maintain such high standards for all their companions.",
    name: "Rohan S.",
    meta: "Kolkata · VIP Member",
    initial: "R",
  },
  {
    quote: "I needed someone for a gala event and the companion provided was elegant, charming, and a perfect conversationalist. A truly five-star experience.",
    name: "Karan V.",
    meta: "Kolkata · Elite Client",
    initial: "K",
  },
  {
    quote: "The service is seamless. Whether you need a travel companion or just someone for a relaxed evening, they provide the best in the city.",
    name: "Nikhil P.",
    meta: "Kolkata · Travel Client",
    initial: "N",
  },
  {
    quote: "A refreshing and stress-free experience. If you're searching for top-tier companionship, this is easily the most trustworthy and professional agency available.",
    name: "Manish T.",
    meta: "Kolkata · Verified Client",
    initial: "M",
  },
];

const allTestimonials = [...testimonials, ...testimonials];

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

      <div className="t-grid">
        <div className="t-infinite-track">
          {allTestimonials.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
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
      </div>

      <style jsx>{`
        .t-grid {
          position: relative;
          z-index: 1;
          overflow: hidden;
          padding: 10px 4px;
        }
        .t-infinite-track {
          display: flex;
          gap: 16px;
          width: fit-content;
          animation: t-scroll 30s linear infinite;
        }
        @media (hover: hover) {
          .t-grid:hover .t-infinite-track {
            animation-play-state: paused;
          }
        }
        .t-card {
          flex: 0 0 350px;
          scroll-snap-align: start;
        }
        .t-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(124,58,237,0.3);
          transform: translateY(-4px);
        }
        @keyframes t-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 800px) {
          .t-header h2 { font-size: 1.1rem; }
        }
        @media (max-width: 600px) {
          .t-card {
            flex: 0 0 280px;
          }
        }
      `}</style>
    </section>
  );
}