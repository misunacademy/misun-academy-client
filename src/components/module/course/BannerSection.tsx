/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import { enrollmentPeriod } from '@/constants/enrollment';
import { DiamondMinus } from 'lucide-react';
import Countdown from './Countdown';
import { useGetSettingsQuery } from '@/redux/api/settingsApi';


export default function BannerSection() {
    const { data: settingsData, isLoading: settingsLoading } = useGetSettingsQuery();

    const batch =(settingsData?.data?.featuredEnrollmentBatch as any)?.batchNumber||0;
    const enrollmentPeriod = {
        startDate: (settingsData?.data?.featuredEnrollmentBatch as any)?.enrollmentStartDate
            ? new Date((settingsData?.data?.featuredEnrollmentBatch as any).enrollmentStartDate).toLocaleDateString('bn-BD', {
                day: 'numeric',   
                month: 'long',
                year: 'numeric',
            })
            : 'N/A',
        endDate: (settingsData?.data?.featuredEnrollmentBatch as any)?.enrollmentEndDate
            ? new Date((settingsData?.data?.featuredEnrollmentBatch as any).enrollmentEndDate).toLocaleDateString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : 'N/A',
        classStart: (settingsData?.data?.featuredEnrollmentBatch as any)?.startDate 
            ? new Date((settingsData?.data?.featuredEnrollmentBatch as any).startDate).toLocaleDateString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : 'N/A',
    };

if (settingsLoading) return null;


  return (
    <section className="relative bg-[#060f0a] overflow-hidden font-bangla">

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      {/* Bottom edge separator */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-center pt-24 md:pt-28 pb-24 px-4">

        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স</span>
        </div>
        <h1 className="font-bold font-bangla text-[28px] md:text-3xl lg:text-5xl text-center uppercase pt-2 bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent leading-snug">
          কমপ্লিট{' '}
          <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.4)]">গ্রাফিক্স ডিজাইন</span>
          {' '}উইথ ফ্রিল্যান্সিং
        </h1>
        <h2 className="text-primary/80 block text-[24px] md:text-2xl lg:text-3xl font-bold uppercase font-bangla mt-3 tracking-widest">
          (ব্যাচ-০{batch.toLocaleString('bn-BD')})
        </h2>

        <p className="w-auto sm:w-10/12 text-[15px] leading-[170%] text-center max-w-3xl mt-6 mx-5 font-bangla text-white/65">
          Complete Graphic Design With Freelancing (Batch-{batch}) – এই কোর্সটি আপনাকে বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত গ্রাফিক্স ডিজাইন শেখাবে বাস্তব প্রজেক্ট ও ক্লাইন্ট হান্টিং স্ট্র্যাটেজির মাধ্যমে। ২৪/৭ সাপোর্ট, <strong>১:১</strong> মেন্টরশিপ, লাইভ ক্লাস এবং AI ইনটিগ্রেটেড ডিজাইনের সাহায্যে আপনি নিজেকে গড়ে তুলতে পারবেন একজন দক্ষ ফ্রিল্যান্স ডিজাইনার হিসেবে।
        </p>
        <Countdown />
        {/* Decorative divider */}
        <div className="flex items-center gap-3 w-full max-w-xs mb-2 mt-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        <div className="relative my-6 p-[1.5px] rounded-xl overflow-hidden">
          <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
          <div className="relative bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] rounded-xl px-8 py-4 font-bold font-bangla text-xl text-white shadow-[0_0_24px_hsl(156_70%_42%/0.4)]">
          কোর্স ফি: মাত্র ৪,০০০ টাকা
          </div>
        </div>

        {/* Decorative divider 2 */}
        <div className="flex items-center gap-3 w-full max-w-xs mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        {/* Timeline card */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10 mb-8 py-8 px-10 w-80 mx-auto md:w-[600px] lg:w-auto items-center justify-center">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50 rounded-br-2xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-xs text-primary/80 mb-1 tracking-wider uppercase font-semibold">এনরোলমেন্ট শুরু</span>
            <span className="text-xl font-bold text-white">{enrollmentPeriod.startDate}</span>
          </div>
          <div className="flex items-center justify-center rotate-90 lg:rotate-0">
            <DiamondMinus size={28} className="text-primary/50" />
          </div>
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-xs text-primary/80 mb-1 tracking-wider uppercase font-semibold">এনরোলমেন্ট শেষ</span>
            <span className="text-xl font-bold text-white">{enrollmentPeriod.endDate}</span>
          </div>
          <div className="flex items-center justify-center rotate-90 lg:rotate-0">
            <DiamondMinus size={28} className="text-primary/50" />
          </div>
          {/* <div className="flex flex-col text-center lg:text-left">
            <span className="text-[16px] text-primary mb-1">ওরিয়েন্টেশন ক্লাস</span>
            <span className="text-[20px] font-bold">০১ অক্টোবর, ২০২৫</span>
          </div>

          <div className='flex items-center justify-center rotate-90 lg:rotate-0'>
            <DiamondMinus size={40} className='text-primary/70' />
          </div> */}

          <div className="flex flex-col text-center lg:text-left">
            <span className="text-xs text-primary/80 mb-1 tracking-wider uppercase font-semibold">ক্লাস শুরু</span>
            <span className="text-xl font-bold text-white">{enrollmentPeriod.classStart}</span>
          </div>
        </div>

        <p className="text-sm text-white/50 mb-4 text-center w-5/6 mx-auto md:w-full font-bangla leading-relaxed">
          কথা দিচ্ছি এত সাপোর্ট এবং পুরোপুরি লেগে থাকলে কোর্স শেষ হবার আগেই ক্লাইন্ট এর সাথে কাজ করার সুযোগ আর কোন কোর্সেই পাবেন না।
        </p>
      </div>

    </section>
  );
}
