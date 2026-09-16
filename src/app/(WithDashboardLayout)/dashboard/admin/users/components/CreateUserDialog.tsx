"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/forms/input-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { useCreateAdminMutation } from "@/redux/api/adminApi"
import { toast } from "sonner"

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const CreateUserDialog = ({ open, onOpenChange, onSuccess }: CreateUserDialogProps) => {
  const [createAdmin, { isLoading }] = useCreateAdminMutation()

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema) as Resolver<CreateUserFormValues>,
    defaultValues: { name: "", email: "", password: "" },
  })

  const handleSubmit = async (values: CreateUserFormValues) => {
    try {
      await createAdmin(values).unwrap()
      toast.success("User created successfully")
      form.reset()
      onSuccess()
    } catch (error) {
      const err = error as { data?: { message?: string }; message?: string }
      toast.error(err?.data?.message || err?.message || "Failed to create user")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with appropriate role and permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <InputField name="name" label="Name" placeholder="Enter your name..." required />
            <InputField name="email" label="Email" type="email" placeholder="Enter your email..." required />
            <InputField name="password" label="Password" type="password" placeholder="*****" required />
            <p className="text-xs text-muted-foreground text-justify">
              <span className="text-red-500">Note:*</span>
              The new user will receive an email to verify their account. Please ensure the email address is correct. This user will set default role as &ldquo;learner&ldquo; and can be updated later as your desired.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <SubmitButton disabled={isLoading}>Create User</SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserDialog
