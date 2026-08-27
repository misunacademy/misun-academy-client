import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { PaymentResponse } from "@/redux/api/paymentApi";

interface GatewayResponse { senderNumber?: string; phonePeTransactionId?: string; card_issuer?: string; bank_tran_id?: string }

export function usePaymentColumns(
  openDialog: boolean,
  selectedTransactionId: string | null,
  selectedStatus: string | null,
  setSelectedStatus: (s: string | null) => void,
  setSelectedTransactionId: (s: string | null) => void,
  setOpenDialog: (o: boolean) => void,
  handleConfirmStatusChange: () => Promise<void>,
): ColumnDef<PaymentResponse>[] {
  return [
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => row.original.transactionId,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `${row.original.amount.toFixed(2)}`,
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => row.original.method,
    },
    {
      accessorFn: (row) => row.student?.name,
      id: "student.name",
      header: "Student",
      cell: ({ row }) => (
        <div>
          <p>{row.original.student?.name || "N/A"}</p>
          <p className="text-[12px]">{row.original.student?.email || "N/A"}</p>
        </div>
      ),
    },
    {
      accessorFn: (row) => row.course?.title,
      id: "course.title",
      header: "Course",
      cell: ({ row }) => <div><p className="font-medium">{row.original.course?.title || "N/A"}</p></div>,
    },
    {
      accessorFn: (row) => row.batch?.title,
      id: "batch.title",
      header: "Batch",
      cell: ({ row }) => <div><p className="font-medium">{row.original.batch?.title || "N/A"}</p></div>,
    },
    {
      accessorFn: (row) => row.gatewayResponse,
      id: "gatewayResponse",
      header: "Payment Info",
      cell: ({ row }) => {
        const gw = row.original.gatewayResponse as GatewayResponse | null | undefined;
        return (
          <div>
            {row.original.method === "PhonePay" && gw && (
              <div><p className="text-[12px] font-bold">{gw.senderNumber}</p><p>{gw.phonePeTransactionId}</p></div>
            )}
            {row.original.method === "SSLCommerz" && gw && (
              <div><p className="text-[12px] font-bold">{gw.card_issuer}</p><p>{gw.bank_tran_id}</p></div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Payment Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const transactionId = row.original.transactionId;
        const handleStatusChange = (newStatus: string) => {
          if (newStatus !== status) {
            setSelectedStatus(newStatus);
            setSelectedTransactionId(transactionId);
            setOpenDialog(true);
          }
        };
        return (
          <>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[120px]">
                <Badge
                  variant={status === "success" ? "default" : status === "failed" ? "destructive" : status === "pending" ? "secondary" : "outline"}
                  className="capitalize w-full justify-center"
                >
                  {status}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                {row.original.method === "PhonePay" && status === "review" ? (
                  <>
                    <SelectItem value="success">Approve</SelectItem>
                    <SelectItem value="failed">Reject</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <AlertDialog open={openDialog && selectedTransactionId === transactionId} onOpenChange={setOpenDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update the status to{" "}
                    <span className="capitalize font-semibold">{selectedStatus}</span>?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenDialog(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];
}
