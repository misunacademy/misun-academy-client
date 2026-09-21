"use client"

import { useEffect, useMemo } from "react"
import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  type Announcement,
  useGetAnnouncementsQuery,
  useGetAnnouncementStatsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  usePublishAnnouncementMutation,
  useUnpublishAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "@/redux/api/announcementsApi"
import { toast } from "sonner"
import { Plus, Pencil, CheckCircle, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormItem, FormLabel, FormControl, FormField } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { InputField } from "@/components/forms/input-field"
import { SelectField } from "@/components/forms/select-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { Card, CardContent } from "@/components/ui/card"
import DashboardPageContainer from "@/components/layout/DashboardPageContainer"

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Max 200 characters"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "success", "warning", "critical"]).default("info"),
  audience: z.enum(["all", "learner", "instructor", "employee", "admin"]).default("all"),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  isDismissible: z.boolean().default(true),
  notifyByEmail: z.boolean().default(false),
})

type AnnouncementFormValues = z.infer<typeof announcementSchema>

const TYPE_OPTIONS = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
]

const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "learner", label: "Learners" },
  { value: "instructor", label: "Instructors" },
  { value: "employee", label: "Employees" },
  { value: "admin", label: "Admins Only" },
]

function AnnouncementTable({
  announcements,
  onEdit,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  announcements: Announcement[]
  onEdit: (a: Announcement) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  onDelete: (id: string) => void
}) {
  const columns = useMemo(() => [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }: { row: { original: Announcement } }) => (
        <span className="font-mono text-sm text-muted-foreground">{row.original._id.slice(-8)}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: { row: { original: Announcement } }) => (
        <span title={row.original.title} className="truncate max-w-xs block">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: { original: Announcement } }) => (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted/30 text-muted-foreground">
          {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: "audience",
      header: "Audience",
      cell: ({ row }: { row: { original: Announcement } }) => (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted/30 text-muted-foreground">
          {row.original.audience.charAt(0).toUpperCase() + row.original.audience.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Announcement } }) => (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted/30 text-muted-foreground">
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Announcement } }) => {
        const a = row.original
        return (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(a)}
              className="rounded-md bg-muted/50 p-1 hover:bg-muted/70"
              aria-label="Edit announcement"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => (a.status === "published" ? onUnpublish(a._id) : onPublish(a._id))}
              className="rounded-md bg-muted/50 p-1 hover:bg-muted/70"
              aria-label={a.status === "published" ? `Unpublish announcement ${a._id}` : `Publish announcement ${a._id}`}
              title={a.status === "published" ? "Unpublish" : "Publish"}
            >
              {a.status === "published" ? (
                <EyeOff className="h-3.5 w-3.5 text-amber-600" />
              ) : a.status === "unpublished" ? (
                <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Eye className="h-3.5 w-3.5 text-blue-600" />
              )}
            </button>
            <button
              onClick={() => onDelete(a._id)}
              className="rounded-md bg-muted/50 p-1 hover:bg-muted/70"
              aria-label="Delete announcement"
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </button>
          </div>
        )
      },
    },
    ], [onEdit, onPublish, onUnpublish, onDelete])

  return (
    <DataTable
      columns={columns}
      data={announcements}
      emptyState="No announcements found."
      getRowId={(row: Announcement) => row._id}
    />
  )
}

