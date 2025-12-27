"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Loader2
} from "lucide-react";
import { VideoPlayer } from "@/components/module/dashboard/student/VideoPlayer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetCourseByIdQuery } from "@/redux/features/course/courseApi";
import { useGetCourseProgressQuery, useCompleteLessonMutation } from "@/redux/features/course/courseApi";
import { toast } from "sonner";

interface Lesson {
  lessonId: string;
  title: string;
  type: string;
  duration?: number;
  isPreview: boolean;
  content?: any;
  media?: {
    type: string;
    url: string;
    thumbnail?: string;
  };
}

interface Module {
  moduleId: string;
  title: string;
  description?: string;
  order: number;
  duration?: number;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  instructor: {
    name: string;
  };
  duration: {
    hours: number;
    weeks: number;
  };
  curriculum: Module[];
  thumbnailUrl?: string;
}

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
  const params = useParams();
  const courseId = params.courseId as string;

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Fetch course details
  const { data: courseData, isLoading: courseLoading } = useGetCourseByIdQuery(courseId);
  const course: Course | undefined = courseData?.data;

  // Fetch course progress
  const { data: progressData, isLoading: progressLoading, refetch: refetchProgress } = useGetCourseProgressQuery(courseId);
  const progress: CourseProgress | undefined = progressData?.data;

  // Complete lesson mutation
  const [completeLesson, { isLoading: completingLesson }] = useCompleteLessonMutation();

  // Set current lesson based on progress
  useEffect(() => {
    if (progress?.currentLesson && course?.curriculum) {
      const moduleIndex = course.curriculum.findIndex(m => m.moduleId === progress.currentLesson?.moduleId);
      const lessonIndex = course.curriculum[moduleIndex]?.lessons.findIndex(l => l.lessonId === progress.currentLesson?.lessonId);

      if (moduleIndex >= 0) setCurrentModuleIndex(moduleIndex);
      if (lessonIndex >= 0) setCurrentLessonIndex(lessonIndex);
    }
  }, [progress, course]);

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
        <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist or you don't have access to it.</p>
        <Link href="/dashboard/student/courses">
          <Button>Back to My Courses</Button>
        </Link>
      </div>
    );
  }

  const currentModule = course.curriculum[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    return progress?.completedLessons?.some(
      completed => completed.moduleId === moduleId && completed.lessonId === lessonId
    ) || false;
  };

  const handleNextLesson = () => {
    if (!currentModule) return;

    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.curriculum.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePrevLesson = () => {
    if (!currentModule) return;

    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = course.curriculum[currentModuleIndex - 1];
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
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

      // Auto-advance to next lesson
      handleNextLesson();
    } catch (error) {
      toast.error("Failed to complete lesson. Please try again.");
    }
  };

  const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessonsCount = progress?.completedLessons?.length || 0;

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
          <p className="text-muted-foreground">by {course.instructor?.name || 'Instructor'}</p>
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
              {progress?.percentage || 0}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress?.percentage || 0} className="h-3" />
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
          {currentLesson && (
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
              </CardContent>
            </Card>
          )}

          {/* Lesson Navigation */}
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

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Lesson {currentLessonIndex + 1} of {currentModule?.lessons.length}
                  </span>
                </div>

                <Button
                  onClick={handleNextLesson}
                  disabled={
                    currentModuleIndex === course.curriculum.length - 1 &&
                    currentLessonIndex === currentModule?.lessons.length - 1
                  }
                >
                  Next Lesson
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module List */}
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.curriculum.map((module, moduleIdx) => (
                  <div key={module.moduleId} className="space-y-2">
                    <h4 className="font-semibold text-sm">{module.title}</h4>
                    <div className="space-y-1 ml-4">
                      {module.lessons.map((lesson, lessonIdx) => {
                        const isCompleted = isLessonCompleted(module.moduleId, lesson.lessonId);
                        const isCurrent = moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex;

                        return (
                          <button
                            key={lesson.lessonId}
                            onClick={() => {
                              setCurrentModuleIndex(moduleIdx);
                              setCurrentLessonIndex(lessonIdx);
                            }}
                            className={`w-full text-left p-2 rounded-lg border transition-colors text-sm ${
                              isCurrent
                                ? 'bg-blue-50 border-blue-200'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <PlayCircle className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium ${
                                  isCurrent ? 'text-blue-900' : 'text-gray-900'
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentLesson && (
                <Button
                  className="w-full"
                  onClick={handleCompleteLesson}
                  disabled={isLessonCompleted(currentModule?.moduleId || '', currentLesson.lessonId) || completingLesson}
                >
                  {completingLesson ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {isLessonCompleted(currentModule?.moduleId || '', currentLesson.lessonId)
                    ? 'Lesson Completed'
                    : 'Mark as Complete'
                  }
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Download Certificate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}