/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from "react";
import { Trophy, Clock, Layers, Zap, Users } from "lucide-react";
import { courseCurriculum } from "@/data/courseCurriculum";
import Image from "next/image";
import element3DBottomLeft from "@/assets/3d-elements/47581666_4-[Converted].png";

// ── per-course accent config ────────────────────────────────────────────────
const COURSE_CONFIG = [
    {
        abbr: 'Ps',
        color: '#31a8ff',
        glow: 'rgba(49,168,255,0.22)',
        glowStrong: 'rgba(49,168,255,0.45)',
        bg: '#001d26',
        bgMid: '#002a3a',
        border: 'rgba(49,168,255,0.30)',
        borderHover: 'rgba(49,168,255,0.65)',
        tagBg: 'rgba(49,168,255,0.12)',
        num: '01',
    },
    {
        abbr: 'Ai',
        color: '#ff9a00',
        glow: 'rgba(255,154,0,0.20)',
        glowStrong: 'rgba(255,154,0,0.45)',
        bg: '#1a0e00',
        bgMid: '#2a1600',
        border: 'rgba(255,154,0,0.28)',
        borderHover: 'rgba(255,154,0,0.60)',
        tagBg: 'rgba(255,154,0,0.10)',
        num: '02',
    },
    {
        abbr: '✦',
        color: '#20b486',
        glow: 'rgba(32,180,134,0.20)',
        glowStrong: 'rgba(32,180,134,0.45)',
        bg: '#041510',
        bgMid: '#082318',
        border: 'rgba(32,180,134,0.28)',
        borderHover: 'rgba(32,180,134,0.60)',
        tagBg: 'rgba(32,180,134,0.10)',
        num: '03',
    },
] as const;

const TYPE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
    theory:    { label: 'Theory',    color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    practical: { label: 'Practical', color: '#34d399', bg: 'rgba(52,211,153,0.10)' },
    strategy:  { label: 'Strategy',  color: '#fbbf24', bg: 'rgba(251,191,36,0.10)' },
};

