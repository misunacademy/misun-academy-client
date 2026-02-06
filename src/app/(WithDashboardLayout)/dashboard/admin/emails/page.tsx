'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Send, Users, UserPlus, Loader2 } from 'lucide-react';
import { useSendEnrollmentReminderMutation, useSendNewsUpdateMutation } from '@/redux/api/adminApi';

export default function AdminEmailsPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [sendEnrollmentReminder, { isLoading: isSendingReminder }] = useSendEnrollmentReminderMutation();
  const [sendNewsUpdate, { isLoading: isSendingNews }] = useSendNewsUpdateMutation();

  const handleSendEnrollmentReminder = async () => {
    try {
      const result = await sendEnrollmentReminder().unwrap();
      toast.success(result.message || `Enrollment reminders sent to ${result.data.count} users!`, {
        description: 'Emails have been queued and will be sent shortly.',
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send enrollment reminders', {
        description: err?.data?.message || 'Please try again later.',
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
        description: 'Emails have been queued and will be sent shortly.',
      });
      // Clear form
      setSubject('');
      setMessage('');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send news update', {
        description: err?.data?.message || 'Please try again later.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
        <p className="text-muted-foreground mt-2">
          Send bulk emails to users and students
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enrollment Reminder Card */}
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

        {/* News & Updates Card */}
        <Card>
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
      </div>

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
    </div>
  );
}
