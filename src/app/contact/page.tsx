"use client";

import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", paddingBottom: "96px", background: "var(--cream)", minHeight: "100vh", color: "var(--dark)" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px" }}>
          <p className="section-label" style={{ marginBottom: 8 }}>Get in Touch</p>
          <h2 className="section-title" style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", fontSize: "2rem", marginBottom: "12px", wordSpacing: "0.18em" }}>
            Contact <em>Us</em>
          </h2>
          <div className="divider" style={{ margin: "18px 0 28px" }} />
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 36, lineHeight: 1.8 }}>
            For discreet inquiries or to book your premium experience, reach out to us. Our team is available 24/7.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--white)", padding: "18px 20px", borderRadius: 14, border: "1px solid rgba(192,138,132,0.1)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Phone</p>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--dark)", fontFamily: "'Jost', sans-serif" }}>+91 XXXXX XXXXX</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--white)", padding: "18px 20px", borderRadius: 14, border: "1px solid rgba(192,138,132,0.1)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Email</p>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--dark)", fontFamily: "'Jost', sans-serif" }}>contact@calcuttanights.com</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--white)", padding: "18px 20px", borderRadius: 14, border: "1px solid rgba(192,138,132,0.1)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Address</p>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--dark)", fontFamily: "'Jost', sans-serif", lineHeight: 1.5 }}>Park Street, Kolkata<br />West Bengal, India</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--white)", padding: "18px 20px", borderRadius: 14, border: "1px solid rgba(192,138,132,0.1)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Hours</p>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--dark)", fontFamily: "'Jost', sans-serif" }}>24/7 — Always Available</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
