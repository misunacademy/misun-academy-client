import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AuditLogsContent from "./_components/AuditLogsContent";

export const instant = false

function AuditLogsSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Security-relevant actions across the platform</p>
      </div>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <Suspense fallback={<AuditLogsSkeleton />}>
      <AuditLogsContent />
    </Suspense>
  );
}
