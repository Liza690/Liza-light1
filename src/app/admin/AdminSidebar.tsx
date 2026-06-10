"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin",           label: "Overview",   exact: true  },
  { href: "/admin/providers", label: "Providers",  exact: false },
  { href: "/admin/reviews",   label: "Reviews",    exact: false },
  { href: "/admin/bookings",  label: "Bookings",   exact: false },
];

export default function AdminSidebar({ userName }: { userName?: string }) {
  const path = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/v1/auth/signout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside style={{
      width: 230, flexShrink: 0,
      position: "fixed", top: 0, left: 0, bottom: 0,
      background: "#111111",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column",
      zIndex: 999, overflowY: "auto",
    }}>
      {/* Brand */}
      <div style={{ padding: "28px 24px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 36,
          letterSpacing: 4,       color: "var(--accent)",
        }}>LIZA</div>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-muted)", marginTop: 3 }}>
          Admin Panel
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: "14px 0" }}>
        {NAV.map(({ href, label, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center",
              padding: "13px 24px",
              fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase",
              color: active ? "var(--white)" : "var(--text-muted)",
              textDecoration: "none",
              background: active ? "rgba(124,58,237,0.1)" : "transparent",
              borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
            }}>
              {label}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "18px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 12, fontWeight: 600 }}>
          {userName ?? "Administrator"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Visit Site
          </Link>
          <button
            onClick={handleSignOut}
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
