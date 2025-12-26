'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Image,
    Palette,
    Target,
    ChevronDown,
    ChevronRight,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import { clientHuntingModules, illustratorModules, illustratorProjects, photoshopModules, photoshopProjects } from "@/constants/curriculum";

const CourseCurriculum = () => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        photoshop: false,
        illustrator: false,
        client: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };



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
                        {/* Photoshop Hero Section */}
                        <Card className="bg-primary/10 border-0 overflow-hidden hover:shadow-glow transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-gradient-photoshop">
                                            <Image className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl mb-2 text-primary">Photoshop Hero</CardTitle>
                                            <CardDescription className="text-md">
                                                Master image editing, manipulation, and digital design
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="secondary" className="bg-creative-purple/20 text-creative-purple border-0 hover:bg-primary/10">
                                            20 Modules
                                        </Badge>
                                        <Collapsible open={openSections.photoshop} onOpenChange={() => toggleSection('photoshop')}>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    {openSections.photoshop ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                </Button>
                                            </CollapsibleTrigger>
                                        </Collapsible>
                                    </div>
                                </div>
                            </CardHeader>

                            <Collapsible open={openSections.photoshop} onOpenChange={() => toggleSection('photoshop')}>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="grid gap-6">
                                            {/* Tool Based Classes */}
                                            <div>
                                                <h4 className="font-semibold text-lg mb-4 text-secondary">Tool Based - Basic to Advanced</h4>
                                                <div className="grid gap-3">
                                                    {photoshopModules.map((module, index) => (
                                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-photoshop flex items-center justify-center text-white text-sm font-medium">
                                                                    {index + 1}
                                                                </div>
                                                                <span className="font-medium">{module.title}</span>
                                                                <Badge variant={module.type === 'theory' ? 'outline' : 'secondary'} className="text-xs hidden md:block">
                                                                    {module.type}
                                                                </Badge>
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">{module.duration}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Project Based Classes */}
                                            <div>
                                                <h4 className="font-semibold text-lg mb-4 text-creative-purple">Project Based Classes (With Client Hunting Special Tricks)</h4>
                                                <div className="grid gap-3">
                                                    {photoshopProjects.map((project, index) => (
                                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <Trophy className="h-5 w-5 text-creative-orange" />
                                                                <span className="font-medium">{project.title}</span>
                                                                <Badge className="bg-creative-orange/20 text-creative-orange border-0 text-xs hidden md:block">
                                                                    Project
                                                                </Badge>
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">{project.duration}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        {/* Illustrator Wizard Section */}
                        <Card className="bg-primary/10 border-0 overflow-hidden hover:shadow-glow transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-gradient-illustrator">
                                            <Palette className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl mb-2 text-primary">Illustrator Wizard</CardTitle>
                                            <CardDescription className="text-lg">
                                                Become a wizard in printing design and vector graphics
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="secondary" className="bg-creative-blue/20 text-creative-blue border-0 hover">
                                            19 Modules
                                        </Badge>
                                        <Collapsible open={openSections.illustrator} onOpenChange={() => toggleSection('illustrator')}>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    {openSections.illustrator ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                </Button>
                                            </CollapsibleTrigger>
                                        </Collapsible>
                                    </div>
                                </div>
                            </CardHeader>

                            <Collapsible open={openSections.illustrator} onOpenChange={() => toggleSection('illustrator')}>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="grid gap-6">
                                            {/* Tool Based Classes */}
                                            <div>
                                                <h4 className="font-semibold text-lg mb-4 text-creative-blue">Tool Based - Basic to Advanced</h4>
                                                <div className="grid gap-3">
                                                    {illustratorModules.map((module, index) => (
                                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-illustrator flex items-center justify-center text-white text-sm font-medium">
                                                                    {index + 1}
                                                                </div>
                                                                <span className="font-medium">{module.title}</span>
                                                                <Badge variant={module.type === 'theory' ? 'outline' : 'secondary'} className="text-xs hidden md:block">
                                                                    {module.type}
                                                                </Badge>
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">{module.duration}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Project Based Classes */}
                                            <div>
                                                <h4 className="font-semibold text-lg mb-4 text-creative-blue">Project Based Classes (With Client Hunting Special Tricks)</h4>
                                                <div className="grid gap-3">
                                                    {illustratorProjects.map((project, index) => (
                                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <Trophy className="h-5 w-5 text-creative-cyan" />
                                                                <span className="font-medium">{project.title}</span>
                                                                <Badge className="bg-creative-cyan/20 text-creative-cyan border-0 text-xs hidden md:block">
                                                                    Project
                                                                </Badge>
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">{project.duration}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>

                        {/* Client Hunting Guardian Section */}
                        <Card className="bg-primary/10 border-0 overflow-hidden hover:shadow-glow transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-gradient-client">
                                            <Target className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl mb-2 text-primary">Guardian in Client Hunting</CardTitle>
                                            <CardDescription className="text-lg">
                                                Master the art of finding and securing clients
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="secondary" className="bg-creative-green/20 text-creative-green border-0 hover:bg-primary/10">
                                            10 Modules
                                        </Badge>
                                        <Collapsible open={openSections.client} onOpenChange={() => toggleSection('client')}>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    {openSections.client ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                </Button>
                                            </CollapsibleTrigger>
                                        </Collapsible>
                                    </div>
                                </div>
                            </CardHeader>

                            <Collapsible open={openSections.client} onOpenChange={() => toggleSection('client')}>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="grid gap-3">
                                            {clientHuntingModules.map((module, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-client flex items-center justify-center text-white text-sm font-medium">
                                                            {index + 1}
                                                        </div>
                                                        <span className="font-medium">{module.title}</span>
                                                        <Badge className="bg-creative-green/20 text-creative-green border-0 text-xs hidden md:block">
                                                            Strategy
                                                        </Badge>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{module.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    </div>

                    {/* Course Promise */}
                    <div className="mt-20 text-center font-bangla mb-12">
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