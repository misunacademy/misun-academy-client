import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-[250px]" />
          <Skeleton className="mx-auto h-4 w-[350px]" />
        </div>
        <div className="space-y-4 rounded-xl border p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="mx-auto h-10 w-40" />
      </div>
    </div>
  );
}
