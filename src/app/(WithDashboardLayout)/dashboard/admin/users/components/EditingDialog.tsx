
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormEvent } from "react";

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

interface EditingDialogProps {
    editUser: User | null;
    editDialogOpen: boolean;
    onOpenChange: (open: boolean) => void;
    handleUpdateUser: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const EditingDialog = ({
    editDialogOpen,
    onOpenChange,
    editUser,
    handleUpdateUser,
}: EditingDialogProps) => {

    {/* Edit Dialog - Controlled programmatically */ }
    return (
        <Dialog open={editDialogOpen} onOpenChange={onOpenChange}>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information and permissions.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateUser}>
                    <input type="hidden" name="id" value={editUser?._id || ''} />
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name</Label>
                            <Input id="edit-name" name="name" defaultValue={editUser?.name || ''} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">Email</Label>
                            <Input id="edit-email" name="email" defaultValue={editUser?.email || ''} type="email" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-role" className="text-right">Role</Label>
                            <Select name="role" defaultValue={editUser?.role || 'learner'}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="learner">Learner</SelectItem>
                                    <SelectItem value="instructor">Instructor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="superadmin">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right">Status</Label>
                            <Select name="status" defaultValue={editUser?.status || 'active'}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Update User</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>


    )
}

export default EditingDialog;