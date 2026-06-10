"use client";

export default function Footer() {
  return (
    <footer className="site-footer" style={{ padding: "80px 80px 40px", background: "var(--accent)", color: "var(--white)", textAlign: "left" }}>
      <div className="footer-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "60px" }}>
          <div className="footer-brand" style={{ paddingRight: "40px" }}>
            <a href="#home" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--white)", display: "inline-block", marginBottom: "20px" }}>
              Liza
            </a>
            <p className="footer-tagline" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", marginBottom: "24px", maxWidth: "320px" }}>
              India&apos;s premier luxury companion service — discretion, elegance, and desire, delivered.
            </p>
            <div className="footer-socials" style={{ display: "flex", gap: "10px" }}>
              {["T", "I", "W", "TG"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="social-box"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "38px",
                    height: "38px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Company",
              links: ["About Us", "How It Works" ],
            },
            {
              title: "Services",
              links: ["Browse Companions"],
            },
            {
              title: "Support",
              links: ["Contact Us"],
            },
          ].map((col) => (
            <div key={col.title} className="footer-col">
              <h4 className="footer-title" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--white)", marginBottom: "24px", position: "relative" }}>
                {col.title}
              </h4>
              <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: "12px" }}>
                    <a href="#" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 400, color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "all 0.2s ease", display: "inline-block" }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="footer-divider" style={{ border: "none", height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: "30px" }} />

        <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <span className="footer-copy" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
            © 2025 Liza. All rights reserved. For adults 18+ only.
          </span>
          <div className="footer-bottom-links" style={{ display: "flex", gap: "20px" }}>
            <a href="#" className="footer-bottom-link" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              Privacy
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-box:hover {
          border-color: rgba(255,255,255,0.6);
          color: var(--white);
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
        }
        .footer-links a:hover {
          color: var(--white);
          transform: translateX(4px);
        }
        .footer-bottom-link:hover {
          color: var(--white);
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          .footer-brand {
            grid-column: span 2;
            padding-right: 0;
          }
          .footer-tagline {
            max-width: 100%;
          }
        }
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .footer-brand {
            grid-column: span 1;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
        @media (max-width: 800px) {
          footer { padding: 40px 30px 30px; }
        }
      `}</style>
    </footer>
  );
}
