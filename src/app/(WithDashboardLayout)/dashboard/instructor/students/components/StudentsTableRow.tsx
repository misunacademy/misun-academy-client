import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface StudentRow {
  _id: string;
  enrollmentId?: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  status: string;
  enrolledAt: string;
  batchTitle: string;
  courseTitle: string;
}

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status?.toLowerCase()) {
    case "active":
      return "default";
    case "completed":
      return "default";
    case "suspended":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
};

interface StudentsTableRowProps {
  student: StudentRow;
}

const StudentsTableRow = ({ student }: StudentsTableRowProps) => {
  const initials = student.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={student.image} alt={student.name} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{student.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{student.enrollmentId}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{student.email}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{student.phone}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{student.courseTitle || "-"}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{student.batchTitle || "-"}</span>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(student.status)} className="capitalize">
          {student.status.replace(/-/g, " ")}
        </Badge>
      </TableCell>
      <TableCell>
        {student.enrolledAt
          ? new Date(student.enrolledAt).toLocaleDateString("en-US", { dateStyle: "medium" })
          : "-"}
      </TableCell>
    </>
  );
};

export default StudentsTableRow;
