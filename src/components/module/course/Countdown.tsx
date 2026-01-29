/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useGetCurrentEnrollmentBatchQuery } from "@/redux/api/batchApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
// import { useGetCourseByIdQuery } from "@/redux/features/course/courseApi";
import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { useGetCourseByIdQuery } from '@/redux/api/courseApi';
import { DiamondMinus } from 'lucide-react';
dayjs.extend(relativeTime);
dayjs.extend(duration);

const formatCountdown = (diffInMillis: number) => {
  const dur = dayjs.duration(diffInMillis);
  let countdownStr = "";
  if (dur.months()) countdownStr += `${dur.months()} মাস `;
  countdownStr += `${dur.days()} দিন ${dur.hours()} ঘণ্টা ${dur.minutes()} মিনিট ${dur.seconds()} সেকেন্ড`;
  return countdownStr;
};


const Countdown = () => {
  const [now, setNow] = useState(dayjs());
  const [countdown, setCountdown] = useState("");
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'ended'>('ended');

  const { data: settingsData, isLoading: settingsLoading } = useGetSettingsQuery();
  const featuredCourseId = (settingsData?.data?.featuredEnrollmentCourse as any)?._id;
  const featuredBatchId = (settingsData?.data?.featuredEnrollmentBatch as any)?._id;

  const { data: courseData, isLoading: courseLoading } = useGetCourseByIdQuery(featuredCourseId || "", {
    skip: !featuredCourseId,
  });

  const course = courseData;

  const { data: batchData, isLoading: batchLoading } = useGetCurrentEnrollmentBatchQuery(
    { courseId: featuredCourseId },
    { skip: !featuredCourseId || !!featuredBatchId }
  );

  const { data: featuredBatchData, isLoading: featuredBatchLoading } = useGetBatchByIdQuery(
    featuredBatchId || "",
    { skip: !featuredBatchId }
  );

  const batch = featuredBatchData?.data || batchData?.data;

  const start = batch ? dayjs(batch.enrollmentStartDate) : null;
  const end = batch ? dayjs(batch.enrollmentEndDate) : null;
  const classStart = batch ? dayjs(batch.startDate) : null;

  useEffect(() => {
    if (!batch || !start || !end) {
      return;
    }

    const interval = setInterval(() => {
      const current = dayjs();
      setNow(current);

      const isUpcomingNow = current.isBefore(start);
      const isOngoingNow = current.isAfter(start) && current.isBefore(end);

      if (isUpcomingNow) {
        setStatus('upcoming');
        setCountdown(formatCountdown(start.diff(current)));
      } else if (isOngoingNow) {
        setStatus('ongoing');
        setCountdown(formatCountdown(end.diff(current)));
      } else {
        setStatus('ended');
        setCountdown("");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [batch, start, end]);

  if (settingsLoading || courseLoading || batchLoading || featuredBatchLoading) {
    return (
      <section className="py-16 px-4 bg-primary/15 font-bangla">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <p>Loading enrollment information...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredCourseId || !batch) {
    return (
      <section className="py-16 px-4  font-bangla">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <p>Countdown data is not available.</p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center space-y-4 animate-fade-in mt-5">
        {/* Countdown Timer */}
        {status !== 'ended' && (
          <Card className="mx-auto max-w-2xl bg-gradient-to-tr from-primary to-primary/90 shadow-elegant border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-2">
                <p className="text-white/90 text-lg font-bangla">
                  {status === 'upcoming' ? "এনরোলমেন্ট শুরু হতে বাকি:" : "এনরোলমেন্ট শেষ হতে বাকি:"}
                </p>
                <div className="text-3xl md:text-4xl font-bold text-white font-bangla animate-countdown-pulse">
                  {countdown}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="my-8 border border-primary/20 rounded-lg px-6 py-4 bg-primary text-white font-bold font-bangla text-xl inline-flex mx-auto">
        কোর্স ফি: মাত্র ৪,০০০ টাকা
      </div>

      {/* Timeline Section */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-7 gap-y-8 lg:gap-y-0 mb-8 mt-6 lg:mt-4 lg:mx-24 rounded-[16px] py-12 lg:py-8 px-12 w-80 mx-auto md:w-[600px] lg:w-auto items-center justify-center border-2 border-primary/15 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex flex-col text-center lg:text-left">
          <span className="text-[16px] text-primary mb-1">এনরোলমেন্ট শুরু</span>
          <span className="text-[20px] font-bold">{start ? start.format('D MMMM, YYYY') : 'N/A'}</span>
        </div>
        <div className='flex items-center justify-center rotate-90 lg:rotate-0'>
          <DiamondMinus size={40} className='text-primary/70' />
        </div>
        <div className="flex flex-col text-center lg:text-left">
          <span className="text-[16px] text-primary mb-1">এনরোলমেন্ট শেষ</span>
          <span className="text-[20px] font-bold">{end ? end.format('D MMMM, YYYY') : 'N/A'}</span>
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
          <span className="text-[20px] font-bold">{classStart ? classStart.format('D MMMM, YYYY') : 'N/A'}</span>
        </div>
      </div>

    </div>
  );
};

export default Countdown;