import { Button } from '@/components/ui/button';
import Image, { StaticImageData } from 'next/image';
import { IllustratorImg, PhotoshopImg } from '@/assets/images';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';

interface SkillItemProps {
    image: StaticImageData;
    name: string;
    delay?: number;
    index: number;
}

const SkillItem = ({ image, name, delay = 0, index }: SkillItemProps) => {
    //const isEven = index % 2 === 0;


    return (
        <div
            className="group relative"
            style={{ animationDelay: `${delay}ms` }}
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="relative w-32 h-32 flex justify-center items-center rounded-xl">
                            {/* <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div
                        className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-full h-[1px] bg-gradient-to-r ${isEven
                            ? 'from-primary/60 via-primary-glow/50 to-transparent'
                            : 'to-primary/60 via-primary-glow/50 from-transparent'
                            } animate-shimmer`}
                        style={{ animationDelay: `${delay}ms` }}
                    />
                    <div
                        className={`absolute bottom-0 ${isEven ? 'right-0' : 'left-0'} w-full h-[1px] bg-gradient-to-r ${isEven
                            ? 'to-primary/60 via-primary-glow/50 from-transparent'
                            : 'from-primary/60 via-primary-glow/50 to-transparent'
                            } animate-shimmer`}
                        style={{ animationDelay: `${delay + 200}ms` }}
                    />
                    <div
                        className={`absolute ${isEven ? 'bottom-0 left-0' : 'top-0 right-0'} h-full w-[1px] bg-gradient-to-t ${isEven
                            ? 'from-primary/60 via-primary-glow/50 to-transparent'
                            : 'to-primary/60 via-primary-glow/50 from-transparent'
                            } animate-shimmer`}
                        style={{ animationDelay: `${delay + 400}ms` }}
                    />
                    <div
                        className={`absolute ${isEven ? 'top-0 right-0' : 'bottom-0 left-0'} h-full w-[1px] bg-gradient-to-t ${isEven
                            ? 'to-primary/60 via-primary-glow/50 from-transparent'
                            : 'from-primary/60 via-primary-glow/50 to-transparent'
                            } animate-shimmer`}
                        style={{ animationDelay: `${delay + 600}ms` }}
                    />
                </div> */}

                            <div className="relative z-10 w-20 h-20 rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-all duration-999 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] animate-float">
                                <Image
                                    src={image.src}
                                    alt={name}
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 object-contain transition-all duration-999 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="">
                            {name}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

// const SkillItem = ({ image, name, delay = 0, index }: SkillItemProps) => {
//     const isEven = index % 2 === 0;

//     return (
//         <div
//             className="group relative"
//             style={{ animationDelay: `${delay}ms` }}
//         >
//             {/* Animated border container */}
//             <div className="relative w-32 h-32 flex justify-center items-center">
//                 {/* Circular border animation */}
//                 <div className="absolute inset-0 rounded-full">
//                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
//                         <circle
//                             cx="50"
//                             cy="50"
//                             r="48"
//                             fill="none"
//                             stroke="url(#gradient)"
//                             strokeWidth="0.5"
//                             strokeLinecap="round"
//                             strokeDasharray="301.59"
//                             strokeDashoffset="301.59"
//                             className="animate-[draw_7s_ease-in-out_infinite]"
//                             style={{ animationDelay: `900ms` }}
//                         />
//                         <defs>
//                             <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                                 <stop offset="0%" stopColor="hsl(var(--primary))" />
//                                 <stop offset="50%" stopColor="hsl(var(--primary-glow))" />
//                                 <stop offset="100%" stopColor="transparent" />
//                             </linearGradient>
//                         </defs>
//                     </svg>
//                 </div>

//                 {/* Icon container with hover effects */}
//                 <div className="relative z-10 w-20 h-20 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center group-hover:scale-110 transition-all duration-900 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] animate-float">
//                     <img
//                         src={image.src}
//                         alt={name}
//                         className="w-12 h-12 object-contain transition-all duration-300 group-hover:scale-110"
//                     />
//                 </div>
//             </div>

//             <p className="text-center font-semibold mt-3 text-foreground/90 group-hover:text-primary transition-colors duration-300">
//                 {name}
//             </p>
//         </div>
//     );
// };

export default function GraphicsSkills() {
    const skills = [
        { image: PhotoshopImg, name: "ফটোশপ" },
        { image: IllustratorImg, name: "ইলাস্ট্রেটর" }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto my-32 md:my-60 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 place-items-center">
                {/* <div className="col-span-2 md:col-span-1 lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[0]} delay={0} index={0} />
                </div>

                <div className="hidden md:block lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[1]} delay={200} index={1} />
                </div> */}

                <div className="col-span-2 md:col-span-4 lg:col-span-5 lg:row-span-3 flex flex-col items-center justify-center">
                    <div className="text-center space-y-6">
                        <div className="relative">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center uppercase tracking-tight">
                                <span className="text-foreground">ক্রিয়েটিভ</span>
                                <br />
                                <span className="bg-gradient-creative bg-clip-text text-primary animate-glow">
                                    ডিজাইন স্কিলস_
                                </span>
                            </h1>

                            <div className="absolute -top-20 md:-top-12 right-20 md:-right-4 w-8 h-8 bg-primary rounded-full opacity-60 hover:opacity-90 animate-float" >
                                <SkillItem {...skills[1]} delay={200} index={1} />
                            </div>
                            <div className="absolute -bottom-32 md:-bottom-12  -left-12 md:-left-32 w-4 h-4 bg-primary rounded-full opacity-40 hover:opacity-90 animate-float" style={{ animationDelay: '1s' }} >
                                <SkillItem {...skills[0]} delay={0} index={0} />
                            </div>
                        </div>

                        <p className="text-center max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed">
                            ইন্ডাস্ট্রি-স্ট্যান্ডার্ড ডিজাইন টুল শিখুন এবং আমাদের পূর্ণাঙ্গ গ্রাফিক্স ডিজাইন কোর্সের মাধ্যমে আপনার সৃজনশীলতা উন্মোচন করুন।
                        </p>

                        <div className="pt-4 hidden lg:block">
                            <Link href={"/checkout"}>
                                <Button variant="creative" className="animate-glow">
                                    আপনার ক্রিয়েটিভ যাত্রা শুরু করুন
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* 
                <div className="hidden md:block lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[1]} delay={700} index={1} />
                </div>

                <div className="col-span-2 md:col-span-1 lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[0]} delay={600} index={2} />
                </div>

                <div className="col-span-2 md:col-span-1 lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[1]} delay={800} index={4} />
                </div>

                <div className="hidden md:block lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[0]} delay={1000} index={5} />
                </div>

                <div className="hidden md:block lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[1]} delay={1200} index={6} />
                </div>

                <div className="col-span-2 md:col-span-1 lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[0]} delay={1400} index={7} />
                </div>
                <div className="col-span-18 md:col-span-1 lg:col-span-1 flex justify-center">
                    <SkillItem {...skills[0]} delay={1400} index={8} />
                </div> */}
            </div>

            {/* মোবাইলের জন্য CTA */}
            <div className="text-center lg:hidden mt-12">
                <Button variant="default" className="animate-glow">
                    আপনার সৃজনশীল যাত্রা শুরু করুন
                </Button>
            </div>

            {/* অতিরিক্ত কন্টেন্ট */}
            <div className="mt-20 text-center space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-transparent rounded-2xl mx-auto flex items-center justify-center mb-4">
                            <div className="w-8 h-8 bg-background rounded-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">ইন্ডাস্ট্রি স্ট্যান্ডার্ড টুলস</h3>
                        <p className="text-muted-foreground">বিশ্বের সেরা ডিজাইন স্টুডিওগুলো যেসব সফটওয়্যার ব্যবহার করে, সেগুলোই শিখুন।</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-transparent rounded-2xl mx-auto flex items-center justify-center mb-4">
                            <div className="w-8 h-8 bg-background rounded-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">হ্যান্ডস-অন প্রজেক্ট</h3>
                        <p className="text-muted-foreground">বাস্তব জীবনের ডিজাইন চ্যালেঞ্জ ও প্রজেক্ট দিয়ে আপনার পোর্টফোলিও গড়ে তুলুন।</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-transparent rounded-2xl mx-auto flex items-center justify-center mb-4">
                            <div className="w-8 h-8 bg-background rounded-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">এক্সপার্ট মেন্টরশিপ</h3>
                        <p className="text-muted-foreground">অভিজ্ঞ ডিজাইনার ও ইন্ডাস্ট্রি প্রফেশনালদের গাইডলাইন নিন সরাসরি।</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
