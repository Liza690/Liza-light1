"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface CompanionCard {
  id: string;
  name: string;
  meta: string;
  img: string;
  available: boolean;
}

export default function Companions() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [companions, setCompanions] = useState<CompanionCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchCompanions() {
      try {
        const res = await fetch("/api/v1/providers?limit=8&sort=bookings");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const cards: CompanionCard[] = (data.providers || []).map((p: any) => ({
          id: p._id,
          name: p.name,
          meta: `${p.age || ""} · ${p.city}`.replace(/^ · /, ""),
          img: p.profileImages?.[0] || "",
          available: p.isAvailable ?? true,
        }));
        if (cards.length > 0) setCompanions(cards);
        else throw new Error("Empty");
      } catch {
        // API unavailable — render nothing
      } finally {
        setLoaded(true);
      }
    }
    fetchCompanions();
  }, []);

  useEffect(() => {
    if (!loaded) return;
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
  }, [loaded]);

  return (
    <section id="companions" ref={sectionRef} style={{ background: "var(--white)", textAlign: "center", padding: "100px 80px" }}>
      <div className="section-header reveal" style={{ marginBottom: "50px" }}>
        <p className="section-label" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "6px", fontWeight: 500 }}>
          Our Portfolio
        </p>
        <h2 className="section-title" style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", fontSize: "2rem", color: "var(--dark)", lineHeight: 1.2, marginBottom: "10px", wordSpacing: "0.18em" }}>
          Meet Our <em>Companions</em>
        </h2>
        <div className="divider" style={{ width: "40px", height: "2px", background: "var(--accent)", margin: "12px auto 24px" }} />
        <p className="section-sub" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto" }}>
          Handpicked. Verified. Unforgettable. Browse our exclusive roster and find your perfect match.
        </p>
      </div>

      <div className="companions-grid">
        {companions.map((c, i) => (
          <div
            key={c.name}
            className="companion-card reveal"
            onClick={() => router.push(`/providers/${c.id}`)}
            style={{ transitionDelay: `${i * 0.08}s`, position: "relative", borderRadius: "24px", overflow: "hidden", cursor: "pointer", aspectRatio: "2/3", boxShadow: "0 8px 32px rgba(13,4,6,0.13)", transition: "transform 0.35s ease, box-shadow 0.35s ease" }}
          >
            <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block", transition: "transform 0.6s ease" }} />

            <div className="card-top-grad" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to bottom, rgba(10,4,20,0.55) 0%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />

            <div className="card-header" style={{ position: "absolute", top: "20px", left: "20px", right: "20px", zIndex: 2, textAlign: "left" }}>
              <span className="name" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--white)", display: "block", lineHeight: 1.2, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                {c.name}
              </span>
              {c.available ? (
                <span className="avail-tag" style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "6px", fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", fontWeight: 400, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>
                  <span className="spin" style={{ display: "inline-block", width: "12px", height: "12px", border: "1.5px solid rgba(255,255,255,0.6)", borderTopColor: "#fff", borderRadius: "50%", animation: "spinLoader 1s linear infinite", flexShrink: 0 }} />
                  Available Now
                </span>
              ) : (
                <span className="avail-tag booked-tag" style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "6px", fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", fontWeight: 400, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                  <span className="spin" style={{ display: "inline-block", width: "12px", height: "12px", border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "rgba(255,255,255,0.5)", borderRadius: "50%", animation: "spinLoader 1s linear infinite", flexShrink: 0 }} />
                  Booked Tonight
                </span>
              )}
            </div>

            <div className="card-footer" style={{ position: "absolute", bottom: "16px", left: "14px", right: "14px", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <div className="identity" style={{ display: "flex", alignItems: "center", gap: "9px", background: "rgba(20,10,25,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "50px", padding: "6px 14px 6px 6px", flex: 1, minWidth: 0 }}>
                <div className="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.25)" }}>
                  <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                </div>
                <div className="id-text" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <span className="handle" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.name}
                  </span>
                  <span className="meta" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 300, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>
                    {c.meta}
                  </span>
                </div>
              </div>
              {c.available ? (
                <a href={`/providers/${c.id}`} className="book-btn" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, letterSpacing: "0.06em", color: "#fff", background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", borderRadius: "50px", whiteSpace: "nowrap", textDecoration: "none", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", flexShrink: 0, display: "flex", alignItems: "center", gap: "5px", boxShadow: "0 4px 16px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2"/></svg> Book Her
                </a>
              ) : (
                <a className="book-btn booked-btn" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", background: "rgba(20,10,25,0.35)", borderRadius: "50px", whiteSpace: "nowrap", textDecoration: "none", flexShrink: 0, cursor: "not-allowed", pointerEvents: "none", boxShadow: "none" }}>
                  Unavailable
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .companions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .book-btn {
          font-size: 0.62rem;
          padding: 10px 20px;
        }
        .companion-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 50px rgba(124,58,237,0.18);
        }
        .companion-card:hover img { transform: scale(1.06); }
        .companion-card:hover .card-footer .identity .avatar img { transform: none; }
        .companion-card .card-footer .book-btn:hover {
          background: linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%) !important;
          transform: scale(1.06) !important;
          box-shadow: 0 8px 28px rgba(124,58,237,0.7), inset 0 1px 0 rgba(255,255,255,0.2) !important;
        }
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1000px) {
          .companions-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 800px) {
          .companions-grid { gap: 14px; }
          .companion-card .card-header .name { font-size: 1.1rem; }
          .companion-card .card-footer .book-btn { font-size: 0.58rem !important; padding: 8px 12px !important; }
        }
        @media (max-width: 768px) {
          .companions-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 14px;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch;
          }
          .companions-grid::-webkit-scrollbar { height: 4px; }
          .companions-grid::-webkit-scrollbar-track { background: rgba(192,138,132,0.1); border-radius: 4px; }
          .companions-grid::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }
          .companion-card {
            min-width: 260px;
            scroll-snap-align: start;
            aspect-ratio: 2/3;
          }
        }
      `}</style>
    </section>
  );
}
