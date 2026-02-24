import { Quote, Facebook } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TestimonialCardProps {
    name: string;
    batch: string;
    studentId: string;
    testimonial: string;
    postLink?: string;
    index?: number;
}

export const TestimonialCard = ({ name, batch, studentId, testimonial, postLink, index = 0 }: TestimonialCardProps) => {
    return (
        <div
            className="group relative overflow-hidden rounded-2xl
                bg-[#060f0a] border border-primary/15
                p-6 h-full flex flex-col
                transition-all duration-300 hover:-translate-y-1
                hover:border-primary/40 hover:shadow-[0_8px_32px_hsl(156_70%_42%/0.18)]
                animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40 rounded-tr-2xl" />

            {/* Top shimmer on hover */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Hover glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

            {/* Faded quote watermark */}
            <div className="absolute -top-1 -right-1 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 group-hover:rotate-12 pointer-events-none">
                <Quote className="w-16 h-16 text-primary" />
            </div>

            <div className="relative z-10 flex flex-col gap-4 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base text-white/90 group-hover:text-white transition-colors duration-300">
                            {name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary/90">
                                {batch} ব্যাচ
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-white/35">
                                ID: {studentId}
                            </span>
                        </div>
                    </div>

                    {postLink && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={postLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                                            bg-primary/8 border border-primary/15
                                            text-white/40 hover:text-[#1877F2]
                                            hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30
                                            transition-all duration-200"
                                    >
                                        <Facebook className="w-4 h-4" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-[#0d2b1c] border-primary/20 text-white/80 text-xs">
                                    Facebook-এ দেখুন
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                {/* Testimonial */}
                <blockquote className="flex-1 relative">
                    <span className="absolute -left-1 -top-2 text-primary/50 text-2xl leading-none select-none">&ldquo;</span>
                    <p className="pl-3 text-sm text-white/55 leading-relaxed font-bangla group-hover:text-white/70 transition-colors duration-300">
                        {testimonial}
                    </p>
                    <span className="text-primary/50 text-xl leading-none select-none">&rdquo;</span>
                </blockquote>

                {/* Bottom accent on hover */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
        </div>
    );
};