import { type ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserCheck, UserX } from "lucide-react"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
  status: "active" | "suspended" | "deleted"
  enrolledBatches?: string[]
  isEnrolled?: boolean
  phone?: string
  address?: string
  image?: string
  avatar?: string
}

export function useUserColumns(
  getRoleBadgeVariant: (role: string) => BadgeVariant,
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>,
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  handleToggleStatus: (id: string, currentStatus: boolean) => void,
  setUserToDelete: React.Dispatch<React.SetStateAction<string | null>>,
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{u.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-muted-foreground">{u.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={getRoleBadgeVariant(row.original.role)}>{row.original.role}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={status === "active" ? "default" : status === "suspended" ? "secondary" : "destructive"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "enrolled",
      header: "Enrolled",
      cell: ({ row }) => {
        const batches = row.original.enrolledBatches
        return batches && batches.length > 0 ? (
          <div>
            {batches.map((entry) => (
              <div key={`${row.original._id}-${entry}`} className="text-xs flex gap-1">
                <span>{entry?.split("-")[0].includes("English") ? "English -" : "Graphic -"}</span>
                <span>{entry?.split("-")[1]}</span>
              </div>
            ))}
          </div>
        ) : (
          <Badge variant="outline">No</Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Join Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setEditUser(u); setEditDialogOpen(true) }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(u._id, u.status === "active")}>
              {u.status !== "active" ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setUserToDelete(u._id); setDeleteDialogOpen(true) }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}
