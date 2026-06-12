"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
interface ProviderResult {
  _id: string;
  name: string;
  bio?: string;
  profileImages?: string[];
  city: string;
  age?: number;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  isVerified: boolean;
  isAvailable: boolean;
  tags?: string[];
  price?: number;
}

interface FilterOptions {
  cities: string[];
  priceRange: { minPrice: number; maxPrice: number };
  experienceLevels: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ITEMS_PER_PAGE = 12;

function ProvidersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [providers, setProviders] = useState<ProviderResult[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: ITEMS_PER_PAGE, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCity, setActiveCity] = useState(searchParams.get("city") || "");
  const [priceSort, setPriceSort] = useState<string>(searchParams.get("sort") || "");
  const [minAge, setMinAge] = useState(searchParams.get("minAge") || "");
  const [maxAge, setMaxAge] = useState(searchParams.get("maxAge") || "");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const currentPage = Number(searchParams.get("page") || "1");

  const fetchProviders = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("limit", String(ITEMS_PER_PAGE));
      if (searchQuery) params.set("q", searchQuery);
      if (activeCity) params.set("city", activeCity);
      if (minAge) params.set("minAge", minAge);
      if (maxAge) params.set("maxAge", maxAge);
      if (priceSort === "asc" || priceSort === "desc") params.set("sort", priceSort);

