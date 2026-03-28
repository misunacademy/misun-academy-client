"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Download, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useVerifyCertificateQuery } from "@/redux/api/certificateApi";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

type DownloadFormat = "pdf" | "png";

const formatIssuedDate = (issuedDate?: string) => {
  if (!issuedDate) return "N/A";
  const parsed = new Date(issuedDate);
  if (Number.isNaN(parsed.getTime())) return issuedDate;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function VerifyCertificatePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const hasAutoDownloadedRef = useRef(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { certificateId: rawCertificateId } = useParams();
  const searchParams = useSearchParams();
  const certificateId = Array.isArray(rawCertificateId) ? rawCertificateId[0] : rawCertificateId || "";
  const { data, isLoading, isError, refetch } = useVerifyCertificateQuery(certificateId, {
    skip: !certificateId,
  });

  const certificateData = data?.data?.certificate;
  const isValid = data?.data?.isValid;
  const status = data?.data?.status;
  const message = data?.data?.reason;

  const captureCertificateCanvas = useCallback(async () => {
    if (!certificateRef.current) {
      throw new Error("Certificate preview is not ready yet");
    }

    return html2canvas(certificateRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
  }, []);

  const downloadCertificate = useCallback(
    async (format: DownloadFormat) => {
      if (!certificateData || !isValid) {
        toast.error("Only valid certificates can be downloaded");
        return;
      }

      try {
        setIsDownloading(true);
        const canvas = await captureCertificateCanvas();

        if (format === "png") {
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
          if (!blob) {
            throw new Error("Could not create PNG file");
          }

          downloadBlob(blob, `certificate-${certificateId}.png`);
          toast.success("Certificate PNG downloaded");
          return;
        }

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });
        const imageData = canvas.toDataURL("image/png");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 8;
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;

        const imageRatio = canvas.width / canvas.height;
        let renderWidth = maxWidth;
        let renderHeight = renderWidth / imageRatio;

        if (renderHeight > maxHeight) {
          renderHeight = maxHeight;
          renderWidth = renderHeight * imageRatio;
        }

        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        pdf.addImage(imageData, "PNG", x, y, renderWidth, renderHeight);
        pdf.save(`certificate-${certificateId}.pdf`);
        toast.success("Certificate PDF downloaded");
      } catch {
        toast.error("Failed to generate certificate file");
      } finally {
        setIsDownloading(false);
      }
    },
    [captureCertificateCanvas, certificateData, certificateId, isValid]
  );

  useEffect(() => {
    if (isError) {
      toast.error("Unable to verify certificate. Please try again.");
    }
  }, [isError]);

  useEffect(() => {
    const autoDownloadParam = searchParams.get("download");
    if (!autoDownloadParam || hasAutoDownloadedRef.current || isLoading || !isValid || !certificateData) {
      return;
    }

    const format: DownloadFormat = autoDownloadParam.toLowerCase() === "png" ? "png" : "pdf";
    hasAutoDownloadedRef.current = true;

    const timer = window.setTimeout(() => {
      void downloadCertificate(format);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchParams, isLoading, isValid, certificateData, downloadCertificate]);

  if (!certificateId) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Invalid certificate URL</CardTitle>
            <CardDescription>Certificate ID is missing in the URL.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <CardDescription>
            {isValid ? "This certificate is valid." : "This certificate is invalid or not found."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {isValid ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            <span className="font-medium">Status: {status || "Unknown"}</span>
          </div>

          {message ? <p className="text-muted-foreground">Message: {message}</p> : null}

          <div
            ref={certificateRef}
            className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-teal-100 p-8 md:p-10 shadow-sm"
          >
            <div className="text-center space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-800 font-semibold">Misun Academy</p>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950">Certificate of Completion</h2>
              <p className="text-emerald-900/80">This certifies that</p>

              <p className="text-2xl md:text-3xl font-extrabold text-emerald-900">
                {certificateData?.recipientName || "Student"}
              </p>

              <p className="text-emerald-900/80">has successfully completed the course</p>

              <p className="text-xl md:text-2xl font-bold text-emerald-900">
                {certificateData?.courseName || "Course"}
              </p>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-white/70 border border-emerald-200 p-3">
                  <p className="text-emerald-700 text-xs">Certificate ID</p>
                  <p className="font-semibold text-emerald-950 break-all">{certificateData?.certificateId || "N/A"}</p>
                </div>
                <div className="rounded-lg bg-white/70 border border-emerald-200 p-3">
                  <p className="text-emerald-700 text-xs">Batch</p>
                  <p className="font-semibold text-emerald-950">{certificateData?.batchName || "N/A"}</p>
                </div>
                <div className="rounded-lg bg-white/70 border border-emerald-200 p-3">
                  <p className="text-emerald-700 text-xs">Issued Date</p>
                  <p className="font-semibold text-emerald-950">{formatIssuedDate(certificateData?.issuedDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
            </Button>

            {isValid && certificateData ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => void downloadCertificate("pdf")}
                disabled={isDownloading}
              >
                {isDownloading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                Download PDF
              </Button>
            ) : null}

            {isValid && certificateData ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void downloadCertificate("png")}
                disabled={isDownloading}
              >
                {isDownloading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                Download PNG
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
