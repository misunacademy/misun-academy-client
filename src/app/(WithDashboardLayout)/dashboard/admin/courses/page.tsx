"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CourseStats } from "@/components/module/dashboard/admin/CourseStats";
import { CoursesTable } from "@/components/module/dashboard/admin/CoursesTable";
import { EditCourseDialog } from "@/components/module/dashboard/admin/EditCourseDialog";

interface Course {
  id: number;
  title: string;
  instructor: string;
  students: number;
  duration: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
  enrollmentStartDate: Date;
  enrollmentEndDate: Date;
  courseStartDate: Date;
  courseEndDate: Date;
  enrollmentDeadline: Date;
  schedule: string;
}

type DateField = 'enrollmentStartDate' | 'enrollmentEndDate' | 'courseStartDate' | 'courseEndDate' | 'enrollmentDeadline';

export default function AdminCourses() {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Mock data - replace with actual API calls
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Web Development Fundamentals",
      instructor: "John Doe",
      students: 45,
      duration: "8 weeks",
      price: 299,
      status: "active",
      category: "Programming",
      enrollmentStartDate: new Date("2024-12-01"),
      enrollmentEndDate: new Date("2024-12-15"),
      courseStartDate: new Date("2024-12-20"),
      courseEndDate: new Date("2025-02-15"),
      enrollmentDeadline: new Date("2024-12-10"),
      schedule: "Mon, Wed, Fri - 7:00 PM - 9:00 PM"
    },
    {
      id: 2,
      title: "React.js Advanced",
      instructor: "Jane Smith",
      students: 32,
      duration: "6 weeks",
      price: 399,
      status: "active",
      category: "Programming",
      enrollmentStartDate: new Date("2024-12-05"),
      enrollmentEndDate: new Date("2024-12-20"),
      courseStartDate: new Date("2024-12-25"),
      courseEndDate: new Date("2025-02-05"),
      enrollmentDeadline: new Date("2024-12-15"),
      schedule: "Tue, Thu - 6:00 PM - 8:00 PM"
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      instructor: "Mike Johnson",
      students: 28,
      duration: "10 weeks",
      price: 499,
      status: "draft",
      category: "Programming",
      enrollmentStartDate: new Date("2025-01-01"),
      enrollmentEndDate: new Date("2025-01-15"),
      courseStartDate: new Date("2025-01-20"),
      courseEndDate: new Date("2025-03-30"),
      enrollmentDeadline: new Date("2025-01-10"),
      schedule: "Sat, Sun - 10:00 AM - 12:00 PM"
    }
  ]);

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setIsAddingNew(false);
    setIsEditDialogOpen(true);
  };

  const handleAddNewCourse = () => {
    const newCourse: Course = {
      id: Date.now(), // Temporary ID for new courses
      title: "",
      instructor: "",
      students: 0,
      duration: "",
      price: 0,
      status: "draft",
      category: "Programming",
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

  const handleSaveCourse = () => {
    if (editingCourse) {
      if (isAddingNew) {
        // Add new course
        setCourses([...courses, editingCourse]);
      } else {
        // Update existing course
        setCourses(courses.map(course =>
          course.id === editingCourse.id ? editingCourse : course
        ));
      }
    }
    setIsEditDialogOpen(false);
    setEditingCourse(null);
    setIsAddingNew(false);
  };

  const handleDateChange = (field: DateField, date: Date | undefined) => {
    if (editingCourse && date) {
      setEditingCourse({ ...editingCourse, [field]: date });
    }
  };

  const handleFieldChange = (field: keyof Course, value: string | number) => {
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

      <CoursesTable courses={courses} onEditCourse={handleEditCourse} />

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