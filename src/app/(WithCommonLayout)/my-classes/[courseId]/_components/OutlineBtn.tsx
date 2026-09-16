export default function OutlineBtn({
    children,
    onClick,
    disabled,
    className = "",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
                border border-white/[0.06] text-white/60 bg-white/[0.02]
                hover:border-primary/40 hover:text-primary hover:bg-primary/5
                transition-all duration-300
                disabled:opacity-30 disabled:cursor-not-allowed
                ${className}`}
        >
            {children}
        </button>
    );
}
