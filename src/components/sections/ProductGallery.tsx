"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  images?: string[];
  name: string;
}

export default function ProductGallery({ images = [], name }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  const defaultPlaceholder = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
  
  const imgs: string[] = [];
  for (let i = 0; i < 5; i++) {
    imgs.push(images && images[i] ? images[i] : (images && images[0] ? images[0] : defaultPlaceholder));
  }

  const allImages = images.length > 0 ? images : [defaultPlaceholder];

  const openLightbox = (idx: number) => {
    setActiveImageIndex(idx);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const nextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % allImages.length);
  };

  const prevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        <div 
          onClick={() => openLightbox(0)}
          className="col-span-4 sm:col-span-2 row-span-2 aspect-[3/4] sm:aspect-auto sm:min-h-[500px] overflow-hidden rounded-2xl bg-[var(--beige)] relative group cursor-pointer border border-[var(--taupe)]/15 hover:border-[var(--accent)]/40 transition-all duration-300 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-[1]" />
          <img
            src={imgs[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 z-10 bg-[var(--dark)]/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-[1.5px] text-[var(--cream)] border border-[var(--cream)]/10 opacity-0 group-hover:opacity-100 transition-opacity">
            🔍 View Fullscreen
          </div>
        </div>

        <div 
          onClick={() => openLightbox(1 % allImages.length)}
          className="col-span-2 sm:col-span-1 aspect-[4/3] sm:aspect-auto sm:h-[242px] overflow-hidden rounded-xl bg-[var(--beige)] relative group cursor-pointer border border-[var(--taupe)]/15 hover:border-[var(--accent)]/40 transition-all duration-300 shadow-md"
        >
          <img
            src={imgs[1]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        <div 
          onClick={() => openLightbox(2 % allImages.length)}
          className="col-span-2 sm:col-span-1 aspect-[4/3] sm:aspect-auto sm:h-[242px] overflow-hidden rounded-xl bg-[var(--beige)] relative group cursor-pointer border border-[var(--taupe)]/15 hover:border-[var(--accent)]/40 transition-all duration-300 shadow-md"
        >
          <img
            src={imgs[2]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        <div 
          onClick={() => openLightbox(3 % allImages.length)}
          className="col-span-2 sm:col-span-1 aspect-[4/3] sm:aspect-auto sm:h-[242px] overflow-hidden rounded-xl bg-[var(--beige)] relative group cursor-pointer border border-[var(--taupe)]/15 hover:border-[var(--accent)]/40 transition-all duration-300 shadow-md"
        >
          <img
            src={imgs[3]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        <div 
          onClick={() => openLightbox(4 % allImages.length)}
          className="col-span-2 sm:col-span-1 aspect-[4/3] sm:aspect-auto sm:h-[242px] overflow-hidden rounded-xl bg-[var(--beige)] relative group cursor-pointer border border-[var(--taupe)]/15 hover:border-[var(--accent)]/40 transition-all duration-300 shadow-md"
        >
          <img
            src={imgs[4]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {allImages.length > 5 && (
            <div className="absolute inset-0 bg-[var(--dark)]/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-2 group-hover:bg-[var(--dark)]/70 transition-colors z-[2]">
              <span className="font-cormorant text-3xl text-[var(--gold)] tracking-[1px]">+ {allImages.length - 4}</span>
              <span className="text-[9px] font-bold uppercase tracking-[2px] text-[var(--cream)]/75 mt-1">More Photos</span>
            </div>
          )}
        </div>
      </div>

      {mounted && activeImageIndex !== null && createPortal(
        <div className="fixed inset-0 bg-[var(--dark)]/98 backdrop-blur-xl flex items-center justify-center select-none animate-fade-in" style={{ zIndex: 9999 }}>
          <div className="absolute inset-0 cursor-zoom-out" onClick={closeLightbox} />

          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all flex items-center justify-center text-white text-xl cursor-pointer"
            style={{ zIndex: 10000 }}
          >
            ✕
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all flex items-center justify-center text-white text-xl cursor-pointer"
            style={{ zIndex: 10000 }}
          >
            ‹
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all flex items-center justify-center text-white text-xl cursor-pointer"
            style={{ zIndex: 10000 }}
          >
            ›
          </button>

          <div className="relative max-w-[90vw] max-h-[80vh] flex flex-col items-center justify-center" style={{ zIndex: 99995 }}>
            <img 
              src={allImages[activeImageIndex]} 
              alt={`${name} gallery view`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
            <p className="mt-4 text-xs tracking-[2px] uppercase text-white/60">
              {activeImageIndex + 1} / {allImages.length} · {name}
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
