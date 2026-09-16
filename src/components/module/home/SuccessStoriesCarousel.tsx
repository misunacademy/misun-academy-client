'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import { useState, memo } from 'react';
import Image from 'next/image';
import { FadeIn } from '../../ui/FadeIn';
import { Play } from 'lucide-react';
import type { SuccessStory } from './feedbackData';
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

interface SuccessStoriesCarouselProps {
  successStories: SuccessStory[];
}

export const SuccessStoriesCarousel = memo(function SuccessStoriesCarousel({
  successStories,
}: SuccessStoriesCarouselProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  return (
    <>
      <FadeIn>
        <div className="text-center mb-10 scroll-mt-36">
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-primary/10 border border-primary/25 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase text-primary/90">
                শিক্ষার্থীদের অর্জন
              </span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold font-bangla uppercase
            bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
            সফলতার{' '}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent relative inline-block">
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

      <div className="w-full  mx-auto  mb-24">
        <Carousel
          opts={{
            loop: true,
            align: 'start',
          }}
          plugins={[
            Autoplay({
              delay: 3500,
            }),
          ]}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-2 md:-ml-4 py-4">
            {successStories.map((story, index) => (
              <CarouselItem key={story.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <FadeIn delay={index * 0.1} direction="up" className="h-full">
                  <div className="relative p-[2px] rounded-xl overflow-hidden group transition-all duration-500 hover:-translate-y-1">
                    <AnimatedBorder variant="success-story" speed="5s" />
                    <div className="relative rounded-xl border border-primary/10 bg-surface p-4 transition-all duration-300
                      group-hover:border-primary/25 group-hover:shadow-xl group-hover:shadow-primary/15 overflow-hidden">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/30 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30 rounded-tr-xl" />
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/50">
                      {playingVideoId === story.videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${story.videoId}?autoplay=1&rel=0`}
                          title="Student success story video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      ) : (
                        <div
                          onClick={() => setPlayingVideoId(story.videoId)}
                          className="relative w-full h-full cursor-pointer group"
                        >
                          <Image
                            src={`https://i.ytimg.com/vi/${story.videoId}/mqdefault.jpg`}
                            alt="Success story video thumbnail"
                            fill
                            sizes="(max-width: 768px) 100vw, 640px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="flex h-10 w-14 md:h-12 md:w-16 items-center justify-center rounded-xl bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                              <Play className="h-5 w-5 md:h-6 md:w-6 fill-white text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-white/80 line-clamp-2 leading-snug truncate">
                      ভিডিও টেস্টিমোনিয়াল
                    </div>
                    </div>
                  </div>
                </FadeIn>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
});
