import { COURSE_SLUGS } from "@/constants/courses";

export interface CourseConfig {
  slug: string;
  badge: string;
  label: string;
  title: string;
  titleEn: string;
  description: string;
  highlights: string[];
  accent: string;
  accentRaw: string;
  glow: string;
  border: string;
  badgeBg: string;
  highlightBg: string;
  ctaColor: string;
  shimmer: string;
  isNew: boolean;
  thumbnail: 'graphic-design' | 'english';
}

export const courses: CourseConfig[] = [
  {
    slug: COURSE_SLUGS.GRAPHIC_DESIGN,
    badge: "কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স",
    label: "Design",
    title: "AI Powered কমপ্লিট গ্রাফিক্স ডিজাইন উইথ ফ্রিল্যান্সিং",
    titleEn: "AI Powered Complete Graphic Design With Freelancing",
    description:
      "বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত হাতে-কলমে প্রজেক্ট, ক্লায়েন্ট হান্টিং ও AI-ইন্টিগ্রেটেড ডিজাইন শিখুন।",
    highlights: ["৪ মাসের কোর্স", "লাইভ ক্লাস", "১:১ মেন্টরশিপ", "সার্টিফিকেট"],
    accent: "hsl(156 70% 42%)",
    accentRaw: "#16a34a",
    glow: "group-hover:shadow-[0_20px_60px_hsl(156_70%_42%/0.30),0_4px_16px_hsl(156_70%_42%/0.15)]",
    border: "border-primary/60",
    badgeBg: "bg-primary/10 border-primary/25 text-primary/90",
    highlightBg: "bg-primary/10 text-primary/80 border-primary/20",
    ctaColor: "text-primary",
    shimmer: "via-primary/60",
    isNew: false,
    thumbnail: "graphic-design" as const,
  },
  {
    slug: COURSE_SLUGS.ENGLISH,
    badge: "English For Professional Communication",
    label: "Language",
    title: "English For Professional Communication",
    titleEn: "English For Professional Communication",
    description:
      "প্রফেশনাল পরিবেশে আত্মবিশ্বাসের সাথে ইংরেজি বলতে শিখুন। Puspita Singha-র তত্ত্বাবধানে ইন্টারভিউ, প্রেজেন্টেশন ও বিজনেস কমিউনিকেশন শিখুন।",
    highlights: ["প্রফেশনাল ইংরেজি", "স্পিকিং প্র্যাকটিস", "লাইভ সাপোর্ট", "সার্টিফিকেট"],
    accent: "hsl(217 91% 60%)",
    accentRaw: "#3b82f6",
    glow: "group-hover:shadow-[0_20px_60px_hsl(217_91%_60%/0.28),0_4px_16px_hsl(217_91%_60%/0.14)]",
    border: "border-blue-500/60",
    badgeBg: "bg-blue-500/10 border-blue-500/25 text-blue-400/90",
    highlightBg: "bg-blue-500/10 text-blue-400/80 border-blue-500/20",
    ctaColor: "text-blue-400",
    shimmer: "via-blue-500/60",
    isNew: true,
    thumbnail: "english" as const,
  },
];
