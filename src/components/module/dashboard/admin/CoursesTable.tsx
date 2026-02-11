/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
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

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedCourse(null);
    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    if (onDeleteCourse && selectedCourse) {
      onDeleteCourse(selectedCourse._id);
    }
    closeDeleteDialog();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Courses</CardTitle>
        <CardDescription>View and manage all courses in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9" />
          </div>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course: any) => (
                <TableRow key={String(course._id)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs text-muted-foreground">{course.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>{course.category || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {course.level || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.durationEstimate || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={course.status === 'published' ? 'default' : course.status === 'archived' ? 'destructive' : 'secondary'}>
                      {course.status || 'draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditCourse(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(course)}>
                        <Trash2 className="h-4 w-4" />
                      </Button> 
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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

      </CardContent>
    </Card>
  );
}