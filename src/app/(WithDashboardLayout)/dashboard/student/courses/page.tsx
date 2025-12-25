"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function StudentCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">Track your enrolled courses and progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Course Card 1 */}
        <Card>
          <CardHeader>
            <div className="relative w-full h-32 mb-4">
              <Image
                src="https://via.placeholder.com/300x150?text=Web+Development"
                alt="Web Development Fundamentals"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Web Development Fundamentals
            </CardTitle>
            <CardDescription>Learn the basics of HTML, CSS, and JavaScript</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>2h left</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>4.5</span>
                </div>
              </div>
              <Link href="/dashboard/student/courses/1" className="w-full">
                <Button className="w-full mt-4">Continue Learning</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Course Card 2 */}
        <Card>
          <CardHeader>
            <div className="relative w-full h-32 mb-4">
              <Image
                src="https://via.placeholder.com/300x150?text=React.js+Advanced"
                alt="React.js Advanced"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              React.js Advanced
            </CardTitle>
            <CardDescription>Master advanced React concepts and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>5h left</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>4.8</span>
                </div>
              </div>
              <Link href="/dashboard/student/courses/2" className="w-full">
                <Button className="w-full mt-4">Continue Learning</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Course Card 3 */}
        <Card>
          <CardHeader>
            <div className="relative w-full h-32 mb-4">
              <Image
                src="https://via.placeholder.com/300x150?text=Node.js+Backend"
                alt="Node.js Backend Development"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Node.js Backend Development
            </CardTitle>
            <CardDescription>Build scalable server-side applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>8h left</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>4.6</span>
                </div>
              </div>
              <Link href="/dashboard/student/courses/3" className="w-full">
                <Button className="w-full mt-4">Start Learning</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}