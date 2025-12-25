'use client';

import Image from 'next/image';
import { HeroBanner } from '@/assets/images';
import { HeroBg } from '@/assets/svg';
import { Button } from '@/components/ui/button';
import { Briefcase, CalendarCheck, CalendarX, Home, PenTool } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { enrollmentPeriod } from '@/constants/enrollment';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <>
      <div className=''
        style={{
          backgroundImage: `url(${HeroBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          className='min-h-screen grid grid-cols-1 md:grid-cols-2 container mx-auto items-center px-4 max-w-7xl'
        >
          <div className='font-bangla space-y-4'>
            <h1 className='text-6xl font-bold text-primary'>গ্রাফিক্স ডিজাইন কোর্স</h1>
            <h2 className='text-3xl font-bold text-secondary'>আপনার ক্রিয়েটিভ ক্যারিয়ার শুরু করুন আজই!</h2>
            <p className='text-sm font-bangla'>ডিজিটাল এই যুগে সঠিক স্কিল শেখার মাধ্যমেই তৈরি হবে আপনার সফল ক্যারিয়ার । আর সেই পথটা সহজ করতে, শুরু থেকে শেষ পর্যন্ত আপনার পাশে থাকবে <strong className='text-primary'>MISUN Academy</strong>। শুধু শেখানো নয়, আমরা বিশ্বাস করি একজন শিক্ষার্থীর পরিপূর্ণ ক্যারিয়ার গঠনে গাইড করাটাই সবচেয়ে গুরুত্বপূর্ণ। তাই যদি আপনার স্বপ্ন থাকে ডিজাইন নিয়ে ভালো কিছু করার আর যদি আপনি বিশ্বাস করেন — <span className='italic'>আমি পারব</span> তাহলে <strong className='text-primary'>MISUN Academy</strong> সর্বদা প্রস্তুত আপনার এই যাত্রায় সঙ্গী হয়ে আপনাকে সফল করতে।</p>

            {/* Enrollment dates */}
            <div className="mt-6 space-y-2 text-gray-700 font-medium flex flex-col text-sm max-w-xs">
              <div className="flex items-center gap-2">
                <CalendarCheck size={20} className="text-green-600" />
                <p>এনরোলমেন্ট শুরু: <span className="text-primary font-semibold"><span className='font-bold'>{enrollmentPeriod.startDate}</span></span></p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarX size={20} className="text-red-600" />
                <p>এনরোলমেন্ট শেষ: <span className="text-primary font-bold">{enrollmentPeriod.endDate}</span></p>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 border-blue-200 animate-pulse">
                <Home size={16} /> ঘরে বসেই
              </Badge>
              <Badge variant="outline" className="text-sm gap-1 px-3 py-1.5 bg-green-100 text-green-800 border-green-200 animate-pulse">
                <PenTool size={16} /> ডিজাইন শেখা
              </Badge>
              <Badge variant="outline" className="text-sm gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">
                <Briefcase size={16} /> ক্যারিয়ার গড়া
              </Badge>
            </div>

            <div className='py-4 flex justify-center sm:justify-start'>
              <Link href={"/checkout"} className='animate-glow'>
                <Button className='cursor-pointer'>এখনই এনরোল করুন</Button>
              </Link>
            </div>
          </div>
          <div className=''>
            <Image
              src={HeroBanner}
              alt="Hero Banner"
            />
          </div>
        </div>
      </div>
    </>
  );
}
