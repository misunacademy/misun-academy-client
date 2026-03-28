import { jsPDF } from "jspdf";
import type { VerifiedCertificate } from "@/redux/api/certificateApi";

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

const centerText = (pdf: jsPDF, text: string, y: number) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const textWidth = pdf.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;
  pdf.text(text, x, y);
};

export const downloadCertificatePdf = (certificate: VerifiedCertificate) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFillColor(244, 253, 248);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  pdf.setDrawColor(20, 108, 67);
  pdf.setLineWidth(1.2);
  pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(20, 108, 67);
  pdf.setFontSize(16);
  centerText(pdf, "MISUN ACADEMY", 28);

  pdf.setFontSize(30);
  centerText(pdf, "Certificate of Completion", 46);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(52, 52, 52);
  pdf.setFontSize(14);
  centerText(pdf, "This certifies that", 60);

  pdf.setFont("times", "bold");
  pdf.setTextColor(10, 56, 35);
  pdf.setFontSize(28);
  centerText(pdf, certificate.recipientName || "Student", 76);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(52, 52, 52);
  pdf.setFontSize(14);
  centerText(pdf, "has successfully completed the course", 89);

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(10, 56, 35);
  pdf.setFontSize(20);
  centerText(pdf, certificate.courseName || "Course", 101);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(52, 52, 52);
  pdf.setFontSize(12);
  centerText(pdf, `Certificate ID: ${certificate.certificateId}`, 118);
  centerText(pdf, `Batch: ${certificate.batchName || "N/A"}`, 126);
  centerText(pdf, `Issued Date: ${formatIssuedDate(certificate.issuedDate)}`, 134);

  pdf.save(`certificate-${certificate.certificateId}.pdf`);
};
