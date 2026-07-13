import { useRef } from "react";
import Image from "next/image";

const clash = "'Clash Display', sans-serif";
const nova = "'Nova Quinta', cursive";
const darkGreen = "#0d4a28";
const midGreen = "#14623a";
const lightGreen = "#1f7a4a";

function formatDate(dateStr?: string) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" });
}

interface CertificateDisplayProps {
    certificateData?: {
        recipientName?: string;
        courseName?: string;
        batchName?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        batchId?: any;
    } | null;
    onLoad: () => void;
    certificateRef: React.RefObject<HTMLDivElement | null>;
}

export default function CertificateDisplay({ certificateData, onLoad, certificateRef }: CertificateDisplayProps) {
    if (!certificateData) return null;
    const recipientName = toTitleCase(certificateData?.recipientName || "Student Name");
    const courseName = certificateData?.courseName || "Course Name";
    const batchName = certificateData?.batchName || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const batchData = certificateData?.batchId as any;
    const start = new Date(batchData?.startDate).getTime();
    const end = new Date(batchData?.endDate).getTime();
    const durationInDays = (end - start) / (1000 * 60 * 60 * 24);
    const duration = Math.round(durationInDays / 30);
    const startDate = formatDate(batchData?.startDate);
    const endDate = formatDate(batchData?.endDate);
    const batchLabel = (batchName || "").replace(/\s+/g, " ").trim();

    return (
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
                <Image
                    src="/certificate-template/misun%20academy%20certificate.svg"
                    alt="MISUN Academy certificate template"
                    crossOrigin="anonymous"
                    onLoad={onLoad}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover", userSelect: "none" }}
                    unoptimized
                />

                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
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
                            Batch: {batchLabel.split(" ")[1]}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function toTitleCase(str: string) {
    return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
