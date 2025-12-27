/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { CourseStats } from "@/components/module/dashboard/admin/CourseStats";
import { CoursesTable } from "@/components/module/dashboard/admin/CoursesTable";
import { EditCourseDialog } from "@/components/module/dashboard/admin/EditCourseDialog";
import { Course } from "@/types/common";



type DateField = 'enrollmentStartDate' | 'enrollmentEndDate' | 'courseStartDate' | 'courseEndDate' | 'enrollmentDeadline';

export default function AdminCourses() {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch courses from server
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses`, { credentials: 'include' });
      const j = await res.json();
      const data = (j?.data || []) as Array<Record<string, any>>;
      // normalize dates
      const normalized = data.map((c) => ({
        _id: c._id as string,
        title: String(c.title || ''),
        instructor: String((c.instructor && (c.instructor.name || c.instructor.email)) || ''),
        students: Number(c.enrollment?.currentEnrollment || 0),
        duration: c.duration?.weeks ? `${c.duration.weeks} weeks` : c.duration?.hours ? `${c.duration.hours} hours` : '',
        price: Number(c.pricing?.amount || 0),
        status: (c.isPublished ? 'active' : 'draft') as Course['status'],
        category: String(c.category || ''),
        enrollmentStartDate: c.enrollment?.startDate ? new Date(c.enrollment.startDate) : undefined,
        enrollmentEndDate: c.enrollment?.endDate ? new Date(c.enrollment.endDate) : undefined,
        courseStartDate: c.enrollment?.startDate ? new Date(c.enrollment.startDate) : undefined,
        courseEndDate: c.enrollment?.endDate ? new Date(c.enrollment.endDate) : undefined,
        enrollmentDeadline: c.enrollment?.enrollmentDeadline ? new Date(c.enrollment.enrollmentDeadline) : undefined,
        schedule: String(c.schedule || '')
      }));
      setCourses(normalized);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  const handleAddNewCourse = () => {
    const newCourse: Course = {
      title: "",
      subtitle: "",
      description: "",
      shortDescription: "",
      instructor: "",
      courseCode: "",
      category: "Programming",
      subcategory: "",
      level: "Beginner",
      language: "English",
      duration: "",
      pricing: { amount: 0, currency: "BDT" },
      enrollment: { capacity: 0, status: "open" },
      tags: [],
      thumbnailUrl: "",
      coverImageUrl: "",
      isPublished: false,
      isFeatured: false,
      students: 0,
      price: 0,
      status: "draft",
      enrollmentStartDate: new Date(),
      enrollmentEndDate: new Date(),
      courseStartDate: new Date(),
      courseEndDate: new Date(),
      enrollmentDeadline: new Date(),
      schedule: ""
    };
    setEditingCourse(newCourse);
    setIsAddingNew(true);
    setIsEditDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    if (!editingCourse) return;
    setLoading(true);
    try {
      if (isAddingNew) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCourse),
        });
        const j = await res.json();
        if (res.ok) {
          await fetchCourses();
        } else {
          throw new Error(j.message || 'Failed to create course');
        }
      } else if (editingCourse._id) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${editingCourse._id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCourse),
        });
        const j = await res.json();
        if (res.ok) {
          await fetchCourses();
        } else {
          throw new Error(j.message || 'Failed to update course');
        }
      }
      setIsEditDialogOpen(false);
      setEditingCourse(null);
      setIsAddingNew(false);
    } catch (err) {
      const message = (err as any)?.message || 'Save failed';
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string | number | undefined) => {
    if (!courseId) return;
    const id = String(courseId);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const j = await res.json();
      if (res.ok) {
        await fetchCourses();
      } else {
        throw new Error(j.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleDateChange = (field: DateField, date: Date | undefined) => {
    if (editingCourse && date) {
      setEditingCourse({ ...editingCourse, [field]: date });
    }
  };

  const handleFieldChange = (field: keyof Course, value: any) => {
    if (editingCourse) {
      setEditingCourse({ ...editingCourse, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses Management</h1>
          <p className="text-muted-foreground">Manage all courses and their content</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddNewCourse}>
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <CourseStats />

      <CoursesTable courses={courses} onEditCourse={(c) => { setEditingCourse({
        ...c,
        enrollmentStartDate: c.enrollmentStartDate ? new Date(c.enrollmentStartDate) : undefined,
        enrollmentEndDate: c.enrollmentEndDate ? new Date(c.enrollmentEndDate) : undefined,
        courseStartDate: c.courseStartDate ? new Date(c.courseStartDate) : undefined,
        courseEndDate: c.courseEndDate ? new Date(c.courseEndDate) : undefined,
        enrollmentDeadline: c.enrollmentDeadline ? new Date(c.enrollmentDeadline) : undefined,
      }); setIsAddingNew(false); setIsEditDialogOpen(true); }} onDeleteCourse={(id) => handleDeleteCourse(id)} />

      <EditCourseDialog
        editingCourse={editingCourse}
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingCourse(null);
            setIsAddingNew(false);
          }
        }}
        onSave={handleSaveCourse}
        onDateChange={handleDateChange}
        onFieldChange={handleFieldChange}
        isAddingNew={isAddingNew}
      />
    </div>
  );
}