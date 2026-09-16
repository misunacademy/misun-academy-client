import { Skeleton } from "@/components/ui/skeleton";

export default function CertificateLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-surface p-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-96" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
