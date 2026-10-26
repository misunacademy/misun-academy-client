// src/components/ui/ai-powered-badge.tsx
// import { Sparkles } from "lucide-react"
// import { cn } from "@/lib/utils"

// export function AIPoweredBadge({ className }: { className?: string }) {
//   return (
//     <span
//       className={cn(
//         "relative inline-flex items-center rounded-full p-[1px]",
//         "bg-gradient-to-b from-[#D4AF37]/60 via-[#FFF8DC]/20 to-[#8B7355]/60",
//         "shadow-[0_0_20px_rgba(212,175,55,0.12),0_4px_16px_rgba(0,0,0,0.4)]",
//         className
//       )}
//     >
//       <span className="inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] px-4 py-[7px] text-[13px] font-medium tracking-wide leading-none text-[#FFF8E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
//         <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" strokeWidth={1.75} />
//         AI Powered
//       </span>
//     </span>
//   )
// }




interface AIPoweredBadgeProps {
  className?: string;
}

export function AIPoweredBadge({
  className = "",
}: AIPoweredBadgeProps) {
  return (
    <span
      className={`mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white px-4 py-2 text-base font-bold tracking-wide shadow-[0_4px_20px_rgba(139,92,246,0.15)] ring-1 ring-pink-100/70 ${className}`}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 drop-shadow-[0_1px_3px_rgba(139,92,246,0.3)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="ai-multicolor-gradient"
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="25%" stopColor="#EC4899" />
            <stop offset="55%" stopColor="#8B5CF6" />
            <stop offset="80%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        <path
          d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"
          fill="url(#ai-multicolor-gradient)"
        />

        <path
          d="M19 14l.9 3.1L23 18l-3.1.9L19 22l-.9-3.1L15 18l3.1-.9L19 14z"
          fill="url(#ai-multicolor-gradient)"
        />
      </svg>

      <span className="bg-gradient-to-r from-amber-500 via-pink-500 via-violet-600 to-cyan-500 bg-clip-text text-transparent text-sm sm:text-lg">
        AI Powered
      </span>

      {/* <span
        className="ml-0.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.55)]"
        aria-hidden="true"
      /> */}
    </span>
  );
}
