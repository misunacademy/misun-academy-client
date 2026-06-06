import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface RecordingFilters {
  batchId?: string;
  isPublished?: boolean;
}

interface RecordingFiltersCardProps {
  filters: RecordingFilters;
  batches: Array<{ _id: string; title: string; status?: string; courseTitle?: string }>;
  onFiltersChange: (filters: RecordingFilters) => void;
  onPageReset: () => void;
}

const RecordingFiltersCard = ({ filters, batches, onFiltersChange, onPageReset }: RecordingFiltersCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 justify-end">
        <Select
          value={filters.batchId || "all"}
          onValueChange={(value) => {
            onFiltersChange({ ...filters, batchId: value === "all" ? undefined : value });
            onPageReset();
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Batches" />
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

        <Select
          value={filters.isPublished === undefined ? "all" : filters.isPublished ? "published" : "unpublished"}
          onValueChange={(value) => {
            onFiltersChange({
              ...filters,
              isPublished: value === "all" ? undefined : value === "published",
            });
            onPageReset();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Draft</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default RecordingFiltersCard;
