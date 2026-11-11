"use client";

import { useState } from "react";
import { Plus, Gift, FileText, Layers } from "lucide-react";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerkRulesTable from "./_components/PerkRulesTable";
import PerkGrantLogsTable from "./_components/PerkGrantLogsTable";
import PerkRuleDialog from "./_components/PerkRuleDialog";
import { EnrollmentPerkRule } from "@/redux/api/enrollmentPerkApi";

export default function EnrollmentPerksPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EnrollmentPerkRule | null>(null);

  const handleCreateNew = () => {
    setEditingRule(null);
    setDialogOpen(true);
  };

  const handleEditRule = (rule: EnrollmentPerkRule) => {
    setEditingRule(rule);
    setDialogOpen(true);
  };

  return (
    <>
      <DashboardPageContainer
        heading={
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Enrollment Perks</h1>
              <p className="text-sm text-muted-foreground">
                Configure special benefits and bonus courses granted automatically when students enroll.
              </p>
            </div>
          </div>
        }
        buttons={
          <Button onClick={handleCreateNew} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Create Perk Rule
          </Button>
        }
        content={
          <Tabs defaultValue="rules" className="space-y-6">
            <TabsList className="bg-card border p-1 rounded-xl">
              <TabsTrigger value="rules" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Layers className="w-4 h-4" />
                Perk Rules
              </TabsTrigger>
              <TabsTrigger value="logs" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <FileText className="w-4 h-4" />
                Grant Audit Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="m-0 focus-visible:outline-none">
              <PerkRulesTable onEditRule={handleEditRule} />
            </TabsContent>

            <TabsContent value="logs" className="m-0 focus-visible:outline-none">
              <PerkGrantLogsTable />
            </TabsContent>
          </Tabs>
        }
      />

      <PerkRuleDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingRule(null);
        }}
        editingRule={editingRule}
      />
    </>
  );
}
