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
  );
};

export default Countdown;