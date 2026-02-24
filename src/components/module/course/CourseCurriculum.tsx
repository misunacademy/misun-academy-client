/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Image as ImageIcon,
    Palette,
    Target,
    ChevronDown,
    ChevronRight,
    Trophy,
    BookOpen
} from "lucide-react";
// Import your specific data structure
import { courseCurriculum } from "@/data/courseCurriculum";

const CourseCurriculum = () => {
    // State to track which sections are open by index
    // Initialize with index 0 (Photoshop) open by default
    const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({ 0: true });

    const toggleSection = (index: number) => {
        setOpenStates(prev => ({ ...prev, [index]: !prev[index] }));
    };

    // Helper to dynamically get the icon based on the course title
    const getIcon = (title: string) => {
        if (title.includes("Photoshop")) return <ImageIcon className="h-6 w-6 text-emerald-600" />;
        if (title.includes("Illustrator")) return <Palette className="h-6 w-6 text-emerald-600" />;
        if (title.includes("Client")) return <Target className="h-6 w-6 text-emerald-600" />;
        return <BookOpen className="h-6 w-6 text-emerald-600" />;
    };

    return (
        <div className="relative bg-[#060f0a] overflow-hidden font-sans">
            {/* Dot-grid */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            {/* Ambient glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
            {/* Edge separators */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <section className="relative z-10 py-16">
                <div className="container mx-auto px-4">

                    {/* Header */}
                    <div className="text-center mb-12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">পাঠ্যক্রম</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-bangla bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                            কোর্স <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.4)]">কারিকুলাম</span>
                        </h2>
                        <p className="text-sm md:text-base font-bangla text-white/55 max-w-2xl mx-auto">
                            একেবারে শুরু থেকে প্রফেশনাল ডিজাইনার হওয়ার একটি পূর্ণাঙ্গ ভ্রমণ, হাতে-কলমে প্রকল্প এবং ক্লায়েন্ট হান্টিং কৌশলসহ।
                        </p>
                    </div>

                    <div className="grid gap-6 max-w-6xl mx-auto">

                        {/* Dynamic Mapping over the courses array */}
                        {courseCurriculum.courses.map((course, index) => {
                            const isOpen = openStates[index] || false;

                            // Calculate total items for the badge
                            const moduleCount = course.modules?.length || 0;
                            const projectCount = course.projects?.length || 0;
                            const totalItems = moduleCount + projectCount;

                            return (
                                <div key={index} className="relative overflow-hidden rounded-2xl bg-[#060f0a] border border-primary/15 transition-all duration-300 hover:border-primary/35 hover:shadow-[0_4px_24px_hsl(156_70%_42%/0.12)]">
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40 rounded-tl-2xl pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40 rounded-tr-2xl pointer-events-none" />
                                    <Collapsible
                                        open={isOpen}
                                        onOpenChange={() => toggleSection(index)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors select-none">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38] shadow-[0_0_14px_hsl(156_70%_42%/0.3)]">
                                                        <span className="[&_svg]:w-5 [&_svg]:h-5 [&_svg]:text-white">{getIcon(course.title)}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="text-lg font-bold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">{course.title}</h3>
                                                        <p className="text-xs text-white/45">{course.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-medium text-primary/70 hidden md:block border border-primary/20 px-2 py-0.5 rounded-full bg-primary/8">
                                                        {totalItems} Modules
                                                    </span>
                                                    {isOpen ? <ChevronDown className="h-4 w-4 text-primary/70" /> : <ChevronRight className="h-4 w-4 text-white/40" />}
                                                </div>
                                            </div>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent>
                                            <CardContent className="pt-0 px-6 pb-6">
                                                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-6" />
                                                <div className="grid gap-8">

                                                    {/* Modules Section */}
                                                    {course.modules && course.modules.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium text-xs text-primary/70 mb-4 tracking-widest uppercase">
                                                                {course.level || "Modules"}
                                                            </h4>
                                                            <div className="grid gap-3">
                                                                {course.modules.map((module) => (
                                                                    <ModuleItem key={module.id} data={module} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Projects Section (Only renders if projects exist) */}
                                                    {course.projects && course.projects.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-xs text-primary/70 mb-4 tracking-widest uppercase">Project Based Classes</h4>
                                                            <div className="grid gap-3">
                                                                {course.projects.map((project, pIndex) => (
                                                                    <ProjectItem key={pIndex} data={project} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- Sub Components ---

const ModuleItem = ({ data }: { data: any }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl bg-primary/8 border border-primary/15 hover:bg-primary/15 hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3 flex-1">
            <div className="min-w-[24px] h-6 flex items-center justify-center text-sm font-semibold text-primary/60">
                {data.id}
            </div>
            <span className="text-sm font-medium leading-tight text-white/80">{data.title}</span>
            {data.type && (
                <Badge className="bg-primary/15 text-primary/90 hover:bg-primary/25 border border-primary/25 text-[10px] px-2 py-0.5 h-5 rounded-md uppercase">
                    {data.type}
                </Badge>
            )}
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0 md:pl-4 justify-between md:justify-end min-w-[140px]">
            <span className="text-xs text-white/40 whitespace-nowrap">{data.duration}</span>
        </div>
    </div>
);

const ProjectItem = ({ data }: { data: any }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl bg-[#0d5c36]/20 border border-primary/20 hover:bg-[#0d5c36]/30 hover:border-primary/40 transition-colors">
        <div className="flex items-center gap-3 flex-1">
            <div className="min-w-[24px] h-6 flex items-center justify-center opacity-70">
                <Trophy className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium leading-tight text-white/80">{data.title}</span>
            <Badge className="bg-primary/15 text-primary/80 hover:bg-primary/25 border border-primary/20 text-[10px] px-2 py-0.5 h-5 rounded-md">
                PROJECT
            </Badge>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0 md:pl-4 justify-between md:justify-end min-w-[140px]">
            <span className="text-xs text-white/40 whitespace-nowrap">{data.duration}</span>
        </div>
    </div>
);

export default CourseCurriculum;