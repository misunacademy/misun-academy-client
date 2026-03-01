/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import { enrollmentPeriod } from '@/constants/enrollment';
import { DiamondMinus } from 'lucide-react';
import Countdown from './Countdown';
import { useGetSettingsQuery } from '@/redux/api/settingsApi';
import { useGetCourseBySlugQuery } from '@/redux/api/courseApi';
import { useGetCurrentEnrollmentBatchQuery } from '@/redux/api/batchApi';

interface BannerSectionProps {
    courseSlug?: string;
}

export default function BannerSection({ courseSlug }: BannerSectionProps = {}) {
    // Settings-based fallback (used when no courseSlug provided)
    const { data: settingsData, isLoading: settingsLoading } = useGetSettingsQuery();

    // Course-slug based resolution — fetches the current enrollment batch directly for this course
    const { data: courseBySlug, isLoading: courseBySlugLoading } = useGetCourseBySlugQuery(
        courseSlug!, { skip: !courseSlug }
    );
    const slugCourseId = (courseBySlug?.data as any)?._id;

    const { data: currentBatchRes, isLoading: slugBatchLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: slugCourseId },
        { skip: !slugCourseId }
    );

    // Resolve batch: course-specific takes priority over global settings
    const resolvedBatch = courseSlug
        ? (currentBatchRes?.data as any)
        : (settingsData?.data?.featuredEnrollmentBatch as any);

    const isLoading = courseSlug
        ? (courseBySlugLoading || (!!slugCourseId && slugBatchLoading))
        : settingsLoading;

    const batch = resolvedBatch?.batchNumber || 0;
    const enrollmentPeriod = {
        startDate: resolvedBatch?.enrollmentStartDate
            ? new Date(resolvedBatch.enrollmentStartDate).toLocaleDateString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : 'N/A',
        endDate: resolvedBatch?.enrollmentEndDate
            ? new Date(resolvedBatch.enrollmentEndDate).toLocaleDateString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : 'N/A',
        classStart: resolvedBatch?.startDate
            ? new Date(resolvedBatch.startDate).toLocaleDateString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : 'N/A',
    };

    if (isLoading) return null;


  return (
    <section className="relative bg-[#060f0a] overflow-hidden font-bangla">

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      {/* Bottom edge separator */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* ── Floating 3D Design Tool Decorations ── */}

      {/* Photoshop Ps icon — top-left */}
      <div
        className="absolute top-24 left-6 xl:left-14 hidden md:block pointer-events-none opacity-[0.22]"
        style={{ animation: 'designToolFloat 9s ease-in-out infinite' }}
      >
        <div style={{
          width: 78, height: 78,
          background: 'linear-gradient(145deg, #001d26 0%, #003040 55%, #001520 100%)',
          borderRadius: 14,
          border: '1.5px solid rgba(49,168,255,0.35)',
          boxShadow: '6px 6px 0 #00111c, 12px 12px 0 #000810, 0 0 40px rgba(49,168,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(49,168,255,0.55), transparent)' }} />
          <span style={{ fontFamily:"Georgia, 'Times New Roman', serif", fontSize:28, fontStyle:'italic', fontWeight:700, color:'#31a8ff', letterSpacing:'-0.5px', textShadow:'0 0 22px rgba(49,168,255,0.9)' }}>Ps</span>
        </div>
      </div>

      {/* Illustrator Ai icon — top-right */}
      <div
        className="absolute top-24 right-6 xl:right-14 hidden md:block pointer-events-none opacity-[0.22]"
        style={{ animation: 'designToolFloat2 11s ease-in-out infinite' }}
      >
        <div style={{
          width: 78, height: 78,
          background: 'linear-gradient(145deg, #1a0e00 0%, #2d1700 55%, #110800 100%)',
          borderRadius: 14,
          border: '1.5px solid rgba(255,154,0,0.35)',
          boxShadow: '-6px 6px 0 #0e0800, -12px 12px 0 #060300, 0 0 40px rgba(255,154,0,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(255,154,0,0.55), transparent)' }} />
          <span style={{ fontFamily:"Georgia, 'Times New Roman', serif", fontSize:28, fontStyle:'italic', fontWeight:700, color:'#ff9a00', letterSpacing:'-0.5px', textShadow:'0 0 22px rgba(255,154,0,0.9)' }}>Ai</span>
        </div>
      </div>

      {/* Pen tool bezier path — left mid */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-2 xl:left-8 hidden lg:block pointer-events-none opacity-[0.20]"
        style={{ animation: 'designFloat 13s ease-in-out infinite' }}
      >
        <svg width="80" height="130" viewBox="0 0 80 130" fill="none">
          <path d="M 20 15 C 65 25, 10 88, 62 118" stroke="hsl(156 70% 42%)" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
          <line x1="20" y1="15" x2="65" y2="25" stroke="hsl(156, 70%, 42%, 0.45)" strokeWidth="1"/>
          <line x1="62" y1="118" x2="10" y2="88" stroke="hsl(156, 70%, 42%, 0.45)" strokeWidth="1"/>
          <rect x="14" y="9" width="12" height="12" rx="1" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="1.5" transform="rotate(45 20 15)"/>
          <rect x="56" y="112" width="12" height="12" rx="1" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="1.5" transform="rotate(45 62 118)"/>
          <circle cx="65" cy="25" r="3.5" fill="none" stroke="hsl(156, 70%, 42%, 0.65)" strokeWidth="1.2"/>
          <circle cx="10" cy="88" r="3.5" fill="none" stroke="hsl(156, 70%, 42%, 0.65)" strokeWidth="1.2"/>
        </svg>
      </div>

      {/* Bounding-box selection handles — right mid */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-2 xl:right-8 hidden lg:block pointer-events-none opacity-[0.18]"
        style={{ animation: 'designFloat2 10s ease-in-out infinite' }}
      >
        <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
          <rect x="8" y="8" width="76" height="76" rx="1" fill="none" stroke="rgba(255,154,0,0.75)" strokeWidth="1.2" strokeDasharray="5 3"/>
          {([[5,5],[40,5],[75,5],[5,40],[75,40],[5,75],[40,75],[75,75]] as [number,number][]).map(([x,y],i) => (
            <rect key={i} x={x} y={y} width="7" height="7" rx="1" fill="#07070d" stroke="rgba(255,154,0,0.95)" strokeWidth="1.2"/>
          ))}
          <line x1="46" y1="39" x2="46" y2="53" stroke="rgba(255,154,0,0.35)" strokeWidth="1"/>
          <line x1="39" y1="46" x2="53" y2="46" stroke="rgba(255,154,0,0.35)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Artboard corner markers — bottom-left */}
      <div
        className="absolute bottom-14 left-4 xl:left-10 hidden lg:block pointer-events-none opacity-[0.15]"
        style={{ animation: 'designFloat 16s ease-in-out infinite 2s' }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <polyline points="0,20 0,0 20,0" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2"/>
          <polyline points="44,0 64,0 64,20" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2"/>
          <polyline points="0,44 0,64 20,64" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2"/>
          <polyline points="44,64 64,64 64,44" fill="none" stroke="hsl(156 70% 42%)" strokeWidth="2"/>
          <circle cx="32" cy="32" r="2.5" fill="hsl(156, 70%, 42%, 0.5)"/>
          <circle cx="32" cy="32" r="7" fill="none" stroke="hsl(156, 70%, 42%, 0.3)" strokeWidth="1" strokeDasharray="3 2"/>
        </svg>
      </div>

      {/* Layer stack chips — bottom-right */}
      <div
        className="absolute bottom-16 right-5 xl:right-12 hidden xl:block pointer-events-none opacity-[0.18]"
        style={{ animation: 'designFloat2 14s ease-in-out infinite 1s' }}
      >
        <div style={{ position:'relative', width:52, height:50 }}>
          {([
            { top:18, bg:'linear-gradient(135deg,#001d26,#002a3a)', border:'rgba(49,168,255,0.35)' },
            { top:9,  bg:'linear-gradient(135deg,#1a0e00,#2a1600)', border:'rgba(255,154,0,0.35)' },
            { top:0,  bg:'linear-gradient(135deg,#0d0d14,#151522)', border:'rgba(255,255,255,0.12)' },
          ] as { top:number; bg:string; border:string }[]).map((l,i) => (
            <div key={i} style={{
              position:'absolute', left:0, top:l.top, width:46, height:26,
              background:l.bg, border:`1px solid ${l.border}`, borderRadius:4,
            }}/>
          ))}
        </div>
        <p style={{ fontSize:8, color:'white', opacity:0.45, fontFamily:'monospace', textAlign:'center', marginTop:6, letterSpacing:'0.12em' }}>LAYERS</p>
      </div>

      {/* Mini Ps + Ai chips — left mid-scatter */}
      <div
        className="absolute top-[38%] left-1 xl:left-5 hidden xl:flex flex-col gap-2 pointer-events-none opacity-[0.16]"
        style={{ animation: 'designFloat2 18s ease-in-out infinite 3s' }}
      >
        {([
          { label:'Ps', color:'#31a8ff', bg:'#001d26' },
          { label:'Ai', color:'#ff9a00', bg:'#1a0e00' },
        ] as { label:string; color:string; bg:string }[]).map((chip,i) => (
          <div key={i} style={{
            width:30, height:30, background:chip.bg, borderRadius:6,
            border:`1px solid ${chip.color}44`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 0 10px ${chip.color}22`,
          }}>
            <span style={{ fontFamily:"Georgia,serif", fontSize:11, fontStyle:'italic', fontWeight:700, color:chip.color }}>{chip.label}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center pt-24 md:pt-28 pb-24 px-4">

        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স</span>
        </div>
        <h1 className="font-bold font-bangla text-[28px] md:text-3xl lg:text-5xl text-center uppercase pt-2 bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent leading-snug">
          কমপ্লিট{' '}
          <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.4)]">গ্রাফিক্স ডিজাইন</span>
          {' '}উইথ ফ্রিল্যান্সিং
        </h1>
        <h2 className="text-primary/80 block text-[24px] md:text-2xl lg:text-3xl font-bold uppercase font-bangla mt-3 tracking-widest">
          (ব্যাচ-০{batch.toLocaleString('bn-BD')})
        </h2>

        <p className="w-auto sm:w-10/12 text-[15px] leading-[170%] text-center max-w-3xl mt-6 mx-5 font-bangla text-white/65">
          Complete Graphic Design With Freelancing (Batch-{batch}) – এই কোর্সটি আপনাকে বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত গ্রাফিক্স ডিজাইন শেখাবে বাস্তব প্রজেক্ট ও ক্লাইন্ট হান্টিং স্ট্র্যাটেজির মাধ্যমে। ২৪/৭ সাপোর্ট, <strong>১:১</strong> মেন্টরশিপ, লাইভ ক্লাস এবং AI ইনটিগ্রেটেড ডিজাইনের সাহায্যে আপনি নিজেকে গড়ে তুলতে পারবেন একজন দক্ষ ফ্রিল্যান্স ডিজাইনার হিসেবে।
        </p>
        <Countdown courseSlug={courseSlug} />
        {/* Decorative divider */}
        <div className="flex items-center gap-3 w-full max-w-xs mb-2 mt-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        <div className="relative my-6 p-[1.5px] rounded-xl overflow-hidden">
          <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
          <div className="relative bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] rounded-xl px-8 py-4 font-bold font-bangla text-xl text-white shadow-[0_0_24px_hsl(156_70%_42%/0.4)]">
          কোর্স ফি: মাত্র ৪,০০০ টাকা
          </div>
        </div>

        {/* Decorative divider 2 */}
        <div className="flex items-center gap-3 w-full max-w-xs mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        {/* Timeline card */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10 mb-8 py-8 px-10 w-80 mx-auto md:w-[600px] lg:w-auto items-center justify-center">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50 rounded-br-2xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-xs text-primary/80 mb-1 tracking-wider uppercase font-semibold">এনরোলমেন্ট শুরু</span>
            <span className="text-xl font-bold text-white">{enrollmentPeriod.startDate}</span>
          </div>
          <div className="flex items-center justify-center rotate-90 lg:rotate-0">
            <DiamondMinus size={28} className="text-primary/50" />
          </div>
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-xs text-primary/80 mb-1 tracking-wider uppercase font-semibold">এনরোলমেন্ট শেষ</span>
            <span className="text-xl font-bold text-white">{enrollmentPeriod.endDate}</span>
          </div>
          <div className="flex items-center justify-center rotate-90 lg:rotate-0">
            <DiamondMinus size={28} className="text-primary/50" />
          </div>
          {/* <div className="flex flex-col text-center lg:text-left">
            <span className="text-[16px] text-primary mb-1">ওরিয়েন্টেশন ক্লাস</span>
            <span className="text-[20px] font-bold">০১ অক্টোবর, ২০২৫</span>
          </div>

          <div className='flex items-center justify-center rotate-90 lg:rotate-0'>
            <DiamondMinus size={40} className='text-primary/70' />
          </div> */}

          <div className="flex flex-col text-center lg:text-left">
            <span className="text-xs text-primary/80 mb-1 tracking-wider uppercase font-semibold">ক্লাস শুরু</span>
            <span className="text-xl font-bold text-white">{enrollmentPeriod.classStart}</span>
          </div>
        </div>

        <p className="text-sm text-white/50 mb-4 text-center w-5/6 mx-auto md:w-full font-bangla leading-relaxed">
          কথা দিচ্ছি এত সাপোর্ট এবং পুরোপুরি লেগে থাকলে কোর্স শেষ হবার আগেই ক্লাইন্ট এর সাথে কাজ করার সুযোগ আর কোন কোর্সেই পাবেন না।
        </p>
      </div>

    </section>
  );
}
