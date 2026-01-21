'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { studentFeedbacks } from '@/constants/studentFeedbacks';

export default function Feedback() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      if (!api) return;
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect(); // Initial selection

    return () => {
      if (!api) return;
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="overflow-hidden mt-36 ">
      <h1 className="text-[32px] md:text-4xl lg:text-6xl font-bold font-bangla text-center pt-4 mb-20 text-secondary uppercase">
        স্টুডেন্ট <span className="text-primary">ফিডব্যাক</span>
      </h1>

      {/* desktop view */}
      <div className="hidden lg:block">
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          setApi={setApi}
          className=" lg:-ml-[5vw]"
        >
          <CarouselContent className=" lg:-ml-[5vw] lg:-mr-[5vw] py-10">
            {studentFeedbacks.slice(-10).map((item, index) => (
              <CarouselItem
                key={index}
                className=" lg:pl-[5vw] basis-full lg:basis-1/3 "
              >
                <div
                  className={cn(
                    'transition-transform  duration-300 p-[1px] rounded-lg aspect-auto',
                    selectedIndex == index
                      ? 'scale-100 lg:scale-125 bg-gradient-to-tr from-primary to-transparent'
                      : 'scale-100 bg-primary/20'
                  )}
                >
                  <div
                    className={cn(
                      'transition-all duration-300 bg-white rounded-[7px] p-5 md:p-[2vw] text-center',
                      selectedIndex == index ? 'bg-gradient-to-tr from-primary to-transparent text-black' : 'bg-white'
                    )}
                  >
                    <div>
                      <h1 className="font-semibold text-xl">
                        {item.name}
                      </h1>
                      <p className='text-sm'>{item.studentId}({item.batch})</p>
                    </div>
                    <p className="mt-5 text-center lg:text-sm">
                      {item.testimonial.length > 500
                        ? item.testimonial.slice(0, 500) + '...'
                        : item.testimonial}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* mobile view */}
      <div className="lg:hidden">
        <div className='flex flex-col gap-5 mx-6'>
          {studentFeedbacks.slice(0, 3).map((item, index) => (
            <div key={index} className='w-full hover:transition-all duration-300 hover:bg-gradient-to-tr hover:from-primary hover:to-transparent rounded-2xl p-[1.5px]'>
              <div className='text-center border-[1.5px] border-[#E2E2E2] bg-[#F2F2F2] px-8 py-10 rounded-2xl hover:bg-primary/10'>
                <div>
                  <h1 className="font-semibold text-xl">
                    {item.name}
                  </h1>
                  <p className='text-sm'>{item.studentId}({item.batch})</p>
                </div>

                <p className="mt-5 text-center text-sm">
                  {item.testimonial}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center mt-4 mb-10">
        <Link href="/feedback" className='animate-glow'>
          <Button>
            আরও জানতে ক্লিক করুন
          </Button>
        </Link>
      </div>
    </div>
  );
}
