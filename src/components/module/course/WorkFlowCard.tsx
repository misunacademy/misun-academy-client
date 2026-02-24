import React from "react";

interface WorkflowCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    glowColor?: string;
    accentColor?: string;
}

export default function WorkflowCard({
    icon, title, description,
    glowColor = "hsl(156 70% 42%)",
    accentColor = "hsl(156 70% 42%)",
}: WorkflowCardProps) {
    return (
        <div className="p-2 group cursor-pointer">
            <div
                className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-white/8
                    py-8 px-7 h-full
                    transition-all duration-300 hover:-translate-y-1"
                style={{
                    borderColor: `color-mix(in srgb, ${accentColor} 20%, transparent)`,
                    ['--hover-glow' as string]: glowColor,
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px color-mix(in srgb, ${glowColor} 22%, transparent), inset 0 1px 0 color-mix(in srgb, ${glowColor} 20%, transparent)`;
                    (e.currentTarget as HTMLElement).style.borderColor = `color-mix(in srgb, ${accentColor} 50%, transparent)`;
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                    (e.currentTarget as HTMLElement).style.borderColor = `color-mix(in srgb, ${accentColor} 20%, transparent)`;
                }}
            >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l rounded-tl-2xl opacity-60"
                    style={{ borderColor: `color-mix(in srgb, ${accentColor} 60%, transparent)` }} />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r rounded-tr-2xl opacity-60"
                    style={{ borderColor: `color-mix(in srgb, ${accentColor} 60%, transparent)` }} />

                {/* Top shimmer on hover */}
                <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(to right, transparent, ${glowColor} 50%, transparent)` }} />

                {/* Subtle glow overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${glowColor} 10%, transparent) 0%, transparent 70%)` }} />

                {/* Icon */}
                <div className="relative z-10 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-shadow-color)_50%,transparent)] w-fit">
                    <span className="[&_svg]:w-12 [&_svg]:h-12">{icon}</span>
                </div>

                <h3 className="relative z-10 text-base font-bold mt-1 mb-2.5 font-bangla leading-snug text-white/90 group-hover:text-white transition-colors duration-300">
                    {title}
                </h3>
                <p className="relative z-10 text-sm leading-relaxed text-white/50 group-hover:text-white/70 transition-colors font-bangla">
                    {description}
                </p>
            </div>
        </div>
    );
}
