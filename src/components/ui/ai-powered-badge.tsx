// src/components/ui/ai-powered-badge.tsx
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIPoweredBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center rounded-full p-[1px]",
        "bg-gradient-to-b from-[#D4AF37]/60 via-[#FFF8DC]/20 to-[#8B7355]/60",
        "shadow-[0_0_20px_rgba(212,175,55,0.12),0_4px_16px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] px-4 py-[7px] text-[13px] font-medium tracking-wide leading-none text-[#FFF8E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" strokeWidth={1.75} />
        AI Powered
      </span>
    </span>
  )
}