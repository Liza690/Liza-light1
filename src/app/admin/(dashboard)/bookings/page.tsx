"use client";

import { useState, useEffect, useCallback } from "react";

interface BookingProvider { name: string; city?: string; }
interface BookingService  { name: string; price: number; }
interface Booking {
  _id: string;
  bookingId: string;
  customerName?: string;
  customerPhone?: string;
  providerId?: BookingProvider;
  servicesSnapshot?: BookingService[];
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "var(--gold)",
  confirmed: "var(--accent)",
  completed: "var(--gold)",
  cancelled: "#EF4444",
};

const card: React.CSSProperties = { background:"#181818", border:"1px solid rgba(255,255,255,0.06)", padding:24 };

export default function BookingsPage() {
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading,  setLoading]      = useState(true);
  const [filter,   setFilter]       = useState("all");
  const [total,    setTotal]        = useState(0);
  const [page,     setPage]         = useState(1);
  const PER_PAGE = 20;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(PER_PAGE), page: String(page) });
    if (filter !== "all") params.set("status", filter);
    const r = await fetch(`/api/v1/admin/bookings?${params}`);
    if (r.ok) {
      const d = await r.json();
      setBookings(d.bookings ?? []);
      setTotal(d.pagination?.total ?? 0);
    }
    setLoading(false);
  }, [filter, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { setPage(1); }, [filter]);

  const FILTERS = ["all","pending","confirmed","completed","cancelled"];

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"2-digit", year:"numeric" });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:32, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, letterSpacing:3, margin:0 }}>Bookings</h1>
        <p style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"var(--text-muted)", marginTop:4 }}>
          All visitor reservations · {total} total
        </p>
      </div>

      {/* Status filters */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"8px 16px",             background: filter===f ? "var(--accent)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${filter===f ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
            color: filter===f ? "var(--white)" : "var(--text-muted)",
            fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase",
            cursor:"pointer", fontFamily:"inherit",
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={card}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:"var(--text-muted)", fontSize:12 }}>Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <p style={{ fontSize:14, color:"var(--text-muted)", fontStyle:"italic" }}>No bookings found.</p>
            <p style={{ fontSize:11, color:"#333", marginTop:8 }}>Bookings appear here when visitors complete the booking flow on the website.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    {["ID","Customer","Provider","Services","Schedule","Amount","Status","Booked On"].map(h => (
                      <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:9, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--text-muted)", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b._id}
                      style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = i%2===0 ? "transparent" : "rgba(255,255,255,0.01)")}
                    >
                      {/* Booking ID */}
                      <td style={{ padding:"12px 12px", color:"#666", fontFamily:"monospace", fontSize:10, whiteSpace:"nowrap" }}>
                        {b.bookingId.slice(-8).toUpperCase()}
                      </td>
                      {/* Customer */}
                      <td style={{ padding:"12px 12px", whiteSpace:"nowrap" }}>
                        <div style={{ fontWeight:700, color:"var(--white)" }}>{b.customerName || "—"}</div>
                        {b.customerPhone && <div style={{ fontSize:10, color:"var(--text-muted)", marginTop:2 }}>{b.customerPhone}</div>}
                      </td>
                      {/* Provider */}
                      <td style={{ padding:"12px 12px", whiteSpace:"nowrap" }}>
                        {b.providerId ? (
                          <>
                            <div style={{ fontWeight:700, color:"var(--white)" }}>{b.providerId.name}</div>
                            <div style={{ fontSize:10, color:"var(--accent)", marginTop:2 }}>{b.providerId.city}</div>
                          </>
                        ) : "—"}
                      </td>
                      {/* Services */}
                      <td style={{ padding:"12px 12px", minWidth:160 }}>
                        {b.servicesSnapshot && b.servicesSnapshot.length > 0 ? (
                          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                            {b.servicesSnapshot.map((sv, j) => (
                              <span key={j} style={{ fontSize:11, color:"#ccc" }}>{sv.name}</span>
                            ))}
                          </div>
                        ) : "—"}
                      </td>
                      {/* Schedule */}
                      <td style={{ padding:"12px 12px", whiteSpace:"nowrap" }}>
                        <div style={{ fontWeight:700, color:"var(--white)" }}>{fmt(b.date)}</div>
                        <div style={{ fontSize:10, color:"var(--text-muted)", marginTop:2 }}>{b.startTime} – {b.endTime}</div>
                      </td>
                      {/* Amount */}
                      <td style={{ padding:"12px 12px", whiteSpace:"nowrap" }}>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:"var(--gold)", letterSpacing:1 }}>
                          ₹{b.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      {/* Status */}
                      <td style={{ padding:"12px 12px" }}>
                        <span style={{
                          display:"inline-block", padding:"3px 10px",
                          fontSize:9, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase",
                          color: STATUS_COLORS[b.status] ?? "#fff",
                          background: `${STATUS_COLORS[b.status] ?? "#fff"}18`,
                          border: `1px solid ${STATUS_COLORS[b.status] ?? "#fff"}40`,
                        }}>
                          {b.status}
                        </span>
                      </td>
                      {/* Created */}
                      <td style={{ padding:"12px 12px", whiteSpace:"nowrap", color:"var(--text-muted)", fontSize:11 }}>
                        {fmt(b.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > PER_PAGE && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600 }}>
                  Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, total)} of {total}
                </span>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                    style={{ padding:"7px 16px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"var(--text-muted)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", opacity:page===1?0.4:1 }}>
                    ← Prev
                  </button>
                  <button onClick={() => setPage(p => p+1)} disabled={page*PER_PAGE>=total}
                    style={{ padding:"7px 16px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"var(--text-muted)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", opacity:page*PER_PAGE>=total?0.4:1 }}>
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
