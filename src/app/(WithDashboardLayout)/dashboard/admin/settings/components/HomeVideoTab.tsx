"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { InputField } from "@/components/forms/input-field"
import { SubmitButton } from "@/components/forms/submit-button"

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
    // Not a valid absolute URL — fall through and use as-is.
  }

  return value
}

interface HomeVideoTabProps {
  onSave: () => void
}

export function HomeVideoTab({ onSave }: HomeVideoTabProps) {
  const { watch } = useFormContext()
  const rawUrl = watch("homeWhyVideoUrl")
  const previewUrl = toYouTubeEmbedUrl(rawUrl)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave() }}>
      <Card>
        <CardHeader>
          <CardTitle>Home Video — কোর্স সম্পর্কে</CardTitle>
          <CardDescription>
            Set the video played from the &quot;এই কোর্সটি কেন করবেন?&quot; section on the home page. Paste a YouTube watch, share (youtu.be), Shorts, or embed URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            name="homeWhyVideoUrl"
            label="Video URL"
            placeholder="https://www.youtube.com/watch?v=JDYJwp8nbew"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to fall back to the default course video.
          </p>

          <div className="space-y-2">
            <Label>Live preview</Label>
            {previewUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <iframe
                  className="h-full w-full"
                  src={previewUrl}
                  title="Home video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                No video URL set — the default course video will be shown.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <SubmitButton>Save Settings</SubmitButton>
      </div>
    </form>
  )
}
