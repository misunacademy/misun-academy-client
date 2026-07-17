"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface PopupBannerTabProps {
  popupEnabled: boolean;
  popupLink: string;
  popupImageUrl: string;
  uploadLoading: boolean;
  saving: boolean;
  onPopupEnabledChange: (value: boolean) => Promise<void>;
  onPopupLinkChange: (value: string) => void;
  onBannerFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSave: () => Promise<void>;
}

export function PopupBannerTab({
  popupEnabled,
  popupLink,
  popupImageUrl,
  uploadLoading,
  saving,
  onPopupEnabledChange,
  onPopupLinkChange,
  onBannerFileChange,
  onSave,
}: PopupBannerTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Popup Banner</CardTitle>
          <CardDescription>Show a popup banner to website visitors if enabled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Popup enabled</Label>
              <p className="text-sm text-muted-foreground">Show banner on initial visit for visitors</p>
            </div>
            <Switch checked={popupEnabled} onCheckedChange={onPopupEnabledChange} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="popup-link">Popup target URL (optional)</Label>
            <Input
              id="popup-link"
              value={popupLink}
              placeholder="https://example.com"
              onChange={(e) => onPopupLinkChange(e.target.value)}
            />
          </div>

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
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </>
  );
}
