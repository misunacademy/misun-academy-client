import { Badge } from "@/components/ui/badge";
import { FileCheck, Ban, Clock } from "lucide-react";

export function normalizeStatus(status?: string) {
    const value = (status || "").toLowerCase();
    if (value === "active" || value === "approved") return "approved";
    if (value === "revoked" || value === "rejected") return "rejected";
    return "pending";
}

export default function CertificateStatusBadge({ status }: { status?: string }) {
    const normalized = normalizeStatus(status);

    if (normalized === "approved") {
        return (
            <Badge variant="default" className="flex items-center gap-1 w-fit">
                <FileCheck className="h-3 w-3" />
                Approved
            </Badge>
        );
    }

    if (normalized === "rejected") {
        return (
            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                <Ban className="h-3 w-3" />
                Rejected
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" />
            Pending
        </Badge>
    );
}
