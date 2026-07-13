import Image from "next/image";
import type { StaticImageData } from "next/image";

interface TeamMember {
    name: string;
    role: string;
    company: string;
    image: StaticImageData;
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
    return (
        <div className="group relative rounded-2xl p-[1px] overflow-hidden flex flex-col
            transition-all duration-500 ease-out
            hover:-translate-y-2 hover:scale-[1.015]
            hover:shadow-[0_20px_60px_hsl(156_70%_42%/0.35)]"
        >
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <span className="absolute inset-0 animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%/0.8),transparent)]" />
                <span className="absolute inset-0 animate-[spin_12s_linear_infinite_reverse] bg-[conic-gradient(from_180deg,transparent_70%,hsl(156_85%_70%/0.4),transparent)]" />
            </div>

            <div className="relative z-10 rounded-2xl bg-surface border border-primary/15
                p-8 text-center transition-all duration-500 group-hover:border-primary/40 h-full"
            >
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <span className="absolute -left-[120%] top-0 h-full w-[60%]
                        bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12
                        group-hover:left-[120%] transition-all duration-1000 ease-out"
                    />
                </div>

                <div className="absolute inset-0 rounded-2xl
                    bg-gradient-to-b from-primary/10 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />

                <div className="relative flex justify-center mb-8">
                    <div className="relative p-[2px] rounded-full overflow-hidden w-36 h-36 shadow-[0_0_30px_hsl(156_70%_42%/0.2)]">
                        <span className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_50%,hsl(156_70%_42%/0.8),transparent)]" />
                        <span className="absolute inset-[-100%] animate-[spin_10s_linear_infinite_reverse] bg-[conic-gradient(from_180deg,transparent_70%,hsl(156_85%_70%/0.4),transparent)]" />
                        <div className="relative rounded-full overflow-hidden w-full h-full bg-surface p-[2px]">
                            <div className="relative rounded-full overflow-hidden w-full h-full">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    sizes="144px"
                                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white/90
                    transition-all duration-300
                    group-hover:text-white group-hover:tracking-wide mb-1"
                >
                    {member.name}
                </h3>

                <p className="text-sm font-semibold text-primary/80 mb-1">{member.role}</p>
                <p className="text-xs text-white/40">{member.company}</p>
            </div>
        </div>
    );
}
