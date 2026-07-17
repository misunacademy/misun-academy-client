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
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="relative overflow-hidden flex items-center gap-3 px-5 py-4 rounded-2xl border border-primary/5 bg-primary/5 group hover:border-primary/30 hover:bg-primary/8 transition-all duration-300"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-3xl font-black bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              {value}
            </p>
            <p className="text-lg text-white/40 font-bangla tracking-wide">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseCurriculum
