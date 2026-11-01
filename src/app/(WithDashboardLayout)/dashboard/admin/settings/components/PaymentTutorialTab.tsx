"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { InputField } from "@/components/forms/input-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { Separator } from "@/components/ui/separator"
import { toYouTubeEmbedUrl } from "./HomeVideoTab"

interface PaymentTutorialTabProps {
  onSave: () => void
}

export function PaymentTutorialTab({ onSave }: PaymentTutorialTabProps) {
  const { watch } = useFormContext()
  const rawMaUrl = watch("maPaymentTutorialVideoUrl")
  const previewMaUrl = toYouTubeEmbedUrl(rawMaUrl)
  const rawEpUrl = watch("epPaymentTutorialVideoUrl")
  const previewEpUrl = toYouTubeEmbedUrl(rawEpUrl)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave() }}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Tutorial Video</CardTitle>
          <CardDescription>
            Set the videos played in the &quot;Payment Tutorial Video&quot; section on each checkout page. Paste a YouTube watch, share (youtu.be), Shorts, or embed URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">MISUN Academy — Payment Tutorial</h3>
              <p className="text-xs text-muted-foreground">Shown on misun-academy.com in the checkout &quot;Payment Tutorial Video&quot; section.</p>
            </div>
            <InputField
              name="maPaymentTutorialVideoUrl"
              label="Video URL (MISUN Academy)"
              placeholder="https://www.youtube.com/watch?v=UC4LM-u9TqM"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to fall back to the default MISUN payment tutorial video.
            </p>
            <div className="space-y-2">
              <Label>Live preview — MISUN Academy</Label>
              {previewMaUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg border">
                  <iframe
                    className="h-full w-full"
                    src={previewMaUrl}
                    title="MISUN payment tutorial preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  No video URL set — the default MISUN payment tutorial video will be shown.
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">ESUN POINT — Payment Tutorial</h3>
              <p className="text-xs text-muted-foreground">Shown on esun.misun-academy.com in the checkout &quot;Payment Tutorial Video&quot; section.</p>
            </div>
            <InputField
              name="epPaymentTutorialVideoUrl"
              label="Video URL (ESUN POINT)"
              placeholder="https://www.youtube.com/watch?v=pCpgeeQsXPE"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to fall back to the default ESUN POINT payment tutorial video.
            </p>
            <div className="space-y-2">
              <Label>Live preview — ESUN POINT</Label>
              {previewEpUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg border">
                  <iframe
                    className="h-full w-full"
                    src={previewEpUrl}
                    title="ESUN POINT payment tutorial preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  No video URL set — the default ESUN POINT payment tutorial video will be shown.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <SubmitButton>Save Settings</SubmitButton>
      </div>
    </form>
  )
}
