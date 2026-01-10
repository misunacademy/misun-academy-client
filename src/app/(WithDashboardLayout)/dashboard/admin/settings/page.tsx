"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState({
    name: "MISUN Academy",
    email: "admin@misunacademy.com",
    description: "",
    timezone: "asia-dhaka",
    currency: "bdt",
  });

  const [payment, setPayment] = useState({
    sslcommerz: true,
    taxEnabled: true,
    taxRate: "15",
    currencySymbol: "৳",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: wire up to backend settings endpoint when available
      console.debug("Saving settings", { general, payment });
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Update only the essentials for now</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>Basic academy information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="academy-name">Academy Name</Label>
                <Input
                  id="academy-name"
                  value={general.name}
                  onChange={(e) => setGeneral((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={general.email}
                  onChange={(e) => setGeneral((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your academy..."
                value={general.description}
                onChange={(e) => setGeneral((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={general.timezone}
                  onValueChange={(v) => setGeneral((prev) => ({ ...prev, timezone: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia-dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                    <SelectItem value="asia-kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={general.currency}
                  onValueChange={(v) => setGeneral((prev) => ({ ...prev, currency: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bdt">BDT (৳)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payments
            </CardTitle>
            <CardDescription>Gateway and pricing basics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SSLCommerz</Label>
                <p className="text-sm text-muted-foreground">Enable SSLCommerz gateway</p>
              </div>
              <Switch
                checked={payment.sslcommerz}
                onCheckedChange={(checked) => setPayment((p) => ({ ...p, sslcommerz: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tax Calculation</Label>
                <p className="text-sm text-muted-foreground">Automatically calculate taxes</p>
              </div>
              <Switch
                checked={payment.taxEnabled}
                onCheckedChange={(checked) => setPayment((p) => ({ ...p, taxEnabled: checked }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  value={payment.taxRate}
                  onChange={(e) => setPayment((p) => ({ ...p, taxRate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency-symbol">Currency Symbol</Label>
                <Input
                  id="currency-symbol"
                  value={payment.currencySymbol}
                  onChange={(e) => setPayment((p) => ({ ...p, currencySymbol: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}