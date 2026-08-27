import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface StudentRow {
  _id: string
  enrollmentId?: string
  name: string
  email: string
  phone: string
  image?: string
  status: string
  enrolledAt: string
  batchTitle: string
  courseTitle: string
}

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status?.toLowerCase()) {
    case "active":
    case "completed":
      return "default"
    case "suspended":
      return "destructive"
    case "pending":
      return "outline"
    default:
      return "secondary"
  }
}

export function useStudentColumns(): ColumnDef<StudentRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Student",
      cell: ({ row }) => {
        const s = row.original
        const initials = s.name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2)
        return (
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={s.image} alt={s.name} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{s.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "enrollmentId",
      header: "Enrollment ID",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.enrollmentId}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email}</span>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone}</span>,
    },
    {
      accessorKey: "courseTitle",
      header: "Course",
      cell: ({ row }) => <span className="text-sm">{row.original.courseTitle || "-"}</span>,
    },
    {
      accessorKey: "batchTitle",
      header: "Batch",
      cell: ({ row }) => <span className="text-sm">{row.original.batchTitle || "-"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)} className="capitalize">
          {row.original.status.replace(/-/g, " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "enrolledAt",
      header: "Enrolled Date",
      cell: ({ row }) =>
        row.original.enrolledAt
          ? new Date(row.original.enrolledAt).toLocaleDateString("en-US", { dateStyle: "medium" })
          : "-",
    },
  ]
}
