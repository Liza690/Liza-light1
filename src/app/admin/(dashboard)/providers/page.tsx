"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

interface Provider { _id: string; name: string; city: string; bio?: string; profileImages?: string[]; averageRating: number; totalReviews: number; }
interface ServiceItem  { id: number; name: string; description: string; duration: number; price: number; }
interface SlotItem     { id: number; dayOfWeek: number; startTime: string; endTime: string; isRecurring: boolean; specificDate?: string; }
interface ExService    { _id: string; name: string; price: number; duration: number; description?: string; }
interface ExSlot       { _id: string; dayOfWeek: number; startTime: string; endTime: string; isRecurring: boolean; specificDate?: string; isBooked: boolean; }

/* ── shared style tokens (all inline — zero global CSS conflict) ── */
const inp: React.CSSProperties  = { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"var(--white)", padding:"10px 12px", fontSize:12, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
const lbl: React.CSSProperties  = { display:"block", fontSize:9, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase" as const, color:"var(--text-muted)", marginBottom:5 };
const card: React.CSSProperties = { background:"#181818", border:"1px solid rgba(255,255,255,0.06)", padding:24 };
const sec: React.CSSProperties  = { paddingTop:20, marginTop:20, borderTop:"1px solid rgba(255,255,255,0.06)" };
const secTitle: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:20, letterSpacing:2, margin:"0 0 14px", color:"var(--white)" };
const smallBtn = (bg:string, border?:string): React.CSSProperties => ({
  padding:"7px 14px", background:bg, border: border ?? "none",
  color:"var(--white)", fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase" as const,
  cursor:"pointer", fontFamily:"inherit", flexShrink:0,
});

export default function ProvidersPage() {
  const [providers,  setProviders]  = useState<Provider[]>([]);
  const [selected,   setSelected]   = useState<Provider|null>(null);
  const [exServices, setExServices] = useState<ExService[]>([]);
  const [exSlots,    setExSlots]    = useState<ExSlot[]>([]);
  const [loadingP,   setLoadingP]   = useState(true);
  const [subTab,     setSubTab]     = useState<"svc"|"slot">("svc");
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState<{ok:boolean;text:string}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Provider basic info ── */
  const [pf, setPf] = useState({
    name:"", city:"", bio:"", age:23,
    height:"5'6\"", weight:"52 kg",
    languages:"English, Hindi", tags:"",
    experienceLevel:"intermediate", experienceYears:2,
  });

  /* ── Images to upload ── */
  const [imageFiles,    setImageFiles]    = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  /* ── Inline services list ── */
  const [svcList,  setSvcList]  = useState<ServiceItem[]>([]);
  const [newSvc,   setNewSvc]   = useState({ name:"", description:"", duration:60, price:3000 });

  /* ── Inline slots list ── */
  const [slotList, setSlotList] = useState<SlotItem[]>([]);
  const [newSlot,  setNewSlot]  = useState({ dayOfWeek:1, startTime:"10:00", endTime:"11:00", isRecurring:true, specificDate:"" });

  /* ── Add service / slot to manage-panel ── */
  const [addSvcForm, setAddSvcForm]   = useState({ name:"", description:"", duration:60, price:3000 });
  const [addSlotForm, setAddSlotForm] = useState({ dayOfWeek:1, startTime:"10:00", endTime:"11:00", isRecurring:true, specificDate:"" });

  /* ── Editing an existing slot ── */
  const [editingSlot, setEditingSlot] = useState<ExSlot | null>(null);
  const [editSlotForm, setEditSlotForm] = useState({ dayOfWeek:1, startTime:"10:00", endTime:"11:00", isRecurring:true, specificDate:"" });

  const flash = (ok:boolean, text:string) => { setMsg({ok,text}); setTimeout(()=>setMsg(null), 4000); };

  const fetchProviders = useCallback(async () => {
    setLoadingP(true);
    const r = await fetch("/api/v1/admin/providers?limit=100");
    if (r.ok) { const d = await r.json(); setProviders(d.providers ?? []); }
    setLoadingP(false);
  }, []);

  const fetchDetails = useCallback(async (id:string) => {
    const [sr, slr] = await Promise.all([
      fetch(`/api/v1/admin/providers/${id}/services`),
      fetch(`/api/v1/admin/providers/${id}/availability`),
    ]);
    if (sr.ok)  { const d = await sr.json();  setExServices(d.services ?? []); }
    if (slr.ok) { const d = await slr.json(); setExSlots(d.slots ?? []); }
  }, []);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);
  useEffect(() => { if (selected) fetchDetails(selected._id); }, [selected, fetchDetails]);

  /* ── Image picker ── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked  = Array.from(e.target.files ?? []);
    const merged  = [...imageFiles, ...picked].slice(0, 5);
    setImageFiles(merged);
    setImagePreviews(merged.map(f => URL.createObjectURL(f)));
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    const next = imageFiles.filter((_,i) => i !== idx);
    setImageFiles(next);
    setImagePreviews(next.map(f => URL.createObjectURL(f)));
  };

  /* ── Add to inline service list ── */
  const pushService = () => {
    if (!newSvc.name.trim()) return;
    setSvcList(p => [...p, { ...newSvc, id: Date.now() }]);
    setNewSvc({ name:"", description:"", duration:60, price:3000 });
  };

  /* ── Add to inline slot list ── */
  const pushSlot = () => {
    if (!newSlot.isRecurring && !newSlot.specificDate) return;
    setSlotList(p => [...p, { ...newSlot, id: Date.now() }]);
    setNewSlot({ dayOfWeek:1, startTime:"10:00", endTime:"11:00", isRecurring:true, specificDate:"" });
  };

  /* ═══════════════════════════════
     CREATE PROVIDER (full flow)
  ═══════════════════════════════ */
  const createProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    /* 1. Upload images */
    let profileImages: string[] = [];
    if (imageFiles.length > 0) {
      const fd = new FormData();
      imageFiles.forEach(f => fd.append("images", f));
      const up = await fetch("/api/v1/upload", { method:"POST", body:fd });
      if (up.ok) { const d = await up.json(); profileImages = d.urls ?? []; }
    }

    /* 2. Create provider */
    const provRes = await fetch("/api/v1/admin/providers", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        ...pf,
        languages: pf.languages.split(",").map(l=>l.trim()).filter(Boolean),
        tags: pf.tags.split(",").map(t=>t.trim()).filter(Boolean),
        profileImages: profileImages.length > 0 ? profileImages : undefined,
      }),
    });
    if (!provRes.ok) {
      const d = await provRes.json();
      flash(false, d.error ?? "Failed to create provider");
      setSaving(false); return;
    }
    const provider = await provRes.json();

    /* 3. Create services */
    if (svcList.length > 0) {
      await Promise.all(svcList.map(sv =>
        fetch("/api/v1/admin/services", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ name:sv.name, description:sv.description, duration:sv.duration, price:sv.price, providerId:provider._id }),
        })
      ));
    }

    /* 4. Create slots */
    if (slotList.length > 0) {
      await fetch("/api/v1/admin/availability", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          providerId: provider._id,
          slots: slotList.map(s => ({
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
              isRecurring: s.isRecurring,
              ...(s.specificDate ? { specificDate: s.specificDate } : {}),
            })),
        }),
      });
    }

    flash(true, `Provider "${provider.name}" created with ${svcList.length} services & ${slotList.length} slots!`);
    setPf({ name:"", city:"", bio:"", age:23, height:"5'6\"", weight:"52 kg", languages:"English, Hindi", tags:"", experienceLevel:"intermediate", experienceYears:2 });
    setImageFiles([]); setImagePreviews([]);
    setSvcList([]); setSlotList([]);
    setNewSlot({ dayOfWeek:1, startTime:"10:00", endTime:"11:00", isRecurring:true, specificDate:"" });
    fetchProviders();
    setSaving(false);
  };

  /* ── Add service to existing provider ── */
  const addServiceToSelected = async (e: React.FormEvent) => {
    e.preventDefault(); if (!selected) return; setSaving(true);
    const r = await fetch("/api/v1/admin/services", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ ...addSvcForm, providerId:selected._id }),
    });
    if (r.ok) { flash(true,"Service added!"); setAddSvcForm({ name:"", description:"", duration:60, price:3000 }); fetchDetails(selected._id); }
    else { const d=await r.json(); flash(false, d.error??"Failed"); }
    setSaving(false);
  };

  /* ── Add slot to existing provider ── */
  const addSlotToSelected = async (e: React.FormEvent) => {
    e.preventDefault(); if (!selected) return; setSaving(true);
    const slotPayload: Record<string, unknown> = {
      dayOfWeek: Number(addSlotForm.dayOfWeek),
      startTime: addSlotForm.startTime,
      endTime: addSlotForm.endTime,
      isRecurring: addSlotForm.isRecurring,
    };
    if (!addSlotForm.isRecurring && addSlotForm.specificDate) {
      slotPayload.specificDate = addSlotForm.specificDate;
    }
    const r = await fetch("/api/v1/admin/availability", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ providerId: selected._id, slots: [slotPayload] }),
    });
    if (r.ok) {
      flash(true, "Slot added!");
      setAddSlotForm({ dayOfWeek:1, startTime:"10:00", endTime:"11:00", isRecurring:true, specificDate:"" });
      fetchDetails(selected._id);
    } else { const d = await r.json(); flash(false, d.error ?? "Failed"); }
    setSaving(false);
  };

  /* ── Update existing slot ── */
  const updateSlot = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingSlot) return; setSaving(true);
    const body: Record<string, unknown> = {
      dayOfWeek: Number(editSlotForm.dayOfWeek),
      startTime: editSlotForm.startTime,
      endTime: editSlotForm.endTime,
      isRecurring: editSlotForm.isRecurring,
    };
    if (!editSlotForm.isRecurring && editSlotForm.specificDate) {
      body.specificDate = editSlotForm.specificDate;
    } else if (editSlotForm.isRecurring) {
      body.specificDate = null; // clear the date
    }
    const r = await fetch(`/api/v1/admin/availability/${editingSlot._id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      flash(true, "Slot updated!");
      setEditingSlot(null);
      fetchDetails(selected!._id);
    } else { const d = await r.json(); flash(false, d.error ?? "Failed"); }
    setSaving(false);
  };

  /* ── Delete a slot ── */
  const deleteSlot = async (slotId: string) => {
    if (!confirm("Delete this slot?")) return;
    setSaving(true);
    const r = await fetch(`/api/v1/admin/availability/${slotId}`, { method: "DELETE" });
    if (r.ok) { flash(true, "Slot deleted!"); fetchDetails(selected!._id); }
    else { const d = await r.json(); flash(false, d.error ?? "Failed"); }
    setSaving(false);
  };

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div>
      <style>{`
        .adm-sel { appearance: none; -webkit-appearance: none; }
        .adm-sel option { background: #1a1a1a !important; color: #ffffff !important; }
        .adm-sel:focus { border-color: var(--accent) !important; outline: none; }
      `}</style>
      {/* Header */}
      <div style={{ marginBottom:28, paddingBottom:18, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, letterSpacing:3, margin:0 }}>Service Providers</h1>
        <p style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"var(--text-muted)", marginTop:4 }}>
          {!selected ? "Create providers · add services · set availability" : `Managing: ${selected.name}`}
        </p>
      </div>

      {/* Toast */}
        {msg && (
          <div style={{ padding:"12px 16px", marginBottom:20, fontSize:12, fontWeight:600,
            background: msg.ok?"rgba(124,58,237,0.1)":"rgba(239,68,68,0.1)",
            border:`1px solid ${msg.ok?"rgba(124,58,237,0.3)":"rgba(239,68,68,0.3)"}`,
            color: msg.ok?"var(--gold)":"rgba(239,68,68,0.8)",
          }}>{msg.text}</div>
        )}

      <div className="admin-providers-grid" style={{ display:"grid", gridTemplateColumns:"420px 1fr", gap:24, alignItems:"start" }}>

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div style={{ maxHeight:"calc(100vh - 160px)", overflowY:"auto", paddingRight:4 }}>

          {!selected ? (
            /* ── CREATE PROVIDER FORM ── */
            <div style={card}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, letterSpacing:2, margin:"0 0 20px", color:"var(--gold)" }}>
                + Add New Provider
              </h2>

              <form onSubmit={createProvider} style={{ display:"flex", flexDirection:"column", gap:14 }}>

                {/* ── BASIC INFO ── */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div><label style={lbl}>Name *</label><input required style={inp} value={pf.name} onChange={e=>setPf({...pf,name:e.target.value})} placeholder="Full name" /></div>
                  <div><label style={lbl}>City *</label><input required style={inp} value={pf.city} onChange={e=>setPf({...pf,city:e.target.value})} placeholder="e.g. Mumbai" /></div>
                </div>
                <div><label style={lbl}>Bio</label><textarea style={{...inp,height:68,resize:"none"}} value={pf.bio} onChange={e=>setPf({...pf,bio:e.target.value})} placeholder="Short biography..." /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                  <div><label style={lbl}>Age</label><input type="number" style={inp} value={pf.age} onChange={e=>setPf({...pf,age:+e.target.value})} /></div>
                  <div><label style={lbl}>Height</label><input style={inp} value={pf.height} onChange={e=>setPf({...pf,height:e.target.value})} /></div>
                  <div><label style={lbl}>Weight</label><input style={inp} value={pf.weight} onChange={e=>setPf({...pf,weight:e.target.value})} /></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={lbl}>Experience Level</label>
                    <select className="adm-sel" style={{...inp,cursor:"pointer",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center",paddingRight:28}} value={pf.experienceLevel} onChange={e=>setPf({...pf,experienceLevel:e.target.value})}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div><label style={lbl}>Exp. Years</label><input type="number" style={inp} value={pf.experienceYears} onChange={e=>setPf({...pf,experienceYears:+e.target.value})} /></div>
                </div>
                <div><label style={lbl}>Languages (comma separated)</label><input style={inp} value={pf.languages} onChange={e=>setPf({...pf,languages:e.target.value})} /></div>
                <div><label style={lbl}>Tags (comma separated, optional)</label><input style={inp} value={pf.tags} onChange={e=>setPf({...pf,tags:e.target.value})} placeholder="companion, verified, new" /></div>

                {/* ── PHOTOS ── */}
                <div style={sec}>
                  <p style={secTitle}>Photos <span style={{ fontSize:12, fontFamily:"inherit", color:"var(--text-muted)" }}>({imageFiles.length}/5)</span></p>

                  {/* Previews */}
                  {imagePreviews.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                      {imagePreviews.map((src,i) => (
                        <div key={i} style={{ position:"relative", width:74, height:74 }}>
                          <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", border:"1px solid rgba(255,255,255,0.1)" }} />
                          <button type="button" onClick={()=>removeImage(i)} style={{ position:"absolute", top:2, right:2, width:18, height:18, background:"rgba(124,58,237,0.9)", border:"none", color:"var(--white)", fontSize:10, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit", padding:0 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {imageFiles.length < 5 && (
                    <>
                      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display:"none" }} id="img-upload" />
                      <label htmlFor="img-upload" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 16px", background:"rgba(255,255,255,0.04)", border:"1px dashed rgba(255,255,255,0.2)", cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--text-muted)" }}>
                        + Add Photos {imageFiles.length > 0 && `(${5-imageFiles.length} more)`}
                      </label>
                    </>
                  )}
                </div>

                {/* ── SERVICES ── */}
                <div style={sec}>
                  <p style={secTitle}>Services <span style={{ fontSize:12, fontFamily:"inherit", color:"var(--text-muted)" }}>({svcList.length} added)</span></p>

                  {/* Existing in list */}
                  {svcList.length > 0 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
                      {svcList.map(sv => (
                        <div key={sv.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
                          <div>
                            <span style={{ fontSize:12, fontWeight:700, color:"var(--white)" }}>{sv.name}</span>
                            <span style={{ fontSize:10, color:"var(--text-muted)", marginLeft:8 }}>{sv.duration}min</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:"var(--gold)" }}>₹{sv.price.toLocaleString()}</span>
                            <button type="button" onClick={()=>setSvcList(p=>p.filter(x=>x.id!==sv.id))} style={{ background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:14, padding:0 }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add service row */}
                  <div style={{ display:"flex", flexDirection:"column", gap:8, padding:12, background:"rgba(255,255,255,0.01)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      <div><label style={lbl}>Service Name</label><input style={inp} value={newSvc.name} onChange={e=>setNewSvc({...newSvc,name:e.target.value})} placeholder="e.g. Dinner Date" /></div>
                      <div><label style={lbl}>Category</label><input style={inp} value={newSvc.description} onChange={e=>setNewSvc({...newSvc,description:e.target.value})} placeholder="e.g. GFE" /></div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 80px", gap:8, alignItems:"end" }}>
                      <div><label style={lbl}>Duration (min)</label><input type="number" style={inp} value={newSvc.duration} onChange={e=>setNewSvc({...newSvc,duration:+e.target.value})} /></div>
                      <div><label style={lbl}>Price (₹)</label><input type="number" style={inp} value={newSvc.price} onChange={e=>setNewSvc({...newSvc,price:+e.target.value})} /></div>
                      <button type="button" onClick={pushService} style={{ ...smallBtn("var(--accent)"), height:40 }}>+ Add</button>
                    </div>
                  </div>
                </div>

                {/* ── AVAILABILITY SLOTS ── */}
                <div style={sec}>
                  <p style={secTitle}>Availability <span style={{ fontSize:12, fontFamily:"inherit", color:"var(--text-muted)" }}>({slotList.length} added)</span></p>

                  {slotList.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                      {slotList.map(sl => (
                        <div key={sl.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)" }}>
                          {sl.specificDate ? (
                            <span style={{ fontSize:10, fontWeight:800, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"1px" }}>
                              {new Date(sl.specificDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short" })}
                            </span>
                          ) : (
                            <span style={{ fontSize:10, fontWeight:800, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"1px" }}>
                              {DAYS[sl.dayOfWeek].slice(0,3)}
                            </span>
                          )}
                          <span style={{ fontSize:11, fontWeight:700, color:"var(--white)" }}>{sl.startTime}–{sl.endTime}</span>
                          <button type="button" onClick={()=>setSlotList(p=>p.filter(x=>x.id!==sl.id))} style={{ background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:12, padding:0 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Toggle: recurring vs specific date */}
                  <div style={{ display:"flex", gap:0, border:"1px solid rgba(255,255,255,0.1)", marginBottom:8 }}>
                    <button
                      type="button"
                      onClick={() => setNewSlot(s => ({ ...s, isRecurring:true, specificDate:"" }))}
                      style={{ flex:1, padding:"8px 0", fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", background: newSlot.isRecurring ? "var(--accent)" : "transparent", border:"none", borderRight:"1px solid rgba(255,255,255,0.1)", color: newSlot.isRecurring ? "#fff" : "#555" }}
                    >Weekly Recurring</button>
                    <button
                      type="button"
                      onClick={() => setNewSlot(s => ({ ...s, isRecurring:false }))}
                      style={{ flex:1, padding:"8px 0", fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", background: !newSlot.isRecurring ? "var(--accent)" : "transparent", border:"none", color: !newSlot.isRecurring ? "#fff" : "#555" }}
                    >Specific Date</button>
                  </div>

                  {/* Add slot row */}
                  <div style={{ display:"grid", gridTemplateColumns: newSlot.isRecurring ? "120px 1fr 1fr 70px" : "1fr 1fr 1fr 70px", gap:8, padding:12, background:"rgba(255,255,255,0.01)", border:"1px solid rgba(255,255,255,0.06)", alignItems:"end" }}>
                    {newSlot.isRecurring ? (
                      <div>
                        <label style={lbl}>Day</label>
                        <select className="adm-sel" style={{...inp,cursor:"pointer"}} value={newSlot.dayOfWeek} onChange={e=>setNewSlot({...newSlot,dayOfWeek:+e.target.value})}>
                          {DAYS.map((d,i)=><option key={d} value={i}>{d}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label style={lbl}>Date</label>
                        <input
                          type="date"
                          style={{...inp, colorScheme:"dark"}}
                          value={newSlot.specificDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={e => setNewSlot({...newSlot, specificDate:e.target.value, dayOfWeek: new Date(e.target.value).getDay()})}
                        />
                      </div>
                    )}
                    <div><label style={lbl}>Start</label><input style={inp} value={newSlot.startTime} onChange={e=>setNewSlot({...newSlot,startTime:e.target.value})} placeholder="10:00" /></div>
                    <div><label style={lbl}>End</label><input style={inp} value={newSlot.endTime} onChange={e=>setNewSlot({...newSlot,endTime:e.target.value})} placeholder="11:00" /></div>
                    <button type="button" onClick={pushSlot} style={{ ...smallBtn("var(--accent)"), height:40 }}>+ Add</button>
                  </div>
                </div>

                {/* ── SUBMIT ── */}
                <button type="submit" disabled={saving} style={{ marginTop:8, padding:"13px 0", background:"var(--accent)", border:"none", color:"var(--white)", fontSize:12, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", opacity:saving?0.6:1 }}>
                  {saving ? "Creating…" : "Create Provider"}
                </button>
              </form>
            </div>

          ) : (
            /* ── MANAGE EXISTING PROVIDER ── */
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <button onClick={()=>{setSelected(null);setMsg(null);}} style={{ padding:"10px 16px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#888", fontSize:11, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                ← Back to All Providers
              </button>

              <div style={{...card, borderLeft:"3px solid #7C3AED", padding:"16px 20px"}}>
                <div style={{ fontSize:15, fontWeight:700, color:"var(--white)" }}>{selected.name}</div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--accent)", marginTop:2 }}>{selected.city}</div>
              </div>

              <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                {(["svc","slot"] as const).map(t=>(
                  <button key={t} onClick={()=>setSubTab(t)} style={{ padding:"10px 18px", background:"transparent", border:"none", borderBottom:`2px solid ${subTab===t?"var(--accent)":"transparent"}`, color:subTab===t?"#fff":"#555", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", marginBottom:-1 }}>
                    {t==="svc"?"Add Service":"Add Slot"}
                  </button>
                ))}
              </div>

              {subTab==="svc" && (
                <div style={card}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, letterSpacing:2, margin:"0 0 14px", color:"var(--gold)" }}>Add Service</h3>
                  <form onSubmit={addServiceToSelected} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div><label style={lbl}>Service Name *</label><input required style={inp} value={addSvcForm.name} onChange={e=>setAddSvcForm({...addSvcForm,name:e.target.value})} placeholder="e.g. Dinner Date" /></div>
                    <div><label style={lbl}>Description</label><textarea style={{...inp,height:56,resize:"none"}} value={addSvcForm.description} onChange={e=>setAddSvcForm({...addSvcForm,description:e.target.value})} /></div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <div><label style={lbl}>Duration (min)</label><input type="number" required style={inp} value={addSvcForm.duration} onChange={e=>setAddSvcForm({...addSvcForm,duration:+e.target.value})} /></div>
                      <div><label style={lbl}>Price (₹)</label><input type="number" required style={inp} value={addSvcForm.price} onChange={e=>setAddSvcForm({...addSvcForm,price:+e.target.value})} /></div>
                    </div>
                    <button type="submit" disabled={saving} style={{ padding:"11px", background:"var(--accent)", border:"none", color:"var(--white)", fontSize:11, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", opacity:saving?0.6:1 }}>
                      {saving?"Adding…":"+ Add Service"}
                    </button>
                  </form>
                </div>
              )}

              {subTab==="slot" && (
                <div style={card}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, letterSpacing:2, margin:"0 0 14px", color:"var(--accent)" }}>Add Availability Slot</h3>
                  <form onSubmit={addSlotToSelected} style={{ display:"flex", flexDirection:"column", gap:12 }}>

                    {/* Recurring toggle */}
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)" }}>
                      <button
                        type="button"
                        onClick={() => setAddSlotForm(f => ({ ...f, isRecurring: true, specificDate: "" }))}
                        style={{ padding:"6px 14px", fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", background: addSlotForm.isRecurring ? "var(--accent)" : "rgba(255,255,255,0.05)", border:"none", color: addSlotForm.isRecurring ? "#000" : "#555" }}
                      >Weekly Recurring</button>
                      <button
                        type="button"
                        onClick={() => setAddSlotForm(f => ({ ...f, isRecurring: false }))}
                        style={{ padding:"6px 14px", fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", background: !addSlotForm.isRecurring ? "var(--accent)" : "rgba(255,255,255,0.05)", border:"none", color: !addSlotForm.isRecurring ? "#fff" : "#555" }}
                      >Specific Date</button>
                    </div>

                    {addSlotForm.isRecurring ? (
                      <div>
                        <label style={lbl}>Day of Week</label>
                        <select className="adm-sel" style={{...inp,cursor:"pointer"}} value={addSlotForm.dayOfWeek} onChange={e=>setAddSlotForm({...addSlotForm,dayOfWeek:+e.target.value})}>
                          {DAYS.map((d,i)=><option key={d} value={i}>{d}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label style={lbl}>Specific Date *</label>
                        <input
                          type="date" required={!addSlotForm.isRecurring}
                          style={{...inp, colorScheme:"dark"}}
                          value={addSlotForm.specificDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={e => {
                            const d = new Date(e.target.value);
                            setAddSlotForm({...addSlotForm, specificDate: e.target.value, dayOfWeek: d.getDay()});
                          }}
                        />
                        {addSlotForm.specificDate && (
                          <p style={{ fontSize:10, color:"var(--accent)", marginTop:4, fontWeight:700 }}>
                            {DAYS[new Date(addSlotForm.specificDate).getDay()]} — {new Date(addSlotForm.specificDate).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" })}
                          </p>
                        )}
                      </div>
                    )}

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <div><label style={lbl}>Start Time</label><input style={inp} value={addSlotForm.startTime} onChange={e=>setAddSlotForm({...addSlotForm,startTime:e.target.value})} placeholder="10:00" /></div>
                      <div><label style={lbl}>End Time</label><input style={inp} value={addSlotForm.endTime} onChange={e=>setAddSlotForm({...addSlotForm,endTime:e.target.value})} placeholder="11:00" /></div>
                    </div>
                    <button type="submit" disabled={saving} style={{ padding:"11px", background:"var(--accent)", border:"none", color:"var(--white)", fontSize:11, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", opacity:saving?0.6:1 }}>
                      {saving?"Adding…":"+ Add Slot"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div>
          {!selected ? (
            <div style={card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, letterSpacing:2, margin:0 }}>All Providers</h2>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--text-muted)" }}>{providers.length} total</span>
              </div>
              {loadingP ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:"var(--text-muted)", fontSize:12 }}>Loading…</div>
              ) : providers.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 0", color:"var(--text-muted)", fontSize:13, fontStyle:"italic" }}>
                  No providers yet. Create your first one!
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14 }}>
                  {providers.map(p=>(
                    <div key={p._id} onClick={()=>{setSelected(p);setMsg(null);}} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", padding:16, cursor:"pointer", transition:"border-color 0.2s" }}
                      onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(124,58,237,0.4)")}
                      onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)")}
                    >
                      <div style={{ width:"100%", height:110, overflow:"hidden", marginBottom:10, border:"1px solid rgba(255,255,255,0.08)" }}>
                        <img src={p.profileImages?.[0]??"/images/model1.jpg"} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--white)", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--accent)", marginBottom:8 }}>{p.city}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)" }}>Manage →</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Existing services + slots for selected provider */
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={card}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, letterSpacing:2, margin:"0 0 14px" }}>Services ({exServices.length})</h3>
                {exServices.length === 0 ? (
                  <p style={{ color:"#444", fontSize:12, fontStyle:"italic", textAlign:"center", padding:"12px 0" }}>No services added yet</p>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {exServices.map(sv=>(
                      <div key={sv._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:"var(--white)" }}>{sv.name}</div>
                          {sv.description && <div style={{ fontSize:10, color:"var(--text-muted)", marginTop:2 }}>{sv.description}</div>}
                          <div style={{ fontSize:10, color:"#666", marginTop:1 }}>{sv.duration} min</div>
                        </div>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:"var(--gold)", flexShrink:0, marginLeft:12 }}>₹{sv.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={card}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, letterSpacing:2, margin:"0 0 14px" }}>Availability ({exSlots.length})</h3>
                {exSlots.length === 0 ? (
                  <p style={{ color:"#444", fontSize:12, fontStyle:"italic", textAlign:"center", padding:"12px 0" }}>No slots added yet</p>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {exSlots.map(sl => (
                      <div key={sl._id}>
                        {editingSlot?._id === sl._id ? (
                          /* ── Inline edit form ── */
                          <form onSubmit={updateSlot} style={{ padding:"14px 16px", background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.25)", display:"flex", flexDirection:"column", gap:10 }}>
                            <p style={{ fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--accent)", margin:0 }}>Editing Slot</p>

                            {/* Recurring toggle */}
                            <div style={{ display:"flex", gap:8 }}>
                              <button type="button" onClick={() => setEditSlotForm(f=>({...f, isRecurring:true, specificDate:""}))}
                                style={{ padding:"5px 12px", fontSize:10, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", background: editSlotForm.isRecurring?"var(--accent)":"rgba(255,255,255,0.05)", border:"none", color: editSlotForm.isRecurring?"#fff":"#555" }}>
                                Weekly
                              </button>
                              <button type="button" onClick={() => setEditSlotForm(f=>({...f, isRecurring:false}))}
                                style={{ padding:"5px 12px", fontSize:10, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", background: !editSlotForm.isRecurring?"var(--accent)":"rgba(255,255,255,0.05)", border:"none", color: !editSlotForm.isRecurring?"#fff":"#555" }}>
                                Specific Date
                              </button>
                            </div>

                            {editSlotForm.isRecurring ? (
                              <div>
                                <label style={lbl}>Day</label>
                                <select className="adm-sel" style={{...inp,cursor:"pointer"}} value={editSlotForm.dayOfWeek} onChange={e=>setEditSlotForm({...editSlotForm,dayOfWeek:+e.target.value})}>
                                  {DAYS.map((d,i)=><option key={d} value={i}>{d}</option>)}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label style={lbl}>Specific Date</label>
                                <input type="date" style={{...inp, colorScheme:"dark"}} value={editSlotForm.specificDate}
                                  onChange={e=>setEditSlotForm({...editSlotForm, specificDate:e.target.value, dayOfWeek: new Date(e.target.value).getDay()})} />
                              </div>
                            )}
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                              <div><label style={lbl}>Start</label><input style={inp} value={editSlotForm.startTime} onChange={e=>setEditSlotForm({...editSlotForm,startTime:e.target.value})} /></div>
                              <div><label style={lbl}>End</label><input style={inp} value={editSlotForm.endTime} onChange={e=>setEditSlotForm({...editSlotForm,endTime:e.target.value})} /></div>
                            </div>
                            <div style={{ display:"flex", gap:8 }}>
                              <button type="submit" disabled={saving} style={{ flex:1, padding:"9px", background:"var(--accent)", border:"none", color:"var(--white)", fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}>
                                {saving?"Saving…":"Save Changes"}
                              </button>
                              <button type="button" onClick={() => setEditingSlot(null)} style={{ padding:"9px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#888", fontSize:10, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* ── Slot display row ── */
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${sl.isBooked ? "rgba(124,58,237,0.3)" : "rgba(124,58,237,0.12)"}` }}>
                            <div>
                              {sl.isRecurring ? (
                                <div style={{ fontSize:9, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--accent)", marginBottom:3 }}>
                                  Weekly — {DAYS[sl.dayOfWeek]}
                                </div>
                              ) : (
                                <div style={{ fontSize:9, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--accent)", marginBottom:3 }}>
                                  {sl.specificDate ? new Date(sl.specificDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : DAYS[sl.dayOfWeek]}
                                </div>
                              )}
                              <div style={{ fontSize:13, fontWeight:700, color:"var(--white)" }}>{sl.startTime} – {sl.endTime}</div>
                              {sl.isBooked && <div style={{ fontSize:9, fontWeight:800, letterSpacing:"1px", color:"var(--accent)", marginTop:2 }}>● BOOKED</div>}
                            </div>
                            <div style={{ display:"flex", gap:6 }}>
                              <button
                                onClick={() => {
                                  setEditingSlot(sl);
                                  setEditSlotForm({
                                    dayOfWeek: sl.dayOfWeek,
                                    startTime: sl.startTime,
                                    endTime: sl.endTime,
                                    isRecurring: sl.isRecurring,
                                    specificDate: sl.specificDate ? sl.specificDate.split("T")[0] : "",
                                  });
                                }}
                                style={{ padding:"6px 12px", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.3)", color:"var(--accent)", fontSize:9, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}
                              >Edit</button>
                              <button
                                onClick={() => deleteSlot(sl._id)}
                                style={{ padding:"6px 12px", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.3)", color:"var(--gold)", fontSize:9, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}
                              >Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
