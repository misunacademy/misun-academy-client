"use client";

import { useEffect } from "react";
import Image from "next/image";
import { track } from "@/lib/metaPixel";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import EnrollCtaSection from "@/components/module/course/EnrollCtaSection";
import Countdown from "@/components/module/course/Countdown";
import Container from "@/components/ui/container";
import Link from "next/link";
import { DiamondMinus } from "lucide-react";
import { PuspitaSingha } from "@/assets/images";
import { useGetCourseBySlugQuery } from "@/redux/api/courseApi";
import { useGetCurrentEnrollmentBatchQuery, useGetUpcomingBatchesQuery } from "@/redux/api/batchApi";

const COURSE_SLUG = "english-for-professional-communication";

// ─── FAQ data ────────────────────────────────────────────────────────────────

const faqs = [
  {
    question: "কোর্সটি কাদের জন্য উপযুক্ত?",
    answer:
      "যারা ইংরেজিতে কথা বলতে জড়তা অনুভব করেন, জব ইন্টারভিউ বা প্রফেশনাল মিটিংয়ে নিজেকে গুছিয়ে উপস্থাপন করতে চান — তাদের জন্য এই কোর্সটি আদর্শ। একেবারে বেসিক থেকে শুরু করা যাবে।",
  },
  {
    question: "কোর্সে কী কী শেখানো হবে?",
    answer:
      "Spoken English-এর ফান্ডামেন্টাল থেকে শুরু করে ডেইলি কনভার্সেশন, প্রফেশনাল ভোকাবুলারি, প্রেজেন্টেশন স্কিল এবং ইন্টারভিউ প্রিপারেশন পর্যন্ত সব কিছু কভার করা হবে।",
  },
  {
    question: "লাইভ ক্লাস মিস হলে কী করব?",
    answer:
      "সব ক্লাসের রেকর্ডিং ড্যাশবোর্ডে সংরক্ষিত থাকে। এছাড়াও লাইভ সাপোর্ট সেশন ও WhatsApp গ্রুপের মাধ্যমে যেকোনো প্রশ্নের সমাধান পাওয়া যাবে।",
  },
  {
    question: "কোর্স শেষে কি সার্টিফিকেট পাওয়া যাবে?",
    answer:
      "হ্যাঁ, কোর্স সম্পন্ন করলে MISUN Academy থেকে একটি ডিজিটাল সার্টিফিকেট দেওয়া হবে। এটি LinkedIn বা CV-তে যোগ করা যাবে।",
  },
  {
    question: "ক্লাসগুলো কীভাবে পরিচালিত হয়?",
    answer:
      "প্রতিটি ক্লাস ইন্টারেক্টিভ লাইভ সেশনে পরিচালিত হয়। রোলপ্লে, গ্রুপ ডিসকাশন এবং রিয়েল-লাইফ সিচুয়েশন প্র্যাকটিসের মাধ্যমে স্পিকিং কনফিডেন্স বাড়ানো হয়।",
  },
  {
    question: "পূর্বে ইংরেজির কোনো অভিজ্ঞতা না থাকলেও কি ভর্তি হওয়া যাবে?",
    answer:
      "অবশ্যই। কোর্সটি একেবারে বেসিক থেকে শুরু হয়। আপনার বর্তমান ইংরেজির মান যাই হোক — ধাপে ধাপে এগিয়ে যেতে পারবেন।",
  },
];

// ─── Curriculum ───────────────────────────────────────────────────────────────

const curriculum = [
  {
    title: "Foundation — বেসিক গ্রামার ও উচ্চারণ",
    topics: [
      "Parts of Speech ও বাক্য গঠনের নিয়ম",
      "সঠিক উচ্চারণ ও IPA গাইড",
      "Common Mistakes ও কীভাবে এড়ানো যায়",
      "Self-introduction ও daily greetings",
    ],
  },
  {
    title: "Daily Conversation — দৈনন্দিন ইংরেজি",
    topics: [
      "Shopping, Travel, Food ও Social situations",
      "Phrasal Verbs ও Idioms",
      "Polite requests ও casual talk",
      "Role-play ও live practice sessions",
    ],
  },
  {
    title: "Professional English — প্রফেশনাল দক্ষতা",
    topics: [
      "Job interview preparation",
      "Email ও formal writing skills",
      "Presentation ও public speaking",
      "Meeting ও negotiation language",
    ],
  },
  {
    title: "Advanced Speaking — চূড়ান্ত পর্যায়",
    topics: [
      "Debate ও discussion techniques",
      "Storytelling ও persuasive speaking",
      "Accent reduction",
      "Mock interview ও final assessment",
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function EnglishCourseDetails() {
  // ── Dynamic batch data ──────────────────────────────────────────────────
  const { data: courseBySlug } = useGetCourseBySlugQuery(COURSE_SLUG);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courseId = (courseBySlug?.data as any)?._id;

  const { data: currentBatchRes } = useGetCurrentEnrollmentBatchQuery(
    { courseId }, { skip: !courseId }
  );
  const { data: upcomingBatchRes } = useGetUpcomingBatchesQuery(
    { courseId },
    { skip: !courseId || !!currentBatchRes?.data }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedBatch = (currentBatchRes?.data as any) ?? (upcomingBatchRes?.data as any)?.[0];

  const batchTitle = resolvedBatch?.title.split(' ')[1] ?? null;
  const enrollmentPeriod = {
    startDate: resolvedBatch?.enrollmentStartDate
      ? new Date(resolvedBatch.enrollmentStartDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
      : null,
    endDate: resolvedBatch?.enrollmentEndDate
      ? new Date(resolvedBatch.enrollmentEndDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
      : null,
    classStart: resolvedBatch?.startDate
      ? new Date(resolvedBatch.startDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
      : null,
  };
  // ───────────────────────────────────────────────────────────────────────

  useEffect(() => {
    track("ViewContent", {
      content_name: "English For Professional Communication",
      content_type: "course",
      content_ids: ["english-professional-comm-misun-2024"],
    });
  }, []);

  return (
    <div>
      <BreadcrumbJsonLd />

      {/* ── Banner ── */}
      <section className="relative bg-[#060a12] overflow-hidden font-bangla">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(217 91% 60%) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center pt-24 md:pt-28 pb-24 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
            </span>
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-400/90">
              English For Professional Communication
            </span>
          </div>

          <h1 className="font-bold font-sans text-[26px] md:text-3xl lg:text-5xl text-center uppercase pt-2 leading-snug">
            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">English For </span>
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(217_91%_60%/0.4)]">
              Professional
            </span>
            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent"> Communication</span>
          </h1>
          {batchTitle !== null && (
            <h2 className="text-blue-400/80 block text-[22px] md:text-2xl lg:text-3xl font-bold uppercase font-bangla mt-2 tracking-widest">
              (ব্যাচ-{String(batchTitle).padStart(2, '0')})
            </h2>
          )}

          <p className="w-auto sm:w-10/12 text-[15px] leading-[170%] text-center max-w-3xl mt-6 mx-5 font-bangla text-white/65">
            জব ইন্টারভিউ, ব্যবসায়িক মিটিং ও প্রফেশনাল পরিবেশে আত্মবিশ্বাসের সাথে ইংরেজি বলুন।
            Instructor <strong>Puspita Singha</strong>-এর তত্ত্বাবধানে স্পিকিং প্র্যাকটিস, প্রেজেন্টেশন স্কিল, ইমেইল রাইটিং
            এবং <strong>১:১</strong> মেন্টরশিপের মাধ্যমে শিখুন।
          </p>

          {/* ── Countdown ── */}
          <Countdown courseSlug={COURSE_SLUG} />

          {/* ── Enrollment timeline card ── */}
          {(enrollmentPeriod.startDate || enrollmentPeriod.endDate || enrollmentPeriod.classStart) && (
            <>
              {/* Decorative divider */}
              <div className="flex items-center gap-3 w-full max-w-xs mb-2 mt-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-500/40" />
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-500/40" />
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10 mb-4 py-8 px-10 w-80 mx-auto md:w-[600px] lg:w-auto items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-blue-500/50 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-blue-500/50 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-blue-500/50 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-blue-500/50 rounded-br-2xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

                {enrollmentPeriod.startDate && (
                  <div className="flex flex-col text-center lg:text-left">
                    <span className="text-xs text-blue-400/80 mb-1 tracking-wider uppercase font-semibold">এনরোলমেন্ট শুরু</span>
                    <span className="text-xl font-bold text-white">{enrollmentPeriod.startDate}</span>
                  </div>
                )}
                {enrollmentPeriod.startDate && enrollmentPeriod.endDate && (
                  <div className="flex items-center justify-center rotate-90 lg:rotate-0">
                    <DiamondMinus size={28} className="text-blue-500/50" />
                  </div>
                )}
                {enrollmentPeriod.endDate && (
                  <div className="flex flex-col text-center lg:text-left">
                    <span className="text-xs text-blue-400/80 mb-1 tracking-wider uppercase font-semibold">এনরোলমেন্ট শেষ</span>
                    <span className="text-xl font-bold text-white">{enrollmentPeriod.endDate}</span>
                  </div>
                )}
                {enrollmentPeriod.classStart && (
                  <>
                    <div className="flex items-center justify-center rotate-90 lg:rotate-0">
                      <DiamondMinus size={28} className="text-blue-500/50" />
                    </div>
                    <div className="flex flex-col text-center lg:text-left">
                      <span className="text-xs text-blue-400/80 mb-1 tracking-wider uppercase font-semibold">ক্লাস শুরু</span>
                      <span className="text-xl font-bold text-white">{enrollmentPeriod.classStart}</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/checkout?course=english-for-professional-communication">
              <div className="inline-block relative p-[1.5px] rounded-xl overflow-hidden">
                <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(217_91%_60%)_100%)]" />
                <button className="relative bg-gradient-to-r from-blue-800 via-blue-500 to-blue-700 hover:from-blue-700 hover:via-blue-400 hover:to-blue-700 transition-all duration-300 text-white font-bold font-bangla text-base px-10 py-3.5 rounded-xl shadow-[0_0_24px_hsl(217_91%_60%/0.4)] hover:shadow-[0_0_36px_hsl(217_91%_60%/0.6)] cursor-pointer">
                  আজই এনরোল করুন
                </button>
              </div>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/50 text-sm font-bangla">
            {[
              { val: "3 মাস", lbl: "কোর্স মেয়াদ" },
              { val: "লাইভ", lbl: "ইন্টারেক্টিভ ক্লাস" },
              { val: "২৪/৭", lbl: "সাপোর্ট" },
              { val: "সার্টিফিকেট", lbl: "কোর্স শেষে" },
            ].map((s) => (
              <div key={s.lbl} className="flex flex-col items-center gap-0.5">
                <span className="text-blue-400 font-bold text-base">{s.val}</span>
                <span className="text-white/45 text-xs">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructor ── */}
      <section className="relative bg-[#060a12] overflow-hidden">
        {/* Dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(217 91% 60%) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glows */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        {/* Edge separators */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <Container className="relative z-10 py-20 max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
              </span>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-400/90">Lead Instructor</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* — Left: photo — */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[360px] lg:h-[360px]">
                {/* Outer rotated square */}
                <div className="absolute inset-0 rounded-2xl rotate-[10deg] scale-90
                    bg-gradient-to-br from-blue-500/8 to-transparent
                    border border-blue-500/20
                    shadow-[0_0_40px_hsl(217_91%_60%/0.12)]">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blue-400/50 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blue-400/50 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blue-400/50 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blue-400/50 rounded-br-2xl" />
                </div>
                {/* Inner rotated square */}
                <div className="absolute inset-0 rounded-2xl rotate-[4deg] scale-95
                    bg-gradient-to-br from-blue-500/12 via-[#060a12] to-blue-500/6
                    border border-blue-400/35
                    shadow-[0_0_50px_hsl(217_91%_60%/0.2),inset_0_1px_0_hsl(217_91%_60%/0.15)]">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400/70 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400/70 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400/70 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400/70 rounded-br-2xl" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent rounded-t-2xl" />
                </div>
                {/* Circular photo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative p-[2.5px] rounded-full overflow-hidden w-[82%] h-[82%]
                      [background:conic-gradient(from_0deg,hsl(217_91%_60%/0.8),hsl(217_91%_60%/0.1)_60%,hsl(217_91%_60%/0.8))]
                      shadow-[0_0_40px_hsl(217_91%_60%/0.35),0_0_80px_hsl(217_91%_60%/0.15)]">
                    <div className="relative rounded-full overflow-hidden w-full h-full">
                      <Image
                        src={PuspitaSingha}
                        alt="Puspita Singha — Lead Instructor"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* — Right: bio — */}
            <div className="flex flex-col gap-6">
              {/* Name + title */}
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                  Puspita Singha
                </h2>
                <p className="text-blue-400/80 font-semibold text-sm tracking-wide mt-1 uppercase">
                  Lead Instructor — English For Professional Communication
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                {[
                  { value: "৩+", label: "বছরের অভিজ্ঞতা" },
                  { value: "৫০০+", label: "শিক্ষার্থী" },
                  { value: "১০০+", label: "ক্লাস ডেলিভারড" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <span className="text-2xl font-black text-blue-400">{s.value}</span>
                    <span className="text-[10px] text-white/45 uppercase tracking-wider font-bangla">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <p className="text-white/60 font-bangla text-[15px] leading-relaxed max-w-lg">
                Puspita Singha একজন অভিজ্ঞ English Language Trainer যিনি প্রফেশনাল কমিউনিকেশন, পাবলিক স্পিকিং এবং বিজনেস ইংরেজিতে বিশেষজ্ঞ। তাঁর ইন্টারেক্টিভ ক্লাস পদ্ধতি শিক্ষার্থীদের দ্রুত আত্মবিশ্বাস অর্জনে সাহায্য করে।
              </p>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {["Business English", "Public Speaking", "Interview Prep", "Email Writing", "Presentation Skills", "Accent Training"].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300/80 border border-blue-500/20">
                    {skill}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div>
                <Link href="/checkout?course=english-for-professional-communication">
                  <div className="inline-block relative p-[1.5px] rounded-xl overflow-hidden">
                    <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(217_91%_60%)_100%)]" />
                    <button className="relative bg-gradient-to-r from-blue-800 via-blue-500 to-blue-700 hover:from-blue-700 hover:via-blue-400 hover:to-blue-700 transition-all duration-300 text-white font-bold font-bangla text-base px-8 py-3 rounded-xl shadow-[0_0_24px_hsl(217_91%_60%/0.4)] hover:shadow-[0_0_36px_hsl(217_91%_60%/0.6)] cursor-pointer">
                      আজই এনরোল করুন
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Curriculum ── */}
      <section className="relative bg-[#060a12] overflow-hidden font-bangla">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(217 91% 60%) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="relative z-10 py-20 container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 mb-6">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-400/90">পাঠ্যক্রম</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-bangla bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
              কোর্স{" "}
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                কারিকুলাম
              </span>
            </h2>
          </div>

          <div className="grid gap-5">
            {curriculum.map((module, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-blue-500/20 bg-[#060a12]/80 p-6 hover:border-blue-500/40 transition-colors"
              >
                <h3 className="text-lg font-bold text-white/90 mb-4 font-bangla">{module.title}</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {module.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60 font-bangla">
                      <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400/70" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative bg-[#060a12] overflow-hidden font-bangla">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="relative z-10 py-20 container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 mb-6">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-400/90">FAQ</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold uppercase leading-[140%]">
              <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                Frequently Asked{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                Questions
              </span>
              <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">?</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-blue-500/20 bg-[#060a12]/70 px-6 py-4 open:border-blue-500/40 transition-colors"
              >
                <summary className="cursor-pointer font-bangla font-semibold text-white/85 text-base list-none flex justify-between items-center gap-3">
                  {faq.question}
                  <span className="flex-shrink-0 text-blue-400 text-lg group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="mt-3 text-white/55 font-bangla text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enroll CTA ── */}
      <EnrollCtaSection courseSlug="english-for-professional-communication" />
    </div>
  );
}