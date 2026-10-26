'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FlexCarouselItem } from '@/components/shared/FlexCarousel';
import { FadeIn } from '../../ui/FadeIn';
import type { SuccessStory } from './feedbackData';
import './SuccessStoriesCarousel.css';

// WebGL is only available in the browser, so the stage is loaded after hydration.
const FlexCarousel = dynamic(() => import('@/components/shared/FlexCarousel'), {
  ssr: false,
});

const CAROUSEL_LABEL = 'শিক্ষার্থীদের সফলতার গল্প';
const VIDEO_SUBTITLE = 'ভিডিও টেস্টিমোনিয়াল';

const toBanglaNumber = (value: number) =>
  value.toLocaleString('bn-BD', { useGrouping: false });

const thumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

let webgl2Support: boolean | null = null;

/** Probes WebGL2 once, then reuses the answer for the lifetime of the page. */
const supportsWebgl2 = () => {
  if (webgl2Support !== null) return webgl2Support;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    webgl2Support = Boolean(context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl2Support = false;
  }
  return webgl2Support;
};

interface SuccessStoriesCarouselProps {
  successStories: SuccessStory[];
}

export const SuccessStoriesCarousel = memo(function SuccessStoriesCarousel({
  successStories,
}: SuccessStoriesCarouselProps) {
  const [playing, setPlaying] = useState<{ videoId: string; index: number } | null>(null);
  const [canUseStage, setCanUseStage] = useState(false);
  // Narrow screens need shorter cards so the active one still fits in view.
  const [cardHeight, setCardHeight] = useState(0.6);

  useEffect(() => {
    if (!supportsWebgl2()) return undefined;
    const frame = requestAnimationFrame(() => setCanUseStage(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const update = () => setCardHeight(query.matches ? 0.44 : 0.6);
    const frame = requestAnimationFrame(update);
    query.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(frame);
      query.removeEventListener('change', update);
    };
  }, []);

  const items = useMemo<FlexCarouselItem[]>(
    () =>
      successStories.map((story, index) => ({
        src: thumbnailUrl(story.videoId),
        alt: `সফলতার গল্প ${toBanglaNumber(index + 1)} ভিডিওর থাম্বনেইল`,
        title: `সফলতার গল্প ${toBanglaNumber(index + 1)}`,
        subtitle: VIDEO_SUBTITLE,
      })),
    [successStories]
  );

  const openVideo = useCallback(
    (index: number) => {
      const story = successStories[index];
      if (story) setPlaying({ videoId: story.videoId, index });
    },
    [successStories]
  );

  return (
    <>
      <div className="relative flex min-h-[100svh] w-full flex-col justify-center py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[78%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_68%)]"
        />

        <div className="relative">
          <FadeIn>
            <div className="text-center mb-8 scroll-mt-36 sm:mb-10">
              <div className="flex justify-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-primary/10 border border-primary/25 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary-glow">
                    শিক্ষার্থীদের অর্জন
                  </span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold font-bangla text-white">
                সফলতার{' '}
                <span className="text-primary-glow relative inline-block">
                  গল্প
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                </span>{' '}
                শোনো
              </h2>
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
                <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/60" />
                <div className="h-px w-32 bg-gradient-to-r from-primary/60 to-primary/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                <div className="h-px w-16 bg-gradient-to-r from-primary/20 to-transparent" />
              </div>
            </div>
          </FadeIn>

          <div className="success-stories__stage relative h-[min(62svh,580px)] min-h-[300px] w-full text-white">
            {canUseStage ? (
              <>
                <FlexCarousel
                  items={items}
                  preset="liquid"
                  intro="rise"
                  fit="natural"
                  cardHeight={cardHeight}
                  gap={16}
                  radius={14}
                  squeeze={0.18}
                  autoplay={false}
                  captureWheel={false}
                  focusOnClick={false}
                  label={CAROUSEL_LABEL}
                  onSelect={openVideo}
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <span className="success-stories__play flex h-14 w-20 items-center justify-center rounded-2xl bg-red-600 shadow-2xl shadow-red-950/60 ring-1 ring-white/25 sm:h-[4.5rem] sm:w-[6.5rem]">
                    <Play className="h-6 w-6 fill-white text-white sm:h-8 sm:w-8" />
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-surface via-surface/50 to-transparent sm:w-20"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface via-surface/50 to-transparent sm:w-20"
                />

                <p className="sr-only">
                  বাম ও ডান তীর চিহ্ন দিয়ে ভিডিও বদলান, এন্টার চাপলে ভিডিও চলবে।
                </p>
              </>
            ) : (
              <div
                role="region"
                aria-label={CAROUSEL_LABEL}
                tabIndex={0}
                className="flex h-full snap-x snap-mandatory overflow-x-auto px-4 py-2
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <ul className="m-auto flex w-max items-center gap-4">
                  {successStories.map((story, index) => (
                    <li key={story.id} className="shrink-0 snap-center">
                      <button
                        type="button"
                        onClick={() => openVideo(index)}
                        aria-label={`সফলতার গল্প ${toBanglaNumber(index + 1)} ভিডিও চালান`}
                        className="group block w-[240px] text-left
                          focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary
                          sm:w-[320px]"
                      >
                        <span className="relative block aspect-video w-full overflow-hidden rounded-xl border border-primary/15 bg-black/50">
                          <Image
                            src={thumbnailUrl(story.videoId)}
                            alt={`সফলতার গল্প ${toBanglaNumber(index + 1)} ভিডিওর থাম্বনেইল`}
                            fill
                            sizes="(max-width: 640px) 240px, 320px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-12 w-16 items-center justify-center rounded-xl bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                              <Play aria-hidden="true" className="h-5 w-5 fill-white text-white" />
                            </span>
                          </span>
                        </span>
                        <span className="mt-3 block text-sm font-semibold text-white">
                          সফলতার গল্প {toBanglaNumber(index + 1)}
                        </span>
                        <span className="block text-xs text-white/55">{VIDEO_SUBTITLE}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-white/40">
            সোয়াইপ, ড্র্যাগ বা তীর চিহ্ন দিয়ে ভিডিওগুলো দেখুন
          </p>
        </div>
      </div>

      <Dialog
        open={playing !== null}
        onOpenChange={(open) => {
          if (!open) setPlaying(null);
        }}
      >
        <DialogContent className="w-full max-w-3xl aspect-video p-0 rounded-none border-0 [&>button]:!rounded-full [&>button]:!bg-black/60 [&>button]:!p-2 [&>button]:!text-white/80 [&>button]:hover:!bg-black/80 [&>button]:hover:!text-white [&>button]:!backdrop-blur-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {playing
                ? `সফলতার গল্প ${toBanglaNumber(playing.index + 1)}`
                : CAROUSEL_LABEL}
            </DialogTitle>
            <DialogDescription>{VIDEO_SUBTITLE}</DialogDescription>
          </DialogHeader>
          {playing && (
            <iframe
              key={playing.videoId}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${playing.videoId}?rel=0&autoplay=1`}
              title={`সফলতার গল্প ${toBanglaNumber(playing.index + 1)}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
