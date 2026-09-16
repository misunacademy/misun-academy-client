import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ExternalLink } from "lucide-react";
import CertificateStatusBadge, { normalizeStatus } from "@/components/shared/CertificateStatusBadge";
import type { CertificateResponse } from "@/redux/api/certificateApi";

interface CertificateHistoryListProps {
  certificates: CertificateResponse[];
  getCourseTitle: (c: CertificateResponse) => string;
  getBatchTitle: (c: CertificateResponse) => string;
}

export default function CertificateHistoryList({ certificates, getCourseTitle, getBatchTitle }: CertificateHistoryListProps) {
  return (
    <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Certificate Requests & History
        </CardTitle>
        <CardDescription className="text-white/50">All your pending, approved, and revoked certificates.</CardDescription>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <p className="text-white/50">No certificates found yet.</p>
        ) : (
          <div className="space-y-3">
            {certificates.map((certificate) => {
              const normalizedStatus = normalizeStatus(certificate.status);

              return (
                <div key={certificate._id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{getCourseTitle(certificate)}</h3>
                      <p className="text-sm text-white/50">{getBatchTitle(certificate)}</p>
                      <p className="text-xs text-white/40 mt-1">
                        Certificate ID: {certificate.certificateId}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <CertificateStatusBadge status={certificate.status} />

                      {certificate.status === 'active' && (
                        <Button asChild size="sm" variant="outline" className="border-white/15 bg-white/[0.02] text-white/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40">
                          <a href={`/verify-certificate/${certificate.certificateId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            view
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {normalizedStatus === "rejected" ? (
                    <p className="text-xs text-red-400 mt-2">
                      Reason: {certificate.rejectionReason || certificate.revokedReason || "Not provided"}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
