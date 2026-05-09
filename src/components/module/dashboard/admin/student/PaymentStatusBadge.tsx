import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/common";

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
    if (status === "success") return <Badge variant="secondary">Paid</Badge>;
    if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
    return <Badge>Pending</Badge>;
};
