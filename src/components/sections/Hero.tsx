"use client";

import { useEffect, useRef } from "react";

const models = [
  { name: "Sophia", detail: "26 · Kolkata", img: "/images/model1.jpg" },
  { name: "Natasha", detail: "24 · Kolkata", img: "/images/model2.webp" },
  { name: "Priya", detail: "27 · Kolkata", img: "/images/model3.jpg" },
  { name: "Anika", detail: "25 · Kolkata", img: "/images/model4.webp" },
  { name: "Mia", detail: "23 · Kolkata", img: "/images/model5.webp" },
  { name: "Elena", detail: "28 · Kolkata", img: "/images/model6.jpg" },
  { name: "Zara", detail: "24 · Kolkata", img: "/images/model7.jpg" },
  { name: "Lara", detail: "26 · Kolkata", img: "/images/model8.jpg" },
];

function renderCardHTML(model: (typeof models)[0]) {
  return `<div class="thumb"><img src="${model.img}" alt="${model.name}"></div><div class="info"><span class="name">${model.name}</span><span class="detail">${model.detail}</span><span class="status">● Available</span><a href="#companions" class="btn-sm">Book Her</a></div>`;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const fc1Ref = useRef<HTMLDivElement>(null);
  const fc2Ref = useRef<HTMLDivElement>(null);
  const fc3Ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const slots = [fc1Ref.current, fc2Ref.current, fc3Ref.current];
    if (!slots[0] || !slots[1] || !slots[2]) return;

    let idx = 0;

    function renderCard(slot: HTMLDivElement, model: (typeof models)[0]) {
      slot.innerHTML = renderCardHTML(model);
    }

    function initFeatured() {
      for (let i = 0; i < 3; i++) {
        renderCard(slots[i]!, models[(idx + i) % models.length]);
      }
    }

    function rotateFeatured() {
      slots[0]!.classList.add("swipe-out");
      slots[1]!.classList.add("fade-out");

      setTimeout(function () {
        idx = (idx + 1) % models.length;

        slots[0]!.style.transform = "rotate(-4deg) translateX(-140px)";
        slots[0]!.style.opacity = "0";
        slots[1]!.style.opacity = "0";

        slots[0]!.classList.remove("swipe-out");
        slots[1]!.classList.remove("fade-out");

        for (let i = 0; i < 2; i++) {
          renderCard(slots[i]!, models[(idx + i) % models.length]);
        }

        slots[0]!.style.transform = "";
        slots[0]!.style.opacity = "";
        slots[1]!.style.opacity = "";

        slots[2]!.classList.add("no-transition");
        renderCard(slots[2]!, models[(idx + 2) % models.length]);
        slots[2]!.style.transform = "rotate(3deg) translateX(140px)";
        slots[2]!.style.opacity = "0";
        void slots[2]!.offsetHeight;
        slots[2]!.classList.remove("no-transition");
        slots[2]!.style.transform = "";
        slots[2]!.style.opacity = "";
      }, 900);
    }

    initFeatured();
    const interval = setInterval(rotateFeatured, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" ref={sectionRef} style={{ height: "100vh", minHeight: "650px", position: "relative", overflow: "hidden" }}>
      <div className="hero-bg" style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(124,58,237,0.55) 0%, rgba(13,4,6,0.35) 35%, rgba(13,4,6,0.15) 60%, rgba(167,139,250,0.12) 100%)", zIndex: 1 }} />
        <img src="/images/hero-image.avif" alt="Bengal Beauties" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", animation: "heroZoom 10s ease-out forwards" }} />
      </div>

      <div className="hero-overlay" style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <p className="availability reveal" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#fff", marginBottom: "30px", fontWeight: 600 }}>
          <span style={{ color: "var(--gold)" }}>●</span> Kolkata&apos;s No. 1 Escort Service
        </p>
        <h1 className="reveal" style={{ fontFamily: "'Jost', sans-serif", fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)", fontWeight: 500, letterSpacing: "0.02em", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.01em", textShadow: "0 2px 20px rgba(0,0,0,0.5)", maxWidth: "800px" }}>
          Find the Best Kolkata Escorts Services, Kolkata Call Girl
        </h1>
        <span className="rule" style={{ display: "block", width: "80px", height: "1px", background: "var(--accent)", margin: "18px 0 22px" }} />
        <p className="tagline reveal" style={{ fontFamily: "'Jost', sans-serif", fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)", fontWeight: 400, letterSpacing: "0.04em", color: "#fff", marginBottom: "40px", maxWidth: "620px", lineHeight: 1.7, textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)" }}>
          Discover the top rated Russian call Girls or kolkata escorts for life&apos;s special moments. Whether you need an engaging date for a gala, a travel partner, or a discreet private evening, we handle every detail seamlessly.
        </p>
        <div className="hero-actions reveal" style={{ display: "flex", gap: "18px" }}>
          <a href="/providers" className="btn btn-primary">Hot Escorts</a>
          <a href="/contact" className="btn btn-outline">Book Now</a>
        </div>
      </div>

      <div className="hero-featured">
        <div className="heading"><span className="dot"></span> Available Now</div>
        <div ref={fc1Ref} id="fc-1" className="fcard" />
        <div ref={fc2Ref} id="fc-2" className="fcard" />
        <div ref={fc3Ref} id="fc-3" className="fcard" />
      </div>

      <div className="hero-rating" style={{ position: "absolute", left: "50%", bottom: "60px", transform: "translateX(-50%)", zIndex: 5, padding: "14px 32px", background: "rgba(10, 4, 20, 0.72)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(124,58,237,0.45)", borderRadius: "60px", display: "flex", alignItems: "center", gap: "14px", whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.15)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span className="trust-text" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff", fontWeight: 500 }}>
          <strong style={{ color: "#fff", fontWeight: 700 }}>Verified</strong> &middot; <em style={{ fontStyle: "normal", color: "var(--gold)", fontWeight: 600 }}>200+ Reviews</em>
        </span>
      </div>

      <style jsx>{`
        @keyframes heroZoom {
          from { transform: scale(1.08); }
          to { transform: scale(1); }
        }
        @keyframes beep {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          50% { opacity: 0.4; box-shadow: 0 0 0 8px rgba(16,185,129,0); }
        }
      `}</style>
    </section>
  );
}
