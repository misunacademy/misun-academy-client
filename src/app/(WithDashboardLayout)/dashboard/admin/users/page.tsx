"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetAllUsersQuery, useLazyGetAllUsersQuery, useUpdateUserStatusMutation, useDeleteUserMutation } from "@/redux/api/adminApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import type { BatchResponse } from "@/redux/api/batchApi";
import type { GetAllUsersParams, UsersListResponse } from "@/redux/api/adminApi";
import { toast } from 'sonner';
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { DataTable } from "@/components/ui/data-table";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import EditingDialog from "./components/EditingDialog";
import { useUserColumns } from "./components/userColumns";
import UsersStatsCards from "./components/UsersStatsCards";
import CreateUserDialog from "./components/CreateUserDialog";
import UsersFilters from "./components/UsersFilters";

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
  const [deleteUserMutation] = useDeleteUserMutation();
  const [updateUserStatusMutation] = useUpdateUserStatusMutation();
  const [triggerExportQuery] = useLazyGetAllUsersQuery();

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
  const roleParam: GetAllUsersParams['role'] = useMemo(() => roleFilter === 'all'
    ? undefined
    : (roleFilter.toLowerCase() as GetAllUsersParams['role']), [roleFilter]);
  const statusParam = useMemo(() => statusFilter === 'all' ? undefined : (statusFilter as 'active' | 'suspended' | 'deleted'), [statusFilter]);

  const { data, isLoading, isFetching, isError } = useGetAllUsersQuery(
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
    setTotal(resp?.meta?.total ?? legacyMeta?.total ?? 0);
    setTotalPages(resp?.meta?.totalPages ?? legacyMeta?.totalPages ?? 1);
  }, [resp, data]);

  // If current page becomes empty (e.g., after delete), go back one page
  useEffect(() => {
    const items = resp?.data?.length ?? 0;
    if (items === 0 && page > 1) {
      setPage((p) => Math.max(1, p - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resp]);


  const handleDeleteUser = useCallback(async () => {
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
  }, [userToDelete, deleteUserMutation]);

  const handleToggleStatus = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      const status = !currentStatus ? 'active' : 'suspended';
      await updateUserStatusMutation({ id, status }).unwrap();
      toast.success('User status updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  }, [updateUserStatusMutation]);

  // Typed server response and current page rows
  const filteredUsers: User[] = useMemo(() => (resp?.data as User[] | undefined) || [], [resp]);
  const batches: BatchResponse[] = useMemo(() => (batchesData?.data as BatchResponse[] | undefined) || [], [batchesData]);

  const getRoleBadgeVariant = useCallback((role: string): "default" | "secondary" | "destructive" | "outline" => {
    const lr = role?.toLowerCase?.() ?? '';
    switch (lr) {
      case 'superadmin': return 'destructive';
      case 'admin': return 'default';
      case 'instructor': return 'secondary';
      case 'employee': return 'outline';
      case 'learner': return 'outline';
      default: return 'outline';
    }
  }, []);

  const columns = useUserColumns(
    getRoleBadgeVariant,
    setEditUser,
    setEditDialogOpen,
    handleToggleStatus,
    setUserToDelete,
    setDeleteDialogOpen,
  );

  const handleExportExcel = useCallback(async () => {
    if (filteredUsers.length === 0) {
      toast.error('No user data available to export');
      return;
    }

    const toastId = toast.loading('Preparing to export users...');
    try {
      setIsExporting(true);

      let allUsers: User[] = [];
      const CHUNK_SIZE = 500;
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        toast.loading(`Fetching users page ${currentPage}...`, { id: toastId });
        const response = await triggerExportQuery({
          page: currentPage,
          limit: CHUNK_SIZE,
          role: roleParam,
          status: statusParam,
          search: debouncedSearch || undefined,
          batch: batchFilter === 'all' ? undefined : batchFilter,
          enrolled: enrolledFilter === 'all' ? undefined : (enrolledFilter === 'enrolled' ? 'true' : 'false'),
        }).unwrap();

        const fetched = (response?.data as User[]) || [];
        allUsers = allUsers.concat(fetched);

        const pagination = response?.meta;
        const totalPages = pagination?.totalPages || 1;

        if (fetched.length < CHUNK_SIZE || currentPage >= totalPages) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }

      if (allUsers.length === 0) {
        toast.error('No user data available to export', { id: toastId });
        return;
      }

      toast.loading(`Generating Excel spreadsheet for ${allUsers.length} users...`, { id: toastId });

      const XLSX = await import('xlsx');
      const rows = allUsers.map((user, index) => ({
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

      toast.success('Excel sheet exported successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Excel sheet', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  }, [filteredUsers, roleParam, statusParam, debouncedSearch, batchFilter, enrolledFilter, triggerExportQuery]);

  const activeUsersCount = useMemo(() => filteredUsers.filter((u) => u.status === "active").length, [filteredUsers]);
  const instructorCount = useMemo(() => filteredUsers.filter((u) => u.role?.toLowerCase() === "instructor").length, [filteredUsers]);
  const adminCount = useMemo(() => filteredUsers.filter((u) => {
    const r = u.role?.toLowerCase?.() ?? "";
    return r === "admin" || r === "superadmin";
  }).length, [filteredUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-destructive">Failed to load users</p>
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
            onSuccess={() => setCreateDialogOpen(false)}
          />
        </div>
      }
      content={
        <div>
          {/* Edit User Dialog */}
          <EditingDialog user={editUser} open={editDialogOpen} onOpenChange={setEditDialogOpen} onSuccess={() => { setEditDialogOpen(false); setEditUser(null); }} />

          {/* Stats Cards */}
          <UsersStatsCards
            total={total}
            activeCount={activeUsersCount}
            instructorCount={instructorCount}
            adminCount={adminCount}
          />


          {/* User table */}
          <DataTable
            heading="All Users"
            subheading="View and manage all users in the system"
            filters={
              <UsersFilters
                batches={batches}
                search={searchTerm}
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                batchFilter={batchFilter}
                enrolledFilter={enrolledFilter}
                onSearchChange={setSearchTerm}
                onRoleChange={setRoleFilter}
                onStatusChange={setStatusFilter}
                onBatchChange={setBatchFilter}
                onEnrolledChange={setEnrolledFilter}
              />
            }
            columns={columns}
            data={filteredUsers}
            getRowId={(user) => user._id}
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

