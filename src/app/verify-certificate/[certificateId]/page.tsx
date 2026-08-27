"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from 'boneyard-js/react'
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useVerifyCertificateQuery } from "@/redux/api/certificateApi";
import CertificateDisplay from "./_components/CertificateDisplay";
import CertificateActions from "./_components/CertificateActions";

type DownloadFormat = "pdf" | "png";

const clash = "'Clash Display', sans-serif";

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

function VerifyCertificateContent() {
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

    const downloadCertificate = useCallback(
        async (format: DownloadFormat) => {
            if (!certificateData || !isValid) { toast.error("Only valid certificates can be downloaded"); return; }
            try {
                setIsDownloading(true);
                if (!certificateRef.current) throw new Error("Certificate ref not ready");
                if (typeof document !== "undefined" && "fonts" in document) {
                    await document.fonts.ready;
                }
                await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

                const { toCanvas } = await import("html-to-image");
                const canvas = await toCanvas(certificateRef.current, {
                    cacheBust: true, pixelRatio: 3, backgroundColor: "transparent", skipAutoScale: true,
                });

                if (format === "png") {
                    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
                    if (!blob) throw new Error("PNG creation failed");
                    downloadBlob(blob, `certificate-${certificateId}.png`);
                    toast.success("Certificate PNG downloaded");
                    return;
                }
                const { default: jsPDF } = await import("jspdf");
                const pdf = new jsPDF({
                    orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
                    unit: "px", format: [canvas.width, canvas.height], compress: true,
                });
                pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
                pdf.save(`certificate-${certificateId}.pdf`);
                toast.success("Certificate PDF downloaded");
            } catch { toast.error("Failed to generate certificate"); }
            finally { setIsDownloading(false); }
        },
        [certificateData, certificateId, isValid]
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
                        <CardTitle style={{ fontFamily: clash }}>Invalid certificate URL</CardTitle>
                        <CardDescription style={{ fontFamily: clash }}>Certificate ID is missing.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <Skeleton name="VerifyCertificatePage" loading={isLoading}>
        <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-5">
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

                    <CertificateDisplay
                        certificateData={certificateData}
                        onLoad={() => setIsTemplateLoaded(true)}
                        certificateRef={certificateRef}
                    />

                    <CertificateActions
                        isValid={!!isValid}
                        isDownloading={isDownloading}
                        isTemplateLoaded={isTemplateLoaded}
                        onRefresh={() => refetch()}
                        onDownloadPdf={() => void downloadCertificate("pdf")}
                        onDownloadPng={() => void downloadCertificate("png")}
                    />
                </CardContent>
            </Card>
        </div>
        </Skeleton>
    );
}

export default function VerifyCertificatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
            <VerifyCertificateContent />
        </Suspense>
    );
}
