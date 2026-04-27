"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Download, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useVerifyCertificateQuery } from "@/redux/api/certificateApi";
import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";

type DownloadFormat = "pdf" | "png";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


export default function VerifyCertificatePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const hasAutoDownloadedRef = useRef(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);
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
    if (!certificateRef.current) throw new Error("Certificate ref not ready");
    if (typeof document !== "undefined" && "fonts" in document) {
      await document.fonts.ready;
    }
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    return toCanvas(certificateRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "transparent",
      skipAutoScale: true,
    });
  }, []);

  const downloadCertificate = useCallback(
    async (format: DownloadFormat) => {
      if (!certificateData || !isValid) { toast.error("Only valid certificates can be downloaded"); return; }
      try {
        setIsDownloading(true);
        const canvas = await captureCertificateCanvas();
        if (format === "png") {
          const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
          if (!blob) throw new Error("PNG creation failed");
          downloadBlob(blob, `certificate-${certificateId}.png`);
          toast.success("Certificate PNG downloaded");
          return;
        }
        const pdf = new jsPDF({
          orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
          compress: true,
        });
        const imageData = canvas.toDataURL("image/png");
        pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
        pdf.save(`certificate-${certificateId}.pdf`);
        toast.success("Certificate PDF downloaded");
      } catch { toast.error("Failed to generate certificate"); }
      finally { setIsDownloading(false); }
    },
    [captureCertificateCanvas, certificateData, certificateId, isValid]
  );

  useEffect(() => { if (isError) toast.error("Unable to verify certificate."); }, [isError]);

  useEffect(() => {
    const p = searchParams.get("download");
    if (!p || hasAutoDownloadedRef.current || isLoading || !isValid || !certificateData || !isTemplateLoaded) return;
    const fmt: DownloadFormat = p.toLowerCase() === "png" ? "png" : "pdf";
    hasAutoDownloadedRef.current = true;
    const t = window.setTimeout(() => { void downloadCertificate(fmt); }, 350);
    return () => window.clearTimeout(t);
  }, [searchParams, isLoading, isValid, certificateData, downloadCertificate, isTemplateLoaded]);

  if (!certificateId) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "'Clash Display', sans-serif" }}>Invalid certificate URL</CardTitle>
            <CardDescription style={{ fontFamily: "'Clash Display', sans-serif" }}>Certificate ID is missing.</CardDescription>
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

  /* ── derived data ── */
  const toTitleCase = (str: string) =>
    str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const recipientName = toTitleCase(certificateData?.recipientName || "Student Name");
  const courseName = certificateData?.courseName || "Course Name";
  const batchName = certificateData?.batchName || "";
  const start = new Date(certificateData?.batchId?.startDate).getTime();
  const end = new Date(certificateData?.batchId?.endDate).getTime();
  const durationInDays = (end - start) / (1000 * 60 * 60 * 24);
  const duration = Math.round(durationInDays / 30);
  const startDate = formatDate(certificateData?.batchId?.startDate);
  const endDate = formatDate(certificateData?.batchId?.endDate);
  const batchLabel = batchName.replace(/\s+/g, " ").trim();

  /* ── font shorthand ── */
  const clash = "'Clash Display', sans-serif";
  const nova = "'Nova Quinta', cursive";

  const darkGreen = "#0d4a28";
  const midGreen = "#14623a";
  const lightGreen = "#1f7a4a";

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-5">

      {/* ── Status Card ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: clash }}>Certificate Verification</CardTitle>
          <CardDescription style={{ fontFamily: clash }}>
            {isValid ? "This certificate is valid." : "This certificate is invalid or not found."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {isValid
              ? <CheckCircle className="h-5 w-5 text-emerald-500" />
              : <XCircle className="h-5 w-5 text-red-500" />}
            <span style={{ fontFamily: clash, fontWeight: 500 }}>
              Status: {status || "Unknown"}
            </span>
          </div>

          {message && (
            <p style={{ fontFamily: clash }} className="text-muted-foreground">
              Message: {message}
            </p>
          )}

          {/* Uses the SVG template and injects data into the blank text slots. */}
          <div
            style={{
              width: "100%",
              aspectRatio: "842 / 595",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
            }}
          >
            <div
              ref={certificateRef}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                fontFamily: clash,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/certificate-template/misun%20academy%20certificate.svg"
                alt="MISUN Academy certificate template"
                crossOrigin="anonymous"
                onLoad={() => setIsTemplateLoaded(true)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  userSelect: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "59%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: nova,
                  fontWeight: 400,
                  fontSize: "clamp(0.9rem, 4.8vw, 2.95rem)",
                  color: lightGreen,
                  lineHeight: 3,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  maxWidth: "82%",
                  overflow: "visible",
                  padding: "0 0.12em",
                }}
              >
                {recipientName}
              </div>

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "72.9%",
                  transform: "translate(-50%, -50%)",
                  width: "78%",
                  textAlign: "center",
                  fontFamily: clash,
                  fontWeight: 600,
                  fontSize: "clamp(0.44rem, 1.55vw, 1.12rem)",
                  color: midGreen,
                  lineHeight: 1.44,
                }}
              >
                In recognition of successful completion of the course{" "}
                <strong style={{ fontWeight: 700, color: darkGreen }}>
                  &ldquo;{courseName}&rdquo;
                </strong>
                {duration ? ` of duration ${duration} Months` : ""}
                {" "}conducted by{" "}
                <strong style={{ fontWeight: 700, color: darkGreen }}>MISUN Academy</strong>
                {startDate !== "N/A" ? ` from ${startDate}` : ""}
                {endDate !== "N/A" ? ` to ${endDate}.` : "."}
              </div>

              {batchLabel && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "81.1%",
                    transform: "translate(-50%, -50%)",
                    fontFamily: clash,
                    fontWeight: 600,
                    fontSize: "clamp(0.34rem, 0.95vw, 0.86rem)",
                    color: darkGreen,
                    letterSpacing: "0.01em",
                  }}
                >
                  Batch: {batchLabel}
                </div>
              )}
              </div>
            </div>

          </div>{/* end certificate */}

          {/* ── Action buttons ── */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary" size="sm"
              onClick={() => refetch()}
              style={{ fontFamily: clash }}
            >
              <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
            </Button>

            {isValid && certificateData && (
              <>
                <Button
                  variant="default" size="sm"
                  onClick={() => void downloadCertificate("pdf")}
                  disabled={isDownloading || !isTemplateLoaded}
                  style={{ fontFamily: clash }}
                >
                  {isDownloading
                    ? <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    : <Download className="h-4 w-4 mr-1" />}
                  Download PDF
                </Button>

                <Button
                  variant="outline" size="sm"
                  onClick={() => void downloadCertificate("png")}
                  disabled={isDownloading || !isTemplateLoaded}
                  style={{ fontFamily: clash }}
                >
                  {isDownloading
                    ? <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    : <Download className="h-4 w-4 mr-1" />}
                  Download PNG
                </Button>
              </>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