// ── component ───────────────────────────────────────────────────────────────
const CourseCurriculum = () => {
    const [active, setActive] = useState(0);

    const courses   = courseCurriculum.courses;
    const cfg    = COURSE_CONFIG[active];
    const course = courses[active];

    const { modules, projects, totalHours } = useMemo(() => {
        const mods  = course.modules ?? [];
        const projs = (course as any).projects ?? [];
        const parse = (s: string) => parseFloat(s) || 0;
        const hours = [...mods, ...projs].reduce((acc, m) => acc + parse((m as any).duration), 0);
        return { modules: mods, projects: projs, totalHours: hours };
    }, [course]);

    return (
        <section className="relative bg-[#060f0a] overflow-hidden font-sans">

            {/* Dot-grid texture */}
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{ backgroundImage:'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)', backgroundSize:'32px 32px' }}
            />
            {/* Dynamic ambient glow tied to active course */}
            <div className="absolute inset-0 pointer-events-none transition-all duration-700"
                style={{ background:`radial-gradient(ellipse 55% 40% at 70% 50%, ${cfg.glow}, transparent)` }}
            />
            {/* Edge separators */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* 3D Decorative Element - Bottom Left */}
            {/* <div 
                className="absolute bottom-[15%] left-[-15%] md:left-[-5%] lg:left-[0%] xl:left-[0%] pointer-events-none z-0 hidden md:block"
                style={{ animation: 'designFloat 18s ease-in-out infinite' }}
            >
                <div className="relative w-[220px] h-[220px] lg:w-[350px] lg:h-[350px] xl:w-[480px] xl:h-[480px]">
                     Ambient glow behind the iMac
                     <div className="absolute inset-x-12 inset-y-12 bg-primary/20 blur-[80px] rounded-full" />
                     <Image
                         src={element3DBottomLeft}
                         alt="3D Decorative iMac Design"
                         fill
                         className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] opacity-40 md:opacity-60 lg:opacity-80 xl:opacity-100"
                         sizes="(max-width: 1024px) 220px, (max-width: 1280px) 350px, 480px"
                     />
                </div>
            </div> */}

            <div className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section header ── */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">পাঠ্যক্রম</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-bangla bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                        কোর্স{' '}
                        <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_18px_hsl(156_70%_42%/0.4)]">
                            কারিকুলাম
                        </span>
                    </h2>
                    <p className="text-sm md:text-base font-bangla text-white/50 max-w-2xl mx-auto">
                        একেবারে শুরু থেকে প্রফেশনাল ডিজাইনার হওয়ার একটি পূর্ণাঙ্গ পথ—হাতে-কলমে প্রজেক্ট ও ক্লায়েন্ট হান্টিং কৌশলসহ।
                    </p>
                </div>

                {/* ── Main layout: selector + timeline ── */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    {/* ── LEFT — course selector tabs ── */}
                    <div className="w-full lg:w-[260px] shrink-0 flex flex-row lg:flex-col gap-3">
                        {courses.map((c, i) => {
                            const cf = COURSE_CONFIG[i];
                            const isActive = active === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className="relative overflow-hidden text-left rounded-2xl p-4 w-full transition-all duration-300 cursor-pointer"
                                    style={{
                                        background: isActive
                                            ? `linear-gradient(135deg, ${cf.bg} 0%, ${cf.bgMid} 100%)`
                                            : '#0a0f0d',
                                        border: `1.5px solid ${isActive ? cf.borderHover : 'rgba(255,255,255,0.07)'}`,
                                        boxShadow: isActive ? `0 0 28px ${cf.glow}, inset 0 1px 0 ${cf.glowStrong}` : 'none',
                                    }}
                                >
                                    {/* Top shimmer */}
                                    {isActive && (
                                        <div className="absolute inset-x-0 top-0 h-px"
                                            style={{ background:`linear-gradient(90deg, transparent, ${cf.color}, transparent)` }}
                                        />
                                    )}
                                    <div className="flex items-center gap-3">
                                        {/* App-icon chip */}
                                        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                background:`linear-gradient(145deg, ${cf.bg}, ${cf.bgMid})`,
                                                border:`1.5px solid ${cf.border}`,
                                                boxShadow: isActive ? `0 0 14px ${cf.glow}` : 'none',
                                            }}
                                        >
                                            <span style={{
                                                fontFamily:"Georgia,'Times New Roman',serif",
                                                fontSize: cf.abbr === '✦' ? 18 : 15,
                                                fontStyle:'italic', fontWeight:700,
                                                color: cf.color,
                                                textShadow: isActive ? `0 0 12px ${cf.color}` : 'none',
                                            }}>
                                                {cf.abbr}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold truncate"
                                                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                                                {c.title}
                                            </p>
                                            <p className="text-[10px] mt-0.5 truncate"
                                                style={{ color: isActive ? cf.color : 'rgba(255,255,255,0.30)' }}>
                                                {(c.modules?.length ?? 0) + ((c as any).projects?.length ?? 0)} items
                                            </p>
                                        </div>
                                    </div>
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                                            style={{ background:`linear-gradient(180deg, transparent, ${cf.color}, transparent)` }}
                                        />
                                    )}
                                </button>
                            );
                        })}

                        {/* Stats card */}
                        <div className="hidden lg:block mt-2 rounded-2xl p-4 border"
                            style={{
                                background:`linear-gradient(135deg, ${cfg.bg}, ${cfg.bgMid})`,
                                borderColor: cfg.border,
                                boxShadow:`0 0 20px ${cfg.glow}`,
                            }}
                        >
                            <div className="absolute inset-x-0 top-0 h-px" />
                            <p className="text-[10px] tracking-widest uppercase mb-3 font-semibold" style={{ color: cfg.color }}>
                                Module Stats
                            </p>
                            {[
                                { icon: Layers,  label: 'Modules',  val: modules.length },
                                { icon: Trophy,  label: 'Projects', val: projects.length },
                                { icon: Clock,   label: 'Hours',    val: `${totalHours}+` },
                            ].map(({ icon: Icon, label, val }) => (
                                <div key={label} className="flex items-center justify-between py-1.5 border-b last:border-b-0"
                                    style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                                    <div className="flex items-center gap-2">
                                        <Icon size={11} style={{ color: cfg.color }} />
                                        <span className="text-[11px] text-white/45">{label}</span>
                                    </div>
                                    <span className="text-[12px] font-bold" style={{ color: cfg.color }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT — content panel ── */}
                    <div className="flex-1 min-w-0 relative overflow-hidden rounded-2xl"
                        style={{
                            background:`linear-gradient(160deg, #07100c 0%, #060f0a 60%, ${cfg.bg}55 100%)`,
                            border:`1.5px solid ${cfg.border}`,
                            boxShadow:`0 0 40px ${cfg.glow}, inset 0 1px 0 ${cfg.glowStrong}`,
                        }}
                    >
                        {/* Ghost watermark number */}
                        <div className="absolute -right-4 -top-4 select-none pointer-events-none"
                            style={{
                                fontSize: 200,
                                fontWeight: 900,
                                lineHeight: 1,
                                color: cfg.color,
                                opacity: 0.035,
                                fontFamily: 'Georgia, serif',
                                fontStyle: 'italic',
                            }}
                        >
                            {cfg.num}
                        </div>

                        {/* Top shimmer */}
                        <div className="absolute inset-x-0 top-0 h-px"
                            style={{ background:`linear-gradient(90deg, transparent, ${cfg.color}88, transparent)` }}
                        />

                        <div className="relative z-10 p-6 sm:p-8">

                            {/* Panel header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 rounded flex items-center justify-center"
                                            style={{ background:`linear-gradient(135deg,${cfg.bg},${cfg.bgMid})`, border:`1px solid ${cfg.border}` }}>
                                            <span style={{ fontFamily:"Georgia,serif", fontSize:9, fontStyle:'italic', fontWeight:700, color:cfg.color }}>
                                                {cfg.abbr}
                                            </span>
                                        </div>
                                        <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color:cfg.color }}>
                                            {course.level ?? 'Curriculum'}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white">{course.title}</h3>
                                    <p className="text-sm text-white/45 mt-0.5">{course.description}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {[
                                        { label:`${modules.length}`, sub:'Modules',  icon: Layers },
                                        { label:`${projects.length}`, sub:'Projects', icon: Zap },
                                    ].map(({ label, sub, icon: Icon }) => (
                                        <div key={sub} className="flex flex-col items-center px-4 py-2.5 rounded-xl border"
                                            style={{ background:`${cfg.bg}`, borderColor:cfg.border }}>
                                            <Icon size={12} style={{ color:cfg.color }} className="mb-0.5" />
                                            <span className="text-lg font-black" style={{ color:cfg.color }}>{label}</span>
                                            <span className="text-[9px] text-white/30 tracking-wider uppercase">{sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Modules timeline ── */}
                            {modules.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-5">
                                        <Layers size={12} style={{ color:cfg.color }} />
                                        <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color:cfg.color }}>
                                            Tool-Based Modules
                                        </span>
                                        <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg, ${cfg.color}33, transparent)` }} />
                                    </div>

                                    <div className="relative pl-8">
                                        {/* Vertical spine */}
                                        <div className="absolute left-[11px] top-0 bottom-0 w-px"
                                            style={{ background:`linear-gradient(180deg, ${cfg.color}55 0%, ${cfg.color}15 100%)` }}
                                        />

                                        <div className="flex flex-col gap-2">
                                            {modules.map((mod: any, mi: number) => {
                                                const typeStyle = TYPE_STYLES[mod.type] ?? TYPE_STYLES.practical;
                                                return (
                                                    <div key={mod.id} className="relative flex items-start gap-4 group">
                                                        {/* Node */}
                                                        <div className="absolute -left-8 top-[10px] w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 z-10 transition-transform duration-200 group-hover:scale-110"
                                                            style={{
                                                                background:`linear-gradient(135deg,${cfg.bg},${cfg.bgMid})`,
                                                                border:`1.5px solid ${cfg.color}`,
                                                                boxShadow:`0 0 8px ${cfg.glow}`,
                                                            }}
                                                        >
                                                            <span style={{ fontSize:8, fontWeight:700, color:cfg.color }}>{String(mi + 1).padStart(2,'0')}</span>
                                                        </div>

                                                        {/* Row */}
                                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 px-4 rounded-xl border transition-all duration-200 group-hover:scale-[1.01]"
                                                            style={{
                                                                background:`rgba(0,0,0,0.25)`,
                                                                borderColor:'rgba(255,255,255,0.07)',
                                                            }}
                                                            onMouseEnter={e => {
                                                                (e.currentTarget as HTMLDivElement).style.borderColor = `${cfg.color}44`;
                                                                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 16px ${cfg.glow}`;
                                                            }}
                                                            onMouseLeave={e => {
                                                                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                                                                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                                            }}
                                                        >
                                                            <span className="text-sm text-white/80 leading-snug flex-1 pr-2">{mod.title}</span>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase"
                                                                    style={{ color:typeStyle.color, background:typeStyle.bg }}>
                                                                    {typeStyle.label}
                                                                </span>
                                                                <span className="text-[10px] text-white/30 whitespace-nowrap flex items-center gap-1">
                                                                    <Clock size={9} /> {mod.duration}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Projects ── */}
                            {projects.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-5">
                                        <Trophy size={12} style={{ color:cfg.color }} />
                                        <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color:cfg.color }}>
                                            Project-Based Classes
                                        </span>
                                        <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg, ${cfg.color}33, transparent)` }} />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-2">
                                        {projects.map((proj: any, pi: number) => (
                                            <div key={pi} className="relative overflow-hidden flex items-start gap-3 p-3.5 rounded-xl border group transition-all duration-200"
                                                style={{
                                                    background:`linear-gradient(135deg,${cfg.bg}88, rgba(0,0,0,0.3))`,
                                                    borderColor: cfg.border,
                                                }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLDivElement).style.borderColor = cfg.borderHover;
                                                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${cfg.glow}`;
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLDivElement).style.borderColor = cfg.border;
                                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                                }}
                                            >
                                                {/* Shimmer top */}
                                                <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                                                    style={{ background:`linear-gradient(90deg, transparent, ${cfg.color}66, transparent)` }}
                                                />
                                                <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                                                    style={{ background:cfg.tagBg, border:`1px solid ${cfg.border}` }}>
                                                    <Trophy size={12} style={{ color:cfg.color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] text-white/75 leading-snug">{proj.title}</p>
                                                    <span className="text-[9px] mt-1 flex items-center gap-1" style={{ color:cfg.color }}>
                                                        <Clock size={8} /> {proj.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Bottom summary bar ── */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: Layers, label: 'মোট মডিউল',    value: `${courseCurriculum.courses.reduce((a,c) => a+(c.modules?.length??0),0)}+` },
                        { icon: Trophy, label: 'প্রজেক্ট ক্লাস', value: `${courseCurriculum.courses.reduce((a,c) => a+((c as any).projects?.length??0),0)}+` },
                        { icon: Clock,  label: 'ঘণ্টার কন্টেন্ট', value: '100+' },
                        { icon: Users,  label: 'স্টুডেন্ট সাপোর্ট', value: '২৪/৭' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="relative overflow-hidden flex items-center gap-3 px-5 py-4 rounded-2xl border border-primary/5 bg-primary/5 group hover:border-primary/30 hover:bg-primary/8 transition-all duration-300">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                <Icon size={24} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-3xl font-black bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">{value}</p>
                                <p className="text-lg text-white/40 font-bangla tracking-wide">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CourseCurriculum;