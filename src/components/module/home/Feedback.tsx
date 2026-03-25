'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { studentFeedbacks } from '@/constants/studentFeedbacks';
import { FadeIn } from '../../ui/FadeIn';
import { Play, Star, Quote, ArrowRight } from 'lucide-react';

// Only id and videoId are stored; titles will be fetched from YouTube.
interface SuccessStory {
  id: number;
  videoId: string;
}

const successStories: SuccessStory[] = [
  { id: 1, videoId: 'Fzzfh9XaR5Q' },
  { id: 2, videoId: 'iyXBFBJjncs' },
  { id: 3, videoId: 'jJUQReDEHj4' },
  { id: 4, videoId: 'zrRI3jKDvQ4' },
  { id: 5, videoId: 'vqJPCQXRsII' },
  { id: 6, videoId: '6UCT2ds4zik' },
  { id: 7, videoId: 'f07WmQif_RY' },
  { id: 8, videoId: 'QqUNIh-oUY0' },
  { id: 9, videoId: 'uVSclQO3CxY' },
  { id: 10, videoId: 'qnWcimvWEjY' },
];

export default function Feedback() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section
      data-dark-section
      className="relative bg-[#060f0a] overflow-hidden"
    >
      {/* ── Top edge separator ── */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* ── Dot-grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Ambient glows ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-[5%] w-[320px] h-[220px] bg-primary/7 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-[5%] w-[280px] h-[200px] bg-primary/6 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[240px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-20">

      {/* Success Stories Section */}
      <FadeIn>
        <div className="text-center mb-10 scroll-mt-36">
          {/* Premium badge */}
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
          setApi={setApi}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-2 md:-ml-4 py-4">
            {successStories.map((story, index) => (
              <CarouselItem key={story.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <FadeIn delay={index * 0.1} direction="up" className="h-full">
                  <div className="relative p-[2px] rounded-xl overflow-hidden group transition-all duration-500 hover:-translate-y-1">
                    {/* Spinning comet border */}
                    <span
                      className="absolute inset-[-100%] animate-[spin_5s_linear_infinite]"
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent 0%, transparent 30%, hsl(156 70% 42% / 0.5) 44%, hsl(156 80% 65%) 52%, hsl(156 70% 42% / 0.4) 60%, transparent 75%)',
                      }}
                    />
                    <div className="relative rounded-xl border border-primary/10 bg-[#060f0a] p-4 transition-all duration-300
                      group-hover:border-primary/25 group-hover:shadow-xl group-hover:shadow-primary/15 overflow-hidden">
                    {/* Corner accents */}
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
                          className="w-full h-full cursor-pointer group"
                        >
                          {/* YouTube Thumbnail */}
                          <img
                            src={`https://i.ytimg.com/vi/${story.videoId}/mqdefault.jpg`}
                            alt="Success story thumbnail"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                          {/* YouTube Play Icon */}
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="flex h-10 w-14 md:h-12 md:w-16 items-center justify-center rounded-xl bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                              <Play className="h-5 w-5 md:h-6 md:w-6 fill-white text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* video title caption */}
                    <div className="mt-2 text-sm text-white/80 line-clamp-2 leading-snug truncate">
                      ভিডিও টেস্টিমোনিয়াল
                    </div>
                    </div>{/* card body */}
                  </div>{/* border wrapper */}
                </FadeIn>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* ── Decorative divider ── */}
      <div className="mt-4 mb-16 flex items-center gap-4 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
        <div className="flex gap-1.5">
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <div className="w-1 h-1 rounded-full bg-primary/70" />
          <div className="w-1 h-1 rounded-full bg-primary/40" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
      </div>

      {/* Student Opinions Section */}
      <FadeIn delay={0.2}>
        <div className="text-center mb-10">
          {/* Premium badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-primary/10 border border-primary/25 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold  uppercase text-primary/90">
                রিয়েল রিভিউ
              </span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold font-bangla uppercase
            bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent pt-2">
        
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent relative inline-block py-2">
              স্টুডেন্টদের
              <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            </span>{' '}
            মতামত
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

      <div className="w-full mx-auto mb-16">
        <Carousel
          opts={{
            loop: true,
            align: 'start',
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          setApi={setApi}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-2 md:-ml-4 py-4">
            {studentFeedbacks.slice(0, 10).map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-[20%]"
              >
                <div
                  className={cn(
                    'relative h-full flex flex-col justify-between p-6 rounded-xl overflow-hidden',
                    'bg-[#060f0a] border border-primary/10 transition-all duration-300',
                    'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1',
                  )}
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-xl" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <Quote className="h-6 w-6 text-primary opacity-50 rotate-180" />
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-6 line-clamp-6 leading-relaxed">
                      {item.testimonial || ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38] flex items-center justify-center text-white font-bold overflow-hidden shadow-md shadow-primary/30">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs text-gray-400">{item.batch}</span>
                        {/* <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary uppercase font-medium">Batch {item.batch.replace('Batch ', '')}</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <FadeIn delay={0.4} direction="up" className="w-full flex justify-center mt-10">
        <Link href="/feedback">
          {/* Animated border wrapper */}
          <div className="relative p-[2px] rounded-xl overflow-hidden group">
            {/* Spinning conic border */}
            <span
              className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 90deg, transparent 20%, hsl(156 70% 42%) 45%, hsl(156 85% 70%) 55%, hsl(156 70% 42%) 70%, transparent 80%)',
              }}
            />
            <button
              className="relative z-10 px-10 py-3.5 rounded-[10px] text-sm md:text-base font-bold text-white
                bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                transition-all duration-300 tracking-wide
                shadow-lg shadow-primary/30 group-hover:shadow-primary/50 flex gap-2 items-center"
            >
              আরো মতামত দেখো
              <ArrowRight/>
            </button>
          </div>
        </Link>
      </FadeIn>
      </div>{/* end relative z-10 */}

      {/* ── Bottom edge separator ── */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
