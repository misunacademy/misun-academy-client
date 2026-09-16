"use client"

import { useCallback, useEffect, useMemo, useRef, type ChangeEvent } from "react"
import { useForm, FormProvider, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api/settingsApi"
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi"
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi"
import DashboardPageTabs from "@/components/layout/DashboardPageTabs"
import { ProfileSettingsTab } from "./ProfileSettingsTab"
import { MaintenanceSettingsTab } from "./MaintenanceSettingsTab"
import { CommunityLinksTab } from "./CommunityLinksTab"
import { PopupBannerTab } from "./PopupBannerTab"
import { HomeVideoTab } from "./HomeVideoTab"

const settingsSchema = z.object({
  popupEnabled: z.boolean(),
  popupImageUrl: z.string().optional(),
  popupLink: z.string().optional(),
  maintenanceEnabled: z.boolean(),
  maintenanceTitle: z.string().optional(),
  maintenanceMessage: z.string().optional(),
  maFacebookGroupLink: z.string().optional(),
  maWhatsappGroupLink: z.string().optional(),
  epFacebookGroupLink: z.string().optional(),
  epWhatsappGroupLink: z.string().optional(),
  homeWhyVideoUrl: z.string().optional(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function AdminSettingsContent() {
  const { data: settingsData, isSuccess: hasSettings } = useGetSettingsQuery()
  const [updateSettings] = useUpdateSettingsMutation()
  const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation()
  const profileFileInputRef = useRef<HTMLInputElement>(null)
  const { user, updateUserProfile } = useAuth()
  const [updateProfile, { isLoading: profileUpdateLoading }] = useUpdateUserProfileMutation()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema) as Resolver<SettingsFormValues>,
    defaultValues: {
      popupEnabled: false,
      popupImageUrl: "",
      popupLink: "",
      maintenanceEnabled: false,
      maintenanceTitle: "",
      maintenanceMessage: "",
      maFacebookGroupLink: "",
      maWhatsappGroupLink: "",
      epFacebookGroupLink: "",
      epWhatsappGroupLink: "",
      homeWhyVideoUrl: "",
    },
  })

  useEffect(() => {
    if (!hasSettings) return

    if (!settingsData?.data) {
      updateSettings(form.getValues()).unwrap().catch(() => {})
      return
    }

    const s = settingsData.data
    form.reset({
      popupEnabled: s.popupEnabled ?? false,
      popupImageUrl: s.popupImageUrl ?? "",
      popupLink: s.popupLink ?? "",
      maintenanceEnabled: s.maintenanceEnabled ?? false,
      maintenanceTitle: s.maintenanceTitle ?? "",
      maintenanceMessage: s.maintenanceMessage ?? "",
      maFacebookGroupLink: s.maFacebookGroupLink ?? "",
      maWhatsappGroupLink: s.maWhatsappGroupLink ?? "",
      epFacebookGroupLink: s.epFacebookGroupLink ?? "",
      epWhatsappGroupLink: s.epWhatsappGroupLink ?? "",
      homeWhyVideoUrl: s.homeWhyVideoUrl ?? "",
    })
  }, [settingsData, hasSettings, form, updateSettings])

  const onSubmit = useCallback(async (values: SettingsFormValues) => {
    try {
      await updateSettings(values).unwrap()
      toast.success("Settings saved successfully")
    } catch {
      toast.error("Failed to save settings")
    }
  }, [updateSettings])

  const handleSave = useMemo(() => form.handleSubmit(onSubmit), [form, onSubmit])

  const handlePopupEnabledChange = useCallback(async (value: boolean) => {
    form.setValue("popupEnabled", value)
    try {
      const current = form.getValues()
      await updateSettings({ ...current, popupEnabled: value }).unwrap()
      toast.success(`Popup ${value ? "enabled" : "disabled"}`)
    } catch {
      toast.error("Unable to update popup status")
    }
  }, [form, updateSettings])

  const handleMaintenanceEnabledChange = useCallback(async (value: boolean) => {
    form.setValue("maintenanceEnabled", value)
    try {
      const current = form.getValues()
      await updateSettings({ ...current, maintenanceEnabled: value }).unwrap()
      toast.success(`Maintenance mode ${value ? "enabled" : "disabled"}`)
    } catch {
      toast.error("Unable to update maintenance mode")
    }
  }, [form, updateSettings])

  const onBannerFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return }
    const formData = new FormData()
    formData.append("image", file)
    try {
      const result = await uploadImage(formData).unwrap()
      form.setValue("popupImageUrl", result.data.url)
      toast.success("Popup image uploaded")
    } catch {
      toast.error("Image upload failed")
    }
  }, [uploadImage, form])

  const handleProfilePhotoClick = useCallback(() => {
    profileFileInputRef.current?.click()
  }, [])

  const handleProfilePhotoChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("Please select an image smaller than 5MB."); return }
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
  }, [uploadImage, updateProfile, updateUserProfile])

  const tabTriggers = useMemo(() => [
    { value: "profile", label: "Profile" },
    { value: "maintenance", label: "Maintenance" },
    { value: "community", label: "Community Links" },
    { value: "popup", label: "Popup Banner" },
    { value: "home-video", label: "Home Video" },
  ], [])

  const tabContents = useMemo(() => [
    {
      value: "profile",
      content: (
        <ProfileSettingsTab
          user={user ?? null}
          uploadLoading={uploadLoading}
          profileUpdateLoading={profileUpdateLoading}
          handleProfilePhotoClick={handleProfilePhotoClick}
          handleProfilePhotoChange={handleProfilePhotoChange}
          profileFileInputRef={profileFileInputRef}
        />
      ),
    },
    {
      value: "maintenance",
      content: (
        <MaintenanceSettingsTab
          onMaintenanceEnabledChange={handleMaintenanceEnabledChange}
          onSave={handleSave}
        />
      ),
    },
    {
      value: "community",
      content: <CommunityLinksTab onSave={handleSave} />,
    },
    {
      value: "popup",
      content: (
        <PopupBannerTab
          uploadLoading={uploadLoading}
          onPopupEnabledChange={handlePopupEnabledChange}
          onBannerFileChange={onBannerFileChange}
          onSave={handleSave}
        />
      ),
    },
    {
      value: "home-video",
      content: <HomeVideoTab onSave={handleSave} />,
    },
  ], [user, uploadLoading, profileUpdateLoading, handleProfilePhotoClick, handleProfilePhotoChange, handleMaintenanceEnabledChange, handleSave, handlePopupEnabledChange, onBannerFileChange])

  return (
    <FormProvider {...form}>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">Update only the essentials for now</p>
        </div>
        <DashboardPageTabs defaultValue="profile" triggers={tabTriggers} contents={tabContents} />
      </div>
    </FormProvider>
  )
}
