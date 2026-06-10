"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const S = {
  card: {
    background: "#181818",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "28px",
  } as React.CSSProperties,
};

export default function AdminOverview() {
  const [stats, setStats] = useState({ providers: 0, bookings: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/admin/providers?limit=1").then((r) => r.json()),
      fetch("/api/v1/admin/bookings?limit=1").then((r) => r.json()),
      fetch("/api/v1/admin/reviews?limit=1").then((r) => r.json()),
    ])
      .then(([p, b, r]) =>
        setStats({
          providers: p.pagination?.total ?? 0,
          bookings:  b.pagination?.total ?? 0,
          reviews:   r.pagination?.total ?? 0,
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: "Total Bookings",     value: stats.bookings,  href: "/admin/bookings",  accent: "var(--accent)" },
    { label: "Service Providers",  value: stats.providers, href: "/admin/providers", accent: "var(--accent)" },
    { label: "Reviews",            value: stats.reviews,   href: "/admin/reviews",   accent: "var(--accent)" },
  ];

  const QUICK = [
    { label: "+ Add Provider", href: "/admin/providers", bg: "var(--accent)", color: "#fff"     },
    { label: "+ Add Review",   href: "/admin/reviews",   bg: "#181818", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
    { label: "View Bookings",  href: "/admin/bookings",  bg: "#181818", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 40, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, letterSpacing: 3, color: "var(--white)", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", marginTop: 4 }}>
          Manage bookings, service providers &amp; reviews
        </p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
        {STAT_CARDS.map((c) => (
          <Link key={c.label} href={c.href} style={{ textDecoration: "none", display: "block", ...S.card, transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
          >
            <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 10px" }}>
              {c.label}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, letterSpacing: 2, color: "var(--white)", margin: 0, lineHeight: 1 }}>
              {loading ? "—" : c.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 14px" }}>
          Quick Actions
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {QUICK.map((q) => (
            <Link key={q.label} href={q.href} style={{
              padding: "11px 22px", background: q.bg, color: q.color,
              textDecoration: "none", fontSize: 11, fontWeight: 700,
              letterSpacing: "1.8px", textTransform: "uppercase",
              border: (q as { border?: string }).border ?? "none",
            }}>
              {q.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ ...S.card, borderLeft: "2px solid var(--accent)", maxWidth: 560 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", margin: "0 0 8px" }}>
          Phase 1 — How It Works
        </p>
        <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#666", fontSize: 13, lineHeight: 1.9 }}>
          <li>Create service providers with their details, services &amp; availability slots.</li>
          <li>Visitors browse providers, select services &amp; a slot, then get redirected to WhatsApp.</li>
          <li>Every booking is saved to the database before the WhatsApp redirect.</li>
          <li>Admin reviews can be written on behalf of clients with custom reviewer names.</li>
        </ul>
      </div>
    </div>
  );
}
