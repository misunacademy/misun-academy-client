'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Users, Send, Mail, Loader2 } from 'lucide-react';
import { useSendNewsUpdateMutation } from '@/redux/api/adminApi';

export default function NewsUpdatesCard() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendNewsUpdate, { isLoading }] = useSendNewsUpdateMutation();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Validation Error', {
        description: 'Subject and message are required.',
      });
      return;
    }

    try {
      const result = await sendNewsUpdate({ subject, message }).unwrap();
      toast.success(result.message || `News update sent to ${result.data.count} enrolled students!`, {
        description: <span className="text-foreground/50">Emails have been queued and will be sent shortly.</span>,
      });
      setSubject('');
      setMessage('');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to send news update', {
        description: <span className="text-foreground/50">{err?.data?.message || 'Please try again later.'}</span>,
      });
    }
  };

  return (
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
          <p className="text-xs text-muted-foreground">{subject.length}/200 characters</p>
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

        <Button className="w-full" onClick={handleSend} disabled={isLoading || !subject.trim() || !message.trim()}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" />Send News Update</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
