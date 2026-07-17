"use client"

import { type ChangeEvent } from "react"
import { Controller, useFormContext } from "react-hook-form"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { InputField } from "@/components/forms/input-field"
import { SubmitButton } from "@/components/forms/submit-button"

interface PopupBannerTabProps {
  uploadLoading: boolean
  onPopupEnabledChange: (value: boolean) => Promise<void>
  onBannerFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
  onSave: () => void
}

export function PopupBannerTab({
  uploadLoading,
  onPopupEnabledChange,
  onBannerFileChange,
  onSave,
}: PopupBannerTabProps) {
  const { control, watch } = useFormContext()
  const popupImageUrl = watch("popupImageUrl")

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave() }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Popup Banner</CardTitle>
          <CardDescription>Show a popup banner to website visitors if enabled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="popupEnabled"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="popup-enabled">Popup enabled</Label>
                  <p className="text-sm text-muted-foreground">Show banner on initial visit for visitors</p>
                </div>
                <Switch
                  id="popup-enabled"
                  checked={!!field.value}
                  onCheckedChange={onPopupEnabledChange}
                />
              </div>
            )}
          />

          <Separator />

          <InputField name="popupLink" label="Popup target URL (optional)" placeholder="https://example.com" />

          <div className="space-y-2">
            <Label htmlFor="popup-image">Banner image file</Label>
            <input
              id="popup-image"
              type="file"
              accept="image/*"
              className="block w-full rounded-md border border-slate-300 p-2"
              onChange={onBannerFileChange}
            />
            {uploadLoading && <p className="text-sm text-muted-foreground">Uploading image...</p>}
          </div>

          {popupImageUrl ? (
            <div className="rounded border p-2">
              <p className="text-sm text-muted-foreground">Preview</p>
              <div className="relative h-44 w-full">
                <Image src={popupImageUrl} alt="Popup preview" fill sizes="(max-width: 768px) 100vw, 400px" className="object-contain" unoptimized />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>Save Settings</SubmitButton>
      </div>
    </form>
  )
}
