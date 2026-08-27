"use client"

import { useRef, type ChangeEvent } from "react"
import { useForm, FormProvider, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Loader2, Camera, User } from "lucide-react"
import { toast } from "sonner"
import { authServerApi } from "@/lib/auth-server-api"
import { useAuth } from "@/hooks/useAuth"
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi"
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi"
import DashboardPageContainer from "@/components/layout/DashboardPageContainer"
import { PasswordField } from "@/components/forms/password-field"
import { SubmitButton } from "@/components/forms/submit-button"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function DashboardSettings() {
  const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation()
  const profileFileInputRef = useRef<HTMLInputElement>(null)
  const { user, updateUserProfile } = useAuth()
  const [updateProfile, { isLoading: profileUpdateLoading }] = useUpdateUserProfileMutation()

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema) as Resolver<PasswordFormValues>,
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const handleProfilePhotoClick = () => {
    profileFileInputRef.current?.click()
  }

  const handleProfilePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5MB.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("image", file)
      const result = await uploadImage(formData).unwrap()
      await updateProfile({ avatar: result.data.url }).unwrap()
      await updateUserProfile({ image: result.data.url })
      toast.success("Profile photo updated successfully.")
      if (profileFileInputRef.current) profileFileInputRef.current.value = ""
    } catch {
      toast.error("Failed to upload profile photo.")
    }
  }

  const handleChangePassword = async (values: PasswordFormValues) => {
    try {
      const result = await authServerApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: false,
      })

      if (result.error) {
        toast.error(result.error.message || "Failed to change password.")
        return
      }

      toast.success("Password changed successfully.")
      passwordForm.reset()
    } catch (error) {
      let errorMessage = "Failed to change password."
      if (error && typeof error === "object") {
        if ("data" in error) {
          const apiError = error as { data?: { message?: string } }
          errorMessage = apiError.data?.message || errorMessage
        } else if ("message" in error) {
          errorMessage = (error as { message: string }).message
        }
      }
      toast.error(errorMessage)
    }
  }

  return (
    <DashboardPageContainer
      heading="Settings"
      subheading="Manage your account settings"
      content={
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Photo
              </CardTitle>
              <CardDescription>Update your profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? undefined} />
                  <AvatarFallback>{user?.name?.split(" ")?.map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U"}</AvatarFallback>
                </Avatar>
                <div className="sm:flex justify-between items-center w-full ">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleProfilePhotoClick}
                    disabled={uploadLoading || profileUpdateLoading}
                  >
                    {uploadLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
                    ) : (
                      <><Camera className="mr-2 h-4 w-4" />Change Photo</>
                    )}
                  </Button>
                  <input
                    ref={profileFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password securely.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                  <PasswordField name="currentPassword" label="Current password" placeholder="Enter your current password" required />
                  <PasswordField name="newPassword" label="New password" placeholder="At least 6 characters" required />
                  <PasswordField name="confirmPassword" label="Confirm new password" placeholder="Repeat new password" required />
                  <SubmitButton>Change Password</SubmitButton>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}
