import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CertificateStatsCardsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

const CertificateStatsCards = ({
  pendingCount,
  approvedCount,
  rejectedCount,
}: CertificateStatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Pending</CardDescription>
          <CardTitle className="text-3xl">{pendingCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Approved</CardDescription>
          <CardTitle className="text-3xl text-green-600">{approvedCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Rejected</CardDescription>
          <CardTitle className="text-3xl text-red-600">{rejectedCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CertificateStatsCards;
