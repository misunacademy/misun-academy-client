'use client';

import { useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Mail, Send, Users, UserPlus, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  useSendBatchIncompleteReminderMutation,
  useSendBatchProgressReminderMutation,
  useSendEnrollmentReminderMutation,
  useSendNewsUpdateMutation,
} from '@/redux/api/adminApi';
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { useGetAllBatchesQuery } from '@/redux/api/batchApi';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import DashboardPageTabs from '@/components/layout/DashboardPageTabs';

export default function AdminEmailsPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [runningCourseId, setRunningCourseId] = useState('');
  const [runningBatchId, setRunningBatchId] = useState('');
  const [completedCourseId, setCompletedCourseId] = useState('');
  const [completedBatchId, setCompletedBatchId] = useState('');

  const [sendEnrollmentReminder, { isLoading: isSendingReminder }] = useSendEnrollmentReminderMutation();
  const [sendNewsUpdate, { isLoading: isSendingNews }] = useSendNewsUpdateMutation();
  const [sendBatchProgressReminder, { isLoading: isSendingBatchProgress }] = useSendBatchProgressReminderMutation();
  const [sendBatchIncompleteReminder, { isLoading: isSendingBatchIncomplete }] = useSendBatchIncompleteReminderMutation();

  const { data: coursesData } = useGetAllCoursesQuery({});
  const courses = coursesData?.data ?? [];

  const { data: runningBatchesData } = useGetAllBatchesQuery(
    runningCourseId ? { courseId: runningCourseId } : skipToken
  );
  const runningBatches = runningBatchesData?.data ?? [];

  const { data: completedBatchesData } = useGetAllBatchesQuery(
    completedCourseId ? { courseId: completedCourseId } : skipToken
  );
  const completedBatches = completedBatchesData?.data ?? [];

  const withReadableDescription = (text: string) => (
    <span className="text-foreground/50">{text}</span>
  );

  const handleSendEnrollmentReminder = async () => {
    try {
      const result = await sendEnrollmentReminder().unwrap();
      toast.success(result.message || `Enrollment reminders sent to ${result.data.count} users!`, {
        description: withReadableDescription('Emails have been queued and will be sent shortly.'),
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send enrollment reminders', {
        description: withReadableDescription(err?.data?.message || 'Please try again later.'),
      });
    }
  };

  const handleSendNewsUpdate = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Validation Error', {
        description: 'Subject and message are required.',
      });
      return;
    }

    try {
      const result = await sendNewsUpdate({ subject, message }).unwrap();
      toast.success(result.message || `News update sent to ${result.data.count} enrolled students!`, {
        description: withReadableDescription('Emails have been queued and will be sent shortly.'),
      });
      // Clear form
      setSubject('');
      setMessage('');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send news update', {
        description: withReadableDescription(err?.data?.message || 'Please try again later.'),
      });
    }
  };

  const handleSendBatchProgressReminder = async () => {
    if (!runningCourseId || !runningBatchId) {
      toast.error('Validation Error', {
        description: 'Please select both a course and a batch.',
      });
      return;
    }

    try {
      const result = await sendBatchProgressReminder({ courseId: runningCourseId, batchId: runningBatchId }).unwrap();
      toast.success(result.message || `Batch progress reminders sent to ${result.data.count} students!`, {
        description: withReadableDescription('Emails have been queued and will be sent shortly.'),
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send batch progress reminders', {
        description: withReadableDescription(err?.data?.message || 'Please try again later.'),
      });
    }
  };

  const handleSendBatchIncompleteReminder = async () => {
    if (!completedCourseId || !completedBatchId) {
      toast.error('Validation Error', {
        description: 'Please select both a course and a batch.',
      });
      return;
    }

    try {
      const result = await sendBatchIncompleteReminder({ courseId: completedCourseId, batchId: completedBatchId }).unwrap();
      toast.success(result.message || `Completion reminders sent to ${result.data.count} students!`, {
        description: withReadableDescription('Emails have been queued and will be sent shortly.'),
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send completion reminders', {
        description: withReadableDescription(err?.data?.message || 'Please try again later.'),
      });
    }
  };

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
              {
                value: 'enrollment-reminder',
                content:
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                          <UserPlus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle>Enrollment Reminder</CardTitle>
                          <CardDescription className="mt-1">
                            Send reminders to registered users who haven&apos;t enrolled yet
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium text-sm">What will be sent:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Welcome message with academy benefits</li>
                          <li>Link to browse available courses</li>
                          <li>Contact information for support</li>
                        </ul>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>Only verified, active users without enrollments</span>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleSendEnrollmentReminder}
                        disabled={isSendingReminder}
                      >
                        {isSendingReminder ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Enrollment Reminders
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
              }, {
                value: 'news-updates',
                content: <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle>News & Updates</CardTitle>
                        <CardDescription className="mt-1">
                          Send announcements to all enrolled students
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="e.g., New Course Launch, Schedule Update..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground">
                        {subject.length}/200 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Write your announcement here... (HTML supported)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={8}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        You can use HTML tags for formatting (e.g., &lt;strong&gt;, &lt;a href=&quot;&quot;&gt;, &lt;br&gt;)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Send to all students with active or completed enrollments</span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleSendNewsUpdate}
                      disabled={isSendingNews || !subject.trim() || !message.trim()}
                    >
                      {isSendingNews ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send News Update
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              }, {
                value: 'batch-progress',
                content: <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <CardTitle>Running Batch Progress Reminder</CardTitle>
                        <CardDescription className="mt-1">
                          Send reminders to students below 50% progress in a running batch
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Course *</Label>
                      <Select
                        value={runningCourseId || undefined}
                        onValueChange={(value) => {
                          setRunningCourseId(value);
                          setRunningBatchId('');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Batch *</Label>
                      <Select
                        value={runningBatchId || undefined}
                        onValueChange={(value) => setRunningBatchId(value)}
                        disabled={!runningCourseId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={runningCourseId ? 'Select batch' : 'Select course first'} />
                        </SelectTrigger>
                        <SelectContent>
                          {runningBatches.map((batch) => (
                            <SelectItem key={batch._id} value={batch._id}>
                              {batch.title} ({batch.status})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <h4 className="font-medium text-sm">Criteria:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Batch must be running</li>
                        <li>Student progress below 50%</li>
                        <li>Only verified and active users</li>
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleSendBatchProgressReminder}
                      disabled={isSendingBatchProgress || !runningCourseId || !runningBatchId}
                    >
                      {isSendingBatchProgress ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Progress Reminders
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              }, {
                value: 'batch-incomplete',
                content: <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle>Completed Batch Incomplete Reminder</CardTitle>
                        <CardDescription className="mt-1">
                          Send reminders to students who did not finish a completed batch
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Course *</Label>
                      <Select
                        value={completedCourseId || undefined}
                        onValueChange={(value) => {
                          setCompletedCourseId(value);
                          setCompletedBatchId('');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Batch *</Label>
                      <Select
                        value={completedBatchId || undefined}
                        onValueChange={(value) => setCompletedBatchId(value)}
                        disabled={!completedCourseId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={completedCourseId ? 'Select batch' : 'Select course first'} />
                        </SelectTrigger>
                        <SelectContent>
                          {completedBatches.map((batch) => (
                            <SelectItem key={batch._id} value={batch._id}>
                              {batch.title} ({batch.status})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <h4 className="font-medium text-sm">Criteria:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Batch must be completed</li>
                        <li>Progress below 100% or no learning progress</li>
                        <li>Only verified and active users</li>
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleSendBatchIncompleteReminder}
                      disabled={isSendingBatchIncomplete || !completedCourseId || !completedBatchId}
                    >
                      {isSendingBatchIncomplete ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Completion Reminders
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              }]}
          />


          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </div>
                  <p>
                    <strong className="text-foreground">Queue System:</strong> All emails are queued and sent asynchronously to ensure reliable delivery.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </div>
                  <p>
                    <strong className="text-foreground">Verified Only:</strong> Emails are only sent to users with verified email addresses.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </div>
                  <p>
                    <strong className="text-foreground">Active Users:</strong> Only active (non-suspended) users will receive emails.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </div>
                  <p>
                    <strong className="text-foreground">Retry Logic:</strong> Failed emails are automatically retried up to 3 times.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      }
    />


  );
}
