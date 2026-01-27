/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Calendar,
  Users,
  BookOpen,
  X,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { VideoPlayer } from "@/components/module/dashboard/student/VideoPlayer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetCourseByIdQuery, useGetCourseProgressQuery, useCompleteLessonMutation } from "@/redux/api/courseApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface CourseProgress {
  percentage: number;
  completedLessons: Array<{
    moduleId: string;
    lessonId: string;
    completedAt: string;
  }>;
  currentLesson?: {
    moduleId: string;
    lessonId: string;
  };
}

export default function CourseDetails() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  // Local types used by this component
  type Lesson = {
    lessonId: string;
    title: string;
    media?: { url?: string };
    duration?: number;
    resources?: Array<{ type?: string; title?: string; url?: string; textContent?: string }>;
  };

  type ModuleType = {
    moduleId: string;
    title: string;
    lessons: Lesson[];
  };

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCookingMessage, setShowCookingMessage] = useState(false);
  const [hasCompletedCourse, setHasCompletedCourse] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(courseId);

  // Fetch course progress
  const { data: progressData, isLoading: progressLoading, refetch: refetchProgress } = useGetCourseProgressQuery(courseId);
  const progress: CourseProgress | undefined = progressData?.data;

  // Fetch enrollments
  const { data: enrollments } = useGetEnrollmentsQuery();

  // Complete lesson mutation
  const [completeLesson] = useCompleteLessonMutation();

  // Create a typed curriculum array to avoid implicit anys
  const curriculum: ModuleType[] = useMemo(() => (course?.curriculum as ModuleType[]) || [], [course?.curriculum]);

  // Set current lesson based on progress
  useEffect(() => {
    if (progress?.currentLesson && curriculum.length) {
      const moduleIndex = curriculum.findIndex((m: ModuleType) => m.moduleId === progress.currentLesson?.moduleId);
      const lessonIndex = curriculum[moduleIndex]?.lessons.findIndex((l: Lesson) => l.lessonId === progress.currentLesson?.lessonId);

      if (moduleIndex >= 0) {
        setCurrentModuleIndex(moduleIndex);
      }
      if (lessonIndex >= 0) {
        setCurrentLessonIndex(lessonIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress?.currentLesson?.moduleId, progress?.currentLesson?.lessonId, curriculum]);

  // Expand all modules by default
  useEffect(() => {
    if (curriculum.length) {
      setExpandedModules(new Set(curriculum.map((m: ModuleType) => m.moduleId)));
    }
  }, [curriculum]);

  // Find enrollment for this course
  const enrollment = enrollments?.data?.find(e => e.batchId?.courseId?._id === courseId);
  const batchId = enrollment?.batchId?._id;

  // Fetch batch details
  const { data: batchData } = useGetBatchByIdQuery(batchId || '', { skip: !batchId });

  const isBatchCompleted = batchData?.data?.status === 'completed';

  if (courseLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-4">The course you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link href="/dashboard/student/courses">
          <Button>Back to My Courses</Button>
        </Link>
      </div>
    );
  }

  const currentModule = curriculum?.[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    return progress?.completedLessons?.some(
      completed => completed.moduleId === moduleId && completed.lessonId === lessonId
    ) || false;
  };

  const isLessonUnlocked = (moduleIdx: number, lessonIdx: number) => {
    // Check if all previous lessons are completed
    for (let m = 0; m < moduleIdx; m++) {
      const mod = curriculum?.[m];
      if (!mod) continue;
      for (const les of mod.lessons) {
        if (!isLessonCompleted(mod.moduleId, les.lessonId)) return false;
      }
    }
    // In current module, check lessons before this one
    const mod = curriculum?.[moduleIdx];
    if (!mod) return false;
    for (let l = 0; l < lessonIdx; l++) {
      if (!isLessonCompleted(mod.moduleId, mod.lessons[l].lessonId)) return false;
    }
    return true;
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || !currentModule) return;

    try {
      await completeLesson({
        courseId,
        moduleId: currentModule.moduleId,
        lessonId: currentLesson.lessonId
      }).unwrap();

      toast.success("Lesson marked as complete!");
      refetchProgress();
    } catch (error: any) {
      console.error('Complete lesson error:', error);
      const errorMessage = error?.data?.message || "Failed to complete lesson. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleNextLesson = async () => {
    if (!currentModule || !course.curriculum) return;

    // If current lesson is not completed, complete it first
    if (!isLessonCompleted(currentModule.moduleId, currentLesson?.lessonId || '')) {
      await handleCompleteLesson();
    }

    // Check if this is the last lesson
    const isLastLesson = currentModuleIndex === course.curriculum.length - 1 &&
      currentLessonIndex === currentModule.lessons.length - 1;
    if (isLastLesson) {
      setShowCookingMessage(true);
      return;
    }

    // Move to next lesson
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.curriculum.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePrevLesson = () => {
    if (!currentModule || !course.curriculum) return;

    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = course.curriculum[currentModuleIndex - 1];
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
  };

  const handleCompleteCourse = () => {
    setHasCompletedCourse(true);
    setShowCongratulations(true);
    toast.success("Course completed successfully! 🎉");
  };

  const totalLessons = curriculum?.reduce((total: number, module: ModuleType) => total + (module.lessons?.length || 0), 0) || 0;
  const completedLessonsCount = progress?.completedLessons?.length || 0;
  const totalModules = curriculum?.length || 0;

  // Calculate progress percentage based on completed lessons
  const calculatedPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  // Collect all resources from lessons
  const allResources = curriculum?.flatMap((module: ModuleType) => 
    module.lessons?.flatMap((lesson: Lesson) => 
      (lesson.resources || []).map((resource: any) => ({
        ...resource,
        lessonTitle: lesson.title,
        moduleTitle: module.title,
      })) || []
    ) || []
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/student/courses">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">by {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Instructor'}</p>
        </div>
      </div>

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {calculatedPercentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {totalModules} modules • {totalLessons} lessons total
            </div>
            <Progress value={calculatedPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedLessonsCount} of {totalLessons} lessons completed</span>
              <span>{totalLessons - completedLessonsCount} lessons remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {currentLesson && !showCookingMessage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  {currentLesson.title}
                </CardTitle>
                <CardDescription>
                  {currentModule?.title} • Lesson {currentLessonIndex + 1} of {currentModule?.lessons.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentLesson.media?.url ? (
                  <VideoPlayer
                    videoUrl={currentLesson.media.url}
                    title={currentLesson.title}
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Content not available</p>
                    </div>
                  </div>
                )}
                {/* {!isLessonCompleted(currentModule.moduleId, currentLesson.lessonId) && (
                  <div className="mt-4 flex justify-center">
                    <Button onClick={handleCompleteLesson} disabled={completingLesson}>
                      {completingLesson ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Complete Lesson
                    </Button>
                  </div>
                )} */}
              </CardContent>
            </Card>
          )}

          {/* Cooking Message */}
          {showCookingMessage && !isBatchCompleted && !hasCompletedCourse && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <PlayCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800">Module or lesson is not cooking yet</h2>
                  <p className="text-muted-foreground">
                    The course content is being released gradually. New modules and lessons will be available soon.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check back later for updates or contact your instructor for more information.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Completion Screen */}
          {(isBatchCompleted && hasCompletedCourse && showCongratulations) && (
            <Card className="border-green-200 bg-green-50 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-green-100"
                onClick={() => setShowCongratulations(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800">Congratulations!</h2>
                  <p className="text-muted-foreground">
                    You have successfully completed the course &quot;{course.title}&quot;.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Your final progress: {calculatedPercentage}% complete
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center mt-6">
                    <Link href={`/dashboard/student/certificates`}>
                      <Button>
                        Get The Certificate
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Navigation */}
          {!showCookingMessage  && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevLesson}
                    disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Lesson {currentLessonIndex + 1} of {currentModule?.lessons.length}
                    </span>
                  </div>

                  <Button
                    onClick={handleNextLesson}
                    disabled={
                      !course.curriculum || !currentModule ||
                      (currentModuleIndex === course.curriculum.length - 1 &&
                        currentLessonIndex === currentModule.lessons.length - 1 &&
                        isLessonCompleted(currentModule.moduleId, currentLesson?.lessonId || ''))
                    }
                  >
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="live-classes">Live Classes</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              {/* <TabsTrigger value="discussions">Discussions</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{course.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Duration: {
                            course.duration
                              ? (typeof course.duration === 'object'
                                ? `${course.duration.weeks || 0} weeks, ${course.duration.hours || 0} hours`
                                : course.duration)
                              : 'TBD'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{totalLessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Instructor: {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Progress: {calculatedPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Copyright Notice */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">©</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 mb-1">Copyright Notice</p>
                      <p className="text-orange-700">
                        This course content is protected by copyright. Unauthorized distribution,
                        reproduction, or sharing of course materials is strictly prohibited and may
                        result in legal action. All rights reserved.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="live-classes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Live Classes
                  </CardTitle>
                  <CardDescription>
                    Join interactive live sessions with your instructor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Placeholder for live classes - you can replace this with actual data */}
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Live Classes Scheduled</h3>
                      <p className="text-muted-foreground mb-4">
                        There are no live classes scheduled for this course at the moment.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Check back later for upcoming sessions or contact your instructor.
                      </p>
                    </div>

                    {/* Example live class card - uncomment and modify when you have real data */}
                    {/*
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">Advanced JavaScript Concepts</h4>
                          <p className="text-sm text-muted-foreground">Live Q&A Session</p>
                        </div>
                        <Badge>Upcoming</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Dec 30, 2025</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>2:00 PM - 3:00 PM</span>
                        </div>
                      </div>
                      <Button size="sm">Join Live Class</Button>
                    </div>
                    */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Course Resources
                  </CardTitle>
                  <CardDescription>
                    Downloadable materials and additional resources from lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allResources.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Resources Available</h3>
                      <p className="text-muted-foreground">
                        Additional resources will be made available as you progress through the course.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allResources.map((resource, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {resource.type === 'link' ? (
                                <ExternalLink className="h-5 w-5 text-blue-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm mb-1">{resource.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                From: {resource.moduleTitle} → {resource.lessonTitle}
                              </p>
                              {resource.type === 'link' && resource.url && (
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Open Link
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {resource.type === 'text' && resource.textContent && (
                                <div className="mt-2 p-3 bg-muted rounded-md">
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {resource.textContent}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* <TabsContent value="discussions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Course Discussions
                  </CardTitle>
                  <CardDescription>
                    Connect with fellow students and instructors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Discussion Forum</h3>
                    <p className="text-muted-foreground mb-4">
                      Join the conversation with other students and get help from instructors.
                    </p>
                    <Button>Join Discussion</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="sticky top-0 self-start space-y-6 h-fit">
          {/* Module List */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Course Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-[70vh] overflow-y-auto *:scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-6">
                {curriculum.map((module: ModuleType, moduleIdx: number) => {
                  const moduleCompletedLessons = module.lessons.filter((lesson: Lesson) => 
                    isLessonCompleted(module.moduleId, lesson.lessonId)
                  ).length;
                  const moduleTotalLessons = module.lessons.length;
                  
                  const isExpanded = expandedModules.has(module.moduleId);

                  return (
                    <div key={module.moduleId} className="space-y-3">
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => {
                          setExpandedModules(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(module.moduleId)) {
                              newSet.delete(module.moduleId);
                            } else {
                              newSet.add(module.moduleId);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2 flex-1">
                          <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {moduleIdx + 1}
                          </span>
                          <span className="truncate">{module.title}</span>
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {moduleCompletedLessons}/{moduleTotalLessons}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                      {/* <Progress value={moduleProgress} className="h-2" /> */}
                      <Separator />
                      {isExpanded && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                          {module.lessons.map((lesson: Lesson, lessonIdx: number) => {
                            const isCompleted = isLessonCompleted(module.moduleId, lesson.lessonId);
                            const isCurrent = moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex;
                            const isUnlocked = isLessonUnlocked(moduleIdx, lessonIdx) || isCurrent;

                            return (
                              <button
                                key={lesson.lessonId}
                                onClick={() => {
                                  setCurrentModuleIndex(moduleIdx);
                                  setCurrentLessonIndex(lessonIdx);
                                }}
                                disabled={!isUnlocked}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm group ${
                                  isCurrent
                                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                                    : isCompleted
                                    ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                    : isUnlocked
                                    ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                                    : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {isCompleted ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : isCurrent ? (
                                      <PlayCircle className="h-4 w-4 text-blue-600" />
                                    ) : isUnlocked ? (
                                      <PlayCircle className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    ) : (
                                      <Lock className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium leading-tight ${
                                      isCurrent ? 'text-blue-900' : 
                                      isCompleted ? 'text-green-800' : 
                                      isUnlocked ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                      {lesson.title}
                                    </p>
                                    {lesson.duration && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {
            isBatchCompleted && 
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(isBatchCompleted && hasCompletedCourse) ? (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Course Completed!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Congratulations on completing this course.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          🎉 Course Available for Completion!
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          If you have completed all lessons, click the button below to officially complete the course and get your certificate.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-green-500 text-green-700 hover:bg-green-50 hover:border-green-600"
                    onClick={handleCompleteCourse}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Course & Get Certificate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          }
        </div>
      </div>
    </div>
  );
}