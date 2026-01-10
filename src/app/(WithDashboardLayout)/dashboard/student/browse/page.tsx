/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, Calendar, DollarSign, BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useGetCoursesQuery } from "@/redux/features/course/courseApi";
import { useGetAllBatchesQuery } from "@/redux/features/batch/batchApi";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  learningOutcomes: string[];
  prerequisites?: string[];
  targetAudience: string;
  thumbnailImage: string;
  coverImage?: string;
  durationEstimate: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  price: number;
  discountPercentage?: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Batch {
  _id: string;
  courseId: string;
  title: string;
  batchNumber: number;
  description?: string;
  startDate: string;
  endDate: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  price: number;
  currency: string;
  maxCapacity?: number;
  currentEnrollment: number;
  status: 'draft' | 'upcoming' | 'running' | 'completed';
  instructors: string[];
  certificateTemplate?: string;
  accessDurationAfterEnd?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function BrowseCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({});
  const { data: batchesData, isLoading: batchesLoading } = useGetAllBatchesQuery({});

  const isLoading = coursesLoading || batchesLoading;

  const courses: Course[] = coursesData?.data || [];
  const batches: Batch[] = batchesData?.data || [];

  // Filter published courses
  const publishedCourses = courses.filter((course) =>
    course.status === 'published'
  );

  // Filter courses by search term
  const filteredCourses = publishedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get active batches for a course
  const getActiveBatches = (courseId: string) => {
    return batches.filter((batch) =>
      batch.courseId === courseId && (batch.status === 'running' || batch.status === 'upcoming')
    );
  };

  // Calculate cheapest batch price
  const getCheapestPrice = (courseId: string) => {
    const activeBatches = getActiveBatches(courseId);
    if (activeBatches.length === 0) return null;
    return Math.min(...activeBatches.map(b => b.price));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">কোর্স ব্রাউজ করুন</h1>
          <p className="text-muted-foreground">এনরোলমেন্টের জন্য উপলব্ধ কোর্স এবং ব্যাচ দেখুন</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="কোর্স খুঁজুন..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Course Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">কোনো কোর্স পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const activeBatches = getActiveBatches(course._id);
            const hasActiveBatches = activeBatches.length > 0;
            const cheapestPrice = getCheapestPrice(course._id);

            return (
              <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                {/* Thumbnail */}
                {course.thumbnailImage ? (
                  <div className="h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 relative">
                    <Image
                      src={course.thumbnailImage}
                      alt={course.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      priority={false}
                    />
                    {/* Price Badge Overlay */}
                    {cheapestPrice && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
                        ৳{cheapestPrice}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                )}

                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <Badge variant={hasActiveBatches ? "default" : "secondary"} className="flex-shrink-0">
                      {hasActiveBatches ? "খোলা" : "শীঘ্রই"}
                    </Badge>
                  </div>

                  {/* Meta Info Row */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {course.level && (
                      <Badge variant="outline" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {course.level === 'beginner' ? 'শিক্ষানবিস' : 
                         course.level === 'intermediate' ? 'মধ্যম' : 'উন্নত'}
                      </Badge>
                    )}
                    {course.category && (
                      <Badge variant="outline" className="gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course.category}
                      </Badge>
                    )}
                  </div>

                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {course.shortDescription || "বিস্তারিত বিবরণ শীঘ্রই যোগ করা হবে"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{activeBatches.length} ব্যাচ</span>
                    </div>
                    {course.durationEstimate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{course.durationEstimate} week</span>
                      </div>
                    )}
                    {course.category && (
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                        <BookOpen className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{course.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Available Batches Preview */}
                  {hasActiveBatches && (
                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">উপলব্ধ ব্যাচসমূহ:</p>
                      {activeBatches.slice(0, 2).map((batch) => (
                        <div
                          key={batch._id}
                          className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg text-xs border border-border/50"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{batch.title}</p>
                            <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                              <span className="truncate">Batch #{batch.batchNumber}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Users className="h-3 w-3" />
                                {batch.currentEnrollment || 0}{batch.maxCapacity ? `/${batch.maxCapacity}` : ''}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 font-bold text-primary ml-2 flex-shrink-0">
                            <DollarSign className="h-3.5 w-3.5" />
                            {batch.price}
                          </div>
                        </div>
                      ))}
                      {activeBatches.length > 2 && (
                        <p className="text-xs text-center text-muted-foreground py-1">
                          আরও {activeBatches.length - 2} টি ব্যাচ উপলব্ধ
                        </p>
                      )}
                    </div>
                  )}

                  {!hasActiveBatches && (
                    <div className="flex-1 flex items-center justify-center py-4 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      শীঘ্রই নতুন ব্যাচ আসছে
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    asChild
                    className="w-full"
                    variant={hasActiveBatches ? "default" : "outline"}
                    disabled={!hasActiveBatches}
                  >
                    <Link href={hasActiveBatches ? `/courses/${course.slug || course._id}` : '#'}>
                      {hasActiveBatches ? 'বিস্তারিত দেখুন ও এনরোল করুন' : 'শীঘ্রই আসছে'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
