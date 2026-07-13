"use client"

import { motion } from "framer-motion"
import Image, { StaticImageData } from 'next/image';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SkillBadgeProps {
    image: StaticImageData;
    name: string;
    delay?: number;
}

export default function SkillBadge({ image, name, delay = 0 }: SkillBadgeProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: delay * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="group relative cursor-pointer"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/[0.1] bg-primary/[0.02] backdrop-blur-md transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-primary/[0.25] group-hover:bg-primary/[0.05] group-hover:shadow-[0_8px_30px_rgba(32,180,134,0.15)] z-10">
                            <Image
                                src={image.src}
                                alt={name}
                                width={44}
                                height={44}
                                className="h-11 w-11 object-contain drop-shadow transition-transform duration-500 ease-in-out group-hover:scale-110"
                            />
                        </div>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="rounded-lg border border-primary/[0.15] bg-surface px-3 py-1.5 font-medium text-primary shadow-xl">
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
