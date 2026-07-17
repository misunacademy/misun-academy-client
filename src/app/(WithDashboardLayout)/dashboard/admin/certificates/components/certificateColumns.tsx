import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { CertificateResponse } from "@/redux/api/certificateApi"
import type { ReactNode } from "react"

export function useCertificateColumns(
  getStudentName: (cert: CertificateResponse) => string,
  getStudentEmail: (cert: CertificateResponse) => string,
  getCourseTitle: (cert: CertificateResponse) => string,
  getBatchTitle: (cert: CertificateResponse) => string,
  getStatusBadge: (status: string) => ReactNode,
  onViewDetails: (cert: CertificateResponse) => void,
): ColumnDef<CertificateResponse>[] {
  return [
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => (
        <div className="font-medium">
          {getStudentName(row.original)}
          <div className="text-xs text-muted-foreground">{getStudentEmail(row.original)}</div>
        </div>
      ),
    },
    {
      id: "course",
      header: "Course",
      cell: ({ row }) => getCourseTitle(row.original),
    },
    {
      id: "batch",
      header: "Batch",
      cell: ({ row }) => getBatchTitle(row.original),
    },
    {
      accessorKey: "createdAt",
      header: "Application Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" variant="outline" onClick={() => onViewDetails(row.original)}>
          <Eye className="mr-1 h-4 w-4" />
          Details
        </Button>
      ),
    },
  ]
}