function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
  onSuccess,
  createTrigger,
  updateTrigger,
  isSaving,
  setIsSaving,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  announcement: Announcement | null
  onSuccess: () => void
  createTrigger: ReturnType<typeof useCreateAnnouncementMutation>[0]
  updateTrigger: ReturnType<typeof useUpdateAnnouncementMutation>[0]
  isSaving: boolean
  setIsSaving: (b: boolean) => void
}) {
  const isEditing = Boolean(announcement)

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema) as Resolver<AnnouncementFormValues>,
    defaultValues: {
      title: announcement?.title ?? "",
      message: announcement?.message ?? "",
      type: announcement?.type ?? "info",
      audience: announcement?.audience ?? "all",
      link: announcement?.link ?? "",
      isDismissible: announcement?.isDismissible ?? true,
      notifyByEmail: announcement?.notifyByEmail ?? false,
    },
  })

  useEffect(() => {
    if (announcement) {
      form.reset({
        title: announcement.title ?? "",
        message: announcement.message ?? "",
        type: announcement.type ?? "info",
        audience: announcement.audience ?? "all",
        link: announcement.link ?? "",
        isDismissible: announcement.isDismissible ?? true,
        notifyByEmail: announcement.notifyByEmail ?? false,
      })
    } else {
      form.reset({ title: "", message: "", type: "info", audience: "all", link: "", isDismissible: true, notifyByEmail: false })
    }
  }, [announcement, form])

  const handleSubmit = async (values: AnnouncementFormValues) => {
    setIsSaving(true)
    try {
      if (isEditing && announcement?._id) {
        await updateTrigger({ id: announcement._id, data: values }).unwrap()
        toast.success("Announcement updated successfully")
      } else {
        await createTrigger(values).unwrap()
        toast.success("Announcement created successfully")
      }
      form.reset()
      onSuccess()
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || "Failed to save announcement")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update announcement details" : "Create a new announcement to publish to users"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InputField name="title" label="Title" placeholder="Announcement title" required />
            <TextareaField
              name="message"
              label="Message"
              placeholder="Write your announcement message (HTML supported)"
              rows={6}
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField name="type" label="Type" options={TYPE_OPTIONS} />
              <SelectField name="audience" label="Target Audience" options={AUDIENCE_OPTIONS} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="isDismissible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Dismissible by users</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notifyByEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Also send by email on publish</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton className="w-full" disabled={isSaving} loadingText="Saving...">
              {isEditing ? "Update Announcement" : "Create Announcement"}
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminAnnouncementsPage() {
  const {
    data: announcementsData,
    isLoading: announcementsLoading,
    isError: announcementsError,
  } = useGetAnnouncementsQuery({})
  const announcements = announcementsData?.data || []

  const { data: statsData } = useGetAnnouncementStatsQuery()
  const stats = statsData?.data || {
    total: 0,
    draft: 0,
    published: 0,
    scheduled: 0,
    expired: 0,
    unpublished: 0,
    byAudience: {},
    byType: {},
  }

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [editingOpen, setEditingOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  // Pending destructive/visibility action confirmed via the dialog below —
  // replaces the native window.confirm().
  const [pendingAction, setPendingAction] = useState<
    | { kind: "delete"; id: string; title: string }
    | { kind: "unpublish"; id: string; title: string }
    | null
  >(null)
  const [confirming, setConfirming] = useState(false)

  const [createTrigger] = useCreateAnnouncementMutation()
  const [updateTrigger] = useUpdateAnnouncementMutation()
  const [publishTrigger] = usePublishAnnouncementMutation()
  const [unpublishTrigger] = useUnpublishAnnouncementMutation()
  const [deleteTrigger] = useDeleteAnnouncementMutation()

  const handleCreate = () => {
    setEditing(null)
    setCreateOpen(true)
  }

  const handleEdit = (a: Announcement) => {
    setEditing(a)
    setEditingOpen(true)
  }

  const handlePublish = async (id: string) => {
    try {
      await publishTrigger(id).unwrap()
      toast.success("Announcement published successfully")
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || "Failed to publish announcement")
    }
  }

  const handleDelete = (id: string) => {
    const target = announcements.find((a) => a._id === id)
    setPendingAction({ kind: "delete", id, title: target?.title ?? "" })
  }

  const handleUnpublish = (id: string) => {
    const target = announcements.find((a) => a._id === id)
    setPendingAction({ kind: "unpublish", id, title: target?.title ?? "" })
  }

  const handleConfirmAction = async () => {
    if (!pendingAction) return
    setConfirming(true)
    try {
      if (pendingAction.kind === "delete") {
        await deleteTrigger(pendingAction.id).unwrap()
        toast.success("Announcement deleted successfully")
      } else {
        await unpublishTrigger(pendingAction.id).unwrap()
        toast.success("Announcement unpublished successfully")
      }
      setPendingAction(null)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || `Failed to ${pendingAction.kind} announcement`)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <>
    <DashboardPageContainer
      heading="Announcements"
      subheading="Create and manage announcements for your users"
      buttons={
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">New Announcement</span>
        </button>
      }
      content={
        <div className="space-y-6">
          {stats.total > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-2xl font-semibold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-2xl font-semibold text-gray-600">{stats.draft}</div>
                <div className="text-xs text-muted-foreground">Draft</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-2xl font-semibold text-emerald-600">{stats.published}</div>
                <div className="text-xs text-muted-foreground">Published</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-2xl font-semibold text-orange-600">{stats.scheduled}</div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-2xl font-semibold text-red-600">{stats.expired}</div>
                <div className="text-xs text-muted-foreground">Expired</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-2xl font-semibold text-amber-600">{stats.unpublished ?? 0}</div>
                <div className="text-xs text-muted-foreground">Unpublished</div>
              </div>
            </div>
          )}
          <Card>
            <CardContent className="p-0">
              {announcementsLoading ? (
                <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading announcements...
                </div>
              ) : announcementsError ? (
                <p className="p-6 text-sm text-red-600">Failed to load announcements.</p>
              ) : (
                <div className="p-6">
                  <AnnouncementTable
                    announcements={announcements}
                    onEdit={handleEdit}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      }
    />
      <AnnouncementFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        announcement={null}
        onSuccess={() => setCreateOpen(false)}
        createTrigger={createTrigger}
        updateTrigger={updateTrigger}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
      />
      <AnnouncementFormDialog
        open={editingOpen}
        onOpenChange={setEditingOpen}
        announcement={editing}
        onSuccess={() => {
          setEditingOpen(false)
          setEditing(null)
        }}
        createTrigger={createTrigger}
        updateTrigger={updateTrigger}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
      />
      <AlertDialog open={pendingAction !== null} onOpenChange={(open) => { if (!open && !confirming) setPendingAction(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.kind === "delete" ? "Delete announcement?" : "Unpublish announcement?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.kind === "delete" ? (
                <>
                  This action cannot be undone. This will permanently delete
                  {pendingAction.title ? <> <span className="font-medium">“{pendingAction.title}”</span></> : " this announcement"}.
                </>
              ) : (
                <>
                  Users will immediately stop seeing
                  {pendingAction?.title ? <> <span className="font-medium">“{pendingAction?.title}”</span></> : " this announcement"}.
                  You can publish it again at any time.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirming}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); void handleConfirmAction() }}
              disabled={confirming}
              className={
                pendingAction?.kind === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {confirming ? "Working..." : pendingAction?.kind === "delete" ? "Delete" : "Unpublish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}