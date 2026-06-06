import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BatchOption {
  _id: string;
  title: string;
  status?: string;
  courseTitle?: string;
}

interface StudentsFiltersCardProps {
  search: string;
  batchId: string;
  statusFilter: string;
  batches: BatchOption[];
  onSearchChange: (value: string) => void;
  onBatchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const StudentsFiltersCard = ({
  search,
  batchId,
  statusFilter,
  batches,
  onSearchChange,
  onBatchChange,
  onStatusChange,
}: StudentsFiltersCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full sm:max-w-sm"
        />
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Select value={batchId} onValueChange={onBatchChange}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filter by batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {(batch.courseTitle ? `${batch.courseTitle} - ` : "") + batch.title} - {batch.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentsFiltersCard;
