"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"
import { InputField } from "@/components/forms/input-field"
import { SubmitButton } from "@/components/forms/submit-button"

interface CommunityLinksTabProps {
  onSave: () => void
}

export function CommunityLinksTab({ onSave }: CommunityLinksTabProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave() }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Group Links
          </CardTitle>
          <CardDescription>Update these links when a new batch starts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold">Misun Academy</p>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField name="maFacebookGroupLink" label="Facebook group link" placeholder="https://www.facebook.com/groups/your-group" />
              <InputField name="maWhatsappGroupLink" label="WhatsApp group link" placeholder="https://chat.whatsapp.com/your-invite-link" />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-semibold">Esun Point</p>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField name="epFacebookGroupLink" label="Facebook group link" placeholder="https://www.facebook.com/groups/your-group" />
              <InputField name="epWhatsappGroupLink" label="WhatsApp group link" placeholder="https://chat.whatsapp.com/your-invite-link" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <SubmitButton>Save Settings</SubmitButton>
      </div>
    </form>
  )
}
