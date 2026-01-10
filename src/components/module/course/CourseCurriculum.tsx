'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    ChevronDown,
    ChevronRight,
    Play,
    BookOpen,
    FileText,
    FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { courseCurriculum } from "@/data/courseCurriculum";

const CourseCurriculum = () => {
    const [openCourses, setOpenCourses] = useState<{ [key: number]: boolean }>({});
    const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({});

    const toggleCourse = (courseIndex: number) => {
        setOpenCourses(prev => ({ ...prev, [courseIndex]: !prev[courseIndex] }));
    };

    const toggleModule = (moduleId: string) => {
        setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video': return <Play className="h-4 w-4" />;
            case 'reading': return <BookOpen className="h-4 w-4" />;
            case 'practical': return <Play className="h-4 w-4" />;
            case 'theory': return <BookOpen className="h-4 w-4" />;
            case 'strategy': return <FileText className="h-4 w-4" />;
            default: return <BookOpen className="h-4 w-4" />;
        }
    };

    const courses = courseCurriculum.courses;


    return (
        <div className="min-h-screen bg-background">
            {/* Course Curriculum */}
            <section className="py-2">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-bangla">কোর্স <span className="text-primary">কারিকুলাম</span></h2>
                        <p className="text-sm font-bangla text-secondary max-w-2xl mx-auto">
                            একেবারে শুরু থেকে প্রফেশনাল ডিজাইনার হওয়ার একটি পূর্ণাঙ্গ ভ্রমণ, হাতে-কলমে প্রকল্প এবং ক্লায়েন্ট হান্টিং কৌশলসহ।
                        </p>
                    </div>

                    <div className="grid gap-6 max-w-6xl mx-auto">
                        {courses.map((course, courseIndex) => (
                            <div key={courseIndex} className="space-y-4">
                                {/* Course Section Header - Collapsible */}
                                <Collapsible open={openCourses[courseIndex]} onOpenChange={() => toggleCourse(courseIndex)}>
                                    <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-0">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-teal-200 dark:hover:bg-teal-800">
                                                            {openCourses[courseIndex] ? 
                                                                <ChevronDown className="h-5 w-5" /> : 
                                                                <ChevronRight className="h-5 w-5" />
                                                            }
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900">
                                                        <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-bold text-teal-700 dark:text-teal-300">
                                                            {course.title}
                                                        </CardTitle>
                                                        <CardDescription className="text-sm text-teal-600 dark:text-teal-400">
                                                            {course.description}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="text-xs font-semibold bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200">
                                                    {course.totalModules} Modules
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    <CollapsibleContent className="space-y-3 mt-3">
                                        {/* Modules */}
                                        {course.modules.map((module, moduleIndex) => (
                                            <Card key={module.id} className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-0 overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer">
                                                <CardHeader className="py-3 px-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                            <span className="font-medium text-sm">{module.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="default" className="text-xs capitalize bg-gray-800 dark:bg-gray-700 text-white">
                                                                {module.type}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">{module.duration}</span>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))}

                                        {/* Projects */}
                                        {course.projects && course.projects.length > 0 && (
                                            <>
                                                <div className="pt-4">
                                                    <h4 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                                                        <FolderOpen className="h-5 w-5" />
                                                        Project Based Classes / Work On Real Project
                                                    </h4>
                                                </div>
                                                {course.projects.map((project, projectIndex) => (
                                                    <Card key={projectIndex} className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-0 overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer">
                                                        <CardHeader className="py-3 px-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                    <span className="font-medium text-sm">{project.title}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="default" className="text-xs bg-primary hover:bg-primary/90">
                                                                        Project
                                                                    </Badge>
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{project.duration}</span>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                    </Card>
                                                ))}
                                            </>
                                        )}
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        ))}
                    </div>

                    {/* Course Promise */}
                    <div className="mt-20 text-center font-bangla mb-12 max-w-7xl mx-auto">
                        <Card className="bg-gradient-to-r from-primary to-primary/80 p-10 border-0 mx-auto">
                            <div className="text-white">
                                <h3 className="text-4xl font-bold mb-6">Our Promise to You</h3>
                                <p className="text-lg mb-6 opacity-90 text-secondary">
                                    এতো শুধুমাত্র কোর্সের একটা ওভারভিউ, আরও অনেক অনেক বিষয় সম্পর্কে আলোচনা করা হবে আমার এই কোর্সে।
                                    তাই আর দেরি না করে এখনই ভর্তি হয়ে যান গ্রাফিক্স ডিজাইনার হওয়ার মিশনে।
                                </p>
                                <div className="bg-white/10 rounded-lg p-6 mb-6 text-secondary">
                                    <p className="text-xl font-semibold mb-4 text-white">
                                        কিন্তু কথা কিন্তু একটাই ৪ মাস অবশ্যই আমার গাইডলাইন মানবেন, তাহলে এই কথা দিচ্ছি কোর্স সম্পর্কে আপনার ধারনা আমি পাল্টে দিব।
                                    </p>
                                    <p className="text-lg">
                                        এবং যদি ৪ মাস লেগে থাকতে পারেন তাহলে কাজ কীভাবে না পান সেইটা আমি অবশ্যই দেখবো।
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href={"/checkout"}>
                                        <Button variant={"outline"} className='cursor-pointer hover:bg-secondary hover:text-white'>এনরোল করুন</Button>
                                    </Link>
                                    <Link href={"/feedback"}>
                                        <Button variant="secondary" size="lg" className="bg-white/20 text-white border-white/20 hover:bg-white/30">
                                            সফলতার গল্প দেখুন
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseCurriculum;