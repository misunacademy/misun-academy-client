import { DiamondMinus } from "lucide-react"
import Countdown from "../Countdown"
import { StarEnrollButton } from "../StarEnrollButton"
import { AnimatedBorder } from "@/components/shared/AnimatedBorder"
import { AIPoweredBadge } from "@/components/ui/ai-powered-badge"



interface EnrollmentPeriod {
  startDate: string
  endDate: string
  classStart: string
}

interface BannerContentProps {
  batchNumber: number
  price: number
  enrollmentPeriod: EnrollmentPeriod
  courseSlug?: string
}

export function BannerContent({ batchNumber, price, enrollmentPeriod, courseSlug }: BannerContentProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center pt-24 md:pt-28 pb-24 px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold text-primary-glow">কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স</span>
      </div>

      {/* <span className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg text-base font-bold tracking-wide text-neutral-900">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-900" aria-hidden="true">
          <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
          <path d="M19 14l.9 3.1L23 18l-3.1.9L19 22l-.9-3.1L15 18l3.1-.9L19 14z" />
        </svg>
        AI Powered
      </span> */}
      <AIPoweredBadge/>

      <h1 className="font-bold font-bangla text-[28px] md:text-3xl lg:text-5xl text-center text-white leading-snug">
        কমপ্লিট{" "}
        <span className="text-primary-glow">
          গ্রাফিক ডিজাইন
        </span>{" "}
        <span className="whitespace-nowrap">উইথ ফ্রিল্যান্সিং</span>
      </h1>

      <h2 className="block text-2xl md:text-2xl lg:text-3xl font-bold font-bangla mt-3 text-primary-glow">
        (ব্যাচ-০{batchNumber.toLocaleString("bn-BD")})
      </h2>

      <p className="readable-body w-auto sm:w-10/12 text-center max-w-3xl mt-6 mx-5 font-bangla">
        AI Powered Complete Graphic Design With Freelancing (Batch-0{batchNumber}) – এই কোর্সটি আপনাকে বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত গ্রাফিক্স ডিজাইন শেখাবে বাস্তব প্রজেক্ট ও ক্লাইন্ট হান্টিং স্ট্র্যাটেজির মাধ্যমে। ২৪/৭ সাপোর্ট, <strong>১:১</strong> মেন্টরশিপ, লাইভ ক্লাস এবং AI ইনটিগ্রেটেড ডিজাইনের সাহায্যে আপনি নিজেকে গড়ে তুলতে পারবেন একজন দক্ষ ফ্রিল্যান্স ডিজাইনার হিসেবে।
      </p>

      <Countdown courseSlug={courseSlug} />

      <div className="flex items-center gap-3 w-full max-w-xs mb-2 mt-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
      </div>

      <PriceSection price={price} />
      <EnrollmentTimelineCard enrollmentPeriod={enrollmentPeriod} />
      <CTASection courseSlug={courseSlug} />
    </div>
  )
}

function PriceSection({ price }: { price: number }) {
  return (
    <div className="relative my-6 p-[1.5px] rounded-xl overflow-hidden">
      <AnimatedBorder variant="simple" speed="3s" />
      <div className="relative rounded-xl px-8 py-4 font-bold font-bangla text-xl text-white bg-black shadow-[0_0_24px_hsl(156_70%_42%/0.4)]">
        কোর্স ফি: মাত্র{" "}
        <span className="text-primary-glow font-bold">
          {price ? price.toLocaleString("bn-IN") : "--"}
        </span>{" "}
        টাকা
      </div>
    </div>
  )
}

function EnrollmentTimelineCard({ enrollmentPeriod }: { enrollmentPeriod: EnrollmentPeriod }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10 mb-8 py-8 px-10 w-80 mx-auto md:w-[600px] lg:w-auto items-center justify-center">
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50 rounded-br-2xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="flex flex-col text-center lg:text-left">
        <span className="text-xs text-white/75 mb-1 font-semibold">এনরোলমেন্ট শুরু</span>
        <span className="text-xl font-bold text-white">{enrollmentPeriod.startDate}</span>
      </div>

      <div className="flex items-center justify-center rotate-90 lg:rotate-0">
        <DiamondMinus size={28} className="text-primary/50" aria-hidden="true" />
      </div>

      <div className="flex flex-col text-center lg:text-left">
        <span className="text-xs text-white/75 mb-1 font-semibold">এনরোলমেন্ট শেষ</span>
        <span className="text-xl font-bold text-white">{enrollmentPeriod.endDate}</span>
      </div>

      <div className="flex items-center justify-center rotate-90 lg:rotate-0">
        <DiamondMinus size={28} className="text-primary/50" aria-hidden="true" />
      </div>

      <div className="flex flex-col text-center lg:text-left">
        <span className="text-xs text-white/75 mb-1 font-semibold">ক্লাস শুরু</span>
        <span className="text-xl font-bold text-white">{enrollmentPeriod.classStart}</span>
      </div>
    </div>
  )
}

function CTASection({ courseSlug }: { courseSlug?: string }) {
  return (
    <>
      <p className="readable-muted mb-4 text-center w-5/6 mx-auto md:w-full font-bangla">
        কথা দিচ্ছি এত সাপোর্ট এবং পুরোপুরি লেগে থাকলে কোর্স শেষ হবার আগেই{" "}
        <span className="font-bold text-primary-glow">ক্লাইন্ট এর সাথে কাজ করার সুযোগ</span>{" "}
        আর কোন কোর্সেই পাবেন না।
      </p>

      <div className="mt-8 mb-10">
        <StarEnrollButton href={`/checkout?course=${courseSlug}`}>
          এনরোল করুন
        </StarEnrollButton>
      </div>
    </>
  )
}
