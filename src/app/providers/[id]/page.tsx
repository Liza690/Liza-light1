"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ProductGallery from "@/components/sections/ProductGallery";
import { companions } from "@/data/companions";

interface Service {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  duration: number;
  price: number;
  currency: string;
}

interface AvailabilitySlot {
  _id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  specificDate?: string;
  isRecurring?: boolean;
}

interface ProviderData {
  _id: string;
  name: string;
  bio?: string;
  profileImages?: string[];
  city: string;
  languages?: string[];
  experienceLevel?: string;
  experienceYears?: number;
  age?: number;
  height?: string;
  weight?: string;
  isAvailable: boolean;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  tags?: string[];
  services?: Service[];
  availability?: AvailabilitySlot[];
  bookedSlots?: string[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ProviderDetail() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" | "info" } | null>(null);

  const showToast = (msg: string, type: "error" | "success" | "info" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const convertTo24Hour = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const getNextDateForDayOfWeek = (dayOfWeek: number) => {
    const resultDate = new Date();
    const currentDay = resultDate.getDay();
    let distance = dayOfWeek - currentDay;
    if (distance < 0) {
      distance += 7;
    }
    resultDate.setDate(resultDate.getDate() + distance);
    return resultDate.toISOString();
  };

  useEffect(() => {
    if (!id) return;

    const matched = companions.find((c) => String(c.id) === String(id));

    if (matched) {
      const basePrice = Number(matched.price.replace(/[^0-9]/g, ""));

      const fallbackData: ProviderData = {
        _id: String(matched.id),
        name: matched.name,
        bio: matched.bio,
        profileImages: matched.images,
        city: matched.city,
        languages: matched.langs.split(", "),
        experienceLevel: matched.pro ? "Expert" : "Intermediate",
        experienceYears: Math.max(2, matched.age - 21),
        age: matched.age,
        height: matched.height,
        weight: matched.weight,
        isAvailable: true,
        isVerified: matched.verified,
        averageRating: 4.9,
        totalReviews: Math.round(Number(matched.bookings) / 10),
        totalBookings: Number(matched.bookings),
        tags: [
            ...(matched.isNew ? ["New Arrival"] : []),
            ...(matched.pro ? ["Top Rated"] : []),
            "Companion",
            "Discreet",
          ],
        services: matched.services.map((s, idx) => ({
          _id: `svc-${idx}`,
          name: s,
          description: `Premium ${s} experience provided with elegance and full discretion.`,
          category: "Companion",
          duration: 60,
          price: s === "Overnight" ? basePrice * 7 : basePrice,
          currency: "INR",
        })),
        availability: [
          { _id: "av-1", dayOfWeek: new Date().getDay(), startTime: "10:00 AM", endTime: "11:00 AM", isBooked: false },
          { _id: "av-2", dayOfWeek: new Date().getDay(), startTime: "2:00 PM", endTime: "3:00 PM", isBooked: false },
          { _id: "av-3", dayOfWeek: new Date().getDay(), startTime: "5:00 PM", endTime: "6:00 PM", isBooked: false },
          { _id: "av-4", dayOfWeek: new Date().getDay(), startTime: "9:00 PM", endTime: "10:00 PM", isBooked: false },
          { _id: "av-5", dayOfWeek: (new Date().getDay() + 1) % 7, startTime: "11:00 AM", endTime: "12:00 PM", isBooked: false },
          { _id: "av-6", dayOfWeek: (new Date().getDay() + 1) % 7, startTime: "3:00 PM", endTime: "4:00 PM", isBooked: false },
          { _id: "av-7", dayOfWeek: (new Date().getDay() + 1) % 7, startTime: "6:00 PM", endTime: "7:00 PM", isBooked: false },
          { _id: "av-8", dayOfWeek: (new Date().getDay() + 1) % 7, startTime: "10:00 PM", endTime: "11:00 PM", isBooked: false },
        ]
      };

      setProvider(fallbackData);
      setLoading(false);
    } else {
      setError("Provider details could not be found.");
      setLoading(false);
    }
  }, [id]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-[66px] bg-[var(--deeper)] min-h-screen flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-[2px] text-[var(--text-muted)] animate-pulse">Loading Provider Profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !provider) {
    return (
      <>
        <Navbar />
        <div className="pt-[66px] bg-[var(--deeper)] min-h-screen flex flex-col items-center justify-center text-white p-4">
          <div className="rounded-2xl max-w-md text-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", padding: "32px" }}>
            <span className="text-3xl block" style={{ marginBottom: "16px", fontSize: "32px" }}>⚠️</span>
            <h2 className="text-lg font-bold" style={{ marginBottom: "12px", fontSize: "20px" }}>Error Loading Profile</h2>
            <p className="text-sm text-[var(--text-muted)]" style={{ marginBottom: "24px" }}>{error || "Provider details could not be found."}</p>
            <Link href="/" className="inline-block bg-[var(--accent)] hover:bg-[#5B21B6] text-white text-xs font-bold tracking-[2px] uppercase rounded-lg transition-colors" style={{ padding: "14px 24px", textDecoration: "none" }}>
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const bookedSet = new Set(provider.bookedSlots || []);

  const isSlotDateBooked = (date: Date, time: string): boolean => {
    const ds = date.toISOString().split("T")[0];
    const t = /^\d{2}:\d{2}$/.test(time) ? time : convertTo24Hour(time);
    return bookedSet.has(`${ds}|${t}`);
  };

  const getDateForDayOfWeek = (dayOfWeek: number, skipWeeks: number = 0): Date => {
    const today = new Date();
    const currentDay = today.getDay();
    let distance = dayOfWeek - currentDay;
    if (distance <= 0) distance += 7;
    distance += skipWeeks * 7;
    const d = new Date(today);
    d.setDate(today.getDate() + distance);
    return d;
  };

  const getNextAvailable = (dayOfWeek: number, time: string): { date: Date; skipWeeks: number } => {
    for (let skip = 0; skip < 52; skip++) {
      const d = getDateForDayOfWeek(dayOfWeek, skip);
      if (!isSlotDateBooked(d, time)) return { date: d, skipWeeks: skip };
    }
    return { date: getDateForDayOfWeek(dayOfWeek), skipWeeks: 0 };
  };

  const recurringSlots: Record<number, { time: string; isBooked: boolean; skipWeeks: number }[]> = {};
  const dateSpecificSlots: Record<string, { time: string; isBooked: boolean; date: Date }[]> = {};

  if (provider.availability) {
    provider.availability.forEach((slot) => {
      if (slot.specificDate) {
        const dateKey = new Date(slot.specificDate).toISOString().split("T")[0];
        if (!dateSpecificSlots[dateKey]) dateSpecificSlots[dateKey] = [];
        dateSpecificSlots[dateKey].push({ time: slot.startTime, isBooked: slot.isBooked, date: new Date(slot.specificDate) });
      } else {
        const { skipWeeks } = getNextAvailable(slot.dayOfWeek, slot.startTime);
        if (!recurringSlots[slot.dayOfWeek]) recurringSlots[slot.dayOfWeek] = [];
        recurringSlots[slot.dayOfWeek].push({ time: slot.startTime, isBooked: skipWeeks > 0, skipWeeks });
      }
    });
  }

  const hasAvailability = Object.keys(recurringSlots).length > 0 || Object.keys(dateSpecificSlots).length > 0;
  const servicesList = provider.services || [];

  const formatDate = (d: Date): string =>
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const totalSelectedPrice = servicesList
    .filter((s) => selectedServices.includes(s._id))
    .reduce((sum, s) => sum + s.price, 0);

  const baselinePrice = servicesList.length > 0 ? Math.min(...servicesList.map(s => s.price)) : 0;

  const displayPriceText = totalSelectedPrice > 0 
    ? `₹${totalSelectedPrice.toLocaleString()}` 
    : (baselinePrice > 0 ? `₹${baselinePrice.toLocaleString()}` : "Price on Request");

  return (
    <>
      <Navbar />

      {toast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, minWidth: 320, maxWidth: 480,
          padding: "14px 20px",
          borderRadius: 12,
          display: "flex", alignItems: "center", gap: 12,
          fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.5px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          background: toast.type === "error" ? "rgba(124,58,237,0.12)" : toast.type === "success" ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${toast.type === "error" ? "rgba(124,58,237,0.4)" : toast.type === "success" ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.15)"}`,
          color: toast.type === "error" ? "var(--gold)" : toast.type === "success" ? "var(--gold)" : "#ffffff",
          backdropFilter: "blur(12px)",
        }}>
          <span style={{ fontSize: 16 }}>
            {toast.type === "error" ? "⛔" : toast.type === "success" ? "✅" : "ℹ️"}
          </span>
          {toast.msg}
        </div>
      )}

