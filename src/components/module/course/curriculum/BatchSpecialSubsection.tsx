import { Star, Target, Users, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Module = {
  icon: LucideIcon
  title: string
  description: string
  /** Last item spans the full row on sm+ so the 2-col grid has no orphan */
  wide?: boolean
}

const MODULES: Module[] = [
  {
    icon: Zap,
    title: "Motion Graphic Video Using Claude",
    description:
      "ক্লডের সাথে মোশন গ্রাফিক্স ভিডিও ও এনিমেশন তৈরির সম্পূর্ণ গাইডলাইন—শূন্য থেকে প্রফেশনাল লেভেল।",
  },
  {
    icon: Zap,
    title: "Video Editing Using AI+Capcut",
    description: "AI টুলস ও ক্যাপকাট ব্যবহার করে রিলস, শর্টস ও ইউটিউব কন্টেন্ট এডিটিং হাতে-কলমে শিখুন।",
  },
  {
    icon: Target,
    title: "Personal Branding (Content)",
    description:
      "সোশ্যাল মিডিয়ায় পার্সোনাল ব্র্যান্ডিং ও কন্টেন্ট ক্রিয়েশনের মাধ্যমে ক্লায়েন্ট আকর্ষণের কার্যকর কৌশল।",
  },
  {
    icon: Star,
    title: "AI Video Making Complete Guidelines",
    description:
      "AI ভিডিও মেকিংয়ের পূর্ণাঙ্গ নির্দেশিকা—প্রম্পটিং থেকে ফাইনাল রেন্ডারিং পর্যন্ত সব ধাপ।",
  },
  {
    icon: Users,
    title: "English For Client Communication",
    description:
      "ফ্রিল্যান্স ক্লায়েন্টের সাথে কার্যকর যোগাযোগের জন্য ব্যবহারিক ইংরেজি—ইমেইল, ভয়েস কল ও মিটিং।",
    wide: true,
  },
]

export default function BatchSpecialSubsection() {
  return (
    <div
      role="group"
      aria-labelledby="batch-extra-modules-title"
      className="relative mt-12 pt-10"
    >
      {/* Divider separating this block from the curriculum tabs above */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd60a]/30 to-transparent"
      />

      {/* Header */}
      <div className="mb-8 max-w-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h3
            id="batch-extra-modules-title"
            className="font-bangla text-2xl font-bold text-white sm:text-3xl"
          >
            ব্যাচ ৮ <span className="text-[#ffd60a]">স্পেশাল</span>
          </h3>
        </div>

        <p className="readable-muted font-bangla leading-relaxed">
          মূল কারিকুলামের পাশাপাশি ব্যাচ ৮-এ থাকছে এই অতিরিক্ত মডিউলগুলো—ভিডিও এডিটিং,
          পার্সোনাল ব্র্যান্ডিং ও ক্লায়েন্ট কমিউনিকেশনে দক্ষতা বাড়ানোর জন্য।
        </p>
      </div>

      {/* Module list */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {MODULES.map(({ icon: Icon, title, description, wide }) => (
          <li
            key={title}
            className={wide ? "sm:col-span-2" : undefined}
          >
            <div className="group flex h-full items-start gap-4 rounded-xl border border-[#ffd60a]/10 bg-[#ffd60a]/5 p-4 transition-colors duration-300 hover:border-[#ffd60a]/25 hover:bg-[#ffd60a]/10 motion-reduce:transition-none sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ffd60a]/25 bg-[#ffd60a]/15 text-[#ffd60a] transition-colors duration-300 group-hover:bg-[#ffd60a] group-hover:text-black motion-reduce:transition-none">
                <Icon size={18} strokeWidth={2.25} aria-hidden />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h4 className="text-base font-bold leading-snug text-white">
                    {title}
                  </h4>
                </div>

                <p className="mt-1.5 font-bangla text-sm leading-relaxed text-white/70">
                  {description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
