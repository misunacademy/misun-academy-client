import { Layers, Trophy, Clock, Users } from "lucide-react"
import { courseCurriculum } from "@/data/courseCurriculum"
import { CourseCurriculumContent, COURSE_CONFIG } from "./curriculum"

const courses = courseCurriculum.courses

const CourseCurriculum = () => (
  <section className="relative bg-surface overflow-hidden font-sans">
    <div
      className="absolute inset-0 opacity-[0.035] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
    <div
      aria-hidden="true"
      className="absolute -top-40 right-[-120px] w-[520px] h-[520px] rounded-full bg-primary/[0.09] blur-[140px] pointer-events-none"
    />
    <div
      aria-hidden="true"
      className="absolute -bottom-48 left-[-140px] w-[460px] h-[460px] rounded-full bg-primary/[0.07] blur-[130px] pointer-events-none"
    />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

    <div className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader />

      <CourseCurriculumContent courseConfigs={COURSE_CONFIG} />

      <SummaryBar />
    </div>
  </section>
)

function SectionHeader() {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
        </span>
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">
          পাঠ্যক্রম
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 font-bangla bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
        কোর্স{" "}
        <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_18px_hsl(156_70%_42%/0.4)]">
          কারিকুলাম
        </span>
      </h2>
      <p className="text-sm md:text-base font-bangla text-white/50 max-w-2xl mx-auto">
        একেবারে শুরু থেকে প্রফেশনাল ডিজাইনার হওয়ার একটি পূর্ণাঙ্গ পথ—হাতে-কলমে প্রজেক্ট ও ক্লায়েন্ট হান্টিং কৌশলসহ।
      </p>
    </div>
  )
}

function SummaryBar() {
  const totalModules = courses.reduce(
    (a: number, c: { modules?: { duration: string }[]; projects?: { duration: string }[] }) =>
      a + (c.modules?.length ?? 0),
    0
  )
  const totalProjects = courses.reduce(
    (a: number, c: { modules?: { duration: string }[]; projects?: { duration: string }[] }) =>
      a + (c.projects?.length ?? 0),
    0
  )

  const items = [
    { icon: Layers, label: "মোট মডিউল", value: `${totalModules}+` },
    { icon: Trophy, label: "প্রজেক্ট ক্লাস", value: `${totalProjects}+` },
    { icon: Clock, label: "ঘণ্টার কন্টেন্ট", value: "100+" },
    { icon: Users, label: "স্টুডেন্ট সাপোর্ট", value: "২৪/৭" },
  ]

  return (
    <div className="mt-10 relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/8 via-transparent to-primary/8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className={`relative flex items-center gap-3.5 px-5 sm:px-6 py-5 border-white/5 ${
              i === 0
                ? "border-r border-b lg:border-b-0"
                : i === 1
                  ? "border-b lg:border-r lg:border-b-0"
                  : i === 2
                    ? "border-r"
                    : ""
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                {value}
              </p>
              <p className="text-[15px] text-white/40 font-bangla tracking-wide">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseCurriculum
