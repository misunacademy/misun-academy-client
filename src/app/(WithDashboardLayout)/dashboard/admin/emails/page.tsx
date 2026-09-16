'use client';

import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import DashboardPageTabs from '@/components/layout/DashboardPageTabs';
import EnrollmentReminderCard from './_components/EnrollmentReminderCard';
import NewsUpdatesCard from './_components/NewsUpdatesCard';
import BatchProgressReminderCard from './_components/BatchProgressReminderCard';
import BatchIncompleteReminderCard from './_components/BatchIncompleteReminderCard';
import EmailDeliveryInfoCard from './_components/EmailDeliveryInfoCard';

export default function AdminEmailsPage() {
  const { data: coursesData } = useGetAllCoursesQuery({});
  const courses = coursesData?.data ?? [];

  return (
    <DashboardPageContainer
      heading='Email Management'
      subheading='Send bulk emails to users and students'
      content={
        <>
          <DashboardPageTabs
            defaultValue='enrollment-reminder'
            triggers={[
              { value: 'enrollment-reminder', label: 'Enrollment Reminders' },
              { value: 'news-updates', label: 'News & Updates' },
              { value: 'batch-progress', label: 'Batch Progress' },
              { value: 'batch-incomplete', label: 'Batch Completion' },
            ]}
            contents={[
              { value: 'enrollment-reminder', content: <EnrollmentReminderCard /> },
              { value: 'news-updates', content: <NewsUpdatesCard /> },
              { value: 'batch-progress', content: <BatchProgressReminderCard courses={courses} /> },
              { value: 'batch-incomplete', content: <BatchIncompleteReminderCard courses={courses} /> },
            ]}
          />
          <EmailDeliveryInfoCard />
        </>
      }
    />
  );
}
