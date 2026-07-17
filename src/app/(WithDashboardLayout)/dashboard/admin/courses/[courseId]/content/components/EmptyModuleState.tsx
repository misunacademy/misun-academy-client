"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Plus } from "lucide-react";

interface EmptyModuleStateProps {
  variant: "no-batch" | "no-modules";
  onCreateModule?: () => void;
}

export function EmptyModuleState({ variant, onCreateModule }: EmptyModuleStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        {variant === "no-batch" ? (
          <p className="text-muted-foreground">Select a batch to manage modules.</p>
        ) : (
          <>
            <p className="text-muted-foreground">No modules yet. Create your first module to get started.</p>
            {onCreateModule && (
              <Button onClick={onCreateModule} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />Create First Module
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
