'use client';

import { enrollmentPeriod } from '@/constants/enrollment';
import { DiamondMinus } from 'lucide-react';

export default function BannerSection() {
  return (
    <section className="grid place-items-center h-full relative overflow-hidden font-bangla">
      <div className="relative z-50 flex flex-col items-center justify-center mt-20 md:mt-24 mb-24">
        <h1 className="font-bold font-bangla text-[32px] md:text-3xl lg:text-5xl text-center uppercase">
          কমপ্লিট <span className='text-primary'>গ্রাফিক্স ডিজাইন</span> উইথ ফ্রিল্যান্সিং
        </h1>
        <h2 className="text-secondary block text-[32px] md:text-2xl lg:text-3xl font-bold uppercase font-bangla mt-2">
          (ব্যাচ-০৬)
        </h2>

        <p className="w-auto sm:w-10/12 text-[16px] leading-[150%] tracking-[0] text-center max-w-6xl mt-8 mx-5 font-bangla">
          Complete Graphics Design With Freelancing (Batch-06) – এই কোর্সটি আপনাকে বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত গ্রাফিক্স ডিজাইন শেখাবে বাস্তব প্রজেক্ট ও ক্লাইন্ট হান্টিং স্ট্র্যাটেজির মাধ্যমে। ২৪/৭ সাপোর্ট, <strong>১:১</strong> মেন্টরশিপ, লাইভ ক্লাস এবং AI ইনটিগ্রেটেড ডিজাইনের সাহায্যে আপনি নিজেকে গড়ে তুলতে পারবেন একজন দক্ষ ফ্রিল্যান্স ডিজাইনার হিসেবে।
        </p>

        <div className="my-8 border border-primary/20 rounded-lg px-6 py-4 bg-primary text-white font-bold font-bangla text-xl">
          কোর্স ফি: মাত্র ৪,০০০ টাকা
        </div>

        {/* Timeline Section */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-7 gap-y-8 lg:gap-y-0 mb-8 mt-6 lg:mt-4 lg:mx-24 rounded-[16px] py-12 lg:py-8 px-12 w-80 mx-auto md:w-[600px] lg:w-auto items-center justify-center border-2 border-primary/15 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-[16px] text-primary mb-1">এনরোলমেন্ট শুরু</span>
            <span className="text-[20px] font-bold">{enrollmentPeriod.startDate}</span>
          </div>
          <div className='flex items-center justify-center rotate-90 lg:rotate-0'>
            <DiamondMinus size={40} className='text-primary/70' />
          </div>
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-[16px] text-primary mb-1">এনরোলমেন্ট শেষ</span>
            <span className="text-[20px] font-bold">{enrollmentPeriod.endDate}</span>
          </div>
          <div className='flex items-center justify-center rotate-90 lg:rotate-0'>
            <DiamondMinus size={40} className='text-primary/70' />
          </div>
          {/* <div className="flex flex-col text-center lg:text-left">
            <span className="text-[16px] text-primary mb-1">ওরিয়েন্টেশন ক্লাস</span>
            <span className="text-[20px] font-bold">০১ অক্টোবর, ২০২৫</span>
          </div>

          <div className='flex items-center justify-center rotate-90 lg:rotate-0'>
            <DiamondMinus size={40} className='text-primary/70' />
          </div> */}

          <div className="flex flex-col text-center lg:text-left">
            <span className="text-[16px] text-primary mb-1">ক্লাস শুরু</span>
            <span className="text-[20px] font-bold">{enrollmentPeriod.classStart}</span>
          </div>
        </div>

        {/* Info Section */}
        <p className="text-md text-gray-600 mb-6 text-center w-5/6 mx-auto md:w-full font-bangla">
          কথা দিচ্ছি এত সাপোর্ট এবং পুরোপুরি লেগে থাকলে কোর্স শেষ হবার আগেই ক্লাইন্ট এর সাথে কাজ করার সুযোগ আর কোন কোর্সেই পাবেন না।
        </p>
      </div>

      <div className="absolute z-30 inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
    </section>
  );
}