      <div 
        className="bg-gradient-to-b from-[var(--deeper)] via-[var(--dark)] to-[var(--deeper)] min-h-screen text-white flex justify-center items-start"
        style={{ paddingTop: "140px", paddingBottom: "96px" }}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 provider-detail-page">
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-start justify-center">
            
            {/* ===== LEFT: Bento Gallery Layout (Sticky) ===== */}
            <div className="lg:col-span-7 sticky top-[140px] self-start">
              <ProductGallery images={provider.profileImages} name={provider.name} />
            </div>

            {/* ===== RIGHT: Companion Details ===== */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* Profile Header Widget */}
              <div 
                className="bg-gradient-to-br from-[var(--dark-mid)] to-[var(--dark)] border border-white/5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-[var(--accent)]/20 transition-all duration-300"
                style={{ padding: "36px" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-colors pointer-events-none" />

                {/* Name row */}
                <div className="flex items-center gap-2.5 mb-2">
                  <h1 className="font-['Bebas_Neue'] text-5xl sm:text-6xl tracking-[1.5px] text-white leading-none">
                    {provider.name}
                  </h1>
                  {provider.isVerified && (
                    <span
                      className="bg-[var(--accent)] text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md shadow-[var(--accent)]/35 shrink-0"
                      title="Verified"
                    >
                      ✓
                    </span>
                  )}
                </div>

                {/* City · Age */}
                <p style={{ marginTop: 16 }} className="text-xs text-[var(--text-muted)] uppercase tracking-[2px] font-semibold flex items-center gap-2 mb-6">
                  <span>{provider.city}</span>
                  {provider.age && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/20 inline-block" />
                      <span>{provider.age} yrs old</span>
                    </>
                  )}
                </p>

                {/* Divider */}
                <div className="border-t border-white/5 mb-6" />

                {/* Price + Stars side by side */}
                <div className="flex items-end justify-between gap-4">
                  {/* Stars */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = provider.averageRating || 0;
                        const filled = star <= Math.floor(rating);
                        const partial = !filled && star === Math.ceil(rating) && rating % 1 !== 0;
                        return (
                          <span
                            key={star}
                            style={{
                              fontSize: 20,
                              lineHeight: 1,
                              color: filled ? "var(--accent)" : partial ? "var(--accent)" : "var(--dark-mid)",
                              opacity: partial ? 0.5 : 1,
                            }}
                          >
                            ★
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-semibold">
                      <span className="text-white font-bold">
                        {provider.averageRating > 0 ? provider.averageRating.toFixed(1) : "N/A"}
                      </span>
                      &nbsp;({provider.totalReviews || 0} {provider.totalReviews === 1 ? "review" : "reviews"})
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="font-['Bebas_Neue'] text-4xl sm:text-5xl text-[var(--gold)] leading-none tracking-wide">
                      {displayPriceText}
                    </div>
                    <div style={{ marginTop: 16 }} className="text-[10px] text-[var(--text-muted)] tracking-[1.5px] font-bold uppercase mt-1">
                      {totalSelectedPrice > 0 ? "Selected Total" : "Starting Price"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 4, paddingLeft: 4 }}>
                {provider.isVerified && (
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 16px", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "var(--gold)", borderRadius: 999 }}>
                    ✓ Verified
                  </span>
                )}
                {provider.isAvailable ? (
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 16px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "var(--accent)", borderRadius: 999 }}>
                    ● Available Now
                  </span>
                ) : (
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)", borderRadius: 999 }}>
                    ○ Offline
                  </span>
                )}
                {provider.experienceLevel && (
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 999 }}>
                    {provider.experienceLevel}
                  </span>
                )}
                {provider.tags?.map(t => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 999 }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Bio widget */}
              {provider.bio && (
                <div 
                  className="bg-gradient-to-br from-[var(--dark-mid)] to-[var(--dark)] border border-white/5 rounded-2xl shadow-xl hover:border-[var(--accent)]/20 transition-all duration-300"
                  style={{ padding: "32px" }}
                >
                  <h3 style={{ marginBottom: 20 }} className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--gold)] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    Bio & Details
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                    {provider.bio}
                  </p>
                </div>
              )}

              {/* Companion Specifications */}
              <div 
                className="bg-gradient-to-br from-[var(--dark-mid)] to-[var(--dark)] border border-white/5 rounded-2xl shadow-xl hover:border-[var(--accent)]/20 transition-all duration-300"
                style={{ padding: "32px" }}
              >
                <h3 style={{ marginBottom: 40 }} className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--gold)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-3.5">
                  <div style={{ paddingTop: 15, paddingBottom: 10 }} className="bg-white/2 border border-white/5 rounded-xl pt-8 px-4 pb-5 text-center flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2" x2="12" y2="22"/>
                        <polyline points="17 7 12 2 7 7"/>
                        <polyline points="7 17 12 22 17 17"/>
                      </svg>
                    </div>
                    <div className="font-['Bebas_Neue'] text-xl text-white tracking-[0.5px]">{provider.height || "N/A"}</div>
                    <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-[var(--text-muted)]">Height</div>
                  </div>
                  <div style={{ paddingTop: 15, paddingBottom: 10 }} className="bg-white/2 border border-white/5 rounded-xl pt-8 px-4 pb-5 text-center flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="3"/>
                        <path d="M6.5 8h11l2 13H4.5z"/>
                      </svg>
                    </div>
                    <div className="font-['Bebas_Neue'] text-xl text-white tracking-[0.5px]">{provider.weight || "N/A"}</div>
                    <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-[var(--text-muted)]">Weight</div>
                  </div>
                  <div style={{ paddingTop: 15, paddingBottom: 10 }} className="bg-white/2 border border-white/5 rounded-xl pt-8 px-4 pb-5 text-center flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </div>
                    <div className="font-['Bebas_Neue'] text-lg text-white tracking-[0.5px] truncate px-1 max-w-full">
                      {provider.languages && provider.languages.length > 0 ? provider.languages.join(", ") : "English"}
                    </div>
                    <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-[var(--text-muted)]">Languages</div>
                  </div>
                  <div style={{ paddingTop: 15, paddingBottom: 10 }} className="bg-white/2 border border-white/5 rounded-xl pt-8 px-4 pb-5 text-center flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2"/>
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                        <line x1="12" y1="12" x2="12" y2="16"/>
                        <line x1="10" y1="14" x2="14" y2="14"/>
                      </svg>
                    </div>
                    <div className="font-['Bebas_Neue'] text-xl text-white tracking-[0.5px]">
                      {provider.experienceYears ? `${provider.experienceYears} Yrs` : "Pro"}
                    </div>
                    <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-[var(--text-muted)]">Experience ({provider.experienceLevel || "Mid"})</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Services Provided widget (Selectable) */}
              <div 
                className="bg-gradient-to-br from-[var(--dark-mid)] to-[var(--dark)] border border-white/5 rounded-2xl shadow-xl hover:border-[var(--accent)]/20 transition-all duration-300"
                style={{ padding: "36px" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 style={{ marginBottom: 40 }} className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--gold)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    Select Services Provided
                  </h3>
                  <span style={{paddingRight:10, paddingLeft:10, paddingTop:2, paddingBottom:2}} className="text-[10px] text-[var(--text-muted)] font-semibold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                    {selectedServices.length} Selected
                  </span>
                </div>
                
                {servicesList.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {servicesList.map((service) => {
                      const isSelected = selectedServices.includes(service._id);
                      return (
                        <div 
                          key={service._id} 
                          onClick={() => toggleService(service._id)}
                          className={`border rounded-2xl mt-4 flex justify-between items-center transition-all cursor-pointer select-none ${
                            isSelected 
                              ? "border-[var(--accent)] shadow-[0_0_18px_rgba(124,58,237,0.3)] bg-[var(--accent)]/10 scale-[1.01]" 
                              : "bg-white/3 hover:bg-white/6 border-white/8 hover:border-white/20"
                          }`}
                          style={{ padding: "16px 20px" }}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isSelected ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-white/25"
                              }`}>
                                {isSelected && "✓"}
                              </span>
                              <h4 className="text-sm font-bold text-white tracking-wide">{service.name}</h4>
                            </div>
                            {service.description && (
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed" style={{ paddingLeft: "28px" }}>{service.description}</p>
                            )}
                            <div className="flex items-center gap-1.5" style={{ paddingLeft: "28px" }}>
                              <span className="text-[var(--gold)]">⏱</span>
                              <span className="text-[11px] text-[var(--text-muted)] font-semibold tracking-wide">{service.duration} Mins</span>
                            </div>
                          </div>
                          <div className="font-['Bebas_Neue'] text-2xl text-white tracking-[1px] ml-6 shrink-0">
                            ₹{service.price.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic text-center py-2">
                    No active services listed. Contact directly for service inquiries.
                  </p>
                )}
              </div>

              {/* Dynamic Availability section */}
              <div 
                className="bg-gradient-to-br from-[var(--dark-mid)] to-[var(--dark)] border border-white/5 rounded-2xl shadow-xl hover:border-[var(--accent)]/20 transition-all duration-300"
                style={{ padding: "36px" }}
              >
                <h3 style={{ marginBottom: 40 }} className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--gold)] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  Availability & Slots
                </h3>
                
                {hasAvailability ? (
                  <div className="flex flex-col gap-5">
                    {Object.entries(dateSpecificSlots)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([dateKey, slots]) => {
                        const date = new Date(dateKey);
                        const dayName = DAYS[date.getDay()];
                        const dateLabel = date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
                        const allBooked = slots.every(s => s.isBooked);
                        return (
                          <div key={dateKey} className="bg-white/2 border border-white/5 rounded-2xl" style={{ padding: "16px 20px", borderColor: "rgba(124,58,237,0.2)" }}>
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <p className="text-sm font-bold text-white tracking-wide">{dayName}</p>
                                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.5px", marginTop: 2 }}>
                                  📅 {dateLabel}
                                </p>
                              </div>
                              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "var(--gold)" }}>
                                One-time
                              </span>
                            </div>
                            {allBooked && (
                              <p style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", margin: "6px 0 10px" }}>⛔ Fully Booked</p>
                            )}
                            <div className="grid grid-cols-4 gap-2 mt-3">
                              {slots.map(({ time, isBooked }) => {
                                const key = `${dayName}-${time}-${dateKey}`;
                                const isSelected = selectedSlot === key;
                                return (
                                  <button
                                    key={key}
                                    disabled={isBooked}
                                    onClick={() => { if (!isBooked) setSelectedSlot(isSelected ? null : key); }}
                                    style={{ padding: "10px 4px" }}
                                    className={`text-[11px] font-bold tracking-[0.5px] rounded-xl transition-all border text-center ${
                                      isBooked ? "bg-white/2 border-white/5 text-white/20 cursor-not-allowed line-through"
                                        : isSelected ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-md cursor-pointer scale-[1.04]"
                                        : "bg-white/3 border-white/8 text-[var(--text-muted)] hover:border-white/25 hover:text-white hover:bg-white/6 cursor-pointer"
                                    }`}
                                  >
                                    {time}
                                    {isBooked && <span style={{ display: "block", fontSize: 8, color: "var(--accent)", textDecoration: "none" }}>BOOKED</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                    })}

                    {DAYS.map((dayName, idx) => {
                      const daySlots = recurringSlots[idx] || [];
                      if (daySlots.length === 0) return null;
                      const minSkip = Math.min(...daySlots.map(s => s.skipWeeks));
                      const headerDate = getDateForDayOfWeek(idx, minSkip);
                      const allBooked = daySlots.every(s => s.isBooked);
                      return (
                        <div key={dayName} className="bg-white/2 border border-white/5 rounded-2xl" style={{ padding: "16px 20px" }}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-white tracking-wide">{dayName}</p>
                            <span style={{paddingRight:10, paddingLeft:10, paddingTop:5, paddingBottom:5}} className="text-[9px] text-[var(--text-muted)] uppercase tracking-[1.5px] font-semibold bg-white/5 border border-white/8 px-2 py-1 rounded-full">Weekly Recurring</span>
                          </div>
                          <p style={{ fontSize: 10, color: allBooked ? "var(--gold)" : "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
                            {allBooked ? `📅 Next: ${dayName} ${formatDate(headerDate)}` : `Week of ${formatDate(headerDate)}`}
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {daySlots.map(({ time, isBooked, skipWeeks }) => {
                              const key = `${dayName}-${time}`;
                              const bookedKey = skipWeeks > 0 ? `${key}──skip${skipWeeks}` : key;
                              const isThisKey = selectedSlot === key;
                              const isBookedKey = selectedSlot === bookedKey;
                              const isSelected = isThisKey || isBookedKey;
                              return (
                                <button
                                  key={key}
                                  onClick={() => {
                                    if (isBooked) {
                                      setSelectedSlot(isBookedKey ? null : bookedKey);
                                    } else {
                                      setSelectedSlot(isThisKey ? null : key);
                                    }
                                  }}
                                  style={{ padding: "10px 4px" }}
                                  className={`text-[11px] font-bold tracking-[0.5px] rounded-xl transition-all border text-center ${
                                    isBooked
                                      ? isBookedKey
                                        ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-md scale-[1.04] cursor-pointer"
                                        : "bg-white/3 border-dashed border-[var(--gold)]/40 text-[var(--gold)] hover:border-[var(--gold)] hover:text-white cursor-pointer"
                                      : isSelected
                                      ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-md cursor-pointer scale-[1.04]"
                                      : "bg-white/3 border-white/8 text-[var(--text-muted)] hover:border-white/25 hover:text-white hover:bg-white/6 cursor-pointer"
                                  }`}
                                >
                                  {time}
                                  {isBooked && (
                                    <span style={{ display: "block", fontSize: 8, textDecoration: "none" }}>
                                      {isBookedKey ? `✓ NEXT` : `NEXT`}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic text-center py-2">
                    No active availability slots found. Contact directly for booking inquiries.
                  </p>
                )}
                
                {selectedSlot && (
                  <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[var(--gold)] text-xs font-semibold rounded-xl mt-4 text-center tracking-wide" style={{ padding: "12px 16px" }}>
                    ✓ Selected: {selectedSlot.replace(/-/g, " · ").replace(/──skip(\d+)/, (_, w) => ` (+${w}wk)`)}
                  </div>
                )}
              </div>

              {/* Book session CTA widget */}
              <div 
                className="bg-gradient-to-br from-[var(--dark-mid)] to-[var(--dark)] border border-white/5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-[var(--accent)]/25 transition-all duration-300"
                style={{ padding: "32px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-[var(--deeper)] opacity-50 pointer-events-none" />
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="flex items-center justify-center w-full min-h-[58px] rounded-xl bg-[var(--accent)] hover:bg-[#5B21B6] text-white text-sm font-bold tracking-[2.5px] uppercase text-center transition-all hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] hover:-translate-y-0.5 cursor-pointer border border-[var(--gold)]/30 px-6 py-4 shadow-lg"
                >
                  ✦ Book Session Now
                </button>
                <p style={{ marginTop: 15 }} className="text-[10px] text-[var(--text-muted)] text-center mt-3 tracking-[0.5px] font-semibold">
                  We will confirm your booking via a private channel.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Booked message modal */}
      {bookingModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
          onClick={() => setBookingModalOpen(false)}
        >
          <div
            style={{
              background: "var(--dark-mid)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 16, padding: "36px 32px", width: "100%", maxWidth: 420,
              position: "relative", textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBookingModalOpen(false)}
              style={{
                position: "absolute", top: 12, right: 12, width: 30, height: 30,
                background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                color: "#aaa", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, color: "#fff", marginBottom: 16 }}>Sorry!</h3>
            <p style={{ color: "#999", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
              All companions are currently booked. Please try again later.
            </p>
            <button
              onClick={() => setBookingModalOpen(false)}
              style={{
                background: "var(--accent)", color: "#fff", border: "none", padding: "14px 32px",
                fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 800,
                letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
                borderRadius: 999, transition: "all 0.3s",
              }}
            >OK</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
