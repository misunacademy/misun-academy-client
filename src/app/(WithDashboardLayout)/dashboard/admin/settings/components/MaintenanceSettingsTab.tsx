"use client"

import { Controller, useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Wrench } from "lucide-react"
import { InputField } from "@/components/forms/input-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { SubmitButton } from "@/components/forms/submit-button"

interface MaintenanceSettingsTabProps {
  onMaintenanceEnabledChange: (value: boolean) => Promise<void>
  onSave: () => void
}

export function MaintenanceSettingsTab({ onMaintenanceEnabledChange, onSave }: MaintenanceSettingsTabProps) {
  const { control } = useFormContext()

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave() }}>
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
          <Controller
            name="maintenanceEnabled"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-enabled">Maintenance enabled</Label>
                  <p className="text-sm text-muted-foreground">Temporarily pause the public site.</p>
                </div>
                <Switch
                  id="maintenance-enabled"
                  checked={!!field.value}
                  onCheckedChange={onMaintenanceEnabledChange}
                />
              </div>
            )}
          />

          <Separator />

          <InputField name="maintenanceTitle" label="Maintenance title (Optional)" placeholder="We are making the site better" />

          <TextareaField name="maintenanceMessage" label="Maintenance message (Optional)" placeholder="We will be back shortly. Thank you for your patience." rows={4} />
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <SubmitButton>Save Settings</SubmitButton>
      </div>
    </form>
  )
}
