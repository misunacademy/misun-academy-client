"use client"

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Course } from "@/types/common";

interface CoursesTableProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse?: (courseId: string | number | undefined) => void;
}

export function CoursesTable({ courses, onEditCourse, onDeleteCourse }: CoursesTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openDeleteDialog = useCallback((course: Course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setSelectedCourse(null);
    setIsDialogOpen(false);
  }, []);

  const confirmDelete = useCallback(() => {
    if (onDeleteCourse && selectedCourse) {
      onDeleteCourse(selectedCourse._id);
    }
    closeDeleteDialog();
  }, [onDeleteCourse, selectedCourse, closeDeleteDialog]);

  const columns = useMemo<ColumnDef<Course>[]>(() => [
    {
      accessorKey: "title",
      header: "Course Title",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-muted-foreground">{row.original.slug}</div>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <span>{row.original.category || '—'}</span> },
    { accessorKey: "level", header: "Level", cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.level || 'N/A'}</Badge> },
    { accessorKey: "durationEstimate", header: "Duration", cell: ({ row }) => <span>{(row.original as Course & { durationEstimate?: string }).durationEstimate || '—'}</span> },
    { accessorKey: "isCertificateAvailable", header: "Certificate", cell: ({ row }) => <Badge variant={row.original.isCertificateAvailable ? 'default' : 'destructive'}>{row.original.isCertificateAvailable ? 'Available' : 'Not Available'}</Badge> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.original.status === 'published' ? 'default' : row.original.status === 'archived' ? 'destructive' : 'secondary'}>{row.original.status || 'draft'}</Badge> },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEditCourse(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [onEditCourse, openDeleteDialog]);

  return (
    <>
      <DataTable
        heading="All Courses"
        subheading="View and manage all courses in the system"
        columns={columns}
        data={courses}
        getRowId={(course) => String(course._id)}
        emptyState="No courses found"
      />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedCourse?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}