"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Search, Download } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useGetAllUsersQuery, useCreateAdminMutation, useUpdateUserMutation, useUpdateUserStatusMutation, useDeleteUserMutation } from "@/redux/api/adminApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import type { BatchResponse } from "@/redux/api/batchApi";
import type { UsersListResponse, UpdateUserRequest } from "@/redux/api/adminApi";
import { toast } from 'sonner';
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import EditingDialog from "./components/EditingDialog";
import DashboardPageTableWithPagination from "@/components/layout/DashboardPageTableWithPagination";
import TableRows from "./components/TableRows";
import UsersStatsCards from "./components/UsersStatsCards";
import CreateUserDialog from "./components/CreateUserDialog";

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

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // Batch and enrolled filters
  const [batchFilter, setBatchFilter] = useState("all");
  const [enrolledFilter, setEnrolledFilter] = useState("all"); // all | enrolled | not-enrolled
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // RTK Query mutations
  const [createAdmin] = useCreateAdminMutation();
  const [updateUserMutation] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [updateUserStatusMutation] = useUpdateUserStatusMutation();

  // Debounce search input to avoid excessive requests
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset to first page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, statusFilter]);

  // Send role and status as lowercase strings to match server enum values
  const roleParam = roleFilter === 'all' ? undefined : (roleFilter.toLowerCase() as 'learner' | 'instructor' | 'admin' | 'superadmin');
  const statusParam = statusFilter === 'all' ? undefined : (statusFilter as 'active' | 'suspended' | 'deleted');

  const { data, isLoading, isFetching } = useGetAllUsersQuery(
    {
      page,
      limit,
      role: roleParam,
      status: statusParam,
      search: debouncedSearch || undefined,
      batch: batchFilter === 'all' ? undefined : batchFilter,
      enrolled: enrolledFilter === 'all' ? undefined : (enrolledFilter === 'enrolled' ? 'true' : 'false'),
    },
    { refetchOnMountOrArgChange: true }
  );

  const resp = data as UsersListResponse | undefined;

  // fetch batches for batch filter
  const { data: batchesData } = useGetAllBatchesQuery({});

  // Update total & totalPages when server response changes (support both `pagination` and legacy `meta` shapes)
  useEffect(() => {
    const legacyMeta = (data as unknown as { meta?: { total?: number; totalPages?: number } })?.meta;
    setTotal(resp?.pagination?.total ?? legacyMeta?.total ?? 0);
    setTotalPages(resp?.pagination?.totalPages ?? legacyMeta?.totalPages ?? 1);
  }, [resp, data]);

  // If current page becomes empty (e.g., after delete), go back one page
  useEffect(() => {
    const items = resp?.data?.length ?? 0;
    if (items === 0 && page > 1) {
      setPage((p) => Math.max(1, p - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resp]);


  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      role: fd.get('role') as string,
    };
    try {
      await createAdmin(payload).unwrap();
      toast.success('User created successfully');
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = fd.get('id') as string;
    const updateData: Partial<UpdateUserRequest> = {};
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const role = fd.get('role') as string;
    const status = fd.get('status') as string;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role.toLowerCase() as 'learner' | 'instructor' | 'admin' | 'superadmin';
    if (status) updateData.status = status as 'active' | 'suspended' | 'deleted';
    try {
      await updateUserMutation({ id, data: updateData }).unwrap();
      toast.success('User updated successfully');
      setEditDialogOpen(false);
      setEditUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserMutation(userToDelete).unwrap();
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const status = !currentStatus ? 'active' : 'suspended';
      await updateUserStatusMutation({ id, status }).unwrap();
      toast.success('User status updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // Typed server response and current page rows
  const filteredUsers: User[] = (resp?.data as User[] | undefined) || [];
  const batches = (batchesData?.data as BatchResponse[] | undefined) || [];

  const getBatchCourseTitle = (batch: BatchResponse) => {
    if (typeof batch.courseId === "string") return undefined;
    return batch.courseId.title;
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    const lr = role?.toLowerCase?.() ?? '';
    switch (lr) {
      case 'superadmin': return 'destructive';
      case 'admin': return 'default';
      case 'instructor': return 'secondary';
      case 'learner': return 'outline';
      default: return 'outline';
    }
  };

  const handleExportExcel = async () => {
    if (filteredUsers.length === 0) {
      toast.error('No user data available to export');
      return;
    }

    try {
      setIsExporting(true);

      const XLSX = await import('xlsx');
      const rows = filteredUsers.map((user, index) => ({
        'SL': index + 1,
        'Name': user.name,
        'Email': user.email,
        'Role': user.role,
        'Status': user.status,
        'Enrolled Courses/Batches': user.enrolledBatches?.join(' | ') || 'No',
        'Phone': user.phone || '',
        'Address': user.address || '',
        'Join Date': new Date(user.createdAt).toLocaleDateString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      XLSX.writeFile(workbook, `users-${timestamp}.xlsx`);

      toast.success('Excel sheet exported successfully');
    } catch (error) {
      console.error('Excel export failed:', error);
      toast.error('Failed to export Excel sheet');
    } finally {
      setIsExporting(false);
    }
  };

  const activeUsersCount = filteredUsers.filter((u) => u.status === "active").length;
  const instructorCount = filteredUsers.filter((u) => u.role?.toLowerCase() === "instructor").length;
  const adminCount = filteredUsers.filter((u) => {
    const r = u.role?.toLowerCase?.() ?? "";
    return r === "admin" || r === "superadmin";
  }).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardPageContainer
      heading="User Management"
      subheading="Manage all users, roles, and permissions"
      buttons={
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handleExportExcel}
          disabled={isExporting || isFetching || filteredUsers.length === 0}
          className="flex items-center gap-2"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export Excel
        </Button>

        {/* New user adding Dialog */}
        <CreateUserDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateUser}
        />
      </div>
      }
      content={
      <div>
        {/* Edit User Dialog */}
        <EditingDialog editUser={editUser} editDialogOpen={editDialogOpen} onOpenChange={setEditDialogOpen} handleUpdateUser={handleUpdateUser} />

        {/* Stats Cards */}
        <UsersStatsCards
          total={total}
          activeCount={activeUsersCount}
          instructorCount={instructorCount}
          adminCount={adminCount}
        />


        {/* User table */}
        <DashboardPageTableWithPagination
          heading="All Users"
          subheading="View and manage all users in the system"
          filters={
            <>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
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

              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((b) => (
                    <SelectItem key={b._id} value={b.title}>
                      {getBatchCourseTitle(b) || "Unknown Course"} - <strong>{b.title}</strong> - {b.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={enrolledFilter} onValueChange={setEnrolledFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Enrollment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                  <SelectItem value="not-enrolled">Not Enrolled</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          columns={["User", "Role", "Status", "Enrolled", "Join Date", "Actions"]}
          data={filteredUsers}
          renderRow={(user) => (
            <TableRows user={user} getRoleBadgeVariant={getRoleBadgeVariant} setEditUser={setEditUser} setEditDialogOpen={setEditDialogOpen} handleToggleStatus={handleToggleStatus} setUserToDelete={setUserToDelete} setDeleteDialogOpen={setDeleteDialogOpen} />
          )}
          getRowKey={(user) => user._id}
          isFetching={isFetching}
          emptyState="No users found."
          pagination={{
            page,
            totalPages,
            total,
            limit,
            onPageChange: setPage,
          }}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} handleDeleteUser={handleDeleteUser} setUserToDelete={setUserToDelete} />
      </div>} />

  );
}

