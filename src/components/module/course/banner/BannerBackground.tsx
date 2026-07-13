"use client"

import Image from "next/image"
import designerImage from "@/assets/3d-elements/abstract-graphic-designers.png"
import tool1Image from "@/assets/3d-elements/tool_1.png"
import tool2Image from "@/assets/3d-elements/tool_2.png"

export function BannerBackground() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <DesignToolFloatingIcons />
      <ThreeDElements />
    </>
  )
}

function DesignToolFloatingIcons() {
  return (
    <>
      <div
        className="absolute top-24 left-6 xl:left-14 hidden md:block pointer-events-none opacity-[0.22]"
        style={{ animation: "designToolFloat 9s ease-in-out infinite" }}
      >
        <div
          style={{
            width: 78, height: 78,
            background: "linear-gradient(145deg, #001d26 0%, #003040 55%, #001520 100%)",
            borderRadius: 14,
            border: "1.5px solid rgba(49,168,255,0.35)",
            boxShadow: "6px 6px 0 #00111c, 12px 12px 0 #000810, 0 0 40px rgba(49,168,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(49,168,255,0.55), transparent)" }} />
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, fontStyle: "italic", fontWeight: 700, color: "#31a8ff", letterSpacing: "-0.5px", textShadow: "0 0 22px rgba(49,168,255,0.9)" }}>Ps</span>
        </div>
      </div>

      <div
        className="absolute top-24 right-6 xl:right-14 hidden md:block pointer-events-none opacity-[0.22]"
        style={{ animation: "designToolFloat2 11s ease-in-out infinite" }}
      >
        <div
          style={{
            width: 78, height: 78,
            background: "linear-gradient(145deg, #1a0e00 0%, #2d1700 55%, #110800 100%)",
            borderRadius: 14,
            border: "1.5px solid rgba(255,154,0,0.35)",
            boxShadow: "-6px 6px 0 #0e0800, -12px 12px 0 #060300, 0 0 40px rgba(255,154,0,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,154,0,0.55), transparent)" }} />
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 28, fontStyle: "italic", fontWeight: 700, color: "#ff9a00", letterSpacing: "-0.5px", textShadow: "0 0 22px rgba(255,154,0,0.9)" }}>Ai</span>
        </div>
      </div>

      <div
        className="absolute top-1/2 -translate-y-1/2 left-2 xl:left-8 hidden lg:block pointer-events-none opacity-[0.20]"
        style={{ animation: "designFloat 13s ease-in-out infinite" }}
      >
        <svg width="80" height="130" viewBox="0 0 80 130" fill="none">
          <path d="M 20 15 C 65 25, 10 88, 62 118" stroke="hsl(156 70% 42%)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
          <line x1="20" y1="15" x2="65" y2="25" stroke="hsl(156, 70%, 42%, 0.45)" strokeWidth="1" />
          <line x1="62" y1="118" x2="10" y2="88" stroke="hsl(156, 70%, 42%, 0.45)" strokeWidth="1" />
          <rect x="14" y="9" width="12" height="12" rx="1" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="1.5" transform="rotate(45 20 15)" />
          <rect x="56" y="112" width="12" height="12" rx="1" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="1.5" transform="rotate(45 62 118)" />
          <circle cx="65" cy="25" r="3.5" fill="none" stroke="hsl(156, 70%, 42%, 0.65)" strokeWidth="1.2" />
          <circle cx="10" cy="88" r="3.5" fill="none" stroke="hsl(156, 70%, 42%, 0.65)" strokeWidth="1.2" />
        </svg>
      </div>

      <div
        className="absolute top-1/2 -translate-y-1/2 right-2 xl:right-8 hidden lg:block pointer-events-none opacity-[0.18]"
        style={{ animation: "designFloat2 10s ease-in-out infinite" }}
      >
        <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
          <rect x="8" y="8" width="76" height="76" rx="1" fill="none" stroke="rgba(255,154,0,0.75)" strokeWidth="1.2" strokeDasharray="5 3" />
          {([
            [5, 5], [40, 5], [75, 5], [5, 40], [75, 40], [5, 75], [40, 75], [75, 75],
          ] as [number, number][]).map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="7" height="7" rx="1" fill="#07070d" stroke="rgba(255,154,0,0.95)" strokeWidth="1.2" />
          ))}
          <line x1="46" y1="39" x2="46" y2="53" stroke="rgba(255,154,0,0.35)" strokeWidth="1" />
          <line x1="39" y1="46" x2="53" y2="46" stroke="rgba(255,154,0,0.35)" strokeWidth="1" />
        </svg>
      </div>

      <div
        className="absolute bottom-14 left-4 xl:left-10 hidden lg:block pointer-events-none opacity-[0.15]"
        style={{ animation: "designFloat 16s ease-in-out infinite 2s" }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <polyline points="0,20 0,0 20,0" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2" />
          <polyline points="44,0 64,0 64,20" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2" />
          <polyline points="0,44 0,64 20,64" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2" />
          <polyline points="44,64 64,64 64,44" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2" />
          <circle cx="32" cy="32" r="2.5" fill="hsl(156, 70%, 42%, 0.5)" />
          <circle cx="32" cy="32" r="7" fill="none" stroke="hsl(156, 70%, 42%, 0.3)" strokeWidth="1" strokeDasharray="3 2" />
        </svg>
      </div>

      <div
        className="absolute bottom-16 right-5 xl:right-12 hidden xl:block pointer-events-none opacity-[0.18]"
        style={{ animation: "designFloat2 14s ease-in-out infinite 1s" }}
      >
        <div style={{ position: "relative", width: 52, height: 50 }}>
          {[
            { top: 18, bg: "linear-gradient(135deg,#001d26,#002a3a)", border: "rgba(49,168,255,0.35)" },
            { top: 9, bg: "linear-gradient(135deg,#1a0e00,#2a1600)", border: "rgba(255,154,0,0.35)" },
            { top: 0, bg: "linear-gradient(135deg,#0d0d14,#151522)", border: "rgba(255,255,255,0.12)" },
          ].map((l, i) => (
            <div key={i} style={{ position: "absolute", left: 0, top: l.top, width: 46, height: 26, background: l.bg, border: `1px solid ${l.border}`, borderRadius: 4 }} />
          ))}
        </div>
        <p style={{ fontSize: 8, color: "white", opacity: 0.45, fontFamily: "monospace", textAlign: "center", marginTop: 6, letterSpacing: "0.12em" }}>LAYERS</p>
      </div>

      <div
        className="absolute top-[38%] left-1 xl:left-5 hidden xl:flex flex-col gap-2 pointer-events-none opacity-[0.16]"
        style={{ animation: "designFloat2 18s ease-in-out infinite 3s" }}
      >
        {[
          { label: "Ps", color: "#31a8ff", bg: "#001d26" },
          { label: "Ai", color: "#ff9a00", bg: "#1a0e00" },
        ].map((chip, i) => (
          <div key={i} style={{ width: 30, height: 30, background: chip.bg, borderRadius: 6, border: `1px solid ${chip.color}44`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 10px ${chip.color}22` }}>
            <span style={{ fontFamily: "Georgia,serif", fontSize: 11, fontStyle: "italic", fontWeight: 700, color: chip.color }}>{chip.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function ThreeDElements() {
  return (
    <>
      <div
        className="absolute top-[12%] left-[10%] lg:right-[22%] xl:right-[30%] hidden md:block pointer-events-none z-0"
        style={{ animation: "designFloat2 15s ease-in-out infinite 1s" }}
      >
        <div className="relative w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] xl:w-[220px] xl:h-[220px]">
          <div className="absolute inset-x-4 inset-y-4 bg-primary/15 blur-[40px] rounded-full" />
          <Image src={tool1Image} alt="3D Palette Tool" fill className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] opacity-70 lg:opacity-90 xl:opacity-100" sizes="(max-width: 1200px) 180px, 220px" />
        </div>
      </div>

      <div
        className="absolute bottom-[20%] left-[2%] lg:left-[5%] xl:left-[8%] hidden md:block pointer-events-none z-0"
        style={{ animation: "designFloat 18s ease-in-out infinite" }}
      >
        <div className="relative w-[180px] h-[180px] lg:w-[240px] lg:h-[240px] xl:w-[280px] xl:h-[280px] -rotate-12">
          <div className="absolute inset-x-6 inset-y-6 bg-primary/10 blur-[50px] rounded-full" />
          <Image src={tool2Image} alt="3D Ruler Tool" fill className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] opacity-60 lg:opacity-80 xl:opacity-100" sizes="(max-width: 1200px) 240px, 280px" />
        </div>
      </div>

      <div
        className="absolute top-1/4 -translate-y-1/2 right-[-10%] md:right-[-5%] lg:right-[2%] xl:right-[6%] hidden md:block pointer-events-none z-0 mt-12"
        style={{ animation: "designFloat 14s ease-in-out infinite" }}
      >
        <div className="relative w-[320px] h-[320px] lg:w-[450px] lg:h-[450px] xl:w-[550px] xl:h-[550px]">
          <div className="absolute inset-x-10 inset-y-10 bg-primary/20 blur-[100px] rounded-full" />
          <Image src={designerImage} alt="3D Graphic Designer" fill className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] opacity-50 lg:opacity-75 xl:opacity-100" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
        </div>
      </div>
    </>
  )
}
