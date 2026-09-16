'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useGetSettingsQuery } from '@/redux/api/settingsApi';

const DEFAULT_VIDEO_URL =
  'https://www.youtube.com/embed/JDYJwp8nbew?si=vEdGzIzqKMfBYo23&amp;start=1';

export function toYouTubeEmbedUrl(rawUrl: string | undefined | null): string {
  const value = rawUrl?.trim();
  if (!value) return '';

  try {
    const url = new URL(value);

    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    if (url.hostname.endsWith('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) {
        return `https://www.youtube.com/embed/${url.pathname.split('/')[2]}`;
      }
      if (url.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${url.pathname.split('/')[2]}`;
      }
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {
    // Not a valid absolute URL — fall through and use as-is.
  }

  return value;
}

export default function WhyThisCourseModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useGetSettingsQuery();
  const videoUrl =
    toYouTubeEmbedUrl(data?.data?.homeWhyVideoUrl) || DEFAULT_VIDEO_URL;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-5xl aspect-[15.15/9] p-0 rounded-none border-0 [&>button]:!rounded-full [&>button]:!bg-black/60 [&>button]:!p-2 [&>button]:!text-white/80 [&>button]:hover:!bg-black/80 [&>button]:hover:!text-white [&>button]:!backdrop-blur-sm">
        <DialogHeader className="sr-only">
          <DialogTitle>Misun Academy</DialogTitle>
          <DialogDescription>
            কোর্সটি কেন করবেন?
          </DialogDescription>
        </DialogHeader>
        <iframe
          className="w-full h-full"
          src={videoUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </DialogContent>
    </Dialog>
  );
}
