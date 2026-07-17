"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Batch {
  _id: string;
  title: string;
  status: string;
}

interface BatchSelectorProps {
  batches: Batch[];
  selectedBatchId: string;
  onChange: (batchId: string) => void;
}

export function BatchSelector({ batches, selectedBatchId, onChange }: BatchSelectorProps) {
  return (
    <div className="flex items-center gap-3 justify-end">
      <Label className="text-sm text-muted-foreground">Batch</Label>
      <Select value={selectedBatchId} onValueChange={onChange}>
        <SelectTrigger className="w-[260px]">
          <SelectValue placeholder="Select a batch" />
        </SelectTrigger>
        <SelectContent>
          {batches.map((batch) => (
            <SelectItem key={batch._id} value={batch._id}>
              {batch.title} - {batch.status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
