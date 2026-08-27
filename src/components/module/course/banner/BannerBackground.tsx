import { StaticImageData } from "next/image"
import { motion } from "framer-motion"
import SkillBadge from "../../home/SkillBadge"
import { IllustratorImg, PhotoshopImg } from '@/assets/images';




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

    </>
  )
}

function ThreeDElements() {
  const skills: { image: StaticImageData; name: string }[] = [
    { image: PhotoshopImg, name: "ফটোশপ" },
    { image: IllustratorImg, name: "ইলাস্ট্রেটর" },
  ];

  return (
    <>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-16 lg:left-24 xl:left-36 2xl:left-44 top-[46%] hidden lg:block z-20 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <SkillBadge image={skills[0].image} name={skills[0].name} delay={1} />
        </div>
        <div className="absolute -bottom-3 right-3 h-3 w-3 rounded-full bg-primary/60 shadow-[0_0_15px_rgba(32,180,134,0.8)] pointer-events-none" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-16 lg:right-24 xl:right-36 2xl:right-44 top-[34%] hidden lg:block z-20 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <SkillBadge image={skills[1].image} name={skills[1].name} delay={2} />
        </div>
        <div className="absolute -top-3 -left-6 h-4 w-4 rounded-full bg-primary/80 shadow-[0_0_20px_rgba(32,180,134,0.8)] pointer-events-none" />
      </motion.div>
    </>
  )
}
