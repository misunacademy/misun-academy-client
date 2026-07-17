"use client"

import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/forms/input-field"
import { SelectField } from "@/components/forms/select-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { useUpdateUserMutation } from "@/redux/api/adminApi"
import { toast } from "sonner"

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

const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["learner", "employee", "instructor", "admin", "superadmin"]),
  status: z.enum(["active", "suspended", "deleted"]),
})

type EditUserFormValues = z.infer<typeof editUserSchema>

interface EditingDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const ROLE_OPTIONS = [
  { value: "learner", label: "Learner" },
  { value: "employee", label: "Employee" },
  { value: "instructor", label: "Instructor" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "deleted", label: "Deleted" },
]

const EditingDialog = ({ user, open, onOpenChange, onSuccess }: EditingDialogProps) => {
  const [updateUserMutation, { isLoading }] = useUpdateUserMutation()

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema) as Resolver<EditUserFormValues>,
    defaultValues: {
      name: "",
      email: "",
      role: "learner",
      status: "active",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role as EditUserFormValues["role"],
        status: user.status,
      })
    }
  }, [user, form])

  const handleSubmit = async (values: EditUserFormValues) => {
    if (!user) return
    try {
      await updateUserMutation({ id: user._id, data: values }).unwrap()
      toast.success("User updated successfully")
      onSuccess()
    } catch (error) {
      const err = error as { data?: { message?: string }; message?: string }
      toast.error(err?.data?.message || err?.message || "Failed to update user")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <InputField name="name" label="Name" required />
            <InputField name="email" label="Email" type="email" required />
            <SelectField name="role" label="Role" options={ROLE_OPTIONS} />
            <SelectField name="status" label="Status" options={STATUS_OPTIONS} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <SubmitButton disabled={isLoading}>Update User</SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditingDialog
