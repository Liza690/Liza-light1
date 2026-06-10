"use client";

import { useEffect, useRef, Fragment } from "react";

const steps = [
  {
    num: "01",
    title: "Browse Companions",
    desc: "Explore our curated elite roster. Filter by city, mood, and desire. Every profile is personally verified.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Pick a Date",
    desc: "Choose your date, time, and preferred experience. Bookings are encrypted and confirmed within minutes.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Enjoy & Elevate",
    desc: "Meet your companion and surrender to an evening crafted entirely around your pleasure and comfort.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
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
    <section id="discretion" ref={sectionRef} style={{ background: "var(--cream)", textAlign: "center", padding: "100px 80px", position: "relative", overflow: "hidden" }}>
      <span className="disc-eyebrow reveal" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500, marginBottom: "18px", display: "block", position: "relative", zIndex: 1 }}>
        How It Works
      </span>

      <h2 className="disc-title reveal" style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: "var(--dark)", marginBottom: "16px", position: "relative", zIndex: 1, textTransform: "none" }}>
        Three Steps to <em style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", color: "var(--accent)", fontStyle: "normal" }}>Her</em>
      </h2>

      <p className="disc-sub reveal" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 70px", lineHeight: 1.8, position: "relative", zIndex: 1 }}>
        From first glance to final touch — everything is handled with absolute grace and discretion. She&apos;s closer than you think.
      </p>

      <div className="disc-steps" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", alignItems: "start", maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {steps.map((step, i) => (
          <Fragment key={step.num}>
            <div className="disc-step reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 10px", position: "relative", zIndex: 1 }}>
              <span className="step-num" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", color: "var(--accent)", marginBottom: "16px", display: "block" }}>
                — {step.num} —
              </span>

              <div className="step-icon" style={{ width: "88px", height: "88px", borderRadius: "22px", background: "var(--white)", border: "1px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px", boxShadow: "0 4px 20px rgba(124,58,237,0.07)", transition: "background 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s" }}>
                {step.icon}
              </div>

              <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "var(--dark)", marginBottom: "10px", letterSpacing: "0.02em" }}>{step.title}</h4>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#6B5055", lineHeight: 1.8, maxWidth: "200px", margin: "0 auto" }}>{step.desc}</p>
            </div>

            {i < steps.length - 1 && (
              <div className="disc-connector" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "46px", gap: "5px", position: "relative", zIndex: 1 }}>
                <span style={{ display: "block", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(124,58,237,0.3)" }} />
                <span style={{ display: "block", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(124,58,237,0.18)" }} />
                <span style={{ display: "block", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(124,58,237,0.08)" }} />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <style jsx>{`
        #discretion::before {
          content: '';
          position: absolute;
          top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        #discretion::after {
          content: 'TONIGHT';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 16vw;
          font-weight: 300;
          font-style: italic;
          color: rgba(124,58,237,0.06);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -0.04em;
          user-select: none;
          z-index: 0;
        }
        .disc-step:hover .step-icon {
          background: var(--accent);
          border-color: var(--accent);
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(124,58,237,0.25);
        }
        .disc-step:hover .step-icon svg {
          stroke: #fff;
        }
        @media (max-width: 1000px) {
          .disc-steps { grid-template-columns: 1fr; gap: 40px; }
          .disc-connector { display: none; }
        }
      `}</style>
    </section>
  );
}
