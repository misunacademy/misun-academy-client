import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmailDeliveryInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Delivery Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground">
          <InfoRow text={<><strong className="text-foreground">Queue System:</strong> All emails are queued and sent asynchronously to ensure reliable delivery.</>} />
          <InfoRow text={<><strong className="text-foreground">Verified Only:</strong> Emails are only sent to users with verified email addresses.</>} />
          <InfoRow text={<><strong className="text-foreground">Active Users:</strong> Only active (non-suspended) users will receive emails.</>} />
          <InfoRow text={<><strong className="text-foreground">Retry Logic:</strong> Failed emails are automatically retried up to 3 times.</>} />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ text }: { text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      </div>
      <p>{text}</p>
    </div>
  );
}
