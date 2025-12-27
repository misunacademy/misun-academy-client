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
    HelpCircle,
    FileText,
    FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { useGetCourseBySlugQuery } from "@/redux/features/course/courseApi";
import { Module } from "@/types/common";

const CourseCurriculum = () => {
    const { data: course, isLoading, error } = useGetCourseBySlugQuery('complete-graphics-design-course');
    const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({});

    const toggleModule = (moduleId: string) => {
        setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video': return <Play className="h-4 w-4" />;
            case 'reading': return <BookOpen className="h-4 w-4" />;
            default: return <BookOpen className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-8">Loading curriculum...</div>;
    }

    if (error || !course) {
        return <div className="flex justify-center py-8">Failed to load curriculum</div>;
    }

    const curriculum = course?.curriculum || [];



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

                    <div className="grid gap-8 max-w-6xl mx-auto">
                        {curriculum.map((module) => (
                            <Card key={module.moduleId} className="bg-primary/10 border-0 overflow-hidden hover:shadow-glow transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-gradient-photoshop">
                                                <BookOpen className="h-8 w-8 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl mb-2 text-primary">{module.title}</CardTitle>
                                                <CardDescription className="text-md">
                                                    {module.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className="bg-creative-purple/20 text-creative-purple border-0 hover:bg-primary/10">
                                                {module.lessons.length} Lessons
                                            </Badge>
                                            <Collapsible open={openModules[module.moduleId]} onOpenChange={() => toggleModule(module.moduleId)}>
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        {openModules[module.moduleId] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </Collapsible>
                                        </div>
                                    </div>
                                </CardHeader>

                                <Collapsible open={openModules[module.moduleId]} onOpenChange={() => toggleModule(module.moduleId)}>
                                    <CollapsibleContent>
                                        <CardContent className="pt-0">
                                            <div className="grid gap-3">
                                                {module.lessons.map((lesson) => (
                                                    <div key={lesson.lessonId} className="flex items-center justify-between p-4 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-photoshop flex items-center justify-center text-white text-sm font-medium">
                                                                {getLessonIcon(lesson.type)}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">{lesson.title}</span>
                                                                {lesson.isPreview && <Badge variant="outline" className="ml-2 text-xs">Preview</Badge>}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {lesson.type}
                                                            </Badge>
                                                            {lesson.duration && <span className="text-sm text-muted-foreground">{lesson.duration} min</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Collapsible>
                            </Card>
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