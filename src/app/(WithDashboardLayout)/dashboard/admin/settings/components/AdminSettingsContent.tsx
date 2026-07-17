"use client";

import { useCallback, useEffect, useMemo, useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { authServerApi } from "@/lib/auth-server-api";
import { useAuth } from "@/hooks/useAuth";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api/settingsApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import DashboardPageTabs from "@/components/layout/DashboardPageTabs";
import { ProfileSettingsTab } from "./ProfileSettingsTab";
import { MaintenanceSettingsTab } from "./MaintenanceSettingsTab";
import { CommunityLinksTab } from "./CommunityLinksTab";
import { PopupBannerTab } from "./PopupBannerTab";

export default function AdminSettingsContent() {
  const [saving, setSaving] = useState(false);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState("");
  const [popupLink, setPopupLink] = useState("");
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceTitle, setMaintenanceTitle] = useState("");
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [maFacebookGroupLink, setMaFacebookGroupLink] = useState("");
  const [maWhatsappGroupLink, setMaWhatsappGroupLink] = useState("");
  const [epFacebookGroupLink, setEpFacebookGroupLink] = useState("");
  const [epWhatsappGroupLink, setEpWhatsappGroupLink] = useState("");

  const { data: settingsData, isSuccess: hasSettings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const [uploadImage, { isLoading: uploadLoading }] = useUploadSingleImageMutation();
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUserProfile } = useAuth();
  const [updateProfile, { isLoading: profileUpdateLoading }] = useUpdateUserProfileMutation();

  const handlePopupEnabledChange = useCallback(async (value: boolean) => {
    setPopupEnabled(value);
    try {
      await updateSettings({
        popupEnabled: value,
        popupImageUrl,
        popupLink,
        maintenanceEnabled,
        maintenanceTitle,
        maintenanceMessage,
        maFacebookGroupLink,
        maWhatsappGroupLink,
        epFacebookGroupLink,
        epWhatsappGroupLink,
      }).unwrap();
      toast.success(`Popup ${value ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Unable to update popup status");
    }
  }, [popupImageUrl, popupLink, maintenanceEnabled, maintenanceTitle, maintenanceMessage, maFacebookGroupLink, maWhatsappGroupLink, epFacebookGroupLink, epWhatsappGroupLink, updateSettings]);

  const handleMaintenanceEnabledChange = useCallback(async (value: boolean) => {
    setMaintenanceEnabled(value);
    try {
      await updateSettings({
        popupEnabled,
        popupImageUrl,
        popupLink,
        maintenanceEnabled: value,
        maintenanceTitle,
        maintenanceMessage,
        maFacebookGroupLink,
        maWhatsappGroupLink,
        epFacebookGroupLink,
        epWhatsappGroupLink,
      }).unwrap();
      toast.success(`Maintenance mode ${value ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Unable to update maintenance mode");
    }
  }, [popupEnabled, popupImageUrl, popupLink, maintenanceTitle, maintenanceMessage, maFacebookGroupLink, maWhatsappGroupLink, epFacebookGroupLink, epWhatsappGroupLink, updateSettings]);

  useEffect(() => {
    if (!hasSettings) return;

    if (!settingsData?.data) {
      updateSettings({
        popupEnabled: false, popupImageUrl: "", popupLink: "",
        maintenanceEnabled: false, maintenanceTitle: "", maintenanceMessage: "",
        maFacebookGroupLink: "", maWhatsappGroupLink: "",
        epFacebookGroupLink: "", epWhatsappGroupLink: "",
      }).unwrap().catch(() => {});
      return;
    }

    const settings = settingsData.data;
    setPopupEnabled(settings.popupEnabled ?? false);
    setPopupImageUrl(settings.popupImageUrl ?? "");
    setPopupLink(settings.popupLink ?? "");
    setMaintenanceEnabled(settings.maintenanceEnabled ?? false);
    setMaintenanceTitle(settings.maintenanceTitle ?? "");
    setMaintenanceMessage(settings.maintenanceMessage ?? "");
    setMaFacebookGroupLink(settings.maFacebookGroupLink ?? "");
    setMaWhatsappGroupLink(settings.maWhatsappGroupLink ?? "");
    setEpFacebookGroupLink(settings.epFacebookGroupLink ?? "");
    setEpWhatsappGroupLink(settings.epWhatsappGroupLink ?? "");
  }, [settingsData, hasSettings, updateSettings]);

  const onBannerFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await uploadImage(formData).unwrap();
      setPopupImageUrl(result.data.url);
      toast.success("Popup image uploaded");
    } catch (error) {
      toast.error("Image upload failed");
    }
  }, [uploadImage]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateSettings({
        popupEnabled, popupImageUrl, popupLink,
        maintenanceEnabled, maintenanceTitle, maintenanceMessage,
        maFacebookGroupLink, maWhatsappGroupLink,
        epFacebookGroupLink, epWhatsappGroupLink,
      }).unwrap();
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, [popupEnabled, popupImageUrl, popupLink, maintenanceEnabled, maintenanceTitle, maintenanceMessage, maFacebookGroupLink, maWhatsappGroupLink, epFacebookGroupLink, epWhatsappGroupLink, updateSettings]);

  const handleProfilePhotoClick = useCallback(() => {
    profileFileInputRef.current?.click();
  }, []);

  const handleProfilePhotoChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Please select an image smaller than 5MB."); return; }
    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImage(formData).unwrap();
      await updateProfile({ avatar: result.data.url }).unwrap();
      await updateUserProfile({ image: result.data.url });
      toast.success("Profile photo updated successfully.");
      if (profileFileInputRef.current) profileFileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to upload profile photo.");
    }
  }, [uploadImage, updateProfile, updateUserProfile]);

  const tabTriggers = useMemo(() => [
    { value: "profile", label: "Profile" },
    { value: "maintenance", label: "Maintenance" },
    { value: "community", label: "Community Links" },
    { value: "popup", label: "Popup Banner" },
  ], []);

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
          maintenanceEnabled={maintenanceEnabled}
          maintenanceTitle={maintenanceTitle}
          maintenanceMessage={maintenanceMessage}
          saving={saving}
          onMaintenanceEnabledChange={handleMaintenanceEnabledChange}
          onMaintenanceTitleChange={setMaintenanceTitle}
          onMaintenanceMessageChange={setMaintenanceMessage}
          onSave={handleSave}
        />
      ),
    },
    {
      value: "community",
      content: (
        <CommunityLinksTab
          maFacebookGroupLink={maFacebookGroupLink}
          maWhatsappGroupLink={maWhatsappGroupLink}
          epFacebookGroupLink={epFacebookGroupLink}
          epWhatsappGroupLink={epWhatsappGroupLink}
          saving={saving}
          onMaFacebookGroupLinkChange={setMaFacebookGroupLink}
          onMaWhatsappGroupLinkChange={setMaWhatsappGroupLink}
          onEpFacebookGroupLinkChange={setEpFacebookGroupLink}
          onEpWhatsappGroupLinkChange={setEpWhatsappGroupLink}
          onSave={handleSave}
        />
      ),
    },
    {
      value: "popup",
      content: (
        <PopupBannerTab
          popupEnabled={popupEnabled}
          popupLink={popupLink}
          popupImageUrl={popupImageUrl}
          uploadLoading={uploadLoading}
          saving={saving}
          onPopupEnabledChange={handlePopupEnabledChange}
          onPopupLinkChange={setPopupLink}
          onBannerFileChange={onBannerFileChange}
          onSave={handleSave}
        />
      ),
    },
  ], [user, uploadLoading, profileUpdateLoading, handleProfilePhotoClick, handleProfilePhotoChange, maintenanceEnabled, handleMaintenanceEnabledChange, maintenanceTitle, maintenanceMessage, handleSave, saving, maFacebookGroupLink, maWhatsappGroupLink, epFacebookGroupLink, epWhatsappGroupLink, popupEnabled, handlePopupEnabledChange, popupLink, onBannerFileChange, popupImageUrl]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Update only the essentials for now</p>
      </div>
      <DashboardPageTabs defaultValue="profile" triggers={tabTriggers} contents={tabContents} />
    </div>
  );
}
