'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserPlus, Send, Mail, Loader2 } from 'lucide-react';
import { useSendEnrollmentReminderMutation } from '@/redux/api/adminApi';

export default function EnrollmentReminderCard() {
  const [sendEnrollmentReminder, { isLoading }] = useSendEnrollmentReminderMutation();

  const handleSend = async () => {
    try {
      const result = await sendEnrollmentReminder().unwrap();
      toast.success(result.message || `Enrollment reminders sent to ${result.data.count} users!`, {
        description: <span className="text-foreground/50">Emails have been queued and will be sent shortly.</span>,
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send enrollment reminders', {
        description: <span className="text-foreground/50">{err?.data?.message || 'Please try again later.'}</span>,
      });
    }
  };

  return (
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

        <Button className="w-full" onClick={handleSend} disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" />Send Enrollment Reminders</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
