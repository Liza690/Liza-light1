"use client";

export default function FloatingBookNow() {
  return (
    <a
      href="#contact"
      className="sticky-contact"
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 9999,
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "'Jost', sans-serif",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#fff",
        background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
        padding: "16px 32px",
        textDecoration: "none",
        border: "none",
        borderRadius: "50px",
        boxShadow: "0 6px 30px rgba(124,58,237,0.55), 0 0 0 0 rgba(124,58,237,0.4)",
        cursor: "pointer",
        animation: "stickyPulse 2.5s ease-in-out infinite",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = "linear-gradient(135deg, #6D28D9 0%, #DB2777 100%)";
        el.style.transform = "translateY(-4px) scale(1.04)";
        el.style.boxShadow = "0 14px 48px rgba(124,58,237,0.7), 0 6px 20px rgba(236,72,153,0.5)";
        el.style.animation = "none";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)";
        el.style.transform = "none";
        el.style.boxShadow = "0 6px 30px rgba(124,58,237,0.55), 0 0 0 0 rgba(124,58,237,0.4)";
        el.style.animation = "stickyPulse 2.5s ease-in-out infinite";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      <span>Book Now</span>

      <style jsx>{`
        @keyframes stickyPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(236,72,153,0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(236,72,153,0.9); }
        }
        @media (max-width: 600px) {
          .sticky-contact { bottom: 16px; right: 16px; padding: 12px 16px; font-size: 0.6rem; }
          .sticky-contact span { display: none; }
        }
      `}</style>
    </a>
  );
}
