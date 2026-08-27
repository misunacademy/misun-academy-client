'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from '../../ui/FadeIn';
import { Star, Quote } from 'lucide-react';

interface StudentFeedback {
  name: string;
  batch: string;
  studentId: string;
  testimonial: string;
  post_link?: string;
}

interface StudentOpinionsCarouselProps {
  studentFeedbacks: StudentFeedback[];
}

export const StudentOpinionsCarousel = memo(function StudentOpinionsCarousel({
  studentFeedbacks,
}: StudentOpinionsCarouselProps) {
  return (
    <>
      <FadeIn delay={0.2}>
        <div className="text-center mb-10">
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
                    'bg-surface border border-primary/10 transition-all duration-300',
                    'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1',
                  )}
                >
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-xl" />
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
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-emerald-darker via-primary to-emerald-dark flex items-center justify-center text-white font-bold overflow-hidden shadow-md shadow-primary/30">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs text-gray-400">{item.batch}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
});
