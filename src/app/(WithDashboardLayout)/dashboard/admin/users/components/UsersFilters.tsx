import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BatchResponse } from "@/redux/api/batchApi";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface UsersFiltersProps {
    batches: BatchResponse[];
    search: string;
    roleFilter: string;
    statusFilter: string;
    batchFilter: string;
    enrolledFilter: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onBatchChange: (value: string) => void;
    onEnrolledChange: (value: string) => void;
}

const UsersFilters = ({
    batches,
    search,
    roleFilter,
    statusFilter,
    batchFilter,
    enrolledFilter,
    onSearchChange,
    onRoleChange,
    onStatusChange,
    onBatchChange,
    onEnrolledChange,
}: UsersFiltersProps) => {
    const getBatchCourseTitle = (batch: BatchResponse) => {
        if (typeof batch.courseId === "string") return undefined;
        return batch.courseId.title;
    };

    return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            aria-label="Search users"
                        />
                    </div>
<div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">

                    <Select value={roleFilter} onValueChange={onRoleChange}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="superadmin">Super Admin</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="instructor">Instructor</SelectItem>
                            <SelectItem value="learner">Learner</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={batchFilter} onValueChange={onBatchChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Batch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {batches.map((batch) => (
                                <SelectItem key={batch._id} value={batch.title}>
                                    {getBatchCourseTitle(batch) || "Unknown Course"} - <strong>{batch.title}</strong> - {batch.status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={enrolledFilter} onValueChange={onEnrolledChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Enrollment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="enrolled">Enrolled</SelectItem>
                            <SelectItem value="not-enrolled">Not Enrolled</SelectItem>
                        </SelectContent>
                    </Select>
</div>
                </CardContent>
            </Card>
    );
};

export default UsersFilters;
