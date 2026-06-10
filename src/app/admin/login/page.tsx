"use client";

import { useState } from "react";
import { signIn, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  return (
    <SessionProvider basePath="/api/v1/auth" session={null}>
      <AdminLoginForm />
    </SessionProvider>
  );
}

function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: "admin@admin.com",
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid password. Access denied.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--deeper)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.06) 0%, transparent 60%)" }} />

      <div className="w-full max-w-md" style={{ padding: "40px", borderRadius: "16px", background: "linear-gradient(to bottom, #181818, #111111)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-center" style={{ marginBottom: "32px" }}>
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, letterSpacing: "4px", color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>
            ADMIN PANEL
          </Link>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "8px" }}>
            Service Booking Portal
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "16px", marginBottom: "24px", borderRadius: "12px", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "10px" }}>
              Enter Administrator Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "14px 16px", fontSize: "14px", borderRadius: "12px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "rgba(124,58,237,0.06)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent)", color: "var(--white)", padding: "16px", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", border: "none", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.5 : 1, minHeight: "50px" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#5B21B6"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--accent)"; }}
          >
            {loading ? (
              <div style={{ width: "20px", height: "20px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
            ) : (
              "✦ Access Dashboard"
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "32px", paddingTop: "24px" }}>
          <Link href="/" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.5px", fontWeight: 600 }}>
            ← Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
