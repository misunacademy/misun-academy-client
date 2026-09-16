import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import type { EnrollmentResponse } from "@/redux/api/enrollmentApi";

interface CertificateRequestListProps {
  requestableEnrollments: (EnrollmentResponse & { isCertificateAvailable?: boolean })[];
  isRequesting: boolean;
  onRequest: (enrollmentId: string) => void;
}

export default function CertificateRequestList({ requestableEnrollments, isRequesting, onRequest }: CertificateRequestListProps) {
  return (
    <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white">Request Certificates</CardTitle>
        <CardDescription className="text-white/50">
          Completed enrollments without a certificate request can be submitted from here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {requestableEnrollments.length === 0 ? (
          <p className="text-sm text-white/50">No eligible enrollment found for new certificate request.</p>
        ) : (
          requestableEnrollments.map((enrollment) => (
            <div key={enrollment._id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div>
                <p className="font-medium text-white">{enrollment.batchId?.courseId?.title || "Course"}</p>
                <p className="text-xs text-white/50">{enrollment.batchId?.title || "Batch"}</p>
              </div>
              <Button
                onClick={() => onRequest(enrollment._id)}
                disabled={isRequesting}
                size="sm"
                className="bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark text-white hover:from-emerald-deep hover:via-emerald-bright hover:to-emerald-deep"
              >
                {isRequesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                Request
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
