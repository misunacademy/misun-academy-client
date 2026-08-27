import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/common";

const PaymentStatusBadge = memo(({ status }: { status: PaymentStatus }) => {
    if (status === "success") return <Badge variant="secondary">Paid</Badge>;
    if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
    return <Badge>Pending</Badge>;
});
PaymentStatusBadge.displayName = "PaymentStatusBadge";
export { PaymentStatusBadge };
