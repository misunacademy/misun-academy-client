import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, FileText } from "lucide-react";
import type { CourseResponse } from "@/redux/api/courseApi";
import DarkCard from "./DarkCard";
import CourseOverviewTab from "./CourseOverviewTab";
import CourseResourcesTab from "./CourseResourcesTab";

interface LessonLink {
    lessonId: string;
    title: string;
    media?: { url?: string };
    duration?: number;
    resources?: Array<{ type?: string; title?: string; url?: string; textContent?: string }>;
}

interface AugmentedResource {
    type?: string;
    title?: string;
    url?: string;
    textContent?: string;
    lessonTitle: string;
    moduleTitle: string;
    lessonId: string;
}

interface CourseTabsSectionProps {
    course: CourseResponse;
    totalLessons: number;
    instructorName: string;
    calculatedPercentage: number;
    allResources: AugmentedResource[];
    currentLesson: LessonLink | undefined;
}

export default function CourseTabsSection({
    course, totalLessons, instructorName, calculatedPercentage, allResources, currentLesson,
}: CourseTabsSectionProps) {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <div className="relative">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <TabsList className="h-auto p-0 bg-transparent rounded-none w-full justify-start gap-0">
                    {[
                        { value: "overview", icon: <BookOpen className="w-4 h-4" />, label: "Overview" },
                        { value: "live-classes", icon: <Calendar className="w-4 h-4" />, label: "Live Classes" },
                        { value: "resources", icon: <FileText className="w-4 h-4" />, label: "Resources" },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex items-center gap-2 px-5 py-3 rounded-none border-b-2 border-transparent
                                text-sm font-semibold text-white/40
                                data-[state=active]:border-primary data-[state=active]:text-primary
                                data-[state=active]:bg-transparent data-[state=active]:shadow-none
                                hover:text-white/70 transition-all duration-200"
                        >
                            {tab.icon}
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <TabsContent value="overview">
                <CourseOverviewTab
                    description={course.description}
                    duration={course.duration}
                    totalLessons={totalLessons}
                    instructorName={instructorName}
                    calculatedPercentage={calculatedPercentage}
                />
            </TabsContent>

            <TabsContent value="live-classes" className="mt-4">
                <DarkCard className="p-8 text-center">
                    <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    <div className="relative space-y-4">
                        <div className="w-14 h-14 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto">
                            <Calendar className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-white">No Live Classes Scheduled</h3>
                        <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                            There are no live classes scheduled at the moment. Check back later or contact your instructor.
                        </p>
                    </div>
                </DarkCard>
            </TabsContent>

            <TabsContent value="resources">
                <CourseResourcesTab
                    resources={allResources.filter((r) => r?.lessonId === currentLesson?.lessonId)}
                />
            </TabsContent>
        </Tabs>
    );
}