      const res = await fetch(`/api/v1/search?${params.toString()}`, { signal: AbortSignal.timeout(800) });

      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setPagination(data.pagination || { page: pageNum, limit: ITEMS_PER_PAGE, total: 0, pages: 0 });
        setLoading(false);
        return;
      }
    } catch {}

    setProviders([]);
    setPagination({ page: pageNum, limit: ITEMS_PER_PAGE, total: 0, pages: 0 });
    setLoading(false);
  }, [searchQuery, activeCity, priceSort, minAge, maxAge]);

  useEffect(() => {
    fetchProviders(currentPage);
  }, [currentPage, fetchProviders]);

  useEffect(() => {
    fetch("/api/v1/search/filters")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setFilters(d); })
      .catch(() => {});
  }, []);

  const applyAllFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCity) params.set("city", activeCity);
    if (priceSort) params.set("sort", priceSort);
    if (minAge) params.set("minAge", minAge);
    if (maxAge) params.set("maxAge", maxAge);
    params.set("page", "1");
    router.push(`/providers?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyAllFilters();
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/providers?${params.toString()}`);
  };

  const navigateWithFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    router.push(`/providers?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCity("");
    setPriceSort("");
    setMinAge("");
    setMaxAge("");
    router.push("/providers");
  };

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--cream)", minHeight: "100vh", paddingTop: "120px", paddingBottom: "96px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }} className="sm:px-8">
          {/* Page Header */}
          <div style={{ marginBottom: "40px" }}>
            <p className="section-label">Browse Companions</p>
            <h2 className="section-title" style={{ fontFamily: "'VeganStyle', 'Jost', sans-serif", fontSize: "2rem", marginBottom: "14px", wordSpacing: "0.18em" }}>
              Discover Our Exclusive <em>Companions</em>
            </h2>
            <div className="divider" style={{ margin: "18px 0 28px" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "500px", fontWeight: 400, letterSpacing: "0.3px", lineHeight: "1.6" }}>
              Refined, discreet, and unforgettable. Browse India&apos;s most premium companions.
            </p>
          </div>

          {/* Search Bar — Modern Elegant */}
          <form onSubmit={handleSearch} style={{ marginBottom: "40px" }}>
            <div ref={searchRef} style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "20px",
              border: searchFocused ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(192,138,132,0.1)",
              padding: "5px 5px 5px 16px",
              boxShadow: searchFocused
                ? "0 4px 32px rgba(124,58,237,0.1), 0 0 0 2px rgba(124,58,237,0.12)"
                : "0 2px 24px rgba(13,4,6,0.04), inset 0 0 0 1px rgba(255,255,255,0.6)",
              transition: "all 0.3s ease",
              width: "100%",
              maxWidth: "860px",
              overflow: "hidden",
              boxSizing: "border-box",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={searchFocused ? "var(--accent)" : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: searchFocused ? 0.7 : 0.35, transition: "all 0.3s" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search by name, city, or keyword..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "14px 10px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontFamily: "'Jost', sans-serif",
                  outline: "none",
                  background: "transparent",
                  color: "var(--dark)",
                  letterSpacing: "0.01em",
                  fontWeight: 400,
                }}
              />
              <button type="submit" style={{
                padding: "12px 20px",
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                color: "var(--white)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
                transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; e.currentTarget.style.background = "linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.35)"; e.currentTarget.style.background = "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)"; }}
              >
                Search
              </button>
            </div>
          </form>

          <div style={{ marginBottom: "16px" }} className="mobile-filter-toggle">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "1.5px solid rgba(192,138,132,0.25)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--dark)",
                background: "var(--white)",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {mobileFilterOpen ? "▲ Hide Filters" : "▼ Show Filters"}
            </button>
          </div>

          <div className="providers-layout" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "36px" }}>
            <div>
              <div className={`sidebar-filters ${mobileFilterOpen ? "open" : ""}`}>
                <div style={{
                  background: "var(--white)",
                  borderRadius: "20px",
                  border: "1px solid rgba(192,138,132,0.1)",
                  padding: "28px 0",
                  boxShadow: "0 4px 28px rgba(13,4,6,0.04)",
                }}>
                  {/* City Filter */}
                  <div style={{ padding: "0 24px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <h3 style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dark)" }}>Location</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <button
                        onClick={() => { setActiveCity(""); navigateWithFilters({ city: "" }); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 14px",
                          fontSize: "0.78rem",
                          fontFamily: "'Jost', sans-serif",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          position: "relative",
                          ...(!activeCity ? { background: "rgba(124,58,237,0.07)", color: "var(--accent)", fontWeight: 500 } : { background: "transparent", color: "var(--text-muted)", fontWeight: 400 }),
                        }}
                        onMouseEnter={(e) => { if (activeCity) { e.currentTarget.style.background = "rgba(124,58,237,0.04)"; e.currentTarget.style.color = "var(--dark)"; }}}
                        onMouseLeave={(e) => { if (activeCity) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}
                      >
                        {!activeCity && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
                        All Cities
                      </button>
                      {(filters?.cities || []).map((city) => (
                        <button
                          key={city}
                          onClick={() => { setActiveCity(city); navigateWithFilters({ city }); }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 14px",
                            fontSize: "0.78rem",
                            fontFamily: "'Jost', sans-serif",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            position: "relative",
                            ...(activeCity === city ? { background: "rgba(124,58,237,0.07)", color: "var(--accent)", fontWeight: 500 } : { background: "transparent", color: "var(--text-muted)", fontWeight: 400 }),
                          }}
                          onMouseEnter={(e) => { if (activeCity !== city) { e.currentTarget.style.background = "rgba(124,58,237,0.04)"; e.currentTarget.style.color = "var(--dark)"; }}}
                          onMouseLeave={(e) => { if (activeCity !== city) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}
                        >
                          {activeCity === city && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(192,138,132,0.12), transparent)", margin: "0 24px" }} />

                  {/* Age Filter */}
                  <div style={{ padding: "24px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <h3 style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dark)" }}>Age Range</h3>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input
                          type="number"
                          placeholder="Min"
                          value={minAge}
                          onChange={(e) => setMinAge(e.target.value)}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "9px 12px",
                            border: "1px solid rgba(192,138,132,0.15)",
                            borderRadius: "10px",
                            fontSize: "0.8rem",
                            fontFamily: "'Jost', sans-serif",
                            outline: "none",
                            background: "rgba(192,138,132,0.03)",
                            color: "var(--dark)",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(192,138,132,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
                          onKeyDown={(e) => { if (e.key === "Enter") { applyAllFilters(); } }}
                        />
                      </div>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 300, flexShrink: 0, opacity: 0.5 }}>—</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxAge}
                          onChange={(e) => setMaxAge(e.target.value)}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "9px 12px",
                            border: "1px solid rgba(192,138,132,0.15)",
                            borderRadius: "10px",
                            fontSize: "0.8rem",
                            fontFamily: "'Jost', sans-serif",
                            outline: "none",
                            background: "rgba(192,138,132,0.03)",
                            color: "var(--dark)",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(192,138,132,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
                          onKeyDown={(e) => { if (e.key === "Enter") { applyAllFilters(); } }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(192,138,132,0.12), transparent)", margin: "0 24px" }} />

                  {/* Sort by Price */}
                  <div style={{ padding: "24px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <h3 style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dark)" }}>Price</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      {[
                        { value: "", label: "Default", icon: null },
                        { value: "asc", label: "Low to High", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg> },
                        { value: "desc", label: "High to Low", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg> },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setPriceSort(opt.value); navigateWithFilters({ sort: opt.value }); }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 14px",
                            fontSize: "0.78rem",
                            fontFamily: "'Jost', sans-serif",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            ...(priceSort === opt.value ? { background: "rgba(124,58,237,0.07)", color: "var(--accent)", fontWeight: 500 } : { background: "transparent", color: "var(--text-muted)", fontWeight: 400 }),
                          }}
                          onMouseEnter={(e) => { if (priceSort !== opt.value) { e.currentTarget.style.background = "rgba(124,58,237,0.04)"; e.currentTarget.style.color = "var(--dark)"; }}}
                          onMouseLeave={(e) => { if (priceSort !== opt.value) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(192,138,132,0.12), transparent)", margin: "0 24px" }} />

                  {/* Clear Filters */}
                  <div style={{ padding: "20px 24px 0" }}>
                    <button
                      onClick={clearFilters}
                      style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: "12px",
                        border: "1px solid rgba(192,138,132,0.12)",
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "'Jost', sans-serif",
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(124,58,237,0.04)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(192,138,132,0.12)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
                  <div style={{ width: 40, height: 40, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite", marginBottom: "16px" }} />
                  <p style={{ fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Searching companions...</p>
                </div>
              ) : providers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", border: "1px dashed var(--taupe)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 16px", opacity: 0.4 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "var(--dark)", marginBottom: "8px" }}>No Companions Found</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
                    Try adjusting your search or filter criteria to discover more premium companions.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600, marginBottom: "20px" }}>
                    Showing {providers.length} of {pagination.total} Companions
                  </div>

                  <div className="models-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "18px" }}>
                    {providers.map((p, i) => (
                      <div
                        key={p._id}
                        className="model-card"
                        style={{ position: "relative", borderRadius: "24px", overflow: "hidden", cursor: "pointer", aspectRatio: "2/3", boxShadow: "0 8px 32px rgba(13,4,6,0.13)", transition: "transform 0.35s ease, box-shadow 0.35s ease", animationDelay: `${i * 0.08}s` }}
                      >
                        <img
                          src={p.profileImages?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                          alt={p.name}
                          className="model-card-img"
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block", transition: "transform 0.6s ease" }}
                        />

                        <div className="card-top-grad" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to bottom, rgba(10,4,20,0.55) 0%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />

                        <div className="card-header" style={{ position: "absolute", top: "20px", left: "20px", right: "20px", zIndex: 2, textAlign: "left" }}>
                          <span className="name" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--white)", display: "block", lineHeight: 1.2, textShadow: "0 2px 12px rgba(0,0,0,0.4)", wordBreak: "break-word" }}>
                            {p.name}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                            {p.isAvailable ? (
                              <span className="avail-tag" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 400, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>
                                <span className="spin" style={{ display: "inline-block", width: "12px", height: "12px", border: "1.5px solid rgba(255,255,255,0.6)", borderTopColor: "#fff", borderRadius: "50%", animation: "spinLoader 1s linear infinite", flexShrink: 0 }} />
                                Available Now
                              </span>
                            ) : (
                              <span className="avail-tag booked-tag" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 400, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                                <span className="spin" style={{ display: "inline-block", width: "10px", height: "10px", border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "rgba(255,255,255,0.5)", borderRadius: "50%", animation: "spinLoader 1s linear infinite", flexShrink: 0 }} />
                                Booked Tonight
                              </span>
                            )}
                            {p.isVerified && (
                              <span style={{ background: "var(--accent)", color: "#fff", fontSize: "0.45rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", padding: "2px 6px", borderRadius: "50px", lineHeight: 1 }}>✓</span>
                            )}
                          </div>
                        </div>

                        <div className="card-footer" style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <div className="identity" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(20,10,25,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "50px", padding: "5px 12px 5px 5px", flex: 1, minWidth: 0, overflow: "hidden" }}>
                            <div className="avatar" style={{ width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.25)" }}>
                              <img src={p.profileImages?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                            </div>
                            <div className="id-text" style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
                              <span className="handle" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {p.name}
                              </span>
                              <span className="meta" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.5rem", fontWeight: 300, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {p.city}{p.age ? ` · ${p.age} yrs` : ""}
                              </span>
                            </div>
                          </div>
                          {p.isAvailable ? (
                            <a href={`/providers/${p._id}`} className="book-btn" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.06em", color: "#fff", background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", borderRadius: "50px", padding: "8px 14px", whiteSpace: "nowrap", textDecoration: "none", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", flexShrink: 0, display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 4px 16px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2"/></svg>
                              Book Her
                            </a>
                          ) : (
                            <a className="book-btn booked-btn" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", background: "rgba(20,10,25,0.35)", borderRadius: "50px", padding: "8px 14px", whiteSpace: "nowrap", textDecoration: "none", flexShrink: 0, cursor: "not-allowed", pointerEvents: "none", boxShadow: "none" }}>
                              Unavailable
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "48px" }}>
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        style={{
                          padding: "9px 18px",
                          borderRadius: "12px",
                          border: "1px solid rgba(192,138,132,0.15)",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          color: currentPage <= 1 ? "rgba(192,138,132,0.3)" : "var(--text-muted)",
                          background: "rgba(255,255,255,0.6)",
                          backdropFilter: "blur(8px)",
                          cursor: currentPage <= 1 ? "default" : "pointer",
                          fontFamily: "'Jost', sans-serif",
                          transition: "all 0.2s",
                          userSelect: "none",
                        }}
                        onMouseEnter={(e) => { if (currentPage > 1) { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(255,255,255,0.9)"; }}}
                        onMouseLeave={(e) => { if (currentPage > 1) { e.currentTarget.style.borderColor = "rgba(192,138,132,0.15)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "rgba(255,255,255,0.6)"; }}}
                      >
                        ← Prev
                      </button>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)", padding: "4px", borderRadius: "14px", border: "1px solid rgba(192,138,132,0.08)" }}>
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                          .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - currentPage) <= 2)
                          .map((p, idx, arr) => (
                            <span key={p} style={{ display: "flex", alignItems: "center" }}>
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span style={{ padding: "0 6px", color: "rgba(192,138,132,0.4)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2px" }}>•••</span>
                              )}
                              <button
                                onClick={() => goToPage(p)}
                                style={{
                                  minWidth: "34px",
                                  height: "34px",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  fontFamily: "'Jost', sans-serif",
                                  transition: "all 0.2s",
                                  borderRadius: "10px",
                                  border: "none",
                                  background: currentPage === p ? "var(--accent)" : "transparent",
                                  color: currentPage === p ? "#fff" : "var(--text-muted)",
                                  boxShadow: currentPage === p ? "0 2px 12px rgba(124,58,237,0.25)" : "none",
                                }}
                                onMouseEnter={(e) => { if (currentPage !== p) { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "var(--accent)"; }}}
                                onMouseLeave={(e) => { if (currentPage !== p) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}
                              >
                                {p}
                              </button>
                            </span>
                          ))}
                      </div>
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= pagination.pages}
                        style={{
                          padding: "9px 18px",
                          borderRadius: "12px",
                          border: "1px solid rgba(192,138,132,0.15)",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          color: currentPage >= pagination.pages ? "rgba(192,138,132,0.3)" : "var(--text-muted)",
                          background: "rgba(255,255,255,0.6)",
                          backdropFilter: "blur(8px)",
                          cursor: currentPage >= pagination.pages ? "default" : "pointer",
                          fontFamily: "'Jost', sans-serif",
                          transition: "all 0.2s",
                          userSelect: "none",
                        }}
                        onMouseEnter={(e) => { if (currentPage < pagination.pages) { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(255,255,255,0.9)"; }}}
                        onMouseLeave={(e) => { if (currentPage < pagination.pages) { e.currentTarget.style.borderColor = "rgba(192,138,132,0.15)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "rgba(255,255,255,0.6)"; }}}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .model-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 50px rgba(124,58,237,0.18);
        }
        .model-card:hover img { transform: scale(1.06); }
        .model-card:hover .card-footer .identity .avatar img { transform: none; }
        .model-card .card-footer .book-btn:hover {
          background: linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%) !important;
          transform: scale(1.06) !important;
          box-shadow: 0 8px 28px rgba(124,58,237,0.7), inset 0 1px 0 rgba(255,255,255,0.2) !important;
        }
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1000px) {
          .models-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 1024px) {
          .providers-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 800px) {
          .models-grid { gap: 14px; }
          .model-card .card-header .name { font-size: 1rem; }
          .model-card .card-footer .book-btn { font-size: 0.5rem; padding: 6px 10px; }
          .model-card .card-footer .identity { padding: 4px 10px 4px 4px; gap: 6px; }
          .model-card .card-footer .identity .avatar { width: 24px; height: 24px; }
        }
        @media (max-width: 576px) {
          .models-grid { grid-template-columns: 1fr !important; max-width: 340px; margin: 0 auto; }
        }
      `}</style>
    </>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "var(--cream)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "120px" }}>
        <div style={{ width: 40, height: 40, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite", marginBottom: "16px" }} />
        <p style={{ fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Loading companions...</p>
      </div>
    }>
      <ProvidersContent />
    </Suspense>
  );
}
