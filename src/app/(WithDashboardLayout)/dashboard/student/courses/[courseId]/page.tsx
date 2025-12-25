"use client";

import { useState } from "react";
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
  Download
} from "lucide-react";
import { VideoPlayer } from "@/components/module/dashboard/student/VideoPlayer";
import Link from "next/link";

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  resources?: {
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'link';
  }[];
  completed: boolean;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  modules: Module[];
}

// Mock data - replace with API call
const coursesData: Course[] = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    instructor: "John Doe",
    description: "Learn the basics of HTML, CSS, and JavaScript to build modern web applications.",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    modules: [
      {
        id: 1,
        title: "Introduction to HTML",
        description: "Learn the basics of HTML structure and semantic elements",
        duration: "15 min",
        videoUrl: "https://drive.google.com/file/d/1abc123def456/view?usp=sharing",
        completed: true,
        resources: [
          { name: "HTML Cheat Sheet", url: "#", type: "pdf" },
          { name: "Practice Exercise", url: "#", type: "link" }
        ]
      },
      {
        id: 2,
        title: "HTML Forms and Input",
        description: "Create interactive forms with various input types",
        duration: "20 min",
        videoUrl: "https://drive.google.com/file/d/1def456ghi789/view?usp=sharing",
        completed: true,
        resources: [
          { name: "Form Examples", url: "#", type: "pdf" }
        ]
      },
      {
        id: 3,
        title: "CSS Fundamentals",
        description: "Introduction to Cascading Style Sheets",
        duration: "25 min",
        videoUrl: "https://drive.google.com/file/d/1ghi789jkl012/view?usp=sharing",
        completed: true
      },
      {
        id: 4,
        title: "CSS Layout with Flexbox",
        description: "Master modern CSS layout techniques",
        duration: "30 min",
        videoUrl: "https://drive.google.com/file/d/1jkl012mno345/view?usp=sharing",
        completed: false
      },
      {
        id: 5,
        title: "JavaScript Basics",
        description: "Introduction to programming with JavaScript",
        duration: "35 min",
        videoUrl: "https://drive.google.com/file/d/1mno345pqr678/view?usp=sharing",
        completed: false
      }
    ]
  },
  {
    id: 2,
    title: "React.js Advanced",
    instructor: "Jane Smith",
    description: "Master advanced React concepts and patterns for building complex applications.",
    progress: 45,
    totalModules: 10,
    completedModules: 4,
    modules: [
      {
        id: 1,
        title: "Advanced Hooks",
        description: "Deep dive into custom hooks and advanced use cases",
        duration: "25 min",
        videoUrl: "https://drive.google.com/file/d/1stu234vwx567/view?usp=sharing",
        completed: true
      }
    ]
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    instructor: "Mike Johnson",
    description: "Build scalable server-side applications with Node.js and Express.",
    progress: 20,
    totalModules: 15,
    completedModules: 3,
    modules: [
      {
        id: 1,
        title: "Node.js Fundamentals",
        description: "Introduction to server-side JavaScript with Node.js",
        duration: "30 min",
        videoUrl: "https://drive.google.com/file/d/1yz890abc123/view?usp=sharing",
        completed: true
      }
    ]
  }
];

export default function CourseDetails({ params }: { params: { courseId: string } }) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const courseId = parseInt(params.courseId);
  const course = coursesData.find(c => c.id === courseId) || coursesData[0]; // Fallback to first course

  const currentModule = course.modules[currentModuleIndex];

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  const markModuleComplete = () => {
    // Update module completion status
    // This would typically make an API call
    console.log(`Marking module ${currentModule.id} as complete`);
  };

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
          <p className="text-muted-foreground">by {course.instructor}</p>
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
              {course.progress}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={course.progress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{course.completedModules} of {course.totalModules} modules completed</span>
              <span>{course.totalModules - course.completedModules} modules remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                {currentModule.title}
              </CardTitle>
              <CardDescription>{currentModule.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <VideoPlayer
                videoUrl={currentModule.videoUrl}
                title={currentModule.title}
              />
            </CardContent>
          </Card>

          {/* Module Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevModule}
                  disabled={currentModuleIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Module
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Module {currentModuleIndex + 1} of {course.modules.length}
                  </span>
                </div>

                <Button
                  onClick={handleNextModule}
                  disabled={currentModuleIndex === course.modules.length - 1}
                >
                  Next Module
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Module Resources */}
          {currentModule.resources && currentModule.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Module Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentModule.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{resource.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {resource.type.toUpperCase()}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module List */}
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.modules.map((module, index) => (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModuleIndex(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      index === currentModuleIndex
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${
                          index === currentModuleIndex ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {module.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{module.duration}</span>
                        </div>
                      </div>
                    </div>
                  </button>
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
              <Button
                className="w-full"
                onClick={markModuleComplete}
                disabled={currentModule.completed}
              >
                {currentModule.completed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Module Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
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