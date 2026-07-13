import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";

interface CertificateStatsCardsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export default function CertificateStatsCards({ pendingCount, approvedCount, rejectedCount }: CertificateStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardDescription className="text-white/50">Pending</CardDescription>
          <CardTitle className="text-3xl text-white">{pendingCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardDescription className="text-white/50">Approved</CardDescription>
          <CardTitle className="text-3xl text-emerald-400">{approvedCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardDescription className="text-white/50">Rejected</CardDescription>
          <CardTitle className="text-3xl text-red-400">{rejectedCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
