"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { InputField } from "@/components/forms/input-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { Separator } from "@/components/ui/separator"

export function toYouTubeEmbedUrl(rawUrl: string | undefined | null): string {
  const value = rawUrl?.trim()
  if (!value) return ""

  try {
    const url = new URL(value)

    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0]
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return `https://www.youtube.com/embed/${url.pathname.split("/")[2]}`
      }
      if (url.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${url.pathname.split("/")[2]}`
      }
      const v = url.searchParams.get("v")
      if (v) return `https://www.youtube.com/embed/${v}`
    }
  } catch {
  }

  return value
}

interface HomeVideoTabProps {
  onSave: () => void
}

export function HomeVideoTab({ onSave }: HomeVideoTabProps) {
  const { watch } = useFormContext()
  const rawMaUrl = watch("homeWhyVideoUrl")
  const previewMaUrl = toYouTubeEmbedUrl(rawMaUrl)
  const rawEpUrl = watch("epHomeWhyVideoUrl")
  const previewEpUrl = toYouTubeEmbedUrl(rawEpUrl)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave() }}>
      <Card>
        <CardHeader>
          <CardTitle>Home Video — কোর্স সম্পর্কে</CardTitle>
          <CardDescription>
            Set the videos played from the &quot;এই কোর্সটি কেন করবেন?&quot; / &quot;Why Take This Course&quot; section on each homepage. Paste a YouTube watch, share (youtu.be), Shorts, or embed URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">MISUN Academy — Home Video</h3>
              <p className="text-xs text-muted-foreground">Shown on misun-academy.com in the &quot;এই কোর্সটি কেন করবেন?&quot; section.</p>
            </div>
            <InputField
              name="homeWhyVideoUrl"
              label="Video URL (MISUN Academy)"
              placeholder="https://www.youtube.com/watch?v=JDYJwp8nbew"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to fall back to the default MISUN course video.
            </p>
            <div className="space-y-2">
              <Label>Live preview — MISUN Academy</Label>
              {previewMaUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg border">
                  <iframe
                    className="h-full w-full"
                    src={previewMaUrl}
                    title="MISUN home video preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  No video URL set — the default MISUN course video will be shown.
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">ESUN POINT — Home Video</h3>
              <p className="text-xs text-muted-foreground">Shown on esun.misun-academy.com in the &quot;Why Take This Course&quot; section.</p>
            </div>
            <InputField
              name="epHomeWhyVideoUrl"
              label="Video URL (ESUN POINT)"
              placeholder="https://www.youtube.com/watch?v=LDz3OX_cK6I"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to fall back to the default ESUN POINT video.
            </p>
            <div className="space-y-2">
              <Label>Live preview — ESUN POINT</Label>
              {previewEpUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg border">
                  <iframe
                    className="h-full w-full"
                    src={previewEpUrl}
                    title="ESUN POINT home video preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  No video URL set — the default ESUN POINT video will be shown.
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
