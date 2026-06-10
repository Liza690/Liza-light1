"use client";

import { useState, useEffect, useCallback } from "react";

interface Provider { _id: string; name: string; city: string; }
interface Review   { _id: string; providerId: { _id: string; name: string; city?: string } | string; reviewerName?: string; rating: number; content?: string; createdAt: string; }

const inp: React.CSSProperties  = { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", padding:"10px 12px", fontSize:12, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const lbl: React.CSSProperties  = { display:"block", fontSize:9, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase" as const, color:"var(--text-muted)", marginBottom:5 };
const card: React.CSSProperties = { background:"#181818", border:"1px solid rgba(255,255,255,0.06)", padding:24 };

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:6 }}>
      {[1,2,3,4,5].map(n => (
        <button
          key={n} type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:26, padding:0, color: n <= (hover||value) ? "var(--accent)" : "var(--dark-mid)", transition:"color 0.15s" }}
        >★</button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [reviews,   setReviews]   = useState<Review[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState<{ ok: boolean; text: string } | null>(null);

  const [form, setForm] = useState({ providerId:"", reviewerName:"", rating:5, content:"" });

  const flash = (ok: boolean, text: string) => {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [pr, rv] = await Promise.all([
      fetch("/api/v1/admin/providers?limit=100").then(r => r.json()),
      fetch("/api/v1/admin/reviews?limit=100").then(r => r.json()),
    ]);
    setProviders(pr.providers ?? []);
    setReviews(rv.reviews ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.providerId) { flash(false, "Please select a provider"); return; }
    setSaving(true);
    const res = await fetch("/api/v1/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId:   form.providerId,
        reviewerName: form.reviewerName || "Anonymous",
        rating:       form.rating,
        content:      form.content || undefined,
      }),
    });
    if (res.ok) {
      flash(true, "Review posted!");
      setForm({ providerId:"", reviewerName:"", rating:5, content:"" });
      fetchData();
    } else {
      const d = await res.json();
      flash(false, d.error ?? "Failed to post review");
    }
    setSaving(false);
  };

  const providerName = (r: Review) => {
    if (typeof r.providerId === "object" && r.providerId !== null) return r.providerId.name;
    return providers.find(p => p._id === r.providerId)?.name ?? "—";
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:32, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, letterSpacing:3, margin:0 }}>Reviews</h1>
        <p style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"var(--text-muted)", marginTop:4 }}>
          Post reviews on behalf of clients · manage ratings
        </p>
      </div>

      {/* Toast */}
      {msg && (
        <div style={{ padding:"12px 16px", marginBottom:20, fontSize:12, fontWeight:600,
          background: msg.ok ? "rgba(124,58,237,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${msg.ok ? "rgba(124,58,237,0.3)" : "rgba(239,68,68,0.3)"}`,
          color: msg.ok ? "var(--gold)" : "rgba(239,68,68,0.8)",
        }}>{msg.text}</div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:24, alignItems:"start" }}>

        {/* ── LEFT: Create review form ── */}
        <div style={card}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, letterSpacing:2, margin:"0 0 20px", color:"var(--gold)" }}>
            + Post a Review
          </h2>
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Provider select */}
            <div>
              <label style={lbl}>Provider *</label>
              <select
                required
                value={form.providerId}
                onChange={e => setForm({ ...form, providerId: e.target.value })}
                style={{ ...inp, background:"#1a1a1a", cursor:"pointer" }}
              >
                <option value="" style={{ background:"#1a1a1a", color:"var(--text-muted)" }}>— Select provider —</option>
                {providers.map(p => (
                  <option key={p._id} value={p._id} style={{ background:"#1a1a1a", color:"var(--white)" }}>{p.name} · {p.city}</option>
                ))}
              </select>
            </div>

            {/* Reviewer name */}
            <div>
              <label style={lbl}>Reviewer Name</label>
              <input
                type="text"
                style={inp}
                value={form.reviewerName}
                onChange={e => setForm({ ...form, reviewerName: e.target.value })}
                placeholder="e.g. Rohit K.  (blank = Anonymous)"
              />
            </div>

            {/* Rating */}
            <div>
              <label style={{ ...lbl, marginBottom:10 }}>Rating *</label>
              <StarPicker value={form.rating} onChange={n => setForm({ ...form, rating: n })} />
              <p style={{ fontSize:10, color:"var(--text-muted)", marginTop:6, fontWeight:600 }}>{form.rating} / 5 stars</p>
            </div>

            {/* Review content */}
            <div>
              <label style={lbl}>Review (optional)</label>
              <textarea
                style={{ ...inp, height:96, resize:"none" }}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Write the review text…"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{ padding:"12px 0", background:"var(--accent)", border:"none", color:"var(--white)", fontSize:11, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Posting…" : "Post Review"}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Reviews list ── */}
        <div style={card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, letterSpacing:2, margin:0 }}>All Reviews</h2>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--text-muted)" }}>
              {reviews.length} total
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:"var(--text-muted)", fontSize:12 }}>Loading…</div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:"var(--text-muted)", fontSize:13, fontStyle:"italic" }}>
              No reviews yet — post the first one!
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {reviews.map(rv => (
                <div key={rv._id} style={{ padding:"16px 18px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <span style={{ fontSize:13, fontWeight:700, color:"var(--white)" }}>{rv.reviewerName || "Anonymous"}</span>
                      <span style={{ fontSize:10, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--accent)", marginLeft:10 }}>
                        for {providerName(rv)}
                      </span>
                    </div>
                    <div style={{ display:"flex", gap:2 }}>
                      {[1,2,3,4,5].map(n => (
                        <span key={n} style={{ fontSize:13, color: n <= rv.rating ? "var(--accent)" : "var(--dark-mid)" }}>★</span>
                      ))}
                    </div>
                  </div>
                  {rv.content && (
                    <p style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.6, margin:0 }}>{rv.content}</p>
                  )}
                  <p style={{ fontSize:9, fontWeight:700, letterSpacing:"1.5px", color:"var(--text-muted)", margin:"8px 0 0", textTransform:"uppercase" }}>
                    {new Date(rv.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"2-digit", year:"numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
