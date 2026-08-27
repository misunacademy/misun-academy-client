export default function PrimaryBtn({
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
                bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark text-white
                shadow-[0_0_14px_hsl(156_70%_42%/0.3)] hover:shadow-[0_0_22px_hsl(156_70%_42%/0.5)]
                transition-all duration-300 hover:-translate-y-px
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                ${className}`}
        >
            {children}
        </button>
    );
}
