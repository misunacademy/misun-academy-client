import { TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserCheck, UserX } from "lucide-react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    status: 'active' | 'suspended' | 'deleted';
    // array of enrolled batch titles (if any)
    enrolledBatches?: string[];
    // kept for backward compatibility
    isEnrolled?: boolean;
    phone?: string;
    address?: string;
    image?: string;
    avatar?: string;
}

const TableRows = ({ user, getRoleBadgeVariant, setEditUser, setEditDialogOpen, handleToggleStatus, setUserToDelete, setDeleteDialogOpen }: {
    user: User;
    getRoleBadgeVariant: (role: string) => BadgeVariant;
    setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
    setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleToggleStatus: (id: string, currentStatus: boolean) => void;
    setUserToDelete: React.Dispatch<React.SetStateAction<string | null>>;
    setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

    return (
        <>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant={
                        user.status === "active"
                            ? "default"
                            : user.status === "suspended"
                                ? "secondary"
                                : "destructive"
                    }
                >
                    {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                </Badge>
            </TableCell>
            <TableCell>
                {user.enrolledBatches && user.enrolledBatches.length > 0 ? (
                    <div>
                        {user.enrolledBatches.map((entry) => (
                            <div key={`${user._id}-${entry}`} className="text-xs flex gap-1">
                                <span>{entry?.split("-")[0].includes("English") ? "English -" : "Graphic -"}</span>
                                <span>{entry?.split("-")[1]}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Badge variant="outline">No</Badge>
                )}
            </TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setEditUser(user);
                            setEditDialogOpen(true);
                        }}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user._id, user.status === "active")}
                    >
                        {user.status !== "active" ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setUserToDelete(user._id);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </>
    )
}

export default TableRows;