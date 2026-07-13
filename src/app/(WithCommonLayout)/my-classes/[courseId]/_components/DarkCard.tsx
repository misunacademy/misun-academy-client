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
            className={`relative rounded-2xl border border-white/[0.04] bg-white/[0.015] backdrop-blur-md overflow-hidden ring-1 ring-white/[0.02]
                ${glowOnHover ? "transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(156_70%_42%/0.1)]" : "shadow-xl shadow-black/20"}
                ${className}`}
        >
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20 rounded-tl-2xl z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20 rounded-tr-2xl z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/10 rounded-bl-2xl z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/10 rounded-br-2xl z-10 pointer-events-none" />
            {children}
        </div>
    );
}
