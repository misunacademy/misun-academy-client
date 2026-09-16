"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CourseContentHeaderProps {
  onBack: () => void;
  onFixLegacy: () => void;
  onAddModule: () => void;
  addModuleDisabled: boolean;
}

export function CourseContentHeader({ onBack, onFixLegacy, onAddModule, addModuleDisabled }: CourseContentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex justify-center gap-4 items-center">
        <Button variant="ghost" onClick={onBack} className="mb-2">← Back to Courses</Button>
        <div>
          <h1 className="text-3xl font-bold">Course Content</h1>
          <p className="text-muted-foreground">Manage modules and lessons for this course</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onFixLegacy}>Fix Legacy Modules</Button>
        <Button onClick={onAddModule} disabled={addModuleDisabled}>
          <Plus className="h-4 w-4 mr-2" />Add Module
        </Button>
      </div>
    </div>
  );
}
