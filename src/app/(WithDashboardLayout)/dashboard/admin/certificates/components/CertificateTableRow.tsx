import type { ReactNode } from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { CertificateResponse } from "@/redux/api/certificateApi";

interface CertificateTableRowProps {
  certificate: CertificateResponse;
  getStudentName: (cert: CertificateResponse) => string;
  getStudentEmail: (cert: CertificateResponse) => string;
  getCourseTitle: (cert: CertificateResponse) => string;
  getBatchTitle: (cert: CertificateResponse) => string;
  getStatusBadge: (status: string) => ReactNode;
  onViewDetails: (cert: CertificateResponse) => void;
}

const CertificateTableRow = ({
  certificate,
  getStudentName,
  getStudentEmail,
  getCourseTitle,
  getBatchTitle,
  getStatusBadge,
  onViewDetails,
}: CertificateTableRowProps) => {
  return (
    <>
      <TableCell className="font-medium">
        {getStudentName(certificate)}
        <div className="text-xs text-muted-foreground">{getStudentEmail(certificate)}</div>
      </TableCell>
      <TableCell>{getCourseTitle(certificate)}</TableCell>
      <TableCell>{getBatchTitle(certificate)}</TableCell>
      <TableCell>{new Date(certificate.createdAt).toLocaleDateString("en-US")}</TableCell>
      <TableCell>{getStatusBadge(certificate.status)}</TableCell>
      <TableCell>
        <Button size="sm" variant="outline" onClick={() => onViewDetails(certificate)}>
          <Eye className="mr-1 h-4 w-4" />
          Details
        </Button>
      </TableCell>
    </>
  );
};

export default CertificateTableRow;
