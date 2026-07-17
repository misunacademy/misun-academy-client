"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Wrench } from "lucide-react";

interface MaintenanceSettingsTabProps {
  maintenanceEnabled: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  saving: boolean;
  onMaintenanceEnabledChange: (value: boolean) => Promise<void>;
  onMaintenanceTitleChange: (value: string) => void;
  onMaintenanceMessageChange: (value: string) => void;
  onSave: () => Promise<void>;
}

export function MaintenanceSettingsTab({
  maintenanceEnabled,
  maintenanceTitle,
  maintenanceMessage,
  saving,
  onMaintenanceEnabledChange,
  onMaintenanceTitleChange,
  onMaintenanceMessageChange,
  onSave,
}: MaintenanceSettingsTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Mode
          </CardTitle>
          <CardDescription>
            When enabled, visitors are redirected to the maintenance page. Admin dashboard stays accessible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance enabled</Label>
              <p className="text-sm text-muted-foreground">Temporarily pause the public site.</p>
            </div>
            <Switch checked={maintenanceEnabled} onCheckedChange={onMaintenanceEnabledChange} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="maintenance-title">Maintenance title (Optional)</Label>
            <Input
              id="maintenance-title"
              value={maintenanceTitle}
              placeholder="We are making the site better"
              onChange={(e) => onMaintenanceTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance-message">Maintenance message (Optional)</Label>
            <Textarea
              id="maintenance-message"
              value={maintenanceMessage}
              placeholder="We will be back shortly. Thank you for your patience."
              rows={4}
              onChange={(e) => onMaintenanceMessageChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </>
  );
}
