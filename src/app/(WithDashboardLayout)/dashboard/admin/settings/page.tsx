"use client";

import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const AdminSettingsContent = lazy(() => import("./components/AdminSettingsContent"));

function SettingsSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Update only the essentials for now</p>
      </div>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <AdminSettingsContent />
    </Suspense>
  );
}
