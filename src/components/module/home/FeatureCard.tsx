import { memo } from "react"
import { motion } from "framer-motion"

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
}

const FeatureCard = memo(function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(32,180,134,0.06)]"
        >
            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_40%,hsl(156_70%_42%/0.4)_50%,transparent_60%,transparent_100%)]" />

            <div className="relative h-full w-full rounded-[15px] bg-surface-darker p-8 border border-white/[0.02] backdrop-blur-md transition-colors duration-500 group-hover:bg-surface">

                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/[0.15] bg-primary/[0.05] text-primary transition-colors duration-500 group-hover:bg-primary/[0.1] group-hover:text-[hsl(var(--primary-glow))]">
                    {icon}
                </div>

                <h3 className="mb-3 text-[17px] font-semibold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-white">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                    {description}
                </p>
            </div>
        </motion.div>
    );
});

export default FeatureCard;
