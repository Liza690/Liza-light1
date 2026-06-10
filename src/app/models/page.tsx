"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { companions } from "@/data/companions";

interface ModelCard {
  id: string;
  name: string;
  age: number;
  city: string;
  img: string;
  price: string;
  verified: boolean;
  available: boolean;
}

export default function ModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState<ModelCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("/api/v1/providers?limit=12");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const cards: ModelCard[] = (data.providers || []).map((p: any) => ({
          id: p._id,
          name: p.name,
          age: p.age || 0,
          city: p.city || "",
          img: p.profileImages?.[0] || "",
          price: p.price ? `\u20B9${p.price.toLocaleString()}` : "Price on Request",
          verified: p.isVerified ?? false,
          available: p.isAvailable ?? true,
        }));
        if (cards.length > 0) { setModels(cards); setLoading(false); return; }
      } catch {}
      const cards: ModelCard[] = companions.map((c) => ({
        id: String(c.id),
        name: c.name,
        age: c.age,
        city: c.city,
        img: c.images[0] || "",
        price: `\u20B9${Number(c.price).toLocaleString()}`,
        verified: c.verified,
        available: true,
      }));
      setModels(cards);
      setLoading(false);
    }
    fetchModels();
  }, []);

  const filtered = !searchQuery.trim()
    ? models
    : models.filter((m) => {
        const q = searchQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q);
      });

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--cream)", minHeight: "100vh", paddingTop: "120px", paddingBottom: "96px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <p className="section-label">Our Models</p>
            <h2 className="section-title" style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", fontSize: "2rem", marginBottom: "10px" }}>
              Browse Our Exclusive <em>Models</em>
            </h2>
            <div className="divider" style={{ margin: "12px auto 24px" }} />
          </div>

          <div style={{ maxWidth: "500px", margin: "0 auto 48px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or city..."
              style={{
                width: "100%",
                padding: "14px 20px",
                border: "1px solid var(--taupe)",
                borderRadius: "50px",
                fontSize: "0.85rem",
                fontFamily: "'Jost', sans-serif",
                outline: "none",
                background: "var(--white)",
                color: "var(--dark)",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--taupe)"; }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 40, height: 40, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite", margin: "0 auto 16px" }} />
              <p style={{ fontSize: "0.75rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Loading models...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", border: "1px dashed var(--taupe)", borderRadius: "24px" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "16px" }}>🔍</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "var(--dark)", marginBottom: "8px" }}>No Models Found</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Try adjusting your search.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => router.push(`/providers/${m.id}`)}
                  style={{
                    background: "var(--white)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(13,4,6,0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(124,58,237,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,4,6,0.08)";
                  }}
                >
                  <div style={{ aspectRatio: "3/4", overflow: "hidden", position: "relative" }}>
                    <img
                      src={m.img || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                      alt={m.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.6s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    />
                    {m.verified && (
                      <span style={{ position: "absolute", top: "12px", left: "12px", background: "var(--accent)", color: "#fff", fontSize: "0.5rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "50px" }}>
                        ✓ Verified
                      </span>
                    )}
                    {m.available && (
                      <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(16,185,129,0.9)", color: "#fff", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "50px" }}>
                        Available
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "16px 18px 20px" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "var(--dark)", marginBottom: "4px", fontWeight: 600 }}>
                      {m.name}
                    </h3>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "10px", fontWeight: 500, letterSpacing: "0.3px" }}>
                      {m.age} yrs · {m.city}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--accent)", fontWeight: 700 }}>
                        {m.price}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/providers/${m.id}`); }}
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50px",
                          padding: "8px 18px",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
