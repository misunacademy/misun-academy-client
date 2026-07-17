'use client';

import { useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import { useSendBatchIncompleteReminderMutation } from '@/redux/api/adminApi';
import { useGetAllBatchesQuery } from '@/redux/api/batchApi';
import type { CourseResponse } from '@/redux/api/courseApi';

export default function BatchIncompleteReminderCard({ courses }: { courses: CourseResponse[] }) {
  const [courseId, setCourseId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [sendReminder, { isLoading }] = useSendBatchIncompleteReminderMutation();

  const { data: batchesData } = useGetAllBatchesQuery(
    courseId ? { courseId } : skipToken
  );
  const batches = batchesData?.data ?? [];

  const handleSend = async () => {
    if (!courseId || !batchId) {
      toast.error('Validation Error', {
        description: 'Please select both a course and a batch.',
      });
      return;
    }

    try {
      const result = await sendReminder({ courseId, batchId }).unwrap();
      toast.success(result.message || `Completion reminders sent to ${result.data.count} students!`, {
        description: <span className="text-foreground/50">Emails have been queued and will be sent shortly.</span>,
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send completion reminders', {
        description: <span className="text-foreground/50">{err?.data?.message || 'Please try again later.'}</span>,
      });
    }
  };

  return (
    <Card>
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
            value={courseId || undefined}
            onValueChange={(value) => {
              setCourseId(value);
              setBatchId('');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">No courses available</div>
              ) : (
                courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Batch *</Label>
          <Select
            value={batchId || undefined}
            onValueChange={(value) => setBatchId(value)}
            disabled={!courseId}
          >
            <SelectTrigger>
              <SelectValue placeholder={courseId ? 'Select batch' : 'Select course first'} />
            </SelectTrigger>
            <SelectContent>
              {batches.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">No batches available</div>
              ) : (
                batches.map((batch) => (
                  <SelectItem key={batch._id} value={batch._id}>
                    {batch.title} ({batch.status})
                  </SelectItem>
                ))
              )}
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

        <Button className="w-full" onClick={handleSend} disabled={isLoading || !courseId || !batchId}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" />Send Completion Reminders</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
