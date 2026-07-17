"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

interface CommunityLinksTabProps {
  maFacebookGroupLink: string;
  maWhatsappGroupLink: string;
  epFacebookGroupLink: string;
  epWhatsappGroupLink: string;
  saving: boolean;
  onMaFacebookGroupLinkChange: (value: string) => void;
  onMaWhatsappGroupLinkChange: (value: string) => void;
  onEpFacebookGroupLinkChange: (value: string) => void;
  onEpWhatsappGroupLinkChange: (value: string) => void;
  onSave: () => Promise<void>;
}

export function CommunityLinksTab({
  maFacebookGroupLink,
  maWhatsappGroupLink,
  epFacebookGroupLink,
  epWhatsappGroupLink,
  saving,
  onMaFacebookGroupLinkChange,
  onMaWhatsappGroupLinkChange,
  onEpFacebookGroupLinkChange,
  onEpWhatsappGroupLinkChange,
  onSave,
}: CommunityLinksTabProps) {
  return (
    <>
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
              <div className="space-y-2">
                <Label htmlFor="ma-facebook-group-link">Facebook group link</Label>
                <Input
                  id="ma-facebook-group-link"
                  value={maFacebookGroupLink}
                  placeholder="https://www.facebook.com/groups/your-group"
                  onChange={(e) => onMaFacebookGroupLinkChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ma-whatsapp-group-link">WhatsApp group link</Label>
                <Input
                  id="ma-whatsapp-group-link"
                  value={maWhatsappGroupLink}
                  placeholder="https://chat.whatsapp.com/your-invite-link"
                  onChange={(e) => onMaWhatsappGroupLinkChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-semibold">Esun Point</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ep-facebook-group-link">Facebook group link</Label>
                <Input
                  id="ep-facebook-group-link"
                  value={epFacebookGroupLink}
                  placeholder="https://www.facebook.com/groups/your-group"
                  onChange={(e) => onEpFacebookGroupLinkChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ep-whatsapp-group-link">WhatsApp group link</Label>
                <Input
                  id="ep-whatsapp-group-link"
                  value={epWhatsappGroupLink}
                  placeholder="https://chat.whatsapp.com/your-invite-link"
                  onChange={(e) => onEpWhatsappGroupLinkChange(e.target.value)}
                />
              </div>
            </div>
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
