export default function DarkCard({
    children,
    className = "",
    glowOnHover = false,
}: {
    children: React.ReactNode;
    className?: string;
    glowOnHover?: boolean;
}) {
    return (
        <div
            className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-md ring-1 ring-white/[0.02]
                ${glowOnHover ? "transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(156_70%_42%/0.1)]" : "shadow-xl shadow-black/20"}
                ${className}`}
        >
            {children}
        </div>
    );
}
