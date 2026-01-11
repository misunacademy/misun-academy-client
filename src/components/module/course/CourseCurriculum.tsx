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
        <div className="min-h-screen bg-white font-sans">
            <section className="py-10">
                <div className="container mx-auto px-4">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-bangla text-black">
                            কোর্স <span className="text-emerald-500">কারিকুলাম</span>
                        </h2>
                        <p className="text-sm md:text-base font-bangla text-gray-600 max-w-2xl mx-auto">
                            একেবারে শুরু থেকে প্রফেশনাল ডিজাইনার হওয়ার একটি পূর্ণাঙ্গ ভ্রমণ, হাতে-কলমে প্রকল্প এবং ক্লায়েন্ট হান্টিং কৌশলসহ।
                        </p>
                    </div>

                    <div className="grid gap-6 max-w-5xl mx-auto">
                        
                        {/* Dynamic Mapping over the courses array */}
                        {courseCurriculum.courses.map((course, index) => {
                            const isOpen = openStates[index] || false;
                            
                            // Calculate total items for the badge
                            const moduleCount = course.modules?.length || 0;
                            const projectCount = course.projects?.length || 0;
                            const totalItems = moduleCount + projectCount;

                            return (
                                <div key={index} className="rounded-2xl bg-emerald-50 overflow-hidden transition-all duration-300 hover:shadow-sm">
                                    <Collapsible 
                                        open={isOpen} 
                                        onOpenChange={() => toggleSection(index)}
                                    >
                                        {/* FIX: The Trigger wraps the content. No manual onClick needed. */}
                                        <CollapsibleTrigger asChild>
                                            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-emerald-100/50 transition-colors select-none">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2">
                                                        {getIcon(course.title)}
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="text-xl font-bold text-emerald-600">{course.title}</h3>
                                                        <p className="text-xs text-gray-500">{course.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-medium text-gray-600 hidden md:block">
                                                        {totalItems} Modules
                                                    </span>
                                                    {isOpen ? <ChevronDown className="h-4 w-4 text-gray-600" /> : <ChevronRight className="h-4 w-4 text-gray-600" />}
                                                </div>
                                            </div>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent>
                                            <CardContent className="pt-0 px-6 pb-6">
                                                <div className="grid gap-8">
                                                    
                                                    {/* Modules Section */}
                                                    {course.modules && course.modules.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium text-sm text-gray-600 mb-4">
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
                                                            <h4 className="font-semibold text-sm text-gray-700 mb-4">Project Based Classes</h4>
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
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-[#6ee7b7] hover:bg-[#34d399] transition-colors text-black shadow-sm">
        <div className="flex items-center gap-3 flex-1">
            <div className="min-w-[24px] h-6 flex items-center justify-center text-sm font-semibold opacity-70 ">
                {data.id}
            </div>
            <span className="text-sm font-medium leading-tight">{data.title}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0 md:pl-4 justify-between md:justify-end min-w-[140px]">
            {data.type && (
                <Badge className="bg-black text-white hover:bg-gray-800 border-0 text-[10px] px-2 py-0.5 h-5 rounded-md uppercase">
                    {data.type}
                </Badge>
            )}
            <span className="text-xs text-gray-700 opacity-80 whitespace-nowrap">{data.duration}</span>
        </div>
    </div>
);

const ProjectItem = ({ data }: { data: any }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-[#6ee7b7] hover:bg-[#34d399] transition-colors text-black shadow-sm">
        <div className="flex items-center gap-3 flex-1">
            <div className="min-w-[24px] h-6 flex items-center justify-center opacity-70">
                <Trophy className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium leading-tight">{data.title}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0 md:pl-4 justify-between md:justify-end min-w-[140px]">
            <Badge className="bg-black/10 text-black hover:bg-black/20 border-0 text-[10px] px-2 py-0.5 h-5 rounded-md">
                PROJECT
            </Badge>
            <span className="text-xs text-gray-700 opacity-80 whitespace-nowrap">{data.duration}</span>
        </div>
    </div>
);

export default CourseCurriculum;