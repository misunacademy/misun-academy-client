interface GlowOrb {
    position: string;
    size: string;
    opacity: string;
    blur?: string;
    extra?: string;
    style?: React.CSSProperties;
}

const defaultOrbs: GlowOrb[] = [
    { position: "top-[-90px] left-1/2 -translate-x-1/2", size: "w-[520px] h-[220px]", opacity: "bg-primary/10" },
    { position: "top-[22%] -left-20", size: "w-[240px] h-[240px]", opacity: "bg-primary/6" },
    { position: "top-[30%] -right-16", size: "w-[220px] h-[220px]", opacity: "bg-primary/5" },
];

export default function PageBackground({
    children,
    className = "",
    dotOpacity = "opacity-[0.08]",
    dotSize = "32px",
    gradient = "bg-gradient-to-b from-[#0a0f18] via-surface to-surface-darker",
    orbs = defaultOrbs,
}: {
    children: React.ReactNode;
    className?: string;
    dotOpacity?: string;
    dotSize?: string;
    gradient?: string;
    orbs?: GlowOrb[];
}) {
    return (
        <div className={`relative min-h-screen overflow-hidden ${gradient} ${className}`}>
            <div
                className={`absolute inset-0 ${dotOpacity} pointer-events-none`}
                style={{
                    backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                    backgroundSize: dotSize,
                }}
            />
            {orbs.map((orb, i) => (
                <div
                    key={i}
                    className={`absolute ${orb.position} ${orb.size} ${orb.opacity} rounded-full ${orb.blur ?? "blur-[90px]"} pointer-events-none ${orb.extra ?? ""}`}
                    style={orb.style}
                />
            ))}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
